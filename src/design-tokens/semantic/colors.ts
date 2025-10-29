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
  // Brand colors
  primary: {
    light: primitives.teal[600],
    dark: primitives.teal[400],
    DEFAULT: primitives.teal[600], // Tailwind default (light)
  } as ThemeColor,
  'primary-hover': {
    light: primitives.teal[700],
    dark: primitives.teal[500],
    DEFAULT: primitives.teal[700],
  } as ThemeColor,
  'primary-dark': {
    light: primitives.teal[700],
    dark: primitives.teal[300],
    DEFAULT: primitives.teal[700],
  } as ThemeColor,
  
  secondary: {
    light: primitives.amber[400],
    dark: primitives.amber[300],
    DEFAULT: primitives.amber[400],
  } as ThemeColor,
  'secondary-hover': {
    light: primitives.amber[500],
    dark: primitives.amber[400],
    DEFAULT: primitives.amber[500],
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
  
  // Accent colors (CUSTOM USER THEME) - Orange accent for CTAs and highlights
  accent: {
    light: primitives.custom.accent,         // #FF6B00 (vibrant orange)
    dark: primitives.custom.accent,          // #FF6B00 (same in both themes)
    DEFAULT: primitives.custom.accent,
  } as ThemeColor,
  'accent-hover': {
    light: primitives.custom.accentHover,    // #FF8533 (lighter orange on hover)
    dark: primitives.custom.accentHover,     // #FF8533 (same in both themes)
    DEFAULT: primitives.custom.accentHover,
  } as ThemeColor,
  
  // Chart colors (for Recharts integration)
  chart: {
    primary: {
      light: primitives.teal[600],
      dark: primitives.teal[400],
    } as ChartColor,
    secondary: {
      light: primitives.amber[400],
      dark: primitives.amber[300],
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
