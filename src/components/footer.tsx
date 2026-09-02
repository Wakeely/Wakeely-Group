import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

const LINK_GROUPS = {
  company: ["about", "knowledge", "legalServices", "forLawyers", "forBusinesses"],
  legal: ["privacy", "terms", "disclaimers", "contact"],
} as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Wakeely Group
            </p>
          </div>

          {Object.entries(LINK_GROUPS).map(([group, keys]) => (
            <nav key={group} aria-label={group} className="flex flex-col gap-2">
              {keys.map((key) => (
                <a
                  key={key}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  {t(`links.${key}`)}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-text-muted">
            {t("copyright", { year: new Date().getFullYear().toString() })}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
