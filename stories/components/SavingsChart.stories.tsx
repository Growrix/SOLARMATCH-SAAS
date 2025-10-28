import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import SavingsChart from '@/components/SavingsChart';

/**
 * SavingsChart Demo - Now Using Design Tokens! ✅
 * 
 * This chart demonstrates the migration from hardcoded colors to design tokens.
 * 
 * BEFORE (Hardcoded):
 * - Gradient: #10b981 (green-500) ❌
 * - Grid: rgba(100, 116, 139, 0.2) ❌
 * - Break-even line: #0D9488 (teal-600) ❌
 * - Bar fill: #0D9488 ❌
 * 
 * AFTER (Design Tokens):
 * - All colors from useChartColors() hook ✅
 * - Automatically adapts to light/dark theme ✅
 * - Brand colors update instantly ✅
 * - Fully editable via primitives/colors.ts ✅
 */
const meta: Meta<typeof SavingsChart> = {
  title: 'Components/SavingsChart (Migrated)',
  component: SavingsChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SavingsChart - Now Using Design Tokens! 🎨

This component shows the financial projections for solar panel installation, including:
- **ROI Chart**: 25-year net savings projection with break-even point
- **Annual Cost Chart**: Before/after comparison

## Migration Complete ✅

All hardcoded colors have been replaced with design tokens:

\`\`\`tsx
// OLD (Hardcoded)
<Area stroke="#10b981" fill="url(#colorSavings)" />
<ReferenceLine stroke="#0D9488" />
<CartesianGrid stroke="rgba(100, 116, 139, 0.2)" />

// NEW (Design Tokens)
<Area stroke={chartColors.success} fill="url(#colorSavings)" />
<ReferenceLine stroke={chartColors.primary} />
<CartesianGrid stroke={chartColors.grid} />
\`\`\`

## Benefits

✅ **Theme-Aware**: Automatically adapts to light/dark theme
✅ **Editable**: Change colors in \`primitives/colors.ts\` → entire chart updates
✅ **Consistent**: Uses same colors as other charts across the app
✅ **Maintainable**: Single source of truth for all colors

## Try It!

Toggle between Light/Dark themes to see the chart colors adapt automatically!
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SavingsChart>;

/**
 * Default Example - Standard Solar Installation
 */
export const Default: Story = {
  args: {
    finalPrice: 8500,
    annualSavings: 1200,
    currentAnnualBill: 2400,
  },
};

/**
 * Large System - Higher Investment, Greater Savings
 */
export const LargeSystem: Story = {
  args: {
    finalPrice: 15000,
    annualSavings: 2500,
    currentAnnualBill: 4200,
  },
};

/**
 * Small System - Budget-Friendly Option
 */
export const SmallSystem: Story = {
  args: {
    finalPrice: 5000,
    annualSavings: 800,
    currentAnnualBill: 1500,
  },
};

/**
 * Quick Payback - Fast ROI
 */
export const QuickPayback: Story = {
  args: {
    finalPrice: 6000,
    annualSavings: 1500,
    currentAnnualBill: 2800,
  },
};

/**
 * Long Payback - Higher Investment
 */
export const LongPayback: Story = {
  args: {
    finalPrice: 12000,
    annualSavings: 1000,
    currentAnnualBill: 2200,
  },
};

/**
 * Side-by-Side Comparison
 * Shows multiple scenarios to demonstrate chart color consistency
 */
export const Comparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 font-bold text-foreground mb-4">
          Chart Color Consistency Demo
        </h2>
        <p className="text-body text-subtle mb-6">
          All charts use the same design tokens for colors. Toggle Light/Dark theme to see automatic adaptation!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-heading-3 font-semibold text-foreground mb-2">
            Budget System ($5,000)
          </h3>
          <SavingsChart 
            finalPrice={5000}
            annualSavings={800}
            currentAnnualBill={1500}
          />
        </div>
        
        <div>
          <h3 className="text-heading-3 font-semibold text-foreground mb-2">
            Premium System ($15,000)
          </h3>
          <SavingsChart 
            finalPrice={15000}
            annualSavings={2500}
            currentAnnualBill={4200}
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mt-8">
        <h3 className="text-heading-3 font-semibold text-foreground mb-4">
          🎨 Design Token Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-body text-foreground font-semibold">Theme-Aware Colors</p>
              <p className="text-small text-subtle">
                Charts automatically adapt to light/dark theme without code changes
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-body text-foreground font-semibold">Instant Rebranding</p>
              <p className="text-small text-subtle">
                Change primitives.teal → All charts update automatically
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-body text-foreground font-semibold">Color Consistency</p>
              <p className="text-small text-subtle">
                Same colors across all charts - no more mismatched visualizations
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-body text-foreground font-semibold">Zero Hardcoded Colors</p>
              <p className="text-small text-subtle">
                All colors from design tokens - fully editable and updateable
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent bg-opacity-10 border-l-4 border-accent rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-bold text-lg mb-1 text-accent">Try It Now!</h4>
            <p className="text-foreground">
              Click the theme switcher in the Storybook toolbar (sun/moon icon) to toggle between Light and Dark themes.
              Watch how the chart colors adapt automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
