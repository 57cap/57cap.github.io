# VPS setup — exact spec and steps

## Spec (the ~$10–20/mo box from the blueprint)

- 2 vCPU, 4 GB RAM, 40+ GB SSD (Hetzner CPX21 ≈ €8/mo, DigitalOcean 4GB ≈ $24/mo,
  Vultr 4GB ≈ $18/mo — any of these is plenty for Phase 0/1)
- Ubuntu 24.04 LTS
- The only stateful thing on the box is `data/cos.db` — snapshot/backup that file and
  the whole system is recoverable.

## Setup (~15 minutes)

```bash
# 1. Basics
apt update && apt install -y python3.12-venv git nodejs npm
npm install -g @anthropic-ai/claude-code

# 2. Code
git clone <this repo> /opt/cos-repo && ln -s /opt/cos-repo/cos /opt/cos
cd /opt/cos
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# 3. Secrets
cp .env.example .env    # fill in ANTHROPIC_API_KEY
# cron doesn't read .env automatically — either source it in cron lines or
# put ANTHROPIC_API_KEY=... at the top of the crontab.

# 4. Seed memory (edit seed/seed_data.yaml with the real company/fund list first)
.venv/bin/python -m seed.seed

# 5. Smoke test one agent
.venv/bin/python -m runner.run_agent --agent orchestrator --prompt "Introduce yourself and list entities in memory."

# 6. Schedule
mkdir -p data/logs
crontab runner/schedule.cron

# 7. Phase A interface — expose memory to the Claude app
.venv/bin/python -m memory.server --http    # or: docker compose -f deploy/docker-compose.yml up -d
```

## Google OAuth for multiple accounts (~10 minutes, once)

Both inboxes (er@57cap.com, er@zenda.vc) get native access — ingestion and outbound
actions — via one OAuth client and one token per account:

1. In [Google Cloud Console](https://console.cloud.google.com): create a project
   (e.g. `cos-er`), enable the **Gmail API** and **Google Calendar API**.
2. OAuth consent screen → Internal if the domains are Workspace-managed, else
   External + add both addresses as test users.
3. Credentials → Create credentials → **OAuth client ID → Desktop app**. Download the
   JSON to `cos/data/secrets/credentials.json`.
4. `cp config/accounts.example.yaml config/accounts.yaml` (already lists both accounts).
5. On your laptop (needs a browser): `python -m ingest.authorize` — it opens a consent
   window twice; sign in as er@57cap.com the first time, er@zenda.vc the second.
6. Copy `data/secrets/token-*.json` to the VPS. Tokens refresh themselves headless
   from then on.

Then:
```bash
.venv/bin/python -m ingest.gmail_ingest     # first pull — check data/logs later via cron
.venv/bin/python -m actions.dispatch --dry  # see what an execution cycle would do
```

## Exposing the memory server safely (Phase A)

The HTTP endpoint (`:8747/mcp`) has no auth of its own. Do **not** open the port to the
internet raw. Two good options:

1. **Tailscale (recommended, simplest):** install Tailscale on the VPS and your phone;
   add the connector in the Claude app pointed at `http://<tailscale-ip>:8747/mcp`.
2. **Caddy + bearer token:** reverse-proxy with a long random token required in the
   `Authorization` header, TLS via Caddy's automatic certificates.

Once connected, chat/voice with Claude anywhere: "what's in my approval inbox?",
"approve #12", "log that I paid the X invoice" — the same memory the agents use.

## Backups

```bash
# nightly, keeps 30 days
0 3 * * * sqlite3 /opt/cos/data/cos.db ".backup /opt/cos/data/backup-$(date +\%d).db"
```
