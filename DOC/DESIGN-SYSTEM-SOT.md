# Design System - Source of Truth (SOT)
**Purpose**: Complete reference for the neumorphic design system  
**Date**: November 1, 2025  
**Status**: Active Standard  
**Theme**: Dark-Only (Constitution VI Compliant)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing System](#spacing-system)
6. [Shadow System (Neumorphic)](#shadow-system-neumorphic)
7. [Component Classes](#component-classes)
8. [Form Components](#form-components)
9. [Animation System](#animation-system)
10. [Border & Radius](#border--radius)
11. [Industry Standard Violations](#industry-standard-violations)
12. [Migration Guidelines](#migration-guidelines)

---

## 🎯 Overview

### What is This System?

This is a **neumorphic dark-theme design system** built on:
- **Design Tokens**: Semantic variables for colors, typography, spacing, shadows
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe design token interfaces
- **Dark-First**: Constitution VI compliant (dark theme only, light theme future)

### Architecture

```
Design System
├── Primitives (Raw Values)
│   ├── Color Palette (#101010, #1A1A1A, etc.)
│   ├── Font Sizes (12px, 14px, 16px, etc.)
│   └── Spacing Scale (4px, 8px, 12px, etc.)
├── Semantic Tokens (Meaningful Names)
│   ├── Colors (primary, surface, foreground, etc.)
│   ├── Typography (heading-1, body, caption, etc.)
│   └── Spacing (card-padding, section-gap, etc.)
└── Component Classes (Reusable Patterns)
    ├── Buttons (.neu-btn-primary, .neu-btn-secondary)
    ├── Cards (.neu-card, .theme-card)
    └── Forms (.neu-input, .auth-input-icon)
```

---

## 🎨 Design Principles

### 1. **Neumorphism**
- All interactive elements use soft shadows (raised/inset)
- Background color (#101010) is the canvas
- Shadows create depth perception

### 2. **Design Tokens Only**
- ❌ Never use: `bg-teal-600`, `text-slate-400`, `border-gray-300`
- ✅ Always use: `bg-primary`, `text-foreground`, `border-border`

### 3. **Dark-First**
- System built for dark theme (#101010 background)
- Light theme will be added later (copy-paste with color swaps)
- No light mode classes in current components

### 4. **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly (ARIA labels)

### 5. **Type Safety**
- Full TypeScript interfaces for all tokens
- Compile-time validation of token usage

---

## 🎨 Color System

### CSS Variables (globals.css :root)

```css
:root {
  /* Background Colors */
  --bg-primary: #101010;        /* Main background */
  --bg-secondary: #1A1A1A;      /* Secondary surfaces */
  
  /* Text Colors */
  --text-primary: #F5F5F5;      /* Main text */
  --text-secondary: #FFFFFF;    /* White text (rare) */
  
  /* Border Colors */
  --border-color: #2C2C2C;      /* Subtle borders */
  
  /* Accent Colors */
  --accent-color: #FFFFFF;      /* White accent */
  
  /* RGB Values for Tailwind (with opacity support) */
  --color-primary: 255 255 255;              /* White */
  --color-primary-hover: 255 255 255;        /* White hover */
  --color-secondary: 26 26 26;               /* Dark gray */
  --color-background: 16 16 16;              /* #101010 */
  --color-surface: 26 26 26;                 /* #1A1A1A */
  --color-surface-hover: 37 37 37;           /* #252525 */
  --color-foreground: 245 245 245;           /* #F5F5F5 */
  --color-muted: 64 64 64;                   /* #404040 */
  --color-subtle: 255 255 255;               /* White */
  --color-border: 44 44 44;                  /* #2C2C2C */
  --color-accent: 255 255 255;               /* White */
  
  /* Status Colors */
  --color-success: 22 163 74;    /* Green */
  --color-warning: 234 179 8;    /* Yellow/Orange */
  --color-error: 220 38 38;      /* Red */
  --color-info: 37 99 235;       /* Blue */
}
```

### Tailwind Color Tokens

```tsx
// ✅ CORRECT USAGE
bg-primary           // White (primary brand color)
bg-secondary         // Dark gray (#1A1A1A)
bg-surface           // Surface color (#1A1A1A)
bg-surface-hover     // Hover state (#252525)
bg-background        // Main background (#101010)

text-foreground      // Main text (#F5F5F5)
text-muted-foreground // Muted text (white)
text-subtle          // Subtle text (white)

border-border        // Border color (#2C2C2C)

// Status Colors
bg-success           // Green success state
bg-warning           // Yellow/orange warning
bg-error             // Red error state
bg-info              // Blue info state

// With Opacity
bg-primary/20        // 20% opacity white
bg-surface/50        // 50% opacity surface
text-foreground/80   // 80% opacity text
```

### ❌ NEVER Use (Industry Violation)

```tsx
// ❌ FORBIDDEN - Hardcoded Colors
bg-teal-600          // Use bg-primary
bg-slate-700         // Use bg-surface
text-blue-500        // Use text-info
border-gray-300      // Use border-border
bg-white/5           // Use bg-surface/5
dark:bg-black        // Use bg-background
dark:text-white      // Use text-foreground
text-slate-400       // Use text-muted-foreground
```

### shadcn/ui HSL Colors

```css
/* For shadcn/ui components */
--background: 0 0% 6%;              /* #101010 */
--foreground: 0 0% 96%;             /* #F5F5F5 */
--card: 0 0% 10%;                   /* #1A1A1A */
--primary: 0 0% 63%;                /* Muted gray */
--secondary: 0 0% 14%;              /* #252525 */
--muted: 0 0% 25%;                  /* #404040 */
--accent: 0 0% 25%;                 /* Accent color */
--destructive: 0 63% 50%;           /* Red */
--success: 142 71% 45%;             /* Green */
--info: 217 91% 60%;                /* Blue */
--warning: 38 92% 50%;              /* Orange */
--border: 0 0% 17%;                 /* #2C2C2C */
--radius: 1rem;                     /* Border radius */
```

---

## ✍️ Typography System

### TypeScript Tokens (src/design-tokens/semantic/typography.ts)

```typescript
export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, Consolas, monospace',
  },
  heading: {
    1: {
      fontSize: { DEFAULT: '24px', md: '30px', lg: '36px' }, // Responsive
      lineHeight: '1.25',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
    },
    2: {
      fontSize: { DEFAULT: '20px', md: '24px', lg: '30px' },
      lineHeight: '1.25',
      fontWeight: 'bold',
      letterSpacing: '-0.01em',
    },
    3: {
      fontSize: { DEFAULT: '18px', md: '20px', lg: '24px' },
      lineHeight: '1.3',
      fontWeight: 'semibold',
    },
    4: {
      fontSize: { DEFAULT: '16px', md: '18px', lg: '20px' },
      lineHeight: '1.4',
      fontWeight: 'semibold',
    },
  },
  body: {
    fontSize: { DEFAULT: '14px', lg: '16px' },
    lineHeight: '1.5',
    fontWeight: 'normal',
  },
  'body-large': {
    fontSize: { DEFAULT: '16px', lg: '18px' },
    lineHeight: '1.6',
  },
  'body-small': {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '1.4',
    letterSpacing: '0.025em', // All-caps tracking
  },
  label: {
    fontSize: '14px',
    lineHeight: '1.5',
    fontWeight: 'medium',
  },
  button: {
    fontSize: { DEFAULT: '14px', lg: '16px' },
    lineHeight: '1',
    fontWeight: 'semibold',
    letterSpacing: '0.025em',
  },
};
```

### Tailwind Typography Classes

```tsx
// ✅ CORRECT USAGE
text-heading-1       // Largest heading (responsive: 24px → 36px)
text-heading-2       // h2 (responsive: 20px → 30px)
text-heading-3       // h3 (responsive: 18px → 24px)
text-heading-4       // h4 (responsive: 16px → 20px)
text-body            // Body text (14px → 16px)
text-body-large      // Large body (16px → 18px)
text-body-small      // Small body (14px)
text-caption         // Captions, metadata (12px)
text-label           // Form labels (14px, medium)
text-button          // Button text (14px → 16px, semibold)

font-sans            // Inter font family
font-mono            // Fira Code (for code snippets)
```

### ❌ NEVER Use (Industry Violation)

```tsx
// ❌ FORBIDDEN - Raw Tailwind Typography
text-2xl             // Use text-heading-1
text-xl              // Use text-heading-2
text-lg              // Use text-heading-3
text-base            // Use text-body
text-sm              // Use text-body-small
text-xs              // Use text-caption

font-bold            // Use text-heading-X (font-weight included)
font-semibold        // Use text-heading-X or text-label
leading-tight        // Use text-heading-X (line-height included)
leading-relaxed      // Use text-body (line-height included)
```

### Semantic HTML Must Match Visual Size

```tsx
// ✅ CORRECT
<h1 className="text-heading-1">         // h1 uses heading-1 class
<h2 className="text-heading-2">         // h2 uses heading-2 class
<p className="text-body">               // Paragraphs use body class

// ❌ WRONG - Semantic Mismatch
<h1 className="text-sm">                // h1 looks tiny
<div className="text-2xl font-bold">   // Not semantic HTML
```

---

## 📏 Spacing System

### TypeScript Tokens (src/design-tokens/semantic/spacing.ts)

```typescript
export const spacing = {
  // Component-specific (auto-responsive)
  'card-padding': { DEFAULT: '24px', md: '32px' },
  'section-padding': { DEFAULT: '32px', md: '48px', lg: '64px' },
  'container-padding': { DEFAULT: '16px', md: '24px', lg: '32px' },
  
  // Layout gaps
  'section-gap': { DEFAULT: '32px', md: '48px' },
  'card-gap': '16px',
  'element-gap': '12px',
  
  // Form spacing
  'form-field-gap': '16px',
  'form-section-gap': '24px',
  
  // Button spacing
  'button-padding-x': '24px',
  'button-padding-y': '12px',
  
  // Icon spacing
  'icon-gap': '12px',
  
  // Fixed values (for exact control)
  '0': '0px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
};
```

### Tailwind Spacing Classes

```tsx
// ✅ CORRECT USAGE - Semantic Spacing
p-card-padding       // Card padding (responsive: 24px → 32px)
p-section-padding    // Section padding (responsive: 32px → 64px)
gap-card-gap         // Gap between cards (16px)
gap-element-gap      // Gap between elements (12px)
mb-form-section-gap  // Margin below form section (24px)

// ✅ CORRECT USAGE - Fixed Spacing
p-4                  // 16px padding
m-6                  // 24px margin
gap-3                // 12px gap
space-y-4            // 16px vertical spacing
```

### Form Spacing Standards

```tsx
// Form Structure
<form className="space-y-4">          // 16px between fields
  <div className="space-y-2">         // 8px between label and input
    <label>                           
    <input>
  </div>
  
  <div className="mt-6">              // 24px above buttons
    <button>
  </div>
</form>
```

---

## 🌑 Shadow System (Neumorphic)

### CSS Variables (globals.css)

```css
:root {
  /* Shadow Colors (for #101010 background) */
  --neu-shadow-light: rgba(40, 40, 40, 0.5);    /* Highlight */
  --neu-shadow-dark: rgba(0, 0, 0, 0.9);        /* Shadow */
  --neu-shadow-inset-light: rgba(40, 40, 40, 0.3);
  --neu-shadow-inset-dark: rgba(0, 0, 0, 0.7);
  
  /* Neumorphic Shadow Presets */
  --shadow-neu-outset: 6px 6px 12px var(--neu-shadow-dark), 
                       -6px -6px 12px var(--neu-shadow-light);
  
  --shadow-neu-inset: inset 6px 6px 12px var(--neu-shadow-dark), 
                      inset -6px -6px 12px var(--neu-shadow-light);
  
  --shadow-neu-outset-sm: 4px 4px 8px var(--neu-shadow-dark), 
                          -4px -4px 8px var(--neu-shadow-light);
  
  --shadow-neu-inset-sm: inset 4px 4px 8px var(--neu-shadow-dark), 
                         inset -4px -4px 8px var(--neu-shadow-light);
  
  --shadow-neu-outset-lg: 8px 8px 16px var(--neu-shadow-dark), 
                          -8px -8px 16px var(--neu-shadow-light);
}
```

### Tailwind Shadow Classes

```tsx
// ✅ CORRECT USAGE
shadow-neu-outset     // Raised element (buttons, cards)
shadow-neu-inset      // Pressed element (inputs, active states)
shadow-neu-outset-sm  // Small raised
shadow-neu-inset-sm   // Small pressed
shadow-neu-outset-lg  // Large raised (hover states)
```

### When to Use Which Shadow

| Element Type | Shadow Type | Example |
|-------------|-------------|---------|
| Buttons (default) | `shadow-neu-outset` | Appears raised |
| Buttons (pressed) | `shadow-neu-inset` | Appears pressed |
| Cards | `shadow-neu-outset` | Floating above background |
| Inputs | `shadow-neu-inset` | Recessed into surface |
| Icon containers | `shadow-neu-outset` | Raised circle/square |
| Active/pressed states | `shadow-neu-inset` | Pressed down |
| Hover states | `shadow-neu-outset-lg` | Lift higher |

---

## 🧩 Component Classes

### Buttons (globals.css)

#### Primary Button - Raised Effect

```css
.neu-btn-primary {
  @apply bg-primary text-foreground-dark;
  @apply px-6 py-3 rounded-xl font-semibold;
  box-shadow: 8px 8px 16px var(--neu-shadow-dark),
              -8px -8px 16px var(--neu-shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.neu-btn-primary:hover {
  box-shadow: 6px 6px 12px var(--neu-shadow-dark),
              -6px -6px 12px var(--neu-shadow-light);
  transform: translateY(-2px);
}

.neu-btn-primary:active {
  box-shadow: inset 4px 4px 8px var(--neu-shadow-inset-dark),
              inset -4px -4px 8px var(--neu-shadow-inset-light);
  transform: translateY(0);
}
```

**Usage:**
```tsx
<button className="neu-btn-primary">
  Click Me
</button>
```

#### Secondary Button - Subtle

```css
.neu-btn-secondary {
  @apply bg-primary text-foreground;
  @apply px-6 py-3 rounded-xl font-medium;
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
              -4px -4px 8px var(--neu-shadow-light);
}
```

#### Link Button - Minimal

```css
.neu-btn-link {
  @apply bg-transparent text-foreground;
  @apply px-4 py-2 rounded-lg font-medium;
  transition: all 0.3s ease;
}

.neu-btn-link:hover {
  @apply bg-surface/10;
}
```

### Cards (globals.css)

#### Standard Card - Flat Raised

```css
.neu-card {
  @apply bg-primary rounded-[20px] p-6;
  box-shadow: 10px 10px 20px var(--neu-shadow-dark),
              -10px -10px 20px var(--neu-shadow-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.neu-card:hover {
  box-shadow: 12px 12px 24px var(--neu-shadow-dark),
              -12px -12px 24px var(--neu-shadow-light);
  transform: translateY(-4px);
}
```

**Usage:**
```tsx
<div className="neu-card">
  <h3 className="text-heading-3 text-foreground mb-4">Card Title</h3>
  <p className="text-body text-subtle">Card content...</p>
</div>
```

#### Theme Card (Alias for neu-card)

```css
.theme-card {
  @apply neu-card; /* Same as neu-card */
}
```

#### Pressed Card - Concave Effect

```css
.neu-card-pressed {
  @apply bg-primary rounded-[20px] p-6;
  box-shadow: inset 6px 6px 12px var(--neu-shadow-inset-dark),
              inset -6px -6px 12px var(--neu-shadow-inset-light);
}
```

### Icon Buttons

```css
.neu-btn-icon {
  @apply bg-primary rounded-full;
  @apply w-12 h-12 flex items-center justify-center;
  box-shadow: 6px 6px 12px var(--neu-shadow-dark),
              -6px -6px 12px var(--neu-shadow-light);
}
```

---

## 📝 Form Components

### Input Fields (globals.css)

#### Standard Input - Neumorphic Inset

```css
.neu-input {
  @apply w-full bg-surface border border-border rounded-xl py-3 px-4;
  @apply text-foreground placeholder:text-muted-foreground;
  @apply transition-all duration-200;
  @apply focus:border-primary focus:shadow-neu-inset focus:outline-none;
  @apply shadow-neu-inset;
}

.neu-input::placeholder {
  @apply text-muted-foreground opacity-60;
  @apply transition-opacity duration-200;
}

.neu-input:focus::placeholder {
  @apply opacity-40; /* Fade on focus */
}
```

**Usage:**
```tsx
<input 
  type="text" 
  className="neu-input" 
  placeholder="Enter text..."
/>
```

#### Error State Input

```css
.neu-input-error {
  @apply neu-input border-destructive;
}
```

### Input Icons (Left-side)

```css
.auth-input-icon {
  @apply absolute left-4 top-1/2 -translate-y-1/2;
  @apply text-muted-foreground pointer-events-none;
  @apply transition-colors duration-200;
}

/* Icon highlights when input focused */
.neu-input:focus ~ .auth-input-icon,
.neu-input:focus + .auth-input-icon {
  @apply text-subtle;
}
```

**Usage:**
```tsx
<div className="relative">
  <input className="neu-input pl-12" />
  <div className="auth-input-icon">
    <MailIcon className="h-5 w-5" />
  </div>
</div>
```

**Spacing Standards:**
- Icon position: `left-4` (16px from left edge)
- Input left padding: `pl-12` (48px) when icon present
- Icon size: `h-5 w-5` (20x20px)

### Form Header Icon Container - Neumorphic

```css
.auth-icon-container {
  @apply w-20 h-20 bg-surface rounded-[1.25rem];
  @apply flex items-center justify-center;
  @apply shadow-neu-outset;
  @apply transition-all duration-300;
}

.auth-icon-container:hover {
  @apply shadow-neu-outset-lg;
}
```

**Usage:**
```tsx
<div className="auth-icon-container mb-6">
  <LockIcon className="h-10 w-10 text-primary" />
</div>
```

**Sizing Standards:**
- Container: `80x80px` (w-20 h-20)
- Icon inside: `40x40px` (h-10 w-10)
- Margin below: `mb-6` (24px)

### Form Alerts

```css
.neu-alert-error {
  @apply bg-destructive/10 text-destructive;
  @apply border border-destructive/30 rounded-xl p-4;
  @apply shadow-neu-inset;
}

.neu-alert-success {
  @apply bg-success/10 text-success;
  @apply border border-success/30 rounded-xl p-4;
  @apply shadow-neu-inset;
}

.neu-alert-warning {
  @apply bg-warning/10 text-warning;
  @apply border border-warning/30 rounded-xl p-4;
  @apply shadow-neu-inset;
}

.neu-alert-info {
  @apply bg-info/10 text-info;
  @apply border border-info/30 rounded-xl p-4;
  @apply shadow-neu-inset;
}
```

---

## 🎬 Animation System

### CSS Variables (globals.css)

```css
:root {
  /* Animation Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  
  /* Easing Functions */
  --easing-linear: linear;
  --easing-easeIn: cubic-bezier(0.4, 0, 1, 1);
  --easing-easeOut: cubic-bezier(0, 0, 0.2, 1);
  --easing-easeInOut: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Tailwind Animation Classes

```tsx
// Transition Durations
duration-fast        // 150ms
duration-normal      // 250ms
duration-slow        // 350ms
duration-slower      // 500ms

// Transition Properties (NEVER use transition-all)
transition-colors    // Color transitions only
transition-shadow    // Shadow transitions only
transition-transform // Transform transitions only
transition-opacity   // Opacity transitions only

// Built-in Animations
animate-fade-in      // Fade in
animate-fade-out     // Fade out
animate-slide-in-up  // Slide in from bottom
animate-spin         // Loading spinners
```

### ❌ NEVER Use

```tsx
transition-all       // ❌ PERFORMANCE KILLER - animates everything
transition           // ❌ Too generic - be specific
```

### Animation Best Practices

1. **Be Specific**: Use `transition-colors` not `transition-all`
2. **Use Normal Duration**: Default to `duration-200` (200ms)
3. **Smooth Easing**: Use `ease-in-out` for most transitions
4. **Respect Accessibility**: Components auto-disable animations if user prefers reduced motion

```tsx
// ✅ CORRECT
<button className="neu-btn-primary transition-colors duration-200">
  
// ❌ WRONG
<button className="neu-btn-primary transition-all duration-500">
```

---

## 📐 Border & Radius

### Border Radius Tokens

```typescript
export const borders = {
  radius: {
    card: '20px',
    button: '12px',
    input: '12px',
    modal: '24px',
    badge: '9999px', // Fully rounded
  },
  width: {
    default: '1px',
    thick: '2px',
  },
};
```

### Tailwind Border Classes

```tsx
// Radius
rounded-card         // 20px (cards)
rounded-button       // 12px (buttons)
rounded-input        // 12px (inputs)
rounded-modal        // 24px (modals)
rounded-badge        // 9999px (badges, pills)

// Width
border               // 1px solid
border-2             // 2px solid

// Color
border-border        // Default border color (#2C2C2C)
```

---

## 🚨 Industry Standard Violations

### Current Violations Found (November 1, 2025 Audit)

#### 1. ❌ Hardcoded Colors (HIGH PRIORITY)

**Files Affected:** 
- `src/components/InstantQuoteForm.tsx` (30+ violations)
- `src/components/Hero.tsx` (4 violations)
- `src/components/QuoteOptionsModal.tsx` (6 violations)
- `src/components/HomeownerMobileSidebarMenu.tsx` (12 violations)
- `src/components/homeowner/SimplifiedQuoteForm.tsx` (20+ violations)

**Violations:**
```tsx
// ❌ WRONG
className="bg-slate-50/50 dark:bg-slate-800/50"
className="text-slate-900 dark:text-white"
className="border-gray-200 dark:border-slate-700"
className="bg-white/50 dark:bg-slate-700/30"
className="text-slate-600 dark:text-slate-300"

// ✅ SHOULD BE
className="bg-surface/50"
className="text-foreground"
className="border-border"
className="bg-surface/50"
className="text-muted-foreground"
```

**Impact:** 
- Inconsistent colors across components
- Breaks when theme changes
- Not maintainable
- 100+ instances need fixing

**Priority:** P0 - Must fix before any new features

---

#### 2. ❌ Raw Tailwind Typography (MEDIUM PRIORITY)

**Files Affected:**
- `src/components/Hero.tsx`
- `src/components/QuoteOptionsModal.tsx`
- `src/components/InstantQuoteForm.tsx`

**Violations:**
```tsx
// ❌ WRONG
className="text-2xl font-bold"
className="text-sm font-medium"
className="text-4xl md:text-5xl font-bold"

// ✅ SHOULD BE
className="text-heading-2"
className="text-body-small"
className="text-heading-1"
```

**Impact:**
- No responsive scaling (manual breakpoints needed)
- Inconsistent heading hierarchy
- Missing optimal line-heights/letter-spacing
- Harder to maintain

**Priority:** P1 - Fix during next component updates

---

#### 3. ❌ Hardcoded Input Classes (MEDIUM PRIORITY)

**Files Affected:**
- `src/components/homeowner/SimplifiedQuoteForm.tsx`

**Violations:**
```tsx
// ❌ WRONG
const baseInputClasses = "w-full bg-gray-100 dark:bg-slate-900 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

// ✅ SHOULD BE
<AuthInput />  // or  className="neu-input"
```

**Impact:**
- Duplicate code across components
- Not using centralized form components
- Inconsistent form styling

**Priority:** P1 - Migrate to centralized components

---

#### 4. ❌ Conditional Dark Mode Classes (HIGH PRIORITY)

**Violations:**
```tsx
// ❌ WRONG - Manual dark mode switching
className="text-slate-900 dark:text-white"
className="bg-gray-100 dark:bg-slate-800"

// ✅ CORRECT - CSS variables handle theme automatically
className="text-foreground"
className="bg-surface"
```

**Why It's Wrong:**
- CSS variables already handle dark mode
- Adding `dark:` creates duplicate theming logic
- Harder to add future themes (light, brand)
- Not scalable

**Priority:** P0 - Critical industry standard violation

---

#### 5. ❌ Inline Icon SVGs (LOW PRIORITY)

**Files Affected:**
- Various components with inline `<svg>` tags

**Violations:**
```tsx
// ❌ WRONG - Inline SVG
<svg xmlns="http://www.w3.org/2000/svg">...</svg>

// ✅ CORRECT - Centralized icon component
<MailIcon className="h-5 w-5" />
```

**Impact:**
- Code duplication
- Harder to maintain consistent icon sizing
- Bundle size increase

**Priority:** P2 - Fix gradually during refactors

---

#### 6. ❌ Missing Semantic HTML (MEDIUM PRIORITY)

**Violations:**
```tsx
// ❌ WRONG - Visual size doesn't match semantic meaning
<div className="text-2xl font-bold">Title</div>
<h1 className="text-sm">Small heading</h1>

// ✅ CORRECT - Semantic HTML matches visual hierarchy
<h1 className="text-heading-1">Title</h1>
<h2 className="text-heading-2">Subtitle</h2>
```

**Why It Matters:**
- SEO impact (search engines rely on semantic HTML)
- Accessibility (screen readers use heading hierarchy)
- WCAG 2.1 compliance requirement

**Priority:** P1 - Fix during typography migration

---

### Violation Summary Table

| Violation Type | Priority | Instances Found | Files Affected |
|----------------|----------|-----------------|----------------|
| Hardcoded colors | P0 | 100+ | 10+ components |
| Raw Tailwind typography | P1 | 50+ | 8 components |
| Hardcoded input classes | P1 | 5 | 3 components |
| Manual dark mode classes | P0 | 80+ | 10+ components |
| Inline icon SVGs | P2 | 20+ | 5 components |
| Semantic HTML misuse | P1 | 30+ | 6 components |

**Total Technical Debt:** ~285 violations across codebase

---

## 🔄 Migration Guidelines

### Step-by-Step Migration Process

#### Phase 1: Replace Hardcoded Colors (P0)

```bash
# Search for violations
grep -r "bg-slate-" src/components/
grep -r "text-slate-" src/components/
grep -r "dark:bg-black" src/components/
grep -r "dark:text-white" src/components/
```

**Replacement Map:**
```tsx
// Background Colors
bg-white/5 dark:bg-black/20        → bg-surface/5
bg-slate-700 dark:bg-slate-900     → bg-surface
bg-gray-100 dark:bg-slate-800      → bg-surface

// Text Colors
text-slate-900 dark:text-white     → text-foreground
text-slate-600 dark:text-slate-400 → text-muted-foreground
text-slate-500 dark:text-slate-300 → text-subtle

// Border Colors
border-gray-200 dark:border-slate-700 → border-border
border-slate-700/50                   → border-border/50
```

#### Phase 2: Migrate Typography (P1)

```tsx
// Heading Migrations
text-4xl font-bold                 → text-heading-1
text-3xl font-bold                 → text-heading-2
text-2xl font-bold                 → text-heading-2
text-xl font-semibold              → text-heading-3
text-lg font-semibold              → text-heading-4

// Body Text Migrations
text-base                          → text-body
text-sm                            → text-body-small
text-xs                            → text-caption

// Remove These (included in typography classes)
font-bold                          → (remove, included in heading classes)
font-semibold                      → (remove, included in heading classes)
leading-tight                      → (remove, included in heading classes)
leading-relaxed                    → (remove, included in body classes)
```

#### Phase 3: Use Centralized Components (P1)

```tsx
// ❌ OLD - Custom input with hardcoded classes
<input className="w-full bg-gray-100 dark:bg-slate-900 border..." />

// ✅ NEW - Centralized AuthInput component
import { AuthInput } from '@/components/auth';

<AuthInput
  name="email"
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={<MailIcon className="h-5 w-5" />}
/>
```

#### Phase 4: Verify No Violations

```bash
# After migration, these should return ZERO results:
grep -r "bg-slate-" src/components/
grep -r "text-slate-" src/components/
grep -r "dark:text-white" src/components/
grep -r "text-2xl font-" src/components/
```

---

### Pre-Commit Checklist

Before committing component changes:

- [ ] Zero hardcoded colors (`bg-teal-600`, `text-slate-400`)
- [ ] Zero manual dark mode classes (`dark:bg-black`, `dark:text-white`)
- [ ] Typography uses semantic tokens (`text-heading-1`, `text-body`)
- [ ] Forms use centralized components (`AuthInput`, `AuthButton`)
- [ ] Semantic HTML matches visual hierarchy (`h1` uses `text-heading-1`)
- [ ] Animations are specific (`transition-colors`, not `transition-all`)
- [ ] Icons use centralized components (`<MailIcon />`)
- [ ] Spacing uses semantic tokens (`p-card-padding`, `gap-element-gap`)

---

## 📚 Quick Reference

### Component Migration Checklist

```tsx
// ✅ Fully Compliant Component Example
import { AuthInput, AuthButton, AuthAlert } from '@/components/auth';
import { MailIcon, LockIcon } from '@/components/icons/auth';

export function LoginForm() {
  return (
    <form className="space-y-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="auth-icon-container mb-6">
          <LockIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-heading-2 text-foreground mb-2">
          Sign In
        </h1>
        <p className="text-body-small text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      {/* Form Fields */}
      <AuthInput
        type="email"
        name="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<MailIcon className="h-5 w-5" />}
      />

      <AuthInput
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<LockIcon className="h-5 w-5" />}
        showPasswordToggle
      />

      {/* Error Alert */}
      {error && (
        <AuthAlert variant="error">
          {error}
        </AuthAlert>
      )}

      {/* Submit Button */}
      <AuthButton
        type="submit"
        variant="primary"
        loading={loading}
      >
        Sign In
      </AuthButton>
    </form>
  );
}
```

---

## 🎓 Resources

### Documentation Files

1. **FORM-DESIGN-STANDARD-SOT.md** - Form component patterns
2. **AUTH-COMPONENTS-AUDIT.md** - Auth component violations
3. **AUTH-MIGRATION-PROGRESS.md** - Migration tracking
4. **COMPLETED-FORM-IMPROVEMENTS.md** - Recent improvements

### Design Token Files

- `src/design-tokens/index.ts` - Main export
- `src/design-tokens/semantic/colors.ts` - Color tokens
- `src/design-tokens/semantic/typography.ts` - Typography tokens
- `src/design-tokens/semantic/spacing.ts` - Spacing tokens
- `src/design-tokens/semantic/shadows.ts` - Shadow tokens
- `src/design-tokens/semantic/animations.ts` - Animation tokens

### Component Library

- `src/components/auth/` - Centralized auth components
- `src/components/icons/auth/` - Centralized icons
- `src/app/globals.css` - CSS classes (lines 1-921)

### Configuration

- `tailwind.config.js` - Tailwind setup with design tokens
- `tsconfig.json` - TypeScript config

---

## 📝 Changelog

### November 1, 2025
- Created comprehensive design system SOT
- Documented all violations (285 instances)
- Added migration guidelines
- Defined component standards

### October 30, 2025
- Completed auth component migration (1/6 done)
- Created form design standard
- Enhanced CSS classes with neumorphic effects

---

## ✅ Next Steps

1. **Immediate (P0)**:
   - Migrate InstantQuoteForm.tsx (30+ hardcoded colors)
   - Migrate Hero.tsx (typography + colors)
   - Migrate QuoteOptionsModal.tsx (colors)

2. **Short-term (P1)**:
   - Migrate all remaining auth components (5 pending)
   - Replace raw typography with semantic tokens
   - Centralize all form inputs

3. **Long-term (P2)**:
   - Centralize all icons
   - Add light theme support
   - Create Storybook documentation

---

**End of Design System SOT**
