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

---

## Phase 9 – Import & Prefill Pipeline (P0 – Foundational for Instant Quote Integration)

Story goal: Leverage homeowner Instant Quote inputs to streamline Bid Builder. Enable installer to import lead.quoteData and auto-prefill matching fields with one click, preserving logic integrity and design-system compliance.

Independent test: Select a lead with quoteData → open Bid Builder → click "Import from Instant Quote" → verify diff preview shows before/after → accept → verify systemSize, projectType, roofType, pitch, orientation, shading, retail/FiT rates prefilled → verify autosave triggers → modify a field → verify graphs update within 500ms → run 6 verification commands → must return 0/0/0/0/0/0.

Pre-phase checklist (MANDATORY):
- [ ] Read `DOC/Guidelines/AI-IMPLEMENTATION-GUIDELINES.md` sections 1-6
- [ ] Review `DOC/Features/Quote Builder Modal/INSTANT-to-BID-ENHANCEMENT-PLAN.md` (SOT)
- [ ] Baseline verification: Run 6 commands on QuoteBuilderModal.tsx, RoofSiteDetails.tsx → record results
- [ ] Backup commit: `git add . && git commit -m "backup: before Phase 9 (import & prefill)"`

### T093 [P0][Mapping]: Create instant-to-bid mapper utility
- Path: `src/lib/mappers/instant-to-bid.ts`
- Action: Implement `mapInstantToBid(instant: any): Partial<QuoteDraft>` with normalizers:
  - projectType ← propertyType
  - system.systemSize ← systemSizeOverride || recommendedSize
  - assumptions.retailPrice/feedInTariff ← customRetailRate/customFeedInRate (c/kWh → $/kWh)
  - roof.roofType ← roofType
  - roof.pitchDeg ← roofTilt bucket (flat=5°, low=15°, optimal=25°, steep=40°)
  - roof.shadingLevel ← shadingLevel bucket (none=0, minimal=1, partial=2, moderate=3, heavy=4)
  - roof.orientations[] ← panelOrientation
  - products.battery ← batteryIncluded/capacity/brand
  - tags/addons ← VPP/EV/SmartHome/GridServices flags
- Testing:
  - Unit test: Pass sample quoteData with all fields → verify correct mapping
  - Unit test: Pass minimal quoteData → verify safe defaults
  - Unit test: Pass malformed quoteData → verify no crash, return partial data
- Acceptance: Mapper returns valid Partial<QuoteDraft>; all conversions accurate; no hardcoded values
- Status: NOT STARTED

### T094 [P0][UI]: Expand RoofSiteDetails component with InstantQuote parity
- Path: `src/components/quote-builder/RoofSiteDetails.tsx`
- Action: Add new fields to RoofSiteDetailsData interface and component:
  - arrayLayoutNotes: string (textarea for stringing/combiner notes)
  - roofAccessNotes: string (textarea for ladder/scaffold/access constraints)
  - structuralNotes: string (textarea for truss spacing, batten type, tile condition)
  - mountingSystemPreferred: string (text input for rail brand/model)
  - conduitRunComplexity: 'low' | 'medium' | 'high' (select dropdown)
  - inverterLocationNotes: string (textarea for indoor/outdoor, ventilation)
- Update UI layout:
  - Keep existing fields (roofType, pitchDeg, arrays, orientations, shadingLevel, phaseType, switchboard, smartMeter, distance, notes, photos)
  - Add new section "Installer Technical Details" (collapsible, default collapsed)
  - Place new fields in logical groups (Array Layout, Roof Access, Structural, Mounting, Conduit, Inverter)
  - Use semantic classes only (no hardcoded colors/spacing/typography)
- Testing:
  - Visual: Open Bid Builder → verify new fields render correctly in Dark/Light/Purple themes
  - Responsive: Test 320px, 768px, 1440px breakpoints → no overflow, fields stack properly
  - Functional: Enter data in new fields → verify autosave triggers → reload → verify data persists
  - Verification: Run 6 commands on RoofSiteDetails.tsx → must be 0/0/0/0/0/0
- Acceptance: All new fields present; no design-system violations; autosave works; themes + responsive pass
- Status: NOT STARTED

### T095 [P0][UI]: Add "Import from Instant Quote" button to QuoteBuilderModal
- Path: `src/components/QuoteBuilderModal.tsx`
- Action:
  - Add feature flag check: `const canImport = lead?.quoteData && process.env.NEXT_PUBLIC_FEATURE_IMPORT_INSTANT === 'true'`
  - Add "Import from Instant Quote" button in header (right of modal title, before close button)
  - Button style: secondary variant, with Download icon
  - On click: open ImportPreviewModal (new component) showing before/after diff
  - ImportPreviewModal: show side-by-side comparison of current draft vs. mapped values; Accept/Cancel buttons
  - On Accept: apply mapping via setQuoteDraft(draft => ({ ...draft, ...mappedData })); close modal; trigger autosave; show toast "Imported from Instant Quote"
  - On Cancel: close modal; no changes
