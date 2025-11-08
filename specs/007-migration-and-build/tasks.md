# Tasks: Migration and Build Execution Standards

**Feature Branch**: `007-migration-and-build`  
**Input**: Design documents from `/specs/007-migration-and-build/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md  
**Tests**: Not required - this is an instruction set for migration execution  
**Organization**: Tasks organized by capability area to enable systematic implementation

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US10, Setup, Foundation)
- File paths follow project structure conventions

---

## ⚠️ IMPORTANT: This is NOT a Component Migration Plan

This tasks.md defines how to BUILD the migration execution system itself (GATE 0 script, verification commands, documentation updates). This is NOT a list of components to migrate.

**When components need migration**: Follow the 13-step workflow in `plan.md`.

---

## Phase 1: Foundation - Design System Health Check (US1: P0) 🎯 BLOCKING

**Goal**: Create GATE 0 health check script that validates design system completeness before any migration work

**Independent Test**: Run GATE 0 script → All checks pass (CSS variables exist, centralized components exist, theme classes use tokens) → Script outputs "✅ GATE 0 PASS - System healthy"

### Tasks:

- [ ] T001 [P] [US1] Create GATE 0 health check script in `.specify/scripts/powershell/gate-0-health-check.ps1`
- [ ] T002 [P] [US1] Implement Check 1: CSS variables verification (scan `src/styles/globals.css` for required CSS variables in all 3 themes)
- [ ] T003 [P] [US1] Implement Check 2: Centralized components verification (verify Button, AuthInput, AuthModal files exist and export correctly)
- [ ] T004 [P] [US1] Implement Check 3: Semantic classes verification (verify `.form-input`, `.theme-card` exist in globals.css with CSS variable usage)
- [ ] T005 [P] [US1] Implement Check 4: Theme-card validation (verify `.theme-card` uses `--color-surface` not hardcoded colors)
- [ ] T006 [US1] Add error reporting with actionable messages (display exact missing variable, file path, line number to add)
- [ ] T007 [US1] Add success confirmation output (display "GATE 0: ✅ PASS - System healthy, ready for migration")
- [ ] T008 [US1] Test GATE 0 script: Run with healthy system → Passes, run with missing variable → Fails with clear error

**Checkpoint**: ✅ GATE 0 script complete and tested, ready for use in migration workflow

---

## Phase 2: Foundation - Verification Command System (US2: P0) 🎯 BLOCKING

**Goal**: Document and validate 6 comprehensive verification commands that detect ALL types of hardcoded values

**Independent Test**: Run all 6 commands on a component with hardcoded values → Commands detect gray/slate colors, dark: classes, rgba(), text-white, hardcoded fonts, manual responsive classes → Run on clean component → All commands return 0 matches

### Tasks:

- [ ] T009 [P] [US2] Document verification command 1 in `DESIGN-SYSTEM-SOT.md` (hardcoded gray/slate/zinc colors pattern)
- [ ] T010 [P] [US2] Document verification command 2 in `DESIGN-SYSTEM-SOT.md` (dark: prefix pattern)
- [ ] T011 [P] [US2] Document verification command 3 in `DESIGN-SYSTEM-SOT.md` (RGB/RGBA/HEX colors pattern with SVG exclusions)
- [ ] T012 [P] [US2] Document verification command 4 in `DESIGN-SYSTEM-SOT.md` (hardcoded white/black pattern)
- [ ] T013 [P] [US2] Document verification command 5 in `DESIGN-SYSTEM-SOT.md` (hardcoded typography sizes pattern)
- [ ] T014 [P] [US2] Document verification command 6 in `DESIGN-SYSTEM-SOT.md` (manual responsive classes pattern)
- [ ] T015 [US2] Create verification test suite: Test all 6 commands on known violations → Verify detection works
- [ ] T016 [US2] Create verification examples in `DESIGN-SYSTEM-SOT.md` (show example violations and how commands detect them)

**Checkpoint**: ✅ Verification system documented and tested, ready for use in migration workflow

---

## Phase 3: Foundation - Multi-Theme Testing Standards (US3: P0) 🎯 BLOCKING

**Goal**: Document multi-theme testing requirements and create testing checklist

**Independent Test**: Developer follows theme testing checklist → Tests component in Dark, Light, Purple themes → Verifies colors, shadows, contrast in each theme → Documents "Tested in all 3 themes - pass"

### Tasks:

- [ ] T017 [P] [US3] Document Dark theme testing checklist in `DESIGN-SYSTEM-SOT.md` (background #121212, foreground #F3F4F6, shadows, orange accent)
- [ ] T018 [P] [US3] Document Light theme testing checklist in `DESIGN-SYSTEM-SOT.md` (background #E0E5EC, foreground #121212, neumorphic shadows, dark accent)
- [ ] T019 [P] [US3] Document Purple theme testing checklist in `DESIGN-SYSTEM-SOT.md` (background #2C1D4D, foreground #E9E3FF, purple shadows, lavender accent)
- [ ] T020 [P] [US3] Create form-specific theme testing guidelines (input visibility, borders, focus states, placeholder text)
- [ ] T021 [P] [US3] Create button-specific theme testing guidelines (contrast with background, text readability, hover states)
- [ ] T022 [US3] Add theme testing to `plan.md` steps 6-8 (reference DESIGN-SYSTEM-SOT.md checklists)

**Checkpoint**: ✅ Theme testing standards documented, ready for use in migration workflow

---

## Phase 4: Logic Preservation Guidelines (US4: P1)

**Goal**: Document logic preservation audit process (kept in memory, not file creation)

**Independent Test**: Developer migrates form component → Mentally audits state/handlers/effects → Preserves all logic → Form works identically after migration

### Tasks:

- [ ] T023 [P] [US4] Document mental logic audit checklist in `plan.md` Step 2 (state variables, event handlers, side effects, conditional rendering)
- [ ] T024 [P] [US4] Document HIGH RISK flags in `plan.md` (forms with validation, API calls, complex state management)
- [ ] T025 [P] [US4] Add exception rule to `plan.md`: Only create audit file if component is highly complex (>500 lines, >10 state variables) or blocked
- [ ] T026 [US4] Add logic preservation testing to `plan.md` Step 11 (verify state updates, events fire, API calls work, validation works)

**Checkpoint**: ✅ Logic preservation guidelines documented, developers know what to preserve

---

## Phase 5: 100% Clean Replacement Standards (US5: P1)

**Goal**: Document design token replacement patterns and enforce 100% compliance

**Independent Test**: Developer migrates component → Replaces ALL hardcoded classes → Verification returns 0/0/0/0/0/0 → No hybrid patterns exist

### Tasks:

- [ ] T027 [P] [US5] Document common replacement patterns in `DESIGN-SYSTEM-SOT.md` (bg-slate-700 → bg-surface, text-gray-300 → text-muted-foreground, etc.)
- [ ] T028 [P] [US5] Document dark mode removal pattern in `DESIGN-SYSTEM-SOT.md` (dark:bg-slate-800 → DELETE, explain CSS variables handle theming)
- [ ] T029 [P] [US5] Document typography replacement patterns in `DESIGN-SYSTEM-SOT.md` (text-2xl font-bold → text-heading-2, text-sm → text-body-small)
- [ ] T030 [P] [US5] Document centralized component usage in `DESIGN-SYSTEM-SOT.md` (when to use form-input class, when to use Button component)
- [ ] T031 [US5] Add "NO hybrid patterns" rule to `plan.md` Step 4 (component must be 100% clean or not migrated)
- [ ] T032 [US5] Add verification requirement to `plan.md` Step 5 (MUST be 0/0/0/0/0/0 before proceeding)

**Checkpoint**: ✅ Replacement standards documented, developers know exact token mappings

---

## Phase 6: Responsive Testing Standards (US6: P1)

**Goal**: Document mobile-first responsive testing requirements at 5 breakpoints

**Independent Test**: Developer tests component at 320px, 375px, 768px, 1024px, 1440px → All breakpoints render correctly → No horizontal scroll, touch targets ≥44px, content readable

### Tasks:

- [ ] T033 [P] [US6] Document 320px (iPhone SE) testing checklist in `DESIGN-SYSTEM-SOT.md` (no horizontal scroll, text ≥14px, touch targets ≥44px)
- [ ] T034 [P] [US6] Document 375px (iPhone X) testing checklist in `DESIGN-SYSTEM-SOT.md`
- [ ] T035 [P] [US6] Document 768px (Tablet) testing checklist in `DESIGN-SYSTEM-SOT.md` (layout adapts, modals centered)
- [ ] T036 [P] [US6] Document 1024px (Desktop) testing checklist in `DESIGN-SYSTEM-SOT.md` (optimal spacing, max-width enforced)
- [ ] T037 [P] [US6] Document 1440px (Wide) testing checklist in `DESIGN-SYSTEM-SOT.md` (no excessive stretching, content centered)
- [ ] T038 [P] [US6] Create modal-specific responsive guidelines (max-w-[calc(100vw-2rem)] at mobile, padding p-4 not p-8)
- [ ] T039 [P] [US6] Create form-specific responsive guidelines (inputs stack vertically, labels visible, submit button full-width)
- [ ] T040 [US6] Add responsive testing to `plan.md` Step 9 (reference 5-breakpoint checklist)

**Checkpoint**: ✅ Responsive standards documented, developers know how to test all breakpoints

---

## Phase 7: Accessibility Standards (US7: P2)

**Goal**: Document WCAG 2.1 AA compliance requirements

**Independent Test**: Developer tests component → Contrast passes (≥4.5:1 body, ≥3:1 large), keyboard navigation works (Tab, Enter, Escape), ARIA labels present → Component passes WCAG 2.1 AA

### Tasks:

- [ ] T041 [P] [US7] Document contrast requirements in `DESIGN-SYSTEM-SOT.md` (body text ≥4.5:1, large text ≥3:1, tools to use)
- [ ] T042 [P] [US7] Document keyboard navigation requirements in `DESIGN-SYSTEM-SOT.md` (Tab moves focus, Enter/Space activate, Escape closes modals)
- [ ] T043 [P] [US7] Document form accessibility requirements in `DESIGN-SYSTEM-SOT.md` (visible labels or aria-labels, error messages, required fields)
- [ ] T044 [P] [US7] Document modal accessibility requirements in `DESIGN-SYSTEM-SOT.md` (focus trap, Escape closes, focus returns)
- [ ] T045 [P] [US7] Document button accessibility requirements in `DESIGN-SYSTEM-SOT.md` (visible focus ring, clear purpose, disabled state)
- [ ] T046 [P] [US7] Document icon accessibility requirements in `DESIGN-SYSTEM-SOT.md` (decorative icons aria-hidden, functional icons aria-label)
- [ ] T047 [US7] Add accessibility testing to `plan.md` Step 10 (reference WCAG 2.1 AA checklist)

**Checkpoint**: ✅ Accessibility standards documented, developers know WCAG requirements

---

## Phase 8: Build Validation Process (US8: P2)

**Goal**: Document TypeScript and build validation requirements

**Independent Test**: Developer completes migration → Runs `npx tsc --noEmit` (0 errors) → Runs `npm run build` (succeeds) → Commits with confidence

### Tasks:

- [ ] T048 [P] [US8] Document TypeScript check command in `plan.md` Step 12 (`npx tsc --noEmit --project .`)
- [ ] T049 [P] [US8] Document build check command in `plan.md` Step 12 (`npm run build`)
- [ ] T050 [P] [US8] Document common TypeScript errors in `MIGRATION-PAIN-POINTS.md` (missing imports, incorrect prop types, unused variables)
- [ ] T051 [P] [US8] Document common build errors in `MIGRATION-PAIN-POINTS.md` (circular dependencies, missing env variables)
- [ ] T052 [US8] Add build validation to mandatory workflow in `plan.md` (MUST pass before commit)
- [ ] T053 [US8] Add build error protocol to `plan.md` (read error, check spec, fix by aligning, time limit 30min)

**Checkpoint**: ✅ Build validation documented, developers know pre-commit checks

---

## Phase 9: Commit Standards and User Approval (US9: P2)

**Goal**: Document batch commit standards with user approval requirement

**Independent Test**: Developer completes 3 components → Presents validation results to user → User approves → Developer creates batch commit with detailed message

### Tasks:

- [ ] T054 [P] [US9] Document batch commit strategy in `plan.md` Step 13 (3-5 components per commit, user approval required)
- [ ] T055 [P] [US9] Document commit message format in `plan.md` ("Migrate: [C1], [C2], [C3] - Summary")
- [ ] T056 [P] [US9] Create commit message template in `plan.md` (includes per-component violations, testing confirmation, build status)
- [ ] T057 [P] [US9] Document validation results presentation in `plan.md` (build output, files changed, verification summary)
- [ ] T058 [US9] Add "NEVER commit without user approval" rule to mandatory workflow in `plan.md`
- [ ] T059 [US9] Add user approval checkpoint to `plan.md` Step 13 (wait for confirmation before git commit)

**Checkpoint**: ✅ Commit standards documented, user approval workflow clear

---

## Phase 10: Documentation Standards (US10: P3)

**Goal**: Document migration tracker updates and prevent over-documentation

**Independent Test**: Developer completes batch → Updates migration tracker (status, violations, commit hash) → Does NOT create per-component docs unless requested

### Tasks:

- [ ] T060 [P] [US10] Document migration tracker update process in `plan.md` Step 13 (update status, violations, date, commit hash)
- [ ] T061 [P] [US10] Add "NO unnecessary docs" rule to `plan.md` (no per-component audit files unless complex/blocked)
- [ ] T062 [P] [US10] Document when to update tasks.md in `plan.md` (only if spec explicitly requests task tracking)
- [ ] T063 [P] [US10] Document changelog entry format in `MIGRATION-PAIN-POINTS.md` (one entry per batch, not per component)
- [ ] T064 [US10] Add documentation standards to mandatory workflow in `plan.md` (minimal docs, tracker only)

**Checkpoint**: ✅ Documentation standards clear, prevents excessive doc creation

---

## Phase 11: Integration and Constitution Updates

**Goal**: Integrate migration workflow into project-wide standards

**Independent Test**: Developer opens constitution.md → Sees prominent reference to migration spec → Clicks through to plan.md → Follows 13-step workflow for migration work

### Tasks:

- [ ] T065 [Foundation] Update `.github/copilot-instructions.md` with migration workflow reference (already completed ✅)
- [ ] T066 [Foundation] Update constitution.md to reference `specs/007-migration-and-build/plan.md` for all migration work
- [ ] T067 [Foundation] Add migration workflow summary to constitution.md (13 steps, verification commands, user approval)
- [ ] T068 [Foundation] Create quick reference card in `DOC/MIGRATION-QUICK-REFERENCE.md` (one-page workflow summary)
- [ ] T069 [Foundation] Update `DESIGN-SYSTEM-SOT.md` with all verification commands, replacement patterns, testing checklists
- [ ] T070 [Foundation] Update `MIGRATION-PAIN-POINTS.md` with lessons learned section referencing this spec

**Checkpoint**: ✅ Migration workflow integrated into project documentation

---

## Phase 12: Validation and Testing

**Goal**: Validate the migration execution system is complete and usable

**Independent Test**: New developer (or AI agent) reads plan.md → Understands 13-step workflow → Can execute migration without additional guidance

### Tasks:

- [ ] T071 [Validation] Review spec.md: Verify all 10 user stories have corresponding tasks
- [ ] T072 [Validation] Review plan.md: Verify all 13 steps are detailed with commands
- [ ] T073 [Validation] Review DESIGN-SYSTEM-SOT.md: Verify all verification commands, replacement patterns, testing checklists documented
- [ ] T074 [Validation] Review PLAN-SUMMARY.md: Verify quick reference is accurate and complete
- [ ] T075 [Validation] Test GATE 0 script: Run in healthy system → Passes, run in broken system → Fails with clear error
- [ ] T076 [Validation] Test verification commands: Run on component with violations → Detects all issues
- [ ] T077 [Validation] Dry-run migration workflow: Follow plan.md steps for one test component → Verify workflow is clear
- [ ] T078 [Validation] User approval: Present completed migration system to user for final review

**Checkpoint**: ✅ Migration execution system validated and ready for production use

---

## Success Criteria

**This feature is complete when**:
- ✅ GATE 0 health check script exists and works
- ✅ All 6 verification commands documented and tested
- ✅ Multi-theme testing standards documented (Dark, Light, Purple)
- ✅ Logic preservation guidelines documented
- ✅ 100% clean replacement patterns documented
- ✅ Responsive testing standards documented (5 breakpoints)
- ✅ Accessibility standards documented (WCAG 2.1 AA)
- ✅ Build validation process documented
- ✅ Batch commit standards with user approval documented
- ✅ Documentation standards documented (minimal docs)
- ✅ Constitution.md updated to reference migration workflow
- ✅ All documentation integrated (DESIGN-SYSTEM-SOT.md, MIGRATION-PAIN-POINTS.md)
- ✅ System validated through dry-run migration
- ✅ User approval received

**NOT included in this feature**:
- ❌ Migrating actual components (that follows this workflow, not part of building it)
- ❌ Creating new components (separate work)
- ❌ Modifying design system tokens (already complete)

---

## Dependencies

**Requires** (already complete):
- Design system foundation (CSS variables, design tokens, centralized components)
- Three-theme infrastructure (Dark, Light, Purple themes working)
- Existing migration documentation (MIGRATION-PAIN-POINTS.md, DESIGN-SYSTEM-SOT.md)
- Constitution.md (project standards)

**Blocks**:
- All future component migrations (cannot migrate safely without this workflow)
- Component-by-component migration work (spec 006)
- Any design system compliance work

---

## Implementation Strategy

---

## Phase 13: URGENT - Installer Dashboard Navigation Fix (P0) 🚨 CRITICAL

**Added**: November 6, 2025  
**Status**: IN PROGRESS  
**Backup Created**: `backup/installer-nav-fix-20251106-183630`

**Goal**: Fix Installer dashboard navigation to follow Admin dashboard pattern (route-based navigation) while preserving all Lead Feed components and functionality

**Problem Statement**: 
- Current Installer dashboard uses state-based navigation (anti-pattern)
- Only Lead Feed and its components are needed (other tabs are demo content)
- Previous migration attempts created standalone pages, causing issues
- Need simple solution that matches Admin dashboard architecture

**Solution Approach**:
- Keep ALL Lead Feed components exactly as they are (no refactoring)
- Create new route-based structure matching Admin dashboard layout
- Use existing InstallerSidebar and InstallerDashboardHeader components
- Move only Lead Feed to new structure, discard demo tabs

**Source of Truth**: Admin dashboard (`src/app/admin/layout.tsx`, `src/components/AdminSidebar.tsx`)

### Pre-Implementation Audit

**Current Structure**:
```
src/app/installer/dashboard/page.tsx (383 lines)
├── State-based navigation with useState('Lead Feed')
├── Switch statement for renderContent()
├── InstallerLeadFeed component (KEEP AS-IS)
├── Demo tabs: Dashboard Overview, Marketplace, etc. (DISCARD)
└── Handler functions: handleUnlockLead, handleSubmitQuote, handleStartChat (PRESERVE)

