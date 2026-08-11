"""MCP memory server — the single guarded door where all state lives.

Runs in two modes off the same database:
  stdio (default)      — used by the agent runner on the VPS
  --http               — Streamable HTTP endpoint, connectable from the
                         Claude app as a custom connector (Phase A interface)

Usage:
  python -m memory.server            # stdio, for runner/run_agent.py
  python -m memory.server --http     # http://0.0.0.0:8747/mcp
"""

import json
import sys

try:  # mcp >= 2.0
    from mcp.server import MCPServer
    mcp = MCPServer("cos-memory")
    _HTTP_KWARGS = {"host": "0.0.0.0", "port": 8747}
except ImportError:  # mcp 1.x
    from mcp.server.fastmcp import FastMCP
    mcp = FastMCP("cos-memory", host="0.0.0.0", port=8747)
    _HTTP_KWARGS = {}

from memory import db


def _dump(obj) -> str:
    return json.dumps(obj, indent=2, default=str)


# ---------------------------------------------------------------- entities

@mcp.tool()
def upsert_entity(name: str, kind: str, workstream: str, cadence: str = "daily", attrs_json: str = "{}") -> str:
    """Create or update an entity (company, partner_fund, fund, personal_holding, project, admin_item).

    kind: company | partner_fund | fund | personal_holding | project | admin_item
    workstream: invest | personal | build | admin
    cadence: daily | monthly | quarterly
    attrs_json: JSON object merged into existing attrs (stage, thesis, ownership, cost, fmv,
    arr, runway, nav, moic, due_date, status notes, ...). Existing keys not present are kept.
    """
    attrs = json.loads(attrs_json)
    with db.connect() as conn:
        eid = db.entity_id_by_name(conn, name)
        if eid:
            row = conn.execute("SELECT attrs FROM entities WHERE id = ?", (eid,)).fetchone()
            merged = {**json.loads(row["attrs"]), **attrs}
            conn.execute(
                "UPDATE entities SET kind=?, workstream=?, cadence=?, attrs=?, updated_at=? WHERE id=?",
                (kind, workstream, cadence, json.dumps(merged), db.now(), eid),
            )
            return _dump({"id": eid, "name": name, "updated": True})
        cur = conn.execute(
            "INSERT INTO entities (name, kind, workstream, cadence, attrs, created_at, updated_at) VALUES (?,?,?,?,?,?,?)",
            (name, kind, workstream, cadence, json.dumps(attrs), db.now(), db.now()),
        )
        return _dump({"id": cur.lastrowid, "name": name, "created": True})


@mcp.tool()
def get_entity(name: str) -> str:
    """Full dossier for one entity: attributes plus its 20 most recent updates."""
    with db.connect() as conn:
        row = conn.execute("SELECT * FROM entities WHERE name = ? COLLATE NOCASE", (name,)).fetchone()
        if not row:
            return _dump({"error": f"entity '{name}' not found"})
        entity = db.row_to_dict(row)
        ups = conn.execute(
            "SELECT * FROM updates WHERE entity_id = ? ORDER BY occurred_at DESC LIMIT 20", (row["id"],)
        ).fetchall()
        entity["recent_updates"] = [db.row_to_dict(u) for u in ups]
        return _dump(entity)


@mcp.tool()
def list_entities(kind: str = "", workstream: str = "") -> str:
    """List entities, optionally filtered by kind and/or workstream. Empty string = no filter."""
    q, params = "SELECT * FROM entities WHERE status = 'active'", []
    if kind:
        q += " AND kind = ?"
        params.append(kind)
    if workstream:
        q += " AND workstream = ?"
        params.append(workstream)
    with db.connect() as conn:
        rows = conn.execute(q + " ORDER BY workstream, kind, name", params).fetchall()
        return _dump([db.row_to_dict(r) for r in rows])


# ---------------------------------------------------------------- updates

