# Router Agent API Contract

This document defines the interface between the `group.legalwakeely.com` frontend and the
Router Agent. The frontend **only** talks to a single endpoint that returns the schema below.
The current implementation is a **deterministic mock** (see `src/lib/router-classifier.ts`).
It can be swapped for a real AI Router Agent later **without changing the frontend**, as long
as the input/output contract stays identical.

> Principle: **Agents assist; deterministic rules own.** The frontend always applies hard
> deterministic overrides on top of whatever the agent returns. Never let the agent rewrite
> routing rules or invent new destinations.

## Endpoint

- **Method:** `POST`
- **Path:** `/api/router`
- **Rate limit:** 10 requests / 60s per IP (returns `429`).
- **Content-Type:** `application/json`

## Request (Router Input)

```json
{
  "text": "string",
  "user_type_hint": "individual | business | lawyer | unknown",
  "location_hint": "string | null",
  "language": "ar | en",
  "session_id": "string"
}
```

| Field            | Type     | Required | Notes                                        |
|------------------|----------|----------|----------------------------------------------|
| `text`           | `string` | yes      | User's natural-language description (≤1000 chars after trimming). |
| `user_type_hint` | `enum`   | no       | Optional structured signal from paid/door context. |
| `location_hint`  | `string` | no       | Approximate location, when the user provides one. |
| `language`       | `enum`   | yes      | `ar` or `en`.                                 |
| `session_id`     | `string` | no       | Client-generated session id for logging/analytics/evaluation. |

## Response (Router Output)

```json
{
  "intent": "string",
  "user_type": "individual | business | lawyer | unknown",
  "issue_category": "accident | tenancy | labor | commercial | family | general | knowledge | practice_management | other",
  "jurisdiction": "jordan | outside_jordan | unknown",
  "urgency": "low | medium | high | unknown",
  "recommended_platform": "prowakeely | accident_wakeely | tenant_wakeely | labor_wakeely | legalwakeely | almizanpro",
  "recommended_path": "string",
  "confidence": 0.0,
  "clarifying_questions": ["string"],
  "reason_short": "string",
  "disclaimer_required": true
}
```

### Field semantics

- **`recommended_platform`** — the destination platform. This is what the frontend displays
  and links to via `src/lib/destinations.ts`.
- **`recommended_path`** — (reserved) a deeper path/section within the platform. Currently
  mirrors `recommended_platform`.
- **`confidence`** — `0.0`–`1.0`. The frontend shows `clarifying_questions` when
  `confidence < 0.75`.
- **`clarifying_questions`** — an array of 1–2 short questions for the user when confidence
  is low. Empty when confidence is high.
- **`reason_short`** — a one-sentence human-readable explanation shown on the result card.
- **`disclaimer_required`** — always `true` for this domain. The frontend must always show
  the legal disclaimer on any interaction and on the result card.

## Error responses

| Status | Body                                   | Meaning                              |
|--------|----------------------------------------|--------------------------------------|
| `400`  | `{"error":"invalid_json",...}`         | Malformed request body.              |
| `400`  | `{"error":"empty_text","message":...}` | `text` missing or empty.             |
| `429`  | `{"error":"rate_limited",...}`         | Too many requests from this IP.      |
| `500`  | —                                      | Classifier failure.                  |

## Frontend contract requirements

The frontend must:

1. Display `reason_short` and `recommended_platform`.
2. Show `clarifying_questions` if `confidence < 0.75`.
3. Always respect the hard deterministic overrides (see `HARD_RULES` in
   `src/lib/router-classifier.ts`).
4. Log the full input/output for analytics and later evaluation
   (see the event map in `src/lib/analytics.ts`).
5. Never allow the user-facing copy to imply legal advice or an attorney-client relationship.

## Replacing the mock with a real agent

1. Keep `src/lib/router-types.ts` unchanged (it IS the contract).
2. Replace the body of `classify()` in `src/lib/router-classifier.ts` with a call to your
   real agent, keeping the return type as `RouterOutput`.
3. Re-apply `HARD_RULES` as post-processing overrides after the agent returns.
4. Ensure rate limiting, input sanitization, and audit logging remain in the route handler
   (`src/app/api/router/route.ts`).
