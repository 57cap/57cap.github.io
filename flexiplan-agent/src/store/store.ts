import type { Conversation, InventoryCheck, Lead, StoredMessage } from '../types.js';

/**
 * In-memory persistence for conversations, leads, and inventory checks.
 *
 * Intentionally behind a tiny interface so it can be swapped for Firestore /
 * Postgres without touching the agent or webhook code. Everything keyed by
 * conversationId (== the customer's WhatsApp wa_id).
 */

const now = () => new Date().toISOString();

const conversations = new Map<string, Conversation>();
const leads = new Map<string, Lead>();
const inventoryChecks = new Map<string, InventoryCheck>();

// ── Conversations ────────────────────────────────────────────────────────────

export function getConversation(id: string, contact: string): Conversation {
  let convo = conversations.get(id);
  if (!convo) {
    convo = { id, contact, messages: [], createdAt: now(), updatedAt: now() };
    conversations.set(id, convo);
  }
  return convo;
}

export function appendMessage(id: string, msg: StoredMessage): void {
  const convo = conversations.get(id);
  if (!convo) return;
  convo.messages.push(msg);
  convo.updatedAt = now();
}

// ── Leads ────────────────────────────────────────────────────────────────────

export function getLead(conversationId: string, contact: string): Lead {
  let lead = leads.get(conversationId);
  if (!lead) {
    lead = {
      conversationId,
      contact,
      stage: 'new',
      createdAt: now(),
      updatedAt: now(),
    };
    leads.set(conversationId, lead);
  }
  return lead;
}

export function updateLead(conversationId: string, patch: Partial<Lead>): Lead {
  const lead = leads.get(conversationId);
  if (!lead) throw new Error(`Lead not found: ${conversationId}`);
  Object.assign(lead, patch, { updatedAt: now() });
  return lead;
}

export function allLeads(): Lead[] {
  return [...leads.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

// ── Inventory checks ─────────────────────────────────────────────────────────

export function saveInventoryCheck(check: InventoryCheck): void {
  inventoryChecks.set(check.id, check);
}

export function getInventoryCheck(id: string): InventoryCheck | undefined {
  return inventoryChecks.get(id);
}

export function updateInventoryCheck(
  id: string,
  patch: Partial<InventoryCheck>,
): InventoryCheck | undefined {
  const check = inventoryChecks.get(id);
  if (!check) return undefined;
  Object.assign(check, patch, { updatedAt: now() });
  return check;
}

export function allInventoryChecks(): InventoryCheck[] {
  return [...inventoryChecks.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function inventoryChecksFor(conversationId: string): InventoryCheck[] {
  return allInventoryChecks().filter((c) => c.conversationId === conversationId);
}