src/components/installer/InstallerSidebar.tsx
├── NavItem components with onClick handlers
└── State-based navigation (CONVERT TO ROUTES)

src/components/installer/InstallerDashboardHeader.tsx
└── Header component (REUSE AS-IS)
```

**Target Structure** (Admin Pattern):
```
src/app/installer/
├── layout.tsx (NEW - copy from admin/layout.tsx pattern)
└── leads/
    └── page.tsx (NEW - contains Lead Feed component + handlers)
```

### Tasks:

- [x] T301 [CRITICAL] Create full backup of current state → `backup/installer-nav-fix-20251106-183630`
- [ ] T302 [CRITICAL] Audit current Installer dashboard (document all functionality to preserve)
- [ ] T303 [P0] Create new Installer layout file: `src/app/installer/layout.tsx`
  - Copy structure from `src/app/admin/layout.tsx`
  - Reuse `InstallerSidebar`, `InstallerDashboardHeader`, `InstallerBottomNavBar`
  - Use pathname-based active page detection
  - Remove state management (no useState for activePage)
- [ ] T304 [P0] Update InstallerSidebar to use Next.js Link for navigation
  - Replace onClick handlers with `<Link href="/installer/leads">` 
  - Keep only "Lead Feed" navigation item (remove demo tabs)
  - Preserve collapse/expand functionality
  - Remove activePage prop, use pathname for active state
- [ ] T305 [P0] Create new Lead Feed route: `src/app/installer/leads/page.tsx`
  - Move InstallerLeadFeed component import
  - Move handler functions: handleUnlockLead, handleSubmitQuote, handleStartChat
  - Add mockInstaller data
  - Remove all demo tab logic
- [ ] T306 [P1] Update InstallerDashboardHeader (if needed)
  - Verify header works with new layout
  - Remove any state dependencies
- [ ] T307 [P1] Test navigation flow
  - Verify /installer redirects or shows default view
  - Verify /installer/leads shows Lead Feed
  - Test sidebar navigation (desktop)
  - Test bottom navigation (mobile)
  - Test collapse/expand sidebar
- [ ] T308 [P1] Test Lead Feed functionality
  - Verify Unlock Lead button works
  - Verify Submit Quote modal works
  - Verify Start Chat works
  - Test all filters and pagination
- [ ] T309 [P1] Clean up old files
  - Archive old dashboard page: `src/app/installer/dashboard/page.tsx.old`
  - Remove unused imports
  - Remove demo component imports (if any)
- [ ] T310 [P2] Update documentation
  - Update `DOC/DASHBOARD-NAVIGATION-AUDIT.md` with resolution
  - Document new Installer structure
  - Add migration notes for reference
- [ ] T311 [P2] Run build validation
  - `npx tsc --noEmit` (TypeScript check)
  - `npm run build` (Production build)
  - Fix any errors
- [ ] T312 [P3] Commit changes
  - Git commit with message: "fix: Migrate Installer dashboard to route-based navigation (Admin pattern)"
  - Include all new/modified files
  - Reference backup location in commit message

**Success Criteria**:
- ✅ Installer dashboard uses route-based navigation (matches Admin pattern)
- ✅ All Lead Feed components work identically (zero functional changes)
- ✅ InstallerSidebar uses Next.js Link components
- ✅ No state-based navigation (no useState for activePage)
- ✅ TypeScript compilation passes (0 errors)
- ✅ Production build succeeds
- ✅ Mobile and desktop navigation work correctly
- ✅ Full backup exists for rollback if needed

**Estimated Effort**: 2-3 hours

**Risk Mitigation**:
- Full backup created before starting
- Keep all Lead Feed components unchanged
- Follow proven Admin dashboard pattern
- Test after each major change
- Can rollback from backup if issues occur

**Checkpoint**: ✅ After T305, core navigation should work. After T308, full functionality verified.

---

## Phase 14: URGENT - Homeowner Dashboard Navigation Fix (P0) 🚨 CRITICAL

**Added**: November 6, 2025  
**Status**: IN PROGRESS  
**Backup Created**: `backup/homeowner-nav-fix-20251106-185814`

**Goal**: Fix Homeowner dashboard navigation to follow Admin dashboard pattern (route-based navigation) while preserving Dashboard Overview, My Profile, and Messages pages

**Problem Statement**:
- Current Homeowner dashboard uses state-based navigation (anti-pattern)
- Need to keep: Dashboard Overview, My Profile, Messages
- Need to remove: My Quote Requests (Call/Visit, Written), Bidding Room, AI Insights
- Should match Admin/Installer dashboard architecture

**Solution Approach**:
- Keep Dashboard Overview, ProfileManagement, and Messages components as-is
- Create route-based structure matching Admin/Installer dashboards
- Remove demo/placeholder tabs
- Use existing HomeownerSidebar and HomeownerDashboardHeader

**Source of Truth**: Admin dashboard (`src/app/admin/layout.tsx`) and Installer dashboard (`src/app/installer/layout.tsx`)

### Pre-Implementation Audit

**Current Structure**:
```
src/app/homeowner/dashboard/page.tsx (1331 lines)
├── State-based navigation with useState('Dashboard Overview')
├── Switch statement for renderContent()
├── DashboardOverviewContent component (KEEP)
├── ProfileManagement component (KEEP)
├── Messaging modal (KEEP)
└── Placeholder tabs: Call/Visit Quotes, Written Quotes, Bidding Room, AI Insights (REMOVE)

