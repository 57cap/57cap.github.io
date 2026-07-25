/**
 * Form submission abstraction.
 *
 * All site forms (email signup, partner inquiry, contact) call
 * `submitForm`. Today it runs in one of two modes:
 *
 * 1. If NEXT_PUBLIC_FORM_ENDPOINT is set (e.g. a Formspree URL),
 *    submissions POST there as JSON.
 * 2. Otherwise it simulates a short delay and succeeds, so the
 *    front-end validation and success states can be reviewed
 *    without a backend.
 *
 * To connect a provider later (Formspree, HubSpot, Mailchimp, a
 * custom API route, …), either set the env var or replace the
 * body of this function — no component changes needed.
 */

export type FormKind = "email-signup" | "partner-inquiry" | "contact";

export type FormResult = { ok: true } | { ok: false; error: string };

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export async function submitForm(
  kind: FormKind,
  data: Record<string, string>
): Promise<FormResult> {
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ formKind: kind, ...data }),
      });
      if (!res.ok) {
        return { ok: false, error: "Something went wrong. Please try again." };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  // Demo mode: simulate a successful submission.
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
