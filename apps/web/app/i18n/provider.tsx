import { createContext, useContext } from 'react';
import type { I18n } from '@lingui/core';
import type { ReactNode } from 'react';

// Create our own context to avoid Lingui's hook issues with SSR
const I18nContext = createContext<I18n | null>(null);

interface I18nProviderProps {
  i18n: I18n;
  children: ReactNode;
}

export function I18nProvider({ i18n, children }: I18nProviderProps) {
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const i18n = useContext(I18nContext);
  if (!i18n) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return i18n;
}

// Compatibility hook for components using useLingui pattern
export function useLingui(): { i18n: I18n } {
  return { i18n: useI18n() };
}
