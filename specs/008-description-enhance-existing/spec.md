# Feature Specification: [FEATURE NAME]
# Feature Specification: Quote Builder Modal – Enhancement (Existing)

**Feature Branch**: `008-description-enhance-existing`  
**Created**: 2025-12-01  
**Status**: Draft  
**Input**: User description: "Enhance existing Quote Builder modal UI/UX and calculation logic per QUOTE-BUILDER-IMPROVEMENT-PLAN.md. Audit current state first. Do not rebuild from scratch. Follow AI-IMPLEMENTATION-GUIDELINES.md. Use improvement plan as SOT. Implement safely with phased testing and verification."

## User Scenarios & Testing (mandatory)

### User Story 1 - Accurate pricing and savings with real-time calculator (Priority: P1)

As an installer, I can configure the existing Quote Builder (system size, line items, STC/VIC incentives) and adjust assumptions (yield, self‑consumption, tariffs, OPEX) to instantly see Total price, $/W, Annual Production, Annual Savings, and Payback computed by the calculator—without leaving the modal.

**Why this priority**: This delivers core value—credible, transparent pricing and ROI—while leveraging the existing modal (no rebuild).

**Independent Test**: Enter a 6.6 kW system with line items and incentives; adjust self‑consumption from 0.3 to 0.7 and verify that Annual Savings and Payback update immediately and consistently across summary cards and preview.

**Acceptance Scenarios**:
1. Given a valid system and line items, when I toggle STC eligible and set STC price/count, then Total updates to reflect the deduction and Price/W changes accordingly.
2. Given assumptions with yield=4.2, selfUse=0.5, retail=0.30, FiT=0.08, OPEX=0, when I increase selfUse to 0.7, then Annual Savings increases and Payback decreases.
3. Given Annual Savings <= 0 (e.g., very low tariffs or very high OPEX), when I compute payback, then Payback shows "N/A" with guidance to adjust assumptions.

---

### User Story 2 - Multi‑option quoting & comparison (Priority: P2)

As an installer, I can create up to three options (Economy/Balanced/Premium) from presets or by duplicating the current configuration, and compare their size, Total, $/W, Annual Savings, and Payback side‑by‑side in Customer Preview.

**Why this priority**: Multi‑option proposals are standard in AU quoting and improve close rates.

**Independent Test**: Create options A/B/C from presets; verify comparison table renders with all metrics sourced from the same calculator logic.

**Acceptance Scenarios**:
1. Given one configured option, when I click "Add Option from Preset", then a new option appears with its own stored line items and assumptions snapshot.
2. Given three options exist, when I update assumptions (e.g., self‑consumption), then all options recompute and the comparison table reflects changes.

---

### User Story 3 - Compliance validation before submit (Priority: P3)

As an installer, I must provide required artefacts (panel/inverter/battery datasheets, CEC accreditation, licence, insurance) and receive inline validation errors if any are missing before I can submit a Quote/Bid.

**Why this priority**: Compliance reduces audit risk and rework; aligns to improvement plan.

**Independent Test**: Attempt to submit without an inverter datasheet → form displays an inline error; adding the file clears the error and enables submission.

**Acceptance Scenarios**:
1. Given a missing required document, when I click Submit, then submission is blocked and the field shows an inline error with guidance.
2. Given all required artefacts are attached, when I click Submit, then validation passes and the modal submits successfully.

---

### Edge Cases

