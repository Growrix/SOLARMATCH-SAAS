/**
 * PATCH /api/leads/[id]/cancel
 * 
 * Purpose: Cancel a lead and restore quota
 * Authorization: Requires authenticated homeowner who owns the lead
 * Business Logic:
 * - Lead status changes to CANCELLED
 * - Homeowner's quota balance is restored (+1)
 * - Cannot cancel if lead has been purchased by installer
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth-config';
import { cancelLead } from '@/lib/services/lead-service';
import { z } from 'zod';

// Validation schema for cancel request
const cancelLeadSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required'),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Only homeowners can cancel leads
    if (session.user.role !== 'HOMEOWNER') {
      return NextResponse.json(
        { error: 'Forbidden. Only homeowners can cancel leads.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    const body = await req.json();

    // Validate request body
    const validationResult = cancelLeadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Get request metadata
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Cancel lead
    const cancelledLead = await cancelLead(
      leadId,
      session.user.id,
      validationResult.data.reason,
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: 'Lead cancelled successfully. Your quota has been restored.',
      lead: {
        id: cancelledLead.id,
        quoteType: cancelledLead.quoteType,
        status: cancelledLead.status,
        cancelledAt: cancelledLead.cancelledAt,
        cancelledReason: cancelledLead.cancelledReason,
      },
      quotaRestored: true,
    });

  } catch (error: any) {
    console.error('Error cancelling lead:', error);

    // Handle specific business logic errors
    if (error.message === 'Lead not found') {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    if (error.message === 'Unauthorized: You can only cancel your own leads') {
      return NextResponse.json(
        { error: 'Unauthorized. This lead does not belong to you.' },
        { status: 403 }
      );
    }

    if (error.message === 'Lead cannot be cancelled after installer purchase') {
      return NextResponse.json(
        { error: 'Lead cannot be cancelled after installer purchase' },
        { status: 403 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Failed to cancel lead. Please try again.' },
      { status: 500 }
    );
  }
}
