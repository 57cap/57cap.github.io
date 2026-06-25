import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import { logger } from '../logger.js';
import type { StoredMessage } from '../types.js';
import { appendMessage, getConversation, getLead } from '../store/store.js';
import { buildSystemPrompt } from './systemPrompt.js';
import { buildTools } from './tools.js';

const client = config.anthropic.enabled ? new Anthropic({ apiKey: config.anthropic.apiKey }) : null;

/** Keep the last N turns in context; durable facts live in the lead snapshot. */
const HISTORY_LIMIT = 24;

/**
 * Handle one inbound customer message and return the agent's reply text.
 *
 * Flow: load conversation + lead → build per-conversation tools and system
 * prompt → run the Anthropic tool runner (it executes tools and loops until the
 * agent produces a final answer) → persist and return the reply.
 */
export async function handleCustomerMessage(params: {
  conversationId: string;
  contact: string;
  name?: string;
  text: string;
}): Promise<string> {
  const { conversationId, contact, text } = params;

  if (!client) {
    return 'El asistente no está configurado todavía (falta ANTHROPIC_API_KEY). Un asesor te contactará pronto.';
  }

  // Capture the first display name we see.
  const lead = getLead(conversationId, contact);
  if (params.name && !lead.name) lead.name = params.name;

  const convo = getConversation(conversationId, contact);
  appendMessage(conversationId, { role: 'user', content: text, at: new Date().toISOString() });

  const tools = buildTools({ conversationId, contact });
  const system = buildSystemPrompt(lead);
  const messages = toAnthropicMessages(convo.messages.slice(-HISTORY_LIMIT));

  try {
    const finalMessage = await client.beta.messages.toolRunner({
      model: config.anthropic.model,
      max_tokens: 1024,
      system,
      thinking: { type: 'adaptive' },
      output_config: { effort: config.anthropic.effort },
      tools,
      messages,
      max_iterations: 8,
    });

    const reply = extractText(finalMessage) || 'Disculpa, ¿me lo puedes repetir?';
    appendMessage(conversationId, {
      role: 'assistant',
      content: reply,
      at: new Date().toISOString(),
    });
    return reply;
  } catch (err) {
    logger.error({ err, conversationId }, 'Sales agent failed');
    return 'Tuvimos un problema técnico por un momento. ¿Puedes intentar de nuevo en un ratito?';
  }
}

/** Convert stored history into the alternating user/assistant shape the API expects. */
function toAnthropicMessages(history: StoredMessage[]): Anthropic.Beta.BetaMessageParam[] {
  const msgs: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  // The API requires the first message to be from the user.
  while (msgs.length > 0 && msgs[0]!.role !== 'user') msgs.shift();
  return msgs;
}

function extractText(message: Anthropic.Beta.BetaMessage): string {
  return message.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}
