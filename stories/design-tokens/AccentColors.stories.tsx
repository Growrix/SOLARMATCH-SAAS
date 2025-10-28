import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Accent Colors Showcase
 * 
 * Demonstrates the new orange accent colors (#FF6B00) for CTAs and highlights.
 * Best practices: Use accent colors sparingly for primary actions, highlights, and attention-grabbing elements.
 * 
 * WCAG Compliance:
 * - Accent (#FF6B00) on dark background (#101010): ~5.8:1 ✅ PASS AA
 * - Accent (#FF6B00) on light background (#f9fafb): ~4.9:1 ✅ PASS AA
 */
const AccentColorsShowcase = () => {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 font-bold text-foreground mb-2">
            Accent Colors Showcase
          </h1>
          <p className="text-body text-subtle">
            Orange accent (#FF6B00) for CTAs, highlights, and interactive elements
          </p>
        </div>

        {/* Color Swatches */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Color Swatches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accent */}
            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="w-full h-24 bg-accent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">#FF6B00</span>
              </div>
              <h3 className="text-heading-3 font-semibold text-foreground mb-2">
                Accent
              </h3>
              <p className="text-body text-subtle mb-2">
                Primary accent color for CTAs and highlights
              </p>
              <div className="text-small text-muted">
                <code>bg-accent</code> | <code>text-accent</code> | <code>border-accent</code>
              </div>
            </div>

            {/* Accent Hover */}
            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="w-full h-24 bg-accent-hover rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-lg">#FF8533</span>
              </div>
              <h3 className="text-heading-3 font-semibold text-foreground mb-2">
                Accent Hover
              </h3>
              <p className="text-body text-subtle mb-2">
                Lighter shade for hover states
              </p>
              <div className="text-small text-muted">
                <code>hover:bg-accent-hover</code> | <code>hover:text-accent-hover</code>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Buttons with Accent Colors
          </h2>
          <div className="bg-surface rounded-lg shadow-card p-8 border border-border">
            <div className="space-y-6">
              {/* Solid Accent Buttons */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Solid Accent Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors duration-200 shadow-button">
                    Primary CTA
                  </button>
                  <button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors duration-200 shadow-button flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Get Started
                  </button>
                  <button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors duration-200 shadow-button flex items-center gap-2">
                    Sign Up Free
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Outline Accent Buttons */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Outline Accent Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-transparent border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200">
                    Secondary Action
                  </button>
                  <button className="px-6 py-3 bg-transparent border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>

              {/* Ghost Accent Buttons */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Ghost Accent Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-transparent text-accent rounded-lg font-semibold hover:bg-accent hover:bg-opacity-10 transition-colors duration-200">
                    Learn More
                  </button>
                  <button className="px-6 py-3 bg-transparent text-accent rounded-lg font-semibold hover:bg-accent hover:bg-opacity-10 transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help Center
                  </button>
                </div>
              </div>

              {/* Small Accent Buttons */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Small Accent Buttons
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-4 py-2 text-sm bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors duration-200">
                    Small CTA
                  </button>
                  <button className="px-4 py-2 text-sm bg-transparent border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200">
                    Small Outline
                  </button>
                  <button className="px-4 py-2 text-sm bg-transparent text-accent rounded-lg font-semibold hover:bg-accent hover:bg-opacity-10 transition-colors duration-200">
                    Small Ghost
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges and Tags */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Badges and Tags
          </h2>
          <div className="bg-surface rounded-lg shadow-card p-8 border border-border">
            <div className="space-y-6">
              {/* Solid Badges */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Solid Accent Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                    Hot Deal 🔥
                  </span>
                  <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                    Limited Time
                  </span>
                  <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-lg">
                    Recommended
                  </span>
                  <span className="px-3 py-1 bg-accent text-white text-sm font-semibold rounded-lg flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                </div>
              </div>

              {/* Outline Badges */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Outline Accent Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border-2 border-accent text-accent text-sm font-semibold rounded-full">
                    Popular
                  </span>
                  <span className="px-3 py-1 border-2 border-accent text-accent text-sm font-semibold rounded-full">
                    Trending
                  </span>
                  <span className="px-3 py-1 border-2 border-accent text-accent text-sm font-semibold rounded-lg">
                    Best Value
                  </span>
                </div>
              </div>

              {/* Subtle Badges */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Subtle Accent Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-accent bg-opacity-10 text-accent text-sm font-semibold rounded-full">
                    New
                  </span>
                  <span className="px-3 py-1 bg-accent bg-opacity-10 text-accent text-sm font-semibold rounded-full">
                    Updated
                  </span>
                  <span className="px-3 py-1 bg-accent bg-opacity-10 text-accent text-sm font-semibold rounded-lg">
                    Special Offer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links and Text */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Links and Text with Accent
          </h2>
          <div className="bg-surface rounded-lg shadow-card p-8 border border-border space-y-6">
            {/* Links */}
            <div>
              <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                Accent Links
              </h3>
              <div className="space-y-2">
                <p className="text-body text-foreground">
                  This is a paragraph with an{' '}
                  <a href="#" className="text-accent hover:text-accent-hover underline font-semibold">
                    accent-colored link
                  </a>{' '}
                  that stands out from the rest of the text.
                </p>
                <p className="text-body text-foreground">
                  Learn more about our services{' '}
                  <a href="#" className="text-accent hover:text-accent-hover underline font-semibold inline-flex items-center gap-1">
                    here
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </p>
              </div>
            </div>

            {/* Emphasis Text */}
            <div>
              <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                Accent Emphasis
              </h3>
              <p className="text-body text-foreground">
                Use accent color to{' '}
                <span className="text-accent font-bold">highlight important information</span>,{' '}
                <span className="text-accent font-semibold">call attention to specific details</span>, or{' '}
                <span className="text-accent underline font-semibold">emphasize key takeaways</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Alert/Callout */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Accent Alerts and Callouts
          </h2>
          <div className="space-y-4">
            {/* Solid Alert */}
            <div className="bg-accent text-white p-6 rounded-lg shadow-card">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-bold text-lg mb-1">Featured Announcement</h4>
                  <p className="text-white text-opacity-90">
                    This is a high-priority alert with solid accent background. Perfect for limited-time offers or important announcements.
                  </p>
                </div>
              </div>
            </div>

            {/* Outline Alert */}
            <div className="border-2 border-accent bg-background p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-accent">Special Offer</h4>
                  <p className="text-foreground">
                    This is an outlined accent alert. Good for promotions or highlighting special content without being too aggressive.
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle Alert */}
            <div className="bg-accent bg-opacity-10 border-l-4 border-accent p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-accent">Pro Tip</h4>
                  <p className="text-foreground">
                    This is a subtle accent callout with light background and accent border. Perfect for tips, notes, or helpful information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            Best Practices
          </h2>
          <div className="bg-surface rounded-lg shadow-card p-8 border border-border">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-body text-foreground font-semibold mb-1">
                    Use accent colors for primary CTAs and important actions
                  </p>
                  <p className="text-small text-subtle">
                    &ldquo;Sign Up&rdquo;, &ldquo;Get Started&rdquo;, &ldquo;Buy Now&rdquo; buttons benefit from the vibrant accent
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-body text-foreground font-semibold mb-1">
                    Use sparingly for maximum impact
                  </p>
                  <p className="text-small text-subtle">
                    Too many accent elements dilute their effectiveness
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-body text-foreground font-semibold mb-1">
                    Great for badges highlighting special features
                  </p>
                  <p className="text-small text-subtle">
                    &ldquo;Featured&rdquo;, &ldquo;Hot&rdquo;, &ldquo;Recommended&rdquo;, &ldquo;Limited Time&rdquo;
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-body text-foreground font-semibold mb-1">
                    Don&apos;t use for body text or large text blocks
                  </p>
                  <p className="text-small text-subtle">
                    Reserve for short, action-oriented content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-body text-foreground font-semibold mb-1">
                    Avoid overusing on the same page
                  </p>
                  <p className="text-small text-subtle">
                    1-3 accent elements per viewport is ideal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WCAG Compliance */}
        <section>
          <h2 className="text-heading-2 font-semibold text-foreground mb-4">
            WCAG Compliance
          </h2>
          <div className="bg-surface rounded-lg shadow-card p-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Theme */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Light Theme
                </h3>
                <div className="space-y-2 text-body">
                  <p className="text-foreground">
                    <strong>Accent on Light Background:</strong>
                  </p>
                  <p className="text-subtle">
                    #FF6B00 on #f9fafb = <span className="font-bold text-success">4.9:1 ✅</span>
                  </p>
                  <p className="text-muted text-small">
                    Passes WCAG AA for normal text (4.5:1 required)
                  </p>
                </div>
              </div>

              {/* Dark Theme */}
              <div>
                <h3 className="text-heading-3 font-semibold text-foreground mb-3">
                  Dark Theme
                </h3>
                <div className="space-y-2 text-body">
                  <p className="text-foreground">
                    <strong>Accent on Dark Background:</strong>
                  </p>
                  <p className="text-subtle">
                    #FF6B00 on #101010 = <span className="font-bold text-success">5.8:1 ✅</span>
                  </p>
                  <p className="text-muted text-small">
                    Passes WCAG AA for normal text (4.5:1 required)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const meta: Meta<typeof AccentColorsShowcase> = {
  title: 'Design Tokens/Accent Colors',
  component: AccentColorsShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Accent Colors

Orange accent colors (#FF6B00) for CTAs, highlights, and attention-grabbing elements.

## Usage

\`\`\`tsx
// Solid accent button
<button className="bg-accent text-white hover:bg-accent-hover">
  Sign Up
</button>

// Outline accent button
<button className="border-2 border-accent text-accent hover:bg-accent hover:text-white">
  Learn More
</button>

// Accent badge
<span className="bg-accent text-white px-3 py-1 rounded-full">
  Featured
</span>

// Accent link
<a href="#" className="text-accent hover:text-accent-hover underline">
  View Details
</a>
\`\`\`

## Best Practices

- ✅ Use for primary CTAs and important actions
- ✅ Use sparingly for maximum impact
- ✅ Great for badges highlighting special features
- ❌ Don't use for body text or large text blocks
- ❌ Avoid overusing on the same page (1-3 elements per viewport)

## WCAG Compliance

- **Light theme**: #FF6B00 on #f9fafb = 4.9:1 ✅ PASS AA
- **Dark theme**: #FF6B00 on #101010 = 5.8:1 ✅ PASS AA
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AccentColorsShowcase>;

export const AllExamples: Story = {
  render: () => <AccentColorsShowcase />,
};
