# Tasks – Quote Builder Modal Enhancement (Existing)

Feature: `008-description-enhance-existing`
Spec: `specs/008-description-enhance-existing/spec.md`
Plan: `specs/008-description-enhance-existing/plan.md`

Mandatory Pre/Post Checks (from 002 tasks and AI guidelines):
- Pre (before each phase):
  - Read `DOC/Guidelines/AI-IMPLEMENTATION-GUIDELINES.md` and confirm adherence.
  - Run design-system verification commands on targeted files; record baseline (expect 0 matches).
  - Perform pre-migration audit vs. SOT files; list gaps.
- Post (after each phase):
  - Re-run 6 verification commands; MUST be 0/0/0/0/0/0.
  - Test Dark/Light/Purple themes and 5 breakpoints.
  - Update spec.md and tasks.md with learnings; record decisions.

## Phase 1 – Setup

T001 [X][Setup]: Confirm repository branch and feature directory
- Path: `specs/008-description-enhance-existing/`
- Action: Ensure plan/spec/research/data-model/contracts/quickstart exist.
- Status: COMPLETE ✓

T002 [X][Setup]: Establish SOT references
- Path: `specs/008-description-enhance-existing/spec.md`
- Action: Verify References & Governance sections; link SOT files.
- Status: COMPLETE ✓

T003 [X][Setup]: Pre-migration audit gate
- Path: `specs/008-description-enhance-existing/quickstart.md`
- Action: Execute audit; document gaps vs. current modal (QuoteBuilder components).
- Status: COMPLETE ✓ - Audit shows: hardcoded assumptions (yield 4.2, selfUse 0.5, retail 0.30), no FIT/OPEX, simple payback only, no multi-option support, no compliance validation

Checkpoint: Pre/post checks completed; proceed if PASS. ✓ PASSED

## Phase 2 – Foundational (blocking for all stories)

T004 [X][Foundational]: Calculator alignment
- Path: `src/components/quote-builder/*`
- Action: Identify all places computing totals/ROI; plan replacement with single calculator per `ChatGPT_CalculationLogic.md`.
- Status: COMPLETE ✓ - Created src/utils/quoteCalculator.ts and src/utils/stcZones.ts

T005 [X][Foundational]: Autosave restore paths
- Path: `src/components/quote-builder/*`
- Action: Confirm draft persistence keys (leadId + option set) and restore behavior.
- Status: COMPLETE ✓ - Autosave already implemented with proper keys (quote:draft:${leadId}:installer-id)

T006 [X][Foundational]: Design-system compliance
- Path: `src/components/quote-builder/*`
- Action: Replace any hardcoded classes; ensure zero violations.
- Status: COMPLETE ✓ - Verification commands show 0 violations in current components

Checkpoint: Pre/post checks completed; proceed if PASS. ✓ PASSED

## Phase 3 – [US1] Real-time calculator accuracy (P1)

Story goal: Accurate pricing and ROI in existing modal without rebuild.
Independent test: Change self-consumption from 0.3 to 0.7; verify Annual Savings and Payback update instantly (<500ms) and consistently.

T007 [X][US1][P]: Wire single calculator outputs into summary cards
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Source Subtotal, GST, Incentives, Total, $/W from calculator.
- Status: COMPLETE ✓ - Integrated calcQuoteTotals from quoteCalculator.ts

T008 [X][US1][P]: Wire assumptions panel to calculator
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: Bind yield, selfUse, retail, FiT, OPEX; recompute outputs.
- Status: COMPLETE ✓ - Added Financial Assumptions panel with 7 configurable parameters

T009 [X][US1]: Handle Payback = N/A when savings <= 0
- Path: `src/components/quote-builder/CustomerPreview.tsx`
- Action: Display N/A with guidance; propagate across UI.
- Status: COMPLETE ✓ - Added isFinite check and warning message

T010 [X][US1]: STC zone mapping + override
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: Apply postcode→zone; support manual override; stcCount × stcPrice.
- Status: COMPLETE ✓ - Added postcode input with auto zone detection and manual override

Post-checkpoint: Run verification commands; test themes/breakpoints; confirm PASS. ✓ PASSED

## Phase 4 – UX Improvements & Addon Integration (P2)

Story goal: Improve user experience with real-time preview, addon cost integration, and enhanced category options.
Independent test: Add an EV charger addon → verify it appears in pricing engine line items → verify preview updates automatically → verify total price reflects addon cost.

T018 [X][UX][P]: Auto-sync addons to pricing engine line items
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: When addons are added/updated in ProductConfiguration, automatically create/update corresponding line items in PricingEngine with category "Addons", preserving qty and unitPrice.
- Testing: Add addon → verify line item auto-created in pricing engine with correct qty/price → modify addon qty → verify line item updates → remove addon → verify line item removed
- Status: COMPLETE ✓ - Added useEffect to auto-sync addons array to pricing engine line items with "Addons" category

T019 [X][UX][P]: Show addons in customer preview
- Path: `src/components/quote-builder/CustomerPreview.tsx`
- Action: Display selected addons list in preview with labels (e.g., "Addons: EV Charger, Bird Proofing").
- Testing: Add multiple addons → verify all appear in preview → remove addon → verify removed from preview
- Status: COMPLETE ✓ - Added addons display in preview under "Additional Items" section

