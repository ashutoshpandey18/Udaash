'use client';

// =============================================================================
// INTERACTIVE CARD - DAY 11 (CALM AUTHORITY)
// =============================================================================
// Reusable interaction wrapper
// Consistent hover/tap feedback
// =============================================================================

import { ReactNode, HTMLAttributes } from 'react';
import { INTERACTION_CLASSES } from '@/lib/interaction-config';
import { useMotion } from './interaction-provider';

interface InteractiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'subtle' | 'none';
  disabled?: boolean;
  asButton?: boolean;
}

export function InteractiveCard({
  children,
  variant = 'default',
  disabled = false,
  asButton = false,
  className = '',
  ...props
}: InteractiveCardProps) {
  const Component = asButton ? 'button' : 'div';
  const enableMotion = useMotion();

  const interactionClass = !enableMotion
    ? INTERACTION_CLASSES.hover.none
    : variant === 'subtle'
    ? INTERACTION_CLASSES.hover.subtle
    : variant === 'none'
    ? INTERACTION_CLASSES.hover.none
    : INTERACTION_CLASSES.hover.default;

  const focusClass = asButton ? INTERACTION_CLASSES.focus.default : '';
  const disabledClass = disabled ? INTERACTION_CLASSES.disabled.default : '';

  return (
    <Component
      className={`${interactionClass} ${focusClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
