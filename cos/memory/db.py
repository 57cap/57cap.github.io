"""SQLite memory layer for the Chief of Staff system.

Single source of durable state. Agents are stateless; everything they know
between runs lives here. Schema follows the blueprint's data model:
entities (companies, funds, holdings, projects, admin items), updates,
the approval queue, learned preferences, and goals.
"""

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(os.environ.get("COS_DB_PATH", Path(__file__).resolve().parent.parent / "data" / "cos.db"))

SCHEMA = """
CREATE TABLE IF NOT EXISTS entities (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE COLLATE NOCASE,
    kind        TEXT NOT NULL,        -- company | partner_fund | fund | personal_holding | project | admin_item
    workstream  TEXT NOT NULL,        -- invest | personal | build | admin
    cadence     TEXT DEFAULT 'daily', -- daily | monthly | quarterly
    status      TEXT DEFAULT 'active',
    attrs       TEXT DEFAULT '{}',    -- JSON: stage, thesis, ownership, cost, fmv, arr, runway, nav, moic, due_date, ...
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS updates (
    id          INTEGER PRIMARY KEY,
    entity_id   INTEGER REFERENCES entities(id),
    source      TEXT NOT NULL,        -- gmail | slack | notion | whatsapp | news | manual | agent
    account     TEXT DEFAULT '',      -- which inbox/workspace it came from, e.g. er@57cap.com
    external_id TEXT,                 -- provider id (gmail message id) for dedup
    cadence     TEXT DEFAULT 'daily',
    content     TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    meta        TEXT DEFAULT '{}',
    created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS approvals (
    id          INTEGER PRIMARY KEY,
    entity_id   INTEGER REFERENCES entities(id),
    kind        TEXT NOT NULL,        -- reply_draft | action | report | model_change
    category    TEXT DEFAULT 'general', -- for escalation-rate tracking per pattern
    title       TEXT NOT NULL,
    draft       TEXT NOT NULL,
    confidence  REAL NOT NULL,        -- 0.0 - 1.0
    reasoning   TEXT DEFAULT '',
    status      TEXT DEFAULT 'pending', -- pending | approved | edited | rejected | expired
    final_text  TEXT,
    note        TEXT,
    payload     TEXT,                 -- JSON action executed after approval (email.send, email.draft, calendar.create, delegate)
    executed_at TEXT,
    execution_result TEXT,
    created_at  TEXT NOT NULL,
    decided_at  TEXT
);

CREATE TABLE IF NOT EXISTS preferences (
    id          INTEGER PRIMARY KEY,
    category    TEXT NOT NULL,
    rule        TEXT NOT NULL,
    source_approval_id INTEGER REFERENCES approvals(id),
    created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
    id          INTEGER PRIMARY KEY,
    entity_id   INTEGER REFERENCES entities(id),
    horizon     TEXT NOT NULL,        -- daily | monthly | quarterly
    period      TEXT DEFAULT '',      -- e.g. '2026-Q3', '2026-08', '2026-08-11'
    text        TEXT NOT NULL,
    status      TEXT DEFAULT 'open',  -- open | done | dropped
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS loops (
    id          INTEGER PRIMARY KEY,
    entity_id   INTEGER REFERENCES entities(id),
    description TEXT NOT NULL,        -- what response/event is expected
    waiting_on  TEXT DEFAULT 'them',  -- them (their move) | us (ER/system owes it)
    expected_by TEXT,                 -- ISO date; past this = overdue, agents chase
    status      TEXT DEFAULT 'open',  -- open | closed | dropped
    outcome     TEXT,
    source      TEXT DEFAULT '',      -- who/what opened it (agent name, 'action #12', ...)
    nudges      INTEGER DEFAULT 0,    -- how many times we've chased
    last_nudged TEXT,
    created_at  TEXT NOT NULL,
    closed_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_loops_status ON loops(status, expected_by);
CREATE INDEX IF NOT EXISTS idx_updates_entity ON updates(entity_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status, created_at);
CREATE INDEX IF NOT EXISTS idx_goals_entity ON goals(entity_id, horizon, status);
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


MIGRATIONS = [
    "ALTER TABLE approvals ADD COLUMN payload TEXT",
    "ALTER TABLE approvals ADD COLUMN executed_at TEXT",
    "ALTER TABLE approvals ADD COLUMN execution_result TEXT",
    "ALTER TABLE updates ADD COLUMN account TEXT DEFAULT ''",
    "ALTER TABLE updates ADD COLUMN external_id TEXT",
]


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    for stmt in MIGRATIONS:  # bring pre-existing DBs up to the current schema
        try:
            conn.execute(stmt)
        except sqlite3.OperationalError:
            pass  # column already exists
    # after migrations so the column is guaranteed to exist
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_updates_external ON updates(external_id) "
                 "WHERE external_id IS NOT NULL")
    return conn


def row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    for key in ("attrs", "meta"):
        if key in d and isinstance(d[key], str):
            try:
                d[key] = json.loads(d[key])
            except (ValueError, TypeError):
                pass
    return d


def entity_id_by_name(conn: sqlite3.Connection, name: str) -> int | None:
    row = conn.execute("SELECT id FROM entities WHERE name = ? COLLATE NOCASE", (name,)).fetchone()
    return row["id"] if row else None
