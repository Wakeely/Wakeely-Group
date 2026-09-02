import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="border-b border-border bg-gradient-to-b from-surface-alt to-surface">
      <div className="container-page flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-teal">
          {t("eyebrow")}
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-text-secondary">
          {t("subtitle")}
        </p>
        <p className="max-w-xl text-base leading-relaxed text-text-muted">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