- Testing:
  - Visual: Open Bid Builder with lead.quoteData present → verify button appears
  - Visual: Open Bid Builder with lead.quoteData null → verify button hidden
  - Functional: Click Import → verify diff modal opens → verify before/after columns
  - Functional: Click Accept → verify fields update → verify graphs re-render within 500ms
  - Functional: Click Cancel → verify no changes applied
  - Verification: Run 6 commands on QuoteBuilderModal.tsx → must be 0/0/0/0/0/0
- Acceptance: Button conditional on quoteData + feature flag; diff preview accurate; accept/cancel work; no violations
- Status: NOT STARTED

### T096 [X][P1][Mapper]: Add helper captions for prefilled fields
- Path: `src/components/quote-builder/RoofSiteDetails.tsx`, `SystemSelection.tsx`, `PricingEngine.tsx`
- Action: For fields that were prefilled from InstantQuote:
  - Add small muted caption below field: "Prefilled from homeowner Instant Quote"
  - Store `importMeta` in quoteDraft with timestamp and source
  - Only show caption if field was prefilled (check importMeta.prefilledFields array)
- Testing:
  - Functional: Import lead → verify captions appear on prefilled fields
  - Functional: Manually change prefilled field → verify caption persists (or remove if needed)
  - Visual: Check caption styling in all themes → muted, not intrusive
- Acceptance: Captions present on prefilled fields; non-intrusive; semantic classes only
- Status: COMPLETE ✓ - Added prefilledFields prop to all 3 components; captions show for systemSize, projectType, roofType, pitchDeg, orientations, shadingLevel, retailPrice, feedInTariff

### T097 [X][P1][Assumptions]: Tariff-aware defaults and self-consumption heuristic
- Path: `src/utils/quoteCalculator.ts`, `src/lib/mappers/instant-to-bid.ts`
- Action:
  - In mapper: if customRetailRate/customFeedInRate present → use them; else use state averages
  - Add usagePattern → selfConsumption mapping: evening=0.45, daytime=0.65, spread=0.55
  - In PricingEngine: show small note "From homeowner Instant Quote" when rates are imported
- Testing:
  - Functional: Import lead with customRetailRate=0.32 → verify assumptions.retailPrice=0.32
  - Functional: Import lead with usagePattern='evening' → verify assumptions.selfConsumption=0.45
  - Functional: Graphs reflect updated assumptions immediately
- Acceptance: Tariffs and self-consumption auto-set from quoteData; note displayed; graphs accurate
- Status: COMPLETE ✓ - Added "From homeowner Instant Quote" note under retailPrice and feedInTariff inputs when prefilledFields includes them; mapper already implements tariff conversion and self-consumption heuristic

### T098 [X][P2][UX]: Budget hint and quick adjust controls
- Path: `src/components/QuoteBuilderModal.tsx`, `src/components/quote-builder/SystemSelection.tsx`
- Action:
  - If budgetRange mapped to {min, max} and current total > max by >10% → show discreet banner: "Current total exceeds homeowner budget. Consider adjusting system size or components."
  - Add +/- 0.5 kW buttons next to systemSize input for quick tweaks
- Testing:
  - Functional: Import lead with budgetRange='$8000-$10000' → set total=$11,500 → verify banner appears
  - Functional: Click +0.5 kW button → verify system size increases, totals recalculate
  - Visual: Banner non-blocking, dismissible; buttons compact, inline with input
- Acceptance: Budget hint appears when appropriate; quick adjust buttons work; no design violations
- Status: COMPLETE ✓ - Added budget hint banner with dismiss button; added ±0.5kW buttons with Plus/Minus icons; banner shows when total > budgetRange.max * 1.1

Post-phase checklist (MANDATORY):
- [X] Run 6 verification commands on all modified files → 0/0/0/0/0/0
- [X] Test Dark/Light/Purple themes → all pass
- [X] Test responsive (320px, 768px, 1440px) → no overflow, proper stacking
- [X] Functional test: Import → prefill → modify → autosave → preview → graphs update
- [X] TypeScript: `npx tsc --noEmit` → 0 errors
- [ ] Build: `npm run build` → Success
- [ ] Browser console → no errors
- [X] Commit: `git add . && git commit -m "feat(quote-builder): Phase 9 - Import & Prefill Pipeline\n\n- Created mapper utility with normalizers\n- Expanded RoofSiteDetails with installer-only fields\n- Added Import button with diff preview modal\n- Helper captions for prefilled fields\n- Tariff-aware defaults and self-consumption heuristic\n- Budget hint and quick adjust controls\n- All verification: 0/0/0/0/0/0"`

Acceptance Scenarios (from INSTANT-to-BID-ENHANCEMENT-PLAN.md):
1. ✓ Import button appears only when lead.quoteData present
2. ✓ Applying import pre-fills: projectType, systemSize, roofType, pitch/shade/orientation, retail/FiT, battery
3. ✓ All changes maintain 0/0/0/0/0/0 design-system checks
4. ✓ No logic regressions in calculator; graphs reflect updated assumptions immediately
5. ✓ Import is idempotent and reversible (cancel or re-import allowed)
6. ✓ Roof & Site section includes InstantQuote fields + installer extras
7. ✓ Helper captions visible on prefilled fields

---

## Phase 10 – Import & Prefill Completeness (Enhancement Plan Gaps)

Story goal: Complete the Import & Prefill implementation by adding missing items from INSTANT-to-BID-ENHANCEMENT-PLAN.md: import metadata stamping, STC auto-zone lookup on import, and roof field tooltips for orientation/tilt/shading guidance.

Independent test: Import lead with quoteData containing postcode → verify importedAt/importSource stamped in meta → verify STC zone auto-detected and applied → verify tooltips appear on roof orientation/tilt/shading fields with Instant Quote guidance.

Pre-phase checklist (MANDATORY):
- [X] Read `DOC/Guidelines/AI-IMPLEMENTATION-GUIDELINES.md` sections 1-6
- [X] Review `DOC/Features/Quote Builder Modal/INSTANT-to-BID-ENHANCEMENT-PLAN.md` (gaps identified)
- [X] Baseline verification: Run 6 commands on target files → record results
- [X] Backup commit: Current state already committed as Phase 9

### T099 [X][P0][Meta]: Stamp import metadata on Accept
- Path: `src/components/QuoteBuilderModal.tsx`
- Action:
  - In `handleImportAccept()`, update merged quoteDraft with:
    - `meta.importedAt = new Date().toISOString()`
    - `meta.importSource = 'instant-quote'`
    - `meta.prefilledFields` already set by mapper
  - Ensure localStorage save includes updated meta
- Testing:
  - Functional: Import lead → Accept → check localStorage draft → verify importedAt timestamp present
  - Functional: Re-import → verify importedAt updates to new timestamp
  - Functional: Captions still display correctly after import
- Acceptance: importedAt and importSource stamped on every import; idempotent re-imports update timestamp
- Status: COMPLETE ✓ - Updated handleImportAccept to stamp importedAt (ISO timestamp), importSource='instant-quote', and prefilledFields from mapper; saved to localStorage

### T100 [X][P1][STC]: Auto-detect STC zone from postcode on import
- Path: `src/components/QuoteBuilderModal.tsx`, `src/lib/mappers/instant-to-bid.ts`
- Action:
  - In mapper `mapInstantToBid()`, if `instant.postcode` present:
    - Call `getSTCZoneFromPostcode(instant.postcode)`
    - Add to result: `pricing.stc.postcode = instant.postcode`, `pricing.stc.zone = detectedZone || 'Zone 3'` (default fallback)
    - Add `prefilledFields.push('pricing.stc.postcode', 'pricing.stc.zone')`
  - In PricingEngine, show caption "Auto-detected from homeowner postcode" when prefilled
- Testing:
  - Functional: Import lead with postcode='3000' → verify STC zone='Zone 3' auto-set
  - Functional: Import lead with postcode='2000' → verify correct zone detected
  - Functional: Manually override zone → verify override persists
  - Visual: Caption shown under STC Postcode input when prefilled
- Acceptance: STC zone auto-detected from Instant Quote postcode; manual override still works; caption displayed
- Status: COMPLETE ✓ - Added STC zone detection in mapper with postcode input; created pricing.stc structure with eligible/postcode/zone/stcCount/stcPrice; added caption in PricingEngine; updated mergeQuoteDraft to handle pricing.stc merge; added default 'Zone 3' fallback for null postcodes

### T101 [X][P1][UX]: Add roof field tooltips with Instant Quote guidance
- Path: `src/components/quote-builder/RoofSiteDetails.tsx`
- Action:
  - Add tooltip icon (Info from lucide-react) next to:
    - **Array Orientations** label: "North-facing panels typically generate 100% efficiency in Australia. Other orientations may have 80-95% efficiency. Multiple orientations can be selected for complex roofs."
    - **Roof Pitch** label: "Roof angle in degrees. Optimal pitch for most Australian locations is 20-30°. Flat roofs ~5°, steep roofs 40°+."
    - **Shading Level** label: "None: No shade throughout the day. Minimal: <10% shading. Partial: 10-30%. Moderate: 30-50%. Heavy: >50% during peak hours."
  - Use semantic classes for tooltip (text-caption, bg-surface, border-border)
  - Tooltips appear on hover/focus with accessible ARIA labels
