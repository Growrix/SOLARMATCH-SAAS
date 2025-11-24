/**
 * Assigned Leads API Route
 * 
 * GET /api/installer/leads/assigned - Get leads assigned to logged-in installer
 * 
 * @access Installer only
 * @query expired=true|false - Include/exclude expired leads (default: false)
 * @returns 200 OK + Array of assigned leads with countdown
 * @errors 401 Unauthorized, 403 Forbidden, 500 Internal Server Error
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateCountdown } from '@/lib/services/countdown-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check installer role
    if (session.user.role !== 'INSTALLER') {
      return NextResponse.json(
        { error: 'Installer access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const includeExpired = searchParams.get('expired') === 'true';

    // Query LeadAssignment with extended lead fields and homeowner
    const assignments = await prisma.leadAssignment.findMany({
      where: {
        installerId: session.user.id,
        lead: includeExpired ? undefined : {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      },
      include: {
        lead: {
          include: {
            homeowner: {
              select: { id: true, name: true, phone: true }
            },
            quotes: { select: { id: true } }
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    // Map assignments to formatted lead objects (extended shape)
    const leads = assignments.map(assignment => {
      const lead = assignment.lead;
      const isPurchased = lead.installerId === session.user.id && !!lead.purchasedAt;

      return {
        id: lead.id,
        homeownerId: lead.homeownerId,
        status: lead.status, // Raw backend status (e.g. APPROVED, PURCHASED, QUOTED)
        quoteType: lead.quoteType, // CALL_VISIT | WRITTEN_QUOTE | BIDDING
        postcode: lead.postcode,
        location: lead.location,
        state: lead.state,
        propertyType: lead.propertyType,
        projectType: lead.projectType,
        roofType: lead.roofType,
        budgetRange: lead.budgetRange,
        leadPrice: lead.leadPrice,
        purchaseStatus: lead.purchaseStatus || null,
        purchasedAt: lead.purchasedAt?.toISOString() || null,
        quotesCount: lead.quotes.length,
        expiresAt: lead.expiresAt?.toISOString() || null,
        createdAt: lead.createdAt.toISOString(),
        assignedAt: assignment.assignedAt.toISOString(),
        assignmentNotes: assignment.notes,
        homeowner: {
          name: isPurchased ? lead.homeowner.name : '***LOCKED***',
          phone: isPurchased ? lead.homeowner.phone : '***LOCKED***'
        },
        countdown: calculateCountdown(lead.expiresAt),
        isPurchased,
      };
    });

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });

  } catch (error) {
    console.error('Error fetching assigned leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned leads' },
      { status: 500 }
    );
  }
}
