# Tasks: Lead Journey & Life Cycle

**Feature Branch**: `002-lead-journey-life`  
**Input**: Design documents from `/specs/002-lead-journey-life/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/  
**Tests**: Not requested in specification - excluded from task list  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7, Setup, Foundation, Polish)
- File paths follow Next.js App Router conventions

---

## ⚠️ MANDATORY WORKFLOW FOR EACH PHASE

## Persona-ordered roadmap (for navigation only)

To reduce confusion while keeping the existing plan intact, this roadmap lists phases in the logical execution order by persona. It does not change any tasks—only clarifies the reading/doing sequence. Phase numbers below reference the legacy headings further down.

- Guests first
  - Phase 4.5: CRITICAL REMEDIATION – Lead Quote Data Storage (cross-cutting, but required for guest instant quote data integrity)
  - Phase 4.9: Phone Verification UX Fixes (affects guest→signup→verification continuity)
- Homeowners next
  - Phase 3: US1 – Homeowner Submits Lead Request (core)
  - Phase 4.8: Homeowner Dashboard & Second Quote Requests
  - Phase 4.9.5: Homeowners Quote Request After Sign-in (first-quote flow without signup)
- Admin after Homeowners
  - Phase 4: US2 – Admin Reviews and Approves Leads
- Installers last
  - Phase 5: US3 – Installer Discovers and Purchases Lead
  - Phase 6: US4 – Lead Status Tracking and Updates (all personas, primarily affects installer visibility)
  - Phase 7: US5 – Admin Manages Lead Lifecycle and Resale (admin-led, impacts installer/homeowner indirectly)
  - Phase 8: US6 – Internal Chat and Quote Exchange (installer↔homeowner; admin visibility)
  - Phase 9: US7 – Installer Feedback and Lead Quality Rating
- Always-on phases
  - Phase 1: Setup (shared infrastructure)
  - Phase 2: Foundational (blocking prerequisites)
  - Phase 10: Polish & Cross-Cutting Concerns

Tip: When executing, follow this persona order but keep the original phase sections as the single source of truth.

### New execution order → Legacy phase mapping

1) Guests
  - New G1 → Legacy Phase 4.5 (CRITICAL REMEDIATION – Lead Quote Data Storage)
  - New G2 → Legacy Phase 4.9 (Phone Verification UX Fixes)
2) Homeowners
  - New H1 → Legacy Phase 3 (US1 – Homeowner Submits Lead Request)
  - New H2 → Legacy Phase 4.8 (Homeowner Dashboard & Second Quote Requests)
  - New H3 → Legacy Phase 4.9.5 (Homeowners Quote Request After Sign-in)
3) Admin
  - New A1 → Legacy Phase 4 (US2 – Admin Reviews and Approves Leads)
4) Installers
  - New I1 → Legacy Phase 5 (US3 – Installer Discovers and Purchases Lead)
  - New I2 → Legacy Phase 6 (US4 – Lead Status Tracking and Updates)
  - New I3 → Legacy Phase 7 (US5 – Admin Manages Lead Lifecycle and Resale)
  - New I4 → Legacy Phase 8 (US6 – Internal Chat and Quote Exchange)
  - New I5 → Legacy Phase 9 (US7 – Installer Feedback and Lead Quality Rating)
5) Cross-cutting
  - New C1 → Legacy Phase 1 (Setup)
  - New C2 → Legacy Phase 2 (Foundational)
  - New C3 → Legacy Phase 10 (Polish & Cross-Cutting Concerns)

### Before Starting Any Phase:
1. **Pre-Phase Audit & Planning** (30-60 minutes):
   - Read ALL spec files thoroughly (`spec.md`, `data-model.md`, `contracts/*.openapi.yaml`)
   - Map out EXACT data structures from spec (don't invent new ones)
   - Identify existing code patterns to follow (auth, services, API routes)
   - Check Prisma schema matches spec BEFORE writing any code
   - List all files to create/modify with their exact purposes
   - Verify external dependencies are installed and configured
   - Document any spec ambiguities - ASK USER before assuming
   - **RULE**: If spec says PhoneVerification links to User, schema MUST link to User. Don't change mid-implementation.

### During Phase Implementation:
2. **Spec-Driven Implementation** (Task by Task):
   - **For each task**: Re-read relevant spec section FIRST
   - Copy exact field names, types, and structures from spec
   - Follow existing code patterns (e.g., how other services are structured)
   - Use EXISTING utilities (don't reinvent: getSetting, createAuditLog, etc.)
   - Check function signatures in services BEFORE calling them
   - **Incremental Build Check**: After every 3-5 tasks, run `npm run build`
     - If errors appear: FIX according to spec, not by changing architecture
     - Don't create "temporary workarounds" that contradict spec
   - **Type Safety First**: Let TypeScript errors guide you to spec compliance
     - Missing field? Check spec - should it exist in schema?
     - Wrong type? Check spec - is service signature correct?
   - **No Spec Drift**: If you modify Prisma schema, update it ONCE at start of phase, not mid-phase
   - **Manual QA Checklist Required**: For any task that includes BOTH backend and frontend changes, add a short "Manual QA Checklist" directly under that task with steps to validate UI states, API calls (success and one error path), and data accuracy. Keep it observable and role-specific (Admin/Homeowner).

3. **Post-Phase Validation** (MUST COMPLETE BEFORE COMMIT):
   - ✅ **Schema Validation**: Run `npx prisma validate` - schema must match spec
   - ✅ **Type Check**: Run `npx tsc --noEmit` - all TypeScript must be valid
   - ✅ **Build**: Run `npm run build` - MUST pass with 0 errors
     - **Build Error Protocol**:
       1. Read error message carefully
       2. Check spec: Is implementation following spec exactly?
       3. Fix by aligning with spec, NOT by changing architecture
       4. If spec is ambiguous: STOP, document issue, ask user
       5. **Time Limit**: If fixing takes >30 min, STOP and report to user
   - ✅ **Lint**: Run `npm run lint` - fix critical issues only
   - ✅ **Manual Spot Check**: Open 2-3 key files, verify they match spec intent
   - ✅ **Task Checklist**: Every task T### must be checked off with proof
   - ✅ **Regression Check**: Run dev server, verify existing features still work

### Manual QA Checklist (After Backend + Frontend Work)
- Start with a clean browser session (incognito or cleared storage) to avoid cached data during validation.
- Walk through every new UI entry point in sequence; e.g., dashboard → OTP verification modal → verify code → Request More Quotes flow → confirm prefilled instant quote fields → submit and observe dashboard refresh.
- Exercise at least one error path for the updated feature (invalid OTP, missing required field, exhausted quota) and ensure UI messaging matches spec with no console errors.
- Inspect network requests in dev tools or Thunder Client while executing the flow to confirm payloads and responses match the API contracts.
- Document findings (successes, failures, screenshots) and extend this checklist with feature-specific steps before handing off for review.

4. **Commit Approval** (MANDATORY):
   - ❌ **NEVER commit without explicit user approval**
   - Present validation results:
     - Build output (success/warnings)
     - Files changed count
     - Key changes summary
     - Any deviations from spec (with justification)
   - Wait for user confirmation: "Yes, commit this phase"
   - Only then: `git add .` → `git commit -m "Phase X: <summary>"`

### Phase Completion Criteria:
- ✅ All tasks marked complete with evidence
- ✅ Implementation matches spec exactly (data model, API contracts, types)
- ✅ Prisma schema validated
- ✅ TypeScript compiles with no errors
- ✅ Build passes (`npm run build`)
- ✅ No critical lint errors
- ✅ No spec drift or architectural changes mid-phase
- ✅ User approval received
- ✅ Git commit created with detailed message

### 🚨 RED FLAGS - STOP IMMEDIATELY:
- Schema doesn't match spec → Review spec, fix schema ONCE
- Service function signatures differ from usage → Check existing services, align
- Build errors persist >30 minutes → Report to user, don't spiral
- Creating new patterns not in existing codebase → Use existing patterns
- Inventing field names not in spec → Use exact spec names
- "I'll fix it later" thoughts → Fix now according to spec, or ask user

---

## 🛡️ BUILD ERROR PREVENTION CHECKLIST

**Use this BEFORE writing any integration code:**

### 1. Schema Verification (5 min)
```bash
# Check Prisma schema for exact model structure
cat prisma/schema.prisma | grep -A 20 "model YourModel"

# Validate schema is correct
npx prisma validate

# Check what relations exist
grep -E "model (User|Lead|PhoneVerification)" prisma/schema.prisma -A 15
```

### 2. Service Signature Verification (10 min)
```bash
# Check what a service actually exports
grep "^export" src/lib/services/your-service.ts

# Check function signatures
grep "export async function" src/lib/services/your-service.ts -A 3

# Example: Before calling getSetting()
grep "export.*getSetting" src/lib/services/settings-service.ts -A 5
# Result: getSetting(key: string) - only ONE parameter!
```

### 3. Type Verification (5 min)
```bash
# Check NextAuth session type
grep -A 20 "interface Session" src/types/next-auth.d.ts

# Check if field exists in session.user
grep "interface.*User" src/lib/auth.ts -A 10

# Check Prisma Client types
grep "export.*CreateNotificationInput" src/types/notification.ts -A 10
```

### 4. Existing Patterns Review (10 min)
- Open 2-3 similar existing files (e.g., if creating lead-service.ts, read audit-logger.ts)
- Note how they import Prisma client: `import { prisma } from '@/lib/prisma'`
- Note how they handle errors: try/catch patterns
- Note how they call other services: `await createAuditLog({ ... })`
- Copy-paste patterns, don't reinvent

### 5. Pre-Implementation Checklist
- [ ] Read spec section for this task completely
- [ ] Checked Prisma schema matches spec requirements
- [ ] Verified all service functions I'll call actually exist with correct signatures
- [ ] Confirmed all types I'll use exist and have required fields
- [ ] Reviewed 1-2 similar existing files for patterns
- [ ] Identified all imports needed (services, types, Prisma)
- [ ] Know exact field names from spec (not inventing new ones)

**TIME INVESTMENT**: 30 minutes of verification SAVES 3+ hours of build error fixing

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE (Persona: Cross-cutting)

**Purpose**: Project initialization and environment configuration

- [X] T001 [P] [Setup] Add Twilio Verify API dependencies to `package.json` (@twilio/twilio-verify)
- [X] T002 [P] [Setup] Add Pusher real-time dependencies to `package.json` (pusher, pusher-js)
- [X] T003 [P] [Setup] Add Stripe payment dependencies to `package.json` (@stripe/stripe-js, stripe)
- [X] T004 [P] [Setup] Add SendGrid email dependencies to `package.json` (@sendgrid/mail)
- [X] T005 [P] [Setup] Add AWS S3 client dependencies to `package.json` (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)
- [X] T006 [P] [Setup] Configure environment variables in `.env` (Twilio, Pusher, Stripe, SendGrid, AWS credentials)
- [X] T007 [P] [Setup] Create Pusher client singleton in `src/lib/pusher.ts` (server-side)
- [X] T008 [P] [Setup] Create Pusher client hook in `src/lib/hooks/usePusher.ts` (client-side)
- [X] T009 [P] [Setup] Create Stripe client singleton in `src/lib/stripe.ts` (server-side)
- [X] T010 [P] [Setup] Create SendGrid client singleton in `src/lib/sendgrid.ts`
- [X] T011 [P] [Setup] Create Twilio Verify client singleton in `src/lib/twilio.ts`
- [X] T012 [P] [Setup] Create S3 client singleton in `src/lib/s3.ts` with presigned URL helpers

**Checkpoint**: ✅ External service clients configured and ready for use

### Phase 1 Validation Checklist:
- [X] Pre-Phase Audit: Current state documented
- [X] All T001-T012 tasks completed
- [X] `npm run build` passes (0 errors)
- [X] All client singletons have proper error handling
- [X] Environment variables documented in .env
- [X] No TypeScript errors in service files
- [X] User approval received for commit
- [X] Git commit created with phase summary (Commit: b7e69c6)

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE (Persona: Cross-cutting)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**✅ COMPLETE**: Foundation is ready - user story implementation can now begin

- [X] T013 [Foundation] Add all new Prisma models to `prisma/schema.prisma` (Lead, PhoneVerification, InstallDocument, ChatMessage, Quote, LeadFeedback, AuditLog, Notification, Settings)
- [X] T014 [Foundation] Add all new enums to `prisma/schema.prisma` (QuoteType, LeadStatus, Visibility, PurchaseStatus, NotificationType, etc.)
- [X] T015 [Foundation] Run Prisma migration `npx prisma migrate dev --name lead-journey-init`
- [X] T016 [Foundation] Generate Prisma Client `npx prisma generate`
- [X] T017 [P] [Foundation] Create TypeScript types in `src/types/lead.ts` (extends Prisma types with computed fields)
- [X] T018 [P] [Foundation] Create TypeScript types in `src/types/chat.ts`
- [X] T019 [P] [Foundation] Create TypeScript types in `src/types/quote.ts`
- [X] T020 [P] [Foundation] Create TypeScript types in `src/types/notification.ts`
- [X] T021 [P] [Foundation] Create lead state machine in `src/lib/services/lead-state.ts` (validates status transitions)
- [X] T022 [P] [Foundation] Create audit logger service in `src/lib/services/audit-logger.ts` (writes to AuditLog table)
- [X] T023 [P] [Foundation] Create notification service in `src/lib/services/notification-service.ts` (Pusher + SendGrid integration)
- [X] T024 [P] [Foundation] Create global Settings service in `src/lib/services/settings-service.ts` (manages approval mode, pricing)
- [X] T025 [Foundation] Extend NextAuth User type in `src/types/next-auth.d.ts` (add phoneVerified, leadSubmissionCount, installerVerified)
- [X] T026 [Foundation] Update `src/lib/auth.ts` JWT callbacks to include new user fields (phoneVerified, leadSubmissionCount, installerVerified)
- [X] T027 [Foundation] Seed Settings table with default values in `prisma/seed-settings.ts` (approval mode, default pricing)

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

### Phase 2 Validation Checklist:
- [X] Pre-Phase Audit: Database schema and existing models reviewed
- [X] All T013-T027 tasks completed
- [X] Prisma migration applied successfully (20251015084536_add_user_verification_fields)
- [X] `npm run build` passes (0 errors, only informational warnings)
- [X] All TypeScript types compile correctly
- [X] State machine validates all transitions
- [X] Services integrate with Prisma client correctly
- [X] NextAuth types extended properly
- [X] Settings seeded successfully (16 default settings)
- [X] No breaking changes to existing auth flow
- [ ] User approval received for commit
- [ ] Git commit created with phase summary

---

## Phase 3: User Story 1 - Homeowner Submits Lead Request (Priority: P1) 🎯 MVP (Persona: Homeowner)

**Goal**: Enable homeowners to submit quote requests via existing UI flow, with OTP verification for subsequent submissions

**Independent Test**: Guest completes instant quote → selects quote type → sees signup modal → creates account → auto-login → submit → success. Logged-in user skips signup. 2nd submission requires OTP verification.

### Implementation for User Story 1

- [X] T028 [P] [US1] Create POST `/api/leads` route in `src/app/api/leads/route.ts` (create lead endpoint per leads.openapi.yaml)
- [X] T029 [P] [US1] Create GET `/api/leads` route in same file (list leads with role-based filtering)
- [X] T030 [P] [US1] Create GET `/api/leads/[id]/route.ts` (get single lead details)
- [X] T031 [P] [US1] Create lead creation service in `src/lib/services/lead-service.ts` (validation, creation, audit logging)
- [X] T032 [P] [US1] Create POST `/api/verification/send-otp` route in `src/app/api/verification/send-otp/route.ts` (Twilio integration per verification.openapi.yaml)
- [X] T033 [P] [US1] Create POST `/api/verification/verify-otp` route in `src/app/api/verification/verify-otp/route.ts` (verify OTP and update user)
- [X] T034 [P] [US1] Create phone verification service in `src/lib/services/phone-verification-service.ts` (rate limiting, OTP validation)
- [X] T035 [US1] Update existing `QuoteOptionsModal.tsx` to call POST `/api/leads` when quote type selected (integrate with existing flow)
- [X] T036 [US1] Update existing `HomeownerSignupModal.tsx` to auto-submit lead after successful signup (context="quote" flow)
- [X] T037 [US1] Create OTP verification modal component in `src/components/OTPVerificationModal.tsx` (shown on 2nd+ submission with 6-digit input)
- [X] T038 [US1] Create "Verified" badge component in `src/components/VerifiedBadge.tsx` (display phone verification status)
- [X] T039 [US1] Implement rate limiting feedback in UI (OTPVerificationModal shows retry timers and cooldowns)
- [X] T040 [US1] E.164 phone validation (implemented in send-otp route with regex validation)
- [X] T041 [US1] Rate limiting (✅ COMPLETE: 3 OTP per 15min in phone-verification-service.ts checkRateLimit())
- [X] T042 [US1] Admin notifications on lead creation (✅ COMPLETE: createNotification() called in lead-service.ts createLead())
- [-] T043 [US1] Update homeowner dashboard to show submission count, limits, and verification badge (⚠️ DEFERRED: Non-critical UI enhancement, can be done in Phase 10 Polish)

**Phase 3 Status**: ✅ **IMPLEMENTATION COMPLETE** - Core functionality ready, build passes, pending final testing and user approval for commit

**Checkpoint**: At this point, homeowners can submit leads (guest + logged-in flows), verify phone, and see verification badge. Leads appear in admin dashboard.

### Phase 3 (User Story 1) Validation Checklist:
- [X] Pre-Phase Audit: Reviewed spec.md, data-model.md, contracts/leads.openapi.yaml, contracts/verification.openapi.yaml
- [X] Schema Alignment: PhoneVerification model updated to link to User (not Lead) per verification flow requirements
- [X] Service Signatures Verified: getSetting, getSettingAsNumber, createAuditLog, createNotification checked before use
- [X] All T028-T043 tasks completed (T043 deferred as non-critical UI enhancement)
- [X] Prisma Schema Validated: `npx prisma validate` passed after PhoneVerification model update
- [X] Migration Applied: `20251015101959_update_phone_verification_schema` successful
- [X] TypeScript Check: `npx tsc --noEmit` passed (no type errors)
- [X] Build: `npm run build` passed (0 errors, only expected warnings about dynamic routes)
- [ ] API Testing: 
  - [ ] POST /api/leads (create lead as logged-in homeowner)
  - [ ] POST /api/leads (403 response when verification required)
  - [ ] POST /api/verification/send-otp (E.164 validation, rate limiting)
  - [ ] POST /api/verification/verify-otp (correct code acceptance, user.phoneVerified update)
- [ ] UI Testing:
  - [ ] QuoteOptionsModal: Lead submission flow
  - [ ] OTPVerificationModal: 6-digit input, countdown timer, resend functionality
  - [ ] VerifiedBadge: Display variants (inline, badge, icon-only)
- [ ] Business Logic:
  - [ ] Lead submission count increments correctly
  - [ ] Submission limits enforced (1 before verification, 5 total)
  - [ ] Rate limiting (3 OTP per 15 minutes) working
  - [ ] Admin notifications sent on lead creation
- [ ] No Regression: Existing instant quote flow, signup, login still working
- [ ] User approval received for commit
- [ ] Git commit created with detailed message

**Build Error Lessons Learned**:
1. ❌ PhoneVerification schema initially linked to Lead, but service expected userId → Fixed by updating schema to match service requirements
2. ❌ Used `auditLogger.log()` but service exports `createAuditLog()` function → Fixed by checking actual exports with grep
3. ❌ Used `notificationService.send()` but service exports `createNotification()` → Fixed by verifying export signatures
4. ❌ Called `getSetting(key, defaultValue)` but function only takes one parameter → Fixed by using getSettingAsNumber() instead
5. ❌ Used `session.user.phone` but phone not in session type → Fixed by passing phone from quoteData
6. ⚠️ **ROOT CAUSE**: Did not thoroughly review existing service signatures and Prisma schema before implementation
7. ✅ **SOLUTION**: Always grep for function exports and check schema relationships BEFORE writing integration code

---

## Phase 4.5: CRITICAL REMEDIATION - Lead Quote Data Storage 🚨 BLOCKING (Persona: Cross-cutting)

**Priority**: 🔴 CRITICAL - MUST complete before Phase 5  
**Purpose**: Fix 90% data loss issue discovered during Phase 4 testing  
**Branch**: 002-lead-journey-life

**Problem**: Lead model only stores 10 basic fields, but InstantQuoteForm collects 30+ fields (system size, costs, savings, ROI, preferences). When leads are created, 90% of valuable quote data is discarded.

**Impact**: 
- Installers purchasing leads have no context (no system size, cost, or savings info)
- Admin approval decisions uninformed (can't see quote calculations)
- Future phases (Chat, Quotes) lack baseline reference data
- Homeowner expectations misaligned with installer proposals

**Root Cause**: Schema design mismatch between data collection (InstantQuoteForm) and data storage (Lead model)

**Solution**: Add `quoteData Json? @db.JsonB` field to Lead model to preserve complete instant quote data

### Phase 4.5 Implementation Tasks

#### Core Schema & Service Changes (BLOCKING)
- [X] **T147** [Remediation] Add `quoteData Json? @db.JsonB` to Lead model in `prisma/schema.prisma`
- [X] **T148** [Remediation] Run Prisma migration `npx prisma migrate dev --name add-lead-quote-data`
- [X] **T149** [Remediation] Update `CreateLeadInput` interface in `src/lib/services/lead-service.ts` (ensure quoteData properly typed)
- [X] **T150** [Remediation] Update `createLead()` function in lead-service.ts line ~118-140 to include `quoteData: input.quoteData || null` in Prisma create
- [X] **T151** [Remediation] Update Lead type in `src/types/lead.ts` to include `quoteData?: any` field

#### API Validation
- [X] **T152** [Remediation] Update POST `/api/leads` route to validate quoteData is received (add temporary debug log)
- [ ] **T153** [Remediation] Test lead creation: verify quoteData is saved to database (check with Prisma Studio `npx prisma studio`)

#### Admin UI Enhancements
- [X] **T154** [Remediation] Create QuoteDataDisplay component in `src/components/admin/QuoteDataDisplay.tsx` (displays system size, costs, savings, preferences)
- [X] **T155** [Remediation] Add QuoteDataDisplay to admin lead detail page `src/app/admin/leads/[id]/page.tsx` (show quote calculations in card)
- [ ] **T156** [Remediation] Add quote summary columns to admin leads list (system size, final cost) - optional enhancement

#### Verification & Testing
- [ ] **T157** [Remediation] Create new test lead with full quote data - verify quoteData JSON saved in database
- [ ] **T158** [Remediation] Check existing leads in database - verify quoteData field exists (null for old leads is OK)
- [ ] **T159** [Remediation] Admin views lead detail - verify quote data displays correctly in QuoteDataDisplay component
- [ ] **T160** [Remediation] Verify no breaking changes to existing lead creation flow (guest + logged-in flows still work)

**Checkpoint**: ✅ All leads now preserve complete instant quote data. Installers and admins can see full quote context. Ready for Phase 5.

### Phase 4.5 Validation Checklist:

**Pre-Phase Audit (30 min)**:
- [X] Read LEAD-DATA-SCHEMA-AUDIT-2025-10-15.md and PHASE-4.5-REMEDIATION-AUDIT-2025-10-15.md
- [ ] Review InstantQuoteForm.tsx lines 53-90 and 560-580 - understand quoteData structure
- [ ] Review current Lead model in schema.prisma lines 560-650 - verify current fields
- [ ] Check page.tsx line 76-107 - verify quoteData is passed to API (✅ already passing!)
- [ ] Check HomeownerSignupModal.tsx line 136-148 - verify quoteData is passed (✅ already passing!)
- [ ] Verify quoteData structure matches what InstantQuoteForm outputs

**During Implementation**:
- [ ] After T147-T151 (Schema Changes): Run `npx prisma validate` - must pass
- [ ] After T148 (Migration): Run `npx prisma migrate dev` - verify migration successful
- [ ] After T150 (Service Update): Run `npx tsc --noEmit` - fix any type errors
- [ ] After T152-T153 (API Validation): Test POST /api/leads with curl or Postman
- [ ] After T154-T155 (UI): Run `npm run build` - verify no errors
- [ ] After T157-T160 (Testing): Complete end-to-end test scenario

**Post-Phase Validation**:
- [ ] Schema Validation: `npx prisma validate` passes (0 errors)
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] Migration Applied: Check `prisma/migrations/` for `*_add-lead-quote-data/` folder
- [ ] Database Check: Open Prisma Studio `npx prisma studio`, verify Lead table has `quoteData` column (type: Json)
- [ ] Data Integrity Test:
  - [ ] Create test lead via instant quote flow
  - [ ] Check database: Lead record has populated quoteData JSON
  - [ ] Verify quoteData contains: systemSize, costs, savings, preferences, etc.
- [ ] UI Verification:
  - [ ] Admin lead detail page shows QuoteDataDisplay component
  - [ ] Quote calculations visible (system size, cost, savings)
  - [ ] No layout breaks or errors
- [ ] API Testing:
  - [ ] POST /api/leads with quoteData - returns 201, data saved
  - [ ] GET /api/leads/[id] - returns lead with quoteData field
  - [ ] Verify quoteData structure matches InstantQuoteForm output
- [ ] No Regression:
  - [ ] Guest lead submission flow still works
  - [ ] Logged-in homeowner lead submission still works
  - [ ] Existing leads without quoteData don't break UI
- [ ] All T147-T160 tasks completed with evidence
- [ ] User approval received for commit
- [ ] Git commit: "Phase 4.5: Add quote data storage to Lead model - fixes 90% data loss issue"

**Expected Outcomes**:
1. ✅ Lead model has quoteData field (JsonB in PostgreSQL)
2. ✅ All new leads store complete instant quote data (30+ fields preserved)
3. ✅ Admins can see quote calculation details when reviewing leads
4. ✅ No data loss - full InstantQuoteForm output saved
5. ✅ Foundation ready for Phase 5 (installers will see quote context when purchasing)
6. ✅ Frontend changes: ZERO (page.tsx and HomeownerSignupModal already pass quoteData!)
7. ✅ Backend changes: 3 files (schema, migration, lead-service)

**Time Estimate**: 2-3 hours total (1 hour implementation + 1-2 hours testing)

---

## Phase 4.8: Homeowner Dashboard & Second Quote Requests (Priority: P1/P2 Hybrid) (Persona: Homeowner)

**Goal**: Surface per-homeowner lead metrics, enable verified homeowners to request additional quotes with OTP-protected phone verification, and give admins fine-grained control over per-homeowner quote limits.

**Independent Test**: Logged-in homeowner opens dashboard → sees first lead, quote usage, remaining balance, and verification badge → clicks "Request More Quotes" → verifies phone (if not already verified) → pre-filled instant quote wizard opens → edits fields, recalculates → selects quote allocations within remaining balance → submits → dashboard updates counts and history instantly. Admin updates homeowner quote limit and sees change reflected after refresh.

### Phase 4.8 Implementation Tasks

#### Data Model & Auth Synchronisation
- [X] **T161** [US1] Add `quoteType` enum to Prisma (`enum LeadQuoteType { CALL_VISIT WRITTEN_QUOTE }`) and attach `quoteType LeadQuoteType` field to `Lead` model (default `CALL_VISIT`) in `prisma/schema.prisma` to align with spec.md data model.
- [X] **T162** [US1] Introduce `leadSubmissionLimit Int @default(5)` on `User` model (nullable? ❌) to track per-homeowner quote caps and run a single migration (`npx prisma migrate dev --name phase-4-8-lead-limits`).
- [X] **T163** [US1] Extend NextAuth types (`src/types/next-auth.d.ts`, `src/lib/auth.ts`) to include `quoteLimit` (derived from `leadSubmissionLimit`, fallback to settings) in JWT/session payloads.

#### Services & Business Logic
- [X] **T164** [US1] Update `createLead` in `src/lib/services/lead-service.ts` to persist `quoteType`, honour per-user `leadSubmissionLimit`, and return remaining balance metadata for UI refresh.
- [X] **T165** [US1] Implement `getHomeownerLeadSummary(userId)` in `lead-service.ts` (or new `homeowner-dashboard-service.ts`) to compute totals, remaining balance, latest leads (status + timestamps), and verification state in one call.
- [X] **T166** [US2] Add admin helper in `settings-service` or new `homeowner-admin-service` to update a homeowner's `leadSubmissionLimit`, including audit log entry and optional notification. ✅ (Verified: `homeowner-admin-service.ts` exists with `updateHomeownerQuoteLimit`)

#### API Surface
- [X] **T167** [US1] Create GET `/api/homeowner/dashboard` in `src/app/api/homeowner/dashboard/route.ts` returning summary payload from T165 with caching headers set to `no-store`.
- [X] **T168** [US2] Create PATCH `/api/admin/homeowners/[id]/lead-limit` in `src/app/api/admin/homeowners/[id]/lead-limit/route.ts` (ADMIN only) to adjust quote limits, validate bounds (>= initial default), and log action. ✅ (Verified: File exists at `src/app/api/admin/homeowners/[id]/lead-limit/route.ts`)
- [X] **T169** [US1] Update POST `/api/leads` handler to interpret `quoteType` from request body safely, enforce remaining balance prior to creation, and return refreshed summary in response when successful.

#### Homeowner Experience (Backend Complete ✅, Frontend Partial ⚠️)
- [X] **T170** [US1] Refactor `src/app/homeowner/dashboard/page.tsx` to fetch dashboard summary (SWR or `useEffect`), render metric cards (requested/limit remaining), verification badge, and per-lead status list with quote type labels. (✅ COMPLETE: Dashboard fetches and displays real data)
- [X] **T171** [US1] Create `RequestMoreQuotesCTA` component (dashboard) that opens new multi-step flow only when `remaining > 0`; show disabled state + error copy otherwise. (✅ COMPLETE: Component created with quota display)
- [X] **T172** [US1] Build `ContactVerificationModal` in `src/components/homeowner/ContactVerificationModal.tsx` with editable phone field, required message from spec, and OTP initiation using existing `/api/verification/send-otp` endpoint. (⚠️ PARTIAL: Modal exists but phone not pre-populated from user profile on load)
  - Note: Phone pre-population was completed in Phase 4.9 (see T186-T189). Leaving task checked here for Phase 4.8 continuity.
- [X] **T173** [US1] Integrate `OTPVerificationModal` into new flow so successful verification updates UI state, grants badge immediately, and memoises verification session (no OTP re-request during browser session). (✅ COMPLETE: OTP flow integrated with session updates)
- [X] **T174** [US1] Enhance `NewQuoteRequestModal` / `InstantQuoteForm` to accept initial values from the homeowner's previous lead, allow recalculation, and emit structured payload without auto-submitting lead. (✅ COMPLETE: Dashboard passes recent lead quoteData, modal pre-fills fields, and form recalculates on update)
- [ ] **T175** [US1] Create `QuoteDistributionModal` to let homeowner choose Call/Visit vs Written counts within remaining balance, surface live counter, and prevent over-allocation with inline validation. (⚠️ DEFERRED: Single quote type selection sufficient for MVP)
- [X] **T176** [US1] Wire the request flow: verification → quote form → distribution → call POST `/api/leads` per distribution selection (multiple lead creations if >1) and refresh dashboard summary on success without page reload. (✅ COMPLETE: Flow works, dashboard refreshes after submission)

#### Admin Controls & Visibility
- [X] **T177** [US2] Extend `AdminHomeownersList` (and API response) to surface current quote limit and usage (columns + filter chips). ✅ (Complete: quota filter chips added, Lead Usage/Remaining columns added, phone verified badge added, API returns quota data)
  - Manual QA Checklist:
    - [ ] Table shows columns: Lead Usage (X/Y), Remaining, Phone Verified badge
    - [ ] Quota filter chips work (All/Available/Exhausted) and counts reflect filtered data
    - [ ] API: Network GET `/api/admin/homeowners` returns limit/count for rows
    - [ ] No console errors; pagination/search/postcode filter still work
    - [ ] Dark/Light mode visuals OK
- [X] **T178** [US2] Add inline edit or modal in admin UI to update quote limit via T168 endpoint, showing success toast and immediate list refresh. ✅ (Complete: Added inline edit state, handlers, input field, and save/cancel buttons in AdminHomeownersList with API integration)
  - Manual QA Checklist:
    - [ ] Clicking Edit shows input + Save/Cancel
    - [ ] Save calls PATCH `/api/admin/homeowners/:id/lead-limit` with new number
    - [ ] Success toast appears and table refreshes with updated limit
    - [ ] Validation: negative/zero rejected with error message
    - [ ] Cancel reverts to display mode without changes
- [X] **T179** [US2] Update admin lead detail view to display homeowner's limit, submitted count, and remaining balance for quicker decisions. ✅ (Complete: Extended lead-service.ts to include leadSubmissionLimit/Count, updated Lead interface, added quota display card with progress bar in admin lead detail page)
  - Manual QA Checklist:
    - [ ] Lead detail shows Quote Request Quota card with Total Limit (blue), Submitted (yellow), Remaining (green/red)
    - [ ] Progress bar fills according to usage; warning appears when remaining = 0
    - [ ] Data matches DB after editing limit in homeowners list (consistency)
    - [ ] API: GET `/api/leads/:id` includes homeowner.leadSubmissionLimit/Count
    - [ ] No visual regressions in other lead detail sections

#### Validation & Regression Safety
- [ ] **T180** [US1] Write integration test script (manual or Playwright note) covering verification → re-request flow → dashboard refresh, documenting expected API responses.
- [ ] **T181** [US1/US2] Verify automation engine respects new `quoteType` enum values and that existing leads migrate safely (backfill data/script if required).

### Phase 4.8 Validation Checklist

**Pre-Phase (45-60 min):**
- [ ] Re-read spec.md sections for Homeowner Dashboard enhancements + quote limits; cross-check data-model.md Lead/User fields.
- [ ] Inspect current schema for missing `quoteType`/`leadSubmissionLimit` to avoid duplicate fields.
- [ ] Review existing OTP flow (`QuoteOptionsModal`, `OTPVerificationModal`) and NewQuoteRequestModal capabilities.
- [ ] Confirm admin homeowners API (`/api/admin/homeowners`) structure to extend with limit data.
- [ ] List exact files to touch; plan migration impact and backfill strategy.

**During Implementation:**
- [ ] After schema + migration (T161-T163) run `npx prisma validate` and `npx tsc --noEmit`.
- [ ] After services/APIs (T164-T169) run `npm run build` and exercise new endpoints via Thunder Client/Postman.
- [ ] After UI work (T170-T179) run `npm run build` again and smoke-test flow in browser (`npm run dev`).

**Post-Phase Validation:**
- [ ] Prisma: `npx prisma validate` + ensure migration folder `*_phase-4-8-lead-limits` committed.
- [ ] TypeScript: `npx tsc --noEmit` (0 errors).
- [ ] Build: `npm run build` (0 errors, warnings reviewed).
- [ ] API checks: GET `/api/homeowner/dashboard`, PATCH `/api/admin/homeowners/:id/lead-limit`, POST `/api/leads` with new `quoteType` combinations.
- [ ] UI checks: Dashboard metrics accurate, Request More Quotes flow completes, admin limit edit persists.
- [ ] Backfill: existing leads assigned default `quoteType` + users get default limit (document any manual SQL steps).
- [ ] Notifications/Audit logs fired for limit changes and new leads.
- [ ] Automation regression: auto-approval rules handle new enum values, simulations pass.
- [ ] User approval received prior to commit.
- [ ] Prepare commit draft: "Phase 4.8: Homeowner dashboard & second quote requests" (pending approval).

**Risks & Mitigations:**
1. ⚠️ Existing leads missing `quoteType` → mitigate with migration default/backfill script before deploy.
2. ⚠️ Session cache stale after limit change → solution: refetch dashboard summary post-PATCH and document requirement to re-login if JWT payload extended.
3. ⚠️ OTP spam/back button abuses → ensure verification context stored in state, throttle UI button, rely on existing rate-limit service.
4. ⚠️ Multiple lead creation request collisions → centralise creation loop with Promise.allSettled, rollback UI counts on partial failure and surface toast.

**Phase 4.8 Status:** ✅ Backend Complete, ✅ Admin UI Complete

Status notes (2025-10-16):
- T161-T169: ✅ ALL COMPLETE (schema, services, APIs verified)
- T170-T176: ✅ Homeowner experience complete
- T177: ✅ COMPLETE (admin list shows quotas + filters)
- T178: ✅ COMPLETE (inline edit with save/cancel in AdminHomeownersList)
- T179: ✅ COMPLETE (quota display card with progress bar in lead detail)
- T172 pre-fill issue addressed in Phase 4.9.

---

## Phase 4.9: Phone Verification UX Fixes (Priority: P1 - CRITICAL) (Persona: Guest + Homeowner)

**Goal**: Fix phone number pre-population and profile synchronization issues discovered during Phase 4.8 testing.

**Problem Statement**: 
During Phase 4.8 testing, the following critical UX issues were identified:
1. ❌ ContactVerificationModal opens with EMPTY phone input field (users must re-type their phone number)
2. ❌ Users' phone numbers from signup are not loaded into the verification modal
3. ❌ When users edit phone number during verification, the change doesn't persist to their profile
4. ❌ Test OTP code (123456) is hardcoded but not documented for testing

**Root Cause**:
- User's phone number exists in database but not included in NextAuth session
- ContactVerificationModal doesn't fetch or receive user's existing phone number
- No API endpoint to update user's phone number
- Phone number changes during verification are not synchronized with user profile

**User Requirements**:
1. Phone number from signup MUST be pre-populated in verification modal (fetch from database)
2. Phone input field must be EDITABLE (users can update if needed)
3. If user edits phone number during verification, it MUST update in:
   - Database (User table)
   - NextAuth session
   - Profile page ("My Profile" section)
4. Test OTP (123456) must work for development testing without SMS provider

### Phase 4.9 Implementation Tasks

#### Session & Auth Enhancement (BLOCKING) ✅
- [X] **T182** [US1] Extend NextAuth session types to include `phone` field in `src/types/next-auth.d.ts` (add to Session.user interface and JWT interface)
- [X] **T183** [US1] Update `src/lib/auth.ts` JWT callback to:
  - Select `phone` from User table during login (add to Prisma select in authorize function)
  - Include `phone` in JWT token payload
  - Handle session update trigger for phone changes (add trigger === "update" logic)
  - Include `phone` in session.user object returned to client
- [X] **T184** [US1] Test session update: login, check session.user.phone is populated from database

#### Phone Number Update API ✅
- [X] **T185** [US1] Create `PUT /api/user/update-phone` route in `src/app/api/user/update-phone/route.ts`:
  - Validate phone number (E.164 format: `/^\+[1-9]\d{1,14}$/`)
  - Update user.phone in database via Prisma
  - Reset user.phoneVerified to false (require re-verification after change)
  - Create audit log entry for phone update
  - Return success with updated phone and verification status
  - Handle duplicate phone number error (if unique constraint added later)

#### ContactVerificationModal Enhancement ✅
- [X] **T186** [US1] Update `ContactVerificationModal.tsx` to:
  - Accept `defaultPhone` prop (user's current phone from session)
  - Pre-populate phone input field with `defaultPhone` value on modal open
  - Keep input editable (users can modify if needed)
  - Add `useSession()` hook to access session data
  - Import `useSession` from 'next-auth/react'

- [X] **T187** [US1] Add phone update logic to ContactVerificationModal:
  - Before sending OTP, check if phone number differs from session.user.phone
  - If changed, call `PUT /api/user/update-phone` with new phone number
  - Wait for API response (handle errors: duplicate phone, invalid format)
  - Update session using `updateSession({ phone: newPhone, phoneVerified: false })`
  - Show status message: "Phone number updated. Sending verification code..."
  - Then proceed to send OTP to the NEW phone number
  - Handle edge cases: API errors, network failures, validation errors

#### Dashboard Integration ✅
- [X] **T188** [US1] Update `src/app/homeowner/dashboard/page.tsx`:
  - Pass `session?.user?.phone` as `defaultPhone` prop to ContactVerificationModal
  - Ensure session is loaded before rendering modal (useSession hook)
  - Add fallback if session.user.phone is null (empty string or placeholder)

#### OTP Verification Success Flow ✅
- [X] **T189** [US1] Update `handleOTPVerificationSuccess` in dashboard to:
  - Call `updateSession({ phoneVerified: true, phone: verifiedPhoneNumber })` after successful verification
  - Ensure session.user.phoneVerified reflects true immediately
  - Refresh dashboard summary to update UI (quotas, badges, CTA states)
  - Persist verification status across page refreshes

#### Test OTP Configuration ✅
- [X] **T190** [US1] Update `src/lib/services/phone-verification-service.ts`:
  - Add development test OTP: accept "123456" as valid code (bypass SMS)
  - Add conditional check: `const isTestOTP = code === "123456" && process.env.NODE_ENV === 'development'`
  - If test OTP used, skip hash comparison, mark verification successful
  - Add dev hint in error messages: "For testing, use OTP: 123456"
  - Document test OTP in .env.example and README

#### Profile Page Verification
- [ ] **T191** [US1] Test "My Profile" page displays updated phone number:
  - After phone update via verification modal
  - After OTP verification success
  - Verify session persistence (refresh page, phone still shows)
  - Check database directly (Prisma Studio) to confirm phone is saved

#### Validation & Testing
- [ ] **T192** [US1] End-to-end test scenario:
  1. Sign up with phone: +61412345678
  2. Login, open dashboard
  3. Click "Verify Phone to Continue"
  4. **Expected:** Modal shows +61412345678 pre-filled
  5. Edit phone to +61412999888
  6. Click "Send verification code"
  7. **Expected:** "Phone number updated" message
  8. Enter OTP: 123456
  9. **Expected:** Verification success
  10. Go to "My Profile"
  11. **Expected:** Phone shows +61412999888
  12. Refresh page
  13. **Expected:** Phone still shows +61412999888 (session persistence)

- [ ] **T193** [US1] Test edge cases:
  - User with no phone in database (null) → modal shows empty, allows entry
  - Invalid phone format → validation error before API call
  - Duplicate phone number → API returns error, show user-friendly message
  - Network error during update → show retry option
  - Session update fails → fallback to page refresh

- [ ] **T194** [US1] Test session synchronization:
  - Phone update reflects immediately in header/profile without page refresh
  - PhoneVerified badge updates immediately after OTP success
  - Dashboard quota limits refresh after verification
  - Session persists across browser tabs

### Phase 4.9 Validation Checklist

**Pre-Phase (30 min):**
- [ ] Review User requirement: phone must be pre-populated, editable, and sync to profile
- [ ] Check current NextAuth session structure (`src/types/next-auth.d.ts`)
- [ ] Check current ContactVerificationModal props and state management
- [ ] Verify User model has phone field in Prisma schema
- [ ] List all files to modify (auth.ts, next-auth.d.ts, ContactVerificationModal.tsx, dashboard page, new API route)

**During Implementation:**
- [ ] After T182-T184 (Session): Test login, inspect session object in DevTools (should have phone field)
- [ ] After T185 (API): Test with Postman/Thunder Client - PUT /api/user/update-phone
- [ ] After T186-T188 (Modal): Open modal in browser, verify phone pre-filled
- [ ] After T189-T191 (Verification): Complete OTP flow, check profile page
- [ ] After T190 (Test OTP): Verify "123456" works in development

**Post-Phase Validation:**
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors)
- [ ] Session includes phone: Login → DevTools → check session.user.phone (not null)
- [ ] Modal pre-population: Open ContactVerificationModal → see your phone number
- [ ] Phone update API: Change phone → verify database updated (Prisma Studio)
- [ ] Profile sync: Update phone → check "My Profile" → see new phone
- [ ] OTP test code: Enter "123456" → verification succeeds
- [ ] Session persistence: Update phone → refresh page → phone still correct
- [ ] No regressions: Existing login, signup, dashboard flows still work
- [ ] User approval received for commit
- [ ] Git commit: "Phase 4.9: Fix phone verification UX - pre-population and profile sync"

**Expected Outcomes:**
1. ✅ Phone number from signup appears in verification modal (no re-typing needed)
2. ✅ Phone input is editable (users can update if they changed numbers)
3. ✅ Phone changes persist to database and profile immediately
4. ✅ Session synchronization works (phone visible in profile without refresh)
5. ✅ Test OTP (123456) works for development testing
6. ✅ All flows maintain state correctly (no data loss on refresh)

**Time Estimate:** 3-4 hours (1 hour auth changes + 1 hour API + 1 hour UI + 1 hour testing)

**Blockers:** None - all dependencies (User model, ContactVerificationModal, OTP flow) exist

---


## Phase 4.9.5: Homeowners Quote Request After Sign-in (Priority: P1) (Persona: Homeowner)

**Status**: ✅ PARTIALLY COMPLETE - Core UX features implemented (October 18, 2025)

Goal: Allow newly signed-in homeowners who did not start from the guest flow to request their first quote directly. The flow must be identical to the guest instant quote flow but without the signup modal. Show the Instant Quote form with empty fields, calculate results, choose quote type, and submit lead(s). If homeowner already has 1+ leads, fall back to Phase 4.8 flow (may require OTP and may prefill from most recent lead).

Independent Test: Create a homeowner account that has zero leads → open dashboard → see “Request Your First Quote” CTA → clicking opens InstantQuoteForm modal directly (no signup modal) with empty fields → calculate → choose quote type and count within limits → submit → dashboard shows 1 requested of 5, remaining 4; admin leads table shows the new lead with timestamp and chosen type.

---

### ✅ Completed Features (October 18, 2025)

#### Feature 1: First Quote Success Modal (Commit: d2bb20f)
- [X] **T202** Created `FirstQuoteSuccessModal` component (`src/components/homeowner/FirstQuoteSuccessModal.tsx`)
  - Success message with emerald verification CTA, quote balance display, bidding info card
- [X] **T203** Integrated into dashboard (`src/app/homeowner/dashboard/page.tsx`)
  - Shows when leadSubmissionCount === 1, connects to ContactVerificationModal
- [X] **T204** Documentation: `DOC/Records/FIRST-QUOTE-SUCCESS-MODAL-2025-10-18.md`

#### Feature 2: View-Only Instant Quote Mode (Commit: 87713d6)
- [X] **T205** View-only restriction (`src/components/InstantQuoteForm.tsx`)
  - hideSubmitButton prop, informational banner, preserved calculator functionality
- [X] **T206** Homepage integration (`src/app/page.tsx`)
  - Fetches lead count, hides submit button for homeowners with existing quotes
- [X] **T207** Documentation: `DOC/Records/INSTANT-QUOTE-VIEW-ONLY-MODE-2025-10-18.md`

**Testing**: ✅ TypeScript (0 errors), ✅ Commits created, ✅ No breaking changes

---

### Implementation Tasks (US1 extension)

- [ ] T195 [US1] Show first-quote CTA when homeowner has zero leads
  - Update `src/app/homeowner/dashboard/page.tsx` to detect `summary.totalRequested === 0` and render a prominent “Request Your First Quote” button.
  - Wire click to open the existing `NewQuoteRequestModal` in a new mode: `{ context: 'first-quote' }`.
  - Manual QA Checklist Required.

- [ ] T196 [US1] Bypass signup modal for signed-in homeowners and open InstantQuoteForm empty
  - Reuse `NewQuoteRequestModal` → ensure it renders `InstantQuoteForm` directly when `context === 'first-quote'` and user is authenticated (role HOMEOWNER).
  - Ensure initialValues are empty (do not prefill from previous lead when totalRequested === 0).
  - Ensure the same calculation UI/UX and results panel from guest flow are shown.
  - Manual QA Checklist Required.

- [ ] T197 [US1] Quote type selection and count with limit checks
  - After calculation, show the existing quote type choice flow (Call/Visit, Written) and count selector respecting `quoteLimit` and remaining balance.
  - Guardrails: total selected across types ≤ remaining; surface inline validation messages.
  - Manual QA Checklist Required.

- [ ] T198 [US1] Lead creation API path for first quote
  - Confirm POST `/api/leads` path works with signed-in homeowner and no OTP when `summary.totalRequested === 0`.
  - If needed, add a server-side guard in `src/app/api/leads/route.ts`: require OTP only when `leadSubmissionCount >= 1` (existing Phase 4.8 behavior for subsequent quotes), but allow first quote creation for authenticated homeowners with zero leads.
  - Return refreshed dashboard summary in response.
  - Manual QA Checklist Required.

- [ ] T199 [US1] Dashboard refresh and success UX
  - On success, show toast (“Request sent”) and refresh the dashboard summary to reflect requested/remaining.
  - Add small success copy guiding next steps.
  - Manual QA Checklist Required.

- [ ] T200 [US1] Admin visibility (no new UI beyond existing)
  - Verify the newly created lead(s) appear in `/admin/leads` with correct status, quoteType, and timestamp.
  - Optional badge (future): “First quote”. Defer unless requested.

- [ ] T201 [US1] Analytics and audit
  - Emit events (optional): `first_quote_started`, `first_quote_submitted`.
  - Ensure `createAuditLog` records creation action.

### Manual QA Checklist (First-Quote After Sign-in)
Role: Homeowner (no existing leads)

1) Entry & modal behavior
   - Log in as a homeowner with zero leads; open Dashboard.
   - You should see a prominent “Request Your First Quote” CTA.
   - Click it: You should NOT see any signup/login modal.
   - The InstantQuoteForm modal should open with all fields empty.

2) Form and calculation
   - Fill the form and click “Calculate” (or equivalent); results should render as in guest flow.
   - Change inputs and recalc; results update accordingly; no console errors.

3) Quote type and limits
   - Choose Call/Visit or Written Quote; pick counts within your remaining limit (e.g., 1 of 5).
   - Attempt to exceed remaining; UI should prevent and show an error.

4) Submission and dashboard refresh
   - Submit; request should succeed; see success toast.
   - Dashboard metrics should update: Requested 1 / Limit 5, Remaining 4.
   - Network: POST `/api/leads` should be 200, response contains refreshed summary.

5) Admin visibility
   - In admin `/admin/leads`, the new lead appears with correct quoteType and createdAt.

6) Edge cases & errors
   - Reload the page; metrics persist and remain correct.
   - Try to access first-quote CTA when you already have leads; CTA should be hidden and Phase 4.8 flow should be used instead.
   - Leave required fields empty → submission blocked with inline validation.

### Validation & Regression
During Implementation:
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors)
- [ ] API: Manually test POST `/api/leads` with/without prior leads to validate OTP gating rules remain intact (OTP only required for subsequent quotes per Phase 4.8).

Post-Phase Validation:
- [ ] Dashboard: first-quote CTA shows only when totalRequested === 0
- [ ] Modal: opens InstantQuoteForm directly; no signup modal appears
- [ ] Limits: selection obeys remaining balance; UI prevents overflow
- [ ] Admin: lead visible with correct metadata
- [ ] No regressions: guest flow, Phase 4.8 re-request flow, and OTP logic remain correct
- [ ] User approval received for commit
- [ ] Git commit: "Phase 4.9.5: Homeowner first-quote after sign-in (instant quote flow without signup)"

Notes:
- This phase reuses existing components (NewQuoteRequestModal, InstantQuoteForm) with a new `context: 'first-quote'` and conditional logic based on lead count.
- OTP remains enforced for second and subsequent quotes per Phase 4.8. First quote after sign-in does not prompt OTP.

---

## Phase 4.9.6: Homeowners Second Quote Generation Process and Bidding System (Priority: P1) (Persona: Homeowner)

**Status**: 🚧 IN PROGRESS - Audit and planning phase

**Goal**: Enable verified homeowners to request multiple additional quotes with flexible distribution (call/visit vs written), implement competitive bidding for written quotes, and allow quote editing until installer visibility.

**User Journey**: Homeowner completes first quote → verifies phone → clicks "Request More Quotes" → sees pre-filled form with all first quote data → edits any fields → recalculates → selects quote distribution (e.g., 2 call/visit + 2 written, max 4 total) → submits → receives success confirmation → optionally opens ONE written quote for bidding → multiple installers compete → homeowner reviews bids in dedicated Bidding Dashboard.

**Independent Test**: 
1. Second Quote Flow: Login as verified homeowner (leadSubmissionCount >= 1) → open dashboard → click "Request More Quotes" → verify form pre-filled with most recent lead data → edit address, system size → click "Calculate Again" → results update → select 2 call/visit + 2 written quotes → submit → verify dashboard shows 4 new leads, quota updated
2. Bidding Flow: Click "Open for Bidding" on one written quote → confirm modal → verify status changes to BIDDING_OPEN → check Bidding page shows lead → verify installer marketplace shows "Bidding Available" badge → confirm other written quotes no longer have bidding option
3. Lead Editing: Click edit on DRAFT or PENDING_APPROVAL lead → modify fields → save → verify changes persisted → approve lead (as admin) → verify edit button hidden once APPROVED

---

### Pre-Phase Audit Summary (Completed October 18, 2025)

**Current Implementation Analysis:**

✅ **Existing Working Components:**
1. **RequestMoreQuotesCTA** (`src/components/homeowner/RequestMoreQuotesCTA.tsx`)
   - Shows remaining quota, used/limit progress bar
   - Handles first quote vs subsequent quote CTAs
   - Integrates verification flow trigger
   - Status: COMPLETE ✅

2. **NewQuoteRequestModal** (`src/components/NewQuoteRequestModal.tsx`)
   - Wraps InstantQuoteForm
   - Accepts `initialData` prop for pre-filling
   - Status: COMPLETE ✅

3. **InstantQuoteForm** (pre-fill capability)
   - Accepts `initialData` prop
   - Pre-fills all fields from previous quote
   - Recalculation works correctly
   - Status: COMPLETE ✅

4. **Dashboard Integration** (`src/app/homeowner/dashboard/page.tsx`)
   - Fetches dashboard summary with `recentLeads` array
   - Passes `quoteData` from most recent lead to modal
   - `getLatestQuoteData()` function extracts pre-fill data
   - Status: COMPLETE ✅

5. **API Endpoints**
   - POST `/api/leads` - Creates single lead
   - GET `/api/homeowner/dashboard` - Returns lead summary with quoteData
   - Status: CREATE endpoint exists, BATCH creation needed

6. **Data Model** (`prisma/schema.prisma`)
   - Lead model has `quoteData Json? @db.JsonB` field (Phase 4.5)
   - Lead model has `quoteType LeadQuoteType` enum (CALL_VISIT | WRITTEN_QUOTE)
   - Lead model has `status LeadStatus` enum
   - User model has `leadSubmissionLimit Int @default(5)` and `leadSubmissionCount Int @default(0)`
   - Status: Schema supports pre-fill and quota ✅

**Current LeadStatus Enum Values:**
```prisma
enum LeadStatus {
  DRAFT              // Initial creation, not yet submitted
  PENDING_PHONE      // Awaiting phone verification (OTP)
  PENDING_APPROVAL   // Awaiting admin approval
  APPROVED           // Approved by admin, visible to installers
  PURCHASED          // Purchased by an installer
  QUOTED             // Installer sent quote(s)
  ACCEPTED           // Homeowner accepted a quote
  REJECTED           // Homeowner rejected all quotes
  EXPIRED            // Lead expired (no action within time limit)
  CANCELLED          // Homeowner cancelled the lead
  FLAGGED            // Flagged for admin review
}
```

❌ **Missing/Needed Implementations:**

1. **Quote Count Distribution UI** - NOT IMPLEMENTED
   - No modal to select how many call/visit vs written quotes
   - Current flow only creates ONE lead per submission
   - Need: `QuoteTypeDistributionModal` component with live counter

2. **Batch Lead Creation** - NOT IMPLEMENTED
   - POST `/api/leads` only creates single lead
   - Need: Support creating multiple leads in one request
   - Need: Maintain quoteData consistency across all created leads

3. **Bidding System** - NOT IMPLEMENTED
   - No "Open for Bidding" button on written quotes
   - No BIDDING_OPEN status in LeadStatus enum
   - No `/homeowner/bidding` dashboard page
   - No "Bidding Available" badge for installers
   - No one-time activation enforcement (only one written quote can be opened for bidding)
   - Need: Complete bidding infrastructure

4. **Lead Editing** - NOT IMPLEMENTED
   - No edit button in dashboard lead list
   - No PATCH `/api/leads/[id]` endpoint
   - No status-based edit restrictions (allow edit only until APPROVED)
   - Need: Edit modal, API endpoint, permission logic

5. **Installer Bidding Visibility** - NOT IMPLEMENTED
   - No "Bidding Available" badge in installer marketplace
   - No bidding context in installer lead detail view
   - Need: Installer-facing bidding UI enhancements

**Architectural Gaps Identified:**

1. **Schema Changes Required:**
   - Add `BIDDING_OPEN` to LeadStatus enum
   - Add `biddingOpenedAt DateTime?` to Lead model (track when bidding was activated)
   - Add `biddingOpenedBy String?` to Lead model (track which homeowner opened bidding)
   - Consider: `canOpenForBidding Boolean @default(true)` flag to enforce one-time rule

2. **Business Logic Extensions:**
   - lead-service.ts: Add `createMultipleLeads()` function
   - lead-service.ts: Add `updateLead()` function (with status validation)
   - lead-service.ts: Add `openLeadForBidding()` function (validate: written quote, not already opened, homeowner hasn't opened another)
   - lead-service.ts: Add `canEditLead()` validator (status must be DRAFT, PENDING_PHONE, or PENDING_APPROVAL)

3. **API Contract Extensions:**
   - POST `/api/leads` - Add support for array of quote distributions: `{ quoteData, distributions: [{ type: 'CALL_VISIT', count: 2 }, { type: 'WRITTEN_QUOTE', count: 2 }] }`
   - PATCH `/api/leads/[id]` - Update lead fields (restricted by status)
   - POST `/api/leads/[id]/open-bidding` - Activate bidding (validate eligibility)
   - GET `/api/homeowner/bidding` - Fetch active bidding leads with installer bids

4. **Frontend Components Needed:**
   - `QuoteTypeDistributionModal.tsx` - Select quote type counts
   - `BiddingConfirmationModal.tsx` - Confirm bidding activation
   - `BiddingDashboard.tsx` - Page at `/homeowner/bidding`
   - `LeadEditModal.tsx` - Edit lead details
   - `BiddingAvailableBadge.tsx` - Installer marketplace badge

**Dependencies & Blockers:**
- ✅ Phase 4.8 complete (second quote flow exists, verification working)
- ✅ Phase 4.9 complete (phone pre-fill, session sync working)
- ✅ Phase 4.9.5 complete (first quote success modal, view-only mode)
- ⚠️ No blockers, ready to implement

**Testing Strategy:**
1. Manual QA checklist (end-to-end flow, edge cases)
2. Database validation (multiple leads created, bidding status correct)
3. Permission testing (edit restrictions, bidding eligibility)
4. UI/UX validation (quota display, badge visibility, modal flows)
5. Regression testing (existing single quote flow, verification flow, admin approval)

---

### Phase 4.9.6 Implementation Tasks

#### Data Model & Schema (BLOCKING) 🔴
- [ ] **T208** [US1] Extend LeadStatus enum in `prisma/schema.prisma`:
  - Add `BIDDING_OPEN` status value (after APPROVED, before PURCHASED)
  - Run migration: `npx prisma migrate dev --name add-bidding-status`
  - Update TypeScript types in `src/types/lead.ts`
  - Manual QA: Verify enum in Prisma Studio

- [ ] **T209** [US1] Add bidding tracking fields to Lead model in `prisma/schema.prisma`:
  - `biddingOpenedAt DateTime?` - Timestamp when bidding was activated
  - `biddingOpenedBy String?` - User ID who opened bidding (for audit)
  - `biddingClosedAt DateTime?` - When bidding ended (future use)
  - Run migration: `npx prisma migrate dev --name add-bidding-tracking`
  - Manual QA: Check Lead table schema in Prisma Studio

#### Business Logic & Services 🟡
- [ ] **T210** [US1] Create batch lead creation in `src/lib/services/lead-service.ts`:
  - Add `createMultipleLeads(input: CreateLeadInput, distributions: QuoteDistribution[]): Promise<CreateLeadResult[]>`
  - Function creates N leads with same quoteData but different quoteType values
  - Validate total count against remaining quota
  - Return array of created leads with updated quota
  - Call createAuditLog for each lead creation
  - Call createNotification once for batch (avoid spam)
  - Manual QA Checklist:
    * Create 3 leads in one request (2 call/visit + 1 written)
    * Verify all 3 leads have identical quoteData in database
    * Verify leadSubmissionCount increments by 3
    * Verify remaining quota decreases by 3
    * Attempt to exceed quota (e.g., remaining 2, request 3) → expect error
    * Check audit log has 3 entries with correct timestamps

- [ ] **T211** [US1] Implement lead update service in `src/lib/services/lead-service.ts`:
  - Add `updateLead(leadId: string, homeownerId: string, updates: Partial<CreateLeadInput>): Promise<Lead>`
  - Validate lead belongs to homeowner (security)
  - Validate status allows editing: `canEditLead(status) => status in [DRAFT, PENDING_PHONE, PENDING_APPROVAL]`
  - If status is APPROVED or later → throw error "Cannot edit lead after approval"
  - Update quoteData field to preserve edited values
  - Call createAuditLog with LEAD_UPDATED action
  - Manual QA Checklist:
    * Edit DRAFT lead → verify success, changes saved
    * Edit PENDING_APPROVAL lead → verify success
    * Edit APPROVED lead → expect 403 error
    * Edit another homeowner's lead → expect 403 error
    * Update propertyPostcode, energyBill → verify quoteData updated

- [ ] **T212** [US1] Create bidding activation service in `src/lib/services/lead-service.ts`:
  - Add `openLeadForBidding(leadId: string, homeownerId: string): Promise<{ success: boolean; lead?: Lead; error?: string }>`
  - Validate:
    * Lead exists and belongs to homeowner
    * quoteType === 'WRITTEN_QUOTE' (bidding only for written quotes)
    * status === 'APPROVED' (must be approved first)
    * biddingOpenedAt === null (not already opened for bidding)
  - Check homeowner hasn't opened another lead for bidding (one-time rule):
    * Query: `prisma.lead.findFirst({ where: { homeownerId, biddingOpenedAt: { not: null } } })`
    * If found → return error: "You can only open one quote for bidding"
  - If valid:
    * Update lead: `status = BIDDING_OPEN`, `biddingOpenedAt = now()`, `biddingOpenedBy = homeownerId`
    * Call createAuditLog with LEAD_BIDDING_OPENED action
    * Call createNotification to all installers: "New bidding opportunity available"
  - Return success with updated lead
  - Manual QA Checklist:
    * Open APPROVED written quote for bidding → verify status changes to BIDDING_OPEN
    * Verify biddingOpenedAt timestamp set correctly
    * Attempt to open second written quote → expect error message
    * Attempt to open call/visit quote → expect error (not written quote)
    * Attempt to open DRAFT quote → expect error (not approved yet)
    * Check all installers receive notification
    * Verify audit log entry created

#### API Endpoints 🟢
- [ ] **T213** [US1] Update POST `/api/leads` to support batch creation in `src/app/api/leads/route.ts`:
  - Accept new request body format:
    ```json
    {
      "quoteData": { /* InstantQuote results */ },
      "distributions": [
        { "type": "CALL_VISIT", "count": 2 },
        { "type": "WRITTEN_QUOTE", "count": 2 }
      ],
      "propertyPostcode": "2000",
      "location": "Sydney",
      ...
    }
    ```
  - Backwards compatible: if `distributions` missing, create single lead (existing behavior)
  - Validate total count: `sum(distributions.count) <= remainingQuota`
  - Call `createMultipleLeads()` service function
  - Return array of created leads + updated quota:
    ```json
    {
      "leads": [ /* array of created leads */ ],
      "totalCreated": 4,
      "remainingQuota": 1,
      "requiresVerification": false
    }
    ```
  - Manual QA Checklist:
    * POST with distributions: [CALL_VISIT: 2, WRITTEN_QUOTE: 2] → verify 4 leads created
    * POST without distributions (legacy format) → verify 1 lead created
    * POST with count > remaining quota → expect 400 error
    * Verify response includes all created lead IDs
    * Check dashboard shows updated quota immediately

- [ ] **T214** [US1] Create PATCH `/api/leads/[id]` route in `src/app/api/leads/[id]/route.ts`:
  - Validate user is authenticated (session)
  - Validate user role === HOMEOWNER
  - Extract leadId from URL params
  - Accept partial lead updates in body (same fields as CreateLeadInput)
  - Call `updateLead(leadId, session.user.id, updates)` service function
  - Handle errors:
    * 403: Cannot edit lead after approval
    * 404: Lead not found
    * 403: Lead doesn't belong to user
  - Return updated lead with quoteData
  - Manual QA Checklist:
    * PATCH DRAFT lead with updated energyBill → verify success
    * PATCH APPROVED lead → expect 403 error
    * PATCH lead owned by different user → expect 403 error
    * PATCH with invalid fields → expect validation error
    * Verify updated fields reflected in database

- [ ] **T215** [US1] Create POST `/api/leads/[id]/open-bidding` route in `src/app/api/leads/[id]/open-bidding/route.ts`:
  - Validate user is authenticated (session)
  - Validate user role === HOMEOWNER
  - Extract leadId from URL params
  - Call `openLeadForBidding(leadId, session.user.id)` service function
  - Handle errors:
    * 400: Not a written quote
    * 400: Lead not approved yet
    * 400: Already opened for bidding
    * 400: You can only open one quote for bidding
    * 404: Lead not found
    * 403: Lead doesn't belong to user
  - Return success response:
    ```json
    {
      "success": true,
      "lead": { /* updated lead with BIDDING_OPEN status */ },
      "message": "Lead opened for bidding successfully"
    }
    ```
  - Manual QA Checklist:
    * POST with valid written quote → verify status changes to BIDDING_OPEN
    * POST with second written quote → expect 400 error
    * POST with call/visit quote → expect 400 error
    * POST with unapproved lead → expect 400 error
    * Verify installer marketplace updates immediately

- [ ] **T216** [US1] Create GET `/api/homeowner/bidding` route in `src/app/api/homeowner/bidding/route.ts`:
  - Validate user is authenticated (session)
  - Validate user role === HOMEOWNER
  - Query leads with:
    * homeownerId = session.user.id
    * status = BIDDING_OPEN
    * Include: bids from installers (future: Quote model relation)
  - Return array of bidding leads with metadata:
    ```json
    {
      "biddingLeads": [
        {
          "id": "lead123",
          "quoteData": { /* original quote data */ },
          "biddingOpenedAt": "2025-10-18T10:00:00Z",
          "bidsCount": 3,
          "highestBid": 5000,
          "lowestBid": 4200
        }
      ]
    }
    ```
  - Manual QA Checklist:
    * GET as homeowner with bidding lead → verify lead returned
    * GET as homeowner without bidding leads → expect empty array
    * GET as guest → expect 401 error
    * Verify bidsCount accurate (when bidding implemented)

#### Frontend Components 🎨
- [ ] **T217** [US1] Create `QuoteTypeDistributionModal` in `src/components/homeowner/QuoteTypeDistributionModal.tsx`:
  - Props: `isOpen`, `onClose`, `onSubmit(distributions)`, `remainingQuota`, `quoteData`
  - UI Layout:
    * Header: "Select Quote Distribution" with remaining quota display
    * Two sections: "Call or Site Visit Quotes" and "Written Quotes"
    * Each section has:
      - Count selector (0-4 buttons or input)
      - Description of quote type
      - Live preview of total selected
    * Footer:
      - Total count display: "Selected: 3 of 4 remaining"
      - Validation message if count exceeds quota
      - "Confirm" button (disabled if invalid)
      - "Cancel" button
  - Validation:
    * Total count <= remainingQuota
    * Total count > 0 (at least one quote)
    * Real-time feedback on count changes
  - On submit:
    * Call onSubmit with distributions: `[{ type: 'CALL_VISIT', count: 2 }, { type: 'WRITTEN_QUOTE', count: 1 }]`
    * Close modal
  - Styling: Match theme-card, glass-effect, responsive
  - Manual QA Checklist:
    * Select 2 call/visit + 2 written → verify total shows "4"
    * Attempt to select 5 (quota is 4) → verify error message, confirm button disabled
    * Change counts dynamically → verify total updates in real-time
    * Click cancel → modal closes without submitting
    * Submit valid distribution → verify parent receives correct data structure

- [ ] **T218** [US1] Create `BiddingConfirmationModal` in `src/components/homeowner/BiddingConfirmationModal.tsx`:
  - Props: `isOpen`, `onClose`, `onConfirm`, `leadId`, `quoteData`
  - UI Layout:
    * Header: "Open Lead for Bidding"
    * Icon: Gavel icon (bidding symbol)
    * Message: "By opening this lead for bidding, multiple installers will be able to place their bids for your project. This increases your chances of getting competitive offers and finding the best fit for your solar installation needs."
    * Quote details preview: Show system size, location, budget from quoteData
    * Warning: "⚠️ You can only open ONE quote for bidding. Once activated, this action cannot be undone."
    * Buttons:
      - "Confirm & Open Bidding" (primary button, emerald)
      - "Cancel" (secondary button)
  - On confirm:
    * Call POST `/api/leads/[leadId]/open-bidding`
    * Show loading state
    * On success: Show toast "Lead opened for bidding!", close modal, trigger parent refresh
    * On error: Show error message (e.g., "You can only open one quote for bidding")
  - Manual QA Checklist:
    * Open modal → verify message displayed correctly
    * Click confirm → verify API called, loading state shown
    * Success → verify toast, modal closes, dashboard refreshes
    * Error (already opened another) → verify error message displayed
    * Click cancel → modal closes without API call

- [ ] **T219** [US1] Create `BiddingDashboard` page in `src/app/homeowner/bidding/page.tsx`:
  - Fetch bidding leads from GET `/api/homeowner/bidding`
  - UI Layout:
    * Header: "Bidding Room" with gavel icon
    * If no bidding leads: Empty state "You haven't opened any quotes for bidding yet"
    * For each bidding lead:
      - Lead card with quote details (system size, location, budget)
      - "Opened for bidding on: {date}"
      - Bids count: "3 installers have placed bids"
      - Bids list (future: when Quote model implemented):
        * Installer name, company, bid amount
        * "View Details" button
      - Placeholder message: "Installers will place bids soon" (if no bids yet)
    * Sidebar navigation: Link back to "Dashboard Overview"
  - Responsive: Mobile-friendly card layout
  - Manual QA Checklist:
    * No bidding leads → verify empty state displays
    * One bidding lead → verify card shows correct quote details
    * Multiple bidding leads → verify all displayed
    * Click lead card → navigate to lead detail (future feature)
    * Mobile view → verify cards stack correctly

- [ ] **T220** [US1] Create `LeadEditModal` in `src/components/homeowner/LeadEditModal.tsx`:
  - Props: `isOpen`, `onClose`, `leadId`, `initialData`, `onSaveSuccess`
  - Reuse `InstantQuoteForm` component for editing
  - Pre-fill all fields from `initialData` (from lead.quoteData)
  - Allow recalculation on field changes
  - On save:
    * Call PATCH `/api/leads/[leadId]` with updated fields
    * Show loading state
    * On success: Show toast "Lead updated!", close modal, trigger parent refresh
    * On error (403 cannot edit): Show error "This lead cannot be edited anymore"
  - Validation: Same as original quote form
  - Manual QA Checklist:
    * Edit DRAFT lead → change energyBill, click save → verify success
    * Recalculate after editing → verify new results shown
    * Edit APPROVED lead → expect 403 error, show message
    * Cancel editing → modal closes without saving
    * Check database → verify updated values saved

- [ ] **T221** [US1] Add edit button to dashboard lead list in `src/app/homeowner/dashboard/page.tsx`:
  - In "Recent Leads" section (existing Dashboard Overview page)
  - For each lead card, add conditional edit button:
    * Show if: `status in ['DRAFT', 'PENDING_PHONE', 'PENDING_APPROVAL']`
    * Hide if: `status in ['APPROVED', 'PURCHASED', 'QUOTED', ...]`
  - Button icon: Pencil or edit icon
  - On click: Open `LeadEditModal` with lead data
  - After successful edit: Refresh dashboard summary
  - Manual QA Checklist:
    * DRAFT lead → verify edit button visible and clickable
    * APPROVED lead → verify edit button hidden
    * Click edit → modal opens with correct data pre-filled
    * Save edit → dashboard refreshes, shows updated values
    * Status changes from PENDING_APPROVAL to APPROVED → edit button disappears

- [ ] **T222** [US1] Add "Open for Bidding" button to written quote cards in `src/app/homeowner/dashboard/page.tsx`:
  - In lead card (Recent Leads section)
  - Show button only if:
    * quoteType === 'WRITTEN_QUOTE'
    * status === 'APPROVED'
    * biddingOpenedAt === null (not already opened)
  - Button: "Open for Bidding" with gavel icon
  - On click: Open `BiddingConfirmationModal`
  - After successful activation: Refresh dashboard, button changes to "Bidding Active" (disabled)
  - Manual QA Checklist:
    * APPROVED written quote → verify "Open for Bidding" button visible
    * Call/visit quote → verify button hidden
    * Click button → confirmation modal opens
    * Confirm bidding → verify button changes to "Bidding Active"
    * Already opened another quote → verify error message in modal
    * Check dashboard after activation → verify status badge shows "Bidding Open"

- [ ] **T223** [US1] Integrate `QuoteTypeDistributionModal` into quote request flow in `src/app/homeowner/dashboard/page.tsx`:
  - Update `handleNewQuoteClick()` or `handleRequestMoreQuotes()` flow:
    * After InstantQuoteForm calculates results
    * Before calling POST `/api/leads`
    * Show `QuoteTypeDistributionModal` to select counts
  - New flow:
    1. User clicks "Request More Quotes"
    2. If requiresVerification → show ContactVerificationModal → OTP flow
    3. Show `NewQuoteRequestModal` (InstantQuoteForm) with pre-filled data
    4. User edits fields, clicks "Calculate Again" → results shown
    5. User clicks "Submit" or "Next"
    6. **NEW:** Show `QuoteTypeDistributionModal` (select counts)
    7. User confirms distribution (e.g., 2 call/visit + 2 written)
    8. Call POST `/api/leads` with distributions array
    9. Show success modal (FirstQuoteSuccessModal or new batch success modal)
    10. Refresh dashboard
  - Manual QA Checklist:
    * Complete full flow → verify distribution modal appears after quote calculation
    * Select 3 quotes → verify API receives correct distribution
    * Cancel distribution selection → flow stops, no leads created
    * Submit distribution → verify multiple leads created in database
    * Verify dashboard quota updates correctly (e.g., 5 → 1 remaining)

#### Installer-Facing Features 🔧
- [ ] **T224** [US3] Create `BiddingAvailableBadge` component in `src/components/installer/BiddingAvailableBadge.tsx`:
  - Props: `isActive` (boolean), `size` ('sm' | 'md' | 'lg')
  - UI: Badge with gavel icon + "Bidding Available" text
  - Styling: Blue/violet background, white text, rounded badge
  - Sizes: Small (for cards), Medium (for detail view), Large (for headers)
  - Animation: Subtle pulse effect to attract attention
  - Manual QA Checklist:
    * Render badge → verify icon and text displayed
    * Test all three sizes → verify proper scaling
    * Dark mode → verify colors readable

- [ ] **T225** [US3] Add bidding badge to installer marketplace in `src/app/(dashboard)/installer/marketplace/page.tsx`:
  - For each lead card:
    * Check if `status === 'BIDDING_OPEN'` and `quoteType === 'WRITTEN_QUOTE'`
    * If true: Show `BiddingAvailableBadge` in card header
  - Position: Top-right corner of lead card or next to quote type label
  - Manual QA Checklist:
    * Open marketplace as installer
    * Verify bidding leads show badge
    * Non-bidding leads → verify no badge
    * Click on bidding lead → navigate to detail view
    * Filter by quote type → verify bidding badges persist

- [ ] **T226** [US3] Add bidding context to installer lead detail view in `src/app/(dashboard)/installer/leads/[id]/page.tsx`:
  - If `status === 'BIDDING_OPEN'`:
    * Show prominent banner: "🔨 This lead is open for bidding"
    * Display: "Opened for bidding on {date}"
    * Message: "Submit your competitive bid to win this project"
    * Future: Show bid form (deferred to bidding implementation phase)
  - If `status === 'APPROVED'` (not bidding):
    * Show normal purchase flow
  - Manual QA Checklist:
    * View BIDDING_OPEN lead → verify banner displayed
    * View APPROVED lead → verify normal purchase button shown
    * Verify bidding date formatted correctly

#### Dashboard Navigation & Sidebar 📋
- [ ] **T227** [US1] Add "Bidding Room" link to homeowner sidebar in `src/app/homeowner/dashboard/page.tsx`:
  - Update `HomeownerSidebar` component
  - Add new NavItem: `<NavItem icon={<GavelIcon />} title="Bidding Room" ... />`
  - On click: Navigate to `/homeowner/bidding` page
  - Active state: Highlight when on bidding page
  - Manual QA Checklist:
    * Click "Bidding Room" in sidebar → navigate to /homeowner/bidding
    * Verify active state when on bidding page
    * Return to dashboard → verify sidebar link still visible
    * Mobile view → verify link in mobile sidebar menu

#### Status Display & Labels 🏷️
- [ ] **T228** [US1] Update STATUS_LABELS in `src/app/homeowner/dashboard/page.tsx`:
  - Add new status label for BIDDING_OPEN:
    ```typescript
    [LeadStatusEnum.BIDDING_OPEN]: {
      label: 'Bidding Open',
      description: 'Installers are competing for your project',
      accent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    }
    ```
  - Update existing labels if needed (consistency check)
  - Manual QA Checklist:
    * Lead with BIDDING_OPEN status → verify label displays correctly
    * Verify accent color matches design system
    * Dark mode → verify label readable

#### Validation & Testing 🧪
- [ ] **T229** [US1] End-to-end manual testing - Second Quote Flow:
  - Test Scenario:
    1. Login as homeowner with leadSubmissionCount = 1, quoteLimit = 5 (4 remaining)
    2. Dashboard shows "Request More Quotes" CTA
    3. Click CTA → verify form pre-filled with first lead data
    4. Edit fields: Change energyBill from 400 to 500, roofType from "Tile" to "Metal"
    5. Click "Calculate Again" → verify results update
    6. Click "Submit" → QuoteTypeDistributionModal opens
    7. Select: 2 Call/Visit + 2 Written quotes
    8. Click "Confirm" → API creates 4 leads
    9. Success modal shows: "4 quotes requested"
    10. Dashboard refreshes: Shows 5 total submitted, 1 remaining
    11. Verify database: 4 new leads exist, all have same quoteData (edited version)
  - Expected Results: ✅ All steps pass, quota accurate, leads created correctly

- [ ] **T230** [US1] End-to-end manual testing - Bidding Flow:
  - Test Scenario:
    1. Login as homeowner with 2 APPROVED written quotes
    2. Navigate to dashboard → see two written quote cards
    3. Click "Open for Bidding" on first written quote
    4. BiddingConfirmationModal opens with warning message
    5. Click "Confirm & Open Bidding"
    6. API call succeeds → toast shows "Lead opened for bidding!"
    7. Dashboard refreshes: First quote shows "Bidding Active" status
    8. Second written quote: "Open for Bidding" button still visible
    9. Click "Open for Bidding" on second quote
    10. Error: "You can only open one quote for bidding"
    11. Click "Bidding Room" in sidebar
    12. /homeowner/bidding page shows first quote with bidding details
    13. Login as installer → view marketplace
    14. First written quote shows "Bidding Available" badge
    15. Second written quote: No badge (not opened for bidding)
  - Expected Results: ✅ One-time rule enforced, badge visible, error handling works

- [ ] **T231** [US1] End-to-end manual testing - Lead Editing:
  - Test Scenario:
    1. Login as homeowner with 3 leads: 1 DRAFT, 1 PENDING_APPROVAL, 1 APPROVED
    2. DRAFT lead: Edit button visible → click edit
    3. LeadEditModal opens with pre-filled data
    4. Change propertyPostcode from "2000" to "2010"
    5. Recalculate → results update
    6. Click "Save" → API returns success
    7. Dashboard refreshes → DRAFT lead shows updated postcode
    8. Check database → quoteData updated with new postcode
    9. PENDING_APPROVAL lead: Edit button visible → repeat edit flow → success
    10. APPROVED lead: Edit button HIDDEN (cannot edit after approval)
    11. Attempt direct API call to edit APPROVED lead → 403 error
  - Expected Results: ✅ Edit works for DRAFT/PENDING_APPROVAL, blocked for APPROVED

- [ ] **T232** [US1] Edge case testing - Quota enforcement:
  - Test Scenarios:
    * Homeowner with 1 remaining quota → attempt to request 2 quotes → expect error
    * Homeowner with 0 remaining quota → "Request More Quotes" button disabled
    * Concurrent requests: Submit 2 quote requests simultaneously → expect one to fail (race condition test)
    * API validation: POST /api/leads with count > remaining → 400 error
  - Expected Results: ✅ Quota enforcement strict, no over-allocation

- [ ] **T233** [US1] Edge case testing - Bidding restrictions:
  - Test Scenarios:
    * Open CALL_VISIT quote for bidding → expect 400 error (only written quotes)
    * Open DRAFT quote for bidding → expect 400 error (must be approved first)
    * Already opened one quote → attempt to open second → expect 400 error
    * Two homeowners: Homeowner A opens bidding on own quote → Homeowner B cannot open bidding on different quote (verify independence)
  - Expected Results: ✅ All validations enforced, clear error messages

- [ ] **T234** [US1] Performance & regression testing:
  - Test Scenarios:
    * Create 4 leads in one batch → measure response time (< 2 seconds)
    * Dashboard load time with 20 leads → < 1 second
    * Existing single quote flow → verify still works (backwards compatibility)
    * Existing verification flow → verify not broken
    * Admin lead approval → verify new BIDDING_OPEN status visible in admin dashboard
  - Expected Results: ✅ Performance acceptable, no regressions

#### Documentation & Records 📝
- [ ] **T235** [US1] Create implementation record in `DOC/Records/PHASE-4.9.6-SECOND-QUOTE-BIDDING-2025-10-18.md`:
  - Document audit findings
  - Architecture decisions (batch API design, one-time bidding rule)
  - Schema changes (BIDDING_OPEN status, tracking fields)
  - API contract changes (POST /api/leads with distributions)
  - Component hierarchy (QuoteTypeDistributionModal flow)
  - Testing results (all T229-T234 scenarios)
  - Known limitations (bidding implementation details deferred)
  - Future enhancements (installer bid submission, bid comparison UI)

- [ ] **T236** [US1] Update API contracts in `specs/002-lead-journey-life/contracts/`:
  - Update `leads.openapi.yaml`:
    * POST /api/leads - Add distributions parameter
    * Add PATCH /api/leads/{id} endpoint
    * Add POST /api/leads/{id}/open-bidding endpoint
    * Add GET /api/homeowner/bidding endpoint
  - Update request/response examples
  - Add error codes documentation (400, 403 for bidding restrictions)

- [ ] **T237** [US1] Update tasks.md with completed task status:
  - Mark all T208-T236 tasks as complete (✅)
  - Add "Phase 4.9.6 Status: ✅ COMPLETE" banner
  - Update Phase 4.9.6 validation checklist
  - Add "Checkpoint" summary with outcomes

---

### Phase 4.9.6 Validation Checklist

**Pre-Phase (60 min):**
- [X] Complete audit of existing implementation (see Audit Summary above)
- [ ] Review spec.md for second quote generation requirements
- [ ] Review data-model.md for Lead model, LeadStatus enum, User quota fields
- [ ] Check existing dashboard flow: RequestMoreQuotesCTA, NewQuoteRequestModal integration
- [ ] Verify InstantQuoteForm pre-fill capability (initialData prop)
- [ ] List all files to create/modify: 29 tasks across schema, services, APIs, components
- [ ] Plan migration strategy: 2 migrations (bidding status, tracking fields)

**During Implementation:**
- [ ] After T208-T209 (Schema): Run `npx prisma validate`, `npx prisma migrate dev`
- [ ] After T210-T212 (Services): Run `npx tsc --noEmit` (0 errors)
- [ ] After T213-T216 (APIs): Test all endpoints with Thunder Client/Postman
- [ ] After T217-T223 (Frontend): Run `npm run build` (0 errors)
- [ ] After T224-T228 (Installer UI + Status): Visual QA in browser

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate` passes (0 errors)
- [ ] TypeScript: `npx tsc --noEmit` passes (0 errors)
- [ ] Build: `npm run build` passes (0 errors, warnings reviewed)
- [ ] Database Check: Open Prisma Studio, verify:
  * LeadStatus enum includes BIDDING_OPEN
  * Lead table has biddingOpenedAt, biddingOpenedBy columns
  * Test leads exist with status BIDDING_OPEN
