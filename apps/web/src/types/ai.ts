/**
 * AI Matching & Prioritization Types
 * Day 5 - UDAASH
 *
 * Conservative, explainable AI assistance types.
 * All scoring must be transparent and user-understandable.
 */

export type SkillLevel = 'strong' | 'moderate' | 'weak' | 'missing';

export type MatchReason =
  | 'skill_alignment'
  | 'experience_match'
  | 'seniority_fit'
  | 'location_preference'
  | 'salary_range'
  | 'work_mode_match';

export interface SkillMatch {
  skill: string;
  level: SkillLevel;
  explanation: string;
  userHas: boolean;
  jobRequires: boolean;
}

export interface MatchExplanation {
  reason: MatchReason;
  weight: number; // 0-1, how much this contributed to score
  text: string; // Human-readable explanation
}

export interface AIMatchScore {
  overall: number; // 0-100
  confidence: number; // 0-100, how confident we are in this score
  skillMatch: SkillMatch[];
  explanations: MatchExplanation[];
  gaps: string[]; // Missing skills or mismatches
  strengths: string[]; // Strong alignment points
}

export interface UserProfile {
  skills: {
    technical: string[];
    frameworks: string[];
    tools: string[];
    languages: string[];
  };
  experience: {
    yearsTotal: number;
    seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
    domains: string[]; // e.g. ['fintech', 'saas', 'ecommerce']
  };
  preferences: {
    workMode: ('remote' | 'hybrid' | 'onsite')[];
    markets: string[]; // Preferred markets
    salaryMin: number;
    salaryMax: number;
  };
  lastUpdated: string; // ISO date
}

export type SortOption = 'match_score' | 'recent' | 'manual';

export interface PriorityQueueFilters {
  sortBy: SortOption;
  minMatchScore: number; // 0-100
  showOnlyStrong: boolean; // Only show matches > 75%
}

export interface WeeklySummary {
  weekStart: string; // ISO date
  weekEnd: string; // ISO date
  topMatches: {
    jobId: string;
    matchScore: number;
    reason: string;
  }[];
  newOpportunities: number;
  keyGaps: string[]; // Top 3 skill gaps across all jobs
  actionableTips: string[]; // Up to 3 suggestions
}

export interface AIMatchRequest {
  jobId: string;
  userId: string;
  userProfile: UserProfile;
}

export interface AIMatchResponse {
  jobId: string;
  matchScore: AIMatchScore;
  computedAt: string; // ISO timestamp
  algorithm: string; // e.g. "v1.0-local" or "gpt-4o-v2"
}
