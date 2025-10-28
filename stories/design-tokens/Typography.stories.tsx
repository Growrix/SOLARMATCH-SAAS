import type { Meta, StoryObj } from '@storybook/react';

/**
 * Typography Design Tokens Showcase
 * 
 * Displays all typography tokens from the design system:
 * - Heading levels (h1-h4) with responsive sizes
 * - Body text variants (body, body-large, body-small)
 * - Caption, label, and button text styles
 * - Font families, weights, and line heights
 */

const meta = {
  title: 'Design Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Complete typography system with responsive sizing, semantic naming, and theme-aware styles.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllHeadings: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-caption text-muted-foreground mb-2">Heading 1 - Page titles</p>
        <h1 className="font-heading-1">The quick brown fox jumps over the lazy dog</h1>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 32px • Tablet: 40px • Desktop: 48px
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Heading 2 - Section headings</p>
        <h2 className="font-heading-2">The quick brown fox jumps over the lazy dog</h2>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 28px • Tablet: 32px • Desktop: 36px
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Heading 3 - Subsection headings</p>
        <h3 className="font-heading-3">The quick brown fox jumps over the lazy dog</h3>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 24px • Tablet: 28px • Desktop: 30px
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Heading 4 - Card/component headings</p>
        <h4 className="font-heading-4">The quick brown fox jumps over the lazy dog</h4>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 18px • Tablet: 20px • Desktop: 24px
        </p>
      </div>
    </div>
  ),
};

export const BodyTextVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-caption text-muted-foreground mb-2">Body Large - Emphasis text</p>
        <p className="text-body-large">
          The quick brown fox jumps over the lazy dog. This is larger body text used for emphasis,
          introductory paragraphs, or important content that needs to stand out from regular body text.
        </p>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 16px • Tablet: 18px • Desktop: 20px
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Body - Default paragraph text</p>
        <p className="text-body">
          The quick brown fox jumps over the lazy dog. This is the standard body text used throughout
          the application for most content. It's optimized for readability at various screen sizes and
          maintains comfortable line height for extended reading.
        </p>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 14px • Tablet: 15px • Desktop: 16px
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Body Small - Secondary text</p>
        <p className="text-body-small">
          The quick brown fox jumps over the lazy dog. This is smaller body text used for secondary
          information, helper text, or content that supports the main content but doesn't need to be
          as prominent. Still readable but takes up less space.
        </p>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 13px • Tablet: 14px • Desktop: 14px
        </p>
      </div>
    </div>
  ),
};

export const UtilityTextStyles: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-muted-foreground mb-2">Caption - Smallest text</p>
        <p className="text-caption">
          The quick brown fox jumps over the lazy dog. Caption text for metadata, timestamps, or
          minor supporting information.
        </p>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 12px • Desktop: 12px • Weight: 400
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Label - Form labels</p>
        <label className="text-label">
          The quick brown fox jumps over the lazy dog
        </label>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 13px • Desktop: 14px • Weight: 500
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Button - Button text</p>
        <span className="text-button">
          The quick brown fox jumps over the lazy dog
        </span>
        <p className="text-caption text-muted-foreground mt-1">
          Mobile: 14px • Desktop: 15px • Weight: 600
        </p>
      </div>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-caption text-muted-foreground mb-2">Font Weight: 400 (Regular)</p>
        <p className="text-body font-normal">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Font Weight: 500 (Medium)</p>
        <p className="text-body font-medium">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Font Weight: 600 (Semibold)</p>
        <p className="text-body font-semibold">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">Font Weight: 700 (Bold)</p>
        <p className="text-body font-bold">
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  ),
};

