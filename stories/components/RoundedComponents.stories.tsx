import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Rounded Components',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All component types with appropriate radius tokens
 */
export const AllComponentTypes: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Component Radius Reference</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Every component type has a standardized border radius for consistency.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Buttons (rounded-lg = 8px)</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-primary text-white px-6 py-3 rounded-lg">
            Primary Button
          </button>
          <button className="bg-secondary text-white px-6 py-3 rounded-lg">
            Secondary Button
          </button>
          <button className="bg-success text-white px-6 py-3 rounded-lg">
            Success Button
          </button>
          <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg">
            Outlined Button
          </button>
          <button className="text-primary px-6 py-3 rounded-lg hover:bg-primary-light">
            Ghost Button
          </button>
        </div>
        <p className="text-body-small text-muted">
          All buttons use <code>rounded-lg</code> for consistency and optimal clickability.
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Form Inputs (rounded-lg = 8px)</h3>
        <div className="space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Text input"
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
          />
          <input
            type="email"
            placeholder="Email input"
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
          />
          <select className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus">
            <option>Select dropdown</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <textarea
            placeholder="Textarea"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
          />
        </div>
        <p className="text-body-small text-muted">
          Form inputs match button radius (<code>rounded-lg</code>) for visual harmony.
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Cards (rounded-xl = 12px)</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
            <h4 className="font-heading-4 mb-2">Basic Card</h4>
            <p className="text-body-small text-foreground-secondary">
              Cards use larger radius (12px) to establish visual hierarchy over buttons/inputs.
            </p>
          </div>
          <div className="bg-primary text-white rounded-xl p-6 shadow-card">
            <h4 className="font-heading-4 mb-2">Colored Card</h4>
            <p className="text-body-small">
              Radius remains consistent regardless of background color.
            </p>
          </div>
        </div>
        <p className="text-body-small text-muted">
          Cards use <code>rounded-xl</code> to differentiate from smaller interactive elements.
        </p>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Badges & Tags (rounded = 4px)</h3>
        <div className="flex gap-3 flex-wrap">
          <span className="bg-success text-white px-3 py-1 rounded text-body-small">
            Success
          </span>
          <span className="bg-warning text-white px-3 py-1 rounded text-body-small">
            Warning
          </span>
          <span className="bg-error text-white px-3 py-1 rounded text-body-small">
            Error
          </span>
          <span className="bg-info text-white px-3 py-1 rounded text-body-small">
            Info
          </span>
          <span className="border border-primary text-primary px-3 py-1 rounded text-body-small">
            Outlined Badge
          </span>
        </div>
        <p className="text-body-small text-muted">
          Small badges use minimal radius (<code>rounded</code> = 4px) for compact appearance.
        </p>
      </div>

      {/* Pill buttons */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Pill Buttons & Pills (rounded-full)</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-primary text-white px-6 py-2 rounded-full">
            Pill Button
          </button>
          <span className="bg-success text-white px-4 py-2 rounded-full text-body-small">
            Active Status
          </span>
          <span className="bg-muted text-white px-4 py-2 rounded-full text-body-small">
            Count: 42
          </span>
        </div>
        <p className="text-body-small text-muted">
          Pill-shaped elements use <code>rounded-full</code> for maximum curvature.
        </p>
      </div>

      {/* Modals/Dialogs */}
      <div className="space-y-4">
        <h3 className="font-heading-3">Modals & Dialogs (rounded-2xl = 16px)</h3>
        <div className="bg-surface border border-border rounded-2xl p-8 max-w-md shadow-modal">
          <h4 className="font-heading-3 mb-4">Modal Title</h4>
          <p className="text-body text-foreground-secondary mb-6">
            Large containers like modals use the largest radius (16px) to create visual emphasis.
          </p>
          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg">
              Confirm
            </button>
            <button className="flex-1 border-2 border-border px-6 py-3 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
        <p className="text-body-small text-muted">
          Modals use <code>rounded-2xl</code> for maximum visual weight. Buttons inside maintain <code>rounded-lg</code>.
        </p>
      </div>
    </div>
  ),
};

