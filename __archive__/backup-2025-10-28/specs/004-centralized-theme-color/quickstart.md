# Quick Start Guide: Using the Centralized Design Token System

**Audience**: Developers working on the SolarMatch application  
**Prerequisites**: Basic understanding of Tailwind CSS and TypeScript  
**Estimated Time**: 15 minutes to read, 30 minutes to practice

---

## Overview

This guide teaches you how to use the centralized design token system to build and style components consistently across the SolarMatch application.

**What are Design Tokens?**  
Design tokens are named variables for design values (colors, spacing, typography) stored in a central location. Instead of hardcoding `bg-teal-600` everywhere, you use `bg-primary`, which can be changed globally.

**Benefits**:
- ✅ **Instant rebranding**: Change primary color in 1 file, updates 200+ components
- ✅ **Consistent theming**: Automatic light/dark mode support
- ✅ **Type safety**: TypeScript catches typos at compile time
- ✅ **Responsive by default**: Semantic tokens adapt to mobile/tablet/desktop

---

## 1. Using Color Tokens

### Semantic Color Classes (Use These)

```tsx
// ✅ CORRECT - Use semantic tokens
<button className="bg-primary hover:bg-primary-hover text-white">
  Primary Button
</button>

<div className="bg-success text-white">
  Success Message
</div>

<p className="text-muted">
  Muted text (secondary information)
</p>
```

### Available Color Tokens

| Token | Purpose | Tailwind Class | Example |
|-------|---------|----------------|---------|
| `primary` | Main brand color | `bg-primary`, `text-primary` | Primary buttons, links |
| `primary-hover` | Primary hover state | `hover:bg-primary-hover` | Button hover |
| `secondary` | Secondary brand color | `bg-secondary` | Secondary buttons |
| `success` | Success state | `bg-success`, `text-success` | Success messages, badges |
| `warning` | Warning state | `bg-warning`, `text-warning` | Warning messages |
| `error` | Error state | `bg-error`, `text-error` | Error messages, validation |
| `info` | Info state | `bg-info` | Info messages |
| `background` | Page background | `bg-background` | Main page background |
| `background-alt` | Alternate background | `bg-background-alt` | Sections, panels |
| `surface` | Surface background | `bg-surface` | Cards, modals |
| `foreground` | Primary text color | `text-foreground` | Body text |
| `muted` | Secondary text color | `text-muted` | Captions, labels |
| `border` | Border color | `border-border` | Input borders, dividers |
| `border-focus` | Focus border | `focus:border-border-focus` | Input focus state |

### Dark Mode Support

```tsx
// Automatic dark mode (uses .DEFAULT value)
<div className="bg-primary text-white">
  Primary background (same in light/dark)
</div>

// Manual dark mode (specify dark variant)
<div className="bg-background dark:bg-gray-900 text-foreground dark:text-gray-50">
  Background adapts to theme
</div>
```

### ❌ Avoid Hardcoded Colors

```tsx
// ❌ WRONG - Hardcoded color
<button className="bg-teal-600 hover:bg-teal-700">Button</button>

// ❌ WRONG - Hex code
<div style={{ backgroundColor: '#0d9488' }}>Content</div>

// ✅ CORRECT - Semantic token
<button className="bg-primary hover:bg-primary-hover">Button</button>
```

---

## 2. Using Typography Tokens

### Semantic Typography Classes

```tsx
// HEADINGS
<h1 className="text-heading-1">Main Page Title</h1>
<h2 className="text-heading-2">Section Title</h2>
<h3 className="text-heading-3">Subsection Title</h3>
<h4 className="text-heading-4">Card Title</h4>

// BODY TEXT
<p className="text-body">Regular paragraph text (14px mobile, 16px desktop)</p>
<p className="text-body-large">Emphasized paragraph (larger)</p>
<p className="text-body-small">De-emphasized paragraph (smaller)</p>

// CAPTIONS & LABELS
<small className="text-caption text-muted">Small caption or timestamp</small>
<label className="text-label">Form label (medium weight)</label>

// BUTTONS
<button className="text-button">Button text (semibold, wide letter-spacing)</button>
```

### Available Typography Tokens

