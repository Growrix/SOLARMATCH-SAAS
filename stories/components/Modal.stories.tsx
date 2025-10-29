import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta = {
  title: 'Components/Modal',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Modal component demonstrating Level 4 elevation (shadow-modal)
 * Highest elevation in the system - appears above all other content
 */
export const BasicModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Modal Component</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Modals use <code className="bg-muted px-2 py-1 rounded">shadow-modal</code> token (Level 4 - highest elevation) to clearly separate from all underlying content.
          </p>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          Open Basic Modal
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-border max-w-md w-full animate-slideInUp">
                <div className="p-6">
                  <h3 className="font-heading-3 mb-4">Modal Title</h3>
                  <p className="text-body text-foreground-secondary mb-6">
                    This is a basic modal with the highest elevation in the system. 
                    Click the backdrop or Cancel button to close.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="border-2 border-border text-foreground px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-info-light rounded text-body-small text-info-dark max-w-2xl">
          <p><strong>Elevation:</strong> Level 4 (highest - above everything)</p>
          <p><strong>Shadow Token:</strong> <code>shadow-modal</code></p>
          <p><strong>Z-index:</strong> 100 (backdrop), 101 (modal)</p>
          <p className="mt-2"><strong>Use for:</strong> Critical actions, confirmations, forms requiring user attention</p>
        </div>
      </div>
    );
  },
};

/**
 * Confirmation modal with destructive action
 */
export const ConfirmationModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Confirmation Modal</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Used for destructive actions that require user confirmation.
          </p>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="bg-error text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          Delete Account
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-error max-w-md w-full animate-slideInUp">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-error-light flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading-3 text-error mb-2">Delete Account?</h3>
                      <p className="text-body text-foreground-secondary mb-4">
                        This action cannot be undone. All your data, leads, and settings will be permanently deleted.
                      </p>
                      <div className="bg-warning-light border border-warning rounded p-3 mb-4">
                        <p className="text-body-small text-warning-dark">
                          <strong>Warning:</strong> You have 12 active leads. Please ensure all transactions are complete.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="border-2 border-border text-foreground px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="bg-error text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};

/**
 * Form modal with multiple inputs
 */
export const FormModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Form Modal</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Modal containing a form for data entry.
          </p>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          Add New Lead
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-border max-w-lg w-full animate-slideInUp max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="font-heading-3 mb-6">Add New Lead</h3>
                  
                  <form className="space-y-form-gap">
                    <div>
                      <label className="block text-label text-foreground mb-2">
                        Full Name *
                      </label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 border-2 border-border rounded-input text-body focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-label text-foreground mb-2">
                        Email Address *
                      </label>
                      <input 
                        type="email"
                        className="w-full px-3 py-2 border-2 border-border rounded-input text-body focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-label text-foreground mb-2">
                        Phone Number
                      </label>
                      <input 
                        type="tel"
                        className="w-full px-3 py-2 border-2 border-border rounded-input text-body focus:outline-none focus:border-primary transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-label text-foreground mb-2">
                        Property Address *
                      </label>
                      <textarea 
                        className="w-full px-3 py-2 border-2 border-border rounded-input text-body focus:outline-none focus:border-primary transition-colors"
                        rows={3}
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>

                    <div>
                      <label className="block text-label text-foreground mb-2">
                        Lead Source
                      </label>
                      <select className="w-full px-3 py-2 border-2 border-border rounded-input text-body focus:outline-none focus:border-primary transition-colors">
                        <option>Website Form</option>
                        <option>Phone Call</option>
                        <option>Referral</option>
                        <option>Social Media</option>
                      </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                      <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="border-2 border-border text-foreground px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        onClick={(e) => { e.preventDefault(); setIsOpen(false); }}
                        className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                      >
                        Add Lead
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};

/**
 * Large modal with scrollable content
 */
