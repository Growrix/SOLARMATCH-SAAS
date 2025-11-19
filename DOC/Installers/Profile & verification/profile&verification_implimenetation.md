# Installer Profile & Verification — Implementation Plan (Final)

Status: Locked for implementation
Scope: End-to-end for Installers and Admins (UI, API, DB, storage, notifications)
Stack Alignment: Next.js 14 App Router (TypeScript), NextAuth (JWT), Prisma (PostgreSQL), AWS S3, Twilio OTP, Semantic UI tokens per `DOC/Guidelines/UI-UX-Layout-and-Routing-Standards.md`

---

## 1) Goals & Non-Goals
- Goals:
  - Multi-step Installer Verification modal (submit for admin review)
  - Installer Profile Management page under dashboard
  - Admin review workflow with approve/reject/request-info + audit log
  - Reuse existing OTP + contact verification, E.164 phone format
  - Store documents in S3 via presigned uploads
  - Notifications for status changes
- Non-Goals:
  - New design system or shadcn/ui adoption (use existing semantic tokens and Button)
  - Supabase migration (remain on Prisma + Postgres)

---

## 2) Reusable Assets (Audit)
- Phone/OTP:
  - `src/components/homeowner/ContactVerificationModal.tsx`
  - `src/components/OTPVerificationModal.tsx`
  - Twilio helpers in `src/lib/twilio.ts`
  - Phone normalization already E.164 (+61) compliant; reuse helpers and patterns
- Storage:
  - S3 utilities in `src/lib/s3.ts` (upload, presign, delete, validate)
- Layout & Routing:
  - Installer dashboard group: `src/app/installer/(dashboard)/layout.tsx`
  - Marketing shell: `src/app/installer/layout.tsx`, `src/app/installer/page.tsx`
- Admin Area:
  - Listing: `src/app/admin/installers/page.tsx` + `src/components/admin/InstallersTable.tsx`
  - API list route: `src/app/api/admin/installers/list/route.ts`
- Models:
  - `PhoneVerification`, `Notification`, `InstallerProfile` (basic), `User.installerVerified`

---

## 3) Database Changes (Prisma)
Add verification and preferences models + audit log. Use S3 keys for files. Keep naming consistent and map to snake tables.

Prisma models to add (migration):

```prisma
model InstallerVerification {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName         String
  representativeName  String
  designation         String
  email               String
  phone               String
  abnOrLicense        String
  establishedYear     Int
  employeeCount       Int
  services            String[]
  serviceAreas        String[]
  postcodes           String[]
  website             String?
  socialLinks         Json?
  companyDescription  String?
  licenseDocKey       String?
  abnDocKey           String?
  logoKey             String?
  status              String   @default("PENDING") // PENDING | APPROVED | REJECTED | MORE_INFO
  adminNotes          String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  @@map("installer_verifications")
}

model InstallerVerificationLog {
  id         String   @id @default(cuid())
  userId     String
  adminId    String
  action     String   // SUBMITTED | APPROVED | REJECTED | REQUEST_INFO
  notes      String?
  createdAt  DateTime @default(now())
  @@index([userId])
  @@index([adminId])
  @@map("installer_verification_logs")
}

model InstallerPreferences {
  id                       String   @id @default(cuid())
  userId                   String   @unique
  user                     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Lead Alerts
  alertNewLead             Boolean  @default(true)
  alertLeadUpdates         Boolean  @default(true)
  alertAdminMessages       Boolean  @default(true)
  // System Alerts
  alertVerificationUpdates Boolean  @default(true)
  alertAccountActivity     Boolean  @default(true)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
  @@map("installer_preferences")
}
```

Notes:
- Continue to use `User.installerVerified` as primary verified flag; update upon approval.
- Documents stored via S3 keys; download via presigned URLs.

Migration steps:

```powershell
# From project root
npx prisma migrate dev --name add_installer_verification_models
npx prisma generate
```

---

## 4) API Endpoints (App Router)
All routes check authentication via `getServerSession(authOptions)` and role gates.

Installer-facing:
- POST `src/app/api/installer/verification/submit/route.ts`
  - Auth: INSTALLER
  - Body: JSON payload for steps 1-3, includes S3 keys for uploads
  - Creates/updates `InstallerVerification` with `status = "PENDING"`
  - Creates `InstallerVerificationLog` (SUBMITTED)
  - Creates `Notification` to admins (optional: future batch)
- GET `src/app/api/installer/profile/route.ts`
  - Auth: INSTALLER
  - Returns User + `InstallerProfile` + latest `InstallerVerification` + `InstallerPreferences`
- PUT `src/app/api/installer/profile/route.ts`
  - Auth: INSTALLER
  - Updates `InstallerProfile` and selected User fields (name, phone normalized E.164)
- GET/PUT `src/app/api/installer/preferences/route.ts`
  - Auth: INSTALLER
  - Read/update `InstallerPreferences`
- GET `src/app/api/installer/uploads/presign/route.ts` (optional)
  - Auth: INSTALLER
  - Query: `filename`, `contentType`
  - Uses `getPresignedUploadUrl(generateFileKey(user.id, filename, 'documents'))`

Admin-facing:
- GET `src/app/api/admin/installers/[id]/verification/route.ts`
  - Auth: ADMIN
  - Returns User + `InstallerVerification` + files (exposes presigned download URLs)
- PUT `src/app/api/admin/installers/[id]/verification/route.ts`
  - Auth: ADMIN
  - Body: `{ action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO', notes?: string }`
  - Updates `InstallerVerification.status`
  - Sets `User.installerVerified = true` on APPROVE; false on REJECT
  - Creates `InstallerVerificationLog` entry
  - Creates `Notification` for installer
