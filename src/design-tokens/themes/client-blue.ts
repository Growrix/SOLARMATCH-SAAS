/**
 * Client Blue Theme - White-Label Example
 * 
 * Example white-label theme for a fictional client "TechCorp" using blue branding
 * Demonstrates how to override primary/secondary colors while keeping everything else consistent
 * 
 * Brand Guidelines (fictional):
 * - Primary: Deep Blue (#1e40af / blue-800) - Corporate, trustworthy
 * - Secondary: Sky Blue (#0ea5e9 / blue-500) - Modern, tech-forward
 * - Logo: Custom "TechCorp" branding
 * 
 * WCAG AA Compliance:
 * - Primary (blue-800 #1e40af) on white: 8.59:1 ✅ (exceeds 4.5:1)
 * - Secondary (blue-500 #0ea5e9) on white: 3.27:1 ⚠️ (marginal, use for large text only or darken to blue-600)
 * - All status colors unchanged (inherit from defaultTheme)
 */

import { primitives } from '../primitives/colors'
import type { Theme } from './index'
import { defaultTheme, mergeThemeColors } from './index'

/**
 * TechCorp Blue Theme
 * 
 * Corporate blue branding for technology/enterprise clients
 */
export const clientBlueTheme: Theme = {
  id: 'client-blue',
  name: 'TechCorp Blue',
  client: 'TechCorp (Example Client)',
  
  colors: mergeThemeColors(defaultTheme, {
    // Override PRIMARY to Deep Blue (blue-800)
    primary: {
      light: primitives.blue[800],      // #1e40af (dark blue for light theme)
      dark: primitives.blue[300],       // #93c5fd (light blue for dark theme)
      DEFAULT: primitives.blue[800],    // #1e40af
    },
    
    // Override SECONDARY to Sky Blue (blue-500)
    secondary: {
      light: primitives.blue[500],      // #0ea5e9 (sky blue for light theme)
      dark: primitives.blue[400],       // #60a5fa (lighter blue for dark theme)
      DEFAULT: primitives.blue[500],    // #0ea5e9
    },
    
    // Status colors INHERITED from defaultTheme (green/yellow/red/blue)
    // Background/Foreground/Border colors INHERITED from defaultTheme
  }),
  
  logo: {
    light: '/themes/techcorp/logo-light.svg',  // Custom logo for light theme
    dark: '/themes/techcorp/logo-dark.svg',    // Custom logo for dark theme
  },
  
  favicon: '/themes/techcorp/favicon.ico',  // Custom favicon
  
  cssVariables: {
    // Optional: Override CSS variables for fine-tuned control
    '--brand-tagline': '"Powering the Future"',
    '--brand-font-family': 'Inter, sans-serif',
  },
}

/**
 * Usage Example:
 * 
 * // In tailwind.config.js:
 * import { clientBlueTheme } from './src/design-tokens/themes/client-blue'
 * 
 * export default {
 *   theme: {
 *     extend: {
 *       colors: clientBlueTheme.colors
 *     }
 *   }
 * }
 * 
 * // Or dynamically at runtime:
 * const themeId = process.env.NEXT_PUBLIC_THEME || 'default'
 * const theme = getTheme(themeId)
 * 
 * // All existing components automatically use new colors!
 * <Button variant="primary">Sign Up</Button>  // Now deep blue instead of teal
 * <Badge color="secondary">New</Badge>        // Now cyan instead of amber
 */
