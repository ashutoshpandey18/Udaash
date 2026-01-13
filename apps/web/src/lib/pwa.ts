/**
 * PWA Utilities - Day 6 UDAASH
 *
 * Production-grade PWA helpers.
 * Calm Authority: User-controlled, non-intrusive.
 */

/**
 * Check if app is running as PWA (standalone mode)
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if device supports PWA installation
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if beforeinstallprompt event is supported
  return 'BeforeInstallPromptEvent' in window || iOS();
}

/**
 * Detect iOS device
 */
export function iOS(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Detect Android device
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

/**
 * Get platform name
 */
export function getPlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  if (iOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (navigator.userAgent.includes('Windows') || navigator.userAgent.includes('Mac') || navigator.userAgent.includes('Linux')) {
    return 'desktop';
  }

  return 'unknown';
}

/**
 * Check if service worker is supported
 */
export function supportsServiceWorker(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!supportsServiceWorker()) {
    console.warn('[PWA] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('[PWA] Service worker registered:', registration.scope);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Check every hour

    return registration;
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker (for development)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!supportsServiceWorker()) return false;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
    }

    console.log('[PWA] Service worker unregistered');
    return true;
  } catch (error) {
    console.error('[PWA] Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Online/Offline status
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Listen to online/offline events
 */
export function onNetworkStatusChange(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Haptic feedback (restrained usage only)
 */
export function vibrate(pattern: number | number[] = 50): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return; // Silently fail on unsupported devices
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Ignore errors
  }
}

/**
 * Haptic presets
 */
export const hapticPresets = {
  // Successful action (drag drop complete, item saved)
  success: () => vibrate([30, 50, 30]),

  // Primary action confirmed (button press)
  confirm: () => vibrate(40),

  // Error or warning
  error: () => vibrate([50, 100, 50, 100, 50]),

  // Light tap (minimal, for subtle feedback)
  light: () => vibrate(20)
};

/**
 * Request notification permission (conservative approach)
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  // Don't request if already granted or denied
  if (Notification.permission !== 'default') {
    return Notification.permission;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('[PWA] Notification permission request failed:', error);
    return 'denied';
  }
}

/**
 * Show local notification (requires permission)
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('[PWA] Notification permission not granted');
    return;
  }

  try {
    // Use service worker notification if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icon-192.png',
        ...options
      });
    }
  } catch (error) {
    console.error('[PWA] Failed to show notification:', error);
  }
}

/**
 * Background sync (queue action for when online)
 */
export async function queueBackgroundSync(tag: string): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('[PWA] Background sync queued:', tag);
    } else {
      console.warn('[PWA] Background sync not supported');
    }
  } catch (error) {
    console.error('[PWA] Failed to queue background sync:', error);
  }
}

/**
 * Check if app needs update (new service worker available)
 */
export function onServiceWorkerUpdate(callback: () => void): () => void {
  if (!supportsServiceWorker()) return () => {};

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] New service worker activated');
    callback();
  });

  return () => {
    // Cleanup not strictly necessary for controllerchange
  };
}

/**
 * Force service worker update
 */
export async function updateServiceWorker(): Promise<void> {
  if (!supportsServiceWorker()) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      await registration.update();
      console.log('[PWA] Service worker update checked');
    }
  } catch (error) {
    console.error('[PWA] Failed to update service worker:', error);
  }
}

/**
 * Get install prompt event (stored globally)
 */
let deferredPrompt: any = null;

export function setInstallPromptEvent(event: any): void {
  deferredPrompt = event;
}

export function getInstallPromptEvent(): any {
  return deferredPrompt;
}

export function clearInstallPromptEvent(): void {
  deferredPrompt = null;
}

/**
 * Trigger install prompt (if available)
 */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return 'unavailable';
  }

  try {
    // Show prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;

    console.log('[PWA] Install prompt outcome:', outcome);

    // Clear prompt (can only be used once)
    clearInstallPromptEvent();

    return outcome === 'accepted' ? 'accepted' : 'dismissed';
  } catch (error) {
    console.error('[PWA] Install prompt failed:', error);
    return 'unavailable';
  }
}

/**
 * Storage utilities (IndexedDB wrapper for offline data)
 */
export const storage = {
  /**
   * Check if IndexedDB is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  },

  /**
   * Save data to localStorage (fallback)
   */
  set(key: string, value: any): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('[Storage] Failed to save:', error);
    }
  },

  /**
   * Get data from localStorage
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('[Storage] Failed to retrieve:', error);
      return null;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] Failed to remove:', error);
    }
  },

  /**
   * Clear all data
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage] Failed to clear:', error);
    }
  }
};

/**
 * Safe area utilities (iOS notch support)
 */
export const safeArea = {
  /**
   * Get safe area insets (CSS env variables)
   */
  getInsets(): {
    top: string;
    right: string;
    bottom: string;
    left: string;
  } {
    return {
      top: 'env(safe-area-inset-top, 0)',
      right: 'env(safe-area-inset-right, 0)',
      bottom: 'env(safe-area-inset-bottom, 0)',
      left: 'env(safe-area-inset-left, 0)'
    };
  },

  /**
   * Apply safe area padding to element
   */
  applyPadding(element: HTMLElement, sides: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'bottom']): void {
    if (!element) return;

    const insets = this.getInsets();

    sides.forEach(side => {
      element.style.setProperty(
        `padding-${side}`,
        `calc(var(--padding-${side}, 0) + ${insets[side]})`
      );
    });
  }
};
