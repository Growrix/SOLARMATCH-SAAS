# Migration Pain Points Audit & Process Enhancement
**Date**: November 3, 2025  
**Audit Scope**: InstantQuoteForm & RebateCalculator Migration (Phase 6)  
**Purpose**: Learn from struggles, enhance migration process to prevent future issues

---

## 🔍 EXECUTIVE SUMMARY

Despite having comprehensive `tasks.md` and `DESIGN-SYSTEM-SOT.md`, the InstantQuoteForm and RebateCalculator migrations revealed **critical gaps** in our migration process. This audit identifies **12 major pain points** and proposes **8 systematic enhancements** to prevent similar issues in future migrations.

**Key Finding**: Our documentation was *comprehensive but not preventive*. We documented *what to do* but not *how to detect problems early* or *what specific patterns cause issues*.

---

## 📊 PAIN POINTS ANALYSIS

### Category A: Theme Adaptation Issues (Most Critical)

#### Pain Point 1: Hardcoded Colors in Charts
**What Happened:**
- Financial Projections chart showed **orange bars** in both dark and light themes
- Color was hardcoded in `useChartColors` hook using design tokens (`#FF6B00`)
- User reported: "there should be no orange, maybe it is hardcoded"

**Root Cause:**
- Hook was reading from static design tokens instead of CSS variables
- Design tokens returned orange for "primary" color, but CSS variables define primary as white (dark) / black (light)

**Migration Impact:**
- Required complete rewrite of `useChartColors.ts` (100+ lines)
- Added React state management and `useEffect` for theme changes
- Created new utility functions (`rgbToHex`, `getCSSVariable`)

**Why Tasks.md Didn't Prevent This:**
- ❌ No specific check for chart components
- ❌ No mention of Recharts or data visualization theme adaptation
- ❌ No verification command to detect hardcoded colors in hooks

#### Pain Point 2: Dropdown Styling Applied to Text Inputs
**What Happened:**
- Postcode and Location fields showed **dropdown arrows** despite being `<input>` fields
- User reported: "these 2 fields are not dropdown, remove the down arrow"

**Root Cause:**
- `.form-select` class applies dropdown SVG background to ANY element
- Components used same class for both `<select>` and `<input>` elements

**Migration Impact:**
- Had to audit all input fields to distinguish text vs select
- Created separate styling for text inputs using inline Tailwind classes
- Broke consistency by having some inputs use classes, others use inline styles

**Why Tasks.md Didn't Prevent This:**
- ❌ No distinction between input types in migration checklist
- ❌ `.form-select` class documentation didn't warn about input-only usage
- ❌ No verification command to check for misapplied classes

#### Pain Point 3: Result Cards Not Matching Neumorphic Theme
**What Happened:**
- Multiple report iterations: "Financial Projections has visibility issues", "cards showing different colors not in theme"
- Result cards (Cost Breakdown, System Specs, Energy Performance) used dark greys instead of theme colors

**Root Cause:**
- Cards used hardcoded Tailwind classes (`bg-gray-800`, `text-gray-300`)
- Semantic classes existed in `globals.css` but weren't being used

**Migration Impact:**
- Required 5+ iterative fixes to audit and replace all card classes
- Had to enhance neumorphic design for multiple card types
- Multiple user reports before complete fix

**Why Tasks.md Didn't Prevent This:**
- ❌ No specific checklist for result cards / data display components
- ❌ Generic "replace hardcoded colors" instruction too vague
- ❌ No example of what "proper neumorphic design" looks like for cards

---

### Category B: CSS Variable System Issues

#### Pain Point 4: Confusion Between Design Tokens and CSS Variables
**What Happened:**
- `useChartColors` hook imported from `@/design-tokens` instead of reading CSS variables
- Multiple components mixed design token imports with Tailwind classes

**Root Cause:**
- Two parallel systems: design-tokens (TypeScript) and CSS variables (globals.css)
- No clear guidance on when to use which system
- Design tokens contained hardcoded values that didn't adapt to theme

**Migration Impact:**
- Had to rewrite entire hook to use `getComputedStyle` instead of imports
- SSR compatibility concerns with browser-only APIs

