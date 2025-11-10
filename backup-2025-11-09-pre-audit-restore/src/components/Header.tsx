'use client';

import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { type Theme } from './ThemeProvider';
import { ThemeSwitcher } from './ThemeSwitcher';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Local ThemeSwitcher component removed - now using centralized version from ./ThemeSwitcher
interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onHomeClick: () => void;
    onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, onHomeClick, onDashboardClick }) => {
  const { isSignedIn, user } = useUser();

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
              <ThemeSwitcher />
              
              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-2">
                {isSignedIn ? (
                  <>
                    <button 
                      onClick={onDashboardClick}
                      className="px-5 py-2 text-sm font-bold tracking-wider text-foreground hover:text-primary transition-colors rounded-full bg-background shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                    >
                      Dashboard
                    </button>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-10 h-10 shadow-neu-outset rounded-full',
                          userButtonPopoverCard: 'theme-card shadow-neu-outset',
                          userButtonPopoverActionButton: 'text-foreground hover:text-primary',
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button 
                        className="px-5 py-2 text-sm font-bold tracking-wider text-foreground hover:text-primary transition-colors rounded-full bg-background shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                      >
                        Login
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button 
                        className="px-5 py-2 text-sm font-bold tracking-wider border border-primary text-primary rounded-full bg-transparent shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]"
                      >
                        Sign Up
                      </button>
                    </SignUpButton>
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