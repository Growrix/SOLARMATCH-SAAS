# Installer Profile & Verification  Execution Tasks (SOT)

Mode: Frontend-first, then Backend
Scope: Installer Verification Modal + Profile Page + Admin Review (+ Enhancements: alignment, full editing, password change, pause status)
Standards: Follow `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md` and verification flow rules
Reference Process: specs/006-component-by-component/tasks.md (GATE 0, verification, atomic commits)

---

## Phase 0  Readiness & GATE 0 (All Phases)
- Confirm design tokens and semantic classes available (bg-background, bg-surface, border-border, text-foreground, shadows)
- Ensure no new classes unless added to SOT; avoid dark: and hardcoded colors
- For each component/page below, run the 6 verification commands and expect 0/0/0/0/0/0 before marking complete

PowerShell verification commands (per file):

``powershell
Select-String -Path "<file>" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"
Select-String -Path "<file>" -Pattern "dark:text-|dark:bg-|dark:border-"
Select-String -Path "<file>" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"
Select-String -Path "<file>" -Pattern "text-white\b|bg-white\b|text-black\b|bg-black\b|border-white\b"
Select-String -Path "<file>" -Pattern "bg-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|text-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|border-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]"
Select-String -Path "<file>" -Pattern "text-xs|text-sm|text-lg|text-xl|text-2xl|text-3xl|font-bold|font-semibold|font-medium"
``

Atomic commit rule: One component/page per commit with descriptive message. Update `DOC/Prompts/gitstatus.md` after each commit.

---

## FRONTEND

### Phase F1  Verification Modal (UI only)
(Completed baseline)

### Phase F2  Profile Page (UI only)
(Completed baseline)

### Phase F3  Admin Installer Detail & Review (UI only)
(Completed baseline)

### Phase F4  Wire OTP/Contact Verification (UI integration)
(Completed baseline)

### Phase F5  Align Verification Modal to Admin View (UI refactor)
- Path: `src/components/installer/VerificationModal.tsx`
- Convert 3-step wizard to 4 static sections matching admin view:
  - Company & Representative
  - Business Legal Information
  - Services & Coverage
  - Additional Information (website, social, description, logo & docs)
- Retain validation: consolidate schemas; show inline section error summaries.
- Preserve accessibility (role=dialog, focus trap, ESC close) and close semantics.
- Tests: 6-command verification (0/0/0/0/0/0), theme (Dark/Light/Purple), responsive (3201440).
- Commit: "refactor(installer): align VerificationModal layout with admin review design"

### Phase F6  Profile Page Expansion (Full Editable Fields)
- Path: `src/app/installer/(dashboard)/profile/page.tsx`
- Add editable section for every verification field + optional uploads:
  - licenseDoc, abnDoc, logo (file inputs, stub handlers only)
  - services multiselect, serviceAreas multiselect, postcodes editor
  - social links (facebook, instagram, linkedin, youtube)
  - company description textarea
- Provide edit/save/cancel per section (local state only until backend wired).
- Tests: verification commands, theme, responsive.
- Commit: "feat(installer): expand profile page with full verification data editing"

### Phase F7  Change Password UI (UI only)
- Add security card with Current / New / Confirm fields.
- Zod client validation: length >= 12, includes upper/lower/digit/symbol, match confirm.
- Submit button disabled until valid (stub handler).
- Commit: "feat(installer): add change password UI section"

### Phase F8  Pause / Activate Control (UI only)
- Add top bar toggle for operationalStatus: ACTIVE / PAUSED.
- Show PAUSED banner explaining no new leads while paused.
- Local mock state (backend later). Prepare semantic class usage only.
- Commit: "feat(installer): add operational pause toggle UI"

---

## BACKEND (Adjusted for new requirements)

### Phase B1  Prisma Migration (updated)
- Existing additions: `InstallerVerification`, `InstallerVerificationLog`, `InstallerPreferences`.
- Extend `InstallerProfile` with `operationalStatus` (enum-like String: ACTIVE | PAUSED | INACTIVE).
- Ensure verification model already holds optional fields; if social links better separate, leave in verification or add to profile for persistence after approval.
- No schema change for password (handled by auth provider); only API logic.

### Phase B2  Installer APIs (expanded)
- POST `/api/installer/verification/submit`  create/update application (PENDING) + log.
- GET `/api/installer/profile`  aggregate User + InstallerProfile + latest Verification + Preferences + operationalStatus.
- PUT `/api/installer/profile`  update profile + optional verification fields (post-approval editable subset) + social links.
- GET/PUT `/api/installer/preferences`  read/update toggles.
- GET `/api/installer/uploads/presign`  presigned PUT for S3 uploads.
- PUT `/api/installer/account/status`  toggle operationalStatus ACTIVE/PAUSED.
- POST `/api/installer/account/change-password`  validate current password & complexity; rotate session.

### Phase B3  Admin APIs (expanded)
- GET `/api/admin/installers/[id]/verification`  details + presigned download URLs.
- PUT `/api/admin/installers/[id]/verification`  APPROVE / REJECT / REQUEST_INFO.
- GET `/api/admin/installers/[id]/logs`  list verification log entries.
- PUT `/api/admin/installers/[id]/status`  set operationalStatus ACTIVE / PAUSED / INACTIVE.

### Phase B4  Notifications
- On submit verification  optional notify admins.
- On approve/reject/request-info  notify installer.
- (Future) On operationalStatus change (PAUSED/ACTIVE)  optional notify admins.

