'use client';

import { useState, useEffect, useCallback, memo, type ComponentType } from 'react';

// =============================================================================
// CANVAS SECTION - CLIENT-ONLY THREE.JS CONTAINER
// =============================================================================
// This component handles the DEFERRED loading of @react-three/fiber.
//
// THE PROBLEM:
// @react-three/fiber accesses React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
// during MODULE EVALUATION (not render). This causes "ReactCurrentOwner" errors if:
// 1. The module loads before React is fully hydrated
// 2. There's any chunk splitting that evaluates r3f before React
//
// THE SOLUTION:
// Use a manual dynamic import INSIDE useEffect, which only runs:
// 1. On the client (never SSR)
// 2. After React has fully hydrated
// 3. After the component has mounted
//
// This guarantees React is 100% ready before @react-three/fiber is ever imported.
// =============================================================================

interface CanvasSectionProps {
  delay?: number;
}

function CanvasSectionComponent({ delay = 100 }: CanvasSectionProps) {
  const [OrbitalCanvas, setOrbitalCanvas] = useState<ComponentType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // This only runs on client, after React is fully hydrated
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    let idleCallbackId: number;

    const loadCanvas = async () => {
      try {
        // Dynamic import INSIDE useEffect ensures React is ready
        const module = await import('./orbital-canvas');
        if (isMounted) {
          setOrbitalCanvas(() => module.default);
          // Fade in after component is set
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (isMounted) setIsVisible(true);
            });
          });
        }
      } catch (err) {
        console.error('Failed to load OrbitalCanvas:', err);
        if (isMounted) setLoadError(err as Error);
      }
    };

    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        idleCallbackId = window.requestIdleCallback(
          () => loadCanvas(),
          { timeout: 2000 }
        );
      } else {
        loadCanvas();
      }
    };

    // Wait for delay to ensure UI is interactive first
    timeoutId = setTimeout(scheduleLoad, delay);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [delay]);

  // Don't render anything if there was a load error
  if (loadError) {
    console.error('Canvas load error:', loadError);
    return null;
  }

  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {OrbitalCanvas && <OrbitalCanvas />}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
const CanvasSection = memo(CanvasSectionComponent);
CanvasSection.displayName = 'CanvasSection';

export default CanvasSection;
