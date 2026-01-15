// =============================================================================
// ANALYTICS DASHBOARD - DAY 8
// =============================================================================
// Clean analytics view with AI-powered insights
// Shows activity summary, trends, and conservative suggestions
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  analyzeWeeklyActivity,
  generateMockAnalytics,
  getAnalyticsModelInfo,
  isAnalyticsAIAvailable,
  type AnalyticsData,
  type AnalyticsSummary,
} from '@/lib/openrouter-analytics';
import { TrendSummary } from '@/components/trend-summary';
import { AnalyticsAIPanel } from '@/components/analytics-ai-panel';
import { VoiceAnalytics } from '@/components/voice-analytics';

// =============================================================================
// MAIN ANALYTICS PAGE
// =============================================================================

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics on mount
  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);

        // For demo, use mock data
        // In production, this would fetch from your backend/database
        const data = generateMockAnalytics();
        setAnalyticsData(data);

        // Get AI insights
        const summary = await analyzeWeeklyActivity(data);
        setAnalyticsSummary(summary);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const modelInfo = getAnalyticsModelInfo();
  const hasAI = isAnalyticsAIAvailable();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Analytics & Insights
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Track your job search activity and get AI-powered observations
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* AI Status Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${hasAI ? 'bg-green-500' : 'bg-amber-500'}`}
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {hasAI ? (
                <>
                  AI Active ({modelInfo.model}) - Conservative insights enabled
                </>
              ) : (
                <>Pattern Analysis Mode - Add NEXT_PUBLIC_OPENROUTER_API_KEY for AI insights</>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400">⚠️</span>
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Loading Analytics...
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Analyzing your activity
              </div>
            </div>
          </div>
        )}

        {/* Analytics Content */}
        {!loading && analyticsData && (
          <div className="space-y-6">
            {/* Voice Analytics */}
            <VoiceAnalytics data={analyticsData} summary={analyticsSummary} />

            {/* Trend Summary */}
            <TrendSummary data={analyticsData} />

            {/* AI Insights Panel */}
            <AnalyticsAIPanel summary={analyticsSummary} loading={false} />

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  i
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    About These Insights
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>
                        AI insights explain patterns in your activity, not predictions about
                        outcomes
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Observations are based on your application history and responses</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Suggestions focus on practical next steps, not guaranteed results</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>
                        Data is demo-only for now - real analytics require backend integration
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      View Matches
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Check AI job matches
                    </div>
                  </div>
                </Link>

                <Link
                  href="/"
                  className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Browse Jobs
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Find new opportunities
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Refresh Data
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Update analytics
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
