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

---

## Phase 7 – [US5] Graphs, Lead Details, and Preview Modal (P2)

Story goal: Add financial projection graphs, Lead Technical Details button, and Homeowner Preview modal to complete the bid builder experience.
Independent test: Open Quote Builder → click Lead Details → verify lead info displayed → close → view graphs showing ROI/annual savings → click Preview → verify bid shown as homeowner would see it with masked contact → click Edit Bid → return to builder → click Confirm & Submit → bid submitted.

### T022 [X][US5][P]: Add financial projection graphs to Quote Builder
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Import and integrate SavingsChart component to display ROI and annual cost comparison graphs using calculator data.
- Testing: View Quote Builder → verify "Financial Projections" section appears → verify Long-Term ROI tab shows cumulative savings area chart with break-even marker → verify Annual Cost tab shows bar chart comparing current bill vs with-solar → change assumptions → verify graphs update with new calculations
- Status: COMPLETE ✓ - Integrated SavingsChart with calculator totals, displayed below Customer Preview

### T023 [X][US5][P]: Add Lead Technical Details button and modal
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Add "Lead Details" button to action bar (same row as Save Draft/Submit Bid). Create inline collapsible section or modal showing lead technical details (location, property, energy bill, budget, roof type, system requirements) extracted from lead data.
- Testing: Click Lead Details button → verify modal/section opens → verify all lead fields displayed (location, postcode, property type, energy bill, budget range, desired offset, roof type, battery required, etc.) → verify close button works → verify does not interfere with quote building workflow
- Status: COMPLETE ✓ - Added Lead Details button triggering BidEvaluationModal's lead section in read-only mode

### T024 [X][US5][P]: Create Homeowner Preview Modal component
- Path: `src/components/HomeownerPreviewModal.tsx` (new file)
- Action: Build modal showing bid as homeowner would see it: System details, pricing breakdown, equipment specs, financial projections graph, installer info with masked contact ("Contact details will be unlocked after winner is selected"), and 2 action buttons: "Edit Bid" and "Confirm & Submit Bid".
- Testing: Verify modal displays all bid details → verify graphs render correctly → verify contact info masked with note → verify Edit Bid closes modal and returns to builder → verify Confirm & Submit triggers bid submission → verify proper loading states and success/error messages
- Status: COMPLETE ✓ - Created HomeownerPreviewModal with all sections, masked contact, graphs, and dual action buttons

### T025 [X][US5]: Add Preview button to Quote Builder action bar
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Add "Preview" button with Eye icon to action bar (between Lead Details and Save Draft). Wire to open HomeownerPreviewModal passing current quote draft data.
- Testing: Click Preview button → verify HomeownerPreviewModal opens with current data → verify can edit and return → verify can confirm & submit from preview
- Status: COMPLETE ✓ - Added Preview button with Eye icon, integrated with HomeownerPreviewModal

Post-checkpoint: Run verification commands; test all 3 new buttons (Lead Details, Preview, Submit); verify graphs render correctly; verify preview modal shows accurate data; confirm PASS.

---

## Final Phase – Polish & Cross-Cutting (Updated)

T016 [X][Polish][P]: Performance pass (<500ms perceived)
- Path: `src/components/quote-builder/*`
- Action: Ensure recalculation and rendering are responsive.
- Testing: Change assumptions → verify preview updates < 500ms → add/remove addons → verify line items sync < 500ms → modify line items → verify totals update < 500ms → verify graphs re-render < 500ms
- Status: COMPLETE ✓ - All useEffect hooks optimized for immediate updates; real-time preview confirmed working

T017 [X][Polish][P]: Documentation and decisions
- Path: `specs/008-description-enhance-existing/`
- Action: Update spec.md and tasks.md with final decisions.
- Testing: Verify all completed tasks marked with ✓ → verify skipped phases documented with reasons → verify spec.md reflects implemented features → verify Phase 7 documented
- Status: COMPLETE ✓ - Updated spec.md with User Stories 4 & 5; tasks.md with all phase details including Phase 7

Post-checkpoint: Final verification and testing complete. ✅ ALL CHECKS PASSED

---

## Summary of Implementation (Updated)

**Completed Phases:**
- ✅ Phase 1: Setup (T001-T003)
- ✅ Phase 2: Foundational (T004-T006)
- ✅ Phase 3: US1 - Real-time calculator accuracy (T007-T010)
- ✅ Phase 4: UX Improvements & Addon Integration (T018-T021)
- ⏭️ Phase 5: US2 - Multi-option quoting (SKIPPED - Future iteration)
- ⏭️ Phase 6: US3 - Compliance validation (SKIPPED - No blocking required)
- ✅ Phase 7: US5 - Graphs, Lead Details, and Preview Modal (T022-T025)
- ✅ Final Phase: Polish & Documentation (T016-T017)

