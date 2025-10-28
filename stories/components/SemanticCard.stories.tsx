import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Semantic Card',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card using semantic spacing tokens
 */
export const BasicCard: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h3 className="font-heading-3 mb-heading-margin">Solar Installation Quote</h3>
        <p className="text-body text-foreground-secondary mb-form-gap">
          Your personalized solar quote is ready for review. We&apos;ve calculated the optimal system size based on your energy usage.
        </p>
        <div className="space-y-form-gap">
          <div className="flex justify-between items-center">
            <span className="text-body-small text-foreground-secondary">System Size</span>
            <span className="text-body font-medium">8.5 kW</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-small text-foreground-secondary">Estimated Savings</span>
            <span className="text-body font-medium text-success">$2,400/year</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-small text-foreground-secondary">Payback Period</span>
            <span className="text-body font-medium">6.2 years</span>
          </div>
        </div>
      </div>
      <p className="text-caption text-foreground-secondary mt-4">
        Uses: <code>p-card-padding</code>, <code>mb-heading-margin</code>, <code>mb-form-gap</code>, <code>space-y-form-gap</code>
      </p>
    </div>
  ),
};

/**
 * Card with full spacing hierarchy
 */
export const CardWithFullHierarchy: Story = {
  render: () => (
    <div className="max-w-2xl">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card space-y-section-margin">
        {/* Header Section */}
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Installation Details</h2>
          <p className="text-body text-foreground-secondary">
            Complete information about your solar panel installation project.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="space-y-form-gap">
          <div>
            <h3 className="font-heading-3 mb-heading-margin">System Specifications</h3>
            <div className="grid grid-cols-2 gap-form-gap">
              <div className="border border-border rounded p-4 bg-background-secondary">
                <p className="text-caption text-foreground-secondary mb-2">Panel Count</p>
                <p className="text-body-large font-semibold">24 panels</p>
              </div>
              <div className="border border-border rounded p-4 bg-background-secondary">
                <p className="text-caption text-foreground-secondary mb-2">Total Capacity</p>
                <p className="text-body-large font-semibold">8.5 kW</p>
              </div>
              <div className="border border-border rounded p-4 bg-background-secondary">
                <p className="text-caption text-foreground-secondary mb-2">Panel Type</p>
                <p className="text-body-large font-semibold">Monocrystalline</p>
              </div>
              <div className="border border-border rounded p-4 bg-background-secondary">
                <p className="text-caption text-foreground-secondary mb-2">Efficiency</p>
                <p className="text-body-large font-semibold">21.5%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading-3 mb-heading-margin">Financial Summary</h3>
            <div className="space-y-form-gap">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-body text-foreground-secondary">System Cost</span>
                <span className="text-body font-medium">$25,500</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-body text-foreground-secondary">Federal Tax Credit (30%)</span>
                <span className="text-body font-medium text-success">-$7,650</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-body text-foreground-secondary">Net Cost</span>
                <span className="text-body-large font-semibold">$17,850</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex gap-form-gap pt-4 border-t border-border">
          <button className="px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Accept Quote
          </button>
          <button className="px-button-padding-x py-button-padding-y border border-border rounded-lg font-medium hover:bg-muted transition-colors">
            Request Changes
          </button>
        </div>
      </div>
      <div className="mt-4 bg-info-light border border-info rounded p-4">
        <p className="text-body-small text-info-dark">
          <strong>Spacing tokens used:</strong>
        </p>
        <ul className="text-body-small text-info-dark mt-2 space-y-1">
          <li>• <code>p-card-padding</code> - Main card padding</li>
          <li>• <code>space-y-section-margin</code> - Between header/content/footer</li>
          <li>• <code>mb-heading-margin</code> - Below headings</li>
          <li>• <code>gap-form-gap</code> - Grid gap, button gap</li>
          <li>• <code>space-y-form-gap</code> - Between form sections</li>
          <li>• <code>px-button-padding-x</code>, <code>py-button-padding-y</code> - Button padding</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Compact card with minimal spacing
 */
export const CompactCard: Story = {
  render: () => (
    <div className="max-w-sm">
      <div className="border border-border rounded-lg p-4 bg-background shadow-card">
        <h4 className="font-heading-4 mb-2">Quick Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-body-small">
            <span className="text-foreground-secondary">Leads Today</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-foreground-secondary">Active Quotes</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex justify-between text-body-small">
            <span className="text-foreground-secondary">Conversions</span>
            <span className="font-medium text-success">3</span>
          </div>
        </div>
      </div>
      <p className="text-caption text-foreground-secondary mt-4">
        Compact variant using smaller fixed spacing values (p-4, space-y-2, mb-2)
      </p>
    </div>
  ),
};

/**
 * Card grid with consistent spacing
 */
export const CardGrid: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Installer Services</h2>
        <p className="text-body text-foreground-secondary">
          All cards use consistent spacing tokens for visual harmony.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-form-gap">
        {[
          { title: 'Residential Solar', icon: '🏠', description: 'Complete home solar installations with warranty' },
          { title: 'Commercial Solar', icon: '🏢', description: 'Large-scale solar projects for businesses' },
          { title: 'Solar Maintenance', icon: '🔧', description: 'Regular maintenance and cleaning services' },
        ].map((service) => (
          <div key={service.title} className="border border-border rounded-lg p-card-padding bg-background shadow-card hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-form-gap">{service.icon}</div>
            <h3 className="font-heading-3 mb-heading-margin">{service.title}</h3>
            <p className="text-body text-foreground-secondary mb-form-gap">{service.description}</p>
            <button className="px-button-padding-x py-button-padding-y w-full bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Learn More
            </button>
          </div>
        ))}
      </div>
      
      <p className="text-caption text-foreground-secondary">
        Grid gap: <code>gap-form-gap</code> ensures consistent spacing between cards
      </p>
    </div>
  ),
};

