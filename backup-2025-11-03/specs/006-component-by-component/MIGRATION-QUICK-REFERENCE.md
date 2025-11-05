# Component Migration Quick Reference

**Last Updated:** November 2, 2025  
**Purpose:** One-page reference to prevent auth modal issues from repeating

---

## 🚨 THE AUTH MODAL LESSON (What Went Wrong)

**Problem:** Form backgrounds showed white/wrong colors despite multiple fix attempts

**Root Causes:**
1. ❌ Light theme `.theme-card` hardcoded to white instead of using `--color-surface`
2. ❌ Created `.form-input` class but components used inline classes
3. ❌ Mixed `bg-background`, `bg-surface`, custom classes inconsistently
4. ❌ Fixed 1 of 4 modals, creating inconsistency
5. ❌ Multiple failed CSS approaches (rgba, @apply, inline styles)

**The Fix:**
1. ✅ One central class: `.form-input` with embossed style
2. ✅ One background variable: `bg-surface` (equals `--color-surface`)
3. ✅ All 3 themes use same variable structure
4. ✅ All 4 auth modals updated atomically

---

## ✅ THE 3-STEP SYSTEM (Follow This Every Time)

### STEP 1: PRE-FLIGHT (10 min)

```powershell
# System Health Check
Select-String -Path "src\app\globals.css" -Pattern "\.form-input" -Context 0,7
Select-String -Path "src\app\globals.css" -Pattern "theme-card.*background"
Select-String -Path "src\app\globals.css" -Pattern "--color-surface:"
Test-Path "src\components\ui\button.tsx"

# Component Inventory
(Select-String -Path "src\components\YourComponent.tsx" -Pattern "<button" -AllMatches).Matches.Count
(Select-String -Path "src\components\YourComponent.tsx" -Pattern "<input" -AllMatches).Matches.Count
(Select-String -Path "src\components\YourComponent.tsx" -Pattern "bg-(slate|gray|zinc)-" -AllMatches).Matches.Count

# Open Reference Components
code src\components\HeaderMenu.tsx
code src\components\HomeownerSignInModal.tsx
code src\app\globals.css
```

### STEP 2: MIGRATION (15-30 min)

```tsx
// ✅ CORRECT Patterns (Copy These)

// All modals/cards
<div className="theme-card relative w-full max-w-md p-8">

// All inputs
<input className="form-input w-full pl-11 pr-4 py-3" />

// All buttons
import Button from '@/components/ui/button';
<Button variant="primary" className="w-full py-3">Submit</Button>

// All text
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-foreground-tertiary">Placeholder text</p>
```

### STEP 3: VERIFICATION (10 min)

```powershell
# Must ALL return EMPTY/0
(Select-String -Path "src\components\YourComponent.tsx" -Pattern "<button").Matches.Count
Select-String -Path "src\components\YourComponent.tsx" -Pattern "bg-(slate|gray|zinc)-"
Select-String -Path "src\components\YourComponent.tsx" -Pattern "dark:"
Select-String -Path "src\components\YourComponent.tsx" -Pattern "(TODO|FIXME)"

# TypeScript
npx tsc --noEmit --project .

# Visual Test ALL 3 Themes
# Dark → Light → Purple
# Verify: Backgrounds match, text readable, shadows visible
```

---

## 🔴 CRITICAL RULES (Zero Tolerance)

### Rule #1: PRE-FLIGHT CHECK BEFORE STARTING
❌ Skip system check → Miss hardcoded values in globals.css → Rework  
✅ Run system check → Catch issues early → No rework

### Rule #2: USE CENTRAL CLASSES ONLY
❌ `<input className="w-full bg-surface border border-border/50..." />` (inline)  
✅ `<input className="form-input w-full pl-11 pr-4 py-3" />` (central class)

### Rule #3: TEST ALL 3 THEMES BEFORE MARKING COMPLETE
❌ Test dark only → Mark complete → Light broken → Rework  
✅ Test dark/light/purple → All work → Mark complete → No rework

### Rule #4: ATOMIC MIGRATION (100% or Nothing)
❌ Migrate 3 of 5 buttons → Inconsistent → Rework  
✅ Migrate all 5 buttons → Consistent → Done once

### Rule #5: ZERO LEGACY CODE
❌ Leave commented code, TODOs → Messy codebase  
✅ Delete all legacy → Clean, professional code

### Rule #6: COPY PATTERNS, DON'T INVENT
❌ Invent new CSS approach → Inconsistent with system  
✅ Copy from reference components → Consistent patterns

### Rule #7: PRESERVE ALL LOGIC
❌ Change hooks/handlers → Functionality breaks  
✅ Change only className → Functionality preserved

---

## 🚫 TOP 6 MISTAKES TO AVOID

