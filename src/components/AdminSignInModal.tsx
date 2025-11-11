'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" x2="6" y1="6" y2="18"/>
    <line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

interface AdminSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: () => void;
}

const AdminSignInModal: React.FC<AdminSignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      });

      console.log('🔐 SignIn result:', result);

      if (result?.error) {
        console.log('❌ Auth failed:', result.error);
        setError(result.error === 'CredentialsSignin' ? 'Invalid admin credentials' : result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('✅ Auth successful, redirecting to dashboard...');
        // Give time for session to be established
        setTimeout(() => {
          onSignInSuccess();
        }, 500);
      } else {
        // Unexpected result state
        console.error('⚠️ Unexpected auth result:', result);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 Admin login exception:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-border animate-slide-in-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <LockIcon />
            <h2 className="text-heading-2 text-foreground">Admin Login</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive-foreground text-body-small">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-body-small font-medium text-foreground mb-2">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@solarmatch.com"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-body-small font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder=""
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-caption text-muted-foreground">
               Secure admin access only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignInModal;