import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { site, legalDisclaimer, donationDisclaimers } from "@/config/site";

export const metadata: Metadata = {
  title: "Donation Disclaimer",
  description: `Donation disclaimer for ${site.name}.`,
};

export default function DonationDisclaimerPage() {
  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 sm:pt-44 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading as="h1" eyebrow="Legal" headline="Donation Disclaimer" />
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
          <p>{legalDisclaimer}</p>
          <p>{donationDisclaimers.illustrative}</p>
          <p>{donationDisclaimers.taxStatus}</p>
          <p>
            Donations are processed by a third-party donation platform over an
            encrypted connection. {site.name} does not collect or store payment
            details.
          </p>
          <p className="rounded-2xl border border-ember-200 bg-ember-50 p-5 text-sm">
            [PLACEHOLDER — Final disclaimer language must be confirmed with legal
            and financial advisors once the fund&apos;s structure and nonprofit
            status are finalized.]
          </p>
        </div>
      </div>
    </section>
  );
}