**Why Tasks.md Didn't Prevent This:**
- ❌ No section explaining the relationship between design tokens and CSS variables
- ❌ No rule: "Charts and dynamic colors MUST use CSS variables, not design tokens"
- ❌ No warning about SSR compatibility for client-side color reading

#### Pain Point 5: Missing CSS Variables for Common Use Cases
**What Happened:**
- Chart needed `--color-primary` but CSS variables didn't have chart-specific colors
- Had to fall back to using status colors (success, warning, error) for chart data

**Root Cause:**
- CSS variable system designed for UI components, not data visualization
- No chart color palette defined in theme system

**Migration Impact:**
- Had to add fallback logic in `useChartColors`
- Inconsistent color usage across different chart types

**Why Tasks.md Didn't Prevent This:**
- ❌ No audit of CSS variable completeness before migration started
- ❌ No requirement to define all semantic colors upfront

---

### Category C: Class Naming and Organization Issues

#### Pain Point 6: Semantic Class Discovery Problem
**What Happened:**
- Multiple classes existed in `globals.css` (`.detail-card`, `.cost-item`, `.spec-card`) but components didn't use them
- Had to manually audit globals.css to find which classes existed

**Root Cause:**
- No centralized registry of available semantic classes
- Class names not descriptive enough to discover by searching

**Migration Impact:**
- Wasted time recreating styles that already existed
- Inconsistent class usage across components

**Why Tasks.md Didn't Prevent This:**
- ❌ No "Available Semantic Classes" reference section
- ❌ No grep command to list all semantic classes in globals.css
- ❌ No naming convention documentation

#### Pain Point 7: Overlapping Class Purposes
**What Happened:**
- Both `.theme-card` and `.detail-card` could apply to result cards
- Confusion about which class to use where

**Root Cause:**
- Class hierarchy not documented
- No clear rule: base class (theme-card) vs specific class (detail-card)

**Migration Impact:**
- Trial-and-error to find right class combination
- Multiple commits to fix wrong class usage

**Why Tasks.md Didn't Prevent This:**
- ❌ No class hierarchy diagram
- ❌ No "when to use which class" decision tree

---

### Category D: Verification and Testing Gaps

#### Pain Point 8: No Pre-Migration Health Check
**What Happened:**
- Started migration without verifying foundation was solid
- Discovered CSS variable issues mid-migration

**Root Cause:**
- Tasks.md had "System Health Check" but it ran AFTER migration started
- No gate to prevent migration if foundation is broken

**Migration Impact:**
- Had to fix foundation issues while mid-migration
- Created confusion: "Is this component broken or is the system broken?"

**Why Tasks.md Didn't Prevent This:**
- ❌ Health check was buried in middle of tasks, not a gate
- ❌ No STOP signal if health check fails

#### Pain Point 9: Iterative Screenshot Debugging
**What Happened:**
- User had to take screenshots multiple times to report color issues
- Agent couldn't detect visual issues without screenshots

**Root Cause:**
- No automated visual regression testing
- Manual QA only method to catch theme issues

**Migration Impact:**
- Slow feedback loop: code → test → screenshot → report → fix → repeat
- Multiple back-and-forth iterations for same component

**Why Tasks.md Didn't Prevent This:**
- ❌ Visual regression testing (Chromatic) mentioned but not enforced
- ❌ No requirement to test all themes before marking task complete

#### Pain Point 10: No Runtime Error Detection Strategy
**What Happened:**
- `resolvedTheme is not defined` error appeared at runtime
- Error was in a hook, not caught until component rendered

**Root Cause:**
- No build-time type checking for theme-related code
- No error boundary to catch theme system failures

**Migration Impact:**
- Production-breaking bug got through
- Had to add defensive checks after the fact

**Why Tasks.md Didn't Prevent This:**
- ❌ No requirement to add error boundaries for theme-critical components
- ❌ No ESLint rule to catch undefined variable access

---

### Category E: Documentation and Communication Issues

#### Pain Point 11: Generic Instructions for Specific Problems
**What Happened:**
- Tasks.md said "replace hardcoded colors" but didn't define what counts as hardcoded
- Example: Is `fill={chartColors.primary}` hardcoded if chartColors comes from a hook?

