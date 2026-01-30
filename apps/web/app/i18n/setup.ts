import { type I18n, type Messages } from "@lingui/core";
import {
  createI18nInstance,
  detectLocaleFromHeader,
  activateLocale,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@monorepo/i18n";

// Import compiled message catalogs (from .po files)
// Common translations from packages/i18n
import { messages as commonEn } from "@monorepo/i18n/locales/en/messages.mjs";
import { messages as commonEs } from "@monorepo/i18n/locales/es/messages.mjs";
import { messages as commonFr } from "@monorepo/i18n/locales/fr/messages.mjs";

// Web-specific translations
import { messages as webEn } from "~/locales/en/messages.mjs";
import { messages as webEs } from "~/locales/es/messages.mjs";
import { messages as webFr } from "~/locales/fr/messages.mjs";

// Merge common + web-specific messages for each locale
const allMessages: Record<SupportedLocale, Messages> = {
  en: { ...commonEn, ...webEn },
  es: { ...commonEs, ...webEs },
  fr: { ...commonFr, ...webFr },
};

// Detect if we're on the server or client
const isServer = typeof window === "undefined";

// Client singleton for hydration consistency (only used on client)
let clientI18n: I18n | null = null;
let clientLocale: SupportedLocale | null = null;

/**
 * Gets an i18n instance for the given locale.
 * On the server: creates a fresh instance each time (no singleton).
 * On the client: uses a singleton for hydration consistency.
 */
export function getI18nInstance(locale: SupportedLocale): I18n {
  if (isServer) {
    // Server: always create fresh instance to avoid cross-request pollution
    const instance = createI18nInstance();
    activateLocale(instance, locale, allMessages[locale]);
    return instance;
  }

  // Client: use singleton
  if (!clientI18n) {
    clientI18n = createI18nInstance();
    clientLocale = locale;
    activateLocale(clientI18n, locale, allMessages[locale]);
  } else if (clientLocale !== locale) {
    // Locale changed - update synchronously for hydration match
    clientLocale = locale;
    activateLocale(clientI18n, locale, allMessages[locale]);
  }
  return clientI18n;
}

/**
 * Gets a per-request i18n instance for SSR (legacy, prefer getI18nInstance)
 */
export function getServerI18n(request: Request): I18n {
  const locale = getLocaleFromRequest(request);
  return getI18nInstance(locale);
}

/**
 * Initializes the client i18n singleton (legacy, prefer getI18nInstance).
 */
export function initClientI18n(locale: SupportedLocale): I18n {
  return getI18nInstance(locale);
}

/**
 * Gets the client-side i18n singleton.
 */
export function getClientI18n(): I18n {
  if (!clientI18n) {
    throw new Error("Client i18n not initialized. Call initClientI18n first.");
  }
  return clientI18n;
}

/**
 * Changes the client locale. Should be called outside of render (e.g., in useEffect).
 */
export function setClientLocale(locale: SupportedLocale): void {
  if (!isServer && clientI18n && clientLocale !== locale) {
    clientLocale = locale;
    activateLocale(clientI18n, locale, allMessages[locale]);
  }
}

/**
 * Extracts locale from request
 * Checks cookie first, then Accept-Language header
 */
export function getLocaleFromRequest(request: Request): SupportedLocale {
  // Check for locale cookie first
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader) {
    const localeCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("locale="));
    if (localeCookie) {
      const locale = localeCookie.split("=")[1]?.trim();
      if (locale && locale in allMessages) {
        return locale as SupportedLocale;
      }
    }
  }

  // Fall back to Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language");
  return detectLocaleFromHeader(acceptLanguage);
}

/**
 * Gets messages for a specific locale
 */
export function getMessages(locale: SupportedLocale): Messages {
  return allMessages[locale];
}

export { DEFAULT_LOCALE, type SupportedLocale };
