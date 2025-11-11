# Phase 0 Research: Auth Part A + B Modernization

## Objectives
Clarify unknowns, select libraries/services, and lock implementation approach before schema and contract authoring.

## Unknowns / NEEDS CLARIFICATION
1. Email provider choice (Resend vs. SendGrid vs. SMTP). Recommendation: Resend (simple API, good DX). Await confirmation.
2. Validation library: Adopt `zod` for runtime + type inference? Recommendation: Yes. Await confirmation.
3. Rate limiting mechanism: Use in-memory (unstable) vs. Redis (production ready). Recommendation: Upstash Redis (serverless) or Supabase Ratelimit extension. Await confirmation.
4. Testing stack: Use Playwright for e2e? Recommendation: Yes (flows: signup, onboarding, OAuth, verify, reset). Await confirmation.
5. Installer profile model location: Separate `InstallerProfile` vs. extending `User`. Recommendation: Separate table for optional fields to keep User lean.

## Decisions (Proposed)
- Token storage: Prisma models `EmailVerificationToken` and `PasswordResetToken` with `hashedToken` (SHA-256) + `expires` + `used` boolean.
- Token TTL: 30 minutes (aligns with SC-004); enforced server-side with query filter and consumed flag.
- Hashing: bcryptjs for passwords (10 salt rounds). Tokens hashed with SHA-256 to avoid storing raw secrets.
- OAuth: Google + Apple via NextAuth providers. Account linking by email (if existing user, attach provider account; if mismatch, fail with safe message).
- Session invalidation on password reset: Increment `sessionVersion` field on User; embed in JWT; mismatch invalidates existing sessions.
- Rate limiting: Decorator utility wrapping POST routes (verify/reset/auth) with sliding window (5 requests / 15 minutes); logs event on exceed.
- Logging hygiene: Central `logAuthEvent(type, userId, meta)` writing sanitized details (no tokens, no passwords) to DB table `AuthEvent` (optional) or console in dev.
- Accessibility: Auth modals implement focus trap, ESC close (non-critical only), aria-live region for error messages, and keyboard traversal order.
- Multi-theme styling: Use existing token classes; no hardcoded Tailwind palette utilities; verify contrast via manual QA checklist.

## Alternatives Considered
- Storing raw tokens: Rejected (security risk if DB leaked).
- Single table for both verification & reset tokens: Rejected for clarity and simpler distinct indexes.
- Extending User for installer onboarding fields: Rejected to keep base user portable; optional profile pattern scales.
- Using JSON Web Tokens for verification/reset: Rejected (unnecessary complexity; opaque tokens suffice).

## Open Risks
- Apple OAuth configuration complexity (service ID, private key). Mitigation: implement Google first; add Apple after base flows stable.
- Email deliverability latency. Mitigation: implement resend path + log time to deliver (measure SC-004).
- Redis introduction increases infra surface. Mitigation: abstract limiter behind interface; fallback to in-memory in dev.

## Next Steps
1. Confirm provider + libraries (email, zod, rate limit store, test stack).
2. Author data-model (`data-model.md`) including Prisma schema changes.
3. Draft API contracts (verification, password reset, onboarding, linking logic). 
4. Produce quickstart with phased UI-first steps and backend activation order.

## References
- Spec: `specs/007-part-a-update/spec.md`
- Constitution: `.specify/memory/constitution.md`
- Design Tokens: `DOC/DESIGN-SYSTEM-SOT.md`