**Root Cause:**
- Instructions were principles-based, not pattern-based
- No concrete "bad code" vs "good code" examples

**Migration Impact:**
- Had to reverse-engineer correct patterns from reference components
- Multiple attempts before getting it right

**Why Tasks.md Didn't Prevent This:**
- ❌ No "Common Mistakes" section with anti-patterns
- ❌ No side-by-side before/after code examples for charts

#### Pain Point 12: No Component-Type-Specific Guidance
**What Happened:**
- InstantQuoteForm has: forms, charts, result cards, metrics, tooltips
- Generic migration guide didn't cover these diverse component types

**Root Cause:**
- Tasks.md treated all components as "forms and buttons"
- No specialized guidance for complex components

**Migration Impact:**
- Had to invent solutions for charts on the fly
- No reference for "how to migrate a chart component"

**Why Tasks.md Didn't Prevent This:**
- ❌ No component taxonomy (Form, Chart, Card, Modal, etc.)
- ❌ No type-specific migration guides

---

## 🔧 PROPOSED ENHANCEMENTS

### Enhancement 1: Pre-Migration Gate System

**Problem Solved:** Pain Points 8 (no health check), 4 (system confusion)

**Add to tasks.md:**

```markdown
## 🚨 GATE 0: PRE-MIGRATION HEALTH CHECK (MANDATORY)

**Run BEFORE starting ANY component migration. If ANY check fails, STOP and fix the system first.**

### Check 1: CSS Variables Foundation
\`\`\`powershell
# Verify all themes have required variables
Select-String -Path "src\app\globals.css" -Pattern "--color-(primary|surface|foreground|border):" | Measure-Object
# Expected: 12 matches (4 vars × 3 themes)
\`\`\`

### Check 2: Semantic Classes Catalog
\`\`\`powershell
# Generate list of available semantic classes
Select-String -Path "src\app\globals.css" -Pattern "^\s*\.[a-z-]+\s*{" | ForEach-Object { $_.Line.Trim() } | Sort-Object -Unique > DOC\semantic-classes-catalog.txt
# Expected: File created with 20+ classes
\`\`\`

### Check 3: Reference Components Exist
\`\`\`powershell
# Verify migration templates are available
Test-Path "src\components\HeaderMenu.tsx"
Test-Path "src\components\InstallerSignupModal.tsx"
# Expected: All True
\`\`\`

### Check 4: Chart Colors Use CSS Variables
\`\`\`powershell
# Verify chart hook reads from CSS variables, not design tokens
Select-String -Path "src\hooks\useChartColors.ts" -Pattern "getComputedStyle|getCSSVariable"
# Expected: At least 1 match
# ❌ If matches "colors.chart.primary": HOOK NEEDS UPDATE
\`\`\`

**❌ IF ANY CHECK FAILS:**
1. DO NOT start component migration
2. Open issue in tasks.md: "BLOCKER: [Check Name] Failed"
3. Fix system issue first
4. Re-run all checks
5. Only proceed when ALL checks pass
```

---

### Enhancement 2: Component Type Taxonomy

**Problem Solved:** Pain Points 12 (no type-specific guidance), 11 (generic instructions)

**Add to DESIGN-SYSTEM-SOT.md:**

