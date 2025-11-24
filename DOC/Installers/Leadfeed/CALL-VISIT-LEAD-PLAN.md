
# CALL_VISIT Lead Plan
Date: 2025-11-24

## 1. Overview
CALL_VISIT leads are visible to multiple installers until purchased. Once purchased, the lead is locked to the buyer and unavailable to others. The journey ends after purchase, with status updates reflected for all roles (installer, admin, homeowner).

**Key Audit-Driven Enhancements:**
- All status, unlock, and contact masking logic must be enforced by the backend (using enums: APPROVED, PURCHASED, etc.).
- Implement and use `POST /api/installer/leads/{id}/purchase` endpoint; remove all simulated/local unlock logic.
- All price and property fields must be sourced from backend (`lead.leadPrice`, `roofType`, etc.).
- Remove all mock data and local state hacks from the feed and card components.
- Ensure audit logging for every purchase attempt and status change.
- Backend must atomically check/update lead status to prevent double-purchase (race condition).
- UI must use backend enums for status and quoteType; do not collapse or remap types.
- (Optional) Add a countdown timer for lead expiry if required.

---

## 2. User Stories
- As a verified installer, I see CALL_VISIT leads in my unified feed with summary and masked contact details (masking enforced by backend).
- I can click "Purchase" to buy a lead. A confirmation modal shows price and terms (from backend).
- After purchase, the card updates with full contact details, a purchased badge, and moves to "My Purchased Leads".
- If another installer purchases the lead, I see a "Purchased by another installer" badge and the purchase button is disabled.
- My purchased CALL_VISIT leads remain accessible with contact details.
- If a lead is cancelled/archived by admin/homeowner, it is marked "No longer available" in my feed.
- All status and unlock logic is server-driven (no local hacks).

---

## 3. Purchase Experience
- Confirmation modal before purchase ("Are you sure? This action cannot be undone.").
- Price and terms shown clearly (from backend field, not hardcoded).
- After purchase, show a success toast/notification and auto-scroll to the purchased lead.
- Purchase triggers real backend call (`POST /api/installer/leads/{id}/purchase`), not local unlock.
- If a countdown/expiry is required, show timer from backend field.

---

## 4. Post-Purchase Handling
- Purchased leads move to a "My Purchased Leads" section/tab.
- If purchased by another installer, show a disabled state and badge.
- All contact unlocks and status changes are reflected by backend data only.

---

## 5. Status Sync & Security
- Real-time or near-real-time status updates across installer, admin, and homeowner roles.
- Optimistic UI: show as purchased immediately, confirm with backend.
- Log all purchase attempts and status changes for audit trail (backend responsibility).
- Backend must atomically check/update lead status to prevent double-purchase (race condition).
- All status, unlock, and masking logic must be enforced by backend enums and fields.

---

## 6. Edge Cases
- If an installer tries to purchase a just-sold lead, show error: "Sorry, this lead was just purchased by another installer." (backend error handling).
- If a lead is cancelled/archived after purchase, show "No longer available" state (from backend status).

---

## 7. UI/UX
- Visual cues: available, purchased (by me), purchased (by another), expired (all from backend status).
- Tooltip/info icon explaining "CALL_VISIT" for new installers.
- All UI state must be mapped directly from backend enums and fields (no collapsing or placeholder values).

---

## 8. Analytics
- Track conversion rates: views vs purchases.
- Optionally, highlight "Recently purchased" leads.
- Remove all mock data and local state hacks from analytics logic.

---

## 9. Acceptance Criteria
- Only one installer can purchase a CALL_VISIT lead; others see disabled state after purchase (enforced by backend atomic check).
- Contact details unlock only for the purchasing installer (masking/unlocking enforced by backend).
- Status updates are reflected for all roles in near real-time (server-driven, not local logic).
- All purchase attempts and status changes are logged (audit trail).
- UI/UX follows semantic, accessible, and multi-theme standards.
- All price, property, and status fields are sourced from backend (no hardcoded or placeholder values).
- No mock data or local unlock logic remains in codebase.

---
End of Plan.
