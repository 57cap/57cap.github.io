"use client";

import { useState } from "react";
import { submitForm, isValidEmail } from "@/lib/forms";
import { Field, inputClasses, SuccessMessage } from "@/components/forms/fields";
import { partnershipTypes } from "@/config/site";

/** Partner inquiry: name, organization, email, type of partnership, message. */
export default function PartnerForm() {
  const [values, setValues] = useState({
    name: "",
    organization: "",
    email: "",
    partnershipType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.organization.trim())
      next.organization = "Please enter your organization.";
    if (!isValidEmail(values.email)) next.email = "Please enter a valid email address.";
    if (!values.partnershipType)
      next.partnershipType = "Please choose a partnership type.";
    if (!values.message.trim()) next.message = "Please tell us a little about your idea.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    const result = await submitForm("partner-inquiry", values);
    setStatus(result.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <SuccessMessage
        title="Thank you for reaching out."
        body="We've received your inquiry and will get back to you soon."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="partner-name" label="Name" error={errors.name}>
          <input
            id="partner-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "partner-name-error" : undefined}
          />
        </Field>
        <Field id="partner-org" label="Organization" error={errors.organization}>
          <input
            id="partner-org"
            name="organization"
            autoComplete="organization"
            value={values.organization}
            onChange={(e) => set("organization")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.organization}
            aria-describedby={errors.organization ? "partner-org-error" : undefined}
          />
        </Field>
      </div>
      <Field id="partner-email" label="Email" error={errors.email}>
        <input
          id="partner-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "partner-email-error" : undefined}
        />
      </Field>
      <Field
        id="partner-type"
        label="Type of partnership"
        error={errors.partnershipType}
      >
        <select
          id="partner-type"
          name="partnershipType"
          value={values.partnershipType}
          onChange={(e) => set("partnershipType")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.partnershipType}
          aria-describedby={errors.partnershipType ? "partner-type-error" : undefined}
        >
          <option value="">Select…</option>
          {partnershipTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>
      <Field id="partner-message" label="Message" error={errors.message}>
        <textarea
          id="partner-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "partner-message-error" : undefined}
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
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
