import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import DonationWidget from "@/components/donate/DonationWidget";
import Reveal from "@/components/ui/Reveal";
import PartnerForm from "@/components/forms/PartnerForm";
import ContactForm from "@/components/forms/ContactForm";
import EmailSignupForm from "@/components/forms/EmailSignupForm";
import {
  donationLevels,
  donationDisclaimers,
  donationFaq,
  donationUrl,
  programAreas,
  contact,
} from "@/config/site";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support the education, artistic development, and long-term opportunities of the Ghetto Kids of Uganda with a one-time or monthly gift.",
};

export default function DonatePage() {
  const donateIsExternal = donationUrl.startsWith("http");

  return (
    <>
      {/* Hero + widget */}
      <section id="give" className="bg-cream-deep/60 px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              as="h1"
              eyebrow="Donate"
              headline="Be part of their next chapter."
              copy="The world has seen what these young artists can do. What happens next depends on the education, training, and stability they can count on. Every contribution helps provide the education, training, stability, and opportunities these young artists need to continue growing."
            />
            <Reveal delay={0.1} className="mt-8">
              <a
                href={donationUrl}
                {...(donateIsExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center rounded-full bg-ink px-10 py-4 text-base font-semibold text-cream transition-all duration-200 hover:bg-ink-soft motion-safe:hover:-translate-y-0.5"
              >
                Give on Our Donation Page
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="ml-2 h-4 w-4 stroke-current"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <DonationWidget />
          </Reveal>
        </div>
      </section>

      {/* Giving levels */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Giving Levels"
          headline="What your gift can do."
        />
        <div className="mt-12 space-y-3">
          {donationLevels.map((level, i) => (
            <Reveal key={level.amount} delay={i * 0.05}>
              <div className="flex items-baseline gap-6 rounded-2xl bg-white p-6 ring-1 ring-ink/8 sm:gap-10 sm:p-7">
                <p className="font-display w-20 shrink-0 text-3xl font-semibold text-ember-600 sm:w-24 sm:text-4xl">
                  ${level.amount}
                </p>
                <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
                  <span className="font-semibold text-ink">${level.amount}</span>{" "}
                  {level.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="text-sm italic leading-relaxed text-ink-faint">
            {donationDisclaimers.illustrative}
          </p>
        </Reveal>
      </section>

      {/* Use of funds */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="Use of Funds"
            headline="Where your support goes."
            copy="Donations are directed across six areas of support, allocated to the children's most important needs — and reported back to you."
            align="center"
            dark
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programAreas.map((area, i) => (
              <Reveal key={area.title} delay={(i % 3) * 0.07}>
                <li className="h-full rounded-2xl bg-cream/5 p-6 ring-1 ring-cream/15">
                  <h3 className="font-display text-lg font-semibold text-cream">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">
                    {area.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Donation FAQ"
          headline="Questions, answered."
          align="center"
        />
        <div className="mt-12 space-y-4">
          {donationFaq.map((item) => (
            <Reveal key={item.question}>
              <details className="group rounded-2xl bg-white ring-1 ring-ink/8 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 stroke-ember-600 transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Email updates */}
      <section id="updates" className="bg-cream-deep/60">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="Stay Close to the Story"
            headline="Get updates as the next chapter unfolds."
            copy="Progress reports, milestones, and news — straight to your inbox. No spam, ever."
          />
          <Reveal className="mt-10">
            <EmailSignupForm />
          </Reveal>
        </div>
      </section>

      {/* Partner inquiry */}
      <section id="partner" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Major Gifts & Partnerships"
              headline="Go further with us."
              copy="For major gifts, corporate partnerships, and institutional collaboration, we'd love to talk. Tell us about your organization and how you'd like to be involved — or email us directly."
            />
            <Reveal delay={0.1} className="mt-6">
              <a
                href={`mailto:${contact.email}`}
                className="font-semibold text-ember-700 underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/8 sm:p-9">
              <PartnerForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <SectionHeading
              eyebrow="Contact"
              headline="Have a question? We're listening."
              copy="For anything else — questions about donations, the children, the fund, or press inquiries — send us a message."
            />
            <Reveal delay={0.15}>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/8 sm:p-9">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