```markdown
## 📦 Component Type Taxonomy & Migration Patterns

### Type 1: Form Components
**Characteristics:** Input fields, dropdowns, checkboxes, buttons  
**Examples:** InstallerSignupModal, HomeownerSignInModal  
**Migration Pattern:**
- All `<input>` → `.form-input` class OR inline Tailwind with `bg-surface`
- All `<select>` → `.form-select` class
- All `<button>` → `<Button>` component
- Labels use `text-subtle` or `text-foreground` (no hardcoded)

**Reference Components:**
- ✅ `InstallerSignupModal.tsx` - Multi-step form
- ✅ `HomeownerSignInModal.tsx` - Auth form with social login

---

### Type 2: Data Visualization Components (NEW)
**Characteristics:** Charts, graphs, data cards with dynamic colors  
**Examples:** SavingsChart, FinancialProjections  
**Migration Pattern:**
- Chart colors MUST use `useChartColors` hook (reads CSS variables)
- NO design token imports (`@/design-tokens`)
- Chart background uses `bg-surface`
- Grid/axis colors use semantic tokens (grid, axis, text from hook)

**Critical Rules:**
1. ❌ NEVER `import { colors } from '@/design-tokens'` in chart components
2. ✅ ALWAYS `const chartColors = useChartColors()` for theme-adaptive colors
3. ✅ Verify hook uses `getComputedStyle` not static values

**Code Example:**
\`\`\`tsx
// ❌ WRONG - Hardcoded colors
<Bar dataKey="value" fill="#FF6B00" />

// ✅ CORRECT - Theme-adaptive
const chartColors = useChartColors();
<Bar dataKey="value" fill={chartColors.primary} />
\`\`\`

**Verification:**
\`\`\`powershell
# No hardcoded hex colors in chart components
Select-String -Path "src\components\*Chart*.tsx" -Pattern "#[0-9A-F]{6}"
# Expected: 0 matches (except in comments)
\`\`\`

---

### Type 3: Result/Display Cards (NEW)
**Characteristics:** Show calculated data, metrics, summaries  
**Examples:** Cost Breakdown, System Specifications, Financial Projections  
**Migration Pattern:**
- Container uses `.detail-card` (has neumorphic shadow)
- Headers use `.detail-card-header` (semantic text color)
- Values use `.performance-item-value` or `.cost-item-value`
- Labels use `.performance-item-label` or `.cost-item-label`

**Neumorphic Enhancement Checklist:**
- [ ] Card has `var(--shadow-outset-md)` or stronger
- [ ] Hover state uses `var(--shadow-outset-lg)`
- [ ] Background is `rgb(var(--color-surface))`
- [ ] Border uses `rgb(var(--color-border))`

**Reference Pattern:**
\`\`\`tsx
// ✅ CORRECT
<div className="detail-card">
  <h3 className="detail-card-header">Cost Breakdown</h3>
  <div className="cost-item">
    <span className="cost-item-label">System Cost</span>
    <span className="cost-item-value">{formatCurrency(cost)}</span>
  </div>
</div>
\`\`\`

---

### Type 4: Input Fields - Text vs Select (NEW)
**Problem:** `.form-select` shows dropdown arrow on ALL elements  
**Solution:** Use different classes for different input types

| Input Type | Class to Use | Dropdown Arrow? |
|-----------|-------------|-----------------|
| `<input type="text">` | `.form-input` OR inline Tailwind | ❌ NO |
| `<input type="number">` | `.form-input` OR inline Tailwind | ❌ NO |
| `<select>` | `.form-select` | ✅ YES |
| `<textarea>` | `.form-input` | ❌ NO |

**Migration Rule:**
1. Search component for all `<input>` and `<select>` tags
2. Verify `<input>` tags DO NOT use `.form-select`
3. Add `.form-input` OR use inline: `className="rounded-xl border bg-surface text-foreground"`
```

---

### Enhancement 3: "Common Mistakes" Section

**Problem Solved:** Pain Points 11 (generic instructions), 1 (hardcoded charts)

**Add to tasks.md after each phase:**

