import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import Reveal from "@/components/ui/Reveal";
import SupportedMark from "@/components/ui/SupportedMark";
import CtaBand from "@/components/CtaBand";
import { storyPage } from "@/config/site";

export const metadata: Metadata = {
  title: "Their Story",
  description:
    "From Kampala, Uganda to stages around the world — the story of the Ghetto Kids and what happens when extraordinary talent meets opportunity.",
};

export default function TheirStoryPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-cream-deep/60 px-4 pb-20 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10">
            <SupportedMark tone="dark" width={168} />
          </Reveal>
          <SectionHeading
            as="h1"
            headline={storyPage.hero.headline}
            copy={storyPage.hero.copy}
          />
        </div>
      </section>

      {/* Editorial sections */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-16">
          {storyPage.sections.map((section, i) => (
            <Reveal key={section.title}>
              <article className="grid gap-4 sm:grid-cols-[64px_1fr] sm:gap-8">
                <p
                  aria-hidden="true"
                  className="font-display text-3xl font-semibold text-ember-600/40"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                    {section.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Video */}
      <section className="bg-ink px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Watch"
            headline="See them move."
            copy="Approved performance footage will live here — with full video controls and captions."
            align="center"
            dark
          />
          <Reveal className="mt-12">
            {storyPage.video.src ? (
              <video
                controls
                preload="metadata"
                poster={storyPage.video.poster}
                className="aspect-video w-full rounded-2xl"
              >
                <source src={storyPage.video.src} />
                {storyPage.video.captions && (
                  <track
                    kind="captions"
                    src={storyPage.video.captions}
                    srcLang="en"
                    label="English"
                    default
                  />
                )}
                Your browser does not support embedded video.
              </video>
            ) : (
              <MediaPlaceholder
                alt={storyPage.video.title}
                label={storyPage.video.placeholderLabel}
                kind="video"
                className="ring-1 ring-cream/15"
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Gallery"
          headline="Moments from the journey."
          copy="Photos will be added once the children's guardians approve their use."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {storyPage.gallery.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 0.08}>
              <MediaPlaceholder
                alt={photo.alt}
                label={photo.placeholderLabel}
                aspect={i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        headline="Their story is still being written. Help shape the next chapter."
        secondaryLabel="See How Funds Are Used"
        secondaryHref="/donate"
      />
    </>
  );
}
