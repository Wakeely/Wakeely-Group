type EventProps = Record<string, unknown>;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let posthogInstance: any = null;

async function getPosthog() {
  if (typeof window === "undefined" || !POSTHOG_KEY) return null;
  if (posthogInstance) return posthogInstance;

  const { default: posthog } = await import("posthog-js");
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
  });
  posthogInstance = posthog;
  return posthogInstance;
}

export function trackEvent(name: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;

  const event = { name, props, timestamp: new Date().toISOString() };

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("[analytics]", name, props);
  }

  // PostHog (async, non-blocking)
  getPosthog().then((ph) => {
    if (ph) ph.capture(name, props);
  });

  // First-party fallback (fire-and-forget)
  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // noop
  }
}
