"use client";

import { useState } from "react";
import { submitForm, isValidEmail } from "@/lib/forms";
import { Field, inputClasses, SuccessMessage } from "@/components/forms/fields";

/** Contact form: name, email, subject, message. */
export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
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
    if (!isValidEmail(values.email)) next.email = "Please enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Please enter a subject.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    const result = await submitForm("contact", values);
    setStatus(result.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <SuccessMessage
        title="Message sent."
        body="Thank you — we'll get back to you as soon as we can."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            className={inputClasses}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
        </Field>
      </div>
      <Field id="contact-subject" label="Subject" error={errors.subject}>
        <input
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={(e) => set("subject")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
      </Field>
      <Field id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          className={inputClasses}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
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
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
