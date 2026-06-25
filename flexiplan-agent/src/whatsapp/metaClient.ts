import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Minimal Meta WhatsApp Cloud API client.
 *
 * Only the pieces the sales agent needs: send a text message, and mark inbound
 * messages as read. When WHATSAPP_TOKEN / PHONE_NUMBER_ID are unset, runs in
 * "console mode" — replies are logged, not sent — so the app works with zero
 * Meta setup for local dev and the simulator.
 */

function graphUrl(path: string): string {
  return `https://graph.facebook.com/${config.whatsapp.apiVersion}/${path}`;
}

/** Send a plain text WhatsApp message to a wa_id (E.164 digits, no +). */
export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  if (!config.whatsapp.live) {
    logger.info({ to, body }, '[whatsapp:console] →');
    return;
  }

  const res = await fetch(graphUrl(`${config.whatsapp.phoneNumberId}/messages`), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.whatsapp.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    logger.error({ status: res.status, detail, to }, 'WhatsApp send failed');
    throw new Error(`WhatsApp send failed ${res.status}: ${detail}`);
  }
}

/** Mark an inbound message as read (the blue ticks) — best-effort. */
export async function markRead(messageId: string): Promise<void> {
  if (!config.whatsapp.live) return;
  try {
    await fetch(graphUrl(`${config.whatsapp.phoneNumberId}/messages`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsapp.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  } catch (err) {
    logger.debug({ err }, 'markRead failed (non-fatal)');
  }
}

// ── Inbound webhook parsing ────────────────────────────────────────────────────

export interface InboundMessage {
  /** Sender's WhatsApp id (used as conversationId / contact). */
  from: string;
  /** Profile display name, if Meta provides it. */
  name?: string;
  text: string;
  messageId: string;
}

/**
 * Extract user text messages from a Meta webhook payload. Ignores status
 * callbacks (delivered/read) and non-text message types (returns []).
 */
export function parseInboundMessages(payload: unknown): InboundMessage[] {
  const out: InboundMessage[] = [];
  const body = payload as MetaWebhookBody;

  for (const entry of body?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value?.messages) continue;

      const contactName = value.contacts?.[0]?.profile?.name;
      for (const msg of value.messages) {
        if (msg.type !== 'text' || !msg.text?.body) continue;
        out.push({
          from: msg.from,
          name: contactName,
          text: msg.text.body,
          messageId: msg.id,
        });
      }
    }
  }
  return out;
}

// Loose types for the subset of the Meta webhook shape we read.
interface MetaWebhookBody {
  entry?: Array<{
    changes?: Array<{
      value?: {
        contacts?: Array<{ profile?: { name?: string } }>;
        messages?: Array<{
          from: string;
          id: string;
          type: string;
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}
