// =============================================================================
// SOCIAL SHARING UTILITIES - DAY 9
// =============================================================================
// Share link generators and OG metadata helpers
// User-initiated only, no auto-posting or dark patterns
// =============================================================================

import type { Job } from './mock-jobs';

// =============================================================================
// TYPES
// =============================================================================

export interface ShareData {
  url: string;
  title: string;
  text: string;
}

export interface OGMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article';
}

export interface ReferralData {
  code: string;
  uses: number;
  maxUses?: number;
  createdAt: Date;
}

// =============================================================================
// SHARE URL BUILDERS
// =============================================================================

/**
 * Generate shareable job URL
 */
export function getJobShareUrl(jobId: string, baseUrl: string = ''): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/share/job/${jobId}`;
}

/**
 * Generate referral URL with code
 */
export function getReferralUrl(code: string, baseUrl: string = ''): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}?ref=${code}`;
}

// =============================================================================
// PLATFORM-SPECIFIC SHARE LINKS
// =============================================================================

/**
 * LinkedIn share link
 * Professional tone, no emoji spam
 */
export function getLinkedInShareUrl(data: ShareData): string {
  const params = new URLSearchParams({
    url: data.url,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * WhatsApp share link
 * Natural message format
 */
export function getWhatsAppShareUrl(data: ShareData): string {
  const message = `${data.title}\n\n${data.text}\n\n${data.url}`;
  const params = new URLSearchParams({
    text: message,
  });
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Email share link
 * Professional email format
 */
export function getEmailShareUrl(data: ShareData): string {
  const params = new URLSearchParams({
    subject: data.title,
    body: `${data.text}\n\n${data.url}`,
  });
  return `mailto:?${params.toString()}`;
}

/**
 * Twitter/X share link
 * Concise format
 */
export function getTwitterShareUrl(data: ShareData): string {
  const text = `${data.title}\n\n${data.url}`;
  const params = new URLSearchParams({
    text,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// =============================================================================
// SHARE DATA FORMATTERS
// =============================================================================

/**
 * Generate share data for a job
 * Professional, no spam language
 */
export function getJobShareData(job: Job, baseUrl: string = ''): ShareData {
  const url = getJobShareUrl(job.id, baseUrl);

  const title = `${job.title} at ${job.company}`;

  let text = `Check out this opportunity: ${job.title} at ${job.company}`;

  if (job.location) {
    text += ` • ${job.location}`;
  }

  if (job.workMode === 'remote') {
    text += ' • Remote';
  }

  return {
    url,
    title,
    text,
  };
}

/**
 * Generate share data for referral
 * Conservative, no aggressive incentives
 */
export function getReferralShareData(code: string, baseUrl: string = ''): ShareData {
  const url = getReferralUrl(code, baseUrl);

  return {
    url,
    title: 'Try UDAASH for your job search',
    text: 'I have been using UDAASH to organize my job search. Thought you might find it useful.',
  };
}

// =============================================================================
// OG METADATA GENERATORS
// =============================================================================

/**
 * Generate OG metadata for job share page
 * Neutral and professional, no fake engagement
 */
export function getJobOGMetadata(job: Job, baseUrl: string = ''): OGMetadata {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const title = `${job.title} at ${job.company} | UDAASH`;

  let description = job.description || `${job.title} opportunity at ${job.company}`;

  // Trim to reasonable length for OG
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  // Add location context if available
  if (job.location) {
    description += ` • ${job.location}`;
  }

  if (job.workMode === 'remote') {
    description += ' • Remote';
  }

  return {
    title,
    description,
    image: `${base}/og-job.png`, // Static template image
    url: getJobShareUrl(job.id, baseUrl),
    type: 'article',
  };
}

/**
 * Generate OG metadata for referral page
 */
export function getReferralOGMetadata(baseUrl: string = ''): OGMetadata {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: 'UDAASH - Organize Your Job Search',
    description: 'AI-powered job search organization with voice commands, analytics, and smart matching.',
    image: `${base}/og-job.png`,
    url: base,
    type: 'website',
  };
}

// =============================================================================
// WEB SHARE API HELPERS
// =============================================================================

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share using native Web Share API
 * Falls back to custom modal if not supported
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (err) {
    // User cancelled or error occurred
    console.error('Native share failed:', err);
    return false;
  }
}

// =============================================================================
// CLIPBOARD HELPERS
// =============================================================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return fallbackCopyToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard copy using textarea
 */
function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    document.body.removeChild(textarea);
    return false;
  }
}

// =============================================================================
// REFERRAL CODE HELPERS
// =============================================================================

/**
 * Generate simple referral code
 * Format: UDAASH-XXXXX
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
  let code = 'UDAASH-';

  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  return /^UDAASH-[A-Z0-9]{5}$/.test(code);
}

/**
 * Extract referral code from URL
 */
export function extractReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const ref = urlObj.searchParams.get('ref');

    if (ref && isValidReferralCode(ref)) {
      return ref;
    }

    return null;
  } catch {
    return null;
  }
}

// =============================================================================
// ANALYTICS TRACKING (CONSERVATIVE)
// =============================================================================

export interface ShareEvent {
  jobId?: string;
  platform: 'linkedin' | 'whatsapp' | 'email' | 'twitter' | 'copy' | 'qr' | 'native';
  timestamp: Date;
}

export interface ReferralEvent {
  code: string;
  action: 'generated' | 'clicked' | 'converted';
  timestamp: Date;
}

/**
 * Track share event (client-side only for demo)
 * In production, send to analytics backend
 */
export function trackShareEvent(event: ShareEvent): void {
  // Log for demo
  console.log('Share event:', event);

  // In production:
  // await fetch('/api/analytics/share', {
  //   method: 'POST',
  //   body: JSON.stringify(event),
  // });
}

/**
 * Track referral event
 */
export function trackReferralEvent(event: ReferralEvent): void {
  // Log for demo
  console.log('Referral event:', event);

  // In production:
  // await fetch('/api/analytics/referral', {
  //   method: 'POST',
  //   body: JSON.stringify(event),
  // });
}
