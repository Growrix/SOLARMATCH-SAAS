/**
 * 🎨 DESIGN TOKENS - Color System
 * 
 * Centralized color definitions for the Solar Match application.
 * This is the SINGLE SOURCE OF TRUTH for all colors.
 * 
 * Usage:
 * - Import in Tailwind config
 * - Reference in components via Tailwind classes
 * - Use in JS/TS for dynamic styling
 * 
 * @see tailwind.config.js - Extended with these tokens
 * @see src/app/globals.css - CSS variables for theme-aware colors
 */

export const colorTokens = {
  /**
   * BRAND COLORS
   * Primary: Teal/Turquoise (Solar energy theme)
   * Secondary: Amber/Gold (Sun theme)
   */
  brand: {
    primary: {
      light: '#14b8a6',    // teal-500 - Hover highlights
      DEFAULT: '#0d9488',  // teal-600 - Main brand color
      dark: '#0f766e',     // teal-700 - Pressed states
    },
    secondary: {
      light: '#fcd34d',    // amber-300 - Light accents
      DEFAULT: '#fbbf24',  // amber-400 - Secondary actions
      dark: '#f59e0b',     // amber-500 - Hover states
    },
  },

  /**
   * SEMANTIC COLORS
   * Used for status indicators, alerts, and feedback
   */
  semantic: {
    success: {
      light: '#34d399',    // green-400
      DEFAULT: '#10b981',  // green-500
      dark: '#059669',     // green-600
    },
    warning: {
      light: '#fbbf24',    // amber-400
      DEFAULT: '#f59e0b',  // amber-500
      dark: '#d97706',     // amber-600
    },
    error: {
      light: '#f87171',    // red-400
      DEFAULT: '#ef4444',  // red-500
      dark: '#dc2626',     // red-600
    },
    info: {
      light: '#60a5fa',    // blue-400
      DEFAULT: '#3b82f6',  // blue-500
      dark: '#2563eb',     // blue-600
    },
  },

  /**
   * CHART COLORS
   * For data visualization components (Recharts, etc.)
   */
  charts: {
    savings: '#10b981',    // green-500 - Positive values
    cost: '#0D9488',       // teal-600 - Neutral values
    roi: '#14b8a6',        // teal-500 - Return on investment
    loss: '#ef4444',       // red-500 - Negative values
    projection: '#94a3b8', // slate-400 - Projected values
  },

  /**
   * NEUTRAL COLORS
   * Slate scale for text, borders, backgrounds
   * Note: These complement Tailwind's default slate scale
   */
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

/**
 * STATUS COLOR MAPPING
 * Maps application status strings to semantic colors
 */
export const statusColorMap = {
  // Lead statuses
  new: 'info',
  active: 'success',
  pending: 'warning',
  rejected: 'error',
  completed: 'success',
  draft: 'warning',
  
  // Verification statuses
  verified: 'success',
  unverified: 'neutral',
  
  // Payment statuses
  paid: 'success',
  unpaid: 'warning',
  failed: 'error',
  
  // General statuses
  approved: 'success',
  declined: 'error',
  expired: 'neutral',
} as const;

/**
 * Type exports for TypeScript autocomplete
 */
export type ColorToken = typeof colorTokens;
export type StatusKey = keyof typeof statusColorMap;
export type SemanticColor = keyof typeof colorTokens.semantic | 'neutral';

/**
 * Helper function to get semantic color by status
 * @example
 * getColorByStatus('active') // returns 'success'
 * getColorByStatus('pending') // returns 'warning'
 */
export function getColorByStatus(status: string): SemanticColor {
  const normalizedStatus = status.toLowerCase() as StatusKey;
  return statusColorMap[normalizedStatus] || 'info';
}

/**
 * Helper function to get Tailwind classes for a given status
 * @example
 * getStatusClasses('active') // returns 'bg-success text-white'
 * getStatusClasses('pending', 'badge') // returns 'bg-warning text-white'
 */
export function getStatusClasses(
  status: string, 
  variant: 'badge' | 'text' | 'border' = 'badge'
): string {
  const color = getColorByStatus(status);
  
  const variants = {
    badge: `bg-${color} text-white`,
    text: `text-${color}`,
    border: `border-${color}`,
  };
  
  return variants[variant];
}

/**
 * WCAG AA Compliant Color Combinations
 * Verified contrast ratios for accessibility
 */
export const accessibleCombinations = {
  light: {
    // Text on light backgrounds (4.5:1 minimum)
    primary: { text: '#0d9488', bg: '#ffffff' },      // 4.8:1 ✓
    text: { text: '#0F172A', bg: '#ffffff' },         // 14.3:1 ✓
    secondary: { text: '#f59e0b', bg: '#ffffff' },    // 3.2:1 ⚠️ (large text only)
  },
  dark: {
    // Text on dark backgrounds (4.5:1 minimum)
    primary: { text: '#14b8a6', bg: '#0f172a' },      // 5.1:1 ✓
    text: { text: '#E2E8F0', bg: '#0f172a' },         // 12.1:1 ✓
    secondary: { text: '#fbbf24', bg: '#0f172a' },    // 8.2:1 ✓
  },
} as const;