### Mistake #1: Partial Migration
```tsx
// ❌ WRONG
<form className="bg-surface">  // ✅ Migrated
  <button className="bg-teal-600">Submit</button>  // ❌ NOT MIGRATED
</form>
```

### Mistake #2: Mixing Background Variables
```tsx
// ❌ WRONG (auth modal issue)
<div className="bg-background">  // #121212
  <input className="bg-surface" />  // #1A1A1A - DIFFERENT!
</div>
```

### Mistake #3: Inventing Patterns
```tsx
// ❌ WRONG - Didn't check reference
<input style={{ background: 'var(--color-surface)' }} />

// ✅ CORRECT - Copied from reference
<input className="form-input w-full pl-11 pr-4 py-3" />
```

### Mistake #4: Hardcoding Theme Values
```css
/* ❌ WRONG (light theme issue) */
:root.theme-light .theme-card {
  background: rgb(255, 255, 255);
}

/* ✅ CORRECT */
:root.theme-light .theme-card {
  background: rgb(var(--color-surface));
}
```

### Mistake #5: Skipping Theme Testing
```
❌ WRONG: Dark ✅ → Mark complete → Light broken
✅ CORRECT: Dark ✅ → Light ✅ → Purple ✅ → Mark complete
```

### Mistake #6: Leaving Legacy Code
```tsx
// ❌ WRONG
// TODO: Remove this later
// import { useTheme } from 'next-themes';

// ✅ CORRECT
// Clean code, no comments, no TODOs
```

---

## 📋 VERIFICATION COMMANDS (Copy-Paste)

```powershell
# === SYSTEM HEALTH ===
Select-String -Path "src\app\globals.css" -Pattern "\.form-input" -Context 0,7
Select-String -Path "src\app\globals.css" -Pattern "theme-card.*background"

# === COMPONENT VERIFICATION ===
$component = "src\components\YourComponent.tsx"

# Zero native elements
(Select-String -Path $component -Pattern "<button").Matches.Count  # Expected: 0

# Zero hardcoded colors
Select-String -Path $component -Pattern "bg-(slate|gray|zinc)-"  # Expected: EMPTY
Select-String -Path $component -Pattern "text-(slate|gray)-"     # Expected: EMPTY
Select-String -Path $component -Pattern "dark:"                   # Expected: EMPTY

# Zero legacy
Select-String -Path $component -Pattern "(TODO|FIXME|HACK)"      # Expected: EMPTY
Select-String -Path $component -Pattern "@storybook|chromatic"   # Expected: EMPTY

# TypeScript
npx tsc --noEmit --project .  # Expected: 0 errors

# Central classes used
Select-String -Path $component -Pattern "(form-input|theme-card|Button)"  # Expected: FOUND
```

---

## 🎯 ONE-PAGE WORKFLOW

```
┌─────────────────────────────────────────────────┐
│ 1. PRE-FLIGHT (10 min)                         │
│    ├─ System health check                      │
│    ├─ Component inventory                      │
│    ├─ Open reference components                │
│    └─ Logic audit                              │
├─────────────────────────────────────────────────┤
│ 2. MIGRATION (15-30 min)                       │
│    ├─ Replace ALL buttons → Button             │
│    ├─ Replace ALL inputs → form-input          │
│    ├─ Replace hardcoded colors → tokens        │
│    ├─ Remove ALL dark: prefixes                │
│    ├─ Remove ALL legacy code                   │
│    └─ Preserve ALL logic                       │
├─────────────────────────────────────────────────┤
│ 3. VERIFICATION (10 min)                       │
│    ├─ Zero native elements (grep)              │
│    ├─ Zero hardcoded colors (grep)             │
│    ├─ Zero dark: prefixes (grep)               │
│    ├─ Zero legacy code (grep)                  │
│    ├─ TypeScript compiles                      │
│    ├─ Visual test (3 themes)                   │
│    ├─ Functional test (all interactions)       │
│    └─ Central classes verified                 │
├─────────────────────────────────────────────────┤
│ 4. COMMIT                                       │
│    ├─ User approval                            │
│    └─ Mark task complete                       │
└─────────────────────────────────────────────────┘

Total: 35-50 min/component
Success: 100% (if checklist followed)
Rework: 0% (atomic migration)
```

---

## 🔥 PRINT THIS & KEEP VISIBLE

**Before starting ANY component:**
1. ✅ Run system health check (5 min)
2. ✅ Count elements to migrate (2 min)
3. ✅ Open reference components (1 min)
4. ✅ Identify logic to preserve (2 min)

**After migration:**
1. ✅ Verify zero native elements
2. ✅ Verify zero hardcoded colors
3. ✅ Verify zero legacy code
4. ✅ Test all 3 themes
5. ✅ Test all interactions

**If ANY check fails:** Fix and re-run ALL checks.

**Never commit without:** User approval + ALL checks passing.
