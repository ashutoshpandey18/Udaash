// =============================================================================
// JOB AI INTELLIGENCE - DAY 4
// =============================================================================
// Deterministic scoring and recommendation logic
// No accuracy claims, conservative and factual
// =============================================================================

import { Job } from '@/types/kanban';
import {
  JobInsight,
  MatchScore,
  JobRecommendation,
  JobIntelligence,
  ParsedJobData,
  OCRResult,
  ApplicationDraft,
} from '@/types/job';

// Mock user profile (in production, fetch from backend)
const USER_PROFILE = {
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
  experience: 5, // years
  preferredLocations: ['Remote', 'Bangalore', 'San Francisco'],
  salaryExpectation: {
    min: 150000,
    max: 200000,
    currency: '$',
  },
};

// =============================================================================
// MATCH SCORING
// =============================================================================

function calculateTechnicalMatch(job: Job): number {
  // In production, extract skills from job description
  // For now, use deterministic logic based on market/title
  const jobTitle = job.title.toLowerCase();
  const requiredSkills = [
    'react',
    'node',
    'typescript',
    'javascript',
    'fullstack',
  ];

  let matchCount = 0;
  requiredSkills.forEach((skill) => {
    if (jobTitle.includes(skill)) matchCount++;
  });

  return Math.min((matchCount / requiredSkills.length) * 100, 100);
}

function calculateExperienceMatch(job: Job): number {
  const title = job.title.toLowerCase();
  if (title.includes('senior') || title.includes('lead')) {
    return USER_PROFILE.experience >= 5 ? 90 : 60;
  }
  if (title.includes('principal') || title.includes('staff')) {
    return USER_PROFILE.experience >= 7 ? 95 : 40;
  }
  return 80; // Mid-level match
}

function calculateLocationMatch(job: Job): number {
  if (job.workMode === 'remote') return 100;
  const isPreferred = USER_PROFILE.preferredLocations.some((loc) =>
    job.location?.includes(loc)
  );
  return isPreferred ? 90 : 50;
}

function calculateSalaryMatch(job: Job): number {
  const { salaryRange } = job;
  const userMin = USER_PROFILE.salaryExpectation.min;

  // Normalize to same currency (simplified)
  let jobMin = salaryRange.min;
  if (salaryRange.currency === '₹') {
    jobMin = jobMin / 80; // Rough conversion
  } else if (salaryRange.currency === '€') {
    jobMin = jobMin * 1.1;
  } else if (salaryRange.currency === '£') {
    jobMin = jobMin * 1.25;
  }

  if (jobMin >= userMin * 0.8) return 90;
  if (jobMin >= userMin * 0.6) return 70;
  return 50;
}

export function calculateMatchScore(job: Job): MatchScore {
  const technical = calculateTechnicalMatch(job);
  const experience = calculateExperienceMatch(job);
  const location = calculateLocationMatch(job);
  const salary = calculateSalaryMatch(job);

  const overall = Math.round(
    technical * 0.4 + experience * 0.3 + location * 0.15 + salary * 0.15
  );

  return { overall, technical, experience, location, salary };
}

// =============================================================================
// INSIGHTS GENERATION
// =============================================================================

