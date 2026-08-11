"""One-time interactive OAuth for every configured account.

Run on a machine WITH a browser:
  python -m ingest.authorize            # all accounts missing a token
  python -m ingest.authorize er@zenda.vc  # one account

Then copy cos/data/secrets/token-*.json to the VPS.
"""

import sys

from ingest.google_auth import credentials_for, load_config


def main() -> None:
    cfg = load_config()
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for account in cfg["accounts"]:
        if only and account["address"] != only:
            continue
        print(f"Authorizing {account['address']} — a browser window will open; "
              f"sign in as THAT account.")
        credentials_for(account, cfg["oauth_client"], interactive=True)
        print(f"  ✓ token saved to {account['token']}")


if __name__ == "__main__":
    main()