/**
 * Responsive card demonstrating mobile vs desktop spacing
 */
export const ResponsiveCard: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Responsive Spacing Demo</h2>
        <p className="text-body text-foreground-secondary mb-4">
          Card padding adapts: <strong>Mobile: 16px</strong> | <strong>Desktop: 24px</strong>
        </p>
        <p className="text-body-small text-info">
          Resize your browser to see spacing adapt at the 1024px breakpoint.
        </p>
      </div>

      <div className="border-2 border-dashed border-primary rounded-lg p-1">
        <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
          <h3 className="font-heading-3 mb-heading-margin">Lead Information</h3>
          <div className="space-y-form-gap">
            <div>
              <label className="text-label block mb-2">Property Address</label>
              <div className="bg-muted rounded px-4 py-3 text-body">
                123 Solar Street, Sunshine City, CA 90210
              </div>
            </div>
            <div>
              <label className="text-label block mb-2">Monthly Bill</label>
              <div className="bg-muted rounded px-4 py-3 text-body">
                $185/month
              </div>
            </div>
            <div>
              <label className="text-label block mb-2">System Size</label>
              <div className="bg-muted rounded px-4 py-3 text-body">
                7.5 kW (recommended)
              </div>
            </div>
          </div>
          <div className="mt-section-margin pt-4 border-t border-border">
            <button className="px-button-padding-x py-button-padding-y w-full bg-success text-white rounded-lg font-medium hover:bg-success-dark transition-colors">
              Submit Quote
            </button>
          </div>
        </div>
      </div>

      <div className="bg-warning-light border border-warning rounded-lg p-4">
        <p className="text-body-small text-warning-dark">
          <strong>Current Spacing:</strong>
        </p>
        <ul className="text-body-small text-warning-dark mt-2 space-y-1">
          <li>• Card padding: <code>p-card-padding</code> (16px mobile → 24px desktop)</li>
          <li>• Form gap: <code>space-y-form-gap</code> (12px mobile → 16px desktop)</li>
          <li>• Section margin: <code>mt-section-margin</code> (24px mobile → 48px desktop)</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Card with nested spacing levels
 */
export const NestedSpacingCard: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Nested Spacing Example</h2>
        <p className="text-body text-foreground-secondary">
          Demonstrates how spacing tokens work at different nesting levels.
        </p>
      </div>

      <div className="border-4 border-primary/30 rounded-lg p-card-padding bg-primary/5">
        <p className="text-caption text-primary-dark mb-4">Level 1: <code>p-card-padding</code></p>
        
        <div className="border-4 border-secondary/30 rounded-lg p-card-padding bg-secondary/5">
          <p className="text-caption text-secondary-dark mb-4">Level 2: <code>p-card-padding</code></p>
          
          <div className="border-4 border-success/30 rounded-lg p-4 bg-success/5">
            <p className="text-caption text-success-dark mb-4">Level 3: <code>p-4</code> (fixed 16px)</p>
            
            <div className="bg-background rounded p-4 shadow-card">
              <h4 className="font-heading-4 mb-2">Content Card</h4>
              <p className="text-body">
                Inner content with consistent spacing at each level.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-4">
        <p className="text-body-small text-info-dark">
          <strong>Spacing Strategy:</strong>
        </p>
        <ul className="text-body-small text-info-dark mt-2 space-y-1">
          <li>• Outer containers: Use semantic tokens (<code>p-card-padding</code>)</li>
          <li>• Inner content: Use fixed Tailwind classes (<code>p-4</code>)</li>
          <li>• This creates clear visual hierarchy through spacing</li>
        </ul>
      </div>
    </div>
  ),
};