export function generateInsights(
  job: Job,
  matchScore: MatchScore
): JobInsight[] {
  const insights: JobInsight[] = [];

  // Technical insights
  if (matchScore.technical >= 80) {
    insights.push({
      id: 'tech-strong',
      type: 'strength',
      text: `Strong match for ${job.title.includes('React') ? 'React' : 'fullstack'} skills`,
      confidence: 'high',
    });
  } else if (matchScore.technical < 60) {
    insights.push({
      id: 'tech-gap',
      type: 'gap',
      text: 'Consider reviewing required technical skills',
      confidence: 'medium',
    });
  }

  // Experience insights
  if (matchScore.experience >= 85) {
    insights.push({
      id: 'exp-strong',
      type: 'strength',
      text: 'Experience level aligns well with role',
      confidence: 'high',
    });
  } else if (matchScore.experience < 60) {
    insights.push({
      id: 'exp-gap',
      type: 'gap',
      text: 'Role may require more senior experience',
      confidence: 'medium',
    });
  }

  // Location insights
  if (job.workMode === 'remote') {
    insights.push({
      id: 'loc-remote',
      type: 'strength',
      text: 'Remote position matches preference',
      confidence: 'high',
    });
  } else if (matchScore.location < 60) {
    insights.push({
      id: 'loc-consider',
      type: 'neutral',
      text: `Location: ${job.location} - Consider relocation needs`,
      confidence: 'high',
    });
  }

  // Salary insights
  if (matchScore.salary >= 85) {
    insights.push({
      id: 'sal-good',
      type: 'strength',
      text: 'Compensation range aligns with expectations',
      confidence: 'medium',
    });
  }

  return insights;
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

export function generateRecommendations(
  job: Job,
  matchScore: MatchScore
): JobRecommendation[] {
  const recommendations: JobRecommendation[] = [];

  if (matchScore.overall >= 80) {
    recommendations.push({
      id: 'rec-apply',
      action: 'Apply soon',
      reason: 'Strong overall match with your profile',
      priority: 'high',
    });
  } else if (matchScore.overall >= 60) {
    recommendations.push({
      id: 'rec-review',
      action: 'Review requirements carefully',
      reason: 'Moderate match - ensure alignment',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      id: 'rec-consider',
      action: 'Consider skill gaps',
      reason: 'Lower match - may need preparation',
      priority: 'low',
    });
  }

  // Technical recommendations
  if (matchScore.technical < 70) {
    recommendations.push({
      id: 'rec-tech',
      action: 'Strengthen technical skills',
      reason: 'Highlight relevant project experience',
      priority: 'medium',
    });
  }

  // Experience recommendations
  if (matchScore.experience < 70) {
    recommendations.push({
      id: 'rec-exp',
      action: 'Emphasize relevant experience',
      reason: 'Focus on similar role achievements',
      priority: 'medium',
    });
  }

  return recommendations;
}

// =============================================================================
// JOB INTELLIGENCE (MAIN)
// =============================================================================

export function analyzeJob(job: Job): JobIntelligence {
  const matchScore = calculateMatchScore(job);
  const insights = generateInsights(job, matchScore);
  const recommendations = generateRecommendations(job, matchScore);

  return {
    jobId: job.id,
    matchScore,
    insights,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// OCR STUB (SCREENSHOT PARSING)
// =============================================================================

export async function parseJobScreenshot(
  imageFile: File
): Promise<OCRResult> {
  // Simulate OCR processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Stub: Extract mock data
  const mockText = `
    Senior Fullstack Engineer
    Company: Tech Corp
    Location: San Francisco, CA
    Skills: React, Node.js, TypeScript, AWS
    Experience: 5+ years
    Salary: $150k - $200k
  `;

  const parsed: ParsedJobData = {
    title: 'Senior Fullstack Engineer',
    company: 'Tech Corp',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    location: 'San Francisco, CA',
    salary: {
      min: 150000,
      max: 200000,
      currency: '$',
    },
    experience: '5+ years',
  };

  return {
    text: mockText.trim(),
    confidence: 0.92,
    parsed,
  };
}

// =============================================================================
// APPLICATION DRAFT GENERATOR (STUB)
// =============================================================================

export async function generateApplicationDraft(
  job: Job
): Promise<ApplicationDraft> {
  // Simulate processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    coverLetter: `I am writing to express my interest in the ${job.title} position at ${job.company}. With my background in fullstack development and experience with modern technologies, I believe I would be a strong fit for this role.`,
    keyPoints: [
      `${USER_PROFILE.experience}+ years experience in fullstack development`,
      'Proficient in React, Node.js, and TypeScript',
      'Strong track record of delivering scalable solutions',
      `Currently seeking ${job.workMode} opportunities`,
    ],
    tailoredSkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
  };
}

// =============================================================================
// VOICE BRIEFING (STUB)
// =============================================================================

export function generateVoiceBriefing(intelligence: JobIntelligence): string {
  const { matchScore, insights } = intelligence;

  let briefing = `Match score: ${matchScore.overall}%. `;

  const strengths = insights.filter((i) => i.type === 'strength');
  if (strengths.length > 0 && strengths[0]) {
    briefing += `Strengths: ${strengths[0].text}. `;
  }

  const gaps = insights.filter((i) => i.type === 'gap');
  if (gaps.length > 0 && gaps[0]) {
    briefing += `Note: ${gaps[0].text}. `;
  }

  return briefing;
}
