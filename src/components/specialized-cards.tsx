"use client";

import { useTranslations } from "next-intl";
import { Car, HomeIcon, Briefcase } from "lucide-react";
import { destinations, previewImages } from "@/lib/destinations";
import { trackEvent } from "@/lib/analytics";
import { SitePreview } from "@/components/site-preview";

type SpecializedType = "accident" | "tenant" | "labor";

const config: Record<
  SpecializedType,
  { icon: typeof Car; href: string; preview: string; type: SpecializedType }
> = {
  accident: { icon: Car, href: destinations.accident_wakeely, preview: previewImages.accident_wakeely, type: "accident" },
  tenant: { icon: HomeIcon, href: destinations.tenant_wakeely, preview: previewImages.tenant_wakeely, type: "tenant" },
  labor: { icon: Briefcase, href: destinations.labor_wakeely, preview: previewImages.labor_wakeely, type: "labor" },
};

export function SpecializedCards() {
  const t = useTranslations("specialized");

  const cards: SpecializedType[] = ["accident", "tenant", "labor"];

  return (
    <section className="border-t border-border bg-surface-alt" aria-labelledby="specialized-heading">
      <div className="container-page py-16">
        <h2
          id="specialized-heading"
          className="mb-10 text-center text-3xl font-bold text-text-primary"
        >
          {t("heading")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((key) => {
            const { icon: Icon, href, preview } = config[key];
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("specialized_click", { type: key, platform: key })}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-brand-teal hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              >
                <SitePreview src={preview} alt={t(`${key}.title`)} href={href} />
                <div className="px-1 pb-1">
                  <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-brand-teal text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-text-primary">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {t(`${key}.description`)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand-green">
                    {t(`${key}.cta`)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-text-muted">
          {t("supportingLine")}
        </p>
      </div>
    </section>
  );
}
