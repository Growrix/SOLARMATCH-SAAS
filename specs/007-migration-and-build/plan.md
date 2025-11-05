# Implementation Plan: Migration and Build Execution Standards

**Branch**: `007-migration-and-build` | **Date**: November 4, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-migration-and-build/spec.md`

**Note**: This is a UNIVERSAL EXECUTION PLAN for any migration/build task. This plan provides the strict workflow and quality gates that MUST be followed when the user requests migration work (e.g., "migrate the form", "migrate Hero component", "migrate modal").

## Summary

This implementation plan establishes the **EXECUTION WORKFLOW** for all component migrations and build tasks. It is NOT a plan to migrate specific components—it is the INSTRUCTION SET that governs HOW to execute any migration task correctly.

**Primary Requirement**: Provide enforceable, step-by-step instructions that prevent the 15+ pain points identified in previous migrations (partial completions, false reporting, theme inconsistencies, logic regressions, etc.).

**Technical Approach**: 13-step workflow with mandatory quality gates (GATE 0 health check, 6 verification commands, multi-theme testing, logic preservation audit, build validation) that execute BEFORE, DURING, and AFTER migration work.

## Technical Context

**Language/Version**: TypeScript 5.3.3+, Next.js 14+ App Router  
**Primary Dependencies**: React 18+, Tailwind CSS 3.4+, Prisma (database), Next-Auth (authentication)  
**Storage**: PostgreSQL (via Prisma), localStorage (theme preferences)  
**Testing**: Manual testing (browser DevTools, responsive testing, contrast checkers), TypeScript type checking, Next.js build validation  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari), responsive design (320px to 1440px+)  
**Project Type**: Web application (Next.js SSR/SSG)  
**Performance Goals**: Build time <2 minutes, no type errors, zero hardcoded violations in migrated components  
**Constraints**: UI-only changes (NO logic modifications), 100% design token compliance, WCAG 2.1 AA accessibility  
**Scale/Scope**: 15-20 components to migrate per phase, 3 themes (Dark, Light, Purple), 5 responsive breakpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with Constitution.md

✅ **Next.js App Router First**: Migration work does NOT change routing structure—only updates component styling within existing routes.

✅ **UI-First Workflow**: This spec IS the instruction set for UI migration. No backend changes involved.

✅ **TypeScript Strict Mode**: FR-049 mandates `npx tsc --noEmit` before every commit.

✅ **Atomic Commits**: FR-054 mandates one component per commit (explicit requirement).

✅ **Mobile-First Design**: FR-038 mandates testing at 5 breakpoints starting with 320px.

✅ **Accessibility Standards**: FR-043 to FR-048 mandate WCAG 2.1 AA compliance.

✅ **Design System (Phase 0 Complete)**: Assumes CSS variables, design tokens, and centralized components exist (dependency documented in spec.md).

✅ **Documentation Standards**: FR-062 explicitly states "MUST NOT create new docs unless requested" (prevents over-documentation).

✅ **No Violations**: This spec enforces constitution standards, does not violate any principles.

## Project Structure

### Documentation (this feature)

```
specs/007-migration-and-build/
├── spec.md              # Feature specification (user stories, requirements, success criteria)
├── plan.md              # This file - universal execution plan
├── checklists/
│   └── requirements.md  # Quality checklist (already generated)
└── audits/              # Logic audit reports created during migration (per-component)
    └── [ComponentName]-logic.md
```

### Source Code (repository root)

```
src/
├── app/                       # Next.js App Router pages (targets for migration)
│   ├── (dashboard)/          # Dashboard route group
│   ├── (auth)/               # Auth route group
│   └── (marketing)/          # Public pages
├── components/
│   ├── ui/                   # Centralized UI components (Button, etc.)
│   │   └── button.tsx
│   ├── auth/                 # Auth components (AuthInput, AuthModal)
│   │   ├── AuthInput.tsx
│   │   └── AuthModal.tsx
│   └── [feature]/            # Feature-specific components (migration targets)
├── design-tokens/            # Design token TypeScript files
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── styles/
    └── globals.css           # CSS variables for 3 themes (Dark, Light, Purple)

