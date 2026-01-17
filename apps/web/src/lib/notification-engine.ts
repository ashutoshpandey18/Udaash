// =============================================================================
// NOTIFICATION ENGINE - DAY 10 (CALM AUTHORITY)
// =============================================================================
// Simple, predictable notification logic
// User-controlled rules
// No background abuse
// =============================================================================

import {
  UserNotification,
  NotificationRule,
  NotificationPreferences,
  NotificationType,
  DigestNotification
} from '@/types/notification';

// =============================================================================
// STORAGE KEYS
// =============================================================================
const STORAGE_KEY_NOTIFICATIONS = 'udaash_notifications';
const STORAGE_KEY_PREFERENCES = 'udaash_notification_preferences';

// =============================================================================
// DEFAULT PREFERENCES
// =============================================================================
export const DEFAULT_PREFERENCES: NotificationPreferences = {
  pushEnabled: false,
  digestEnabled: false,
  digestFrequency: 'never',
  rules: [
    {
      id: 'job_match',
      enabled: true,
      type: 'job_match',
      matchThreshold: 70,
      pushEnabled: false,
      inboxEnabled: true,
    },
    {
      id: 'application_reply',
      enabled: true,
      type: 'application_reply',
      pushEnabled: false,
      inboxEnabled: true,
    },
    {
      id: 'interview_scheduled',
      enabled: true,
      type: 'interview_scheduled',
      pushEnabled: false,
      inboxEnabled: true,
    },
  ],
  doNotDisturb: {
    enabled: false,
  },
};

// =============================================================================
// NOTIFICATION STORAGE
// =============================================================================

export function getNotifications(): UserNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveNotifications(notifications: UserNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

export function getPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFERENCES);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

// =============================================================================
// NOTIFICATION CREATION
// =============================================================================

export function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, any>
): UserNotification {
  const notification: UserNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    priority: type === 'interview_scheduled' ? 'high' : 'normal',
    read: false,
    archived: false,
    createdAt: new Date().toISOString(),
  };

  if (metadata) {
    notification.metadata = metadata;
  }

  return notification;
}

export function addNotification(notification: UserNotification): void {
  const notifications = getNotifications();
  const preferences = getPreferences();

  // Check if notification type is enabled
  const rule = preferences.rules.find((r) => r.type === notification.type);
  if (!rule?.enabled || !rule.inboxEnabled) {
    return;
  }

  // Check Do Not Disturb
  if (isDoNotDisturbActive(preferences)) {
    // Store for later or skip based on priority
    if (notification.priority !== 'high') {
      return;
    }
  }

  notifications.unshift(notification);

  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications.splice(100);
  }

  saveNotifications(notifications);

  // Trigger push if enabled
  if (rule.pushEnabled && preferences.pushEnabled) {
    sendWebPush(notification);
  }
}

// =============================================================================
// NOTIFICATION ACTIONS
// =============================================================================

export function markAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
  }
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach((n) => (n.read = true));
  saveNotifications(notifications);
}

export function archiveNotification(notificationId: string): void {
  const notifications = getNotifications();
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification) {
    notification.archived = true;
    saveNotifications(notifications);
  }
}

export function clearAllNotifications(): void {
  saveNotifications([]);
}

export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter((n) => !n.read && !n.archived).length;
}

// =============================================================================
// DO NOT DISTURB
// =============================================================================

function isDoNotDisturbActive(preferences: NotificationPreferences): boolean {
  if (!preferences.doNotDisturb.enabled) return false;

  const { start, end } = preferences.doNotDisturb;
  if (!start || !end) return false;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Simple time comparison (doesn't handle cross-midnight ranges)
  return currentTime >= start && currentTime <= end;
}

// =============================================================================
// WEB PUSH
// =============================================================================

export async function sendWebPush(notification: UserNotification): Promise<void> {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(notification.title, {
      body: notification.message,
      icon: '/notification-icon.png',
      badge: '/notification-icon.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'high',
      silent: true,
      data: {
        url: notification.link || '/',
      },
    });
  } catch (error) {
    console.error('Failed to send push:', error);
  }
}

export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request permission:', error);
    return false;
  }
}

// =============================================================================
// DIGEST GENERATION
// =============================================================================

export function generateDigest(): DigestNotification {
  // In production, this would query real data
  const notifications = getNotifications();
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentNotifications = notifications.filter(
    (n) => new Date(n.createdAt) > oneDayAgo
  );

  return {
    id: `digest_${Date.now()}`,
    period: 'daily',
    jobMatches: recentNotifications.filter((n) => n.type === 'job_match').length,
    newReplies: recentNotifications.filter((n) => n.type === 'application_reply').length,
    interviews: recentNotifications.filter((n) => n.type === 'interview_scheduled').length,
    generatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// VOICE SUPPORT
// =============================================================================

export function getNotificationSummary(): string {
  const notifications = getNotifications();
  const unread = notifications.filter((n) => !n.read && !n.archived);

  if (unread.length === 0) {
    return 'You have no new notifications.';
  }

  const byType = unread.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const parts: string[] = [];

  if (byType.job_match) {
    parts.push(`${byType.job_match} new job ${byType.job_match === 1 ? 'match' : 'matches'}`);
  }
  if (byType.application_reply) {
    parts.push(`${byType.application_reply} application ${byType.application_reply === 1 ? 'reply' : 'replies'}`);
  }
  if (byType.interview_scheduled) {
    parts.push(`${byType.interview_scheduled} ${byType.interview_scheduled === 1 ? 'interview' : 'interviews'} scheduled`);
  }

  return `You have ${unread.length} new notifications: ${parts.join(', ')}.`;
}
