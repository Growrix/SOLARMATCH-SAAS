/**
 * Bid Winner Selection API
 * 
 * POST /api/bids/[bidId]/select - Homeowner selects winning bid
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/bids/[bidId]/select
 * Homeowner selects a bid as the winner
 * 
 * @access Homeowner only (must own the lead)
 * @body { leadId: string } for validation
 * @returns 200 OK + Selected bid ID
 * @errors 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { bidId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Authentication check
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Role authorization
    if (session.user.role !== 'HOMEOWNER') {
      return NextResponse.json(
        { error: 'Only homeowners can select bids' },
        { status: 403 }
      );
    }

    const { bidId } = params;
    const body = await request.json();

    // Fetch bid with lead and installer data
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        lead: {
          include: {
            homeowner: {
              select: { id: true, email: true, name: true }
            }
          }
        },
        installer: {
          select: { id: true, email: true, companyName: true }
        }
      }
    });

    if (!bid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      );
    }

    // Validate homeowner owns the lead
    if (bid.lead.homeownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to select this bid' },
        { status: 403 }
      );
    }

    // Validate leadId matches (extra safety check)
    if (body.leadId && body.leadId !== bid.leadId) {
      return NextResponse.json(
        { error: 'Lead ID mismatch' },
        { status: 400 }
      );
    }

    // Validate countdown has expired
    if (bid.lead.expiresAt && bid.lead.expiresAt > new Date()) {
      return NextResponse.json(
        { error: 'Cannot select winner until countdown expires' },
        { status: 403 }
      );
    }

    // Validate bid status is SUBMITTED (not already selected/rejected)
    if (bid.status !== 'SUBMITTED') {
      return NextResponse.json(
        { error: 'This bid has already been processed' },
        { status: 409 }
      );
    }

    // Check no other bid already selected for this lead
    const existingWinner = await prisma.bid.findFirst({
      where: {
        leadId: bid.leadId,
        status: 'SELECTED'
      }
    });

    if (existingWinner) {
      return NextResponse.json(
        { error: 'A winner has already been selected for this lead' },
        { status: 409 }
      );
    }

    // Use transaction to update bid statuses atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update selected bid to SELECTED
      const selectedBid = await tx.bid.update({
        where: { id: bidId },
        data: {
          status: 'SELECTED',
          selectedAt: new Date()
        }
      });

      // Update all other bids for this lead to REJECTED
      await tx.bid.updateMany({
        where: {
          leadId: bid.leadId,
          id: { not: bidId },
          status: 'SUBMITTED'
        },
        data: {
          status: 'REJECTED'
        }
      });

      // Update lead status to PURCHASED and set purchasedAt timestamp
      await tx.lead.update({
        where: { id: bid.leadId },
        data: {
          status: 'PURCHASED',
          purchasedAt: new Date()
        }
      });

      return selectedBid;
    });

    console.log('[POST /api/bids/[bidId]/select] Bid selected:', {
      bidId: result.id,
      leadId: bid.leadId,
      winnerId: bid.installer.id,
      homeownerId: session.user.id
    });

    // TODO: Trigger notifications
    // - Send email to winning installer: "Congratulations! Your bid was selected."
    // - Send email to losing installers: "Thank you for bidding. Another installer was selected."
    // await sendBidSelectedEmail(bid.installer.email, true);
    // await sendBidRejectedEmails(losingInstallers);

    return NextResponse.json({
      success: true,
      message: 'Bid selected successfully',
      selectedBidId: result.id
    });

  } catch (error) {
    console.error('[POST /api/bids/[bidId]/select] Error:', error);
    return NextResponse.json(
      { error: 'Failed to select bid' },
      { status: 500 }
    );
  }
}
