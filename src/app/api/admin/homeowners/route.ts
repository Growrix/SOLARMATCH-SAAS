// ============================================================================
// ADMIN HOMEOWNERS LIST API
// ============================================================================
// GET /api/admin/homeowners
// Lists all homeowners with search, filters, and pagination (ADMIN only)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// ============================================================================
// GET - List homeowners with filters
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    // Check for ADMIN role
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // ========================================================================
    // PARSE QUERY PARAMETERS
    // ========================================================================
    const { searchParams } = new URL(request.url);
    
    const q = searchParams.get('q') || '';
    const postcodeFilter = searchParams.get('postcode') || '';
    const statusFilter = searchParams.get('status') || ''; // active|inactive
    const fromDate = searchParams.get('from') || '';
    const toDate = searchParams.get('to') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '25', 10)));

    // ========================================================================
    // BUILD PRISMA FILTER
    // ========================================================================
    const where: any = {
      role: 'HOMEOWNER', // Only homeowners
    };

    // Search across multiple fields (case-insensitive)
    if (q.trim()) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { postcode: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by postcode (exact or prefix match)
    if (postcodeFilter.trim()) {
      where.postcode = { contains: postcodeFilter, mode: 'insensitive' };
    }

    // Filter by active status
    if (statusFilter === 'active') {
      where.isActive = true;
    } else if (statusFilter === 'inactive') {
      where.isActive = false;
    }

    // Filter by date range (createdAt)
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        try {
          where.createdAt.gte = new Date(fromDate);
        } catch (e) {
          return NextResponse.json(
            { error: 'Invalid "from" date format' },
            { status: 400 }
          );
        }
      }
      if (toDate) {
        try {
          // Include the entire "to" day
          const toDateObj = new Date(toDate);
          toDateObj.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDateObj;
        } catch (e) {
          return NextResponse.json(
            { error: 'Invalid "to" date format' },
            { status: 400 }
          );
        }
      }
    }

    // ========================================================================
    // FETCH DATA
    // ========================================================================
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          postcode: true,
          createdAt: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json(
      {
        total,
        page,
        pageSize,
        items,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching homeowners list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homeowners' },
      { status: 500 }
    );
  }
}
