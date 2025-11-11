# Feature Specification: Auth Part A + B — Modernize credential flows and add OAuth + verification + reset (NextAuth-only)

**Feature Branch**: `007-part-a-update`  
**Created**: 2025-11-11  
**Status**: Draft (Spec ready for planning)  
**Input**: User description: "Part A: Update existing credential auth flows to simplified modals for Homeowner/Installer/Admin with preserved redirects and RBAC, and provide installer minimal signup + protected onboarding (companyName, businessAddress, postcode) including profile completion update. Part B: Add OAuth (Google & Apple) integrated with current sessions, add email verification (request + token confirm), and password recovery (forgot + reset). Non-functional: rate limiting, logging hygiene, accessibility and theming alignment. No Clerk; NextAuth-only system."

## References

- Audit: `DOC/nextjsAuth.md/AuditNextjsAuth.md`
- Implementation Plan: `DOC/nextjsAuth.md/AuthenticationPlan.md`

## User Scenarios & Testing (mandatory)

### User Story 1 - Credential sign-up/sign-in via simplified modals (Priority: P1)

As a Homeowner or Installer or Admin, I can create an account or sign in using a simple modal with the minimum fields required. After success, I am redirected to the correct dashboard for my role and can immediately access role-appropriate actions.

Why this priority: This is the primary path into the product; without reliable credential flows, no users can proceed.

Independent Test: Launch the site, trigger sign-up/sign-in modal, complete authentication for each role, and verify redirect, session state, and access controls.

Acceptance Scenarios:
1. Given a new Homeowner, when they sign up with email and password via the modal, then their account is created and they are redirected to the Homeowner dashboard.
2. Given an existing Installer, when they sign in via the modal, then they land on the Installer dashboard with marketplace access gated by profile/verification status.
3. Given an Admin, when they sign in via the modal, then they land on the Admin dashboard with admin capabilities visible.

---

### User Story 2 - Installer minimal signup + onboarding (Priority: P1)

As an Installer, after minimal signup, I can complete a short onboarding flow to provide companyName, businessAddress, and postcode. Until I complete onboarding and my account is verified, marketplace and purchasing actions remain gated, with clear messaging.

Why this priority: Installers are core to the marketplace supply; onboarding quality and gating protect marketplace integrity.

Independent Test: Create a new Installer, confirm onboarding CTA and form, submit required fields, see profile marked complete, and verify marketplace is gated until verification.

Acceptance Scenarios:
1. Given a new Installer with minimal signup, when they visit any restricted installer page, then they are guided to the onboarding page.
2. Given an Installer on the onboarding page, when they submit companyName, businessAddress, and postcode, then their profile is marked complete and they see a pending verification state if not yet verified.
3. Given an unverified Installer, when they attempt marketplace purchase, then they are blocked with an explanatory message.

---

### User Story 3 - OAuth, email verification, and password recovery (Priority: P2)

As a user, I can authenticate with Google or Apple, verify my email if required, and recover my password via a secure forgot/reset flow, so that I can re-access my account without support.

Why this priority: Reduces friction, improves conversion, and lowers support burden.

Independent Test: Complete OAuth sign-in, request a verification email and confirm via token link, request a password reset and set a new password; verify login works after each flow.

Acceptance Scenarios:
1. Given a user with an existing email account, when they sign in with Google using the same email, then accounts are linked and they can access their data.
2. Given an unverified account, when the user requests verification, then they receive an email with a time-bound token and on visiting the link their email is marked verified.
3. Given a user who forgot their password, when they request a reset, then they receive a time-bound token and can set a new password; subsequent sign-in succeeds and old sessions are invalidated.

---

### Edge Cases

- Verification token expired, reused, or invalid → show safe error with option to request a new token.
- OAuth email already associated with a password account → link by verified email; do not create duplicates.
- Role-based redirects and gating remain consistent after OAuth and resets.
- Rate limiting triggers on abusive attempts (auth, verify, reset) → return friendly error and log event.
- Accessibility: modal focus trap, keyboard nav, and color contrast across themes.

## Requirements (mandatory)

### Functional Requirements