```markdown
## ⚠️ COMMON MISTAKES (Learn from Phase 6)

### Mistake 1: Using .form-select on Text Inputs
**Symptom:** Input fields show dropdown arrow  
**Cause:** `.form-select` adds SVG background to ANY element  
**Fix:** Use `.form-input` or inline Tailwind for `<input type="text">`

**Verification:**
\`\`\`powershell
# Find inputs with wrong class
Select-String -Path "src\components\*.tsx" -Pattern '<input.*form-select'
# Expected: 0 matches
\`\`\`

---

### Mistake 2: Chart Colors from Design Tokens
**Symptom:** Charts show same color in all themes (e.g., orange in dark and light)  
**Cause:** Hook imports `colors` from `@/design-tokens` (static values)  
**Fix:** Use `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`

**Verification:**
\`\`\`powershell
# Check if chart hook uses CSS variables
Select-String -Path "src\hooks\useChartColors.ts" -Pattern "getComputedStyle"
# Expected: At least 1 match
\`\`\`

---

### Mistake 3: Hardcoded Colors in Result Cards
**Symptom:** Cards show gray/wrong colors instead of theme colors  
**Cause:** Components use `bg-gray-800`, `text-gray-300` instead of semantic classes  
**Fix:** Replace with `.detail-card`, `.cost-item-label`, `.cost-item-value`

**Verification:**
\`\`\`powershell
# Find hardcoded gray colors
Select-String -Path "src\components\InstantQuote*.tsx" -Pattern "bg-gray|text-gray|border-gray"
# Expected: 0 matches (except in comments)
\`\`\`

---

### Mistake 4: Missing Neumorphic Shadows on Cards
**Symptom:** Cards look flat, not embossed  
**Cause:** Cards use default shadow instead of neumorphic variables  
**Fix:** Add `box-shadow: var(--shadow-outset-md)` in CSS or `shadow-neu-outset` in Tailwind

**Verification:**
\`\`\`powershell
# Check if detail-card has neumorphic shadow
Select-String -Path "src\app\globals.css" -Pattern "\.detail-card.*shadow.*outset"
# Expected: At least 1 match
\`\`\`
```

---

### Enhancement 4: Visual Regression Testing Enforcement

**Problem Solved:** Pain Points 9 (screenshot debugging), 10 (runtime errors)

**Add to tasks.md as mandatory step:**

```markdown
## ✅ PHASE COMPLETION GATE (MANDATORY)

**Every component must pass ALL checks before PR approval:**

### 1. Multi-Theme Visual Test (MANDATORY)
\`\`\`
1. Open component in browser
2. Test in Dark theme → Screenshot
3. Switch to Light theme → Screenshot
4. Switch to Purple theme → Screenshot
5. Compare all 3 screenshots:
   - [ ] No hardcoded colors visible
   - [ ] All text readable (contrast check)
   - [ ] Neumorphic shadows visible in all themes
   - [ ] No white/black bleed-through
\`\`\`

### 2. Runtime Error Check (MANDATORY)
\`\`\`
1. Open browser console
2. Interact with ALL component features (buttons, forms, tabs)
3. Switch themes while component is open
4. Expected: 0 errors in console
\`\`\`

### 3. Semantic Class Verification (MANDATORY)
\`\`\`powershell
# Run ALL verification commands from Phase X
# ALL must return 0 matches (or expected count)
\`\`\`

**❌ IF ANY CHECK FAILS:**
- Mark task as "BLOCKED - Visual Regression Failed"
- Document which theme/interaction failed
- Fix before moving to next component
```

---

### Enhancement 5: Semantic Classes Registry

**Problem Solved:** Pain Points 6 (class discovery), 7 (overlapping purposes)

**Create new file: `DOC/SEMANTIC-CLASSES-REGISTRY.md`:**

