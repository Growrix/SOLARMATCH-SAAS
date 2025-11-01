import React from 'react';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const options: { name: Theme; label: string; icon: React.ReactNode }[] = [
    { 
      name: 'light', 
      label: 'Light', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      name: 'dark', 
      label: 'Dark', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      name: 'system', 
      label: 'System', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
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
          title={`Switch to ${opt.name} theme`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};


interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
    onHomeClick: () => void;
    onDashboardClick: () => void;
    onHomeownerDashboardClick: () => void;
    onInstallerDashboardClick: () => void;
    onInstallerHomeClick: () => void;
    onAdminDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, isLoggedIn, onLoginClick, onSignupClick, onLogoutClick, onHomeClick, onDashboardClick, onHomeownerDashboardClick, onInstallerDashboardClick, onInstallerHomeClick, onAdminDashboardClick }) => {

  return (
    <header className="py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Neumorphic Rounded Bar */}
        <div className="bg-background rounded-full shadow-neu-outset px-6 py-3 transition-all duration-300 hover:shadow-neu-outset-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={onHomeClick} className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
              <SunIcon />
              <span className="text-xl sm:text-2xl font-bold text-primary">SolarMatch</span>
            </button>
            
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
                    <button 
                      onClick={onDashboardClick}
                      className="px-5 py-2 text-sm font-bold tracking-wider text-foreground hover:text-primary transition-colors rounded-full bg-background shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={onLogoutClick}
                      className="px-5 py-2 text-sm font-bold tracking-wider text-foreground hover:text-primary transition-colors rounded-full bg-background shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={onLoginClick}
                      className="px-5 py-2 text-sm font-bold tracking-wider text-foreground hover:text-primary transition-colors rounded-full bg-background shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                    >
                      Login
                    </button>
                    <button 
                      onClick={onSignupClick}
                      className="px-5 py-2 text-sm font-bold tracking-wider border border-primary text-primary rounded-full bg-transparent shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                    >
                      Sign Up
                    </button>
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

export default Header;