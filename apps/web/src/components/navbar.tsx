'use client';

import { useState, useCallback, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';
import { getUnreadCount } from '@/lib/notification-engine';
// import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

// =============================================================================
// NAVBAR - "Calm Authority / Invisible Power"
// =============================================================================
// Clean, minimal navigation
// No flashy animations, no visual noise
// =============================================================================

type Market = 'all' | 'india' | 'us' | 'germany';

interface MarketOption {
  id: Market;
  name: string;
  color: string;
}

const markets: MarketOption[] = [
  { id: 'all', name: 'All', color: '#3b82f6' },
  { id: 'india', name: 'India', color: '#d97706' },
  { id: 'us', name: 'US', color: '#3b82f6' },
  { id: 'germany', name: 'Germany', color: '#6b7280' },
];

export function Navbar() {
  const [selectedMarket, setSelectedMarket] = useState<Market>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  // const { data: session } = useSession(); // TODO: Enable after OAuth setup
  const session = null; // Temporarily disabled until OAuth is configured
  const locale = 'en';
  const setLocale = (_: string) => {};

  useEffect(() => {
    setMounted(true);

    // Update unread count on mount and when storage changes
    const updateCount = () => setUnreadCount(getUnreadCount());
    updateCount();

    window.addEventListener('storage', updateCount);
    // Also listen for custom event when notifications change
    window.addEventListener('notificationsChanged', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('notificationsChanged', updateCount);
    };
  }, []);

  const handleMarketSelect = useCallback((market: Market) => {
    setSelectedMarket(market);
    setIsMobileMenuOpen(false);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLocale: Locale = locale === 'en' ? 'hi' : 'en';
    setLocale(newLocale);
  }, [locale, setLocale]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-800/50 bg-black/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">U</span>
            </div>
            <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100 hidden sm:block">
              Udaash
            </span>
          </a>

          {/* Desktop - Market tabs */}
          <div className="hidden md:flex items-center gap-1">            <Link href="/kanban" className="px-3 py-1.5 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Kanban
            </Link>
            <Link href="/analytics" className="px-3 py-1.5 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Analytics
            </Link>
            <Link href="/network" className="px-3 py-1.5 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Network
            </Link>            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => handleMarketSelect(market.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedMarket === market.id
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: market.color }}
                />
                <span>{market.name}</span>
              </button>
            ))}
          </div>

          {/* Desktop - Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle variant="icon-only" />

            <Link
              href="/notifications"
              className="btn btn-ghost btn-icon relative"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="btn btn-ghost text-sm">
                  {session.user.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn btn-secondary text-sm"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="btn btn-secondary text-sm">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn btn-ghost btn-icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="space-y-1">
              {/* Navigation Links */}
              <Link
                href="/kanban"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Kanban</span>
              </Link>
              <Link
                href="/analytics"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Analytics</span>
              </Link>
              <Link
                href="/network"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Network</span>
              </Link>

              {/* Market Filters */}
              {markets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => handleMarketSelect(market.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors ${
                    selectedMarket === market.id
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: market.color }}
                  />
                  <span>{market.name}</span>
                  {selectedMarket === market.id && (
                    <svg className="w-4 h-4 ml-auto text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              {/* Language Toggle */}
              {mounted && (
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{LOCALE_NAMES[locale].native}</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              )}

              <div className="flex items-center gap-2">
                <ThemeToggle variant="compact" showLabel={false} />
                <button className="btn btn-secondary flex-1 text-sm">
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