| Token | Size (Mobile → Desktop) | Weight | Use Case |
|-------|-------------------------|--------|----------|
| `text-heading-1` | 24px → 36px | Bold | Page titles |
| `text-heading-2` | 20px → 30px | Bold | Section titles |
| `text-heading-3` | 18px → 24px | Semibold | Subsection titles |
| `text-heading-4` | 16px → 20px | Semibold | Card titles |
| `text-body` | 14px → 16px | Normal | Paragraph text |
| `text-body-large` | 16px → 18px | Normal | Emphasized text |
| `text-body-small` | 14px | Normal | De-emphasized text |
| `text-caption` | 12px | Normal | Captions, timestamps |
| `text-label` | 14px | Medium | Form labels |
| `text-button` | 14px → 16px | Semibold | Button text |

### Typography Best Practices

```tsx
// ✅ CORRECT - Semantic + color token
<h1 className="text-heading-1 text-foreground">Title</h1>

// ✅ CORRECT - Responsive typography (auto-scales)
<p className="text-body text-muted">
  This text is 14px on mobile, 16px on desktop
</p>

// ❌ WRONG - Hardcoded size
<h1 className="text-2xl font-bold">Title</h1>
```

---

## 3. Using Spacing Tokens

### Semantic Responsive Spacing (Auto-Responsive)

```tsx
// CARD PADDING (12px mobile → 24px desktop)
<div className="p-card-padding rounded-card shadow-card">
  Card content with responsive padding
</div>

// FORM GAP (12px mobile → 20px desktop)
<form className="space-y-form-gap">
  <input />
  <input />
  <input />
</form>

// SECTION MARGIN (24px mobile → 48px desktop)
<section className="mt-section-margin">
  Section with responsive top margin
</section>

// BUTTON PADDING (responsive X/Y)
<button className="px-button-padding-x py-button-padding-y rounded-button">
  Responsive button padding
</button>
```

### Explicit Responsive Spacing (Manual Breakpoints)

```tsx
// Mobile-specific
<div className="p-mobile-md">12px padding (mobile only)</div>

// Desktop-specific
<div className="p-desktop-lg">24px padding (desktop only)</div>

// Hybrid (mobile → desktop)
<div className="p-mobile-md lg:p-desktop-lg">
  12px mobile, 24px desktop
</div>
```

### Available Spacing Tokens

**Semantic (Auto-Responsive)**:
- `p-card-padding` / `m-card-padding` - Card padding/margin
- `p-modal-padding` / `m-modal-padding` - Modal padding/margin
- `space-y-form-gap` / `gap-form-gap` - Form gap
- `mt-section-margin` / `mb-section-margin` - Section margin
- `mb-heading-margin` - Heading bottom margin
- `px-button-padding-x` / `py-button-padding-y` - Button padding

**Explicit Mobile**:
- `p-mobile-xs` (4px), `p-mobile-sm` (8px), `p-mobile-md` (12px), `p-mobile-lg` (16px), `p-mobile-xl` (20px)

**Explicit Desktop**:
- `p-desktop-xs` (8px), `p-desktop-sm` (12px), `p-desktop-md` (16px), `p-desktop-lg` (24px), `p-desktop-xl` (32px), `p-desktop-2xl` (48px)

### Spacing Best Practices

```tsx
// ✅ CORRECT - Semantic responsive (preferred for common patterns)
<div className="p-card-padding space-y-form-gap">
  <input />
  <input />
</div>

// ✅ CORRECT - Explicit responsive (for custom spacing)
<div className="p-mobile-sm lg:p-desktop-md">
  Custom responsive padding
</div>

// ❌ WRONG - Hardcoded (not responsive)
<div className="p-6">Hardcoded 24px padding</div>
```

---

## 4. Using Shadow & Border Tokens

### Shadow (Elevation)

```tsx
// CARD ELEVATION
<div className="shadow-card rounded-card">
  Card with elevation
</div>

// MODAL ELEVATION
<div className="shadow-modal rounded-modal">
  Modal with higher elevation
</div>

// DROPDOWN ELEVATION
<div className="shadow-dropdown rounded-card">
  Dropdown with medium elevation
</div>

// BUTTON HOVER ELEVATION
<button className="shadow-button hover:shadow-card">
  Button with hover elevation
</button>

// FOCUS RING
<input className="focus:shadow-focus focus:outline-none" />
```

