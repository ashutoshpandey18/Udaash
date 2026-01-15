// =============================================================================
// ANALYTICS AI PANEL - DAY 8
// =============================================================================
// Displays AI-powered insights with conservative language
// No predictions, no guarantees - just observations and suggestions
// =============================================================================

'use client';

import type { AnalyticsSummary, AIInsight } from '@/lib/openrouter-analytics';

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsAIPanelProps {
  summary: AnalyticsSummary | null;
  loading?: boolean;
  className?: string;
}

interface InsightCardProps {
  insight: AIInsight;
}

// =============================================================================
// INSIGHT ICON HELPER
// =============================================================================

function getInsightIcon(type: AIInsight['type']): JSX.Element {
  const baseClasses = "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold";

  switch (type) {
    case 'observation':
      return <div className={`${baseClasses} bg-blue-500 text-white`}>O</div>;
    case 'trend':
      return <div className={`${baseClasses} bg-green-500 text-white`}>T</div>;
    case 'suggestion':
      return <div className={`${baseClasses} bg-amber-500 text-white`}>S</div>;
    default:
      return <div className={`${baseClasses} bg-neutral-400 text-white`}>•</div>;
  }
}

function getInsightStyle(type: AIInsight['type']): string {
  switch (type) {
    case 'observation':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'trend':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'suggestion':
      return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    default:
      return 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800';
  }
}

// =============================================================================
// INSIGHT CARD COMPONENT
// =============================================================================

function InsightCard({ insight }: InsightCardProps) {
  const icon = getInsightIcon(insight.type);
  const style = getInsightStyle(insight.type);

  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${style}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-neutral-600 dark:text-neutral-400 mb-1">
          {insight.type}
        </div>
        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
          {insight.message}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Week summary skeleton */}
      <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />

      {/* Insights skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-3">
            <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-20" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        No Insights Yet
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
        Apply to more jobs to get AI-powered observations about your job search patterns
      </p>
    </div>
  );
}

// =============================================================================
// MAIN ANALYTICS AI PANEL COMPONENT
// =============================================================================

export function AnalyticsAIPanel({
  summary,
  loading = false,
  className = '',
}: AnalyticsAIPanelProps) {
  // Loading state
  if (loading) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Analyzing Your Activity...
          </h2>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Empty state
  if (!summary || summary.insights.length === 0) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 ${className}`}>
        <EmptyState />
      </div>
    );
  }

  // Group insights by type
  const observations = summary.insights.filter((i) => i.type === 'observation');
  const trends = summary.insights.filter((i) => i.type === 'trend');
  const suggestionInsights = summary.insights.filter((i) => i.type === 'suggestion');

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                AI Insights
              </h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Conservative observations about your activity patterns
            </p>
          </div>
        </div>

        {/* Week Summary */}
        {summary.weekSummary && (
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-xs uppercase tracking-wide text-neutral-600 dark:text-neutral-400 mb-2">
              This Week
            </div>
            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {summary.weekSummary}
            </p>
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="p-6 space-y-6">
        {/* Observations */}
        {observations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Observations
            </h3>
            <div className="space-y-3">
              {observations.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Trends */}
        {trends.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Trends
            </h3>
            <div className="space-y-3">
              {trends.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Section (from insights + summary.suggestions) */}
        {(suggestionInsights.length > 0 || summary.suggestions.length > 0) && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Suggestions
            </h3>
            <div className="space-y-3">
              {/* Suggestion insights */}
              {suggestionInsights.map((insight, index) => (
                <InsightCard key={`insight-${index}`} insight={insight} />
              ))}

              {/* Additional suggestions as simple list items */}
              {summary.suggestions.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      S
                    </div>
                    <ul className="flex-1 space-y-2 text-sm text-neutral-800 dark:text-neutral-200">
                      {summary.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-blue-600 dark:text-blue-400">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-6 pb-4">
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded border border-neutral-200 dark:border-neutral-700">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            <strong>Note:</strong> These insights explain patterns in your activity. They are not
            predictions or guarantees about future outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
