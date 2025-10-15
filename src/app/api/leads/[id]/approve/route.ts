/**
 * Lead Approval API Route
 * 
 * POST /api/leads/[id]/approve - Admin approves lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/services/audit-logger';
import { createNotification } from '@/lib/services/notification-service';
import { transitionLeadStatus } from '@/lib/services/lead-state';
import { getSettingAsNumber } from '@/lib/services/settings-service';

/**
 * POST /api/leads/[id]/approve
 * Admin approves a lead
 * 
 * @access Admin only
 * @param id - Lead ID
 * @body { price?: number, assignTo?: 'ALL' | string[], isHot?: boolean }
 * @returns 200 OK + Updated lead
 * @errors 401 Unauthorized, 403 Forbidden, 404 Not Found, 400 Bad Request
 */
export async function POST(
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

    const { id } = params;
    const body = await request.json();

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        homeowner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Validate status transition (DRAFT/PENDING_APPROVAL → APPROVED)
    const validStatuses = ['DRAFT', 'PENDING_APPROVAL', 'PENDING_PHONE'];
    if (!validStatuses.includes(lead.status)) {
      return NextResponse.json(
        { error: `Cannot approve lead with status ${lead.status}` },
        { status: 400 }
      );
    }

    // Get default lead price if not provided
    const leadPrice = body.price || lead.leadPrice || await getSettingAsNumber('lead_price_default');

    // Determine visibility based on assignment
    const visibility = body.assignTo === 'ALL' ? 'PUBLIC' : 'PRIVATE';

    // Set expiry date (default 30 days from now)
    const expiryDays = await getSettingAsNumber('lead_expiry_days');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    // Update lead with approval
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: 'APPROVED',
        visibility,
        leadPrice,
        approvedAt: new Date(),
        expiresAt,
        moderatedBy: session.user.id,
        moderatedAt: new Date(),
        ...(body.isHot !== undefined && { 
          adminNotes: body.isHot ? 'HOT LEAD - Priority' : lead.adminNotes 
        }),
      },
      include: {
        homeowner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.LEAD_APPROVED,
      entityType: 'lead',
      entityId: id,
      metadata: {
        previousStatus: lead.status,
        newStatus: 'APPROVED',
        leadPrice,
        visibility,
        isHot: body.isHot || false,
        assignTo: body.assignTo || 'ALL',
      },
    });

    // Notify homeowner
    await createNotification({
      userId: lead.homeowner.id,
      type: 'LEAD_APPROVED',
      title: 'Lead Approved!',
      message: 'Your quote request has been approved and is now visible to installers.',
      actionUrl: `/homeowner/leads/${id}`,
      metadata: {
        leadId: id,
        entityType: 'lead',
      },
    });

    // Notify assigned installers (if specific assignment)
    if (body.assignTo && body.assignTo !== 'ALL' && Array.isArray(body.assignTo)) {
      for (const installerId of body.assignTo) {
        await createNotification({
          userId: installerId,
          type: 'NEW_LEAD',
          title: 'New Lead Available',
          message: `A new ${body.isHot ? 'HOT ' : ''}lead has been assigned to you.`,
          actionUrl: `/installer/marketplace`,
          metadata: {
            leadId: id,
            entityType: 'lead',
            isHot: body.isHot || false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });

  } catch (error) {
    console.error('Error approving lead:', error);
    return NextResponse.json(
      { error: 'Failed to approve lead' },
      { status: 500 }
    );
  }
}
