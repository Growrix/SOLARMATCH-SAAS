# Phase 1 Data Model: Auth Part A + B

## Goal
Define Prisma schema changes supporting installer onboarding, email verification, password reset, OAuth linking robustness, and session invalidation.

## Existing (Contextual Summary)
User model (assumed) contains: id, email (unique), role, name, hashedPassword, createdAt, updatedAt, installerVerificationState?, profileComplete? (Some fields may not yet exist; adjustments below).

## New / Modified Models (Proposed)

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  role              Role
  hashedPassword    String?          // null for pure OAuth accounts
  profileComplete   Boolean  @default(false) // Installer gating
  sessionVersion    Int      @default(0)      // Increment on password reset
  installerProfile  InstallerProfile?         // 1:1 optional
  // provider accounts handled by NextAuth adapter models if present
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  emailVerifiedAt   DateTime? // set when verification succeeds
  // relations for tokens
  verificationTokens EmailVerificationToken[]
  passwordResetTokens PasswordResetToken[]
}

model InstallerProfile {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  companyName    String
  businessAddress String
  postcode       String
  // optional future fields: licenseNumber, phone, website
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  hashedToken String // SHA-256(token)
  expires   DateTime // 30m TTL
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  @@index([userId])
  @@index([expires])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  hashedToken String // SHA-256(token)
  expires   DateTime // 30m TTL
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  @@index([userId])
  @@index([expires])
}

// Optional: AuthEvent audit logging
model AuthEvent {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  type      AuthEventType
  meta      Json?
  ipAddress String?
  createdAt DateTime @default(now())
  @@index([type])
  @@index([userId])
}

enum AuthEventType {
  SIGN_IN
  SIGN_UP
  SIGN_OUT
  PASSWORD_RESET_REQUEST
  PASSWORD_RESET_SUCCESS
  EMAIL_VERIFICATION_REQUEST
  EMAIL_VERIFICATION_SUCCESS
  RATE_LIMIT_EXCEEDED
  OAUTH_LINKED
}

enum Role {
  HOMEOWNER
  INSTALLER
  ADMIN
}
```

## Rationale
- Separate `InstallerProfile` keeps base User small and optional complexity isolated.
- `sessionVersion` enables silent invalidation of existing sessions post-reset without tracking each session row (JWT includes version).
- Tokens store only hashed values to mitigate leakage risks.
- Indexes on `expires` support cleanup queries and efficient validity checks.
- `AuthEvent` (optional) centralizes audit logging for security and analytics (not required for MVP; can defer if complexity high).

## Migration Plan
1. Add new enum `AuthEventType` and models (or skip `AuthEvent` initially).
2. Add fields to `User`: `profileComplete`, `sessionVersion`, `emailVerifiedAt`.
3. Create `InstallerProfile` table.
4. Create `EmailVerificationToken` and `PasswordResetToken` tables.
5. Generate migration with descriptive name: `npx prisma migrate dev --name auth_part_a_b_models`.
6. Update any seed scripts to set `profileComplete=false` for new installers.

## Cleanup / Maintenance
- Scheduled job (cron / serverless) weekly to purge expired & used tokens.
- Consider TTL enforcement in queries (`expires > now()` + `used=false`).

## Open Questions
- Keep `AuthEvent` for MVP? (If deferred, remove model and enum entries referencing its types.)
- Need additional installer verification fields now or later? Currently minimal.

## Next Step
Proceed to API contract drafting (`contracts/`) using these models as baseline; ensure no raw token exposure.
