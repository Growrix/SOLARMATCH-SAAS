'use client';

import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="9" x2="9" y1="22" y2="4"/>
    <line x1="15" x2="15" y1="22" y2="4"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-400 flex-shrink-0">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
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

interface InstallerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignIn?: () => void;
}

const InstallerSignupModal: React.FC<InstallerSignupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSwitchToSignIn 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: '',
    businessAddress: '',
    postcode: '',
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    if (!isRecaptchaVerified) {
      setError("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.email && formData.password.length >= 8 && formData.companyName && formData.businessAddress && formData.postcode) {
      setSuccess('Your account has been created successfully! Welcome to the SolarMatch network.');
    } else {
      setError('Please fill out all required fields correctly.');
    }

    setLoading(false);
  };
  
  if (!isOpen) {
    return null;
  }

  const baseInputClasses = "w-full bg-white/5 dark:bg-black/20 border border-gray-300/30 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="theme-card relative w-full max-w-md p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>
        
        {success ? (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <CheckCircleIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Account Creation Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {success}
            </p>
            <button 
              onClick={onSuccess}
              className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Visit Installer&apos;s Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <BuildingIcon />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Create Installer Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Join our network of verified solar installers
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-3">
                <AlertCircleIcon />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleInputChange} 
                  placeholder="Company name" 
                  className={baseInputClasses} 
                  required 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="contactName" 
                  value={formData.contactName} 
                  onChange={handleInputChange} 
                  placeholder="Contact person name" 
                  className={baseInputClasses} 
                  required 
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Phone number" 
                  className={baseInputClasses} 
                  required 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="businessAddress" 
                  value={formData.businessAddress} 
                  onChange={handleInputChange} 
                  placeholder="Business address" 
                  className={baseInputClasses} 
                  required 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="postcode" 
                  value={formData.postcode} 
                  onChange={handleInputChange} 
                  placeholder="Postcode" 
                  className={baseInputClasses} 
                  required 
                  maxLength={4} 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Business email address" 
                  className={baseInputClasses} 
                  required 
                />
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="Password (min. 8 characters)" 
                  className={`${baseInputClasses} pr-12`} 
                  required 
                  minLength={8} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  placeholder="Confirm Password" 
                  className={`${baseInputClasses} pr-12`} 
                  required 
                  minLength={8} 
                />
              </div>
              <div>
                <div className="flex items-center space-x-3 bg-gray-100/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                  <input 
                    type="checkbox"
                    id="installer-recaptcha"
                    checked={isRecaptchaVerified}
                    onChange={(e) => {
                      setIsRecaptchaVerified(e.target.checked);
                      if (error && error.includes('reCAPTCHA')) {
                        setError(null);
                      }
                    }}
                    className="h-6 w-6 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-900"
                  />
                  <label htmlFor="installer-recaptcha" className="text-sm text-slate-700 dark:text-slate-300">
                    I&apos;m not a robot
                  </label>
                  <div className="ml-auto text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                      alt="reCAPTCHA logo" 
                      className="w-8 h-8 mx-auto" 
                    />
                    <p className="text-xs text-slate-500 -mt-1">reCAPTCHA</p>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : ( 
                  'Create Installer Account' 
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline transition-colors">Installer Terms</a> and{' '}
                <a href="#" className="text-primary hover:underline transition-colors">Privacy Policy</a>
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an installer account?
                <button 
                  onClick={onSwitchToSignIn} 
                  className="text-primary font-medium ml-1 transition-colors underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallerSignupModal;
