'use client';

// =============================================================================
// NOTIFICATION DEMO - DAY 10
// =============================================================================
// Generate sample notifications for testing
// =============================================================================

import { useState } from 'react';
import { createNotification, addNotification } from '@/lib/notification-engine';
import Link from 'next/link';

export default function NotificationDemoPage() {
  const [lastAdded, setLastAdded] = useState<string>('');

  const generateJobMatchNotification = () => {
    const notification = createNotification(
      'job_match',
      'New High-Match Job Available',
      'Senior Frontend Engineer at Tech Corp (92% match) - Remote, US',
      { jobId: 'job_123', matchScore: 92 }
    );
    addNotification(notification);
    setLastAdded('Job Match notification added');
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const generateReplyNotification = () => {
    const notification = createNotification(
      'application_reply',
      'Application Reply Received',
      'Google has responded to your application for Senior React Developer',
      { applicationId: 'app_456' }
    );
    addNotification(notification);
    setLastAdded('Reply notification added');
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const generateInterviewNotification = () => {
    const notification = createNotification(
      'interview_scheduled',
      'Interview Scheduled',
      'Your interview with Microsoft is scheduled for tomorrow at 2:00 PM',
      { interviewId: 'int_789' }
    );
    addNotification(notification);
    setLastAdded('Interview notification added');
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const generateReferralNotification = () => {
    const notification = createNotification(
      'referral_accepted',
      'Referral Accepted',
      'Your referral to Amazon was accepted. You earned 50 credits!',
      { referralId: 'ref_101', credits: 50 }
    );
    addNotification(notification);
    setLastAdded('Referral notification added');
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  const generateSystemNotification = () => {
    const notification = createNotification(
      'system',
      'Weekly Digest Available',
      'Your weekly job search summary is ready. 15 new matches this week.',
      { digestId: 'digest_202' }
    );
    addNotification(notification);
    setLastAdded('System notification added');
    window.dispatchEvent(new Event('notificationsChanged'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Notification Demo
              </h1>
            </div>
            <Link
              href="/notifications"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Notifications
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Sample Notifications
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Click the buttons below to generate different types of notifications.
            Then check the notification center to see them.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Match */}
            <button
              onClick={generateJobMatchNotification}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Job Match</span>
              </div>
              <p className="text-xs text-gray-600">
                Generate a high-match job notification
              </p>
            </button>

            {/* Application Reply */}
            <button
              onClick={generateReplyNotification}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Application Reply</span>
              </div>
              <p className="text-xs text-gray-600">
                Generate an application response notification
              </p>
            </button>

            {/* Interview Scheduled */}
            <button
              onClick={generateInterviewNotification}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Interview Scheduled</span>
              </div>
              <p className="text-xs text-gray-600">
                Generate an interview notification (high priority)
              </p>
            </button>

            {/* Referral Accepted */}
            <button
              onClick={generateReferralNotification}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Referral Accepted</span>
              </div>
              <p className="text-xs text-gray-600">
                Generate a referral acceptance notification
              </p>
            </button>

            {/* System/Digest */}
            <button
              onClick={generateSystemNotification}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all text-left group sm:col-span-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-gray-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">System / Digest</span>
              </div>
              <p className="text-xs text-gray-600">
                Generate a system or digest notification
              </p>
            </button>
          </div>

          {lastAdded && (
            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ {lastAdded}
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            How to Test Notifications
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Generate notifications using the buttons above</li>
            <li>Click "View Notifications" to see them in the notification center</li>
            <li>Configure notification preferences in the settings panel</li>
            <li>Try enabling push notifications (requires HTTPS in production)</li>
            <li>Test Do Not Disturb mode by setting time ranges</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
