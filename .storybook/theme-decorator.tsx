import React, { useEffect, useState } from 'react';
import type { StoryFn } from '@storybook/react';

/**
 * Theme Decorator for Storybook
 * 
 * Wraps all stories with theme support (Light/Dark/System).
 * Adds a theme switcher toolbar to the Storybook UI.
 * 
 * Usage: Applied globally in preview.ts via decorators array
 */

export type Theme = 'light' | 'dark' | 'system';

export const ThemeDecorator = (Story: StoryFn) => {
  // T009: Default to dark theme during migration (Constitution VI: dark-first)
  const [theme, setTheme] = useState<Theme>('dark');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  // Detect system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Determine effective theme (system theme uses OS preference)
  const effectiveTheme = theme === 'system' 
    ? (systemPrefersDark ? 'dark' : 'light') 
    : theme;

  // Apply dark class to document for Tailwind CSS dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  return (
    <div className="storybook-theme-wrapper">
      {/* Theme switcher toolbar */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '6px 12px',
            border: theme === 'light' ? '2px solid #0d9488' : '1px solid #e5e7eb',
            borderRadius: '4px',
            background: theme === 'light' ? '#f0fdfa' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: theme === 'light' ? '600' : '400',
          }}
        >
          ☀️ Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '6px 12px',
            border: theme === 'dark' ? '2px solid #0d9488' : '1px solid #e5e7eb',
            borderRadius: '4px',
            background: theme === 'dark' ? '#f0fdfa' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: theme === 'dark' ? '600' : '400',
          }}
        >
          🌙 Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          style={{
            padding: '6px 12px',
            border: theme === 'system' ? '2px solid #0d9488' : '1px solid #e5e7eb',
            borderRadius: '4px',
            background: theme === 'system' ? '#f0fdfa' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: theme === 'system' ? '600' : '400',
          }}
        >
          💻 System
        </button>
      </div>

      {/* Story content */}
      <div className={`storybook-story ${effectiveTheme}`}>
        <Story />
      </div>
    </div>
  );
};
