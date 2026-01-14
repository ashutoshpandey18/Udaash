'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import type { Theme } from '@/lib/theme';

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggleImpl({
  variant = 'default',
  showLabel = true,
  className = '',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleCycleTheme = () => {
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }

    if (resolvedTheme === 'dark') {
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }

    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCycleTheme}
        className={`
          inline-flex items-center gap-2 rounded-lg px-3 py-2
          text-sm font-medium
          bg-neutral-100 dark:bg-neutral-800
          text-neutral-900 dark:text-neutral-100
          hover:bg-neutral-200 dark:hover:bg-neutral-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-neutral-900
          transition-colors duration-150
          ${className}
        `}
        aria-label={`Switch theme (current: ${getLabel()})`}
      >
        {getIcon()}
        {showLabel && <span>{theme === 'system' ? 'Auto' : getLabel()}</span>}
      </button>
    );
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleCycleTheme}
        className={`
          inline-flex items-center justify-center
          h-10 w-10 rounded-lg
          text-neutral-700 dark:text-neutral-300
          hover:bg-neutral-100 dark:hover:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-neutral-900
          transition-colors duration-150
          ${className}
        `}
        aria-label={`Switch theme (current: ${getLabel()})`}
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <button
      onClick={handleCycleTheme}
      className={`
        inline-flex items-center gap-2 rounded-lg px-4 py-2
        text-sm font-medium
        bg-white dark:bg-neutral-800
        text-neutral-900 dark:text-neutral-100
        border border-neutral-200 dark:border-neutral-700
        hover:bg-neutral-50 dark:hover:bg-neutral-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-neutral-900
        transition-colors duration-150
        ${className}
      `}
      aria-label={`Switch theme (current: ${getLabel()})`}
    >
      {getIcon()}
      {showLabel && <span>Theme: {getLabel()}</span>}
    </button>
  );
}
