/*
  Warnings:

  - You are about to drop the column `clerkId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."users_clerkId_idx";

-- DropIndex
DROP INDEX "public"."users_clerkId_key";

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerkId",
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginIp" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sessionVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "signupIp" TEXT,
ADD COLUMN     "signupUserAgent" TEXT;

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "installer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "operationalStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installer_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "abnOrLicense" TEXT NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "employeeCount" INTEGER NOT NULL,
    "services" TEXT[],
    "serviceAreas" TEXT[],
    "postcodes" TEXT[],
    "website" TEXT,
    "socialLinks" JSONB,
    "companyDescription" TEXT,
    "licenseDocKey" TEXT,
    "abnDocKey" TEXT,
    "logoKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installer_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installer_verification_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installer_verification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installer_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertNewLead" BOOLEAN NOT NULL DEFAULT true,
    "alertLeadUpdates" BOOLEAN NOT NULL DEFAULT true,
    "alertAdminMessages" BOOLEAN NOT NULL DEFAULT true,
    "alertVerificationUpdates" BOOLEAN NOT NULL DEFAULT true,
    "alertAccountActivity" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installer_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_log_entries" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "installerId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "installer_profiles_userId_key" ON "installer_profiles"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_expires_idx" ON "email_verification_tokens"("expires");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_idx" ON "password_reset_tokens"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "installer_verifications_userId_key" ON "installer_verifications"("userId");

-- CreateIndex
CREATE INDEX "installer_verifications_userId_idx" ON "installer_verifications"("userId");

-- CreateIndex
CREATE INDEX "installer_verifications_status_idx" ON "installer_verifications"("status");

-- CreateIndex
CREATE INDEX "installer_verification_logs_userId_idx" ON "installer_verification_logs"("userId");

-- CreateIndex
CREATE INDEX "installer_verification_logs_adminId_idx" ON "installer_verification_logs"("adminId");

-- CreateIndex
CREATE INDEX "installer_verification_logs_createdAt_idx" ON "installer_verification_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "installer_preferences_userId_key" ON "installer_preferences"("userId");

-- CreateIndex
CREATE INDEX "installer_preferences_userId_idx" ON "installer_preferences"("userId");

-- CreateIndex
CREATE INDEX "purchase_log_entries_leadId_idx" ON "purchase_log_entries"("leadId");

-- CreateIndex
CREATE INDEX "purchase_log_entries_installerId_idx" ON "purchase_log_entries"("installerId");

-- CreateIndex
CREATE INDEX "purchase_log_entries_outcome_idx" ON "purchase_log_entries"("outcome");

-- CreateIndex
CREATE INDEX "leads_status_installerId_idx" ON "leads"("status", "installerId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installer_profiles" ADD CONSTRAINT "installer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installer_verifications" ADD CONSTRAINT "installer_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installer_preferences" ADD CONSTRAINT "installer_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_log_entries" ADD CONSTRAINT "purchase_log_entries_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_log_entries" ADD CONSTRAINT "purchase_log_entries_installerId_fkey" FOREIGN KEY ("installerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
