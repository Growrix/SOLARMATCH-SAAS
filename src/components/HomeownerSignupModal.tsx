'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-subtle"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-subtle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-subtle"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-subtle"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-subtle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-2"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

interface HomeownerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
  context?: 'header' | 'quote'; // Context determines text/button labels
  quoteData?: any; // Quote form data to submit after signup
  quoteType?: 'call_visit' | 'written'; // Type of quote request
}

const HomeownerSignupModal: React.FC<HomeownerSignupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSwitchToSignIn, 
  context = 'header',
  quoteData,
  quoteType 
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Conditional text based on context
  const modalTexts = {
    header: {
      title: 'Create Your Account',
      description: 'Join SolarMatch to manage your solar quotes and connect with trusted installers.',
      buttonText: 'Create Account',
      successMessage: 'Account created successfully! Welcome to SolarMatch.',
    },
    quote: {
      title: 'Almost there!',
      description: 'Just create an account to securely save and track your quote requests.',
      buttonText: 'Create Account & Submit Request',
      successMessage: 'Account created successfully! Processing your quote request...',
    },
  };

  const texts = modalTexts[context];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Validate recaptcha
    if (!isRecaptchaVerified) {
      setError('Please complete the reCAPTCHA verification.');
      setLoading(false);
      return;
    }

    try {
      // Call the registration API
      const response = await fetch('/api/auth/register/homeowner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Registration failed - show error
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      setSuccess(texts.successMessage);
      
      // Automatically sign in the user with their new credentials
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        // Sign in failed after registration - shouldn't happen but handle it
        setError('Account created but automatic login failed. Please sign in manually.');
        setLoading(false);
        return;
      }

      // Phase 4.10: Lead creation moved to parent component (page.tsx)
      // This ensures NextAuth session is fully established before creating lead
      // Session polling in parent handles proper timing
      
      // Call onSuccess to trigger parent's lead creation flow
      onSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
      setIsRecaptchaVerified(false);
      setFormData({
        fullName: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const baseInputClasses = "w-full bg-surface/5 border border-border/50 rounded-xl px-4 py-3 pl-12 text-foreground placeholder-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div
      className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="theme-card relative w-full max-w-lg p-8 animate-slide-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-subtle hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <UserCircleIcon />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{texts.title}</h2>
          <p className="text-subtle text-sm">
            {texts.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative flex items-center">
              <div className="absolute left-4"><UserIcon /></div>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name"
                className={baseInputClasses + " placeholder:text-base"}
                required 
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-4"><PhoneIcon /></div>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number (e.g., 0412 345 678)"
                className={baseInputClasses + " placeholder:text-base"}
                required 
                onChange={handleInputChange}
                value={formData.phone}
              />
            </div>
            <p className="text-xs text-subtle ml-1 -mt-2 mb-2">
              Australian format: 04XX XXX XXX or +61 4XX XXX XXX
            </p>
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute left-4"><MailIcon /></div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              className={baseInputClasses} 
              required 
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute left-4"><MapPinIcon /></div>
            <input 
              type="text" 
              name="address" 
              placeholder="Property Address" 
              className={baseInputClasses} 
              required 
              onChange={handleInputChange}
              value={formData.address}
            />
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute left-4"><LockIcon /></div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password (min. 8 characters)" 
              className={`${baseInputClasses} pr-12`} 
              required 
              minLength={8}
              onChange={handleInputChange}
              value={formData.password}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtle hover:text-foreground"
            >
              <EyeIcon />
            </button>
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute left-4"><LockIcon /></div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              className={`${baseInputClasses} pr-12`} 
              required 
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
          </div>

          <div className="pt-4">
            <div className="flex items-center space-x-3 bg-surface/50 p-3 rounded-xl border border-border">
                <input 
                    type="checkbox"
                    id="recaptcha"
                    checked={isRecaptchaVerified}
                    onChange={(e) => setIsRecaptchaVerified(e.target.checked)}
                    className="h-6 w-6 rounded border-border text-primary focus:ring-primary bg-surface"
                />
                <label htmlFor="recaptcha" className="text-sm text-foreground">I&apos;m not a robot</label>
                <div className="ml-auto text-center text-subtle text-xs">
                    reCAPTCHA
                </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  {texts.buttonText}
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-subtle text-sm">
            Already have an account? 
            <button onClick={onSwitchToSignIn} className="text-primary font-medium hover:underline ml-1">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeownerSignupModal;
