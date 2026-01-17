'use client';

// =============================================================================
// PUSH MANAGER - DAY 10 (CALM AUTHORITY)
// =============================================================================
// Opt-in only push notifications
// Clear explanation before permission
// No automatic prompts
// =============================================================================

import { useState, useEffect } from 'react';
import { requestPushPermission, getPreferences, savePreferences } from '@/lib/notification-engine';

export function PushManager() {
  const [mounted, setMounted] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnablePush = async () => {
    setIsRequesting(true);
    try {
      const granted = await requestPushPermission();
      if (granted) {
        setPermission('granted');
        const prefs = getPreferences();
        prefs.pushEnabled = true;
        savePreferences(prefs);
      } else {
        setPermission('denied');
      }
    } catch (error) {
      console.error('Failed to enable push:', error);
    } finally {
      setIsRequesting(false);
      setShowExplanation(false);
    }
  };

  const handleDisablePush = () => {
    const prefs = getPreferences();
    prefs.pushEnabled = false;
    savePreferences(prefs);
  };

  if (!mounted) {
    return null;
  }

  if (!('Notification' in window)) {
    return (
      <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600">
          Push notifications are not supported in your browser.
        </p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
          Push Notifications Blocked
        </h3>
        <p className="text-xs text-gray-600">
          You've blocked notifications. To enable them, update your browser settings.
        </p>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
              Push Notifications Enabled
            </h3>
            <p className="text-xs text-gray-600">
              You'll receive push notifications based on your preferences.
            </p>
          </div>
          <button
            onClick={handleDisablePush}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Disable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
          Enable Push Notifications
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Get notified about high-match jobs, application replies, and interviews.
          You control what you receive.
        </p>
        <button
          onClick={() => setShowExplanation(true)}
          className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enable Push Notifications
        </button>
      </div>

      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              About Push Notifications
            </h2>

            <div className="space-y-3 mb-4 text-xs sm:text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">What you'll receive:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>New job matches above your threshold</li>
                <li>Application replies from companies</li>
                <li>Interview scheduling updates</li>
              </ul>

              <p>
                <strong className="text-gray-900">You're in control:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Configure exactly what you receive</li>
                <li>Set Do Not Disturb hours</li>
                <li>Disable anytime from settings</li>
              </ul>

              <p className="text-xs text-gray-500 mt-3">
                Notifications are silent by default. No sound or vibration unless configured.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleEnablePush}
                disabled={isRequesting}
                className="flex-1 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isRequesting ? 'Requesting...' : 'Allow Notifications'}
              </button>
              <button
                onClick={() => setShowExplanation(false)}
                disabled={isRequesting}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
