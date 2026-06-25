import { Router, type Request, type Response } from 'express';
import { config } from '../config.js';
import { handleCustomerMessage } from '../agent/salesAgent.js';
import { allInventoryChecks, allLeads } from '../store/store.js';
import { activeProvider } from '../whatsapp/provider.js';

/**
 * Internal/admin + demo routes.
 *
 * NOTE: these are unauthenticated for the MVP. Put them behind auth / network
 * policy before any real deployment (they expose lead PII and let anyone drive
 * the agent via /sim/message).
 */
export const adminRoutes = Router();

adminRoutes.get('/healthz', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    agent: config.anthropic.enabled ? 'ready' : 'no_api_key',
    whatsapp_provider: activeProvider(),
    flexiscore: config.flexiscore.live ? 'live' : 'mock',
    model: config.anthropic.model,
  });
});

adminRoutes.get('/leads', (_req: Request, res: Response) => {
  res.json({ count: allLeads().length, leads: allLeads() });
});

adminRoutes.get('/inventory', (_req: Request, res: Response) => {
  res.json({ count: allInventoryChecks().length, checks: allInventoryChecks() });
});

/**
 * Simulator endpoint — drive the agent over HTTP without WhatsApp.
 *   POST /sim/message { "contact": "demo-1", "text": "hola" }
 * Returns the agent's reply. Great for the web demo and curl testing.
 */
adminRoutes.post('/sim/message', async (req: Request, res: Response) => {
  const body = req.body as { contact?: string; text?: string };
  const contact = (body.contact || 'sim-default').toString();
  const text = (body.text || '').toString();
  if (!text) {
    res.status(400).json({ error: 'text is required' });
    return;
  }
  const reply = await handleCustomerMessage({ conversationId: contact, contact, text });
  res.json({ contact, reply });
});
