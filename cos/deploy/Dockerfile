FROM python:3.12-slim

# Node.js is required by the Claude Agent SDK (it drives the Claude Code CLI).
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g @anthropic-ai/claude-code \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/cos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default: serve memory over HTTP for the Claude-app connector (Phase A).
# Agents run via `docker compose exec` or host cron (see deploy/VPS.md).
EXPOSE 8747
CMD ["python", "-m", "memory.server", "--http"]
