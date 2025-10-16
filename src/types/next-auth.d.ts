// ============================================================================
// NEXTAUTH TYPE DEFINITIONS
// ============================================================================
// This file extends NextAuth's default types to include our custom fields
// TypeScript will now know about the 'role' field in session.user
// ============================================================================

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session.user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name: string | null;
      image: string | null;
      phoneVerified: boolean;
      leadSubmissionCount: number;
      installerVerified: boolean;
      quoteLimit: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    phoneVerified?: boolean;
    leadSubmissionCount?: number;
    installerVerified?: boolean;
    leadSubmissionLimit?: number;
    quoteLimit?: number;
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phoneVerified: boolean;
    leadSubmissionCount: number;
    installerVerified: boolean;
    quoteLimit: number;
  }
}
