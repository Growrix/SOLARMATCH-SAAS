import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Pages/Accessibility Test',
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'duplicate-id',
            enabled: true,
          },
          {
            id: 'heading-order',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'link-name',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * WCAG AA Contrast Testing
 * Tests all color combinations for accessibility compliance
 * 
 * Requirements:
 * - Normal text (< 18px): 4.5:1 contrast ratio
 * - Large text (≥ 18px or ≥ 14px bold): 3:1 contrast ratio
 * - UI components: 3:1 contrast ratio
 */
export const ContrastRatioTest: Story = {
  render: () => (
    <div className="space-y-12 max-w-6xl">
      <div>
        <h1 className="font-heading-1 mb-4">WCAG AA Contrast Testing</h1>
        <p className="text-body text-foreground-secondary mb-2">
          This page tests all color combinations against WCAG AA standards.
        </p>
        <p className="text-body-small text-foreground-secondary">
          Use Storybook&apos;s Accessibility addon (bottom panel) to see detailed contrast reports.
        </p>
      </div>

      {/* Text on Backgrounds */}
      <section>
        <h2 className="font-heading-2 mb-6">Text on Background Colors</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Light Background */}
          <div className="bg-background p-8 rounded-xl border border-border">
            <h3 className="font-heading-3 mb-4">Light Background</h3>
            <div className="space-y-3">
              <p className="text-foreground text-body">
                <strong>Foreground text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-foreground-secondary text-body">
                <strong>Secondary text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-muted-foreground text-body">
                <strong>Muted text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-primary text-body-large font-semibold">
                <strong>Primary text (Large/Bold):</strong> Should meet 3:1 contrast
              </p>
              <p className="text-secondary text-body-large font-semibold">
                <strong>Secondary text (Large/Bold):</strong> Should meet 3:1 contrast
              </p>
            </div>
          </div>

          {/* Dark Background (Simulated) */}
          <div className="bg-gray-900 text-white p-8 rounded-xl">
            <h3 className="font-heading-3 mb-4">Dark Background</h3>
            <div className="space-y-3">
              <p className="text-white text-body">
                <strong>White text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-gray-300 text-body">
                <strong>Light gray text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-gray-400 text-body">
                <strong>Medium gray text (Normal):</strong> Should meet 4.5:1 contrast
              </p>
              <p className="text-teal-400 text-body-large font-semibold">
                <strong>Primary text (Large/Bold):</strong> Should meet 3:1 contrast
              </p>
              <p className="text-amber-400 text-body-large font-semibold">
                <strong>Secondary text (Large/Bold):</strong> Should meet 3:1 contrast
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Colors on White */}
      <section>
        <h2 className="font-heading-2 mb-6">Status Colors on White Background</h2>
        <div className="bg-white p-8 rounded-xl border border-border space-y-4">
          <div className="flex items-center gap-4">
            <span className="bg-success text-white px-6 py-3 rounded-lg font-semibold">
              Success Badge
            </span>
            <span className="text-body-small text-muted-foreground">
              White text on success background (should meet 4.5:1)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-warning text-white px-6 py-3 rounded-lg font-semibold">
              Warning Badge
            </span>
            <span className="text-body-small text-muted-foreground">
              White text on warning background (should meet 4.5:1)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-error text-white px-6 py-3 rounded-lg font-semibold">
              Error Badge
            </span>
            <span className="text-body-small text-muted-foreground">
              White text on error background (should meet 4.5:1)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-info text-white px-6 py-3 rounded-lg font-semibold">
              Info Badge
            </span>
            <span className="text-body-small text-muted-foreground">
              White text on info background (should meet 4.5:1)
            </span>
          </div>
        </div>
      </section>

      {/* Status Colors on Tinted Backgrounds */}
      <section>
        <h2 className="font-heading-2 mb-6">Status Text on Tinted Backgrounds</h2>
        <div className="space-y-4">
          <div className="bg-success-light border border-success p-6 rounded-xl">
            <p className="text-success-dark text-body font-semibold mb-2">
              Success text on success-light background
            </p>
            <p className="text-success-dark text-body-small">
              Should meet 4.5:1 contrast ratio for normal text
            </p>
          </div>
          <div className="bg-warning-light border border-warning p-6 rounded-xl">
            <p className="text-warning-dark text-body font-semibold mb-2">
              Warning text on warning-light background
            </p>
            <p className="text-warning-dark text-body-small">
              Should meet 4.5:1 contrast ratio for normal text
            </p>
          </div>
          <div className="bg-error-light border border-error p-6 rounded-xl">
            <p className="text-error-dark text-body font-semibold mb-2">
              Error text on error-light background
            </p>
            <p className="text-error-dark text-body-small">
              Should meet 4.5:1 contrast ratio for normal text
            </p>
          </div>
          <div className="bg-info-light border border-info p-6 rounded-xl">
            <p className="text-info-dark text-body font-semibold mb-2">
              Info text on info-light background
            </p>
            <p className="text-info-dark text-body-small">
              Should meet 4.5:1 contrast ratio for normal text
            </p>
          </div>
        </div>
      </section>

      {/* Button Contrast */}
      <section>
        <h2 className="font-heading-2 mb-6">Button UI Component Contrast</h2>
        <div className="bg-surface p-8 rounded-xl border border-border space-y-6">
          <div>
            <h3 className="font-heading-4 mb-3">Solid Buttons (Text on Color)</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">
                Primary Button
              </button>
              <button className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold">
                Secondary Button
              </button>
              <button className="bg-success text-white px-6 py-3 rounded-lg font-semibold">
                Success Button
              </button>
              <button className="bg-error text-white px-6 py-3 rounded-lg font-semibold">
                Error Button
              </button>
            </div>
            <p className="text-body-small text-muted mt-3">
              White text on colored backgrounds should meet 4.5:1 contrast
            </p>
          </div>

          <div>
            <h3 className="font-heading-4 mb-3">Outlined Buttons (Border Contrast)</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold bg-background">
                Primary Outline
              </button>
              <button className="border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-semibold bg-background">
                Secondary Outline
              </button>
              <button className="border-2 border-success text-success px-6 py-3 rounded-lg font-semibold bg-background">
                Success Outline
              </button>
              <button className="border-2 border-error text-error px-6 py-3 rounded-lg font-semibold bg-background">
                Error Outline
              </button>
            </div>
            <p className="text-body-small text-muted mt-3">
              Border and text should both meet 3:1 contrast (UI components)
            </p>
          </div>
        </div>
      </section>

      {/* Link Contrast */}
      <section>
        <h2 className="font-heading-2 mb-6">Link Text Contrast</h2>
        <div className="bg-surface p-8 rounded-xl border border-border space-y-4">
          <p className="text-body">
            This is body text with a{' '}
            <a href="#" className="text-primary underline hover:text-primary-dark">
              primary colored link
            </a>{' '}
            that should meet 4.5:1 contrast.
          </p>
          <p className="text-body">
            This is body text with a{' '}
            <a href="#" className="text-secondary underline hover:text-secondary/90">
              secondary colored link
            </a>{' '}
            that should meet 4.5:1 contrast.
          </p>
          <p className="text-body">
            This is body text with an{' '}
            <a href="#" className="text-info underline hover:text-info/90">
              info colored link
            </a>{' '}
            that should meet 4.5:1 contrast.
          </p>
        </div>
      </section>

      {/* Form Input Contrast */}
      <section>
        <h2 className="font-heading-2 mb-6">Form Input Contrast</h2>
        <div className="bg-surface p-8 rounded-xl border border-border max-w-2xl space-y-6">
          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Input Label (Secondary Text)
            </label>
            <input
              type="text"
              placeholder="Placeholder text"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <p className="text-body-small text-muted mt-2">
              Helper text should meet 4.5:1 contrast
            </p>
          </div>

          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Success State Input
            </label>
            <input
              type="text"
              value="valid@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-success bg-success-light text-success-dark focus:outline-none"
              readOnly
            />
            <p className="text-body-small text-success mt-2">
              ✓ Success message should meet 4.5:1 contrast
            </p>
          </div>

          <div>
            <label className="block text-label text-foreground-secondary mb-2">
              Error State Input
            </label>
            <input
              type="text"
              value="invalid"
              className="w-full px-4 py-3 rounded-lg border-2 border-error bg-error-light text-error-dark focus:outline-none"
              readOnly
            />
            <p className="text-body-small text-error mt-2">
              ✗ Error message should meet 4.5:1 contrast
            </p>
          </div>
        </div>
      </section>

      {/* Icon Contrast */}
      <section>
        <h2 className="font-heading-2 mb-6">Icon & UI Element Contrast</h2>
        <div className="bg-surface p-8 rounded-xl border border-border">
          <div className="space-y-6">
            <div>
              <h3 className="font-heading-4 mb-3">Icon Buttons</h3>
              <div className="flex gap-3">
                <button className="p-3 rounded-lg bg-primary text-white" aria-label="Edit">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-3 rounded-lg border-2 border-border bg-background text-foreground hover:border-primary" aria-label="Delete">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button className="p-3 rounded-lg bg-success text-white" aria-label="Confirm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
              <p className="text-body-small text-muted mt-3">
                Icons should meet 3:1 contrast ratio (UI components)
              </p>
            </div>

            <div>
              <h3 className="font-heading-4 mb-3">Status Icons with Text</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-success">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-body font-semibold">Success icon and text</span>
                </div>
                <div className="flex items-center gap-3 text-warning">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-body font-semibold">Warning icon and text</span>
                </div>
                <div className="flex items-center gap-3 text-error">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-body font-semibold">Error icon and text</span>
                </div>
                <div className="flex items-center gap-3 text-info">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-body font-semibold">Info icon and text</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Testing Guide */}
      <section className="bg-info-light border-2 border-info rounded-xl p-8">
        <h2 className="font-heading-2 text-info-dark mb-6">How to Use This Test Page</h2>
        <div className="space-y-4 text-info-dark">
          <div>
            <h3 className="font-heading-4 mb-2">1. Open Accessibility Panel</h3>
            <p className="text-body">
              Click the &quot;Accessibility&quot; tab in the Storybook addons panel (bottom of screen)
            </p>
          </div>
          <div>
            <h3 className="font-heading-4 mb-2">2. Review Violations</h3>
            <p className="text-body">
              Any contrast failures will be highlighted with specific ratios and recommendations
            </p>
          </div>
          <div>
            <h3 className="font-heading-4 mb-2">3. Test Both Themes</h3>
            <p className="text-body">
              Use the theme switcher to test Light and Dark themes separately
            </p>
          </div>
          <div>
            <h3 className="font-heading-4 mb-2">4. Fix Violations</h3>
            <p className="text-body">
              Adjust color tokens in `src/design-tokens/semantic/colors.ts` until all violations are resolved
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
};

