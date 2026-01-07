'use client';

import { useRef, useMemo, useState, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { orbitalConfig, marketColors, calculateOrbitPosition } from '@/lib/physics-config';

// =============================================================================
// ORBITAL CANVAS - FULLY ISOLATED THREE.JS COMPONENT
// =============================================================================
// This component is intentionally isolated from all external state:
//
// ISOLATION GUARANTEES:
// 1. No props from parent (all config from physics-config.ts)
// 2. No context consumption (usePhysics NOT used here)
// 3. No external state subscriptions
// 4. Internal animation state only (useRef, useFrame)
// 5. memo() on all sub-components
//
// BACKEND INTEGRATION: NO CHANGES NEEDED
// - This is purely decorative
// - Does not display data
// - Does not respond to auth/user state
// - Adding APIs elsewhere will not cause re-renders here
//
// IF YOU NEED TO CHANGE ORBITAL BEHAVIOR:
// - Modify physics-config.ts (static config)
// - Do NOT add props or context to this component
// =============================================================================

// PERFORMANCE OPTIMIZATIONS:
// 1. Reduced geometry complexity (32->16 segments for orbs, 64->32 for center)
// 2. Removed Trail component (GPU intensive)
// 3. Removed Particles (50 points with per-frame updates = expensive)
// 4. Using frameloop="demand" with manual invalidation
// 5. Reduced number of lights
// 6. Lower DPR cap (max 1.5 instead of 2)
// 7. Disabled antialiasing (decorative background doesn't need it)
// 8. Using simpler materials where possible
// 9. Throttled animation updates
// =============================================================================

interface MarketOrbProps {
  color: string;
  glowColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  initialAngle: number;
}

// Memoized market orb - prevents unnecessary re-renders
const MarketOrb = memo(function MarketOrb({
  color,
  glowColor,
  orbitRadius,
  orbitSpeed,
  initialAngle,
}: MarketOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(initialAngle);
  const frameCountRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Throttle to 30fps instead of 60fps for performance
    frameCountRef.current++;
    if (frameCountRef.current % 2 !== 0) return;

    angleRef.current += delta * orbitSpeed;
    const [x, y, z] = calculateOrbitPosition(angleRef.current, orbitRadius);

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Main orb - reduced segments */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Simple glow - even lower segments */}
      <mesh>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.12} />
      </mesh>
    </group>
  );
});

// Simplified center orb with reduced complexity
const CenterOrb = memo(function CenterOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    invalidate();
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        {/* Reduced from 64 to 32 segments */}
        <Sphere args={[orbitalConfig.centerRadius, 32, 32]}>
          <MeshDistortMaterial
            color={marketColors.center.primary}
            emissive={marketColors.center.primary}
            emissiveIntensity={0.25}
            metalness={0.8}
            roughness={0.2}
            distort={0.15}
            speed={1.5}
          />
        </Sphere>
      </mesh>
      {/* Single glow layer instead of two */}
      <Sphere args={[orbitalConfig.centerRadius * 1.15, 16, 16]}>
        <meshBasicMaterial
          color={marketColors.center.secondary}
          transparent
          opacity={0.08}
        />
      </Sphere>
    </Float>
  );
});

// Simplified orbit ring using Line from drei
const OrbitRing = memo(function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    // Reduced from 64 to 48 points
    for (let i = 0; i <= 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color="#a855f7"
      transparent
      opacity={0.12}
      lineWidth={1}
    />
  );
});

// Optimized scene with minimal elements
const Scene = memo(function Scene() {
  return (
    <>
      {/* Reduced lighting - single ambient + one point light */}
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={0.8} color="#a855f7" />

      {/* Center orb */}
      <CenterOrb />

      {/* Orbit ring */}
      <OrbitRing radius={orbitalConfig.orbitRadius} />

      {/* Market orbs - simplified */}
      <MarketOrb
        color={marketColors.india.primary}
        glowColor={marketColors.india.glow}
        orbitRadius={orbitalConfig.orbitRadius}
        orbitSpeed={orbitalConfig.orbitSpeed}
        initialAngle={0}
      />
      <MarketOrb
        color={marketColors.us.primary}
        glowColor={marketColors.us.glow}
        orbitRadius={orbitalConfig.orbitRadius}
        orbitSpeed={orbitalConfig.orbitSpeed}
        initialAngle={(Math.PI * 2) / 3}
      />
      <MarketOrb
        color={marketColors.germany.primary}
        glowColor={marketColors.germany.glow}
        orbitRadius={orbitalConfig.orbitRadius}
        orbitSpeed={orbitalConfig.orbitSpeed}
        initialAngle={(Math.PI * 4) / 3}
      />
    </>
  );
});

export default function OrbitalCanvas() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null on server and during initial client render
  if (!isMounted) {
    return null;
  }

  return (
    <Canvas
      camera={{
        position: [0, 2, 8],
        fov: 50,
        near: 0.1,
        far: 50,
      }}
      // Change to always for smooth animation (throttled in components)
      frameloop="always"
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      // Cap DPR at 1.2 for better performance
      dpr={[1, 1.2]}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
      flat
    >
      <Scene />
    </Canvas>
  );
}
