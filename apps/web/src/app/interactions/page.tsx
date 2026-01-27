import Link from 'next/link';
import { InteractiveCard } from '@/components/interactive-card';

export default function InteractionDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Interaction System Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Day 11 — Interaction System & Motion Refinement
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Calm, predictable interactions that respect user preferences. All motion is optional
            and automatically respects <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">prefers-reduced-motion</code>.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Hover Scale: 1.01x
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Tap Scale: 0.98x
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              Duration: 80-120ms
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              No Physics
            </span>
          </div>
        </div>

        {/* Interactive Cards Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Interactive Cards
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Hover and click to see subtle, predictable feedback.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Default variant */}
            <InteractiveCard className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Default</h4>
                  <p className="text-xs text-gray-500">Scale on hover</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Subtle scale transform on hover and tap.
              </p>
            </InteractiveCard>

            {/* Subtle variant */}
            <InteractiveCard variant="subtle" className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Subtle</h4>
                  <p className="text-xs text-gray-500">Opacity change</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Opacity feedback without transform.
              </p>
            </InteractiveCard>

            {/* None variant */}
            <InteractiveCard variant="none" className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">None</h4>
                  <p className="text-xs text-gray-500">No motion</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Static for high-density interfaces.
              </p>
            </InteractiveCard>
          </div>
        </div>

        {/* Button Interactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Button Interactions
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Consistent tap feedback across all button variants.
          </p>

          <div className="flex flex-wrap gap-3">
            <InteractiveCard
              asButton
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Primary Action
            </InteractiveCard>

            <InteractiveCard
              asButton
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Secondary Action
            </InteractiveCard>

            <InteractiveCard
              asButton
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
            >
              Destructive Action
            </InteractiveCard>

            <InteractiveCard
              asButton
              disabled
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
            >
              Disabled Action
            </InteractiveCard>
          </div>
        </div>

        {/* Transition Tokens */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Motion Tokens
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Centralized motion values ensure consistency.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Scale Transforms</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Hover:</span>
                  <code className="px-1 py-0.5 bg-white rounded">1.01</code>
                </div>
                <div className="flex justify-between">
                  <span>Tap:</span>
                  <code className="px-1 py-0.5 bg-white rounded">0.98</code>
                </div>
                <div className="flex justify-between">
                  <span>Disabled:</span>
                  <code className="px-1 py-0.5 bg-white rounded">1.0</code>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Durations</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Fast:</span>
                  <code className="px-1 py-0.5 bg-white rounded">80ms</code>
                </div>
                <div className="flex justify-between">
                  <span>Normal:</span>
                  <code className="px-1 py-0.5 bg-white rounded">120ms</code>
                </div>
                <div className="flex justify-between">
                  <span>Slow:</span>
                  <code className="px-1 py-0.5 bg-white rounded">200ms</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Accessibility & Performance
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Respects prefers-reduced-motion:</strong> All motion disabled automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Low-power detection:</strong> Reduces motion on struggling devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Keyboard navigation:</strong> Focus states are clear and visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>No layout shift:</strong> Motion never affects layout or input latency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span><strong>Native touch feedback:</strong> Uses browser-native tap highlights</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
