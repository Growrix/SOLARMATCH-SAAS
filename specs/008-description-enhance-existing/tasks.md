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

T001 [Setup]: Confirm repository branch and feature directory
- Path: `specs/008-description-enhance-existing/`
- Action: Ensure plan/spec/research/data-model/contracts/quickstart exist.

T002 [Setup]: Establish SOT references
- Path: `specs/008-description-enhance-existing/spec.md`
- Action: Verify References & Governance sections; link SOT files.

T003 [Setup]: Pre-migration audit gate
- Path: `specs/008-description-enhance-existing/quickstart.md`
- Action: Execute audit; document gaps vs. current modal (QuoteBuilder components).

Checkpoint: Pre/post checks completed; proceed if PASS.

## Phase 2 – Foundational (blocking for all stories)

T004 [Foundational]: Calculator alignment
- Path: `src/components/quote-builder/*`
- Action: Identify all places computing totals/ROI; plan replacement with single calculator per `ChatGPT_CalculationLogic.md`.

T005 [Foundational]: Autosave restore paths
- Path: `src/components/quote-builder/*`
- Action: Confirm draft persistence keys (leadId + option set) and restore behavior.

T006 [Foundational]: Design-system compliance
- Path: `src/components/quote-builder/*`
- Action: Replace any hardcoded classes; ensure zero violations.

Checkpoint: Pre/post checks completed; proceed if PASS.

## Phase 3 – [US1] Real-time calculator accuracy (P1)

Story goal: Accurate pricing and ROI in existing modal without rebuild.
Independent test: Change self-consumption from 0.3 to 0.7; verify Annual Savings and Payback update instantly (<500ms) and consistently.

T007 [US1][P]: Wire single calculator outputs into summary cards
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Source Subtotal, GST, Incentives, Total, $/W from calculator.

T008 [US1][P]: Wire assumptions panel to calculator
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: Bind yield, selfUse, retail, FiT, OPEX; recompute outputs.

T009 [US1]: Handle Payback = N/A when savings <= 0
- Path: `src/components/quote-builder/CustomerPreview.tsx`
- Action: Display N/A with guidance; propagate across UI.

T010 [US1]: STC zone mapping + override
- Path: `src/components/quote-builder/PricingEngine.tsx`
- Action: Apply postcode→zone; support manual override; stcCount × stcPrice.

Post-checkpoint: Run verification commands; test themes/breakpoints; confirm PASS.

## Phase 4 – [US2] Multi-option quoting & comparison (P2)

Story goal: Create up to three options and compare metrics side-by-side.
Independent test: Create A/B/C; changes in assumptions recompute all and reflect in comparison table.

T011 [US2][P]: Add options manager (presets/duplicate)
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Create up to three options; snapshot assumptions per option.

T012 [US2][P]: Comparison table wiring
- Path: `src/components/quote-builder/CustomerPreview.tsx`
- Action: Render A/B/C metrics from calculator consistently.

T013 [US2]: Autosave per lead + options set
- Path: `src/components/quote-builder/*`
- Action: Persist drafts and restore fully.

Post-checkpoint: Run verification commands; test themes/breakpoints; confirm PASS.

## Phase 5 – [US3] Compliance validation before submit (P3)

Story goal: Block submission until required artefacts are provided.
Independent test: Missing inverter datasheet shows inline error; fixing enables submit.

T014 [US3][P]: Compliance UI and validators
- Path: `src/components/QuoteBuilderModal.tsx`
- Action: Attach required artefacts; inline errors per missing artefact; block submit until all present.

T015 [US3]: Compliance service hook
- Path: `src/components/quote-builder/*`
- Action: Validate artefacts via service; prepare payloads for `/api/quotes/{leadId}/validate-compliance`.

Post-checkpoint: Run verification commands; test themes/breakpoints; confirm PASS.

## Final Phase – Polish & Cross-Cutting

T016 [Polish][P]: Performance pass (<500ms perceived)
- Path: `src/components/quote-builder/*`
- Action: Ensure recalculation and rendering are responsive.

T017 [Polish][P]: Documentation and decisions
- Path: `specs/008-description-enhance-existing/`
- Action: Update spec.md and tasks.md with final decisions.

Dependencies:
- Story order: US1 → US2 → US3
- Parallel examples:
  - Within US1: T007 and T008 are [P] (different files).
  - Within US2: T011 and T012 are [P].

MVP Scope:
- Complete Phase 3 (US1) only: calculator accuracy and immediate UI updates.
