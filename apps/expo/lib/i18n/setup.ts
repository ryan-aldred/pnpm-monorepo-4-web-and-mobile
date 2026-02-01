// Polyfills for React Native
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/es';
import '@formatjs/intl-pluralrules/locale-data/fr';

import { type I18n, type Messages } from '@lingui/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {
  createI18nInstance,
  activateLocale,
  mergeMessages,
  isSupportedLocale,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from '@monorepo/i18n';

// Static imports for all language bundles
// Common translations from packages/i18n
import { messages as commonEn } from '@monorepo/i18n/locales/en/messages';
import { messages as commonEs } from '@monorepo/i18n/locales/es/messages';
import { messages as commonFr } from '@monorepo/i18n/locales/fr/messages';

// Mobile-specific translations
import { messages as mobileEn } from '../../locales/en/messages';
import { messages as mobileEs } from '../../locales/es/messages';
import { messages as mobileFr } from '../../locales/fr/messages';

// Pre-merged message catalogs for each locale
const allMessages: Record<SupportedLocale, Messages> = {
  en: mergeMessages(commonEn, mobileEn),
  es: mergeMessages(commonEs, mobileEs),
  fr: mergeMessages(commonFr, mobileFr),
};

const LOCALE_STORAGE_KEY = '@app/locale';

// Singleton i18n instance
let i18nInstance: I18n | null = null;
let currentLocale: SupportedLocale = DEFAULT_LOCALE;

/**
 * Gets the singleton i18n instance
 */
export function getI18n(): I18n {
  if (!i18nInstance) {
    i18nInstance = createI18nInstance();
    activateLocale(i18nInstance, currentLocale, allMessages[currentLocale]);
  }
  return i18nInstance;
}

/**
 * Detects the device locale using expo-localization
 */
export function detectDeviceLocale(): SupportedLocale {
  const deviceLocales = Localization.getLocales();
  const primaryLocale = deviceLocales[0];

  if (
    primaryLocale?.languageCode &&
    isSupportedLocale(primaryLocale.languageCode)
  ) {
    return primaryLocale.languageCode;
  }

  return DEFAULT_LOCALE;
}

/**
 * Initializes i18n with persisted or device locale
 * Call this during app startup
 */
export async function initializeI18n(): Promise<I18n> {
  try {
    // Try to get persisted locale
    const persistedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);

    if (persistedLocale && isSupportedLocale(persistedLocale)) {
      currentLocale = persistedLocale;
    } else {
      // Fall back to device locale
      currentLocale = detectDeviceLocale();
    }
  } catch {
    // Fall back to device locale on error
    currentLocale = detectDeviceLocale();
  }

  const instance = getI18n();
  activateLocale(instance, currentLocale, allMessages[currentLocale]);

  return instance;
}

/**
 * Changes the active locale and persists it
 */
export async function changeLocale(locale: SupportedLocale): Promise<void> {
  currentLocale = locale;

  const instance = getI18n();
  activateLocale(instance, locale, allMessages[locale]);

  // Persist the locale
  try {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to persist locale:', error);
  }
}

/**
 * Gets the current locale
 */
export function getCurrentLocale(): SupportedLocale {
  return currentLocale;
}

export { DEFAULT_LOCALE, type SupportedLocale };
