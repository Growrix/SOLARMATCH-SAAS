# Tasks: CALL_VISIT Lead Purchase Flow
Date: 2025-11-24
Branch: `007-call-visit-lead`

## Context Source Summary
- plan.md: Defines implementation structure (service + API route, UI refactor, audit logging, tests, theming audit).
- spec.md: User stories (P1 View, P2 Purchase, P3 Purchased-by-other display, P4 Post-purchase archival) with FR-001–FR-013 & SC-001–SC-008.
- data-model.md: Entities Lead, PurchaseLogEntry, derived flags (purchasedByMe, purchasedByOther, canPurchase, maskedContact).
- research.md: Decisions on atomic transaction, conflict detection, audit logging, masking, race test.
- contracts/: OpenAPI specs for purchase and feed endpoints.
- quickstart.md: Endpoints, race test flow, validation checklist.

## Phasing Overview
Phase 1: Setup (environment & schema preconditions)
Phase 2: Foundational (shared infra tasks required before any story)
Phase 3: Story US1 (View available lead) – P1
Phase 4: Story US2 (Purchase lead) – P2
Phase 5: Story US3 (Purchased-by-other state) – P3
Phase 6: Story US4 (Post-purchase cancellation/archival) – P4
Phase 7: Polish & Cross-Cutting (performance, accessibility, theme audit, logging completeness, success criteria evidence)

Task numbering is global (T001+). [P] indicates parallelizable (different files/no shared migration artifact). Tests included (spec mandates race & state validation). Each story phase is independently shippable & testable.

---
## Phase 1: Setup
Goal: Ensure local environment, dependencies, and baseline schema readiness.

T001: Verify TypeScript strict + Next.js version (check `tsconfig.json`, `package.json`). [P]
T002: Confirm Prisma schema has required Lead fields (`installerId`, `purchasedAt`, `leadPrice`, `status`, `quoteType`, `expiresAt`). [P]
T003: Add `PurchaseLogEntry` model to `prisma/schema.prisma` if absent (id, leadId, installerId, outcome, timestamp, message). (sequential)
T004: Generate and apply Prisma migration for `PurchaseLogEntry`. (sequential)
T005: Create index on Lead (`status`, `installerId`) to aid conditional purchase query performance. (sequential)
T006: Run `npx prisma generate` to update client. (sequential)
T007: Baseline type check `npx tsc --noEmit`. (sequential)
Checkpoint P1: Schema + tooling validated; proceed.

## Phase 2: Foundational
Goal: Shared utilities/services mandatory before user stories.

T008: Create `src/types/lead.ts` definitions for derived flags (LeadFeedItem). [P]
T009: Stub `src/lib/services/purchase-service.ts` with interface `purchaseLead(id: string, installerId: string)`. [P]
T010: Implement outcome enum mapping inside service (success, already_purchased, invalid_status, error). (sequential)
T011: Add structured logger utility (if not present) `src/lib/logger.ts`. [P]
T012: Add placeholder audit log writer `logPurchaseAttempt(payload)`. (sequential)
T013: Create feed resolver service `src/lib/services/feed-service.ts` deriving flags server-side. [P]
T014: Add Zod schemas for request params & responses `src/lib/validation/leadPurchase.ts`. [P]
T015: Contract-type alignment: create TypeScript types from OpenAPI (manual mapping). (sequential)
Checkpoint P2: Service scaffolds + types ready; proceed to user stories.

## Phase 3: User Story US1 (View Available CALL_VISIT Lead) – Priority P1
Goal: Installer sees APPROVED lead with masked contact + purchase CTA.
Independent Test Criteria: Seed APPROVED lead; GET feed returns item with `canPurchase=true`, `maskedContact=true`, `purchasedByMe=false`, `purchasedByOther=false`.

