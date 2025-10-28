# Tasks: Centralized Design Token System

**Feature Branch**: `004-centralized-theme-color`  
**Input**: Design documents from `/specs/004-centralized-theme-color/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

**Tests**: Visual regression testing using Chromatic is REQUIRED for this feature (not optional). All token changes and component migrations must pass visual tests before commit.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US10)
- File paths are absolute to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and directory structure

**Duration**: 3 hours

- [ ] **T001** [P] Create design token directory structure: `src/design-tokens/primitives/`, `src/design-tokens/semantic/`, `src/design-tokens/types.ts`, `src/design-tokens/index.ts`
- [ ] **T002** [P] Create hooks directory: `src/hooks/`
- [ ] **T003** [P] Create Storybook directory structure: `.storybook/`, `stories/design-tokens/`, `stories/components/`, `stories/pages/`
- [ ] **T004** [P] Install Storybook: `npx storybook@latest init` (Next.js preset)
- [ ] **T005** [P] Install Chromatic: `npm install --save-dev chromatic`
- [ ] **T006** [P] Install additional Storybook addons: `npm install --save-dev @storybook/addon-a11y @storybook/addon-viewport`
- [ ] **T007** Configure Storybook main config: `.storybook/main.ts` (webpack aliases, addons, framework config)
- [ ] **T008** Configure Storybook preview: `.storybook/preview.ts` (global decorators, theme switcher, viewport config)
- [ ] **T009** [P] Create theme decorator component: `.storybook/theme-decorator.tsx` (ThemeProvider wrapper, dark class logic)
- [ ] **T010** [P] Add Storybook + Chromatic scripts to `package.json`: `storybook`, `build-storybook`, `chromatic`
- [ ] **T011** [P] Create contract directory for migration tracking: `specs/004-centralized-theme-color/audits/`

**Checkpoint**: Development infrastructure ready for token creation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design token files that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Duration**: 6 hours

### Primitive Token Files (Foundation Layer)

- [ ] **T012** [P] Create primitive color palette: `src/design-tokens/primitives/colors.ts` (grayscale, teal, amber, green, yellow, red, blue - 200+ color values with `as const`)
- [ ] **T013** [P] Create primitive font sizes: `src/design-tokens/primitives/fontSizes.ts` (xs through 6xl, font weights, line heights, letter spacing)
- [ ] **T014** [P] Create primitive spacing scale: `src/design-tokens/primitives/spacingScale.ts` (0-24 scale, 8-point grid system)

### TypeScript Type Definitions

- [ ] **T015** Create design token types: `src/design-tokens/types.ts` (interfaces: `ThemeColor`, `ChartColor`, `ColorPalette`, `ResponsiveFontSize`, `TextStyle`, `ResponsiveSpacing`)

### Semantic Token Files (Business Layer)

- [ ] **T016** Create semantic color tokens: `src/design-tokens/semantic/colors.ts` (primary, secondary, success, warning, error, info, background, foreground, muted, border - all with light/dark/DEFAULT variants, export `SemanticColors` type)
- [ ] **T017** Create semantic typography tokens: `src/design-tokens/semantic/typography.ts` (font families, heading-1 through heading-4, body, body-large, body-small, caption, label, button - all with responsive sizes, export `TypographyTokens` type)
- [ ] **T018** Create semantic spacing tokens: `src/design-tokens/semantic/spacing.ts` (mobile/desktop variants, semantic names: card-padding, modal-padding, form-gap, section-margin, heading-margin, button-padding-x/y, export `SpacingTokens` type)
- [ ] **T019** Create shadow tokens: `src/design-tokens/semantic/shadows.ts` (card, modal, dropdown, button, focus - all with light/dark variants, export `ShadowTokens` type)
- [ ] **T020** Create animation tokens: `src/design-tokens/semantic/animations.ts` (durations, easing functions, transitions, keyframes: fadeIn, fadeOut, slideInUp, slideOutDown, export `AnimationTokens` type)
- [ ] **T021** Create border radius tokens: `src/design-tokens/semantic/borders.ts` (card, button, input, modal, badge radii + border widths, export `BorderTokens` type)

### Barrel Export

- [ ] **T022** Create barrel export file: `src/design-tokens/index.ts` (export all semantic tokens, primitives, and types - single import point)

### Tailwind Integration

- [ ] **T023** Update Tailwind config: `tailwind.config.js` (import design tokens, extend theme with colors/typography/spacing/shadows/animations/borders, add responsive spacing plugin, update content paths to include stories)
- [ ] **T024** Test Tailwind build: `npm run build` (verify no errors, check generated CSS includes custom token classes)

### Global Styles Update

- [ ] **T025** Update global styles: `src/globals.css` (verify design tokens imported, minimal custom CSS)

**Checkpoint**: Foundation complete - all design tokens available, Tailwind configured, build succeeds

---

## Phase 3: User Story 1 - Designer Changes Primary Brand Color (Priority: P1) 🎯 MVP

**Goal**: Enable instant color changes across entire application by updating a single token file

**Independent Test**: Change `colors.primary` from teal to blue in `semantic/colors.ts`, rebuild, verify all primary buttons/links/accents reflect new color in all 3 themes

**Duration**: 12 hours

### Utility Hooks for US1

- [ ] **T026** [P] [US1] Create theme colors hook: `src/hooks/useThemeColors.ts` (hook to access theme-aware colors from ThemeProvider context, returns current theme's color values)
- [ ] **T027** [P] [US1] Create chart colors hook: `src/hooks/useChartColors.ts` (hook for Recharts color integration, returns hex values for primary/secondary/tertiary/success/warning/error based on current theme)

### Storybook Stories for US1

- [ ] **T028** [P] [US1] Create color showcase story: `stories/design-tokens/Colors.stories.tsx` (displays all semantic colors with hex codes, brand colors section, status colors section, background/foreground section, theme comparison view)
- [ ] **T029** [P] [US1] Create button component story: `stories/components/Button.stories.tsx` (primary/secondary/success/error variants, all themes, all sizes, hover/focus/disabled states)
- [ ] **T030** [P] [US1] Create sample dashboard page story: `stories/pages/SampleDashboard.stories.tsx` (uses primary color in multiple contexts: buttons, links, badges, charts - demonstrates instant rebranding)

### Visual Regression Testing Setup for US1

- [ ] **T031** [US1] Configure Chromatic project: `npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN` (first run creates project)
- [ ] **T032** [US1] Capture baseline snapshots: Run Chromatic on initial token system (accept all baselines as "correct" state)
- [ ] **T033** [US1] Test color change scenario: Change primary color from teal to blue, run Chromatic, verify diffs only show color changes (no layout/spacing changes)
- [ ] **T034** [US1] Document color change process: `specs/004-centralized-theme-color/audits/color-change-guide.md` (step-by-step guide for designers)

### Chart Integration for US1

- [ ] **T035** [US1] Create sample chart story: `stories/components/DashboardChart.stories.tsx` (BarChart + LineChart using `useChartColors` hook, demonstrates automatic color theming)
- [ ] **T036** [US1] Test chart recoloring: Change primary color, verify charts update automatically in Storybook

### Manual QA for US1

- [ ] **T037** [US1] Complete QA checklist: Test color change in Light theme (verify all components), Test in Dark theme (verify automatic dark variants), Test in System theme (verify OS preference respected), Verify no hardcoded color overrides remain in sample components

**Checkpoint**: User Story 1 complete - Color token system proven, instant rebranding works, visual regression tests pass

---

## Phase 4: User Story 6 - Designer Updates Typography System (Priority: P1)

**Goal**: Enable instant typography changes (font family, sizes, weights) across entire application

**Independent Test**: Change base body font size from 16px to 18px in `semantic/typography.ts`, rebuild, verify all body text scales proportionally

**Duration**: 8 hours

### Storybook Stories for US6

- [ ] **T038** [P] [US6] Create typography showcase story: `stories/design-tokens/Typography.stories.tsx` (display all heading levels, body variants, caption, label, button text - show responsive sizes)
- [ ] **T039** [P] [US6] Create typography comparison story: `stories/design-tokens/TypographyScales.stories.tsx` (side-by-side: 14px vs 16px vs 18px base size, demonstrate hierarchy preservation)

### Sample Components for US6

- [ ] **T040** [P] [US6] Create card component story: `stories/components/Card.stories.tsx` (card with heading + body text using typography tokens, demonstrates hierarchy)
- [ ] **T041** [P] [US6] Create form component story: `stories/components/Form.stories.tsx` (form with labels + inputs using typography tokens)

### Visual Regression Testing for US6

- [ ] **T042** [US6] Capture typography baseline: Run Chromatic on current typography system
- [ ] **T043** [US6] Test font size change: Increase body font from 16px to 18px, run Chromatic, verify all body text scales without layout breaks
- [ ] **T044** [US6] Test font family change: Change from Inter to Roboto, run Chromatic, verify entire app adopts new font
- [ ] **T045** [US6] Document typography change process: `specs/004-centralized-theme-color/audits/typography-change-guide.md`

### Mobile-First Testing for US6

- [ ] **T046** [US6] Test typography at 320px: Verify base font 14px on mobile, headings readable, no text overflow
- [ ] **T047** [US6] Test typography at 768px: Verify responsive scaling (tablet sizes)
- [ ] **T048** [US6] Test typography at 1024px: Verify full desktop sizes (16px body, larger headings)

**Checkpoint**: User Story 6 complete - Typography token system proven, instant font changes work, hierarchy maintained

---

## Phase 5: User Story 7 - Developer Creates Component with Consistent Spacing (Priority: P1)

**Goal**: Enable developers to create components with consistent padding/margins using semantic spacing tokens

**Independent Test**: Create new card component using `p-card-padding` and `space-y-form-gap`, verify spacing matches existing cards

**Duration**: 6 hours

### Utility Hook for US7

- [ ] **T049** [P] [US7] Create responsive spacing hook: `src/hooks/useResponsiveSpacing.ts` (hook to get current breakpoint-appropriate spacing values)

### Storybook Stories for US7

- [ ] **T050** [P] [US7] Create spacing showcase story: `stories/design-tokens/Spacing.stories.tsx` (display all spacing tokens with pixel values, semantic names, mobile vs desktop comparison)
- [ ] **T051** [P] [US7] Create spacing grid story: `stories/design-tokens/SpacingGrid.stories.tsx` (8-point grid visualization, demonstrates consistent spacing system)

### Sample Components for US7

- [ ] **T052** [P] [US7] Create card component with semantic spacing: `stories/components/SemanticCard.stories.tsx` (uses p-card-padding, space-y-form-gap, mt-section-margin)
- [ ] **T053** [P] [US7] Create form with semantic spacing: `stories/components/SemanticForm.stories.tsx` (uses space-y-form-gap between inputs, consistent padding)

### Visual Regression Testing for US7

- [ ] **T054** [US7] Capture spacing baseline: Run Chromatic on spacing system
- [ ] **T055** [US7] Test spacing change: Adjust card-padding from 16px to 20px, run Chromatic, verify all cards update consistently
- [ ] **T056** [US7] Test responsive spacing: Verify mobile spacing (12px) vs desktop spacing (24px) at different breakpoints

### Developer Documentation for US7

- [ ] **T057** [US7] Update quickstart guide: Add spacing usage examples to `specs/004-centralized-theme-color/quickstart.md`
- [ ] **T058** [US7] Document spacing patterns: `specs/004-centralized-theme-color/audits/spacing-patterns.md` (common card layouts, form layouts, page sections)

**Checkpoint**: User Story 7 complete - Spacing token system proven, consistent spacing achievable, responsive spacing works

---

## Phase 6: User Story 2 - Developer Implements New Component with Theme Support (Priority: P1)

**Goal**: Enable developers to create new components that automatically support Light/Dark/System themes

**Independent Test**: Create new component using color/typography/spacing tokens, verify it works in all 3 themes without custom theme logic

**Duration**: 4 hours

### Sample Components for US2

- [ ] **T059** [P] [US2] Create status badge component: `stories/components/StatusBadge.stories.tsx` (success/warning/error variants using semantic color tokens, all themes)
- [ ] **T060** [P] [US2] Create alert component: `stories/components/Alert.stories.tsx` (info/success/warning/error variants, theme-aware backgrounds/borders)

### Theme Testing for US2

- [ ] **T061** [US2] Test component in Light theme: Verify all colors, contrast ratios meet WCAG AA
- [ ] **T062** [US2] Test component in Dark theme: Verify dark variants applied automatically
- [ ] **T063** [US2] Test component in System theme: Verify OS preference respected

### Developer Documentation for US2

- [ ] **T064** [US2] Document theme-aware component pattern: Add to `quickstart.md` (how to use semantic tokens for automatic theme support)
- [ ] **T065** [US2] Create theme testing checklist: `specs/004-centralized-theme-color/checklists/theme-testing-checklist.md`

**Checkpoint**: User Story 2 complete - New components automatically theme-aware, no custom theme logic needed

---

## Phase 7: User Story 8 - Designer Implements Consistent Shadow/Elevation System (Priority: P2)

**Goal**: Establish consistent visual hierarchy using shadow tokens (5-level elevation system)

**Independent Test**: Apply shadow tokens to button/card/dropdown/modal, verify clear visual hierarchy

**Duration**: 5 hours

### Storybook Stories for US8

- [ ] **T066** [P] [US8] Create shadow showcase story: `stories/design-tokens/Shadows.stories.tsx` (display all elevation levels with descriptions, light vs dark theme comparison)
- [ ] **T067** [P] [US8] Create elevation hierarchy story: `stories/design-tokens/ElevationHierarchy.stories.tsx` (stacked components showing hierarchy: button < card < dropdown < modal)

### Sample Components for US8

- [ ] **T068** [P] [US8] Create elevated button story: `stories/components/ElevatedButton.stories.tsx` (button with shadow-button, hover:shadow-card transition)
- [ ] **T069** [P] [US8] Create dropdown component story: `stories/components/Dropdown.stories.tsx` (dropdown with shadow-dropdown, positioned above card)
- [ ] **T070** [P] [US8] Create modal component story: `stories/components/Modal.stories.tsx` (modal with shadow-modal, highest elevation)

### Visual Regression Testing for US8

- [ ] **T071** [US8] Capture shadow baseline: Run Chromatic on elevation system
- [ ] **T072** [US8] Test shadow in Light theme: Verify shadows visible, create depth perception
- [ ] **T073** [US8] Test shadow in Dark theme: Verify lighter shadow colors for dark backgrounds
- [ ] **T074** [US8] Document elevation system: `specs/004-centralized-theme-color/audits/elevation-system-guide.md`

**Checkpoint**: User Story 8 complete - Elevation system established, visual hierarchy clear, theme-aware shadows work

---

## Phase 8: User Story 9 - Developer Standardizes Border Radius (Priority: P2)

**Goal**: Apply consistent corner rounding to all UI elements using radius tokens

**Independent Test**: Apply radius tokens to buttons/cards/inputs/modals, verify consistency across similar component types

**Duration**: 3 hours

### Storybook Stories for US9

- [ ] **T075** [P] [US9] Create border radius showcase story: `stories/design-tokens/BorderRadius.stories.tsx` (display all radius tokens with pixel values, visual examples)
- [ ] **T076** [P] [US9] Create rounded components story: `stories/components/RoundedComponents.stories.tsx` (buttons, cards, inputs, badges - all using appropriate radius tokens)

### Visual Regression Testing for US9

- [ ] **T077** [US9] Capture radius baseline: Run Chromatic on border radius system
- [ ] **T078** [US9] Test radius consistency: Verify all buttons use radius-button, all cards use radius-card
- [ ] **T079** [US9] Document radius patterns: `specs/004-centralized-theme-color/audits/radius-patterns.md`

**Checkpoint**: User Story 9 complete - Border radius standardized, consistent corner rounding across UI

---

## Phase 9: User Story 10 - Designer Centralizes Animation System (Priority: P3)

**Goal**: Standardize animation durations and easing functions across application

**Independent Test**: Apply animation tokens to hover states/loading states, verify consistent timing

**Duration**: 4 hours

### Storybook Stories for US10

- [ ] **T080** [P] [US10] Create animation showcase story: `stories/design-tokens/Animations.stories.tsx` (display all durations, easing functions, keyframe animations)
- [ ] **T081** [P] [US10] Create transition examples story: `stories/components/AnimatedComponents.stories.tsx` (button with color transition, modal with fade-in/slide-in animations)

### Visual Regression Testing for US10

- [ ] **T082** [US10] Capture animation baseline: Run Chromatic with animations disabled (consistent snapshots)
- [ ] **T083** [US10] Test animation timings: Manually verify transitions feel smooth and consistent
- [ ] **T084** [US10] Document animation patterns: `specs/004-centralized-theme-color/audits/animation-patterns.md`

**Checkpoint**: User Story 10 complete - Animation system centralized, consistent motion design

---

## Phase 10: User Story 4 - QA Tests Theme Consistency (Priority: P2)

**Goal**: Enable QA to efficiently test theme consistency across application

**Independent Test**: Switch themes in Storybook, verify all components render correctly in all 3 themes

**Duration**: 6 hours

### QA Tools for US4

- [ ] **T085** [P] [US4] Create comprehensive theme test story: `stories/pages/ThemeConsistencyTest.stories.tsx` (single page with all component types, theme switcher, visual checklist)
- [ ] **T086** [P] [US4] Create accessibility test story: `stories/pages/AccessibilityTest.stories.tsx` (test WCAG AA contrast ratios in all themes using @storybook/addon-a11y)

### QA Documentation for US4

- [ ] **T087** [US4] Create manual QA checklist: `specs/004-centralized-theme-color/checklists/theme-qa-checklist.md` (per-theme checklist: colors, contrast, readability, visual glitches)
- [ ] **T088** [US4] Document theme testing workflow: `specs/004-centralized-theme-color/audits/theme-testing-workflow.md` (step-by-step QA process)

### Automated Testing for US4

- [ ] **T089** [US4] Run full Chromatic regression suite: Capture all stories in all themes (Light/Dark), review all diffs
- [ ] **T090** [US4] Create theme consistency report: Document any found issues, create fix tasks

**Checkpoint**: User Story 4 complete - QA can efficiently test themes, automated visual testing catches regressions

---

## Phase 11: User Story 3 - Business Rebrands or Creates White-Label Version (Priority: P2)

**Goal**: Enable creation of white-label versions with different brand colors

**Independent Test**: Create new color token set (e.g., "client-blue-theme"), verify entire app renders in new colors

**Duration**: 4 hours

### White-Label Infrastructure for US3

- [ ] **T091** [P] [US3] Create theme variant structure: `src/design-tokens/themes/` directory for brand-specific token overrides
- [ ] **T092** [P] [US3] Create sample white-label theme: `src/design-tokens/themes/client-blue.ts` (override primary/secondary with client brand colors)

### Testing for US3

- [ ] **T093** [US3] Create white-label demo story: `stories/pages/WhiteLabelDemo.stories.tsx` (shows same page in default brand vs white-label brand)
- [ ] **T094** [US3] Test WCAG compliance: Verify white-label colors meet contrast requirements
- [ ] **T095** [US3] Document white-label process: `specs/004-centralized-theme-color/audits/white-label-guide.md`

**Checkpoint**: User Story 3 complete - White-label capability proven, rebrand process documented

---

## Phase 12: User Story 5 - Developer Fixes Legacy Hardcoded Colors (Priority: P3)

**Goal**: Provide tools and process for refactoring existing components to use design tokens

**Independent Test**: Refactor one legacy component (e.g., InstantQuoteForm), verify identical rendering with tokens

**Duration**: 80 hours (Page-by-Page Migration - MAJOR EFFORT)

### Migration Tools for US5

- [ ] **T096** [P] [US5] Create hardcoded value scanner script: `scripts/scan-hardcoded-values.ts` (finds all `bg-teal-600`, hex codes, hardcoded spacing in codebase)
- [ ] **T097** [P] [US5] Create migration tracking dashboard: `specs/004-centralized-theme-color/audits/migration-progress.md` (track pages migrated, hardcoded values reduced)

### Per-Page Migration Workflow (Repeat for 40-50 pages)

**Example: Dashboard Page Migration** (2-3 hours per page, 2-3 pages per day)

- [ ] **T098** [US5] Audit Dashboard page: Document all hardcoded values in `specs/004-centralized-theme-color/audits/dashboard-audit.md`
- [ ] **T099** [US5] Create token mapping for Dashboard: List all hardcoded → token replacements
- [ ] **T100** [US5] Refactor Dashboard components: Replace hardcoded values with semantic tokens in `src/app/dashboard/page.tsx`
- [ ] **T101** [US5] Create Dashboard Storybook story: `stories/pages/Dashboard.stories.tsx`
- [ ] **T102** [US5] Run Chromatic on Dashboard: Verify no visual regressions vs baseline
- [ ] **T103** [US5] Complete Dashboard QA checklist: All themes, all breakpoints, all states
- [ ] **T104** [US5] Commit Dashboard changes: Clear commit message with before/after stats

**High-Priority Pages** (Week 1 - 10-15 pages):
- [ ] **T105-T111** [US5] Migrate Homepage (same 7-step workflow as T098-T104)
- [ ] **T112-T118** [US5] Migrate Instant Quote Form
- [ ] **T119-T125** [US5] Migrate Guest Quote Request Form
- [ ] **T126-T132** [US5] Migrate Login Page
- [ ] **T133-T139** [US5] Migrate Register Page
- [ ] **T140-T146** [US5] Migrate Homeowner Dashboard
- [ ] **T147-T153** [US5] Migrate Installer Dashboard
- [ ] **T154-T160** [US5] Migrate Lead Details Page
- [ ] **T161-T167** [US5] Migrate Settings Page
- [ ] **T168-T174** [US5] Migrate Profile Page

**Secondary Pages** (Week 2 - 15-20 pages):
- [ ] **T175-T181** [US5] Migrate Admin Dashboard
- [ ] **T182-T188** [US5] Migrate Admin Users Page
- [ ] **T189-T195** [US5] Migrate Admin Settings
- [ ] **T196-T202** [US5] Migrate Reports Page
- [ ] **T203-T209** [US5] Migrate Notifications Page
- [ ] **T210-T216** [US5] Migrate Help/Support Page
- [ ] **T217-T223** [US5] Migrate Lead Assignment Modal
- [ ] **T224-T230** [US5] Migrate Confirmation Modals (delete, archive, etc.)
- [ ] **T231-T237** [US5] Migrate Filter/Search Modals
- [ ] **T238-T244** [US5] Migrate Image Upload Modals
- [ ] **T245-T251** [US5] Migrate 5 additional secondary pages (TBD based on audit)

**Edge Cases** (Week 3 - 10-15 pages):
- [ ] **T252-T258** [US5] Migrate 404 Error Page
- [ ] **T259-T265** [US5] Migrate 500 Error Page
- [ ] **T266-T272** [US5] Migrate Loading States/Skeleton Screens
- [ ] **T273-T279** [US5] Migrate Empty States
- [ ] **T280-T286** [US5] Migrate Onboarding Flow
- [ ] **T287-T293** [US5] Migrate Landing Pages (if applicable)
- [ ] **T294-T300** [US5] Migrate Pricing Page (if applicable)
- [ ] **T301-T307** [US5] Migrate About Page (if applicable)
- [ ] **T308-T314** [US5] Migrate Blog Pages (if applicable)

### Final Migration Tasks

- [ ] **T315** [US5] Run final hardcoded value scan: Verify <10 remaining hardcoded values (98% reduction)
- [ ] **T316** [US5] Run full Chromatic regression suite: All pages, all themes, all breakpoints
- [ ] **T317** [US5] Complete final QA audit: Cross-browser testing (Chrome, Firefox, Safari, Mobile Safari)
- [ ] **T318** [US5] Update migration progress dashboard: Mark feature complete, document final stats

**Checkpoint**: User Story 5 complete - 40-50 pages migrated, 98% hardcoded values eliminated, visual consistency achieved

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, CI/CD, and final improvements

**Duration**: 8 hours

### Documentation

- [ ] **T319** [P] Update README: Add design token system section, link to quickstart guide
- [ ] **T320** [P] Create architecture decision record: `DOC/Records/DESIGN-TOKEN-SYSTEM-ADR.md` (decisions, rationale, alternatives considered)
- [ ] **T321** [P] Update constitution: Add mandatory visual regression testing requirement to Section VI

### CI/CD Integration

- [ ] **T322** Create GitHub Actions workflow: `.github/workflows/chromatic.yml` (run Chromatic on every PR, block merge if visual regressions found)
- [ ] **T323** Add Chromatic project token to GitHub Secrets: `CHROMATIC_PROJECT_TOKEN`
- [ ] **T324** Test CI/CD workflow: Create test PR, verify Chromatic runs automatically

### Performance Optimization

- [ ] **T325** [P] Audit CSS bundle size: Verify no significant increase (<5% acceptable)
- [ ] **T326** [P] Audit build time: Verify design tokens don't slow build

### Final Validation

- [ ] **T327** Run full production build: `npm run build` (verify zero errors)
- [ ] **T328** Deploy to staging: Test all migrated pages in staging environment
- [ ] **T329** Get stakeholder sign-off: Final review and approval

**Checkpoint**: Feature complete - All user stories delivered, documentation complete, CI/CD integrated, production-ready

---

## Summary

**Total Tasks**: 329  
**Estimated Duration**: ~160 hours (4 weeks with 2 developers in parallel)

### Tasks Per User Story

| User Story | Priority | Task Count | Duration |
|------------|----------|------------|----------|
| **US1** - Designer Changes Primary Brand Color | P1 (MVP) | 12 tasks | 12 hours |
| **US6** - Designer Updates Typography System | P1 | 11 tasks | 8 hours |
| **US7** - Developer Creates Component with Consistent Spacing | P1 | 10 tasks | 6 hours |
| **US2** - Developer Implements New Component with Theme Support | P1 | 7 tasks | 4 hours |
| **US8** - Designer Implements Consistent Shadow/Elevation System | P2 | 9 tasks | 5 hours |
| **US9** - Developer Standardizes Border Radius | P2 | 5 tasks | 3 hours |
| **US10** - Designer Centralizes Animation System | P3 | 5 tasks | 4 hours |
| **US4** - QA Tests Theme Consistency | P2 | 6 tasks | 6 hours |
| **US3** - Business Rebrands or Creates White-Label Version | P2 | 5 tasks | 4 hours |
| **US5** - Developer Fixes Legacy Hardcoded Colors | P3 | 223 tasks | 80 hours |

### Parallel Execution Opportunities

**Phase 1 Setup** (3 hours - can parallelize):
- T001-T003 (directory structure) - Developer A
- T004-T006 (tooling installation) - Developer B
- T007-T009 (Storybook config) - Developer A (after T004)
- T010-T011 (scripts + contracts) - Developer B (after T006)

**Phase 2 Foundation** (6 hours - can parallelize):
- T012-T014 (primitive tokens) - Developer A
- T015 (types) - Developer A (after T012)
- T016-T021 (semantic tokens) - Developer B (after T015)
- T022-T025 (integration) - Developer A (after T021)

**Phase 3-11 User Stories** (40 hours - mostly sequential per story, but stories can parallelize):
- US1 + US6 can run in parallel (different token types)
- US7 + US2 can run in parallel (different focuses)
- US8 + US9 + US10 can run in parallel (different token types)
- US4 + US3 can run in parallel (QA + white-label)

**Phase 12 Migration** (80 hours - HIGH parallelization):
- 2 developers can migrate 4-6 pages per day (2-3 each)
- Week 1: Both devs work on high-priority pages
- Week 2: Both devs work on secondary pages
- Week 3: Both devs work on edge cases + polish

**Phase 13 Polish** (8 hours - can parallelize):
- Documentation tasks (T319-T321) - Developer A
- CI/CD tasks (T322-T324) - Developer B
- Performance tasks (T325-T326) - Developer A
- Final validation (T327-T329) - Both devs

### Implementation Strategy

**MVP Scope** (Phase 1-3 only - US1):
- Setup + Foundation + User Story 1 = ~21 hours (3 days)
- Delivers: Instant color changes proven, Storybook + Chromatic working, stakeholder can review token system

**Incremental Delivery**:
1. **Week 1**: MVP (US1) + US6 + US7 + US2 = Token system complete, new components theme-aware
2. **Week 2**: US8 + US9 + US10 + US4 + US3 = All token types complete, QA tools ready, white-label proven
3. **Week 3-4**: US5 (Migration) = Page-by-page refactoring (40-50 pages)
4. **Week 4**: Polish + CI/CD + Final validation

### Dependencies

**User Story Dependencies**:
- US1 blocks: US2, US4, US5 (need color tokens first)
- US6 blocks: US2, US5 (need typography tokens first)
- US7 blocks: US2, US5 (need spacing tokens first)
- US8, US9, US10 are independent (can run in parallel)
- US4 depends on: US1, US6, US7, US8, US9, US10 (need all tokens to QA)
- US3 depends on: US1 (need color system first)
- US5 depends on: ALL other user stories (migration happens last)

**Suggested Order**:
1. Phase 1 + 2 (Setup + Foundation) - MUST complete first
2. Phase 3 (US1 - Colors) - MVP delivery
3. Phases 4-6 in parallel (US6 Typography, US7 Spacing, US2 New Components)
4. Phases 7-9 in parallel (US8 Shadows, US9 Radius, US10 Animations)
5. Phases 10-11 in parallel (US4 QA Tools, US3 White-Label)
6. Phase 12 (US5 - Migration) - LARGEST effort, 2-3 weeks
7. Phase 13 (Polish) - Final touches

### Success Criteria

**Per User Story** (Independent Test Criteria):
- ✅ **US1**: Change primary color once → All components update in all themes
- ✅ **US6**: Change base font size once → All text scales proportionally
- ✅ **US7**: New component uses spacing tokens → Matches existing component spacing
- ✅ **US2**: New component uses tokens → Automatically theme-aware (no custom logic)
- ✅ **US8**: Apply shadow tokens → Clear visual hierarchy established
- ✅ **US9**: Apply radius tokens → Consistent corner rounding across UI
- ✅ **US10**: Apply animation tokens → Consistent motion design
- ✅ **US4**: Switch themes in Storybook → All components render correctly
- ✅ **US3**: Create white-label token set → Entire app renders in new brand
- ✅ **US5**: Migrate 40-50 pages → 98% hardcoded values eliminated, zero visual regressions

**Overall Feature Success**:
- [ ] All 10 user stories independently testable and passing
- [ ] Chromatic visual regression suite passes (zero unintended diffs)
- [ ] Manual QA checklist complete (all themes, all breakpoints, all pages)
- [ ] Hardcoded values reduced by 98% (450+ → <10)
- [ ] Design token changes take 5 minutes (vs 4-6 hours before)
- [ ] CI/CD pipeline integrated (auto visual testing on every PR)
- [ ] Documentation complete (quickstart guide, ADR, constitution updated)
- [ ] Stakeholder approval received (production deployment approved)

---

**Generated**: January 28, 2025  
**Tool**: `/speckit.tasks` command  
**Next Step**: Begin Phase 1 (Setup) - Estimated 3 hours to development environment ready
