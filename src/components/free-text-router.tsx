"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/disclaimer";
import { destinations, platformDisplayName, previewImages } from "@/lib/destinations";
import type { RouterInput, RouterOutput } from "@/lib/router-types";
import { trackEvent } from "@/lib/analytics";
import { SitePreview } from "@/components/site-preview";

export function FreeTextRouter() {
  const t = useTranslations("router");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouterOutput | null>(null);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (resetId?: string) => {
    const value = text.trim();
    if (!value) {
      setError(t("emptyError"));
      return;
    }
    setError(null);
    setLoading(true);
    setStartTime(Date.now());
    trackEvent("freetext_submit", {
      session_id: resetId ?? sessionId,
      lang: locale,
      text_length: value.length,
    });

    const input: RouterInput = {
      text: value,
      language: locale === "ar" ? "ar" : "en",
      session_id: resetId ?? sessionId,
    };

    try {
      const res = await fetch("/api/router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data: RouterOutput = await res.json();
      setResult(data);
      trackEvent("routing_result_shown", {
        platform: data.recommended_platform,
        confidence: data.confidence,
        issue_category: data.issue_category,
        session_id: resetId ?? sessionId,
      });
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGo = () => {
    if (!result) return;
    const platform = result.recommended_platform;
    trackEvent("routing_accepted", {
      platform,
      session_id: sessionId,
    });
    const url = destinations[platform];
    trackEvent("outbound_to_platform", { platform, source: "router" });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="border-t border-border bg-surface-alt py-16" aria-labelledby="router-heading">
      <div className="container-page max-w-3xl">
        <h2
          id="router-heading"
          className="mb-8 text-center text-3xl font-bold text-text-primary"
        >
          {t("heading")}
        </h2>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          {!result ? (
            <div className="flex flex-col gap-4">
              <Textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholder")}
                className="min-h-[180px]"
                aria-label={t("heading")}
              />
              {error && (
                <p role="alert" className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {error}
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      {t("submit")}
                      <Arrow className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium text-text-muted">{t("resultTitle")}</p>

              <SitePreview
                src={previewImages[result.recommended_platform]}
                alt={
                  platformDisplayName[result.recommended_platform] ??
                  result.recommended_platform
                }
                href={destinations[result.recommended_platform]}
              />

              <div className="flex items-center gap-3 rounded-xl border border-brand-teal/30 bg-brand-teal/5 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-teal text-white">
                  <ArrowRight className="h-5 w-5 hidden rtl:block" aria-hidden="true" />
                  <ArrowLeft className="h-5 w-5 ltr:block" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {result.recommended_platform === "prowakeely"
                      ? t("platformNames.prowakeely")
                      : result.recommended_platform === "accident_wakeely"
                        ? t("platformNames.accident_wakeely")
                        : result.recommended_platform === "tenant_wakeely"
                          ? t("platformNames.tenant_wakeely")
                          : result.recommended_platform === "labor_wakeely"
                            ? t("platformNames.labor_wakeely")
                            : result.recommended_platform === "almizanpro"
                              ? t("platformNames.almizanpro")
                              : t("platformNames.legalwakeely")}
                  </p>
                  <p className="text-sm text-text-secondary">{result.reason_short}</p>
                </div>
              </div>

              {result.clarifying_questions.length > 0 && (
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    {t("clarifyingTitle")}
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-text-secondary">
                    {result.clarifying_questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={handleGo} className="w-full sm:w-auto">
                  {t("goButton")}
                  <Arrow className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    trackEvent("routing_rejected", {
                      chosen_instead: "reactivate_form",
                      session_id: sessionId,
                    });
                    setResult(null);
                    setText("");
                  }}
                  className="w-full sm:w-auto"
                >
                  <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                  {t("startOver")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </section>
  );
}
