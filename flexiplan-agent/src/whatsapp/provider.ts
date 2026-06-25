import { config } from '../config.js';
import { logger } from '../logger.js';
import * as meta from './metaClient.js';
import * as twilio from './twilioClient.js';

/**
 * WhatsApp transport selector. A deployment uses exactly one provider, chosen by
 * which credentials are present:
 *   Twilio creds set  → twilio   (easiest to test — sandbox, no Meta verification)
 *   Meta creds set    → meta     (Cloud API, best at scale)
 *   neither           → console  (replies are logged; great for local/dev)
 */
export type ProviderName = 'twilio' | 'meta' | 'console';

export function activeProvider(): ProviderName {
  if (config.twilio.live) return 'twilio';
  if (config.whatsapp.live) return 'meta';
  return 'console';
}

/** Send a WhatsApp text via the active provider. */
export async function sendText(to: string, body: string): Promise<void> {
  switch (activeProvider()) {
    case 'twilio':
      return twilio.sendWhatsAppText(to, body);
    case 'meta':
      return meta.sendWhatsAppText(to, body);
    default:
      logger.info({ to, body }, '[whatsapp:console] →');
      return;
  }
}
