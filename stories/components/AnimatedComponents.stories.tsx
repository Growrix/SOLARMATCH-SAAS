import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta = {
  title: 'Components/Animated Components',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Button with various transition effects
 */
export const AnimatedButtons: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Animated Buttons</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Buttons with smooth transitions for enhanced user feedback.
        </p>
      </div>

      <div className="space-y-8">
        {/* Color transitions */}
        <div>
          <h3 className="font-heading-3 mb-4">Color Transitions</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg transition-colors duration-150 hover:bg-primary-dark">
              Hover Color Change (150ms)
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white">
              Fill on Hover (200ms)
            </button>
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg transition-all duration-300 hover:from-secondary hover:to-primary">
              Gradient Flip (300ms)
            </button>
          </div>
        </div>

        {/* Scale transitions */}
        <div>
          <h3 className="font-heading-3 mb-4">Scale Transitions</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg transition-transform duration-150 hover:scale-105 active:scale-95">
              Subtle Scale
            </button>
            <button className="bg-secondary text-white px-6 py-3 rounded-lg transition-transform duration-200 hover:scale-110 active:scale-90">
              Medium Scale
            </button>
            <button className="bg-success text-white px-6 py-3 rounded-lg transition-transform duration-300 hover:scale-125 active:scale-95">
              Large Scale
            </button>
          </div>
        </div>

        {/* Shadow transitions */}
        <div>
          <h3 className="font-heading-3 mb-4">Shadow Transitions</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-button transition-shadow duration-150 hover:shadow-card">
              Shadow Grow (150ms)
            </button>
            <button className="bg-secondary text-white px-6 py-3 rounded-lg shadow-card transition-shadow duration-200 hover:shadow-dropdown">
              Shadow Enhance (200ms)
            </button>
            <button className="bg-success text-white px-6 py-3 rounded-lg shadow-dropdown transition-shadow duration-300 hover:shadow-modal">
              Shadow Maximum (300ms)
            </button>
          </div>
        </div>

        {/* Combined transitions */}
        <div>
          <h3 className="font-heading-3 mb-4">Combined Effects</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary-dark hover:scale-105 hover:shadow-card active:scale-95">
              Color + Scale + Shadow
            </button>
            <button className="bg-secondary text-white px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-dropdown">
              Lift + Shadow
            </button>
            <button className="bg-success text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:rotate-3 hover:shadow-card">
              Scale + Rotate + Shadow
            </button>
          </div>
        </div>

        {/* Loading states */}
        <div>
          <h3 className="font-heading-3 mb-4">Loading States</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-3 opacity-75 cursor-not-allowed" disabled>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </button>
            <button className="bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-3 opacity-75 cursor-not-allowed" disabled>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Loading...
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Modal and overlay animations
 */
export const ModalAnimations: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fadeModal, setFadeModal] = useState(false);
    const [slideModal, setSlideModal] = useState(false);

    return (
      <div className="space-y-12 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Modal Animations</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Different animation patterns for modals and overlays.
          </p>
        </div>

        <div className="space-y-8">
          {/* Scale fade modal */}
          <div>
            <h3 className="font-heading-3 mb-4">Scale Fade Modal</h3>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary-dark hover:shadow-card"
            >
              {isOpen ? 'Close Modal' : 'Open Modal'}
            </button>

            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                <div className="relative bg-surface rounded-2xl p-8 max-w-md shadow-modal animate-in zoom-in-95 duration-300">
                  <h4 className="font-heading-3 mb-4">Confirm Action</h4>
                  <p className="text-body text-foreground-secondary mb-6">
                    This modal scales in from 95% to 100% with a fade effect.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-primary-dark"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 border-2 border-border px-6 py-3 rounded-lg transition-all duration-150 hover:border-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fade only modal */}
          <div>
            <h3 className="font-heading-3 mb-4">Fade Only Modal</h3>
            <button
              onClick={() => setFadeModal(!fadeModal)}
              className="bg-secondary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-secondary/90 hover:shadow-card"
            >
              {fadeModal ? 'Close Modal' : 'Open Fade Modal'}
            </button>

            {fadeModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/50 transition-opacity duration-300 opacity-100"
                  onClick={() => setFadeModal(false)}
                />
                <div className="relative bg-surface rounded-2xl p-8 max-w-md shadow-modal transition-opacity duration-300 opacity-100">
                  <h4 className="font-heading-3 mb-4">Simple Fade</h4>
                  <p className="text-body text-foreground-secondary mb-6">
                    This modal uses a simple opacity fade transition.
                  </p>
                  <button
                    onClick={() => setFadeModal(false)}
                    className="w-full bg-secondary text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-secondary/90"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Slide up modal */}
          <div>
            <h3 className="font-heading-3 mb-4">Slide Up Modal</h3>
            <button
              onClick={() => setSlideModal(!slideModal)}
              className="bg-success text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-success/90 hover:shadow-card"
            >
              {slideModal ? 'Close Modal' : 'Open Slide Modal'}
            </button>

            {slideModal && (
              <div className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setSlideModal(false)}
                />
                <div className="relative bg-surface rounded-t-2xl p-8 w-full max-w-2xl shadow-modal animate-in slide-in-from-bottom duration-300">
                  <h4 className="font-heading-3 mb-4">Slide Up Modal</h4>
                  <p className="text-body text-foreground-secondary mb-6">
                    This modal slides up from the bottom of the screen. Common for mobile-first designs.
                  </p>
                  <button
                    onClick={() => setSlideModal(false)}
                    className="w-full bg-success text-white px-6 py-3 rounded-lg transition-all duration-150 hover:bg-success/90"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-info-light border border-info rounded-lg p-4">
          <p className="text-body-small text-info-dark">
            💡 Modals use different animation patterns based on context: scale-fade for dialogs, slide-up for mobile sheets.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * List and card animations
 */
export const ListAnimations: Story = {
  render: () => {
    const [items] = useState([
      { id: 1, name: 'John Smith', status: 'new', color: 'info' },
      { id: 2, name: 'Sarah Johnson', status: 'pending', color: 'warning' },
      { id: 3, name: 'Mike Davis', status: 'converted', color: 'success' },
    ]);

    return (
      <div className="space-y-12 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">List & Card Animations</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Animated lists and cards for better user experience.
          </p>
        </div>

        <div className="space-y-8">
          {/* Staggered list */}
          <div>
            <h3 className="font-heading-3 mb-4">Staggered List Entry</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-xl p-6 transition-all duration-200 hover:shadow-card hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading-4">{item.name}</h4>
                      <p className="text-body-small text-muted capitalize">{item.status}</p>
                    </div>
                    <span className={`bg-${item.color} text-white px-3 py-1 rounded text-body-small capitalize`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover lift cards */}
          <div>
            <h3 className="font-heading-3 mb-4">Hover Lift Cards</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-2 cursor-pointer">
                <h4 className="font-heading-4 mb-2">Quote Request</h4>
                <p className="text-body-small text-foreground-secondary mb-4">
                  System size: 8.5 kW
                </p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg w-full transition-colors duration-150 hover:bg-primary-dark">
                  View Details
                </button>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-2 cursor-pointer">
                <h4 className="font-heading-4 mb-2">Installation</h4>
                <p className="text-body-small text-foreground-secondary mb-4">
                  Scheduled for next week
                </p>
                <button className="bg-success text-white px-4 py-2 rounded-lg w-full transition-colors duration-150 hover:bg-success/90">
                  View Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Border highlight cards */}
          <div>
            <h3 className="font-heading-3 mb-4">Border Highlight Cards</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {['SunPower', 'Tesla Solar', 'Vivint Solar'].map((name, index) => (
                <div
                  key={name}
                  className="bg-surface border-2 border-border rounded-xl p-6 shadow-card transition-all duration-200 hover:border-primary hover:shadow-dropdown cursor-pointer"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-heading-4 mb-2">{name}</h4>
                  <p className="text-body-small text-foreground-secondary">
                    Premium installer
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Form and input animations
 */
export const FormAnimations: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

    const validateEmail = (value: string) => {
      setEmail(value);
      if (value.length === 0) {
        setIsEmailValid(null);
      } else {
        setIsEmailValid(value.includes('@') && value.includes('.'));
      }
    };

    return (
      <div className="space-y-12 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Form Animations</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Animated form inputs and validation feedback.
          </p>
        </div>

        <div className="space-y-8">
          {/* Focus animations */}
          <div>
            <h3 className="font-heading-3 mb-4">Focus Animations</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label text-foreground-secondary mb-2">
                  Standard Focus (border + shadow)
                </label>
                <input
                  type="text"
                  placeholder="Click to focus"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-surface transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-label text-foreground-secondary mb-2">
                  Scale on Focus
                </label>
                <input
                  type="text"
                  placeholder="Click to focus"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-surface transition-all duration-200 focus:border-primary focus:scale-105 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Validation animations */}
          <div>
            <h3 className="font-heading-3 mb-4">Validation Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label text-foreground-secondary mb-2">
                  Email Address (try typing)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    isEmailValid === null
                      ? 'border-border bg-surface focus:border-primary'
                      : isEmailValid
                      ? 'border-success bg-success-light focus:shadow-focus'
                      : 'border-error bg-error-light focus:shadow-focus'
                  }`}
                />
                {isEmailValid === true && (
                  <p className="text-body-small text-success mt-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Valid email address
                  </p>
                )}
                {isEmailValid === false && (
                  <p className="text-body-small text-error mt-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Invalid email format
                  </p>
                )}
              </div>

              <div>
                <label className="block text-label text-foreground-secondary mb-2">
                  Success State
                </label>
                <input
                  type="text"
                  defaultValue="john.smith@example.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-success bg-success-light transition-all duration-200 focus:shadow-focus focus:outline-none"
                />
                <p className="text-body-small text-success mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email verified
                </p>
              </div>

              <div>
                <label className="block text-label text-foreground-secondary mb-2">
                  Error State
                </label>
                <input
                  type="password"
                  defaultValue="123"
                  className="w-full px-4 py-3 rounded-lg border-2 border-error bg-error-light transition-all duration-200 focus:shadow-focus focus:outline-none"
                />
                <p className="text-body-small text-error mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password must be at least 8 characters
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox and radio animations */}
          <div>
            <h3 className="font-heading-3 mb-4">Checkbox & Radio Animations</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 rounded-lg border-2 border-border bg-surface cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary-light">
                <input type="checkbox" className="mr-3" />
                <span className="text-body">I agree to the terms and conditions</span>
              </label>
              <label className="flex items-center p-4 rounded-lg border-2 border-border bg-surface cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary-light">
                <input type="checkbox" className="mr-3" />
                <span className="text-body">Subscribe to newsletter</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Solar industry specific animations
 */
export const SolarIndustryAnimations: Story = {
  render: () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = () => {
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 3000);
    };

    return (
      <div className="space-y-12 max-w-4xl">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Solar Industry Examples</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Animation patterns specific to SolarMatch application.
          </p>
        </div>

        <div className="space-y-12">
          {/* Quote submission */}
          <div>
            <h3 className="font-heading-3 mb-4">Quote Request Submission</h3>
            <div className="bg-surface border border-border rounded-xl p-8 shadow-card max-w-md">
              <h4 className="font-heading-4 mb-6">Get Your Free Quote</h4>
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Property Address"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-surface transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  placeholder="Monthly Electric Bill ($)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-surface transition-all duration-200 focus:border-primary focus:shadow-focus focus:outline-none"
                  disabled={isProcessing}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-primary text-white px-6 py-4 rounded-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-card active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Free Quote'
                )}
              </button>
              {isProcessing && (
                <p className="text-body-small text-muted mt-4 text-center animate-pulse">
                  Matching you with top installers...
                </p>
              )}
            </div>
          </div>

          {/* Real-time lead notifications */}
          <div>
            <h3 className="font-heading-3 mb-4">Real-Time Lead Notifications</h3>
            <div className="space-y-3">
              <div className="bg-surface border-l-4 border-info rounded p-4 shadow-card animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3">
                  <div className="relative w-3 h-3">
                    <div className="absolute inset-0 bg-info rounded-full animate-ping" />
                    <div className="relative w-3 h-3 bg-info rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading-4 text-body-small">New Lead: John Smith</p>
                    <p className="text-body-small text-muted">San Francisco, CA • Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Installation progress */}
          <div>
            <h3 className="font-heading-3 mb-4">Installation Progress</h3>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
              <div className="space-y-4">
                <div className="flex items-center gap-4 transition-all duration-300 hover:translate-x-2">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="font-heading-4 text-body">Quote Accepted</p>
                    <p className="text-body-small text-success">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 transition-all duration-300 hover:translate-x-2">
                  <div className="relative w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin absolute" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading-4 text-body">Site Inspection</p>
                    <p className="text-body-small text-warning">In progress...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-muted">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-heading-4 text-body">Installation</p>
                    <p className="text-body-small text-muted">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