```markdown
# Semantic Classes Registry
**Auto-generated from:** `src/app/globals.css`  
**Last Updated:** November 3, 2025

## Component Container Classes

### .theme-card
**Purpose:** Base container for modals, panels, elevated surfaces  
**Usage:** Any component that needs card-like appearance  
**Properties:** `bg-surface`, `rounded-xl`, `shadow-outset-xl`  
**When to Use:** Modals, sidebars, dropdown menus  
**When NOT to Use:** Inline cards within pages (use `.detail-card` instead)

---

### .detail-card
**Purpose:** Result/data display cards within page content  
**Usage:** Cost breakdowns, system specs, performance metrics  
**Properties:** `bg-surface`, `rounded-lg`, `shadow-outset-md`, `p-6`  
**When to Use:** Data cards, result sections, info boxes  
**When NOT to Use:** Modal containers (use `.theme-card` instead)

---

## Form Element Classes

### .form-input
**Purpose:** Text input fields with embossed style  
**Usage:** `<input type="text">`, `<input type="number">`, `<textarea>`  
**Properties:** `bg-surface`, `border`, `rounded-xl`, `shadow-inset-md`  
**When to Use:** ALL text/number inputs  
**When NOT to Use:** Dropdowns (use `.form-select`)

---

### .form-select
**Purpose:** Dropdown/select elements with arrow icon  
**Usage:** `<select>` ONLY  
**Properties:** `bg-surface`, `border`, `rounded-xl`, `shadow-inset-md`, dropdown SVG  
**When to Use:** `<select>` elements only  
**When NOT to Use:** Text inputs (shows unwanted arrow)

---

## Text/Label Classes

### .cost-item-label
**Purpose:** Labels in cost breakdown cards  
**Usage:** Descriptive text in financial displays  
**Properties:** `text-foreground-muted`, `font-medium`  
**When to Use:** Cost labels, metric names  

### .cost-item-value
**Purpose:** Values in cost breakdown cards  
**Usage:** Monetary amounts, percentages  
**Properties:** `text-foreground`, `font-bold`  
**When to Use:** Cost values, calculated results  

---

## Class Hierarchy Decision Tree

\`\`\`
Is this a modal/dropdown/sidebar?
├─ YES → .theme-card (elevated, strong shadow)
└─ NO → Is this a data/result card?
    ├─ YES → .detail-card (medium shadow)
    └─ NO → Use inline Tailwind (bg-surface, rounded-lg)

Is this a form element?
├─ <select> → .form-select (has dropdown arrow)
├─ <input>, <textarea> → .form-input (embossed, no arrow)
└─ <button> → <Button> component (from ui/button.tsx)

Is this a label or value?
├─ Label → *-label classes (muted color)
├─ Value → *-value classes (bold color)
└─ Header → *-header classes (large, bold)
\`\`\`
```

---

### Enhancement 6: Chart Migration Specialized Guide

**Problem Solved:** Pain Points 1 (chart colors), 4 (design tokens vs CSS vars)

**Add to tasks.md as new section:**

```markdown
## 📊 SPECIAL MIGRATION: Data Visualization Components

**Applies to:** Any component using Recharts, charts, graphs, data visualization

### Step 1: Identify Chart Dependencies
\`\`\`powershell
# Find chart components
Select-String -Path "src\components\*.tsx" -Pattern "from 'recharts'|from 'recharts'"
\`\`\`

### Step 2: Audit Color Sources
**For EACH chart component found:**

\`\`\`powershell
# Check if using design tokens (BAD)
Select-String -Path "src\components\[ComponentName].tsx" -Pattern "from '@/design-tokens'"
# Expected: 0 matches

# Check if using hardcoded colors (BAD)
Select-String -Path "src\components\[ComponentName].tsx" -Pattern "fill=['\"]#|stroke=['\"]#"
# Expected: 0 matches

# Check if using useChartColors hook (GOOD)
Select-String -Path "src\components\[ComponentName].tsx" -Pattern "useChartColors"
# Expected: At least 1 match
\`\`\`

### Step 3: Update useChartColors Hook (If Needed)
**Verify hook reads from CSS variables:**

\`\`\`powershell
Select-String -Path "src\hooks\useChartColors.ts" -Pattern "getComputedStyle|getCSSVariable"
# Expected: At least 1 match

# If 0 matches, hook needs update to read from CSS variables
\`\`\`

**Hook Template:**
\`\`\`tsx
export function useChartColors() {
  const { theme } = useTheme();
  const [colors, setColors] = useState(() => {
    // Read from CSS variables (theme-adaptive)
    const primaryRgb = getCSSVariable('--color-primary', '255 255 255');
    return {
      primary: rgbToHex(primaryRgb),
      // ... other colors
    };
  });

  useEffect(() => {
    // Update colors when theme changes
    const primaryRgb = getCSSVariable('--color-primary', '255 255 255');
    setColors({ primary: rgbToHex(primaryRgb), ... });
  }, [theme]);

  return colors;
}
\`\`\`

### Step 4: Update Chart Component
**Replace ALL hardcoded colors:**

\`\`\`tsx
// ❌ BEFORE
<Bar dataKey="cost" fill="#FF6B00" />
<CartesianGrid stroke="#e5e7eb" />
<XAxis tick={{ fill: '#9ca3af' }} />

// ✅ AFTER
const chartColors = useChartColors();
<Bar dataKey="cost" fill={chartColors.primary} />
<CartesianGrid stroke={chartColors.grid} />
<XAxis tick={{ fill: chartColors.text }} />
\`\`\`

### Step 5: Test in All Themes
**MANDATORY: Test chart in all 3 themes**

1. Dark theme → Primary color should be WHITE
2. Light theme → Primary color should be BLACK
3. Purple theme → Primary color should be PURPLE

**Verification:**
\`\`\`powershell
# No hardcoded colors remain
Select-String -Path "src\components\[ComponentName].tsx" -Pattern "fill=['\"]#|stroke=['\"]#|color: #"
# Expected: 0 matches
\`\`\`
```

