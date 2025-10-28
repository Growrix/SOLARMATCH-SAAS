import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Design Tokens/Animations',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete animation token showcase
 */
export const AllAnimationTokens: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Animation Tokens</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Standardized animation durations, easing functions, and transitions for consistent motion design.
        </p>
      </div>

      <div className="space-y-12">
        {/* Duration tokens */}
        <div>
          <h3 className="font-heading-3 mb-4">Duration Tokens</h3>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Fast (150ms)</h4>
                  <p className="text-body-small text-muted">Quick interactions, hover states</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">duration-150</code>
              </div>
              <button className="bg-primary text-white px-6 py-3 rounded-lg transition-colors duration-150 hover:bg-primary-dark">
                Hover me (150ms)
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Normal (200ms)</h4>
                  <p className="text-body-small text-muted">Default transitions, UI state changes</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">duration-200</code>
              </div>
              <button className="bg-secondary text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-card">
                Hover me (200ms)
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Slow (300ms)</h4>
                  <p className="text-body-small text-muted">Complex animations, modals, panels</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">duration-300</code>
              </div>
              <button className="bg-success text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-dropdown">
                Hover me (300ms)
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Slower (500ms)</h4>
                  <p className="text-body-small text-muted">Page transitions, loading states</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">duration-500</code>
              </div>
              <button className="bg-info text-white px-6 py-3 rounded-lg transition-all duration-500 hover:scale-110 hover:rotate-3">
                Hover me (500ms)
              </button>
            </div>
          </div>
        </div>

        {/* Easing functions */}
        <div>
          <h3 className="font-heading-3 mb-4">Easing Functions</h3>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Linear</h4>
                  <p className="text-body-small text-muted">Constant speed, mechanical movements</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">ease-linear</code>
              </div>
              <div className="bg-primary h-12 w-12 rounded transition-all duration-500 ease-linear hover:ml-[200px]" />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Ease (Default)</h4>
                  <p className="text-body-small text-muted">Natural feeling, most UI interactions</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">ease</code>
              </div>
              <div className="bg-secondary h-12 w-12 rounded transition-all duration-500 ease hover:ml-[200px]" />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Ease-In</h4>
                  <p className="text-body-small text-muted">Starts slow, exits, dismissals</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">ease-in</code>
              </div>
              <div className="bg-success h-12 w-12 rounded transition-all duration-500 ease-in hover:ml-[200px]" />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Ease-Out</h4>
                  <p className="text-body-small text-muted">Starts fast, entrances, reveals</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">ease-out</code>
              </div>
              <div className="bg-warning h-12 w-12 rounded transition-all duration-500 ease-out hover:ml-[200px]" />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Ease-In-Out</h4>
                  <p className="text-body-small text-muted">Smooth start and end, state changes</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">ease-in-out</code>
              </div>
              <div className="bg-error h-12 w-12 rounded transition-all duration-500 ease-in-out hover:ml-[200px]" />
            </div>
          </div>
          <p className="text-body-small text-muted mt-4">
            💡 Hover over the colored squares to see easing in action
          </p>
        </div>

        {/* Transition properties */}
        <div>
          <h3 className="font-heading-3 mb-4">Transition Properties</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-heading-4 mb-2">Colors</h4>
              <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded mb-4 inline-block">
                transition-colors
              </code>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-success">
                Hover for color change
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-heading-4 mb-2">Shadow</h4>
              <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded mb-4 inline-block">
                transition-shadow
              </code>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg shadow-button transition-shadow duration-200 hover:shadow-card">
                Hover for shadow change
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-heading-4 mb-2">Transform</h4>
              <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded mb-4 inline-block">
                transition-transform
              </code>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg transition-transform duration-200 hover:scale-105">
                Hover for scale
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-heading-4 mb-2">Opacity</h4>
              <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded mb-4 inline-block">
                transition-opacity
              </code>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg transition-opacity duration-200 hover:opacity-70">
                Hover for fade
              </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 md:col-span-2">
              <h4 className="font-heading-4 mb-2">All Properties</h4>
              <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded mb-4 inline-block">
                transition-all
              </code>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg transition-all duration-300 hover:bg-success hover:scale-105 hover:shadow-card">
                Hover for combined effects
              </button>
            </div>
          </div>
        </div>

        {/* Keyframe animations */}
        <div>
          <h3 className="font-heading-3 mb-4">Keyframe Animations</h3>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Spin</h4>
                  <p className="text-body-small text-muted">Loading spinners, refresh icons</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">animate-spin</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-body-small text-muted">Loading...</span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Pulse</h4>
                  <p className="text-body-small text-muted">Attention indicators, notifications</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">animate-pulse</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
                <span className="text-body-small text-muted">New notification</span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Bounce</h4>
                  <p className="text-body-small text-muted">Success confirmations, playful interactions</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">animate-bounce</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-success rounded animate-bounce" />
                <span className="text-body-small text-muted">Success!</span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading-4">Ping</h4>
                  <p className="text-body-small text-muted">Live indicators, real-time updates</p>
                </div>
                <code className="text-body-small bg-muted text-foreground px-3 py-1 rounded">animate-ping</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-error rounded-full animate-ping opacity-75" />
                  <div className="relative w-8 h-8 bg-error rounded-full" />
                </div>
                <span className="text-body-small text-muted">Live now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-light border border-primary rounded-lg p-card-padding">
        <h4 className="font-heading-4 text-primary-dark mb-2">✓ Animation Guidelines</h4>
        <ul className="space-y-2 text-body-small text-primary-dark">
          <li>• <strong>Fast (150ms):</strong> Hover states, button presses, quick feedback</li>
          <li>• <strong>Normal (200ms):</strong> Default for most UI transitions, tab switches, dropdown opens</li>
          <li>• <strong>Slow (300ms):</strong> Complex state changes, modal opens, panel slides</li>
          <li>• <strong>Slower (500ms):</strong> Page transitions, major layout shifts (use sparingly)</li>
          <li>• <strong>Respect prefers-reduced-motion:</strong> Disable animations for accessibility</li>
          <li>• <strong>Use ease or ease-out:</strong> Most natural for UI (avoid ease-in for entrances)</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Common animation patterns
 */
