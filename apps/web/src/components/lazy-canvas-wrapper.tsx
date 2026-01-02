'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';

// =============================================================================
// LAZY CANVAS WRAPPER
// =============================================================================
// This component handles deferred loading of the Three.js canvas.
//
// ISOLATION GUARANTEES:
// 1. SSR disabled - no server-side rendering of WebGL
// 2. requestIdleCallback - loads when browser is idle
// 3. memo() - prevents re-renders from parent state changes
// 4. Internal state only - no external dependencies that could trigger re-renders
//
// BACKEND INTEGRATION: No changes needed. This component is fully isolated
// and will not be affected by auth state, API responses, or data fetching.
// =============================================================================

// Dynamic import with SSR completely disabled - this is the key optimization
const OrbitalCanvas = dynamic(
  () => import('./orbital-canvas').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null, // Don't show anything while loading - parent handles placeholder
  }
);

interface LazyCanvasWrapperProps {
  /** Delay in ms before starting to load Three.js (default: 100) */
  delay?: number;
  /** Whether to use requestIdleCallback for loading (default: true) */
  useIdleCallback?: boolean;
}

/**
 * Performance-optimized wrapper that defers Three.js loading until:
 * 1. The page has hydrated
 * 2. The browser is idle (using requestIdleCallback)
 * 3. A minimum delay has passed to ensure UI is interactive
 */
function LazyCanvasWrapperComponent({
  delay = 100,
  useIdleCallback = true
}: LazyCanvasWrapperProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const startLoading = useCallback(() => {
    setShouldRender(true);
    // Fade in after a brief moment to allow WebGL to initialize
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  useEffect(() => {
    // Don't load on server
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let idleCallbackId: number;

    const scheduleLoad = () => {
      if (useIdleCallback && 'requestIdleCallback' in window) {
        // Use requestIdleCallback for optimal loading time
        idleCallbackId = window.requestIdleCallback(
          () => startLoading(),
          { timeout: 2000 } // Max wait 2 seconds
        );
      } else {
        // Fallback: load after delay
        startLoading();
      }
    };

    // Wait for minimum delay to ensure UI is interactive first
    timeoutId = setTimeout(scheduleLoad, delay);

    return () => {
      clearTimeout(timeoutId);
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [delay, useIdleCallback, startLoading]);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {shouldRender && <OrbitalCanvas />}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders from parent state
export const LazyCanvasWrapper = memo(LazyCanvasWrapperComponent);
LazyCanvasWrapper.displayName = 'LazyCanvasWrapper';

export default LazyCanvasWrapper;