---

### Enhancement 7: Update Verification Commands

**Problem Solved:** Pain Points 2 (dropdown on inputs), 3 (card colors)

**Add to tasks.md for Phase 6 (and all future phases):**

```markdown
## ✅ PHASE 6 VERIFICATION COMMANDS (InstantQuote & Rebate Calculator)

### Verification 1: No .form-select on Text Inputs
\`\`\`powershell
# Check for wrong class on inputs
Select-String -Path "src\components\InstantQuoteForm.tsx","src\components\RebateCalculatorForm.tsx" -Pattern '<input[^>]*form-select'
# Expected: 0 matches

# Verify selects DO use form-select
Select-String -Path "src\components\InstantQuoteForm.tsx","src\components\RebateCalculatorForm.tsx" -Pattern '<select[^>]*form-select'
# Expected: 3+ matches (state, retailer, etc.)
\`\`\`

### Verification 2: Chart Colors Theme-Adaptive
\`\`\`powershell
# Verify no hardcoded chart colors
Select-String -Path "src\components\SavingsChart.tsx" -Pattern "fill=['\"]#|stroke=['\"]#"
# Expected: 0 matches (except in gradient IDs)

# Verify uses useChartColors hook
Select-String -Path "src\components\SavingsChart.tsx" -Pattern "useChartColors"
# Expected: At least 2 matches (import + usage)
\`\`\`

### Verification 3: Result Cards Use Semantic Classes
\`\`\`powershell
# No hardcoded gray colors in result cards
Select-String -Path "src\components\InstantQuoteForm.tsx" -Pattern "bg-gray-|text-gray-|border-gray-" -Context 0,2
# Expected: 0 matches

# Verify semantic classes used
Select-String -Path "src\components\InstantQuoteForm.tsx" -Pattern "detail-card|cost-item|spec-card|performance-item"
# Expected: 10+ matches
\`\`\`

### Verification 4: useChartColors Hook Reads CSS Variables
\`\`\`powershell
# Verify hook uses getComputedStyle
Select-String -Path "src\hooks\useChartColors.ts" -Pattern "getComputedStyle|getCSSVariable"
# Expected: 3+ matches

# Verify NOT using design tokens
Select-String -Path "src\hooks\useChartColors.ts" -Pattern "from '@/design-tokens'"
# Expected: 0 matches
\`\`\`
```

---

### Enhancement 8: Create Migration Decision Flowchart

**Problem Solved:** Pain Points 11 (generic guidance), 12 (no type-specific help)

**Add to DOC/DESIGN-SYSTEM-SOT.md:**

