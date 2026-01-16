// =============================================================================
// DAY 9 DEMO PAGE - Social Sharing & Referrals
// =============================================================================
// Demonstration page for all Day 9 features
// =============================================================================

'use client';

import { useState } from 'react';
import { mockJobs } from '@/lib/mock-jobs';
import { ShareModal } from '@/components/share-modal';
import { ReferralPanel, CompactReferralWidget } from '@/components/referral-panel';
import { QRCode } from '@/components/qr-code';
import { getJobShareUrl, getJobShareData } from '@/lib/social';
import Link from 'next/link';

export default function Day9DemoPage() {
  const [showShare, setShowShare] = useState(false);
  const [selectedJob, setSelectedJob] = useState(mockJobs[0] || mockJobs.find(() => true)!);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Day 9 Demo
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Social Sharing & Referrals
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Share Modal Demo */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                1. Share Modal
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Platform-specific sharing with LinkedIn, WhatsApp, Email, Twitter, QR codes, and copy link.
              </p>

              {/* Job Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                  Select a Job:
                </label>
                <select
                  value={selectedJob.id}
                  onChange={(e) => {
                    const job = mockJobs.find(j => j.id === e.target.value);
                    if (job) setSelectedJob(job);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-neutral-100"
                >
                  {mockJobs.slice(0, 10).map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} at {job.company}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowShare(true)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Open Share Modal
              </button>

              <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  <strong>Features:</strong> Multi-platform sharing, native share API, QR codes, clipboard fallback
                </p>
              </div>
            </div>

            {/* Shareable Pages Demo */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                2. Shareable Job Pages
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Public, SEO-friendly job landing pages with OG metadata.
              </p>

              <div className="space-y-2 mb-4">
                {mockJobs.slice(0, 5).map(job => {
                  const shareUrl = getJobShareUrl(job.id);
                  return (
                    <Link
                      key={job.id}
                      href={shareUrl}
                      target="_blank"
                      className="block p-3 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
                    >
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {job.title}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {job.company} • {job.market}
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  <strong>Features:</strong> SSR, OG tags, mobile responsive, no forced signup
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Demo */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              3. QR Code Generator
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              High-contrast QR codes for offline sharing with download support.
            </p>

            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1">
                <QRCode
                  value={getJobShareUrl(selectedJob.id)}
                  size={220}
                />
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Use Cases
                    </h3>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Business cards</li>
                      <li>• Presentation slides</li>
                      <li>• Print resumes</li>
                      <li>• In-person networking</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      <strong>Features:</strong> No external dependencies, high contrast, downloadable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Panel Demo */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              4. Referral System
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Conservative, honest invite system with clear benefits and private tracking.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Full Panel
                </h3>
                <ReferralPanel userId="demo-user" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Compact Widget
                </h3>
                <CompactReferralWidget />

                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                    ✅ Ethical Principles
                  </h4>
                  <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                    <li>• User-initiated only</li>
                    <li>• No aggressive incentives</li>
                    <li>• Clear, honest copy</li>
                    <li>• Private stats display</li>
                    <li>• No misleading promises</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Day 9 Complete ✅
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-3xl mb-2">📤</div>
                <div className="font-semibold">Platform Sharing</div>
                <div className="text-sm text-blue-100 mt-1">
                  LinkedIn, WhatsApp, Email, Twitter
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-semibold">Public Pages</div>
                <div className="text-sm text-blue-100 mt-1">
                  SEO-friendly, no forced signup
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">📱</div>
                <div className="font-semibold">QR Codes</div>
                <div className="text-sm text-blue-100 mt-1">
                  High-contrast, downloadable
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🎁</div>
                <div className="font-semibold">Referrals</div>
                <div className="text-sm text-blue-100 mt-1">
                  Conservative, ethical tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        job={selectedJob}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Day 9 — Social Sharing & Referrals • Built with ethical principles
          </p>
        </div>
      </footer>
    </div>
  );
}