export const ResponsiveScaling: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-4 border border-border rounded-lg bg-muted/20">
        <p className="text-caption text-muted-foreground mb-4">
          Resize your browser window to see responsive typography scaling (320px → 768px → 1024px+)
        </p>
        
        <h1 className="font-heading-1 mb-4">Main Page Heading</h1>
        <h2 className="font-heading-2 mb-4">Section Heading</h2>
        <h3 className="font-heading-3 mb-4">Subsection Heading</h3>
        
        <p className="text-body-large mb-4">
          This is large body text that will scale from 16px on mobile to 20px on desktop,
          maintaining readability across all devices.
        </p>
        
        <p className="text-body mb-4">
          This is regular body text that will scale from 14px on mobile to 16px on desktop.
          The line height and letter spacing are optimized for comfortable reading at each size.
        </p>
        
        <p className="text-body-small">
          This is small body text that maintains readability even at smaller sizes across all devices.
        </p>
      </div>
    </div>
  ),
};

export const TypographyHierarchy: Story = {
  render: () => (
    <article className="max-w-3xl space-y-6">
      <h1 className="font-heading-1">
        Design Token System: Typography
      </h1>
      
      <p className="text-body-large">
        A comprehensive typography system built on semantic tokens that adapt to screen size,
        theme, and user preferences. Change the base font size once, and the entire hierarchy
        scales proportionally.
      </p>
      
      <h2 className="font-heading-2">
        Why Typography Tokens Matter
      </h2>
      
      <p className="text-body">
        Typography tokens enable instant design changes across your entire application. Instead
        of manually updating font sizes in dozens of files, you edit a single token file and
        rebuild. The changes cascade throughout your app automatically.
      </p>
      
      <h3 className="font-heading-3">
        Responsive by Default
      </h3>
      
      <p className="text-body">
        All typography tokens are responsive. Headings and body text automatically scale based
        on screen size, ensuring optimal readability on mobile devices, tablets, and desktops.
        No media queries needed in your components.
      </p>
      
      <h4 className="font-heading-4">
        Semantic Naming for Clarity
      </h4>
      
      <p className="text-body">
        Instead of abstract sizes like "text-lg" or "text-2xl", our tokens use semantic names
        like "text-body" and "font-heading-2". This makes it clear what each token is for and
        when to use it.
      </p>
      
      <p className="text-body-small text-muted-foreground">
        Last updated: October 28, 2025 • Design System v1.0
      </p>
    </article>
  ),
};

export const FontFamilies: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-muted-foreground mb-2">
          Heading Font: var(--font-heading) - Geist Sans
        </p>
        <h1 className="font-heading-1">The quick brown fox jumps over the lazy dog</h1>
        <h2 className="font-heading-2">The quick brown fox jumps over the lazy dog</h2>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">
          Body Font: var(--font-body) - Geist Sans
        </p>
        <p className="text-body-large">The quick brown fox jumps over the lazy dog</p>
        <p className="text-body">The quick brown fox jumps over the lazy dog</p>
        <p className="text-body-small">The quick brown fox jumps over the lazy dog</p>
      </div>

      <div>
        <p className="text-caption text-muted-foreground mb-2">
          Monospace Font: var(--font-mono) - Geist Mono
        </p>
        <code className="text-body font-mono">
          const example = "The quick brown fox jumps over the lazy dog";
        </code>
      </div>
    </div>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="max-w-4xl">
      <div className="bg-background border border-border rounded-lg p-card-padding">
        <h2 className="font-heading-2 mb-4">Solar Installation Quote</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-label block mb-2">Property Address</label>
            <p className="text-body">123 Main Street, San Francisco, CA 94102</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label block mb-2">System Size</label>
              <p className="text-body-large font-semibold">8.5 kW</p>
              <p className="text-caption text-muted-foreground">Average for your home</p>
            </div>

            <div>
              <label className="text-label block mb-2">Estimated Cost</label>
              <p className="text-body-large font-semibold">$25,500</p>
              <p className="text-caption text-muted-foreground">After federal tax credit</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading-3 mb-3">Benefits</h3>
            <ul className="space-y-2 text-body">
              <li>• Save $1,200/year on electricity bills</li>
              <li>• Reduce carbon footprint by 10 tons/year</li>
              <li>• Increase home value by $30,000</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-body-small text-muted-foreground">
              This quote is valid for 30 days. Final pricing may vary based on site assessment.
              Contact us at (555) 123-4567 for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
