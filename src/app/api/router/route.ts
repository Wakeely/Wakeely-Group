import { NextRequest, NextResponse } from "next/server";
import { classify } from "@/lib/router-classifier";
import type { RouterInput, RouterOutput } from "@/lib/router-types";

// Simple in-memory rate limiter (per-IP, per-window)
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function sanitizeText(input: string): string {
  return input.slice(0, 1000).trim();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: RouterInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const text = sanitizeText(body.text ?? "");
  if (!text) {
    return NextResponse.json(
      { error: "empty_text", message: "text is required." },
      { status: 400 }
    );
  }

  const language: "ar" | "en" = body.language === "en" ? "en" : "ar";

  // TODO: Replace deterministic classifier with real Router Agent.
  // Keep input/output types identical to the contract (src/lib/router-types.ts).
  const output: RouterOutput = classify({
    text,
    user_type_hint: body.user_type_hint,
    location_hint: body.location_hint ?? null,
    language,
    session_id: body.session_id,
  });

  return NextResponse.json(output);
}
