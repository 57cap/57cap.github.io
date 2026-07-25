import Hero from "@/components/home/Hero";
import SupportGrid from "@/components/home/SupportGrid";
import PhaseCards from "@/components/home/PhaseCards";
import StatsGrid from "@/components/home/StatsGrid";
import DonationWidget from "@/components/donate/DonationWidget";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import ButtonLink from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { home } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 2 — More Than a Moment */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeading
          eyebrow={home.moment.eyebrow}
          headline={home.moment.headline}
          copy={home.moment.copy}
          align="center"
        />
      </section>

      {/* 3 + 4 — Mission and areas of support */}
      <section className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <SectionHeading
            eyebrow={home.mission.eyebrow}
            headline={home.mission.headline}
            copy={home.mission.copy}
          />
          <div className="mt-14 lg:mt-16">
            <SupportGrid />
          </div>
        </div>
      </section>

      {/* 5 — Their Story */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <MediaPlaceholder
              alt={home.story.media.alt}
              label={home.story.media.placeholderLabel}
              aspect="aspect-[4/5]"
              className="shadow-lift"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow={home.story.eyebrow}
              headline={home.story.headline}
              copy={home.story.copy}
            />
            <Reveal delay={0.15} className="mt-8">
              <ButtonLink href="/their-story" variant="secondary">
                {home.story.cta}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — The plan */}
      <section className="bg-cream-deep/60">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <SectionHeading
            eyebrow="The Plan"
            headline="A clear path from this moment to their future."
            copy="Three phases — starting with what the children need today, and building toward lifelong opportunity."
            align="center"
          />
          <div className="mt-14 lg:mt-16">
            <PhaseCards />
          </div>
          <Reveal className="mt-10 text-center">
            <ButtonLink href="/the-plan" variant="secondary">
              See the Full Plan
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 7 — Donation section */}
      <section id="donate" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow={home.donate.eyebrow}
              headline={home.donate.headline}
              copy={home.donate.copy}
            />
          </div>
          <Reveal delay={0.1}>
            <DonationWidget />
          </Reveal>
        </div>
      </section>

      {/* 8 — Transparency and impact */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <SectionHeading
            eyebrow={home.transparency.eyebrow}
            headline={home.transparency.headline}
            copy={home.transparency.copy}
            align="center"
            dark
          />
          <div className="mt-14">
            <StatsGrid dark />
          </div>
          <Reveal className="mt-10 text-center">
            <ButtonLink
              href="/impact"
              variant="secondary"
              className="border-cream/30 bg-cream/10 text-cream hover:border-cream/70"
            >
              Visit the Impact Page
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* 9 — Final call to action */}
      <CtaBand
        headline={home.finalCta.headline}
        primaryLabel={home.finalCta.primaryCta}
        secondaryLabel={home.finalCta.secondaryCta}
        secondaryHref="/donate#partner"
      />
    </>
  );
}