- [ ] API Testing (all endpoints):
  * POST /api/leads with distributions → 4 leads created
  * PATCH /api/leads/[id] → DRAFT lead updated successfully
  * PATCH /api/leads/[id] → APPROVED lead returns 403
  * POST /api/leads/[id]/open-bidding → status changes to BIDDING_OPEN
  * POST /api/leads/[id]/open-bidding (second time) → 400 error
  * GET /api/homeowner/bidding → returns bidding leads
- [ ] UI Testing (all flows):
  * Second quote request → form pre-fills correctly
  * Distribution modal → count selection works, validation enforced
  * Bidding activation → confirmation modal, success toast, status update
  * Lead editing → edit button visible/hidden based on status
  * Bidding dashboard → shows active bidding leads
  * Installer marketplace → bidding badge visible on correct leads
- [ ] Business Logic Validation:
  * One-time bidding rule enforced (database + API level)
  * Quota enforcement strict (no over-allocation possible)
  * Edit restrictions work (status-based permission)
  * Batch creation atomic (all or nothing)
- [ ] Manual QA Complete: T229-T234 all scenarios pass
- [ ] Performance: Batch lead creation < 2 seconds, dashboard load < 1 second
- [ ] No Regressions: Existing single quote flow, verification flow, admin approval all working
- [ ] User approval received for commit
- [ ] Git commit: "Phase 4.9.6: Second quote generation with bidding system"

