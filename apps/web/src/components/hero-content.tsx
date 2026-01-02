'use client';

import { memo, useState, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePhysics } from '@/components/physics-provider';

// =============================================================================
// HERO CONTENT COMPONENT
// =============================================================================
// Extracted from page.tsx to create clear separation between:
// - Visual/decorative layer (Three.js canvas)
// - Interactive content layer (this component)
// - Future data layer (backend APIs)
//
// BACKEND INTEGRATION NOTES:
// - This component can safely receive props from data fetching
// - Re-renders here will NOT affect the canvas layer
// - Market data, user state, etc. can be passed as props
// =============================================================================

interface MarketIndicator {
  name: string;
  color: string;
  code: string;
}

interface HeroContentProps {
  /** Optional: Override default market indicators with live data */
  markets?: MarketIndicator[];
  /** Optional: Callback when user submits a query */
  onQuerySubmit?: (query: string) => void;
  /** Optional: Loading state for query submission */
  isSubmitting?: boolean;
}

// Static default data - will be overridden when backend is connected
const DEFAULT_MARKETS: MarketIndicator[] = [
  { name: 'India', color: '#FF9933', code: 'NSE' },
  { name: 'US', color: '#3C3B6E', code: 'NYSE' },
  { name: 'Germany', color: '#FFCC00', code: 'DAX' },
];

function HeroContentComponent({
  markets = DEFAULT_MARKETS,
  onQuerySubmit,
  isSubmitting = false,
}: HeroContentProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { springConfig } = usePhysics();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !isSubmitting) {
        onQuerySubmit?.(query);
        // For now, just log - backend will handle this
        console.log('Symphony query:', query);
      }
    },
    [query, isSubmitting, onQuerySubmit]
  );

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ...springConfig }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Logo */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        >
          <span className="symphony-gradient-text">Udaash</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/70 mb-8 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          The Global Market Symphony
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base text-white/50 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Where India, US, and Germany markets dance in orbital harmony.
          Experience real-time intelligence like never before.
        </motion.p>

        {/* Glowing Input */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about markets, stocks, trends..."
              disabled={isSubmitting}
              className="w-full px-6 py-4 sm:py-5 text-base sm:text-lg rounded-2xl symphony-input text-white placeholder-white/40 pr-14 disabled:opacity-50"
              aria-label="Search markets"
            />

            {/* Animated glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: isFocused
                  ? '0 0 60px rgba(168, 85, 247, 0.6), 0 0 100px rgba(168, 85, 247, 0.3)'
                  : '0 0 30px rgba(168, 85, 247, 0.2)',
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-symphony-500/20 hover:bg-symphony-500/40 transition-colors disabled:opacity-50"
              whileHover={{ scale: isSubmitting ? 1 : 1.1 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              aria-label="Submit query"
            >
              <svg
                className="w-6 h-6 text-symphony-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Market indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {markets.map((market, index) => (
            <motion.div
              key={market.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: market.color, boxShadow: `0 0 10px ${market.color}` }}
              />
              <span className="text-white/80 text-sm font-medium">{market.name}</span>
              <span className="text-white/40 text-xs">{market.code}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-symphony-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders from parent
export const HeroContent = memo(HeroContentComponent);
HeroContent.displayName = 'HeroContent';
