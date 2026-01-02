'use client';

import dynamic from 'next/dynamic';

// =============================================================================
// CLIENT CANVAS LOADER - THE SSR BOUNDARY FOR THREE.JS
// =============================================================================
// This is the ONLY correct way to use ssr: false with next/dynamic in App Router.
//
// WHY THIS EXISTS:
// 1. Next.js App Router doesn't allow `ssr: false` in Server Components
// 2. We need a Client Component to use `dynamic()` with `ssr: false`
// 3. This creates a clean boundary where everything below is client-only
//
// IMPORT CHAIN:
// page.tsx (Server Component)
//   → ClientCanvasLoader (Client Component with 'use client')
//     → dynamic() with ssr: false
//       → CanvasSection (Client Component)
//         → OrbitalCanvas (Client Component with Three.js)
//
// The key insight: Server Components CAN import Client Components.
// The Client Component boundary ('use client') stops SSR propagation.
// dynamic() with ssr: false inside a Client Component prevents the
// Three.js code from ever being evaluated on the server.
// =============================================================================

// Dynamic import with SSR disabled - this only works inside a Client Component
const CanvasSection = dynamic(
  () => import('./canvas-section'),
  {
    ssr: false,
    loading: () => null // No loading UI - StaticBackground handles the placeholder
  }
);

export function ClientCanvasLoader() {
  return <CanvasSection />;
}

export default ClientCanvasLoader;
