import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Design Tokens/Elevation Hierarchy',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Visual demonstration of elevation hierarchy
 */
export const StackedElevation: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">5-Level Elevation System</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Visual hierarchy using shadow tokens. Each level sits progressively closer to the user.
        </p>
      </div>

      {/* Stacked demonstration */}
      <div className="relative bg-surface border border-border rounded-lg p-12 min-h-[600px]">
        {/* Level 0: Base page (no shadow) */}
        <div className="absolute inset-0 bg-surface rounded-lg flex items-center justify-center">
          <p className="text-body text-muted">Level 0: Page Background (No Shadow)</p>
        </div>

        {/* Level 1: Button (shadow-button) */}
        <div className="absolute bottom-8 left-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button">
            Level 1: Button
          </button>
          <p className="text-body-small text-muted mt-2">shadow-button | z-index: 1</p>
        </div>

        {/* Level 2: Card (shadow-card) */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-surface rounded-lg shadow-card p-6 max-w-sm">
          <h4 className="font-heading-4 mb-2">Level 2: Card</h4>
          <p className="text-body-small text-foreground-secondary mb-4">
            Cards sit above the page surface to group related content.
          </p>
          <p className="text-body-small text-muted">shadow-card | z-index: 10</p>
        </div>

        {/* Level 3: Dropdown (shadow-dropdown) */}
        <div className="absolute top-32 right-12 bg-surface rounded-lg shadow-dropdown border border-border p-4 min-w-[250px]">
          <h4 className="font-heading-4 mb-3">Level 3: Dropdown</h4>
          <div className="space-y-2">
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
          <p className="text-body-small text-muted mt-3">shadow-dropdown | z-index: 50</p>
        </div>

        {/* Level 4: Modal (shadow-modal) */}
        <div className="absolute top-12 left-12 bg-surface rounded-lg shadow-modal border border-border p-6 max-w-md">
          <h4 className="font-heading-4 mb-4">Level 4: Modal</h4>
          <p className="text-body text-foreground-secondary mb-6">
            Modals have the highest elevation to clearly separate from all underlying content.
          </p>
          <div className="flex gap-3">
            <button className="bg-primary text-white px-4 py-2 rounded shadow-button text-body-small">
              Confirm
            </button>
            <button className="border-2 border-border text-foreground px-4 py-2 rounded text-body-small">
              Cancel
            </button>
          </div>
          <p className="text-body-small text-muted mt-4">shadow-modal | z-index: 100</p>
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-4">
        <p className="text-body-small text-info-dark">
          <strong>Hierarchy Rule:</strong> Elements with higher elevation (larger shadows) should also have higher z-index values to prevent visual inconsistencies.
        </p>
      </div>
    </div>
  ),
};

/**
 * Side-by-side elevation comparison
 */
export const SideBySideComparison: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Elevation Levels - Side by Side</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Compare all elevation levels simultaneously to understand the visual hierarchy.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Level 0 */}
        <div className="text-center">
          <div className="bg-surface border border-border rounded-lg p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4 text-muted">Level 0</p>
          </div>
          <p className="text-body-small text-muted mt-2">No Shadow</p>
          <p className="text-body-small text-muted">Flat elements</p>
        </div>

        {/* Level 1 */}
        <div className="text-center">
          <div className="bg-surface rounded-lg shadow-button p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4">Level 1</p>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-button</p>
          <p className="text-body-small text-muted">Interactive elements</p>
        </div>

        {/* Level 2 */}
        <div className="text-center">
          <div className="bg-surface rounded-lg shadow-card p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4">Level 2</p>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-card</p>
          <p className="text-body-small text-muted">Content grouping</p>
        </div>

        {/* Level 3 */}
        <div className="text-center">
          <div className="bg-surface rounded-lg shadow-dropdown border border-border p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4">Level 3</p>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-dropdown</p>
          <p className="text-body-small text-muted">Floating menus</p>
        </div>

        {/* Level 4 */}
        <div className="text-center">
          <div className="bg-surface rounded-lg shadow-modal border border-border p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4">Level 4</p>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-modal</p>
          <p className="text-body-small text-muted">Highest priority</p>
        </div>

        {/* Focus (special) */}
        <div className="text-center">
          <div className="bg-surface rounded-lg border-2 border-primary shadow-focus p-6 h-32 flex items-center justify-center">
            <p className="font-heading-4">Focus</p>
          </div>
          <p className="text-body-small text-muted mt-2">shadow-focus</p>
          <p className="text-body-small text-muted">Keyboard navigation</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Correct vs incorrect elevation usage
 */
