'use client';

import React, { useState, useEffect } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

// --- Icon Components (matching SOT) ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" x2="12" y1="9" y2="13"/>
    <line x1="12" x2="12.01" y1="17" y2="17"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-success flex-shrink-0">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface HomeownerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignIn?: () => void;
}

/**
 * HomeownerSignupModal - Redesigned to match InstallerSignupModal (SOT)
 * Consistent modal structure, styling, and form design
 * Zero hardcoded colors, uses semantic tokens only
 */
const HomeownerSignupModal: React.FC<HomeownerSignupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSwitchToSignIn 
}) => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      resetForm();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) { setError(null); }
  };
  
  const resetForm = () => {
    setFormData({ 
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!isLoaded) {
      setError("Authentication system is loading. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Create signup with Clerk SDK
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          role: 'HOMEOWNER'
        }
      });

      // If email verification is required
      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
        setSuccess('Verification email sent! Please check your email and enter the code below.');
        setLoading(false);
        return;
      }

      // If signup is complete, set the session active
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setSuccess('Account created successfully! Verifying role and redirecting...');
        
        // Wait for webhook to sync user to database, then verify role
        setTimeout(async () => {
          try {
            const response = await fetch('/api/user/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.role === 'HOMEOWNER') {
                console.log('[HomeownerSignup] ✅ Role verified: HOMEOWNER');
                router.push('/homeowner/dashboard');
                onSuccess();
              } else {
                console.error('[HomeownerSignup] ❌ Unexpected role:', data.role);
                setError('Account created but role verification failed. Please contact support.');
                setLoading(false);
              }
            } else {
              console.error('[HomeownerSignup] ❌ Role verification failed');
              setError('Account created but role verification failed. Please try signing in.');
              setLoading(false);
            }
          } catch (error) {
            console.error('[HomeownerSignup] ❌ Error verifying role:', error);
            setError('Account created but role verification failed. Please try signing in.');
            setLoading(false);
          }
        }, 1000); // Wait 1 second for webhook to process
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.errors?.[0]?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!signUp) {
      setError('Verification session not found. Please try signing up again.');
      setLoading(false);
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      setLoading(false);
      return;
    }

    try {
      // Verify the email with the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        if (!setActive) {
          setError('Session activation failed. Please try again.');
          setLoading(false);
          return;
        }
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccess('Email verified! Verifying role and redirecting...');
        
        // Wait for webhook to sync user to database, then verify role before redirect
        setTimeout(async () => {
          try {
            const response = await fetch('/api/user/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.role === 'HOMEOWNER') {
                console.log('[HomeownerSignup] ✅ Email verified, role confirmed: HOMEOWNER');
                onClose();
                onSuccess();
                router.push('/homeowner/dashboard');
              } else {
                console.error('[HomeownerSignup] ❌ Unexpected role after verification:', data.role);
                setError('Email verified but role verification failed. Please contact support.');
                setLoading(false);
              }
            } else {
              console.error('[HomeownerSignup] ❌ Role verification failed after email verification');
              setError('Email verified but role verification failed. Please try signing in.');
              setLoading(false);
            }
          } catch (error) {
            console.error('[HomeownerSignup] ❌ Error verifying role:', error);
            setError('Email verified but role verification failed. Please try signing in.');
            setLoading(false);
          }
        }, 1000); // Wait 1 second for webhook to process
      } else {
        setError('Verification failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.errors?.[0]?.message || 'Invalid verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) {
      setError('Verification session not found. Please try signing up again.');
      return;
    }

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setSuccess('Verification code resent! Please check your email.');
      setError(null);
    } catch (err: any) {
      setError('Failed to resend code. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/homeowner/dashboard',
      });
    } catch (err) {
      setError('Google sign up failed. Please try again.');
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_apple',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/homeowner/dashboard',
      });
    } catch (err) {
      setError('Apple sign up failed. Please try again.');
      setLoading(false);
    }
  };

  // Close modal and reset form
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={handleClose}
    >
      <div
  className="theme-card relative w-full max-w-md p-8 animate-slide-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-subtle hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-surface rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-neu-outset">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Create account</h2>
          <p className="text-subtle text-sm">
            Join thousands of homeowners who have gone solar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 shadow-neu-inset border border-destructive/30 px-4 py-3 rounded-2xl text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-success/10 shadow-neu-inset border border-success/30 px-4 py-3 rounded-2xl text-sm text-success">
              {success}
            </div>
          )}

          {/* Social Sign Up Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-surface shadow-neu-outset hover:shadow-neu-inset border border-border rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-foreground transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button
              type="button"
              onClick={handleAppleSignup}
              disabled={loading}
              className="w-full bg-surface shadow-neu-outset hover:shadow-neu-inset border border-border rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-foreground transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-subtle text-sm">Or sign up with email</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Verification Code Input */}
          {pendingVerification ? (
            <div className="space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                  className="form-input w-full pl-11 pr-4 py-3 text-center text-lg tracking-widest"
                />
              </div>

              <Button
                type="button"
                onClick={handleVerifyEmail}
                disabled={loading || verificationCode.length !== 6}
                variant="secondary"
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Email'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-primary hover:text-primary-hover transition-colors disabled:opacity-50"
                >
                  Did not receive the code? Resend
                </button>
              </div>
            </div>
          ) : (
            // Original signup form fields
            <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input w-full pl-11 pr-4 py-3"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
                className="form-input w-full pl-11 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="form-input w-full pl-11 pr-4 py-3"
              />
            </div>
          </div>
          )}

          {/* Submit Button - Only show for initial signup form */}
          {!pendingVerification && (
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full shadow-neu-outset hover:shadow-neu-inset"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-subtle text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeownerSignupModal;
