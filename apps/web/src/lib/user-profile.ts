/**
 * User Profile - Day 5 UDAASH
 *
 * Mock user profile for AI matching.
 * In production, this would come from user settings/onboarding.
 */

import { UserProfile } from '@/types/ai';

/**
 * Current user profile (mock).
 * In production: fetch from backend/local storage.
 */
export const currentUserProfile: UserProfile = {
  skills: {
    technical: [
      'JavaScript',
      'TypeScript',
      'Python',
      'React',
      'Node.js',
      'PostgreSQL',
      'MongoDB',
      'REST APIs',
      'GraphQL'
    ],
    frameworks: [
      'Next.js',
      'Express',
      'FastAPI',
      'Tailwind CSS',
      'React Query'
    ],
    tools: [
      'Git',
      'Docker',
      'AWS',
      'Vercel',
      'Postman',
      'VS Code',
      'Figma'
    ],
    languages: ['English', 'Hindi']
  },
  experience: {
    yearsTotal: 4,
    seniority: 'mid',
    domains: ['saas', 'fintech', 'b2b']
  },
  preferences: {
    workMode: ['remote', 'hybrid'],
    markets: ['India', 'US', 'SG'],
    salaryMin: 2000000, // ₹20L
    salaryMax: 5000000  // ₹50L
  },
  lastUpdated: new Date().toISOString()
};

/**
 * Get user profile.
 * Backend-ready: async function getUserProfile(userId: string): Promise<UserProfile>
 */
export function getUserProfile(): UserProfile {
  return currentUserProfile;
}

/**
 * Update user profile.
 * Backend-ready: async function updateUserProfile(userId: string, updates: Partial<UserProfile>)
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  // In production: API call to backend
  Object.assign(currentUserProfile, updates);
  currentUserProfile.lastUpdated = new Date().toISOString();
  return currentUserProfile;
}

/**
 * Normalize skill names for matching.
 * Handles case variations and common aliases.
 */
export function normalizeSkill(skill: string): string {
  const normalized = skill.toLowerCase().trim();

  // Handle common aliases
  const aliases: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'reactjs': 'react',
    'nodejs': 'node.js',
    'nextjs': 'next.js',
    'postgresql': 'postgres',
    'mongo': 'mongodb',
    'k8s': 'kubernetes',
    'aws': 'amazon web services',
    'gcp': 'google cloud platform'
  };

  return aliases[normalized] || normalized;
}

/**
 * Get all user skills as flat array (normalized).
 */
export function getAllUserSkills(profile: UserProfile): string[] {
  const allSkills = [
    ...profile.skills.technical,
    ...profile.skills.frameworks,
    ...profile.skills.tools,
    ...profile.skills.languages
  ];

  return allSkills.map(normalizeSkill);
}

/**
 * Check if user has a specific skill.
 */
export function userHasSkill(profile: UserProfile, skill: string): boolean {
  const userSkills = getAllUserSkills(profile);
  const normalizedSkill = normalizeSkill(skill);
  return userSkills.includes(normalizedSkill);
}