@mcp.tool()
def log_update(entity_name: str, source: str, content: str, cadence: str = "daily",
               occurred_at: str = "", meta_json: str = "{}") -> str:
    """Record an update (email, Slack post, Notion note, WhatsApp message, news item, call note)
    against an entity. source: gmail | slack | notion | whatsapp | news | manual | agent.
    occurred_at: ISO timestamp; empty = now."""
    with db.connect() as conn:
        eid = db.entity_id_by_name(conn, entity_name)
        if not eid:
            return _dump({"error": f"entity '{entity_name}' not found — upsert_entity first"})
        cur = conn.execute(
            "INSERT INTO updates (entity_id, source, cadence, content, occurred_at, meta, created_at) VALUES (?,?,?,?,?,?,?)",
            (eid, source, cadence, content, occurred_at or db.now(), meta_json, db.now()),
        )
        return _dump({"id": cur.lastrowid, "entity": entity_name, "logged": True})


@mcp.tool()
def recent_updates(entity_name: str = "", since_days: int = 7, source: str = "") -> str:
    """Updates across all entities (or one entity) from the last N days, newest first."""
    q = ("SELECT u.*, e.name AS entity_name FROM updates u LEFT JOIN entities e ON e.id = u.entity_id "
         "WHERE u.occurred_at >= datetime('now', ?)")
    params: list = [f"-{since_days} days"]
    if entity_name:
        q += " AND e.name = ? COLLATE NOCASE"
        params.append(entity_name)
    if source:
        q += " AND u.source = ?"
        params.append(source)
    with db.connect() as conn:
        rows = conn.execute(q + " ORDER BY u.occurred_at DESC LIMIT 200", params).fetchall()
        return _dump([db.row_to_dict(r) for r in rows])


# ---------------------------------------------------------------- approval queue

@mcp.tool()
def queue_approval(kind: str, title: str, draft: str, confidence: float, reasoning: str,
                   entity_name: str = "", category: str = "general") -> str:
    """Place a draft in the approval queue. NOTHING external ships without going through here.

    kind: reply_draft | action | report | model_change
    category: a stable pattern label (e.g. 'founder_update_ack', 'capital_call', 'lp_report')
    so escalation rates can be tracked per pattern over time.
    confidence: 0.0-1.0 — your honest estimate that ER would approve unchanged.
    reasoning: 1-3 sentences shown next to the draft explaining why you drafted it this way.
    """
    with db.connect() as conn:
        eid = db.entity_id_by_name(conn, entity_name) if entity_name else None
        cur = conn.execute(
            "INSERT INTO approvals (entity_id, kind, category, title, draft, confidence, reasoning, created_at) "
            "VALUES (?,?,?,?,?,?,?,?)",
            (eid, kind, category, title, draft, confidence, reasoning, db.now()),
        )
        return _dump({"id": cur.lastrowid, "queued": True, "title": title})


@mcp.tool()
def list_approvals(status: str = "pending") -> str:
    """The approval inbox. status: pending | approved | edited | rejected | all."""
    q = ("SELECT a.*, e.name AS entity_name FROM approvals a LEFT JOIN entities e ON e.id = a.entity_id")
    params: list = []
    if status != "all":
        q += " WHERE a.status = ?"
        params.append(status)
    with db.connect() as conn:
        rows = conn.execute(q + " ORDER BY a.confidence ASC, a.created_at ASC LIMIT 100", params).fetchall()
        return _dump([db.row_to_dict(r) for r in rows])


@mcp.tool()
def decide_approval(approval_id: int, decision: str, final_text: str = "", note: str = "") -> str:
    """Record ER's decision on a queued item. decision: approved | edited | rejected.
    If edited, final_text is the version ER actually wants. Every edit or rejection is a
    teaching signal — follow up with add_preference to store what was learned."""
    if decision not in ("approved", "edited", "rejected"):
        return _dump({"error": "decision must be approved | edited | rejected"})
    with db.connect() as conn:
        conn.execute(
            "UPDATE approvals SET status=?, final_text=?, note=?, decided_at=? WHERE id=?",
            (decision, final_text or None, note or None, db.now(), approval_id),
        )
        return _dump({"id": approval_id, "decision": decision})


# ---------------------------------------------------------------- preferences