export const LargeModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Large Modal</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Modal with extensive content that scrolls independently.
          </p>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          View Terms & Conditions
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-border max-w-4xl w-full max-h-[90vh] flex flex-col animate-slideInUp">
                {/* Fixed Header */}
                <div className="p-6 border-b border-border flex-shrink-0">
                  <h3 className="font-heading-3">Terms & Conditions</h3>
                  <p className="text-body-small text-muted mt-1">Last updated: January 27, 2025</p>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="space-y-6 text-body text-foreground-secondary">
                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">1. Acceptance of Terms</h4>
                      <p>
                        By accessing and using SolarMatch, you accept and agree to be bound by the terms and 
                        provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">2. Use License</h4>
                      <p>
                        Permission is granted to temporarily download one copy of the materials on SolarMatch's 
                        website for personal, non-commercial transitory viewing only.
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>This is the grant of a license, not a transfer of title</li>
                        <li>This license shall automatically terminate if you violate any of these restrictions</li>
                        <li>Upon termination, you must destroy any downloaded materials</li>
                      </ul>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">3. Disclaimer</h4>
                      <p>
                        The materials on SolarMatch's website are provided on an 'as is' basis. SolarMatch makes 
                        no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                        including, without limitation, implied warranties or conditions of merchantability, fitness 
                        for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">4. Limitations</h4>
                      <p>
                        In no event shall SolarMatch or its suppliers be liable for any damages (including, without 
                        limitation, damages for loss of data or profit, or due to business interruption) arising out 
                        of the use or inability to use the materials on SolarMatch's website.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">5. Accuracy of Materials</h4>
                      <p>
                        The materials appearing on SolarMatch's website could include technical, typographical, or 
                        photographic errors. SolarMatch does not warrant that any of the materials on its website 
                        are accurate, complete or current.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">6. Links</h4>
                      <p>
                        SolarMatch has not reviewed all of the sites linked to its website and is not responsible 
                        for the contents of any such linked site. The inclusion of any link does not imply endorsement 
                        by SolarMatch of the site.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-heading-4 text-foreground mb-2">7. Modifications</h4>
                      <p>
                        SolarMatch may revise these terms of service for its website at any time without notice. 
                        By using this website you are agreeing to be bound by the then current version of these terms of service.
                      </p>
                    </section>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t border-border flex-shrink-0">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="border-2 border-border text-foreground px-button-padding-x py-button-padding-y rounded-button hover:border-primary transition-colors"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                    >
                      Accept Terms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};

/**
 * Small modal (alert style)
 */
export const SmallModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Small Modal (Alert)</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Compact modal for simple confirmations and alerts.
          </p>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="bg-success text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          Save Changes
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-success max-w-sm w-full animate-slideInUp">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="font-heading-3 text-success mb-2">Success!</h3>
                  <p className="text-body text-foreground-secondary mb-6">
                    Your changes have been saved successfully.
                  </p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="bg-success text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow w-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};

/**
 * Modal size comparison
 */
export const ModalSizes: Story = {
  render: () => {
    const [openModal, setOpenModal] = useState<'small' | 'medium' | 'large' | null>(null);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Modal Sizes</h2>
          <p className="text-body text-foreground-secondary mb-8">
            All modals use shadow-modal regardless of size for consistent elevation.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setOpenModal('small')}
            className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
          >
            Small Modal
          </button>
          <button 
            onClick={() => setOpenModal('medium')}
            className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
          >
            Medium Modal
          </button>
          <button 
            onClick={() => setOpenModal('large')}
            className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
          >
            Large Modal
          </button>
        </div>

        {openModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn"
              onClick={() => setOpenModal(null)}
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className={`bg-surface rounded-lg shadow-modal border border-border w-full animate-slideInUp ${
                openModal === 'small' ? 'max-w-sm' :
                openModal === 'medium' ? 'max-w-md' :
                'max-w-4xl'
              }`}>
                <div className="p-6">
                  <h3 className="font-heading-3 mb-4 capitalize">{openModal} Modal</h3>
                  <p className="text-body text-foreground-secondary mb-6">
                    {openModal === 'small' && 'max-w-sm (384px) - For alerts and simple confirmations'}
                    {openModal === 'medium' && 'max-w-md (448px) - For forms and standard dialogs'}
                    {openModal === 'large' && 'max-w-4xl (896px) - For complex forms and content'}
                  </p>
                  <div className="p-4 bg-info-light rounded text-body-small text-info-dark mb-6">
                    <p><strong>All sizes use:</strong></p>
                    <ul className="list-disc list-inside mt-2">
                      <li>shadow-modal (Level 4 elevation)</li>
                      <li>z-index: 100 (backdrop), 101 (modal)</li>
                      <li>Same border-radius (rounded-lg)</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setOpenModal(null)}
                    className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};

