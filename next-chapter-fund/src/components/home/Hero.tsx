"use client";

import { motion, useReducedMotion } from "framer-motion";
import ButtonLink from "@/components/ui/Button";
import { home, donationUrl } from "@/config/site";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { hero } = home;

  const entrance = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.21, 0.6, 0.35, 1] as const },
        };

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-ink">
      {/* Full-bleed media placeholder — replace with approved photo/video via src/config/site.ts */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_10%,#e55e22_0%,#86300f_38%,#1c1917_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <p className="absolute right-4 top-20 rounded-full bg-ink/50 px-4 py-2 text-[11px] font-medium tracking-wide text-cream/70 backdrop-blur sm:right-8 sm:top-24">
          {hero.media.placeholderLabel}
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-40 sm:px-6 sm:pb-28 lg:px-8">
        <motion.p
          {...entrance(0.05)}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-ember-300"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          {...entrance(0.15)}
          className="font-display max-w-4xl text-4xl font-semibold leading-[1.05] text-cream sm:text-5xl lg:text-7xl"
        >
          {hero.headline}
        </motion.h1>
        <motion.p
          {...entrance(0.3)}
          className="mt-7 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg"
        >
          {hero.copy}
        </motion.p>
        <motion.div {...entrance(0.45)} className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href={donationUrl} size="lg">
            {hero.primaryCta}
          </ButtonLink>
          <ButtonLink
            href="/their-story"
            size="lg"
            variant="secondary"
            className="border-cream/30 bg-cream/10 text-cream hover:border-cream/70"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
            >
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
            {hero.secondaryCta}
          </ButtonLink>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.2, duration: 1 },
            })}
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-cream/40 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-cream/70"
            {...(reduceMotion
              ? {}
              : {
                  animate: { y: [0, 14, 0], opacity: [1, 0.2, 1] },
                  transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                })}
          />
        </div>
      </motion.div>
    </section>
  );
}
