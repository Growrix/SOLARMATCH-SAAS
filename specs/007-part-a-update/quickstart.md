# Quickstart: Implement Auth Part A + B

## Phase Order (UI-First -> Backend)
1. UI Modals Refactor (Credential SignIn/SignUp) using existing design tokens.
2. Installer Onboarding Page (pure UI mock, placeholder submit handler).
3. Spec & Plan updates (ensure modals + onboarding UI captured) BEFORE backend.
4. Prisma Schema Migration (add models in data-model.md).
5. Implement API Routes (verify request/confirm, password forgot/reset, installer profile patch).
6. Integrate OAuth Providers (Google first, Apple after verification flows stable).
7. Add Token Generation Utilities (secure random, hash SHA-256, TTL enforcement).
8. Add Rate Limiter Wrapper (in-memory for dev; Redis/Upstash for prod when approved).
9. Implement Email Sender Abstraction (mailer.ts with provider-specific implementation).
10. Wire Modals to Credential + OAuth flows (NextAuth callbacks for linking logic).
11. Wire Email Verification + Password Reset UI triggers to API routes.
12. Add Session Version Check in JWT + increment on password reset.
13. Accessibility & Multi-Theme QA (3 themes, focus management, contrast).
14. Logging (AuthEvent or console) for major transitions.
15. E2E Tests (signup, onboarding, OAuth, verify, reset, gating).
16. Performance/Rate Limit Validation & Build.

## Commands (Dev Workflow)
- Migrate: npx prisma migrate dev --name auth_part_a_b_models
- Generate: npx prisma generate
- Dev: npm run dev
- Typecheck: npx tsc --noEmit
- Build: npm run build

## API Integration Notes
- All token routes return generic success (privacy: do not reveal user existence).
- Password reset invalidates prior sessions by sessionVersion increment.
- OAuth: NextAuth account linking by email; add callback to prevent duplicate user creation.

## Testing Checklist (High-Level)
- SignUp modal: role selection, success redirect.
- Installer onboarding gating: restricted page shows CTA until profileComplete.
- OAuth Google: existing email merges; new email creates account; redirect preserved.
- Verification: request -> email -> confirm -> emailVerifiedAt set.
- Password Reset: forgot -> email -> reset -> old sessions invalidated.
- Rate limit: >5 requests in 15m returns RATE_LIMITED.
- Multi-theme visual check for modals + onboarding page.

## Rollout Strategy
- Deploy credential modal refactor first (feature flag for new flows).
- Enable verification/reset endpoints (no UI) to confirm infrastructure.
- Add UI triggers for verification/reset.
- Activate Google OAuth; monitor linking logs.
- Add Apple OAuth after stability week.

## Monitoring
- Log counts of verification, reset, OAuth link successes/failures.
- Track delivery latency timestamps for email flows (measure against SC-004).

## Follow-Up (Post Launch)
- Consider MFA & phone verification enhancements.
- Add analytics for onboarding completion funnel.
- Evaluate moving rate limiting to dedicated Redis if load increases.
