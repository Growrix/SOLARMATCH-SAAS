import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/StatusBadge',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status badge variants using semantic color tokens
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Status Badge Variants</h2>
        <p className="text-body text-foreground-secondary mb-8">
          All badges automatically adapt to Light/Dark/System themes using semantic color tokens.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Success Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-success text-white text-body-small font-medium">
            Success
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-success text-white</code>
          </span>
        </div>

        {/* Warning Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-warning text-white text-body-small font-medium">
            Warning
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-warning text-white</code>
          </span>
        </div>

        {/* Error Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-error text-white text-body-small font-medium">
            Error
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-error text-white</code>
          </span>
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-info text-white text-body-small font-medium">
            Info
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-info text-white</code>
          </span>
        </div>

        {/* Primary Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-body-small font-medium">
            Primary
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-primary text-white</code>
          </span>
        </div>

        {/* Secondary Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-white text-body-small font-medium">
            Secondary
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-secondary text-white</code>
          </span>
        </div>

        {/* Muted Badge */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground text-body-small font-medium">
            Muted
          </span>
          <span className="text-body text-foreground-secondary">
            Uses <code className="bg-muted px-2 py-1 rounded text-caption">bg-muted text-foreground</code>
          </span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Light variant badges with subtle backgrounds
 */
export const LightVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Light Badge Variants</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Subtle background with colored text for less visual weight.
        </p>
      </div>

      <div className="space-y-form-gap">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success-dark text-body-small font-medium">
            Success
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">bg-success-light text-success-dark</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-warning-light text-warning-dark text-body-small font-medium">
            Warning
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">bg-warning-light text-warning-dark</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-light text-error-dark text-body-small font-medium">
            Error
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">bg-error-light text-error-dark</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-info-light text-info-dark text-body-small font-medium">
            Info
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">bg-info-light text-info-dark</code>
          </span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Outlined badge variants
 */
export const OutlinedVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Outlined Badge Variants</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Border-only style for minimal design.
        </p>
      </div>

      <div className="space-y-form-gap">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-success text-success text-body-small font-medium">
            Success
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">border-2 border-success text-success</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-warning text-warning text-body-small font-medium">
            Warning
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">border-2 border-warning text-warning</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-error text-error text-body-small font-medium">
            Error
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">border-2 border-error text-error</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-info text-info text-body-small font-medium">
            Info
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">border-2 border-info text-info</code>
          </span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world usage examples
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Real-World Badge Usage</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Common use cases in the SolarMatch application.
        </p>
      </div>

      {/* Lead Status */}
      <div className="border border-border rounded-lg p-card-padding bg-background">
        <h3 className="font-heading-3 mb-heading-margin">Lead Status Tracking</h3>
        <div className="space-y-form-gap">
          <div className="flex items-center justify-between">
            <span className="text-body">John Doe - 123 Main St</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-success text-white text-body-small font-medium">
              Converted
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Jane Smith - 456 Oak Ave</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-warning text-white text-body-small font-medium">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Bob Johnson - 789 Pine Rd</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-info text-white text-body-small font-medium">
              New
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body">Alice Brown - 321 Elm St</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-error text-white text-body-small font-medium">
              Lost
            </span>
          </div>
        </div>
      </div>

      {/* Installation Progress */}
      <div className="border border-border rounded-lg p-card-padding bg-background">
        <h3 className="font-heading-3 mb-heading-margin">Installation Progress</h3>
        <div className="space-y-form-gap">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success-dark text-body-small font-medium">
              Completed
            </span>
            <span className="text-body">Design & Permitting</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-body-small font-medium">
              In Progress
            </span>
            <span className="text-body">Panel Installation</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-foreground text-body-small font-medium">
              Not Started
            </span>
            <span className="text-body">Final Inspection</span>
          </div>
        </div>
      </div>

      {/* Installer Availability */}
      <div className="border border-border rounded-lg p-card-padding bg-background">
        <h3 className="font-heading-3 mb-heading-margin">Installer Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
          <div className="p-4 bg-background-secondary rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading-4">SolarTech Pro</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-success text-white text-caption font-medium">
                Available
              </span>
            </div>
            <p className="text-body-small text-foreground-secondary">Next available: Today</p>
          </div>
          <div className="p-4 bg-background-secondary rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading-4">Green Energy Co</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-warning text-white text-caption font-medium">
                Busy
              </span>
            </div>
            <p className="text-body-small text-foreground-secondary">Next available: In 2 weeks</p>
          </div>
          <div className="p-4 bg-background-secondary rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading-4">Sunshine Installers</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-error text-white text-caption font-medium">
                Unavailable
              </span>
            </div>
            <p className="text-body-small text-foreground-secondary">Next available: TBD</p>
          </div>
          <div className="p-4 bg-background-secondary rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading-4">Solar Solutions Inc</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-success text-white text-caption font-medium">
                Available
              </span>
            </div>
            <p className="text-body-small text-foreground-secondary">Next available: Tomorrow</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Badge sizes demonstration
 */
export const BadgeSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Badge Sizes</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Different badge sizes for various contexts.
        </p>
      </div>

      <div className="space-y-form-gap">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-white text-caption font-medium">
            Small
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">px-2 py-0.5 text-caption</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-body-small font-medium">
            Medium
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">px-3 py-1 text-body-small</code>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white text-body font-medium">
            Large
          </span>
          <span className="text-body text-foreground-secondary">
            <code className="bg-muted px-2 py-1 rounded text-caption">px-4 py-2 text-body</code>
          </span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Theme comparison - shows how badges adapt automatically
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Automatic Theme Adaptation</h2>
        <p className="text-body text-foreground-secondary mb-8">
          All badges use semantic tokens and automatically adapt to the current theme.
          Toggle between Light/Dark/System themes in Storybook to see the adaptation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
        <div className="border border-border rounded-lg p-card-padding bg-background">
          <h3 className="font-heading-3 mb-heading-margin">Solid Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-success text-white text-body-small font-medium">
              Success
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-warning text-white text-body-small font-medium">
              Warning
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-error text-white text-body-small font-medium">
              Error
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-info text-white text-body-small font-medium">
              Info
            </span>
          </div>
        </div>

        <div className="border border-border rounded-lg p-card-padding bg-background">
          <h3 className="font-heading-3 mb-heading-margin">Light Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-light text-success-dark text-body-small font-medium">
              Success
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-warning-light text-warning-dark text-body-small font-medium">
              Warning
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-light text-error-dark text-body-small font-medium">
              Error
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-info-light text-info-dark text-body-small font-medium">
              Info
            </span>
          </div>
        </div>
      </div>

      <div className="bg-success-light border border-success rounded-lg p-card-padding">
        <h4 className="font-heading-4 mb-2 text-success-dark">✓ No Custom Theme Logic Required</h4>
        <p className="text-body text-success-dark">
          By using semantic color tokens (<code>bg-success</code>, <code>text-warning</code>, etc.), 
          these badges automatically work in all themes without any conditional logic or theme detection code.
        </p>
      </div>
    </div>
  ),
};