DOC/                          # Project documentation
├── DESIGN-SYSTEM-SOT.md      # Design token reference
├── MIGRATION-PAIN-POINTS.md  # Lessons learned from previous migrations
└── COLOR-SYSTEM-STANDARDS.md # Color palette guide
```

**Structure Decision**: Web application structure (Next.js App Router). Migration work targets `src/app/` and `src/components/` directories. No backend changes. CSS variables defined in `src/styles/globals.css`. Centralized components in `src/components/ui/` and `src/components/auth/`.

## Complexity Tracking

*No constitution violations. No complexity justification required.*

This spec enforces constitution standards and does not introduce architectural complexity.

---

## Phase 0: Research & Prerequisites

**Status**: ✅ Complete (all research resolved, no NEEDS CLARIFICATION markers)

### Research Findings

All technical decisions have been made and documented in `spec.md`. No additional research required.

**Key Decisions**:
1. **Testing Approach**: Manual testing with browser DevTools (no automated E2E required per spec)
2. **Verification Method**: PowerShell grep commands (6 verification commands documented)
3. **Theme Testing**: Manual ThemeSwitcher testing in browser (3 themes required)
4. **Build Validation**: TypeScript + Next.js build commands (pre-commit checks)
5. **Accessibility Testing**: Manual contrast checkers + keyboard testing (WCAG 2.1 AA)

**Rationale**: Constitution mandates manual testing for UI work. Automated testing is out of scope for this spec.

**Alternatives Considered**: E2E tests (Playwright), visual regression tests (Chromatic) - rejected as over-engineering for visual refactoring work.

---

## Phase 1: Design & Contracts

**Status**: ✅ Complete (no data model or API contracts needed for execution standards)

### Data Model

**N/A** - This spec does not introduce new data entities. It defines workflow and quality gates only.

Existing entities tracked during migration (documented in spec.md FR-064):
- Component Migration Record (status, violations, theme test results, commit hash)
- GATE 0 Health Check Result (pass/fail per check)
- Verification Command Result (match count per command)
- Logic Audit Report (state, handlers, effects inventory)

These are tracked in markdown files (migration tracker, audit reports) not database tables.

### API Contracts

**N/A** - This spec does not introduce new API endpoints. All work is frontend UI migration.

### Quickstart: Universal Migration Workflow

**This is the CONTRACT for any migration task. When user says "migrate X", follow these 13 steps:**

---

## ⚠️ MANDATORY WORKFLOW PRINCIPLES (From tasks.md)

### Before Starting Migration:
1. **Pre-Phase Audit** (10-15 minutes):
   - Read spec.md thoroughly (user stories, requirements, success criteria)
   - Review DESIGN-SYSTEM-SOT.md (understand token system)
   - Check existing component patterns (how others are structured)
   - Verify design system is complete (CSS variables, centralized components)
   - List exact files to modify (don't invent new structure)

### During Migration Implementation:
2. **Spec-Driven Execution** (Task by Task):
   - Re-read relevant spec section FIRST for each component
   - Follow existing code patterns (don't reinvent)
   - Use EXISTING utilities and centralized components
   - Check function signatures BEFORE calling
   - **Incremental Build Check**: After every 2-3 components, run `npm run build`
     - If errors: Fix according to spec, not workarounds
   - **Type Safety First**: Let TypeScript errors guide to spec compliance
   - **No Mid-Migration Drift**: Don't change design system during component migration

3. **Post-Migration Validation** (MUST COMPLETE BEFORE COMMIT):
   - ✅ TypeScript: `npx tsc --noEmit` (0 errors)
   - ✅ Build: `npm run build` (0 errors, warnings OK)
   - ✅ Verification: All 6 commands return 0/0/0/0/0/0
   - ✅ Theme Testing: All 3 themes pass visual check
   - ✅ Responsive: All 5 breakpoints work
   - ✅ Regression Check: Existing features still work

4. **Commit Approval** (MANDATORY):
   - ❌ **NEVER commit without explicit user approval**
   - Present validation results to user
   - Wait for confirmation: "Yes, commit this batch"
   - Then commit with detailed message

### 🚨 RED FLAGS - STOP IMMEDIATELY:
- Design system doesn't exist or incomplete → Run GATE 0, fix system first
- Build errors persist >30 minutes → Report to user, don't spiral
- Creating new patterns not in codebase → Use existing patterns
- Inventing class names not in spec → Use exact token names from DESIGN-SYSTEM-SOT.md
- "I'll fix it later" thoughts → Fix now or ask user

---

#### STEP 1: Run GATE 0 Health Check (MANDATORY FIRST STEP)

**Before touching ANY component code**, verify design system health:

```powershell
# Navigate to project root
cd "d:\Desktop Mass\SOLAR LEAD GEN PROJECT MAIN FILE\solarmatch"

