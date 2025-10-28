import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Elevated Button',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Buttons with elevation shadows
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Elevated Buttons</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Buttons using shadow tokens to create depth and visual hierarchy. Hover to see elevation increase.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Primary with shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Primary Button (shadow-button)</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Get Free Quote
          </button>
        </div>

        {/* Secondary with shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Secondary Button (shadow-button)</h3>
          <button className="bg-secondary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Learn More
          </button>
        </div>

        {/* Success with shadow */}
        <div>
          <h3 className="font-heading-3 mb-4">Success Button (shadow-button)</h3>
          <button className="bg-success text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Accept Quote
          </button>
        </div>

        {/* Outlined with shadow on hover */}
        <div>
          <h3 className="font-heading-3 mb-4">Outlined Button (hover: shadow-button)</h3>
          <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:shadow-button transition-shadow">
            Compare Installers
          </button>
        </div>

        {/* Ghost button (no shadow default, shadow on hover) */}
        <div>
          <h3 className="font-heading-3 mb-4">Ghost Button (hover only)</h3>
          <button className="text-primary px-6 py-3 rounded-lg hover:bg-primary-light hover:shadow-button transition-all">
            View Details
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Button sizes with shadows
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Button Sizes</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Shadows scale with button size for consistent visual weight.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Small */}
        <div>
          <h3 className="font-heading-3 mb-4">Small Button</h3>
          <button className="bg-primary text-white px-4 py-2 rounded text-body-small shadow-button hover:shadow-card transition-shadow">
            Small Button
          </button>
        </div>

        {/* Medium (default) */}
        <div>
          <h3 className="font-heading-3 mb-4">Medium Button (Default)</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Medium Button
          </button>
        </div>

        {/* Large */}
        <div>
          <h3 className="font-heading-3 mb-4">Large Button</h3>
          <button className="bg-primary text-white px-8 py-4 rounded-lg text-body-large shadow-button hover:shadow-card transition-shadow">
            Large Button
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Button states with shadows
 */
export const ButtonStates: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Button States</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Shadow behavior in different button states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Default state */}
        <div>
          <h3 className="font-heading-3 mb-4">Default</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button">
            Default State
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button (subtle elevation)</p>
        </div>

        {/* Hover state */}
        <div>
          <h3 className="font-heading-3 mb-4">Hover</h3>
          <button className="bg-primary-hover text-white px-6 py-3 rounded-lg shadow-card">
            Hover State
          </button>
          <p className="text-body-small text-muted mt-2">shadow-card (elevated)</p>
        </div>

        {/* Active/Pressed state */}
        <div>
          <h3 className="font-heading-3 mb-4">Active (Pressed)</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-sm">
            Active State
          </button>
          <p className="text-body-small text-muted mt-2">shadow-sm (reduced, pressed down)</p>
        </div>

        {/* Focus state */}
        <div>
          <h3 className="font-heading-3 mb-4">Focus (Keyboard)</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button shadow-focus">
            Focus State
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button + shadow-focus (ring)</p>
        </div>

        {/* Disabled state */}
        <div>
          <h3 className="font-heading-3 mb-4">Disabled</h3>
          <button disabled className="bg-muted text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed">
            Disabled State
          </button>
          <p className="text-body-small text-muted mt-2">No shadow (flat appearance)</p>
        </div>

        {/* Loading state */}
        <div>
          <h3 className="font-heading-3 mb-4">Loading</h3>
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button (maintains elevation)</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Button groups with shadows
 */