export const CommonPatterns: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Common Animation Patterns</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world animation usage patterns across the application.
        </p>
      </div>

      <div className="space-y-12">
        {/* Button states */}
        <div>
          <h3 className="font-heading-3 mb-4">Button State Transitions</h3>
          <div className="space-y-4">
            <div>
              <p className="text-body-small text-muted mb-2">Standard button (color + shadow)</p>
              <button className="bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary-dark hover:shadow-card active:scale-95">
                Click Me
              </button>
            </div>
            <div>
              <p className="text-body-small text-muted mb-2">Outlined button (border + background)</p>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white">
                Hover to Fill
              </button>
            </div>
            <div>
              <p className="text-body-small text-muted mb-2">Icon button (scale + rotate)</p>
              <button className="bg-surface border border-border p-3 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90 hover:border-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Card interactions */}
        <div>
          <h3 className="font-heading-3 mb-4">Card Hover Effects</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-1 cursor-pointer">
              <h4 className="font-heading-4 mb-2">Lift on Hover</h4>
              <p className="text-body-small text-foreground-secondary">
                Card lifts up with enhanced shadow
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:border-primary hover:shadow-card cursor-pointer">
              <h4 className="font-heading-4 mb-2">Border Highlight</h4>
              <p className="text-body-small text-foreground-secondary">
                Border changes color on hover
              </p>
            </div>
          </div>
        </div>

        {/* Loading states */}
        <div>
          <h3 className="font-heading-3 mb-4">Loading States</h3>
          <div className="space-y-6">
            <div>
              <p className="text-body-small text-muted mb-2">Button with spinner</p>
              <button className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-3" disabled>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </button>
            </div>
            <div>
              <p className="text-body-small text-muted mb-2">Skeleton loader</p>
              <div className="space-y-3">
                <div className="h-12 bg-surface-hover rounded animate-pulse" />
                <div className="h-12 bg-surface-hover rounded animate-pulse" />
                <div className="h-12 bg-surface-hover rounded animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-body-small text-muted mb-2">Progress dots</p>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Notification animations */}
        <div>
          <h3 className="font-heading-3 mb-4">Notifications & Alerts</h3>
          <div className="space-y-4">
            <div className="bg-success-light border-l-4 border-success rounded p-4 transition-all duration-300 hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <p className="text-body-small text-success-dark">Quote submitted successfully!</p>
              </div>
            </div>
            <div className="bg-info-light border-l-4 border-info rounded p-4 transition-all duration-300 hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 bg-info rounded-full animate-ping opacity-75" />
                  <div className="relative w-5 h-5 bg-info rounded-full" />
                </div>
                <p className="text-body-small text-info-dark">3 new leads available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form validation */}
        <div>
          <h3 className="font-heading-3 mb-4">Form Validation Feedback</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-label text-foreground-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-success bg-success-light transition-all duration-200 focus:shadow-focus"
              />
              <p className="text-body-small text-success mt-1 flex items-center gap-2">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Valid email address
              </p>
            </div>
            <div>
              <label className="block text-label text-foreground-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border-2 border-error bg-error-light transition-all duration-200 focus:shadow-focus"
              />
              <p className="text-body-small text-error mt-1 flex items-center gap-2">
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Password too short
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Solar industry specific animations
 */
