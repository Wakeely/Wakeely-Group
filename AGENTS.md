<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wakeely Group — gate.hub / group page

`group.legalwakeely.com` is the single entry point for the Wakeely Group holding brand. Its only job is **Identify → Route → Convert**: quickly understand what the visitor needs, route them to the correct property with high confidence, and convert high-intent traffic (especially the three specialized problems).

This is NOT a legal-services brochure. Do not expand scope into feature grids, long educational content, or deep product pages for LegalWakeely / AlmizanPro / ProWakeely.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (type-check + optimize)
- `pnpm start` — serve production build
- `pnpm lint` — eslint (if configured)

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- next-intl v4 (Arabic primary / English). Proxy file: `src/proxy.ts` (Next.js 16 renamed middleware → proxy).
- Deterministic free-text router mock at `src/app/api/router/route.ts` (see contract in `src/lib/router-types.ts`).
- Lightweight analytics wrapper: `src/lib/analytics.ts` (PostHog optional + first-party `/api/events` fallback).

## Conventions

- Arabic is primary, RTL (dir="rtl"). English is intent-aware, not a literal mirror.
- All UI copy lives in `src/messages/{ar,en}.json` — never hard-code user-facing strings.
- Design tokens live in `src/app/globals.css` via Tailwind `@theme` (prefer non-inline for overridable tokens).
- Hard routing rules must stay in `src/lib/router-classifier.ts` — determinism owns; agents assist. Never let an agent rewrite routing rules.
- Analytics event names/props must match the documented event map (see `src/lib/analytics.ts` and code comments).
- Destination URLs are centralized in `src/lib/destinations.ts`.

## Guardrails

- Keep the disclaimer (`src/components/disclaimer.tsx`) non-dismissible and present on every free-text interaction and result card.
- Never imply legal advice or a lawyer-client relationship in UI copy.
- `/api/*` is excluded from the locale proxy and disallowed in robots.txt.
- Free-text endpoint is rate-limited and input-sanitized.
