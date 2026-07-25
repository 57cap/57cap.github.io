"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ButtonLink from "@/components/ui/Button";
import { home, donationUrl } from "@/config/site";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { hero } = home;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Some browsers (data-saver, strict autoplay policies) ignore the
  // autoPlay attribute; nudge playback explicitly, and keep the video
  // paused for visitors who prefer reduced motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [reduceMotion]);

  // Movement is stripped for reduced-motion users by MotionProvider;
  // the opacity fade still completes so nothing stays hidden.
  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  });

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-ink">
      {/* Full-bleed background video — configured in src/config/site.ts.
          Muted with no audio track; reduced-motion visitors get the poster frame. */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.video.poster}
          alt=""
          className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          poster={hero.video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          {hero.video.webmSrc && (
            <source src={hero.video.webmSrc} type="video/webm" />
          )}
          <source src={hero.video.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-cream/40 p-1.5">
          <motion.div
            className="h-2 w-1 rounded-full bg-cream/70 motion-reduce:animate-none"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
