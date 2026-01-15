// =============================================================================
// OPENROUTER ANALYTICS CLIENT - DAY 8
// =============================================================================
// Conservative AI insights using GPT-4o-mini (FREE with limited credits)
// Explains what happened, never predicts outcomes
// =============================================================================

import OpenAI from 'openai';

// =============================================================================
// TYPES
// =============================================================================

export interface AnalyticsData {
  applied: number;
  replied: number;
  interviews: number;
  avgMatchScore: number;
  topSkillsMatched: string[];
  topSkillsGaps: string[];
  weekComparisonApplied?: number; // vs previous week
  weekComparisonReplied?: number;
}

export interface AIInsight {
  type: 'observation' | 'suggestion' | 'trend';
  message: string;
  icon?: string;
}

export interface AnalyticsSummary {
  insights: AIInsight[];
  weekSummary: string;
  suggestions: string[];
}

// =============================================================================
// CLIENT SETUP
// =============================================================================

// ⚠️ WARNING: DEVELOPMENT/DEMO ONLY
// For production, move to API routes to keep keys secure

const ai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? '',
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true, // Only for demo
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    'X-Title': 'UDAASH Analytics',
  },
});

const hasApiKey = Boolean(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);

// =============================================================================
// FALLBACK INSIGHTS (No API Key)
// =============================================================================

function fallbackInsights(data: AnalyticsData): AnalyticsSummary {
  const insights: AIInsight[] = [];
  const suggestions: string[] = [];

  // Observation about applications
  if (data.applied > 0) {
    insights.push({
      type: 'observation',
      message: `You applied to ${data.applied} jobs this period`,
    });
  }

  // Response rate observation
  if (data.applied > 0 && data.replied > 0) {
    const responseRate = Math.round((data.replied / data.applied) * 100);
    insights.push({
      type: 'observation',
      message: `${responseRate}% of applications received responses`,
    });
  }

  // Match score observation
  if (data.avgMatchScore > 0) {
    if (data.avgMatchScore >= 75) {
      insights.push({
        type: 'trend',
        message: 'Your applications target well-aligned roles',
      });
    } else if (data.avgMatchScore < 60) {
      suggestions.push('Consider focusing on jobs with higher match scores');
    }
  }

  // Week comparison trend
  if (data.weekComparisonApplied) {
    if (data.weekComparisonApplied > 0) {
      insights.push({
        type: 'trend',
        message: `Application activity increased from last week`,
      });
    } else if (data.weekComparisonApplied < 0) {
      insights.push({
        type: 'trend',
        message: `Application activity decreased from last week`,
      });
    }
  }

  // Skill gap suggestions
  if (data.topSkillsGaps.length > 0) {
    suggestions.push(
      `Consider developing: ${data.topSkillsGaps.slice(0, 2).join(', ')}`
    );
  }

  // General suggestions
  if (data.applied === 0) {
    suggestions.push('Start applying to matched jobs to gather insights');
  }

  if (data.replied === 0 && data.applied > 3) {
    suggestions.push('Review and refine your application materials');
  }

  const weekSummary =
    data.applied > 0
      ? `Applied to ${data.applied} jobs with ${data.replied} responses`
      : 'No applications yet this period';

  return {
    insights,
    weekSummary,
    suggestions: suggestions.slice(0, 2), // Max 2 suggestions
  };
}

// =============================================================================
// AI-POWERED INSIGHTS (With API Key)
// =============================================================================

async function aiInsights(data: AnalyticsData): Promise<AnalyticsSummary> {
  try {
    const prompt = `You are a conservative job search analytics assistant. Analyze this data and provide insights.

**Data:**
- Applications: ${data.applied}
- Replies: ${data.replied}
- Interviews: ${data.interviews}
- Average Match Score: ${data.avgMatchScore}%
- Top Matched Skills: ${data.topSkillsMatched.join(', ')}
- Skill Gaps: ${data.topSkillsGaps.join(', ')}
${data.weekComparisonApplied ? `- Week over week: ${data.weekComparisonApplied > 0 ? '+' : ''}${data.weekComparisonApplied} applications` : ''}

**Instructions:**
1. Provide 3 SHORT observations (what happened, not predictions)
2. Provide 2 practical suggestions (actionable, no guarantees)
3. Write a 1-sentence week summary

**Rules:**
- Use conservative language
- NO predictions or outcome guarantees
- NO percentages for future success
- Focus on patterns, not promises
- Keep each insight under 80 characters

Respond in JSON:
{
  "insights": [
    {"type": "observation", "message": "...", "icon": "📝"},
    {"type": "trend", "message": "...", "icon": "📈"}
  ],
  "weekSummary": "...",
  "suggestions": ["...", "..."]
}`;

    const completion = await ai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      temperature: 0.2, // Low temperature for consistency
      max_tokens: 400,
      messages: [
        {
          role: 'system',
          content:
            'You are a conservative analytics assistant. Explain what happened, never predict outcomes. Avoid absolute language.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const result = JSON.parse(jsonMatch[0]) as AnalyticsSummary;

    // Validate structure
    if (!result.insights || !result.weekSummary || !result.suggestions) {
      throw new Error('Incomplete response structure');
    }

    // Limit arrays
    result.insights = result.insights.slice(0, 3);
    result.suggestions = result.suggestions.slice(0, 2);

    return result;
  } catch (error) {
    console.warn('AI analytics failed, falling back to basic insights:', error);
    return fallbackInsights(data);
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Analyze weekly activity and generate insights
 * Automatically uses AI or fallback depending on API key
 */
export async function analyzeWeeklyActivity(
  data: AnalyticsData
): Promise<AnalyticsSummary> {
  if (hasApiKey) {
    return await aiInsights(data);
  } else {
    return fallbackInsights(data);
  }
}

/**
 * Generate voice-friendly summary for text-to-speech
 */
export function generateVoiceSummary(
  data: AnalyticsData,
  summary: AnalyticsSummary
): string {
  const parts: string[] = [];

  // Week summary
  parts.push(summary.weekSummary);

  // Key metrics
  if (data.replied > 0) {
    parts.push(`${data.replied} companies responded.`);
  }

  if (data.interviews > 0) {
    parts.push(`${data.interviews} interviews scheduled.`);
  }

  // Average match score
  if (data.avgMatchScore > 0) {
    parts.push(`Average match score is ${Math.round(data.avgMatchScore)} percent.`);
  }

  // Top insight
  if (summary.insights.length > 0 && summary.insights[0]) {
    parts.push(summary.insights[0].message);
  }

  // Top suggestion
  if (summary.suggestions.length > 0 && summary.suggestions[0]) {
    parts.push(summary.suggestions[0]);
  }

  return parts.join(' ');
}

/**
 * Check if AI analytics is available
 */
export function isAnalyticsAIAvailable(): boolean {
  return hasApiKey;
}

/**
 * Get model info for analytics
 */
export function getAnalyticsModelInfo() {
  return {
    available: hasApiKey,
    model: hasApiKey ? 'openai/gpt-4o-mini' : 'fallback',
    description: hasApiKey
      ? 'AI-powered insights with GPT-4o-mini'
      : 'Pattern-based insights',
  };
}

/**
 * Mock analytics data generator (for demo/testing)
 */
export function generateMockAnalytics(): AnalyticsData {
  return {
    applied: 12,
    replied: 4,
    interviews: 1,
    avgMatchScore: 72,
    topSkillsMatched: ['React', 'TypeScript', 'Node.js'],
    topSkillsGaps: ['Docker', 'Kubernetes', 'AWS'],
    weekComparisonApplied: 3, // +3 from last week
    weekComparisonReplied: 1, // +1 from last week
  };
}
