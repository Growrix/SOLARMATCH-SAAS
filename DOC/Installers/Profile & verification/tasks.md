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

## Phase B6  Frontend-Backend Integration (CRITICAL)

**Status**: 🔴 In Progress  
**Priority**: P0 - All features currently non-functional  
**Reference**: `FRONTEND-BACKEND-INTEGRATION-AUDIT.md`

### Critical Issue
All backend APIs are functional, but no frontend-backend connections exist. Users clicking "Submit Application" see no action because data is only logged to console and never reaches the API.

### Task Breakdown

#### B6.1: Create API Client Library ✅
- **File**: `src/lib/api/installer.ts` (new)
- **Purpose**: Centralized fetch wrappers for all installer endpoints
- **Deliverables**:
  - TypeScript interfaces for request/response types
  - Error handling utilities
  - Functions: `submitVerification()`, `uploadDocument()`, `fetchProfile()`, `updateProfile()`, `updatePreferences()`, `changePassword()`, `toggleStatus()`
- **Acceptance**: All API functions typed, error handling consistent
- **Commit**: "feat(installer): add API client library for backend integration"

#### B6.2: Implement File Upload System ✅
- **Files**: 
  - `src/components/installer/VerificationModal.tsx` (update)
  - `src/hooks/useFileUpload.ts` (new custom hook)
- **Deliverables**:
  - Hidden file input elements for license, ABN, logo
  - onChange handlers with file validation (type, size)
  - Presigned URL fetch from `GET /api/installer/uploads/presign`
  - Direct S3 upload via presigned URL
  - S3 key storage in formData state
  - Upload progress indicators
  - Error handling with user feedback
- **Acceptance**: 
  - File selector opens on upload area click
  - Valid files upload to S3
  - Keys stored in form state
  - Invalid files show error messages
  - Upload progress visible
- **Commit**: "feat(installer): implement S3 file upload with presigned URLs"

#### B6.3: Wire Verification Submission ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Replace `console.log` with API call to `POST /api/installer/verification/submit`
  - Add loading state (disable submit button, show spinner)
  - Handle success: update local state, show success message, close modal
  - Handle errors: display error message, keep modal open, allow retry
  - Update profile data after successful submission
- **Acceptance**:
  - Clicking submit calls API
  - Data persists in database (verified via Prisma Studio)
  - Success feedback shown
  - Errors displayed with actionable messages
  - Modal only closes on success
- **Commit**: "feat(installer): wire verification submission to backend API"

#### B6.4: Wire Profile GET API ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Replace `useMockProfileData()` with real API fetch
  - Add `useEffect` to fetch profile data on component mount
  - Add loading skeleton during initial load
  - Handle fetch errors with retry option
  - Store API response in state
- **Acceptance**:
  - Profile data loads from database on page load
  - Loading state visible during fetch
  - Real user data displayed (not mock data)
  - Errors show retry button
  - Data refreshes after updates
- **Commit**: "feat(installer): fetch profile data from backend API"

#### B6.5: Wire Profile PUT API ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Implement API call in `handleSaveVerificationEdits()`
  - Call `PUT /api/installer/profile` with updated fields
  - Add loading state during save
  - Update local state on success
  - Show success/error feedback
- **Acceptance**:
  - Profile updates persist to database
  - Changes visible after page refresh
  - Success message shown
  - Errors handled gracefully
- **Commit**: "feat(installer): wire profile update to backend API"

#### B6.6: Wire Preferences GET/PUT APIs ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Fetch preferences from `GET /api/installer/preferences` on mount
  - Wire toggle handlers to `PUT /api/installer/preferences`
  - Implement optimistic updates (instant UI feedback)
  - Rollback on API failure
  - Show error feedback if save fails
- **Acceptance**:
  - Preferences load from database
  - Toggles update immediately (optimistic)
  - Changes persist across page refreshes
  - Failed updates rollback to previous state
- **Commit**: "feat(installer): wire preferences to backend API with optimistic updates"