/**
 * Keyboard Navigation Test
 * Tests focus management and keyboard accessibility
 */
export const KeyboardNavigationTest: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h1 className="font-heading-1 mb-4">Keyboard Navigation Test</h1>
        <p className="text-body text-foreground-secondary">
          Test all interactive elements with keyboard only (Tab, Enter, Space, Arrow keys)
        </p>
      </div>

      {/* Focus Visible Test */}
      <section className="bg-surface p-8 rounded-xl border border-border shadow-card">
        <h2 className="font-heading-2 mb-6">Focus Indicators</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-heading-4 mb-3">Buttons (Tab + Enter)</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 focus:ring-4 focus:ring-primary/30 focus:outline-none">
                Primary Button
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg transition-all duration-150 focus:ring-4 focus:ring-primary/30 focus:outline-none">
                Outlined Button
              </button>
              <button className="bg-success text-white px-6 py-3 rounded-lg transition-all duration-150 focus:ring-4 focus:ring-success/30 focus:outline-none">
                Success Button
              </button>
            </div>
            <p className="text-body-small text-muted mt-3">
              Focus rings should be clearly visible (4px ring with 30% opacity)
            </p>
          </div>

          <div>
            <h3 className="font-heading-4 mb-3">Links (Tab + Enter)</h3>
            <div className="space-y-2">
              <p className="text-body">
                <a href="#" className="text-primary underline focus:ring-4 focus:ring-primary/30 focus:outline-none rounded px-1">
                  Primary link with focus ring
                </a>
              </p>
              <p className="text-body">
                <a href="#" className="text-secondary underline focus:ring-4 focus:ring-secondary/30 focus:outline-none rounded px-1">
                  Secondary link with focus ring
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading-4 mb-3">Form Inputs (Tab + Type)</h3>
            <div className="space-y-4 max-w-xl">
              <input
                type="text"
                placeholder="Text input"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email input"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none"
              />
              <select className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <p className="text-body-small text-muted mt-3">
              Focus should show both border color change AND focus ring
            </p>
          </div>

          <div>
            <h3 className="font-heading-4 mb-3">Checkboxes (Tab + Space)</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-lg border border-border cursor-pointer transition-all duration-150 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
                <input type="checkbox" className="mr-3 focus:outline-none" />
                <span className="text-body">Checkbox with label wrapper focus</span>
              </label>
              <label className="flex items-center p-3 rounded-lg border border-border cursor-pointer transition-all duration-150 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
                <input type="checkbox" className="mr-3 focus:outline-none" />
                <span className="text-body">Another checkbox option</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Screen Reader Test */}
      <section className="bg-surface p-8 rounded-xl border border-border shadow-card">
        <h2 className="font-heading-2 mb-6">Screen Reader Labels</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-heading-4 mb-3">Icon Buttons with aria-label</h3>
            <div className="flex gap-3">
              <button className="p-3 rounded-lg bg-primary text-white focus:ring-4 focus:ring-primary/30 focus:outline-none" aria-label="Edit item">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button className="p-3 rounded-lg bg-error text-white focus:ring-4 focus:ring-error/30 focus:outline-none" aria-label="Delete item">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-body-small text-muted mt-3">
              Screen readers should announce &quot;Edit item button&quot; and &quot;Delete item button&quot;
            </p>
          </div>

          <div>
            <h3 className="font-heading-4 mb-3">Form Labels</h3>
            <div className="max-w-xl space-y-4">
              <div>
                <label htmlFor="username-input" className="block text-label text-foreground-secondary mb-2">
                  Username
                </label>
                <input
                  id="username-input"
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email-input" className="block text-label text-foreground-secondary mb-2">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="your.email@example.com"
                  aria-describedby="email-help"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none"
                />
                <p id="email-help" className="text-body-small text-muted mt-2">
                  We&apos;ll never share your email with anyone else.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Checklist */}
      <section className="bg-info-light border-2 border-info rounded-xl p-8">
        <h2 className="font-heading-2 text-info-dark mb-6">Keyboard Testing Checklist</h2>
        <div className="space-y-3 text-info-dark">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">All interactive elements reachable with Tab key</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">Focus indicators clearly visible on all elements</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">Enter key activates buttons and links</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">Space key toggles checkboxes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">Tab order follows logical reading order</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            <span className="text-body">No keyboard traps (can Tab out of all elements)</span>
          </label>
        </div>
      </section>
    </div>
  ),
};