- FR-001: The system must provide credential sign-up and sign-in using simplified modals for Homeowner, Installer, and Admin, with successful role-based redirects.
- FR-002: The system must persist a user’s role and enforce access via existing role-based protections and dashboards.
- FR-003: For Installers, the system must require a minimal signup and then a protected onboarding flow to collect companyName, businessAddress, and postcode, marking the profile as complete upon submission.
- FR-004: The system must gate marketplace/purchasing until an Installer’s profile is complete and the account is verified; show clear messaging when gated.
- FR-005: The system must support sign-in/up with Google and Apple and link identities by verified email to prevent duplicate accounts.
- FR-006: The system must provide an email verification flow: request verification, deliver a time-bound token, and confirm verification via token consumption.
- FR-007: The system must provide a password recovery flow: request reset, deliver a time-bound token, and allow setting a new password; invalidate prior sessions upon reset.
- FR-008: The system must implement rate limiting on credential auth, verification requests, and password reset requests with friendly error messaging when limits are exceeded.
- FR-009: The system must log authentication, verification, and reset events without storing sensitive secrets or full tokens.
- FR-010: The system must ensure modals and pages meet accessibility and theming standards (focus management, keyboard support, contrast, multi-theme tokens).

### Key Entities (data-level, conceptual)

- Entity: User — attributes include email, role (HOMEOWNER | INSTALLER | ADMIN), name (optional), phone verification state, installer verification state, and profile completion flag (for Installer).
- Entity: EmailVerificationToken — attributes include user reference, token value (secure), expiry timestamp, used flag, created timestamp.
- Entity: PasswordResetToken — attributes include user reference, token value (secure), expiry timestamp, used flag, created timestamp.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: 95% of successful sign-ins redirect to the correct dashboard in under 2 seconds.
- SC-002: 90% of new Installers complete onboarding in under 3 minutes.
- SC-003: At least 30% of new sign-ups authenticate via OAuth (Google/Apple) after launch without increase in duplicate accounts.
- SC-004: 95% of verification and password reset emails are delivered within 60 seconds; tokens expire within 30 minutes and cannot be reused.
- SC-005: Reported support tickets related to sign-in issues decrease by 40% within one month of release.
- SC-006: Uptime ≥ 99.5% monthly; auth incident recovery (verification/reset/OAuth token service) within 15 minutes.

## Assumptions

- The existing authentication foundation and session management remain in place; no legacy third-party auth is retained.
- Email delivery infrastructure is available for verification and reset emails.
- Role-based dashboards and middleware protections already exist and remain unchanged.

## Dependencies

- Email service for transactional messages (verification, reset).
- Design system tokens and modal components for consistent theming and accessibility.

## Out of Scope

- Changes to lead algorithms, admin operations, or non-auth business logic.
- Deep UI redesign beyond the specified auth modals and onboarding.
 - Multi-factor authentication (MFA) and phone verification changes.
 - Account deletion / data portability flows.

## Edge Case Handling Details

- Expired tokens yield a generic safe error and allow re-request without revealing whether token existed.
- Duplicate OAuth linkage attempts log an event and reuse existing account silently.
- Rapid repeated reset or verification requests trigger rate limiting with a non-technical message.
- Profile completion attempts missing required installer fields return validation errors without partial save.
- Accessibility: focus trapped inside modal; ESC closes only non-critical modals; error messages announced to assistive tech.

## Risks & Mitigations

- Risk: OAuth provider configuration errors → Mitigation: staged rollout with separate provider keys and dry-run logging.
- Risk: Token misuse (replay) → Mitigation: single-use flag and immediate invalidation on consumption.
- Risk: Email deliverability issues → Mitigation: fallback resend and monitoring of bounce rates.
- Risk: Abuse of verification/reset endpoints → Mitigation: rate limiting + logging for anomaly detection.
- Risk: Installer gating confusion → Mitigation: clear CTA messaging and status indicators.

## Clarifications

### Session 2025-11-11

- Q: What reliability/uptime and incident recovery target should we meet?
	→ A: 99.5% monthly uptime; 15-minute auth incident recovery.

## No Clarifications Needed

All requirements use standard patterns; defaults chosen intentionally. No [NEEDS CLARIFICATION] markers required.

## Ready for Planning

Spec meets mandatory sections; proceed to planning workflow.
