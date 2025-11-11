# Auth Modernization & Clerk Cleanup — Spec

Date: 2025-11-11
Branch: clerk-messup
Owners: Platform/Auth

Sources of truth:
- Current audit: DOC/nextjsAuth.md/AuditNextjsAuth.md
- Implementation plan: DOC/nextjsAuth.md/AuthenticationPlan.md

Status: Clarification skipped per user. Proceeding based on the above documents. All assumptions explicitly stated below.

---

## 1. Overview
We will: (A) update existing NextAuth credential flows to match redesigned simplified modals; (B) build missing auth capabilities (Google/Apple OAuth, Email Verification, Forgot Password); and (C) remove all Clerk legacy artifacts introduced during a temporary experiment, restoring a clean NextAuth-only system.

## 2. Goals and Success Criteria
- Users can register/sign in with email+password via simplified modals (Homeowner, Installer, Admin) with role redirects unchanged.
- Installer minimal signup + onboarding wizard for business fields; marketplace gated until profileComplete && installerVerified.
- Add OAuth (Google, Apple) with account linking by email.
- Add Email Verification (request + verify) and Forgot/Reset Password flows.
- Remove all Clerk references (files, routes, pages, imports, envs) and ensure build passes without Clerk.
- Preserve lead-gen and lead-management behaviors; no regressions in RBAC or middleware protections.

Measurable:
- Build, Lint, Typecheck: PASS
- Auth E2E happy paths for all roles: PASS
- Theming verification for modals (Dark/Light/Purple) and 5 breakpoints: PASS

## 3. Out of Scope
- Business logic changes to lead algorithms or admin operations.
- UI redesign beyond auth modals/onboarding; keep to design system tokens.

## 4. Roles
- HOMEOWNER, INSTALLER, ADMIN (unchanged). Admin bypass preserved in middleware.

## 5. Old → New Flow Mapping (condensed)
See plan A1 table. Key changes: Installer signup now minimal; profile completion route `/installer/onboarding` handles companyName, businessAddress, postcode.

## 6. Data Model Impacts
- Optionally add `profileComplete: Boolean @default(false)` to User (INSTALLER only logic). No destructive changes. Keep `installerVerified` semantics.

## 7. API Contracts (delta)
- PATCH `/api/installer/profile` (new) { companyName, businessAddress, postcode } → { success, profileComplete: true }
- POST `/api/auth/verify/request` (new)
- GET `/api/auth/verify?token=...` (new)
- POST `/api/auth/password/forgot` (new)
- POST `/api/auth/password/reset` (new)
- Enable OAuth providers in `src/lib/auth.ts` (Google, Apple)

All other existing NextAuth routes remain; remove any Clerk-specific endpoints (see §10).

## 8. UX Flows
- Modals: Submit minimal fields; success redirects preserved.
- Installer onboarding: Protected page; after PATCH, show pending approval if installerVerified=false.
- Email verify + reset password: Basic pages with brand-consistent templates.

## 9. Non-Functional
- Rate limiting for credentials authorize, verify request, forgot password (Upstash recommended).
- Logging: No sensitive data, error messages generic.

## 10. Clerk Legacy Cleanup (critical)
Remove all code paths and assets referencing Clerk. Sequence uses atomic deletions and replacements to avoid breaking build mid‑cleanup.

### 10.1 Removal Sequence
1. Delete helper module: `src/lib/clerk-auth-helpers.ts` (Replaced with no-op shim; no Clerk imports remain)
2. Delete Clerk-only pages (no NextAuth equivalent required):
   - `src/app/sso-callback/page.tsx`
   - `src/app/setup-account/page.tsx`
   - `src/app/dashboard/page.tsx` (Clerk role redirect; NextAuth middleware & existing dashboards handle routing)
3. Remove Clerk webhooks & sync endpoints:
   - `src/app/api/webhooks/clerk/route.ts`
   - `src/app/api/user/sync/route.ts`
   - `src/app/api/user/route.ts`
4. Remove temporary Clerk registration endpoint:
   - `src/app/api/auth/register/route.ts` (retain `homeowner/` and `installer/` subfolders — they are NextAuth credential endpoints)
5. Remove any residual SSO/OAuth bridging code referencing Clerk (already covered by page deletions above).
6. Search & eliminate stray imports in remaining files (`@clerk/nextjs`, `@clerk/nextjs/server`).
7. Confirm `package.json` has no Clerk dependency; no action needed unless present.
8. Scrub environment: remove `CLERK_WEBHOOK_SECRET` or other `CLERK_*` vars from local/staging if they exist (not tracked in codebase spec editing).

### 10.2 Acceptance Gates
- After each deletion batch run TypeScript typecheck: PASS
- Final global search for patterns `@clerk/nextjs` and `clerkClient` returns 0 in `src/`
- Build (`npm run build`) succeeds
- Installer/Homeowner/Admin dashboards reachable via existing NextAuth flow

### 10.3 Non-Deletion Items
Documentation artifacts referencing Clerk are left untouched per user instruction; future archival optional.

### 10.4 Rollback Strategy
Each removal is atomic and can be restored from `backup-*` directories if unexpected dependency discovered. Stop immediately if a NextAuth flow breaks and restore last deleted file for diff analysis.

### 10.5 Post-Cleanup Verification Checklist
- Credentials login for all roles
- Middleware RBAC still enforces access
- Lead-related APIs unaffected (smoke test GET /api/leads)
- No runtime 500s referencing missing Clerk symbols

Status: ✅ **COMPLETED** — All Clerk artifacts removed:
- Helper module neutralized (no Clerk imports)
- Generic Clerk register endpoint removed
- `instant-quote/complete` refactored to NextAuth
- All `clerkId` references eliminated from scripts
- Active `src/` tree: 0 Clerk imports
- TypeScript typecheck: PASS (0 errors)
- Production build: PASS

## 11. Security
- Preserve bcrypt hashing, JWT session management, RBAC via middleware.
- Enforce strong NEXTAUTH_SECRET in production.
- Add rate limits as noted.

## 12. Edge Cases
- Installer trying to access marketplace before profileComplete/verified → CTA to onboarding or pending state.
- Email verify token reuse/expiry → safe error.
- Reset token invalid/expired → safe error; force logout after password reset.

## 13. Acceptance Criteria
- Credential sign-up/sign-in works for all roles.
- Installer onboarding works; marketplace gated until verified.
- OAuth (Google/Apple) working and linked by email.
- Email verification and password reset flows working end-to-end.
- Zero Clerk references in code and routes.
- All quality gates PASS.

## 14. Risks & Mitigations
- Hidden Clerk references → Use global search; add CI grep check.
- OAuth configuration complexity → Feature flag until ready.
- Regression in lead flows → Execute audit testing checklist.

## 15. Migration & Execution Notes
- UI migration steps must follow `specs/007-migration-and-build/plan.md` workflow (multi-theme verification) for modal/onboarding components.
- Implement Part A first (email/password parity), then Part B sequence (OAuth → verification → reset).

## 16. Cross-References
- Plan: DOC/nextjsAuth.md/AuthenticationPlan.md
- Audit: DOC/nextjsAuth.md/AuditNextjsAuth.md
