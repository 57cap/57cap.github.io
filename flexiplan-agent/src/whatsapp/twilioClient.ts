import { config } from '../config.js';
import { logger } from '../logger.js';
import type { InboundMessage } from './metaClient.js';

/**
 * Twilio WhatsApp transport.
 *
 * Twilio is the fastest way to test on a real phone: its WhatsApp Sandbox needs
 * no Meta Business verification — you "join" it with one message and start
 * chatting. Inbound webhooks are form-encoded (not JSON like Meta), and the
 * sender/recipient are formatted as "whatsapp:+E164".
 */

/** Send a WhatsApp text via Twilio's REST API. `to` may be a wa id or whatsapp:+E164. */
export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  if (!config.twilio.live) {
    logger.info({ to, body }, '[twilio:console] →');
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`;
  const auth = Buffer.from(`${config.twilio.accountSid}:${config.twilio.authToken}`).toString(
    'base64',
  );
  const form = new URLSearchParams({
    From: config.twilio.from,
    To: toWhatsAppAddress(to),
    Body: body,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const detail = await res.text();
    logger.error({ status: res.status, detail, to }, 'Twilio send failed');
    throw new Error(`Twilio send failed ${res.status}: ${detail}`);
  }
}

/**
 * Parse a Twilio inbound webhook (application/x-www-form-urlencoded body).
 * Returns at most one message — Twilio delivers one per request.
 */
export function parseInboundForm(body: Record<string, unknown>): InboundMessage[] {
  const from = typeof body.From === 'string' ? body.From : '';
  const text = typeof body.Body === 'string' ? body.Body : '';
  if (!from || !text) return [];
  return [
    {
      from, // keep the "whatsapp:+E164" form so replies route back correctly
      name: typeof body.ProfileName === 'string' ? body.ProfileName : undefined,
      text,
      messageId: typeof body.MessageSid === 'string' ? body.MessageSid : from,
    },
  ];
}

/** Normalise any phone form into Twilio's "whatsapp:+E164" address. */
function toWhatsAppAddress(to: string): string {
  if (to.startsWith('whatsapp:')) return to;
  const digits = to.replace(/[^\d]/g, '');
  return `whatsapp:+${digits}`;
}
