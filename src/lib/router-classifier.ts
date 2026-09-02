import type { RouterInput, RouterOutput, HardRule } from "./router-types";

// Deterministic router. Order matters: rules are evaluated and the rule with
// the most distinct keyword hits wins. Ties break in favor of the first rule.
//
// NOTE: Arabic "التأمين" is ambiguous — it means BOTH "insurance" (accidents)
// AND "security deposit" (tenancy). We therefore do NOT match bare "التأمين"
// in the accident rule; we require accident-specific context words instead.

export const HARD_RULES: HardRule[] = [
  {
    name: "lawyer_practice",
    pattern:
      /(أنا محامي|أنا محام\b|محامي|محام\b|محامية|lawyer|attorney|legal practice|مكتب محاماة|مكتب المحاماة|نقابة المحامين|bar association|practice management|manage my practice)/gi,
    platform: "almizanpro",
    issue_category: "practice_management",
    user_type: "lawyer",
    intent: "manage_legal_practice",
  },
  {
    name: "learning_research",
    pattern:
      /(أتعلم|أبحث|أقرأ|أفهم|معرفة|مصادر قانونية|articles|learn|research|read|understand|knowledge|find out|discover|خلفية|قانون منخفض|what are my rights|تعليم)/gi,
    platform: "prowakeely",
    issue_category: "knowledge",
    intent: "learn_or_research",
  },
  {
    name: "tenancy_deposit",
    pattern:
      /(مستأجر|مؤجر|إيجار|عقد إيجار|إعادة التأمين|وديعة|تأمين البيت|صاحب البيت|مالك البيت|إخلاء|عمولة|tenant|landlord|rent|lease|deposit|rental|evict|security deposit|مالك العقار|صاحب العقار)/gi,
    platform: "tenant_wakeely",
    issue_category: "tenancy",
    intent: "tenancy_or_rental_issue",
  },
  {
    name: "accident_insurance",
    pattern:
      /(حادث|تعرضت|تصادم|اصطدام|حوادث|شركة التأمين|شركة تأمين|مطالبة|تعويض|حارق|accident|collision|crash|car crash|car accident|insured|insurer|claim|compensat|hit by a car|referral|مؤمن)/gi,
    platform: "accident_wakeely",
    issue_category: "accident",
    intent: "accident_or_insurance_issue",
  },
  {
    name: "labor_salary",
    pattern:
      /(راتب|أجور|عامل|موظف|صاحب العمل|فصل من العمل|استقالة|تعويض نهاية الخدمة|ساعات العمل|إجازات|إصابة عمل|تأمين اجتماعي|مكافأة|بدل|salary|wages|employ|colleague|job|layoff|fired|terminated|unpaid|overtime|employment|work)/gi,
    platform: "labor_wakeely",
    issue_category: "labor",
    intent: "labor_or_employment_issue",
  },
];

const CLARIFYING_QUESTIONS: Record<string, string[]> = {
  tenancy: [
    "هل المشكلة تتعلق بإعادة التأمين (الوديعة)، أم بعقد الإيجار نفسه؟",
    "هل تحاول حالياً التواصل مع المؤجر؟",
  ],
  accident: [
    "هل رفضت شركة التأمين مطالبتك، أم أنك بحاجة لمعرفة الخطوات؟",
    "هل وقع الحادث داخل الأردن؟",
  ],
  labor: [
    "هل المشكلة تتعلق بالراتب غير المدفوع، أو الفصل، أو ظروف العمل؟",
    "هل أنت موظف بعقد رسمي أم بدون عقد؟",
  ],
  general: [
    "هل أنت فرد أم صاحب عمل؟",
    "هل يمكنك تحديد طبيعة المسألة (مثل: عقود، نزاع، سؤال عام)؟",
  ],
};

function detectJurisdiction(
  text: string
): "jordan" | "outside_jordan" | "unknown" {
  if (/(الأردن|عمان|الزرقاء|إربد|jordan|amman|zarqa|irbid)/i.test(text)) {
    return "jordan";
  }
  if (/(خارج الأردن|outside jordan|الخليج|saudi|uae|qatar|kuwait|abroad)/i.test(text)) {
    return "outside_jordan";
  }
  return "unknown";
}

function detectUrgency(text: string): "low" | "medium" | "high" | "unknown" {
  if (/(مستعجل|طوارئ|حالاً|فوراً|اعتراض|غداً|urgent|emergency|immediate|asap|today|tomorrow)/i.test(text)) {
    return "high";
  }
  if (/(أحتاج قريباً|هذا الأسبوع|قريب|soon|shortly|upcoming)/i.test(text)) {
    return "medium";
  }
  return "unknown";
}

function detectUserType(text: string): "individual" | "business" | "lawyer" | "unknown" {
  if (/(أنا محام|محامي|محامية|lawyer|attorney)/i.test(text)) {
    return "lawyer";
  }
  if (/(شركة|مؤسسة|صاحب عمل|شركتي|business|company|employer)/i.test(text)) {
    return "business";
  }
  return "unknown";
}

function countMatches(text: string, pattern: RegExp): number {
  // Reset lastIndex in case the caller shared a global regex
  pattern.lastIndex = 0;
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

let fallbackId = 0;

export function classify(input: RouterInput): RouterOutput {
  const text = input.text.trim();
  const language = input.language;

  let bestRule: HardRule | null = null;
  let bestCount = 0;

  for (const rule of HARD_RULES) {
    const count = countMatches(text, rule.pattern);
    if (count > bestCount) {
      bestRule = rule;
      bestCount = count;
    }
  }

  const user_type =
    input.user_type_hint && input.user_type_hint !== "unknown"
      ? input.user_type_hint
      : detectUserType(text);

  const issue_category = bestRule?.issue_category ?? "general";
  const platform = bestRule?.platform ?? "legalwakeely";
  const jurisdiction = detectJurisdiction(text);
  const urgency = detectUrgency(text);

  let confidence = 0.5;
  if (bestRule) {
    confidence = Math.min(0.95, 0.6 + bestCount * 0.12);
    if (user_type === "lawyer" && platform === "almizanpro") {
      confidence = Math.max(confidence, 0.9);
    }
    if (platform === "legalwakeely") {
      confidence = Math.min(confidence, 0.55);
    }
  }

  const clarifying =
    confidence < 0.75
      ? (CLARIFYING_QUESTIONS[issue_category] ?? CLARIFYING_QUESTIONS.general)
      : [];

  const baseContext =
    platform !== "legalwakeely" && bestRule
      ? language === "ar"
        ? `نقترح ${platform.replace(/_/g, " ")} لأن مسألتك يبدو أنها مرتبطة بـ (${bestRule.name.replace(/_/g, " ")}).`
        : `We recommend ${platform.replace(/_/g, " ")} because your matter appears related to (${bestRule.name.replace(/_/g, " ")}).`
      : language === "ar"
        ? "بناءً على وصفك، ننصح بالبدء بـ LegalWakeely لتنظيم مسألتك."
        : "Based on your description, we recommend starting with LegalWakeely to organize your matter.";

  const session_id = input.session_id || `fallback-${++fallbackId}-${Date.now()}`;

  return {
    intent: bestRule?.intent ?? "general_legal_matter",
    user_type,
    issue_category,
    jurisdiction,
    urgency,
    recommended_platform: platform,
    recommended_path: platform,
    confidence,
    clarifying_questions: clarifying,
    reason_short: baseContext,
    disclaimer_required: true,
  };
}
