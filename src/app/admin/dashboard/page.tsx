'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AdminBottomNavBar from '@/components/AdminBottomNavBar';
import AdminMobileSidebarMenu from '@/components/AdminMobileSidebarMenu';

// --- Icon Components ---
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const LayoutDashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
  </svg>
);

const PaintbrushIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M17 3a2.85 2.85 0 0 0-4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    <path d="m15 5 4 4"/>
    <path d="M22 11.5c0 2-1.5 3.5-3.5 3.5S15 13.5 15 11.5 16.5 8 18.5 8s3.5 1.5 3.5 3.5z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="3" x2="21" y1="6" y2="6"/>
    <line x1="3" x2="21" y1="12" y2="12"/>
    <line x1="3" x2="21" y1="18" y2="18"/>
  </svg>
);

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

// Sidebar for desktop
const AdminSidebar: React.FC<{ 
  activePage: string; 
  setActivePage: (page: string) => void; 
  onHomeClick: () => void; 
  onLogoutClick: () => void; 
}> = ({ activePage, setActivePage, onHomeClick, onLogoutClick }) => {
  const NavItem: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    isActive?: boolean; 
    onClick?: () => void; 
  }> = ({ icon, title, isActive, onClick }) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
        isActive 
          ? 'bg-primary/10 text-primary dark:bg-primary/20' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  return (
    <aside className="dashboard-sidebar w-64 flex-shrink-0 border-r border-gray-200 dark:border-slate-800 flex flex-col p-4 h-full">
      <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200 dark:border-slate-800 mb-4">
        <button onClick={onHomeClick} className="flex items-center space-x-3">
          <SunIcon />
          <span className="text-xl font-bold text-primary">SolarMatch</span>
        </button>
      </div>
      <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Panel</p>
      <nav className="flex-grow space-y-1">
        <NavItem 
          icon={<LayoutDashboardIcon />} 
          title="Dashboard" 
          onClick={() => setActivePage('Dashboard')} 
          isActive={activePage === 'Dashboard'} 
        />
        <NavItem 
          icon={<UsersIcon />} 
          title="User Management" 
          onClick={() => setActivePage('User Management')} 
          isActive={activePage === 'User Management'} 
        />
        <NavItem 
          icon={<FileTextIcon />} 
          title="Content Management" 
          onClick={() => setActivePage('Content Management')} 
          isActive={activePage === 'Content Management'}
        />
        <NavItem 
          icon={<PaintbrushIcon />} 
          title="Theme Settings" 
          onClick={() => setActivePage('Theme Settings')} 
          isActive={activePage === 'Theme Settings'} 
        />
        <NavItem 
          icon={<SettingsIcon />} 
          title="Global Settings" 
          onClick={() => setActivePage('Global Settings')} 
          isActive={activePage === 'Global Settings'}
        />
      </nav>
      <div className="mt-auto">
        <NavItem icon={<LogOutIcon />} title="Logout" onClick={onLogoutClick} />
      </div>
    </aside>
  );
};

// Development Quick Access Menu (Admin Dashboard Navigation)
const DevQuickAccessMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/20"
        title="Development Quick Access"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span>DEV</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden animate-slide-in-up">
            <div className="p-3 border-b border-gray-200 dark:border-slate-700 bg-amber-500/5">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                🛠️ Development Quick Access
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Admin bypass enabled
              </p>
            </div>
            <div className="p-2 space-y-1">
              <a
                href="/homeowner/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Homeowner Dashboard</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View as homeowner</p>
                </div>
              </a>

              <a
                href="/installer/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" x2="12" y1="22.08" y2="12"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Installer Dashboard</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View as installer</p>
                </div>
              </a>

              <a
                href="/installer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Installer Homepage</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Public installer page</p>
                </div>
              </a>

              <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>

              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Guest Homepage</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Public landing page</p>
                </div>
              </a>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-amber-500/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ⚠️ Only visible in development mode
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Header for mobile and desktop - with dev menu
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
      <DevQuickAccessMenu />
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </div>
  </header>
);

// Placeholder Content
const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-full bg-white dark:bg-black/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700">
    <div className="text-center">
      <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">{title}</h2>
      <p className="text-slate-500 mt-2">This feature is under construction.</p>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activePage, setActivePage] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // NextAuth middleware handles authentication automatically
  // No need for manual checks - protected routes are enforced at middleware level

  // Scroll detection for header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleLogoutClick = async () => {
    // Use NextAuth signOut
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
  };

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    if (activePage === 'Dashboard') {
      return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
          {/* General Settings Card */}
          <div className="theme-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <SettingsIcon />
                General Settings
              </h3>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Maintenance Mode</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isMaintenanceMode 
                      ? "The site is currently offline for visitors." 
                      : "The site is live and accessible to everyone."
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black ${
                    isMaintenanceMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-pressed={isMaintenanceMode}
                  aria-label="Toggle Maintenance Mode"
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscribers Card */}
          <div className="theme-card">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Newsletter Subscribers
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  View and manage all newsletter subscriptions.
                </p>
              </div>
              <button 
                onClick={() => router.push('/admin/newsletter')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm flex-shrink-0"
              >
                View Subscribers
              </button>
            </div>
          </div>

          {/* Guest Instant Quotes Card */}
          <div className="theme-card">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="16" height="20" x="4" y="2" rx="2"/>
                    <line x1="8" x2="16" y1="6" y2="6"/>
                    <line x1="16" x2="16" y1="14" y2="18"/>
                    <path d="M16 10h.01"/>
                    <path d="M12 10h.01"/>
                    <path d="M8 10h.01"/>
                    <path d="M12 14h.01"/>
                    <path d="M8 14h.01"/>
                    <path d="M12 18h.01"/>
                    <path d="M8 18h.01"/>
                  </svg>
                  Guest Instant Quotes
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Track and manage all guest instant quote submissions with real-time metrics.
                </p>
              </div>
              <button 
                onClick={() => router.push('/admin/instant-quotes')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm flex-shrink-0"
              >
                View Quotes
              </button>
            </div>
          </div>

          {/* Theme Settings Card */}
          <div className="theme-card">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <PaintbrushIcon />
                  Theme & Branding
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Customize the look and feel of your site.
                </p>
              </div>
              <button 
                onClick={() => setActivePage('Theme Settings')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm flex-shrink-0"
              >
                Manage Themes
              </button>
            </div>
          </div>
        </div>
      );
    }
    return <PlaceholderContent title={activePage} />;
  };

  return (
    <div className="homeowner-dashboard-bg min-h-screen text-slate-800 dark:text-slate-200 animate-fade-in">
      <AdminMobileSidebarMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activePage={activePage}
        setActivePage={handleSetActivePage}
        onLogoutClick={handleLogoutClick}
      />

      <div className="md:pl-64">
        <div className="flex flex-col min-h-screen">
          <div className={`sticky top-0 z-20 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <AdminHeader 
              pageTitle={activePage} 
              theme={theme} 
              setTheme={setTheme} 
            />
          </div>
          <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex">
        <AdminSidebar 
          activePage={activePage} 
          setActivePage={handleSetActivePage} 
          onHomeClick={handleHomeClick} 
          onLogoutClick={handleLogoutClick} 
        />
      </div>

      <AdminBottomNavBar
        activePage={activePage}
        setActivePage={handleSetActivePage}
        onThemeClick={() => handleSetActivePage('Theme Settings')}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
    </div>
  );
}