T016: Implement feed endpoint `src/app/api/installer/leads/route.ts` using feed-service. (sequential)
T017: Add query parameter parsing & validation (quoteType=CALL_VISIT). (sequential)
T018: Implement masking logic in feed-service (remove contact unless purchasedByMe). (sequential)
T019: Create UI component `src/components/InstallerLeadCard.tsx` to render flags-driven state (masked placeholder). [P]
T020: Refactor `src/components/InstallerLeadFeed.tsx` to fetch endpoint, remove any `mockLeads`. (sequential)
T021: Add loading & empty states (no hardcoded colors). [P]
T022: Accessibility: Ensure card roles, focus order, alt text for masked contact. [P]
T023: Add integration test `tests/integration/feed-view.spec.ts` verifying flags + masking. (sequential)
Checkpoint P3: US1 passes test; UI & masking stable.

## Phase 4: User Story US2 (Purchase CALL_VISIT Lead) – Priority P2
Goal: Atomic purchase endpoint returns unmasked contact to purchaser.
Independent Test Criteria: One successful purchase sets installerId; conflict on second parallel attempt; purchaser sees unmasked contact.

T024: Implement purchase logic in `purchase-service.ts` (conditional update + audit insert). (sequential)
T025: Implement API route `src/app/api/installer/leads/[id]/purchase/route.ts` mapping service outcomes to HTTP codes. (sequential)
T026: Add error handling (409 conflict, 400 invalid status, 404 not found). (sequential)
T027: Update feed resolver to reflect purchased state (purchasedByMe, purchasedByOther). (sequential)
T028: UI: Add purchase button logic in `InstallerLeadCard.tsx` to call purchase endpoint; disable when !canPurchase. (sequential)
T029: Implement toast system (or extend existing) for success/conflict messages. [P]
T030: Integration test `tests/integration/purchase-success.spec.ts` (single purchase flow). (sequential)
T031: Race test `tests/integration/purchase-race.spec.ts` (parallel POST → expect one 200, one 409). (sequential)
T032: Verify audit entries (2 rows) in test using Prisma client. (sequential)
Checkpoint P4: US2 tests green; race safety validated.

## Phase 5: User Story US3 (Purchased-by-Other State) – Priority P3
Goal: Non-purchaser sees disabled card + purchased badge.
Independent Test Criteria: Purchaser vs non-purchaser feed responses differ; badge + disabled button present for non-owner.

T033: Add purchased badge visual variant in `InstallerLeadCard.tsx`. [P]
T034: Ensure purchase button hidden/disabled when `purchasedByOther=true`. (sequential)
T035: Add integration test `tests/integration/purchased-by-other.spec.ts`. (sequential)
T036: Accessibility: ARIA label for purchased state (owner/non-owner). [P]
Checkpoint P5: US3 validated.

## Phase 6: User Story US4 (Post-Purchase Cancellation/Archival) – Priority P4
Goal: Lead removed or marked inactive after archival; purchaser no longer sees active card.
Independent Test Criteria: After archival mutation (simulate via test fixture), feed excludes lead or shows inactive state both for purchaser and others.

T037: Add archival filter logic in feed-service (status or archival flag). (sequential)
T038: Create test fixture to mark lead archived (direct Prisma update). (sequential)
T039: Integration test `tests/integration/archival-visibility.spec.ts`. (sequential)
T040: UI: Render inactive state style or exclude (align with spec assumption). (sequential)
Checkpoint P6: US4 validated.

## Phase 7: Polish & Cross-Cutting
Goal: Ensure all success criteria, performance, theme compliance, and logging completeness.

T041: Performance sample: measure p95 local for purchase endpoint (log duration). (sequential)
T042: Structured logging verification (ensure all outcomes produce log). (sequential)
T043: Theme/token audit: Run 6 verification commands on modified components (expect zero matches). (sequential)
T044: Remove any leftover mock identifiers (`grep mockLeads`). (sequential)
T045: Accessibility audit: keyboard navigation, focus states, contrast checks. (sequential)
T046: Consolidate success criteria evidence in `specs/007-call-visit-lead/evidence.md`. [P]
T047: Final type + lint gates. (sequential)
T048: Prepare atomic commits (squash or separated per Phase guidelines). (sequential)
T049: Final verification checklist SC-001–SC-008. (sequential)
Checkpoint Final: Feature complete.

