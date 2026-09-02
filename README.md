# Wakeely Group — Gateway Page

`group.legalwakeely.com` — the single entry point for the Wakeely Group holding brand.

Its only job is **Identify → Route → Convert**: quickly understand what the visitor needs,
route them to the correct property with high confidence, and convert high-intent traffic.

This is a pure gateway page — **not** a legal-services brochure. It does not host educational
content or solve legal problems on this domain.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- next-intl v4 — Arabic primary (RTL), English intent-aware
- Deterministic free-text router (see `docs/ROUTER-AGENT-CONTRACT.md`)

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000 (redirects / -> /ar)
```

```bash
pnpm build      # production build
pnpm start      # serve production build
```

## Layout

| Path          | Purpose                                   |
|---------------|--------------------------------------------|
| `/`           | Redirects to `/ar`                         |
| `/ar`, `/en`  | Bilingual gateway page                     |
| `/api/router` | Free-text routing endpoint (rate-limited)  |
| `/api/events` | First-party analytics intake               |

## Docs

- [`docs/ROUTER-AGENT-CONTRACT.md`](docs/ROUTER-AGENT-CONTRACT.md) — Router Agent API contract
- [`docs/HARD-ROUTING-RULES.md`](docs/HARD-ROUTING-RULES.md) — deterministic hard routing rules

## Configuration

- Destination URLs: `src/lib/destinations.ts`
- Analytics: optional PostHog via `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`
- Site URL: `NEXT_PUBLIC_SITE_URL`

See `AGENTS.md` for build/lint guides and the "this is not the Next.js you know" guardrails.
