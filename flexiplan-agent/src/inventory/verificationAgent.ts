import { randomUUID } from 'node:crypto';
import { logger } from '../logger.js';
import type { Department, InventoryCheck } from '../types.js';
import { getDealer } from '../catalog/dealers.js';
import { saveInventoryCheck, updateInventoryCheck, getInventoryCheck } from '../store/store.js';
import { contactDealer } from './dealerChannel.js';

/**
 * Background inventory-verification agent.
 *
 * Responsibilities:
 *  1. When the sales agent finds a candidate dealer, open a verification job and
 *     reach out to confirm the brand/model is in stock.
 *  2. When a sale is confirmed, tell the dealer to hold the bike for the named
 *     customer and not to sell it to anyone else.
 *
 * For the MVP, dealer responses are simulated asynchronously (a real deployment
 * parses inbound dealer WhatsApp/email replies, or a dealer portal updates
 * status). The state machine and outreach are real; only the dealer's "yes/no"
 * is mocked here behind `simulateDealerReply`.
 */

const now = () => new Date().toISOString();

export interface OpenCheckParams {
  conversationId: string;
  brand: string;
  model: string;
  department: Department;
  dealerId: string;
}

/** Open a verification job and asynchronously contact the dealer. */
export async function openInventoryCheck(params: OpenCheckParams): Promise<InventoryCheck> {
  const dealer = getDealer(params.dealerId);
  const check: InventoryCheck = {
    id: randomUUID(),
    conversationId: params.conversationId,
    brand: params.brand,
    model: params.model,
    department: params.department,
    dealerId: params.dealerId,
    status: 'pending',
    createdAt: now(),
    updatedAt: now(),
    notes: [],
  };
  saveInventoryCheck(check);

  if (!dealer) {
    updateInventoryCheck(check.id, {
      status: 'unavailable',
      notes: [...check.notes, 'Distribuidor no encontrado'],
    });
    return check;
  }

  // Fire-and-forget the outreach so the customer-facing turn isn't blocked.
  void (async () => {
    const message =
      `Hola ${dealer.name}, somos Flexiplan. ¿Tienen disponible una ` +
      `*${params.brand} ${params.model}* en ${params.department}? ` +
      `Tenemos un cliente pre-aprobado interesado. Por favor confirmen disponibilidad.`;

    const outreach = await contactDealer(dealer, message);
    updateInventoryCheck(check.id, {
      status: outreach.delivered ? 'contacted' : 'pending',
      notes: [...check.notes, `Contacto: ${outreach.detail}`],
    });
    logger.info(
      { checkId: check.id, dealer: dealer.id, channel: outreach.channel },
      'Dealer contacted for inventory verification',
    );

    // DEMO ONLY: simulate the dealer replying after a short delay.
    simulateDealerReply(check.id);
  })();

  return check;
}

/**
 * Confirm a sale: instruct the dealer to hold the unit for the customer.
 * Called by the sales agent once a customer commits.
 */
export async function reserveWithDealer(
  checkId: string,
  customerName: string,
  customerContact: string,
): Promise<InventoryCheck | undefined> {
  const check = getInventoryCheck(checkId);
  if (!check) return undefined;
  const dealer = getDealer(check.dealerId);
  if (!dealer) return check;

  const message =
    `Flexiplan confirma la venta ✅. Por favor *aparten* la ` +
    `*${check.brand} ${check.model}* para el cliente ${customerName} ` +
    `(contacto ${customerContact}). No la vendan a otra persona. ` +
    `El cliente pasará a la sala. Gracias.`;

  const outreach = await contactDealer(dealer, message);
  return updateInventoryCheck(checkId, {
    status: 'reserved',
    notes: [...check.notes, `Reserva enviada: ${outreach.detail}`],
  });
}

/**
 * DEMO stub: after a delay, mark most checks "available". A real system replaces
 * this with inbound dealer-reply parsing or a dealer portal webhook.
 */
function simulateDealerReply(checkId: string): void {
  setTimeout(() => {
    const check = getInventoryCheck(checkId);
    if (!check || check.status === 'reserved' || check.status === 'unavailable') return;
    // 85% available in the demo.
    const available = Math.random() < 0.85;
    updateInventoryCheck(checkId, {
      status: available ? 'available' : 'unavailable',
      notes: [
        ...check.notes,
        available
          ? '(simulado) Distribuidor confirma disponibilidad'
          : '(simulado) Distribuidor sin stock',
      ],
    });
    logger.info({ checkId, available }, 'Simulated dealer inventory reply');
  }, 2500);
}