**Key Achievements:**
1. Integrated professional calculator with accurate pricing and ROI calculations
2. Added configurable financial assumptions panel (yield, self-consumption, tariffs, OPEX, etc.)
3. Implemented STC zone detection from postcode with manual override
4. Auto-sync addons to pricing engine for accurate total calculations
5. Real-time preview updates without manual refresh
6. Enhanced category options (9 categories for better organization)
7. Proper handling of N/A payback scenarios
8. **Financial projection graphs (ROI & annual cost comparison)**
9. **Lead Technical Details button for quick reference**
10. **Homeowner Preview Modal with masked contact info**

**Files Created/Modified (Updated):**
- Created: `src/utils/quoteCalculator.ts` (calculator module)
- Created: `src/utils/stcZones.ts` (STC zone mapping)
- Created: `src/components/HomeownerPreviewModal.tsx` (preview modal for homeowner view)
- Modified: `src/components/QuoteBuilderModal.tsx` (calculator integration, addon sync, real-time preview, graphs, Lead Details button, Preview button)
- Modified: `src/components/quote-builder/PricingEngine.tsx` (assumptions panel, postcode input, enhanced categories)
- Modified: `src/components/quote-builder/CustomerPreview.tsx` (N/A handling, addon display)
- Updated: `specs/008-description-enhance-existing/spec.md` (added User Stories 4 & 5)
- Updated: `specs/008-description-enhance-existing/tasks.md` (all phase updates including Phase 7)

Dependencies:
- Story order: US1 → UX Improvements → Graphs & Preview → Polish
- All parallel tasks [P] executed successfully

MVP Scope: COMPLETE
- Phase 3 (US1): Calculator accuracy ✓
- Phase 4 (UX): Addon integration & real-time updates ✓
- Phase 7 (US5): Graphs, Lead Details, Preview Modal ✓

---

## Phase 8 – [US6] System Selection & Pricing Engine UI Optimization (P2)

Story goal: Streamline System Selection with dropdowns and compact layout; fix Pricing Engine installer cost mode overflow.
Independent test: Open Quote Builder → verify System Type is dropdown → verify System Size input is compact (no slider/range labels) → verify no price range fields → verify Project Type dropdown present → toggle Installer Cost Mode → verify layout stays within section width.

### T026 [X][US6][P]: Convert System Type to dropdown
- Path: `src/components/quote-builder/SystemSelection.tsx`
- Action: Replace button grid with single dropdown select using SYSTEM_TYPES array.
- Testing: Open System Selection → verify dropdown shows all 7 system types → select each type → verify selection updates → verify proper design system styling
- Status: COMPLETE ✓ - Replaced 4-column button grid with compact dropdown select

### T027 [X][US6][P]: Compact System Size field and remove slider
- Path: `src/components/quote-builder/SystemSelection.tsx`
- Action: Remove range slider and 0kW-20kW labels; keep only number input with reduced width (max-w-xs or similar).
- Testing: View System Size field → verify no slider present → verify no range labels → verify input is compact (not full width) → verify can still type values
- Status: COMPLETE ✓ - Removed slider and range labels; input now max-w-xs with inline kW label

### T028 [X][US6]: Remove Desired Price Range fields
- Path: `src/components/quote-builder/SystemSelection.tsx`
- Action: Remove entire "Desired Price Range (Optional)" section with Min/Max inputs.
- Testing: View System Selection → verify no price range fields present → verify component interface still accepts desiredPriceRange prop (for backward compatibility)
- Status: COMPLETE ✓ - Removed price range section; interface unchanged for compatibility

### T029 [X][US6][P]: Add Project Type dropdown
- Path: `src/components/quote-builder/SystemSelection.tsx`, `SystemSelectionData` interface
- Action: Add projectType field to interface with options: Residential, Commercial. Add dropdown after System Type.
- Testing: View System Selection → verify Project Type dropdown present → verify 2 options (Residential, Commercial) → select each → verify selection persists → verify default is Residential
- Status: COMPLETE ✓ - Added projectType dropdown with Residential/Commercial options, defaults to Residential

### T030 [X][US6]: Fix Pricing Engine installer cost mode layout
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: When installerCostMode=true, ensure COGS column fits within section. Options: reduce column widths, wrap checkbox label, use icon toggle, or stack label above checkbox.
- Testing: Toggle Installer Cost Mode ON → verify COGS column appears → verify all columns fit within section width (no horizontal overflow) → verify table headers align → toggle OFF → verify layout returns to normal
- Status: COMPLETE ✓ - Moved checkbox below title, used compact label, adjusted grid to fit COGS column properly

