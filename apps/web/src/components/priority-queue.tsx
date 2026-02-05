/**
 * Priority Queue - Day 5 UDAASH
 *
 * Sorted job list with AI match scores.
 * User controls sorting and filtering.
 */

'use client';

import { useState } from 'react';
import { Job } from '@/types/kanban';
import { AIMatchScore, SortOption } from '@/types/ai';
import { JobCard } from './job-card';

interface PriorityQueueProps {
  jobs: Job[];
  matches: Map<string, AIMatchScore>;
  onJobSelect?: (jobId: string, selected: boolean) => void;
  selectedJobIds?: Set<string>;
}

export function PriorityQueue({
  jobs,
  matches,
  onJobSelect,
  selectedJobIds = new Set()
}: PriorityQueueProps) {
  const [sortBy, setSortBy] = useState<SortOption>('match_score');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [showOnlyStrong, setShowOnlyStrong] = useState<boolean>(false);

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    const matchA = matches.get(a.id)?.overall || 0;
    const matchB = matches.get(b.id)?.overall || 0;

    switch (sortBy) {
      case 'match_score':
        return matchB - matchA; // Highest first

      case 'recent':
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();

      case 'manual':
      default:
        return 0; // Keep original order
    }
  });

  // Filter jobs
  const filteredJobs = sortedJobs.filter(job => {
    const matchScore = matches.get(job.id)?.overall || 0;

    if (matchScore < minMatchScore) return false;
    if (showOnlyStrong && matchScore < 75) return false;

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Sort options */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Sort by
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy('match_score')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                sortBy === 'match_score'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Best Match
            </button>

            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                sortBy === 'recent'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Most Recent
            </button>

            <button
              onClick={() => setSortBy('manual')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                sortBy === 'manual'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Default Order
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Minimum match score: {minMatchScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyStrong}
              onChange={(e) => setShowOnlyStrong(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">
              Show only strong matches (≥75%)
            </span>
          </label>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
          Showing <span className="font-semibold">{filteredJobs.length}</span> of {jobs.length} jobs
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-2">No jobs match your filters</p>
            <button
              onClick={() => {
                setMinMatchScore(0);
                setShowOnlyStrong(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredJobs.map(job => {
            const matchScore = matches.get(job.id);

            return (
              <div key={job.id} className="relative">
                {/* Match score badge */}
                {matchScore && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      matchScore.overall >= 80
                        ? 'bg-green-500 text-white'
                        : matchScore.overall >= 60
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {matchScore.overall}% match
                    </div>
                  </div>
                )}

                <JobCard
                  job={job}
                  isSelected={selectedJobIds.has(job.id)}
                  onSelect={onJobSelect ? (id) => onJobSelect(id, true) : () => {}}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
