'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { AuthModal, AuthInput, AuthButton, AuthAlert, AuthDivider, SocialAuthButtons } from '@/components/auth';
import { UserIcon, MailIcon, LockIcon } from '@/components/icons/auth';

interface HomeownerSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

/**
 * HomeownerSignInModal - Neumorphic design system auth modal
 * Migrated to use centralized auth components
 * Zero hardcoded colors or typography
 */
const HomeownerSignInModal: React.FC<HomeownerSignInModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSwitchToSignUp 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        setLoading(false);
        onSuccess();
      }
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back"
      description="Sign in to access your dashboard."
      icon={<UserIcon className="h-10 w-10 text-primary" />}
    >
      {/* Social Auth Buttons */}
      <SocialAuthButtons
        onGoogleSignIn={() => console.log('Google sign in')}
        onAppleSignIn={() => console.log('Apple sign in')}
        disabled={loading}
      />

      <AuthDivider />

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthAlert type="error" message={error} />}

        <AuthInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          icon={<MailIcon />}
          required
          autoComplete="email"
        />

        <AuthInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          icon={<LockIcon />}
          showPasswordToggle
          required
          autoComplete="current-password"
        />

        <div className="text-right">
          <button
            type="button"
            className="text-body-small text-primary hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <AuthButton
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Sign In
        </AuthButton>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-body-small text-subtle">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthModal>
  );
};

export default HomeownerSignInModal;