#### B6.7: Wire Password Change API ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Implement API call in `handlePasswordChange()`
  - Call `POST /api/installer/account/change-password`
  - Add loading state during password change
  - Handle session invalidation (force logout after success)
  - Show success message before logout
  - Handle validation errors from API (wrong current password, weak password)
- **Acceptance**:
  - Password changes persist
  - User logged out after successful change
  - New password works on next login
  - Old password no longer works
  - Validation errors displayed clearly
- **Commit**: "feat(installer): wire password change with session invalidation"

#### B6.8: Wire Status Toggle API ✅
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Deliverables**:
  - Call `PUT /api/installer/account/status` in `handleStatusToggle()`
  - Add loading state during toggle
  - Update local state on success
  - Show feedback (success/error)
  - Verify status persists across sessions
- **Acceptance**:
  - Status changes persist to database
  - PAUSED status shows banner immediately
  - ACTIVE status removes banner
  - Changes visible after page refresh
- **Commit**: "feat(installer): wire operational status toggle to backend API"

#### B6.9: Add Loading & Error States ✅
- **Files**: All components with API calls
- **Deliverables**:
  - Add loading spinners for all async operations
  - Disable buttons/forms during submission
  - Display error messages with retry options
  - Add success toasts/messages
  - Implement timeout handling (30s limit)
- **Acceptance**:
  - All API calls show loading indicators
  - Forms disabled during submission (prevent double-submit)
  - Errors actionable (retry button, clear message)
  - Success feedback visible
  - No console errors
- **Commit**: "feat(installer): add comprehensive loading and error states"

#### B6.10: Admin Panel Integration ✅
- **Files**: `src/app/admin/installers/**`
- **Deliverables**:
  - Wire admin verification detail view to `GET /api/admin/installers/[id]/verification`
  - Wire approve/reject/request-info to `PUT /api/admin/installers/[id]/verification`
  - Wire logs display to `GET /api/admin/installers/[id]/logs`
  - Wire admin status control to `PUT /api/admin/installers/[id]/status`
  - Add loading states and error handling
- **Acceptance**:
  - Admin sees real verification submissions
  - Admin actions persist to database
  - Installer notified of admin actions
  - Logs display all verification history
  - Status changes reflected immediately
- **Commit**: "feat(admin): wire installer verification management to backend APIs"

#### B6.11: End-to-End Testing ✅
- **Scope**: Full user journey testing
- **Test Cases**:
  1. Installer submits verification → verify DB entry created with status PENDING
  2. Upload license/ABN/logo → verify files in S3, keys in DB
  3. Admin approves verification → verify `user.installerVerified = true`
  4. Installer edits profile → verify changes persist
  5. Installer changes password → verify forced logout, new password works
  6. Installer toggles PAUSED → verify no new leads assigned
  7. Admin rejects verification → verify installer sees rejection message
  8. Admin requests more info → verify notification sent
  9. All preferences toggle → verify persistence across sessions
  10. Page refresh after each action → verify data consistency
- **Acceptance**: All test cases pass, no console errors, TypeScript clean
- **Documentation**: Update `BACKEND-COMPLETE.md` with test results

### Validation Commands (Run after each task)

```powershell
# TypeScript check
npx tsc --noEmit

# Build check
npm run build

# Semantic verification (per modified file)
Select-String -Path "<file>" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"
Select-String -Path "<file>" -Pattern "dark:"
Select-String -Path "<file>" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"
Select-String -Path "<file>" -Pattern "text-white|bg-white|text-black|bg-black"
Select-String -Path "<file>" -Pattern "text-xs|text-sm|text-lg|text-xl|font-bold|font-semibold"
```

