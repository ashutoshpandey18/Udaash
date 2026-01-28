// =============================================================================
// I18N UTILITIES - DAY 12 (CALM AUTHORITY)
// =============================================================================
// Locale detection, persistence, and utilities
// Production-ready, no over-engineering
// =============================================================================

export const SUPPORTED_LOCALES = ['en', 'hi'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
};

// =============================================================================
// LOCALE DETECTION
// =============================================================================

export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // Check navigator.languages for best match
  const browserLangs = navigator.languages || [navigator.language];

  for (const lang of browserLangs) {
    if (!lang) continue;
    const normalized = lang.split('-')[0]?.toLowerCase();
    if (normalized && SUPPORTED_LOCALES.includes(normalized as Locale)) {
      return normalized as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

// =============================================================================
// LOCALE PERSISTENCE
// =============================================================================

const STORAGE_KEY = 'udaash_locale';

export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, locale);

  // Dispatch custom event for other components to listen
  window.dispatchEvent(new CustomEvent('localeChanged', { detail: locale }));
}

export function loadLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && SUPPORTED_LOCALES.includes(stored as Locale) ? (stored as Locale) : null;
}

// =============================================================================
// LOCALE VALIDATION
// =============================================================================

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function normalizeLocale(locale: string | undefined): Locale {
  if (!locale) return DEFAULT_LOCALE;
  const normalized = locale.toLowerCase().split('-')[0];
  return (normalized && isValidLocale(normalized)) ? normalized : DEFAULT_LOCALE;
}

// =============================================================================
// URL HELPERS
// =============================================================================

export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading locale if present
  const cleanPath = path.replace(/^\/(en|hi)/, '');
  // Add new locale
  return `/${locale}${cleanPath}`;
}

export function extractLocaleFromPath(path: string): Locale | null {
  const match = path.match(/^\/(en|hi)/);
  return match ? (match[1] as Locale) : null;
}

// =============================================================================
// VOICE LANGUAGE DETECTION
// =============================================================================

export const VOICE_LANGUAGE_CODES: Record<Locale, string[]> = {
  en: ['en-US', 'en-GB', 'en-IN', 'en-AU'],
  hi: ['hi-IN'],
};

export function getVoiceLanguageCode(locale: Locale): string {
  return VOICE_LANGUAGE_CODES[locale]?.[0] || 'en-US';
}

// Detect language from spoken text (simple heuristic)
export function detectSpokenLanguage(text: string): Locale {
  // Hindi Unicode range: U+0900 to U+097F (Devanagari)
  const hindiPattern = /[\u0900-\u097F]/;

  if (hindiPattern.test(text)) {
    return 'hi';
  }

  return 'en';
}

// =============================================================================
// RTL SUPPORT (FUTURE)
// =============================================================================

export function isRTL(locale: Locale): boolean {
  // Hindi is LTR, but this is here for future Arabic/Hebrew support
  return false;
}
