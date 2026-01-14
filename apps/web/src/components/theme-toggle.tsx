'use client';

/**
 * Theme Toggle Component
 *
 * Simple, accessible theme switcher with:
 * - Clear visual indication of current theme
 * - Keyboard accessible
 * - Optional reduced motion support
 * - Calm, professional appearance
 *
 * @example
 * <ThemeToggle />
 * <ThemeToggle variant="compact" />
 */

import React from 'react';
import dynamic from 'next/dynamic';
import type { Theme } from '@/lib/theme';

// ============================================================================
// COMPONENT TYPES
// ============================================================================

interface ThemeToggleProps {
  /** Visual variant */
  variant?: 'default' | 'compact' | 'icon-only';

  /** Show current theme label */
  showLabel?: boolean;

  /** Custom className */
  className?: string;
}

// Loading placeholder
function ThemeToggleSkeleton({ variant, className }: { variant?: string; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md animate-pulse bg-neutral-100 dark:bg-neutral-800 ${className}`}
      style={{ width: variant === 'icon-only' ? '40px' : '100px', height: '36px' }}
    />
  );
}

// Dynamic import with no SSR to avoid theme context issues
export const ThemeToggle = dynamic(
  () => import('./theme-toggle-impl').then((mod) => mod.ThemeToggleImpl),
  {
    ssr: false,
    loading: () => <ThemeToggleSkeleton variant="default" className="" />
  }
);
