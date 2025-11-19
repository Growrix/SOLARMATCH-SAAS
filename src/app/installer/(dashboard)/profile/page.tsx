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
    profile: {
      operationalStatus: 'ACTIVE', // ACTIVE | PAUSED | INACTIVE
    },
    verification: {
      status: 'PENDING', // PENDING | APPROVED | REJECTED | MORE_INFO
      companyName: 'Solar Solutions Pty Ltd',
      representativeName: 'John Smith',
      designation: 'Managing Director',
      email: 'john@solarsolutions.com.au',
      phone: '+61 412 345 678',
      abnOrLicense: '12 345 678 901',
      establishedYear: 2020,
      employeeCount: 5,
      services: ['Installation', 'Maintenance'],
      serviceAreas: ['Sydney', 'Regional NSW'],
      postcodes: ['2000', '2001'],
      website: 'https://www.solarsolutions.com.au',
      socialLinks: {
        facebook: 'https://facebook.com/solarsolutions',
        instagram: 'https://instagram.com/solarsolutions',
        linkedin: 'https://linkedin.com/company/solarsolutions',
        youtube: '',
      },
      companyDescription: 'Leading solar installation company in Sydney with 5+ years of experience.',
      licenseDocKey: 'license-doc-key',
      abnDocKey: 'abn-doc-key',
      logoKey: 'logo-key',
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
  const { user, profile, verification, preferences } = useMockProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  
  // F8: Operational status state
  const [operationalStatus, setOperationalStatus] = useState(profile.operationalStatus);

  // F6: Editable verification fields state
  const [editableVerification, setEditableVerification] = useState(verification);
  const [isEditingVerification, setIsEditingVerification] = useState(false);

  // F7: Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

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

  // F7: Password validation
  const validatePassword = () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 12) {
      errors.newPassword = 'Password must be at least 12 characters';
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase letter';
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain lowercase letter';
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain a number';
    } else if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain a special character';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      console.log('Password change requested');
      // TODO: API call in Phase B5
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    }
  };

  // F8: Toggle operational status
  const handleStatusToggle = (newStatus: 'ACTIVE' | 'PAUSED') => {
    console.log('Status toggle:', newStatus);
    setOperationalStatus(newStatus);
    // TODO: API call in Phase B5
  };

  // F6: Save verification edits
  const handleSaveVerificationEdits = () => {
    console.log('Verification edits saved:', editableVerification);
    setIsEditingVerification(false);
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
      {/* F8: Operational Status Toggle */}
      {user.installerVerified && (
        <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${operationalStatus === 'ACTIVE' ? 'bg-success' : operationalStatus === 'PAUSED' ? 'bg-warning' : 'bg-error'}`} />
            <div>
              <p className="text-body text-foreground">
                Operational Status: <span className="text-foreground">{operationalStatus}</span>
              </p>
              <p className="text-body-small text-muted-foreground">
                {operationalStatus === 'ACTIVE' ? 'Receiving new leads' : operationalStatus === 'PAUSED' ? 'Not receiving new leads' : 'Account disabled by admin'}
              </p>
            </div>
          </div>
          {operationalStatus !== 'INACTIVE' && (
            <Button
              variant={operationalStatus === 'ACTIVE' ? 'secondary' : 'primary'}
              onClick={() => handleStatusToggle(operationalStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
            >
              {operationalStatus === 'ACTIVE' ? 'Pause Operations' : 'Resume Operations'}
            </Button>
          )}
        </div>
      )}

      {/* F8: Paused Banner */}
      {operationalStatus === 'PAUSED' && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-body text-foreground">Operations Paused</h3>
            <p className="text-body-small text-muted-foreground mt-1">
              Your account is currently paused. You will not receive new lead assignments until you resume operations. Existing leads remain accessible.
            </p>
          </div>
        </div>
      )}

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
          {user.installerVerified && (
            <Button variant="secondary" onClick={() => setIsEditingVerification(!isEditingVerification)}>
              {isEditingVerification ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Company Name</label>
            {isEditingVerification ? (
              <input
                type="text"
                value={editableVerification?.companyName || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, companyName: e.target.value }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-body text-foreground">{verification?.companyName || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">ABN / License</label>
            {isEditingVerification ? (
              <input
                type="text"
                value={editableVerification?.abnOrLicense || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, abnOrLicense: e.target.value }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-body text-foreground">{verification?.abnOrLicense || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Established Year</label>
            {isEditingVerification ? (
              <input
                type="number"
                value={editableVerification?.establishedYear || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, establishedYear: parseInt(e.target.value) }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1900"
                max={new Date().getFullYear()}
              />
            ) : (
              <p className="text-body text-foreground">{verification?.establishedYear || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-1">Employee Count</label>
            {isEditingVerification ? (
              <input
                type="number"
                value={editableVerification?.employeeCount || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, employeeCount: parseInt(e.target.value) }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
              />
            ) : (
              <p className="text-body text-foreground">{verification?.employeeCount || 'Not provided'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-body-small text-muted-foreground mb-1">Website</label>
            {isEditingVerification ? (
              <input
                type="url"
                value={editableVerification?.website || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, website: e.target.value }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://www.example.com"
              />
            ) : (
              <p className="text-body text-foreground">{verification?.website || 'Not provided'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-body-small text-muted-foreground mb-2">Company Description</label>
            {isEditingVerification ? (
              <textarea
                value={editableVerification?.companyDescription || ''}
                onChange={(e) => setEditableVerification(prev => ({ ...prev!, companyDescription: e.target.value }))}
                className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                placeholder="Tell us about your company..."
              />
            ) : (
              <p className="text-body text-foreground">{verification?.companyDescription || 'Not provided'}</p>
            )}
          </div>
        </div>

        {isEditingVerification && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => {
              setIsEditingVerification(false);
              setEditableVerification(verification);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveVerificationEdits}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* F6: Social Media Links */}
      {user.installerVerified && (
        <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-heading-3 text-foreground">Social Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Facebook</label>
              {isEditingVerification ? (
                <input
                  type="url"
                  value={editableVerification?.socialLinks?.facebook || ''}
                  onChange={(e) => setEditableVerification(prev => ({ 
                    ...prev!, 
                    socialLinks: { ...prev!.socialLinks, facebook: e.target.value } 
                  }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
              ) : (
                <p className="text-body text-foreground">{verification?.socialLinks?.facebook || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">Instagram</label>
              {isEditingVerification ? (
                <input
                  type="url"
                  value={editableVerification?.socialLinks?.instagram || ''}
                  onChange={(e) => setEditableVerification(prev => ({ 
                    ...prev!, 
                    socialLinks: { ...prev!.socialLinks, instagram: e.target.value } 
                  }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://instagram.com/yourpage"
                />
              ) : (
                <p className="text-body text-foreground">{verification?.socialLinks?.instagram || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">LinkedIn</label>
              {isEditingVerification ? (
                <input
                  type="url"
                  value={editableVerification?.socialLinks?.linkedin || ''}
                  onChange={(e) => setEditableVerification(prev => ({ 
                    ...prev!, 
                    socialLinks: { ...prev!.socialLinks, linkedin: e.target.value } 
                  }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              ) : (
                <p className="text-body text-foreground">{verification?.socialLinks?.linkedin || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small text-muted-foreground mb-1">YouTube</label>
              {isEditingVerification ? (
                <input
                  type="url"
                  value={editableVerification?.socialLinks?.youtube || ''}
                  onChange={(e) => setEditableVerification(prev => ({ 
                    ...prev!, 
                    socialLinks: { ...prev!.socialLinks, youtube: e.target.value } 
                  }))}
                  className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://youtube.com/@yourchannel"
                />
              ) : (
                <p className="text-body text-foreground">{verification?.socialLinks?.youtube || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Services & Areas */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-heading-3 text-foreground">Services & Coverage</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Services Offered</label>
            {isEditingVerification ? (
              <div className="space-y-2">
                {['Installation', 'Maintenance', 'Inspection', 'Repair', 'Consultation'].map(service => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editableVerification?.services?.includes(service)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...(editableVerification?.services || []), service]
                          : (editableVerification?.services || []).filter(s => s !== service);
                        setEditableVerification(prev => ({ ...prev!, services: updated }));
                      }}
                      className="rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-body text-foreground">{service}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {verification?.services?.map(service => (
                  <span key={service} className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-body-small">
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Service Areas</label>
            {isEditingVerification ? (
              <div className="space-y-2">
                {['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Regional NSW', 'Regional VIC', 'Regional QLD'].map(area => (
                  <label key={area} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editableVerification?.serviceAreas?.includes(area)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...(editableVerification?.serviceAreas || []), area]
                          : (editableVerification?.serviceAreas || []).filter(a => a !== area);
                        setEditableVerification(prev => ({ ...prev!, serviceAreas: updated }));
                      }}
                      className="rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-body text-foreground">{area}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {verification?.serviceAreas?.map(area => (
                  <span key={area} className="px-3 py-1 rounded-full bg-accent/10 text-foreground border border-border text-body-small">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-body-small text-muted-foreground mb-2">Postcodes Served</label>
            {isEditingVerification ? (
              <input
                type="text"
                value={(editableVerification?.postcodes || []).join(', ')}
                onChange={(e) => {
                  const codes = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                  setEditableVerification(prev => ({ ...prev!, postcodes: codes }));
                }}
                className="w-full rounded-xl bg-surface border border-border px-4 py-2 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="2000, 2001, 2010"
              />
            ) : (
              <p className="text-body text-foreground">{verification?.postcodes?.join(', ') || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>

      {/* F6: Documents Upload Section */}
      {user.installerVerified && isEditingVerification && (
        <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-heading-3 text-foreground">Documents & Logo</h2>
            <p className="text-body-small text-muted-foreground mt-1">Upload or update your business documents</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-body-small text-foreground mb-2">License Document</label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-surface shadow-neu-inset hover:border-primary transition-colors cursor-pointer">
                <svg className="mx-auto h-10 w-10 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-caption text-muted-foreground mt-2">Upload PDF/JPG</p>
                {verification?.licenseDocKey && (
                  <p className="text-caption text-success mt-1">✓ Uploaded</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-body-small text-foreground mb-2">ABN Document</label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-surface shadow-neu-inset hover:border-primary transition-colors cursor-pointer">
                <svg className="mx-auto h-10 w-10 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-caption text-muted-foreground mt-2">Upload PDF/JPG</p>
                {verification?.abnDocKey && (
                  <p className="text-caption text-success mt-1">✓ Uploaded</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-body-small text-foreground mb-2">Company Logo</label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-surface shadow-neu-inset hover:border-primary transition-colors cursor-pointer">
                <svg className="mx-auto h-10 w-10 text-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-caption text-muted-foreground mt-2">Upload PNG/JPG</p>
                {verification?.logoKey && (
                  <p className="text-caption text-success mt-1">✓ Uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* F7: Change Password Section */}
      <div className="bg-surface border border-border rounded-xl shadow-neu-outset p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-heading-3 text-foreground">Security</h2>
            <p className="text-body-small text-muted-foreground mt-1">Manage your password and security settings</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-body-small text-foreground mb-2">
              Current Password <span className="text-error">*</span>
            </label>
            <input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter current password"
            />
            {passwordErrors.currentPassword && (
              <p className="text-error text-body-small mt-1">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-body-small text-foreground mb-2">
              New Password <span className="text-error">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter new password"
            />
            {passwordErrors.newPassword && (
              <p className="text-error text-body-small mt-1">{passwordErrors.newPassword}</p>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-caption text-muted-foreground">Password must contain:</p>
              <ul className="text-caption text-muted-foreground space-y-0.5 ml-4">
                <li className={passwordData.newPassword.length >= 12 ? 'text-success' : ''}>• At least 12 characters</li>
                <li className={/[A-Z]/.test(passwordData.newPassword) ? 'text-success' : ''}>• Uppercase letter (A-Z)</li>
                <li className={/[a-z]/.test(passwordData.newPassword) ? 'text-success' : ''}>• Lowercase letter (a-z)</li>
                <li className={/[0-9]/.test(passwordData.newPassword) ? 'text-success' : ''}>• Number (0-9)</li>
                <li className={/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-success' : ''}>• Special character (!@#$%)</li>
              </ul>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-body-small text-foreground mb-2">
              Confirm New Password <span className="text-error">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground shadow-neu-inset focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm new password"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-error text-body-small mt-1">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            Change Password
          </Button>
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
