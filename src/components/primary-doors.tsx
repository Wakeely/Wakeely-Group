"use client";

import { useLocale, useTranslations } from "next-intl";
import { User, BookOpen, Scale, MessageCircleQuestion, ArrowRight, ArrowLeft } from "lucide-react";
import { destinations, previewImages } from "@/lib/destinations";
import { trackEvent } from "@/lib/analytics";
import { SitePreview } from "@/components/site-preview";

interface PrimaryDoorsProps {
  onDontKnowClick: () => void;
}

const doorIcons = {
  individual: User,
  learn: BookOpen,
  lawyer: Scale,
  dontKnow: MessageCircleQuestion,
} as const;

export function PrimaryDoors({ onDontKnowClick }: PrimaryDoorsProps) {
  const t = useTranslations("doors");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const doors = [
    {
      key: "individual",
      icon: User,
      title: t("individual.title"),
      subtitle: t("individual.subtitle"),
      description: t("individual.description"),
      cta: t("individual.cta"),
      ariaLabel: t("individual.ariaLabel"),
      href: destinations.legalwakeely,
      preview: previewImages.legalwakeely,
    },
    {
      key: "learn",
      icon: BookOpen,
      title: t("learn.title"),
      subtitle: t("learn.subtitle"),
      description: t("learn.description"),
      cta: t("learn.cta"),
      ariaLabel: t("learn.ariaLabel"),
      href: destinations.prowakeely,
      preview: previewImages.prowakeely,
    },
    {
      key: "lawyer",
      icon: Scale,
      title: t("lawyer.title"),
      subtitle: t("lawyer.subtitle"),
      description: t("lawyer.description"),
      cta: t("lawyer.cta"),
      ariaLabel: t("lawyer.ariaLabel"),
      href: destinations.almizanpro,
      preview: previewImages.almizanpro,
    },
    {
      key: "dontKnow",
      icon: MessageCircleQuestion,
      title: t("dontKnow.title"),
      subtitle: t("dontKnow.subtitle"),
      description: t("dontKnow.description"),
      cta: t("dontKnow.cta"),
      ariaLabel: t("dontKnow.ariaLabel"),
    },
  ];

  const handleDoorClick = (key: string, href?: string) => {
    trackEvent("door_click", { door: key });
    if (key === "dontKnow") {
      onDontKnowClick();
    } else if (href) {
      trackEvent("outbound_to_platform", { platform: key, source: "door" });
    }
  };

  return (
    <section className="container-page py-16" aria-labelledby="doors-heading">
      <h2
        id="doors-heading"
        className="mb-10 text-center text-3xl font-bold text-text-primary"
      >
        {t("heading")}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {doors.map((door) => {
          const Icon = door.icon;
          const isButton = door.key === "dontKnow";

          const shared = {
            onClick: () => handleDoorClick(door.key, door.href),
            "aria-label": door.ariaLabel,
            className:
              "group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-brand-teal hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
          };

          const body = (
            <>
              {door.preview && (
                <SitePreview src={door.preview} alt={door.title} href={door.href} />
              )}
              <div className="flex flex-1 flex-col px-1 pb-1">
                <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-brand-navy text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary">{door.title}</h3>
                <p className="text-sm font-medium text-brand-teal">{door.subtitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{door.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand-green">
                  {door.cta}
                  <Arrow className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
                </span>
              </div>
            </>
          );

          return isButton ? (
            <button key={door.key} type="button" {...shared}>
              {body}
            </button>
          ) : (
            <a
              key={door.key}
              href={door.href}
              target="_blank"
              rel="noopener noreferrer"
              {...shared}
            >
              {body}
            </a>
          );
        })}
      </div>
    </section>
  );
}
