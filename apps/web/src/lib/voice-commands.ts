// =============================================================================
// VOICE COMMANDS PARSER - DAY 2 VOICE COMPOSER
// =============================================================================
// Natural language command parser for voice recognition
// Converts speech → actions for orbital filtering
// =============================================================================

import type { Market, Job } from './mock-jobs';
import { getJobsByMarket, getJobsByType, searchJobs, mockJobs } from './mock-jobs';

export type VoiceCommandType =
  | 'filter_market'
  | 'filter_type'
  | 'search'
  | 'show_all'
  | 'clear'
  | 'theme'
  | 'unknown';

export interface VoiceCommandResult {
  type: VoiceCommandType;
  market?: Market;
  jobType?: WorkMode | undefined;
  searchQuery?: string;
  jobs: Job[];
  message: string;
  targetOrb?: Market;
  theme?: 'light' | 'dark' | 'system';
}

// Market keyword mappings (voice commands → new Market type)
const marketKeywords: Record<string, Market> = {
  'india': 'India',
  'indian': 'India',
  'bangalore': 'India',
  'mumbai': 'India',
  'nse': 'India',
  'us': 'US',
  'usa': 'US',
  'united states': 'US',
  'america': 'US',
  'american': 'US',
  'faang': 'US',
  'nyse': 'US',
  'germany': 'DE',
  'german': 'DE',
  'berlin': 'DE',
  'dax': 'DE',
  'deutsche': 'DE',
  'uk': 'UK',
  'united kingdom': 'UK',
  'london': 'UK',
  'singapore': 'SG',
  'sg': 'SG',
};

// Job type keywords (using WorkMode from kanban types)
import type { WorkMode } from '@/types/kanban';

const typeKeywords: Record<string, WorkMode> = {
  'remote': 'remote',
  'work from home': 'remote',
  'wfh': 'remote',
  'hybrid': 'hybrid',
  'flexible': 'hybrid',
  'onsite': 'onsite',
  'on-site': 'onsite',
  'office': 'onsite',
  'in office': 'onsite',
};

// Action keywords
const showKeywords = ['show', 'find', 'get', 'search', 'look', 'display', 'filter', 'open'];
const clearKeywords = ['clear', 'reset', 'remove', 'cancel', 'stop'];
const allKeywords = ['all', 'everything', 'every', 'all jobs'];

// Theme keywords
const lightThemeKeywords = ['light mode', 'light theme', 'enable light', 'switch to light', 'day mode'];
const darkThemeKeywords = ['dark mode', 'dark theme', 'enable dark', 'switch to dark', 'night mode'];
const systemThemeKeywords = ['system theme', 'auto theme', 'automatic theme', 'system mode'];

/**
 * Parse voice transcript into actionable command
 */
export function parseVoiceCommand(transcript: string): VoiceCommandResult {
  const text = transcript.toLowerCase().trim();

  // Check for theme commands (highest priority)
  if (lightThemeKeywords.some(keyword => text.includes(keyword))) {
    return {
      type: 'theme',
      theme: 'light',
      jobs: [],
      message: 'Light mode enabled',
    };
  }

  if (darkThemeKeywords.some(keyword => text.includes(keyword))) {
    return {
      type: 'theme',
      theme: 'dark',
      jobs: [],
      message: 'Dark mode enabled',
    };
  }

  if (systemThemeKeywords.some(keyword => text.includes(keyword))) {
    return {
      type: 'theme',
      theme: 'system',
      jobs: [],
      message: 'System theme enabled',
    };
  }

  // Check for clear/reset commands
  if (clearKeywords.some(keyword => text.includes(keyword))) {
    return {
      type: 'clear',
      jobs: [],
      message: 'Filters cleared',
    };
  }

  // Check for "show all" type commands
  if (allKeywords.some(keyword => text.includes(keyword)) &&
      showKeywords.some(keyword => text.includes(keyword))) {
    return {
      type: 'show_all',
      jobs: mockJobs,
      message: `Showing all ${mockJobs.length} jobs`,
    };
  }

  // Check for market-specific commands
  for (const [keyword, market] of Object.entries(marketKeywords)) {
    if (text.includes(keyword)) {
      // Also check for job type in the same command
      let filteredJobs = getJobsByMarket(market);
      let typeFilter: WorkMode | undefined;

      for (const [typeKeyword, jobType] of Object.entries(typeKeywords)) {
        if (text.includes(typeKeyword)) {
          typeFilter = jobType;
          filteredJobs = filteredJobs.filter(job => job.workMode === jobType);
          break;
        }
      }

      const marketName = market; // Already capitalized in new Market type
      const typeLabel = typeFilter ? ` ${typeFilter}` : '';

      return {
        type: 'filter_market',
        market,
        jobType: typeFilter,
        jobs: filteredJobs,
        message: `${filteredJobs.length}${typeLabel} jobs in ${marketName}`,
        targetOrb: market,
      };
    }
  }

  // Check for job type only commands
  for (const [keyword, jobType] of Object.entries(typeKeywords)) {
    if (text.includes(keyword)) {
      const jobs = getJobsByType(jobType);
      return {
        type: 'filter_type',
        jobType,
        jobs,
        message: `${jobs.length} ${jobType} jobs found`,
      };
    }
  }

  // Check for search terms (role-based)
  const roleKeywords = ['fullstack', 'full stack', 'backend', 'frontend', 'engineer', 'developer', 'lead', 'senior', 'staff'];
  for (const role of roleKeywords) {
    if (text.includes(role)) {
      const jobs = searchJobs(role);
      return {
        type: 'search',
        searchQuery: role,
        jobs,
        message: `${jobs.length} "${role}" jobs found`,
      };
    }
  }

  // Unknown command - return empty
  return {
    type: 'unknown',
    jobs: [],
    message: 'Try: "Show India jobs" or "US remote"',
  };
}

/**
 * Get suggested voice commands
 */
export const voiceCommandSuggestions = [
  'Show India jobs',
  'US remote',
  'Germany fullstack',
  'Nordic startups',
  'Show all jobs',
  'Clear filters',
  'Enable dark mode',
  'Enable light mode',
];

/**
 * Haptic feedback for mobile
 */
export function triggerHaptic(duration: number = 50): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}
