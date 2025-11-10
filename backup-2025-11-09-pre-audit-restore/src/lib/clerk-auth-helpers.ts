/**
 * Clerk Authentication Helpers for API Routes
 * 
 * Provides backward-compatible auth functions that match the old NextAuth patterns
 * but use Clerk under the hood. This allows minimal changes to existing API routes.
 */

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

/**
 * Session object that matches the old NextAuth session shape
 */
export interface ClerkSession {
  user: {
    id: string;
    clerkId: string;
    email: string;
    name: string | null;
    role: UserRole;
    phoneVerified: boolean;
    installerVerified: boolean;
    isActive: boolean;
  };
}

/**
 * Get the current authenticated user's session
 * 
 * Replaces: getServerSession(authOptions)
 * 
 * @returns Session object or null if not authenticated
 */
export async function getClerkSession(): Promise<ClerkSession | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        phoneVerified: true,
        installerVerified: true,
        isActive: true,
      },
    });

    if (!user) {
      console.error(`[ClerkAuth] User not found in database for clerkId: ${userId}`);
      return null;
    }

    return {
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneVerified: user.phoneVerified,
        installerVerified: user.installerVerified,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    console.error('[ClerkAuth] Error getting session:', error);
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 * 
 * @param allowedRoles Optional array of roles that are allowed (e.g., ['HOMEOWNER', 'ADMIN'])
 * @returns Session object
 * @throws Error if not authenticated or role not allowed
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<ClerkSession> {
  const session = await getClerkSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error(`Forbidden: ${allowedRoles.join(' or ')} role required`);
  }

  return session;
}

/**
 * Check if user has a specific role
 * 
 * @param session The session object
 * @param role The role to check
 * @returns true if user has the role
 */
export function hasRole(session: ClerkSession | null, role: UserRole): boolean {
  return session?.user?.role === role;
}

/**
 * Check if user has any of the specified roles
 * 
 * @param session The session object
 * @param roles Array of roles to check
 * @returns true if user has any of the roles
 */
export function hasAnyRole(session: ClerkSession | null, roles: UserRole[]): boolean {
  return session?.user ? roles.includes(session.user.role) : false;
}
