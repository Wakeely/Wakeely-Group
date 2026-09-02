import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href }: LogoProps) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Placeholder mark — swap for real brand asset later */}
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-navy text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold text-text-primary">
          Wakeely
        </span>
        <span className="text-[10px] font-medium tracking-widest text-text-muted uppercase">
          Group
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0" aria-label="Wakeely Group — home">
        {inner}
      </Link>
    );
  }

  return <div className="shrink-0">{inner}</div>;
}