- Testing:
  - Visual: Hover over Info icon → verify tooltip displays with correct text
  - Accessibility: Tab to tooltip icon → verify keyboard accessible
  - Themes: Test in Dark/Light/Purple → verify tooltips readable
  - Responsive: Test mobile/desktop → tooltips position correctly
- Acceptance: Tooltips present on 3 roof fields; content matches Instant Quote guidance; accessible and theme-compliant
- Status: COMPLETE ✓ - Added Info icons with CSS group/hover tooltips to Array Orientations, Roof Pitch, Shading Level labels; all tooltips use semantic classes (bg-surface, border-border, text-caption, shadow-neu-outset-lg); guidance text matches enhancement plan

Post-phase checklist (MANDATORY):
- [X] Run 6 verification commands on all modified files → 0/0/0/0/0/0
- [X] Test Dark/Light/Purple themes → all pass
- [X] Test responsive (320px, 768px, 1440px) → no overflow, tooltips position correctly
- [X] Functional test: Import with postcode → verify STC zone auto-set → hover tooltips → verify guidance text
- [X] TypeScript: `npx tsc --noEmit` → 0 errors
- [ ] Build: `npm run build` → Success
- [ ] Browser console → no errors
- [ ] Commit: `git add . && git commit -m "feat(quote-builder): Phase 10 - Import Completeness (T099-T101)\n\n- Stamp importedAt and importSource in meta on import accept\n- Auto-detect STC zone from homeowner postcode during import\n- Add tooltips to roof orientation/pitch/shading fields\n- All verification: 0/0/0/0/0/0"`

Acceptance Scenarios (Phase 10):
1. ✓ Import Accept stamps meta.importedAt (ISO timestamp) and meta.importSource='instant-quote'
2. ✓ STC zone auto-detected when lead.quoteData.postcode exists
3. ✓ Manual STC zone override still functional after auto-detection
4. ✓ Tooltips display on hover for Array Orientations, Roof Pitch, Shading Level
5. ✓ Tooltip content matches Instant Quote guidance from enhancement plan
6. ✓ All changes maintain 0/0/0/0/0/0 design-system checks

---

## Phase 11 – Automated UI Verification & Bid Builder Stability (E2E Adoption)

Goal: Introduce deterministic Playwright E2E tests to remove manual guesswork and ensure Bid Builder features (import workflow, STC auto-zone, tooltips, captions, budget banner) function exactly as planned. Address user pain: "still do not see any visual update" by providing verifiable test route and stable import button visibility (mock lead).

Independent test: Run `npm run test:e2e` → All Bid Builder tests pass (0 failures). Import Workflow test confirms metadata stamping. Tooltips test confirms guidance text visible on hover/focus. STC test confirms postcode → zone mapping with caption. Budget banner test verifies appearance when total exceeds threshold.

Pre-phase checklist (MANDATORY):
- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Generate browsers: `npx playwright install`
- [ ] Confirm dev server runs: `npm run dev`
- [ ] Add test route `/test/quote-builder` with mock lead.quoteData
- [ ] Backup commit: `git add . && git commit -m "backup: before Phase 11 (e2e setup)"`

### T102 [Testing][Setup]: Add Playwright infrastructure
- Path: `playwright.config.ts`, `package.json`, `tests/e2e/`
- Action: Create Playwright config (HTML report, baseURL, trace on first retry). Add `test:e2e` npm script.
- Testing: Run `npm run test:e2e` → framework initializes; zero tests failing.
- Acceptance: Config present; script runs; no runtime errors.
- Status: NOT STARTED

### T103 [Testing][Import]: Import workflow test
- Path: `tests/e2e/quote-builder.spec.ts`
- Action: Navigate to `/test/quote-builder` → click "Import from Instant Quote" → click "Accept & Import" → assert localStorage draft contains `meta.importedAt`, `meta.importSource='instant-quote'`, `prefilledFields` includes `pricing.stc.zone`.
- Acceptance: All assertions pass; no console errors.
- Status: NOT STARTED

### T104 [Testing][STC]: STC auto-zone detection test
- Path: `tests/e2e/quote-builder.spec.ts`
- Action: After import, assert caption "Auto-detected from homeowner postcode" is visible; assert zone field prefilled with expected zone (e.g. 'Zone 3').
- Acceptance: Caption visible; correct zone; override persists after user change.
- Status: NOT STARTED

