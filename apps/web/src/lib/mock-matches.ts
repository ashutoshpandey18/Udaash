// =============================================================================
// MOCK USER PROFILES & MATCHES - DAY 5 AI MATCHING
// =============================================================================
// Sample user profiles for testing AI matching
// Pre-computed match scores for fallback/demo mode
// =============================================================================

import type { UserProfile } from './openrouter-client';

// =============================================================================
// MOCK USER PROFILES
// =============================================================================

export const mockUserProfiles: Record<string, UserProfile> = {
  // Full-stack engineer profile
  fullstack: {
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Tailwind CSS',
      'Git',
      'REST APIs',
    ],
    experience: 5,
    preferences: {
      markets: ['India', 'US', 'Global'],
      workMode: ['remote', 'hybrid'],
      minSalary: '₹20 LPA',
    },
  },

  // Frontend specialist
  frontend: {
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'Figma', 'Webpack', 'Jest'],
    experience: 3,
    preferences: {
      markets: ['India', 'Global'],
      workMode: ['remote'],
      minSalary: '₹15 LPA',
    },
  },

  // Backend specialist
  backend: {
    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
    experience: 6,
    preferences: {
      markets: ['US', 'DE'],
      workMode: ['remote', 'hybrid'],
      minSalary: '$120k',
    },
  },

  // DevOps engineer
  devops: {
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Monitoring'],
    experience: 4,
    preferences: {
      markets: ['US', 'SG'],
      workMode: ['remote'],
      minSalary: '$100k',
    },
  },

  // Junior developer
  junior: {
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    experience: 1,
    preferences: {
      markets: ['India'],
      workMode: ['remote', 'hybrid', 'onsite'],
      minSalary: '₹8 LPA',
    },
  },
};

// =============================================================================
// DEFAULT USER PROFILE (for demo/testing)
// =============================================================================

export const defaultUserProfile: UserProfile = mockUserProfiles.fullstack;

// =============================================================================
// PRE-COMPUTED MATCH EXPLANATIONS (for fallback mode)
// =============================================================================

export const matchExplanations = {
  90: 'Exceptional alignment with all key requirements met',
  80: 'Strong match with most essential skills covered',
  70: 'Good foundation with minor gaps in advanced skills',
  60: 'Solid baseline but some technical skills need development',
  50: 'Partial match — several key areas require attention',
  40: 'Limited overlap with significant skill development needed',
  30: 'Weak alignment — consider upskilling before applying',
  20: 'Minimal match — substantial preparation required',
  10: 'Very limited overlap — not recommended at this time',
};

/**
 * Get appropriate explanation based on score
 */
export function getMatchExplanation(score: number): string {
  if (score >= 90) return matchExplanations[90];
  if (score >= 80) return matchExplanations[80];
  if (score >= 70) return matchExplanations[70];
  if (score >= 60) return matchExplanations[60];
  if (score >= 50) return matchExplanations[50];
  if (score >= 40) return matchExplanations[40];
  if (score >= 30) return matchExplanations[30];
  if (score >= 20) return matchExplanations[20];
  return matchExplanations[10];
}

// =============================================================================
// SKILL SUGGESTIONS (calm, helpful guidance)
// =============================================================================

export const skillSuggestions: Record<string, string> = {
  docker: 'Docker containerization experience may improve alignment',
  kubernetes: 'Kubernetes orchestration knowledge would strengthen profile',
  aws: 'AWS cloud services experience may enhance candidacy',
  typescript: 'TypeScript proficiency would be beneficial',
  python: 'Python programming skills may open more opportunities',
  'react native': 'React Native mobile development could broaden options',
  graphql: 'GraphQL API experience may improve fit',
  redis: 'Redis caching knowledge would be advantageous',
  postgresql: 'PostgreSQL database experience may strengthen application',
  mongodb: 'MongoDB NoSQL experience could be helpful',
  terraform: 'Terraform infrastructure-as-code skills may be valuable',
  jest: 'Jest testing framework knowledge would be beneficial',
  cypress: 'Cypress E2E testing experience may improve candidacy',
  'next.js': 'Next.js framework proficiency would strengthen profile',
  'vue.js': 'Vue.js framework experience may open opportunities',
  tailwind: 'Tailwind CSS utility-first approach would be advantageous',
  webpack: 'Webpack bundler knowledge may enhance technical profile',
  figma: 'Figma design tool proficiency would improve collaboration',
  git: 'Git version control mastery is essential',
  cicd: 'CI/CD pipeline experience may strengthen DevOps profile',
};

/**
 * Get calm, helpful suggestion for a missing skill
 */
export function getSkillSuggestion(skill: string): string {
  const lowerSkill = skill.toLowerCase();
  const suggestion = skillSuggestions[lowerSkill];

  if (suggestion) {
    return suggestion;
  }

  // Generic suggestion for unknown skills
  const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
  return `${capitalizedSkill} experience may improve alignment`;
}

// =============================================================================
// SORTING/FILTERING HELPERS
// =============================================================================

export type SortOption = 'match' | 'recent' | 'salary' | 'manual';

export function getSortLabel(option: SortOption): string {
  switch (option) {
    case 'match':
      return 'Best Match';
    case 'recent':
      return 'Recently Added';
    case 'salary':
      return 'Highest Salary';
    case 'manual':
      return 'Manual Order';
    default:
      return 'Sort By';
  }
}

export function getSortIcon(option: SortOption): string {
  switch (option) {
    case 'match':
      return '🎯';
    case 'recent':
      return '🕒';
    case 'salary':
      return '💰';
    case 'manual':
      return '✋';
    default:
      return '📊';
  }
}
