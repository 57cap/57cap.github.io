import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import StatsGrid from "@/components/home/StatsGrid";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/CtaBand";
import { updates, home } from "@/config/site";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Transparency reports, financial summaries, program updates, and student milestones from The Next Chapter Fund.",
};

export default function ImpactPage() {
  return (
    <>
      <section className="bg-cream-deep/60 px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            as="h1"
            eyebrow={home.transparency.eyebrow}
            headline={home.transparency.headline}
            copy={home.transparency.copy}
          />
        </div>
      </section>

      {/* Metrics */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="By the Numbers"
          headline="Real numbers, published as they happen."
          copy="We will never invent or inflate results. These metrics stay empty until there are real, verified figures to share."
        />
        <div className="mt-12">
          <StatsGrid />
        </div>
      </section>

      {/* Updates grid */}
      <section className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="Updates & Reports"
            headline="News from the next chapter."
            copy="Quarterly reports, financial summaries, program updates, videos, milestones, and donor stories will be published here."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {updates.map((update, i) => (
              <Reveal key={update.category} delay={(i % 3) * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-dashed border-ink/20 bg-white/60 p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-700">
                    {update.category}
                  </p>
                  <h3 className="font-display mt-3 text-xl font-semibold text-ink-faint">
                    {update.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {update.description}
                  </p>
                  <div
                    aria-hidden="true"
                    className="mt-auto pt-6 text-xs font-medium text-ink-faint/70"
                  >
                    Publishing after launch
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        headline="Be the reason the first report has something to celebrate."
        secondaryLabel="Sign Up for Updates"
        secondaryHref="/donate#updates"
      />
    </>
  );
}
