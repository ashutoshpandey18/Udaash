'use client';

// =============================================================================
// PERFORMANCE INDICATOR - DAY 14 (CALM AUTHORITY)
// =============================================================================
// Development-only performance metrics display
// Automatically excluded from production builds
// =============================================================================

import { useEffect, useState } from 'react';
import { perfMark, perfMeasure, prefersReducedMotion } from '@/lib/performance';

interface PerformanceMetrics {
  renderTime: number | null;
  componentCount: number;
  memoryUsage: number | null;
}

/**
 * Performance Indicator (Dev Only)
 *
 * Displays real-time performance metrics during development
 * Automatically removed from production builds
 *
 * Position: Bottom-right corner
 * Toggle: Click to expand/collapse
 */
export function PerformanceIndicator() {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: null,
    componentCount: 0,
    memoryUsage: null,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Mark component mount
    perfMark('performance-indicator-mount');

    // Update metrics periodically
    const interval = setInterval(() => {
      updateMetrics();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateMetrics = () => {
    // Get memory usage (if available)
    let memoryUsage: number | null = null;
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory as {
        usedJSHeapSize?: number;
        totalJSHeapSize?: number;
      };
      if (memory && typeof memory.usedJSHeapSize === 'number') {
        memoryUsage = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
      }
    }

    // Estimate component count (rough approximation)
    const componentCount = document.querySelectorAll('[data-component]').length;

    // Get recent render time
    const entries = performance.getEntriesByType('measure');
    const recentRender = entries[entries.length - 1];
    const renderTime = recentRender ? Math.round(recentRender.duration) : null;

    setMetrics({
      renderTime,
      componentCount,
      memoryUsage,
    });
  };

  if (!mounted) return null;

  const reducedMotion = prefersReducedMotion();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 font-mono text-xs"
      role="status"
      aria-live="polite"
      aria-label="Performance metrics"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2
          bg-black/80 text-white rounded-lg
          backdrop-blur-sm border border-white/10
          hover:bg-black/90 transition-colors
          ${reducedMotion ? '' : 'transition-all'}
        `}
        aria-expanded={isExpanded}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            metrics.renderTime && metrics.renderTime > 100
              ? 'bg-red-500'
              : metrics.renderTime && metrics.renderTime > 50
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          aria-hidden="true"
        />
        <span className="font-semibold">PERF</span>
        {isExpanded && <span>↓</span>}
      </button>

      {isExpanded && (
        <div
          className={`
            mt-2 p-3 bg-black/90 text-white rounded-lg
            backdrop-blur-sm border border-white/10
            space-y-2 min-w-52
            ${reducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2'}
          `}
        >
          <div className="flex justify-between">
            <span className="text-neutral-400">Render:</span>
            <span className="font-semibold">
              {metrics.renderTime !== null ? `${metrics.renderTime}ms` : '—'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Components:</span>
            <span className="font-semibold">{metrics.componentCount || '—'}</span>
          </div>

          {metrics.memoryUsage !== null && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Memory:</span>
              <span className="font-semibold">{metrics.memoryUsage}MB</span>
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <a
              href="/__nextjs_original-stack-frame"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs"
            >
              View detailed metrics →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component Performance Wrapper (Dev Only)
 *
 * Wraps a component to measure its render performance
 * Only active in development mode
 *
 * @example
 * <ComponentPerf name="HeroContent">
 *   <HeroContent />
 * </ComponentPerf>
 */
export function ComponentPerf({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  // Only measure in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  useEffect(() => {
    perfMark(`${name}-start`);

    return () => {
      perfMark(`${name}-end`);
      perfMeasure(name, `${name}-start`, `${name}-end`);
    };
  }, [name]);

  return <div data-component={name}>{children}</div>;
}

/**
 * Page Load Performance (Dev Only)
 *
 * Measures and displays page load metrics
 * Uses Navigation Timing API
 */
export function PageLoadPerf() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [metrics, setMetrics] = useState<{
    ttfb: number | null;
    fcp: number | null;
    domLoad: number | null;
  }>({
    ttfb: null,
    fcp: null,
    domLoad: null,
  });

  useEffect(() => {
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePageLoad();
      return undefined;
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => window.removeEventListener('load', measurePageLoad);
    }
  }, []);

  const measurePageLoad = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!navigation) return;

    setMetrics({
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      fcp: getFCP(),
      domLoad: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
    });
  };

  const getFCP = (): number | null => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    return fcpEntry ? Math.round(fcpEntry.startTime) : null;
  };

  if (!metrics.ttfb) return null;

  return (
    <div className="fixed top-4 right-4 z-50 font-mono text-xs bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm border border-white/10">
      <div className="font-semibold mb-2">Page Load Metrics</div>
      <div className="space-y-1 text-neutral-300">
        <div>TTFB: {metrics.ttfb}ms</div>
        {metrics.fcp && <div>FCP: {metrics.fcp}ms</div>}
        {metrics.domLoad && <div>DOM: {metrics.domLoad}ms</div>}
      </div>
    </div>
  );
}
