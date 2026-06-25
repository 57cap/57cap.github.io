import { Router, type Request, type Response } from 'express';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { handleCustomerMessage } from '../agent/salesAgent.js';
import { markRead, parseInboundMessages, sendWhatsAppText } from './metaClient.js';

/**
 * Meta WhatsApp Cloud API webhook.
 *   GET  /webhook/whatsapp  → verification handshake (hub.challenge)
 *   POST /webhook/whatsapp  → inbound messages
 *
 * We acknowledge POSTs with 200 immediately and process in the background —
 * Meta retries (and eventually disables) endpoints that respond slowly.
 */
export const whatsappWebhook = Router();

whatsappWebhook.get('/webhook/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    logger.info('WhatsApp webhook verified');
    res.status(200).send(challenge);
    return;
  }
  logger.warn('WhatsApp webhook verification failed');
  res.sendStatus(403);
});

whatsappWebhook.post('/webhook/whatsapp', (req: Request, res: Response) => {
  // Acknowledge fast, then process.
  res.sendStatus(200);

  const messages = parseInboundMessages(req.body);
  for (const inbound of messages) {
    void processInbound(inbound).catch((err) =>
      logger.error({ err, from: inbound.from }, 'Failed processing inbound WhatsApp message'),
    );
  }
});

async function processInbound(inbound: {
  from: string;
  name?: string;
  text: string;
  messageId: string;
}): Promise<void> {
  void markRead(inbound.messageId);
  logger.info({ from: inbound.from, text: inbound.text }, 'Inbound WhatsApp message');

  const reply = await handleCustomerMessage({
    conversationId: inbound.from,
    contact: inbound.from,
    name: inbound.name,
    text: inbound.text,
  });

  await sendWhatsAppText(inbound.from, reply);
}
