"use client";

import { useState } from "react";
import { submitForm, isValidEmail } from "@/lib/forms";
import { Field, inputClasses, SuccessMessage } from "@/components/forms/fields";

/**
 * Email signup: first name, last name, email, country.
 * `compact` renders the dark, footer-friendly variant.
 */
export default function EmailSignupForm({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.firstName.trim()) next.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!isValidEmail(values.email)) next.email = "Please enter a valid email address.";
    if (!values.country.trim()) next.country = "Please enter your country.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    const result = await submitForm("email-signup", values);
    setStatus(result.ok ? "done" : "error");
  }

  if (status === "done") {
    return compact ? (
      <p role="status" className="text-sm font-medium text-cream">
        You&apos;re on the list — thank you. We&apos;ll share updates as the next
        chapter unfolds.
      </p>
    ) : (
      <SuccessMessage
        title="You're on the list."
        body="Thank you — we'll share updates as the next chapter unfolds."
      />
    );
  }

  const compactInput =
    "w-full rounded-xl border border-cream/20 bg-cream/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:border-ember-400 focus:outline-none focus:ring-2 focus:ring-ember-400/40";

  if (compact) {
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="footer-first-name" className="sr-only">
              First name
            </label>
            <input
              id="footer-first-name"
              name="firstName"
              autoComplete="given-name"
              placeholder="First name"
              value={values.firstName}
              onChange={(e) => set("firstName")(e.target.value)}
              className={compactInput}
              aria-invalid={!!errors.firstName}
            />
          </div>
          <div>
            <label htmlFor="footer-last-name" className="sr-only">
              Last name
            </label>
            <input
              id="footer-last-name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Last name"
              value={values.lastName}
              onChange={(e) => set("lastName")(e.target.value)}
              className={compactInput}
              aria-invalid={!!errors.lastName}
            />
          </div>
        </div>
        <div>
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            className={compactInput}
            aria-invalid={!!errors.email}
          />
        </div>
        <div>
          <label htmlFor="footer-country" className="sr-only">
            Country
          </label>
          <input
            id="footer-country"
            name="country"
            autoComplete="country-name"
            placeholder="Country"
            value={values.country}
            onChange={(e) => set("country")(e.target.value)}
            className={compactInput}
            aria-invalid={!!errors.country}
          />
        </div>
        {Object.values(errors)[0] && (
          <p role="alert" className="text-xs text-ember-300">
            {Object.values(errors)[0]}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-xs text-ember-300">
            Something went wrong. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-ember-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ember-500 disabled:opacity-60"
        >
          {status === "sending" ? "Signing up…" : "Sign up for updates"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="signup-first-name" label="First name" error={errors.firstName}>
          <input
            id="signup-first-name"
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => set("firstName")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "signup-first-name-error" : undefined}
          />
        </Field>
        <Field id="signup-last-name" label="Last name" error={errors.lastName}>
          <input
            id="signup-last-name"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => set("lastName")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "signup-last-name-error" : undefined}
          />
        </Field>
      </div>
      <Field id="signup-email" label="Email" error={errors.email}>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
        />
      </Field>
      <Field id="signup-country" label="Country" error={errors.country}>
        <input
          id="signup-country"
          name="country"
          autoComplete="country-name"
          value={values.country}
          onChange={(e) => set("country")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? "signup-country-error" : undefined}
        />
      </Field>
      {status === "error" && (
        <p role="alert" className="text-sm text-ember-700">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-ember-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ember-600/25 transition-all hover:bg-ember-700 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? "Signing up…" : "Sign up for updates"}
      </button>
    </form>
  );
}
