// =============================================================================
// INTERACTION CONFIG - DAY 11 (CALM AUTHORITY)
// =============================================================================
// Centralized motion & interaction tokens
// Predictable, fast, intentional
// No physics, no theatrics
// =============================================================================

export const INTERACTION_TOKENS = {
  // Scale transforms (subtle)
  scale: {
    hover: 1.01,
    tap: 0.98,
    disabled: 1.0,
  },

  // Transition durations (fast)
  duration: {
    instant: 0,
    fast: 80,
    normal: 120,
    slow: 200,
  },

  // Easing curves (native-feeling)
  ease: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material easeInOut
    out: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // Material easeOut
    in: 'cubic-bezier(0.4, 0.0, 1, 1)', // Material easeIn
  },

  // Opacity changes
  opacity: {
    dimmed: 0.6,
    hidden: 0,
    visible: 1,
  },

  // Drag & drop
  drag: {
    snapDuration: 150,
    dragOpacity: 0.8,
    dragScale: 1.02,
  },

  // Focus & state indicators
  focus: {
    ringWidth: 2,
    ringOpacity: 0.5,
  },
} as const;

// =============================================================================
// MOTION DETECTION
// =============================================================================

export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

// =============================================================================
// SAFE DURATION HELPER
// =============================================================================
// Returns 0 duration if motion should be reduced

export function getDuration(duration: number): number {
  return shouldReduceMotion() ? 0 : duration;
}

// =============================================================================
// INTERACTION CLASSES (Tailwind-compatible)
// =============================================================================

export const INTERACTION_CLASSES = {
  // Hover states
  hover: {
    default: 'transition-transform duration-75 hover:scale-[1.01] active:scale-[0.98]',
    subtle: 'transition-opacity duration-75 hover:opacity-90',
    none: '',
  },

  // Focus states
  focus: {
    default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    inset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
    none: 'focus-visible:outline-none',
  },

  // Transitions
  transition: {
    fast: 'transition-all duration-75',
    normal: 'transition-all duration-100',
    slow: 'transition-all duration-200',
    colors: 'transition-colors duration-100',
    transform: 'transition-transform duration-75',
    opacity: 'transition-opacity duration-100',
  },

  // Disabled states
  disabled: {
    default: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    subtle: 'disabled:opacity-60 disabled:cursor-not-allowed',
  },
} as const;

// =============================================================================
// GESTURE HELPERS
// =============================================================================

export function handleTouchFeedback(element: HTMLElement): void {
  if (typeof window === 'undefined' || shouldReduceMotion()) return;

  element.style.transform = 'scale(0.98)';
  setTimeout(() => {
    element.style.transform = '';
  }, INTERACTION_TOKENS.duration.fast);
}

export function handleHoverFeedback(element: HTMLElement, isHovering: boolean): void {
  if (typeof window === 'undefined' || shouldReduceMotion()) return;

  element.style.transform = isHovering ? 'scale(1.01)' : '';
}

// =============================================================================
// ANIMATION FRAME RATE DETECTION
// =============================================================================

export function isDeviceLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  return shouldReduceMotion();
}

// =============================================================================
// SAFE ANIMATION PROPS (for Framer Motion)
// =============================================================================

export function getMotionProps(options: {
  hover?: boolean;
  tap?: boolean;
  initial?: boolean;
  animate?: boolean;
} = {}) {
  if (shouldReduceMotion()) {
    return {
      initial: false,
      animate: false,
      whileHover: {},
      whileTap: {},
      transition: { duration: 0 },
    };
  }

  const { hover = true, tap = true, initial = true, animate = true } = options;

  return {
    initial: initial ? { opacity: 0, scale: 0.95 } : false,
    animate: animate ? { opacity: 1, scale: 1 } : false,
    whileHover: hover ? { scale: INTERACTION_TOKENS.scale.hover } : {},
    whileTap: tap ? { scale: INTERACTION_TOKENS.scale.tap } : {},
    transition: {
      duration: INTERACTION_TOKENS.duration.fast / 1000,
      ease: INTERACTION_TOKENS.ease.out,
    },
  };
}