**Expected Outcomes:**
1. ✅ Homeowners can request multiple quotes in one submission (call/visit + written distribution)
2. ✅ Pre-fill works: Second quote request shows all data from first quote
3. ✅ Quote count selection UI intuitive with live validation
4. ✅ Bidding system: One written quote can be opened for competitive bidding
5. ✅ One-time bidding rule enforced: Homeowner can only open ONE quote for bidding
6. ✅ Bidding dashboard: Dedicated page shows active bidding leads
7. ✅ Installer visibility: "Bidding Available" badge on marketplace
8. ✅ Lead editing: Homeowners can edit leads until approved
9. ✅ Quota enforcement: No over-allocation, real-time quota display
10. ✅ Database integrity: All leads have correct quoteData, status, timestamps
11. ✅ API backwards compatible: Existing single quote flow still works
12. ✅ Foundation ready: Bidding infrastructure in place for installer bid submission (Phase 8)

**Time Estimate:** 12-16 hours total
- Schema + Services: 3 hours
- API Endpoints: 3 hours
- Frontend Components: 5 hours
- Testing + QA: 3 hours
- Documentation: 2 hours

**Dependencies Met:**
- ✅ Phase 4.8 complete (second quote flow, quota system)
- ✅ Phase 4.9 complete (phone verification, session sync)
- ✅ Phase 4.9.5 complete (first quote success modal)
- ✅ Lead model has quoteData field (Phase 4.5)
- ✅ Dashboard fetches recentLeads with quoteData (Phase 4.8)

