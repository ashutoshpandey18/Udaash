// =============================================================================
// NOTIFICATION TYPES - DAY 10 (CALM AUTHORITY)
// =============================================================================
// Clear, structured notification data
// No unnecessary complexity
// =============================================================================

export type NotificationType =
  | 'job_match'
  | 'application_reply'
  | 'interview_scheduled'
  | 'referral_accepted'
  | 'digest'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface UserNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  archived: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationRule {
  id: string;
  enabled: boolean;
  type: NotificationType;
  markets?: string[];
  matchThreshold?: number;
  pushEnabled: boolean;
  inboxEnabled: boolean;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  digestEnabled: boolean;
  digestFrequency: 'daily' | 'weekly' | 'never';
  digestTime?: string; // HH:mm format
  rules: NotificationRule[];
  doNotDisturb: {
    enabled: boolean;
    start?: string; // HH:mm
    end?: string; // HH:mm
  };
}

export interface DigestNotification {
  id: string;
  period: 'daily' | 'weekly';
  jobMatches: number;
  newReplies: number;
  interviews: number;
  generatedAt: string;
}
