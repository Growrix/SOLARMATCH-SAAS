'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSignInModal from '@/components/AdminSignInModal';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function AdminPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Show login modal after brief delay
    // NextAuth middleware will handle authentication
    const timer = setTimeout(() => setIsModalOpen(true), 300);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSignInSuccess = () => {
    setIsModalOpen(false);
    router.push('/admin/dashboard');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Redirect to home if they close the modal
    router.push('/');
  };

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
          Secure administrative access
        </p>
      </div>

      <AdminSignInModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        onSignInSuccess={handleSignInSuccess}
      />
    </div>
  );
}
