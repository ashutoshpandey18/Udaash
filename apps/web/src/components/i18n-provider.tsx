'use client';

// =============================================================================
// I18N PROVIDER - DAY 12 (CALM AUTHORITY)
// =============================================================================
// Language context and persistence
// Browser preference detection
// =============================================================================

import * as React from 'react';
import type { Locale } from '@/lib/i18n';
import type { Translations } from '@/lib/translations';
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  saveLocale as persistLocale,
  loadLocale,
} from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale || DEFAULT_LOCALE);
  const [translations, setTranslations] = React.useState<Translations>(getTranslations(DEFAULT_LOCALE));

  React.useEffect(() => {
    setMounted(true);

    // Determine initial locale
    let detectedLocale = initialLocale;

    if (!detectedLocale) {
      // Try localStorage first
      const stored = loadLocale();
      if (stored) {
        detectedLocale = stored;
      } else {
        // Fall back to browser detection
        detectedLocale = detectBrowserLocale();
      }
    }

    setLocaleState(detectedLocale);
    setTranslations(getTranslations(detectedLocale));

    // Listen for locale changes from other tabs/components
    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocaleState(e.detail);
      setTranslations(getTranslations(e.detail));
    };

    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setTranslations(getTranslations(newLocale));
    persistLocale(newLocale);

    // Update HTML lang attribute for accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  };

  // Don't render context until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: translations,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) {
    // Return default values during SSR or before mount
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: getTranslations(DEFAULT_LOCALE),
    };
  }
  return context;
}

// Convenience hook for just translations
export function useTranslations() {
  const { t } = useI18n();
  return t;
}

// Convenience hook for just locale
export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
