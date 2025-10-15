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

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment configuration

- [ ] T001 [P] [Setup] Add Twilio Verify API dependencies to `package.json` (@twilio/twilio-verify)
- [ ] T002 [P] [Setup] Add Pusher real-time dependencies to `package.json` (pusher, pusher-js)
- [ ] T003 [P] [Setup] Add Stripe payment dependencies to `package.json` (@stripe/stripe-js, stripe)
- [ ] T004 [P] [Setup] Add SendGrid email dependencies to `package.json` (@sendgrid/mail)
- [ ] T005 [P] [Setup] Add AWS S3 client dependencies to `package.json` (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)
- [ ] T006 [P] [Setup] Configure environment variables in `.env` (Twilio, Pusher, Stripe, SendGrid, AWS credentials)
- [ ] T007 [P] [Setup] Create Pusher client singleton in `src/lib/pusher.ts` (server-side)
- [ ] T008 [P] [Setup] Create Pusher client hook in `src/lib/hooks/usePusher.ts` (client-side)
- [ ] T009 [P] [Setup] Create Stripe client singleton in `src/lib/stripe.ts` (server-side)
- [ ] T010 [P] [Setup] Create SendGrid client singleton in `src/lib/sendgrid.ts`
- [ ] T011 [P] [Setup] Create Twilio Verify client singleton in `src/lib/twilio.ts`
- [ ] T012 [P] [Setup] Create S3 client singleton in `src/lib/s3.ts` with presigned URL helpers

**Checkpoint**: External service clients configured and ready for use

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 [Foundation] Add all new Prisma models to `prisma/schema.prisma` (Lead, PhoneVerification, InstallDocument, ChatMessage, Quote, LeadFeedback, AuditLog, Notification, Settings)
- [ ] T014 [Foundation] Add all new enums to `prisma/schema.prisma` (QuoteType, LeadStatus, Visibility, PurchaseStatus, NotificationType, etc.)
- [ ] T015 [Foundation] Run Prisma migration `npx prisma migrate dev --name lead-journey-init`
- [ ] T016 [Foundation] Generate Prisma Client `npx prisma generate`
- [ ] T017 [P] [Foundation] Create TypeScript types in `src/types/lead.ts` (extends Prisma types with computed fields)
- [ ] T018 [P] [Foundation] Create TypeScript types in `src/types/chat.ts`
- [ ] T019 [P] [Foundation] Create TypeScript types in `src/types/quote.ts`
- [ ] T020 [P] [Foundation] Create TypeScript types in `src/types/notification.ts`
- [ ] T021 [P] [Foundation] Create lead state machine in `src/lib/state-machines/lead-state.ts` (validates status transitions)
- [ ] T022 [P] [Foundation] Create audit logger service in `src/lib/services/audit-logger.ts` (writes to AuditLog table)
- [ ] T023 [P] [Foundation] Create notification service in `src/lib/services/notification-service.ts` (Pusher + SendGrid integration)
- [ ] T024 [P] [Foundation] Create global Settings service in `src/lib/services/settings-service.ts` (manages approval mode, pricing)
- [ ] T025 [Foundation] Extend NextAuth User type in `src/types/next-auth.d.ts` (add phoneVerified, leadSubmissionCount, installerVerified)
- [ ] T026 [Foundation] Update `src/lib/auth.ts` JWT callbacks to include new user fields (phoneVerified, leadSubmissionCount, installerVerified)
- [ ] T027 [Foundation] Seed Settings table with default values in `prisma/seed-settings.ts` (approval mode, default pricing)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Homeowner Submits Lead Request (Priority: P1) 🎯 MVP

**Goal**: Enable homeowners to submit quote requests via existing UI flow, with OTP verification for subsequent submissions

**Independent Test**: Guest completes instant quote → selects quote type → sees signup modal → creates account → auto-login → submit → success. Logged-in user skips signup. 2nd submission requires OTP verification.

### Implementation for User Story 1

- [ ] T028 [P] [US1] Create POST `/api/leads` route in `src/app/api/leads/route.ts` (create lead endpoint per leads.openapi.yaml)
- [ ] T029 [P] [US1] Create GET `/api/leads` route in same file (list leads with role-based filtering)
- [ ] T030 [P] [US1] Create GET `/api/leads/[id]/route.ts` (get single lead details)
- [ ] T031 [P] [US1] Create lead creation service in `src/lib/services/lead-service.ts` (validation, creation, audit logging)
- [ ] T032 [P] [US1] Create POST `/api/verification/send-otp` route in `src/app/api/verification/send-otp/route.ts` (Twilio integration per verification.openapi.yaml)
- [ ] T033 [P] [US1] Create POST `/api/verification/verify-otp` route in `src/app/api/verification/verify-otp/route.ts` (verify OTP and update user)
- [ ] T034 [P] [US1] Create phone verification service in `src/lib/services/phone-verification-service.ts` (rate limiting, OTP validation)
- [ ] T035 [US1] Update existing `QuoteOptionsModal.tsx` to call POST `/api/leads` when quote type selected (integrate with existing flow)
- [ ] T036 [US1] Update existing `HomeownerSignupModal.tsx` to auto-submit lead after successful signup (context="quote" flow)
- [ ] T037 [US1] Create OTP verification modal component in `src/components/modals/OTPVerificationModal.tsx` (shown on 2nd submission)
- [ ] T038 [US1] Add lead submission count tracking in POST `/api/leads` (check count, enforce 5 limit, prompt OTP if needed)
- [ ] T039 [US1] Add "Verified Homeowner" badge display in `src/components/badges/VerifiedBadge.tsx`
- [ ] T040 [US1] Create success modal logic to show badge after first verification in `QuoteSuccessModal.tsx`
- [ ] T041 [US1] Add validation for E.164 phone format in phone verification routes (per contract spec)
- [ ] T042 [US1] Implement rate limiting (3 OTP requests per hour) in send-otp route using in-memory cache or Redis
- [ ] T043 [US1] Send notification to admin on new lead creation (call notification service from lead creation)

