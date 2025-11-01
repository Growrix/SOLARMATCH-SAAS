
'use client';
import Button from '@/components/ui/button';

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
  // Single dark theme for now - structure preserved for future theme additions
  const options: { name: Theme; label: string; icon: React.ReactNode }[] = [
    {
      name: 'dark',
      label: 'Dark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    // Future themes can be added here
    // Example: { name: 'theme-2', label: 'Theme 2', icon: <Icon /> }
  ];

  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => (
        <button
          key={opt.name}
          onClick={() => setTheme(opt.name)}
          className={`p-2 rounded-full transition-all duration-200 focus:outline-none ${
            theme === opt.name
              ? 'bg-background shadow-neu-inset text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-neu-outset-sm active:shadow-neu-inset-sm'
          }`}
          aria-label={`Switch to ${opt.name} theme`}
          title={`${opt.label} theme (active)`}
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
    <header className="py-3 sm:py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Neumorphic Rounded Bar */}
        <div className="bg-background rounded-full shadow-neu-outset px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 hover:shadow-neu-outset-lg">
          <div className="flex items-center justify-between">
            {/* Logo + Dev Link */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
                <SunIcon />
                <span className="text-xl sm:text-2xl font-bold text-primary">SolarMatch</span>
              </Link>
              {/* Development Link - Component Library */}
              <Link 
                href="/component-library" 
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background shadow-neu-inset text-primary hover:shadow-neu-inset-sm transition-all text-xs font-semibold"
              >
                <span>Component Library</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-background text-[10px]">DEV</span>
              </Link>
            </div>
            
            {/* Right Side: Theme Switcher + Navigation */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Theme Switcher */}
              <div className="bg-background rounded-full shadow-neu-inset p-1">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-2">
                {isLoggedIn ? (
                  <>
                    <Button onClick={onDashboardClick} variant="ghost" className="px-5 py-2">
                      Dashboard
                    </Button>
                    <Button onClick={onLogoutClick} variant="secondary" className="px-5 py-2">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={onLoginClick} variant="ghost" className="px-5 py-2">
                      Login
                    </Button>
                    <Button onClick={onSignupClick} variant="primary" className="px-5 py-2">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderMenu;