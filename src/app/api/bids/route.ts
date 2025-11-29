/**
 * Bid Submission API
 * 
 * POST /api/bids - Installer submits bid for a bidding lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/bids
 * Installer submits a bid for a lead
 * 
 * @access Installer only
 * @body BidSubmissionRequest (leadId, amount, capacity, equipment, GST, incentive)
 * @returns 201 Created + Bid ID
 * @errors 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error
 */
export async function POST(request: NextRequest) {
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
    if (session.user.role !== 'INSTALLER') {
      return NextResponse.json(
        { error: 'Only installers can submit bids' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.leadId || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, amount' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Bid amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Fetch lead with validation
    const lead = await prisma.lead.findUnique({
      where: { id: body.leadId },
      include: {
        homeowner: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Validate lead is BIDDING type
    if (lead.quoteType !== 'BIDDING') {
      return NextResponse.json(
        { error: 'This lead is not a bidding lead' },
        { status: 403 }
      );
    }

    // Validate countdown not expired
    if (lead.expiresAt && lead.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Bidding countdown has expired' },
        { status: 403 }
      );
    }

    // Check for duplicate bid from same installer
    const existingBid = await prisma.bid.findUnique({
      where: {
        leadId_installerId: {
          leadId: body.leadId,
          installerId: session.user.id
        }
      }
    });

    if (existingBid) {
      return NextResponse.json(
        { error: 'You have already submitted a bid for this lead' },
        { status: 403 }
      );
    }

    // Calculate financial totals
    const includeGst = body.includeGst !== undefined ? body.includeGst : true;
    const gstPercent = body.gstPercent || 10.0;
    const includeIncentive = body.includeIncentive || false;
    const incentiveAmount = body.incentiveAmount || 0;

    const gstAmount = includeGst ? (body.amount * (gstPercent / 100)) : 0;
    const finalTotal = body.amount + gstAmount - incentiveAmount;

    // Create bid record
    const bid = await prisma.bid.create({
      data: {
        leadId: body.leadId,
        installerId: session.user.id,
        amount: body.amount,
        capacityOffer: body.capacityOffer || null,
        expectedInstallDate: body.expectedInstallDate ? new Date(body.expectedInstallDate) : null,
        notes: body.notes || null,
        panelBrand: body.panelBrand || null,
        inverterBrand: body.inverterBrand || null,
        batteryBrand: body.batteryBrand || null,
        batteryCapacity: body.batteryCapacity || null,
        includeGst,
        gstPercent,
        gstAmount,
        includeIncentive,
        incentiveAmount,
        finalTotal,
        status: 'SUBMITTED'
      }
    });

    // TODO: Trigger notification to homeowner
    console.log('[POST /api/bids] Bid submitted:', {
      bidId: bid.id,
      leadId: lead.id,
      installerId: session.user.id,
      amount: bid.amount,
      finalTotal: bid.finalTotal
    });

    // TODO: Send email notification to homeowner
    // await sendBidSubmittedEmail(lead.homeowner.email, lead.location);

    return NextResponse.json(
      {
        success: true,
        bidId: bid.id,
        message: 'Bid submitted successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[POST /api/bids] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit bid' },
      { status: 500 }
    );
  }
}
