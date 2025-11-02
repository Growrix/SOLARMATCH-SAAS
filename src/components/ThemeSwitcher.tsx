'use client';

import { useTheme } from '@/components/ThemeProvider';
import { useState, useRef, useEffect } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const themes = [
    { value: 'dark' as const, label: 'Dark', icon: '🌙' },
    { value: 'light' as const, label: 'Light', icon: '☀️' },
    { value: 'purple' as const, label: 'Purple', icon: '💜' },
  ];

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact neumorphic icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center transition-all duration-200 shadow-neu-outset hover:shadow-neu-inset active:shadow-neu-inset"
        title={`Current theme: ${currentTheme?.label}`}
      >
        <span className="text-xl">{currentTheme?.icon}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-surface rounded-lg shadow-neu-outset overflow-hidden"
          style={{ zIndex: 1000 }}
          role="menu"
        >
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 ${
                theme === themeOption.value
                  ? 'bg-surface-hover text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
              }`}
              role="menuitem"
            >
              <span className="text-lg">{themeOption.icon}</span>
              <span className="text-sm">{themeOption.label}</span>
              {theme === themeOption.value && (
                <svg className="w-3.5 h-3.5 ml-auto text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
