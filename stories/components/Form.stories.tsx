import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Form Component with Typography Tokens
 * 
 * Demonstrates proper use of typography tokens in form elements:
 * - Label text using text-label
 * - Input text using text-body
 * - Helper text using text-body-small
 * - Error messages using text-body-small with error color
 * - Form headings using heading tokens
 */

const meta = {
  title: 'Components/Form',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form components demonstrating typography token usage for labels, inputs, helper text, and validation messages.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
  render: () => (
    <form className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="text-label block mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-label block mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors"
      >
        Submit
      </button>
    </form>
  ),
};

export const FormWithHelperText: Story = {
  render: () => (
    <form className="max-w-md space-y-4">
      <div>
        <label htmlFor="address" className="text-label block mb-2">
          Property Address
        </label>
        <input
          type="text"
          id="address"
          className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          placeholder="123 Main Street"
        />
        <p className="text-body-small text-muted-foreground mt-1">
          Enter the address where solar panels will be installed
        </p>
      </div>

      <div>
        <label htmlFor="electricity-bill" className="text-label block mb-2">
          Monthly Electricity Bill
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body text-muted-foreground">
            $
          </span>
          <input
            type="number"
            id="electricity-bill"
            className="w-full pl-8 pr-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="150"
          />
        </div>
        <p className="text-body-small text-muted-foreground mt-1">
          Average monthly cost to help estimate savings
        </p>
      </div>
    </form>
  ),
};

export const FormWithValidation: Story = {
  render: () => (
    <form className="max-w-md space-y-4">
      <div>
        <label htmlFor="email-valid" className="text-label block mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email-valid"
          className="w-full px-4 py-2 border-2 border-error rounded-lg text-body bg-background"
          placeholder="you@example.com"
          defaultValue="invalid-email"
        />
        <p className="text-body-small text-error mt-1">
          Please enter a valid email address
        </p>
      </div>

      <div>
        <label htmlFor="phone-valid" className="text-label block mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone-valid"
          className="w-full px-4 py-2 border-2 border-success rounded-lg text-body bg-background"
          placeholder="(555) 123-4567"
          defaultValue="(555) 123-4567"
        />
        <p className="text-body-small text-success mt-1">
          Phone number verified
        </p>
      </div>
    </form>
  ),
};

export const CompleteQuoteForm: Story = {
  render: () => (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-heading-2 mb-2">Get Your Free Solar Quote</h2>
        <p className="text-body text-muted-foreground">
          Fill out this form and we will provide a personalized solar estimate within 24 hours
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first-name" className="text-label block mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="first-name"
              required
              className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            />
          </div>

          <div>
            <label htmlFor="last-name" className="text-label block mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="last-name"
              required
              className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email-quote" className="text-label block mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email-quote"
            required
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone-quote" className="text-label block mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone-quote"
            required
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address-quote" className="text-label block mb-2">
            Property Address *
          </label>
          <input
            type="text"
            id="address-quote"
            required
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="123 Main Street, City, State, ZIP"
          />
          <p className="text-body-small text-muted-foreground mt-1">
            Full address helps us assess roof orientation and sun exposure
          </p>
        </div>

        <div>
          <label htmlFor="home-type" className="text-label block mb-2">
            Home Type *
          </label>
          <select
            id="home-type"
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>Single Family Home</option>
            <option>Townhouse</option>
            <option>Condo</option>
            <option>Multi-Family</option>
          </select>
        </div>

        <div>
          <label htmlFor="bill-amount" className="text-label block mb-2">
            Average Monthly Electric Bill *
          </label>
          <select
            id="bill-amount"
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>Under $100</option>
            <option>$100 - $150</option>
            <option>$150 - $200</option>
            <option>$200 - $300</option>
            <option>Over $300</option>
          </select>
          <p className="text-body-small text-muted-foreground mt-1">
            Helps us recommend the right system size for your needs
          </p>
        </div>

        <div>
          <label htmlFor="timeline" className="text-label block mb-2">
            Installation Timeline
          </label>
          <select
            id="timeline"
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>As soon as possible</option>
            <option>Within 3 months</option>
            <option>Within 6 months</option>
            <option>Just researching</option>
          </select>
        </div>

        <div>
          <label htmlFor="comments" className="text-label block mb-2">
            Additional Comments
          </label>
          <textarea
            id="comments"
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="Any questions or special requirements?"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            className="mt-1"
          />
          <label htmlFor="consent" className="text-body-small">
            I agree to receive communication about solar installation services and understand
            that my information will be used in accordance with the privacy policy
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors"
        >
          Get Free Quote
        </button>

        <p className="text-caption text-muted-foreground text-center">
          * Required fields • Response time: Within 24 hours
        </p>
      </form>
    </div>
  ),
};

export const SearchForm: Story = {
  render: () => (
    <div className="max-w-2xl">
      <form className="space-y-4">
        <div>
          <label htmlFor="search" className="text-label block mb-2">
            Search Installers
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-body bg-background"
              placeholder="Enter city, state, or ZIP code"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
          </div>
          <p className="text-body-small text-muted-foreground mt-2">
            Find certified solar installers near you
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-border rounded-lg text-button hover:bg-muted/50 transition-colors"
          >
            Use My Location
          </button>
        </div>
      </form>
    </div>
  ),
};

export const LoginForm: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-heading-2 mb-2">Welcome Back</h2>
        <p className="text-body text-muted-foreground">
          Sign in to access your solar dashboard
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="login-email" className="text-label block mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-label">
              Password
            </label>
            <a href="#" className="text-body-small text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
          />
          <label htmlFor="remember" className="text-body-small">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>

        <p className="text-body-small text-center text-muted-foreground">
          Do not have an account?{' '}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  ),
};

export const CompactFilterForm: Story = {
  render: () => (
    <div className="max-w-4xl">
      <h3 className="font-heading-3 mb-4">Filter Results</h3>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="system-size" className="text-label block mb-2">
            System Size
          </label>
          <select
            id="system-size"
            className="w-full px-3 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>Any</option>
            <option>Under 5 kW</option>
            <option>5-10 kW</option>
            <option>Over 10 kW</option>
          </select>
        </div>

        <div>
          <label htmlFor="price-range" className="text-label block mb-2">
            Price Range
          </label>
          <select
            id="price-range"
            className="w-full px-3 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>Any</option>
            <option>Under $15k</option>
            <option>$15k - $25k</option>
            <option>Over $25k</option>
          </select>
        </div>

        <div>
          <label htmlFor="installer-rating" className="text-label block mb-2">
            Rating
          </label>
          <select
            id="installer-rating"
            className="w-full px-3 py-2 border border-border rounded-lg text-body bg-background"
          >
            <option>Any</option>
            <option>4+ stars</option>
            <option>4.5+ stars</option>
            <option>5 stars</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-lg py-2 px-4 text-button hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  ),
};

export const ResponsiveForm: Story = {
  render: () => (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-heading-2 mb-2">Contact Us</h2>
        <p className="text-body text-muted-foreground">
          This form demonstrates responsive typography that adapts to screen size
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name-responsive" className="text-label block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name-responsive"
              className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            />
          </div>

          <div>
            <label htmlFor="email-responsive" className="text-label block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email-responsive"
              className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message-responsive" className="text-label block mb-2">
            Message
          </label>
          <textarea
            id="message-responsive"
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-lg text-body bg-background"
          />
          <p className="text-body-small text-muted-foreground mt-1">
            Labels scale from 13px (mobile) to 14px (desktop) • Body text scales from 14px to 16px
          </p>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-primary text-white rounded-lg py-3 px-8 text-button hover:bg-primary/90 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  ),
};
