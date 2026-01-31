'use client';

// =============================================================================
// NETWORK PAGE - DAY 13 (CALM AUTHORITY)
// =============================================================================
// Founder Network & Collaboration Hub
// =============================================================================

import { useState, useEffect } from 'react';
import { FounderList } from '@/components/founder-list';
import { CollabBoardView } from '@/components/collab-board';
import { MentorDiscovery } from '@/components/mentor-discovery';
import { NetworkSettingsPanel } from '@/components/network-settings';
import type { FounderProfile } from '@/types/network';

type TabType = 'directory' | 'boards' | 'mentors' | 'settings';

export default function NetworkPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('directory');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user profile
  const userProfile: FounderProfile = {
    id: 'current-user',
    name: 'Your Name',
    role: 'Founder',
    skills: ['Product Management', 'AI/ML', 'SaaS'],
    location: 'Bangalore',
    visibility: 'network',
    joinedDate: new Date(),
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-400">Loading network...</div>
      </div>
    );
  }

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'directory', label: 'Founder Directory', icon: '👥' },
    { id: 'boards', label: 'Collaboration Boards', icon: '📋' },
    { id: 'mentors', label: 'Mentor Discovery', icon: '🎓' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative border-b border-neutral-800 bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-white mb-3">
            Founder Network & Collaboration
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            Connect with fellow founders, share job boards, and find mentors. Privacy-first,
            opt-in only, no viral mechanics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-neutral-900/50 rounded-lg p-1 border border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar (for directory and mentors) */}
        {(activeTab === 'directory' || activeTab === 'mentors') && (
          <div className="mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, skills..."
              className="w-full bg-neutral-900/50 text-white px-6 py-4 rounded-lg border border-neutral-800 focus:border-violet-500 outline-none transition-colors"
            />
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'directory' && <FounderList searchQuery={searchQuery} />}

          {activeTab === 'boards' && <CollabBoardView />}

          {activeTab === 'mentors' && <MentorDiscovery userProfile={userProfile} />}

          {activeTab === 'settings' && <NetworkSettingsPanel />}
        </div>
      </div>

      {/* Info Footer */}
      <section className="border-t border-neutral-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">🔒 Privacy First</h3>
              <p className="text-sm text-neutral-400">
                You control who sees your profile. All connections require explicit consent.
                No public follower counts.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">🤝 Opt-In Only</h3>
              <p className="text-sm text-neutral-400">
                No forced discovery or viral mechanics. Connect with founders you actually
                want to collaborate with.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">📋 Shared Boards</h3>
              <p className="text-sm text-neutral-400">
                Create invitation-only Kanban boards to track job applications with your
                network. Permission controls included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Commands Info */}
      <section className="border-t border-neutral-800 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              🎤
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Voice Commands Available</h3>
              <div className="text-sm text-neutral-400 space-y-1">
                <p>"Show founder directory" - Navigate to directory</p>
                <p>"Open collaboration boards" - View shared boards</p>
                <p>"Find mentors" - Discover potential mentors</p>
                <p>"Add job to shared board" - Quick add to collaboration board</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