### Success Criteria
- ✅ All form submissions reach backend APIs
- ✅ Data persists in PostgreSQL database
- ✅ File uploads work with S3 presigned URLs (or gracefully skipped if S3 not configured)
- ✅ Profile data loads from API (no mock data)
- ✅ All updates persist across page refreshes
- ✅ Admin sees submitted verifications and can take actions
- ✅ Admin actions update installer state and send notifications
- ✅ Password change invalidates session
- ✅ Loading states visible during all async operations
- ✅ Errors displayed with actionable messages
- ✅ Form validation prevents invalid submissions
- ✅ Success feedback confirms actions
- ✅ No console errors in browser
- ✅ TypeScript compiles with 0 errors
- ✅ npm run build succeeds

### Dependencies
- ✅ Backend APIs functional (Phase B5 complete)
- ✅ Database schema complete
- ✅ Validation schemas in place
- ⚠️ S3 configuration (optional - AWS credentials needed for uploads)

### Rollback Plan
If critical issues found, rollback to commit before Phase B6 and reassess approach.

---

## Phase B7: Data Synchronization & Field Alignment (CRITICAL)

**Status**: 🔴 NEW PHASE - Critical data mismatch issues  
**Priority**: P0 - Must fix before production  
**Reference**: `FIELD-MISMATCH-AUDIT.md`  
**Date Created**: November 20, 2025

### Critical Issue
Phone number and other fields stored in `InstallerVerification` are NOT synced to `User` model, causing mismatches between Personal Details display and submitted verification data. Profile page shows authentication phone instead of verification phone.

### Root Cause
Data is stored in three separate models (User, InstallerProfile, InstallerVerification) without synchronization logic. When installer submits verification with phone `+61401731255`, it's stored in `verification.phone` but `user.phone` remains unchanged, causing Personal Details section to show wrong phone.

### Architecture Decision: Single Source of Truth
- **User Model**: Authentication + basic profile (email, name, phone, companyName)
- **InstallerVerification**: Business details + verification status
- **Sync Rule**: On admin approval, sync verification data → User model

---

### Task B7.1: Fix Profile Personal Details Phone Display 🔴 CRITICAL
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Issue**: Line 490 shows `user.phone` (authentication phone), not `verification.phone`
- **Change**:
  ```tsx
  // OLD
  <p className="text-body text-foreground">{user.phone}</p>
  
  // NEW
  <p className="text-body text-foreground">{verification?.phone || user.phone || 'Not provided'}</p>
  ```
- **Acceptance**: 
  - Personal Details shows verification phone if exists
  - Falls back to user phone if no verification
  - Shows "Not provided" if both null
- **Test**: Submit verification with different phone → Personal Details updates immediately
- **Commit**: "fix(installer): show verification phone in Personal Details section"

---

### Task B7.2: Fix Profile Company Details Phone Display 🔴 CRITICAL
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Issue**: Line 573 shows `user.phone` with misleading label "(from account)"
- **Change**:
  ```tsx
  // OLD
  <div>
    <label>Representative Phone (from account)</label>
    <p>{user.phone}</p>
  </div>
  
  // NEW
  <div>
    <label>Representative Phone</label>
    <p>{verification?.phone || user.phone || 'Not provided'}</p>
  </div>
  ```
- **Acceptance**: Company Details shows correct verification phone
- **Commit**: "fix(installer): show verification phone in Company Details section"

---

### Task B7.3: Fix Profile Name Display 🟡 MEDIUM
- **File**: `src/app/installer/(dashboard)/profile/page.tsx`
- **Issue**: Personal Details shows `user.name`, but verification has `representativeName`
- **Change**:
  ```tsx
  // In Personal Details section
  <p>{verification?.representativeName || user.name || 'Not provided'}</p>
  ```
- **Acceptance**: Shows representative name from verification if exists
- **Commit**: "fix(installer): prioritize verification representative name in Personal Details"

---