Post-checkpoint: Run verification commands; test all dropdowns; verify responsive behavior; confirm PASS.

---

## Final Phase – Polish & Cross-Cutting (Updated)

T016 [X][Polish][P]: Performance pass (<500ms perceived)
- Path: `src/components/quote-builder/*`
- Action: Ensure recalculation and rendering are responsive.
- Testing: Change assumptions → verify preview updates < 500ms → add/remove addons → verify line items sync < 500ms → modify line items → verify totals update < 500ms → verify graphs re-render < 500ms → change system type/project type dropdowns → verify instant updates
- Status: COMPLETE ✓ - All useEffect hooks optimized for immediate updates; real-time preview confirmed working

T017 [X][Polish][P]: Documentation and decisions
- Path: `specs/008-description-enhance-existing/`
- Action: Update spec.md and tasks.md with final decisions.
- Testing: Verify all completed tasks marked with ✓ → verify skipped phases documented with reasons → verify spec.md reflects implemented features → verify Phases 7 & 8 documented
- Status: COMPLETE ✓ - Updated spec.md with User Stories 5 & 6; tasks.md with all phase details including Phase 8

Post-checkpoint: Final verification and testing complete. ✅ ALL CHECKS PASSED

---

## Summary of Implementation (Updated)

**Completed Phases:**
- ✅ Phase 1: Setup (T001-T003)
- ✅ Phase 2: Foundational (T004-T006)
- ✅ Phase 3: US1 - Real-time calculator accuracy (T007-T010)
- ✅ Phase 4: UX Improvements & Addon Integration (T018-T021)
- ⏭️ Phase 5: US2 - Multi-option quoting (SKIPPED - Future iteration)
- ⏭️ Phase 6: US3 - Compliance validation (SKIPPED - No blocking required)
- ✅ Phase 7: US5 - Graphs, Lead Details, and Preview Modal (T022-T025)
- ✅ Phase 8: US6 - System Selection & Pricing Engine UI Optimization (T026-T030)
- ✅ Final Phase: Polish & Documentation (T016-T017)

**Key Achievements:**
1. Integrated professional calculator with accurate pricing and ROI calculations
2. Added configurable financial assumptions panel (yield, self-consumption, tariffs, OPEX, etc.)
3. Implemented STC zone detection from postcode with manual override
4. Auto-sync addons to pricing engine for accurate total calculations
5. Real-time preview updates without manual refresh
6. Enhanced category options (9 categories for better organization)
7. Proper handling of N/A payback scenarios
8. **Financial projection graphs (ROI & annual cost comparison)**
9. **Lead Technical Details button (wired to BidEvaluationModal)**
10. **Homeowner Preview Modal with masked contact info**
11. **Streamlined System Selection with dropdowns and compact layout**
12. **Fixed Pricing Engine installer cost mode overflow**

**Files Created/Modified (Updated):**
- Created: `src/utils/quoteCalculator.ts` (calculator module)
- Created: `src/utils/stcZones.ts` (STC zone mapping)
- Created: `src/components/HomeownerPreviewModal.tsx` (preview modal for homeowner view)
- Modified: `src/components/QuoteBuilderModal.tsx` (calculator integration, addon sync, real-time preview, graphs, Lead Details button, Preview button)
- Modified: `src/components/quote-builder/SystemSelection.tsx` (dropdown system type, compact size, project type dropdown, removed slider and price range)
- Modified: `src/components/quote-builder/PricingEngine.tsx` (assumptions panel, postcode input, enhanced categories, fixed installer cost mode layout)
- Modified: `src/components/quote-builder/CustomerPreview.tsx` (N/A handling, addon display)
- Updated: `specs/008-description-enhance-existing/spec.md` (added User Stories 4, 5 & 6)
- Updated: `specs/008-description-enhance-existing/tasks.md` (all phase updates including Phases 7 & 8)

Dependencies:
- Story order: US1 → UX Improvements → Graphs & Preview → UI Optimization → Polish
- All parallel tasks [P] executed successfully

MVP Scope: COMPLETE
- Phase 3 (US1): Calculator accuracy ✓
- Phase 4 (UX): Addon integration & real-time updates ✓
- Phase 7 (US5): Graphs, Lead Details, Preview Modal ✓
- Phase 8 (US6): System Selection & Pricing Engine UI Optimization ✓
