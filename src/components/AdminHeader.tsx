"use client";
import React from 'react';
import { useTheme, type Theme } from '@/components/ThemeProvider';

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
              : 'text-muted-foreground hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
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

interface AdminHeaderProps {
  pageTitle: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-header h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default AdminHeader;