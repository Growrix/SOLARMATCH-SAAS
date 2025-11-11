/** @type {import('tailwindcss').Config} */

/**
 * 🎨 SOLAR MATCH - TAILWIND CONFIGURATION
 * 
 * Enhanced with centralized color tokens from the theme system.
 * 
 * INSTRUCTIONS TO IMPLEMENT:
 * 1. Backup your current tailwind.config.js
 * 2. Replace it with this file
 * 3. Restart your dev server (npm run dev)
 * 4. Test that colors work: bg-primary, text-success, etc.
 * 
 * @see src/lib/theme/colors.ts - Color token definitions
 * @see DOC/QUICK-START-THEME-IMPLEMENTATION.md - Implementation guide
 */

// Import the centralized color tokens
const { colorTokens } = require('./src/lib/theme/colors');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Enable class-based dark mode (using .dark class)
  darkMode: 'class',
  
  theme: {
    extend: {
      /**
       * COLORS
       * Extended with our design system tokens
       */
      colors: {
        // Brand Colors
        // Usage: bg-primary, text-primary-dark, border-primary-light
        primary: {
          light: colorTokens.brand.primary.light,       // #14b8a6 (teal-500)
          DEFAULT: colorTokens.brand.primary.DEFAULT,   // #0d9488 (teal-600)
          dark: colorTokens.brand.primary.dark,         // #0f766e (teal-700)
        },
        secondary: {
          light: colorTokens.brand.secondary.light,     // #fcd34d (amber-300)
          DEFAULT: colorTokens.brand.secondary.DEFAULT, // #fbbf24 (amber-400)
          dark: colorTokens.brand.secondary.dark,       // #f59e0b (amber-500)
        },
        
        // Semantic Colors
        // Usage: bg-success, text-error, border-warning
        success: {
          light: colorTokens.semantic.success.light,     // #34d399 (green-400)
          DEFAULT: colorTokens.semantic.success.DEFAULT, // #10b981 (green-500)
          dark: colorTokens.semantic.success.dark,       // #059669 (green-600)
        },
        warning: {
          light: colorTokens.semantic.warning.light,     // #fbbf24 (amber-400)
          DEFAULT: colorTokens.semantic.warning.DEFAULT, // #f59e0b (amber-500)
          dark: colorTokens.semantic.warning.dark,       // #d97706 (amber-600)
        },
        error: {
          light: colorTokens.semantic.error.light,       // #f87171 (red-400)
          DEFAULT: colorTokens.semantic.error.DEFAULT,   // #ef4444 (red-500)
          dark: colorTokens.semantic.error.dark,         // #dc2626 (red-600)
        },
        info: {
          light: colorTokens.semantic.info.light,        // #60a5fa (blue-400)
          DEFAULT: colorTokens.semantic.info.DEFAULT,    // #3b82f6 (blue-500)
          dark: colorTokens.semantic.info.dark,          // #2563eb (blue-600)
        },
        
        // Chart Colors (for data visualization)
        // Usage in JS: colors.chart.savings
        chart: {
          savings: colorTokens.charts.savings,       // #10b981 (green)
          cost: colorTokens.charts.cost,             // #0D9488 (teal)
          roi: colorTokens.charts.roi,               // #14b8a6 (bright teal)
          loss: colorTokens.charts.loss,             // #ef4444 (red)
          projection: colorTokens.charts.projection, // #94a3b8 (slate)
        },
      },
      
      /**
       * BACKGROUND IMAGES
       * Keep existing gradient utilities
       */
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      /**
       * ANIMATIONS
       * You can add custom animations here
       */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  
  plugins: [],
}
