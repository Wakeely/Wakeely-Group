"use client";

import { useLocale } from "next-intl";

interface SitePreviewProps {
  src: string;
  alt: string;
  href?: string;
  className?: string;
}

/**
 * Renders a screenshot thumbnail of a destination site in a lightweight
 * browser-chrome frame. Optional `href` wraps the whole preview in an
 * external link. Always lazy-loaded.
 */
export function SitePreview({ src, alt, href, className }: SitePreviewProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const inner = (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 border border-black/10" />
    </div>
  );

  return (
    <div
      className={`group/preview overflow-hidden rounded-xl border border-border bg-surface-muted shadow-sm ${className ?? ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-surface px-2 py-0.5 text-[10px] text-text-muted">
          {href ? href.replace(/^https?:\/\//, "") : alt}
        </span>
      </div>

      <div className="aspect-[16/10] w-full">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={alt}>
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
