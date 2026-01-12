/**
 * Skill Match Summary - Day 5 UDAASH
 *
 * Text-based skill comparison. NO radar charts.
 * Clear, readable breakdown with progress bars.
 */

'use client';

import { SkillMatch } from '@/types/ai';

interface SkillMatchSummaryProps {
  skills: SkillMatch[];
  compact?: boolean;
}

/**
 * Get color for skill level.
 */
function getLevelColor(level: SkillMatch['level']): string {
  switch (level) {
    case 'strong':
      return 'bg-green-500';
    case 'moderate':
      return 'bg-yellow-500';
    case 'weak':
      return 'bg-orange-500';
    case 'missing':
      return 'bg-gray-300';
  }
}

/**
 * Get width percentage for level.
 */
function getLevelWidth(level: SkillMatch['level']): string {
  switch (level) {
    case 'strong':
      return 'w-full';
    case 'moderate':
      return 'w-2/3';
    case 'weak':
      return 'w-1/3';
    case 'missing':
      return 'w-0';
  }
}

/**
 * Get label for level.
 */
function getLevelLabel(level: SkillMatch['level']): string {
  switch (level) {
    case 'strong':
      return 'Strong';
    case 'moderate':
      return 'Moderate';
    case 'weak':
      return 'Weak';
    case 'missing':
      return 'Missing';
  }
}

export function SkillMatchSummary({ skills, compact = false }: SkillMatchSummaryProps) {
  // Group skills by level
  const strong = skills.filter(s => s.level === 'strong' && s.jobRequires);
  const moderate = skills.filter(s => s.level === 'moderate' && s.jobRequires);
  const weak = skills.filter(s => s.level === 'weak' && s.jobRequires);
  const missing = skills.filter(s => s.level === 'missing' && s.jobRequires);

  // Show only required skills
  const requiredSkills = skills.filter(s => s.jobRequires);

  if (requiredSkills.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No specific skills detected in job description.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {strong.length > 0 && (
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-semibold text-green-700">{strong.length}</div>
            <div className="text-xs text-green-600">Strong</div>
          </div>
        )}

        {moderate.length > 0 && (
          <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-semibold text-yellow-700">{moderate.length}</div>
            <div className="text-xs text-yellow-600">Moderate</div>
          </div>
        )}

        {weak.length > 0 && (
          <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-semibold text-orange-700">{weak.length}</div>
            <div className="text-xs text-orange-600">Weak</div>
          </div>
        )}

        {missing.length > 0 && (
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-700">{missing.length}</div>
            <div className="text-xs text-gray-600">Missing</div>
          </div>
        )}
      </div>

      {/* Detailed skill list */}
      {!compact && (
        <div className="space-y-3">
          {requiredSkills.slice(0, 10).map((skill, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 capitalize">
                  {skill.skill}
                </span>
                <span className={`text-xs font-medium ${
                  skill.level === 'strong' ? 'text-green-600' :
                  skill.level === 'moderate' ? 'text-yellow-600' :
                  skill.level === 'weak' ? 'text-orange-600' :
                  'text-gray-500'
                }`}>
                  {getLevelLabel(skill.level)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)} transition-all duration-300`}
                />
              </div>

              {/* Explanation */}
              {skill.explanation && (
                <p className="text-xs text-gray-500">
                  {skill.explanation}
                </p>
              )}
            </div>
          ))}

          {requiredSkills.length > 10 && (
            <p className="text-xs text-gray-500 pt-2">
              + {requiredSkills.length - 10} more skills
            </p>
          )}
        </div>
      )}

      {/* Compact view */}
      {compact && (
        <div className="flex flex-wrap gap-2">
          {strong.slice(0, 5).map((skill, index) => (
            <span
              key={`strong-${index}`}
              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200"
            >
              {skill.skill}
            </span>
          ))}

          {missing.slice(0, 3).map((skill, index) => (
            <span
              key={`missing-${index}`}
              className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200"
            >
              {skill.skill} (gap)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
