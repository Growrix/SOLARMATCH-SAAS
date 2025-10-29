'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

// --- Icon Components ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="9" x2="9" y1="22" y2="4"/><line x1="15" x2="15" y1="22" y2="4"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-500 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

interface InstallerSignInProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InstallerSignInModal: React.FC<InstallerSignInProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) { setError(null); }
  };
  
  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setRememberMe(false);
    setLoading(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

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
        // Reset form state when modal is closed externally
        resetForm();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use NextAuth signIn with credentials provider
      const result = await signIn('credentials', {
        redirect: false, // Don't redirect automatically
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // Login failed - show error message
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Login successful
        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => {
          onSuccess(); // Call parent's success handler
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address first, then click "Forgot password?"');
      return;
    }
    setSuccess('If an installer account with this email exists, you will receive a password reset link shortly.');
    setError(null);
  };

  if (!isOpen) return null;

  const baseInputClasses = "w-full bg-surface/5 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div
      className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center px-4 py-20 animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="theme-card relative w-full max-w-md p-8 max-h-[90vh] overflow-y-auto animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-subtle hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <BuildingIcon />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Installer Partner Sign In
          </h2>
          <p className="text-subtle text-sm">
            Access your installer dashboard and manage leads
          </p>
        </div>
        
        {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                    <AlertTriangleIcon />
                    <div>
                        <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-1">Sign In Error</p>
                        <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <CheckCircleIcon />
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-background text-subtle">Sign in with Email</span>
                </div>
            </div>
          
            <div>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" className={baseInputClasses} required />
            </div>

            <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className={`${baseInputClasses} pr-12`} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtle hover:text-foreground transition-colors">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            
            <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary"/>
                    <span className="text-sm text-subtle">Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                    Forgot password?
                </button>
            </div>

            <button type="submit" disabled={loading || !!success} className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg">
                {loading ? (
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                </div>
                ) : ( 'Sign In to Dashboard' )}
            </button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
                <ShieldIcon />
                <span className="text-blue-500 dark:text-blue-400 font-semibold text-sm">Enhanced Security</span>
            </div>
            <p className="text-blue-600 dark:text-blue-300 text-xs">
                Two-factor authentication (2FA) is available in your dashboard settings for additional account security.
            </p>
        </div>
      </div>
    </div>
  );
};

export default InstallerSignInModal;
