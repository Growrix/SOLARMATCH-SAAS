import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Typography Scales Comparison
 * 
 * Side-by-side comparison of different base font sizes to demonstrate
 * how the typography system maintains hierarchy when scaling.
 * 
 * Use this to:
 * - Test different base font sizes (14px vs 16px vs 18px)
 * - Verify hierarchy preservation when changing font size
 * - Ensure readability at different scales
 */

const meta = {
  title: 'Design Tokens/Typography Scales',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Compare typography scales side-by-side to see how changing the base font size affects the entire hierarchy.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = ({ label }: { label: string }) => (
  <div className="p-6 border border-border rounded-lg bg-background">
    <p className="text-caption text-muted-foreground mb-4">{label}</p>
    
    <h1 className="font-heading-1 mb-3">Page Heading (H1)</h1>
    <h2 className="font-heading-2 mb-3">Section Heading (H2)</h2>
    <h3 className="font-heading-3 mb-3">Subsection Heading (H3)</h3>
    <h4 className="font-heading-4 mb-4">Component Heading (H4)</h4>
    
    <p className="text-body-large mb-3">
      Large body text for emphasis and introductory content.
    </p>
    
    <p className="text-body mb-3">
      Regular body text for main content. Optimized for readability.
    </p>
    
    <p className="text-body-small mb-3">
      Small body text for secondary information.
    </p>
    
    <p className="text-caption">
      Caption text for metadata and timestamps.
    </p>
  </div>
);

export const CurrentSystem: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading-1 mb-6">Current Typography System</h1>
      <p className="text-body mb-8 max-w-2xl">
        This is the current typography system with responsive sizing. Headings and body text
        scale from mobile (320px) to desktop (1024px+) automatically.
      </p>
      <SampleContent label="Current System (14px → 16px base)" />
    </div>
  ),
};

export const ComparisonGrid: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading-1 mb-4">Typography Scale Comparison</h1>
      <p className="text-body mb-8 max-w-3xl">
        Compare three different base font sizes side-by-side. Notice how the hierarchy remains
        consistent regardless of the base size - headings stay proportionally larger than body
        text, and all elements maintain their visual relationships.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="font-heading-3 mb-4">14px Base (Small)</h2>
          <div className="scale-[0.875] origin-top">
            <SampleContent label="Compact Scale" />
          </div>
          <p className="text-body-small text-muted-foreground mt-3">
            Best for: Dense interfaces, data tables, admin panels
          </p>
        </div>

        <div>
          <h2 className="font-heading-3 mb-4">16px Base (Current)</h2>
          <SampleContent label="Standard Scale" />
          <p className="text-body-small text-muted-foreground mt-3">
            Best for: General applications, balanced readability
          </p>
        </div>

        <div>
          <h2 className="font-heading-3 mb-4">18px Base (Large)</h2>
          <div className="scale-[1.125] origin-top">
            <SampleContent label="Comfortable Scale" />
          </div>
          <p className="text-body-small text-muted-foreground mt-3">
            Best for: Content-heavy apps, accessibility, senior users
          </p>
        </div>
      </div>
    </div>
  ),
};

