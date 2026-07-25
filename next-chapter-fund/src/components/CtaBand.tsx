import Reveal from "@/components/ui/Reveal";
import ButtonLink from "@/components/ui/Button";
import { donationUrl } from "@/config/site";

type CtaBandProps = {
  headline: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CtaBand({
  headline,
  primaryLabel = "Donate Now",
  primaryHref = donationUrl,
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_120%,#cf4a12_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] text-cream sm:text-4xl lg:text-5xl">
            {headline}
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href={primaryHref} size="lg">
              {primaryLabel}
            </ButtonLink>
            {secondaryLabel && secondaryHref && (
              <ButtonLink
                href={secondaryHref}
                size="lg"
                variant="secondary"
                className="border-cream/30 bg-cream/10 text-cream hover:border-cream/70"
              >
                {secondaryLabel}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