**Notes:**
- Bidding system is **infrastructure-only** in this phase (enables activation, visibility)
- Actual installer bid submission and bid comparison UI deferred to Phase 8 (Chat & Quotes)
- One-time bidding rule enforced at multiple levels: database query, API validation, UI state
- QuoteTypeDistributionModal replaces QuoteOptionsModal in second+ quote flow
- First quote flow remains unchanged (QuoteOptionsModal still used for first submission)

---


## Phase 4: User Story 2 - Admin Reviews and Approves Leads (Priority: P1) 🎯 MVP (Persona: Admin)

**Goal**: Admin can switch between Auto-Approval Mode and Manual Review Mode, configure automation rules, and manually approve/reject/price/assign leads

**Independent Test**: Switch to Manual Mode → new lead appears in "New" → admin approves, sets price, assigns → lead appears in installer feed. Switch to Auto Mode → configure rules → new lead auto-approved without admin action.

### Implementation for User Story 2

- [X] T044 [P] [US2] Create POST `/api/leads/[id]/approve` route in `src/app/api/leads/[id]/approve/route.ts` (admin approve lead)
- [X] T045 [P] [US2] Create POST `/api/leads/[id]/reject` route in `src/app/api/leads/[id]/reject/route.ts` (admin reject lead)
- [X] T046 [P] [US2] Create admin dashboard lead list page in `src/app/admin/leads/page.tsx` (table with filtering by status, verification, postcode)
- [X] T047 [P] [US2] Create admin lead detail page in `src/app/admin/leads/[id]/page.tsx` (view full lead, set price, assign, approve/reject) + PATCH endpoint for updates
- [X] T048 [P] [US2] Create admin settings page in `src/app/admin/settings/page.tsx` (switch modes MANUAL/AUTO, automation rules CRUD UI, global pricing for Call/Visit and Written Quote)
- [X] T049 [P] [US2] Create Settings API routes in `src/app/api/settings/route.ts` (GET/PATCH settings per spec)
- [X] T050 [US2] Implement automation rules engine in `src/lib/services/automation-engine.ts` (evaluates rules, auto-approves matching leads)
- [X] T051 [US2] Create automation rules UI in admin settings page (✅ COMPLETE: Full CRUD for rules - add/edit/delete/enable/disable)
- [X] T052 [US2] Add mode-switching logic in Settings service (✅ COMPLETE: Admin settings page with MANUAL/AUTO toggle + save)
- [X] T053 [US2] Add lead auto-approval trigger in POST `/api/leads` route (call automation engine if Auto Mode enabled)
- [X] T054 [US2] Create global pricing configuration UI in admin settings (✅ COMPLETE: Call/Visit and Written Quote pricing in settings page)
- [-] T055 [US2] Create lead assignment UI in admin lead detail page (⚠️ DEFERRED: Assignment logic in approve endpoint, UI enhancement can wait)
- [-] T056 [US2] Add "hot" lead toggle in admin lead detail page (⚠️ DEFERRED: Non-critical feature, can be added in Phase 10 Polish)
- [X] T057 [US2] Add lead status change tracking in approve/reject routes (log to audit trail, update status via state machine)
- [X] T058 [US2] Send notifications on lead approval/rejection (homeowner, assigned installers)
- [X] T059 [US2] Add middleware check in admin routes to enforce ADMIN role (prevent non-admins from accessing)

