'use client';

export function PreviewBoxLight() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Outer: rotating border */}
      <div className="preview-box-border-light rounded-2xl p-px">
        {/* Inner container: white glass panel */}
        <div className="light-sweep-light relative rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          {/* Top bar — window chrome */}
          <div className="relative z-10 flex items-center gap-2 px-5 py-3 border-b border-neutral-200">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-0.5 rounded-md bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 font-medium tracking-wide font-sans">
                udaash.app
              </div>
            </div>
            <div className="w-13" />
          </div>

          {/* Main preview content */}
          <div className="relative z-10 p-6 sm:p-8 min-h-70 sm:min-h-85 flex flex-col justify-between">
            {/* Top section: metric cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              <MetricCard label="Matched" value="147" accent />
              <MetricCard label="Applied" value="38" />
              <MetricCard label="Interviews" value="12" />
            </div>

            {/* Middle: shimmer bars (activity feed) */}
            <div className="space-y-3 mb-6">
              <ShimmerBar width="w-[80%]" delay="" />
              <ShimmerBar width="w-[60%]" delay="delay" />
              <ShimmerBar width="w-[45%]" delay="delay-2" />
            </div>

            {/* Bottom: status row with system pulse */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PulseDot delay="" />
                <PulseDot delay="delay" />
                <PulseDot delay="delay-2" />
                <span className="text-[11px] text-neutral-600 font-medium tracking-wider uppercase font-sans">
                  System Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-system-pulse" />
                <span className="text-[11px] text-neutral-600 font-sans">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 sm:p-4">
      <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-1 font-sans">
        {label}
      </p>
      <p
        className={`text-xl sm:text-2xl font-semibold tracking-tight font-display ${
          accent ? 'text-blue-700' : 'text-neutral-900'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ShimmerBar({ width, delay }: { width: string; delay: string }) {
  const animClass =
    delay === 'delay'
      ? 'animate-bar-shimmer-delay'
      : delay === 'delay-2'
        ? 'animate-bar-shimmer-delay-2'
        : 'animate-bar-shimmer';

  return (
    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r from-neutral-300/60 to-neutral-200/40 ${width} ${animClass}`}
      />
    </div>
  );
}

function PulseDot({ delay }: { delay: string }) {
  const animClass =
    delay === 'delay'
      ? 'animate-system-pulse-delay'
      : delay === 'delay-2'
        ? 'animate-system-pulse-delay-2'
        : 'animate-system-pulse';

  return (
    <span
      className={`block w-1.5 h-1.5 rounded-full bg-blue-600/70 ${animClass}`}
    />
  );
}