```markdown
## 🗺️ Migration Decision Flowchart

### START: I need to migrate a component

**STEP 1: What type of component is this?**

#### Option A: Form Component (inputs, buttons, labels)
→ Use: **Form Migration Pattern**
- Reference: `InstallerSignupModal.tsx`
- Classes: `.form-input`, `.form-select`, `<Button>` component
- [Go to Form Migration Guide](#type-1-form-components)

#### Option B: Chart/Graph Component (Recharts, data viz)
→ Use: **Chart Migration Pattern** 
- Reference: `SavingsChart.tsx`
- Hook: `useChartColors()` (must read CSS variables)
- [Go to Chart Migration Guide](#type-2-data-visualization-components)

#### Option C: Result/Data Card (cost breakdown, metrics)
→ Use: **Card Migration Pattern**
- Classes: `.detail-card`, `.cost-item`, `.performance-item`
- [Go to Card Migration Guide](#type-3-resultdisplay-cards)

#### Option D: Modal/Dialog
→ Use: **Modal Migration Pattern**
- Reference: `HomeownerSignInModal.tsx`
- Container: `.theme-card`
- [Go to Modal Migration Guide](#migration-principles)

---

**STEP 2: Does it have mixed elements? (e.g., modal with form and chart)**

✅ YES → Migrate in this order:
1. Container (modal/card wrapper)
2. Forms (inputs, buttons)
3. Charts (if any)
4. Result cards (if any)

❌ NO → Follow single pattern from Step 1

---

**STEP 3: Pre-Migration Checklist**

Before touching ANY code:
- [ ] Run Gate 0 health checks (all must pass)
- [ ] Identify all sub-components (forms, charts, cards)
- [ ] Find reference component for each type
- [ ] Open semantic classes registry
- [ ] Open verification commands for this phase

---

**STEP 4: During Migration**

For EACH element in component:
1. Is it `<button>`? → Replace with `<Button>` component
2. Is it `<input type="text/number">`? → Add `.form-input` class
3. Is it `<select>`? → Add `.form-select` class
4. Is it a chart? → Use `useChartColors()` hook
5. Is it a card? → Use `.detail-card` or `.theme-card`
6. Does it have color/bg/border? → Use semantic tokens (no hardcoded)

---

**STEP 5: Post-Migration Verification**

Run ALL verification commands for this phase:
- [ ] No hardcoded colors (grep check passes)
- [ ] No wrong classes on inputs (grep check passes)
- [ ] Test in all 3 themes (visual check passes)
- [ ] No console errors (runtime check passes)

---

**STEP 6: Mark Complete**

Only when ALL verifications pass:
- [ ] Update migration progress in tasks.md
- [ ] Commit with atomic message
- [ ] Move to next component
```

---

## 📝 ACTION ITEMS

### Immediate Actions (Do Now)
1. ✅ Create `DOC/SEMANTIC-CLASSES-REGISTRY.md` with all classes from globals.css
2. ✅ Update `specs/006-component-by-component/tasks.md` with:
   - Gate 0: Pre-Migration Health Check (at top)
   - Common Mistakes section (after each phase)
   - Chart Migration Specialized Guide
   - Enhanced verification commands
3. ✅ Update `DOC/DESIGN-SYSTEM-SOT.md` with:
   - Component Type Taxonomy (4 types)
   - Migration Decision Flowchart
   - Type-specific migration patterns

### Next Migration Preparation
4. ⏭️ Run Gate 0 health check BEFORE starting next component
5. ⏭️ Generate semantic classes catalog: `Select-String -Path "src\app\globals.css" -Pattern "^\s*\.[a-z-]+\s*{"`
6. ⏭️ Test multi-theme visual regression for InstantQuoteForm and RebateCalculator

### Long-Term Improvements
7. 🔮 Set up Chromatic for automated visual regression
8. 🔮 Create ESLint rule to detect hardcoded colors in TSX files
9. 🔮 Build CLI tool: `npm run migrate:verify [component-name]` to run all checks

---

## 🎯 SUCCESS METRICS

**If enhancements are successful, next migration should have:**
- ✅ 0 iterations on theme adaptation (caught by Gate 0)
- ✅ 0 wrong class usage (prevented by type-specific patterns)
- ✅ 0 hardcoded colors found after completion (caught by verification)
- ✅ 1 screenshot per theme (not 3-5 iterations)
- ✅ 0 "oops we missed this" commits after marking complete

**Measure on next component (Phase 7+):**
- Number of user-reported visual issues: Target 0 (was 3-5 in Phase 6)
- Number of rework commits: Target ≤1 (was 5+ in Phase 6)
- Time to complete migration: Target 50% faster

---

## 📚 REFERENCES

- Conversation logs: This chat (InstantQuoteForm & RebateCalculator migration)
- Components migrated: `InstantQuoteForm.tsx`, `SavingsChart.tsx`, `useChartColors.ts`
- Issues encountered: 12 major pain points documented above
- Current tasks file: `specs/006-component-by-component/tasks.md`
- Current SOT: `DOC/DESIGN-SYSTEM-SOT.md`

---

**End of Audit**