export const SolarIndustryExamples: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Industry Animations</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Animation patterns used throughout SolarMatch application.
        </p>
      </div>

      <div className="space-y-12">
        {/* Quote card interaction */}
        <div>
          <h3 className="font-heading-3 mb-4">Quote Card Interaction</h3>
          <div className="bg-surface border border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-heading-4 mb-1">SunPower Solutions</h4>
                <p className="text-body-small text-muted">Premium solar installer</p>
              </div>
              <span className="bg-success text-white px-3 py-1 rounded text-body-small transition-all duration-150 hover:scale-110">
                Approved
              </span>
            </div>
            <div className="bg-primary-light rounded-lg p-4 mb-4 transition-colors duration-200 hover:bg-primary/20">
              <p className="text-body-small text-primary-dark">System Size: 8.5 kW</p>
              <p className="font-heading-3 text-primary">$24,500</p>
            </div>
            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary-dark hover:shadow-card active:scale-95">
              View Quote Details
            </button>
          </div>
        </div>

        {/* Lead status transitions */}
        <div>
          <h3 className="font-heading-3 mb-4">Lead Status Transitions</h3>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-info rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-info rounded-full relative" />
                </div>
                <div>
                  <p className="font-heading-4">John Smith</p>
                  <p className="text-body-small text-muted">New lead</p>
                </div>
              </div>
              <span className="bg-info text-white px-3 py-1 rounded text-body-small">New</span>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-warning border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="font-heading-4">Sarah Johnson</p>
                  <p className="text-body-small text-muted">Processing quote</p>
                </div>
              </div>
              <span className="bg-warning text-white px-3 py-1 rounded text-body-small">Pending</span>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 flex items-center justify-between transition-all duration-300 hover:border-success">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading-4">Mike Davis</p>
                  <p className="text-body-small text-muted">Installation scheduled</p>
                </div>
              </div>
              <span className="bg-success text-white px-3 py-1 rounded text-body-small">Converted</span>
            </div>
          </div>
        </div>

        {/* Installation progress */}
        <div>
          <h3 className="font-heading-3 mb-4">Installation Progress Tracker</h3>
          <div className="bg-surface border border-border rounded-xl p-6">
            <h4 className="font-heading-4 mb-6">Installation Timeline</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-success-light rounded-lg p-4 transition-all duration-200 hover:shadow-card">
                    <h5 className="font-heading-4 text-success-dark">Quote Accepted</h5>
                    <p className="text-body-small text-success-dark">Completed</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center text-white relative">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin absolute" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-warning-light rounded-lg p-4 border-2 border-warning transition-all duration-200 hover:shadow-card">
                    <h5 className="font-heading-4 text-warning-dark">Site Inspection</h5>
                    <p className="text-body-small text-warning-dark">In progress...</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 opacity-50">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center text-muted">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-surface-hover rounded-lg p-4">
                    <h5 className="font-heading-4 text-muted">Installation</h5>
                    <p className="text-body-small text-muted">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time dashboard updates */}
        <div>
          <h3 className="font-heading-3 mb-4">Real-Time Dashboard</h3>
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-heading-4">Today&apos;s Metrics</h4>
              <div className="flex items-center gap-2 text-body-small text-success">
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-success rounded-full animate-ping" />
                  <div className="relative w-2 h-2 bg-success rounded-full" />
                </div>
                Live
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center transition-all duration-300 hover:scale-105">
                <p className="text-body-small text-muted mb-1">New Leads</p>
                <p className="font-heading-2 text-primary">12</p>
              </div>
              <div className="text-center transition-all duration-300 hover:scale-105">
                <p className="text-body-small text-muted mb-1">Quotes Sent</p>
                <p className="font-heading-2 text-info">8</p>
              </div>
              <div className="text-center transition-all duration-300 hover:scale-105">
                <p className="text-body-small text-muted mb-1">Conversions</p>
                <p className="font-heading-2 text-success">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Performance considerations
 */
