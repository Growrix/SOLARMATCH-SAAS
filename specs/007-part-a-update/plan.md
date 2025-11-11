# Implementation Plan: Auth Part A + B — NextAuth-only modernization

**Branch**: `007-part-a-update` | **Date**: 2025-11-11 | **Spec**: `specs/007-part-a-update/spec.md`
**Input**: Feature specification from `/specs/007-part-a-update/spec.md`

Note: Generated via planning workflow; will evolve as Phase 0/1 outputs are produced.

## Summary

Modernize authentication by: 1) replacing credential flows with simplified, accessible modals and preserving role-based redirects; 2) adding installer onboarding (companyName, businessAddress, postcode) with gating until profile complete/verified; 3) enabling OAuth (Google/Apple), email verification (request + token confirm), and password recovery (forgot + reset); 4) applying rate limiting and logging. All work is NextAuth-only with Prisma-backed tokens and conforms to the design system (multi-theme, no hardcoded classes).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS, Next.js 14 (App Router)
**Primary Dependencies**: next-auth v4, @next-auth/prisma-adapter, prisma/@prisma/client, bcryptjs, zod (NEEDS CLARIFICATION), email provider (SMTP/Resend/SendGrid — NEEDS CLARIFICATION)
**Storage**: PostgreSQL via Prisma (User, EmailVerificationToken, PasswordResetToken, InstallerProfile)
**Testing**: NEEDS CLARIFICATION (proposed: Playwright for e2e; tsx-based smoke scripts; Vitest/Jest for unit)
**Target Platform**: NEEDS CLARIFICATION (repo includes docker-compose; also Vercel-compatible)
**Project Type**: Web application (single Next.js app)
**Performance Goals**: SC-001: p95 sign-in redirect < 2s; SC-004: 95% emails < 60s delivery; token TTL 30m
**Constraints**: Uptime ≥ 99.5%; auth incident recovery ≤ 15m; single-use token consumption; rate limiting on auth/verify/reset
**Scale/Scope**: NEEDS CLARIFICATION (assume ≥10k MAU; OAuth uptake ≥30% post-launch per spec)

## Constitution Check

Gate assessment against `/.specify/memory/constitution.md`:
- UI-first workflow: PASS (modals/UI built and approved before backend; spec updates precede backend)
- Next.js App Router standards: PASS (server components default; API via route.ts; shared dashboard layout preserved)
- TypeScript strict mode: PASS (no `any`; typed API contracts; NextAuth types extended where needed)
- Database-first (Prisma): PASS (schema-first for tokens/profile; migrations required; no raw SQL)
- Authentication: PASS (NextAuth-only; credentials + OAuth; JWT sessions)
- Styling/Theming: PASS (design tokens; no hardcoded colors/typography; multi-theme verification planned)

Re-check scheduled after Phase 1 design artifacts are produced.

## Project Structure

### Documentation (this feature)

```
specs/007-part-a-update/
├── plan.md              # This file
├── research.md          # Phase 0: decisions + rationale
├── data-model.md        # Phase 1: Prisma model contracts
├── quickstart.md        # Phase 1: step-by-step implementation guide
└── contracts/           # Phase 1: API contracts (OpenAPI YAML)
```

### Source Code (repository root)

```
src/
├── app/
│   ├── (dashboard)/
│   │   └── installer/
│   │       └── onboarding/page.tsx          # Installer onboarding page (UI-first)
│   └── api/
│       ├── auth/
│       │   ├── verify/
│       │   │   ├── request/route.ts         # POST: request verification email
│       │   │   └── confirm/route.ts         # GET/POST: confirm verification token
│       │   └── password/
│       │       ├── forgot/route.ts          # POST: request password reset token
│       │       └── reset/route.ts           # POST: submit new password with token
│       └── installer/
│           └── profile/route.ts             # PATCH: update installer profile minimal fields
├── components/
│   └── auth/                                # SignIn/SignUp modals, shared inputs/buttons
└── lib/                                     # prisma.ts, rateLimiter.ts (if added), mailer.ts

tests/
├── e2e/                                     # Playwright specs for flows (if adopted)
├── integration/                             # API route tests (smoke via tsx or Vitest)
└── unit/                                    # Component and util tests
```

**Structure Decision**: Single Next.js web app using App Router. New work is confined to the listed routes/components, honoring shared dashboard layout and centralized auth components.

## Complexity Tracking

No deviations from the Constitution are required at this time. If rate limiting introduces Redis, dependency and ops implications will be documented prior to adoption.
