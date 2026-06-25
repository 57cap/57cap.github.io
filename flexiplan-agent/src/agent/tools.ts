import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { logger } from '../logger.js';
import type { Department } from '../types.js';
import { getMotorcycle, searchCatalog } from '../catalog/motorcycles.js';
import { findDealers, getDealer } from '../catalog/dealers.js';
import { runFlexiscore } from '../flexiscore/client.js';
import {
  getInventoryCheck,
  getLead,
  inventoryChecksFor,
  updateLead,
} from '../store/store.js';
import {
  openInventoryCheck,
  reserveWithDealer,
} from '../inventory/verificationAgent.js';

/** Per-conversation context the tools operate against. */
export interface ToolContext {
  conversationId: string;
  contact: string;
}

const DEPARTMENTS: Department[] = [
  'San Salvador',
  'La Libertad',
  'Santa Ana',
  'San Miguel',
  'Sonsonate',
  'Usulután',
  'La Paz',
  'Ahuachapán',
  'Cuscatlán',
  'Otro',
];

function coerceDepartment(input?: string): Department {
  if (!input) return 'Otro';
  const hit = DEPARTMENTS.find((d) => d.toLowerCase() === input.toLowerCase().trim());
  return hit ?? 'Otro';
}

/**
 * Build the tool set bound to a single conversation. Each tool's `run` mutates
 * the shared lead/inventory stores so state persists across turns.
 */