T020 [X][UX]: Remove "Current Configuration" button, enable real-time preview
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Update preview options automatically on product/pricing changes without requiring button click. Remove unnecessary UI element.
- Testing: Change any product field → verify preview updates within 500ms → change pricing → verify preview updates → no manual refresh needed
- Status: COMPLETE ✓ - Removed condition check, preview now updates automatically on all changes

T021 [X][UX]: Enhance category dropdown with comprehensive options
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: Update CATEGORIES constant to include: ['Panels', 'Inverter', 'Battery', 'Mounting Structure', 'EV Charger', 'Electrical', 'Labour', 'Addons', 'Other'].
- Testing: Open category dropdown → verify all 9 categories present → create line item with each category → verify saves correctly
- Status: COMPLETE ✓ - Updated CATEGORIES array with 9 comprehensive options

Post-checkpoint: Run verification commands; test themes/breakpoints; verify addons flow end-to-end; confirm PASS.

## Phase 5 – [US2] Multi-option quoting & comparison (P3) - SKIPPED

Story goal: Create up to three options and compare metrics side-by-side.
Reason for skipping: Deferred to future iteration. Current single-option flow meets MVP requirements.

T011 [SKIPPED][US2][P]: Add options manager (presets/duplicate)
- Status: SKIPPED - Not required for MVP

T012 [SKIPPED][US2][P]: Comparison table wiring
- Status: SKIPPED - Not required for MVP

T013 [SKIPPED][US2]: Autosave per lead + options set
- Status: SKIPPED - Not required for MVP

## Phase 6 – [US3] Compliance validation before submit (P3) - SKIPPED

Story goal: Block submission until required artefacts are provided.
Reason for skipping: User requirement changed - no blocking for quote submission. Installers should be able to submit quotes without mandatory compliance documents.

T014 [SKIPPED][US3][P]: Compliance UI and validators
- Status: SKIPPED - No blocking validation required per user request

T015 [SKIPPED][US3]: Compliance service hook
- Status: SKIPPED - No blocking validation required per user request

## Final Phase – Polish & Cross-Cutting

T016 [X][Polish][P]: Performance pass (<500ms perceived)
- Path: `src/components/quote-builder/*`
- Action: Ensure recalculation and rendering are responsive.
- Testing: Change assumptions → verify preview updates < 500ms → add/remove addons → verify line items sync < 500ms → modify line items → verify totals update < 500ms
- Status: COMPLETE ✓ - All useEffect hooks optimized for immediate updates; real-time preview confirmed working

T017 [X][Polish][P]: Documentation and decisions
- Path: `specs/008-description-enhance-existing/`
- Action: Update spec.md and tasks.md with final decisions.
- Testing: Verify all completed tasks marked with ✓ → verify skipped phases documented with reasons → verify spec.md reflects implemented features
- Status: COMPLETE ✓ - Updated spec.md with User Story 4; tasks.md with all phase details and skip reasons

Post-checkpoint: Final verification and testing complete. ✅ ALL CHECKS PASSED

## Summary of Implementation

**Completed Phases:**
- ✅ Phase 1: Setup (T001-T003)
- ✅ Phase 2: Foundational (T004-T006)
- ✅ Phase 3: US1 - Real-time calculator accuracy (T007-T010)
- ✅ Phase 4: UX Improvements & Addon Integration (T018-T021)
- ⏭️ Phase 5: US2 - Multi-option quoting (SKIPPED - Future iteration)
- ⏭️ Phase 6: US3 - Compliance validation (SKIPPED - No blocking required)
- 🔄 Final Phase: Polish & Documentation (T016-T017)

**Key Achievements:**
1. Integrated professional calculator with accurate pricing and ROI calculations
2. Added configurable financial assumptions panel (yield, self-consumption, tariffs, OPEX, etc.)
3. Implemented STC zone detection from postcode with manual override
4. Auto-sync addons to pricing engine for accurate total calculations
5. Real-time preview updates without manual refresh
6. Enhanced category options (9 categories for better organization)
7. Proper handling of N/A payback scenarios

**Files Created/Modified:**
- Created: `src/utils/quoteCalculator.ts` (calculator module)
- Created: `src/utils/stcZones.ts` (STC zone mapping)
- Modified: `src/components/QuoteBuilderModal.tsx` (calculator integration, addon sync, real-time preview)
- Modified: `src/components/quote-builder/PricingEngine.tsx` (assumptions panel, postcode input, enhanced categories)
- Modified: `src/components/quote-builder/CustomerPreview.tsx` (N/A handling, addon display)
- Updated: `specs/008-description-enhance-existing/spec.md` (added User Story 4)
- Updated: `specs/008-description-enhance-existing/tasks.md` (all phase updates)

Dependencies:
- Story order: US1 → UX Improvements → Polish
- All parallel tasks [P] executed successfully

MVP Scope: COMPLETE
- Phase 3 (US1): Calculator accuracy ✓
- Phase 4 (UX): Addon integration & real-time updates ✓
