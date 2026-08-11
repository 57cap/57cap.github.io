"""Poll every configured Gmail account and land new mail in memory as updates.

Deterministic by design: this worker fetches, dedups, does cheap entity
matching, and stores. The intelligent filing (dossier updates, reply drafts,
approval items) is the agents' job on their next run — they read
`recent_updates` and everything logged against 'Unfiled Inbox'.

Run:  python -m ingest.gmail_ingest          (cron: every 30 min)
"""

import base64
import json
import re
from email.utils import parsedate_to_datetime

from ingest.google_auth import gmail_service, load_config
from memory import db, server as memory


def _header(msg: dict, name: str) -> str:
    for h in msg.get("payload", {}).get("headers", []):
        if h["name"].lower() == name.lower():
            return h["value"]
    return ""


def _body_text(payload: dict) -> str:
    """Best-effort plain text from a Gmail payload tree."""
    if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode(errors="replace")
    for part in payload.get("parts", []) or []:
        text = _body_text(part)
        if text:
            return text
    return ""


def _entity_names() -> list[str]:
    with db.connect() as conn:
        rows = conn.execute("SELECT name FROM entities WHERE status='active'").fetchall()
    return [r["name"] for r in rows if r["name"].lower() not in ("daily brief", "unfiled inbox")]


# Entity names that are also everyday words: match only as written (capitalized),
# otherwise every "our new partner" email files under the company 'Partner'.
COMMON_WORD_NAMES = {"partner", "tally", "gaia", "prometheus", "octane"}


def _normalize(text: str) -> str:
    """Lowercase, strip punctuation, and glue single-letter runs so
    'Chapter One, Page Two, L.P.' matches the entity 'Chapter One Page Two LP'."""
    text = re.sub(r"\s+", " ", re.sub(r"[^a-z0-9+]+", " ", text.lower())).strip()
    while re.search(r"\b([a-z]) ([a-z])\b", text):  # 'l p' -> 'lp', 'y c' -> 'yc'
        text = re.sub(r"\b([a-z]) ([a-z])\b", r"\1\2", text)
    return text


def match_entity(names: list[str], text: str) -> str | None:
    """Cheap first-pass filing: an entity name appearing as a phrase in the mail.
    Precision beats recall — a miss lands in Unfiled Inbox where agents file it."""
    haystack = f" {_normalize(text)} "
    hits = []
    for n in names:
        if _normalize(n) in COMMON_WORD_NAMES:
            if re.search(rf"\b{re.escape(n)}\b", text):  # case-sensitive, as written
                hits.append(n)
        elif f" {_normalize(n)} " in haystack:
            hits.append(n)
    if hits:
        return max(hits, key=len)  # longest match wins ('Chapter One Page Two LP' over 'Chapter One')
    return None


def ingest_account(account: dict, cfg: dict) -> dict:
    svc = gmail_service(account, cfg["oauth_client"])
    query = f"newer_than:{cfg['ingest'].get('window', '2d')} {cfg['ingest'].get('query', '')}".strip()
    names = _entity_names()
    memory.upsert_entity("Unfiled Inbox", "admin_item", "admin", "daily",
                         '{"description": "Mail awaiting agent filing"}')
    stats = {"seen": 0, "stored": 0, "skipped_dup": 0, "skipped_newsletter": 0}

    resp = svc.users().messages().list(userId="me", q=query, maxResults=100).execute()
    for ref in resp.get("messages", []):
        stats["seen"] += 1
        msg = svc.users().messages().get(userId="me", id=ref["id"], format="full").execute()
        subject, sender = _header(msg, "Subject"), _header(msg, "From")
        to = _header(msg, "To")
        body = _body_text(msg.get("payload", {}))[:4000]
        haystack = f"{subject}\n{sender}\n{to}\n{body}"
        entity = match_entity(names, haystack)

        if cfg["ingest"].get("skip_newsletters", True) and _header(msg, "List-Unsubscribe") and not entity:
            stats["skipped_newsletter"] += 1
            continue

        try:
            occurred = parsedate_to_datetime(_header(msg, "Date")).isoformat()
        except (TypeError, ValueError):
            occurred = ""

        result = json.loads(memory.log_update(
            entity_name=entity or "Unfiled Inbox",
            source="gmail",
            content=f"From: {sender}\nTo: {to}\nSubject: {subject}\n\n{body[:1500]}",
            cadence="daily",
            occurred_at=occurred,
            meta_json=json.dumps({"gmail_thread": msg.get("threadId"), "labels": msg.get("labelIds", [])}),
            account=account["address"],
            external_id=f"gmail:{account['address']}:{msg['id']}",
        ))
        stats["stored" if "logged" in result else "skipped_dup"] += 1
    return stats


def main() -> None:
    cfg = load_config()
    for account in cfg["accounts"]:
        if not account.get("ingest", True):
            continue
        stats = ingest_account(account, cfg)
        print(f"{account['address']}: {stats}")


if __name__ == "__main__":
    main()
