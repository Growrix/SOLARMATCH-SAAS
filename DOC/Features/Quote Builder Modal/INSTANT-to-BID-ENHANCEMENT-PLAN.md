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

Concrete normalization rules (finalized):
- Orientation: InstantQuote `panelOrientation` string → Bid `roof.orientations[]` enum entry (retain performance % in helper text).
- Tilt: InstantQuote `roofTilt` bucket → Bid `pitchDeg` default mapping: flat=5°, low=15°, optimal=25°, steep=40°.
- Shading: InstantQuote `shadingLevel` bucket → Bid `shadingLevel` numeric scale: none=0, minimal=1, partial=2, moderate=3, heavy=4.
- Rates: `customRetailRate`/`customFeedInRate` in c/kWh → `assumptions.retailPrice`/`feedInTariff` in $/kWh (divide by 100).
- Budget: `budgetRange` band → internal {min,max} for soft guidance banner.

3) Safety & UX
- Non-blocking banners when totals > budgetRange; clickable hint “Adjust system size or components”.
- Persist an `importMeta` stamp so imports are idempotent and auditable.

Helper captions (finalized):
- Any prefilled field shows a muted caption: “Prefilled from homeowner Instant Quote”.
- Tooltips reused from InstantQuote for roof orientation/tilt/shading.

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

Roof & Site – Expanded field set (finalized):
- Roof Material: tile, metal (Colorbond), flat (membrane), slate, other
- Roof Pitch: numeric degrees (derived from tilt buckets), editable by installer
- Shading Level: none/minimal/partial/moderate/heavy (stored as 0..4)
- Panel Orientation: north, northeast, northwest, east, west, southeast, southwest, south
- Array Count: number of arrays for complex roofs
- Array Layout Notes: free-text notes for stringing/combiner placement
- Roof Access Notes: ladder/scaffold, access constraints, safety considerations
- Structural Notes: truss spacing, batten type, tile condition, penetrations
- Smart Meter Required: boolean
- Switchboard Upgrade: boolean
- Distance to Switchboard (m): numeric
- Photos: list of image refs (optional)

Installer-only extras (optional but recommended):
- Mounting System Preferred: rail brand/model (text)
- Conduit Run Complexity: low/medium/high (enum)
- Inverter Location Notes: indoor/outdoor, ventilation

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

Plain-English summary (finalized):
- Add an “Import from Instant Quote” button that pre-fills Bid Builder with homeowner answers.
- Automatically map project type, system size, roof details, tariffs, battery choices, and special features.
- Convert units and buckets to installer-friendly formats (degrees, $/kWh, numeric shading).
- Show helper captions where values were prefilled and keep tooltips consistent.
- Provide quick size adjusters and a soft budget warning; keep everything reversible.

---

## Deliverables & Files

- `src/lib/mappers/instant-to-bid.ts` – pure mapping + normalization helpers (+ tests if harness available)
- `src/components/QuoteBuilderModal.tsx` – import button + apply mapping + captions
- `src/components/quote-builder/RoofSiteDetails.tsx` – expand fields to match InstantQuote + installer extras; include helper captions/tooltips
- Docs: update `specs/008-description-enhance-existing/spec.md` User Story 7 (Import & Prefill)
- This plan document and the audit report in `DOC/Features/Quote Builder Modal/`

---

## Acceptance Criteria

- Import button appears only when `lead.quoteData` present.
- Applying import pre-fills at least: projectType, systemSize, roofType, pitch/shade/orientation, retail/FiT, battery (if chosen).
- All changes maintain 0/0/0/0/0/0 design-system checks.
- No logic regressions in calculator; graphs reflect updated assumptions immediately.
- Import is idempotent and reversible (cancel or re-import allowed).
- Roof & Site section includes InstantQuote fields (orientation, tilt→pitch, shading, material) plus installer extras (array count, access, structural, notes).
- Helper captions visible on prefilled fields; design-system checks remain 0/0/0/0/0/0.

---

## Rollout Notes

- Start behind a feature flag `features.importInstantQuote` (env or config).
- Add telemetry counters (import clicked, succeeded, canceled) if analytics available.
- Provide fallback path when `quoteData` is malformed – soft error toast.

---

## Patch Outline – Expand Roof & Site Details (for developers)

Files to modify:
- `src/components/quote-builder/RoofSiteDetails.tsx`
- Optional helpers: `src/lib/mappers/instant-to-bid.ts`

Minimal UI changes (example outline – keep semantic classes):

1) Add new props to `RoofSiteDetailsData`:
- `arrays: number`
- `orientations: string[]`
- `roofAccessNotes?: string`
- `structuralNotes?: string`
- `mountingSystemPreferred?: string`
- `conduitRunComplexity?: 'low'|'medium'|'high'`
- `inverterLocationNotes?: string`

2) In `RoofSiteDetails` component, add inputs:
- Orientation select (single or multi): options = [north, northeast, northwest, east, west, southeast, southwest, south]
- Pitch input (degrees) with helper caption “Prefilled from Instant Quote (tilt → pitch)” when imported
- Shading level select mapped to numeric scale 0..4 with helper tooltip
- Array count number input + array layout notes textarea
- Roof access notes textarea
- Structural notes textarea
- Mounting system preferred text input
- Conduit run complexity select (low/medium/high)
- Inverter location notes textarea

3) Prefill logic (mapper):
- Map InstantQuote `roofTilt` → `pitchDeg` using bucket mapping
- Map `panelOrientation` → `orientations = [value]`
- Map `shadingLevel` → numeric scale per rules above
- Map `roofType` directly

4) Design-system verification:
- Ensure no hardcoded colors/typography/responsive classes outside tokens
- Run 6 commands to confirm 0 matches before commit

5) Testing notes:
- Import a lead with InstantQuote → open Bid Builder → verify prefilled roof fields
- Modify values → verify autosave and preview graphs update within 500ms
- Mobile/desktop responsiveness for new inputs; accessibility labels/tooltips present

