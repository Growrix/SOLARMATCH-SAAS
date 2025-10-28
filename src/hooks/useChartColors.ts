'use client';

import { useTheme } from 'next-themes';
import { colors } from '@/design-tokens';

/**
 * Convert hex color to rgba format
 * @param hex Hex color string (#RRGGBB)
 * @param alpha Opacity (0-1)
 * @returns RGBA color string
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * useChartColors Hook
 * 
 * Provides theme-aware color palettes specifically designed for data visualization (Recharts integration).
 * Returns hex color values that automatically adapt based on the current theme (light/dark/system).
 * 
 * @returns {Object} Current theme's chart color palette with primary/secondary/tertiary/status colors
 * 
 * @example
 * ```tsx
 * import { BarChart, Bar, ResponsiveContainer } from 'recharts';
 * 
 * const MyChart = ({ data }) => {
 *   const chartColors = useChartColors();
 *   
 *   return (
 *     <ResponsiveContainer width="100%" height={300}>
 *       <BarChart data={data}>
 *         <Bar dataKey="revenue" fill={chartColors.primary} />
 *         <Bar dataKey="expenses" fill={chartColors.secondary} />
 *         <Bar dataKey="profit" fill={chartColors.success} />
 *       </BarChart>
 *     </ResponsiveContainer>
 *   );
 * };
 * ```
 * 
 * @remarks
 * - Uses `next-themes` for theme detection (light/dark/system)
 * - Returns light/dark variant automatically based on current theme
 * - All colors are hex strings (#RRGGBB format) compatible with Recharts
 * - Color palette designed for high contrast and accessibility
 * - Primary/Secondary/Tertiary for data series differentiation
 * - Success/Warning/Error for status visualization
 */
export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const primaryColor = isDark ? colors.chart.primary.dark : colors.chart.primary.light;

  return {
    // Data series colors (for multi-series charts)
    primary: primaryColor,
    secondary: isDark ? colors.chart.secondary.dark : colors.chart.secondary.light,
    tertiary: isDark ? colors.chart.tertiary.dark : colors.chart.tertiary.light,

    // Status colors (for conditional formatting, thresholds)
    success: isDark ? colors.chart.success.dark : colors.chart.success.light,
    warning: isDark ? colors.chart.warning.dark : colors.chart.warning.light,
    error: isDark ? colors.chart.error.dark : colors.chart.error.light,

    // Gradient endpoints (for area charts, background fills)
    // Now dynamically generated from design tokens - no hardcoded rgba!
    gradient: {
      start: primaryColor,
      end: isDark ? hexToRgba(primaryColor, 0.1) : hexToRgba(primaryColor, 0.05), // Faded primary
    },

    // Grid/axis colors (for chart infrastructure)
    grid: isDark ? colors.border.dark : colors.border.light,
    axis: isDark ? colors.muted.dark : colors.muted.light,
    text: isDark ? colors.foreground.dark : colors.foreground.light,

    // Utility
    isDark,
    theme: resolvedTheme || 'light',

    /**
     * Get color array for multi-series charts (cycles through primary/secondary/tertiary)
     * @param length Number of colors needed (repeats if > 3)
     * @returns Array of hex color strings
     * 
     * @example
     * ```tsx
     * const chartColors = useChartColors();
     * const colorArray = chartColors.getColorArray(5);
     * // Returns: [primary, secondary, tertiary, primary, secondary]
     * ```
     */
    getColorArray: (length: number): string[] => {
      const baseColors = [
        isDark ? colors.chart.primary.dark : colors.chart.primary.light,
        isDark ? colors.chart.secondary.dark : colors.chart.secondary.light,
        isDark ? colors.chart.tertiary.dark : colors.chart.tertiary.light,
      ];
      return Array.from({ length }, (_, i) => baseColors[i % baseColors.length]);
    },

    /**
     * Get status color based on value threshold
     * @param value Numeric value to evaluate
     * @param thresholds Object with warning/error thresholds
     * @returns Hex color string (success/warning/error)
     * 
     * @example
     * ```tsx
     * const chartColors = useChartColors();
     * const color = chartColors.getStatusColor(75, { warning: 50, error: 80 });
     * // Returns: warning color (value >= 50 && < 80)
     * ```
     */
    getStatusColor: (value: number, thresholds?: { warning?: number; error?: number }): string => {
      if (thresholds?.error !== undefined && value >= thresholds.error) {
        return isDark ? colors.chart.error.dark : colors.chart.error.light;
      }
      if (thresholds?.warning !== undefined && value >= thresholds.warning) {
        return isDark ? colors.chart.warning.dark : colors.chart.warning.light;
      }
      return isDark ? colors.chart.success.dark : colors.chart.success.light;
    },
  };
}
