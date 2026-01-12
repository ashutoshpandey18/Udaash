// =============================================================================
// MATCH SCORE INDICATOR - DAY 5 AI MATCHING
// =============================================================================
// Visual score display with calm, professional design
// Shows match percentage with contextual colors
// =============================================================================

'use client';

import type { MatchResult } from '@/lib/openrouter-client';

// =============================================================================
// TYPES
// =============================================================================

interface MatchScoreIndicatorProps {
  matchResult: MatchResult;
  variant?: 'default' | 'compact' | 'ring';
  showExplanation?: boolean;
  className?: string;
}

// =============================================================================
// SCORE COLORS (Calm Authority palette)
// =============================================================================

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-neutral-500 dark:text-neutral-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  if (score >= 40) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
  return 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Partial Match';
  return 'Limited Match';
}

// =============================================================================
// DEFAULT VARIANT (Full display)
// =============================================================================

function DefaultIndicator({ matchResult, showExplanation = true, className = '' }: MatchScoreIndicatorProps) {
  const { score, explanation, confidence } = matchResult;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Score Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getScoreBg(score)}`}>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
            {confidence} confidence
          </span>
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && explanation && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{explanation}</p>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT VARIANT (Small badge)
// =============================================================================

function CompactIndicator({ matchResult, className = '' }: MatchScoreIndicatorProps) {
  const { score } = matchResult;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${getScoreBg(score)} ${className}`}>
      <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}%</span>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">match</span>
    </div>
  );
}

// =============================================================================
// RING VARIANT (Circular progress)
// =============================================================================

function RingIndicator({ matchResult, showExplanation = false, className = '' }: MatchScoreIndicatorProps) {
  const { score, explanation } = matchResult;
  const circumference = 2 * Math.PI * 36; // radius = 36
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* SVG Ring */}
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90" width="96" height="96">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-neutral-200 dark:text-neutral-800"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-500 ease-out ${getScoreColor(score)}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
      </div>

      {/* Label */}
      <span className="text-xs text-neutral-600 dark:text-neutral-400">{getScoreLabel(score)}</span>

      {/* Explanation */}
      {showExplanation && explanation && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xs">{explanation}</p>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT (Variant Router)
// =============================================================================

export function MatchScoreIndicator(props: MatchScoreIndicatorProps) {
  const { variant = 'default' } = props;

  switch (variant) {
    case 'compact':
      return <CompactIndicator {...props} />;
    case 'ring':
      return <RingIndicator {...props} />;
    default:
      return <DefaultIndicator {...props} />;
  }
}

// =============================================================================
// PROGRESS BAR VARIANT (Alternative display)
// =============================================================================

interface MatchScoreBarProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreBar({ score, showLabel = true, className = '' }: MatchScoreBarProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400">Match Score</span>
          <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
        </div>
      )}

      {/* Bar */}
      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            score >= 80
              ? 'bg-green-600 dark:bg-green-400'
              : score >= 60
                ? 'bg-blue-600 dark:bg-blue-400'
                : score >= 40
                  ? 'bg-amber-600 dark:bg-amber-400'
                  : 'bg-neutral-400 dark:bg-neutral-600'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
