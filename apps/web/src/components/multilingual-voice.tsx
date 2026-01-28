'use client';

// =============================================================================
// MULTILINGUAL VOICE - DAY 12 (CALM AUTHORITY)
// =============================================================================
// Voice input with language detection
// English, Hindi, and Hinglish support
// Browser Speech Recognition API (production-safe)
// =============================================================================

import { useState, useEffect, useRef } from 'react';
// import { useI18n } from './i18n-provider';
import type { Locale } from '@/lib/i18n';
import { getVoiceLanguageCode, detectSpokenLanguage, LOCALE_NAMES } from '@/lib/i18n';

// Browser Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// =============================================================================
// TYPES
// =============================================================================

type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

interface MultilingualVoiceProps {
  onTranscript: (text: string, detectedLang: Locale) => void;
  onError?: (error: string) => void;
  autoDetectLanguage?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MultilingualVoice({
  onTranscript,
  onError,
  autoDetectLanguage = true,
  className = '',
}: MultilingualVoiceProps) {
  // Temporarily disabled i18n
  // const { locale, t } = useI18n();
  const locale = 'en' as Locale;
  const t = (key: string) => key;
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<Locale>(locale);
  const [isSupported, setIsSupported] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<Locale | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getVoiceLanguageCode(voiceLang);

    recognition.onstart = () => {
      setState('listening');
      setError(null);
      setDetectedLanguage(null);
    };

    recognition.onresult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      const transcript = speechEvent.results[0][0].transcript;

      setState('processing');

      // Auto-detect language if enabled
      let detected = voiceLang;
      if (autoDetectLanguage) {
        detected = detectSpokenLanguage(transcript);
        setDetectedLanguage(detected);
      }

      // Call the callback with transcript and detected language
      onTranscript(transcript, detected);

      setState('idle');
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      const errorMsg = getErrorMessage(errorEvent.error);
      setError(errorMsg);
      setState('error');
      onError?.(errorMsg);

      // Reset after a delay
      setTimeout(() => {
        setState('idle');
        setError(null);
      }, 3000);
    };

    recognition.onend = () => {
      if (state === 'listening') {
        setState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, voiceLang, autoDetectLanguage, onTranscript, onError, state]);

  // Get error message based on error type
  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
      case 'no-speech':
        return t.voice.noSpeechDetected;
      case 'audio-capture':
      case 'not-allowed':
        return t.voice.permissionDenied;
      case 'network':
        return t.errors.networkError;
      default:
        return t.errors.somethingWrong;
    }
  };

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || state === 'listening') return;

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setError(t.errors.somethingWrong);
      setState('error');
    }
  };

  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setState('idle');
  };

  // Toggle listening
  const toggleListening = () => {
    if (state === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  // Switch voice language
  const switchVoiceLanguage = () => {
    const newLang: Locale = voiceLang === 'en' ? 'hi' : 'en';
    setVoiceLang(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = getVoiceLanguageCode(newLang);
    }
  };

  // If not supported, show message
  if (!isSupported) {
    return (
      <div className={`rounded-lg border border-neutral-300 dark:border-neutral-700 p-4 ${className}`}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t.voice.speechNotSupported}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          disabled={state === 'processing'}
          className={`
            relative flex items-center justify-center w-16 h-16 rounded-full
            transition-all duration-200
            ${
              state === 'listening'
                ? 'bg-red-500 hover:bg-red-600 scale-110'
                : 'bg-blue-500 hover:bg-blue-600 scale-100'
            }
            ${state === 'processing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            shadow-lg hover:shadow-xl
          `}
          aria-label={state === 'listening' ? 'Stop listening' : t.voice.tapToSpeak}
        >
          {/* Microphone Icon */}
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>

          {/* Pulse animation when listening */}
          {state === 'listening' && (
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Status text */}
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {state === 'idle' && t.voice.tapToSpeak}
            {state === 'listening' && t.voice.listening}
            {state === 'processing' && t.voice.processing}
            {state === 'error' && error}
          </div>

          {/* Language indicator */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {LOCALE_NAMES[voiceLang].native}
            </span>

            {detectedLanguage && detectedLanguage !== voiceLang && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                ({t.voice.languageDetected}: {LOCALE_NAMES[detectedLanguage].native})
              </span>
            )}
          </div>
        </div>

        {/* Language switch button */}
        <button
          onClick={switchVoiceLanguage}
          className="
            px-3 py-2 text-xs font-medium rounded-lg
            bg-neutral-100 hover:bg-neutral-200
            dark:bg-neutral-800 dark:hover:bg-neutral-700
            text-neutral-700 dark:text-neutral-300
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          "
          aria-label={t.voice.switchLanguage}
        >
          {voiceLang === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>

      {/* Error message */}
      {state === 'error' && error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Instructions */}
      {state === 'idle' && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <p>• {locale === 'en' ? 'Tap the microphone and speak' : 'माइक्रोफोन टैप करें और बोलें'}</p>
          <p>
            •{' '}
            {locale === 'en'
              ? 'Supports English, Hindi, and Hinglish'
              : 'अंग्रेज़ी, हिन्दी और हिंग्लिश समर्थित'}
          </p>
        </div>
      )}
    </div>
  );
}
