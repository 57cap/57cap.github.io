import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import PhaseCards from "@/components/home/PhaseCards";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/CtaBand";
import { roadmap } from "@/config/site";

export const metadata: Metadata = {
  title: "The Plan",
  description:
    "Three phases and a sample twelve-month roadmap: from immediate support to talent development and long-term opportunity for the Ghetto Kids.",
};

export default function ThePlanPage() {
  return (
    <>
      <section className="bg-cream-deep/60 px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            as="h1"
            eyebrow="The Plan"
            headline="A clear path from this moment to their future."
            copy="Lasting change doesn't happen in a single donation or a single performance. It happens in phases — starting with what the children need today, and building deliberately toward lifelong opportunity."
          />
        </div>
      </section>

      {/* Three phases, detailed */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <PhaseCards detailed />
      </section>

      {/* Twelve-month roadmap */}
      <section className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="Sample Roadmap"
            headline="The first twelve months."
            copy="A sample roadmap for year one. Timing and priorities will adapt to the children's needs — and we'll report progress openly along the way."
          />
          <ol className="mt-14 space-y-5">
            {roadmap.map((item, i) => (
              <Reveal key={item.period} delay={i * 0.06}>
                <li className="grid gap-4 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-ink/8 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-700">
                      {item.period}
                    </p>
                    <p className="font-display mt-1 text-2xl font-semibold text-ink">
                      {item.focus}
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {item.items.map((task) => (
                      <li key={task} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500"
                        />
                        {task}
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Responsible development note */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-ember-200 bg-ember-50 p-8 sm:p-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Developed responsibly, with professional guidance
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              This roadmap is a working plan, not a set of promises. Any international
              programs — including travel, exchanges, or study opportunities — will be
              developed with qualified legal, educational, and child-welfare
              professionals, and always with the consent of the children&apos;s
              guardians. We do not make commitments regarding visas, guardianship,
              immigration, schooling, employment, or travel.
            </p>
          </div>
        </Reveal>
      </section>

      <CtaBand
        headline="Phase one starts with you."
        secondaryLabel="See Our Impact"
        secondaryHref="/impact"
      />
    </>
  );
}
