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
  
  // Background colors
  background: {
    light: primitives.white,
    dark: primitives.gray[900],
    DEFAULT: primitives.white,
  } as ThemeColor,
  'background-alt': {
    light: primitives.gray[50],
    dark: primitives.gray[800],
    DEFAULT: primitives.gray[50],
  } as ThemeColor,
  surface: {
    light: primitives.white,
    dark: primitives.gray[800],
    DEFAULT: primitives.white,
  } as ThemeColor,
  
  // Text colors
  foreground: {
    light: primitives.gray[900],
    dark: primitives.gray[50],
    DEFAULT: primitives.gray[900],
  } as ThemeColor,
  muted: {
    light: primitives.gray[600],
    dark: primitives.gray[400],
    DEFAULT: primitives.gray[600],
  } as ThemeColor,
  subtle: {
    light: primitives.gray[500],
    dark: primitives.gray[500],
    DEFAULT: primitives.gray[500],
  } as ThemeColor,
  
  // Border colors
  border: {
    light: primitives.gray[300],
    dark: primitives.gray[700],
    DEFAULT: primitives.gray[300],
  } as ThemeColor,
  'border-focus': {
    light: primitives.teal[500],
    dark: primitives.teal[400],
    DEFAULT: primitives.teal[500],
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
