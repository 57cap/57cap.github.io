import { config } from '../config.js';
import { logger } from '../logger.js';
import type { Dealer } from '../types.js';
import { activeProvider, sendText } from '../whatsapp/provider.js';

/**
 * Outbound channel for reaching dealers (WhatsApp → email → phone fallback).
 *
 * For the MVP, WhatsApp uses the same Meta client as the customer-facing agent;
 * email/phone are logged stubs with clear extension points (SMTP, Twilio Voice).
 * Every send returns a boolean so the verification agent can fall through
 * channels until one succeeds.
 */

export type DealerChannelKind = 'whatsapp' | 'email' | 'call';

export interface DealerOutreachResult {
  channel: DealerChannelKind;
  delivered: boolean;
  detail: string;
}

/** Try to reach a dealer over the best available channel. */
export async function contactDealer(dealer: Dealer, message: string): Promise<DealerOutreachResult> {
  // 1) WhatsApp — preferred (immediate, trackable).
  if (dealer.whatsapp && activeProvider() !== 'console') {
    const wa = normalizePhone(dealer.whatsapp);
    const ok = await sendText(wa, message).then(
      () => true,
      (err) => {
        logger.warn({ err, dealer: dealer.id }, 'Dealer WhatsApp send failed');
        return false;
      },
    );
    if (ok) return { channel: 'whatsapp', delivered: true, detail: `WhatsApp a ${wa}` };
  }

  // 2) Email — stub. Plug in SMTP / SendGrid here.
  if (dealer.email) {
    await sendDealerEmail(dealer.email, 'Verificación de inventario — Flexiplan', message);
    return { channel: 'email', delivered: true, detail: `Email a ${dealer.email}` };
  }

  // 3) Phone call — stub. Plug in Twilio Voice / agent dialer here.
  logger.info(
    { dealer: dealer.id, phone: dealer.phone },
    '[dealer-channel] Would place a verification call (stub)',
  );
  return { channel: 'call', delivered: false, detail: `Llamada pendiente a ${dealer.phone}` };
}

async function sendDealerEmail(to: string, subject: string, body: string): Promise<void> {
  if (config.ops.smtpUrl) {
    // TODO: wire a real SMTP transport (nodemailer) using config.ops.smtpUrl.
    logger.info({ to, subject }, '[dealer-channel] SMTP configured — implement transport');
    return;
  }
  logger.info({ to, subject, body }, '[dealer-channel] Email (stub, not sent)');
}

function normalizePhone(p: string): string {
  return p.replace(/[^\d]/g, '');
}
