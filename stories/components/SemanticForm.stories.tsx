import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Components/Semantic Form',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic form with semantic spacing tokens
 */
export const BasicForm: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h3 className="font-heading-3 mb-heading-margin">Contact Information</h3>
        <form className="space-y-form-gap">
          <div>
            <label htmlFor="name" className="text-label block mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-label block mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-label block mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="(555) 123-4567"
            />
          </div>
          <button
            type="submit"
            className="w-full px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
      <p className="text-caption text-foreground-secondary mt-4">
        Uses: <code>p-card-padding</code>, <code>space-y-form-gap</code>, <code>mb-heading-margin</code>
      </p>
    </div>
  ),
};

/**
 * Form with helper text using body-small typography
 */
export const FormWithHelperText: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h3 className="font-heading-3 mb-heading-margin">Solar Quote Request</h3>
        <p className="text-body text-foreground-secondary mb-form-gap">
          Tell us about your property to receive a personalized solar quote.
        </p>
        <form className="space-y-form-gap">
          <div>
            <label htmlFor="address" className="text-label block mb-2">
              Property Address
            </label>
            <input
              type="text"
              id="address"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="123 Main Street"
            />
            <p className="text-body-small text-foreground-secondary mt-2">
              Enter the address where you want to install solar panels
            </p>
          </div>
          <div>
            <label htmlFor="bill" className="text-label block mb-2">
              Monthly Electric Bill
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body text-foreground-secondary">$</span>
              <input
                type="number"
                id="bill"
                className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                placeholder="150"
              />
            </div>
            <p className="text-body-small text-foreground-secondary mt-2">
              Your average monthly electricity bill helps us size your system
            </p>
          </div>
          <div>
            <label htmlFor="roof" className="text-label block mb-2">
              Roof Type
            </label>
            <select
              id="roof"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            >
              <option>Asphalt Shingle</option>
              <option>Metal</option>
              <option>Tile</option>
              <option>Flat</option>
            </select>
            <p className="text-body-small text-foreground-secondary mt-2">
              Roof type affects installation method and cost
            </p>
          </div>
          <button
            type="submit"
            className="w-full px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Get Free Quote
          </button>
        </form>
      </div>
      <div className="mt-4 bg-info-light border border-info rounded p-4">
        <p className="text-body-small text-info-dark">
          <strong>Helper text spacing:</strong> Uses <code>mt-2</code> to create consistent 8px gap between input and helper text.
        </p>
      </div>
    </div>
  ),
};

/**
 * Form with validation states
 */
export const FormWithValidation: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h3 className="font-heading-3 mb-heading-margin">Form Validation</h3>
        <form className="space-y-form-gap">
          {/* Valid Input */}
          <div>
            <label htmlFor="valid-email" className="text-label block mb-2">
              Email (Valid)
            </label>
            <input
              type="email"
              id="valid-email"
              value="john@example.com"
              className="w-full px-4 py-3 border-2 border-success rounded-lg bg-background focus:border-success focus:ring-2 focus:ring-success/20 outline-none transition-colors"
              readOnly
            />
            <p className="text-body-small text-success mt-2 flex items-center gap-2">
              <span>✓</span> Email is valid
            </p>
          </div>

          {/* Invalid Input */}
          <div>
            <label htmlFor="invalid-email" className="text-label block mb-2">
              Email (Invalid)
            </label>
            <input
              type="email"
              id="invalid-email"
              value="invalid-email"
              className="w-full px-4 py-3 border-2 border-error rounded-lg bg-background focus:border-error focus:ring-2 focus:ring-error/20 outline-none transition-colors"
              readOnly
            />
            <p className="text-body-small text-error mt-2 flex items-center gap-2">
              <span>✕</span> Please enter a valid email address
            </p>
          </div>

          {/* Warning Input */}
          <div>
            <label htmlFor="warning-bill" className="text-label block mb-2">
              Monthly Bill (Unusually Low)
            </label>
            <input
              type="number"
              id="warning-bill"
              value="25"
              className="w-full px-4 py-3 border-2 border-warning rounded-lg bg-background focus:border-warning focus:ring-2 focus:ring-warning/20 outline-none transition-colors"
              readOnly
            />
            <p className="text-body-small text-warning mt-2 flex items-center gap-2">
              <span>⚠</span> This bill amount seems low. Solar may not be cost-effective.
            </p>
          </div>
        </form>
      </div>
      <p className="text-caption text-foreground-secondary mt-4">
        Validation messages use semantic color tokens: <code>text-success</code>, <code>text-error</code>, <code>text-warning</code>
      </p>
    </div>
  ),
};

/**
 * Complex multi-section form
 */
