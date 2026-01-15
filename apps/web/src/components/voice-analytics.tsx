// =============================================================================
// VOICE ANALYTICS - DAY 8
// =============================================================================
// Voice-activated analytics summary
// Speaks activity summary using Web Speech API
// =============================================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import type { AnalyticsData, AnalyticsSummary } from '@/lib/openrouter-analytics';
import { generateVoiceSummary } from '@/lib/openrouter-analytics';

// =============================================================================
// TYPES
// =============================================================================

interface VoiceAnalyticsProps {
  data: AnalyticsData;
  summary: AnalyticsSummary | null;
  className?: string;
}

// =============================================================================
// MAIN VOICE ANALYTICS COMPONENT
// =============================================================================

export function VoiceAnalytics({ data, summary, className = '' }: VoiceAnalyticsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check for Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!synthRef.current || !isSupported) return;

    // Stop if already speaking
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    // Generate voice-friendly summary
    const voiceText = generateVoiceSummary(data, summary);

    // Create utterance
    utteranceRef.current = new SpeechSynthesisUtterance(voiceText);

    // Set voice properties
    utteranceRef.current.rate = 0.9; // Slightly slower for clarity
    utteranceRef.current.pitch = 1.0;
    utteranceRef.current.volume = 1.0;

    // Event handlers
    utteranceRef.current.onstart = () => {
      setIsSpeaking(true);
    };

    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    // Speak
    synthRef.current.speak(utteranceRef.current);
  };

  // Not supported state
  if (!isSupported) {
    return (
      <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 ${className}`}>
        <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
          <span className="text-2xl">🔇</span>
          <div className="text-sm">
            <div className="font-medium">Voice Not Available</div>
            <div className="text-xs">Your browser doesn't support text-to-speech</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isSpeaking ? '🔊' : '🎙️'}</span>
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Voice Summary
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {isSpeaking ? 'Speaking analytics...' : 'Listen to your week in review'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          disabled={!data || data.applied === 0}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            isSpeaking
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400'
          }`}
        >
          {isSpeaking ? 'Stop' : 'Speak'}
        </button>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex gap-1">
            <span className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <span>Speaking...</span>
        </div>
      )}

      {/* Empty state */}
      {data.applied === 0 && (
        <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Apply to jobs to hear your analytics summary
        </div>
      )}
    </div>
  );
}
