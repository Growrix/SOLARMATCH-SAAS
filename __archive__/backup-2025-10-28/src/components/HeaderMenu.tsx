'use client';

import { useTheme, type Theme } from './ThemeProvider';
import Link from 'next/link';

export const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher = ({ theme, setTheme }: ThemeSwitcherProps) => {
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

interface HeaderMenuProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogoutClick?: () => void;
  onDashboardClick?: () => void;
  onHomeownerDashboardClick?: () => void;
  onInstallerDashboardClick?: () => void;
  onInstallerHomeClick?: () => void;
  onAdminDashboardClick?: () => void;
}

const HeaderMenu = ({ 
  isLoggedIn = false, 
  onLoginClick = () => console.log('Login clicked'),
  onSignupClick = () => console.log('Signup clicked'),
  onLogoutClick = () => console.log('Logout clicked'),
  onDashboardClick = () => console.log('Dashboard clicked'),
  onHomeownerDashboardClick = () => console.log('Homeowner Dashboard clicked'),
  onInstallerDashboardClick = () => console.log('Installer Dashboard clicked'),
  onInstallerHomeClick = () => console.log('Installer Home clicked'),
  onAdminDashboardClick = () => console.log('Admin Dashboard clicked')
}: HeaderMenuProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
            <SunIcon />
            <span className="text-2xl font-bold text-primary">SolarMatch</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={onDashboardClick}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={onLogoutClick}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-teal-700 transition-colors shadow-sm transform active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onLoginClick}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={onSignupClick}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-teal-700 transition-colors shadow-sm transform active:scale-95"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderMenu;