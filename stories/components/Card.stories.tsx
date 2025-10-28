import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Card Component with Typography Tokens
 * 
 * Demonstrates how typography tokens maintain hierarchy within card layouts.
 * Shows proper use of heading levels, body text variants, and caption text.
 */

const meta = {
  title: 'Components/Card',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card components using typography tokens for consistent text hierarchy and readability.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicCard: Story = {
  render: () => (
    <div className="max-w-md border border-border rounded-lg p-6 bg-background">
      <h3 className="font-heading-3 mb-3">Solar Panel Installation</h3>
      <p className="text-body mb-4">
        Professional installation of high-efficiency solar panels for your home or business.
        Reduce energy costs and carbon footprint with our premium solar solutions.
      </p>
      <p className="text-caption text-muted-foreground">
        Starting at $15,000 • 25-year warranty
      </p>
    </div>
  ),
};

export const CardWithFullHierarchy: Story = {
  render: () => (
    <div className="max-w-lg border border-border rounded-lg p-6 bg-background">
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-heading-2">Premium Solar Package</h2>
        <span className="text-label text-primary">Recommended</span>
      </div>
      
      <h3 className="font-heading-3 mb-2">8.5 kW System</h3>
      <p className="text-body-large mb-4">
        Our most popular package includes 24 high-efficiency panels, inverter, and complete
        installation with professional monitoring.
      </p>
      
      <div className="space-y-3 mb-4">
        <div>
          <h4 className="font-heading-4 mb-1">Key Features</h4>
          <ul className="text-body space-y-1">
            <li>• 25-year performance warranty</li>
            <li>• Real-time monitoring app</li>
            <li>• Premium tier-1 panels</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-heading-4 mb-1">Estimated Savings</h4>
          <p className="text-body">
            Save approximately <span className="font-semibold">$1,200 per year</span> on
            electricity bills with an average payback period of 7-9 years.
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <p className="text-body-small text-muted-foreground mb-2">
          Price includes federal tax credit (30%)
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-body-large font-bold">$25,500</span>
          <span className="text-body text-muted-foreground line-through">$36,428</span>
        </div>
      </div>
    </div>
  ),
};

export const CompactCard: Story = {
  render: () => (
    <div className="max-w-sm border border-border rounded-lg p-4 bg-background">
      <h4 className="font-heading-4 mb-2">Quick Quote Request</h4>
      <p className="text-body-small mb-3">
        Get a personalized solar quote in under 2 minutes. No commitment required.
      </p>
      <button className="text-button text-primary hover:underline">
        Start Now →
      </button>
    </div>
  ),
};

export const LargeCard: Story = {
  render: () => (
    <div className="max-w-2xl border border-border rounded-lg p-8 bg-background">
      <h1 className="font-heading-1 mb-4">Transform Your Energy Future</h1>
      <p className="text-body-large mb-6">
        Join thousands of homeowners who have made the switch to clean, renewable solar energy.
        Our end-to-end service makes going solar simple and affordable.
      </p>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className="font-heading-3 mb-2">10,000+</h3>
          <p className="text-body">Installations</p>
          <p className="text-caption text-muted-foreground">Since 2015</p>
        </div>
        <div>
          <h3 className="font-heading-3 mb-2">$50M+</h3>
          <p className="text-body">Customer Savings</p>
          <p className="text-caption text-muted-foreground">Annual total</p>
        </div>
        <div>
          <h3 className="font-heading-3 mb-2">4.9/5</h3>
          <p className="text-body">Customer Rating</p>
          <p className="text-caption text-muted-foreground">1,200+ reviews</p>
        </div>
      </div>
      
      <p className="text-body">
        Our certified installers work with you from initial consultation through system activation,
        ensuring a seamless experience. We handle permits, inspections, and utility coordination so
        you can focus on enjoying clean energy.
      </p>
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-3">Residential Solar</h3>
        <p className="text-body mb-4">
          Custom solar solutions designed for your home and energy needs.
        </p>
        <p className="text-body-small text-muted-foreground">
          Average system: 6-10 kW
        </p>
      </div>
      
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-3">Commercial Solar</h3>
        <p className="text-body mb-4">
          Large-scale solar installations for businesses and organizations.
        </p>
        <p className="text-body-small text-muted-foreground">
          Average system: 50-500 kW
        </p>
      </div>
      
      <div className="border border-border rounded-lg p-6 bg-background">
        <h3 className="font-heading-3 mb-3">Solar Batteries</h3>
        <p className="text-body mb-4">
          Energy storage solutions for backup power and grid independence.
        </p>
        <p className="text-body-small text-muted-foreground">
          Capacity: 10-20 kWh
        </p>
      </div>
    </div>
  ),
};

export const ResponsiveCard: Story = {
  render: () => (
    <div className="border border-border rounded-lg p-6 bg-background">
      <div className="mb-4">
        <h2 className="font-heading-2 mb-2">Responsive Typography</h2>
        <p className="text-caption text-muted-foreground">
          Resize your browser to see typography scale from mobile to desktop
        </p>
      </div>
      
      <p className="text-body-large mb-4">
        This large body text scales from 16px on mobile (320px) to 20px on desktop (1024px+),
        maintaining optimal readability at all screen sizes.
      </p>
      
      <p className="text-body mb-4">
        Regular body text scales from 14px on mobile to 16px on desktop. Line heights and
        letter spacing are optimized for comfortable reading at each breakpoint.
      </p>
      
      <p className="text-body-small text-muted-foreground">
        Small text remains readable even at mobile sizes while taking up less space for
        secondary information.
      </p>
    </div>
  ),
};

export const CardWithButton: Story = {
  render: () => (
    <div className="max-w-md border border-border rounded-lg p-6 bg-background">
      <h3 className="font-heading-3 mb-3">Get Your Free Quote</h3>
      <p className="text-body mb-6">
        Answer a few quick questions about your property and energy usage to receive a
        personalized solar quote with no obligation.
      </p>
      <button className="w-full bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors">
        Start Free Quote
      </button>
      <p className="text-caption text-muted-foreground text-center mt-3">
        Takes less than 2 minutes • No credit card required
      </p>
    </div>
  ),
};

export const NewsCard: Story = {
  render: () => (
    <div className="max-w-xl border border-border rounded-lg overflow-hidden bg-background">
      <div className="h-48 bg-muted"></div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-caption text-muted-foreground">News</span>
          <span className="text-caption text-muted-foreground">•</span>
          <span className="text-caption text-muted-foreground">October 28, 2025</span>
        </div>
        <h3 className="font-heading-3 mb-3">
          New Federal Tax Credit Increases Solar Savings by 30%
        </h3>
        <p className="text-body mb-4">
          The recently expanded Investment Tax Credit (ITC) now offers homeowners up to 30%
          back on solar installation costs, making renewable energy more affordable than ever.
        </p>
        <a href="#" className="text-button text-primary hover:underline">
          Read more →
        </a>
      </div>
    </div>
  ),
};

export const TestimonialCard: Story = {
  render: () => (
    <div className="max-w-lg border border-border rounded-lg p-6 bg-background">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
        <div>
          <h4 className="font-heading-4">Sarah Johnson</h4>
          <p className="text-body-small text-muted-foreground">Homeowner, San Francisco</p>
        </div>
      </div>
      <p className="text-body mb-4">
        Working with this solar company was incredibly easy. From the initial consultation
        to final installation, everything was handled professionally. My electricity bill
        has dropped by 85% and the system looks great on my roof!
      </p>
      <div className="flex items-center gap-1">
        <span className="text-body">⭐⭐⭐⭐⭐</span>
        <span className="text-caption text-muted-foreground ml-2">5.0 out of 5</span>
      </div>
    </div>
  ),
};

export const PricingCard: Story = {
  render: () => (
    <div className="max-w-sm border-2 border-primary rounded-lg p-6 bg-background">
      <div className="text-center mb-6">
        <h3 className="font-heading-3 mb-2">Standard Package</h3>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-body-large font-bold">$19,500</span>
          <span className="text-body-small text-muted-foreground">/system</span>
        </div>
        <p className="text-caption text-muted-foreground">After 30% federal tax credit</p>
      </div>
      
      <ul className="space-y-3 mb-6 text-body">
        <li className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          <span>6.5 kW solar system</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          <span>18 premium panels</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          <span>25-year warranty</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          <span>Professional installation</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          <span>Monitoring system</span>
        </li>
      </ul>
      
      <button className="w-full bg-primary text-white rounded-lg py-3 px-6 text-button hover:bg-primary/90 transition-colors">
        Choose Plan
      </button>
    </div>
  ),
};