### Task B7.4: Create Admin Verification View API (Backend) 🔴 CRITICAL
- **File**: `src/app/api/admin/installers/[id]/verification/route.ts` (NEW)
- **Endpoint**: `GET /api/admin/installers/[id]/verification`
- **Response**:
  ```typescript
  {
    installer: {
      id: string;
      name: string;
      email: string;
      phone: string; // From User model
      phoneVerified: boolean;
      createdAt: string;
    },
    verification: {
      // All fields from InstallerVerification model
      companyName: string;
      phone: string; // From verification (may differ from user.phone)
      // ... all other verification fields
    },
    logs: VerificationLog[];
  }
  ```
- **Acceptance**: 
  - Returns aggregated User + Verification data
  - Admin role required
  - 404 if installer not found
- **Commit**: "feat(api): add admin installer verification view endpoint"

---

### Task B7.5: Wire Admin View to Real API (Frontend) 🔴 CRITICAL
- **File**: `src/app/admin/installers/[id]/page.tsx`
- **Changes**:
  1. Remove `useMockVerificationData` hook (lines 8-59)
  2. Create `useEffect` to fetch from `/api/admin/installers/[id]/verification`
  3. Add loading state
  4. Add error handling
  5. Update all references to use real data
- **Acceptance**:
  - Admin view shows real database data
  - Phone numbers match verification submission
  - No mock data visible
- **Commit**: "feat(admin): wire installer verification view to backend API"

---

### Task B7.6: Create User Sync Logic on Verification Approval (Backend) 🔴 CRITICAL
- **File**: `src/app/api/admin/installers/[id]/verification/status/route.ts` (NEW or UPDATE)
- **Endpoint**: `PUT /api/admin/installers/[id]/verification/status`
- **Logic**:
  ```typescript
  if (newStatus === 'APPROVED') {
    // Sync verification data to User model
    await prisma.user.update({
      where: { id: verification.userId },
      data: {
        name: verification.representativeName,
        phone: verification.phone,
        companyName: verification.companyName,
        installerVerified: true,
      },
    });
    
    // Create or update InstallerProfile
    await prisma.installerProfile.upsert({
      where: { userId: verification.userId },
      create: {
        userId: verification.userId,
        companyName: verification.companyName,
        businessAddress: '', // TODO: Add to verification form
        postcode: verification.postcodes[0],
        operationalStatus: 'ACTIVE',
      },
      update: {},
    });
    
    // Create log entry
    await prisma.installerVerificationLog.create({
      data: {
        userId: verification.userId,
        adminId: adminId,
        action: 'APPROVED',
        notes: adminNotes,
      },
    });
  }
  ```
- **Acceptance**:
  - Approval syncs phone/name/company to User model
  - Creates InstallerProfile if not exists
  - User.installerVerified set to true
  - Verification log created
- **Commit**: "feat(api): sync verification data to User model on approval"

---

### Task B7.7: Pre-fill Verification Modal with Existing Data 🟡 MEDIUM
- **File**: `src/components/installer/VerificationModal.tsx`
- **Change**: Accept `existingVerification` prop and pre-fill form on mount
- **Logic**:
  ```tsx
  useEffect(() => {
    if (existingVerification) {
      setFormData({
        companyName: existingVerification.companyName,
        phone: existingVerification.phone,
        // ... all other fields
      });
    }
  }, [existingVerification]);
  ```
- **Acceptance**: Re-opening modal shows previously submitted data
- **Commit**: "feat(installer): pre-fill verification modal with existing data"

---

### Task B7.8: Update Admin Actions to Use Real API 🔴 CRITICAL
- **File**: `src/app/admin/installers/[id]/page.tsx`
- **Changes**:
  1. Wire `handleApprove()` to `PUT /api/admin/installers/[id]/verification/status` with `status: APPROVED`
  2. Wire `handleReject()` with `status: REJECTED`
  3. Wire `handleRequestInfo()` with `status: MORE_INFO`
  4. Add loading states for each action
  5. Show success/error feedback
  6. Reload verification data after action
- **Acceptance**:
  - Admin actions persist to database
  - User model synced on approval (via B7.6)
  - Success feedback shown
  - Page refreshes with updated status
- **Commit**: "feat(admin): wire approval/rejection actions to backend API"

