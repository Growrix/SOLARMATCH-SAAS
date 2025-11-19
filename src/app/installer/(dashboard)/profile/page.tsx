'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import VerificationModal from '@/components/installer/VerificationModal';
import ContactVerificationModal from '@/components/homeowner/ContactVerificationModal';
import OTPVerificationModal from '@/components/OTPVerificationModal';

// Mock data hook (replace with real API call in Phase B5)
const useMockProfileData = () => {
  return {
    user: {
      id: 'mock-user-id',
      name: 'John Smith',
      email: 'john@solarsolutions.com.au',
      phone: '+61 412 345 678',
      phoneVerified: true,
      companyName: 'Solar Solutions Pty Ltd',
      installerVerified: false,
      image: null,
    },
    verification: {
      status: 'PENDING', // PENDING | APPROVED | REJECTED | MORE_INFO
      companyName: 'Solar Solutions Pty Ltd',
      representativeName: 'John Smith',
      designation: 'Managing Director',
      services: ['Installation', 'Maintenance'],
      serviceAreas: ['Sydney', 'Regional NSW'],
      postcodes: ['2000', '2001'],
      website: 'https://www.solarsolutions.com.au',
      adminNotes: null,
    },
    preferences: {
      alertNewLead: true,
      alertLeadUpdates: true,
      alertAdminMessages: true,
      alertVerificationUpdates: true,
      alertAccountActivity: false,
    },
  };
};

const InstallerProfilePage: React.FC = () => {
  const { user, verification, preferences } = useMockProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  // Contact verification state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpPayload, setOtpPayload] = useState<{
    phoneNumber: string;
    verificationId: string;
    expiresAt: Date;
  } | null>(null);

  // Status badge logic
  const getStatusBadge = () => {
    if (user.installerVerified) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified Installer
        </span>
      );
    }

    if (verification?.status === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Verification Pending
        </span>
      );
    }

    if (verification?.status === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error border border-error/20">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Verification Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/10 text-muted-foreground border border-border">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Not Verified
      </span>
    );
  };

  const handleVerificationSubmit = (data: any) => {
    console.log('Verification data submitted:', data);
    setIsVerificationModalOpen(false);
    // TODO: API call in Phase B5
  };

  const handleOTPRequested = (payload: {
    phoneNumber: string;
    verificationId: string;
    expiresAt: Date;
    remainingAttempts: number;
  }) => {
    console.log('OTP requested:', payload);
    setOtpPayload({
      phoneNumber: payload.phoneNumber,
      verificationId: payload.verificationId,
      expiresAt: payload.expiresAt,
    });
    setIsContactModalOpen(false);
    setIsOTPModalOpen(true);
  };

  const handleVerificationSuccess = () => {
    console.log('Phone verification successful');
    setIsOTPModalOpen(false);
    setOtpPayload(null);
    // TODO: Refresh user data in Phase B5
  };

  const handleResendOTP = async () => {
    console.log('Resend OTP requested');
    // TODO: API call in Phase B5
    return {
      success: true,
      verificationId: otpPayload?.verificationId || '',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-surface shadow-neu-inset flex items-center justify-center">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-heading-2 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-heading-2 text-foreground">{user.name}</h1>
            <p className="text-body text-muted-foreground">{user.companyName}</p>
            <div className="mt-2">{getStatusBadge()}</div>
          </div>
        </div>

        <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Verification Banner */}
      {!user.installerVerified && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-body text-foreground">Complete Verification to Access Full Features</h3>
            <p className="text-body-small text-muted-foreground mt-1">
              Submit your business details and documents for admin review to unlock lead purchasing and bidding.
            </p>
            <Button variant="primary" className="mt-3" onClick={() => setIsVerificationModalOpen(true)}>
              Start Verification
            </Button>
          </div>
        </div>
      )}

      {/* Contact Verification */}
      {!user.phoneVerified && (
        <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-heading-3 text-foreground">Contact Verification</h2>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-body text-foreground">Phone Number Not Verified</h3>
              <p className="text-body-small text-muted-foreground mt-1">
                Verify your phone number to receive lead alerts and important notifications.
              </p>
              <Button variant="primary" className="mt-3" onClick={() => setIsContactModalOpen(true)}>
                Verify Phone Number
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Personal Details */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Personal Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                defaultValue={user.name}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-body text-foreground">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Email</label>
            <p className="text-body text-foreground">{user.email}</p>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Phone</label>
            <div className="flex items-center gap-2">
              <p className="text-body text-foreground">{user.phone}</p>
              {user.phoneVerified && (
                <span className="text-success">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Company Details */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Company Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Company Name</label>
            <p className="text-body text-foreground">{verification?.companyName || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Website</label>
            <p className="text-body text-foreground">{verification?.website || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Services & Areas */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Services & Coverage</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Services Offered</label>
            <div className="flex flex-wrap gap-2">
              {verification?.services?.map(service => (
                <span key={service} className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-body-small">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Service Areas</label>
            <div className="flex flex-wrap gap-2">
              {verification?.serviceAreas?.map(area => (
                <span key={area} className="px-3 py-1 rounded-full bg-accent/10 text-foreground border border-border text-body-small">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Postcodes Served</label>
            <p className="text-body text-foreground">{verification?.postcodes?.join(', ') || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Notification Preferences</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-foreground">New Lead Available</p>
              <p className="text-body-small text-muted-foreground">Get notified when new leads match your criteria</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.alertNewLead}
                onChange={(e) => setLocalPreferences(prev => ({ ...prev, alertNewLead: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border-2 border-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-foreground">Lead Updates</p>
              <p className="text-body-small text-muted-foreground">Get notified about changes to your leads</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.alertLeadUpdates}
                onChange={(e) => setLocalPreferences(prev => ({ ...prev, alertLeadUpdates: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border-2 border-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-foreground">Admin Messages</p>
              <p className="text-body-small text-muted-foreground">Get notified about messages from admins</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.alertAdminMessages}
                onChange={(e) => setLocalPreferences(prev => ({ ...prev, alertAdminMessages: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border-2 border-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-foreground">Verification Updates</p>
              <p className="text-body-small text-muted-foreground">Get notified about verification status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.alertVerificationUpdates}
                onChange={(e) => setLocalPreferences(prev => ({ ...prev, alertVerificationUpdates: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border-2 border-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-foreground">Account Activity</p>
              <p className="text-body-small text-muted-foreground">Get notified about login and security events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.alertAccountActivity}
                onChange={(e) => setLocalPreferences(prev => ({ ...prev, alertAccountActivity: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border-2 border-border peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
            </label>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        open={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSubmit={handleVerificationSubmit}
      />

      {/* Contact Verification Modal */}
      <ContactVerificationModal
        isOpen={isContactModalOpen}
        defaultPhone={user.phone}
        onClose={() => setIsContactModalOpen(false)}
        onOTPRequested={handleOTPRequested}
      />

      {/* OTP Verification Modal */}
      {otpPayload && (
        <OTPVerificationModal
          isOpen={isOTPModalOpen}
          phoneNumber={otpPayload.phoneNumber}
          verificationId={otpPayload.verificationId}
          expiresAt={otpPayload.expiresAt}
          onClose={() => {
            setIsOTPModalOpen(false);
            setOtpPayload(null);
          }}
          onVerificationSuccess={handleVerificationSuccess}
          onResendOTP={handleResendOTP}
        />
      )}
    </div>
  );
};

export default InstallerProfilePage;
