import Link from "next/link";
import {
  site,
  contact,
  navigation,
  footerLegalLinks,
  legalDisclaimer,
  socialLinks,
} from "@/config/site";
import EmailSignupForm from "@/components/forms/EmailSignupForm";
import SupportedMark from "@/components/ui/SupportedMark";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold">{site.name}</p>
            <p className="mt-2 text-sm text-cream/60">{site.tagline}</p>
            <SupportedMark tone="light" width={132} className="mt-8" />
            <div className="mt-10 max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cream/50">
                Follow the journey
              </p>
              <EmailSignupForm compact />
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cream/50">
              Explore
            </p>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-cream/50">
              Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {contact.email}
                </a>
              </li>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-cream/15 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-cream/50">
            {legalDisclaimer}
          </p>
          <p className="mt-4 text-xs text-cream/40">
            © {new Date().getFullYear()} {site.name}. {site.tagline}.
          </p>
        </div>
      </div>
    </footer>
  );
}
