'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Theme type: Only 'dark' for now, but structure preserved for future theme expansion
export type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'dark'; // Always dark now, but kept for future multi-theme support
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Single theme mode: Always dark
  const [theme, setTheme] = useState<Theme>('dark');
  const [effectiveTheme, setEffectiveTheme] = useState<'dark'>('dark');

  useEffect(() => {
    // Load theme from localStorage (for future theme expansion)
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme('dark'); // Default to dark
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    // Always apply dark class
    document.documentElement.classList.add('dark');
    
    setEffectiveTheme('dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