export const PerformanceGuidelines: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Performance & Accessibility</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Best practices for performant and accessible animations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Prefer transform and opacity */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-heading-3 mb-4">✓ Prefer Transform & Opacity</h3>
          <p className="text-body-small text-foreground-secondary mb-4">
            These properties are GPU-accelerated and perform best:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success-light rounded">
              <code className="text-body-small text-success-dark">transform: scale(1.05)</code>
              <span className="text-body-small text-success">Fast ✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-light rounded">
              <code className="text-body-small text-success-dark">transform: translateY(-4px)</code>
              <span className="text-body-small text-success">Fast ✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success-light rounded">
              <code className="text-body-small text-success-dark">opacity: 0.7</code>
              <span className="text-body-small text-success">Fast ✓</span>
            </div>
          </div>
        </div>

        {/* Avoid expensive properties */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-heading-3 mb-4">✗ Avoid Expensive Properties</h3>
          <p className="text-body-small text-foreground-secondary mb-4">
            These cause layout recalculation and repaint:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-error-light rounded">
              <code className="text-body-small text-error-dark">width, height (layout shift)</code>
              <span className="text-body-small text-error">Slow ✗</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-error-light rounded">
              <code className="text-body-small text-error-dark">top, left, margin (layout shift)</code>
              <span className="text-body-small text-error">Slow ✗</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-error-light rounded">
              <code className="text-body-small text-error-dark">box-shadow (repaint heavy)</code>
              <span className="text-body-small text-error">Slow ✗</span>
            </div>
          </div>
        </div>

        {/* Reduced motion */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="font-heading-3 mb-4">Respect Reduced Motion</h3>
          <p className="text-body-small text-foreground-secondary mb-4">
            Users with motion sensitivity should see minimal animation:
          </p>
          <div className="bg-warning-light border border-warning rounded p-4">
            <code className="text-body-small text-warning-dark block mb-2">
              @media (prefers-reduced-motion: reduce) {'{'}<br />
              &nbsp;&nbsp;* {'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;animation-duration: 0.01ms !important;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;transition-duration: 0.01ms !important;<br />
              &nbsp;&nbsp;{'}'}<br />
              {'}'}
            </code>
            <p className="text-body-small text-warning-dark mt-2">
              Tailwind CSS includes this by default in base styles.
            </p>
          </div>
        </div>

        {/* Animation checklist */}
        <div className="bg-primary-light border border-primary rounded-lg p-6">
          <h4 className="font-heading-4 text-primary-dark mb-4">Animation Checklist</h4>
          <ul className="space-y-2 text-body-small text-primary-dark">
            <li>✓ Use transform/opacity for best performance</li>
            <li>✓ Keep durations between 150-300ms for UI interactions</li>
            <li>✓ Use ease or ease-out for natural feeling</li>
            <li>✓ Test with reduced motion preferences</li>
            <li>✓ Avoid animating layout properties (width, height, margin)</li>
            <li>✓ Don&apos;t animate everything - be purposeful</li>
            <li>✓ Consider mobile performance (lower-end devices)</li>
            <li>✓ Use will-change sparingly and only when needed</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
