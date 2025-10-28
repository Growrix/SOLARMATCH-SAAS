'use client';

import { useTheme } from 'next-themes';
import { colors } from '@/design-tokens';

/**
 * useThemeColors Hook
 * 
 * Provides theme-aware access to semantic color tokens from the centralized design token system.
 * Returns color values that automatically adapt based on the current theme (light/dark/system).
 * 
 * @returns {Object} Current theme's color values with semantic color tokens
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { primary, background, text, status } = useThemeColors();
 *   
 *   return (
 *     <div style={{ backgroundColor: background, color: text }}>
 *       <button style={{ backgroundColor: primary }}>Primary Button</button>
 *       <span style={{ color: status.success }}>Success!</span>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @remarks
 * - Uses `next-themes` for theme detection (light/dark/system)
 * - Returns light/dark variant automatically based on current theme
 * - Falls back to DEFAULT variant if theme-specific color not defined
 * - All colors are hex strings (#RRGGBB format) ready for CSS/JS use
 */
export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    // Brand colors
    primary: isDark ? colors.primary.dark : colors.primary.light,
    primaryHover: isDark ? colors['primary-hover'].dark : colors['primary-hover'].light,
    primaryDark: isDark ? colors['primary-dark'].dark : colors['primary-dark'].light,
    secondary: isDark ? colors.secondary.dark : colors.secondary.light,
    secondaryHover: isDark ? colors['secondary-hover'].dark : colors['secondary-hover'].light,

    // Status colors
    status: {
      success: isDark ? colors.success.dark : colors.success.light,
      warning: isDark ? colors.warning.dark : colors.warning.light,
      error: isDark ? colors.error.dark : colors.error.light,
      info: isDark ? colors.info.dark : colors.info.light,
    },

    // Background colors
    background: isDark ? colors.background.dark : colors.background.light,
    backgroundAlt: isDark ? colors['background-alt'].dark : colors['background-alt'].light,
    surface: isDark ? colors.surface.dark : colors.surface.light,

    // Text colors
    foreground: isDark ? colors.foreground.dark : colors.foreground.light,
    muted: isDark ? colors.muted.dark : colors.muted.light,
    subtle: isDark ? colors.subtle.dark : colors.subtle.light,

    // Border colors
    border: isDark ? colors.border.dark : colors.border.light,
    borderFocus: isDark ? colors['border-focus'].dark : colors['border-focus'].light,

    // Utility
    isDark,
    theme: resolvedTheme || 'light',
  };
}
