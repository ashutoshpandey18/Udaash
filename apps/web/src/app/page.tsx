import { StaticBackground } from '@/components/static-background';
import { HeroContent } from '@/components/hero-content';
import { ClientCanvasLoader } from '@/components/client-canvas-loader';

// =============================================================================
// PAGE ARCHITECTURE FOR BACKEND INTEGRATION
// =============================================================================
// This page is structured with clear separation of concerns:
//
// 1. VISUAL LAYER (isolated, never re-renders from data):
//    - StaticBackground: Pure CSS gradients
//    - CanvasBoundary → LazyCanvasWrapper → OrbitalCanvas: Three.js
//
// 2. CONTENT LAYER (can receive backend data):
//    - HeroContent: Interactive UI, will receive API data via props
//
// 3. FUTURE DATA LAYER (to be added):
//    - Add data fetching hooks/providers at this level
//    - Pass data down to HeroContent via props
//    - Visual layer remains unaffected
//
// ADDING BACKEND:
// 1. Create hooks/providers for auth, market data, etc.
// 2. Use them in this component or a parent
// 3. Pass data to HeroContent via props
// 4. Canvas will NOT re-render
// =============================================================================

export default function HomePage() {
  // FUTURE: Add backend hooks here
  // const { user } = useAuth();
  // const { markets } = useMarketData();
  // const { mutate: submitQuery, isLoading } = useQueryMutation();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ============================================================= */}
      {/* VISUAL LAYER - Completely isolated from backend state         */}
      {/* ============================================================= */}

      {/* Static CSS background - renders instantly */}
      <StaticBackground />

      {/* Three.js Canvas - loaded via client-only boundary */}
      {/* The entire import chain is client-only, preventing ReactCurrentOwner errors */}
      <ClientCanvasLoader />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-1 bg-linear-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

      {/* ============================================================= */}
      {/* CONTENT LAYER - Safe to receive backend data                  */}
      {/* ============================================================= */}

      {/* Hero content - can receive backend data without affecting canvas */}
      <HeroContent
        // FUTURE: Pass backend data here
        // markets={markets}
        // onQuerySubmit={submitQuery}
        // isSubmitting={isLoading}
      />
    </div>
  );
}

