// =============================================================================
// AI MATCH ENGINE - DAY 5 AI MATCHING
// =============================================================================
// Client-side AI matching component with loading states
// Handles job scoring with OpenRouter integration
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import type { Job } from '@/lib/mock-jobs';
import type { UserProfile, MatchResult } from '@/lib/openrouter-client';
import { matchJob, matchJobs, isAIAvailable, getModelInfo } from '@/lib/openrouter-client';

// =============================================================================
// TYPES
// =============================================================================

export interface MatchedJob extends Job {
  matchScore: MatchResult;
}

interface AIMatchEngineProps {
  userProfile: UserProfile;
  jobs: Job[];
  onMatchComplete?: (matchedJobs: MatchedJob[]) => void;
  autoMatch?: boolean; // Auto-match on mount
}

// =============================================================================
// AI MATCH ENGINE COMPONENT
// =============================================================================

export function AIMatchEngine({
  userProfile,
  jobs,
  onMatchComplete,
  autoMatch = false,
}: AIMatchEngineProps) {
  const [matching, setMatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const modelInfo = getModelInfo();

  // Auto-match on mount if enabled
  useEffect(() => {
    if (autoMatch && jobs.length > 0) {
      handleMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMatch]);

  const handleMatch = async () => {
    setMatching(true);
    setProgress(0);
    setError(null);

    try {
      // Batch matching with progress updates
      const results: MatchedJob[] = [];
      const batchSize = 5;

      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (job) => {
            const matchScore = await matchJob(userProfile, job);
            return { ...job, matchScore };
          })
        );

        results.push(...batchResults);
        setProgress(Math.round((results.length / jobs.length) * 100));

        // Small delay between batches
        if (i + batchSize < jobs.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setMatchedJobs(results);
      onMatchComplete?.(results);
    } catch (err) {
      console.error('Matching error:', err);
      setError('Matching failed. Please try again.');
    } finally {
      setMatching(false);
    }
  };

  const handleSingleMatch = async (job: Job): Promise<MatchResult> => {
    return await matchJob(userProfile, job);
  };

  return (
    <div className="space-y-4">
      {/* Model Info */}
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <span className={isAIAvailable() ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
          {isAIAvailable() ? '● AI Matching Active' : '● Basic Matching'}
        </span>
        <span className="text-neutral-400 dark:text-neutral-600">•</span>
        <span>{modelInfo.description}</span>
      </div>

      {/* Match Button */}
      {!autoMatch && (
        <button
          onClick={handleMatch}
          disabled={matching || jobs.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-lg transition-colors duration-150 text-sm font-medium"
        >
          {matching ? `Matching... ${progress}%` : 'Calculate Match Scores'}
        </button>
      )}

      {/* Progress Bar */}
      {matching && (
        <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results Summary */}
      {matchedJobs.length > 0 && !matching && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Matched {matchedJobs.length} {matchedJobs.length === 1 ? 'job' : 'jobs'}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HOOK FOR SINGLE JOB MATCHING
// =============================================================================

export function useJobMatch(userProfile: UserProfile) {
  const [loading, setLoading] = useState(false);

  const match = async (job: Job): Promise<MatchResult> => {
    setLoading(true);
    try {
      const result = await matchJob(userProfile, job);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { match, loading };
}

// =============================================================================
// HOOK FOR BATCH MATCHING
// =============================================================================

export function useBatchMatch(userProfile: UserProfile) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const matchAll = async (jobs: Job[]): Promise<MatchedJob[]> => {
    setLoading(true);
    setProgress(0);

    try {
      const results: MatchedJob[] = [];
      const batchSize = 5;

      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (job) => {
            const matchScore = await matchJob(userProfile, job);
            return { ...job, matchScore };
          })
        );

        results.push(...batchResults);
        setProgress(Math.round((results.length / jobs.length) * 100));

        if (i + batchSize < jobs.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      return results;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { matchAll, loading, progress };
}
