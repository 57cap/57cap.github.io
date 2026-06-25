import { Router, type Request, type Response } from 'express';
import express from 'express';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { handleCustomerMessage } from '../agent/salesAgent.js';
import { markRead, parseInboundMessages, type InboundMessage } from './metaClient.js';
import { parseInboundForm } from './twilioClient.js';
import { sendText } from './provider.js';

/**
 * Inbound WhatsApp webhooks for both supported providers:
 *
 *   Meta Cloud API
 *     GET  /webhook/whatsapp  → verification handshake (hub.challenge)
 *     POST /webhook/whatsapp  → inbound messages (JSON)
 *
 *   Twilio
 *     POST /webhook/twilio    → inbound messages (form-urlencoded)
 *
 * Both acknowledge fast and process in the background. Replies are sent via the
 * active provider (see ./provider.ts).
 */
export const whatsappWebhook = Router();

// ── Meta ───────────────────────────────────────────────────────────────────────

whatsappWebhook.get('/webhook/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    logger.info('WhatsApp (Meta) webhook verified');
    res.status(200).send(challenge);
    return;
  }
  logger.warn('WhatsApp (Meta) webhook verification failed');
  res.sendStatus(403);
});

whatsappWebhook.post('/webhook/whatsapp', (req: Request, res: Response) => {
  res.sendStatus(200); // ack fast, then process
  for (const inbound of parseInboundMessages(req.body)) {
    void markRead(inbound.messageId);
    void processInbound(inbound, 'meta');
  }
});

// ── Twilio (form-urlencoded body — note the route-local middleware) ──────────────

whatsappWebhook.post(
  '/webhook/twilio',
  express.urlencoded({ extended: false }),
  (req: Request, res: Response) => {
    // Twilio expects a TwiML reply; we answer empty and send via REST instead.
    res.type('text/xml').send('<Response></Response>');
    for (const inbound of parseInboundForm(req.body as Record<string, unknown>)) {
      void processInbound(inbound, 'twilio');
    }
  },
);

// ── Shared processing ────────────────────────────────────────────────────────────

async function processInbound(inbound: InboundMessage, provider: string): Promise<void> {
  try {
    logger.info({ from: inbound.from, text: inbound.text, provider }, 'Inbound WhatsApp message');
    const reply = await handleCustomerMessage({
      conversationId: inbound.from,
      contact: inbound.from,
      name: inbound.name,
      text: inbound.text,
    });
    await sendText(inbound.from, reply);
  } catch (err) {
    logger.error({ err, from: inbound.from }, 'Failed processing inbound WhatsApp message');
  }
}
