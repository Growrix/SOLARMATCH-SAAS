import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Design Tokens/Shadows',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete shadow token showcase
 */
export const AllShadowLevels: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Shadow Tokens - 5-Level Elevation System</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Shadows create visual hierarchy and depth. Our system uses 5 elevation levels that automatically adapt to Light/Dark themes.
        </p>
      </div>

      <div className="space-y-12">
        {/* Level 0: No Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Level 0: No Shadow (Flat Elements)</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="inline-block bg-primary text-white px-6 py-3 rounded-lg">
              Flat Button (No Shadow)
            </div>
            <p className="text-body-small text-muted mt-4">
              <strong>Use for:</strong> Inline elements, text links, flat UI components
            </p>
          </div>
        </div>

        {/* Level 1: Button Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Level 1: Button Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
              Primary Button
            </div>
            <div className="mt-6 p-4 bg-info-light rounded text-body-small text-info-dark">
              <p><strong>Token:</strong> <code>shadow-button</code></p>
              <p><strong>Value (Light):</strong> 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)</p>
              <p><strong>Value (Dark):</strong> 0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.8)</p>
              <p className="mt-2"><strong>Use for:</strong> Buttons, small interactive elements, chips, badges</p>
            </div>
          </div>
        </div>

        {/* Level 2: Card Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Level 2: Card Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="bg-surface rounded-lg shadow-card p-6 max-w-md">
              <h4 className="font-heading-4 mb-2">Sample Card</h4>
              <p className="text-body text-foreground-secondary mb-4">
                Cards sit slightly above the page surface to create visual separation.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded text-body-small">
                Action
              </button>
            </div>
            <div className="mt-6 p-4 bg-info-light rounded text-body-small text-info-dark">
              <p><strong>Token:</strong> <code>shadow-card</code></p>
              <p><strong>Value (Light):</strong> 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)</p>
              <p><strong>Value (Dark):</strong> 0 3px 6px rgba(0,0,0,0.6), 0 3px 6px rgba(0,0,0,0.9)</p>
              <p className="mt-2"><strong>Use for:</strong> Cards, panels, sections with content grouping</p>
            </div>
          </div>
        </div>

        {/* Level 3: Dropdown Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Level 3: Dropdown Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="relative inline-block">
              <button className="bg-primary text-white px-4 py-2 rounded text-body-small">
                Open Dropdown
              </button>
              <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[200px] z-10">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                    Option 1
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                    Option 2
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                    Option 3
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-20 p-4 bg-info-light rounded text-body-small text-info-dark">
              <p><strong>Token:</strong> <code>shadow-dropdown</code></p>
              <p><strong>Value (Light):</strong> 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)</p>
              <p><strong>Value (Dark):</strong> 0 10px 20px rgba(0,0,0,0.7), 0 6px 6px rgba(0,0,0,0.95)</p>
              <p className="mt-2"><strong>Use for:</strong> Dropdowns, menus, popovers, tooltips</p>
            </div>
          </div>
        </div>

        {/* Level 4: Modal Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Level 4: Modal Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="bg-surface rounded-lg shadow-modal p-6 max-w-md border border-border">
              <h4 className="font-heading-4 mb-4">Modal Dialog</h4>
              <p className="text-body text-foreground-secondary mb-6">
                Modals have the highest elevation to clearly separate from underlying content.
              </p>
              <div className="flex gap-3">
                <button className="bg-primary text-white px-4 py-2 rounded text-body-small">
                  Confirm
                </button>
                <button className="border-2 border-border text-foreground px-4 py-2 rounded text-body-small">
                  Cancel
                </button>
              </div>
            </div>
            <div className="mt-6 p-4 bg-info-light rounded text-body-small text-info-dark">
              <p><strong>Token:</strong> <code>shadow-modal</code></p>
              <p><strong>Value (Light):</strong> 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)</p>
              <p><strong>Value (Dark):</strong> 0 14px 28px rgba(0,0,0,0.8), 0 10px 10px rgba(0,0,0,1)</p>
              <p className="mt-2"><strong>Use for:</strong> Modals, dialogs, overlays with backdrop</p>
            </div>
          </div>
        </div>

        {/* Focus Shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Special: Focus Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <input
              type="text"
              placeholder="Click to focus"
              className="px-4 py-3 rounded-lg border border-border bg-surface text-foreground
                         focus:border-primary focus:shadow-focus focus:outline-none"
            />
            <div className="mt-6 p-4 bg-info-light rounded text-body-small text-info-dark">
              <p><strong>Token:</strong> <code>shadow-focus</code></p>
              <p><strong>Value:</strong> 0 0 0 3px rgba(20, 184, 166, 0.3) (teal ring)</p>
              <p className="mt-2"><strong>Use for:</strong> Focus states on inputs, buttons, interactive elements (accessibility)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-light border border-primary rounded-lg p-card-padding mt-section-margin">
        <h4 className="font-heading-4 text-primary-dark mb-2">✓ Design Principles</h4>
        <ul className="space-y-2 text-body-small text-primary-dark">
          <li>• <strong>Elevation hierarchy:</strong> Higher elevation = closer to user, more important</li>
          <li>• <strong>Theme-aware:</strong> Darker shadows in Light theme, deeper shadows in Dark theme</li>
          <li>• <strong>Consistent z-index:</strong> Shadow level correlates with z-index (button: 1, card: 10, dropdown: 50, modal: 100)</li>
          <li>• <strong>Performance:</strong> Use box-shadow, not filter:drop-shadow (better performance)</li>
          <li>• <strong>Accessibility:</strong> Don&apos;t rely solely on shadows for hierarchy (use borders too)</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Light vs Dark theme comparison
 */
export const LightVsDarkComparison: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Shadow Theme Adaptation</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Toggle between Light/Dark themes in Storybook toolbar to see how shadows automatically adapt.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-heading-3 mb-4">Button Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
              Hover Me
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-heading-3 mb-4">Card Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="bg-surface rounded-lg shadow-card p-4">
              <p className="text-body-small">Card content</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading-3 mb-4">Dropdown Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="bg-surface rounded-lg shadow-dropdown p-4 border border-border">
              <p className="text-body-small">Dropdown menu</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading-3 mb-4">Modal Shadow</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="bg-surface rounded-lg shadow-modal p-4 border border-border">
              <p className="text-body-small">Modal dialog</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-warning-light border border-warning rounded-lg p-4">
        <p className="text-body-small text-warning-dark">
          <strong>Note:</strong> In Light theme, shadows are subtle (rgba with 0.12-0.25 opacity). In Dark theme, shadows are deeper (rgba with 0.5-1.0 opacity) to create contrast against dark backgrounds.
        </p>
      </div>
    </div>
  ),
};

