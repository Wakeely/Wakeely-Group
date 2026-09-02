# Hard Routing Rules

The routing on `group.legalwakeely.com` is **deterministic-first**. These rules are coded in
`src/lib/router-classifier.ts` (`HARD_RULES`). They **must be owned by code, not by an AI
agent**. The Router Agent's recommendation (when one is later introduced) is always subject to
these overrides.

## Rule evaluation

- Each rule is a regex over the user's trimmed free-text description.
- Every rule is tested; the rule with the **most distinct keyword hits** wins (`/g` regex).
  Ties break in favor of the earlier rule in the list.
- If no rule matches, fall back to **LegalWakeely** with low confidence (`0.5`).

## The rules (in evaluation order)

### 1. Lawyer / practice management → `AlmizanPro`
- Keywords: محامي، محام، محامية، مكتب محاماة، نقابة المحامين، lawyer, attorney, legal practice, bar association, practice management, manage my practice.
- `issue_category`: `practice_management`
- `user_type`: forced to `lawyer`
- Confidence floor: `0.9` when `user_type == lawyer`.

### 2. Learning / research → `ProWakeely`
- Keywords: أتعلم، أبحث، أقرأ، أفهم، معرفة، مصادر قانونية، articles, learn, research, read, understand, knowledge, find out, discover, what are my rights.
- `issue_category`: `knowledge`

### 3. Tenancy / deposit → `Tenant Wakeely`
- Keywords: مستأجر، مؤجر، إيجار، عقد إيجار، إعادة التأمين، وديعة، تأمين البيت، صاحب البيت، مالك البيت، إخلاء، مالك العقار، tenant, landlord, rent, lease, deposit, rental, evict, security deposit.
- `issue_category`: `tenancy`

### 4. Accident / insurance → `Accident Wakeely`
- Keywords: حادث، تعرضت، تصادم، اصطدام، شركة التأمين، مطالبة، تعويض، accident, collision, crash, car crash, insured, insurer, claim, compensat, hit by a car.
- `issue_category`: `accident`
- **Disambiguation note:** bare Arabic `التأمين` is NOT matched here because it also means
  "security deposit" in tenancy contexts. Accident detection requires accident-specific words
  (حادث/تعرضت/شركة التأمين/تعويض/...).

### 5. Labor / employment → `Labor Wakeely`
- Keywords: راتب، أجور، عامل، موظف، صاحب العمل، فصل من العمل، استقالة، تعويض نهاية الخدمة، ساعات العمل، إجازات، إصابة عمل، تأمين اجتماعي، مكافأة، بدل، salary, wages, employ, job, layoff, fired, terminated, unpaid, overtime, work.
- `issue_category`: `labor`

## Fallback

- **No rule matched** → `LegalWakeely`, `issue_category: general`, confidence `0.5`.

## Deterministic side-signals (always computed)

- **`user_type`** — from `user_type_hint` if provided and not `unknown`; otherwise detected
  from text (lawyer/business/individual/unknown).
- **`jurisdiction`** — `jordan` / `outside_jordan` / `unknown` from location words.
- **`urgency`** — `high` / `medium` / `unknown` from urgency words.

## Confidence model

```
no rule matched       -> 0.50
rule matched          -> min(0.95, 0.60 + distinctHits * 0.12)
lawyer -> almizanpro  -> max(0.90, above)
```

`clarifying_questions` are returned when `confidence < 0.75` (see `CLARIFYING_QUESTIONS`).

## Change policy

- Modify `HARD_RULES` only with explicit product approval.
- Never add a destination that does not exist in `src/lib/destinations.ts`.
- Adding/removing rules requires updating the example test set in
  `docs/ROUTER-AGENT-CONTRACT.md` and re-running the classification verification.
