"use client";

import type { ReactNode } from "react";

/** Shared, accessible form field primitives used by all site forms. */

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-ember-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint/70 transition-colors focus:border-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600/30";

export function SuccessMessage({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-ember-200 bg-ember-50 p-6 text-center"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mx-auto mb-3 h-10 w-10 stroke-ember-600"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
      </svg>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{body}</p>
    </div>
  );
}