**Checkpoint**: Admins can switch modes, configure automation, manually approve/reject/price/assign leads. Auto-approved leads appear instantly in installer feeds.

### Phase 4 (User Story 2) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 2 section completely
- [ ] Read contracts/leads.openapi.yaml for approve/reject endpoints
- [ ] Review existing admin dashboard structure and patterns
- [ ] Check lead-state.ts for valid status transitions
- [ ] Verify settings-service.ts exports (getSetting, updateSetting signatures)
- [ ] Grep for existing admin route patterns: `grep -r "role.*ADMIN" src/app/\(dashboard\)/admin`
- [ ] List all files to create/modify for this phase
- [ ] Prisma schema check: Settings model fields, Lead model approval fields

**During Implementation:**
- [ ] After T044-T049 (API routes): Run `npx tsc --noEmit` - fix type errors
- [ ] After T050-T053 (Services): Run `npm run build` - validate service integrations
- [ ] After T054-T059 (UI): Run `npm run build` - final validation

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T044-T059 tasks completed
- [ ] Service Integrations Verified:
  - [ ] automation-engine.ts uses correct lead-state.ts functions
  - [ ] Approve/reject routes call createAuditLog correctly
  - [ ] Settings routes use getSetting/updateSetting correctly
- [ ] API Testing:
  - [ ] POST /api/leads/[id]/approve (status updates, audit logs)
  - [ ] POST /api/leads/[id]/reject (status updates, notifications)
  - [ ] GET/PATCH /api/settings (mode switching, pricing updates)
