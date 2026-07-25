"use client";

import { useState } from "react";
import { donationLevels, donationUrl, donationDisclaimers } from "@/config/site";

type Frequency = "one-time" | "monthly";

/**
 * Front-end donation widget. Selections are appended to the
 * configured donation platform URL (NEXT_PUBLIC_DONATION_URL) as
 * query parameters, which Givebutter and similar platforms can
 * read. The actual payment always happens on the platform.
 */
export default function DonationWidget() {
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [amount, setAmount] = useState<number | "custom">(100);
  const [customAmount, setCustomAmount] = useState("");
  const [dedication, setDedication] = useState("");
  const [wantsUpdates, setWantsUpdates] = useState(true);

  const resolvedAmount =
    amount === "custom" ? Number.parseFloat(customAmount) || 0 : amount;

  function buildDonateHref(): string {
    if (!donationUrl.startsWith("http")) return donationUrl;
    try {
      const url = new URL(donationUrl);
      if (resolvedAmount > 0) url.searchParams.set("amount", String(resolvedAmount));
      if (frequency === "monthly") url.searchParams.set("recurring", "monthly");
      return url.toString();
    } catch {
      return donationUrl;
    }
  }

  const donateIsExternal = donationUrl.startsWith("http");

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink/8 sm:p-9">
      {/* Frequency toggle */}
      <fieldset>
        <legend className="sr-only">Donation frequency</legend>
        <div className="grid grid-cols-2 gap-1.5 rounded-full bg-cream-deep p-1.5">
          {(
            [
              ["one-time", "One-time"],
              ["monthly", "Monthly"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="relative">
              <input
                type="radio"
                name="frequency"
                value={value}
                checked={frequency === value}
                onChange={() => setFrequency(value)}
                className="peer sr-only"
              />
              <span className="flex cursor-pointer items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-ink-soft transition-all peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline-3 peer-focus-visible:outline-ember-600">
                {label}
                {value === "monthly" && (
                  <span className="ml-2 hidden rounded-full bg-ember-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white peer-checked:inline sm:inline">
                    Most impact
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Amount selection */}
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-ink">
          Choose an amount {frequency === "monthly" && "(per month)"}
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {donationLevels.map((level) => (
            <label key={level.amount}>
              <input
                type="radio"
                name="amount"
                value={level.amount}
                checked={amount === level.amount}
                onChange={() => setAmount(level.amount)}
                className="peer sr-only"
              />
              <span className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-ink/10 px-3 py-3.5 text-base font-semibold text-ink transition-all hover:border-ink/30 peer-checked:border-ember-600 peer-checked:bg-ember-50 peer-checked:text-ember-700 peer-focus-visible:outline-3 peer-focus-visible:outline-ember-600">
                ${level.amount}
              </span>
            </label>
          ))}
          <label>
            <input
              type="radio"
              name="amount"
              value="custom"
              checked={amount === "custom"}
              onChange={() => setAmount("custom")}
              className="peer sr-only"
            />
            <span className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-ink/10 px-3 py-3.5 text-sm font-semibold text-ink transition-all hover:border-ink/30 peer-checked:border-ember-600 peer-checked:bg-ember-50 peer-checked:text-ember-700 peer-focus-visible:outline-3 peer-focus-visible:outline-ember-600">
              Custom
            </span>
          </label>
        </div>
        {amount === "custom" && (
          <div className="mt-3">
            <label htmlFor="custom-amount" className="sr-only">
              Custom amount in US dollars
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-ink-faint"
              >
                $
              </span>
              <input
                id="custom-amount"
                type="number"
                min={1}
                step={1}
                inputMode="decimal"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full rounded-xl border-2 border-ink/10 bg-white py-3.5 pl-9 pr-4 text-base font-semibold text-ink focus:border-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600/30"
              />
            </div>
          </div>
        )}
      </fieldset>

      {/* Optional dedication */}
      <div className="mt-6">
        <label htmlFor="dedication" className="mb-1.5 block text-sm font-semibold text-ink">
          Dedication <span className="font-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id="dedication"
          type="text"
          placeholder="In honor of…"
          value={dedication}
          onChange={(e) => setDedication(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint/70 focus:border-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600/30"
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          You can add your dedication during checkout on our donation platform.
        </p>
      </div>

      {/* Email updates */}
      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={wantsUpdates}
          onChange={(e) => setWantsUpdates(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-ink/25 accent-ember-600"
        />
        <span className="text-sm text-ink-soft">
          Email me updates about the children&apos;s progress and how funds are used.
        </span>
      </label>

      {/* Donate button */}
      <a
        href={buildDonateHref()}
        {...(donateIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-7 flex w-full items-center justify-center rounded-full bg-ember-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-ember-600/30 transition-all duration-200 hover:bg-ember-700 motion-safe:hover:-translate-y-0.5"
      >
        {frequency === "monthly"
          ? `Give $${resolvedAmount > 0 ? resolvedAmount : "—"} monthly`
          : `Donate $${resolvedAmount > 0 ? resolvedAmount : "—"}`}
      </a>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-ink-faint">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 stroke-current"
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        {donationDisclaimers.secure}
      </p>
      <p className="mt-2 text-center text-xs text-ink-faint">
        {donationDisclaimers.taxStatus}
      </p>
    </div>
  );
}
