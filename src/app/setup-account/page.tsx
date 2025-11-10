'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';

export default function SetupAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const error = searchParams.get('error');
  const redirectUrl = searchParams.get('redirect_url');

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleContactSupport = () => {
    // Could be updated to open a support modal or redirect to contact page
    window.location.href = 'mailto:support@solarmatch.com?subject=Account Setup Issue';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-24 w-24 text-warning" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground">
          Account Setup Required
        </h1>

        {/* Error Message */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-foreground/80">
            {error === 'role_not_found' && (
              <>
                We couldn't find your account role in our system. 
                This may happen if your account setup wasn't completed properly.
              </>
            )}
            {error === 'sync_failed' && (
              <>
                We encountered an error while verifying your account. 
                Please try again or contact support if the issue persists.
              </>
            )}
            {!error && (
              <>
                Your account needs to be configured before you can access this page.
              </>
            )}
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="text-sm text-foreground/60">
            Signed in as: <span className="font-medium">{user.primaryEmailAddress?.emailAddress}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleContactSupport}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Contact Support
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Additional Help Text */}
        <div className="text-xs text-foreground/50 pt-4">
          If you just signed up, please try signing in again in a few moments.
          <br />
          Account synchronization may take a few seconds to complete.
        </div>
      </div>
    </div>
  );
}
