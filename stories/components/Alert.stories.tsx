import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Alert',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Alert component variants using semantic tokens
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Alert Variants</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Alert components automatically adapt to Light/Dark/System themes using semantic color tokens.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Success Alert */}
        <div className="border-l-4 border-success bg-success-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-success text-xl">✓</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-success-dark mb-1">Success</h4>
              <p className="text-body-small text-success-dark">
                Your solar quote has been successfully submitted. We&apos;ll contact you within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="border-l-4 border-warning bg-warning-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-warning text-xl">⚠</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-warning-dark mb-1">Warning</h4>
              <p className="text-body-small text-warning-dark">
                Your monthly bill seems unusually low. Solar may not be cost-effective for your property.
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        <div className="border-l-4 border-error bg-error-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-error text-xl">✕</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-error-dark mb-1">Error</h4>
              <p className="text-body-small text-error-dark">
                Unable to submit your quote request. Please check your internet connection and try again.
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="border-l-4 border-info bg-info-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-info text-xl">ℹ</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-info-dark mb-1">Information</h4>
              <p className="text-body-small text-info-dark">
                Federal tax credit covers 30% of your solar installation cost. Learn more about available incentives.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-info-light border border-info rounded-lg p-4">
        <p className="text-body-small text-info-dark">
          <strong>Token Usage:</strong> Each alert uses semantic color tokens like <code>border-success</code>, <code>bg-success-light</code>, and <code>text-success-dark</code> for automatic theme adaptation.
        </p>
      </div>
    </div>
  ),
};

/**
 * Simple alert without icons
 */
export const SimpleAlerts: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Simple Alerts</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Minimal alerts without icons for cleaner design.
        </p>
      </div>

      <div className="space-y-form-gap">
        <div className="border border-success bg-success-light p-4 rounded">
          <p className="text-body text-success-dark">
            Your profile has been updated successfully.
          </p>
        </div>

        <div className="border border-warning bg-warning-light p-4 rounded">
          <p className="text-body text-warning-dark">
            Your session will expire in 5 minutes.
          </p>
        </div>

        <div className="border border-error bg-error-light p-4 rounded">
          <p className="text-body text-error-dark">
            Failed to load installer data. Please refresh the page.
          </p>
        </div>

        <div className="border border-info bg-info-light p-4 rounded">
          <p className="text-body text-info-dark">
            New features are available. Check the changelog for details.
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Alerts with actions
 */
export const AlertsWithActions: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Alerts with Actions</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Interactive alerts with buttons or links.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Success with Action */}
        <div className="border-l-4 border-success bg-success-light p-4 rounded">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-success text-xl">✓</span>
              <div>
                <h4 className="font-heading-4 text-success-dark mb-1">Quote Approved</h4>
                <p className="text-body-small text-success-dark mb-3">
                  Your solar installation quote has been approved. Ready to proceed?
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-success text-white rounded-lg text-body-small font-medium hover:bg-success-dark transition-colors whitespace-nowrap">
              View Quote
            </button>
          </div>
        </div>

        {/* Warning with Action */}
        <div className="border-l-4 border-warning bg-warning-light p-4 rounded">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-warning text-xl">⚠</span>
              <div>
                <h4 className="font-heading-4 text-warning-dark mb-1">Payment Due Soon</h4>
                <p className="text-body-small text-warning-dark mb-3">
                  Your next payment is due in 3 days. Avoid late fees by paying now.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-warning text-white rounded-lg text-body-small font-medium hover:bg-warning-dark transition-colors whitespace-nowrap">
              Pay Now
            </button>
          </div>
        </div>

        {/* Error with Action */}
        <div className="border-l-4 border-error bg-error-light p-4 rounded">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-error text-xl">✕</span>
              <div>
                <h4 className="font-heading-4 text-error-dark mb-1">Connection Failed</h4>
                <p className="text-body-small text-error-dark mb-3">
                  Unable to connect to the server. Please check your connection.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border-2 border-error text-error rounded-lg text-body-small font-medium hover:bg-error hover:text-white transition-colors whitespace-nowrap">
              Retry
            </button>
          </div>
        </div>

        {/* Info with Link */}
        <div className="border-l-4 border-info bg-info-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-info text-xl">ℹ</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-info-dark mb-1">New Feature Available</h4>
              <p className="text-body-small text-info-dark mb-2">
                You can now track your installation progress in real-time.
              </p>
              <a href="#" className="text-body-small text-info font-medium underline hover:text-info-dark">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Dismissible alerts
 */
export const DismissibleAlerts: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Dismissible Alerts</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Alerts with close button for user dismissal.
        </p>
      </div>

      <div className="space-y-form-gap">
        <div className="border-l-4 border-success bg-success-light p-4 rounded relative">
          <button className="absolute top-2 right-2 text-success-dark hover:text-success text-xl leading-none p-1">
            ×
          </button>
          <div className="flex items-start gap-3 pr-8">
            <span className="text-success text-xl">✓</span>
            <div>
              <h4 className="font-heading-4 text-success-dark mb-1">Changes Saved</h4>
              <p className="text-body-small text-success-dark">
                Your preferences have been updated successfully.
              </p>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-info bg-info-light p-4 rounded relative">
          <button className="absolute top-2 right-2 text-info-dark hover:text-info text-xl leading-none p-1">
            ×
          </button>
          <div className="flex items-start gap-3 pr-8">
            <span className="text-info text-xl">ℹ</span>
            <div>
              <h4 className="font-heading-4 text-info-dark mb-1">Tip</h4>
              <p className="text-body-small text-info-dark">
                Use keyboard shortcuts to navigate faster. Press ? to see all shortcuts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world examples in solar context
 */
