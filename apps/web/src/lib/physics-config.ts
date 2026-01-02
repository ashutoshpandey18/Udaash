export interface PhysicsConfig {
  stiffness: number;
  damping: number;
  mass: number;
  velocity: number;
}

export interface OrbitalConfig {
  centerRadius: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbGlow: number;
  particleCount: number;
}

export const defaultPhysicsConfig: PhysicsConfig = {
  stiffness: 100,
  damping: 15,
  mass: 1,
  velocity: 0,
};

export const springPresets = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 210, damping: 20, mass: 1 },
  slow: { stiffness: 280, damping: 60, mass: 1 },
  molasses: { stiffness: 280, damping: 120, mass: 1 },
} as const;

export const orbitalConfig: OrbitalConfig = {
  centerRadius: 1.2,
  orbitRadius: 3.5,
  orbitSpeed: 0.3,
  orbGlow: 0.8,
  particleCount: 50,
};

export const marketColors = {
  india: {
    primary: '#FF9933',
    secondary: '#FFB366',
    glow: 'rgba(255, 153, 51, 0.6)',
  },
  us: {
    primary: '#3C3B6E',
    secondary: '#5C5B8E',
    glow: 'rgba(60, 59, 110, 0.6)',
  },
  germany: {
    primary: '#FFCC00',
    secondary: '#FFD633',
    glow: 'rgba(255, 204, 0, 0.6)',
  },
  center: {
    primary: '#a855f7',
    secondary: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.6)',
  },
} as const;

export type MarketKey = keyof typeof marketColors;

export const getSpringConfig = (preset: keyof typeof springPresets = 'gentle') => {
  return springPresets[preset];
};

export const calculateOrbitPosition = (
  angle: number,
  radius: number,
  centerY: number = 0
): [number, number, number] => {
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle * 2) * 0.3 + centerY;
  return [x, y, z];
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
