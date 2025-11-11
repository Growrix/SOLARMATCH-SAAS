/**
 * 🎨 THEME COLORS HOOK
 * 
 * Provides theme-aware color utilities for components.
 * Use this hook to access semantic colors, status colors, and component variants.
 * 
 * @example
 * ```tsx
 * import { useThemeColors } from '@/lib/theme/useThemeColors';
 * 
 * function MyComponent() {
 *   const colors = useThemeColors();
 *   
 *   return (
 *     <button className={colors.button.primary}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */

import { colorTokens, getColorByStatus, type SemanticColor } from './colors';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

export function useThemeColors() {
  /**
   * STATUS BADGE COLORS
   * Returns Tailwind classes for status badges
   */
  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      // Lead statuses
      new: 'bg-info text-white',
      active: 'bg-success text-white',
      pending: 'bg-warning text-white',
      rejected: 'bg-error text-white',
      completed: 'bg-success text-white',
      draft: 'bg-warning text-white',
      
      // Verification statuses
      verified: 'bg-success text-white',
      unverified: 'bg-gray-400 text-white',
      
      // Payment statuses
      paid: 'bg-success text-white',
      unpaid: 'bg-warning text-white',
      failed: 'bg-error text-white',
      
      // General statuses
      approved: 'bg-success text-white',
      declined: 'bg-error text-white',
      expired: 'bg-gray-500 text-white',
    };
    
    return statusMap[status.toLowerCase()] || 'bg-gray-500 text-white';
  };

  /**
   * VERIFICATION BADGE COLORS
   * Returns classes for verified/unverified badges
   */
  const getVerificationColor = (verified: boolean): string => {
    return verified 
      ? 'text-success dark:text-success-light'
      : 'text-gray-400 dark:text-gray-500';
  };

  /**
   * BUTTON VARIANTS
   * Pre-defined button styles following design system
   */
  const button = {
    primary: 'bg-primary hover:bg-primary-dark text-white font-semibold transition-colors',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white font-semibold transition-colors',
    success: 'bg-success hover:bg-success-dark text-white font-semibold transition-colors',
    danger: 'bg-error hover:bg-error-dark text-white font-semibold transition-colors',
    warning: 'bg-warning hover:bg-warning-dark text-white font-semibold transition-colors',
    info: 'bg-info hover:bg-info-dark text-white font-semibold transition-colors',
    
    // Outline variants
    outlinePrimary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all',
    outlineSecondary: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold transition-all',
    
    // Ghost variants
    ghostPrimary: 'text-primary hover:bg-primary/10 font-semibold transition-colors',
    ghostSecondary: 'text-secondary hover:bg-secondary/10 font-semibold transition-colors',
    
    // Disabled
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  };

  /**
   * BADGE VARIANTS
   * Pre-defined badge styles
   */
  const badge = {
    success: 'bg-success text-white px-2 py-1 rounded-full text-xs font-semibold',
    warning: 'bg-warning text-white px-2 py-1 rounded-full text-xs font-semibold',
    error: 'bg-error text-white px-2 py-1 rounded-full text-xs font-semibold',
    info: 'bg-info text-white px-2 py-1 rounded-full text-xs font-semibold',
    neutral: 'bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold',
  };

  /**
   * ALERT VARIANTS
   * Pre-defined alert/notification styles
   */
  const alert = {
    success: 'bg-success/10 border border-success text-success-dark dark:text-success-light',
    warning: 'bg-warning/10 border border-warning text-warning-dark dark:text-warning-light',
    error: 'bg-error/10 border border-error text-error-dark dark:text-error-light',
    info: 'bg-info/10 border border-info text-info-dark dark:text-info-light',
  };

  /**
   * INPUT VARIANTS
   * Pre-defined input/form field styles
   */
  const input = {
    default: 'border-gray-300 dark:border-slate-700 focus:border-primary focus:ring-primary',
    error: 'border-error focus:border-error focus:ring-error',
    success: 'border-success focus:border-success focus:ring-success',
    disabled: 'bg-gray-100 border-gray-300 cursor-not-allowed',
  };

  /**
   * CHART COLORS
   * For data visualization (Recharts, Chart.js, etc.)
   */
  const charts = {
    savings: colorTokens.charts.savings,
    cost: colorTokens.charts.cost,
    roi: colorTokens.charts.roi,
    loss: colorTokens.charts.loss,
    projection: colorTokens.charts.projection,
    
    // Gradient definitions for area charts
    gradients: {
      savings: {
        start: `${colorTokens.charts.savings}cc`, // 80% opacity
        end: `${colorTokens.charts.savings}00`,   // 0% opacity
      },
      cost: {
        start: `${colorTokens.charts.cost}cc`,
        end: `${colorTokens.charts.cost}00`,
      },
    },
  };

  /**
   * TEXT COLOR UTILITIES
   * Semantic text colors
   */
  const text = {
    primary: 'text-slate-900 dark:text-white',
    secondary: 'text-slate-600 dark:text-slate-400',
    muted: 'text-slate-500 dark:text-slate-500',
    link: 'text-primary hover:text-primary-dark',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };

  /**
   * BORDER COLOR UTILITIES
   * Semantic border colors
   */
  const border = {
    light: 'border-gray-200 dark:border-slate-800',
    medium: 'border-gray-300 dark:border-slate-700',
    heavy: 'border-gray-400 dark:border-slate-600',
    primary: 'border-primary',
    success: 'border-success',
    warning: 'border-warning',
    error: 'border-error',
  };

  /**
   * SURFACE/BACKGROUND UTILITIES
   * Theme-aware surface colors
   */
  const surface = {
    primary: 'bg-white dark:bg-slate-900',
    secondary: 'bg-gray-50 dark:bg-slate-800',
    tertiary: 'bg-gray-100 dark:bg-slate-700',
    hover: 'hover:bg-gray-50 dark:hover:bg-slate-800',
  };

  return {
    // Status utilities
    getStatusColor,
    getVerificationColor,
    
    // Component variants
    button,
    badge,
    alert,
    input,
    
    // Chart utilities
    charts,
    
    // Semantic utilities
    text,
    border,
    surface,
    
    // Raw tokens (for advanced usage)
    tokens: colorTokens,
  };
}

/**
 * STANDALONE UTILITY FUNCTIONS
 * Can be used outside of React components
 */

/**
 * Get status badge classes (non-hook version)
 */
export function getStatusBadgeClasses(status: string): string {
  const statusMap: Record<string, string> = {
    new: 'bg-info text-white',
    active: 'bg-success text-white',
    pending: 'bg-warning text-white',
    rejected: 'bg-error text-white',
    completed: 'bg-success text-white',
    draft: 'bg-warning text-white',
  };
  
  return statusMap[status.toLowerCase()] || 'bg-gray-500 text-white';
}

/**
 * Get verification icon color (non-hook version)
 */
export function getVerificationIconColor(verified: boolean): string {
  return verified 
    ? 'text-success dark:text-success-light'
    : 'text-gray-400 dark:text-gray-500';
}

/**
 * CN UTILITY (if not already in project)
 * Combines Tailwind classes safely
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
