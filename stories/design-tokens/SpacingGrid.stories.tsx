import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design Tokens/Spacing Grid',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 8-point grid visualization with horizontal and vertical spacing
 */
export const GridVisualization: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading-2 mb-4">8-Point Grid System</h1>
        <p className="text-body text-foreground-secondary mb-8">
          Visual representation of the 8-point grid system used for all spacing tokens.
          Each cell represents 8px × 8px.
        </p>
      </div>

      {/* Grid Pattern */}
      <div className="border border-border rounded-lg p-6 bg-background overflow-x-auto">
        <div className="grid grid-cols-16 gap-0" style={{ width: 'fit-content' }}>
          {Array.from({ length: 128 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 border border-muted hover:bg-primary/20 transition-colors"
              title={`${Math.floor(i / 16) * 8}px × ${(i % 16) * 8}px`}
            />
          ))}
        </div>
        <p className="text-caption text-foreground-secondary mt-4">
          Hover over cells to see coordinates. Each cell = 8px × 8px.
        </p>
      </div>

      {/* Spacing Scale */}
      <div className="space-y-4">
        <h2 className="font-heading-3">Spacing Scale (Multiples of 8)</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24].map((multiplier) => {
            const pixels = multiplier * 8;
            return (
              <div key={multiplier} className="flex items-center gap-4">
                <div className="w-20 text-right">
                  <code className="text-body-small font-mono">{pixels}px</code>
                </div>
                <div className="flex-1 bg-background-secondary rounded h-8 relative overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 hover:bg-primary-dark"
                    style={{ width: `${pixels}px` }}
                  />
                </div>
                <div className="w-16 text-left">
                  <span className="text-caption text-foreground-secondary">{multiplier}× unit</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
};

/**
 * Common spacing patterns using the grid system
 */
export const CommonSpacingPatterns: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-4">Common Spacing Patterns</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Real-world examples of consistent spacing using the 8-point grid system.
        </p>
      </div>

      {/* Card Padding Pattern */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-4">Card Padding (24px = 3× base)</h3>
        <div className="bg-background-secondary rounded relative" style={{ padding: '24px' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-6 bg-primary/20 border-b-2 border-dashed border-primary" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-primary/20 border-t-2 border-dashed border-primary" />
            <div className="absolute top-0 left-0 bottom-0 w-6 bg-primary/20 border-r-2 border-dashed border-primary" />
            <div className="absolute top-0 right-0 bottom-0 w-6 bg-primary/20 border-l-2 border-dashed border-primary" />
          </div>
          <div className="bg-background rounded p-4 relative z-10">
            <p className="text-body">Card content with 24px padding on all sides</p>
          </div>
        </div>
        <p className="text-caption text-foreground-secondary mt-2">
          Desktop: 24px (3× base) | Mobile: 16px (2× base)
        </p>
      </div>

      {/* Form Gap Pattern */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-4">Form Field Gap (16px = 2× base)</h3>
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded flex items-center px-4">
            <span className="text-body-small">Input Field 1</span>
          </div>
          <div className="h-1 bg-primary/30 rounded-full" />
          <div className="h-12 bg-muted rounded flex items-center px-4">
            <span className="text-body-small">Input Field 2</span>
          </div>
          <div className="h-1 bg-primary/30 rounded-full" />
          <div className="h-12 bg-muted rounded flex items-center px-4">
            <span className="text-body-small">Input Field 3</span>
          </div>
        </div>
        <p className="text-caption text-foreground-secondary mt-4">
          Gap: 16px (2× base) - The blue line visualizes the spacing
        </p>
      </div>

      {/* Section Margin Pattern */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-4">Section Margin (48px = 6× base)</h3>
        <div className="space-y-12">
          <div className="bg-background-secondary rounded p-6">
            <h4 className="font-heading-4 mb-2">Section 1</h4>
            <p className="text-body">Content for first section</p>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-primary/20 border-y-2 border-dashed border-primary flex items-center justify-center">
              <span className="bg-background px-2 text-caption font-medium text-primary-dark">48px margin</span>
            </div>
          </div>
          <div className="bg-background-secondary rounded p-6">
            <h4 className="font-heading-4 mb-2">Section 2</h4>
            <p className="text-body">Content for second section</p>
          </div>
        </div>
        <p className="text-caption text-foreground-secondary mt-4">
          Desktop: 48px (6× base) | Mobile: 24px (3× base)
        </p>
      </div>

      {/* Button Padding Pattern */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-4">Button Padding</h3>
        <div className="flex flex-wrap gap-4">
          <div className="relative inline-block">
            <button className="bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors" style={{ padding: '12px 24px' }}>
              Large Button
            </button>
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-caption text-foreground-secondary">12px × 24px</span>
            </div>
          </div>
          <div className="relative inline-block">
            <button className="bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors" style={{ padding: '8px 16px' }}>
              Medium Button
            </button>
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-caption text-foreground-secondary">8px × 16px</span>
            </div>
          </div>
          <div className="relative inline-block">
            <button className="bg-muted text-foreground rounded-lg font-medium hover:bg-muted-dark transition-colors" style={{ padding: '4px 12px' }}>
              Small Button
            </button>
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-caption text-foreground-secondary">4px × 12px</span>
            </div>
          </div>
        </div>
        <p className="text-caption text-foreground-secondary mt-12">
          All padding values are multiples of 4px (half of base unit)
        </p>
      </div>
    </div>
  ),
};

/**
 * Comparison: With Grid vs Without Grid
 */
export const GridVsNoGrid: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-4">With Grid vs Without Grid</h2>
        <p className="text-body text-foreground-secondary mb-8">
          See how the 8-point grid system creates visual harmony and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Without Grid */}
        <div className="border border-error rounded-lg p-6 bg-error-light">
          <h3 className="font-heading-3 mb-4 text-error-dark">❌ Without Grid (Arbitrary Values)</h3>
          <div className="bg-background rounded" style={{ padding: '13px' }}>
            <div className="bg-muted rounded" style={{ padding: '9px', marginBottom: '17px' }}>
              <p className="text-body-small">Card 1 (9px padding, 17px margin)</p>
            </div>
            <div className="bg-muted rounded" style={{ padding: '11px', marginBottom: '21px' }}>
              <p className="text-body-small">Card 2 (11px padding, 21px margin)</p>
            </div>
            <div className="bg-muted rounded" style={{ padding: '14px' }}>
              <p className="text-body-small">Card 3 (14px padding)</p>
            </div>
          </div>
          <div className="mt-4 bg-background rounded p-4">
            <p className="text-body-small text-error-dark">
              <strong>Problems:</strong>
            </p>
            <ul className="text-body-small space-y-1 mt-2">
              <li>• Inconsistent spacing (9px, 11px, 13px, 14px, 17px, 21px)</li>
              <li>• Hard to maintain and remember values</li>
              <li>• No visual rhythm or harmony</li>
              <li>• Difficult for designers to replicate</li>
            </ul>
          </div>
        </div>

        {/* With Grid */}
        <div className="border border-success rounded-lg p-6 bg-success-light">
          <h3 className="font-heading-3 mb-4 text-success-dark">✓ With 8-Point Grid</h3>
          <div className="bg-background rounded" style={{ padding: '16px' }}>
            <div className="bg-muted rounded" style={{ padding: '8px', marginBottom: '16px' }}>
              <p className="text-body-small">Card 1 (8px padding, 16px margin)</p>
            </div>
            <div className="bg-muted rounded" style={{ padding: '8px', marginBottom: '16px' }}>
              <p className="text-body-small">Card 2 (8px padding, 16px margin)</p>
            </div>
            <div className="bg-muted rounded" style={{ padding: '8px' }}>
              <p className="text-body-small">Card 3 (8px padding)</p>
            </div>
          </div>
          <div className="mt-4 bg-background rounded p-4">
            <p className="text-body-small text-success-dark">
              <strong>Benefits:</strong>
            </p>
            <ul className="text-body-small space-y-1 mt-2">
              <li>• Consistent spacing (8px, 16px - multiples of 8)</li>
              <li>• Easy mental math (1×, 2×, 3× base unit)</li>
              <li>• Clear visual rhythm and harmony</li>
              <li>• Designer-developer alignment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive grid calculator
 */
export const GridCalculator: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-4">Grid Calculator</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Quick reference: Multiply by 8 to get pixel value.
        </p>
      </div>

      <div className="border border-border rounded-lg p-6 bg-background">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { multiplier: 0.5, pixels: 4, usage: 'Tiny gaps' },
            { multiplier: 1, pixels: 8, usage: 'Base unit' },
            { multiplier: 1.5, pixels: 12, usage: 'Small padding' },
            { multiplier: 2, pixels: 16, usage: 'Form gaps, Mobile card padding' },
            { multiplier: 3, pixels: 24, usage: 'Desktop card padding, Heading margins' },
            { multiplier: 4, pixels: 32, usage: 'Modal padding' },
            { multiplier: 6, pixels: 48, usage: 'Section margins (desktop)' },
            { multiplier: 8, pixels: 64, usage: 'Large section gaps' },
          ].map((item) => (
            <div key={item.pixels} className="border border-border rounded-lg p-4 bg-background-secondary hover:bg-muted transition-colors">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-body-large font-semibold">{item.pixels}px</span>
                <span className="text-caption text-foreground-secondary">({item.multiplier}×)</span>
              </div>
              <p className="text-body-small text-foreground-secondary">{item.usage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-6">
        <h3 className="font-heading-3 mb-2 text-info-dark">Quick Formula</h3>
        <div className="bg-background rounded p-4">
          <code className="text-body font-mono">pixels = multiplier × 8</code>
          <p className="text-body-small text-foreground-secondary mt-2">
            Example: 3× base unit = 3 × 8 = 24px
          </p>
        </div>
      </div>
    </div>
  ),
};
