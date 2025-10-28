const { colors, typography, spacing, shadows, animations, borders } = require('./src/design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}', // Include Storybook stories
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Semantic color tokens
      colors: {
        primary: colors.primary.DEFAULT,
        'primary-hover': colors['primary-hover'].DEFAULT,
        'primary-dark': colors['primary-dark'].DEFAULT,
        secondary: colors.secondary.DEFAULT,
        'secondary-hover': colors['secondary-hover'].DEFAULT,
        success: colors.success.DEFAULT,
        warning: colors.warning.DEFAULT,
        error: colors.error.DEFAULT,
        info: colors.info.DEFAULT,
        background: colors.background.DEFAULT,
        'background-alt': colors['background-alt'].DEFAULT,
        surface: colors.surface.DEFAULT,
        foreground: colors.foreground.DEFAULT,
        muted: colors.muted.DEFAULT,
        subtle: colors.subtle.DEFAULT,
        border: colors.border.DEFAULT,
        'border-focus': colors['border-focus'].DEFAULT,
        
        // Keep existing colors for backward compatibility
        'bg-primary': 'var(--bg-primary)', // Theme-aware background
        'bg-secondary': 'var(--bg-secondary)', // Theme-aware secondary background
      },
      
      // Typography tokens
      fontFamily: {
        sans: typography.fontFamily.sans.split(', '),
        mono: typography.fontFamily.mono.split(', '),
      },
      fontSize: {
        'heading-1': [typography.heading[1].fontSize.DEFAULT, { lineHeight: typography.heading[1].lineHeight, fontWeight: typography.heading[1].fontWeight }],
        'heading-2': [typography.heading[2].fontSize.DEFAULT, { lineHeight: typography.heading[2].lineHeight, fontWeight: typography.heading[2].fontWeight }],
        'heading-3': [typography.heading[3].fontSize.DEFAULT, { lineHeight: typography.heading[3].lineHeight, fontWeight: typography.heading[3].fontWeight }],
        'heading-4': [typography.heading[4].fontSize.DEFAULT, { lineHeight: typography.heading[4].lineHeight, fontWeight: typography.heading[4].fontWeight }],
        body: [typography.body.fontSize.DEFAULT, { lineHeight: typography.body.lineHeight, fontWeight: typography.body.fontWeight }],
        'body-large': [typography['body-large'].fontSize.DEFAULT, { lineHeight: typography['body-large'].lineHeight }],
        'body-small': [typography['body-small'].fontSize, { lineHeight: typography['body-small'].lineHeight }],
        caption: [typography.caption.fontSize, { lineHeight: typography.caption.lineHeight }],
        label: [typography.label.fontSize, { lineHeight: typography.label.lineHeight, fontWeight: typography.label.fontWeight }],
        button: [typography.button.fontSize.DEFAULT, { lineHeight: typography.button.lineHeight, fontWeight: typography.button.fontWeight }],
      },
      
      // Spacing tokens (semantic + responsive)
      spacing: {
        ...spacing,
      },
      
      // Shadow tokens (elevation system)
      boxShadow: {
        card: shadows.card.DEFAULT,
        modal: shadows.modal.DEFAULT,
        dropdown: shadows.dropdown.DEFAULT,
        button: shadows.button.DEFAULT,
        focus: shadows.focus.DEFAULT,
      },
      
      // Border radius tokens
      borderRadius: {
        card: borders.radius.card,
        button: borders.radius.button,
        input: borders.radius.input,
        modal: borders.radius.modal,
        badge: borders.radius.badge,
      },
      
      // Animation tokens
      transitionDuration: animations.duration,
      transitionTimingFunction: animations.easing,
      keyframes: animations.keyframes,
      animation: {
        'fade-in': 'fadeIn 250ms ease-in-out',
        'fade-out': 'fadeOut 250ms ease-in-out',
        'slide-in-up': 'slideInUp 250ms ease-in-out',
        'slide-out-down': 'slideOutDown 250ms ease-in-out',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    // Responsive spacing plugin (for semantic auto-responsive tokens)
    require('tailwindcss/plugin')(function({ addUtilities, theme }) {
      const responsiveSpacing = theme('spacing');
      const newUtilities = {};

      Object.entries(responsiveSpacing).forEach(([key, value]) => {
        if (typeof value === 'object' && value.DEFAULT && !Array.isArray(value)) {
          // Padding
          newUtilities[`.p-${key}`] = {
            padding: value.DEFAULT,
            ...(value.md && { '@screen md': { padding: value.md } }),
            ...(value.lg && { '@screen lg': { padding: value.lg } }),
          };
          
          // Margin
          newUtilities[`.m-${key}`] = {
            margin: value.DEFAULT,
            ...(value.md && { '@screen md': { margin: value.md } }),
            ...(value.lg && { '@screen lg': { margin: value.lg } }),
          };
          
          // Gap
          newUtilities[`.gap-${key}`] = {
            gap: value.DEFAULT,
            ...(value.md && { '@screen md': { gap: value.md } }),
            ...(value.lg && { '@screen lg': { gap: value.lg } }),
          };
        }
      });

      addUtilities(newUtilities, ['responsive']);
    }),
  ],
}