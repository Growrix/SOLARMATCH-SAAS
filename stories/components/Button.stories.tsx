import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

/**
 * Button Component Story
 * 
 * Demonstrates how design tokens are used in button components across all themes, sizes, and states.
 * Use this to verify instant rebranding: change `colors.primary` → rebuild → all buttons update.
 * 
 * **Testing Workflow:**
 * 1. Baseline: Capture Chromatic snapshot with current colors
 * 2. Change: Update `colors.primary` from teal to blue in semantic/colors.ts
 * 3. Rebuild: `npm run build-storybook`
 * 4. Verify: Run `npx chromatic` and check diffs show only color changes
 */

const meta: Meta = {
  title: 'Components/Button',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component using centralized design tokens for consistent theming across all variants and states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Button Component (Demo)
 * 
 * Demonstrates design token usage with className utilities from Tailwind.
 * In production, extract to reusable component in src/components/Button.tsx.
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'primary', size = 'md', disabled = false, children, onClick }: ButtonProps) => {
  // Base classes (consistent across all variants)
  const baseClasses = 'font-button rounded-button transition-all duration-fast shadow-button focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2';

  // Size classes (using semantic spacing tokens)
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-button-padding-x py-button-padding-y',
    lg: 'text-lg px-6 py-3',
  };

  // Variant classes (using semantic color tokens)
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover text-white disabled:bg-muted disabled:text-subtle',
    secondary: 'bg-secondary hover:bg-secondary-hover text-gray-900 disabled:bg-muted disabled:text-subtle',
    success: 'bg-success hover:bg-green-600 text-white disabled:bg-muted disabled:text-subtle',
    error: 'bg-error hover:bg-red-700 text-white disabled:bg-muted disabled:text-subtle',
    outline: 'bg-transparent hover:bg-background-alt border-2 border-primary text-primary hover:text-primary-hover disabled:border-border disabled:text-muted',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/**
 * All Variants Story
 * 
 * Displays all button variants (primary, secondary, success, error, outline) in enabled state.
 * Tests instant rebranding: primary color change should update all primary buttons immediately.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-900">
      <div>
        <h2 className="text-heading-2 font-semibold text-foreground mb-4">Button Variants</h2>
        <p className="text-body text-muted mb-6">All button variants using semantic color tokens</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="error">Error Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * All Sizes Story
 * 
 * Displays all button sizes (sm, md, lg) using semantic spacing tokens.
 * Tests responsive spacing: spacing.button-padding-x/y should apply correctly.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-900">
      <div>
        <h2 className="text-heading-2 font-semibold text-foreground mb-4">Button Sizes</h2>
        <p className="text-body text-muted mb-6">Small, Medium, Large using semantic spacing tokens</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">Small Button</Button>
          <Button variant="primary" size="md">Medium Button</Button>
          <Button variant="primary" size="lg">Large Button</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * All States Story
 * 
 * Displays all button states (normal, hover, focus, disabled) for accessibility testing.
 * Tests focus ring: border-focus color should be visible and meet WCAG contrast requirements.
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-900">
      <div>
        <h2 className="text-heading-2 font-semibold text-foreground mb-4">Button States</h2>
        <p className="text-body text-muted mb-6">Normal, Hover (simulate), Disabled states</p>
        <div className="space-y-6">
          <div>
            <h3 className="text-label text-foreground mb-2">Normal State</h3>
            <Button variant="primary">Normal Button</Button>
          </div>
          <div>
            <h3 className="text-label text-foreground mb-2">Disabled State</h3>
            <Button variant="primary" disabled>Disabled Button</Button>
          </div>
          <div>
            <h3 className="text-label text-foreground mb-2">Focus State (Tab to button)</h3>
            <Button variant="primary">Focus Test Button</Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Theme Comparison Story
 * 
 * Side-by-side comparison of buttons in light and dark themes.
 * Tests theme-aware colors: primary.light vs primary.dark should display correctly.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-100 dark:bg-gray-800">
      {/* Light Theme */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Light Theme</h2>
        <div className="space-y-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="error">Error Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>

      {/* Dark Theme */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-card">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Dark Theme</h2>
        <div className="space-y-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="error">Error Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive Example Story
 * 
 * Fully interactive button with click handler demonstrating runtime behavior.
 * Tests hover transitions: should use animation.duration.fast (150ms).
 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);

    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-900">
        <h2 className="text-heading-2 font-semibold text-foreground">Interactive Button Demo</h2>
        <p className="text-body text-muted">Click count: <span className="font-bold text-primary">{count}</span></p>
        <Button variant="primary" size="lg" onClick={() => setCount(count + 1)}>
          Click Me! ({count})
        </Button>
        <p className="text-caption text-subtle">Uses animation.duration.fast (150ms) for hover transitions</p>
      </div>
    );
  },
};
