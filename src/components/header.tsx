"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

const NAV_KEYS = ["about", "knowledge", "legalServices", "forLawyers", "contact"] as const;

export function Header() {
  const t = useTranslations("header");
  const tNav = useTranslations("header.nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo href="/" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_KEYS.map((key) => (
            <a
              key={key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            >
              {tNav(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-surface px-4 pb-4 pt-2 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                >
                  {tNav(key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-border pt-3">
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
