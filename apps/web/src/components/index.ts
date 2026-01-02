// =============================================================================
// COMPONENT EXPORTS
// =============================================================================
// Centralized exports for cleaner imports throughout the application.
//
// ARCHITECTURE NOTES:
// Components are organized by their role in the rendering pipeline:
//
// 1. VISUAL LAYER (isolated, decorative):
//    - StaticBackground: CSS gradients, renders instantly
//    - ClientCanvasLoader: SSR boundary for Three.js (the ONLY way to load r3f)
//    - CanvasSection: Deferred Three.js container
//    - OrbitalCanvas: Three.js scene (internal, not exported)
//
// 2. CONTENT LAYER (can receive backend data):
//    - HeroContent: Main page content, accepts data props
//    - Navbar: Navigation, can show user state
//
// 3. UTILITY LAYER:
//    - PhysicsProvider: Animation config context
//
// CRITICAL: THREE.JS IMPORT PATTERN
// Server Components CANNOT use dynamic() with ssr: false.
// The only correct pattern is:
//   page.tsx (Server) → ClientCanvasLoader (Client) → dynamic(ssr:false) → Three.js
// =============================================================================

// Visual layer - isolated from backend state
export { StaticBackground } from './static-background';
export { ClientCanvasLoader } from './client-canvas-loader';

// Content layer - can receive backend data
export { HeroContent } from './hero-content';
export { Navbar } from './navbar';

// Utility layer
export { PhysicsProvider, usePhysics } from './physics-provider';
