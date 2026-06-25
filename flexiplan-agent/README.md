# Flexiplan — AI WhatsApp Sales Agent 🏍️

An AI sales agent for **Flexiplan**, which finances new motorcycles for buyers in
El Salvador who are overlooked by banks and specialty lenders. Ads on Google /
Facebook / Instagram drop the prospect into a WhatsApp chat with the agent
(**"Sofía"**), who runs the whole sale: helps pick a brand/model, prequalifies the
buyer with **Flexiscore**, and — for pre‑approved customers — verifies inventory
with a dealer in the background and hands the buyer off to the counter.

Built with **Node.js + TypeScript**, the **Meta WhatsApp Cloud API**, and
**Claude** (`claude-opus-4-8`) via the Anthropic tool-runner.

---

## What it does

```
        Ad click (Google / FB / IG)
                  │
                  ▼
        WhatsApp  ──►  Meta Cloud API webhook
                  │
                  ▼
     ┌──────────────────────────────┐
     │  Sales agent "Sofía" (Claude) │  ← tools:
     │  • greet & discover           │     search_catalog
     │  • recommend bike             │     update_lead_profile
     │  • prequalify (Flexiscore)    │     prequalify_flexiscore
     │  • verify inventory           │     find_dealers_and_verify
     │  • reserve & hand off         │     check_inventory_status
     └──────────────┬───────────────┘     confirm_sale_and_reserve
                    │
                    ▼
     ┌──────────────────────────────┐
     │ Inventory-verification agent  │  → contacts dealers by
     │ (background)                  │     WhatsApp → email → call,
     │  • confirm availability       │     then holds the unit once
     │  • hold unit after the sale   │     the sale is confirmed
     └──────────────────────────────┘
```

The **sales agent** is conversational and customer-facing. The
**inventory-verification agent** runs in the background: when the sales agent
finds a candidate dealer it opens a verification job, reaches out, and — once the
buyer commits — tells the dealer to hold the bike and not sell it to anyone else.

---

## Quick start (zero setup, mock mode)

```bash
cd flexiplan-agent
cp .env.example .env          # add your ANTHROPIC_API_KEY
npm install
npm run simulate              # chat with the agent in your terminal
```

`npm run simulate` opens an interactive Spanish chat — no WhatsApp, no server,
no credit-engine setup required. Flexiscore runs in mock mode and the dealer
verification is simulated. This is the fastest way to see the full sale flow.

Run it as a server instead:

```bash
npm run dev                   # or: npm run build && npm start
curl localhost:8080/healthz
curl -X POST localhost:8080/sim/message \
  -H 'Content-Type: application/json' \
  -d '{"contact":"demo-1","text":"Hola, busco una moto para trabajar"}'
```

### Run modes (auto-detected from env)

| Integration | Configured when…                | Otherwise (default)                       |
| ----------- | ------------------------------- | ----------------------------------------- |
| WhatsApp    | `WHATSAPP_TOKEN` + phone id set | **console mode** — replies are logged     |
| Flexiscore  | `FLEXISCORE_API_URL` set        | **mock scorer** (transparent heuristic)   |
| Agent       | `ANTHROPIC_API_KEY` set         | server boots but replies that it's offline|

`GET /healthz` reports which mode each integration is in.

---

## Endpoints

| Method & path                | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `GET /healthz`               | Health + which mode each integration is in           |
| `GET /webhook/whatsapp`      | Meta webhook verification handshake                  |
| `POST /webhook/whatsapp`     | Inbound WhatsApp messages                            |
| `POST /sim/message`          | Drive the agent over HTTP (demo/testing)            |
| `GET /leads`                 | All captured leads + funnel stage *(unauthenticated — protect before prod)* |
| `GET /inventory`             | All inventory-verification jobs                      |

---

## Connecting WhatsApp (Meta Cloud API)

1. Create a Meta app → add **WhatsApp** → get a **Phone Number ID** and a token.
2. Set `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and a `WHATSAPP_VERIFY_TOKEN`
   (any string you choose) in `.env`.
3. Deploy the service somewhere with a public HTTPS URL (see Deployment).
4. In the Meta dashboard, set the webhook callback URL to
   `https://YOUR_HOST/webhook/whatsapp` and the **Verify Token** to the same
   `WHATSAPP_VERIFY_TOKEN`. Subscribe to the `messages` field.
5. Send a WhatsApp message to your number — the agent replies.

For ad campaigns, use **Click-to-WhatsApp** ads (Google/Meta) that open a chat
with a prefilled greeting; each click lands here as an inbound message.

