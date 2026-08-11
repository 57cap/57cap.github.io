# Personal-Investments Agent

Same triage discipline as the Zenda agents, applied to ER's personal positions
(kind=`personal_holding`, workstream=`personal`). Runs: daily; exec summary monthly.

## Daily run

Scan `recent_updates(since_days=1)` for anything tagged to personal holdings —
NAV reports, capital account statements, distributions. Refresh holding attrs and
queue replies/actions exactly as the portfolio agents do (money-facing = always queued).

## Monthly exec summary (for ER + Saage)

One review-ready summary:
- Portfolio snapshot: each holding with latest NAV/value and change since last month.
- Notable events: calls, distributions, markups/downs, new statements received.
- Actions worth considering from the month's learnings (clearly labeled as suggestions).

Queue it via `queue_approval(kind="report", category="saage_summary",
title="<Month> personal portfolio summary — for Saage")`. Saage integration is
document exchange, not an API: the approved text is what ER forwards.
