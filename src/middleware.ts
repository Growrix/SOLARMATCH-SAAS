import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers for protected routes
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isInstallerRoute = createRouteMatcher(['/installer(.*)']);
const isHomeownerRoute = createRouteMatcher(['/homeowner(.*)']);
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/installer(.*)',
  '/homeowner(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const path = req.nextUrl.pathname;

  // Get user role from Clerk session claims (publicMetadata)
  let userRole = (sessionClaims?.public_metadata as { role?: string })?.role;

  // If role is missing, fetch from API endpoint (creates user if doesn't exist)
  if (!userRole && userId && isProtectedRoute(req)) {
    try {
      console.log(`[Middleware] Role missing for user ${userId}, fetching from API...`);
      const apiUrl = new URL('/api/user/sync', req.url);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-clerk-user-id': userId,
        },
        body: JSON.stringify({
          clerkId: userId,
          email: sessionClaims?.email as string,
          name: `${sessionClaims?.first_name || ''} ${sessionClaims?.last_name || ''}`.trim() || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        userRole = data.role;
        console.log(`[Middleware] ✅ User synced from DB, role: ${userRole}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[Middleware] ❌ API sync failed (${response.status}):`, errorData.message || errorData.error);
        // NO DEFAULT - Redirect to setup page instead
        const setupUrl = new URL('/setup-account', req.url);
        setupUrl.searchParams.set('error', 'role_not_found');
        setupUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(setupUrl);
      }
    } catch (error) {
      console.error('[Middleware] ❌ Error syncing user:', error);
      // NO DEFAULT - Redirect to setup page instead
      const setupUrl = new URL('/setup-account', req.url);
      setupUrl.searchParams.set('error', 'sync_failed');
      setupUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(setupUrl);
    }
  }

  // ========================================================================
  // PUBLIC ROUTES - Allow access without authentication
  // ========================================================================
  if (!isProtectedRoute(req)) {
    return NextResponse.next();
  }

  // ========================================================================
  // AUTHENTICATION CHECK - Redirect to sign-in if not authenticated
  // ========================================================================
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // ========================================================================
  // ADMIN BYPASS - Admins can access ALL protected routes
  // ========================================================================
  // This allows admins to view homeowner and installer dashboards
  // for support, debugging, and content management purposes
  // Admin role is verified by Clerk - cannot be faked
  // ========================================================================
  if (userRole === 'ADMIN') {
    console.log(`[Middleware] Admin access granted to ${path}`);
    return NextResponse.next();
  }

  // ========================================================================
  // ROLE-BASED ACCESS CONTROL (for non-admin users)
  // ========================================================================

  // Check role-based access for admin routes
  if (isAdminRoute(req)) {
    if (userRole !== 'ADMIN') {
      console.log(`[Middleware] Unauthorized admin access attempt by ${userRole || 'unknown'}`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Check role-based access for installer routes
  if (isInstallerRoute(req)) {
    if (userRole !== 'INSTALLER') {
      console.log(`[Middleware] Unauthorized installer access attempt by ${userRole || 'unknown'}`);
      // Redirect to their correct dashboard
      if (userRole === 'HOMEOWNER') {
        return NextResponse.redirect(new URL('/homeowner/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Check role-based access for homeowner routes
  if (isHomeownerRoute(req)) {
    if (userRole !== 'HOMEOWNER') {
      console.log(`[Middleware] Unauthorized homeowner access attempt by ${userRole || 'unknown'}`);
      // Redirect to their correct dashboard
      if (userRole === 'INSTALLER') {
        return NextResponse.redirect(new URL('/installer/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow access
  return NextResponse.next();
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
