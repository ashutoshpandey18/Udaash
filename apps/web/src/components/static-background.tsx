'use client';

import { memo } from 'react';

// =============================================================================
// STATIC BACKGROUND COMPONENT
// =============================================================================
// Pure CSS gradient background that renders instantly before Three.js loads.
// Completely isolated from any state - will never re-render.
//
// BACKEND INTEGRATION: No changes needed - this is purely decorative.
// =============================================================================

function StaticBackgroundComponent() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Radial gradient to simulate the orbital glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
        }}
      />
      {/* Subtle animated gradient orb placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-48 h-48 rounded-full opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

// Never re-render - purely static visual
export const StaticBackground = memo(
  StaticBackgroundComponent,
  () => true // Always return true = never re-render
);

StaticBackground.displayName = 'StaticBackground';
