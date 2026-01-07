'use client';

import { memo, useState, useCallback } from 'react';
import type { Market, Job } from '@/lib/mock-jobs';
import type { VoiceCommandResult } from '@/lib/voice-commands';
import { VoiceComposer } from './voice-composer-new';
import Link from 'next/link';

// =============================================================================
// HERO CONTENT - "Calm Authority / Invisible Power"
// =============================================================================
// Clean, responsive, enterprise-ready
// Voice as optional productivity feature
// No flashy animations, no visual noise
// Confidence through restraint
// =============================================================================

interface MarketIndicator {
  name: string;
  color: string;
  code: string;
  market: Market;
}

interface HeroContentProps {
  markets?: MarketIndicator[];
  onQuerySubmit?: (query: string) => void;
  isSubmitting?: boolean;
}

// Muted, professional market colors
const DEFAULT_MARKETS: MarketIndicator[] = [
  { name: 'India', color: '#d97706', code: 'NSE', market: 'india' },
  { name: 'US', color: '#3b82f6', code: 'NYSE', market: 'us' },
  { name: 'Germany', color: '#6b7280', code: 'DAX', market: 'germany' },
];

// Market pill component
const MarketPill = memo(function MarketPill({
  market
}: {
  market: MarketIndicator
}) {
  return (
    <div className="market-pill">
      <span
        className="market-pill-dot"
        style={{ backgroundColor: market.color }}
      />
      <span>{market.name}</span>
      <span className="text-neutral-500">{market.code}</span>
    </div>
  );
});

// Job card component - flat, border-based
const JobCard = memo(function JobCard({
  job,
  onSelect
}: {
  job: Job;
  onSelect?: (job: Job) => void;
}) {
  const marketColors: Record<Market, string> = {
    india: '#d97706',
    us: '#3b82f6',
    germany: '#6b7280',
  };

  return (
    <button
      onClick={() => onSelect?.(job)}
      className="card card-interactive w-full text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-neutral-100 font-medium text-sm truncate">
            {job.title}
          </h4>
          <p className="text-neutral-500 text-xs mt-0.5">{job.company}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: marketColors[job.market] }}
            />
            <span className="text-neutral-500 text-xs">{job.location}</span>
            <span className={`badge ${
              job.type === 'remote' ? 'badge-success' :
              job.type === 'hybrid' ? 'badge-info' : 'badge-warning'
            }`}>
              {job.type}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-neutral-300 text-xs font-medium">{job.salary}</span>
          <p className="text-neutral-600 text-xs mt-1">{job.posted}</p>
        </div>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-xs text-neutral-600">+{job.tags.length - 3}</span>
          )}
        </div>
      )}
    </button>
  );
});

function HeroContentComponent({
  markets = DEFAULT_MARKETS,
  onQuerySubmit,
  isSubmitting = false,
}: HeroContentProps) {
  const [query, setQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !isSubmitting) {
        onQuerySubmit?.(query);
      }
    },
    [query, isSubmitting, onQuerySubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  // Handle voice commands
  const handleVoiceCommand = useCallback((result: VoiceCommandResult) => {
    setFilteredJobs(result.jobs);
    if (result.targetOrb) {
      setSelectedMarket(result.targetOrb);
      setTimeout(() => setSelectedMarket(null), 2000);
    }
  }, []);

  const clearJobs = useCallback(() => {
    setFilteredJobs([]);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full max-w-2xl mx-auto">

          {/* Logo */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-neutral-100 text-center tracking-tight">
            Udaash
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-neutral-500 text-center mt-3 mb-8 sm:mb-12">
            Global market intelligence
          </p>

          {/* Primary action - Job Description input */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <label htmlFor="jd-input" className="sr-only">
                Paste job description
              </label>
              <textarea
                id="jd-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste job description or describe what you're looking for..."
                disabled={isSubmitting}
                rows={3}
                className="input-base input-large w-full resize-none min-h-[120px] sm:min-h-[100px]"
              />

              {/* Submit button */}
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !query.trim()}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Market indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
            {markets.map((market) => (
              <MarketPill key={market.name} market={market} />
            ))}
          </div>

          {/* Voice Composer - Optional productivity feature */}
          <div className="mt-8 sm:mt-12">
            <VoiceComposer onCommand={handleVoiceCommand} />
          </div>

          {/* Kanban Board Preview Link */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/kanban"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6" />
              </svg>
              View Job Board
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Job results */}
          {filteredJobs.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-neutral-300">
                  {filteredJobs.length} jobs found
                </h2>
                <button
                  onClick={clearJobs}
                  className="btn btn-ghost text-xs"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-3">
                {filteredJobs.slice(0, 5).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="py-6 text-center">
        <p className="text-xs text-neutral-600">
          Paste a job description to get started
        </p>
      </div>
    </div>
  );
}

export const HeroContent = memo(HeroContentComponent);
HeroContent.displayName = 'HeroContent';
