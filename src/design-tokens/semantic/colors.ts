/**
 * Semantic Color Tokens
 * 
 * Meaningful color names mapped to primitive values.
 * These change for rebranding (e.g., primary: blue-600 instead of teal-600).
 * 
 * Theme Support:
 * - light: Color value for light theme
 * - dark: Color value for dark theme
 * - DEFAULT: Tailwind default (same as light for backward compatibility)
 * 
 * Usage: Import in components, hooks, and Tailwind config.
 * 
 * @see src/design-tokens/primitives/colors.ts for raw color values
 */

import { primitives } from '../primitives/colors';
import type { ThemeColor, ChartColor } from '../types';

export const colors = {
  // Brand colors (UPDATED: Orange for LIGHT theme, Muted Gray for DARK theme)
  primary: {
    light: primitives.custom.accent,         // #FF6B00 (ORANGE - main CTA color in light theme)
    dark: primitives.custom.darkAccent,      // #A0A0A0 (MUTED GRAY - no orange in dark theme)
    DEFAULT: primitives.custom.accent,
  } as ThemeColor,
  'primary-hover': {
    light: primitives.custom.accentHover,    // #FF8533 (ORANGE hover in light theme)
    dark: primitives.custom.darkAccentHover, // #B0B0B0 (GRAY hover in dark theme)
    DEFAULT: primitives.custom.accentHover,
  } as ThemeColor,
  'primary-dark': {
    light: '#E55F00',                        // Darker orange (light theme)
    dark: '#888888',                         // Medium gray (dark theme)
    DEFAULT: '#E55F00',
  } as ThemeColor,
  
  // Secondary colors (Teal - for branding/logos only)
  secondary: {
    light: primitives.teal[600],             // #0d9488 (Keep teal for brand identity)
    dark: primitives.teal[400],              // #2dd4bf
    DEFAULT: primitives.teal[600],
  } as ThemeColor,
  'secondary-hover': {
    light: primitives.teal[700],
    dark: primitives.teal[500],
    DEFAULT: primitives.teal[700],
  } as ThemeColor,
  
  // Status colors
  success: {
    light: primitives.green[600],
    dark: primitives.green[400],
    DEFAULT: primitives.green[600],
  } as ThemeColor,
  warning: {
    light: primitives.yellow[500],
    dark: primitives.yellow[400],
    DEFAULT: primitives.yellow[500],
  } as ThemeColor,
  error: {
    light: primitives.red[600],
    dark: primitives.red[400],
    DEFAULT: primitives.red[600],
  } as ThemeColor,
  info: {
    light: primitives.blue[600],
    dark: primitives.blue[400],
    DEFAULT: primitives.blue[600],
  } as ThemeColor,
  
  // Background colors (CUSTOM USER THEME)
  background: {
    light: primitives.custom.lightBg,        // #f9fafb
    dark: primitives.custom.darkBg,          // #101010
    DEFAULT: primitives.custom.lightBg,
  } as ThemeColor,
  'background-alt': {
    light: primitives.custom.lightBgSecondary, // #ffffff
    dark: primitives.custom.darkBgSecondary,   // #1A1A1A
    DEFAULT: primitives.custom.lightBgSecondary,
  } as ThemeColor,
  surface: {
    light: primitives.custom.lightBgSecondary, // #ffffff
    dark: primitives.custom.darkBgSecondary,   // #1A1A1A
    DEFAULT: primitives.custom.lightBgSecondary,
  } as ThemeColor,
  'surface-hover': {
    light: primitives.gray[50],                // #f9fafb (subtle hover)
    dark: '#252525',                           // Slightly lighter than #1A1A1A for hover
    DEFAULT: primitives.gray[50],
  } as ThemeColor,
  overlay: {
    light: 'rgba(0, 0, 0, 0.8)',              // black/80 (modal backdrop)
    dark: 'rgba(0, 0, 0, 0.8)',               // Same for dark mode
    DEFAULT: 'rgba(0, 0, 0, 0.8)',
  } as ThemeColor,
  
  // Text colors (CUSTOM USER THEME)
  foreground: {
    light: primitives.custom.lightText,      // #111827
    dark: primitives.custom.darkText,        // #F5F5F5
    DEFAULT: primitives.custom.lightText,
  } as ThemeColor,
  label: {
    light: primitives.custom.lightTextSubtle, // #6b7280 (for form labels)
    dark: primitives.custom.darkTextSubtle,   // #A0A0A0
    DEFAULT: primitives.custom.lightTextSubtle,
  } as ThemeColor,
  muted: {
    light: primitives.custom.lightText,      // #111827 (same as primary per user spec)
    dark: primitives.custom.darkText,        // #F5F5F5 (same as primary per user spec)
    DEFAULT: primitives.custom.lightText,
  } as ThemeColor,
  subtle: {
    light: primitives.custom.lightTextSubtle, // #6b7280
    dark: primitives.custom.darkTextSubtle,   // #A0A0A0
    DEFAULT: primitives.custom.lightTextSubtle,
  } as ThemeColor,
  
  // Border colors (CUSTOM USER THEME)
  border: {
    light: primitives.custom.lightBorder,    // #e5e7eb
    dark: primitives.custom.darkBorder,      // #2C2C2C
    DEFAULT: primitives.custom.lightBorder,
  } as ThemeColor,
  'border-focus': {
    light: primitives.teal[500],
    dark: primitives.teal[400],
    DEFAULT: primitives.teal[500],
  } as ThemeColor,
  
  // Accent colors (CUSTOM USER THEME) - Orange for LIGHT, Gray for DARK
  accent: {
    light: primitives.custom.accent,         // #FF6B00 (vibrant orange in light theme)
    dark: primitives.custom.darkAccent,      // #A0A0A0 (muted gray in dark theme)
    DEFAULT: primitives.custom.accent,
  } as ThemeColor,
  'accent-hover': {
    light: primitives.custom.accentHover,    // #FF8533 (lighter orange on hover in light theme)
    dark: primitives.custom.darkAccentHover, // #B0B0B0 (lighter gray on hover in dark theme)
    DEFAULT: primitives.custom.accentHover,
  } as ThemeColor,
  
  // Chart colors (for Recharts integration) - Orange for LIGHT, Gray for DARK
  chart: {
    primary: {
      light: primitives.custom.accent,       // #FF6B00 (Orange - main chart color in light theme)
      dark: primitives.custom.darkAccent,    // #A0A0A0 (Gray - main chart color in dark theme)
    } as ChartColor,
    secondary: {
      light: primitives.teal[600],           // #0d9488 (Teal as secondary)
      dark: primitives.teal[400],
    } as ChartColor,
    tertiary: {
      light: primitives.blue[600],
      dark: primitives.blue[400],
    } as ChartColor,
    success: {
      light: primitives.green[600],
      dark: primitives.green[400],
    } as ChartColor,
    warning: {
      light: primitives.yellow[500],
      dark: primitives.yellow[400],
    } as ChartColor,
    error: {
      light: primitives.red[600],
      dark: primitives.red[400],
    } as ChartColor,
  },
} as const;

export type SemanticColors = typeof colors;
