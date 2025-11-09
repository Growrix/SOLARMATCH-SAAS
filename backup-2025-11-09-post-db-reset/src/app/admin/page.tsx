'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function AdminPage() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // Not signed in - redirect to sign-in
        router.push('/sign-in');
      } else {
        // Check if user has ADMIN role
        const role = user.publicMetadata.role as string;
        if (role === 'ADMIN') {
          // Admin user - redirect to admin dashboard
          router.replace('/admin/dashboard');
        } else {
          // Not an admin - show access denied or redirect to home
          router.push('/');
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <SunIcon />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            SolarMatch Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If we get here, we're redirecting
  return null;
}