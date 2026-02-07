import Link from 'next/link';
import { PreviewBoxLight } from './preview-box-light';

export function LandingHeroLight() {
  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white pt-16"
      aria-label="UDAASH hero"
    >
      {/* ── Layered background ────────────────────────────────────────── */}

      {/* Warm radial depth layers */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250,248,245,0.9) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(245,242,238,0.7) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(237,229,216,0.15) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Subtle technical grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hero-grid-light"
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="opacity-0 animate-fade-in-up mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-600/20 bg-blue-50/80 text-[11px] sm:text-xs font-medium tracking-widest uppercase text-blue-700 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600/80 animate-system-pulse" />
            AI-Powered Job Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 className="opacity-0 animate-fade-in-up-delay font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-neutral-900 leading-[0.95] mb-5">
          UDAASH
        </h1>

        {/* Subheadline */}
        <p className="opacity-0 animate-fade-in-up-delay-2 font-sans text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed mb-10">
          Intelligent job matching that surfaces the right opportunities, tracks
          your pipeline, and gives you an unfair advantage in global markets.
        </p>

        {/* CTA buttons */}
        <div className="opacity-0 animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-16 sm:mb-20">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center min-h-12 px-7 rounded-lg bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Get Started
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center min-h-12 px-7 rounded-lg border border-blue-600 hover:border-blue-700 hover:bg-blue-50 text-blue-700 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Explore Jobs
          </Link>
        </div>

        {/* Product preview */}
        <div className="w-full opacity-0 animate-fade-in-up-delay-3">
          <PreviewBoxLight />
        </div>
      </div>
    </section>
  );
}
