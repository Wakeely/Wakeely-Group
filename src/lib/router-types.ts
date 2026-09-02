export type UserType = "individual" | "business" | "lawyer" | "unknown";

export type IssueCategory =
  | "accident"
  | "tenancy"
  | "labor"
  | "commercial"
  | "family"
  | "general"
  | "knowledge"
  | "practice_management"
  | "other";

export type Jurisdiction = "jordan" | "outside_jordan" | "unknown";

export type Urgency = "low" | "medium" | "high" | "unknown";

export type Platform =
  | "prowakeely"
  | "accident_wakeely"
  | "tenant_wakeely"
  | "labor_wakeely"
  | "legalwakeely"
  | "almizanpro";

export interface RouterInput {
  text: string;
  user_type_hint?: UserType;
  location_hint?: string | null;
  language: "ar" | "en";
  session_id?: string;
}

export interface RouterOutput {
  intent: string;
  user_type: UserType;
  issue_category: IssueCategory;
  jurisdiction: Jurisdiction;
  urgency: Urgency;
  recommended_platform: Platform;
  recommended_path: string;
  confidence: number;
  clarifying_questions: string[];
  reason_short: string;
  disclaimer_required: boolean;
}

export interface HardRule {
  name: string;
  pattern: RegExp;
  platform: Platform;
  issue_category: IssueCategory;
  user_type?: UserType;
  intent: string;
}
