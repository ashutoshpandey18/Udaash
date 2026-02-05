// =============================================================================
// PERFORMANCE UTILITIES - DAY 14 (CALM AUTHORITY)
// =============================================================================
// Realistic, measurable performance optimizations
// No premature micro-optimizations
// =============================================================================

// =============================================================================
// DEVICE CAPABILITY DETECTION (SAFE)
// =============================================================================

/**
 * Check if user prefers reduced motion
 * Used to disable animations for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers reduced data
 * Used to avoid loading heavy assets
 */
export function prefersReducedData(): boolean {
  if (typeof window === 'undefined') return false;
  // @ts-ignore - not all browsers support this yet
  return window.matchMedia('(prefers-reduced-data: reduce)').matches;
}

/**
 * Check if connection is slow
 * Based on Network Information API (when available)
 */
export function isSlowConnection(): boolean {
  if (typeof window === 'undefined') return false;

  // @ts-ignore - Network Information API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) return false;

  // Consider slow if:
  // - Effective type is 2g or slow-2g
  // - Save data mode is enabled
  return connection.effectiveType === '2g' ||
         connection.effectiveType === 'slow-2g' ||
         connection.saveData === true;
}

// =============================================================================
// LAZY LOADING HELPERS
// =============================================================================

/**
 * Check if component should be lazy loaded
 * Based on device capabilities and user preferences
 */
export function shouldLazyLoad(options: {
  critical?: boolean;
  heavy?: boolean;
} = {}): boolean {
  // Always load critical components eagerly
  if (options.critical) return false;

  // Heavy components should be lazy loaded by default
  if (options.heavy) return true;

  // Lazy load on slow connections
  if (isSlowConnection()) return true;

  return false;
}

// =============================================================================
// PERFORMANCE MEASUREMENT (DEV ONLY)
// =============================================================================

/**
 * Mark performance entry (dev only)
 * Removed in production builds
 */
export function perfMark(name: string): void {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.mark(name);
    } catch (e) {
      // Ignore errors
    }
  }
}

/**
 * Measure performance between two marks (dev only)
 * Removed in production builds
 */
export function perfMeasure(name: string, startMark: string, endMark: string): number | null {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Clear performance marks and measures (dev only)
 */
export function perfClear(): void {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    } catch (e) {
      // Ignore errors
    }
  }
}

// =============================================================================
// COMPONENT OPTIMIZATION HELPERS
// =============================================================================

/**
 * Debounce function
 * Limits how often a function can execute
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * Ensures function executes at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// =============================================================================
// RESOURCE LOADING
// =============================================================================

/**
 * Preload critical resource
 * Use sparingly for above-the-fold assets only
 */
export function preloadResource(href: string, as: 'image' | 'font' | 'script' | 'style'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Prefetch resource for future navigation
 * Lower priority than preload
 */
export function prefetchResource(href: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;

  document.head.appendChild(link);
}

// =============================================================================
// WEB VITALS REPORTING (OPTIONAL)
// =============================================================================

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Report web vitals (dev only)
 * Can be extended to send to analytics in production
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }

  // In production, you might send to analytics:
  // analytics.track('web-vitals', metric);
}
