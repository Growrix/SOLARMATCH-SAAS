/**
 * Lead Detail API Route
 * 
 * GET /api/leads/[id] - Get single lead details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLeadById } from '@/lib/services/lead-service';

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
