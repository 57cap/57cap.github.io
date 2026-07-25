import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { site, contact } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}.`,
};

export default function PrivacyPage() {
  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 sm:pt-44 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading as="h1" eyebrow="Legal" headline="Privacy Policy" />
        <div className="prose-nc mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
          <p className="rounded-2xl border border-ember-200 bg-ember-50 p-5 text-sm">
            [PLACEHOLDER — This page must be reviewed and completed by a qualified
            legal professional before public launch.]
          </p>
          <p>
            {site.name} respects your privacy. This policy will describe what
            information we collect (such as names and email addresses submitted
            through our forms), how we use it (to send updates and respond to
            inquiries), and how we protect it.
          </p>
          <p>
            Donations are processed by a third-party donation platform; we do not
            collect or store payment details. The donation platform&apos;s own
            privacy policy applies to payment processing.
          </p>
          <p>
            To ask about your data or request its deletion, contact us at{" "}
            <a
              href={`mailto:${contact.email}`}
              className="font-medium text-ember-700 underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