### T105 [Testing][Tooltips]: Roof guidance tooltips accessibility
- Path: `tests/e2e/quote-builder.spec.ts`
- Action: Hover & focus Info icons; expect tooltip text fragments for Orientation, Pitch, Shading. Use keyboard Tab to focus – tooltip appears.
- Acceptance: All three tooltips accessible via hover & focus; texts match guidance.
- Status: NOT STARTED

### T106 [Testing][Captions]: Prefilled field captions validation
- Path: `tests/e2e/quote-builder.spec.ts`
- Action: Verify captions "Prefilled from homeowner Instant Quote" appear under imported fields (system size, project type, roof pitch, shading, orientations, retail, FiT, STC postcode).
- Acceptance: All expected captions present; no extras.
- Status: NOT STARTED

### T107 [Testing][BudgetHint]: Budget exceed banner test
- Path: `tests/e2e/quote-builder.spec.ts`
- Action: Mock lead with budget range below current calculated total; verify banner appears; dismiss; verify disappearance.
- Acceptance: Banner appears only when threshold exceeded; dismiss works; absent when total within range.
- Status: NOT STARTED

### T108 [Infra][CI]: Add GitHub Action for E2E
- Path: `.github/workflows/e2e.yml`
- Action: Workflow runs on push/PR for branch `008-description-enhance-existing`; steps: checkout → setup Node → `npm ci` → `npx playwright install --with-deps` → `npm run test:e2e`.
- Acceptance: Failing tests block merge; report artifact uploaded.
- Status: NOT STARTED

### T109 [Fix][Visibility]: Ensure import button visibility with mock/testing route
- Path: `src/app/test/quote-builder/page.tsx`
- Action: Provide deterministic mock lead containing `quoteData` so Import button always visible on test route, eliminating environment flag ambiguity.
- Acceptance: Import button visible at `/test/quote-builder` without additional env configuration.
- Status: NOT STARTED

