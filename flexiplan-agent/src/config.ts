import 'dotenv/config';

/**
 * Centralised, validated runtime configuration.
 *
 * The app is designed to boot and run end-to-end even with most integrations
 * unconfigured: WhatsApp falls back to "console" mode (replies are logged) and
 * Flexiscore falls back to the built-in mock scorer. This keeps local dev and
 * demos zero-setup while production simply fills in the env vars.
 */

function str(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback;
}

const anthropicApiKey = str('ANTHROPIC_API_KEY');

export const config = {
  env: str('NODE_ENV', 'development'),
  port: Number(str('PORT', '8080')),
  logLevel: str('LOG_LEVEL', 'info'),

  anthropic: {
    apiKey: anthropicApiKey,
    model: str('ANTHROPIC_MODEL', 'claude-opus-4-8'),
    effort: str('ANTHROPIC_EFFORT', 'medium') as
      | 'low'
      | 'medium'
      | 'high'
      | 'xhigh'
      | 'max',
    /** Without a key the agent cannot run; the server still boots for health checks. */
    enabled: anthropicApiKey.length > 0,
  },

  whatsapp: {
    token: str('WHATSAPP_TOKEN'),
    phoneNumberId: str('WHATSAPP_PHONE_NUMBER_ID'),
    apiVersion: str('WHATSAPP_API_VERSION', 'v21.0'),
    verifyToken: str('WHATSAPP_VERIFY_TOKEN', 'flexiplan-verify-change-me'),
    /** When false, outbound messages are logged instead of sent (console mode). */
    get live(): boolean {
      return Boolean(this.token && this.phoneNumberId);
    },
  },

  flexiscore: {
    apiUrl: str('FLEXISCORE_API_URL'),
    apiKey: str('FLEXISCORE_API_KEY'),
    /** When false, the built-in heuristic mock scorer is used. */
    get live(): boolean {
      return Boolean(this.apiUrl);
    },
  },

  ops: {
    notifyEmail: str('OPS_NOTIFY_EMAIL'),
    smtpUrl: str('SMTP_URL'),
  },
} as const;

export type AppConfig = typeof config;