# Check 1: CSS Variables exist in globals.css (all 3 themes)
Select-String -Path "src\styles\globals.css" -Pattern "--color-background|--color-foreground|--color-surface|--color-border|--color-primary|--color-accent"

# Check 2: Centralized components exist
Test-Path "src\components\ui\button.tsx"
Test-Path "src\components\auth\AuthInput.tsx"

# Check 3: .form-input class exists in globals.css
Select-String -Path "src\styles\globals.css" -Pattern "\.form-input"

# Check 4: theme-card class uses CSS variables (not hardcoded)
Select-String -Path "src\styles\globals.css" -Pattern "\.theme-card" -Context 5,5
```

**GATE 0 PASS CRITERIA**: All checks return expected results, no errors.

**IF GATE 0 FAILS**: STOP migration work. Fix design system issues first. Re-run checks.

---

#### STEP 2: Mental Logic Audit (Keep in Memory - No File Creation)

**Before touching component code**, mentally note all functionality to preserve:

**Quick Mental Checklist**:
- State variables: What useState/useReducer/useContext exist?
- Event handlers: What onClick/onChange/onSubmit functions exist?
- Side effects: What useEffect hooks exist? Any API calls?
- Conditional rendering: Any if/else, ternaries, loading states?
- Forms: Any validation rules, error handling, submission logic?

**HIGH RISK FLAGS**:
- ⚠️ Forms with validation → Test thoroughly after migration
- ⚠️ API calls → Verify still work identically
- ⚠️ Complex state management → Check all state updates

**NO FILE CREATION**: Keep this audit in memory during migration. Only create audit file if component is highly complex (>500 lines, >10 state variables) or if you need to document blockers.

---

#### STEP 3: Run Pre-Migration Verification (Baseline)

Document current violation count (shows improvement):

```powershell
# Command 1: Hardcoded gray/slate colors
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "text-gray-|text-slate-|bg-gray-|bg-slate-|border-gray-|border-slate-"

# Command 2: Dark mode classes
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "dark:"

# Command 3: RGB/HEX colors
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"

# Command 4: Hardcoded white/black
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "text-white|bg-white|text-black|bg-black"

# Command 5: Hardcoded typography
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "text-xs|text-sm|text-lg|text-xl|font-bold|font-semibold"

# Command 6: Manual responsive classes
Select-String -Path "src\components\[path]\[ComponentName].tsx" -Pattern "sm:text-|md:text-|lg:text-"
```

**Document**: "Pre-migration: 15/5/3/2/8/1 violations found"

---

#### STEP 4: Migrate Component (UI Only - NO Logic Changes)

**Replace hardcoded classes with design tokens**:

**Common Replacements**:
- `bg-slate-700` → `bg-surface`
- `bg-slate-800` → `bg-background`
- `text-gray-300` → `text-muted-foreground`
- `text-white` → `text-foreground`
- `border-gray-200` → `border-border`
- `text-2xl font-bold` → `text-heading-2`
- `text-sm` → `text-body-small`
- `dark:bg-slate-800` → DELETE (CSS variables handle theme)

**Use Centralized Components**:
- `<input className="w-full bg-surface...">` → `<input className="form-input w-full">`
- Custom button → `<Button variant="primary">`

**CRITICAL**: Do NOT touch:
- useState variables
- Event handler logic
- useEffect hooks
- Conditional rendering logic
- API calls
- Form validation logic

Only change className strings and JSX structure if replacing with centralized components.

---

#### STEP 5: Run Post-Migration Verification (Must be 0/0/0/0/0/0)

```powershell
# Re-run all 6 verification commands from STEP 3
# REQUIRED RESULT: 0 matches for ALL 6 commands