export function buildTools(ctx: ToolContext) {
  const searchCatalogTool = betaZodTool({
    name: 'search_catalog',
    description:
      'Search the Flexiplan motorcycle catalog. Use to recommend bikes by brand, ' +
      'budget, or use case. Returns id, brand, model, price (USD), engine cc and highlights. ' +
      'Always use the returned id when later prequalifying or verifying inventory.',
    inputSchema: z.object({
      brand: z.string().optional().describe('Marca, ej. Honda, Bajaj, Yamaha'),
      max_price_usd: z.number().optional().describe('Presupuesto máximo en USD'),
      use_case: z
        .string()
        .optional()
        .describe('Uso: trabajo, delivery, ciudad, carretera, economico'),
    }),
    run: async (input) => {
      const results = searchCatalog({
        brand: input.brand,
        maxPriceUsd: input.max_price_usd,
        useCase: input.use_case,
      });
      return JSON.stringify({
        count: results.length,
        motorcycles: results.map((m) => ({
          id: m.id,
          brand: m.brand,
          model: m.model,
          price_usd: m.priceUsd,
          engine_cc: m.engineCc,
          highlights: m.highlights,
        })),
      });
    },
  });

  const updateLeadTool = betaZodTool({
    name: 'update_lead_profile',
    description:
      "Save what you've learned about the customer (name, department). Call this as " +
      'soon as you learn their name or location so we can route them to a nearby dealer.',
    inputSchema: z.object({
      name: z.string().optional().describe('Nombre del cliente'),
      department: z
        .string()
        .optional()
        .describe('Departamento de El Salvador donde vive el cliente'),
    }),
    run: async (input) => {
      const patch: Record<string, unknown> = {};
      if (input.name) patch.name = input.name;
      if (input.department) patch.department = coerceDepartment(input.department);
      updateLead(ctx.conversationId, patch);
      return JSON.stringify({ ok: true, saved: patch });
    },
  });

  const prequalifyTool = betaZodTool({
    name: 'prequalify_flexiscore',
    description:
      'Run the Flexiscore credit prequalification for a specific motorcycle. ' +
      'Requires the customer DUI, monthly income (USD), downpayment (USD) and the ' +
      'motorcycle id from the catalog. Returns an approval decision, score, estimated ' +
      'monthly payment, term, and max loan. Only call once you have all four inputs.',
    inputSchema: z.object({
      dui: z.string().describe('DUI del cliente (Documento Único de Identidad)'),
      monthly_income_usd: z.number().describe('Ingreso mensual declarado en USD'),
      downpayment_usd: z.number().describe('Prima / enganche disponible en USD'),
      motorcycle_id: z.string().describe('id de la moto seleccionada del catálogo'),
    }),
    run: async (input) => {
      const moto = getMotorcycle(input.motorcycle_id);
      if (!moto) {
        return JSON.stringify({
          error: `motorcycle_id desconocido: ${input.motorcycle_id}. Usa search_catalog primero.`,
        });
      }

      const result = await runFlexiscore({
        dui: input.dui,
        monthlyIncomeUsd: input.monthly_income_usd,
        downpaymentUsd: input.downpayment_usd,
        motorcyclePriceUsd: moto.priceUsd,
        brand: moto.brand,
        model: moto.model,
      });

      updateLead(ctx.conversationId, {
        dui: input.dui,
        monthlyIncomeUsd: input.monthly_income_usd,
        downpaymentUsd: input.downpayment_usd,
        interestedMotorcycleId: moto.id,
        flexiscore: result,
        stage:
          result.decision === 'approved'
            ? 'prequalified'
            : result.decision === 'declined'
              ? 'declined'
              : 'qualifying',
      });

      logger.info(
        { conversationId: ctx.conversationId, decision: result.decision, score: result.score },
        'Flexiscore evaluated',
      );

      return JSON.stringify({
        decision: result.decision,
        score: result.score,
        estimated_monthly_usd: result.estimatedMonthlyUsd,
        term_months: result.termMonths,
        max_loan_usd: result.maxLoanUsd,
        downpayment_usd: input.downpayment_usd,
        motorcycle: { id: moto.id, brand: moto.brand, model: moto.model, price_usd: moto.priceUsd },
        reasons: result.reasons,
      });
    },
  });

  const findDealersTool = betaZodTool({
    name: 'find_dealers_and_verify',
    description:
      'Find dealers that carry the selected motorcycle near the customer and start a ' +
      'background inventory verification. Call ONLY after Flexiscore returns "approved". ' +
      'Returns a check_id you can poll with check_inventory_status, plus dealer details.',
    inputSchema: z.object({
      motorcycle_id: z.string().describe('id de la moto pre-aprobada'),
      department: z
        .string()
        .optional()
        .describe('Departamento del cliente para buscar distribuidor cercano'),
    }),
    run: async (input) => {
      const moto = getMotorcycle(input.motorcycle_id);
      if (!moto) {
        return JSON.stringify({ error: `motorcycle_id desconocido: ${input.motorcycle_id}` });
      }
      const lead = getLead(ctx.conversationId, ctx.contact);
      const department = coerceDepartment(input.department ?? lead.department);

      // Prefer dealers in the customer's department; otherwise any dealer carrying the brand.
      let dealers = findDealers(moto.brand, department);
      let broadened = false;
      if (dealers.length === 0) {
        dealers = findDealers(moto.brand);
        broadened = true;
      }
      if (dealers.length === 0) {
        return JSON.stringify({
          error: `No hay distribuidores para ${moto.brand} en este momento.`,
        });
      }

      const dealer = dealers[0]!;
      const check = await openInventoryCheck({
        conversationId: ctx.conversationId,
        brand: moto.brand,
        model: moto.model,
        department,
        dealerId: dealer.id,
      });

      return JSON.stringify({
        check_id: check.id,
        status: check.status,
        broadened_search: broadened,
        dealer: {
          id: dealer.id,
          name: dealer.name,
          department: dealer.department,
          address: dealer.address,
          phone: dealer.phone,
        },
        note: 'Verificación de inventario iniciada. Confirma disponibilidad con check_inventory_status antes de cerrar.',
      });
    },
  });

  const checkStatusTool = betaZodTool({
    name: 'check_inventory_status',
    description:
      'Check the latest status of a background inventory verification by check_id. ' +
      'Status is one of pending, contacted, available, unavailable, reserved. Poll this ' +
      'before telling the customer the bike is confirmed.',
    inputSchema: z.object({
      check_id: z.string().describe('id devuelto por find_dealers_and_verify'),
    }),
    run: async (input) => {
      const check = getInventoryCheck(input.check_id);
      if (!check) return JSON.stringify({ error: `check_id desconocido: ${input.check_id}` });
      const dealer = getDealer(check.dealerId);
      return JSON.stringify({
        check_id: check.id,
        status: check.status,
        brand: check.brand,
        model: check.model,
        dealer: dealer ? { name: dealer.name, address: dealer.address } : null,
        notes: check.notes,
      });
    },
  });

  const reserveTool = betaZodTool({
    name: 'confirm_sale_and_reserve',
    description:
      'Confirm the sale and instruct the dealer to HOLD the bike for this customer ' +
      '(do not sell to anyone else). Call only when inventory status is "available" and the ' +
      'customer has agreed to proceed. Returns dealer address/phone to give the customer.',
    inputSchema: z.object({
      check_id: z.string().describe('id de la verificación con estado "available"'),
      customer_name: z.string().describe('Nombre del cliente para apartar la unidad'),
    }),
    run: async (input) => {
      const check = getInventoryCheck(input.check_id);
      if (!check) return JSON.stringify({ error: `check_id desconocido: ${input.check_id}` });
      if (check.status !== 'available' && check.status !== 'reserved') {
        return JSON.stringify({
          error: `No se puede apartar: el estado es "${check.status}". Verifica disponibilidad primero.`,
        });
      }

      const updated = await reserveWithDealer(input.check_id, input.customer_name, ctx.contact);
      const dealer = getDealer(check.dealerId);
      updateLead(ctx.conversationId, {
        name: input.customer_name,
        stage: 'referred_to_dealer',
        dealerId: check.dealerId,
      });

      return JSON.stringify({
        ok: true,
        status: updated?.status ?? 'reserved',
        dealer: dealer
          ? {
              name: dealer.name,
              address: dealer.address,
              phone: dealer.phone,
              department: dealer.department,
            }
          : null,
        message:
          'Unidad apartada con el distribuidor. Dale al cliente la dirección y teléfono, ' +
          'y dile que pregunte por Flexiplan al llegar.',
      });
    },
  });

  return [
    searchCatalogTool,
    updateLeadTool,
    prequalifyTool,
    findDealersTool,
    checkStatusTool,
    reserveTool,
  ];
}

/** Snapshot of any open inventory checks — surfaced to the agent in its prompt. */
export function inventorySnapshot(conversationId: string): string {
  const checks = inventoryChecksFor(conversationId);
  if (checks.length === 0) return 'ninguna';
  return checks
    .map((c) => `check_id=${c.id} (${c.brand} ${c.model}) estado=${c.status}`)
    .join('; ');
}