### Border Radius

```tsx
// CARD RADIUS
<div className="rounded-card">12px border radius</div>

// BUTTON RADIUS
<button className="rounded-button">8px border radius</button>

// INPUT RADIUS
<input className="rounded-input" />

// MODAL RADIUS
<div className="rounded-modal">16px border radius</div>

// BADGE RADIUS
<span className="rounded-badge">Perfect circle (9999px)</span>
```

---

## 5. Using Animation Tokens

### Transition Classes

```tsx
// COLOR TRANSITION
<button className="bg-primary hover:bg-primary-hover transition-colors">
  Smooth color transition
</button>

// OPACITY TRANSITION
<div className="opacity-0 hover:opacity-100 transition-opacity">
  Fade in on hover
</div>

// TRANSFORM TRANSITION
<div className="scale-100 hover:scale-105 transition-transform">
  Scale up on hover
</div>

// ALL PROPERTIES
<div className="transition-all hover:shadow-card">
  Transition everything
</div>
```

### Animation Classes

```tsx
// FADE IN
<div className="animate-fade-in">
  Fades in when rendered
</div>

// SLIDE IN UP
<div className="animate-slide-in-up">
  Slides up and fades in
</div>
```

---

## 6. Complete Component Examples

### Example 1: Primary Button

```tsx
const PrimaryButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-primary hover:bg-primary-hover
        text-white text-button
        px-button-padding-x py-button-padding-y
        rounded-button shadow-button hover:shadow-card
        transition-all
        focus:shadow-focus focus:outline-none
      "
    >
      {children}
    </button>
  );
};
```

### Example 2: Card Component

```tsx
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-surface p-card-padding rounded-card shadow-card space-y-form-gap">
      <h3 className="text-heading-3 text-foreground mb-heading-margin">
        {title}
      </h3>
      <div className="text-body text-muted">
        {children}
      </div>
    </div>
  );
};
```

### Example 3: Form with Status Message

```tsx
const QuoteForm = () => {
  return (
    <form className="bg-surface p-card-padding rounded-card shadow-card space-y-form-gap">
      <h2 className="text-heading-2 text-foreground mb-heading-margin">
        Request a Quote
      </h2>
      
      <div>
        <label className="text-label text-foreground">Name</label>
        <input
          type="text"
          className="
            w-full p-mobile-md lg:p-desktop-sm
            border border-border focus:border-border-focus
            rounded-input focus:shadow-focus focus:outline-none
            text-body text-foreground
            transition-all
          "
        />
      </div>
      
      <div className="bg-success text-white p-mobile-md rounded-card">
        <p className="text-body">
          ✓ Quote request submitted successfully!
        </p>
      </div>
      
      <button
        type="submit"
        className="
          w-full bg-primary hover:bg-primary-hover
          text-white text-button
          py-button-padding-y rounded-button
          shadow-button hover:shadow-card
          transition-all
        "
      >
        Submit Request
      </button>
    </form>
  );
};
```

---

## 7. Chart Color Integration (Recharts)

### Using the `useChartColors` Hook

```tsx
import { useChartColors } from '@/hooks/useChartColors';
import { BarChart, Bar, LineChart, Line } from 'recharts';

const DashboardChart = () => {
  const chartColors = useChartColors(); // Theme-aware chart colors
  
  const data = [
    { month: 'Jan', leads: 45, quotes: 30 },
    { month: 'Feb', leads: 52, quotes: 38 },
    { month: 'Mar', leads: 61, quotes: 42 },
  ];
  
  return (
    <div className="bg-surface p-card-padding rounded-card shadow-card">
      <h3 className="text-heading-3 mb-heading-margin">Lead Activity</h3>
      <BarChart width={600} height={300} data={data}>
        <Bar dataKey="leads" fill={chartColors.primary} />
        <Bar dataKey="quotes" fill={chartColors.secondary} />
      </BarChart>
    </div>
  );
};
```

### Available Chart Colors