@mcp.tool()
def add_preference(category: str, rule: str, source_approval_id: int = 0) -> str:
    """Store a learned preference/house-style rule so the same decision needs ER less next time.
    Example: category='founder_update_ack', rule='Keep acknowledgements to 2 sentences, no emoji.'"""
    with db.connect() as conn:
        cur = conn.execute(
            "INSERT INTO preferences (category, rule, source_approval_id, created_at) VALUES (?,?,?,?)",
            (category, rule, source_approval_id or None, db.now()),
        )
        return _dump({"id": cur.lastrowid, "stored": True})


@mcp.tool()
def list_preferences(category: str = "") -> str:
    """Learned preferences. ALWAYS read the relevant category before drafting anything."""
    q, params = "SELECT * FROM preferences", []
    if category:
        q += " WHERE category = ?"
        params.append(category)
    with db.connect() as conn:
        rows = conn.execute(q + " ORDER BY created_at DESC LIMIT 200", params).fetchall()
        return _dump([db.row_to_dict(r) for r in rows])


# ---------------------------------------------------------------- goals

@mcp.tool()
def set_goal(entity_name: str, horizon: str, text: str, period: str = "") -> str:
    """Set a goal that daily priorities ladder up to. horizon: daily | monthly | quarterly.
    period: '2026-Q3', '2026-08', or '2026-08-11'."""
    with db.connect() as conn:
        eid = db.entity_id_by_name(conn, entity_name)
        if not eid:
            return _dump({"error": f"entity '{entity_name}' not found"})
        cur = conn.execute(
            "INSERT INTO goals (entity_id, horizon, period, text, created_at, updated_at) VALUES (?,?,?,?,?,?)",
            (eid, horizon, period, text, db.now(), db.now()),
        )
        return _dump({"id": cur.lastrowid, "set": True})


@mcp.tool()
def list_goals(entity_name: str = "", horizon: str = "", status: str = "open") -> str:
    """Goals, filterable by entity, horizon (daily|monthly|quarterly), status (open|done|dropped|all)."""
    q = "SELECT g.*, e.name AS entity_name FROM goals g JOIN entities e ON e.id = g.entity_id WHERE 1=1"
    params: list = []
    if entity_name:
        q += " AND e.name = ? COLLATE NOCASE"
        params.append(entity_name)
    if horizon:
        q += " AND g.horizon = ?"
        params.append(horizon)
    if status != "all":
        q += " AND g.status = ?"
        params.append(status)
    with db.connect() as conn:
        rows = conn.execute(q + " ORDER BY g.horizon, g.created_at", params).fetchall()
        return _dump([db.row_to_dict(r) for r in rows])


@mcp.tool()
def update_goal(goal_id: int, status: str) -> str:
    """Mark a goal done or dropped. status: open | done | dropped."""
    with db.connect() as conn:
        conn.execute("UPDATE goals SET status=?, updated_at=? WHERE id=?", (status, db.now(), goal_id))
        return _dump({"id": goal_id, "status": status})


# ---------------------------------------------------------------- meta / self-improvement

@mcp.tool()
def escalation_stats(days: int = 30) -> str:
    """Per-category approval outcomes over the last N days — the trust dial.
    Approve rate trending up in a category = candidate for proposing auto-handling."""
    with db.connect() as conn:
        rows = conn.execute(
            """SELECT category,
                      COUNT(*) AS total,
                      SUM(status = 'approved') AS approved,
                      SUM(status = 'edited')   AS edited,
                      SUM(status = 'rejected') AS rejected,
                      SUM(status = 'pending')  AS pending,
                      ROUND(AVG(confidence), 2) AS avg_confidence
               FROM approvals
               WHERE created_at >= datetime('now', ?)
               GROUP BY category ORDER BY total DESC""",
            (f"-{days} days",),
        ).fetchall()
        return _dump([dict(r) for r in rows])


if __name__ == "__main__":
    if "--http" in sys.argv:
        mcp.run(transport="streamable-http", **_HTTP_KWARGS)
    else:
        mcp.run()
