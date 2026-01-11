'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Job } from '@/types/kanban';
import { JobIntelligence, OCRResult } from '@/types/job';
import { analyzeJob, generateApplicationDraft, generateVoiceBriefing } from '@/lib/job-ai';
import { AIInsightsPanel } from './ai-insights-panel';
import { ScreenshotParser } from './screenshot-parser';
import { SkillMatchSummary } from './skill-match-summary';
import { useJobMatch } from './ai-match-engine';

interface JobIntelligenceModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export function JobIntelligenceModal({
  job,
  isOpen,
  onClose,
}: JobIntelligenceModalProps) {
  const [intelligence, setIntelligence] = useState<JobIntelligence | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'screenshot' | 'draft' | 'match'>('match');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const aiMatch = useJobMatch(job);
  const [draft, setDraft] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Analyze job on mount
  useEffect(() => {
    if (isOpen && !intelligence) {
      const result = analyzeJob(job);
      setIntelligence(result);
    }
  }, [isOpen, job, intelligence]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
    return undefined;
  }, [isOpen, onClose]);

  // Handle swipe down to close (mobile)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) setTouchStart(touch.clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const touch = e.touches[0];
      if (!touch) return;
      const touchEnd = touch.clientY;
      const diff = touchEnd - touchStart;

      // Swipe down more than 100px to close
      if (diff > 100) {
        onClose();
        setTouchStart(null);
      }
    },
    [touchStart, onClose]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleGenerateDraft = useCallback(async () => {
    setIsGeneratingDraft(true);
    try {
      const result = await generateApplicationDraft(job);
      setDraft(result.coverLetter);
    } catch (error) {
      console.error('Failed to generate draft:', error);
    } finally {
      setIsGeneratingDraft(false);
    }
  }, [job]);

  const handleVoiceBriefing = useCallback(() => {
    if (!intelligence) return;
    const briefing = generateVoiceBriefing(intelligence);

    // Use Web Speech API if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(briefing);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(briefing);
    }
  }, [intelligence]);

  const handleScreenshotParsed = useCallback((result: OCRResult) => {
    console.log('Screenshot parsed:', result);
    // In production, update intelligence with parsed data
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 transition-opacity duration-100"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-4xl bg-white shadow-xl transition-transform duration-100 rounded-lg sm:rounded-xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Mobile swipe indicator */}
        <div className="sm:hidden flex justify-center py-2 border-b border-gray-200">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs - Equal width layout */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex-1 px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'match'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Match</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'analysis'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Analysis</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('screenshot')}
            className={`flex-1 px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'screenshot'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Scan</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex-1 px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'draft'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden sm:inline">Draft</span>
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {activeTab === 'match' && aiMatch && (
            <div className="space-y-4 sm:space-y-6">
              {/* Overall Match Score */}
              <div className="text-center py-4 sm:py-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full text-2xl sm:text-3xl font-bold ${
                  aiMatch.overall >= 80
                    ? 'bg-green-100 text-green-700'
                    : aiMatch.overall >= 60
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {aiMatch.overall}%
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                  AI Match Score (Confidence: {aiMatch.confidence}%)
                </p>
              </div>

              {/* Explanations */}
              {aiMatch.explanations.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Why This Score?</h3>
                  <div className="space-y-2">
                    {aiMatch.explanations.map((exp, index) => (
                      <div
                        key={index}
                        className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <span className="text-blue-600 mt-0.5">•</span>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-900">{exp.text}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Weight: {Math.round(exp.weight * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Match Summary */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Skill Breakdown</h3>
                <SkillMatchSummary skills={aiMatch.skillMatch} />
              </div>

              {/* Strengths */}
              {aiMatch.strengths.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Your Strengths</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {aiMatch.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm rounded-full border border-green-200"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {aiMatch.gaps.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Areas to Develop</h3>
                  <div className="space-y-2">
                    {aiMatch.gaps.map((gap, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200"
                      >
                        <span className="text-orange-600">⚠</span>
                        <span className="text-xs sm:text-sm text-gray-900 capitalize">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  This score is generated using keyword matching and profile analysis.
                  It's a guidance tool to help prioritize opportunities, not a guarantee of fit or success.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && intelligence && (
            <div className="space-y-4 sm:space-y-6">
              <AIInsightsPanel
                matchScore={intelligence.matchScore}
                insights={intelligence.insights}
                recommendations={intelligence.recommendations}
              />

              <button
                onClick={handleVoiceBriefing}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Voice Briefing
                </span>
              </button>
            </div>
          )}

          {activeTab === 'screenshot' && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Upload a job posting screenshot to extract details and analyze fit.
              </p>
              <ScreenshotParser onParsed={handleScreenshotParsed} />
            </div>
          )}

          {activeTab === 'draft' && (
            <div className="space-y-3 sm:space-y-4">
              {!draft ? (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Generate an application draft tailored to this position. This is a starting point - review and customize before sending.
                  </p>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={isGeneratingDraft}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGeneratingDraft ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      'Generate Application Draft'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-900 whitespace-pre-wrap">{draft}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(draft)}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={() => setDraft(null)}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Intelligence is a guidance tool, not a guarantee
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