/**
 * Interactive shadow transitions
 */
export const ShadowTransitions: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Shadow Transitions</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Shadows can transition smoothly using <code>transition-shadow</code> for elevation changes on hover/focus.
        </p>
      </div>

      <div className="space-y-8">
        {/* Button elevation on hover */}
        <div>
          <h3 className="font-heading-3 mb-4">Button: No Shadow → Button Shadow</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:shadow-button transition-shadow">
            Hover for Shadow
          </button>
        </div>

        {/* Card elevation on hover */}
        <div>
          <h3 className="font-heading-3 mb-4">Card: Button Shadow → Card Shadow</h3>
          <div className="bg-surface rounded-lg shadow-button hover:shadow-card transition-shadow p-6 max-w-md cursor-pointer">
            <h4 className="font-heading-4 mb-2">Interactive Card</h4>
            <p className="text-body text-foreground-secondary">
              Hover to see shadow elevation increase
            </p>
          </div>
        </div>

        {/* Dropdown elevation on hover */}
        <div>
          <h3 className="font-heading-3 mb-4">Dropdown: Card Shadow → Dropdown Shadow</h3>
          <div className="bg-surface rounded-lg shadow-card hover:shadow-dropdown transition-shadow p-4 max-w-md cursor-pointer border border-border">
            <p className="text-body-small">Hover for higher elevation</p>
          </div>
        </div>

        {/* Focus state */}
        <div>
          <h3 className="font-heading-3 mb-4">Focus: Border → Focus Shadow</h3>
          <input
            type="text"
            placeholder="Click to see focus shadow"
            className="px-4 py-3 rounded-lg border border-border bg-surface text-foreground
                       focus:border-primary focus:shadow-focus focus:outline-none transition-shadow w-full max-w-md"
          />
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-4">
        <p className="text-body-small text-info-dark">
          <strong>Tailwind Utility:</strong> Use <code>transition-shadow</code> or <code>transition-all</code> to animate shadow changes. Duration defaults to 150ms (fast), use <code>duration-300</code> for slower transitions.
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
        <h2 className="font-heading-2 mb-heading-margin">Shadow Usage in SolarMatch</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world examples of shadow tokens in the solar lead generation application.
        </p>
      </div>

      <div className="space-y-12">
        {/* Quote cards */}
        <div>
          <h3 className="font-heading-3 mb-4">Quote Cards (shadow-card)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg shadow-card p-6 hover:shadow-dropdown transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-heading-4">SunPower Solutions</h4>
                  <p className="text-body-small text-muted">San Francisco, CA</p>
                </div>
                <span className="bg-success text-white px-3 py-1 rounded text-body-small">
                  Approved
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-body-small text-muted">System Size</p>
                  <p className="font-heading-4">8.5 kW</p>
                </div>
                <div>
                  <p className="text-body-small text-muted">Est. Savings</p>
                  <p className="font-heading-4 text-success">$1,850/yr</p>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded shadow-button hover:shadow-card transition-shadow">
                View Quote
              </button>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6 hover:shadow-dropdown transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-heading-4">Tesla Solar</h4>
                  <p className="text-body-small text-muted">Palo Alto, CA</p>
                </div>
                <span className="bg-warning text-white px-3 py-1 rounded text-body-small">
                  Pending
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-body-small text-muted">System Size</p>
                  <p className="font-heading-4">10.2 kW</p>
                </div>
                <div>
                  <p className="text-body-small text-muted">Est. Savings</p>
                  <p className="font-heading-4 text-success">$2,100/yr</p>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded shadow-button hover:shadow-card transition-shadow">
                View Quote
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div>
          <h3 className="font-heading-3 mb-4">Action Buttons (shadow-button)</h3>
          <div className="flex gap-4">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
              Get Free Quote
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:shadow-button transition-shadow">
              Compare Installers
            </button>
          </div>
        </div>

        {/* Installer selector dropdown */}
        <div>
          <h3 className="font-heading-3 mb-4">Installer Selector (shadow-dropdown)</h3>
          <div className="relative inline-block">
            <button className="bg-surface border border-border px-4 py-2 rounded text-body flex items-center gap-2 shadow-button">
              Select Installer
              <span className="text-muted">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-dropdown border border-border min-w-[300px] z-50">
              <div className="p-2">
                {['SunPower Solutions', 'Tesla Solar', 'Vivint Solar', 'Sunrun'].map((name) => (
                  <button
                    key={name}
                    className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small flex justify-between items-center"
                  >
                    <span>{name}</span>
                    <span className="text-success text-body-small">✓ Available</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation modal */}
        <div>
          <h3 className="font-heading-3 mb-4">Confirmation Modal (shadow-modal)</h3>
          <div className="bg-surface rounded-lg shadow-modal p-6 max-w-md border border-border">
            <h4 className="font-heading-4 mb-4">Accept Quote?</h4>
            <p className="text-body text-foreground-secondary mb-6">
              You&apos;re about to accept the quote from <strong>SunPower Solutions</strong> for $24,500. This action will notify the installer.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 bg-success text-white px-4 py-2 rounded shadow-button hover:shadow-card transition-shadow">
                Yes, Accept
              </button>
              <button className="flex-1 border-2 border-border text-foreground px-4 py-2 rounded hover:shadow-button transition-shadow">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
