import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { OfflineIndicator } from '@/components/offline-indicator';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { ThemeProvider } from '@/components/theme-provider';
import { getThemeInitScript } from '@/lib/theme';
import type { ReactNode } from 'react';

// =============================================================================
// ROOT LAYOUT - UDAASH (DAY 14: PERFORMANCE OPTIMIZED)
// =============================================================================
// "Calm Authority / Invisible Power"
// Clean, minimal layout with performance optimizations
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'UDAASH — AI Job Matching',
  description: 'Intelligent job matching and prioritization. Track applications, analyze opportunities, and focus on what matters.',
  keywords: ['jobs', 'ai matching', 'kanban', 'job search', 'career'],
  authors: [{ name: 'UDAASH Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'UDAASH',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Theme initialization (prevent FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(),
          }}
        />
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(err => {
                    console.error('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-black text-neutral-100" suppressHydrationWarning>
        <ThemeProvider>
            {/* Offline status */}
            <OfflineIndicator />

            {/* Navigation */}
            <Navbar />

            {/* Main content */}
            <main>
              {children}
            </main>

            {/* PWA install prompt */}
            <PWAInstallPrompt />
          </ThemeProvider>
      </body>
    </html>
  );
}
