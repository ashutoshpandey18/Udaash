'use client';

import { JobInsight, JobRecommendation, MatchScore } from '@/types/job';

interface AIInsightsPanelProps {
  matchScore: MatchScore;
  insights: JobInsight[];
  recommendations: JobRecommendation[];
}

export function AIInsightsPanel({
  matchScore,
  insights,
  recommendations,
}: AIInsightsPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  const getInsightIcon = (type: JobInsight['type']) => {
    switch (type) {
      case 'strength':
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'gap':
        return (
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'neutral':
      default:
        return (
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority: JobRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900';
      case 'low':
        return 'border-gray-200 bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Match Score</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - matchScore.overall / 100)}`}
                className={`${getScoreBgColor(matchScore.overall)} transition-all duration-300`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xl font-bold ${getScoreColor(matchScore.overall)}`}
              >
                {matchScore.overall}%
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Technical</span>
              <span className={`font-medium ${getScoreColor(matchScore.technical)}`}>
                {matchScore.technical}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Experience</span>
              <span className={`font-medium ${getScoreColor(matchScore.experience)}`}>
                {matchScore.experience}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Location</span>
              <span className={`font-medium ${getScoreColor(matchScore.location)}`}>
                {matchScore.location}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Salary</span>
              <span className={`font-medium ${getScoreColor(matchScore.salary)}`}>
                {matchScore.salary}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Key Insights</h3>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{insight.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Confidence: {insight.confidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Recommendations</h3>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-3 border rounded-lg ${getPriorityColor(rec.priority)}`}
              >
                <p className="text-sm font-medium">{rec.action}</p>
                <p className="text-xs mt-1 opacity-80">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
