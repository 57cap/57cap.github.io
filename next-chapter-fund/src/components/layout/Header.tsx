"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, donationUrl, site } from "@/config/site";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const donateIsExternal = donationUrl.startsWith("http");
  // The homepage hero is dark, so the transparent header needs light text there
  const onDark = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-cream/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`font-display text-lg font-semibold tracking-tight sm:text-xl ${
            onDark ? "text-cream" : "text-ink"
          }`}
        >
          {site.name}
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigation
            .filter((item) => item.label !== "Donate")
            .map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    onDark
                      ? active
                        ? "text-ember-300"
                        : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                      : active
                        ? "text-ember-700"
                        : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={donationUrl}
            {...(donateIsExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center rounded-full bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember-600/25 transition-all duration-200 hover:bg-ember-700 motion-safe:hover:-translate-y-0.5"
          >
            Donate
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
              onDark ? "text-cream hover:bg-cream/10" : "text-ink hover:bg-ink/5"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-current"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-ink/10 bg-cream/95 px-4 pb-6 pt-2 backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col">
            {navigation.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-base font-medium ${
                      active ? "bg-ember-50 text-ember-700" : "text-ink hover:bg-ink/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