export const CompleteQuoteForm: Story = {
  render: () => (
    <div className="max-w-2xl">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h2 className="font-heading-2 mb-heading-margin">Complete Solar Quote Request</h2>
        <p className="text-body text-foreground-secondary mb-section-margin">
          Fill out this comprehensive form to receive an accurate solar quote.
        </p>

        <form className="space-y-section-margin">
          {/* Section 1: Property Information */}
          <div>
            <h3 className="font-heading-3 mb-heading-margin">Property Information</h3>
            <div className="space-y-form-gap">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
                <div>
                  <label htmlFor="street" className="text-label block mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="text-label block mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="Los Angeles"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-form-gap">
                <div>
                  <label htmlFor="state" className="text-label block mb-2">
                    State
                  </label>
                  <select
                    id="state"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  >
                    <option>CA</option>
                    <option>TX</option>
                    <option>FL</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="zip" className="text-label block mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="90210"
                  />
                </div>
                <div>
                  <label htmlFor="roof-type" className="text-label block mb-2">
                    Roof Type
                  </label>
                  <select
                    id="roof-type"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  >
                    <option>Asphalt Shingle</option>
                    <option>Metal</option>
                    <option>Tile</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Energy Usage */}
          <div className="pt-section-margin border-t border-border">
            <h3 className="font-heading-3 mb-heading-margin">Energy Usage</h3>
            <div className="space-y-form-gap">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
                <div>
                  <label htmlFor="monthly-bill" className="text-label block mb-2">
                    Average Monthly Bill
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body text-foreground-secondary">$</span>
                    <input
                      type="number"
                      id="monthly-bill"
                      className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="150"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="monthly-kwh" className="text-label block mb-2">
                    Monthly Usage (kWh)
                  </label>
                  <input
                    type="number"
                    id="monthly-kwh"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="850"
                  />
                  <p className="text-body-small text-foreground-secondary mt-2">
                    Find this on your electricity bill
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Contact Information */}
          <div className="pt-section-margin border-t border-border">
            <h3 className="font-heading-3 mb-heading-margin">Contact Information</h3>
            <div className="space-y-form-gap">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-form-gap">
                <div>
                  <label htmlFor="contact-name" className="text-label block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-label block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-phone" className="text-label block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-form-gap pt-section-margin border-t border-border">
            <button
              type="submit"
              className="flex-1 px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Submit Quote Request
            </button>
            <button
              type="button"
              className="px-button-padding-x py-button-padding-y border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 bg-success-light border border-success rounded p-4">
        <p className="text-body-small text-success-dark">
          <strong>Spacing tokens demonstrated:</strong>
        </p>
        <ul className="text-body-small text-success-dark mt-2 space-y-1">
          <li>• <code>p-card-padding</code> - Main form container padding</li>
          <li>• <code>mb-section-margin</code> - Space between intro text and form</li>
          <li>• <code>space-y-section-margin</code> - Between form sections</li>
          <li>• <code>mb-heading-margin</code> - Below section headings</li>
          <li>• <code>space-y-form-gap</code> - Between form fields within a section</li>
          <li>• <code>gap-form-gap</code> - Grid gap for multi-column layouts</li>
          <li>• <code>pt-section-margin</code> - Top padding for bordered sections</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Compact search form
 */
export const SearchForm: Story = {
  render: () => (
    <div className="max-w-3xl">
      <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
        <h3 className="font-heading-3 mb-heading-margin">Find Solar Installers</h3>
        <form className="flex flex-col md:flex-row gap-form-gap">
          <div className="flex-1">
            <label htmlFor="search-zip" className="text-label block mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              id="search-zip"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              placeholder="Enter ZIP code"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="search-radius" className="text-label block mb-2">
              Radius
            </label>
            <select
              id="search-radius"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            >
              <option>10 miles</option>
              <option>25 miles</option>
              <option>50 miles</option>
              <option>100 miles</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <p className="text-caption text-foreground-secondary mt-4">
        Horizontal form layout with <code>gap-form-gap</code> for consistent spacing between fields
      </p>
    </div>
  ),
};

/**
 * Responsive form that adapts spacing
 */
export const ResponsiveForm: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Responsive Form Spacing</h2>
        <p className="text-body text-foreground-secondary mb-4">
          Form gap adapts: <strong>Mobile: 12px</strong> | <strong>Desktop: 16px</strong>
        </p>
        <p className="text-body-small text-info">
          Resize your browser to see spacing adapt at the 1024px breakpoint.
        </p>
      </div>

      <div className="border-2 border-dashed border-primary rounded-lg p-1">
        <div className="border border-border rounded-lg p-card-padding bg-background shadow-card">
          <h3 className="font-heading-3 mb-heading-margin">Lead Submission</h3>
          <form className="space-y-form-gap">
            <div>
              <label htmlFor="resp-name" className="text-label block mb-2">
                Name
              </label>
              <input
                type="text"
                id="resp-name"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="resp-property" className="text-label block mb-2">
                Property Type
              </label>
              <select
                id="resp-property"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              >
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label htmlFor="resp-message" className="text-label block mb-2">
                Message
              </label>
              <textarea
                id="resp-message"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-button-padding-x py-button-padding-y bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Submit Lead
            </button>
          </form>
        </div>
      </div>

      <div className="bg-warning-light border border-warning rounded-lg p-4">
        <p className="text-body-small text-warning-dark">
          The <code>space-y-form-gap</code> class automatically adjusts gap based on screen size.
        </p>
      </div>
    </div>
  ),
};
