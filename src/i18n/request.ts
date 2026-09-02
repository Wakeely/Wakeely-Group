import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import ar from "../messages/ar.json";
import en from "../messages/en.json";

const messageFiles = {
  ar,
  en,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messageFiles[locale as keyof typeof messageFiles],
  };
});