- GET `src/app/api/admin/installers/[id]/logs/route.ts`
  - Auth: ADMIN
  - Returns `InstallerVerificationLog[]`

Implementation hints:
- Use `prisma` client from `src/lib/prisma`
- Validate payloads with Zod (server-side)
- Generate presigned URLs with `src/lib/s3.ts`
- Normalize phone numbers to E.164 (+61) consistently

---

## 5) UI — Installer

5.1 Verification Modal (multi-step)
- Location: shared component `src/components/installer/VerificationModal.tsx`
- Trigger: 
  - CTA on relevant dashboard pages when `!user.installerVerified`
  - Banner on `profile` page if `verification.status !== 'APPROVED'`
- Steps (from product brief):
  1) Personal & Company Identity
  2) Business Legal Details (ABN/license + optional uploads)
  3) Services & Coverage Areas (multiselects, postcodes, optional web/social/logo/about)
- Patterns:
  - Backdrop: `fixed inset-0 bg-background/80 backdrop-blur-sm z-modal`
  - Panel: `bg-surface border border-border rounded-xl shadow-neu-outset`
  - Sticky step header/footer with `border-b`/`border-t`
  - Use shared `Button`; inputs: `bg-surface border-border text-foreground`
  - Validation: Zod per step; disable Next/Submit until valid
  - File upload: request presigned PUT, then upload directly to S3; store key
  - Phone: reuse formatting helpers; if not verified, allow OTP flow via existing modal

5.2 Profile Page
- Path: `src/app/installer/(dashboard)/profile/page.tsx`
- Sections:
  - Header with logo/avatar + status badge (✔ Verified, ⏳ Pending, ❗ Rejected)
  - Personal Details, Company Details, Services & Areas, Website/Social
  - Edit mode: inline forms; Save/Cancel; server PUT via `/api/installer/profile`
  - Notification Preferences: toggles bound to `InstallerPreferences`
  - Contact Verification: show phone status with action to open OTP modal
- Gating:
  - If not verified, show prominent banner with button to open VerificationModal
- Accessibility & Theming:
  - Follow `UI-UX-Layout-and-Routing-Standards.md` strictly (no hardcoded colors, no `dark:`)

---

## 6) UI — Admin

6.1 Installers List (exists)
- `src/app/admin/installers/page.tsx` + `InstallersTable`
- Add row click → navigate to detail page below

6.2 Installer Detail & Review
- Path: `src/app/admin/installers/[id]/page.tsx`
- Content:
  - Profile snapshot (User + InstallerProfile)
  - Current verification application with fields and file links (presigned download)
  - Actions: Approve, Reject (with reason), Request More Info (notes)
  - Activity log (from `InstallerVerificationLog`)
- Behavior:
  - On Approve → set `User.installerVerified = true`, status = APPROVED, notify installer
  - On Reject → status = REJECTED, store note, notify installer
  - On Request Info → status = MORE_INFO, notify installer

---

## 7) Notifications
- Use existing `Notification` model
- Types to use: `SYSTEM` for verification events
- Events:
  - SUBMITTED: notify ADMIN (optional future)
  - APPROVED/REJECTED/MORE_INFO: notify INSTALLER

---

## 8) Security, Validation, and Formats
- AuthN/AuthZ:
  - Every API route checks `getServerSession`
  - Role gates: INSTALLER-only vs ADMIN-only
- Validation:
  - Zod on server for all inputs, including files metadata
  - Phone strictly E.164 (+61); convert legacy 04 → +614 on input
- Files:
  - Validate content types (`ALLOWED_DOCUMENT_TYPES`), size limits, safe filenames
  - Store only S3 keys in DB; produce presigned URLs for reads

---

## 9) Routing & Middleware
- Installer dashboard routes remain under `src/app/installer/(dashboard)/**`
- New page: `profile/page.tsx` in the same route group
- Middleware RBAC already handles ADMIN bypass and role checks; no change required

---

## 10) Rollout Plan
- Phase 1 (DB): add models & migrate
- Phase 2 (API): implement installer and admin endpoints
- Phase 3 (UI): add VerificationModal and Profile page; wire to API
- Phase 4 (Admin UI): add installer detail/review page and integrate actions
- Phase 5 (QA): theme tests (Dark/Light/Purple), responsive (320–1440), accessibility, OTP flows, uploads, admin actions
- Phase 6 (Docs): update README/admin guide; record in `DOC/Prompts/gitstatus.md`

---

## 11) Testing & Build Validation
- Run 13-step verification for migrated/added components as per `specs/007-migration-and-build/plan.md`
- Hardcoded checks (expect all zero):

```powershell
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "dark:text-|dark:bg-|dark:border-"
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "text-white\b|bg-white\b|text-black\b|bg-black\b|border-white\b"
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "bg-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|text-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]|border-(blue|green|red|yellow|purple|pink|orange|indigo|teal|cyan)-[0-9]"
Select-String -Path "src\components\installer\VerificationModal.tsx" -Pattern "text-xs|text-sm|text-lg|text-xl|text-2xl|text-3xl|font-bold|font-semibold|font-medium"
```

- Build checks:

```powershell
npx tsc --noEmit
npm run build
```

---

## 12) Acceptance Criteria
- Installer can submit verification with documents; data persists
- Admin can review and approve/reject/request more info
- Notifications sent to installer on status changes
- Profile page reflects status and allows edits + preferences
- No hardcoded UI; passes 6-command checks; builds successfully

---

## 13) Future Enhancements (Optional)
- Email templates for approval/rejection
- Webhooks/audit to external BI
- Feature gating (e.g., marketplace access only if verified) via middleware or UI guards
