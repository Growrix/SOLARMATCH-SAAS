/**
 * White-Label Theme System
 * 
 * This module provides infrastructure for creating client-specific brand themes
 * by overriding semantic color tokens while maintaining the two-tier token architecture.
 * 
 * Architecture:
 * - Base Layer: Primitives (colors.ts, fontSizes.ts, spacingScale.ts) - NEVER override
 * - Semantic Layer: Semantic tokens (semantic/colors.ts) - CAN override per client
 * - Theme Layer: Client themes (themes/*.ts) - Override semantic colors only
 * 
 * Usage:
 * 1. Create new theme file: `themes/client-name.ts`
 * 2. Override primary/secondary colors (keep status colors for consistency)
 * 3. Export theme object with light/dark variants
 * 4. Import and apply in Tailwind config or ThemeProvider
 * 
 * Example:
 * ```ts
 * import { defaultTheme } from './default'
 * import { clientBlueTheme } from './client-blue'
 * 
 * // In tailwind.config.js:
 * const activeTheme = process.env.NEXT_PUBLIC_THEME === 'client-blue' 
 *   ? clientBlueTheme 
 *   : defaultTheme
 * 
 * theme: {
 *   extend: {
 *     colors: activeTheme.colors
 *   }
 * }
 * ```
 */

import { primitives } from '../primitives/colors'
import type { SemanticColors } from '../semantic/colors'

/**
 * Theme interface for white-label implementations
 * 
 * Allows overriding semantic color tokens while maintaining:
 * - Light/Dark/DEFAULT variants for theme support
 * - Status colors for consistency (Success/Warning/Error/Info)
 * - Background/Foreground/Border patterns
 */
export interface Theme {
  /** Theme identifier (used in URL params, localStorage keys) */
  id: string
  
  /** Human-readable theme name (displayed in UI) */
  name: string
  
  /** Client/brand name (for documentation) */
  client: string
  
  /** Semantic color overrides (only override brand colors, keep status colors) */
  colors: Partial<SemanticColors>
  
  /** Optional logo path for this brand */
  logo?: {
    light: string // Logo for light theme
    dark: string  // Logo for dark theme
  }
  
  /** Optional favicon path */
  favicon?: string
  
  /** Optional custom CSS variables */
  cssVariables?: Record<string, string>
}

/**
 * Default SolarMatch Theme
 * 
 * Uses teal-600 as primary (solar energy association), amber-500 as secondary
 * This is the baseline theme - all client themes inherit from this
 */
export const defaultTheme: Theme = {
  id: 'default',
  name: 'SolarMatch Default',
  client: 'SolarMatch',
  colors: {
    // Brand Colors (Teal primary, Amber secondary)
    primary: {
      light: primitives.teal[600],      // #0d9488
      dark: primitives.teal[400],       // #2dd4bf
      DEFAULT: primitives.teal[600],    // #0d9488
    },
    secondary: {
      light: primitives.amber[500],     // #f59e0b (Note: amber[400] in semantic/colors.ts, using 500 for better contrast)
      dark: primitives.amber[400],      // #fbbf24
      DEFAULT: primitives.amber[500],   // #f59e0b
    },
    
    // Status Colors (keep consistent across all themes)
    success: {
      light: primitives.green[600],     // #16a34a
      dark: primitives.green[400],      // #4ade80
      DEFAULT: primitives.green[600],   // #16a34a
    },
    warning: {
      light: primitives.yellow[500],    // #eab308
      dark: primitives.yellow[400],     // #facc15
      DEFAULT: primitives.yellow[500],  // #eab308
    },
    error: {
      light: primitives.red[600],       // #dc2626
      dark: primitives.red[400],        // #f87171
      DEFAULT: primitives.red[600],     // #dc2626
    },
    info: {
      light: primitives.blue[600],      // #2563eb
      dark: primitives.blue[400],       // #60a5fa
      DEFAULT: primitives.blue[600],    // #2563eb
    },
    
    // Background Colors (theme-aware)
    background: {
      light: primitives.white,          // #ffffff
      dark: primitives.gray[900],       // #111827
      DEFAULT: primitives.white,        // #ffffff
    },
    surface: {
      light: primitives.white,          // #ffffff (matching semantic/colors.ts)
      dark: primitives.gray[800],       // #1f2937
      DEFAULT: primitives.white,        // #ffffff
    },
    
    // Foreground Colors (theme-aware)
    foreground: {
      light: primitives.gray[900],      // #111827
      dark: primitives.gray[50],        // #f9fafb (matching semantic/colors.ts)
      DEFAULT: primitives.gray[900],    // #111827
    },
    muted: {
      light: primitives.gray[600],      // #4b5563
      dark: primitives.gray[400],       // #9ca3af
      DEFAULT: primitives.gray[600],    // #4b5563
    },
    
    // Border Colors (theme-aware)
    border: {
      light: primitives.gray[300],      // #d1d5db
      dark: primitives.gray[700],       // #374151
      DEFAULT: primitives.gray[300],    // #d1d5db
    },
  },
  
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  
  favicon: '/favicon.ico',
}

/**
 * Registry of available themes
 * 
 * Add new client themes here for easy switching
 */
import { clientBlueTheme } from './client-blue'

export const themes: Record<string, Theme> = {
  default: defaultTheme,
  'client-blue': clientBlueTheme,
  // Add more client themes here:
  // 'client-green': clientGreenTheme,
  // 'client-purple': clientPurpleTheme,
}

// Export client themes for direct import
export { clientBlueTheme }

/**
 * Get theme by ID
 * 
 * @param themeId - Theme identifier ('default', 'client-blue', etc.)
 * @returns Theme object or default theme if not found
 */
export function getTheme(themeId: string): Theme {
  return themes[themeId] || defaultTheme
}

/**
 * Get all available theme IDs
 * 
 * @returns Array of theme IDs
 */
export function getThemeIds(): string[] {
  return Object.keys(themes)
}

/**
 * Merge theme colors with base colors
 * 
 * Utility function for creating theme variants that only override specific colors
 * 
 * @param baseTheme - Base theme to inherit from (usually defaultTheme)
 * @param overrides - Color overrides (only brand colors typically)
 * @returns Merged theme colors
 */
export function mergeThemeColors(
  baseTheme: Theme,
  overrides: Partial<SemanticColors>
): SemanticColors {
  return {
    ...baseTheme.colors,
    ...overrides,
  } as SemanticColors
}
