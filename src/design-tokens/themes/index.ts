/**
 * White-Label Theme System
 * 
 * This module provides infrastructure for creating client-specific brand themes.
 */

// Export types
export type { Theme } from './types'

// Export default theme and helpers
export { defaultTheme, mergeThemeColors } from './default-theme'

// Import client themes
import { defaultTheme } from './default-theme'
import { clientBlueTheme } from './client-blue'
import type { Theme } from './types'

// Registry of available themes
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  'client-blue': clientBlueTheme,
}

// Export client themes for direct import
export { clientBlueTheme }

// Get theme by ID
export function getTheme(themeId: string): Theme {
  return themes[themeId] || themes.default
}

// Get list of available theme IDs
export function getThemeIds(): string[] {
  return Object.keys(themes)
}
