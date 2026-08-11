"""Execute approved actions against the real world.

The one and only bridge between the approval queue and external effects.
Invariants:
  - Only rows with status approved/edited AND a payload AND no executed_at run.
  - An edited approval uses ER's final_text as the body — his words, not the draft.
  - Every execution is recorded (executed_at + result) and logged as an update,
    so agents see what actually went out.
  - Failures never mark executed; they surface in execution_result for retry.

Run:  python -m actions.dispatch           (cron: every 15 min)
      python -m actions.dispatch --dry     (print what would run)
"""

import base64
import json
import sys
from email.message import EmailMessage

from ingest.google_auth import calendar_service, gmail_service, load_config
from memory import db


def _account_for(cfg: dict, address: str) -> dict:
    for account in cfg["accounts"]:
        if account["address"] == address:
            if not account.get("act", False):
                raise ValueError(f"account {address} has act: false")
            return account
    raise ValueError(f"unknown account '{address}' — not in config/accounts.yaml")


def _mime(payload: dict, body: str) -> str:
    msg = EmailMessage()
    msg["To"] = ", ".join(payload.get("to", []))
    if payload.get("cc"):
        msg["Cc"] = ", ".join(payload["cc"])
    msg["Subject"] = payload.get("subject", "")
    msg.set_content(body)
    return base64.urlsafe_b64encode(msg.as_bytes()).decode()


def execute(payload: dict, body: str, cfg: dict) -> str:
    action = payload["_action"]
    account = _account_for(cfg, payload["account"])

    if action in ("email.draft",):
        svc = gmail_service(account, cfg["oauth_client"])
        draft = svc.users().drafts().create(
            userId="me", body={"message": {"raw": _mime(payload, body)}}).execute()
        return f"draft created in {account['address']} (id {draft['id']})"

    if action in ("email.send", "delegate"):
        svc = gmail_service(account, cfg["oauth_client"])
        sent = svc.users().messages().send(
            userId="me", body={"raw": _mime(payload, body)}).execute()
        return f"sent from {account['address']} to {payload.get('to')} (id {sent['id']})"

    if action == "calendar.create":
        svc = calendar_service(account, cfg["oauth_client"])
        event = svc.events().insert(calendarId="primary", sendUpdates="all", body={
            "summary": payload["title"],
            "description": body,
            "start": {"dateTime": payload["start"]},
            "end": {"dateTime": payload["end"]},
            "attendees": [{"email": a} for a in payload.get("attendees", [])],
        }).execute()
        return f"event created on {account['address']}: {event.get('htmlLink', event['id'])}"

    raise ValueError(f"unknown action {action}")


def main() -> None:
    dry = "--dry" in sys.argv
    cfg = load_config()
    with db.connect() as conn:
        rows = conn.execute(
            "SELECT * FROM approvals WHERE status IN ('approved','edited') "
            "AND payload IS NOT NULL AND executed_at IS NULL ORDER BY decided_at"
        ).fetchall()

    if not rows:
        print("nothing to execute")
        return

    for row in rows:
        payload = json.loads(row["payload"])
        body = row["final_text"] or row["draft"]  # ER's edit always wins
        label = f"#{row['id']} {payload['_action']} — {row['title']}"
        if dry:
            print(f"WOULD RUN {label}")
            continue
        try:
            result = execute(payload, body, cfg)
            status_note = result
            print(f"OK  {label}: {result}")
        except Exception as exc:  # record and move on; cron retries next cycle after fix
            print(f"ERR {label}: {exc}")
            with db.connect() as conn:
                conn.execute("UPDATE approvals SET execution_result=? WHERE id=?",
                             (f"ERROR: {exc}", row["id"]))
            continue
        with db.connect() as conn:
            conn.execute("UPDATE approvals SET executed_at=?, execution_result=? WHERE id=?",
                         (db.now(), status_note, row["id"]))
            eid = row["entity_id"]
            if eid:
                conn.execute(
                    "INSERT INTO updates (entity_id, source, account, cadence, content, occurred_at, created_at) "
                    "VALUES (?,?,?,?,?,?,?)",
                    (eid, "agent", payload.get("account", ""), "daily",
                     f"Executed approved action #{row['id']}: {row['title']} → {status_note}",
                     db.now(), db.now()),
                )
            _open_followup(conn, row, payload)


def _open_followup(conn, row, payload: dict) -> None:
    """Every outbound message that expects an answer becomes an open loop.
    Default: 4 days for sends/delegations. Override with payload follow_up_days
    (0 disables — e.g. pure FYI notes). Drafts get no loop (ER decides if/when
    to send); calendar events close themselves by happening."""
    if payload["_action"] not in ("email.send", "delegate"):
        return
    days = payload.get("follow_up_days", 4)
    if not days or not row["entity_id"]:
        return
    expected_by = conn.execute("SELECT datetime('now', ?)", (f"+{int(days)} days",)).fetchone()[0]
    conn.execute(
        "INSERT INTO loops (entity_id, description, waiting_on, expected_by, source, created_at) "
        "VALUES (?,?,?,?,?,?)",
        (row["entity_id"],
         f"Awaiting response to '{payload.get('subject', row['title'])}' "
         f"(to {', '.join(payload.get('to', []))})",
         "them", expected_by, f"action #{row['id']}", db.now()),
    )


if __name__ == "__main__":
    main()
