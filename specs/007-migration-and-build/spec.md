# Feature Specification: Migration and Build Execution Standards

**Feature Branch**: `007-migration-and-build`  
**Created**: November 4, 2025  
**Status**: Draft  
**Input**: User description: "Migration and build execution standards - comprehensive guidelines and mandatory rules to prevent inconsistencies, ensure quality, and systematically address all pain points from component migrations"

---

## 🎯 PURPOSE

**Problem Statement**: Previous migrations suffered from repeated mistakes, inconsistent execution, partial completions, false reporting, and lack of systematic prevention. The migration pain points document (specs/006-component-by-component/MIGRATION-PAIN-POINTS.md) identified 15+ critical issues that caused significant rework and technical debt.

**Solution**: This specification establishes the **SINGLE SOURCE OF TRUTH** for all migration and build work. It provides:
- **Mandatory Pre-Flight Checks** (GATE 0) that MUST pass before any work begins
- **Strict Execution Workflows** with no-skip steps and quality gates
- **Comprehensive Verification Commands** to detect ALL violations (not just some)
- **Complete Testing Requirements** including multi-theme validation
- **Clear Success Criteria** for when work is truly "done"
- **Prevention Mechanisms** to stop repeated mistakes

**Scope**: This spec covers ALL types of work:
- Component migrations (design system compliance)
- New component creation
- Feature additions
- Bug fixes
- Refactoring work

**Out of Scope**:
- Project-wide architectural decisions (see constitution.md)
- Design token definitions (see DESIGN-SYSTEM-SOT.md)
- Specific component implementation details (see individual feature specs)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pre-Flight Health Check (Priority: P0) 🎯 FOUNDATION

**Actor**: Developer  
**Goal**: Verify system health and design system completeness BEFORE starting any migration or build work

**Why this priority**: MUST be completed first. Cannot safely migrate components without knowing the design system is complete and healthy. Prevents "fix component → discover system issue → rework component" cycle.

**Independent Test**: Developer runs GATE 0 health check script, all checks pass (100% green), system confirmed ready for work. If any check fails, developer stops migration, fixes system issue first, then re-runs checks.

**Acceptance Scenarios**:

