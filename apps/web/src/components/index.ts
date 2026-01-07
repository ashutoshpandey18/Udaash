// =============================================================================
// COMPONENT EXPORTS - UDAASH
// =============================================================================
// "Calm Authority / Invisible Power"
// Clean, minimal component architecture
// =============================================================================

// Main content
export { HeroContent } from './hero-content';
export { Navbar } from './navbar';
export { VoiceComposer } from './voice-composer-new';

// Kanban workflow (Day 3)
export { KanbanBoard } from './kanban-board';
export { KanbanColumn } from './kanban-column';
export { JobCard } from './job-card';

// Job intelligence (Day 4)
export { JobIntelligenceModal } from './job-intelligence-modal';
export { AIInsightsPanel } from './ai-insights-panel';
export { ScreenshotParser } from './screenshot-parser';

// AI matching & prioritization (Day 5)
export { AIMatchEngine, useJobMatch, useBatchMatch } from './ai-match-engine';
export type { MatchedJob } from './ai-match-engine';
export { MatchScoreIndicator, MatchScoreBar } from './match-score-indicator';
export { SkillGapAnalyzer, SkillBadge, SkillComparison } from './skill-gap-analyzer';

// PWA & Mobile (Day 6)
export { PWAInstallPrompt } from './pwa-install-prompt';
export { OfflineIndicator, OfflineBadge } from './offline-indicator';

// Theme System (Day 7)
export { ThemeProvider, useTheme, useResolvedTheme, useIsDarkMode, withTheme } from './theme-provider';
export { ThemeToggle } from './theme-toggle';

// Analytics & AI Insights (Day 8)
export { AnalyticsAIPanel } from './analytics-ai-panel';
export { TrendSummary } from './trend-summary';
export { VoiceAnalytics } from './voice-analytics';
export type { AnalyticsData, AnalyticsSummary, AIInsight } from '../lib/openrouter-analytics';

// Social Sharing & Referrals (Day 9)
export { ShareModal } from './share-modal';
export { QRCode, CompactQRCode } from './qr-code';
export { ReferralPanel, CompactReferralWidget } from './referral-panel';

// Notifications & Alerts (Day 10)
export { NotificationCenter } from './notification-center';
export { NotificationSettings } from './notification-settings';
export { PushManager } from './push-manager';

// Interaction System (Day 11)
export { InteractionProvider, useInteraction, useMotion } from './interaction-provider';
export { InteractiveCard } from './interactive-card';

// Internationalization & Multilingual Voice (Day 12)
export { I18nProvider, useI18n, useTranslations, useLocale } from './i18n-provider';
export { MultilingualVoice } from './multilingual-voice';

// Founder Network & Collaboration (Day 13)
export { FounderList } from './founder-list';
export { CollabBoardView } from './collab-board';
export { MentorDiscovery } from './mentor-discovery';
export { NetworkSettingsPanel } from './network-settings';

// Performance & Optimization (Day 14)
export { LazyFeature, LazyVoiceFeature, LazyAIFeature, Lazy3DFeature, LazyAnalyticsFeature } from './lazy-feature';
export { PerformanceIndicator, ComponentPerf, PageLoadPerf } from './performance-indicator';
