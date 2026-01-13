/**
 * PWA Install Prompt - Day 6 UDAASH
 *
 * Non-intrusive install banner.
 * User-controlled, platform-aware.
 */

'use client';

import { useEffect, useState } from 'react';
import {
  canInstallPWA,
  isPWA,
  iOS,
  isAndroid,
  promptInstall,
  setInstallPromptEvent,
  getInstallPromptEvent,
  storage
} from '@/lib/pwa';

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);

  useEffect(() => {
    // Don't show if already installed
    if (isPWA()) {
      return;
    }

    // Check if user dismissed recently
    const dismissed = storage.get<{ timestamp: number }>(DISMISSED_KEY);
    if (dismissed && Date.now() - dismissed.timestamp < DISMISS_DURATION) {
      return;
    }

    // Detect platform
    if (iOS()) {
      setPlatform('ios');
      // Show iOS instructions after a delay (less intrusive)
      setTimeout(() => setShowPrompt(true), 5000);
    } else if (isAndroid()) {
      setPlatform('android');
    } else if (canInstallPWA()) {
      setPlatform('desktop');
    }

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setPlatform(isAndroid() ? 'android' : 'desktop');

      // Show prompt after delay (less intrusive)
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (platform === 'ios') {
      // iOS doesn't support programmatic install, just show instructions
      return;
    }

    const outcome = await promptInstall();

    if (outcome === 'accepted') {
      setShowPrompt(false);
    } else if (outcome === 'dismissed') {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    storage.set(DISMISSED_KEY, { timestamp: Date.now() });
    setShowPrompt(false);
  };

  if (!showPrompt || !platform) {
    return null;
  }

  return (
    <>
      {platform === 'ios' ? (
        <IOSInstallInstructions onDismiss={handleDismiss} />
      ) : (
        <AndroidDesktopInstallPrompt
          onInstall={handleInstall}
          onDismiss={handleDismiss}
          platform={platform}
        />
      )}
    </>
  );
}

/**
 * iOS Install Instructions
 */
function IOSInstallInstructions({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install UDAASH
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              Add to your home screen for quick access and offline support.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
              <span>Tap</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 5v14l-4-2-4 2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
              </svg>
              <span>then "Add to Home Screen"</span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Android/Desktop Install Prompt
 */
function AndroidDesktopInstallPrompt({
  onInstall,
  onDismiss,
  platform
}: {
  onInstall: () => void;
  onDismiss: () => void;
  platform: 'android' | 'desktop';
}) {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install UDAASH
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              {platform === 'android'
                ? 'Get quick access and work offline'
                : 'Install for a better experience'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onInstall}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={onDismiss}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
