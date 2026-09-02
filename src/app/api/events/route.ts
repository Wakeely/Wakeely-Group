import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Fire-and-forget analytics intake. No PII stored; only event name + props + timestamp.
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.slice(0, 100) : "unknown";
    const props = typeof body?.props === "object" && body.props !== null ? body.props : {};

    if (process.env.NODE_ENV === "development") {
      console.info("[events]", name, props);
    }

    // In production this could forward to PostHog/GA4 or write to a durable queue.
  } catch {
    // ignore malformed payloads
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