---

### Task B7.9: Add Verification Logs Display (Frontend) 🟡 MEDIUM
- **File**: `src/app/admin/installers/[id]/page.tsx`
- **Change**: Display `logs` from API response (B7.4) in Activity Log section
- **Fields**: action, timestamp, performedBy, notes
- **Acceptance**: Real verification history displayed (no mock data)
- **Commit**: "feat(admin): display real verification activity logs"

---

### Validation Commands (Run after each task)

```powershell
# TypeScript check
npx tsc --noEmit

# Build check
npm run build

# Semantic verification (profile page)
Select-String -Path "src\app\installer\(dashboard)\profile\page.tsx" -Pattern "text-gray-|text-slate-|text-zinc-|bg-gray-|bg-slate-|bg-zinc-|border-gray-|border-slate-"
Select-String -Path "src\app\installer\(dashboard)\profile\page.tsx" -Pattern "dark:"
Select-String -Path "src\app\installer\(dashboard)\profile\page.tsx" -Pattern "rgba\(|rgb\(|#[0-9a-fA-F]{3,6}"
```

---

### End-to-End Test Scenarios

#### Scenario 1: Phone Number Sync
1. ✅ Installer signs up with phone `+61400000000` (stored in `user.phone`)
2. ✅ Installer submits verification with phone `+61411111111` (stored in `verification.phone`)
3. ✅ **Expected**: Profile Personal Details shows `+61411111111` (from verification)
4. ✅ **Expected**: Profile Company Details shows `+61411111111` (from verification)
5. ✅ Admin approves verification
6. ✅ **Expected**: `user.phone` updates to `+61411111111` (synced from verification)
7. ✅ **Expected**: All views remain consistent after approval

#### Scenario 2: Representative Name Sync
1. ✅ Installer signs up with name "John" (stored in `user.name`)
2. ✅ Installer submits verification with representative name "John Smith" (stored in `verification.representativeName`)
3. ✅ **Expected**: Profile shows "John Smith" (prioritizes verification)
4. ✅ Admin approves
5. ✅ **Expected**: `user.name` updates to "John Smith"

#### Scenario 3: Re-submission Flow
1. ✅ Installer submits verification (status: PENDING)
2. ✅ Admin requests more info (status: MORE_INFO)
3. ✅ Installer re-opens verification modal
4. ✅ **Expected**: Form pre-filled with previous submission data (B7.7)
5. ✅ Installer updates fields and resubmits
6. ✅ **Expected**: Verification status returns to PENDING
7. ✅ **Expected**: Updated data visible in admin view

---

### Success Criteria
- ✅ Profile Personal Details shows correct phone from verification
- ✅ Profile Company Details shows correct phone from verification
- ✅ Profile shows representative name from verification
- ✅ Admin view connected to real database (no mock data)
- ✅ Admin approval syncs verification data to User model
- ✅ Phone/name/company consistent across all views after approval
- ✅ Verification modal pre-fills with existing data on re-open
- ✅ Admin actions persist and trigger notifications
- ✅ All E2E test scenarios pass
- ✅ TypeScript clean (0 errors)
- ✅ Build succeeds

---

### Estimated Effort
- **B7.1**: 15 minutes (display logic fix)
- **B7.2**: 15 minutes (display logic fix)
- **B7.3**: 15 minutes (display logic fix)
- **B7.4**: 2 hours (new API endpoint)
- **B7.5**: 1.5 hours (wire admin view)
- **B7.6**: 2 hours (sync logic + approval API)
- **B7.7**: 1 hour (pre-fill form logic)
- **B7.8**: 1.5 hours (wire admin actions)
- **B7.9**: 30 minutes (display logs)

**Total**: ~9 hours

---

### Dependencies
- ✅ Phase B6 complete (API client library exists)
- ✅ Backend APIs functional
- ✅ Database schema complete
- ⚠️ Admin authentication (required for B7.4-B7.9)

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
