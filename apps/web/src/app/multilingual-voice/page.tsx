'use client';

// =============================================================================
// MULTILINGUAL VOICE DEMO - DAY 12
// =============================================================================
// Test page for multilingual voice input and i18n system
// =============================================================================

import { useState } from 'react';
import { MultilingualVoice } from '@/components/multilingual-voice';
// import { useTranslations, useLocale } from '@/components/i18n-provider';
import type { Locale } from '@/lib/i18n';

export default function MultilingualVoicePage() {
  // Temporarily disabled i18n
  // const t = useTranslations();
  // const { locale } = useLocale();
  const t = (key: string) => key;
  const locale = 'en' as Locale;
  const [transcript, setTranscript] = useState<string>('');
  const [detectedLang, setDetectedLang] = useState<Locale | null>(null);
  const [history, setHistory] = useState<Array<{ text: string; lang: Locale; time: Date }>>([]);

  const handleTranscript = (text: string, detected: Locale) => {
    setTranscript(text);
    setDetectedLang(detected);

    // Add to history
    setHistory(prev => [
      { text, lang: detected, time: new Date() },
      ...prev.slice(0, 9), // Keep last 10
    ]);
  };

  const handleError = (error: string) => {
    console.error('Voice error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {locale === 'en' ? 'Multilingual Voice Input' : 'बहुभाषी वॉइस इनपुट'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Speak in English, Hindi, or Hinglish. The system will detect your language and process your input.'
              : 'अंग्रेज़ी, हिन्दी, या हिंग्लिश में बोलें। सिस्टम आपकी भाषा पहचान लेगा और इनपुट प्रोसेस करेगा।'}
          </p>
        </div>

        {/* Voice Input Component */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
          <MultilingualVoice
            onTranscript={handleTranscript}
            onError={handleError}
            autoDetectLanguage={true}
          />
        </div>

        {/* Current Transcript */}
        {transcript && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {t.common.loading.replace('...', '')}
              </h2>
              {detectedLang && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                  {detectedLang === 'en' ? 'English' : 'हिन्दी'}
                </span>
              )}
            </div>
            <p className="text-lg text-neutral-900 dark:text-neutral-100">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {locale === 'en' ? 'Recent Transcripts' : 'हालिया ट्रांसक्रिप्ट'}
              </h2>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {t.common.clear}
              </button>
            </div>

            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{item.lang === 'en' ? 'English' : 'हिन्दी'}</span>
                    <span>{item.time.toLocaleTimeString(locale)}</span>
                  </div>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {locale === 'en' ? 'Supported Languages' : 'समर्थित भाषाएं'}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                English (US, UK, IN, AU)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                हिन्दी (Hindi)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {locale === 'en' ? 'Hinglish (Best effort)' : 'हिंग्लिश (सर्वोत्तम प्रयास)'}
              </li>
            </ul>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {locale === 'en' ? 'Example Phrases' : 'उदाहरण वाक्यांश'}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>&quot;Show India fullstack jobs&quot;</li>
              <li>&quot;India fullstack naukri dikhao&quot;</li>
              <li>&quot;Bangalore React jobs dikhaye&quot;</li>
            </ul>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {locale === 'en' ? 'How It Works' : 'यह कैसे काम करता है'}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {locale === 'en'
              ? 'This feature uses the browser\'s native Speech Recognition API. No data is sent to external servers. Language detection uses Unicode character ranges (Devanagari for Hindi). Accuracy depends on your browser, microphone, and speaking clarity.'
              : 'यह सुविधा ब्राउज़र के नेटिव स्पीच रिकग्निशन API का उपयोग करती है। कोई डेटा बाहरी सर्वर पर नहीं भेजा जाता है। भाषा पहचान यूनिकोड कैरेक्टर रेंज का उपयोग करती है (हिन्दी के लिए देवनागरी)। सटीकता आपके ब्राउज़र, माइक्रोफोन और बोलने की स्पष्टता पर निर्भर करती है।'}
          </p>
        </div>
      </div>
    </div>
  );
}
