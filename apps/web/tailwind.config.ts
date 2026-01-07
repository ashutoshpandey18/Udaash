import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',

  // =============================================================================
  // PERFORMANCE OPTIMIZATIONS - DAY 14
  // =============================================================================

  // Precise content paths for efficient CSS purging
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Future-proof features
  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    extend: {
      colors: {
        symphony: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        india: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#CC7A29',
        },
        us: {
          DEFAULT: '#3C3B6E',
          light: '#5C5B8E',
          dark: '#2C2B5E',
        },
        germany: {
          DEFAULT: '#FFCC00',
          light: '#FFD633',
          dark: '#CCA300',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'symphony-gradient': 'linear-gradient(135deg, #1a0533 0%, #2d1b4e 25%, #1e1145 50%, #0f0a1e 100%)',
        'orb-glow': 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
      },
      boxShadow: {
        'symphony': '0 0 60px rgba(168, 85, 247, 0.3)',
        'symphony-lg': '0 0 100px rgba(168, 85, 247, 0.4)',
        'input-glow': '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
