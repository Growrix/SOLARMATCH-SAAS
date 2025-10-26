'use client';

/**
 * Admin Installers Page
 * Phase 7.5.13 - T342
 * 
 * Main page for managing installer verification and profiles.
 * Integrates all installer management components.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AdminBottomNavBar from '@/components/AdminBottomNavBar';
import AdminMobileSidebarMenu from '@/components/AdminMobileSidebarMenu';
import AdminSidebar from '@/components/AdminSidebar';
import InstallersTable from '@/components/admin/InstallersTable';

// Theme Switcher Component
const ThemeSwitcher: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
  const options: { name: Theme; label: string; icon: React.ReactNode }[] = [
    { 
      name: 'light', 
      label: 'Light', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) 
    },
    { 
      name: 'dark', 
      label: 'Dark', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) 
    },
    { 
      name: 'system', 
      label: 'System', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) 
    },
  ];

  return (
    <div className="flex items-center p-1 rounded-full bg-gray-100 dark:bg-slate-800">
      {options.map((opt) => (
        <button 
          key={opt.name} 
          onClick={() => setTheme(opt.name)} 
          className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-800 focus:ring-primary ${
            theme === opt.name 
              ? 'bg-white dark:bg-slate-700 shadow-sm' 
              : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
          }`} 
          aria-label={`Switch to ${opt.name} theme`} 
          title={`Switch to ${opt.name} theme`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

// AdminHeader Component
const AdminHeader: React.FC<{ 
  pageTitle: string; 
  theme: Theme; 
  setTheme: (theme: Theme) => void; 
}> = ({ pageTitle, theme, setTheme }) => (
  <header className="glass-header h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8">
    <div className="flex items-center space-x-4">
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
    </div>
    <div className="flex items-center gap-3">
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </div>
  </header>
);

export default function AdminInstallersPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  // Detect if page is loaded in iframe
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleLogoutClick = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
  };

  const handleSetActivePage = (page: string) => {
    if (page === 'Dashboard') router.push('/admin/dashboard');
    else if (page === 'Leads') router.push('/admin/leads');
    else if (page === 'Homeowners') router.push('/admin/homeowners');
    else if (page === 'Installers') router.push('/admin/installers');
    else router.push('/admin/dashboard');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={isInIframe ? "flex min-h-screen" : "flex min-h-screen bg-gray-50 dark:bg-slate-900"}>
      {/* Desktop Sidebar */}
      {!isInIframe && (
        <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <AdminSidebar activePage="Installers" />
        </aside>
      )}

      {/* Mobile Sidebar Menu */}
      {!isInIframe && (
        <AdminMobileSidebarMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          activePage="Installers"
          onLogoutClick={handleLogoutClick}
          setActivePage={handleSetActivePage}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {!isInIframe && (
          <AdminHeader pageTitle="Installer Management" theme={theme} setTheme={setTheme} />
        )}

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <InstallersTable />
          </main>
        </div>

        {/* Bottom Navigation (Mobile) */}
        {!isInIframe && (
          <AdminBottomNavBar 
            activePage="Installers"
            setActivePage={handleSetActivePage}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            onThemeClick={() => {
              setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
            }}
          />
        )}
      </div>

      {/* Modals */}
      {/* Removed old modals - using new InstallersTable component */}
    </div>
  );
}
