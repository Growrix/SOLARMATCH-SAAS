/**
 * White-Label Demo - Theme Comparison
 * 
 * Demonstrates the instant rebranding capability of the design token system
 * by showing the same UI rendered with different client themes.
 * 
 * Use Case: Business wants to create white-label versions of SolarMatch
 * for different solar installation companies, each with their own branding.
 * 
 * Test: Toggle between "Default" and "TechCorp Blue" themes to see instant rebrand.
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import { defaultTheme, clientBlueTheme, type Theme } from '../../src/design-tokens/themes'

/**
 * White-Label Demo Component
 * 
 * Shows a sample dashboard page with multiple UI components
 * that automatically update when theme is switched.
 */
function WhiteLabelDemoComponent() {
  const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme)
  const isDefaultTheme = activeTheme.id === 'default'

  // Apply theme colors dynamically via CSS variables
  React.useEffect(() => {
    const root = document.documentElement
    const colors = activeTheme.colors

    // Set CSS variables for primary/secondary colors
    root.style.setProperty('--demo-primary', colors.primary?.light || '')
    root.style.setProperty('--demo-secondary', colors.secondary?.light || '')
    root.style.setProperty('--demo-success', colors.success?.light || '')
    root.style.setProperty('--demo-warning', colors.warning?.light || '')
    root.style.setProperty('--demo-error', colors.error?.light || '')
  }, [activeTheme])

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Theme Switcher Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border mb-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-heading-1 font-bold text-foreground mb-4">
            White-Label Theme Demo
          </h1>
          <p className="text-body text-foreground-secondary mb-4">
            Toggle between themes to see instant rebranding. All components automatically
            update when theme changes - no custom theme logic needed in components!
          </p>
          
          <div className="flex gap-4 items-center">
            <span className="text-body-small text-foreground-secondary font-semibold">
              Active Theme:
            </span>
            
            {/* Default Theme Button */}
            <button
              onClick={() => setActiveTheme(defaultTheme)}
              className={`
                px-6 py-3 rounded-button text-button font-semibold
                transition-all duration-200
                ${isDefaultTheme
                  ? 'bg-primary text-white shadow-button'
                  : 'bg-surface border-2 border-border text-foreground hover:border-primary'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                SolarMatch Default (Teal + Amber)
              </span>
            </button>
            
            {/* Client Blue Theme Button */}
            <button
              onClick={() => setActiveTheme(clientBlueTheme)}
              className={`
                px-6 py-3 rounded-button text-button font-semibold
                transition-all duration-200
                ${!isDefaultTheme
                  ? 'text-white shadow-button'
                  : 'bg-surface border-2 border-border text-foreground hover:border-blue-800'
                }
              `}
              style={!isDefaultTheme ? {
                backgroundColor: clientBlueTheme.colors.primary?.light
              } : {}}
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-800"></span>
                TechCorp Blue (Blue + Sky Blue)
              </span>
            </button>
          </div>

          {/* Theme Info */}
          <div className="mt-4 p-4 bg-muted rounded-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-small">
              <div>
                <span className="text-foreground-muted">Theme ID:</span>
                <span className="ml-2 font-mono text-foreground">{activeTheme.id}</span>
              </div>
              <div>
                <span className="text-foreground-muted">Client:</span>
                <span className="ml-2 font-semibold text-foreground">{activeTheme.client}</span>
              </div>
              <div>
                <span className="text-foreground-muted">Primary:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: activeTheme.colors.primary?.light }}
                  ></div>
                  <span className="font-mono text-xs text-foreground">
                    {activeTheme.colors.primary?.light}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-foreground-muted">Secondary:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: activeTheme.colors.secondary?.light }}
                  ></div>
                  <span className="font-mono text-xs text-foreground">
                    {activeTheme.colors.secondary?.light}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Dashboard Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-card shadow-card">
          <h2 className="text-heading-2 font-bold mb-2">
            Welcome to {activeTheme.client}
          </h2>
          <p className="text-body-large opacity-90 mb-6">
            Your trusted partner for solar energy solutions
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-primary px-6 py-3 rounded-button font-semibold hover:shadow-dropdown transition-shadow">
              Get Started
            </button>
            <button className="bg-white/10 backdrop-blur text-white border-2 border-white/30 px-6 py-3 rounded-button font-semibold hover:bg-white/20 transition-colors">
              Learn More
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section>
          <h3 className="text-heading-3 font-bold text-foreground mb-4">
            Dashboard Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Leads Card */}
            <div className="bg-surface p-6 rounded-card border border-border shadow-card hover:shadow-dropdown transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body text-foreground-secondary">Total Leads</span>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-heading-2 font-bold text-foreground">2,847</p>
              <p className="text-body-small text-success mt-1">↑ 12% from last month</p>
            </div>

            {/* Active Projects Card */}
            <div className="bg-surface p-6 rounded-card border border-border shadow-card hover:shadow-dropdown transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body text-foreground-secondary">Active Projects</span>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-heading-2 font-bold text-foreground">186</p>
              <p className="text-body-small text-warning mt-1">↑ 5% from last month</p>
            </div>

            {/* Revenue Card */}
            <div className="bg-surface p-6 rounded-card border border-border shadow-card hover:shadow-dropdown transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body text-foreground-secondary">Revenue</span>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-heading-2 font-bold text-foreground">$1.2M</p>
              <p className="text-body-small text-success mt-1">↑ 18% from last month</p>
            </div>
          </div>
        </section>

        {/* Action Buttons Section */}
        <section>
          <h3 className="text-heading-3 font-bold text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Primary Button */}
            <button className="bg-primary text-white px-6 py-4 rounded-button font-semibold hover:shadow-dropdown transition-all hover:scale-105">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Lead</span>
              </div>
            </button>

            {/* Secondary Button */}
            <button className="bg-secondary text-white px-6 py-4 rounded-button font-semibold hover:shadow-dropdown transition-all hover:scale-105">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Schedule</span>
              </div>
            </button>

            {/* Success Button */}
            <button className="bg-success text-white px-6 py-4 rounded-button font-semibold hover:shadow-dropdown transition-all hover:scale-105">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Approve</span>
              </div>
            </button>

            {/* Info Button */}
            <button className="bg-info text-white px-6 py-4 rounded-button font-semibold hover:shadow-dropdown transition-all hover:scale-105">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help</span>
              </div>
            </button>
          </div>
        </section>

        {/* Status Badges Section */}
        <section>
          <h3 className="text-heading-3 font-bold text-foreground mb-4">
            Lead Status Overview
          </h3>
          <div className="bg-surface p-6 rounded-card border border-border shadow-card">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-badge border border-primary/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                New (42)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-badge border border-secondary/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                In Progress (28)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-badge border border-success/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Approved (156)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-badge border border-warning/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                Pending (13)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-badge border border-error/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                Rejected (7)
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-info/10 text-info rounded-badge border border-info/20 font-semibold">
                <span className="w-2 h-2 rounded-full bg-info"></span>
                On Hold (5)
              </span>
            </div>
          </div>
        </section>

        {/* Recent Activity Table */}
        <section>
          <h3 className="text-heading-3 font-bold text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-body-small font-semibold text-foreground">Lead ID</th>
                  <th className="text-left px-6 py-4 text-body-small font-semibold text-foreground">Customer</th>
                  <th className="text-left px-6 py-4 text-body-small font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-body-small font-semibold text-foreground">Value</th>
                  <th className="text-left px-6 py-4 text-body-small font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-body text-foreground font-mono">#2847</td>
                  <td className="px-6 py-4 text-body text-foreground">John Smith</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-success/10 text-success rounded-badge text-body-small font-semibold">
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body text-foreground font-semibold">$45,000</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary/80 font-semibold text-body-small">
                      View Details →
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-body text-foreground font-mono">#2846</td>
                  <td className="px-6 py-4 text-body text-foreground">Sarah Johnson</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-warning/10 text-warning rounded-badge text-body-small font-semibold">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body text-foreground font-semibold">$32,500</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary/80 font-semibold text-body-small">
                      View Details →
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-body text-foreground font-mono">#2845</td>
                  <td className="px-6 py-4 text-body text-foreground">Mike Davis</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-badge text-body-small font-semibold">
                      New
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body text-foreground font-semibold">$28,750</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary/80 font-semibold text-body-small">
                      View Details →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="bg-info/10 border-l-4 border-info p-6 rounded-card">
          <h3 className="text-heading-4 font-bold text-info mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            White-Label Key Takeaways
          </h3>
          <ul className="space-y-2 text-body text-foreground-secondary">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong className="text-foreground">Zero component changes:</strong> All components automatically use new theme colors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong className="text-foreground">Instant rebrand:</strong> Change 2 color tokens → entire app updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong className="text-foreground">Status colors unchanged:</strong> Success/Warning/Error/Info remain consistent across all brands</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong className="text-foreground">Theme-aware:</strong> Light/Dark modes work automatically for all white-label themes</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  )
}

// Storybook Meta
const meta: Meta<typeof WhiteLabelDemoComponent> = {
  title: 'Pages/WhiteLabelDemo',
  component: WhiteLabelDemoComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# White-Label Demo

Demonstrates the instant rebranding capability of the centralized design token system.

## Key Features

- **Instant Rebrand**: Toggle between themes to see entire dashboard update
- **Zero Component Changes**: All components automatically use theme colors
- **Consistent Status Colors**: Success/Warning/Error/Info remain the same across brands
- **Theme-Aware**: Light/Dark modes work for all white-label themes

## Usage

1. Toggle between "SolarMatch Default" and "TechCorp Blue" buttons
2. Observe how ALL UI elements update instantly (hero, cards, buttons, badges, table)
3. Note that only brand colors (Primary/Secondary) change
4. Status colors (Success/Warning/Error/Info) remain consistent

## Creating New White-Label Themes

\`\`\`typescript
// src/design-tokens/themes/client-green.ts
import { primitives } from '../primitives/colors'
import { defaultTheme, mergeThemeColors, type Theme } from './index'

export const clientGreenTheme: Theme = {
  id: 'client-green',
  name: 'EcoSolar Green',
  client: 'EcoSolar Corp',
  colors: mergeThemeColors(defaultTheme, {
    primary: {
      light: primitives.green[700],  // Dark green
      dark: primitives.green[400],   // Light green
      DEFAULT: primitives.green[700],
    },
    secondary: {
      light: primitives.teal[500],   // Teal accent
      dark: primitives.teal[400],
      DEFAULT: primitives.teal[500],
    },
  }),
}
\`\`\`

## Implementation Details

- Theme colors applied via CSS variables (\`--demo-primary\`, \`--demo-secondary\`)
- Components use semantic tokens (\`bg-primary\`, \`text-secondary\`)
- No hard-coded hex values in component code
- Theme registry in \`src/design-tokens/themes/index.ts\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof WhiteLabelDemoComponent>

// Story: Side-by-Side Comparison
export const SideBySideComparison: Story = {
  name: 'Default vs Client Theme',
  render: () => <WhiteLabelDemoComponent />,
}