---

## Flexiscore integration (your credit engine)

The agent calls Flexiscore through a typed client with a documented contract.
Point it at your engine by setting `FLEXISCORE_API_URL` (and optionally
`FLEXISCORE_API_KEY`). Until then it uses a transparent mock scorer so everything
runs today.

**Request** (`POST {FLEXISCORE_API_URL}`):

```json
{
  "dui": "01234567-8",
  "monthly_income_usd": 650,
  "downpayment_usd": 300,
  "motorcycle_price_usd": 1950,
  "brand": "Honda",
  "model": "CG 125 Cargo"
}
```

**Response** (mapped 1:1 to the agent's decision):

```json
{
  "decision": "approved",          // "approved" | "refer" | "declined"
  "score": 712,
  "max_loan_usd": 1800,
  "estimated_monthly_usd": 96.5,
  "term_months": 18,
  "reasons": ["DTI within policy", "Adequate downpayment"]
}
```

If the API errors, the client fails **soft** to `refer` (human review) rather than
silently approving or declining. See `src/flexiscore/client.ts`.

---

## Project structure

```
src/
  config.ts                 env-driven config (auto-detects run modes)
  index.ts                  Express server entrypoint
  types.ts                  shared domain types
  agent/
    salesAgent.ts           runs the Claude tool-runner per message
    systemPrompt.ts         Sofía's persona + the sales playbook (Spanish)
    tools.ts                the 6 tools the agent can call
  flexiscore/client.ts      credit-engine client + mock scorer
  catalog/
    motorcycles.ts          seed catalog + search
    dealers.ts              seed dealer network
  inventory/
    verificationAgent.ts    background dealer verification + reservation
    dealerChannel.ts        dealer outreach (WhatsApp → email → call)
  whatsapp/
    metaClient.ts           Meta Cloud API send + webhook parsing
    webhook.ts              webhook router
  store/store.ts            in-memory leads / conversations / inventory
  server/adminRoutes.ts     health, leads, inventory, simulator
scripts/simulate.ts         interactive CLI demo
```

---

## Configuration reference

| Variable                    | Default            | Notes                                     |
| --------------------------- | ------------------ | ----------------------------------------- |
| `ANTHROPIC_API_KEY`         | —                  | Required for the agent to run             |
| `ANTHROPIC_MODEL`           | `claude-opus-4-8`  | Switch to `claude-sonnet-4-6` to cut cost |
| `ANTHROPIC_EFFORT`          | `medium`           | `low`…`max` reasoning effort              |
| `WHATSAPP_TOKEN`            | —                  | Empty → console mode                      |
| `WHATSAPP_PHONE_NUMBER_ID`  | —                  |                                           |
| `WHATSAPP_VERIFY_TOKEN`     | `flexiplan-verify-change-me` | Match in Meta webhook config     |
| `FLEXISCORE_API_URL`        | —                  | Empty → mock scorer                       |
| `FLEXISCORE_API_KEY`        | —                  | Bearer token for the credit engine        |
| `OPS_NOTIFY_EMAIL`          | —                  | Ops notifications (dealer flow)           |
| `PORT`                      | `8080`             |                                           |

---

## Deployment

The service is a plain Node HTTP server — deploy anywhere. A `Dockerfile` is
included:

```bash
docker build -t flexiplan-agent .
docker run -p 8080:8080 --env-file .env flexiplan-agent
```

Works on Cloud Run, Render, Railway, Fly.io, or a VM. The only requirement is a
public HTTPS URL for the WhatsApp webhook. Point Meta at
`https://YOUR_HOST/webhook/whatsapp`.

---

## Production hardening (before going live)

This is a working MVP. Before commercial launch:

- **Persistence** — swap the in-memory `store/store.ts` for Firestore/Postgres
  (leads and conversations are lost on restart today).
- **Auth** — `/leads`, `/inventory`, and `/sim/message` are unauthenticated.
- **Webhook signature** — verify Meta's `X-Hub-Signature-256` on inbound POSTs.
- **Dealer replies** — `verificationAgent.ts` simulates dealer responses; wire
  inbound dealer WhatsApp/email parsing or a dealer portal.
- **PII & compliance** — DUI and income are sensitive; encrypt at rest and apply
  retention rules.
- **Rate limiting / abuse** — throttle per contact; the agent costs tokens.
- **Spanish QA** — review Sofía's prompt with the local sales team and add
  guardrails for edge cases (price haggling, off-topic, etc.).