# If ANY command returns matches:
# - Fix the violations
# - Re-run ALL 6 commands (not just failed one)
# - Repeat until 0/0/0/0/0/0
```

**Document**: "Post-migration: 0/0/0/0/0/0 violations (all clean)"

---

#### STEP 6: Test Dark Theme

Start dev server, test in Dark theme:

```powershell
npm run dev
# Open http://localhost:3000/[page-with-component]
# Use ThemeSwitcher to select Dark theme
```

**Visual Checklist**:
- [ ] Background is `#121212` (dark gray, not black)
- [ ] Text is `#F3F4F6` (light gray, readable)
- [ ] Shadows visible (dark: `#000000`, light: `#242424`)
- [ ] Accent color is orange `#FF6B00`
- [ ] Forms: inputs visible, borders defined, focus states work
- [ ] Buttons: contrast with background, text readable, hover states visible

---

#### STEP 7: Test Light Theme

Switch to Light theme:

```powershell
# Use ThemeSwitcher to select Light theme
```

**Visual Checklist**:
- [ ] Background is `#E0E5EC` (neumorphic gray)
- [ ] Text is `#121212` (dark, readable)
- [ ] Neumorphic shadows visible (dark: `#A3B1C6`, light: `#FFFFFF`)
- [ ] Accent color is dark `#111827`
- [ ] Forms: inputs visible, placeholder text readable
- [ ] Buttons: contrast properly, text readable

---

#### STEP 8: Test Purple Theme

Switch to Purple theme:

```powershell
# Use ThemeSwitcher to select Purple theme
```

**Visual Checklist**:
- [ ] Background is `#2C1D4D` (deep purple)
- [ ] Text is `#E9E3FF` (light purple, readable)
- [ ] Purple shadows visible (dark: `#1A112E`, light: `#3E296C`)
- [ ] Accent color is `#A78BFA` (lavender)
- [ ] Forms: inputs visible, focus states work
- [ ] Buttons: contrast properly, hover states visible

**IF ANY THEME FAILS**: Fix issue, re-test ALL 3 themes (not just failed one)

---

#### STEP 9: Test Responsive Design (5 Breakpoints)

Use browser DevTools responsive mode:

```powershell
# Chrome DevTools: F12 → Toggle device toolbar (Ctrl+Shift+M)
```

**Test at Each Breakpoint**:

1. **320px (iPhone SE)**:
   - [ ] No horizontal scroll
   - [ ] Text readable (≥14px)
   - [ ] Touch targets ≥44x44px
   - [ ] Modal fits screen (max-w-[calc(100vw-2rem)])
   - [ ] Buttons accessible, stack vertically

2. **375px (iPhone X)**:
   - [ ] Similar to 320px, slightly more spacing

3. **768px (Tablet)**:
   - [ ] Layout adapts (2-column if appropriate)
   - [ ] Modal centered, larger max-width
   - [ ] Buttons can go inline

4. **1024px (Desktop)**:
   - [ ] Optimal spacing used
   - [ ] Modal max-width enforced
   - [ ] Desktop features work

5. **1440px (Wide)**:
   - [ ] No excessive stretching
   - [ ] Content centered appropriately

**Document**: Create screenshot or note "Tested at 5 breakpoints - all pass"

---

#### STEP 10: Test Accessibility (WCAG 2.1 AA)

**Contrast Check** (browser DevTools or WebAIM):
- [ ] Body text contrast ≥4.5:1
- [ ] Large text contrast ≥3:1
- [ ] Placeholder text contrast sufficient

**Keyboard Navigation**:
- [ ] Tab key moves focus logically
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Focus ring visible (not disabled)

**Forms** (if applicable):
- [ ] Each input has visible label or aria-label
- [ ] Error messages associated with inputs
- [ ] Required fields marked

**Modals** (if applicable):
- [ ] Focus trapped in modal
- [ ] Escape closes modal
- [ ] Focus returns to trigger after close

**Document**: "WCAG 2.1 AA compliant - contrast checked, keyboard tested"

---

#### STEP 11: Test Functionality (Logic Preservation)

**Use logic audit checklist from STEP 2**:

- [ ] All state variables update correctly
- [ ] All event handlers fire correctly
- [ ] All API calls succeed
- [ ] Form validation works
- [ ] Conditional rendering works (loading states, error states)
- [ ] No console errors

**IF ANY FUNCTIONALITY BREAKS**: Logic was accidentally modified. Revert and try again (UI-only changes).

---

#### STEP 12: Run Build Validation

**TypeScript Check**:
```powershell
npx tsc --noEmit --project .
```
**REQUIRED**: 0 errors