src/components/homeowner/HomeownerSidebar.tsx (201 lines)
├── NavItem components with onClick handlers
├── Collapsible "My Quote Requests" submenu (REMOVE)
├── Bidding Room, AI Insights tabs (REMOVE)
└── State-based navigation (CONVERT TO ROUTES)
```

**Target Structure** (Admin/Installer Pattern):
```
src/app/homeowner/
├── layout.tsx (NEW - copy from installer/layout.tsx pattern)
├── dashboard/
│   └── page.tsx (NEW - Dashboard Overview content)
├── profile/
│   └── page.tsx (NEW - ProfileManagement component)
└── messages/
    └── page.tsx (NEW - Messages content)
```

### Tasks:

- [x] T401 [CRITICAL] Create full backup → `backup/homeowner-nav-fix-20251106-185814`
- [ ] T402 [CRITICAL] Audit current Homeowner dashboard (document all functionality to preserve)
- [ ] T403 [P0] Create new Homeowner layout file: `src/app/homeowner/layout.tsx`
  - Copy structure from `src/app/installer/layout.tsx`
  - Reuse `HomeownerSidebar`, `HomeownerDashboardHeader`, `HomeownerBottomNavBar`
  - Use pathname-based active page detection
  - Remove state management (no useState for activePage)
- [ ] T404 [P0] Update HomeownerSidebar to use Next.js Link for navigation
  - Replace onClick handlers with `<Link href="/homeowner/dashboard">`
  - Keep only: Dashboard Overview, My Profile, Messages
  - Remove: My Quote Requests submenu, Bidding Room, AI Insights
  - Preserve collapse/expand functionality
  - Remove activePage/setActivePage props, use pathname
- [ ] T405 [P0] Create Dashboard Overview route: `src/app/homeowner/dashboard/page.tsx`
  - Move DashboardOverviewContent component
  - Keep all dashboard logic and state
  - Preserve all modals and handlers
- [ ] T406 [P0] Create Profile route: `src/app/homeowner/profile/page.tsx`
  - Move ProfileManagement component
  - Keep handleDeleteAccount functionality
- [ ] T407 [P0] Create Messages route: `src/app/homeowner/messages/page.tsx`
  - Move MessagingModal or create Messages content page
  - Preserve all messaging functionality
- [ ] T408 [P1] Archive old dashboard page
  - Rename `src/app/homeowner/dashboard/page.tsx` to `page.tsx.old.20251106`
- [ ] T409 [P1] Test navigation flow
  - Verify /homeowner/dashboard shows Dashboard Overview
  - Verify /homeowner/profile shows ProfileManagement
  - Verify /homeowner/messages shows Messages
  - Test sidebar navigation (desktop)
  - Test bottom navigation (mobile)
  - Test collapse/expand sidebar
- [ ] T410 [P1] Test all preserved functionality
  - Verify quote request modals work
  - Verify verification flows work
  - Verify lead edit/preview/cancel work
  - Test all dashboard stats and data loading
- [ ] T411 [P2] Clean up removed components
  - Remove unused placeholder content references
  - Remove unused imports
- [ ] T412 [P2] Update documentation
  - Update `DOC/DASHBOARD-NAVIGATION-AUDIT.md` with resolution
  - Document new Homeowner structure
- [ ] T413 [P2] Run build validation
  - `npx tsc --noEmit` (TypeScript check)
  - `npm run build` (Production build)
- [ ] T414 [P3] Commit changes
  - Git commit: "fix: Migrate Homeowner dashboard to route-based navigation"
  - Reference backup location

**Success Criteria**:
- ✅ Homeowner dashboard uses route-based navigation (no useState for activePage)
- ✅ Matches Admin/Installer dashboard pattern
- ✅ Dashboard Overview, Profile, Messages preserved with full functionality
- ✅ Quote Requests, Bidding Room, AI Insights removed
- ✅ HomeownerSidebar uses Next.js Link components
- ✅ TypeScript compilation passes
- ✅ Production build succeeds
- ✅ Mobile and desktop navigation work
- ✅ Full backup available for rollback

**Estimated Effort**: 3-4 hours

**Risk Mitigation**:
- Full backup created before starting
- Keep all functional components unchanged
- Follow proven Admin/Installer pattern
- Test after each route creation
- Can rollback from backup if needed

**Checkpoint**: ✅ After T407, all core routes exist. After T410, full functionality verified.

---

**Recommended Execution Order**:
1. **Phase 14 IMMEDIATE** (Homeowner Navigation Fix - P0): Fix Homeowner dashboard navigation (URGENT)
2. **Phase 13 COMPLETED** ✅ (Installer Navigation Fix - P0): Installer dashboard fixed
3. **Phase 1-3 FIRST** (Foundation - P0): GATE 0, Verification, Multi-Theme (blocking for all migration work)
4. **Phases 4-7 NEXT** (Standards - P1): Logic, Replacement, Responsive, Accessibility (can work in parallel)
5. **Phases 8-10 NEXT** (Process - P2-P3): Build, Commit, Documentation (can work in parallel)
6. **Phase 11** (Integration): Constitution updates, quick reference
7. **Phase 12** (Validation): Test the system, get user approval

**Estimated Effort**:
- Phases 1-3 (Foundation): 4-6 hours (critical path)
- Phases 4-7 (Standards): 4-6 hours (parallel work)
- Phases 8-10 (Process): 2-4 hours (parallel work)
- Phase 11 (Integration): 2-3 hours
- Phase 12 (Validation): 2-3 hours
- **Total**: 14-22 hours

**Key Milestone**: After Phase 3, the core system (GATE 0 + verification + theme testing) is functional and can be used for migrations while remaining phases are completed.

---

## Notes

### This is a Meta-Spec

This spec (007-migration-and-build) is DIFFERENT from other specs:
- It does NOT implement features for end users
- It creates the INSTRUCTION SET for how to execute migration work
- It is used BY DEVELOPERS (and AI agents) during migration tasks
- Success = workflow is clear, enforceable, and prevents pain points

### Relationship to Other Specs

- **006-component-by-component**: Defines WHAT components to migrate (uses this workflow)
- **DESIGN-SYSTEM-SOT.md**: Defines design tokens and patterns (referenced by this workflow)
- **constitution.md**: Defines project-wide standards (enhanced by this workflow)
- **MIGRATION-PAIN-POINTS.md**: Lists historical mistakes (prevented by this workflow)

### When to Use This Spec

**✅ Use this spec when:**
- Building the migration execution system itself
- Updating migration workflow documentation
- Creating GATE 0 health checks
- Documenting verification commands
- Establishing quality standards

**❌ Don't use this spec for:**
- Migrating specific components (follow plan.md 13-step workflow instead)
- Creating new features (create separate feature spec)
- Modifying design tokens (update DESIGN-SYSTEM-SOT.md)

---

## Approval and Sign-Off

**Tasks Created**: November 4, 2025  
**Status**: Ready for implementation  
**Next Steps**: Begin with Phase 1 (GATE 0 script), proceed through phases in order
