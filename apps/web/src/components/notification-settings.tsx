'use client';

// =============================================================================
// NOTIFICATION SETTINGS - DAY 10 (CALM AUTHORITY)
// =============================================================================
// Simple, clear preference controls
// User defines exactly what they receive
// =============================================================================

import { useState, useEffect } from 'react';
import {
  NotificationPreferences,
  getPreferences,
  savePreferences,
  DEFAULT_PREFERENCES
} from '@/lib/notification-engine';

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPreferences(getPreferences());
  }, []);

  const handleSave = () => {
    savePreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateRule = (ruleId: string, updates: Partial<any>) => {
    setPreferences((prev) => ({
      ...prev,
      rules: prev.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Digest Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
          Digest Notifications
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.digestEnabled}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, digestEnabled: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-900">Enable daily/weekly summaries</span>
          </label>

          {preferences.digestEnabled && (
            <div className="ml-7 space-y-2">
              <label className="block text-xs text-gray-700">
                Frequency
                <select
                  value={preferences.digestFrequency}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      digestFrequency: e.target.value as any,
                    }))
                  }
                  className="mt-1 block w-full sm:w-auto px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </label>

              {preferences.digestFrequency !== 'never' && (
                <label className="block text-xs text-gray-700">
                  Delivery Time
                  <input
                    type="time"
                    value={preferences.digestTime || '09:00'}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, digestTime: e.target.value }))
                    }
                    className="mt-1 block w-full sm:w-auto px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Rules */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
          Notification Rules
        </h3>

        <div className="space-y-4">
          {preferences.rules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                    {rule.type.replace(/_/g, ' ')}
                  </h4>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600">Enabled</span>
                </label>
              </div>

              {rule.enabled && (
                <div className="space-y-2 ml-0">
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={rule.inboxEnabled}
                      onChange={(e) =>
                        updateRule(rule.id, { inboxEnabled: e.target.checked })
                      }
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Show in inbox
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={rule.pushEnabled}
                      onChange={(e) =>
                        updateRule(rule.id, { pushEnabled: e.target.checked })
                      }
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Send push notification
                  </label>

                  {rule.type === 'job_match' && (
                    <label className="block text-xs text-gray-700 mt-2">
                      Match threshold: {rule.matchThreshold}%
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={rule.matchThreshold || 70}
                        onChange={(e) =>
                          updateRule(rule.id, { matchThreshold: parseInt(e.target.value) })
                        }
                        className="w-full mt-1"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
          Do Not Disturb
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.doNotDisturb.enabled}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  doNotDisturb: { ...prev.doNotDisturb, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-900">
              Silence notifications during specific hours
            </span>
          </label>

          {preferences.doNotDisturb.enabled && (
            <div className="ml-7 grid grid-cols-2 gap-3">
              <label className="block text-xs text-gray-700">
                Start time
                <input
                  type="time"
                  value={preferences.doNotDisturb.start || '22:00'}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      doNotDisturb: { ...prev.doNotDisturb, start: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>

              <label className="block text-xs text-gray-700">
                End time
                <input
                  type="time"
                  value={preferences.doNotDisturb.end || '08:00'}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      doNotDisturb: { ...prev.doNotDisturb, end: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Preferences
        </button>
        {saved && (
          <span className="text-xs sm:text-sm text-green-600 font-medium">
            ✓ Saved
          </span>
        )}
      </div>
    </div>
  );
}
