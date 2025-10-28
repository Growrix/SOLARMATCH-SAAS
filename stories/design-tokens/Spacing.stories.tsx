import type { Meta, StoryObj } from '@storybook/react';
import { useResponsiveSpacing } from '@/hooks/useResponsiveSpacing';

const meta = {
  title: 'Design Tokens/Spacing',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Display all spacing tokens with their pixel values
 */
export const AllSpacingTokens: Story = {
  render: () => {
    const spacingTokens = [
      { name: 'card-padding', mobile: '16px', desktop: '24px', usage: 'Padding inside cards' },
      { name: 'modal-padding', mobile: '20px', desktop: '32px', usage: 'Padding inside modals' },
      { name: 'form-gap', mobile: '12px', desktop: '16px', usage: 'Gap between form fields' },
      { name: 'section-margin', mobile: '24px', desktop: '48px', usage: 'Margin between page sections' },
      { name: 'heading-margin', mobile: '16px', desktop: '24px', usage: 'Margin below headings' },
      { name: 'button-padding-x', mobile: '16px', desktop: '24px', usage: 'Horizontal button padding' },
      { name: 'button-padding-y', mobile: '8px', desktop: '12px', usage: 'Vertical button padding' },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-heading-2 mb-4">Spacing Token System</h1>
          <p className="text-body text-foreground-secondary mb-8">
            Semantic spacing tokens that adapt to mobile/desktop breakpoints. All values follow an 8-point grid system.
          </p>
        </div>

        <div className="space-y-4">
          {spacingTokens.map((token) => (
            <div key={token.name} className="border border-border rounded-lg p-6 bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {token.name}
                  </code>
                  <p className="text-body-small text-foreground-secondary mt-2">
                    {token.usage}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-caption text-foreground-secondary mb-1">Mobile</p>
                    <p className="text-body font-medium">{token.mobile}</p>
                  </div>
                  <div>
                    <p className="text-caption text-foreground-secondary mb-1">Desktop</p>
                    <p className="text-body font-medium">{token.desktop}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div 
                    className="bg-primary h-8 border border-primary-dark"
                    style={{ width: token.mobile }}
                  />
                  <span className="text-caption text-foreground-secondary">→</span>
                  <div 
                    className="bg-primary h-8 border border-primary-dark"
                    style={{ width: token.desktop }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Side-by-side comparison of mobile vs desktop spacing
 */
export const MobileVsDesktopComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="font-heading-2">Mobile vs Desktop Spacing Comparison</h2>
      <p className="text-body text-foreground-secondary mb-8">
        Spacing tokens automatically adapt based on viewport width. Resize your browser to see responsive behavior.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mobile Preview */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-heading-3 mb-4">Mobile (320px - 767px)</h3>
          <div className="bg-background-secondary p-[16px] rounded-lg border-2 border-dashed border-primary">
            <div className="bg-background rounded p-[16px] mb-[12px]">
              <p className="text-body">Card with mobile spacing</p>
              <p className="text-caption text-foreground-secondary">card-padding: 16px</p>
            </div>
            <div className="bg-background rounded p-[16px] space-y-[12px]">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <p className="text-caption text-foreground-secondary">form-gap: 12px</p>
            </div>
          </div>
        </div>

        {/* Desktop Preview */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-heading-3 mb-4">Desktop (1024px+)</h3>
          <div className="bg-background-secondary p-[24px] rounded-lg border-2 border-dashed border-primary">
            <div className="bg-background rounded p-[24px] mb-[16px]">
              <p className="text-body">Card with desktop spacing</p>
              <p className="text-caption text-foreground-secondary">card-padding: 24px</p>
            </div>
            <div className="bg-background rounded p-[24px] space-y-[16px]">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <p className="text-caption text-foreground-secondary">form-gap: 16px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the useResponsiveSpacing hook
 */
export const ResponsiveSpacingHook: Story = {
  render: () => {
    const SpacingDemo = () => {
      const { breakpoint, getSpacing, isMobile, isTablet, isDesktop } = useResponsiveSpacing();
      
      const cardPadding = getSpacing({ mobile: '16px', desktop: '24px' });
      const formGap = getSpacing({ mobile: '12px', desktop: '16px' });

      return (
        <div className="space-y-8">
          <div>
            <h2 className="font-heading-2 mb-4">useResponsiveSpacing Hook Demo</h2>
            <p className="text-body text-foreground-secondary mb-4">
              Resize your browser to see the hook detect breakpoint changes.
            </p>
            
            <div className="bg-info-light border border-info rounded-lg p-6 mb-8">
              <h3 className="font-heading-3 mb-2 text-info-dark">Current Breakpoint</h3>
              <div className="flex gap-4 items-center">
                <span className="text-body-large font-semibold text-info-dark">
                  {breakpoint}
                </span>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-body-small ${isMobile ? 'bg-primary text-white' : 'bg-muted text-foreground-secondary'}`}>
                    Mobile
                  </span>
                  <span className={`px-3 py-1 rounded text-body-small ${isTablet ? 'bg-primary text-white' : 'bg-muted text-foreground-secondary'}`}>
                    Tablet
                  </span>
                  <span className={`px-3 py-1 rounded text-body-small ${isDesktop ? 'bg-primary text-white' : 'bg-muted text-foreground-secondary'}`}>
                    Desktop
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg bg-background" style={{ padding: cardPadding }}>
            <h3 className="font-heading-3 mb-2">Dynamic Card Padding</h3>
            <p className="text-body mb-4">
              Current padding: <code className="bg-muted px-2 py-1 rounded text-body-small font-mono">{cardPadding}</code>
            </p>
            <p className="text-body-small text-foreground-secondary">
              This card's padding adapts automatically based on viewport width.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-background">
            <h3 className="font-heading-3 mb-4">Dynamic Form Gap</h3>
            <div className="space-y-4" style={{ gap: formGap }}>
              <div className="h-12 bg-muted rounded flex items-center px-4">
                <span className="text-body-small">Form Field 1</span>
              </div>
              <div className="h-12 bg-muted rounded flex items-center px-4">
                <span className="text-body-small">Form Field 2</span>
              </div>
              <div className="h-12 bg-muted rounded flex items-center px-4">
                <span className="text-body-small">Form Field 3</span>
              </div>
              <p className="text-caption text-foreground-secondary mt-4">
                Gap between fields: <code className="bg-muted px-2 py-1 rounded font-mono">{formGap}</code>
              </p>
            </div>
          </div>

          <div className="bg-warning-light border border-warning rounded-lg p-6">
            <h4 className="font-heading-4 mb-2 text-warning-dark">Usage Example</h4>
            <pre className="bg-background rounded p-4 text-body-small font-mono overflow-x-auto">
{`const { getSpacing } = useResponsiveSpacing();

const cardPadding = getSpacing({ 
  mobile: '16px', 
  desktop: '24px' 
});

<div style={{ padding: cardPadding }}>
  Responsive content
</div>`}
            </pre>
          </div>
        </div>
      );
    };

    return <SpacingDemo />;
  },
};

/**
 * 8-point grid system demonstration
 */
export const EightPointGrid: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-4">8-Point Grid System</h2>
        <p className="text-body text-foreground-secondary mb-8">
          All spacing values are multiples of 8px for visual consistency and mathematical harmony.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[8, 16, 24, 32, 40, 48, 56, 64].map((size) => (
          <div key={size} className="border border-border rounded-lg p-4 bg-background">
            <div 
              className="bg-primary rounded mb-2"
              style={{ width: `${size}px`, height: `${size}px` }}
            />
            <p className="text-body font-medium">{size}px</p>
            <p className="text-caption text-foreground-secondary">{size / 8}× base unit</p>
          </div>
        ))}
      </div>

      <div className="bg-success-light border border-success rounded-lg p-6">
        <h3 className="font-heading-3 mb-2 text-success-dark">Why 8-Point Grid?</h3>
        <ul className="space-y-2 text-body">
          <li className="flex gap-2">
            <span className="text-success-dark">✓</span>
            <span>Easy mental math: 2×, 3×, 4× base unit (8px)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-success-dark">✓</span>
            <span>Divisible by 2 and 4 for flexible layouts</span>
          </li>
          <li className="flex gap-2">
            <span className="text-success-dark">✓</span>
            <span>Industry standard (Material Design, iOS HIG)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-success-dark">✓</span>
            <span>Scales well across different screen densities</span>
          </li>
        </ul>
      </div>
    </div>
  ),
};