/**
 * Button size variations with consistent radius
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Button Sizes with Consistent Radius</h2>
        <p className="text-body text-foreground-secondary mb-8">
          All button sizes use the same radius (rounded-lg) for consistency.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-heading-4 mb-3">Small Buttons</h3>
          <div className="flex gap-3 items-center flex-wrap">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-body-small">
              Small Primary
            </button>
            <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg text-body-small">
              Small Outlined
            </button>
            <button className="text-primary px-4 py-2 rounded-lg text-body-small hover:bg-primary-light">
              Small Ghost
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-heading-4 mb-3">Medium Buttons (Default)</h3>
          <div className="flex gap-3 items-center flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg text-body">
              Medium Primary
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg text-body">
              Medium Outlined
            </button>
            <button className="text-primary px-6 py-3 rounded-lg text-body hover:bg-primary-light">
              Medium Ghost
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-heading-4 mb-3">Large Buttons</h3>
          <div className="flex gap-3 items-center flex-wrap">
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-body-large">
              Large Primary
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-body-large">
              Large Outlined
            </button>
            <button className="text-primary px-8 py-4 rounded-lg text-body-large hover:bg-primary-light">
              Large Ghost
            </button>
          </div>
        </div>
      </div>

      <div className="bg-success-light border border-success rounded-lg p-4">
        <p className="text-body-small text-success-dark">
          ✓ Notice how all button sizes maintain the same radius (rounded-lg = 8px), creating visual consistency across the interface.
        </p>
      </div>
    </div>
  ),
};

/**
 * Card layout examples
 */
