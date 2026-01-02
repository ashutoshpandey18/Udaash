'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhysics } from './physics-provider';

type Market = 'all' | 'india' | 'us' | 'germany';

interface MarketOption {
  id: Market;
  name: string;
  flag: string;
  color: string;
}

const markets: MarketOption[] = [
  { id: 'all', name: 'All Markets', flag: '🌐', color: '#a855f7' },
  { id: 'india', name: 'India', flag: '🇮🇳', color: '#FF9933' },
  { id: 'us', name: 'United States', flag: '🇺🇸', color: '#3C3B6E' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', color: '#FFCC00' },
];

export function Navbar() {
  const [selectedMarket, setSelectedMarket] = useState<Market>('all');
  const [isOpen, setIsOpen] = useState(false);
  const { springConfig } = usePhysics();

  const handleMarketSelect = useCallback((market: Market) => {
    setSelectedMarket(market);
    setIsOpen(false);
  }, []);

  const currentMarket = markets.find((m) => m.id === selectedMarket) ?? markets[0];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ...springConfig }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between glass-panel rounded-2xl px-4 sm:px-6 py-3">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-symphony-400 to-symphony-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-semibold symphony-gradient-text hidden sm:block">
              Udaash
            </span>
          </motion.a>

          {/* Center - Market Status */}
          <div className="hidden md:flex items-center gap-6">
            {markets.slice(1).map((market) => (
              <motion.button
                key={market.id}
                onClick={() => handleMarketSelect(market.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  selectedMarket === market.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{market.flag}</span>
                <span className="text-sm text-white/70">{market.name}</span>
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: market.color }}
                />
              </motion.button>
            ))}
          </div>

          {/* Right - Market Selector (Mobile) */}
          <div className="relative md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{currentMarket?.flag}</span>
              <span className="text-sm text-white/80">{currentMarket?.name}</span>
              <motion.svg
                className="w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 glass-panel rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {markets.map((market) => (
                    <motion.button
                      key={market.id}
                      onClick={() => handleMarketSelect(market.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedMarket === market.id
                          ? 'bg-symphony-500/20'
                          : 'hover:bg-white/5'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-lg">{market.flag}</span>
                      <span className="text-sm text-white/80">{market.name}</span>
                      {selectedMarket === market.id && (
                        <motion.span
                          className="ml-auto w-2 h-2 rounded-full bg-symphony-400"
                          layoutId="market-indicator"
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </motion.button>

            <motion.button
              className="px-4 py-2 rounded-xl bg-symphony-500/20 hover:bg-symphony-500/30 text-symphony-300 text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
