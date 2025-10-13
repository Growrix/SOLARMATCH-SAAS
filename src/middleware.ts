import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If no token, redirect to home (withAuth will handle this)
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check role-based access for admin routes
    if (path.startsWith('/admin')) {
      if (token.role !== 'ADMIN') {
        console.log(`Unauthorized access attempt to ${path} by user with role: ${token.role}`);
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Check role-based access for installer routes
    if (path.startsWith('/installer')) {
      if (token.role !== 'INSTALLER') {
        console.log(`Unauthorized access attempt to ${path} by user with role: ${token.role}`);
        // Redirect to their correct dashboard
        if (token.role === 'HOMEOWNER') {
          return NextResponse.redirect(new URL('/homeowner/dashboard', req.url));
        } else if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Check role-based access for homeowner routes
    if (path.startsWith('/homeowner')) {
      if (token.role !== 'HOMEOWNER') {
        console.log(`Unauthorized access attempt to ${path} by user with role: ${token.role}`);
        // Redirect to their correct dashboard
        if (token.role === 'INSTALLER') {
          return NextResponse.redirect(new URL('/installer/dashboard', req.url));
        } else if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User must have a token
    },
  }
);

// Protect these routes with authentication
export const config = {
  matcher: [
    '/homeowner/:path*',
    '/installer/:path*',
    '/admin/:path*',
  ],
};
