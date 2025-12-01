# Instant → Bid Builder Enhancement Plan

Date: 2025-12-01
Objective: Leverage Instant Quote inputs to streamline and enhance Bid Builder. Preserve logic integrity and design-system compliance (0/0/0/0/0/0).

---

## P0 – Import & Prefill (Foundational)

1) Import action in Bid Builder header
- Add `Import from Instant Quote` button when `lead.quoteData` exists.
- On click: run mapping pipeline; show diff preview (before/after) with accept/cancel.

2) Mapping pipeline (normalizers)
- Build `mapInstantToBid(instant: any): Partial<QuoteDraft>` in `src/lib/mappers/instant-to-bid.ts`.
- Conversions:
  - projectType ← propertyType
  - system.systemSize ← systemSizeOverride || recommendedSize
  - assumptions.retailPrice/fit ← customRetailRate/customFeedInRate (c/kWh → $/kWh)
  - roof: roofType, pitchDeg (tilt bucket→deg), shadingLevel (bucket→scale), orientations[] (from panelOrientation)
  - products.battery from batteryIncluded/capacity/brand; backupCircuitRequired from backupCritical
  - pricing: pre-seed line items minimal; incentives via existing STC/VIC logic
  - tags/addons for VPP/EV/SmartHome/GridServices

3) Safety & UX
- Non-blocking banners when totals > budgetRange; clickable hint “Adjust system size or components”.
- Persist an `importMeta` stamp so imports are idempotent and auditable.

---

## P1 – Assumptions & Graph Accuracy

4) Tariff-aware defaults
- Default `assumptions.retailPrice`/`feedInTariff` from either instant custom rates or state averages.
- Display small note “From homeowner Instant Quote”.

5) Self-consumption heuristic
- Use `usagePattern` to set initial `selfConsumption` (e.g., evening→0.45, daytime→0.65, spread→0.55).

6) Postcode-driven STC guardrail
- When postcode present in instant data, run auto STC zone lookup; allow manual override as today.

---

## P1 – Roof & Site Coherence

7) Orientation model bridge
- Provide a helper to translate single orientation → initial `roof.orientations` entry.

8) Tilt/Shade conversion
- Buckets to numeric: flat=5°, low=15°, optimal=25°, steep=40°; shade none..heavy → 0..4.

---

## P2 – Battery & Advanced Options

9) Battery mapping
- If homeowner selected battery: pre-create battery block with capacity, brand, purpose; add note for backup priority.

10) Feature toggles to addons
- Map VPP/EV/SmartHome/GridServices to addons with $0 line items or tags visible in preview.

---

## P2 – UI/UX Parity Improvements

11) Helper captions
- For any prefilled field, show muted caption: “Prefilled from homeowner Instant Quote”.

12) Quick adjust controls
- In System Selection, add compact controls to tweak system size ±0.5 kW quickly.

13) Budget hint
- If `budgetRange` mapped to (min,max), show discreet hint when current total exceeds max by >10%.

---

## Deliverables & Files

- `src/lib/mappers/instant-to-bid.ts` – pure mapping + normalization helpers (+ tests if harness available)
- `src/components/QuoteBuilderModal.tsx` – import button + apply mapping + captions
- Docs: update `specs/008-description-enhance-existing/spec.md` User Story 7 (Import & Prefill)
- This plan document and the audit report in `DOC/Features/Quote Builder Modal/`

---

## Acceptance Criteria

- Import button appears only when `lead.quoteData` present.
- Applying import pre-fills at least: projectType, systemSize, roofType, pitch/shade/orientation, retail/FiT, battery (if chosen).
- All changes maintain 0/0/0/0/0/0 design-system checks.
- No logic regressions in calculator; graphs reflect updated assumptions immediately.
- Import is idempotent and reversible (cancel or re-import allowed).

---

## Rollout Notes

- Start behind a feature flag `features.importInstantQuote` (env or config).
- Add telemetry counters (import clicked, succeeded, canceled) if analytics available.
- Provide fallback path when `quoteData` is malformed – soft error toast.
