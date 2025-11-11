---
description: "Tasks for Auth Part A + B — NextAuth-only modernization"
---

# Tasks: Auth Part A + B — NextAuth-only modernization

Input: Design documents from `specs/007-part-a-update/`
Prerequisites: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

Tests: OPTIONAL. This plan does not assume TDD; add tests if requested.

Organization: Tasks are grouped by user story to enable independent implementation and testing.

## Format: [ID] [P?] [Story] Description
- [P]: Can run in parallel (different files, no dependencies)
- [Story]: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

Purpose: Confirm providers, libraries, and env before implementation

- [X] T001 [P] Confirm email provider and configure env placeholders (.env.example): RESEND_API_KEY or SENDGRID_API_KEY; FROM_EMAIL
- [X] T002 [P] Decide validation lib (zod) and add dependency if approved (package.json)
- [X] T003 [P] Prepare rate limiting store decision (Upstash Redis vs. in-memory dev); add placeholder config in `src/lib/rateLimiter.ts` (no prod keys yet)
- [X] T004 Create mailer abstraction `src/lib/mailer.ts` with provider-agnostic interface (sendVerificationEmail, sendPasswordResetEmail)
- [X] T005 Extend NextAuth types file `src/types/next-auth.d.ts` for sessionVersion, role, profileComplete if missing

Checkpoint: Providers chosen; basic libs and env scaffolds ready

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Prisma schema migration per `data-model.md` (User fields, InstallerProfile, EmailVerificationToken, PasswordResetToken) — `prisma/schema.prisma`
- [X] T007 [P] Generate Prisma client and verify compile — `npx prisma generate`
- [X] T008 [P] Add token utility `src/lib/tokens.ts` (generateRandomToken, hashSHA256, ttl constants)
- [X] T009 [P] Implement rate limit helper `src/lib/rateLimiter.ts` (dev in-memory; interface ready for Redis)
- [X] T010 Add NextAuth JWT callback to include sessionVersion and invalidate on mismatch — `src/lib/auth.ts`
- [X] T011 Logging hygiene util `src/lib/auth-logging.ts` (logAuthEvent with sanitized meta; console in dev)

Checkpoint: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Credential sign-up/sign-in via simplified modals (Priority: P1) 🎯 MVP

Goal: Users (Homeowner, Installer, Admin) authenticate via simplified modals; role-based redirects preserved

Independent Test: Trigger each modal; sign up/sign in; verify correct dashboard redirect and session role

Implementation for User Story 1

- [ ] T012 [US1] Audit existing auth modals for compliance with design tokens & a11y
      Files: `src/components/HomeownerSignupModal.tsx`, `src/components/HomeownerSignInModal.tsx`,
      `src/components/InstallerSignupModal.tsx`, `src/components/InstallerSignInModal.tsx`,
      `src/components/AdminSignInModal.tsx`, `src/components/auth/AuthModal.tsx`
- [ ] T013 [P] [US1] Update shared base `AuthModal` for focus trap, aria-live, ESC handling, keyboard nav if any gaps
- [ ] T014 [P] [US1] Ensure OAuth button wiring exists in signup modals (Google/Apple UI already present); mark as UI-ready only
- [ ] T015 [US1] Verify role-based redirect logic post-auth remains intact (Homeowner → /homeowner, Installer → /installer, Admin → /admin)
- [ ] T016 [US1] Remove or archive obsolete modal variants (e.g., `HomeownerSignupModal.OLD.tsx`) after parity check

Checkpoint: User Story 1 fully functional with current credential modals; UI meets design system and a11y

---

## Phase 4: User Story 2 — Installer minimal signup + onboarding (Priority: P1)

Goal: After minimal signup, Installer completes onboarding (companyName, businessAddress, postcode); gating until complete/verified

Independent Test: New installer sees onboarding CTA; submits minimal fields; profileComplete true; gated areas show message until verified

Implementation for User Story 2

- [ ] T017 [US2] Create onboarding page UI (UI-only first) — `src/app/(dashboard)/installer/onboarding/page.tsx`
- [ ] T018 [P] [US2] Add onboarding CTA and gating message to restricted installer pages (ensure no logic changes beyond messaging)
- [ ] T019 [US2] Implement PATCH API `src/app/api/installer/profile/route.ts` per `contracts/installer-profile-update.yaml`
- [ ] T020 [US2] Wire UI submit to PATCH endpoint; set `User.profileComplete=true` when fields valid
- [ ] T021 [US2] Confirm middleware or page guards respect `profileComplete` and installer verification state; adjust messaging only

