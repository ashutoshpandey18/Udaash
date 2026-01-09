'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SpeechRecognitionLib, { useSpeechRecognition } from 'react-speech-recognition';
import { parseVoiceCommand, type VoiceCommandResult } from '@/lib/voice-commands';

// =============================================================================
// VOICE COMPOSER - DAY 2 (CALM AUTHORITY)
// =============================================================================
// Reliable, responsive voice input
// No visual theatrics, no performance cost
// Clear states, simple feedback
// =============================================================================

interface VoiceComposerProps {
  onCommand?: (result: VoiceCommandResult) => void;
  className?: string;
}

export function VoiceComposer({
  onCommand,
  className = ''
}: VoiceComposerProps) {
  const [mounted, setMounted] = useState(false);
  const [commandResult, setCommandResult] = useState<VoiceCommandResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const processingRef = useRef(false);
  const [setThemeFunc, setSetThemeFunc] = useState<((theme: 'light' | 'dark' | 'system') => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    // Dynamically import theme hook after mount
    import('./theme-provider').then((mod) => {
      try {
        const { setTheme } = mod.useTheme();
        setSetThemeFunc(() => setTheme);
      } catch (e) {
        // Theme provider not available, skip theme commands
        console.warn('Theme provider not available');
      }
    });
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Process transcript
  useEffect(() => {
    if (!transcript || processingRef.current) return;

    const timeoutId = setTimeout(() => {
      processingRef.current = true;
      const result = parseVoiceCommand(transcript);
      setCommandResult(result);
      setShowFeedback(true);

      // Handle theme commands
      if (result.type === 'theme' && result.theme && setThemeFunc) {
        setThemeFunc(result.theme);
      }

      onCommand?.(result);

      // Optional haptic feedback (mobile)
      if ('vibrate' in navigator && result.type !== 'unknown') {
        navigator.vibrate(30);
      }

      // Clear feedback after 3s
      setTimeout(() => {
        setShowFeedback(false);
        setCommandResult(null);
        resetTranscript();
        processingRef.current = false;
      }, 3000);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      processingRef.current = false;
    };
  }, [transcript, onCommand, resetTranscript, setThemeFunc]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognitionLib.stopListening();
    } else {
      resetTranscript();
      setCommandResult(null);
      setShowFeedback(false);
      SpeechRecognitionLib.startListening({ continuous: false });
    }
  }, [listening, resetTranscript]);

  // Fallback if browser doesn't support speech
  if (!browserSupportsSpeechRecognition || !mounted) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-neutral-500 text-sm">
          {!mounted ? 'Loading...' : 'Voice input not supported in this browser'}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Microphone Button */}
      <button
        onClick={toggleListening}
        disabled={processingRef.current}
        className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-full
          transition-all duration-100
          ${listening
            ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
            : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700'
          }
          ${processingRef.current ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
        `}
        aria-label={listening ? 'Stop listening' : 'Start voice input'}
      >
        {/* Microphone Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>

        {/* Listening indicator */}
        {listening && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* State Text */}
      <div className="h-6 flex items-center justify-center">
        {listening && (
          <p className="text-neutral-400 text-sm font-medium">
            Listening...
          </p>
        )}
        {processingRef.current && !listening && (
          <p className="text-neutral-400 text-sm">
            Processing...
          </p>
        )}
      </div>

      {/* Feedback Message */}
      {showFeedback && commandResult && (
        <div
          className={`
            surface rounded-lg px-4 py-2.5 max-w-xs text-center
            transition-opacity duration-100
            ${showFeedback ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {transcript && (
            <p className="text-neutral-300 text-sm mb-1">
              "{transcript}"
            </p>
          )}
          <p className={`text-xs ${
            commandResult.type === 'unknown'
              ? 'text-neutral-500'
              : 'text-blue-400'
          }`}>
            {commandResult.message}
          </p>
        </div>
      )}

      {/* Command Hints */}
      {!listening && !showFeedback && (
        <div className="text-center space-y-1">
          <p className="text-neutral-500 text-xs">Try saying:</p>
          <p className="text-neutral-600 text-xs">
            "Show India jobs" • "Enable dark mode"
          </p>
        </div>
      )}
    </div>
  );
}
