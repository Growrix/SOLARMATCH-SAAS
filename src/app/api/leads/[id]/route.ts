/**
 * Lead Detail API Route
 * 
 * GET /api/leads/[id] - Get single lead details
 * PATCH /api/leads/[id] - Update lead (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLeadById } from '@/lib/services/lead-service';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/services/audit-logger';

/**
 * GET /api/leads/[id]
 * Get single lead details
 * 
 * @access Authenticated users (role-based visibility)
 * @param id - Lead ID
 * @returns 200 OK + Lead object (with role-based field filtering)
 * @errors 401 Unauthorized, 403 Forbidden, 404 Not Found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const leadId = params.id;

    // Get lead via service (handles role-based visibility and field filtering)
    const lead = await getLeadById({
      leadId,
      userId: session.user.id,
      userRole: session.user.role,
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { lead },
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [GET /api/leads/${params.id}] Error:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/leads/[id]
 * Update lead details (admin only - price and notes)
 * 
 * @access Admin only
 * @param id - Lead ID
 * @body { leadPrice?: number, adminNotes?: string }
 * @returns 200 OK + Updated lead
 * @errors 401 Unauthorized, 403 Forbidden, 404 Not Found, 400 Bad Request
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    const body = await request.json();

    // Validate lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.leadPrice !== undefined) {
      const price = parseFloat(body.leadPrice);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Invalid lead price' },
          { status: 400 }
        );
      }
      updateData.leadPrice = price;
    }

    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes;
    }

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
      include: {
        homeowner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneVerified: true,
          },
        },
        installer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'LEAD_UPDATED',
      entityType: 'lead',
      entityId: leadId,
      metadata: {
        updatedFields: Object.keys(updateData),
        leadPrice: body.leadPrice,
        adminNotes: body.adminNotes ? 'Updated' : undefined,
      },
    });

    console.log(`✅ [PATCH /api/leads/${leadId}] Lead updated by admin:`, session.user.id);

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error(`❌ [PATCH /api/leads/${params.id}] Error:`, error);
    
    return NextResponse.json(
      { error: 'Failed to update lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