export const MobileToDesktop: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading-1 mb-4">Mobile to Desktop Scaling</h1>
      <p className="text-body mb-8 max-w-2xl">
        Typography tokens automatically scale based on screen width. Resize your browser
        window to see the responsive behavior in action.
      </p>
      
      <div className="space-y-8">
        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <p className="text-caption text-muted-foreground mb-4">
            📱 Mobile (320px-767px)
          </p>
          <div className="max-w-sm mx-auto space-y-4">
            <h1 className="font-heading-1">32px Heading</h1>
            <p className="text-body">14px body text, optimized for small screens</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <p className="text-caption text-muted-foreground mb-4">
            📱 Tablet (768px-1023px)
          </p>
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="font-heading-1">40px Heading</h1>
            <p className="text-body">15px body text, transitioning to desktop sizes</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <p className="text-caption text-muted-foreground mb-4">
            🖥️ Desktop (1024px+)
          </p>
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="font-heading-1">48px Heading</h1>
            <p className="text-body">16px body text, full desktop experience</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const HierarchyPreservation: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading-1 mb-4">Hierarchy Preservation Test</h1>
      <p className="text-body mb-8 max-w-2xl">
        When you change the base font size, the entire hierarchy scales proportionally.
        This ensures that headings always remain larger than body text, and the visual
        relationships between elements stay consistent.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-border rounded-lg p-6">
          <h3 className="font-heading-3 mb-4">Before (16px base)</h3>
          <article className="space-y-4">
            <h1 className="font-heading-1">H1: 48px</h1>
            <h2 className="font-heading-2">H2: 36px (75% of H1)</h2>
            <h3 className="font-heading-3">H3: 30px (62% of H1)</h3>
            <h4 className="font-heading-4">H4: 24px (50% of H1)</h4>
            <p className="text-body">Body: 16px (33% of H1)</p>
          </article>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h3 className="font-heading-3 mb-4">After (18px base, simulated)</h3>
          <article className="space-y-4 scale-[1.125] origin-top-left">
            <h1 className="font-heading-1">H1: 54px</h1>
            <h2 className="font-heading-2">H2: 40.5px (75% of H1)</h2>
            <h3 className="font-heading-3">H3: 33.75px (62% of H1)</h3>
            <h4 className="font-heading-4">H4: 27px (50% of H1)</h4>
            <p className="text-body">Body: 18px (33% of H1)</p>
          </article>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
        <h4 className="font-heading-4 mb-2">✅ Hierarchy Preserved</h4>
        <p className="text-body-small">
          Notice how the ratios between heading levels remain constant. H2 is always 75% of H1,
          H3 is always 62% of H1, etc. This maintains the visual hierarchy regardless of the
          absolute font sizes.
        </p>
      </div>
    </div>
  ),
};

export const ReadabilityTest: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="font-heading-1 mb-4">Readability Comparison</h1>
      <p className="text-body mb-8 max-w-2xl">
        Test different font sizes for readability. The ideal font size depends on your
        audience, content type, and screen size.
      </p>
      
      <div className="space-y-8">
        <div className="border border-border rounded-lg p-6">
          <h3 className="font-heading-3 mb-4">14px Body Text (Compact)</h3>
          <div className="max-w-2xl scale-[0.875] origin-top-left">
            <p className="text-body leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
              irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
          </div>
          <p className="text-caption text-muted-foreground mt-3">
            Good for: Admin interfaces, dense data displays
          </p>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h3 className="font-heading-3 mb-4">16px Body Text (Standard)</h3>
          <div className="max-w-2xl">
            <p className="text-body leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
              irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
          </div>
          <p className="text-caption text-muted-foreground mt-3">
            Good for: Most applications, balanced experience
          </p>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h3 className="font-heading-3 mb-4">18px Body Text (Comfortable)</h3>
          <div className="max-w-2xl scale-[1.125] origin-top-left">
            <p className="text-body leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
              irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
          </div>
          <p className="text-caption text-muted-foreground mt-3">
            Good for: Content-focused apps, accessibility, marketing sites
          </p>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityNotes: Story = {
  render: () => (
    <div className="p-8 max-w-4xl">
      <h1 className="font-heading-1 mb-4">Accessibility & Font Size Guidelines</h1>
      
      <div className="space-y-6">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-heading-3 mb-2">✅ WCAG Recommendations</h3>
          <ul className="space-y-2 text-body">
            <li>• Minimum body text size: 16px (1rem) on desktop</li>
            <li>• Allow users to zoom up to 200% without breaking layout</li>
            <li>• Line height at least 1.5x font size for body text</li>
            <li>• Paragraph spacing at least 2x font size</li>
          </ul>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-heading-3 mb-2">💡 Best Practices</h3>
          <ul className="space-y-2 text-body">
            <li>• Use relative units (rem/em) instead of pixels for better scaling</li>
            <li>• Test with browser zoom at 125%, 150%, and 200%</li>
            <li>• Consider users with visual impairments who may use larger fonts</li>
            <li>• Provide comfortable reading width (45-75 characters per line)</li>
          </ul>
        </div>

        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="font-heading-3 mb-2">⚠️ Common Mistakes</h3>
          <ul className="space-y-2 text-body">
            <li>• Using fonts smaller than 14px for body text (hard to read)</li>
            <li>• Fixed pixel widths that prevent text from scaling</li>
            <li>• Insufficient contrast between text and background</li>
            <li>• Tight line-height that makes text cramped</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
