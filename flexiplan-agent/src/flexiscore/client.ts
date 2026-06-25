import { config } from '../config.js';
import { logger } from '../logger.js';
import type { FlexiscoreInput, FlexiscoreResult } from '../types.js';

/**
 * Client for Flexiplan's credit engine ("Flexiscore").
 *
 * ── External API contract ──────────────────────────────────────────────────────
 * When FLEXISCORE_API_URL is set, this client POSTs to it:
 *
 *   POST {FLEXISCORE_API_URL}
 *   Authorization: Bearer {FLEXISCORE_API_KEY}
 *   Content-Type: application/json
 *   {
 *     "dui": "01234567-8",
 *     "monthly_income_usd": 650,
 *     "downpayment_usd": 300,
 *     "motorcycle_price_usd": 1950,
 *     "brand": "Honda",
 *     "model": "CG 125 Cargo"
 *   }
 *
 * Expected 200 response (mapped 1:1 to FlexiscoreResult):
 *   {
 *     "decision": "approved" | "refer" | "declined",
 *     "score": 712,
 *     "max_loan_usd": 1800,
 *     "estimated_monthly_usd": 96.5,
 *     "term_months": 18,
 *     "reasons": ["DTI within policy", "Adequate downpayment"]
 *   }
 *
 * If FLEXISCORE_API_URL is empty, the transparent mock model below is used so the
 * whole flow runs today. Swap to the real engine by setting the env var — no code
 * change required.
 */
export async function runFlexiscore(input: FlexiscoreInput): Promise<FlexiscoreResult> {
  if (config.flexiscore.live) {
    try {
      return await callExternal(input);
    } catch (err) {
      logger.error({ err }, 'Flexiscore API call failed — falling back to mock scorer');
      // Fail soft: never block a customer on an upstream outage. Mark as "refer"
      // so a human reviews rather than silently approving/declining.
      const mock = mockScore(input);
      return { ...mock, decision: 'refer', reasons: ['Motor de crédito no disponible; revisión manual'] };
    }
  }
  return mockScore(input);
}

async function callExternal(input: FlexiscoreInput): Promise<FlexiscoreResult> {
  const res = await fetch(config.flexiscore.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.flexiscore.apiKey ? { Authorization: `Bearer ${config.flexiscore.apiKey}` } : {}),
    },
    body: JSON.stringify({
      dui: input.dui,
      monthly_income_usd: input.monthlyIncomeUsd,
      downpayment_usd: input.downpaymentUsd,
      motorcycle_price_usd: input.motorcyclePriceUsd,
      brand: input.brand,
      model: input.model,
    }),
  });

  if (!res.ok) {
    throw new Error(`Flexiscore API ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  return {
    decision: (data.decision as FlexiscoreResult['decision']) ?? 'refer',
    score: Number(data.score ?? 0),
    maxLoanUsd: Number(data.max_loan_usd ?? 0),
    estimatedMonthlyUsd:
      data.estimated_monthly_usd == null ? null : Number(data.estimated_monthly_usd),
    termMonths: Number(data.term_months ?? 24),
    reasons: Array.isArray(data.reasons) ? (data.reasons as string[]) : [],
  };
}

/**
 * Transparent heuristic mock scorer.
 *
 * This is deliberately simple and explainable — it is NOT the production credit
 * model, just a stand-in so the agent behaves realistically end-to-end. Drivers:
 *   - Debt-to-income (DTI): estimated monthly payment vs declared income.
 *   - Downpayment ratio: skin in the game lowers risk.
 *   - Loan size sanity vs income.
 */
export function mockScore(input: FlexiscoreInput): FlexiscoreResult {
  const { monthlyIncomeUsd, downpaymentUsd, motorcyclePriceUsd } = input;
  const reasons: string[] = [];

  const loanRequested = Math.max(0, motorcyclePriceUsd - downpaymentUsd);
  const downpaymentRatio = motorcyclePriceUsd > 0 ? downpaymentUsd / motorcyclePriceUsd : 0;

  // Term scales with loan size (small loans amortise faster).
  const termMonths = loanRequested <= 1200 ? 18 : loanRequested <= 2200 ? 24 : 30;

  // Flat-ish APR proxy for the demo (~28% nominal → monthly factor).
  const monthlyRate = 0.0215;
  const estimatedMonthly =
    loanRequested === 0
      ? 0
      : Math.round(
          ((loanRequested * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))) * 100,
        ) / 100;

  const dti = monthlyIncomeUsd > 0 ? estimatedMonthly / monthlyIncomeUsd : 1;

  // Base score then adjust.
  let score = 600;
  if (downpaymentRatio >= 0.3) {
    score += 60;
    reasons.push('Prima sólida (≥30%)');
  } else if (downpaymentRatio >= 0.2) {
    score += 30;
    reasons.push('Prima adecuada (≥20%)');
  } else if (downpaymentRatio >= 0.1) {
    reasons.push('Prima baja (10–20%)');
  } else {
    score -= 40;
    reasons.push('Prima insuficiente (<10%)');
  }

  if (dti <= 0.2) {
    score += 80;
    reasons.push('Capacidad de pago holgada (cuota ≤20% del ingreso)');
  } else if (dti <= 0.3) {
    score += 40;
    reasons.push('Capacidad de pago dentro de política (cuota ≤30%)');
  } else if (dti <= 0.4) {
    score -= 30;
    reasons.push('Capacidad de pago ajustada (cuota 30–40%)');
  } else {
    score -= 90;
    reasons.push('Cuota demasiado alta para el ingreso (>40%)');
  }

  if (monthlyIncomeUsd >= 600) score += 20;
  if (monthlyIncomeUsd < 250) {
    score -= 40;
    reasons.push('Ingreso declarado bajo');
  }

  score = Math.max(300, Math.min(850, score));

  // Decision bands.
  let decision: FlexiscoreResult['decision'];
  if (score >= 660 && dti <= 0.35 && downpaymentRatio >= 0.1) {
    decision = 'approved';
  } else if (score >= 580) {
    decision = 'refer';
    reasons.push('Requiere revisión manual o ajuste de prima/plazo');
  } else {
    decision = 'declined';
  }

  // Max loan we'd extend given income (cap monthly at ~30% of income).
  const affordableMonthly = monthlyIncomeUsd * 0.3;
  const maxLoanUsd =
    Math.round(
      ((affordableMonthly * (1 - Math.pow(1 + monthlyRate, -termMonths))) / monthlyRate) * 1,
    ) || 0;

  return {
    decision,
    score,
    maxLoanUsd,
    estimatedMonthlyUsd: decision === 'declined' ? null : estimatedMonthly,
    termMonths,
    reasons,
  };
}
