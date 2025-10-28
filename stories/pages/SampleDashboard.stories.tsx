import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '@/hooks/useChartColors';

/**
 * Dashboard Chart Story
 * 
 * Demonstrates instant rebranding across complex data visualizations with multiple colors.
 * Tests design token integration with Recharts for consistent theming.
 * 
 * **Instant Rebranding Test:**
 * 1. Baseline: Capture Chromatic snapshot with current colors (teal/amber)
 * 2. Change: Update `colors.primary` (teal → blue) and `colors.secondary` (amber → purple) in semantic/colors.ts
 * 3. Rebuild: `npm run build-storybook`
 * 4. Verify: Run `npx chromatic` - All charts, buttons, badges should reflect new colors
 * 5. Expected: ~20 visual diffs (all color-only, no layout changes)
 */

const meta: Meta = {
  title: 'Pages/Sample Dashboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete dashboard page demonstrating design token usage across charts, buttons, badges, and text. Perfect for testing instant rebranding.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 },
];

const leadsData = [
  { week: 'Week 1', leads: 45, conversions: 12 },
  { week: 'Week 2', leads: 52, conversions: 18 },
  { week: 'Week 3', leads: 48, conversions: 15 },
  { week: 'Week 4', leads: 61, conversions: 22 },
];

/**
 * Button Component (Reused from Button.stories.tsx)
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', children }: ButtonProps) => {
  const baseClasses = 'font-button rounded-button transition-all duration-fast shadow-button focus:outline-none focus:ring-2 focus:ring-border-focus';
  const sizeClasses = { sm: 'text-sm px-3 py-1.5', md: 'text-base px-button-padding-x py-button-padding-y', lg: 'text-lg px-6 py-3' };
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-secondary hover:bg-secondary-hover text-gray-900',
    success: 'bg-success hover:bg-green-600 text-white',
    error: 'bg-error hover:bg-red-700 text-white',
    outline: 'bg-transparent hover:bg-background-alt border-2 border-primary text-primary',
  };

  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

/**
 * Badge Component
 */
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

const Badge = ({ variant = 'info', children }: BadgeProps) => {
  const variantClasses = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-gray-900',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

/**
 * Revenue Chart Component
 */
const RevenueChart = () => {
  const chartColors = useChartColors();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis dataKey="month" stroke={chartColors.axis} />
        <YAxis stroke={chartColors.axis} />
        <Tooltip
          contentStyle={{
            backgroundColor: chartColors.isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${chartColors.grid}`,
            borderRadius: '8px',
            color: chartColors.text,
          }}
        />
        <Legend wrapperStyle={{ color: chartColors.text }} />
        <Bar dataKey="revenue" fill={chartColors.primary} name="Revenue" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expenses" fill={chartColors.secondary} name="Expenses" radius={[8, 8, 0, 0]} />
        <Bar dataKey="profit" fill={chartColors.success} name="Profit" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Leads Chart Component
 */
const LeadsChart = () => {
  const chartColors = useChartColors();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={leadsData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis dataKey="week" stroke={chartColors.axis} />
        <YAxis stroke={chartColors.axis} />
        <Tooltip
          contentStyle={{
            backgroundColor: chartColors.isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${chartColors.grid}`,
            borderRadius: '8px',
            color: chartColors.text,
          }}
        />
        <Legend wrapperStyle={{ color: chartColors.text }} />
        <Line type="monotone" dataKey="leads" stroke={chartColors.primary} strokeWidth={3} name="Total Leads" dot={{ fill: chartColors.primary, r: 6 }} />
        <Line type="monotone" dataKey="conversions" stroke={chartColors.success} strokeWidth={3} name="Conversions" dot={{ fill: chartColors.success, r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * Full Dashboard Story
 * 
 * Complete dashboard page with multiple charts, cards, buttons, and badges.
 * Best for testing instant rebranding across all UI elements.
 */
export const FullDashboard: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-heading-1 font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-body text-muted">Sample dashboard demonstrating design token integration • Instant rebranding test page</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-label text-muted">Total Revenue</p>
            <Badge variant="success">+12%</Badge>
          </div>
          <p className="text-heading-2 font-bold text-foreground">$328,000</p>
          <p className="text-caption text-subtle mt-2">↑ From $293,000 last month</p>
        </div>

        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-label text-muted">Active Leads</p>
            <Badge variant="info">206 Total</Badge>
          </div>
          <p className="text-heading-2 font-bold text-foreground">206</p>
          <p className="text-caption text-subtle mt-2">↑ 18 new this week</p>
        </div>

        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-label text-muted">Conversion Rate</p>
            <Badge variant="success">29.6%</Badge>
          </div>
          <p className="text-heading-2 font-bold text-foreground">29.6%</p>
          <p className="text-caption text-subtle mt-2">↑ 3.2% from last month</p>
        </div>

        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-label text-muted">Avg. Deal Size</p>
            <Badge variant="warning">-5%</Badge>
          </div>
          <p className="text-heading-2 font-bold text-foreground">$4,850</p>
          <p className="text-caption text-subtle mt-2">↓ From $5,100 last month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-3 font-semibold text-foreground">Revenue Overview</h2>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
          <RevenueChart />
        </div>

        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-3 font-semibold text-foreground">Leads & Conversions</h2>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
          <LeadsChart />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Create New Lead</Button>
        <Button variant="secondary">Generate Report</Button>
        <Button variant="success">Approve Pending</Button>
        <Button variant="error">Delete Selected</Button>
        <Button variant="outline">More Options</Button>
      </div>
    </div>
  ),
};

/**
 * Charts Only Story
 * 
 * Isolated view of charts for focused color testing.
 * Tests Recharts integration with theme-aware colors.
 */
export const ChartsOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-heading-1 font-bold text-foreground mb-8">Chart Color Testing</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <h2 className="text-heading-3 font-semibold text-foreground mb-4">Bar Chart (Primary/Secondary/Success)</h2>
          <RevenueChart />
        </div>

        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <h2 className="text-heading-3 font-semibold text-foreground mb-4">Line Chart (Primary/Success)</h2>
          <LeadsChart />
        </div>
      </div>
    </div>
  ),
};

/**
 * UI Elements Only Story
 * 
 * Isolated view of buttons, badges, and text for focused color testing.
 * Tests semantic color application across UI components.
 */
export const UIElementsOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-heading-1 font-bold text-foreground mb-8">UI Elements Color Testing</h1>

      <div className="space-y-8">
        {/* Buttons */}
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <h2 className="text-heading-3 font-semibold text-foreground mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="error">Error</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <h2 className="text-heading-3 font-semibold text-foreground mb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="error">Error Badge</Badge>
            <Badge variant="info">Info Badge</Badge>
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-surface p-card-padding rounded-card shadow-card border border-border">
          <h2 className="text-heading-3 font-semibold text-foreground mb-4">Text Colors</h2>
          <div className="space-y-2">
            <p className="text-body text-foreground">Foreground text (primary)</p>
            <p className="text-body text-muted">Muted text (secondary)</p>
            <p className="text-body text-subtle">Subtle text (tertiary)</p>
            <p className="text-body text-primary">Primary accent text</p>
            <p className="text-body text-success">Success status text</p>
            <p className="text-body text-error">Error status text</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
