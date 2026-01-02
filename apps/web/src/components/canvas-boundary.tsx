'use client';

import { memo, type ReactNode } from 'react';

// =============================================================================
// CANVAS ISOLATION BOUNDARY
// =============================================================================
// This component creates a React reconciliation boundary that prevents
// re-renders from propagating into the Three.js canvas layer.
//
// WHY THIS EXISTS:
// - Future backend APIs (auth, data fetching) will trigger component updates
// - Without isolation, these updates could cause WebGL context re-renders
// - This boundary ensures decorative canvas remains stable regardless of app state
//
// HOW IT WORKS:
// - memo() with empty dependency comparison prevents ALL prop-based re-renders
// - Children are rendered once and never updated from parent changes
// - Canvas manages its own internal state via useFrame hooks
//
// USAGE:
// <CanvasBoundary>
//   <LazyCanvasWrapper />
// </CanvasBoundary>
// =============================================================================

interface CanvasBoundaryProps {
  children: ReactNode;
}

/**
 * Isolation boundary that prevents parent re-renders from affecting children.
 * Used to protect Three.js canvas from backend state changes.
 */
function CanvasBoundaryComponent({ children }: CanvasBoundaryProps) {
  return <>{children}</>;
}

// Never re-render based on props - children are static
export const CanvasBoundary = memo(
  CanvasBoundaryComponent,
  () => true // Always return true = never re-render from props
);

CanvasBoundary.displayName = 'CanvasBoundary';
