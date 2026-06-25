import express from 'express';
import { config } from './config.js';
import { logger } from './logger.js';
import { whatsappWebhook } from './whatsapp/webhook.js';
import { adminRoutes } from './server/adminRoutes.js';
import { activeProvider } from './whatsapp/provider.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.type('text/plain').send(
    'Flexiplan WhatsApp sales agent. See /healthz, POST /sim/message, GET /leads, GET /inventory.',
  );
});

app.use(whatsappWebhook);
app.use(adminRoutes);

app.listen(config.port, () => {
  logger.info(
    {
      port: config.port,
      model: config.anthropic.model,
      agent: config.anthropic.enabled ? 'ready' : 'NO API KEY',
      whatsapp: activeProvider(),
      flexiscore: config.flexiscore.live ? 'live' : 'mock',
    },
    'Flexiplan agent listening',
  );
});