export const ButtonGroups: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Button Groups</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Multiple buttons with consistent shadow treatment.
        </p>
      </div>

      <div className="space-y-8">
        {/* Horizontal group */}
        <div>
          <h3 className="font-heading-3 mb-4">Horizontal Button Group</h3>
          <div className="flex gap-3">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
              Accept
            </button>
            <button className="border-2 border-border text-foreground px-6 py-3 rounded-lg hover:shadow-button transition-shadow">
              Decline
            </button>
            <button className="text-error px-6 py-3 rounded-lg hover:bg-error-light hover:shadow-button transition-all">
              Delete
            </button>
          </div>
        </div>

        {/* Vertical group */}
        <div>
          <h3 className="font-heading-3 mb-4">Vertical Button Group</h3>
          <div className="flex flex-col gap-3 max-w-xs">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow text-left">
              View Quote Details
            </button>
            <button className="border-2 border-border text-foreground px-6 py-3 rounded-lg hover:shadow-button transition-shadow text-left">
              Edit Quote
            </button>
            <button className="border-2 border-border text-foreground px-6 py-3 rounded-lg hover:shadow-button transition-shadow text-left">
              Download PDF
            </button>
            <button className="text-error px-6 py-3 rounded-lg hover:bg-error-light hover:shadow-button transition-all text-left">
              Delete Quote
            </button>
          </div>
        </div>

        {/* Segmented control */}
        <div>
          <h3 className="font-heading-3 mb-4">Segmented Control</h3>
          <div className="inline-flex rounded-lg shadow-button overflow-hidden">
            <button className="bg-primary text-white px-6 py-3 border-r border-primary-hover">
              Day
            </button>
            <button className="bg-primary-light text-primary px-6 py-3 border-r border-primary hover:bg-primary hover:text-white transition-colors">
              Week
            </button>
            <button className="bg-primary-light text-primary px-6 py-3 hover:bg-primary hover:text-white transition-colors">
              Month
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Solar-specific button examples
 */
export const SolarIndustryButtons: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Industry Examples</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world button usage in SolarMatch application.
        </p>
      </div>

      <div className="space-y-12">
        {/* Homepage CTA */}
        <div>
          <h3 className="font-heading-3 mb-4">Homepage Hero CTA</h3>
          <div className="bg-surface border border-border rounded-lg p-8">
            <h4 className="font-heading-2 mb-4">Start Saving with Solar</h4>
            <p className="text-body text-foreground-secondary mb-6 max-w-md">
              Get free quotes from top-rated solar installers in your area. Compare prices and save up to 20%.
            </p>
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-body-large shadow-button hover:shadow-card transition-shadow">
              Get Free Quote →
            </button>
          </div>
        </div>

        {/* Quote card actions */}
        <div>
          <h3 className="font-heading-3 mb-4">Quote Card Actions</h3>
          <div className="bg-surface rounded-lg shadow-card p-6 max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-heading-4">SunPower Solutions</h4>
                <p className="text-body-small text-muted">San Francisco, CA</p>
              </div>
              <span className="bg-success text-white px-3 py-1 rounded text-body-small">
                Approved
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-body-small text-muted">System Size</p>
                <p className="font-heading-4">8.5 kW</p>
              </div>
              <div>
                <p className="text-body-small text-muted">Total Cost</p>
                <p className="font-heading-4 text-success">$24,500</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-success text-white px-4 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
                Accept Quote
              </button>
              <button className="border-2 border-border text-foreground px-4 py-3 rounded-lg hover:shadow-button transition-shadow">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Lead assignment */}
        <div>
          <h3 className="font-heading-3 mb-4">Lead Assignment Actions</h3>
          <div className="bg-surface border border-border rounded-lg p-6">
            <h4 className="font-heading-4 mb-4">Assign Lead to Installer</h4>
            <div className="flex items-center justify-between mb-6 p-4 bg-surface-hover rounded-lg">
              <div>
                <p className="font-heading-4 text-body">John Smith</p>
                <p className="text-body-small text-muted">Monthly bill: $180 • Property: Single Family</p>
              </div>
              <span className="bg-warning text-white px-3 py-1 rounded text-body-small">
                Unassigned
              </span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
                Assign to Installer
              </button>
              <button className="border-2 border-border text-foreground px-6 py-3 rounded-lg hover:shadow-button transition-shadow">
                View Profile
              </button>
              <button className="text-error px-6 py-3 rounded-lg hover:bg-error-light hover:shadow-button transition-all">
                Archive
              </button>
            </div>
          </div>
        </div>

        {/* Form submission */}
        <div>
          <h3 className="font-heading-3 mb-4">Form Submission</h3>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md">
            <h4 className="font-heading-4 mb-6">Complete Your Profile</h4>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:border-primary focus:shadow-focus"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:border-primary focus:shadow-focus"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:border-primary focus:shadow-focus"
              />
            </div>
            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};
