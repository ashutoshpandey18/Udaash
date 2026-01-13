/**
 * Offline Indicator - Day 6 UDAASH
 *
 * Clear network status without blocking UI.
 * Calm Authority: Informative, not alarming.
 */

'use client';

import { useEffect, useState } from 'react';
import { isOnline, onNetworkStatusChange } from '@/lib/pwa';

type NetworkStatus = 'online' | 'offline' | 'syncing';

export function OfflineIndicator() {
  const [status, setStatus] = useState<NetworkStatus>('online');
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Set initial status
    setStatus(isOnline() ? 'online' : 'offline');

    // Listen to network changes
    const cleanup = onNetworkStatusChange((online) => {
      if (online) {
        // Transitioning to online - show syncing state briefly
        setStatus('syncing');
        setShowIndicator(true);

        // After sync (simulated), return to online
        setTimeout(() => {
          setStatus('online');

          // Hide indicator after 2 seconds
          setTimeout(() => {
            setShowIndicator(false);
          }, 2000);
        }, 1000);
      } else {
        // Going offline
        setStatus('offline');
        setShowIndicator(true);
      }
    });

    // Listen to service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          setStatus('online');

          // Hide after confirmation
          setTimeout(() => {
            setShowIndicator(false);
          }, 2000);
        }
      });
    }

    return cleanup;
  }, []);

  // Only show when offline or syncing
  if (!showIndicator && status === 'online') {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        showIndicator ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={`px-4 py-2 text-center text-sm font-medium transition-colors ${
        status === 'offline'
          ? 'bg-orange-500 text-white'
          : status === 'syncing'
          ? 'bg-blue-500 text-white'
          : 'bg-green-500 text-white'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {status === 'offline' && (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
              <span>You're offline • Changes will sync when online</span>
            </>
          )}

          {status === 'syncing' && (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Syncing changes...</span>
            </>
          )}

          {status === 'online' && showIndicator && (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Back online • All changes synced</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact offline badge (for use in headers/navbars)
 */
export function OfflineBadge() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(isOnline());

    const cleanup = onNetworkStatusChange((status) => {
      setOnline(status);
    });

    return cleanup;
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
      <div className="w-2 h-2 bg-orange-500 rounded-full" />
      <span>Offline</span>
    </div>
  );
}