- [ ] UI Testing:
  - [ ] Admin leads list page displays, filters work
  - [ ] Admin lead detail page shows all actions
  - [ ] Settings page mode toggle works
  - [ ] Automation rules CRUD functional
- [ ] Business Logic:
  - [ ] Manual mode: Leads stay DRAFT until approved
  - [ ] Auto mode: Matching leads auto-approved
  - [ ] Pricing configuration applies to new leads
  - [ ] Lead assignment notifies assigned installers
  - [ ] Admin role enforcement prevents non-admin access
- [ ] No Regression: Phase 1-3 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Checked settings-service.ts exports before calling
- ✅ Verified lead-state.ts transition functions exist
- ✅ Reviewed existing admin route auth patterns
- ✅ Confirmed all Prisma model fields exist in schema

---

## Phase 5: User Story 3 - Installer Discovers and Purchases Lead (Priority: P1) 🎯 MVP (Persona: Installer)

**Goal**: Verified installers browse marketplace, purchase leads via Stripe, unlock contact details and chat

**Independent Test**: Verified installer views marketplace → selects lead (contact hidden) → purchases (Stripe payment) → lead moves to "Purchased Leads" → contact revealed → can chat.

### Implementation for User Story 3

- [ ] T060 [P] [US3] Create installer marketplace page in `src/app/(dashboard)/installer/marketplace/page.tsx` (list approved leads with filters)
- [ ] T061 [P] [US3] Create installer purchased leads page in `src/app/(dashboard)/installer/purchased-leads/page.tsx` (list purchased leads)
- [ ] T062 [P] [US3] Create installer lead detail page in `src/app/(dashboard)/installer/leads/[id]/page.tsx` (view lead, purchase button, chat UI)
- [ ] T063 [P] [US3] Create POST `/api/leads/[id]/purchase` route in `src/app/api/leads/[id]/purchase/route.ts` (Stripe payment integration per leads.openapi.yaml)
- [ ] T064 [P] [US3] Create Stripe webhook handler in `src/app/api/webhooks/stripe/route.ts` (confirm payment, update lead purchaseStatus)
- [ ] T065 [US3] Implement lead purchase service in `src/lib/services/purchase-service.ts` (create Stripe payment intent, verify payment, update lead)
- [ ] T066 [US3] Add contact details reveal logic in installer lead detail page (show only after purchaseStatus = PAID)
- [ ] T067 [US3] Add "Purchased" badge to marketplace lead cards (prevent duplicate purchase attempts)
- [ ] T068 [US3] Add installer verification check in marketplace page (redirect unverified to verification flow)
- [ ] T069 [US3] Create installer verification modal in `src/components/modals/InstallerVerificationModal.tsx` (phone OTP + document upload)
- [ ] T070 [US3] Create POST `/api/installer/verify` route in `src/app/api/installer/verify/route.ts` (handle document upload to S3)
- [ ] T071 [US3] Add "Verified Installer" badge display in installer profile and marketplace
- [ ] T072 [US3] Implement simultaneous purchase prevention in purchase route (optimistic locking or transaction)
- [ ] T073 [US3] Send notifications on lead purchase (homeowner, admin)
- [ ] T074 [US3] Add middleware check in installer routes to enforce INSTALLER role

**Checkpoint**: Verified installers can browse marketplace, purchase leads, see contact details, and access chat. Stripe payments processed successfully.

