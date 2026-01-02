import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PhysicsProvider } from '@/components/physics-provider';
import { Navbar } from '@/components/navbar';
import type { ReactNode } from 'react';

// =============================================================================
// ROOT LAYOUT - PROVIDER ARCHITECTURE
// =============================================================================
// Provider hierarchy designed for clean backend integration:
//
// <html>
//   <body>
//     <Providers>              ← FUTURE: Wrap with auth/data providers here
//       <PhysicsProvider>      ← UI animation config (isolated from data)
//         <Navbar />           ← Can receive user/auth data via props
//         <main>{children}</main>
//       </PhysicsProvider>
//     </Providers>
//   </body>
// </html>
//
// BACKEND INTEGRATION NOTES:
// 1. Add auth provider OUTSIDE PhysicsProvider (e.g., SessionProvider)
// 2. Add data providers OUTSIDE PhysicsProvider (e.g., QueryClientProvider)
// 3. PhysicsProvider only handles UI animation state
// 4. Three.js canvas is isolated at page level, unaffected by providers here
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Udaash — The Global Market Symphony',
  description: 'Where markets dance in orbital harmony. Real-time visualization of India, US, and German market intelligence.',
  keywords: ['markets', 'trading', 'india', 'us', 'germany', 'stocks', 'visualization'],
  authors: [{ name: 'Udaash Team' }],
  creator: 'Udaash',
  publisher: 'Udaash',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://udaash.vercel.app',
    siteName: 'Udaash',
    title: 'Udaash — The Global Market Symphony',
    description: 'Where markets dance in orbital harmony',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Udaash — The Global Market Symphony',
    description: 'Where markets dance in orbital harmony',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a0533',
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <PhysicsProvider>
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </PhysicsProvider>
      </body>
    </html>
  );
}
