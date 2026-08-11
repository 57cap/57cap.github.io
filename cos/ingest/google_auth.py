"""Per-account Google OAuth for Gmail + Calendar.

One OAuth client, one token file per account. First run per account opens a
browser consent (run `python -m ingest.authorize` on a machine with a browser,
then copy the token files to the VPS); afterwards tokens auto-refresh headless.
"""

import os
from pathlib import Path

import yaml
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = Path(os.environ.get("COS_ACCOUNTS", ROOT / "config" / "accounts.yaml"))

SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",     # read + drafts + send + labels
    "https://www.googleapis.com/auth/calendar.events",  # create/update events
]


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise SystemExit(f"Missing {CONFIG_PATH} — copy config/accounts.example.yaml and fill it in.")
    return yaml.safe_load(CONFIG_PATH.read_text())


def credentials_for(account: dict, oauth_client: str, interactive: bool = False) -> Credentials:
    token_path = ROOT / account["token"]
    creds = None
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
    if creds and creds.valid:
        return creds
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    elif interactive:
        flow = InstalledAppFlow.from_client_secrets_file(str(ROOT / oauth_client), SCOPES)
        creds = flow.run_local_server(port=0)
    else:
        raise SystemExit(
            f"No valid token for {account['address']} — run `python -m ingest.authorize` "
            "on a machine with a browser, then copy the token file over."
        )
    token_path.parent.mkdir(parents=True, exist_ok=True)
    token_path.write_text(creds.to_json())
    return creds


def gmail_service(account: dict, oauth_client: str):
    return build("gmail", "v1", credentials=credentials_for(account, oauth_client), cache_discovery=False)


def calendar_service(account: dict, oauth_client: str):
    return build("calendar", "v3", credentials=credentials_for(account, oauth_client), cache_discovery=False)
