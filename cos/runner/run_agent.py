"""Run one Chief-of-Staff agent against the shared memory server.

Agents are stateless and disposable — all durable state lives in the MCP memory
server. This runner loads an agent definition from agents/<name>.md, prepends the
shared principles, and drives it with the Claude Agent SDK.

Usage:
  python -m runner.run_agent --agent portfolio_companies
  python -m runner.run_agent --agent orchestrator --prompt "What's pending in the approval inbox?"
  python -m runner.run_agent --agent builder --run-type monthly

Requires ANTHROPIC_API_KEY in the environment (see .env.example).
"""

import argparse
import asyncio
import sys
from datetime import date
from pathlib import Path

from claude_agent_sdk import ClaudeAgentOptions, query

ROOT = Path(__file__).resolve().parent.parent
AGENTS_DIR = ROOT / "agents"

MEMORY_TOOLS = [
    "mcp__cos-memory__upsert_entity",
    "mcp__cos-memory__get_entity",
    "mcp__cos-memory__list_entities",
    "mcp__cos-memory__log_update",
    "mcp__cos-memory__recent_updates",
    "mcp__cos-memory__queue_approval",
    "mcp__cos-memory__list_approvals",
    "mcp__cos-memory__decide_approval",
    "mcp__cos-memory__add_preference",
    "mcp__cos-memory__list_preferences",
    "mcp__cos-memory__set_goal",
    "mcp__cos-memory__list_goals",
    "mcp__cos-memory__update_goal",
    "mcp__cos-memory__escalation_stats",
]

# Research agent gets the web; everyone else stays inside memory.
WEB_TOOLS = ["WebSearch", "WebFetch"]


def build_options(agent_name: str) -> ClaudeAgentOptions:
    agent_file = AGENTS_DIR / f"{agent_name}.md"
    if not agent_file.exists():
        available = sorted(p.stem for p in AGENTS_DIR.glob("*.md") if not p.stem.startswith("_"))
        sys.exit(f"Unknown agent '{agent_name}'. Available: {', '.join(available)}")

    system_prompt = (AGENTS_DIR / "_shared.md").read_text() + "\n\n---\n\n" + agent_file.read_text()
    allowed = MEMORY_TOOLS + (WEB_TOOLS if agent_name == "research" else [])

    return ClaudeAgentOptions(
        system_prompt=system_prompt,
        model="claude-opus-5",
        mcp_servers={
            "cos-memory": {
                "type": "stdio",
                "command": sys.executable,
                "args": ["-m", "memory.server"],
            }
        },
        allowed_tools=allowed,
        # Headless cron runs can't answer permission prompts; the blast radius is
        # bounded by allowed_tools — agents can only touch memory (and web for research).
        permission_mode="bypassPermissions",
        max_turns=60,
        cwd=str(ROOT),
    )


async def run(agent_name: str, prompt: str) -> None:
    options = build_options(agent_name)
    async for message in query(prompt=prompt, options=options):
        # Print assistant text as it arrives so cron logs are readable.
        for block in getattr(message, "content", []) or []:
            text = getattr(block, "text", None)
            if text:
                print(text, flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a Chief-of-Staff agent")
    parser.add_argument("--agent", required=True, help="agent name (file in agents/, e.g. portfolio_companies)")
    parser.add_argument("--run-type", default="daily", choices=["daily", "weekly", "monthly", "quarterly"])
    parser.add_argument("--prompt", default="", help="ad-hoc prompt; overrides the scheduled-run prompt")
    args = parser.parse_args()

    prompt = args.prompt or (
        f"Today is {date.today().isoformat()}. This is your scheduled {args.run_type} run. "
        "Follow your instructions for this run type, work from memory, and finish with a "
        "short summary of what you updated, queued, or flagged."
    )
    asyncio.run(run(args.agent, prompt))


if __name__ == "__main__":
    main()
