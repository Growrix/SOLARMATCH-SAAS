import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Design Tokens/Border Radius',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete border radius token showcase
 */
export const AllRadiusTokens: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Border Radius Tokens</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Consistent corner rounding across all UI elements. Our system uses semantic radius tokens for different component types.
        </p>
      </div>

      <div className="space-y-12">
        {/* No radius */}
        <div>
          <h3 className="font-heading-3 mb-4">No Radius (Sharp Corners)</h3>
          <div className="bg-primary text-white px-6 py-4 w-64">
            <p className="text-body">Sharp corners (0px radius)</p>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> None (default sharp corners)</p>
            <p><strong>Value:</strong> 0px</p>
            <p><strong>Use for:</strong> Rectangular containers, dividers, full-width elements</p>
          </div>
        </div>

        {/* Small radius (4px) */}
        <div>
          <h3 className="font-heading-3 mb-4">Small Radius (Badges, Chips)</h3>
          <div className="inline-flex gap-3">
            <span className="bg-success text-white px-3 py-1 rounded">Success Badge</span>
            <span className="bg-warning text-white px-3 py-1 rounded">Warning Badge</span>
            <span className="bg-error text-white px-3 py-1 rounded">Error Badge</span>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> <code>rounded</code> (Tailwind default)</p>
            <p><strong>Value:</strong> 4px</p>
            <p><strong>Use for:</strong> Small badges, chips, tags, status indicators</p>
          </div>
        </div>

        {/* Medium radius (8px) - Buttons */}
        <div>
          <h3 className="font-heading-3 mb-4">Medium Radius (Buttons)</h3>
          <div className="flex gap-3">
            <button className="bg-primary text-white px-6 py-3 rounded-lg">
              Primary Button
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg">
              Secondary Button
            </button>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> <code>rounded-lg</code></p>
            <p><strong>Value:</strong> 8px</p>
            <p><strong>Use for:</strong> Buttons, inputs, form elements, interactive components</p>
          </div>
        </div>

        {/* Large radius (12px) - Cards */}
        <div>
          <h3 className="font-heading-3 mb-4">Large Radius (Cards, Panels)</h3>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md shadow-card">
            <h4 className="font-heading-4 mb-2">Solar Quote Card</h4>
            <p className="text-body text-foreground-secondary mb-4">
              System size: 8.5 kW<br />
              Estimated cost: $24,500
            </p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg w-full">
              View Details
            </button>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> <code>rounded-xl</code></p>
            <p><strong>Value:</strong> 12px</p>
            <p><strong>Use for:</strong> Cards, content panels, modals, dropdowns</p>
          </div>
        </div>

        {/* Extra large radius (16px) - Large containers */}
        <div>
          <h3 className="font-heading-3 mb-4">Extra Large Radius (Large Containers)</h3>
          <div className="bg-primary-light border border-primary rounded-2xl p-8 max-w-md">
            <h4 className="font-heading-3 text-primary mb-4">Get Started Today</h4>
            <p className="text-body text-primary-dark mb-6">
              Join thousands of homeowners saving money with solar energy.
            </p>
            <button className="bg-primary text-white px-8 py-4 rounded-lg w-full">
              Request Free Quote
            </button>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> <code>rounded-2xl</code></p>
            <p><strong>Value:</strong> 16px</p>
            <p><strong>Use for:</strong> Hero sections, large CTAs, feature cards, prominent containers</p>
          </div>
        </div>

        {/* Full radius (pill shape) */}
        <div>
          <h3 className="font-heading-3 mb-4">Full Radius (Pill Shape)</h3>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-primary text-white px-6 py-2 rounded-full">
              Pill Button
            </button>
            <span className="bg-success text-white px-4 py-2 rounded-full">
              Active Status
            </span>
            <input
              type="search"
              placeholder="Search installers..."
              className="px-6 py-2 rounded-full border border-border bg-surface"
            />
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Token:</strong> <code>rounded-full</code></p>
            <p><strong>Value:</strong> 9999px (creates perfect pill/circle)</p>
            <p><strong>Use for:</strong> Pill buttons, circular avatars, search bars, status pills</p>
          </div>
        </div>
      </div>

      <div className="bg-primary-light border border-primary rounded-lg p-card-padding">
        <h4 className="font-heading-4 text-primary-dark mb-2">✓ Radius Guidelines</h4>
        <ul className="space-y-2 text-body-small text-primary-dark">
          <li>• <strong>Consistency:</strong> Similar components should use same radius (all buttons = rounded-lg)</li>
          <li>• <strong>Hierarchy:</strong> Larger containers can have larger radius (cards {'>'} buttons)</li>
          <li>• <strong>Brand Identity:</strong> Radius contributes to overall design feel (sharp = modern, soft = friendly)</li>
          <li>• <strong>Accessibility:</strong> Avoid extremely large radius on small elements (hard to click)</li>
          <li>• <strong>Performance:</strong> Border-radius has minimal performance impact</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Radius comparison grid
 */