1. **Given** developer assigned component migration task, **When** starting work, **Then** MUST run GATE 0 health checks FIRST (before reading component code)
2. **Given** GATE 0 health checks run, **When** CSS variables check executes, **Then** verifies all required CSS variables exist in globals.css for ALL 3 themes (dark, light, purple)
3. **Given** CSS variables missing, **When** check fails, **Then** displays exact missing variables + file path + line number to add them
4. **Given** semantic classes check runs, **When** verifying .form-input, **Then** confirms class exists, uses `--color-surface`, has all required properties (padding, border-radius, shadows, etc.)
5. **Given** reference components check runs, **When** verifying Button component, **Then** confirms file exists at correct path, exports default, has all variants (primary, secondary, link, icon)
6. **Given** theme-card check runs, **When** verifying background color, **Then** confirms uses `--color-surface` in ALL 3 themes (NOT hardcoded #fff or rgba())
7. **Given** ALL checks pass, **When** developer proceeds, **Then** has written confirmation "GATE 0: ✅ PASS - System healthy, ready for migration"
8. **Given** ANY check fails, **When** developer attempts to proceed, **Then** BLOCKED with error message "GATE 0 FAILED - Fix system issues before migrating components"

---

### User Story 2 - Complete Violation Detection (Priority: P0) 🎯 FOUNDATION

**Actor**: Developer  
**Goal**: Run comprehensive verification commands that detect ALL types of hardcoded values (not just bg-slate-*, but also rgba(), #hex, text-white, dark:, etc.)

**Why this priority**: Previous migrations reported "zero violations" but later discovered rgba() colors, text-white, dark: classes. Comprehensive detection prevents false completion reports.

**Independent Test**: Developer migrates a component, runs complete verification suite (6 commands), ALL commands return zero matches. Component truly has zero hardcoded values.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** running verification, **Then** MUST run ALL 6 verification commands (not just 1-2)
2. **Given** verification command 1 runs, **When** searching for hardcoded gray/slate colors, **Then** searches: `text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-`
3. **Given** verification command 2 runs, **When** searching for dark: prefixes, **Then** searches: `dark:` and excludes only necessary exceptions (like dark: in comments)
4. **Given** verification command 3 runs, **When** searching for RGB/RGBA/HEX colors, **Then** pattern: `rgba\(|rgb\(|#[0-9a-fA-F]{3,6}` BUT excludes SVG attributes (viewBox, fill=)
5. **Given** verification command 4 runs, **When** searching for hardcoded white/black, **Then** searches: `text-white|bg-white|text-black|bg-black` BUT excludes button text where appropriate
6. **Given** verification command 5 runs, **When** searching for hardcoded fonts, **Then** searches: `text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|font-bold|font-semibold`
7. **Given** ALL 6 commands return zero matches, **When** developer marks component complete, **Then** component is truly clean (no hidden violations)
8. **Given** ANY command returns matches, **When** developer reviews, **Then** fixes found violations and re-runs ALL 6 commands (not just the failed one)

---

### User Story 3 - Multi-Theme Testing Enforcement (Priority: P0) 🎯 FOUNDATION

**Actor**: Developer  
**Goal**: Test component in ALL 3 themes (Dark, Light, Purple) BEFORE marking complete, ensuring consistent visual quality across themes

**Why this priority**: Previous migrations tested dark theme only, broke light/purple themes, caused rework. Multi-theme testing is NOT optional.

**Independent Test**: Developer migrates component, uses ThemeSwitcher to test Dark → Light → Purple, verifies text readable, backgrounds correct, shadows visible in ALL themes. Only after all 3 pass does developer mark component complete.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** testing begins, **Then** MUST test ALL 3 themes (cannot skip light or purple)
2. **Given** testing Dark theme, **When** component renders, **Then** verifies: background is `#121212`, text is `#F3F4F6`, shadows are `#000000` (dark) + `#242424` (light), accent is orange `#FF6B00`
3. **Given** testing Light theme, **When** component renders, **Then** verifies: background is `#E0E5EC`, text is `#121212`, neumorphic shadows visible (`#A3B1C6` dark, `#FFFFFF` light), accent is dark `#111827`
4. **Given** testing Purple theme, **When** component renders, **Then** verifies: background is `#2C1D4D`, text is `#E9E3FF`, purple shadows visible (`#1A112E` dark, `#3E296C` light), accent is `#A78BFA`
5. **Given** component uses forms, **When** testing all themes, **Then** input fields visible, borders defined, focus states work, placeholder text readable
6. **Given** component uses buttons, **When** testing all themes, **Then** button backgrounds contrast with page background, text readable, hover states visible
7. **Given** ANY theme fails visual test, **When** developer discovers issue, **Then** MUST fix and re-test ALL 3 themes (not just the failed one)
8. **Given** ALL 3 themes pass, **When** marking complete, **Then** documents in commit message "Tested in Dark, Light, Purple themes - all pass"

---

### User Story 4 - Logic Preservation Audit (Priority: P1)

**Actor**: Developer  
**Goal**: Create complete logic inventory BEFORE touching any code, ensuring zero functional regressions during visual refactoring

**Why this priority**: Visual changes (className replacements) should NOT break functionality. Audit ensures developer knows what logic to preserve.

**Independent Test**: Before migrating InstantQuoteForm, developer creates audit report showing: 15 state variables, 8 event handlers, 3 useEffect hooks, form validation rules, quote calculation logic, API submission. During migration, developer references checklist: "Preserve handleSubmit, preserve calculateQuote, preserve validation..." Result: Form works identically after migration.

**Acceptance Scenarios**:

1. **Given** component assigned for migration, **When** starting work, **Then** creates audit report in `specs/[feature]/audits/[ComponentName]-logic.md`
2. **Given** component has state, **When** auditing, **Then** documents ALL useState/useReducer/useContext calls with: variable name, type, initial value, update function names
3. **Given** component has event handlers, **When** auditing, **Then** documents ALL onClick/onChange/onSubmit/onBlur/onFocus with: function signature, what it does, dependencies
4. **Given** component has side effects, **When** auditing, **Then** documents ALL useEffect hooks with: purpose, dependencies array, cleanup functions, API calls
5. **Given** component has conditional rendering, **When** auditing, **Then** documents: if/else branches, ternary operators, &&/|| logic, loading states, error states
6. **Given** component has forms, **When** auditing, **Then** flags as "HIGH RISK - Test Thoroughly" + documents validation rules, error handling, submission logic
7. **Given** audit complete, **When** migrating, **Then** uses audit as checklist: "✅ Preserved useState for email, ✅ Preserved handleSubmit, ✅ Preserved validation"
8. **Given** migration complete, **When** testing, **Then** verifies ALL audited logic works: state updates, events fire, API calls succeed, validation works

---

### User Story 5 - 100% Clean Replacement Enforcement (Priority: P1)

**Actor**: Developer  
**Goal**: Migrate component with ZERO hybrid patterns (old+new classes mixed), achieving 100% design token usage

**Why this priority**: Hybrid patterns (mixing `bg-slate-700` and `bg-surface`) create confusion, inconsistency, and accumulate technical debt. Industry standard requires complete replacement.

**Independent Test**: Component before: 50 instances of `bg-slate-*`, 30 instances of `text-gray-*`. Component after: ZERO hardcoded classes, ALL replaced with design tokens. Verification commands confirm 0/0/0 matches.

**Acceptance Scenarios**:

1. **Given** component has hardcoded classes, **When** migrating, **Then** replaces ALL instances (not just some): `bg-slate-700` → `bg-surface`, `text-gray-300` → `text-muted-foreground`
2. **Given** component has manual dark mode, **When** migrating, **Then** removes ALL `dark:` classes: `dark:bg-slate-800` → DELETED (CSS variables handle theme)
3. **Given** component has hardcoded typography, **When** migrating, **Then** replaces ALL instances: `text-2xl font-bold` → `text-heading-2`, `text-sm` → `text-body-small`
4. **Given** component has hardcoded borders, **When** migrating, **Then** replaces ALL: `border-gray-200 dark:border-slate-700` → `border-border`
5. **Given** migration complete, **When** searching for old patterns, **Then** grep returns ZERO matches for: `bg-slate-`, `text-gray-`, `dark:`, hardcoded fonts
6. **Given** component uses centralized components, **When** migrating inputs, **Then** replaces: `<input className="w-full bg-surface...">` → `<input className="form-input w-full">`
7. **Given** component partially migrated, **When** verifying, **Then** verification fails with error "INCOMPLETE MIGRATION - Found 5 instances of bg-slate-*. Must be 0."
8. **Given** verification passes (0/0/0), **When** marking complete, **Then** component qualifies as "✅ Complete" in migration tracker

---

### User Story 6 - Mobile-First Responsive Testing (Priority: P1)

**Actor**: Developer  
**Goal**: Test component at 5 breakpoints (mobile 320px, mobile 375px, tablet 768px, desktop 1024px, wide 1440px) to ensure responsive design works

**Why this priority**: Constitution mandates mobile-first design. Previous migrations missed responsive issues (modals too wide, text too small, buttons unreachable on mobile).

**Independent Test**: Developer tests migrated modal: 320px (fits on iPhone SE, padding reduced, buttons stack), 768px (modal widens, buttons inline), 1024px (desktop layout). All breakpoints render correctly.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** testing responsiveness, **Then** MUST test at 5 breakpoints: 320px, 375px, 768px, 1024px, 1440px
2. **Given** testing at 320px, **When** component renders, **Then** verifies: no horizontal scroll, text readable (min 14px), touch targets ≥44x44px, buttons accessible
3. **Given** testing modals at 320px, **When** modal opens, **Then** verifies: modal fits screen (max-w-[calc(100vw-2rem)]), padding appropriate (p-4 not p-8), content scrollable if needed
4. **Given** testing forms at 320px, **When** inputs rendered, **Then** verifies: inputs stack vertically, labels visible, no text overflow, submit button full-width
5. **Given** testing at 768px (tablet), **When** component renders, **Then** verifies: layout adapts (2-column grids if appropriate), modals centered, navigation accessible
6. **Given** testing at 1024px+ (desktop), **When** component renders, **Then** verifies: optimal spacing used, modals max-width enforced, desktop-specific features work
7. **Given** responsive testing complete, **When** documenting, **Then** creates screenshot or screen recording showing component at all 5 breakpoints
8. **Given** ANY breakpoint fails, **When** fixing, **Then** re-tests ALL breakpoints (fixes can affect other sizes)

---

### User Story 7 - Accessibility Validation (Priority: P2)

**Actor**: Developer  
**Goal**: Verify component meets WCAG 2.1 AA standards for contrast, keyboard navigation, ARIA labels, and focus management

**Why this priority**: Constitution mandates accessibility compliance. Components must be usable by everyone, including keyboard-only users and screen reader users.

**Independent Test**: Developer tests migrated form: Tabs through all inputs (focus visible), presses Enter to submit (works), runs contrast checker (all text passes 4.5:1), screen reader announces field labels correctly.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** testing accessibility, **Then** runs contrast checker on ALL text elements (body text, headings, labels, placeholders)
2. **Given** testing contrast, **When** checking text on background, **Then** MUST pass WCAG 2.1 AA: body text ≥4.5:1, large text (18px+) ≥3:1
3. **Given** component has interactive elements, **When** testing keyboard navigation, **Then** verifies: Tab key moves focus logically, Enter/Space activate buttons, Escape closes modals
4. **Given** component has forms, **When** testing, **Then** verifies: each input has visible label OR aria-label, error messages associated with inputs, required fields marked
5. **Given** component has modals, **When** testing, **Then** verifies: focus trapped in modal, Escape closes modal, focus returns to trigger element after close
6. **Given** component has buttons, **When** testing, **Then** verifies: focus ring visible (not disabled), button purpose clear from text/aria-label, disabled state communicated
7. **Given** component has custom icons, **When** testing, **Then** verifies: decorative icons have aria-hidden="true", functional icons have aria-label
8. **Given** accessibility tests pass, **When** documenting, **Then** notes in commit message "WCAG 2.1 AA compliant - contrast checked, keyboard tested"

---

### User Story 8 - Build Validation and Error Prevention (Priority: P2)

**Actor**: Developer  
**Goal**: Run TypeScript type check and build process BEFORE committing to catch type errors, import issues, and build failures

**Why this priority**: Committing code that doesn't compile breaks CI/CD, blocks team members, wastes time. Pre-commit validation prevents this.

**Independent Test**: Developer completes migration, runs `npx tsc --noEmit`, sees 0 errors. Runs `npm run build`, build succeeds. Commits with confidence.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** preparing to commit, **Then** MUST run `npx tsc --noEmit --project .` FIRST
2. **Given** TypeScript check runs, **When** type errors found, **Then** displays: file path, line number, error message, affected code
3. **Given** type errors exist, **When** developer reviews, **Then** fixes errors (usually: missing imports, incorrect prop types, unused variables) and re-runs check
4. **Given** TypeScript passes (0 errors), **When** proceeding, **Then** runs `npm run build` to verify production build succeeds
5. **Given** build fails, **When** reviewing error, **Then** common causes: circular dependencies, missing environment variables, incorrect Next.js config
6. **Given** build succeeds, **When** checking output, **Then** verifies: bundle size reasonable (no major increase), no warnings about missing modules
7. **Given** both checks pass, **When** committing, **Then** includes in commit message "Build: ✅ TypeScript check passed, build successful"
8. **Given** checks fail, **When** attempting to commit, **Then** BLOCKED with error "Pre-commit validation failed - fix TypeScript/build errors first"

---

### User Story 9 - Git Commit Standards and Batch Commits (Priority: P2)

**Actor**: Developer  
**Goal**: Create batch commits (3-5 related components per commit) with descriptive messages and user approval, enabling efficient progress tracking

**Why this priority**: Tasks.md mandates user approval before commits. Batch commits (3-5 components) balance efficiency with rollback granularity. Single-component commits create excessive noise in git history.

**Independent Test**: Git history shows: "Migrate InstallerSignupModal, Hero, QuoteOptionsModal to design tokens - 45 violations fixed, all themes tested". Commit includes verification summary, user approved before commit.

**Acceptance Scenarios**:

1. **Given** 3-5 components migrated, **When** preparing commit, **Then** presents validation results to user for approval (build status, verification summary, files changed)
2. **Given** creating commit message, **When** writing, **Then** uses format: "Migrate: [Component1], [Component2], [Component3] - [Summary]"
3. **Given** commit message examples, **When** following format, **Then** uses: "Migrate: InstallerSignupModal, Hero, QuoteOptionsModal - Design token compliance. Total violations: 45→0. All themes tested."
4. **Given** commit includes changes, **When** reviewing, **Then** verifies: ONLY files related to those components changed (no unrelated changes)
5. **Given** multiple batches migrated in session, **When** committing, **Then** creates batch commits (3-5 components each, not all at once)
6. **Given** commit message written, **When** including details, **Then** adds: per-component violations, testing confirmation, build status
7. **Given** user approval received, **When** committing, **Then** proceeds with commit (never commit without approval per tasks.md)
8. **Given** commit needs rollback later, **When** reverting, **Then** reverts batch (3-5 components), can identify specific component issue from commit message

---

### User Story 10 - Documentation and Spec Updates (Priority: P3)

**Actor**: Developer  
**Goal**: Update migration tracker, tasks.md, and changelog AFTER completing migration (not during) to reflect current status

**Why this priority**: Over-documentation during migration slows work. Constitution says: document when necessary, not for every small change. Update tracker for visibility, but don't create new docs for each component unless specifically requested.

**Independent Test**: Developer completes 3 components, updates migration tracker with status changes, marks tasks complete in tasks.md, adds single entry to changelog summarizing the day's work. No per-component documentation files created unless problems discovered.

**Acceptance Scenarios**:

1. **Given** component migration complete, **When** updating docs, **Then** updates ONLY migration tracker and tasks.md (no new doc files unless specifically requested)
2. **Given** updating migration tracker, **When** editing table, **Then** changes: Status (⏳ → ✅), Violations After (50 → 0), Date (current date), Commit (hash), Notes (brief summary)
3. **Given** updating tasks.md, **When** marking task complete, **Then** changes: `- [ ]` → `- [x]`, adds verification results, adds commit reference
4. **Given** multiple components completed in day, **When** updating changelog, **Then** creates ONE entry summarizing all work: "November 4, 2025 - Migrated 3 components (InstallerSignup, Hero, QuoteOptions) - 65 violations fixed"
5. **Given** discovering important lesson during migration, **When** documenting, **Then** adds to MIGRATION-PAIN-POINTS.md or DESIGN-SYSTEM-SOT.md "Lessons Learned" section
6. **Given** migration tracker updated, **When** calculating progress, **Then** updates: "Components Migrated: 8/15 (53%)", "Design System Compliance: 75%", "Violations Fixed: 180/285 (63%)"
7. **Given** no major issues during migration, **When** completing work, **Then** does NOT create: separate report doc, detailed analysis doc, lessons learned doc (unless specifically asked)
8. **Given** spec or tasks file needs update for discovered requirements, **When** updating, **Then** adds new task to tasks.md with context, updates spec.md functional requirements if scope changed

---

### Edge Cases

**System Health Issues**:
- What happens when GATE 0 checks fail mid-project (system worked yesterday, broken today)?
  - STOP all migration work immediately
  - Document exact failure in issue tracker
  - Fix system issue (likely: someone committed broken CSS variables, missing class)
  - Re-run GATE 0 on ALL components (not just new ones)
  - Resume work only after 100% system health confirmed

**Partial Migration Scenarios**:
- What happens when component 80% migrated but developer discovers blocker (missing design token, unclear pattern)?
  - DO NOT commit partial work
  - DO NOT mark component as "in progress" in tracker if permanently blocked
  - Create GitHub issue documenting: component name, blocker details, missing token/pattern needed
  - Mark component as "❌ Blocked" in tracker with issue reference
  - Move to next component (come back after blocker resolved)

**Multi-Developer Conflicts**:
- What happens when two developers migrate components touching same shared files (globals.css, Button.tsx)?
  - First commit wins (other developer rebases)
  - Second developer re-runs GATE 0 after rebase (verify system still healthy)
  - Second developer re-tests their component (shared file changes might affect behavior)
  - Merge conflict resolution: prioritize working code over consistency (test thoroughly)

**Theme-Specific Bugs**:
- What happens when component works in Dark theme but breaks in Light/Purple theme?
  - Component is NOT complete (cannot mark ✅)
  - Debug using browser DevTools → Elements → Computed Styles → check CSS variable values
  - Common causes: used `bg-background` instead of `bg-surface`, forgot to update globals.css light/purple themes
  - Fix CSS variables OR component class usage
  - Re-test ALL 3 themes (fix might affect others)

**Build Failures After Migration**:
- What happens when TypeScript/build passes locally but fails in CI/CD?
  - Common cause: missing environment variables in CI (usually not migration-related)
  - Verify: Does build fail on main branch too? (if yes, not your migration)
  - Check CI logs for specific error (often: missing .env variables, Node version mismatch)
  - If truly migration-caused: revert commit, fix locally, re-test build, recommit

**False Positive Verification**:
- What happens when verification passes but component still has hardcoded values?
  - Verification regex incomplete (rare, but possible)
  - Manual code review catches what automated check missed
  - Update verification regex in this spec + DESIGN-SYSTEM-SOT.md
  - Re-run updated verification on ALL completed components (some might fail now)
  - Fix any newly detected violations

**Accessibility Failures**:
- What happens when component passes visual tests but fails accessibility?
  - Component NOT complete until accessibility passes
  - Common failures: contrast too low, focus ring invisible, missing ARIA labels
  - Use browser DevTools Lighthouse → Accessibility tab for detailed report
  - Fix issues (usually: adjust colors for contrast, add aria-labels, ensure focus visible)
  - Re-run full accessibility checklist

**Legacy Code Conflicts**:
- What happens when migrating component that imports deprecated/legacy components?
  - Document dependency in audit report
  - Option A: Migrate dependent component first (better, but might expand scope)
  - Option B: Keep legacy import temporarily, mark as technical debt in migration tracker notes
  - Create GitHub issue: "Refactor [Component] to remove legacy dependency on [LegacyComponent]"
  - Complete current migration, address dependency in separate PR

---

## Requirements *(mandatory)*

### Functional Requirements

#### Pre-Flight Checks (GATE 0)

- **FR-001**: System MUST provide GATE 0 health check script that validates design system completeness before any migration work
- **FR-002**: GATE 0 MUST verify CSS variables exist for all required semantic tokens in ALL 3 themes (dark, light, purple)
- **FR-003**: GATE 0 MUST verify centralized components exist and are importable (Button, AuthInput, AuthModal, etc.)
- **FR-004**: GATE 0 MUST verify theme-card class uses CSS variables (--color-surface) not hardcoded colors
- **FR-005**: GATE 0 MUST verify .form-input class exists with complete neumorphic styling
- **FR-006**: System MUST block migration work if ANY GATE 0 check fails until issue resolved
- **FR-007**: GATE 0 MUST display actionable error messages: exact missing variable, file path, line number to add

#### Verification and Quality Assurance

- **FR-008**: System MUST provide 6 comprehensive verification commands detecting all types of hardcoded values
- **FR-009**: Verification command 1 MUST detect: `bg-slate-*`, `text-gray-*`, `text-zinc-*`, `border-slate-*`, `border-gray-*`
- **FR-010**: Verification command 2 MUST detect: `dark:` prefixes (manual theme classes)
- **FR-011**: Verification command 3 MUST detect: `rgba()`, `rgb()`, `#hex` colors (excluding SVG attributes)
- **FR-012**: Verification command 4 MUST detect: `text-white`, `bg-white`, `text-black`, `bg-black`
- **FR-013**: Verification command 5 MUST detect: `text-xs`, `text-sm`, `text-lg`, `text-xl`, `font-bold`, `font-semibold` (hardcoded typography)
- **FR-014**: Verification command 6 MUST detect: manual responsive classes without semantic tokens (`sm:text-5xl`, `md:text-6xl` without `text-heading-*`)
- **FR-015**: All verification commands MUST return zero matches for component to qualify as complete
- **FR-016**: Verification MUST be run AFTER migration and BEFORE commit (gating mechanism)

#### Multi-Theme Testing

- **FR-017**: System MUST enforce testing in ALL 3 themes (Dark, Light, Purple) before completion
- **FR-018**: Dark theme test MUST verify: background #121212, foreground #F3F4F6, shadows visible, orange accent
- **FR-019**: Light theme test MUST verify: background #E0E5EC, foreground #121212, neumorphic shadows visible, dark accent
- **FR-020**: Purple theme test MUST verify: background #2C1D4D, foreground #E9E3FF, purple shadows visible, lavender accent
- **FR-021**: Multi-theme test MUST verify: forms readable, buttons contrast properly, modals visible in all themes
- **FR-022**: If ANY theme fails, component MUST be marked incomplete and fixed before proceeding

#### Logic Preservation

- **FR-023**: Developer MUST create logic audit report BEFORE touching component code
- **FR-024**: Logic audit MUST document: all state variables (useState, useReducer, useContext)
- **FR-025**: Logic audit MUST document: all event handlers (onClick, onChange, onSubmit, onBlur, etc.)
- **FR-026**: Logic audit MUST document: all side effects (useEffect, API calls, cleanup functions)
- **FR-027**: Logic audit MUST document: conditional rendering logic (if/else, ternaries, loading states)
- **FR-028**: Form components MUST be flagged "HIGH RISK - Test Thoroughly" with validation rules documented
- **FR-029**: Migration MUST preserve ALL audited logic (zero functional regressions)
- **FR-030**: Post-migration testing MUST verify ALL audited functionality works identically

#### 100% Clean Replacement

- **FR-031**: Component migration MUST achieve 100% replacement (no hybrid old+new patterns allowed)
- **FR-032**: ALL instances of hardcoded classes MUST be replaced (not just some)
- **FR-033**: ALL manual dark mode classes (`dark:*`) MUST be removed (CSS variables handle theming)
- **FR-034**: ALL hardcoded typography MUST be replaced with semantic tokens (`text-heading-*`, `text-body-*`)
- **FR-035**: Component MUST use centralized components where applicable (Button, form-input, AuthInput)
- **FR-036**: Component MUST pass verification (0/0/0/0/0/0 across all 6 commands) to be marked complete
- **FR-037**: Partial migrations are FORBIDDEN (component fully migrated or not at all)

#### Responsive Design Testing

- **FR-038**: Component MUST be tested at 5 breakpoints: 320px, 375px, 768px, 1024px, 1440px
- **FR-039**: At 320px, component MUST: fit screen (no horizontal scroll), text ≥14px, touch targets ≥44x44px
- **FR-040**: Modals at mobile sizes MUST: fit screen with margin, use reduced padding (p-4 not p-8), scroll if needed
- **FR-041**: Forms at mobile MUST: stack inputs vertically, show visible labels, have full-width submit buttons
- **FR-042**: Responsive testing MUST be documented (screenshots or screen recording at all breakpoints)

#### Accessibility Compliance

- **FR-043**: Component MUST pass WCAG 2.1 AA contrast requirements: body text ≥4.5:1, large text ≥3:1
- **FR-044**: Component MUST support keyboard navigation: Tab moves focus, Enter/Space activate, Escape closes modals
- **FR-045**: Forms MUST have: visible labels or aria-labels, associated error messages, marked required fields
- **FR-046**: Modals MUST: trap focus, close on Escape, return focus to trigger after close
- **FR-047**: Interactive elements MUST have: visible focus rings, clear purpose (text or aria-label), disabled state communication
- **FR-048**: Decorative icons MUST have aria-hidden="true", functional icons MUST have aria-label

#### Build Validation

- **FR-049**: Developer MUST run `npx tsc --noEmit` before committing (TypeScript type check)
- **FR-050**: Developer MUST run `npm run build` before committing (production build verification)
- **FR-051**: TypeScript errors MUST be fixed before commit is allowed
- **FR-052**: Build failures MUST be investigated and resolved before commit
- **FR-053**: Build success MUST be documented in commit message

#### Git Commit Standards

- **FR-054**: Commits MUST be batched (3-5 related components per commit) with user approval required before committing
- **FR-055**: Commit messages MUST follow format: "Migrate: [Component1], [Component2], [Component3] - [Summary]"
- **FR-056**: Commits MUST include ONLY files related to those components (no unrelated changes)
- **FR-057**: Commit messages MUST include: per-component violations, testing confirmation, build status
- **FR-058**: Developer MUST present validation results to user and wait for approval before committing (never commit without approval)

#### Documentation Standards

- **FR-059**: Developer MUST update migration tracker after completing component
- **FR-060**: Developer MUST update tasks.md status after completing tasks
- **FR-061**: Developer MUST add changelog entry summarizing day's work (not per component)
- **FR-062**: Developer MUST NOT create new documentation files unless specifically requested
- **FR-063**: Important lessons MUST be added to MIGRATION-PAIN-POINTS.md or DESIGN-SYSTEM-SOT.md "Lessons Learned"
- **FR-064**: Discovered scope changes MUST be added to tasks.md and spec.md functional requirements

### Key Entities *(data tracked)*

- **Component Migration Record**:
  - Component name
  - File path
  - Status (Not Started, In Progress, Complete, Blocked)
  - Violations before (count)
  - Violations after (count, must be 0)
  - Date completed
  - Commit hash
  - Theme testing results (Dark: pass/fail, Light: pass/fail, Purple: pass/fail)
  - Responsive testing results (5 breakpoints documented)
  - Accessibility testing results (WCAG 2.1 AA pass/fail)
  - Build validation results (TypeScript pass/fail, Build pass/fail)
  - Notes (blockers, lessons learned, technical debt)

- **GATE 0 Health Check Result**:
  - Check name
  - Pass/Fail status
  - Expected result
  - Actual result
  - Error message (if failed)
  - Fix instructions (if failed)
  - Timestamp

- **Verification Command Result**:
  - Command number (1-6)
  - Pattern searched
  - Match count (must be 0)
  - Matched lines (if > 0)
  - File paths with violations
  - Pass/Fail status

- **Logic Audit Report**:
  - Component name
  - State variables inventory
  - Event handlers inventory
  - Side effects inventory
  - Conditional logic map
  - High-risk areas flagged
  - Preservation checklist

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero system health failures - GATE 0 checks pass 100% before any migration work begins
- **SC-002**: Zero false completions - All components marked "complete" have 0/0/0/0/0/0 verification results (not 3/0/1/0/0/2)
- **SC-003**: Zero theme-specific bugs - Components work identically in all 3 themes (Dark, Light, Purple)
- **SC-004**: Zero functional regressions - All audited logic preserved, components behave identically after migration
- **SC-005**: 100% clean replacements - No hybrid patterns exist (all hardcoded classes fully replaced with design tokens)
- **SC-006**: Zero mobile issues - All components tested at 5 breakpoints, pass responsive design requirements
- **SC-007**: 100% accessibility compliance - All components pass WCAG 2.1 AA (contrast, keyboard, ARIA)
- **SC-008**: Zero build failures - All migrations pass TypeScript check and build before commit
- **SC-009**: 100% atomic commits - Git history shows one component per commit (not batched)
- **SC-010**: Zero over-documentation - Migration tracker updated, no unnecessary per-component docs created unless requested
- **SC-011**: Faster rework cycles - Time from "migration complete" to "actually complete" reduces by 80% (fewer rework cycles due to comprehensive up-front verification)
- **SC-012**: Higher first-time quality - 90%+ of migrations pass all checks on first verification run (not second or third)

---

## Assumptions

1. **Design system completeness**: Assumes design token system is 100% complete (all needed tokens exist in CSS variables and Tailwind config)
2. **Reference components available**: Assumes centralized components (Button, AuthInput, etc.) exist and are stable
3. **Multi-theme infrastructure**: Assumes ThemeSwitcher and 3-theme CSS architecture already implemented (Phase 0.2 complete)
4. **Developer environment**: Assumes developers have access to browser DevTools, can run PowerShell commands, have Node.js/npm installed
5. **Constitution alignment**: Assumes project follows constitution.md standards (Next.js App Router, TypeScript strict mode, atomic commits)
6. **Testing tools**: Assumes manual testing with browser DevTools is acceptable (no automated E2E test suite required)
7. **Single branch workflow**: Assumes migration work happens on dedicated feature branch (not main/production)
8. **Code review process**: Assumes PRs are reviewed before merge (atomic commits + verification results enable easier review)
9. **No breaking changes**: Assumes migrations are purely visual refactoring (no API changes, no data model changes)
10. **Documentation discipline**: Assumes developers will follow "update tracker + tasks.md only" guidance (not create excessive docs)

---

## Dependencies

1. **Design System Foundation** (Phase 0, 0.2 complete):
   - CSS variables defined in globals.css for all 3 themes
   - Design token TypeScript files in src/design-tokens/
   - Tailwind config extended with semantic tokens
   - ThemeProvider and ThemeSwitcher components

2. **Centralized Components** (Phase 2 complete):
   - Button component (src/components/ui/button.tsx)
   - AuthInput component (src/components/auth/AuthInput.tsx)
   - Form classes (.form-input, .form-select in globals.css)
   - Theme classes (.theme-card in globals.css)

3. **Documentation** (existing):
   - DESIGN-SYSTEM-SOT.md (design token reference)
   - MIGRATION-PAIN-POINTS.md (lessons learned)
   - constitution.md (project standards)
   - Component audit reports (logic preservation templates)

4. **Development Environment**:
   - Node.js 18+ and npm
   - TypeScript 5.3.3+
   - Next.js 14+
   - PowerShell (for verification commands)
   - Modern browser with DevTools (Chrome, Firefox, Safari)

5. **Git Workflow**:
   - Feature branch created (007-migration-and-build)
   - Main branch as merge target
   - PR process for review

---

## Out of Scope

1. **Automated Testing**: E2E tests, visual regression tests, unit tests for components (manual testing only)
2. **CI/CD Configuration**: GitHub Actions, pre-commit hooks, automated verification in CI (manual verification only)
3. **Design Token Changes**: Modifying existing token values, adding new tokens (use what exists)
4. **New Component Creation**: Creating new components from scratch (spec covers migration of existing components only)
5. **Functionality Changes**: Adding new features, changing business logic, modifying APIs (visual refactoring only)
6. **Performance Optimization**: Bundle size reduction, code splitting, lazy loading (not primary goal)
7. **Backend Work**: Database changes, API modifications, server-side logic (frontend only)
8. **Third-Party Library Integration**: Adding shadcn/ui, Material-UI, or other component libraries (custom components only)
9. **Legacy Code Cleanup**: Removing unused files, refactoring old patterns not related to design system (focused scope only)
10. **Cross-Browser Compatibility**: Testing on Internet Explorer, older browsers (modern browsers only: Chrome, Firefox, Safari)

---

## Notes

### Relationship to Existing Specs

This specification (007-migration-and-build) is the **EXECUTION STANDARDS** spec. It does NOT replace:

- **006-component-by-component** (spec.md, tasks.md): Defines WHAT components to migrate, in what order, with what priority
- **DESIGN-SYSTEM-SOT.md**: Defines WHAT design tokens exist, HOW to use them, color theory, component patterns
- **constitution.md**: Defines project-wide standards, architecture decisions, workflow principles

This spec defines **HOW to execute migration work correctly** so you stop repeating the 15 pain points.

### When to Use This Spec

**✅ Use this spec when:**
- Starting ANY component migration (run GATE 0 first)
- Verifying migration completion (run all 6 verification commands)
- Testing component in themes (test all 3, not just 1)
- Creating logic audit (follow audit report template)
- Committing migration work (follow atomic commit rules)
- Unsure if migration is truly "done" (check all success criteria)

**❌ Don't use this spec for:**
- Deciding WHICH component to migrate next (see 006-component-by-component/tasks.md)
- Looking up WHICH design token to use (see DESIGN-SYSTEM-SOT.md)
- Understanding project architecture (see constitution.md)
- Creating new features (create separate feature spec)

### Migration Workflow Summary

```
1. Run GATE 0 (health check) → Must pass 100% before starting
2. Create logic audit report → Document all functionality to preserve
3. Run verification (pre-migration) → Document current violation count
4. Migrate component → Replace hardcoded classes with design tokens
5. Run verification (post-migration) → Must show 0/0/0/0/0/0
6. Test all 3 themes → Dark, Light, Purple must all work
7. Test responsive (5 breakpoints) → 320px, 375px, 768px, 1024px, 1440px
8. Test accessibility (WCAG 2.1 AA) → Contrast, keyboard, ARIA
9. Test functionality → Verify all audited logic works
10. Run TypeScript check → npx tsc --noEmit (must pass)
11. Run build → npm run build (must succeed)
12. Commit atomically → One component per commit
13. Update tracker + tasks.md → Mark complete with results
```

**Total Time Estimate** (per component):
- Simple component (Hero, 6 violations): ~2 hours
- Medium component (Modal, 10-20 violations): ~3-4 hours  
- Complex component (InstantQuoteForm, 50+ violations): ~6-8 hours

### Common Mistakes and How This Spec Prevents Them

| Pain Point (from MIGRATION-PAIN-POINTS.md) | How This Spec Prevents It |
|---------------------------------------------|---------------------------|
| Wrong background class usage | GATE 0 verifies theme-card uses --color-surface (FR-004) |
| Not following SOT/spec | GATE 0 checks reference docs exist (FR-001) |
| No pre-migration audit/checklist | Logic audit mandatory (FR-023 to FR-030) |
| Missing mobile responsiveness | 5-breakpoint testing required (FR-038 to FR-042) |
| Hardcoded color classes | 6 verification commands detect ALL patterns (FR-008 to FR-015) |
| Lack of systematic prevention | This entire spec IS the prevention system |
| Theme color inconsistency | Multi-theme testing enforced (FR-017 to FR-022) |
| No pre/post mandatory workflow | 13-step workflow defined above |
| Partial migration, false reporting | 100% clean replacement required, 0/0/0 verification (FR-031 to FR-037) |
| Inadequate testing/validation | Testing requirements across 4 dimensions: themes, responsive, accessibility, functionality |
| Overcomplicated migration process | Workflow simplified to 13 clear steps, no confusion |
| No mobile-first approach | Mobile testing at 320px mandatory first breakpoint (FR-039) |
| No legacy cleanup | Out of scope (focused only on design system compliance) |
| Too much documentation | FR-062: "MUST NOT create new docs unless requested" |
| Layout consistency issues | Out of scope (constitution.md handles layout, this spec handles execution) |

---

## Approval and Sign-Off

**Created By**: AI Development Assistant  
**Date**: November 4, 2025  
**Status**: Draft - Awaiting Specification Quality Validation

**Next Steps**:
1. Run specification quality validation (checklist creation)
2. Address any validation issues
3. Resolve clarifications (if any [NEEDS CLARIFICATION] markers remain)
4. Obtain user approval
5. Proceed to implementation (update constitution.md, create GATE 0 script, update DESIGN-SYSTEM-SOT.md with verification commands)