**Checkpoint**: At this point, homeowners can submit leads (guest + logged-in flows), verify phone, and see verification badge. Leads appear in admin dashboard.

---

## Phase 4: User Story 2 - Admin Reviews and Approves Leads (Priority: P1) 🎯 MVP

**Goal**: Admin can switch between Auto-Approval Mode and Manual Review Mode, configure automation rules, and manually approve/reject/price/assign leads

**Independent Test**: Switch to Manual Mode → new lead appears in "New" → admin approves, sets price, assigns → lead appears in installer feed. Switch to Auto Mode → configure rules → new lead auto-approved without admin action.

### Implementation for User Story 2

- [ ] T044 [P] [US2] Create POST `/api/leads/[id]/approve` route in `src/app/api/leads/[id]/approve/route.ts` (admin approve lead)
- [ ] T045 [P] [US2] Create POST `/api/leads/[id]/reject` route in `src/app/api/leads/[id]/reject/route.ts` (admin reject lead)
- [ ] T046 [P] [US2] Create admin dashboard lead list page in `src/app/(dashboard)/admin/leads/page.tsx` (table with filtering by status, verification, postcode)
- [ ] T047 [P] [US2] Create admin lead detail page in `src/app/(dashboard)/admin/leads/[id]/page.tsx` (view full lead, set price, assign, approve/reject)
- [ ] T048 [P] [US2] Create admin settings page in `src/app/(dashboard)/admin/settings/page.tsx` (switch modes, configure automation rules, set global pricing)
- [ ] T049 [P] [US2] Create Settings API routes in `src/app/api/settings/route.ts` (GET/PATCH settings per spec)
- [ ] T050 [US2] Implement automation rules engine in `src/lib/services/automation-engine.ts` (evaluates rules, auto-approves matching leads)
- [ ] T051 [US2] Create automation rules UI in admin settings page (add/edit/delete rules for quote type, verification, postcode)
- [ ] T052 [US2] Add mode-switching logic in Settings service (update database, validate mode change)
- [ ] T053 [US2] Add lead auto-approval trigger in POST `/api/leads` route (call automation engine if Auto Mode enabled)
- [ ] T054 [US2] Create global pricing configuration UI in admin settings (Call/Visit default, Written Quote default)
- [ ] T055 [US2] Create lead assignment UI in admin lead detail page (select installers by filter or "All Installers")
- [ ] T056 [US2] Add "hot" lead toggle in admin lead detail page (mark lead as priority)
- [ ] T057 [US2] Add lead status change tracking in approve/reject routes (log to audit trail, update status via state machine)
- [ ] T058 [US2] Send notifications on lead approval/rejection (homeowner, assigned installers)
- [ ] T059 [US2] Add middleware check in admin routes to enforce ADMIN role (prevent non-admins from accessing)

**Checkpoint**: Admins can switch modes, configure automation, manually approve/reject/price/assign leads. Auto-approved leads appear instantly in installer feeds.

---

## Phase 5: User Story 3 - Installer Discovers and Purchases Lead (Priority: P1) 🎯 MVP

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

---

## Phase 6: User Story 4 - Lead Status Tracking and Updates (Priority: P2)

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

---

## Phase 7: User Story 5 - Admin Manages Lead Lifecycle and Resale (Priority: P3)

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

---

## Phase 8: User Story 6 - Internal Chat and Quote Exchange (Priority: P2)

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

---

## Phase 9: User Story 7 - Installer Feedback and Lead Quality Rating (Priority: P3)

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

---

## Phase 10: Polish & Cross-Cutting Concerns

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

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
  - **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
  - **User Story 3 (P1)**: Can start after Foundational - No dependencies on other stories (but logically follows US1+US2 for MVP flow)
  - **User Story 4 (P2)**: Depends on US1, US2, US3 (requires leads to be created, approved, purchased)
  - **User Story 5 (P3)**: Depends on US3 (requires purchased leads for resale)
  - **User Story 6 (P2)**: Depends on US3 (requires purchased leads for chat/quotes)
  - **User Story 7 (P3)**: Depends on US3 (requires purchased leads for feedback)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### Recommended MVP Scope (Immediate Business Value)

**Phase 1 + Phase 2 + User Stories 1-3 (P1)** = Complete transaction loop:
1. Homeowner submits lead (US1)
2. Admin approves/prices/assigns (US2)
3. Installer purchases lead (US3)

This delivers core revenue generation. Additional user stories (US4-US7) add transparency, lifecycle management, and quality control but are not strictly required for MVP launch.

### Parallel Opportunities

- **Setup Phase**: All tasks T001-T012 marked [P] can run in parallel
- **Foundational Phase**: Tasks T017-T024 marked [P] can run in parallel (after schema is created)
- **User Story 1**: Tasks T028-T034, T037, T039 marked [P] can run in parallel (different files)
- **User Story 2**: Tasks T044-T048 marked [P] can run in parallel (different files)
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