Checkpoint: Installer onboarding complete; marketplace/purchase gated until verified; clear UX provided

---

## Phase 5: User Story 3 — OAuth, email verification, password recovery (Priority: P2)

Goal: OAuth (Google/Apple), email verification (request + confirm), password reset (forgot + reset)

Independent Test: OAuth sign-in succeeds; verification email/token flow succeeds; password reset invalidates prior sessions

Implementation for User Story 3

- [ ] T022 [US3] Configure Google OAuth provider in NextAuth (env, provider entry) — `src/lib/auth.ts`
- [ ] T023 [P] [US3] Add Apple provider configuration (staged after Google) — `src/lib/auth.ts`
- [ ] T024 [US3] Implement POST `/api/auth/verify/request` — `src/app/api/auth/verify/request/route.ts` per contract
- [ ] T025 [P] [US3] Implement GET `/api/auth/verify/confirm` — `src/app/api/auth/verify/confirm/route.ts` per contract
- [ ] T026 [P] [US3] Implement POST `/api/auth/password/forgot` — `src/app/api/auth/password/forgot/route.ts`
- [ ] T027 [P] [US3] Implement POST `/api/auth/password/reset` — `src/app/api/auth/password/reset/route.ts`
- [ ] T028 [US3] Add email templates (verification, reset) — `src/emails/{verify,reset}.tsx` or `.html` using design tokens
- [ ] T029 [US3] Add NextAuth callback to link OAuth accounts by verified email; prevent duplicates — `src/lib/auth.ts`
- [ ] T030 [US3] Increment `sessionVersion` on password reset; ensure JWT mismatch invalidates prior sessions
- [ ] T031 [US3] Add rate limiter to verification & reset endpoints; friendly error on exceed

Checkpoint: OAuth, verification, and reset flows functional and secure

---

## Phase 6: Polish & Cross-Cutting Concerns

Purpose: Cross-story robustness and compliance

- [ ] T032 [P] Documentation updates (how to configure providers, env vars) — `specs/007-part-a-update/quickstart.md`
- [ ] T033 Code cleanup: remove dead code, ensure no hardcoded styles in modals
- [ ] T034 [P] Multi-theme visual QA (Dark, Light, Purple) for modals + onboarding
- [ ] T035 Accessibility pass (focus order, contrast, keyboard, ARIA) on modals + onboarding
- [ ] T036 [P] Performance check: sign-in redirect p95 < 2s; email send < 60s; rate limits enforced
- [ ] T037 Build and typecheck validation: `npx tsc --noEmit` and `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- Setup (Phase 1): No dependencies — can start immediately
- Foundational (Phase 2): Depends on Setup completion — BLOCKS all user stories
- User Stories (Phase 3+): Depend on Phase 2 completion; US1 and US2 are both P1 but can proceed after foundational; US3 (P2) after foundational and in parallel once US1 UI is approved
- Polish (Final Phase): Depends on desired user stories being complete

### User Story Dependencies
- US1 (P1): Can start after Foundational — no dependency on other stories
- US2 (P1): Can start after Foundational — independent; uses shared auth/session
- US3 (P2): Can start after Foundational — independent; integrates with existing User model and NextAuth

### Parallel Opportunities
- Setup: T001–T003 can run in parallel
- Foundational: T007–T009 in parallel; T010–T011 in parallel after `auth.ts` context is known
- US1: T013–T014 in parallel (distinct files); T012 is the audit task and should precede updates
- US2: T018–T019 can run in parallel; T020 after T019
- US3: T023, T025–T027 can run in parallel; T022 first for Google; T029–T031 after route stubs exist

---

## Implementation Strategy

MVP First (User Story 1 Only)
1. Complete Setup + Foundational
2. Complete US1 audit + modal refinements (no backend changes)
3. Validate redirects and multi-theme/a11y
4. Ship behind a feature flag if desired

Incremental Delivery
1. Ship US1 (credential modals)
2. Add US2 (installer onboarding + gating)
3. Add US3 (OAuth + verification + reset)

---

## Summary Report

- Total task count: 37
- Task count per user story: US1 = 5, US2 = 5, US3 = 10 (plus Setup 5, Foundational 6, Polish 7)
- Parallel opportunities: Identified in phases and per US as noted
- Independent test criteria:
  - US1: Sign up/in each role; verify correct dashboard redirects
  - US2: Onboarding flow sets profileComplete; gating message appears until verified
  - US3: OAuth succeeds; verification and reset tokens function; prior sessions invalidated on reset
- Suggested MVP scope: User Story 1 (credential modals only)
