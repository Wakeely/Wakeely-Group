import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function Disclaimer({ className }: { className?: string }) {
  const t = useTranslations("disclaimer");

  return (
    <aside
      className={cn(
        "rounded-2xl border border-amber-300 bg-amber-50 p-6",
        className
      )}
      aria-label={t("title")}
    >
      <div className="mb-3 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-amber-700"
          aria-hidden="true"
        >
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
        <h3 className="text-sm font-semibold text-amber-900">{t("title")}</h3>
      </div>
      <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-amber-900">
        {t.raw("items").map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
