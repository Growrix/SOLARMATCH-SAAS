# BUTTON COMPONENT AUDIT - COMPLETE
**Date**: November 8, 2025  
**Auditor**: AI Assistant  
**Source**: globals.css + src/components/ui/button.tsx + codebase scan

---

## REAL BUTTON COMPONENT (src/components/ui/button.tsx)

### Button Component Props:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline' | 'minimal' | 'destructive'
- `withArrow`: boolean (optional)
- `className`: string (optional)

### Base Classes (ALL buttons):
```
inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-background focus:ring-accent whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
```

### Variant Classes:

#### 1. **Primary Button** (`variant="primary"`)
**Classes**:
```
border border-accent bg-transparent text-accent shadow-neu-outset-sm hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]
```
**Usage**: Main CTA buttons, primary actions
**Used In**: Homepage hero, signup forms, main action buttons

---

#### 2. **Secondary Button** (`variant="secondary"`)
**Classes**:
```
bg-background text-muted-foreground shadow-neu-outset-sm hover:text-foreground hover:shadow-neu-inset-sm active:shadow-neu-inset-sm active:scale-[0.98]
```
**Usage**: Secondary actions, cancel buttons
**Used In**: Modals, forms (secondary actions)

---

#### 3. **Ghost Button** (`variant="ghost"`)
**Classes**:
```
bg-transparent text-foreground hover:bg-background/80 hover:shadow-neu-outset-sm active:shadow-neu-inset-sm active:scale-[0.98] border-none
```
**Usage**: Subtle actions, inline buttons
**Used In**: Navigation, subtle CTAs

---

#### 4. **Outline Button** (`variant="outline"`)
**Classes**:
```
border-2 border-border bg-transparent shadow-neu-outset-sm text-foreground hover:text-accent active:shadow-neu-inset-sm active:scale-[0.98]
```
**Usage**: Outlined actions, alternative CTAs
**Used In**: Cards, alternative actions

---

#### 5. **Minimal Button** (`variant="minimal"`)
**Classes**:
```
bg-transparent text-foreground hover:text-accent transition-colors shadow-none border-none hover:bg-accent/5 active:scale-[0.98] px-4 py-2
```
**Usage**: Minimal actions, table actions, subtle buttons
**Used In**: QuoteBuilderModal, table row actions, modals

---

#### 6. **Destructive Button** (`variant="destructive"`)
**Classes**:
```
bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 active:scale-[0.98]
```
**Usage**: Delete actions, dangerous operations
**Used In**: Delete confirmations, critical actions

---

## CUSTOM DASHBOARD BUTTONS (globals.css)

### 7. **Dashboard Action Button** (`.dashboard-header__action-btn`)
**Classes**: CUSTOM CLASS (defined in globals.css)
```css
p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors duration-fast shadow-neu-inset hover:shadow-neu-outset-sm
```
**Usage**: Header action buttons (search, help, notifications)
**Used In**: AdminHeader, InstallerDashboardHeader, HomeownerDashboard header

---

### 8. **Dashboard Collapse Button** (`.dashboard-collapse-btn`)
**Classes**: CUSTOM CLASS (defined in globals.css)
```css
p-2 rounded-lg bg-surface text-muted-foreground hover:text-primary transition-all duration-300 shadow-neu-inset hover:shadow-neu-outset
```
**Usage**: Sidebar collapse toggle
**Used In**: AdminSidebar, InstallerSidebar, HomeownerSidebar

---

### 9. **Dashboard Collapse Button (Floating)** (`.dashboard-collapse-btn--floating`)
**Classes**: CUSTOM CLASS (defined in globals.css)
```css
fixed top-4 h-8 w-8 flex items-center justify-center rounded-full bg-surface text-primary shadow-neu-inset border border-border transition-all duration-200
```
**Usage**: Floating collapse button when sidebar is collapsed
**Used In**: AdminSidebar, InstallerSidebar (mobile/collapsed state)

---

### 10. **Mobile Sidebar Close Button** (`.dashboard-sidebar-mobile-close-btn`)
**Classes**: CUSTOM CLASS (defined in globals.css)
```css
p-2 rounded-lg hover:bg-surface transition-colors text-muted-foreground hover:text-foreground
```
**Usage**: Close button for mobile sidebar
**Used In**: Mobile sidebars (all dashboards)

---

## RAW TAILWIND BUTTON PATTERNS (No Component)

### 11. **Quote Distribution Modal Confirm Button**
**Classes**:
```
bg-primary text-white px-6 py-3 rounded-full shadow-neu-outset hover:shadow-neu-outset-lg transition-all
```
**Used In**: Quote Distribution Modal (admin)

---

### 12. **Quote Distribution Modal Count Selector**
**Classes**:
```
w-10 h-10 rounded-xl bg-surface text-foreground shadow-neu-inset hover:shadow-neu-outset transition-all font-bold text-lg
```
**Used In**: Quote Distribution Modal (increment/decrement buttons)

---

### 13. **Homeowner Dashboard Filter Tab**
**Classes**:
```
px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all
// Active: bg-primary/10 text-primary shadow-neu-inset
// Inactive: text-muted-foreground hover:bg-surface hover:text-primary hover:shadow-neu-outset-sm
```
**Used In**: Homeowner Dashboard (All/Active/Past tabs)

---

### 14. **Custom Toggle Switch** (QuoteBuilderModal)
**Classes**:
```
relative inline-flex h-5 w-9 items-center rounded-full transition-colors
// On: bg-primary
// Off: bg-border
```
**Used In**: QuoteBuilderModal (View Mode Toggle)

---

## SUMMARY

### Total Button Patterns Found: **14**

### Breakdown:
- **Button Component Variants**: 6 (primary, secondary, ghost, outline, minimal, destructive)
- **Custom Dashboard Classes**: 4 (action-btn, collapse-btn, collapse-btn--floating, mobile-close-btn)
- **Raw Tailwind Patterns**: 4 (modal confirm, count selector, filter tab, toggle switch)

### Key Findings:
1. **Button component** (`src/components/ui/button.tsx`) is the SOURCE OF TRUTH for standard buttons
2. **Dashboard-specific buttons** use custom semantic classes defined in globals.css
3. **Modal/specialized buttons** use raw Tailwind classes (no component abstraction)
4. **NO fake patterns were used in the codebase** - all patterns above are REAL and AUDITED

---

## RECOMMENDATIONS

1. **Component Library should ONLY include these 14 patterns**
2. **Do NOT create fake button patterns** (e.g., "Primary Button" with made-up classes)
3. **Reference Button component for standard buttons** (not raw Tailwind)
4. **Document custom dashboard classes** separately from Button component variants
5. **Include usage examples from actual codebase** (not mock examples)

---

## FILES AUDITED:
- `src/app/globals.css` (lines 1-1572)
- `src/components/ui/button.tsx` (lines 1-41)
- `src/components/admin/*` (button usage audit)
- `src/components/homeowner/*` (button usage audit)
- `src/components/installer/*` (button usage audit)
