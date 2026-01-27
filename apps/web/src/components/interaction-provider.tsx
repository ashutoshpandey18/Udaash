'use client';

// =============================================================================
// INTERACTION PROVIDER - DAY 11 (CALM AUTHORITY)
// =============================================================================
// Centralized motion preferences
// Respects user settings
// =============================================================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface InteractionContextValue {
  reduceMotion: boolean;
  lowPowerMode: boolean;
  enableMotion: boolean;
  toggleMotion: () => void;
}

const InteractionContext = createContext<InteractionContextValue | undefined>(undefined);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);

    // Initialize motion detection safely
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    setLowPowerMode(mediaQuery.matches);

    // Check for user preference in localStorage
    const stored = localStorage.getItem('udaash_motion_enabled');
    if (stored !== null) {
      setManualOverride(stored === 'true');
    }

    // Listen for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleMotion = () => {
    if (typeof window === 'undefined') return;

    const newValue = manualOverride === null ? false : !manualOverride;
    setManualOverride(newValue);
    localStorage.setItem('udaash_motion_enabled', String(newValue));
  };

  const enableMotion = manualOverride ?? (!reduceMotion && !lowPowerMode);

  // Don't render context until client-side hydration is complete
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <InteractionContext.Provider
      value={{
        reduceMotion,
        lowPowerMode,
        enableMotion,
        toggleMotion,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within InteractionProvider');
  }
  return context;
}

// Convenience hook for motion-enabled components
export function useMotion() {
  const { enableMotion } = useInteraction();
  return enableMotion;
}
