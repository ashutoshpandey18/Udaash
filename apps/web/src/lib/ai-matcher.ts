/**
 * AI Matcher - Day 5 UDAASH
 *
 * Local deterministic matching logic.
 * Backend-ready: Replace scoring functions with API calls later.
 *
 * Philosophy:
 * - Conservative scoring (no inflation)
 * - Explainable results
 * - Fast computation
 */

import { Job } from '@/types/kanban';
import {
  AIMatchScore,
  SkillMatch,
  MatchExplanation,
  UserProfile,
  SkillLevel,
  WeeklySummary
} from '@/types/ai';
import {
  normalizeSkill,
  getAllUserSkills,
  userHasSkill
} from './user-profile';

/**
 * Extract required skills from job description.
 * In production: Use NLP/LLM to extract skills more accurately.
 */
function extractJobSkills(job: Job): string[] {
  const text = `${job.title} ${job.company} ${job.description}`.toLowerCase();

  // Common tech skills to detect
  const skillKeywords = [
    'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'c++',
    'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt',
    'node.js', 'express', 'fastapi', 'django', 'flask',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'graphql', 'rest api', 'grpc', 'websocket',
    'git', 'ci/cd', 'jenkins', 'github actions',
    'tailwind', 'css', 'sass', 'styled-components',
    'webpack', 'vite', 'rollup', 'babel',
    'jest', 'cypress', 'playwright', 'vitest'
  ];

  const foundSkills = skillKeywords.filter(skill =>
    text.includes(skill.toLowerCase())
  );

  return [...new Set(foundSkills)]; // Deduplicate
}

/**
 * Calculate skill match level.
 */
function calculateSkillLevel(
  skill: string,
  userProfile: UserProfile,
  jobRequires: boolean
): SkillLevel {
  const hasSkill = userHasSkill(userProfile, skill);

  if (!jobRequires && !hasSkill) return 'missing';
  if (!hasSkill) return 'missing';
  if (hasSkill && !jobRequires) return 'strong'; // User has bonus skill

  // User has skill and job requires it
  // In production: check proficiency level
  const userSkills = getAllUserSkills(userProfile);
  const normalizedSkill = normalizeSkill(skill);

  // Core technical skills get "strong" if user has them
  if (userProfile.skills.technical.map(normalizeSkill).includes(normalizedSkill)) {
    return 'strong';
  }

  // Frameworks get "moderate" by default
  if (userProfile.skills.frameworks.map(normalizeSkill).includes(normalizedSkill)) {
    return 'moderate';
  }

  return 'weak';
}

/**
 * Compute skill matches for a job.
 */
function computeSkillMatches(
  job: Job,
  userProfile: UserProfile
): SkillMatch[] {
  const jobSkills = extractJobSkills(job);
  const userSkills = getAllUserSkills(userProfile);

  // Combine job skills + user skills (union)
  const allSkills = [...new Set([...jobSkills, ...userSkills])];

  const skillMatches: SkillMatch[] = allSkills.slice(0, 12).map(skill => {
    const jobRequires = jobSkills.includes(normalizeSkill(skill));
    const userHas = userHasSkill(userProfile, skill);
    const level = calculateSkillLevel(skill, userProfile, jobRequires);

    let explanation = '';
    if (level === 'strong') {
      explanation = userHas ? 'Strong alignment' : 'Not required';
    } else if (level === 'moderate') {
      explanation = 'Moderate experience';
    } else if (level === 'weak') {
      explanation = 'Limited experience';
    } else {
      explanation = jobRequires ? 'Gap identified' : 'Not in profile';
    }

    return {
      skill,
      level,
      explanation,
      userHas,
      jobRequires
    };
  });

  return skillMatches;
}

/**
 * Calculate overall match score (0-100).
 * Weighted algorithm:
 * - Skill match: 50%
 * - Experience match: 25%
 * - Preferences match: 25%
 */
