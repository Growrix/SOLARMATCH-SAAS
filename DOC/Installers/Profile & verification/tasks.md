# Installer Profile & Verification — Execution Tasks (SOT)

Mode: Frontend-first, then Backend
Scope: Installer Verification Modal + Profile Page + Admin Review
Standards: Follow `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md` and verification flow rules
Reference Process: specs/006-component-by-component/tasks.md (GATE 0, verification, atomic commits)

---

## Phase 0 — Readiness & GATE 0 (All Phases)
- Confirm design tokens and semantic classes available (bg-background, bg-surface, border-border, text-foreground, shadows)
- Ensure no new classes unless added to SOT; avoid dark: and hardcoded colors
- For each component/page below, run the 6 verification commands and expect 0/0/0/0/0/0 before marking complete

PowerShell verification commands (per file):

```powershell
Select-String -Path "<file>" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"
Select-String -Path "<file>" -Pattern "dark:text-|dark:bg-|dark:border-"
Select-String -Path "<file>" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"
Select-String -Path "<file>" -Pattern "text-white\b|bg-white\b|text-black\b|bg-black\b|border-white\b"
Select-String -Path "<file>" -Pattern "bg-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|text-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|border-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]"
Select-String -Path "<file>" -Pattern "text-xs|text-sm|text-lg|text-xl|text-2xl|text-3xl|font-bold|font-semibold|font-medium"
```

Atomic commit rule: One component/page per commit with descriptive message. Update `DOC/Prompts/gitstatus.md` after each commit.

---

## FRONTEND

### Phase F1 — Verification Modal (UI only)
- Path: `src/components/installer/VerificationModal.tsx`
- Steps UI:
  - Step 1: Personal & Company Identity (companyName, representativeName, designation, email, phone)
  - Step 2: Business Legal (abn/license, establishedYear, employeeCount, optional uploads: license/ABN)
  - Step 3: Services & Coverage (services multiselect, areas multiselect, postcodes, optional website/social/logo/about)
- Patterns:
  - Backdrop `fixed inset-0 bg-background/80 backdrop-blur-sm z-modal`
  - Panel `bg-surface border border-border rounded-xl shadow-neu-outset`
  - Sticky header/footer; Button component for actions
  - Inputs use semantic tokens; no inline styles
  - File upload UI calls a stub to request presigned URL; do not implement API yet
  - Phone field: normalize preview to +61; reuse helpers where possible
- Validation: Zod schemas per step (client-side only for now)
- A11y: role=dialog, aria-modal, focus trap, ESC/overlay close
- Tests:
  - 6-command verification = 0/0/0/0/0/0
  - Themes: Dark/Light/Purple
  - Responsive: 320, 375, 768, 1024, 1440
- Commit: "feat(installer): add VerificationModal UI (multi-step, semantic)"

### Phase F2 — Profile Page (UI only)
- Path: `src/app/installer/(dashboard)/profile/page.tsx`
- Sections:
  - Header with logo/avatar + status badge (✔ Verified, ⏳ Pending, ❗ Rejected)
  - Personal Details, Company Details, Services & Areas, Website/Social
  - Notification Preferences toggles (local state only for now)
  - Contact Verification integration: open existing `OTPVerificationModal` / `ContactVerificationModal`
  - Prominent banner + CTA to open VerificationModal when not approved
- Data: Use placeholder hooks returning mocked data; no API calls yet
- A11y & Theming: Use semantic tokens; follow UI Standards document
- Tests: same as F1; ensure modal opens and sections render
- Commit: "feat(installer): add Profile page UI with status and preferences"

### Phase F3 — Admin Installer Detail & Review (UI only)
- Path: `src/app/admin/installers/[id]/page.tsx`
- Content:
  - Snapshot: user basics + InstallerProfile
  - Verification application detail with file links (disabled for now)
  - Actions bar: Approve, Reject (reason), Request More Info (notes) — disabled UI state
  - Activity log table (mocked rows)
- Navigation: integrate row click from `InstallersTable` → `[id]` page
- Tests: 6-command check, themes, responsive
- Commit: "feat(admin): add Installer review UI (detail, actions, logs)"

### Phase F4 — Wire OTP/Contact Verification (UI integration)
- Reuse:
  - `src/components/OTPVerificationModal.tsx`
  - `src/components/homeowner/ContactVerificationModal.tsx`
- Apply in Profile & Verification flows: open OTP when needed; ensure phone formatted E.164 (+61)
- No backend change; ensure session update pattern is respected once backend is done
- Tests: open/close, input masks, visual tokens
- Commit: "chore(installer): integrate existing OTP/Contact verification modals"

---

## BACKEND

### Phase B1 — Prisma Migration
- Add models:
  - `InstallerVerification`, `InstallerVerificationLog`, `InstallerPreferences` (as in implementation plan)
- Run:

```powershell
npx prisma migrate dev --name add_installer_verification_models
npx prisma generate
```

- Commit: "db: add installer verification, logs, and preferences"

### Phase B2 — Installer APIs
- POST `/api/installer/verification/submit` — create/update application (PENDING) + log
- GET `/api/installer/profile` — aggregate User + InstallerProfile + latest Verification + Preferences
- PUT `/api/installer/profile` — update profile and selected user fields; normalize phone to E.164
- GET/PUT `/api/installer/preferences` — read/update toggles
- GET `/api/installer/uploads/presign` — presigned PUT for S3 uploads (uses `getPresignedUploadUrl`)
- Validation: Zod server-side; RBAC: INSTALLER only
- Commit: "api(installer): profile, verification submit, preferences, presign"

### Phase B3 — Admin APIs
- GET `/api/admin/installers/[id]/verification` — details + presigned download URLs for docs
- PUT `/api/admin/installers/[id]/verification` — actions APPROVE/REJECT/REQUEST_INFO; update `User.installerVerified`; log; notify
- GET `/api/admin/installers/[id]/logs` — list activity
- RBAC: ADMIN only; validate input with Zod
- Commit: "api(admin): installer verification detail + actions + logs"

### Phase B4 — Notifications
- On submit: optional notify admin(s) (SYSTEM type, future batch)
- On approve/reject/request info: notify installer (SYSTEM)
- Commit: "feat: notifications for installer verification events"

### Phase B5 — UI Wiring to APIs
- VerificationModal: submit to `/api/installer/verification/submit`; persist S3 keys
- Profile page: fetch from `/api/installer/profile`; update via PUT; preferences via dedicated route
- Admin detail: fetch verification + logs; call actions PUT and reflect status; enable buttons
- Tests: end-to-end manual flow with a seed installer and admin
- Commit: "wire: connect installer/admin UI to verification APIs"

---

## Validation & Build (Every Phase)
- 6-command verification = 0/0/0/0/0/0 for all new/edited components
- Theme tests: Dark, Light, Purple
- Responsive: 320, 375, 768, 1024, 1440
- Accessibility: keyboard, focus, ARIA, contrast
- Build:

```powershell
npx tsc --noEmit
npm run build
```

- Atomic commits per phase; update `DOC/Prompts/gitstatus.md` with commit id, timestamp, description

---

## Acceptance (Feature Complete)
- Installer can submit verification with document uploads; data persisted
- Admin can review and approve/reject/request info; logs recorded; notifications sent
- Profile page shows status, allows edits and preferences, and integrates OTP verification
- All UI passes semantic verification; build succeeds; middleware RBAC respected