**Build Check**:
```powershell
npm run build
```
**REQUIRED**: Build succeeds, no errors

**IF CHECKS FAIL**: Fix errors (usually missing imports, type errors), re-run checks.

---

#### STEP 13: Batch Commits (After Multiple Components - User Approval Required)

**Commit Strategy** (aligned with tasks.md workflow):
- **Batch commits**: Group 3-5 related components per commit (not one-by-one)
- **Commit only when**: Phase milestone reached OR user requests commit
- **NEVER commit without user approval** (mandatory from tasks.md)

**When Ready to Commit**:

1. **Present validation results to user**:
   - Build output (success/warnings)
   - Files changed count
   - Components migrated (list)
   - Verification summary (all 0/0/0/0/0/0)
   - Theme testing summary (all pass)
   - Build validation (TypeScript + build passed)

2. **Wait for user approval**: "Yes, commit this batch"

3. **Then commit**:
```powershell
git add src/components/[path1]/[Component1].tsx
git add src/components/[path2]/[Component2].tsx
git add src/components/[path3]/[Component3].tsx
git commit -m "Migrate: [Component1], [Component2], [Component3] - Design token compliance

- Total violations fixed: 45 → 0
- [Component1]: 15/5/3/2/8/1 → 0/0/0/0/0/0
- [Component2]: 12/3/2/1/5/0 → 0/0/0/0/0/0
- [Component3]: 8/2/1/0/3/1 → 0/0/0/0/0/0
- All components tested in Dark, Light, Purple themes
- All components tested at 5 breakpoints
- WCAG 2.1 AA compliant
- Build: ✅ TypeScript passed, build successful
- Logic preserved: all functionality works identically"
```

**Update Migration Tracker** (after commit):
```markdown
| [Component1] | ✅ Complete | 0 | [Date] | [commit-hash] | All themes pass |
| [Component2] | ✅ Complete | 0 | [Date] | [commit-hash] | All themes pass |
| [Component3] | ✅ Complete | 0 | [Date] | [commit-hash] | All themes pass |
```

**NO TASKS.MD UPDATES**: Migration tracker in spec is sufficient. Only update tasks.md if spec requests it.

---

### End of Workflow

**Migration batch is complete when**:
- All 13 steps executed for each component
- All verification commands return 0/0/0/0/0/0 for ALL components
- All 3 themes tested and pass for ALL components
- All 5 breakpoints tested and pass for ALL components
- Accessibility tests pass for ALL components
- Functionality tests pass for ALL components
- Build validation passes (TypeScript + build)
- User approval received
- Batch commit created (3-5 components)
- Migration tracker updated

**For next batch**: Repeat steps 1-13 for next group of components. Work in batches of 3-5 related components for efficiency.

---

## Phase 2: Implementation (Out of Scope)

**This plan does NOT implement migrations**. It provides the instruction set.

When user requests specific migration work (e.g., "migrate InstallrSignupModal"), follow the 13-step workflow above.

---

## Agent Context Update

**Action**: Update `.github/copilot-instructions.md` to reference this plan for all migration work.

```powershell
.\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot
```

**Content to add**:
```markdown
## Migration and Build Execution

For ANY component migration or build task, MUST follow: `specs/007-migration-and-build/plan.md`

**13-Step Workflow** (no-skip):
1. Run GATE 0 health check
2. Create logic audit report
3. Run pre-migration verification (baseline)
4. Migrate component (UI only - NO logic changes)
5. Run post-migration verification (must be 0/0/0/0/0/0)
6. Test Dark theme
7. Test Light theme
8. Test Purple theme
9. Test responsive (5 breakpoints)
10. Test accessibility (WCAG 2.1 AA)
11. Test functionality (logic preservation)
12. Run build validation (TypeScript + build)
13. Commit atomically (one component per commit)

**Reference**: See `specs/007-migration-and-build/spec.md` for detailed requirements and success criteria.
```

---

## Approval and Sign-Off

**Plan Created**: November 4, 2025  
**Status**: Ready for execution  
**Next Steps**: When user requests migration work (e.g., "migrate the form"), execute 13-step workflow from Phase 1 quickstart above.

**This plan is the SOURCE OF TRUTH for migration execution**. All migration work MUST follow this workflow.
