'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { z } from 'zod';

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VerificationFormData) => void;
}

// Step 1 schema
const step1Schema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  representativeName: z.string().min(2, 'Representative name is required'),
  designation: z.string().min(2, 'Designation is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^\+614\d{8}$/, 'Valid Australian mobile number required (+614XXXXXXXX)'),
});

// Step 2 schema
const step2Schema = z.object({
  abnOrLicense: z.string().min(5, 'ABN or License number is required'),
  establishedYear: z.number().min(1900).max(new Date().getFullYear(), 'Valid year required'),
  employeeCount: z.number().min(1, 'At least 1 employee required'),
  licenseDocKey: z.string().optional(),
  abnDocKey: z.string().optional(),
});

// Step 3 schema
const step3Schema = z.object({
  services: z.array(z.string()).min(1, 'Select at least one service'),
  serviceAreas: z.array(z.string()).min(1, 'Select at least one service area'),
  postcodes: z.array(z.string()).min(1, 'Enter at least one postcode'),
  website: z.string().url('Valid URL required').optional().or(z.literal('')),
  socialLinks: z.object({
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  companyDescription: z.string().optional(),
  logoKey: z.string().optional(),
});

export type VerificationFormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema>;

const VerificationModal: React.FC<VerificationModalProps> = ({ open, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VerificationFormData>>({
    phone: '+61 ',
    services: [],
    serviceAreas: [],
    postcodes: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format phone to E.164 on change
  const handlePhoneChange = (value: string) => {
    let formatted = value;
    if (!formatted.startsWith('+61')) {
      formatted = '+61 ' + formatted.replace(/^\+?61\s?/, '');
    }
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Validate current step
  const validateStep = () => {
    setErrors({});
    try {
      if (currentStep === 1) {
        step1Schema.parse({
          companyName: formData.companyName,
          representativeName: formData.representativeName,
          designation: formData.designation,
          email: formData.email,
          phone: formData.phone?.replace(/\s/g, ''),
        });
      } else if (currentStep === 2) {
        step2Schema.parse({
          abnOrLicense: formData.abnOrLicense,
          establishedYear: formData.establishedYear,
          employeeCount: formData.employeeCount,
          licenseDocKey: formData.licenseDocKey,
          abnDocKey: formData.abnDocKey,
        });
      } else if (currentStep === 3) {
        step3Schema.parse({
          services: formData.services,
          serviceAreas: formData.serviceAreas,
          postcodes: formData.postcodes,
          website: formData.website,
          socialLinks: formData.socialLinks,
          companyDescription: formData.companyDescription,
          logoKey: formData.logoKey,
        });
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmitForm = () => {
    if (validateStep()) {
      onSubmit(formData as VerificationFormData);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div
        className="bg-surface border border-border rounded-xl shadow-neu-outset max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 id="verification-modal-title" className="text-heading-3 text-foreground">
              Installer Verification
            </h2>
            <p className="text-body-small text-muted-foreground">
              Step {currentStep} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-icon hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Step 1: Personal & Company Identity */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-body-small text-foreground mb-2">
                  Company Name <span className="text-error">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Solar Solutions Pty Ltd"
                />
                {errors.companyName && <p className="text-error text-body-small mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label htmlFor="representativeName" className="block text-body-small text-foreground mb-2">
                  Representative Name <span className="text-error">*</span>
                </label>
                <input
                  id="representativeName"
                  type="text"
                  value={formData.representativeName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, representativeName: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Smith"
                />
                {errors.representativeName && <p className="text-error text-body-small mt-1">{errors.representativeName}</p>}
              </div>

              <div>
                <label htmlFor="designation" className="block text-body-small text-foreground mb-2">
                  Designation <span className="text-error">*</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Managing Director"
                />
                {errors.designation && <p className="text-error text-body-small mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-body-small text-foreground mb-2">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@solarsolutions.com.au"
                />
                {errors.email && <p className="text-error text-body-small mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-body-small text-foreground mb-2">
                  Contact Number <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+61 4XX XXX XXX"
                />
                {errors.phone && <p className="text-error text-body-small mt-1">{errors.phone}</p>}
                <p className="text-body-small text-muted-foreground mt-1">
                  Format: +61 4XX XXX XXX
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Business Legal Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="abnOrLicense" className="block text-body-small text-foreground mb-2">
                  ABN / License Number <span className="text-error">*</span>
                </label>
                <input
                  id="abnOrLicense"
                  type="text"
                  value={formData.abnOrLicense || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, abnOrLicense: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="12 345 678 901"
                />
                {errors.abnOrLicense && <p className="text-error text-body-small mt-1">{errors.abnOrLicense}</p>}
              </div>

              <div>
                <label htmlFor="establishedYear" className="block text-body-small text-foreground mb-2">
                  Company Established Year <span className="text-error">*</span>
                </label>
                <input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {errors.establishedYear && <p className="text-error text-body-small mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <label htmlFor="employeeCount" className="block text-body-small text-foreground mb-2">
                  Employee Count <span className="text-error">*</span>
                </label>
                <input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: parseInt(e.target.value) }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="5"
                  min="1"
                />
                {errors.employeeCount && <p className="text-error text-body-small mt-1">{errors.employeeCount}</p>}
              </div>

              <div>
                <label className="block text-body-small text-foreground mb-2">
                  Upload License Document (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-surface shadow-neu-inset">
                  <svg className="mx-auto h-12 w-12 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-body-small text-muted-foreground mt-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-caption text-muted-foreground">
                    PDF, JPG, PNG (max 5MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-body-small text-foreground mb-2">
                  Upload ABN Document (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-surface shadow-neu-inset">
                  <svg className="mx-auto h-12 w-12 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-body-small text-muted-foreground mt-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-caption text-muted-foreground">
                    PDF, JPG, PNG (max 5MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services & Coverage Areas */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-body-small text-foreground mb-2">
                  Types of Services Offered <span className="text-error">*</span>
                </label>
                <div className="space-y-2">
                  {['Installation', 'Maintenance', 'Inspection', 'Repair', 'Consultation'].map(service => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services?.includes(service)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(formData.services || []), service]
                            : (formData.services || []).filter(s => s !== service);
                          setFormData(prev => ({ ...prev, services: updated }));
                        }}
                        className="rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-body text-foreground">{service}</span>
                    </label>
                  ))}
                </div>
                {errors.services && <p className="text-error text-body-small mt-1">{errors.services}</p>}
              </div>

              <div>
                <label className="block text-body-small text-foreground mb-2">
                  Service Areas <span className="text-error">*</span>
                </label>
                <div className="space-y-2">
                  {['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Regional NSW', 'Regional VIC', 'Regional QLD'].map(area => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.serviceAreas?.includes(area)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(formData.serviceAreas || []), area]
                            : (formData.serviceAreas || []).filter(a => a !== area);
                          setFormData(prev => ({ ...prev, serviceAreas: updated }));
                        }}
                        className="rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-body text-foreground">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.serviceAreas && <p className="text-error text-body-small mt-1">{errors.serviceAreas}</p>}
              </div>

              <div>
                <label htmlFor="postcodes" className="block text-body-small text-foreground mb-2">
                  Postcodes Served <span className="text-error">*</span>
                </label>
                <input
                  id="postcodes"
                  type="text"
                  value={(formData.postcodes || []).join(', ')}
                  onChange={(e) => {
                    const codes = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, postcodes: codes }));
                  }}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="2000, 2001, 2010"
                />
                <p className="text-body-small text-muted-foreground mt-1">
                  Separate multiple postcodes with commas
                </p>
                {errors.postcodes && <p className="text-error text-body-small mt-1">{errors.postcodes}</p>}
              </div>

              <div>
                <label htmlFor="website" className="block text-body-small text-foreground mb-2">
                  Website URL (Optional)
                </label>
                <input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://www.solarsolutions.com.au"
                />
                {errors.website && <p className="text-error text-body-small mt-1">{errors.website}</p>}
              </div>

              <div>
                <label htmlFor="companyDescription" className="block text-body-small text-foreground mb-2">
                  Company Description (Optional)
                </label>
                <textarea
                  id="companyDescription"
                  value={formData.companyDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us about your company..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-body-small text-foreground mb-2">
                  Company Logo (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-surface shadow-neu-inset">
                  <svg className="mx-auto h-12 w-12 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-body-small text-muted-foreground mt-2">
                    Click to upload logo
                  </p>
                  <p className="text-caption text-muted-foreground">
                    PNG, JPG (max 2MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border px-6 py-4 flex justify-between gap-3">
          {currentStep > 1 ? (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}

          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmitForm}>
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
