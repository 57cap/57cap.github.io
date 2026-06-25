/** Shared domain types for the Flexiplan WhatsApp sales agent. */

/** El Salvador departments — used for routing customers to nearby dealers. */
export type Department =
  | 'San Salvador'
  | 'La Libertad'
  | 'Santa Ana'
  | 'San Miguel'
  | 'Sonsonate'
  | 'Usulután'
  | 'La Paz'
  | 'Ahuachapán'
  | 'Cuscatlán'
  | 'Otro';

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  /** Price in USD (El Salvador uses USD as legal tender). */
  priceUsd: number;
  engineCc: number;
  /** Primary use the bike is suited for — helps the agent recommend. */
  useCase: Array<'trabajo' | 'delivery' | 'ciudad' | 'carretera' | 'economico'>;
  highlights: string[];
}

/** Outcome of a Flexiscore prequalification. */
export type FlexiscoreDecision = 'approved' | 'refer' | 'declined';

export interface FlexiscoreInput {
  /** DUI: El Salvador national ID (Documento Único de Identidad). */
  dui: string;
  monthlyIncomeUsd: number;
  downpaymentUsd: number;
  motorcyclePriceUsd: number;
  brand: string;
  model: string;
}

export interface FlexiscoreResult {
  decision: FlexiscoreDecision;
  /** 300–850 style score for transparency. */
  score: number;
  /** Max financeable loan amount in USD. */
  maxLoanUsd: number;
  /** Estimated monthly payment for the requested bike, if approvable. */
  estimatedMonthlyUsd: number | null;
  termMonths: number;
  reasons: string[];
}

/** A dealer that may carry a given brand/model. */
export interface Dealer {
  id: string;
  name: string;
  department: Department;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  brandsCarried: string[];
}

/** Status of a background inventory-verification job. */
export type InventoryStatus =
  | 'pending' // queued, dealer not yet contacted
  | 'contacted' // reached out, awaiting dealer reply
  | 'available' // dealer confirmed the bike is in stock
  | 'unavailable' // dealer confirmed it is NOT available
  | 'reserved'; // sale confirmed; dealer told to hold it for the customer

export interface InventoryCheck {
  id: string;
  conversationId: string;
  brand: string;
  model: string;
  department: Department;
  dealerId: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
  notes: string[];
}

/** The sales funnel stage of a lead — drives reporting and follow-up. */
export type LeadStage =
  | 'new'
  | 'exploring' // discussing brands/models
  | 'qualifying' // collecting DUI / income / downpayment
  | 'prequalified' // Flexiscore approved
  | 'referred_to_dealer'
  | 'declined';

export interface Lead {
  conversationId: string;
  /** WhatsApp phone (wa_id) or simulator id. */
  contact: string;
  name?: string;
  stage: LeadStage;
  department?: Department;
  /** Captured during qualification. */
  dui?: string;
  monthlyIncomeUsd?: number;
  downpaymentUsd?: number;
  interestedMotorcycleId?: string;
  flexiscore?: FlexiscoreResult;
  dealerId?: string;
  createdAt: string;
  updatedAt: string;
}

/** A single turn in a conversation, stored for the agent's memory. */
export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  at: string;
}

export interface Conversation {
  id: string;
  contact: string;
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
}
