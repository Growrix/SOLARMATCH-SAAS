'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SSO Callback Page
 * Handles OAuth redirects from Google/Apple authentication
 * Clerk's middleware and SDK automatically handle the OAuth callback
 * This page just shows a loading state while processing
 */
export default function SSOCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Clerk handles the OAuth callback automatically via middleware
    // After processing, user will be redirected by Clerk based on redirectUrlComplete
    // This page is just a temporary loading state
    
    const timer = setTimeout(() => {
      // Fallback redirect after 3 seconds if Clerk hasn't redirected yet
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Completing sign-in...
        </h2>
        <p className="text-subtle">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
