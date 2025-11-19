'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button';

// Mock data hook (replace with real API call in Phase B5)
const useMockVerificationData = (id: string) => {
  return {
    installer: {
      id,
      name: 'John Smith',
      email: 'john@solarsolutions.com.au',
      phone: '+61 412 345 678',
      phoneVerified: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    verification: {
      id: 'verification-123',
      status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO',
      companyName: 'Solar Solutions Pty Ltd',
      representativeName: 'John Smith',
      designation: 'Managing Director',
      email: 'john@solarsolutions.com.au',
      phone: '+61 412 345 678',
      abnOrLicense: 'ABN 12 345 678 901',
      establishedYear: 2018,
      employeeCount: 15,
      services: ['Installation', 'Maintenance', 'Repair', 'Consultation'],
      serviceAreas: ['Sydney', 'Regional NSW', 'Central Coast'],
      postcodes: ['2000', '2001', '2050', '2060'],
      website: 'https://www.solarsolutions.com.au',
      socialLinks: {
        facebook: 'https://facebook.com/solarsolutionsau',
        instagram: 'https://instagram.com/solarsolutions_au',
        linkedin: 'https://linkedin.com/company/solarsolutions',
        youtube: 'https://youtube.com/@solarsolutions',
      },
      companyDescription: 'Leading solar installation company with 6+ years experience serving Sydney and surrounding areas. Specializing in residential and commercial installations.',
      licenseDocKey: 'docs/license-12345.pdf',
      abnDocKey: 'docs/abn-67890.pdf',
      logoKey: 'logos/solar-solutions.png',
      adminNotes: null,
      submittedAt: '2024-03-20T14:22:00Z',
    },
    activityLog: [
      {
        id: '1',
        action: 'APPLICATION_SUBMITTED',
        performedBy: 'John Smith',
        timestamp: '2024-03-20T14:22:00Z',
        details: 'Initial verification application submitted',
      },
      {
        id: '2',
        action: 'UNDER_REVIEW',
        performedBy: 'Admin User',
        timestamp: '2024-03-20T15:10:00Z',
        details: 'Application moved to under review',
      },
    ],
  };
};

const AdminInstallerVerificationPage: React.FC = () => {
  const params = useParams();
  const installerId = params?.id as string;
  const { installer, verification, activityLog } = useMockVerificationData(installerId);
  const [adminNotes, setAdminNotes] = useState(verification.adminNotes || '');

  // Action handlers (disabled until Phase B5)
  const handleApprove = () => {
    console.log('Approve clicked - disabled until Phase B5');
  };

  const handleReject = () => {
    console.log('Reject clicked - disabled until Phase B5');
  };

  const handleRequestInfo = () => {
    console.log('Request More Info clicked - disabled until Phase B5');
  };

  const getStatusBadge = () => {
    switch (verification.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error border border-error/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Rejected
          </span>
        );
      case 'MORE_INFO':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            More Info Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-heading-2 text-foreground">Installer Verification Review</h1>
          <p className="text-body text-muted-foreground mt-1">
            Review and manage installer verification application
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Installer Snapshot */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Installer Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Name</label>
            <p className="text-body text-foreground">{installer.name}</p>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Email</label>
            <p className="text-body text-foreground">{installer.email}</p>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Phone</label>
            <div className="flex items-center gap-2">
              <p className="text-body text-foreground">{installer.phone}</p>
              {installer.phoneVerified && (
                <span className="text-success">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Account Created</label>
            <p className="text-body text-foreground">
              {new Date(installer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Application Details */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Application Details</h2>
          <p className="text-body-small text-muted-foreground">
            Submitted: {new Date(verification.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Company & Representative */}
        <div>
          <h3 className="text-body text-foreground mb-3">Company & Representative</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Company Name</label>
              <p className="text-body text-foreground">{verification.companyName}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Representative Name</label>
              <p className="text-body text-foreground">{verification.representativeName}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Designation</label>
              <p className="text-body text-foreground">{verification.designation}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Contact Email</label>
              <p className="text-body text-foreground">{verification.email}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Contact Phone</label>
              <p className="text-body text-foreground">{verification.phone}</p>
            </div>
          </div>
        </div>

        {/* Business Legal */}
        <div>
          <h3 className="text-body text-foreground mb-3">Business Legal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-body-small text-muted-foreground mb-1">ABN/License</label>
              <p className="text-body text-foreground">{verification.abnOrLicense}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Established Year</label>
              <p className="text-body text-foreground">{verification.establishedYear}</p>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Employee Count</label>
              <p className="text-body text-foreground">{verification.employeeCount}</p>
            </div>
          </div>

          {/* Document Links (Disabled) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {verification.licenseDocKey && (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/10 border border-border text-muted-foreground cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                License Document (API Required)
              </button>
            )}

            {verification.abnDocKey && (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/10 border border-border text-muted-foreground cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                ABN Document (API Required)
              </button>
            )}
          </div>
        </div>

        {/* Services & Coverage */}
        <div>
          <h3 className="text-body text-foreground mb-3">Services & Coverage</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-body-small text-muted-foreground mb-2">Services Offered</label>
              <div className="flex flex-wrap gap-2">
                {verification.services.map(service => (
                  <span key={service} className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-body-small">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-2">Service Areas</label>
              <div className="flex flex-wrap gap-2">
                {verification.serviceAreas.map(area => (
                  <span key={area} className="px-3 py-1 rounded-full bg-accent/10 text-foreground border border-border text-body-small">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Postcodes Served</label>
              <p className="text-body text-foreground">{verification.postcodes.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(verification.website || verification.socialLinks || verification.companyDescription) && (
          <div>
            <h3 className="text-body text-foreground mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verification.website && (
                <div>
                  <label className="block text-body-small text-muted-foreground mb-1">Website</label>
                  <a href={verification.website} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:underline">
                    {verification.website}
                  </a>
                </div>
              )}

              {verification.socialLinks?.facebook && (
                <div>
                  <label className="block text-body-small text-muted-foreground mb-1">Facebook</label>
                  <a href={verification.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:underline">
                    {verification.socialLinks.facebook}
                  </a>
                </div>
              )}

              {verification.socialLinks?.instagram && (
                <div>
                  <label className="block text-body-small text-muted-foreground mb-1">Instagram</label>
                  <a href={verification.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:underline">
                    {verification.socialLinks.instagram}
                  </a>
                </div>
              )}

              {verification.socialLinks?.linkedin && (
                <div>
                  <label className="block text-body-small text-muted-foreground mb-1">LinkedIn</label>
                  <a href={verification.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:underline">
                    {verification.socialLinks.linkedin}
                  </a>
                </div>
              )}

              {verification.socialLinks?.youtube && (
                <div>
                  <label className="block text-body-small text-muted-foreground mb-1">YouTube</label>
                  <a href={verification.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-body text-primary hover:underline">
                    {verification.socialLinks.youtube}
                  </a>
                </div>
              )}
            </div>

            {verification.companyDescription && (
              <div className="mt-4">
                <label className="block text-body-small text-muted-foreground mb-1">Company Description</label>
                <p className="text-body text-foreground">{verification.companyDescription}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logo Preview */}
      {verification.logoKey && (
        <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-heading-3 text-foreground">Company Logo</h2>
          </div>

          <div className="flex items-center justify-center p-8 bg-muted/5 border border-dashed border-border rounded-xl">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-body text-muted-foreground mt-3">Logo Preview</p>
              <p className="text-body-small text-muted-foreground mt-1">(Image display requires S3 presigned URL - API pending)</p>
              <p className="text-caption text-muted-foreground mt-2">Key: {verification.logoKey}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Admin Notes</h2>
        </div>

        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add internal notes about this verification application..."
          className="w-full h-32 rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />

        <Button variant="secondary" disabled>
          Save Notes (API Required)
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6">
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleApprove} disabled>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Approve Application (API Required)
          </Button>

          <Button variant="secondary" onClick={handleReject} disabled>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Reject Application (API Required)
          </Button>

          <Button variant="secondary" onClick={handleRequestInfo} disabled>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Request More Information (API Required)
          </Button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Activity Log</h2>
        </div>

        <div className="space-y-3">
          {activityLog.map(log => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/5 border border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-body text-foreground">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-body-small text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-body-small text-muted-foreground mt-1">{log.details}</p>
                <p className="text-body-small text-muted-foreground">By: {log.performedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminInstallerVerificationPage;
