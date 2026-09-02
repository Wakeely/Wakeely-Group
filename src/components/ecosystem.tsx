import { useTranslations } from "next-intl";
import { BookOpen, Briefcase, Scale, FolderTree } from "lucide-react";

export function Ecosystem() {
  const t = useTranslations("ecosystem");

  const steps = [
    { key: "know", icon: BookOpen, platform: "ProWakeely", color: "bg-brand-blue" },
    { key: "solve", icon: Briefcase, platform: "Specialized Wakeely", color: "bg-brand-teal" },
    { key: "manage", icon: Scale, platform: "LegalWakeely", color: "bg-brand-green" },
    { key: "practice", icon: FolderTree, platform: "AlmizanPro", color: "bg-brand-navy" },
  ] as const;

  return (
    <section className="container-page py-16" aria-labelledby="ecosystem-heading">
      <h2
        id="ecosystem-heading"
        className="mb-6 text-center text-3xl font-bold text-text-primary"
      >
        {t("heading")}
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-text-secondary">
        {t("text")}
      </p>

      {/* Flow: KNOW → SOLVE → MANAGE → PRACTICE */}
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center gap-3 md:flex-row md:gap-3">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`grid h-20 w-20 place-items-center rounded-2xl ${step.color} text-white shadow-sm`}
                >
                  <Icon className="h-9 w-9" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-primary">{t(`steps.${step.key}`)}</p>
                  <p className="text-xs text-text-muted">{step.platform}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <span className="text-text-muted" aria-hidden="true">
                  ←
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
