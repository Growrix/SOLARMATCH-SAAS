"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // Not authenticated - redirect to sign in
      router.push('/sign-in');
      return;
    }

    // Get user role from Clerk metadata
    const role = user.publicMetadata?.role as string | undefined;

    // Redirect based on role
    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (role === 'INSTALLER') {
      router.push('/installer/dashboard');
    } else {
      // Default to homeowner dashboard (HOMEOWNER role or no role set)
      router.push('/homeowner/dashboard');
    }
  }, [user, isLoaded, router]);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-theme-text-primary">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
