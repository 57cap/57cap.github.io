import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import { site, contact } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for the ${site.name} website.`,
};

export default function TermsPage() {
  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 sm:pt-44 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading as="h1" eyebrow="Legal" headline="Terms of Use" />
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
          <p className="rounded-2xl border border-ember-200 bg-ember-50 p-5 text-sm">
            [PLACEHOLDER — This page must be reviewed and completed by a qualified
            legal professional before public launch.]
          </p>
          <p>
            By using this website you agree to these terms. Content on this site is
            provided for information about {site.name} and its programs. It is not
            legal, tax, or financial advice.
          </p>
          <p>
            All content — text, photography, and video — is the property of its
            respective owners and may not be reused without permission.
          </p>
          <p>
            Questions about these terms can be sent to{" "}
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