/**
 * All modal states
 */
export const AllStates: Story = {
  render: () => (
    <div className="p-8">
      <div>
        <h2 className="font-heading-2 mb-heading-margin">Modal States</h2>
        <p className="text-body text-foreground-secondary mb-8">
          Comprehensive demonstration of modal appearance across themes.
        </p>
      </div>

      <div className="space-y-8">
        {/* Visual demo */}
        <div className="bg-background border border-border rounded-lg p-12 relative">
          <div className="absolute inset-0 bg-surface rounded-lg"></div>
          
          {/* Simulated modal */}
          <div className="relative z-10 max-w-md mx-auto">
            <div className="bg-surface rounded-lg shadow-modal border border-border p-6">
              <h3 className="font-heading-3 mb-4">Modal Example</h3>
              <p className="text-body text-foreground-secondary mb-6">
                This demonstrates the modal appearance with shadow-modal elevation.
              </p>
              <div className="flex gap-3 justify-end">
                <button className="border-2 border-border text-foreground px-button-padding-x py-button-padding-y rounded-button">
                  Cancel
                </button>
                <button className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-warning-light rounded text-body-small text-warning-dark">
          <p><strong>Theme Switching:</strong> Use the theme toolbar to see how modal shadows adapt.</p>
          <p className="mt-2"><strong>Light Theme:</strong> Strong dark shadow for clear separation</p>
          <p><strong>Dark Theme:</strong> Enhanced shadow with lighter/stronger values for visibility</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Elevation comparison: Modal vs Dropdown vs Card
 */
export const ElevationComparison: Story = {
  render: () => {
    const [showModal, setShowModal] = useState(false);

    return (
      <div className="p-8">
        <div>
          <h2 className="font-heading-2 mb-heading-margin">Elevation Hierarchy</h2>
          <p className="text-body text-foreground-secondary mb-8">
            Modal (Level 4) sits above all other elements in the elevation system.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
        >
          Show Elevation Demo
        </button>

        {showModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[100] animate-fadeIn" />
            
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <div className="bg-surface rounded-lg shadow-modal border border-border max-w-3xl w-full animate-slideInUp p-8">
                <h3 className="font-heading-3 mb-6">Complete Elevation System</h3>
                
                {/* Demonstration */}
                <div className="relative bg-background border border-border rounded-lg p-12 mb-6 min-h-[400px]">
                  {/* Card - Level 2 */}
                  <div className="bg-surface rounded-lg shadow-card p-6 max-w-sm mb-24">
                    <h4 className="font-heading-4 mb-2">Card (Level 2)</h4>
                    <p className="text-body-small text-foreground-secondary mb-3">
                      shadow-card | z-index: 10
                    </p>
                    
                    {/* Dropdown - Level 3 */}
                    <div className="relative inline-block">
                      <div className="bg-surface rounded-lg shadow-dropdown border border-border p-3 min-w-[180px]">
                        <p className="text-body-small mb-2">Dropdown (Level 3)</p>
                        <p className="text-body-small text-muted">shadow-dropdown | z-index: 50</p>
                      </div>
                    </div>
                  </div>

                  {/* This modal itself is Level 4 */}
                  <div className="absolute bottom-4 right-4 bg-info-light border border-info rounded p-4 max-w-xs">
                    <p className="text-body-small text-info-dark">
                      <strong>This Modal (Level 4):</strong>
                    </p>
                    <p className="text-body-small text-info-dark mt-1">
                      shadow-modal | z-index: 101
                    </p>
                    <p className="text-body-small text-info-dark mt-2">
                      Appears above cards and dropdowns
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-info-light rounded text-body-small text-info-dark mb-6">
                  <p><strong>Complete Hierarchy:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Level 0: Page (no shadow)</li>
                    <li>Level 1: Button (shadow-button | z-index: 1)</li>
                    <li>Level 2: Card (shadow-card | z-index: 10)</li>
                    <li>Level 3: Dropdown (shadow-dropdown | z-index: 50)</li>
                    <li>Level 4: Modal (shadow-modal | z-index: 100+)</li>
                  </ul>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-primary text-white px-button-padding-x py-button-padding-y rounded-button shadow-button hover:shadow-card transition-shadow"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
};
