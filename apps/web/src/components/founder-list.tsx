'use client';

// =============================================================================
// FOUNDER LIST - DAY 13 (CALM AUTHORITY)
// =============================================================================
// Professional founder directory with privacy controls
// =============================================================================

import { useState, useEffect } from 'react';
import type { FounderProfile } from '@/types/network';
import { MOCK_FOUNDERS } from '@/lib/mock-founders';
import { canViewProfile, filterProfileByVisibility } from '@/lib/network';

interface FounderListProps {
  searchQuery?: string;
  skillFilter?: string;
  locationFilter?: string;
}

export function FounderList({
  searchQuery = '',
  skillFilter = '',
  locationFilter = '',
}: FounderListProps) {
  const [mounted, setMounted] = useState(false);
  const [founders, setFounders] = useState<FounderProfile[]>([]);
  const [filteredFounders, setFilteredFounders] = useState<FounderProfile[]>([]);
  const [selectedFounder, setSelectedFounder] = useState<FounderProfile | null>(null);

  // Current user (mock)
  const currentUserId = 'current-user';
  const connectedIds = ['founder-1', 'founder-2', 'founder-5']; // Mock connections

  useEffect(() => {
    setMounted(true);
    setFounders(MOCK_FOUNDERS);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let filtered = [...founders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.company?.toLowerCase().includes(query) ||
          f.role.toLowerCase().includes(query) ||
          f.bio?.toLowerCase().includes(query)
      );
    }

    // Skill filter
    if (skillFilter) {
      filtered = filtered.filter((f) =>
        f.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter((f) => f.location?.toLowerCase() === locationFilter.toLowerCase());
    }

    // Apply visibility filtering
    filtered = filtered
      .filter((f) => canViewProfile(f, currentUserId, connectedIds.includes(f.id)))
      .map((f) => filterProfileByVisibility(f, currentUserId, connectedIds.includes(f.id)) as FounderProfile);

    setFilteredFounders(filtered);
  }, [mounted, searchQuery, skillFilter, locationFilter, founders]);

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-800/50 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-neutral-700 rounded w-1/3 mb-4"></div>
            <div className="h-3 bg-neutral-700 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Founder Directory
          <span className="ml-2 text-sm text-neutral-400">({filteredFounders.length} founders)</span>
        </h2>
      </div>

      {/* Founder Cards */}
      <div className="space-y-3">
        {filteredFounders.length === 0 ? (
          <div className="bg-neutral-800/30 rounded-lg p-12 text-center">
            <p className="text-neutral-400">No founders found matching your criteria.</p>
          </div>
        ) : (
          filteredFounders.map((founder) => {
            const isConnected = connectedIds.includes(founder.id);
            return (
              <div
                key={founder.id}
                className="group bg-neutral-800/50 hover:bg-neutral-800/70 rounded-lg p-6 transition-colors cursor-pointer border border-neutral-700/50 hover:border-neutral-600/50"
                onClick={() => setSelectedFounder(founder)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                      {founder.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold truncate">{founder.name}</h3>
                        {founder.isVerified && (
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {isConnected && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                            Connected
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-neutral-300 mb-1">
                        {founder.role}
                        {founder.company && (
                          <span className="text-neutral-400"> at {founder.company}</span>
                        )}
                      </p>

                      {founder.location && (
                        <p className="text-xs text-neutral-500 mb-2">📍 {founder.location}</p>
                      )}

                      {founder.bio && (
                        <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{founder.bio}</p>
                      )}

                      {founder.skills && founder.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {founder.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-violet-500/10 text-violet-300 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {founder.skills.length > 4 && (
                            <span className="text-xs text-neutral-500 px-2 py-1">
                              +{founder.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {!isConnected && (
                      <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded transition-colors">
                        Connect
                      </button>
                    )}
                    <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Profile Modal (simplified for now) */}
      {selectedFounder && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFounder(null)}
        >
          <div
            className="bg-neutral-900 rounded-lg p-8 max-w-2xl w-full border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedFounder.name}</h2>
              <button
                onClick={() => setSelectedFounder(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-neutral-300 mb-4">
              {selectedFounder.role}
              {selectedFounder.company && ` at ${selectedFounder.company}`}
            </p>
            {selectedFounder.bio && (
              <p className="text-neutral-400 mb-4">{selectedFounder.bio}</p>
            )}
            {selectedFounder.skills && selectedFounder.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFounder.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm bg-violet-500/10 text-violet-300 px-3 py-1.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
