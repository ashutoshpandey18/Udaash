/**
 * Theme System Utilities
 *
 * Production-grade theming with:
 * - System preference detection
 * - localStorage persistence
 * - Accessibility support
 * - Calm Authority color tokens
 *
 * @see DAY-7-THEME-SYSTEM.md for complete documentation
 */

// ============================================================================
// THEME TYPES
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
}

// ============================================================================
// THEME DETECTION
// ============================================================================

/**
 * Get system color scheme preference
 * Uses prefers-color-scheme media query
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}

/**
 * Listen to system theme changes
 * Returns cleanup function
 */
export function onSystemThemeChange(
  callback: (theme: ResolvedTheme) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Fallback for older browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}

// ============================================================================
// THEME PERSISTENCE
// ============================================================================

const THEME_STORAGE_KEY = 'udaash-theme';

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

/**
 * Get saved theme preference from localStorage
 * Returns 'system' if none saved
 */
export function getSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
  }

  return 'system';
}

/**
 * Clear saved theme preference
 */
export function clearSavedTheme(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear theme preference:', error);
  }
}

// ============================================================================
// THEME APPLICATION
// ============================================================================

/**
 * Apply theme to document
 * Adds/removes 'dark' class on <html> element
 */
export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update meta theme-color for PWA
  updateThemeColor(theme);
}

/**
 * Update theme-color meta tag for mobile browsers and PWA
 */
function updateThemeColor(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if (metaThemeColor) {
    // Light: white, Dark: near-black neutral
    const color = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    metaThemeColor.setAttribute('content', color);
  }
}

/**
 * Resolve theme preference to actual theme
 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

// ============================================================================
// THEME INITIALIZATION (SSR-SAFE)
// ============================================================================

/**
 * Get initial theme config on mount
 * Handles SSR, system preference, and saved preference
 */
export function getInitialTheme(): ThemeConfig {
  const systemTheme = getSystemTheme();
  const savedTheme = getSavedTheme();
  const resolvedTheme = resolveTheme(savedTheme);

  return {
    theme: savedTheme,
    resolvedTheme,
    systemTheme,
  };
}

/**
 * Initialize theme on page load (blocking script)
 * Prevents flash of unstyled content (FOUC)
 *
 * Usage: Call this in <head> via inline <script>
 */
export function getThemeInitScript(): string {
  return `
(function() {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}') || 'system';
    var resolvedTheme = theme;

    if (theme === 'system') {
      var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      resolvedTheme = darkQuery.matches ? 'dark' : 'light';
    }

    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Update theme-color meta
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff');
    }
  } catch (e) {}
})();
  `.trim();
}

// ============================================================================
// STORAGE SYNC (CROSS-TAB)
// ============================================================================

/**
 * Listen to theme changes from other tabs
 * Returns cleanup function
 */
export function onThemeStorageChange(
  callback: (theme: Theme) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY && e.newValue) {
      const theme = e.newValue as Theme;
      if (theme === 'light' || theme === 'dark' || theme === 'system') {
        callback(theme);
      }
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

// ============================================================================
// COLOR TOKENS (CALM AUTHORITY)
// ============================================================================

/**
 * Theme color palette
 * Near-black neutrals for dark mode
 * Pure white for light mode
 * No neon or high-saturation colors
 */
export const themeColors = {
  light: {
    // Backgrounds
    bg: {
      primary: '#ffffff',      // Main background
      secondary: '#f9fafb',    // Gray-50 - Secondary surfaces
      tertiary: '#f3f4f6',     // Gray-100 - Elevated cards
      elevated: '#ffffff',     // Pure white - Modals, dropdowns
    },
    // Text
    text: {
      primary: '#111827',      // Gray-900 - Headings
      secondary: '#4b5563',    // Gray-600 - Body text
      tertiary: '#6b7280',     // Gray-500 - Muted text
      disabled: '#9ca3af',     // Gray-400 - Disabled
    },
    // Borders
    border: {
      default: '#e5e7eb',      // Gray-200 - Default borders
      emphasis: '#d1d5db',     // Gray-300 - Hover borders
      strong: '#9ca3af',       // Gray-400 - Strong dividers
    },
    // Accents
    accent: {
      primary: '#2563eb',      // Blue-600 - Primary actions
      primaryHover: '#1d4ed8', // Blue-700 - Hover state
      success: '#059669',      // Green-600 - Success states
      warning: '#d97706',      // Amber-600 - Warnings
      error: '#dc2626',        // Red-600 - Errors
    },
    // Surfaces
    surface: {
      hover: '#f9fafb',        // Gray-50 - Hover backgrounds
      selected: '#eff6ff',     // Blue-50 - Selected items
      focus: '#dbeafe',        // Blue-100 - Focus rings
    },
  },
  dark: {
    // Backgrounds (near-black, not pure black)
    bg: {
      primary: '#0a0a0a',      // Near-black - Main background
      secondary: '#141414',    // Slightly lighter - Secondary surfaces
      tertiary: '#1a1a1a',     // Card backgrounds
      elevated: '#1f1f1f',     // Modals, dropdowns (elevated)
    },
    // Text
    text: {
      primary: '#f9fafb',      // Gray-50 - Headings
      secondary: '#d1d5db',    // Gray-300 - Body text
      tertiary: '#9ca3af',     // Gray-400 - Muted text
      disabled: '#6b7280',     // Gray-500 - Disabled
    },
    // Borders (soft, not bright)
    border: {
      default: '#262626',      // Subtle gray
      emphasis: '#404040',     // Slightly brighter
      strong: '#525252',       // Strong dividers
    },
    // Accents (muted, not neon)
    accent: {
      primary: '#3b82f6',      // Blue-500 - Primary actions (slightly muted)
      primaryHover: '#60a5fa', // Blue-400 - Hover state
      success: '#10b981',      // Green-500 - Success states
      warning: '#f59e0b',      // Amber-500 - Warnings
      error: '#ef4444',        // Red-500 - Errors
    },
    // Surfaces
    surface: {
      hover: '#1a1a1a',        // Subtle hover
      selected: '#1e3a5f',     // Blue-900/20 - Selected items
      focus: '#1e40af',        // Blue-800 - Focus rings (dimmed)
    },
  },
} as const;

/**
 * Get color value by path
 * Example: getThemeColor('dark', 'bg.primary') => '#0a0a0a'
 */
export function getThemeColor(
  theme: ResolvedTheme,
  path: string
): string | undefined {
  const keys = path.split('.');
  let value: any = themeColors[theme];

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Get transition duration based on reduced motion preference
 * Returns 0ms if user prefers reduced motion, otherwise provided duration
 */
export function getTransitionDuration(defaultMs: number = 150): number {
  return prefersReducedMotion() ? 0 : defaultMs;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get next theme in cycle
 * light → dark → system → light
 */
export function getNextTheme(current: Theme): Theme {
  const cycle: Theme[] = ['light', 'dark', 'system'];
  const currentIndex = cycle.indexOf(current);
  return cycle[(currentIndex + 1) % cycle.length];
}

/**
 * Get theme label for display
 */
export function getThemeLabel(theme: Theme): string {
  return theme.charAt(0).toUpperCase() + theme.slice(1);
}

/**
 * Get theme icon name
 */
export function getThemeIcon(theme: ResolvedTheme): string {
  return theme === 'dark' ? '🌙' : '☀️';
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function isValidResolvedTheme(value: unknown): value is ResolvedTheme {
  return value === 'light' || value === 'dark';
}
