import { setupI18n, type I18n, type Messages } from "@lingui/core";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "./types";

/**
 * Creates a new i18n instance for isolated usage (e.g., SSR per-request)
 */
export function createI18nInstance(): I18n {
  return setupI18n();
}

/**
 * Detects locale from Accept-Language header
 * Returns the first supported locale found, or the default locale
 */
export function detectLocaleFromHeader(
  acceptLanguage: string | null
): SupportedLocale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code?.split("-")[0]?.toLowerCase() ?? "",
        q: qValue ? parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (isSupportedLocale(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Activates a locale on the given i18n instance with the provided messages
 */
export function activateLocale(
  instance: I18n,
  locale: SupportedLocale,
  messages: Messages
): void {
  instance.load(locale, messages);
  instance.activate(locale);
}

/**
 * Merges multiple message catalogs together
 * Later catalogs override earlier ones for the same keys
 */
export function mergeMessages(...catalogs: Messages[]): Messages {
  return Object.assign({}, ...catalogs);
}
