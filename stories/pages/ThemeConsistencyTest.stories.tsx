import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta = {
  title: 'Pages/Theme Consistency Test',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive theme consistency test page
 * Tests all component types in a single view for efficient QA
 */
export const AllComponentsTest: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

    // Apply theme to document
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme - respect OS preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }

    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Theme Switcher Header */}
        <div className="sticky top-0 z-50 bg-surface border-b border-border shadow-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="font-heading-1">Theme Consistency Test Suite</h1>
              <div className="flex items-center gap-3">
                <span className="text-body-small text-foreground-secondary">Theme:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-4 py-2 rounded-lg text-body transition-all duration-150 ${
                      theme === 'light'
                        ? 'bg-primary text-white shadow-button'
                        : 'bg-surface border border-border hover:border-primary'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-4 py-2 rounded-lg text-body transition-all duration-150 ${
                      theme === 'dark'
                        ? 'bg-primary text-white shadow-button'
                        : 'bg-surface border border-border hover:border-primary'
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`px-4 py-2 rounded-lg text-body transition-all duration-150 ${
                      theme === 'system'
                        ? 'bg-primary text-white shadow-button'
                        : 'bg-surface border border-border hover:border-primary'
                    }`}
                  >
                    💻 System
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 space-y-12">
          {/* Section 1: Typography */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Typography Test</h2>
            <div className="space-y-4">
              <h1 className="font-heading-1">Heading 1 - The Quick Brown Fox</h1>
              <h2 className="font-heading-2">Heading 2 - The Quick Brown Fox</h2>
              <h3 className="font-heading-3">Heading 3 - The Quick Brown Fox</h3>
              <h4 className="font-heading-4">Heading 4 - The Quick Brown Fox</h4>
              <p className="text-body-large">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-body">Body Regular - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-body-small">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-caption">Caption - Supporting text for additional context</p>
              <p className="text-label text-foreground-secondary">Label - Form field label</p>
            </div>
          </section>

          {/* Section 2: Color System */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Color System Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Brand Colors */}
              <div>
                <h3 className="font-heading-4 mb-3">Brand</h3>
                <div className="space-y-2">
                  <div className="bg-primary text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Primary</p>
                  </div>
                  <div className="bg-secondary text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Secondary</p>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="font-heading-4 mb-3">Status</h3>
                <div className="space-y-2">
                  <div className="bg-success text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Success</p>
                  </div>
                  <div className="bg-warning text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Warning</p>
                  </div>
                  <div className="bg-error text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Error</p>
                  </div>
                  <div className="bg-info text-white p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Info</p>
                  </div>
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h3 className="font-heading-4 mb-3">Backgrounds</h3>
                <div className="space-y-2">
                  <div className="bg-background border border-border p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Background</p>
                  </div>
                  <div className="bg-surface border border-border p-4 rounded-lg">
                    <p className="text-body-small font-semibold">Surface</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-body-small font-semibold text-muted-foreground">Muted</p>
                  </div>
                </div>
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="font-heading-4 mb-3">Text</h3>
                <div className="space-y-2 bg-surface p-4 rounded-lg">
                  <p className="text-foreground font-semibold text-body-small">Foreground</p>
                  <p className="text-foreground-secondary text-body-small">Secondary</p>
                  <p className="text-muted-foreground text-body-small">Muted</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Buttons */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Button Test</h2>
            <div className="space-y-6">
              {/* Primary Buttons */}
              <div>
                <h3 className="font-heading-4 mb-3">Primary Buttons</h3>
                <div className="flex gap-3 flex-wrap">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary-dark hover:shadow-card">
                    Normal
                  </button>
                  <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button">
                    Active
                  </button>
                  <button className="bg-primary text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed" disabled>
                    Disabled
                  </button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h3 className="font-heading-4 mb-3">Secondary Buttons</h3>
                <div className="flex gap-3 flex-wrap">
                  <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary hover:text-white">
                    Normal
                  </button>
                  <button className="border-2 border-primary bg-primary text-white px-6 py-3 rounded-lg">
                    Active
                  </button>
                  <button className="border-2 border-border text-muted px-6 py-3 rounded-lg opacity-50 cursor-not-allowed" disabled>
                    Disabled
                  </button>
                </div>
              </div>

              {/* Status Buttons */}
              <div>
                <h3 className="font-heading-4 mb-3">Status Buttons</h3>
                <div className="flex gap-3 flex-wrap">
                  <button className="bg-success text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-success/90 hover:shadow-card">
                    Success
                  </button>
                  <button className="bg-warning text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-warning/90 hover:shadow-card">
                    Warning
                  </button>
                  <button className="bg-error text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-error/90 hover:shadow-card">
                    Error
                  </button>
                  <button className="bg-info text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-info/90 hover:shadow-card">
                    Info
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Form Elements */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Form Elements Test</h2>
            <div className="max-w-2xl space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Text Input</label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none"
                />
              </div>

              {/* Success State */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Success State</label>
                <input
                  type="text"
                  value="john.doe@example.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-success bg-success-light transition-all duration-200 focus:shadow-focus focus:outline-none"
                  readOnly
                />
                <p className="text-body-small text-success mt-2">✓ Email verified</p>
              </div>

              {/* Error State */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Error State</label>
                <input
                  type="password"
                  value="123"
                  className="w-full px-4 py-3 rounded-lg border-2 border-error bg-error-light transition-all duration-200 focus:shadow-focus focus:outline-none"
                  readOnly
                />
                <p className="text-body-small text-error mt-2">✗ Password must be at least 8 characters</p>
              </div>

              {/* Select */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Select Dropdown</label>
                <select className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Textarea</label>
                <textarea
                  placeholder="Enter description..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div>
                <label className="block text-label text-foreground-secondary mb-2">Checkboxes</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 rounded-lg border border-border bg-background cursor-pointer transition-all duration-150 hover:border-primary">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-body">I agree to the terms and conditions</span>
                  </label>
                  <label className="flex items-center p-3 rounded-lg border border-border bg-background cursor-pointer transition-all duration-150 hover:border-primary">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-body">Subscribe to newsletter</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Cards & Elevation */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Cards & Elevation Test</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Standard Card */}
              <div className="bg-surface rounded-xl p-6 border border-border shadow-card">
                <h3 className="font-heading-3 mb-2">Standard Card</h3>
                <p className="text-body text-foreground-secondary mb-4">
                  Basic card with shadow-card elevation
                </p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg w-full transition-colors duration-150 hover:bg-primary-dark">
                  Action
                </button>
              </div>

              {/* Elevated Card (Hover) */}
              <div className="bg-surface rounded-xl p-6 border border-border shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-1 cursor-pointer">
                <h3 className="font-heading-3 mb-2">Hover Card</h3>
                <p className="text-body text-foreground-secondary mb-4">
                  Lifts to shadow-dropdown on hover
                </p>
                <button className="bg-secondary text-white px-4 py-2 rounded-lg w-full transition-colors duration-150 hover:bg-secondary/90">
                  Action
                </button>
              </div>

              {/* Status Card */}
              <div className="bg-success-light rounded-xl p-6 border-2 border-success">
                <h3 className="font-heading-3 mb-2 text-success">Success Card</h3>
                <p className="text-body text-success-dark mb-4">
                  Card with status color theming
                </p>
                <button className="bg-success text-white px-4 py-2 rounded-lg w-full transition-colors duration-150 hover:bg-success/90">
                  Action
                </button>
              </div>
            </div>
          </section>

          {/* Section 6: Badges & Status Indicators */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Badges & Status Test</h2>
            <div className="space-y-6">
              {/* Status Badges */}
              <div>
                <h3 className="font-heading-4 mb-3">Status Badges</h3>
                <div className="flex gap-3 flex-wrap">
                  <span className="bg-success text-white px-3 py-1 rounded text-body-small font-semibold">
                    Success
                  </span>
                  <span className="bg-warning text-white px-3 py-1 rounded text-body-small font-semibold">
                    Warning
                  </span>
                  <span className="bg-error text-white px-3 py-1 rounded text-body-small font-semibold">
                    Error
                  </span>
                  <span className="bg-info text-white px-3 py-1 rounded text-body-small font-semibold">
                    Info
                  </span>
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded text-body-small font-semibold">
                    Neutral
                  </span>
                </div>
              </div>

              {/* Outlined Badges */}
              <div>
                <h3 className="font-heading-4 mb-3">Outlined Badges</h3>
                <div className="flex gap-3 flex-wrap">
                  <span className="border-2 border-success text-success px-3 py-1 rounded text-body-small font-semibold">
                    Success
                  </span>
                  <span className="border-2 border-warning text-warning px-3 py-1 rounded text-body-small font-semibold">
                    Warning
                  </span>
                  <span className="border-2 border-error text-error px-3 py-1 rounded text-body-small font-semibold">
                    Error
                  </span>
                  <span className="border-2 border-info text-info px-3 py-1 rounded text-body-small font-semibold">
                    Info
                  </span>
                </div>
              </div>

              {/* Live Indicators */}
              <div>
                <h3 className="font-heading-4 mb-3">Live Indicators</h3>
                <div className="flex gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3">
                      <div className="absolute inset-0 bg-success rounded-full animate-ping" />
                      <div className="relative w-3 h-3 bg-success rounded-full" />
                    </div>
                    <span className="text-body-small">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3">
                      <div className="absolute inset-0 bg-warning rounded-full animate-pulse" />
                      <div className="relative w-3 h-3 bg-warning rounded-full" />
                    </div>
                    <span className="text-body-small">Away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded-full" />
                    <span className="text-body-small text-muted-foreground">Offline</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Alerts */}
          <section className="bg-surface rounded-xl p-8 border border-border shadow-card">
            <h2 className="font-heading-2 mb-6">Alerts Test</h2>
            <div className="space-y-4">
              <div className="bg-success-light border-l-4 border-success rounded p-4">
                <p className="text-body font-semibold text-success-dark mb-1">Success Alert</p>
                <p className="text-body-small text-success-dark">Your changes have been saved successfully.</p>
              </div>
              <div className="bg-warning-light border-l-4 border-warning rounded p-4">
                <p className="text-body font-semibold text-warning-dark mb-1">Warning Alert</p>
                <p className="text-body-small text-warning-dark">Please review your input before continuing.</p>
              </div>
              <div className="bg-error-light border-l-4 border-error rounded p-4">
                <p className="text-body font-semibold text-error-dark mb-1">Error Alert</p>
                <p className="text-body-small text-error-dark">An error occurred while processing your request.</p>
              </div>
              <div className="bg-info-light border-l-4 border-info rounded p-4">
                <p className="text-body font-semibold text-info-dark mb-1">Info Alert</p>
                <p className="text-body-small text-info-dark">New features are now available in this version.</p>
              </div>
            </div>
          </section>

          {/* QA Checklist */}
          <section className="bg-surface rounded-xl p-8 border-2 border-primary shadow-card">
            <h2 className="font-heading-2 mb-6 text-primary">QA Checklist</h2>
            <div className="space-y-4">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-heading-4 mb-3">Visual Verification</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">All colors are visible and distinct</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Text is readable (good contrast)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Borders are visible and consistent</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Shadows create clear hierarchy</span>
                  </label>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-heading-4 mb-3">Interactive Elements</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Hover states work correctly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Focus states are visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Disabled states are obvious</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Animations are smooth</span>
                  </label>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-heading-4 mb-3">Theme Consistency</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Light theme tested</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">Dark theme tested</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">System theme respects OS preference</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-body">No hardcoded colors visible</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};