```typescript
const chartColors = useChartColors();

// chartColors.primary    - Primary brand color
// chartColors.secondary  - Secondary brand color
// chartColors.tertiary   - Tertiary color (blue)
// chartColors.success    - Success green
// chartColors.warning    - Warning yellow
// chartColors.error      - Error red
```

---

## 8. Migration Workflow (Refactoring Existing Code)

### Step-by-Step Refactoring

**Before** (Hardcoded):
```tsx
<div className="bg-teal-600 p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
  <p className="text-sm text-gray-100">Welcome back!</p>
  <button className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-md mt-4">
    View Leads
  </button>
</div>
```

**After** (Token-Based):
```tsx
<div className="bg-primary p-card-padding rounded-card shadow-card">
  <h2 className="text-heading-2 text-white mb-heading-margin">Dashboard</h2>
  <p className="text-body-small text-white">Welcome back!</p>
  <button className="bg-secondary hover:bg-secondary-hover text-white px-button-padding-x py-button-padding-y rounded-button mt-form-gap">
    View Leads
  </button>
</div>
```

### Migration Checklist (Per Component)

- [ ] Replace color classes: `bg-teal-600` → `bg-primary`
- [ ] Replace typography: `text-2xl font-bold` → `text-heading-2`
- [ ] Replace spacing: `p-6` → `p-card-padding`
- [ ] Replace shadows: `shadow-lg` → `shadow-card`
- [ ] Replace border radius: `rounded-lg` → `rounded-card`
- [ ] Test in Storybook (all themes, all breakpoints)
- [ ] Run Chromatic visual regression
- [ ] Manual QA checklist (themes, responsive, states)
- [ ] Commit with clear message

---

## 9. Common Patterns

### Pattern 1: Dashboard Card

```tsx
<div className="bg-surface p-card-padding rounded-card shadow-card space-y-form-gap">
  <h3 className="text-heading-3 text-foreground">Card Title</h3>
  <p className="text-body text-muted">Card description</p>
  <button className="bg-primary hover:bg-primary-hover text-white px-button-padding-x py-button-padding-y rounded-button">
    Action
  </button>
</div>
```

### Pattern 2: Status Badge

```tsx
// Success badge
<span className="inline-block bg-success text-white text-caption px-mobile-md py-mobile-xs rounded-badge">
  Active
</span>

// Warning badge
<span className="inline-block bg-warning text-white text-caption px-mobile-md py-mobile-xs rounded-badge">
  Pending
</span>

// Error badge
<span className="inline-block bg-error text-white text-caption px-mobile-md py-mobile-xs rounded-badge">
  Rejected
</span>
```

### Pattern 3: Form Input

```tsx
<div className="space-y-mobile-sm">
  <label className="text-label text-foreground">Email</label>
  <input
    type="email"
    className="
      w-full p-mobile-md lg:p-desktop-sm
      border border-border focus:border-border-focus
      rounded-input focus:shadow-focus focus:outline-none
      text-body text-foreground
      transition-all
    "
  />
  <p className="text-caption text-muted">We'll never share your email</p>
</div>
```

---

## 10. Troubleshooting

### Issue: "Class not found" error

**Cause**: Tailwind not recognizing custom token class.

**Fix**:
1. Verify token imported in `tailwind.config.js`
2. Restart dev server: `npm run dev`
3. Check class name spelling

### Issue: Dark mode not working

**Cause**: Missing `.dark` class or missing `dark:` prefix.

**Fix**:
1. Ensure ThemeProvider adds `.dark` class to `<html>`
2. Use explicit dark mode: `bg-primary dark:bg-teal-400`

### Issue: Spacing not responsive

**Cause**: Using explicit token instead of semantic.

**Fix**:
- Use semantic: `p-card-padding` (auto-responsive)
- Or explicit: `p-mobile-md lg:p-desktop-lg` (manual breakpoints)

---

## 11. Next Steps

1. **Practice**: Refactor one component using this guide
2. **Review**: Check refactored component in Storybook
3. **Test**: Verify all themes, states, and breakpoints
4. **Ask**: If stuck, refer to `data-model.md` for full token schemas

**Happy Coding! 🚀**
