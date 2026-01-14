'use client';

/**
 * Theme Provider Component
 *
 * Provides theme context throughout the app with:
 * - System preference detection
 * - localStorage persistence
 * - Cross-tab synchronization
 * - SSR-safe hydration
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  type Theme,
  type ResolvedTheme,
  type ThemeConfig,
  getInitialTheme,
  getSystemTheme,
  saveTheme,
  applyTheme,
  resolveTheme,
  onSystemThemeChange,
  onThemeStorageChange,
} from '@/lib/theme';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface ThemeContextValue {
  /** Current theme setting: 'light' | 'dark' | 'system' */
  theme: Theme;

  /** Resolved theme (system preference resolved): 'light' | 'dark' */
  resolvedTheme: ResolvedTheme;

  /** Current system preference: 'light' | 'dark' */
  systemTheme: ResolvedTheme;

  /** Set theme and persist to localStorage */
  setTheme: (theme: Theme) => void;

  /** Toggle between light and dark (respects system if set to system) */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;

  /** Default theme if none saved (default: 'system') */
  defaultTheme?: Theme;

  /** Disable transitions during theme change (default: false) */
  disableTransitions?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  disableTransitions = false,
}: ThemeProviderProps) {
  // State initialized with system values
  const [mounted, setMounted] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => ({
    theme: defaultTheme,
    resolvedTheme: 'light', // Default to light for SSR
    systemTheme: 'light',
  }));

  // Initialize theme on mount (client-side only)
  useEffect(() => {
    const config = getInitialTheme();
    setThemeConfig(config);
    applyTheme(config.resolvedTheme);
    setMounted(true);
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const cleanup = onSystemThemeChange((newSystemTheme) => {
      setThemeConfig((prev) => {
        const newResolvedTheme =
          prev.theme === 'system' ? newSystemTheme : prev.resolvedTheme;

        // Apply theme if system preference changed and user is on system theme
        if (prev.theme === 'system') {
          applyTheme(newResolvedTheme);
        }

        return {
          ...prev,
          systemTheme: newSystemTheme,
          resolvedTheme: newResolvedTheme,
        };
      });
    });

    return cleanup;
  }, []);

  // Listen to storage changes (cross-tab sync)
  useEffect(() => {
    const cleanup = onThemeStorageChange((newTheme) => {
      const newResolvedTheme = resolveTheme(newTheme);

      setThemeConfig((prev) => ({
        theme: newTheme,
        resolvedTheme: newResolvedTheme,
        systemTheme: prev.systemTheme,
      }));

      applyTheme(newResolvedTheme);
    });

    return cleanup;
  }, []);

  // Set theme and persist
  const handleSetTheme = useCallback(
    (newTheme: Theme) => {
      // Optionally disable transitions during theme change
      if (disableTransitions) {
        const root = document.documentElement;
        root.style.setProperty('transition', 'none');

        // Re-enable after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            root.style.removeProperty('transition');
          });
        });
      }

      const newResolvedTheme = resolveTheme(newTheme);

      setThemeConfig((prev) => ({
        ...prev,
        theme: newTheme,
        resolvedTheme: newResolvedTheme,
      }));

      saveTheme(newTheme);
      applyTheme(newResolvedTheme);
    },
    [disableTransitions]
  );

  // Toggle between light and dark
  const handleToggleTheme = useCallback(() => {
    setThemeConfig((prev) => {
      // If on system, toggle to opposite of current resolved theme
      // If on light/dark, toggle between them
      const newTheme =
        prev.resolvedTheme === 'dark' ? 'light' : 'dark';

      const newResolvedTheme = resolveTheme(newTheme);

      saveTheme(newTheme);
      applyTheme(newResolvedTheme);

      return {
        ...prev,
        theme: newTheme,
        resolvedTheme: newResolvedTheme,
      };
    });
  }, []);

  const value: ThemeContextValue = {
    theme: themeConfig.theme,
    resolvedTheme: themeConfig.resolvedTheme,
    systemTheme: themeConfig.systemTheme,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Access theme context
 *
 * @example
 * const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

/**
 * Get resolved theme only (no setters)
 * Useful for components that only need to read theme
 *
 * @example
 * const theme = useResolvedTheme(); // 'light' | 'dark'
 */
export function useResolvedTheme(): ResolvedTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

/**
 * Check if dark mode is active
 *
 * @example
 * const isDark = useIsDarkMode();
 */
export function useIsDarkMode(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * HOC to inject theme props
 *
 * @example
 * const ThemedComponent = withTheme(MyComponent);
 */
export function withTheme<P extends object>(
  Component: React.ComponentType<P & ThemeContextValue>
) {
  return function ThemedComponent(props: P) {
    const theme = useTheme();
    return <Component {...props} {...theme} />;
  };
}
