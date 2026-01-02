'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  defaultPhysicsConfig,
  springPresets,
  type PhysicsConfig,
} from '@/lib/physics-config';

interface PhysicsContextValue {
  config: PhysicsConfig;
  springConfig: {
    type: 'spring';
    stiffness: number;
    damping: number;
    mass: number;
  };
  updateConfig: (newConfig: Partial<PhysicsConfig>) => void;
  setPreset: (preset: keyof typeof springPresets) => void;
  isReducedMotion: boolean;
}

const PhysicsContext = createContext<PhysicsContextValue | null>(null);

interface PhysicsProviderProps {
  children: ReactNode;
  initialConfig?: Partial<PhysicsConfig>;
}

export function PhysicsProvider({
  children,
  initialConfig,
}: PhysicsProviderProps) {
  const [config, setConfig] = useState<PhysicsConfig>({
    ...defaultPhysicsConfig,
    ...initialConfig,
  });

  const [isReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const updateConfig = useCallback((newConfig: Partial<PhysicsConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const setPreset = useCallback((preset: keyof typeof springPresets) => {
    const presetConfig = springPresets[preset];
    setConfig((prev) => ({
      ...prev,
      stiffness: presetConfig.stiffness,
      damping: presetConfig.damping,
      mass: presetConfig.mass,
    }));
  }, []);

  const springConfig = useMemo(
    () => ({
      type: 'spring' as const,
      stiffness: isReducedMotion ? 300 : config.stiffness,
      damping: isReducedMotion ? 30 : config.damping,
      mass: config.mass,
    }),
    [config.stiffness, config.damping, config.mass, isReducedMotion]
  );

  const value = useMemo(
    () => ({
      config,
      springConfig,
      updateConfig,
      setPreset,
      isReducedMotion,
    }),
    [config, springConfig, updateConfig, setPreset, isReducedMotion]
  );

  return (
    <PhysicsContext.Provider value={value}>{children}</PhysicsContext.Provider>
  );
}

export function usePhysics(): PhysicsContextValue {
  const context = useContext(PhysicsContext);
  if (!context) {
    throw new Error('usePhysics must be used within a PhysicsProvider');
  }
  return context;
}

export { PhysicsContext };