export const CorrectUsage: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Elevation Best Practices</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Examples of correct and incorrect elevation usage.
        </p>
      </div>

      <div className="space-y-12">
        {/* Correct: Modal above card */}
        <div>
          <h3 className="font-heading-3 text-success mb-4">✓ Correct: Modal Above Card</h3>
          <div className="relative bg-surface border border-border rounded-lg p-8 min-h-[300px]">
            {/* Background card */}
            <div className="bg-surface rounded-lg shadow-card p-6 max-w-md">
              <h4 className="font-heading-4 mb-2">Quote Details</h4>
              <p className="text-body text-foreground-secondary">
                System size: 8.5 kW<br />
                Cost: $24,500
              </p>
            </div>

            {/* Modal on top */}
            <div className="absolute top-4 right-4 bg-surface rounded-lg shadow-modal border border-border p-6 max-w-sm z-50">
              <h4 className="font-heading-4 mb-3">Confirm Action</h4>
              <p className="text-body-small text-foreground-secondary mb-4">
                Accept this quote?
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-success text-white px-3 py-2 rounded text-body-small shadow-button">
                  Yes
                </button>
                <button className="flex-1 border border-border px-3 py-2 rounded text-body-small">
                  No
                </button>
              </div>
            </div>
          </div>
          <p className="text-body-small text-success mt-2">
            Modal (shadow-modal, z-100) sits above card (shadow-card, z-10) ✓
          </p>
        </div>

        {/* Incorrect: Card above modal */}
        <div>
          <h3 className="font-heading-3 text-error mb-4">✗ Incorrect: Card Above Modal</h3>
          <div className="relative bg-surface border border-border rounded-lg p-8 min-h-[300px]">
            {/* Modal underneath */}
            <div className="absolute top-4 right-4 bg-surface rounded-lg shadow-modal border border-border p-6 max-w-sm z-10">
              <h4 className="font-heading-4 mb-3">Confirm Action</h4>
              <p className="text-body-small text-foreground-secondary mb-4">
                Accept this quote?
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-success text-white px-3 py-2 rounded text-body-small shadow-button">
                  Yes
                </button>
                <button className="flex-1 border border-border px-3 py-2 rounded text-body-small">
                  No
                </button>
              </div>
            </div>

            {/* Card on top (wrong!) */}
            <div className="relative bg-surface rounded-lg shadow-card p-6 max-w-md z-50">
              <h4 className="font-heading-4 mb-2">Quote Details</h4>
              <p className="text-body text-foreground-secondary">
                System size: 8.5 kW<br />
                Cost: $24,500
              </p>
            </div>
          </div>
          <p className="text-body-small text-error mt-2">
            Card (shadow-card) has higher z-index than modal (shadow-modal) - visual hierarchy broken ✗
          </p>
        </div>

        {/* Correct: Dropdown above card */}
        <div>
          <h3 className="font-heading-3 text-success mb-4">✓ Correct: Dropdown Above Card</h3>
          <div className="relative bg-surface border border-border rounded-lg p-8 min-h-[300px]">
            {/* Background card */}
            <div className="bg-surface rounded-lg shadow-card p-6 max-w-md">
              <h4 className="font-heading-4 mb-4">Select Installer</h4>
              <button className="bg-primary text-white px-4 py-2 rounded shadow-button text-body-small">
                Open Dropdown
              </button>
            </div>

            {/* Dropdown on top */}
            <div className="absolute top-20 left-8 bg-surface rounded-lg shadow-dropdown border border-border p-2 min-w-[200px] z-50">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                SunPower Solutions
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                Tesla Solar
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small">
                Sunrun
              </button>
            </div>
          </div>
          <p className="text-body-small text-success mt-2">
            Dropdown (shadow-dropdown, z-50) sits above card (shadow-card, z-10) ✓
          </p>
        </div>
      </div>

      <div className="bg-primary-light border border-primary rounded-lg p-4">
        <h4 className="font-heading-4 text-primary-dark mb-2">✓ Elevation Rules</h4>
        <ul className="space-y-2 text-body-small text-primary-dark">
          <li>1. <strong>Shadow = z-index:</strong> Larger shadow should always have higher z-index</li>
          <li>2. <strong>No inversions:</strong> Never place low-elevation element above high-elevation element</li>
          <li>3. <strong>Consistent hierarchy:</strong> Button (1) &lt; Card (10) &lt; Dropdown (50) &lt; Modal (100)</li>
          <li>4. <strong>Context matters:</strong> A button inside a modal should use shadow-button (not modal shadow)</li>
          <li>5. <strong>Theme-aware:</strong> Shadows automatically adapt to Light/Dark themes</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Real-world solar industry example
 */
