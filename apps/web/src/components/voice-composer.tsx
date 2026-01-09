'use client';

import { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognitionLib, { useSpeechRecognition } from 'react-speech-recognition';
import { parseVoiceCommand, triggerHaptic, voiceCommandSuggestions, type VoiceCommandResult } from '@/lib/voice-commands';
import type { Market, Job } from '@/lib/mock-jobs';

// =============================================================================
// VOICE COMPOSER - DAY 2 SPEECH RECOGNITION
// =============================================================================
// Purple mic orb with physics animations
// Uses react-speech-recognition for Web Speech API
// Commands → orbital glow + job filtering
// =============================================================================

interface VoiceComposerProps {
  onCommand?: (result: VoiceCommandResult) => void;
  onActiveMarketChange?: (market: Market | null) => void;
  onListeningChange?: (isListening: boolean) => void;
}

// Voice wave SVG animation component
const VoiceWave = memo(function VoiceWave({ isActive }: { isActive: boolean }) {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x={20 + i * 20}
          y={15}
          width={4}
          height={10}
          rx={2}
          fill="#A78BFA"
          animate={isActive ? {
            height: [10, 25, 10, 20, 10],
            y: [15, 7.5, 15, 10, 15],
          } : {
            height: 10,
            y: 15,
          }}
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
});

// Transcript bubble component
const TranscriptBubble = memo(function TranscriptBubble({
  transcript,
  result
}: {
  transcript: string;
  result: VoiceCommandResult | null;
}) {
  if (!transcript && !result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-72 sm:w-80"
    >
      <div className="glass-panel rounded-2xl px-4 py-3 text-center">
        {transcript && (
          <p className="text-white/90 text-sm font-medium mb-1">
            "{transcript}"
          </p>
        )}
        {result && (
          <p className={`text-xs ${result.type === 'unknown' ? 'text-white/50' : 'text-symphony-400'}`}>
            {result.message}
          </p>
        )}
      </div>
    </motion.div>
  );
});

function VoiceComposerComponent({
  onCommand,
  onActiveMarketChange,
  onListeningChange,
}: VoiceComposerProps) {
  const [isContinuous, setIsContinuous] = useState(false);
  const [commandResult, setCommandResult] = useState<VoiceCommandResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const processingRef = useRef(false);

  // ALWAYS call the hook unconditionally (Rules of Hooks)
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Notify parent of listening state changes (memoized)
  const listeningChangeRef = useRef(onListeningChange);
  listeningChangeRef.current = onListeningChange;

  useEffect(() => {
    listeningChangeRef.current?.(listening);
  }, [listening]);

  // Process transcript when it changes (optimized with refs)
  const commandCallbackRef = useRef(onCommand);
  const marketCallbackRef = useRef(onActiveMarketChange);
  commandCallbackRef.current = onCommand;
  marketCallbackRef.current = onActiveMarketChange;

  useEffect(() => {
    if (!transcript || processingRef.current) return;

    const timeoutId = setTimeout(() => {
      processingRef.current = true;
      const result = parseVoiceCommand(transcript);
      setCommandResult(result);
      commandCallbackRef.current?.(result);

      if (result.targetOrb) {
        marketCallbackRef.current?.(result.targetOrb);
        setTimeout(() => marketCallbackRef.current?.(null), 2000);
      }

      // Clear after showing result
      setTimeout(() => {
        setCommandResult(null);
        resetTranscript();
        processingRef.current = false;
      }, 3000);
    }, 800);

    return () => {
      clearTimeout(timeoutId);
      processingRef.current = false;
    };
  }, [transcript, resetTranscript]);

  // Start listening
  const startListening = useCallback(async () => {
    triggerHaptic(50);
    setShowSuggestions(false);

    try {
      await SpeechRecognitionLib.startListening({
        continuous: isContinuous,
      });
    } catch (err) {
      console.error('Failed to start listening:', err);
    }
  }, [isContinuous]);

  // Stop listening
  const stopListening = useCallback(() => {
    triggerHaptic(30);
    SpeechRecognitionLib.stopListening();
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  // Toggle continuous mode
  const toggleContinuous = useCallback(() => {
    setIsContinuous(prev => !prev);
    triggerHaptic(25);
  }, []);

  // Browser doesn't support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <p className="text-white/40 text-xs mt-2">Voice not supported</p>
      </div>
    );
  }

  // Memoize animation variants
  const glowAnimation = useMemo(() => ({
    scale: listening ? [1, 1.2, 1] : 1,
    opacity: listening ? [0.6, 0.2, 0.6] : 0,
  }), [listening]);

  const ringAnimation = useMemo(() => ({
    borderColor: listening ? ['#8B5CF6', '#A78BFA', '#8B5CF6'] : 'rgba(139, 92, 246, 0.2)',
    scale: listening ? [1, 1.1, 1] : 1,
  }), [listening]);

  const buttonAnimation = useMemo(() => ({
    scale: listening ? [0.95, 1.05, 0.95] : 1,
  }), [listening]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Continuous mode toggle */}
      <motion.button
        onClick={toggleContinuous}
        className={`absolute -top-12 text-xs px-3 py-1 rounded-full transition-colors ${
          isContinuous
            ? 'bg-symphony-500/30 text-symphony-300'
            : 'bg-white/5 text-white/40 hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isContinuous ? '🔄 Continuous' : '🎯 Single'}
      </motion.button>

      {/* Main mic button */}
      <div className="relative">
        {/* Breathing glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={glowAnimation}
          transition={{
            duration: 1.5,
            repeat: listening ? Infinity : 0,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)',
          }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border-2"
          animate={ringAnimation}
          transition={{
            duration: 2,
            repeat: listening ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Mic button */}
        <motion.button
          onClick={toggleListening}
          onMouseEnter={() => !listening && setShowSuggestions(true)}
          onMouseLeave={() => setShowSuggestions(false)}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            listening
              ? 'bg-gradient-to-br from-symphony-400 to-symphony-600'
              : 'bg-gradient-to-br from-symphony-500/30 to-symphony-700/30 hover:from-symphony-500/50 hover:to-symphony-700/50'
          }`}
          animate={buttonAnimation}
          transition={{
            duration: 1,
            repeat: listening ? Infinity : 0,
            ease: 'easeInOut',
          }}
          whileHover={listening ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={listening ? 'Stop listening' : 'Start voice command'}
        >
          {/* Mic icon */}
          <motion.svg
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{
              scale: listening ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: listening ? Infinity : 0,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </motion.svg>

          {/* Listening indicator */}
          {listening && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Voice wave animation */}
        <VoiceWave isActive={listening} />
      </div>

      {/* Status text */}
      <motion.p
        className="mt-12 text-sm font-medium"
        animate={{
          color: listening ? '#A78BFA' : 'rgba(255, 255, 255, 0.5)',
        }}
      >
        {listening ? '🎤 Listening...' : 'Tap to speak'}
      </motion.p>

      {/* Transcript bubble */}
      <AnimatePresence mode="wait">
        {(transcript || commandResult) && (
          <TranscriptBubble transcript={transcript} result={commandResult} />
        )}
      </AnimatePresence>

      {/* Suggestions tooltip */}
      <AnimatePresence>
        {showSuggestions && !listening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-64"
          >
            <div className="glass-panel rounded-xl p-3">
              <p className="text-white/40 text-xs mb-2">Try saying:</p>
              <div className="flex flex-wrap gap-1">
                {voiceCommandSuggestions.slice(0, 3).map((suggestion) => (
                  <span
                    key={suggestion}
                    className="text-xs px-2 py-1 rounded-full bg-symphony-500/20 text-symphony-300"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const VoiceComposer = memo(VoiceComposerComponent);
VoiceComposer.displayName = 'VoiceComposer';
