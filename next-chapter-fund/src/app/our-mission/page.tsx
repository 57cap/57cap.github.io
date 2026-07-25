import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/CtaBand";
import { missionPage, team } from "@/config/site";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Helping extraordinary young artists build extraordinary futures — our mission, vision, guiding principles, and commitments.",
};

export default function OurMissionPage() {
  return (
    <>
      <section className="bg-cream-deep/60 px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            as="h1"
            eyebrow="Our Mission"
            headline="Helping extraordinary young artists build extraordinary futures."
            copy={missionPage.mission}
          />
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Our Vision"
            headline="Talent that goes as far as they choose — rooted in the place that shaped them."
            copy={missionPage.vision}
          />
          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-ink p-8 sm:p-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-300">
                Guiding Principles
              </h3>
              <ul className="mt-6 space-y-4">
                {missionPage.principles.map((principle, i) => (
                  <li key={principle} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display mt-0.5 text-sm font-semibold text-ember-400"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-medium text-cream">
                      {principle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="Our Commitments"
            headline="What we promise — to the children, their guardians, and every donor."
            align="center"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {missionPage.commitments.map((commitment, i) => (
              <Reveal key={commitment.title} delay={i * 0.08}>
                <article className="h-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/8">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {commitment.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {commitment.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team / advisors */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Team & Advisors"
          headline="The people behind the fund."
          copy="Names, roles, and bios will be published here once confirmed."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, i) => (
            <Reveal key={`${person.name}-${person.role}`} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-dashed border-ink/20 bg-white/50 p-7">
                <div
                  aria-hidden="true"
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ember-100 font-display text-xl font-semibold text-ember-700"
                >
                  ?
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-ember-700">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-faint">
                  {person.bio}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        headline="A mission is only as strong as the people behind it. Join us."
        secondaryLabel="Read the Plan"
        secondaryHref="/the-plan"
      />
    </>
  );
}
