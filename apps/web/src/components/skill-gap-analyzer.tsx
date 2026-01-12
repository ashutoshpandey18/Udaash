// =============================================================================
// SKILL GAP ANALYZER - DAY 5 AI MATCHING
// =============================================================================
// Shows missing skills and calm learning suggestions
// Conservative, helpful guidance without promises
// =============================================================================

'use client';

import type { MatchResult } from '@/lib/openrouter-client';
import { getSkillSuggestion } from '@/lib/mock-matches';

// =============================================================================
// TYPES
// =============================================================================

interface SkillGapAnalyzerProps {
  matchResult: MatchResult;
  maxGapsShown?: number;
  maxSuggestionsShown?: number;
  variant?: 'default' | 'compact';
  className?: string;
}

// =============================================================================
// DEFAULT VARIANT (Full display)
// =============================================================================

function DefaultAnalyzer({
  matchResult,
  maxGapsShown = 5,
  maxSuggestionsShown = 3,
  className = '',
}: SkillGapAnalyzerProps) {
  const { skillsMatched, skillsGaps } = matchResult;
  const displayedGaps = skillsGaps.slice(0, maxGapsShown);
  const remainingGaps = Math.max(0, skillsGaps.length - maxGapsShown);

  // Generate calm suggestions for top gaps
  const suggestions = displayedGaps.slice(0, maxSuggestionsShown).map((skill) => getSkillSuggestion(skill));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Matched Skills Section */}
      {skillsMatched.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Matching Skills ({skillsMatched.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsMatched.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gaps Section */}
      {skillsGaps.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Skill Gaps {skillsGaps.length > 0 && `(${skillsGaps.length})`}
          </h4>
          <div className="flex flex-wrap gap-2">
            {displayedGaps.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {remainingGaps > 0 && (
              <span className="px-2 py-1 text-neutral-500 dark:text-neutral-400 text-xs">
                +{remainingGaps} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Learning Suggestions</h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <span className="text-blue-400 dark:text-blue-600 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT VARIANT (Inline display)
// =============================================================================

function CompactAnalyzer({ matchResult, maxGapsShown = 3, className = '' }: SkillGapAnalyzerProps) {
  const { skillsGaps } = matchResult;
  const displayedGaps = skillsGaps.slice(0, maxGapsShown);
  const remainingGaps = Math.max(0, skillsGaps.length - maxGapsShown);

  if (skillsGaps.length === 0) {
    return (
      <div className={`text-sm text-green-600 dark:text-green-400 ${className}`}>
        ✓ All key skills match
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Missing Skills:</div>
      <div className="flex flex-wrap gap-1.5">
        {displayedGaps.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded"
          >
            {skill}
          </span>
        ))}
        {remainingGaps > 0 && (
          <span className="px-2 py-0.5 text-neutral-500 dark:text-neutral-400 text-xs">+{remainingGaps}</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT (Variant Router)
// =============================================================================

export function SkillGapAnalyzer(props: SkillGapAnalyzerProps) {
  const { variant = 'default' } = props;

  switch (variant) {
    case 'compact':
      return <CompactAnalyzer {...props} />;
    default:
      return <DefaultAnalyzer {...props} />;
  }
}

// =============================================================================
// STANDALONE SKILL BADGE COMPONENTS
// =============================================================================

interface SkillBadgeProps {
  skill: string;
  matched: boolean;
  className?: string;
}

export function SkillBadge({ skill, matched, className = '' }: SkillBadgeProps) {
  return (
    <span
      className={`px-2 py-1 border text-xs rounded ${
        matched
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
      } ${className}`}
    >
      {skill}
    </span>
  );
}

// =============================================================================
// SKILL COMPARISON COMPONENT
// =============================================================================

interface SkillComparisonProps {
  userSkills: string[];
  jobSkills: string[];
  className?: string;
}

export function SkillComparison({ userSkills, jobSkills, className = '' }: SkillComparisonProps) {
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  return (
    <div className={`grid md:grid-cols-2 gap-4 ${className}`}>
      {/* Your Skills */}
      <div>
        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Your Skills</h4>
        <div className="flex flex-wrap gap-2">
          {userSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              matched={jobSkills.some((js) => js.toLowerCase() === skill.toLowerCase())}
            />
          ))}
        </div>
      </div>

      {/* Job Requirements */}
      <div>
        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Job Requirements</h4>
        <div className="flex flex-wrap gap-2">
          {jobSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              matched={userSkillsLower.some((us) => us === skill.toLowerCase())}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
