/**
 * Interactive CLI to chat with the sales agent locally — no WhatsApp, no server.
 *
 *   npm run simulate
 *
 * Requires ANTHROPIC_API_KEY in your env / .env. Flexiscore runs in mock mode
 * unless FLEXISCORE_API_URL is set. Type "salir" to quit.
 */
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { handleCustomerMessage } from '../src/agent/salesAgent.js';
import { config } from '../src/config.js';

async function main() {
  if (!config.anthropic.enabled) {
    console.error('⚠  Falta ANTHROPIC_API_KEY. Copia .env.example a .env y agrégala.');
    process.exit(1);
  }

  const contact = `cli-${Date.now()}`;
  const rl = readline.createInterface({ input, output });

  console.log('— Simulador Flexiplan (WhatsApp AI) —');
  console.log(`modelo: ${config.anthropic.model} · flexiscore: ${config.flexiscore.live ? 'API' : 'mock'}`);
  console.log('Escribe un mensaje (o "salir" para terminar).\n');

  // Let the agent open the conversation naturally.
  const opener = await handleCustomerMessage({ contact, conversationId: contact, text: 'Hola' });
  console.log(`Sofía: ${opener}\n`);

  for (;;) {
    const user = (await rl.question('Tú: ')).trim();
    if (!user || user.toLowerCase() === 'salir') break;
    const reply = await handleCustomerMessage({ contact, conversationId: contact, text: user });
    console.log(`\nSofía: ${reply}\n`);
  }

  rl.close();
  console.log('¡Hasta luego!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