## Dependencies / Story Order
US1 → US2 → US3 → US4
Purchase (US2) depends on view (US1) for UI integration presence.
Purchased-by-other (US3) depends on purchase logic (US2).
Archival state (US4) depends on previous purchase & feed derivations.

## Parallel Execution Examples
- During Phase 2: T008, T009, T011, T013, T014 can run in parallel ([P]).
- US1 Phase: T019, T021, T022 parallel while endpoint tasks (T016–T018) proceed.
- US2 Phase: T029 can run while T024–T028 implemented.
- US3 Phase: T033 & T036 parallel with T034/T035.
- Polish: T046 parallel with initial audits (T041–T045).

## Implementation Strategy (MVP First)
MVP Scope: Deliver US1 + US2 only (view + purchase) with race safety and masking. This provides core monetization and unlock contact reveal. Subsequent increments add purchased-by-other display, archival lifecycle, and polish.

## Task Counts
- Total Tasks: 49
- Setup: 7
- Foundational: 8
- US1: 8
- US2: 9
- US3: 4
- US4: 4
- Polish: 9
- Parallelizable Opportunities: 15 marked [P]

## Independent Test Criteria Summary per Story
- US1: Masked view with purchase CTA.
- US2: Atomic purchase + conflict handling.
- US3: Purchased-by-other badge + disabled button.
- US4: Archival removal/inactive reflection.

## Validation of Completeness
All FR-001–FR-013 mapped: FR-001 (T024–T026), FR-002 (T018, T024), FR-003 (T024–T031), FR-004 (T024, T032, T042), FR-005 (T024), FR-006 (T020), FR-007 (T026, T037), FR-008 (T016–T018 feed), FR-009 (T026), FR-010 (expiry logic included in service feed derivation—extend T024/T027 if needed), FR-011 (T037–T039 refresh behavior), FR-012 (T020, T044 removal), FR-013 (T018, T027 flags). Success Criteria SC-001–SC-008 addressed by tasks T024/T031/T032/T041/T042/T044/T043/T037 respectively.

---
## Mandatory Compliance Workflow Addendum
Reference Standard: 13-step migration & verification workflow used in prior component-by-component tasks (`specs/006-component-by-component/tasks.md`). Applied here to each user story phase to ensure uniform gating (GATE 0 health check → Logic Audit → Pre-Implementation Verification → Implementation → Post-Verification → Multi-Theme → Responsive → Accessibility → Functional → Build Validation → Atomic Commit).

### US1 Compliance Tasks (View Available Lead)
T050: GATE 0 Health Check (US1) – Run 6 verification commands on `InstallerLeadFeed.tsx` (baseline counts recorded). (sequential)
T051: Logic Audit (US1) – Document existing UI logic/state to preserve (loading, masking placeholders). (sequential)
T052: Pre-Implementation Verification (US1) – Capture baseline violations (expect existing mock references). (sequential)
T053: Post-Migration Verification (US1) – Re-run 6 commands; expect 0/0/0/0/0/0 after T016–T023. (sequential)
T054: Multi-Theme Visual Check (US1) – Dark/Light/Purple card rendering. [P]
T055: Responsive Verification (US1) – Breakpoints 320, 375, 768, 1024, 1440 for card layout. [P]
T056: Accessibility Verification (US1) – Keyboard focus order & masked contact semantics (ARIA). (sequential)
T057: Build Validation & Atomic Commit (US1) – `tsc --noEmit`, `npm run build`, commit: "feat: US1 view lead with masking". (sequential)

### US2 Compliance Tasks (Purchase Lead)
T058: GATE 0 Health Check (US2) – Scan `purchase-service.ts`, `InstallerLeadCard.tsx` for hardcoded styles before purchase logic. (sequential)
T059: Logic Audit (US2) – Enumerate existing unlock/purchase-related UI states to preserve/remove. (sequential)
T060: Pre-Implementation Verification (US2) – Record violations & absence of atomic endpoint. (sequential)
T061: Post-Migration Verification (US2) – 6-command scan after T024–T032 modifications; expect 0 matches. (sequential)
T062: Multi-Theme Visual Check (US2) – Purchased vs available vs conflict toasts across themes. [P]
T063: Responsive Verification (US2) – Card purchase button layout on 5 breakpoints. [P]
T064: Accessibility Verification (US2) – Button focus, toast announcements (aria-live). (sequential)
T065: Build Validation & Atomic Commit (US2) – `tsc`, `npm run build`, commit: "feat: US2 atomic purchase flow". (sequential)