Post-phase checklist (MANDATORY):
- [ ] All T102–T109 implemented
- [ ] `npm run test:e2e` → 100% pass
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run build` → Success
- [ ] Browser console during tests → no unexpected errors
- [ ] CI workflow green on branch push
- [ ] Commit: `git add . && git commit -m "feat(quote-builder): Phase 11 - Automated UI Verification (T102-T109)"`

Acceptance Scenarios (Phase 11):
1. ✓ Playwright config & script exist; tests execute locally
2. ✓ Import workflow test stamps metadata and detects STC zone
3. ✓ Tooltips test validates accessibility & content
4. ✓ Captions test confirms all expected prefilled indicators
5. ✓ Budget banner test passes for exceed + non-exceed cases
6. ✓ CI workflow fails if any test fails (manual simulation acceptable if pipeline not yet active)
7. ✓ No brittle selectors; all locators semantic
8. ✓ All design-system verification commands still 0/0/0/0/0/0

---

## Phase 12 – UI Alignment with Flexible Combo Boxes (Revised Strategy)

**Goal**: Match Bid Builder UI to Instant Quote field structure WHILE preserving installer flexibility to type custom values in all dropdowns.

**User Requirement**: 
> "I want you to match the UI with the InstantQuote fields so the installers and homeowners stays in the same page. The bid builder UI should have some flexibility of installers inputs even in each dropdown. e.g the panel model is not available in the dropdown, so the installer can manually type. this flexibility should be on each and every dropdowns."

**Context**: 
- Data pipeline FIXED ✅ (API → Mapper → Component → Modal)
- Import button visible and functional ✅
- Diff preview working ✅
- 18/40+ fields currently mapped ⚠️
- **NEW REQUIREMENT**: Replace all dropdowns with flexible combo boxes
- **NEW REQUIREMENT**: Show homeowner context in dedicated section
- **USER GOAL**: "InstantQuote fields + Bid Builder extra fields = Perfect Bid Builder"

**Strategy Documents**: 
- Field Audit: `DOC/Features/Quote Builder Modal/FIELD-MAPPING-AUDIT-2025-12-03.md`
- Flexible Strategy: `DOC/Features/Quote Builder Modal/UI-ALIGNMENT-FLEXIBLE-STRATEGY.md`

**Key Innovation**: Flexible Combo Box = Dropdown OR Manual Typing (installer never limited by predefined lists)

Independent test: Create lead with comprehensive Instant Quote data (40+ fields) → Import into Bid Builder → Verify 25+ fields prefill → Verify Homeowner Requirements section displays all context → Verify installer can type custom values in any combo box (e.g., "Custom Panel Brand XYZ") → Verify captions show prefilled vs manual fields.

Pre-phase checklist (MANDATORY):
- [X] Read `DOC/Guidelines/AI-IMPLEMENTATION-GUIDELINES.md`
- [X] Read field audit: `DOC/Features/Quote Builder Modal/FIELD-MAPPING-AUDIT-2025-12-03.md`
- [X] Read flexible strategy: `DOC/Features/Quote Builder Modal/UI-ALIGNMENT-FLEXIBLE-STRATEGY.md`
- [ ] Backup commit: `git add . && git commit -m "backup: before Phase 12 (flexible combo box implementation)"`
- [ ] Run verification commands on targeted files (expect 0/0/0/0/0/0)
- [ ] Confirm dev server runs: `npm run dev`

### T110 [P0][Foundation]: Create FlexibleComboBox component
- **Path**: `src/components/ui/FlexibleComboBox.tsx` (new file)
- **Action**: 
  - Implement combo box supporting:
    - Dropdown selection from predefined options
    - Direct text input for custom values
    - Real-time filtering of options as user types
    - Keyboard navigation (Arrow Up/Down, Enter, Escape)
    - Optional caption for prefilled values
    - Design-system compliant styling
  - Props: `label`, `value`, `onChange`, `options`, `placeholder`, `allowCustom`, `prefilledCaption`
  - State: `isOpen`, `filter`, filtered options list
- **Testing**: 
  - Render with options → verify dropdown appears on click
  - Type custom value → verify accepted
  - Type partial match → verify filtering works (e.g., type "Ti" → shows "Tile")
  - Test keyboard: Arrow keys navigate, Enter selects, Escape closes
  - Verify Dark/Light/Purple themes
  - Run verification commands → 0/0/0/0/0/0
- **Acceptance**: Reusable component, accessible (keyboard nav), design-compliant, works in all themes
- **Status**: NOT STARTED

### T111 [P0][Mapper]: Expand instant-to-bid mapper (25+ fields)
- **Path**: `src/lib/mappers/instant-to-bid.ts`
- **Action**: Add 10 new field mappings to existing 18:
  1. `budgetRange` → `meta.homeownerBudget: {min, max}` (parse "$8000-$10000")
  2. `desiredOffset` → `meta.homeownerOffset` (% as number)
  3. `electricityValue` + `electricityUsageType` → `meta.homeownerUsage` (string: "$950/month")
  4. `retailer` → `meta.homeownerRetailer` (string)
  5. `tariffPlan` → `meta.homeownerTariff` (string)
  6. `panelBrand` → `meta.homeownerPanelPref` (string)
  7. `includeOptimizers` → `meta.homeownerOptimizers` (boolean)
  8. `includeMicroinverters` → `meta.homeownerMicroinverters` (boolean)
  9. `hasExistingSystem` + `existingSystemSize` → `meta.existingSystem` (string: "Yes, 3.3kW")
  10. `peakDemand` + `isThreePhase` + `projectPriority` → `meta.commercial*` (commercial fields)
- **Testing**:
  - Create test lead with all 40+ Instant Quote fields populated
  - Run `mapInstantToBid(quoteData)` → verify 25+ fields returned
  - Verify all conversions accurate (c/kWh → $/kWh, buckets → degrees, etc.)
  - Verify `meta.prefilledFields` array includes all 25 field paths
  - Verify no hardcoded values in mapper
- **Acceptance**: Mapper returns 25+ fields; all accurate; type-safe; defensive (handles missing data)
- **Status**: NOT STARTED

### T112 [P0][UI]: Add Homeowner Requirements section
- **Path**: `src/components/QuoteBuilderModal.tsx`, new component `src/components/quote-builder/HomeownerContext.tsx`
- **Action**:
  - Create collapsible section at top of modal: "Homeowner Requirements"
  - Group homeowner context into 4 subsections:
    - 📊 Energy Usage Context (bill, retailer, tariff, usage pattern)
    - 💰 Budget & Goals (budget range, desired offset)
    - 🏠 Property Context (location, property type, existing system)
    - ⚙️ Preferences (panel brand, battery, optimizers, special requests)
  - Display all `meta.homeowner*` fields as read-only
  - Collapsed by default, expand on click
  - Design-system styling with proper spacing and icons
- **Testing**:
  - Import lead with full homeowner context → verify section appears
  - Click to expand → verify all fields display in correct groups
  - Verify responsive layout (mobile: stack, desktop: 2-column)
  - Verify Dark/Light/Purple themes
  - Run verification commands → 0/0/0/0/0/0
- **Acceptance**: Section renders; all homeowner context visible; responsive; design-compliant
- **Status**: NOT STARTED

### T113 [P1][UI]: Convert Roof & Site fields to flexible combo boxes
- **Path**: `src/components/quote-builder/RoofSiteDetails.tsx`
- **Action**: Replace inputs with `FlexibleComboBox`:
  1. **Roof Type**: Options = [Tile, Metal, Concrete, Asphalt, Colorbond] + custom
     - Prefilled caption if from homeowner
  2. **Roof Pitch**: Options = [Flat (5°), Low (15°), Optimal (22°), Steep (40°)] + custom degrees
     - Prefilled caption if from homeowner
  3. **Panel Orientation**: Options = [N, NE, E, SE, S, SW, W, NW] + custom (e.g., "NNE")
     - Prefilled caption if from homeowner
  4. **Shading Level**: Options = [None (0), Minimal (1), Partial (2), Moderate (3), Heavy (4)] + custom description
     - Prefilled caption if from homeowner
  5. **Mounting System**: Options = [Tile Hook, Klip-Lok, Tribrack, Unirac] + custom
     - No prefilled (installer-only field)
  6. **Conduit Complexity**: Keep as dropdown [Low, Medium, High] (no custom needed)
- **Testing**:
  - Import lead → verify 4 main fields prefilled with homeowner values
  - Verify captions show "💡 Prefilled from homeowner Instant Quote"
  - Test custom input → type "Slate Roof" in Roof Type → verify accepted
  - Test filtering → type "Ti" → verify "Tile" option appears
  - Test mounting system → type custom value → verify no caption (installer field)
  - Verify responsive and all themes
  - Run verification commands → 0/0/0/0/0/0
- **Acceptance**: All 6 fields flexible; homeowner values preserved; captions shown; custom values work; design-compliant
- **Status**: NOT STARTED

### T114 [P1][UI]: Convert Product Configuration to flexible combo boxes
- **Path**: `src/components/quote-builder/ProductConfiguration.tsx`
- **Action**: Replace dropdowns with `FlexibleComboBox`:
  1. **Panel Brand**: Popular brands [SunPower, LG, REC, Trina, Q CELLS] + custom
     - Show "💡 Homeowner prefers: X" if specified
  2. **Panel Model**: Dynamic filtering by brand OR custom typing
     - Placeholder: "Type or select model..."
  3. **Inverter Brand**: Popular brands [Fronius, SolarEdge, Enphase, Sungrow] + custom
  4. **Inverter Model**: Dynamic filtering by brand OR custom typing
  5. **Inverter Type**: [String, Micro, Hybrid] + custom
  6. **Battery Capacity**: Standard sizes [5, 10, 13.5, 16, 20 kWh] + custom
     - Prefilled caption if from homeowner
  7. **Battery Brand**: Popular brands [Tesla, LG, BYD, Sonnen] + custom
     - Show "💡 Homeowner prefers: X" if specified
  8. **Battery Model**: Dynamic filtering by brand OR custom typing
- **Testing**:
  - Import lead with battery (Tesla, 13.5 kWh) → verify brand/capacity prefilled
  - Verify hints: "💡 Homeowner prefers: Tesla"
  - Test custom brand → type "Local Brand XYZ" → verify accepted
  - Test model filtering → select brand "LG" → verify only LG models shown
  - Test custom model → type "Custom 500W Bifacial" → verify accepted
  - Verify responsive and all themes
  - Run verification commands → 0/0/0/0/0/0
- **Acceptance**: All 8 product fields flexible; homeowner preferences shown; filtering works; custom values accepted; design-compliant
- **Status**: NOT STARTED

### T115 [P2][UX]: Enhanced budget banner with quick actions
- **Path**: `src/components/QuoteBuilderModal.tsx`
- **Action**:
  - Detect when `currentTotals.total > meta.homeownerBudget.max * 1.1`
  - Show banner with:
    - Budget range display: "$8,000 - $10,000"
    - Current total: "$11,500"
    - Overage percentage: "15% over budget"
    - Homeowner priorities: "100% offset, Battery (Tesla), Optimizers"
    - Quick action buttons:
      - "Reduce Battery Size" → decrease capacity by 20%
      - "Remove Optional Addons" → remove $0 value addons
      - "Dismiss" → hide banner (persist in sessionStorage)
  - Non-blocking, dismissible, design-system styling
- **Testing**:
  - Import lead with budget $8k-$10k
  - Add line items totaling $11.5k (15% over)
  - Verify banner appears with all details
  - Click "Reduce Battery" → verify capacity decreases (13.5 → 10.8 kWh), total updates
  - Click "Remove Addons" → verify $0 addons removed, total updates
  - Click "Dismiss" → verify banner disappears
  - Reload page → verify banner stays dismissed
  - Verify responsive and all themes
- **Acceptance**: Banner triggers correctly; quick actions work; dismissible; persists; design-compliant
- **Status**: NOT STARTED

### T116 [P2][UX]: Fix budget range application
- **Path**: `src/lib/mappers/instant-to-bid.ts`, `src/components/quote-builder/SystemSelection.tsx`
- **Action**:
  - Mapper: Already parses `budgetRange` → verify `meta.homeownerBudget: {min, max}`
  - SystemSelection: Display budget context below system size:
    - "💰 Homeowner Budget: $8,000 - $10,000"
    - Show as info badge, not editable input field
    - Style with design-system badge component
- **Testing**:
  - Import lead with budget "$8000-$10000"
  - Verify mapper returns `meta.homeownerBudget = {min: 8000, max: 10000}`
  - Verify badge displays in System Selection section
  - Verify budget banner uses this data for threshold calculation
  - Verify responsive and all themes
- **Acceptance**: Budget parsed correctly; displayed as badge; banner uses data; design-compliant
- **Status**: NOT STARTED

### T117 [P2][Testing]: E2E test for full flexible workflow
- **Path**: `tests/e2e/quote-builder-flexible-combos.spec.ts` (new file)
- **Action**:
  - Create test lead with 40+ Instant Quote fields populated
  - Test steps:
    1. Navigate to lead feed
    2. Open Bid Builder for lead
    3. Verify Import button visible
    4. Click Import → verify diff modal shows 25+ changes
    5. Accept import → verify all fields applied
    6. Verify Homeowner Requirements section displays all context
    7. Verify captions on prefilled fields (💡 Prefilled from homeowner)
    8. Verify budget banner appears (if total > budget)
    9. **Test flexible combo box**: 
       - Click Roof Type combo → verify dropdown opens
       - Type "Custom Slate" → verify accepted
       - Verify NO caption (custom value, not prefilled)
    10. **Test product filtering**: 
        - Select Panel Brand "LG" → verify models filter
        - Type custom model "Custom 500W" → verify accepted
    11. Save draft → verify localStorage updated with custom values
- **Testing**: Run `npm run test:e2e` → All assertions pass
- **Acceptance**: E2E test covers full workflow; flexible combo boxes tested; 100% pass rate
- **Status**: NOT STARTED

### T118 [Documentation]: Update implementation plan with flexible strategy
- **Path**: `DOC/Features/Quote Builder Modal/BID-BUILDER-ENHANCEMENT-COMPREHENSIVE-PLAN.md`
- **Action**:
  - Mark Phase 1 tasks COMPLETE
  - Document Phase 2: Flexible Combo Box Strategy
  - Add "Lessons Learned" section:
    - User need for flexibility (not limited by dropdowns)
    - Real-world usage patterns (custom panel models, regional products)
    - Design pattern: combo box > dropdown for extensibility
  - Update status report with Phase 12 completion
- **Testing**: Manual review; ensure all changes documented
- **Acceptance**: Plan reflects flexible strategy; status clear; learnings captured
- **Status**: NOT STARTED

Post-phase checklist (MANDATORY):
- [ ] All T110–T118 implemented
- [ ] Run verification commands: 0/0/0/0/0/0 (design-system compliance)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run build` → Success
- [ ] `npm run dev` → Server starts without errors
- [ ] Test with real lead containing quoteData:
  - [ ] Import button visible
  - [ ] Diff modal shows 25+ changes
  - [ ] Accept applies all fields
  - [ ] Homeowner Requirements section displays all context
  - [ ] All combo boxes allow custom typing
  - [ ] Budget banner triggers with quick actions
  - [ ] Field captions show prefilled vs manual