function calculateOverallScore(
  job: Job,
  userProfile: UserProfile,
  skillMatches: SkillMatch[]
): number {
  // Skill score
  const requiredSkills = skillMatches.filter(s => s.jobRequires);
  const matchedSkills = requiredSkills.filter(s => s.userHas);
  const skillScore = requiredSkills.length > 0
    ? (matchedSkills.length / requiredSkills.length) * 100
    : 50; // Default if no skills detected

  // Experience score
  const seniorityMap = { junior: 1, mid: 2, senior: 3, lead: 4, principal: 5 };
  const userLevel = seniorityMap[userProfile.experience.seniority];

  // Detect job seniority from title
  const titleLower = job.title.toLowerCase();
  let jobLevel = 2; // Default to mid
  if (titleLower.includes('junior') || titleLower.includes('jr')) jobLevel = 1;
  else if (titleLower.includes('senior') || titleLower.includes('sr')) jobLevel = 3;
  else if (titleLower.includes('lead') || titleLower.includes('staff')) jobLevel = 4;
  else if (titleLower.includes('principal') || titleLower.includes('architect')) jobLevel = 5;

  const levelDiff = Math.abs(userLevel - jobLevel);
  const experienceScore = Math.max(0, 100 - (levelDiff * 20));

  // Preferences score
  let preferenceScore = 0;

  // Work mode match
  if (userProfile.preferences.workMode.includes(job.workMode)) {
    preferenceScore += 33;
  }

  // Market match
  if (userProfile.preferences.markets.includes(job.market)) {
    preferenceScore += 33;
  }

  // Salary match
  const jobSalaryMin = job.salaryRange.min;
  const jobSalaryMax = job.salaryRange.max;
  const salaryOverlap = !(
    jobSalaryMax < userProfile.preferences.salaryMin ||
    jobSalaryMin > userProfile.preferences.salaryMax
  );
  if (salaryOverlap) {
    preferenceScore += 34;
  }

  // Weighted final score
  const finalScore = (
    skillScore * 0.5 +
    experienceScore * 0.25 +
    preferenceScore * 0.25
  );

  // Cap between 0-100
  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

/**
 * Generate match explanations.
 */
function generateExplanations(
  job: Job,
  userProfile: UserProfile,
  skillMatches: SkillMatch[],
  overallScore: number
): MatchExplanation[] {
  const explanations: MatchExplanation[] = [];

  // Skill alignment
  const requiredSkills = skillMatches.filter(s => s.jobRequires);
  const matchedSkills = requiredSkills.filter(s => s.userHas);
  const skillMatchRate = requiredSkills.length > 0
    ? matchedSkills.length / requiredSkills.length
    : 0.5;

  if (skillMatchRate > 0.7) {
    explanations.push({
      reason: 'skill_alignment',
      weight: 0.5,
      text: `Strong technical alignment (${matchedSkills.length}/${requiredSkills.length} skills match)`
    });
  } else if (skillMatchRate > 0.4) {
    explanations.push({
      reason: 'skill_alignment',
      weight: 0.5,
      text: `Moderate technical fit (${matchedSkills.length}/${requiredSkills.length} skills match)`
    });
  } else {
    explanations.push({
      reason: 'skill_alignment',
      weight: 0.5,
      text: `Limited technical overlap (${matchedSkills.length}/${requiredSkills.length} skills match)`
    });
  }

  // Experience match
  const titleLower = job.title.toLowerCase();
  const isSenior = titleLower.includes('senior') || titleLower.includes('lead');
  const isJunior = titleLower.includes('junior');

  if (isSenior && userProfile.experience.seniority === 'senior') {
    explanations.push({
      reason: 'seniority_fit',
      weight: 0.25,
      text: 'Seniority level matches'
    });
  } else if (isJunior && userProfile.experience.seniority === 'junior') {
    explanations.push({
      reason: 'seniority_fit',
      weight: 0.25,
      text: 'Entry-level fit'
    });
  } else if (userProfile.experience.seniority === 'mid') {
    explanations.push({
      reason: 'seniority_fit',
      weight: 0.25,
      text: 'Experience level broadly suitable'
    });
  }

  // Preferences
  if (userProfile.preferences.workMode.includes(job.workMode)) {
    explanations.push({
      reason: 'work_mode_match',
      weight: 0.1,
      text: `${job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)} work aligns with preference`
    });
  }

  if (userProfile.preferences.markets.includes(job.market)) {
    explanations.push({
      reason: 'location_preference',
      weight: 0.1,
      text: `${job.market} matches location preference`
    });
  }

  return explanations;
}

/**
 * Identify skill gaps.
 */
function identifyGaps(skillMatches: SkillMatch[]): string[] {
  const gaps = skillMatches
    .filter(s => s.jobRequires && !s.userHas)
    .map(s => s.skill);

  return gaps.slice(0, 5); // Top 5 gaps
}

/**
 * Identify strengths.
 */
function identifyStrengths(skillMatches: SkillMatch[]): string[] {
  const strengths = skillMatches
    .filter(s => s.level === 'strong' && s.jobRequires)
    .map(s => s.skill);

  return strengths.slice(0, 5); // Top 5 strengths
}

/**
 * Main matching function.
 * Compute AI match score for a job against user profile.
 *
 * Backend-ready:
 * async function computeAIMatch(job: Job, userProfile: UserProfile): Promise<AIMatchScore>
 */
export function computeAIMatch(
  job: Job,
  userProfile: UserProfile
): AIMatchScore {
  const skillMatches = computeSkillMatches(job, userProfile);
  const overallScore = calculateOverallScore(job, userProfile, skillMatches);
  const explanations = generateExplanations(job, userProfile, skillMatches, overallScore);
  const gaps = identifyGaps(skillMatches);
  const strengths = identifyStrengths(skillMatches);

  // Confidence calculation
  // High confidence if we detected many skills
  const detectedSkills = skillMatches.filter(s => s.jobRequires).length;
  const confidence = Math.min(100, 50 + (detectedSkills * 5));

  return {
    overall: overallScore,
    confidence,
    skillMatch: skillMatches,
    explanations,
    gaps,
    strengths
  };
}

/**
 * Batch compute matches for multiple jobs.
 */
export function computeMatchesForJobs(
  jobs: Job[],
  userProfile: UserProfile
): Map<string, AIMatchScore> {
  const matches = new Map<string, AIMatchScore>();

  jobs.forEach(job => {
    const match = computeAIMatch(job, userProfile);
    matches.set(job.id, match);
  });

  return matches;
}

/**
 * Generate weekly summary.
 * Backend-ready: async function generateWeeklySummary(userId: string): Promise<WeeklySummary>
 */
export function generateWeeklySummary(
  jobs: Job[],
  matches: Map<string, AIMatchScore>
): WeeklySummary {
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get jobs from last 7 days
  const recentJobs = jobs.filter(job => {
    const appliedDate = new Date(job.appliedDate);
    return appliedDate >= weekStart;
  });

  // Top matches
  const topMatches = recentJobs
    .map(job => ({
      jobId: job.id,
      matchScore: matches.get(job.id)?.overall || 0,
      reason: `${job.title} at ${job.company}`
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  // Key gaps (most common missing skills)
  const allGaps: string[] = [];
  matches.forEach(match => {
    allGaps.push(...match.gaps);
  });

  const gapCounts = allGaps.reduce((acc, gap) => {
    acc[gap] = (acc[gap] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const keyGaps = Object.entries(gapCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([gap]) => gap);

  // Actionable tips
  const actionableTips: string[] = [];

  if (keyGaps.length > 0) {
    actionableTips.push(`Consider building projects with ${keyGaps[0]} to strengthen profile`);
  }

  const avgMatchScore = topMatches.reduce((sum, m) => sum + m.matchScore, 0) / topMatches.length;
  if (avgMatchScore < 60) {
    actionableTips.push('Focus on roles matching your core skills for higher success rate');
  }

  if (recentJobs.length > 20) {
    actionableTips.push('Quality over quantity: prioritize high-match opportunities');
  }

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: now.toISOString(),
    topMatches,
    newOpportunities: recentJobs.length,
    keyGaps,
    actionableTips
  };
}

/**
 * Voice briefing text for TTS.
 */
export function generateMatchBriefing(
  job: Job,
  match: AIMatchScore
): string {
  const scoreText = match.overall >= 80
    ? 'Excellent match'
    : match.overall >= 60
    ? 'Good match'
    : 'Moderate match';

  let briefing = `${scoreText} for ${job.title} at ${job.company}. `;
  briefing += `Overall score: ${match.overall}%. `;

  if (match.strengths.length > 0) {
    briefing += `Your strengths include ${match.strengths.slice(0, 3).join(', ')}. `;
  }

  if (match.gaps.length > 0) {
    briefing += `Consider developing ${match.gaps.slice(0, 2).join(' and ')}. `;
  }

  return briefing;
}