export const RadiusComparison: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Radius Scale Comparison</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Side-by-side comparison of all radius values.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Sharp (0px) */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full flex items-center justify-center text-white font-heading-4">
            0px
          </div>
          <p className="text-body-small text-muted mt-2">Sharp</p>
          <p className="text-body-small text-muted">No rounding</p>
        </div>

        {/* 4px */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full rounded flex items-center justify-center text-white font-heading-4">
            4px
          </div>
          <p className="text-body-small text-muted mt-2">rounded</p>
          <p className="text-body-small text-muted">Badges, chips</p>
        </div>

        {/* 8px */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full rounded-lg flex items-center justify-center text-white font-heading-4">
            8px
          </div>
          <p className="text-body-small text-muted mt-2">rounded-lg</p>
          <p className="text-body-small text-muted">Buttons, inputs</p>
        </div>

        {/* 12px */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full rounded-xl flex items-center justify-center text-white font-heading-4">
            12px
          </div>
          <p className="text-body-small text-muted mt-2">rounded-xl</p>
          <p className="text-body-small text-muted">Cards, panels</p>
        </div>

        {/* 16px */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full rounded-2xl flex items-center justify-center text-white font-heading-4">
            16px
          </div>
          <p className="text-body-small text-muted mt-2">rounded-2xl</p>
          <p className="text-body-small text-muted">Large containers</p>
        </div>

        {/* Full */}
        <div className="text-center">
          <div className="bg-primary h-24 w-full rounded-full flex items-center justify-center text-white font-heading-4">
            Full
          </div>
          <p className="text-body-small text-muted mt-2">rounded-full</p>
          <p className="text-body-small text-muted">Pills, circles</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Nested radius patterns
 */
export const NestedRadius: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Nested Radius Patterns</h2>
        <p className="text-body text-foreground-secondary mb-8">
          When nesting components with radius, inner elements should have smaller or equal radius.
        </p>
      </div>

      <div className="space-y-8">
        {/* Correct nesting */}
        <div>
          <h3 className="font-heading-3 text-success mb-4">✓ Correct: Card (12px) → Button (8px)</h3>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md shadow-card">
            <h4 className="font-heading-4 mb-4">Quote Summary</h4>
            <div className="bg-primary-light rounded-lg p-4 mb-4">
              <p className="text-body-small text-primary-dark">
                <strong>System Size:</strong> 8.5 kW<br />
                <strong>Total Cost:</strong> $24,500
              </p>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-lg w-full">
              Accept Quote
            </button>
          </div>
          <p className="text-body-small text-success mt-2">
            Card uses rounded-xl (12px), button uses rounded-lg (8px), inner panel uses rounded-lg (8px) ✓
          </p>
        </div>

        {/* Incorrect nesting */}
        <div>
          <h3 className="font-heading-3 text-error mb-4">✗ Incorrect: Card (8px) → Button (16px)</h3>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md shadow-card">
            <h4 className="font-heading-4 mb-4">Quote Summary</h4>
            <button className="bg-primary text-white px-6 py-3 rounded-2xl w-full">
              Accept Quote
            </button>
          </div>
          <p className="text-body-small text-error mt-2">
            Card uses rounded-lg (8px), but button uses rounded-2xl (16px) - visual conflict ✗
          </p>
        </div>

        {/* Multi-level nesting */}
        <div>
          <h3 className="font-heading-3 text-success mb-4">✓ Correct: Modal (16px) → Card (12px) → Button (8px)</h3>
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-lg shadow-modal">
            <h3 className="font-heading-3 mb-6">Confirm Installation</h3>
            <div className="bg-surface-hover rounded-xl p-6 mb-6">
              <h4 className="font-heading-4 mb-4">Installation Details</h4>
              <div className="space-y-3 mb-4">
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-body-small"><strong>Date:</strong> March 15, 2025</p>
                </div>
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-body-small"><strong>Installer:</strong> SunPower Solutions</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-success text-white px-6 py-3 rounded-lg">
                Confirm
              </button>
              <button className="flex-1 border-2 border-border px-6 py-3 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
          <p className="text-body-small text-success mt-2">
            Modal (16px) {'->'} Inner card (12px) {'->'} Details boxes (8px) {'->'} Buttons (8px) ✓
          </p>
        </div>
      </div>

      <div className="bg-warning-light border border-warning rounded-lg p-4">
        <p className="text-body-small text-warning-dark">
          <strong>Rule:</strong> Parent radius {'>='} Child radius. Never nest larger radius inside smaller radius.
        </p>
      </div>
    </div>
  ),
};

/**
 * Solar industry examples
 */
export const SolarIndustryExamples: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Industry Examples</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world radius usage in SolarMatch application.
        </p>
      </div>

      <div className="space-y-12">
        {/* Lead status badges */}
        <div>
          <h3 className="font-heading-3 mb-4">Lead Status Badges (rounded)</h3>
          <div className="flex gap-3 flex-wrap">
            <span className="bg-success text-white px-3 py-1 rounded text-body-small">Converted</span>
            <span className="bg-warning text-white px-3 py-1 rounded text-body-small">Pending</span>
            <span className="bg-info text-white px-3 py-1 rounded text-body-small">New</span>
            <span className="bg-error text-white px-3 py-1 rounded text-body-small">Lost</span>
            <span className="bg-muted text-white px-3 py-1 rounded text-body-small">Archived</span>
          </div>
        </div>

        {/* Quote card */}
        <div>
          <h3 className="font-heading-3 mb-4">Quote Card (rounded-xl)</h3>
          <div className="bg-surface rounded-xl shadow-card p-6 max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-heading-4">SunPower Solutions</h4>
                <p className="text-body-small text-muted">San Francisco, CA</p>
              </div>
              <span className="bg-success text-white px-3 py-1 rounded text-body-small">
                Approved
              </span>
            </div>
            <div className="bg-primary-light rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-body-small text-primary-dark">System Size</p>
                  <p className="font-heading-4 text-primary">8.5 kW</p>
                </div>
                <div>
                  <p className="text-body-small text-primary-dark">Annual Savings</p>
                  <p className="font-heading-4 text-success">$1,850</p>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg">
              View Full Quote
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div>
          <h3 className="font-heading-3 mb-4">Search Bar (rounded-full)</h3>
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Search installers by name or location..."
              className="w-full px-6 py-3 pr-12 rounded-full border border-border bg-surface text-foreground focus:border-primary focus:shadow-focus"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form with inputs */}
        <div>
          <h3 className="font-heading-3 mb-4">Quote Request Form (rounded-lg inputs)</h3>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md shadow-card">
            <h4 className="font-heading-4 mb-6">Get Your Free Quote</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Property Address"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
              />
              <input
                type="number"
                placeholder="Monthly Electric Bill ($)"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
              />
              <select className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus">
                <option>Property Type</option>
                <option>Single Family Home</option>
                <option>Multi-Family Home</option>
                <option>Commercial Building</option>
              </select>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div>
          <h3 className="font-heading-3 mb-4">Hero CTA (rounded-2xl container, rounded-lg button)</h3>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center">
            <h3 className="font-heading-2 text-white mb-4">Start Saving Today</h3>
            <p className="text-body-large text-white/90 mb-8 max-w-2xl mx-auto">
              Join over 10,000 homeowners who have switched to solar and are saving an average of $1,500 per year on electricity bills.
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-medium text-body-large shadow-button hover:shadow-card transition-shadow">
              Get Free Quote {'->'} 
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Accessibility considerations
 */
export const AccessibilityConsiderations: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Accessibility & Usability</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Border radius affects both aesthetics and usability.
        </p>
      </div>

      <div className="space-y-8">
        {/* Touch targets */}
        <div>
          <h3 className="font-heading-3 mb-4">Touch Target Sizing</h3>
          <div className="space-y-4">
            <div>
              <p className="text-body-small text-muted mb-2">✓ Good: Large button with moderate radius (easy to tap)</p>
              <button className="bg-primary text-white px-8 py-4 rounded-lg text-body">
                Large Button (48px height)
              </button>
            </div>
            <div>
              <p className="text-body-small text-error mb-2">✗ Poor: Small button with large radius (hard to tap center)</p>
              <button className="bg-primary text-white px-4 py-1 rounded-2xl text-body-small">
                Small Button (28px height, 16px radius)
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>WCAG Guideline:</strong> Touch targets should be at least 44×44px. Avoid large radius on small buttons (reduces tappable area).</p>
          </div>
        </div>

        {/* Focus states */}
        <div>
          <h3 className="font-heading-3 mb-4">Focus State Clarity</h3>
          <div className="space-y-4">
            <button className="bg-primary text-white px-6 py-3 rounded-lg focus:shadow-focus focus:outline-none">
              Button with Focus Ring (Tab to test)
            </button>
            <input
              type="text"
              placeholder="Input with Focus Ring (Click to test)"
              className="w-full max-w-md px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus focus:outline-none"
            />
          </div>
          <div className="mt-4 p-4 bg-info-light rounded text-body-small text-info-dark">
            <p><strong>Best Practice:</strong> Focus rings should match element radius. Use <code>shadow-focus</code> which adapts to element shape.</p>
          </div>
        </div>

        {/* Visual hierarchy */}
        <div>
          <h3 className="font-heading-3 mb-4">Visual Hierarchy</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
              <h4 className="font-heading-4 mb-4">Primary Content (12px)</h4>
              <div className="bg-primary-light rounded-lg p-4 mb-4">
                <p className="text-body-small text-primary-dark">Nested content (8px)</p>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg w-full">
                Action (8px)
              </button>
            </div>
            <div className="text-body-small text-foreground-secondary flex items-center">
              <p>
                Larger containers (cards) use larger radius (12px) to establish hierarchy.
                Nested elements use smaller/equal radius (8px) for consistency.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-success-light border border-success rounded-lg p-4">
        <h4 className="font-heading-4 text-success-dark mb-2">✓ Accessibility Checklist</h4>
        <ul className="space-y-2 text-body-small text-success-dark">
          <li>• Touch targets {'>='} 44×44px (WCAG 2.1 Level AAA)</li>
          <li>• Focus rings visible on all interactive elements</li>
          <li>• Radius doesn&apos;t reduce effective click area significantly</li>
          <li>• Visual hierarchy clear through consistent radius usage</li>
          <li>• Rounded corners don&apos;t obscure important content</li>
        </ul>
      </div>
    </div>
  ),
};