export const SolarContextExamples: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Solar Industry Examples</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Contextual alerts for SolarMatch application scenarios.
        </p>
      </div>

      <div className="space-y-form-gap">
        {/* Quote Submission Success */}
        <div className="border-l-4 border-success bg-success-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-success text-xl">✓</span>
            <div>
              <h4 className="font-heading-4 text-success-dark mb-1">Quote Request Submitted</h4>
              <p className="text-body-small text-success-dark">
                Your solar quote request has been sent to 3 installers in your area. You should receive responses within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* ROI Warning */}
        <div className="border-l-4 border-warning bg-warning-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-warning text-xl">⚠</span>
            <div>
              <h4 className="font-heading-4 text-warning-dark mb-1">Low ROI Detected</h4>
              <p className="text-body-small text-warning-dark">
                Based on your electricity usage ($45/month), the payback period for solar would be over 20 years. Consider increasing usage or waiting for better incentives.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Error */}
        <div className="border-l-4 border-error bg-error-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-error text-xl">✕</span>
            <div>
              <h4 className="font-heading-4 text-error-dark mb-1">Permit Rejected</h4>
              <p className="text-body-small text-error-dark mb-2">
                Your solar installation permit was rejected by the local authority. Reason: Roof structural assessment required.
              </p>
              <button className="text-body-small text-error font-medium underline hover:text-error-dark">
                Contact Support →
              </button>
            </div>
          </div>
        </div>

        {/* Incentive Info */}
        <div className="border-l-4 border-info bg-info-light p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-info text-xl">ℹ</span>
            <div>
              <h4 className="font-heading-4 text-info-dark mb-1">Federal Tax Credit Available</h4>
              <p className="text-body-small text-info-dark mb-2">
                The federal solar tax credit (ITC) covers 30% of your installation cost. For a $25,000 system, that&apos;s a $7,500 savings.
              </p>
              <a href="#" className="text-body-small text-info font-medium underline hover:text-info-dark">
                Learn about incentives →
              </a>
            </div>
          </div>
        </div>

        {/* Maintenance Reminder */}
        <div className="border border-warning bg-warning-light p-4 rounded">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-warning text-xl">🔧</span>
              <div>
                <h4 className="font-heading-4 text-warning-dark">Annual Maintenance Due</h4>
                <p className="text-body-small text-warning-dark">
                  Your solar panels are due for annual cleaning and inspection.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-warning text-white rounded-lg text-body-small font-medium hover:bg-warning-dark transition-colors whitespace-nowrap">
              Schedule
            </button>
          </div>
        </div>

        {/* Production Milestone */}
        <div className="border border-success bg-success-light p-4 rounded">
          <div className="flex items-center gap-3">
            <span className="text-success text-3xl">🎉</span>
            <div className="flex-1">
              <h4 className="font-heading-4 text-success-dark mb-1">Milestone Reached!</h4>
              <p className="text-body-small text-success-dark">
                Your solar system has generated 10,000 kWh since installation. That&apos;s equivalent to planting 500 trees!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Theme adaptation demonstration
 */
export const ThemeAdaptation: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Automatic Theme Adaptation</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Toggle between Light/Dark/System themes in Storybook to see automatic adaptation. No custom theme logic required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
        <div className="space-y-form-gap">
          <h3 className="font-heading-3">Light Backgrounds</h3>
          <div className="border-l-4 border-success bg-success-light p-4 rounded">
            <p className="text-body-small text-success-dark">Success alert with light background</p>
          </div>
          <div className="border-l-4 border-warning bg-warning-light p-4 rounded">
            <p className="text-body-small text-warning-dark">Warning alert with light background</p>
          </div>
        </div>

        <div className="space-y-form-gap">
          <h3 className="font-heading-3">With Borders</h3>
          <div className="border border-error bg-error-light p-4 rounded">
            <p className="text-body-small text-error-dark">Error alert with border</p>
          </div>
          <div className="border border-info bg-info-light p-4 rounded">
            <p className="text-body-small text-info-dark">Info alert with border</p>
          </div>
        </div>
      </div>

      <div className="bg-primary-light border border-primary rounded-lg p-card-padding">
        <h4 className="font-heading-4 mb-2 text-primary-dark">✓ Zero Theme Logic</h4>
        <p className="text-body text-primary-dark mb-4">
          These alerts work in all themes without any conditional logic:
        </p>
        <ul className="space-y-2 text-body-small text-primary-dark">
          <li>• No <code>if (theme === &apos;dark&apos;)</code> checks</li>
          <li>• No <code>useTheme()</code> hook needed</li>
          <li>• No duplicate component variants</li>
          <li>• Semantic tokens handle everything automatically</li>
        </ul>
      </div>
    </div>
  ),
};