### Phase 5 (User Story 3) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 3 section completely
- [ ] Read contracts/leads.openapi.yaml for purchase endpoint
- [ ] Review Stripe integration docs and src/lib/stripe.ts
- [ ] Review S3 integration docs and src/lib/s3.ts
- [ ] Check existing installer dashboard structure
- [ ] Grep Stripe webhook patterns: `grep -r "stripe.*webhook" src/`
- [ ] Verify lead-service.ts getLeadById() contact masking logic
- [ ] List all files to create/modify for this phase
- [ ] Prisma schema check: Lead.purchaseStatus, Lead.stripePaymentIntentId, InstallDocument model

**During Implementation:**
- [ ] After T060-T064 (Routes): Run `npx tsc --noEmit` - fix type errors
- [ ] After T065 (Purchase service): Run `npm run build` - validate Stripe integration
- [ ] After T066-T074 (UI + Verification): Run `npm run build` - final validation

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T060-T074 tasks completed
- [ ] Service Integrations Verified:
  - [ ] purchase-service.ts uses stripe client correctly
  - [ ] Webhook validates Stripe signatures
  - [ ] S3 presigned URL generation for documents
  - [ ] createNotification called on purchase
- [ ] API Testing:
  - [ ] POST /api/leads/[id]/purchase (creates payment intent)
  - [ ] POST /api/webhooks/stripe (processes payment confirmation)
  - [ ] POST /api/installer/verify (uploads documents to S3)
  - [ ] GET /api/leads/[id] (contact masking before purchase)
- [ ] UI Testing:
  - [ ] Marketplace page lists approved leads
  - [ ] Lead detail hides contact until purchased
  - [ ] Purchase button triggers Stripe modal
  - [ ] Verification modal uploads documents
  - [ ] Verified badge displays correctly
- [ ] Business Logic:
  - [ ] Only APPROVED leads appear in marketplace
  - [ ] Contact details masked until purchaseStatus = PAID
  - [ ] Duplicate purchase prevented (optimistic locking)
  - [ ] Unverified installers redirected to verification
  - [ ] Homeowner and admin notified on purchase
  - [ ] Installer role enforcement working
- [ ] Stripe Integration:
  - [ ] Payment intent created successfully
  - [ ] Webhook receives and processes events
  - [ ] Payment failures handled gracefully
  - [ ] No duplicate charges
- [ ] S3 Integration:
  - [ ] Documents uploaded successfully
  - [ ] Presigned URLs generated correctly
  - [ ] File size/type validation working
- [ ] No Regression: Phase 1-4 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Checked stripe.ts client initialization
- ✅ Verified s3.ts presigned URL functions
- ✅ Reviewed webhook signature verification patterns
- ✅ Confirmed PurchaseStatus enum in schema

---

## Phase 6: User Story 4 - Lead Status Tracking and Updates (Priority: P2) (Persona: All, emphasis on Installer)

**Goal**: All users see real-time status updates and full audit trail in their dashboards

**Independent Test**: Create lead → purchase → change status (e.g., "In Progress" → "Deal Closed") → verify all users see updated status and receive notifications. Check audit trail shows all actions.

### Implementation for User Story 4

- [ ] T075 [P] [US4] Create PATCH `/api/leads/[id]/status` route in `src/app/api/leads/[id]/status/route.ts` (update lead status with state machine validation)
- [ ] T076 [P] [US4] Create GET `/api/leads/[id]/audit` route in `src/app/api/leads/[id]/audit/route.ts` (fetch audit trail)
- [ ] T077 [P] [US4] Create lead status timeline component in `src/components/leads/LeadTimeline.tsx` (visual timeline with timestamps)
- [ ] T078 [US4] Add status timeline to homeowner lead detail page `src/app/(dashboard)/homeowner/leads/[id]/page.tsx`
- [ ] T079 [US4] Add status timeline to installer purchased lead detail page
- [ ] T080 [US4] Add status timeline to admin lead detail page
- [ ] T081 [US4] Implement real-time status update push via Pusher in status route (broadcast to all relevant users)
- [ ] T082 [US4] Add Pusher listener in lead detail pages (auto-refresh on status change event)
- [ ] T083 [US4] Create status change dropdown UI in installer/admin lead detail pages (select new status, validate transition)
- [ ] T084 [US4] Send notifications on status change (homeowner, installer, admin)
- [ ] T085 [US4] Add audit log display in admin lead detail page (table with all actions, timestamps, users)

**Checkpoint**: Status tracking and audit trail fully functional. All users see real-time updates and notifications.

### Phase 6 (User Story 4) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 4 section completely
- [ ] Review lead-state.ts state machine transitions
- [ ] Review audit-logger.ts functions: `grep "^export" src/lib/services/audit-logger.ts`
- [ ] Review pusher.ts real-time patterns
- [ ] Check existing lead detail pages (homeowner/installer/admin)
- [ ] Verify AuditLog model fields in Prisma schema
- [ ] List all files to create/modify for this phase

**During Implementation:**
- [ ] After T075-T077 (API + Component): Run `npx tsc --noEmit`
- [ ] After T078-T085 (Integration): Run `npm run build`

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T075-T085 tasks completed
- [ ] Service Integrations Verified:
  - [ ] Status route uses validateTransition() from lead-state.ts
  - [ ] Status route calls createAuditLog() correctly
  - [ ] Pusher trigger uses correct channel names
  - [ ] createNotification called on status changes
- [ ] API Testing:
  - [ ] PATCH /api/leads/[id]/status (validates transitions)
  - [ ] GET /api/leads/[id]/audit (returns audit trail)
  - [ ] Invalid transitions rejected (e.g., DRAFT → COMPLETED)
- [ ] UI Testing:
  - [ ] Timeline component displays status history
  - [ ] Status dropdown shows valid transitions only
  - [ ] Real-time updates appear without refresh
  - [ ] Audit log table displays in admin view
- [ ] Business Logic:
  - [ ] State machine prevents invalid transitions
  - [ ] All status changes logged to audit trail
  - [ ] Notifications sent to relevant parties
  - [ ] Real-time updates via Pusher working
  - [ ] Role-based status change permissions enforced
- [ ] Pusher Integration:
  - [ ] Channel subscriptions working
  - [ ] Events broadcast correctly
  - [ ] No duplicate updates
  - [ ] Fallback if Pusher unavailable
- [ ] No Regression: Phase 1-5 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Verified lead-state.ts validateTransition signature
- ✅ Checked pusher.ts trigger function exports
- ✅ Confirmed AuditLog model structure
- ✅ Reviewed existing audit-logger.ts usage patterns

---

## Phase 7: User Story 5 - Admin Manages Lead Lifecycle and Resale (Priority: P3) (Persona: Admin)

**Goal**: Admins can resell leads, reset timers, archive leads, and manage user accounts

**Independent Test**: Admin takes purchased lead → marks for resale → reset timer → lead reappears in marketplace. Archive lead → verify removed from feeds. Suspend user → verify access blocked.

### Implementation for User Story 5

- [ ] T086 [P] [US5] Create POST `/api/leads/[id]/resell` route in `src/app/api/leads/[id]/resell/route.ts` (reset purchase, mark available)
- [ ] T087 [P] [US5] Create POST `/api/leads/[id]/archive` route in `src/app/api/leads/[id]/archive/route.ts` (set archivedAt, remove from feeds)
- [ ] T088 [P] [US5] Create POST `/api/leads/[id]/reset-timer` route in `src/app/api/leads/[id]/reset-timer/route.ts` (update createdAt to now)
- [ ] T089 [P] [US5] Create admin user management page in `src/app/(dashboard)/admin/users/page.tsx` (list users with filters)
- [ ] T090 [P] [US5] Create POST `/api/admin/users/[id]/suspend` route in `src/app/api/admin/users/[id]/suspend/route.ts` (suspend user account)
- [ ] T091 [P] [US5] Create POST `/api/admin/users/[id]/verify` route in `src/app/api/admin/users/[id]/verify/route.ts` (manually verify user)
- [ ] T092 [US5] Add resale button to admin lead detail page (call resell endpoint)
- [ ] T093 [US5] Add archive button to admin lead detail page (call archive endpoint with confirmation)
- [ ] T094 [US5] Add timer reset button to admin lead detail page (call reset-timer endpoint)
- [ ] T095 [US5] Create user action buttons (suspend/verify) in admin user management page
- [ ] T096 [US5] Add archived leads filter in admin leads page (show/hide archived)
- [ ] T097 [US5] Implement admin exception flow for unverified installer lead access (assign lead to specific unverified installer)
- [ ] T098 [US5] Send notifications on account actions (suspend/verify)

**Checkpoint**: Advanced admin controls fully functional. Leads can be resold, archived, and users managed.

### Phase 7 (User Story 5) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 5 section completely
- [ ] Review Lead model fields: archivedAt, expiresAt, createdAt, purchaseStatus
- [ ] Review User model fields: isActive, installerVerified
- [ ] Check lead-service.ts for existing lead update patterns
- [ ] Review existing admin lead detail page structure
- [ ] List all files to create/modify for this phase
- [ ] Verify state machine allows status changes for resale

**During Implementation:**
- [ ] After T086-T091 (API routes): Run `npx tsc --noEmit`
- [ ] After T092-T098 (UI integration): Run `npm run build`

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T086-T098 tasks completed
- [ ] Service Integrations Verified:
  - [ ] Resale route resets purchaseStatus correctly
  - [ ] Archive route sets archivedAt without deleting
  - [ ] Suspend route updates User.isActive
  - [ ] All routes call createAuditLog
- [ ] API Testing:
  - [ ] POST /api/leads/[id]/resell (resets purchase, clears installer)
  - [ ] POST /api/leads/[id]/archive (sets archivedAt timestamp)
  - [ ] POST /api/leads/[id]/reset-timer (updates createdAt/expiresAt)
  - [ ] POST /api/admin/users/[id]/suspend (blocks user access)
  - [ ] POST /api/admin/users/[id]/verify (sets installerVerified)
- [ ] UI Testing:
  - [ ] Resale button appears in admin lead detail
  - [ ] Archive confirmation modal works
  - [ ] Timer reset updates expiry display
  - [ ] User management page lists users correctly
  - [ ] Suspend/verify actions update UI immediately
- [ ] Business Logic:
  - [ ] Resold leads reappear in marketplace
  - [ ] Archived leads hidden from all feeds
  - [ ] Timer reset extends lead availability
  - [ ] Suspended users cannot log in
  - [ ] Manual verification bypasses document upload
  - [ ] Admin exception allows unverified installer access
  - [ ] All actions logged to audit trail
  - [ ] Notifications sent on user account changes
- [ ] Data Integrity:
  - [ ] No data loss on resale (lead data preserved)
  - [ ] Archive reversible (archivedAt can be cleared)
  - [ ] Timer reset doesn't affect other timestamps
  - [ ] User suspension doesn't delete user data
- [ ] No Regression: Phase 1-6 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Verified Lead model has all required timestamp fields
- ✅ Checked User model isActive and verification fields
- ✅ Reviewed existing Prisma update patterns
- ✅ Confirmed no breaking changes to lead filtering logic

---

## Phase 8: User Story 6 - Internal Chat and Quote Exchange (Priority: P2) (Persona: Installer + Homeowner, Admin visibility)

**Goal**: Real-time chat between homeowner and installer after purchase, with admin monitoring. Quote submission with admin review for Written Quotes.

**Independent Test**: Installer purchases lead → sends chat message → homeowner receives real-time notification → replies → installer sees reply instantly. Admin views chat history in real-time. Submit Written Quote → admin approves → homeowner sees quote.

### Implementation for User Story 6

- [ ] T099 [P] [US6] Create GET `/api/chat/[leadId]/messages` route in `src/app/api/chat/[leadId]/messages/route.ts` (fetch chat history per chat.openapi.yaml)
- [ ] T100 [P] [US6] Create POST `/api/chat/[leadId]/messages` route in same file (send message, persist, broadcast via Pusher)
- [ ] T101 [P] [US6] Create POST `/api/quotes` route in `src/app/api/quotes/route.ts` (submit quote per quotes.openapi.yaml)
- [ ] T102 [P] [US6] Create GET `/api/quotes/[id]` route in `src/app/api/quotes/[id]/route.ts` (get quote details)
- [ ] T103 [P] [US6] Create POST `/api/quotes/[id]/approve` route in `src/app/api/quotes/[id]/approve/route.ts` (admin/homeowner approve quote)
- [ ] T104 [P] [US6] Create POST `/api/quotes/[id]/reject` route in `src/app/api/quotes/[id]/reject/route.ts` (reject quote)
- [ ] T105 [US6] Create chat message component in `src/components/chat/ChatMessage.tsx` (message bubble with sender, timestamp)
- [ ] T106 [US6] Create chat window component in `src/components/chat/ChatWindow.tsx` (message list + input, Pusher real-time updates)
- [ ] T107 [US6] Add chat window to installer lead detail page (visible after purchase)
- [ ] T108 [US6] Add chat window to homeowner lead detail page (visible after purchase)
- [ ] T109 [US6] Add chat monitoring view to admin lead detail page (read-only chat history with real-time updates)
- [ ] T110 [US6] Implement Pusher channel subscription in chat window (subscribe to `lead-{id}-chat` channel)
- [ ] T111 [US6] Implement message persistence in POST messages route (save to database before broadcasting)
- [ ] T112 [US6] Create quote submission form in installer lead detail page (price, description, attachments via S3)
- [ ] T113 [US6] Create quote display component in `src/components/quotes/QuoteCard.tsx` (show quote details, approve/reject buttons)
- [ ] T114 [US6] Add quote approval workflow for Written Quotes (admin review before homeowner visibility)
- [ ] T115 [US6] Add quote display for Call/Visit quotes (immediate homeowner visibility)
- [ ] T116 [US6] Add admin quote review queue in `src/app/(dashboard)/admin/quotes/page.tsx` (list pending written quotes)
- [ ] T117 [US6] Implement file upload to S3 for quote attachments (use presigned URLs)
- [ ] T118 [US6] Send real-time notifications on chat messages (Pusher + email)
- [ ] T119 [US6] Send notifications on quote submission/approval/rejection

**Checkpoint**: Real-time chat and quote exchange fully functional. Admin can monitor chats. Written Quote approval workflow complete.

### Phase 8 (User Story 6) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 6 section completely
- [ ] Read contracts/chat.openapi.yaml and contracts/quotes.openapi.yaml
- [ ] Review ChatMessage and Quote models in Prisma schema
- [ ] Review pusher.ts for chat channel patterns
- [ ] Review s3.ts for file upload presigned URLs
- [ ] Check existing installer/homeowner lead detail pages
- [ ] List all files to create/modify for this phase
- [ ] Verify QuoteType enum and approval workflow requirements

**During Implementation:**
- [ ] After T099-T104 (API routes): Run `npx tsc --noEmit`
- [ ] After T105-T111 (Chat components): Run `npm run build`
- [ ] After T112-T119 (Quote workflow): Run `npm run build` - final

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T099-T119 tasks completed
- [ ] Service Integrations Verified:
  - [ ] Chat routes use Prisma ChatMessage model correctly
  - [ ] Quote routes use Prisma Quote model correctly
  - [ ] Pusher trigger for chat uses correct channel format
  - [ ] S3 upload for attachments uses presigned URLs
  - [ ] createNotification called on messages and quotes
- [ ] API Testing:
  - [ ] GET /api/chat/[leadId]/messages (returns chat history)
  - [ ] POST /api/chat/[leadId]/messages (saves + broadcasts)
  - [ ] POST /api/quotes (creates quote, triggers approval if Written)
  - [ ] GET /api/quotes/[id] (returns quote with access control)
  - [ ] POST /api/quotes/[id]/approve (approves, notifies)
  - [ ] POST /api/quotes/[id]/reject (rejects, notifies)
- [ ] UI Testing:
  - [ ] Chat window displays messages correctly
  - [ ] Message input sends and displays immediately
  - [ ] Real-time updates appear for both parties
  - [ ] Admin sees read-only chat history
  - [ ] Quote submission form works
  - [ ] Quote card displays with approve/reject buttons
  - [ ] File attachments upload successfully
- [ ] Business Logic:
  - [ ] Chat only accessible after lead purchased
  - [ ] Messages persist to database before Pusher broadcast
  - [ ] Written Quotes require admin approval before homeowner sees
  - [ ] Call/Visit quotes immediately visible to homeowner
  - [ ] Quote attachments stored in S3 with secure URLs
  - [ ] Admin can approve/reject Written Quotes
  - [ ] Notifications sent on new messages
  - [ ] Notifications sent on quote submission/approval/rejection
