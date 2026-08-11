# ER's Chief of Staff — Phase 0 starter

The working skeleton of the system described in the build blueprint: one agentic
operating system across **Investing, Building, and Admin** that needs less of ER's
input over time and never takes a high-risk action without approval.

## Architecture (matches the blueprint 1:1)

```
Inputs ──▶ Memory + Tools (MCP server, SQLite) ──▶ Agents (Claude Agent SDK, cron) ──▶ ER (approve/edit)
```

- **`memory/`** — the only stateful part. A FastMCP server over SQLite holding every
  company, fund, holding, project, update, goal, learned preference, and the
  **approval queue**. Runs over stdio (for agents) and HTTP (for the Claude app —
  Phase A interface). Swap the interface or add a source; nothing is lost.
- **`agents/`** — the roster from the blueprint, one markdown "hat" each, all reading
  the same memory: `orchestrator`, `portfolio_companies`, `partner_funds`,
  `fund_reporting`, `personal_investments`, `builder`, `admin`, `research`, `meta`.
  `_shared.md` carries the non-negotiables: draft-all-approve, learn from edits,
  attach everything to an entity, lead with the 20% that matters.
- **`runner/`** — thin Claude Agent SDK harness (`run_agent.py`) plus the cron
  schedule (`schedule.cron`): daily specialists → daily brief, weekly meta,
  monthly/quarterly passes.
- **`seed/`** — entity list to confirm and load (`python -m seed.seed`).
- **`deploy/`** — VPS spec, Dockerfile, compose file, backup line.

## Quickstart (local)

```bash
cd cos
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
npm install -g @anthropic-ai/claude-code        # Agent SDK dependency
cp .env.example .env                            # add ANTHROPIC_API_KEY
.venv/bin/python -m seed.seed                   # edit seed/seed_data.yaml first
.venv/bin/python -m runner.run_agent --agent orchestrator --prompt "What's in memory?"
```

Production setup: `deploy/VPS.md`.

## The trust loop (autonomy & trust section of the blueprint)

1. Agents **draft** → `queue_approval(confidence, reasoning, category)`.
2. ER **approves / edits / rejects** (via Claude app talking to the memory connector,
   or any client) → `decide_approval`.
3. Edits become **preferences** (`add_preference`) that agents read before drafting.
4. The weekly **meta** agent tracks `escalation_stats` per category and *proposes*
   auto-handling for categories with long clean-approval streaks — ER decides.
   Money- and LP-facing actions stay manual, always.

## What's deliberately not here yet

- **Ingestion connectors** (Gmail/Slack/Notion → `log_update`): Phase 0's next step;
  in the meantime updates can be logged from the Claude app or manually.
- **WhatsApp / Carta / PitchBook**: amber integrations — feasibility gets verified
  before anything is promised (per the blueprint, no fabricated integrations).
- **The visual app** (Phase B) and **Wolfpack product** (Phase 4): later phases,
  same memory backend.