export const SolarLeadFlow: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Lead Generation Flow</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Complete elevation hierarchy in a typical SolarMatch workflow.
        </p>
      </div>

      <div className="relative bg-surface border border-border rounded-lg p-12 min-h-[700px]">
        {/* Level 0: Page background */}
        <div className="absolute inset-0 bg-surface rounded-lg" />

        {/* Level 1: CTA Button */}
        <div className="absolute bottom-8 left-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button hover:shadow-card transition-shadow">
            Get Free Quote
          </button>
          <p className="text-body-small text-muted mt-2">Primary CTA (Level 1)</p>
        </div>

        {/* Level 2: Lead card */}
        <div className="absolute top-40 left-8 bg-surface rounded-lg shadow-card p-6 max-w-sm hover:shadow-dropdown transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-heading-4">John Smith</h4>
              <p className="text-body-small text-muted">San Francisco, CA</p>
            </div>
            <span className="bg-warning text-white px-3 py-1 rounded text-body-small">
              Pending
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-body-small"><strong>Property:</strong> Single Family Home</p>
            <p className="text-body-small"><strong>Bill:</strong> $180/month</p>
            <p className="text-body-small"><strong>Submitted:</strong> 2 hours ago</p>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded shadow-button hover:shadow-card transition-shadow text-body-small">
            View Details
          </button>
          <p className="text-body-small text-muted mt-4">Lead Card (Level 2)</p>
        </div>

        {/* Level 3: Installer selector dropdown */}
        <div className="absolute top-12 right-12 bg-surface rounded-lg shadow-dropdown border border-border p-4 min-w-[280px] z-50">
          <h4 className="font-heading-4 mb-3">Assign to Installer</h4>
          <div className="space-y-2 mb-4">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small flex justify-between items-center">
              <span>SunPower Solutions</span>
              <span className="text-success text-body-small">✓ Available</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small flex justify-between items-center">
              <span>Tesla Solar</span>
              <span className="text-success text-body-small">✓ Available</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-body-small flex justify-between items-center">
              <span>Vivint Solar</span>
              <span className="text-muted text-body-small">Busy</span>
            </button>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded shadow-button text-body-small">
            Assign Lead
          </button>
          <p className="text-body-small text-muted mt-3">Dropdown Menu (Level 3)</p>
        </div>

        {/* Level 4: Confirmation modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface rounded-lg shadow-modal border border-border p-6 max-w-md z-100">
          <h4 className="font-heading-4 mb-4">Confirm Lead Assignment</h4>
          <p className="text-body text-foreground-secondary mb-4">
            Assign lead from <strong>John Smith</strong> to <strong>SunPower Solutions</strong>?
          </p>
          <div className="bg-info-light border border-info rounded p-3 mb-6">
            <p className="text-body-small text-info-dark">
              The installer will be notified immediately and can start working on the quote.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-success text-white px-4 py-2 rounded shadow-button hover:shadow-card transition-shadow">
              Yes, Assign
            </button>
            <button className="flex-1 border-2 border-border text-foreground px-4 py-2 rounded hover:shadow-button transition-shadow">
              Cancel
            </button>
          </div>
          <p className="text-body-small text-muted mt-4">Confirmation Modal (Level 4)</p>
        </div>
      </div>

      <div className="bg-success-light border border-success rounded-lg p-4">
        <h4 className="font-heading-4 text-success-dark mb-2">✓ Perfect Elevation Hierarchy</h4>
        <p className="text-body-small text-success-dark">
          This example demonstrates proper elevation stacking: Page (0) → Button (1) → Card (2) → Dropdown (3) → Modal (4). Each level clearly sits above the previous level visually and programmatically (z-index).
        </p>
      </div>
    </div>
  ),
};