- [ ] Pusher Integration:
  - [ ] Chat channel `lead-{id}-chat` working
  - [ ] Messages broadcast in real-time
  - [ ] No duplicate messages
  - [ ] Fallback if Pusher unavailable
- [ ] S3 Integration:
  - [ ] Quote attachments uploaded successfully
  - [ ] Presigned URLs generated correctly
  - [ ] File download access controlled
- [ ] Data Integrity:
  - [ ] No message loss
  - [ ] Message order preserved
  - [ ] Quote versions tracked if edited
- [ ] No Regression: Phase 1-7 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Verified ChatMessage and Quote model structures
- ✅ Checked pusher.ts chat trigger patterns
- ✅ Confirmed s3.ts presigned URL functions
- ✅ Reviewed QuoteType enum values in schema

---

## Phase 9: User Story 7 - Installer Feedback and Lead Quality Rating (Priority: P3) (Persona: Installer)

**Goal**: Installers can rate and comment on lead quality, visible to admins

**Independent Test**: Installer purchases lead → rates it (1-5 stars) → adds comment → admin views feedback in lead detail and aggregate view.

### Implementation for User Story 7

- [ ] T120 [P] [US7] Create POST `/api/leads/[id]/feedback` route in `src/app/api/leads/[id]/feedback/route.ts` (submit installer feedback)
- [ ] T121 [P] [US7] Create GET `/api/leads/[id]/feedback` route in same file (fetch feedback for lead)
- [ ] T122 [P] [US7] Create lead rating component in `src/components/feedback/LeadRating.tsx` (star rating + comment input)
- [ ] T123 [US7] Add rating UI to installer lead detail page (visible after purchase, one-time submission)
- [ ] T124 [US7] Create feedback display in admin lead detail page (show rating, comment, timestamp)
- [ ] T125 [US7] Create lead quality dashboard in `src/app/(dashboard)/admin/lead-quality/page.tsx` (aggregate ratings, filter by rating)
- [ ] T126 [US7] Add feedback summary to admin leads list (average rating per lead)
- [ ] T127 [US7] Send notification to admin on low-quality lead feedback (e.g., rating < 3 stars)

**Checkpoint**: Lead quality feedback system complete. Admins can identify and address poor quality leads.

### Phase 9 (User Story 7) Validation Checklist:
**Pre-Phase (30-60 min):**
- [ ] Read spec.md User Story 7 section completely
- [ ] Review LeadFeedback model in Prisma schema
- [ ] Check existing installer lead detail page structure
- [ ] Review admin dashboard patterns for aggregate views
- [ ] List all files to create/modify for this phase
- [ ] Verify rating scale (1-5 stars) and comment requirements

**During Implementation:**
- [ ] After T120-T122 (API + Component): Run `npx tsc --noEmit`
- [ ] After T123-T127 (Integration): Run `npm run build`

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, warnings OK)
- [ ] All T120-T127 tasks completed
- [ ] Service Integrations Verified:
  - [ ] Feedback routes use LeadFeedback model correctly
  - [ ] createNotification called for low ratings
  - [ ] createAuditLog called for feedback submissions
- [ ] API Testing:
  - [ ] POST /api/leads/[id]/feedback (creates feedback)
  - [ ] GET /api/leads/[id]/feedback (returns feedback)
  - [ ] One feedback per installer per lead enforced
  - [ ] Rating validation (1-5 range)
- [ ] UI Testing:
  - [ ] Rating component displays stars correctly
  - [ ] Comment input works
  - [ ] Feedback displays in admin lead detail
  - [ ] Quality dashboard shows aggregates
  - [ ] Low-rating alerts appear for admin
- [ ] Business Logic:
  - [ ] Feedback only submittable after purchase
  - [ ] One-time submission per installer per lead
  - [ ] Rating range validated (1-5 stars)
  - [ ] Comment optional but recommended
  - [ ] Admin sees all feedback in lead detail
  - [ ] Aggregate ratings calculated correctly
  - [ ] Low-rating notification sent (< 3 stars)
  - [ ] Feedback influences future lead quality
- [ ] Data Integrity:
  - [ ] Feedback immutable after submission
  - [ ] Timestamps preserved
  - [ ] Average ratings accurate
- [ ] No Regression: Phase 1-8 functionality still working
- [ ] User approval received for commit
- [ ] Git commit with detailed message

**Build Error Prevention Applied:**
- ✅ Verified LeadFeedback model structure
- ✅ Checked rating field type (Int)
- ✅ Confirmed unique constraint on installerId + leadId
- ✅ Reviewed notification-service.ts for alert patterns

---


## Phase 10: Polish & Cross-Cutting Concerns (Persona: Cross-cutting)

**Purpose**: Improvements that affect multiple user stories

- [ ] T128 [P] [Polish] Add loading states to all forms and buttons (skeleton loaders, spinners)
- [ ] T129 [P] [Polish] Add error boundary components for graceful error handling (`src/components/ErrorBoundary.tsx`)
- [ ] T130 [P] [Polish] Add toast notifications for all user actions (success, error messages using react-hot-toast)
- [ ] T131 [P] [Polish] Optimize database queries with Prisma select statements (reduce payload size)
- [ ] T132 [P] [Polish] Add API response caching for frequently accessed data (React Query or SWR)
- [ ] T133 [P] [Polish] Add pagination to all list endpoints (leads, notifications, audit logs)
- [ ] T134 [P] [Polish] Add mobile-responsive design improvements for all dashboard pages
- [ ] T135 [P] [Polish] Add dark mode support for new components (follow existing ThemeProvider)
- [ ] T136 [P] [Polish] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T137 [P] [Polish] Create comprehensive API documentation in `DOC/API-DOCUMENTATION.md` (all endpoints, examples)
- [ ] T138 [P] [Polish] Update quickstart.md with actual test results (validate all 4 test scenarios)
- [ ] T139 [P] [Polish] Add rate limiting to all API routes (prevent abuse)
- [ ] T140 [P] [Polish] Add input validation middleware for all routes (Zod schemas)
- [ ] T141 [P] [Polish] Security audit: Check for SQL injection, XSS, CSRF vulnerabilities
- [ ] T142 [P] [Polish] Performance audit: Check all API routes < 200ms response time
- [ ] T143 [Polish] Code cleanup: Remove console.logs, format code, fix linting errors
- [ ] T144 [Polish] Run quickstart.md validation (complete all 4 test scenarios)
- [ ] T145 [Polish] Create feature demo video or screenshots for DOC/Records/
- [ ] T146 [Polish] Update constitution.md with any new patterns established (if needed)

### Phase 10 (Polish) Validation Checklist:
**Pre-Phase (60-90 min):**
- [ ] Full application review across all phases
- [ ] Identify common patterns to standardize
- [ ] Review all TODO/FIXME comments in codebase
- [ ] Check all console.log statements for removal
- [ ] Review error handling consistency
- [ ] List all API routes for rate limiting audit
- [ ] Identify components needing loading states
- [ ] Check mobile responsiveness gaps

**During Implementation:**
- [ ] After T128-T133 (UX improvements): Run `npm run build`
- [ ] After T134-T136 (Responsive/A11y): Test on mobile devices
- [ ] After T137-T142 (Security/Performance): Run audits
- [ ] After T143-T146 (Cleanup): Final `npm run build`

**Post-Phase Validation:**
- [ ] Schema Validation: `npx prisma validate`
- [ ] TypeScript: `npx tsc --noEmit` (0 errors)
- [ ] Build: `npm run build` (0 errors, 0 warnings)
- [ ] Lint: `npm run lint` (0 errors, warnings OK)
- [ ] All T128-T146 tasks completed

**UX & Accessibility:**
- [ ] All forms have loading states
- [ ] Error boundaries catch and display errors gracefully
- [ ] Toast notifications appear for all user actions
- [ ] Mobile responsiveness tested (375px, 768px, 1024px)
- [ ] Dark mode works on all new components
- [ ] Keyboard navigation functional
- [ ] ARIA labels added to interactive elements
- [ ] Screen reader compatible

**Performance:**
- [ ] All API routes respond < 200ms (test with network throttling)
- [ ] Database queries optimized (only select needed fields)
- [ ] API caching implemented for static/frequent data
- [ ] Pagination working on all list endpoints (max 50 items)
- [ ] Images optimized and lazy-loaded
- [ ] Bundle size acceptable (<500KB main bundle)

**Security:**
- [ ] SQL injection tests passed (parameterized queries)
- [ ] XSS protection enabled (input sanitization)
- [ ] CSRF tokens on all POST/PATCH/DELETE routes
- [ ] Rate limiting on all API routes (max 100 req/min per IP)
- [ ] Input validation with Zod schemas
- [ ] No sensitive data in logs or error messages
- [ ] Authentication checks on all protected routes

**Code Quality:**
- [ ] No console.log in production code
- [ ] All files formatted consistently
- [ ] No unused imports or variables
- [ ] All ESLint errors fixed
- [ ] TypeScript strict mode enabled
- [ ] No `any` types without justification
- [ ] Error handling consistent across codebase

**Testing:**
- [ ] Quickstart.md Test 1: Guest lead submission → signup → OTP → success
- [ ] Quickstart.md Test 2: Admin approval → marketplace → purchase → chat
- [ ] Quickstart.md Test 3: Status updates → real-time → notifications
- [ ] Quickstart.md Test 4: Feedback → quality dashboard → low-rating alert
- [ ] All user stories testable independently

**Documentation:**
- [ ] API-DOCUMENTATION.md complete with all endpoints
- [ ] All endpoints have request/response examples
- [ ] Error codes documented
- [ ] Rate limits documented
- [ ] Authentication requirements documented
- [ ] Feature demo created (video or screenshots)
- [ ] Constitution.md updated with new patterns (if any)

**Final Checks:**
- [ ] Dev server starts without errors: `npm run dev`
- [ ] Production build successful: `npm run build`
- [ ] No regression in any phase 1-9 functionality
- [ ] All environment variables documented in .env.example
- [ ] Database migrations all applied successfully
- [ ] User approval received for commit
- [ ] Git commit with comprehensive phase summary

**Build Error Prevention Applied:**
- ✅ Incremental validation after every polish task group
- ✅ Mobile and accessibility testing continuous
- ✅ Performance monitoring throughout
- ✅ Security audit checklists followed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - **Phase 3 – User Story 1 (P1)**: Can start after Foundational
  - **Phase 4.5 – Remediation (CRITICAL)**: Must complete before Phase 5; enhances Lead model with `quoteData`
  - **Phase 4 – User Story 2 (P1)**: Can run after Foundational; no hard dependency on 4.5, but 4.5 improves admin context
  - **Phase 4.8 – Homeowner Dashboard & Re-Requests (P1/P2)**: Depends on Phase 3 (leads + OTP) and benefits from 4.5 (quoteData). Optional for MVP but recommended
  - **Phase 5 – User Story 3 (P1)**: Can start after Foundational; logically follows US1+US2 for transaction loop
  - **Phase 6 – User Story 4 (P2)**: Depends on US1, US2, US3 (requires created, approved, purchased leads)
  - **Phase 7 – User Story 5 (P3)**: Depends on US3 (requires purchased leads for resale)
  - **Phase 8 – User Story 6 (P2)**: Depends on US3 (requires purchased leads for chat/quotes)
  - **Phase 9 – User Story 7 (P3)**: Depends on US3 (requires purchased leads for feedback)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### Recommended MVP Scope (Immediate Business Value)

Minimum to transact and learn:
- Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) + Phase 5 (US3)

Strongly recommended near-MVP add-ons:
- Phase 4.5 (quoteData remediation) so admins/installers see full context
- Phase 4.8 (homeowner dashboard + re-requests) to drive repeat submissions within limits

Later phases (6-9) add transparency, lifecycle, and quality control.

### Parallel Opportunities

- **Setup Phase**: All tasks T001-T012 marked [P] can run in parallel
- **Foundational Phase**: Tasks T017-T024 marked [P] can run in parallel (after schema is created)
- **User Story 1**: Tasks T028-T034, T037, T039 marked [P] can run in parallel (different files)
- **Phase 4.5**: T147-T151 (schema/service) should be done together, then T154-T155 (UI) in parallel
- **User Story 2**: Tasks T044-T048 marked [P] can run in parallel (different files)
- **Phase 4.8**: Split by layers → schema/auth (T161-T163), services/APIs (T164-T169), UI (T170-T176), admin (T177-T179)
- **User Story 3**: Tasks T060-T063 marked [P] can run in parallel (different files)
- **User Story 4**: Tasks T075-T077 marked [P] can run in parallel (different files)
- **User Story 5**: Tasks T086-T091 marked [P] can run in parallel (different files)
- **User Story 6**: Tasks T099-T104 marked [P] can run in parallel (different files)
- **User Story 7**: Tasks T120-T122 marked [P] can run in parallel (different files)
- **Polish Phase**: Most tasks marked [P] can run in parallel (independent improvements)

### Within Each User Story

1. API routes and services can be built in parallel (marked [P])
2. UI components follow after API routes are complete
3. Integration work comes last within each story
4. Each story should be independently testable before moving to next priority

---

## Parallel Example: User Story 1 (Lead Submission)

```bash
# Can run simultaneously (different files):
- T028: Create POST /api/leads route
- T029: Create GET /api/leads route  
- T030: Create GET /api/leads/[id] route
- T031: Create lead-service.ts
- T032: Create POST /api/verification/send-otp route
- T033: Create POST /api/verification/verify-otp route
- T034: Create phone-verification-service.ts
- T037: Create OTPVerificationModal.tsx
- T039: Create VerifiedBadge.tsx

# Must run sequentially (integration):
- T035: Update QuoteOptionsModal.tsx (needs T028 complete)
- T036: Update HomeownerSignupModal.tsx (needs T028 complete)
- T038: Add submission count tracking (needs T028, T034 complete)
```

---

## Implementation Strategy

### MVP-First Approach (Recommended)

1. **Week 1**: Complete Setup + Foundational (T001-T027)
2. **Week 2**: User Story 1 - Lead Submission (T028-T043)
3. **Week 3**: User Story 2 - Admin Approval (T044-T059)
4. **Week 4**: User Story 3 - Installer Purchase (T060-T074)
5. **Week 5**: Polish Phase (critical items T128-T144)

**Result**: MVP launch with complete revenue cycle in 5 weeks

### Incremental Delivery

After MVP launch, add remaining user stories incrementally:
- **Week 6**: User Story 4 - Status Tracking (T075-T085)
- **Week 7**: User Story 6 - Chat & Quotes (T099-T119)
- **Week 8**: User Story 5 - Admin Lifecycle (T086-T098)
- **Week 9**: User Story 7 - Feedback (T120-T127)
- **Week 10**: Final Polish (T145-T146)

### Team Parallelization

If multiple developers available:
- **Dev 1**: User Stories 1 + 4 (homeowner-focused)
- **Dev 2**: User Stories 2 + 5 (admin-focused)
- **Dev 3**: User Stories 3 + 7 (installer-focused)
- **Dev 4**: User Story 6 (chat/quotes - complex real-time)

All can work in parallel after Foundational phase completes.

---

## Task Summary

- **Total Tasks**: 146
- **Setup**: 12 tasks
- **Foundational**: 15 tasks (BLOCKING)
- **User Story 1 (P1)**: 16 tasks (MVP)
- **User Story 2 (P1)**: 16 tasks (MVP)
- **User Story 3 (P1)**: 15 tasks (MVP)
- **User Story 4 (P2)**: 11 tasks
- **User Story 5 (P3)**: 13 tasks
- **User Story 6 (P2)**: 21 tasks
- **User Story 7 (P3)**: 8 tasks
- **Polish**: 19 tasks
- **Parallel Opportunities**: 68 tasks marked [P] (46% can run in parallel)
- **MVP Scope**: 59 tasks (Setup + Foundational + US1-3 + critical Polish)

---

**Ready to implement!** Each task is specific enough for immediate execution. Follow the phase order, leverage parallel opportunities, and use the quickstart.md for testing guidance.