export const CardLayouts: Story = {
  render: () => (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Card Layout Examples</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Cards maintain consistent radius regardless of content or layout.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Simple card */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <h4 className="font-heading-4 mb-2">Simple Card</h4>
          <p className="text-body-small text-foreground-secondary">
            Basic content card with title and description.
          </p>
        </div>

        {/* Card with icon */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="font-heading-4 mb-2">Card with Icon</h4>
          <p className="text-body-small text-foreground-secondary">
            Icon container also uses rounded-lg for nested consistency.
          </p>
        </div>

        {/* Card with image */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
          <div className="h-40 bg-gradient-to-r from-primary to-secondary" />
          <div className="p-6">
            <h4 className="font-heading-4 mb-2">Card with Image</h4>
            <p className="text-body-small text-foreground-secondary">
              Image fills card with border-radius applied to container.
            </p>
          </div>
        </div>

        {/* Card with badge */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-heading-4">Card with Badge</h4>
            <span className="bg-success text-white px-3 py-1 rounded text-body-small">
              New
            </span>
          </div>
          <p className="text-body-small text-foreground-secondary">
            Badge uses smaller radius (rounded = 4px) than card (rounded-xl = 12px).
          </p>
        </div>

        {/* Card with button */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <h4 className="font-heading-4 mb-2">Card with Action</h4>
          <p className="text-body-small text-foreground-secondary mb-4">
            Button uses smaller radius than parent card for proper nesting.
          </p>
          <button className="w-full bg-primary text-white px-6 py-3 rounded-lg">
            Take Action
          </button>
        </div>

        {/* Card with list */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <h4 className="font-heading-4 mb-4">Card with List</h4>
          <ul className="space-y-2">
            <li className="text-body-small text-foreground-secondary flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              List item one
            </li>
            <li className="text-body-small text-foreground-secondary flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              List item two
            </li>
            <li className="text-body-small text-foreground-secondary flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              List item three
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Form elements with radius
 */
export const FormElements: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Form Elements</h2>
        <p className="text-body text-foreground-secondary mb-8">
          All form elements use rounded-lg (8px) for visual consistency.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 shadow-card">
        <h3 className="font-heading-3 mb-6">Sample Form</h3>
        
        <div className="space-y-6">
          {/* Text input */}
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
            />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
            />
          </div>

          {/* Select dropdown */}
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Property Type
            </label>
            <select className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus">
              <option>Select property type</option>
              <option>Single Family Home</option>
              <option>Multi-Family Home</option>
              <option>Commercial Building</option>
              <option>Industrial Facility</option>
            </select>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Additional Notes
            </label>
            <textarea
              rows={4}
              placeholder="Tell us more about your solar needs..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:shadow-focus"
            />
          </div>

          {/* Checkboxes (with rounded container) */}
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Interests
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer">
                <input type="checkbox" className="mr-3" />
                <span className="text-body-small">Solar panel installation</span>
              </label>
              <label className="flex items-center p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer">
                <input type="checkbox" className="mr-3" />
                <span className="text-body-small">Battery storage system</span>
              </label>
              <label className="flex items-center p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer">
                <input type="checkbox" className="mr-3" />
                <span className="text-body-small">Energy efficiency audit</span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button className="w-full bg-primary text-white px-6 py-4 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Submit Form
          </button>
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-4">
        <p className="text-body-small text-info-dark">
          💡 All form elements (inputs, selects, textareas, buttons) use the same radius (rounded-lg) for a cohesive form design.
        </p>
      </div>
    </div>
  ),
};

/**
 * Solar industry specific examples
 */
export const SolarIndustryExamples: Story = {
  render: () => (
    <div className="space-y-12 max-w-6xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Industry Components</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world examples from SolarMatch application.
        </p>
      </div>

      {/* Quote card */}
      <div>
        <h3 className="font-heading-3 mb-4">Quote Card</h3>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card max-w-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-heading-4 mb-1">SunPower Solutions</h4>
              <p className="text-body-small text-muted">Premium solar installer</p>
            </div>
            <span className="bg-success text-white px-3 py-1 rounded text-body-small">
              Approved
            </span>
          </div>

          <div className="bg-primary-light rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-body-small text-primary-dark mb-1">System Size</p>
                <p className="font-heading-3 text-primary">8.5 kW</p>
              </div>
              <div>
                <p className="text-body-small text-primary-dark mb-1">Total Cost</p>
                <p className="font-heading-3 text-primary">$24,500</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg">
              Accept Quote
            </button>
            <button className="flex-1 border-2 border-border px-6 py-3 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Lead card */}
      <div>
        <h3 className="font-heading-3 mb-4">Lead Card (Installer Dashboard)</h3>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card max-w-lg hover:shadow-dropdown transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-heading-4 mb-1">John Smith</h4>
              <p className="text-body-small text-muted">San Francisco, CA 94102</p>
            </div>
            <span className="bg-info text-white px-3 py-1 rounded text-body-small">
              New Lead
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-surface-hover rounded-lg p-3">
              <p className="text-body-small text-muted mb-1">Monthly Bill</p>
              <p className="font-heading-4">$180</p>
            </div>
            <div className="bg-surface-hover rounded-lg p-3">
              <p className="text-body-small text-muted mb-1">Property Type</p>
              <p className="font-heading-4 text-body-small">Single Family</p>
            </div>
          </div>

          <button className="w-full bg-success text-white px-6 py-3 rounded-lg">
            View Lead Details
          </button>
        </div>
      </div>

      {/* Search bar with filters */}
      <div>
        <h3 className="font-heading-3 mb-4">Search & Filter Bar</h3>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
          <div className="flex gap-3 mb-4">
            <input
              type="search"
              placeholder="Search installers..."
              className="flex-1 px-6 py-3 rounded-full border border-border bg-surface focus:border-primary focus:shadow-focus"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg">
              Search
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="text-body-small text-muted">Filters:</span>
            <button className="bg-primary-light text-primary px-4 py-1 rounded-full text-body-small">
              Location: CA
            </button>
            <button className="bg-primary-light text-primary px-4 py-1 rounded-full text-body-small">
              Rating: 4+ stars
            </button>
            <button className="bg-primary-light text-primary px-4 py-1 rounded-full text-body-small">
              Experience: 10+ years
            </button>
          </div>
        </div>
      </div>

      {/* Installation timeline */}
      <div>
        <h3 className="font-heading-3 mb-4">Installation Timeline</h3>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-card max-w-2xl">
          <h4 className="font-heading-4 mb-6">Your Solar Journey</h4>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-success-light rounded-lg p-4">
                  <h5 className="font-heading-4 text-success-dark mb-1">Quote Accepted</h5>
                  <p className="text-body-small text-success-dark">Completed on Jan 15, 2025</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-primary-light rounded-lg p-4 border-2 border-primary">
                  <h5 className="font-heading-4 text-primary-dark mb-1">Site Inspection</h5>
                  <p className="text-body-small text-primary-dark">Scheduled for Jan 22, 2025</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center text-muted font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-surface-hover rounded-lg p-4">
                  <h5 className="font-heading-4 text-muted mb-1">Installation</h5>
                  <p className="text-body-small text-muted">Estimated: Feb 5-7, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