- System size is 0 or negative → disable calculation and show guidance.
- No line items → subtotal is 0; show message to add at least one line item.
- Annual Savings computed <= 0 → Payback shows N/A with guidance to adjust assumptions.
- Combined incentives lead to negative totals → clamp at minimum 0 with warning.
- Postcode not mapped → allow manual STC zone override with transparent label.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: The existing modal MUST compute Subtotal, GST (line‑item GST flag), Incentives (STC + VIC), Total, and Price per Watt using a single calculator.
- **FR-001A**: Calculator formulas and output definitions MUST match `ChatGPT_CalculationLogic.md` exactly (no deviations).
- **FR-002**: The modal MUST compute Annual Production, Annual Savings, and Payback using user‑adjustable assumptions (yield, self‑consumption, retail price, FiT, OPEX).
- **FR-002A**: Default assumption values MUST match `QUOTE-BUILDER-IMPROVEMENT-PLAN.md` and be overrideable per lead.
- **FR-003**: When Annual Savings <= 0, the system MUST display Payback as "N/A" and a hint to adjust assumptions.
- **FR-004**: Users MUST be able to create up to three options (A/B/C) and compare their metrics side‑by‑side in Customer Preview.
- **FR-005**: STC section MUST support postcode→zone mapping with manual override and deeming factor application; value = stcCount × stcPrice.
- **FR-006**: Compliance section MUST block submission until required artefacts are attached and MUST show inline errors per missing artefact.
- **FR-007**: Autosave MUST persist drafts per lead and option set; restoring a draft MUST not lose any entered data.
- **FR-008**: All UI changes MUST follow the design‑system SOT (no hardcoded colors/typography, zero violations by verification commands).
- **FR-009**: All calculator updates MUST reflect in summary cards and comparison table within perceptibly instant time (< 500 ms perceived by user).
- **FR-010**: The feature MUST not remove or rebuild the modal—enhance only; existing API contracts remain unchanged.
- **FR-010A**: Implementation MUST pass a pre‑migration audit gate: compare current modal logic to SOT files and document gaps before any changes.
- **FR-010B**: Any logic change or clarification MUST be documented and approved per `AI-IMPLEMENTATION-GUIDELINES.md`.

Unclear or decision items (limit 3):
- **FR-011**: [NEEDS CLARIFICATION: Should FiT escalate annually with retail price or remain flat?]
- **FR-012**: [NEEDS CLARIFICATION: Should VIC interest‑free loan be displayed as financing info only (not deducted from Total)?]
- **FR-013**: [NEEDS CLARIFICATION: Default assumptions (yield, selfUse, retail, FiT, OPEX) — adopt plan defaults or expose per‑lead presets?]

### Key Entities

- **QuoteOption**: name (Economy/Balanced/Premium), systemSize, lineItems[], incentives, totals, calculator outputs, stored assumptions snapshot.
- **Assumptions**: yield, selfConsumption, retailPrice, feedInTariff, annualOpex, degradation, escalation, years.
- **Incentives**: STC {eligible, zone, stcCount, stcPrice}, VIC {rebateEligible, rebateAmount, interestFreeLoan, batteryLoan}.
- **ComplianceAttachment**: type (datasheet, accreditation, licence, insurance), label, required?, fileRef.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: Users see updated Total, $/W, Annual Savings, and Payback within 0.5 seconds of changing inputs (perceived responsiveness).
- **SC-002**: 100% of submissions are blocked if any required compliance artefact is missing, with clear inline errors.
- **SC-003**: 0 design‑system violations (0/0/0/0/0/0 across color/typography/responsive checks) on all changed files.
- **SC-004**: Multi‑option comparison shows consistent calculator outputs across all options with no mismatches in displayed metrics.
- **SC-005**: Draft restore reproduces the last saved options and assumptions without data loss in 100% of tested sessions.
 
## References & Source of Truth

- All enhancements, calculation logic, and assumptions MUST strictly follow:
	- `DOC/Features/Quote Builder Modal/QUOTE-BUILDER-IMPROVEMENT-PLAN.md`
	- `DOC/Features/Quote Builder Modal/Main Plan/ChatGPT_CalculationLogic.md`
	- `DOC/Features/Quote Builder Modal/Main Plan/ChatGPT_research.md`
	- `DOC/Guidelines/AI-IMPLEMENTATION-GUIDELINES.md`

## Assumptions & Governance

- Formulas, calculation steps, and business rules are sourced from the above SOT files.
- No new logic or deviation is allowed unless explicitly approved and documented per `AI-IMPLEMENTATION-GUIDELINES.md`.
- Pre‑migration audit MUST compare current modal logic to SOT and list gaps before changes.
- Any clarifications to FR‑011..FR‑013 MUST be resolved against SOT and recorded in the spec change log.

### Key Entities *(include if feature involves data)*