### US3 Compliance Tasks (Purchased-by-Other State)
T066: GATE 0 Health Check (US3) – Scan badge styles before changes. (sequential)
T067: Logic Audit (US3) – Document state derivations for purchased-by-other visibility. (sequential)
T068: Pre-Implementation Verification (US3) – Baseline style/logic violations. (sequential)
T069: Post-Migration Verification (US3) – 6-command scan after T033–T036; expect 0 matches. (sequential)
T070: Multi-Theme Visual Check (US3) – Badge colors/shadows across themes. [P]
T071: Responsive Verification (US3) – Badge & disabled states across breakpoints. [P]
T072: Accessibility Verification (US3) – ARIA label conveys ownership status. (sequential)
T073: Build Validation & Atomic Commit (US3) – `tsc`, `npm run build`, commit: "feat: US3 purchased-by-other state". (sequential)

### US4 Compliance Tasks (Archival Lifecycle)
T074: GATE 0 Health Check (US4) – Scan feed-service & archival logic region pre-change. (sequential)
T075: Logic Audit (US4) – Document current handling of archived/cancelled leads. (sequential)
T076: Pre-Implementation Verification (US4) – Record baseline absence of inactive state filtering. (sequential)
T077: Post-Migration Verification (US4) – 6-command scan after T037–T040; expect 0 matches. (sequential)
T078: Multi-Theme Visual Check (US4) – Inactive styling (if rendered) across themes. [P]
T079: Responsive Verification (US4) – Inactive/removed states across breakpoints. [P]
T080: Accessibility Verification (US4) – Ensure inactive state not keyboard-focusable if removed. (sequential)
T081: Build Validation & Atomic Commit (US4) – `tsc`, `npm run build`, commit: "feat: US4 archival visibility". (sequential)

### Final Polish Compliance Extensions
T082: Consolidated Multi-Theme Sweep – Re-check all modified components collectively. (sequential)
T083: Consolidated Responsive Sweep – Visual run-through across breakpoints for combined states. (sequential)
T084: Consolidated Accessibility Sweep – Full keyboard navigation from top to bottom. (sequential)
T085: Final 6-Command Global Scan – All touched files list must yield 0 matches. (sequential)
T086: Performance Sampling Repeat – Re-measure after all phases to confirm p95 stable. (sequential)
T087: Evidence Capture – Update `evidence.md` with screenshots/logs of scans & tests. (sequential)
T088: Release Readiness Commit – Final commit: "chore: finalize CALL_VISIT purchase feature (evidence attached)". (sequential)

## Updated Task Counts
- Total Tasks: 88 (previous 49 + 39 compliance tasks)
- Compliance Tasks Added: 39 (US1 8, US2 8, US3 8, US4 8, Final 7)
- Parallelizable Opportunities: 15 (original) + 10 (new multi-theme/responsive tasks) = 25

## Additional Parallel Opportunities
- Theme & Responsive checks (T054/T055, T062/T063, T070/T071, T078/T079) can run in parallel after respective implementation & post-verification tasks complete.

## Compliance Mapping to 13-Step Workflow
Per user story: Steps 1–3 (T050–T052 etc.), Step 4 Implementation (existing story tasks), Step 5 Post-Verification (T053 etc.), Steps 6–8 Theme/Responsive/Accessibility (T054–T056 etc.), Step 9 Functional Verification embedded in existing integration tests + Post tasks, Step 10 Build Validation (T057 etc.), Step 11 Functionality reaffirmed via tests, Step 12 Build Validation included, Step 13 Atomic Commit (T057/T065/T073/T081/T088).

---

---
End of tasks.md