### Phase B5 (Updated)  Backend Integration — Installer Verification & Profile
- B5.1 DB Migration: add `InstallerVerification`, `InstallerVerificationLog`, `InstallerPreferences`; extend `InstallerProfile.operationalStatus`.
- B5.2 Aggregated Profile API: GET `/api/installer/profile` (User + Profile + latest Verification + Preferences + operationalStatus).
- B5.3 Profile Update API: PUT `/api/installer/profile` (post-approval editable subset; normalize phone E.164).
- B5.4 Verification Submit API: POST `/api/installer/verification/submit` (create/update PENDING + log SUBMITTED).
- B5.5 Upload Presign API: GET `/api/installer/uploads/presign` (S3 presigned PUT; validate type/size).
- B5.6 Password Change API: POST `/api/installer/account/change-password` (validate current + complexity; rotate session).
- B5.7 Status Toggle API: PUT `/api/installer/account/status` (ACTIVE/PAUSED) and Admin status API (ACTIVE/PAUSED/INACTIVE).
- B5.8 Admin Verification APIs: GET/PUT `/api/admin/installers/[id]/verification`, GET `/api/admin/installers/[id]/logs`.
- B5.9 Notifications: on APPROVED/REJECTED/REQUEST_INFO (optional SUBMITTED → admin).
- B5.10 Wiring & QA: Connect UI (Profile/Modal/Admin), run build checks and manual E2E.

Acceptance:
- All endpoints role-gated; validation via Zod; E.164 phone enforced.
- Profile page shows aggregated data; verification flow end-to-end works with docs.
- Admin can take actions and see logs; operationalStatus reflected in list and detail.

---

## Validation & Build (Every Phase)
(Same as baseline) plus verify new files/sections F5F8.

``powershell
npx tsc --noEmit
npm run build
``

---

## Acceptance (Feature Complete - Updated)
- Installer can submit and later edit all verification & optional fields (including uploads) via profile.
- Installer can pause/reactivate operations; status reflected in admin list.
- Installer can change password with complexity validation.
- Admin can review, approve/reject/request info, and adjust operational status (including INACTIVE).
- Notifications sent on verification status changes (and future operational status changes if added).
- All UI passes semantic verification (0/0/0/0/0/0) and builds successfully.

---

## Future Enhancements (Optional)
- Email templates for approval/rejection/pause.
- Webhooks/audit to external BI.
- Automated inactivity -> INACTIVE transitions.

---

## Phase F9: Field Parity Implementation (UI-Only)
**Based on:** UI-Field-Audit.md (2025-11-19)
**Goal:** Add missing fields to achieve full parity across Profile, Verification Modal, and Admin View

### Task F9.1: Add Representative Fields to Profile ✅ COMPLETE
- **Path:** `src/app/installer/(dashboard)/profile/page.tsx`
- **Changes:**
  - Add `representativeName` field (editable under Company Details)
  - Add `designation` field (editable under Company Details)
  - Position: After `companyName`, before `abnOrLicense`
  - Wire to `editableVerification` state
  - Include in `handleSaveVerificationEdits`
- **Validation:** 6-command semantic check (0/0/0/0/0/0)
- **Commit:** "feat(installer): add representative name and designation to profile" (d5a07e9)

### Task F9.2: Add Representative Contact Display (Read-Only) ✅ COMPLETE
- **Path:** `src/app/installer/(dashboard)/profile/page.tsx`
- **Changes:**
  - Add read-only `email` field in Company Details (sourced from user.email)
  - Add read-only `phone` field in Company Details (sourced from user.phone)
  - Purpose: Match modal structure where contact is part of application
  - Visual: Gray text or disabled input style
- **Validation:** Semantic check
- **Commit:** "feat(installer): add representative contact display to profile" (ac7e877)

### Task F9.3: Add LinkedIn/YouTube to Admin View ✅ COMPLETE
- **Path:** `src/app/admin/installers/[id]/page.tsx`
- **Changes:**
  - Update mock data: replace `facebookHandle`, `instagramHandle` with `socialLinks: { facebook, instagram, linkedin, youtube }`
  - Display all 4 social platforms in Additional Information
  - Match Profile/Modal URL structure
- **Validation:** Semantic check
- **Commit:** "feat(admin): add LinkedIn/YouTube and standardize social links" (1a22567)

### Task F9.4: Add Logo Preview in Admin View ✅ COMPLETE
- **Path:** `src/app/admin/installers/[id]/page.tsx`
- **Changes:**
  - Add Logo section after Additional Information
  - Show placeholder if `logoKey` exists
  - Message: "(Logo preview - API pending)" for now
- **Validation:** Semantic check
- **Commit:** "feat(admin): add logo preview and phone to application details" (5410114)

### Task F9.5: Rename description → companyDescription in Admin ✅ COMPLETE
- **Path:** `src/app/admin/installers/[id]/page.tsx`
- **Changes:**
  - Update mock data field: `description` → `companyDescription`
  - Update all display references
  - Align with Profile/Modal naming
- **Validation:** Semantic check
- **Commit:** "feat(admin): add LinkedIn/YouTube and standardize social links" (1a22567)

### Task F9.6: Add Phone to Admin Application Details ✅ COMPLETE
- **Path:** `src/app/admin/installers/[id]/page.tsx`
- **Changes:**
  - Add `phone` field under Company & Representative section (Application Details)
  - Currently only in Installer Information header; now in both places
- **Validation:** Semantic check
- **Commit:** "feat(admin): add logo preview and phone to application details" (5410114)

### Task F9.7: Final Parity Validation ✅ COMPLETE
- **Actions:**
  - Cross-check all fields in all three views
  - Verify field naming consistency
  - Test edit flows in Profile
  - Document final state in UI-Field-Audit.md
- **Commit:** "docs: update field parity audit with implementation results" (pending)

---

**Execution Order:** F9.1 → F9.2 → F9.3 → F9.4 → F9.5 → F9.6 → F9.7