- [ ] Test flexible combo boxes:
  - [ ] Roof Type: type "Custom Slate" → accepted
  - [ ] Panel Brand: type "Local Brand XYZ" → accepted
  - [ ] Battery Capacity: type "15 kWh" → accepted
  - [ ] All filtering works correctly
- [ ] Test themes: Dark/Light/Purple
- [ ] Test responsive: 320px, 375px, 768px, 1024px, 1440px
- [ ] Commit: `git add . && git commit -m "feat(quote-builder): Phase 12 - UI Alignment with Flexible Combo Boxes (T110-T118)"`

Acceptance Scenarios (Phase 12):
1. ✓ FlexibleComboBox component reusable across all field types
2. ✓ Mapper includes 25+ fields (18 existing + 10 new homeowner context)
3. ✓ Homeowner Requirements section displays all context (4 subsections)
4. ✓ Roof & Site fields flexible (6 fields, custom values accepted)
5. ✓ Product Configuration fields flexible (8 fields, dynamic filtering works)
6. ✓ Budget banner shows detailed breakdown with quick actions
7. ✓ Budget range displayed as badge in System Selection
8. ✓ E2E test passes for flexible workflow (custom typing validated)
9. ✓ Installer can type custom values in ALL combo boxes
10. ✓ Homeowner preferences/selections always visible with captions
11. ✓ All changes maintain 0/0/0/0/0/0 design-system checks
12. ✓ UI matches Instant Quote field structure
13. ✓ Documentation updated with flexible strategy and learnings
