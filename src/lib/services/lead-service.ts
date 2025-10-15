/**
 * Lead Service
 * 
 * Purpose: Business logic for lead management
 * Used for: Lead creation, validation, listing, status updates
 * 
 * Responsibilities:
 * - Validate lead data before creation
 * - Track lead submission counts
 * - Enforce verification requirements
 * - Handle role-based filtering
 * - Integrate with audit logging
 * - Trigger notifications
 */

import { prisma } from '@/lib/prisma';
import { LeadStatus, LeadVisibility, UserRole } from '@prisma/client';
import { createAuditLog, AUDIT_ACTIONS } from './audit-logger';
import { createNotification } from './notification-service';
import { getSetting, getSettingAsNumber } from './settings-service';

/**
 * Create Lead Input
 */
export interface CreateLeadInput {
  homeownerId: string;
  quoteData?: any; // InstantQuote calculation results
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE';
  propertyAddress?: string;
  propertyPostcode: string;
  location: string;
  state: string;
  propertyType: string;
  roofType?: string;
  energyBill: number;
  billType: string;
  budgetRange?: string;
  desiredOffset?: number;
  batteryRequired?: boolean;
  batteryCapacity?: string;
  timeframe?: string;
  additionalNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create Lead Result
 */
export interface CreateLeadResult {
  lead?: any;
  requiresVerification?: boolean;
  limitReached?: boolean;
  leadSubmissionCount: number;
}

/**
 * Create a new lead
 * 
 * @param input - Lead creation data
 * @returns Lead object or error status
 * 
 * Example:
 *   const result = await createLead({
 *     homeownerId: 'user123',
 *     quoteType: 'CALL_VISIT',
 *     propertyPostcode: '2000',
 *     location: 'Sydney',
 *     ...
 *   });
 */
export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  // Fetch homeowner with current submission count
  const homeowner = await prisma.user.findUnique({
    where: { id: input.homeownerId },
    select: {
      id: true,
      phoneVerified: true,
      leadSubmissionCount: true,
    },
  });

  if (!homeowner) {
    throw new Error('Homeowner not found');
  }

  const currentCount = homeowner.leadSubmissionCount;

  // Get max submission limits from settings
  const maxBeforeVerification = await getSettingAsNumber('MAX_LEAD_SUBMISSIONS_BEFORE_VERIFICATION');
  const maxTotal = await getSettingAsNumber('MAX_LEAD_SUBMISSIONS_TOTAL');

  // Check if phone verification is required
  if (!homeowner.phoneVerified && currentCount >= maxBeforeVerification) {
    return {
      requiresVerification: true,
      leadSubmissionCount: currentCount,
    };
  }

  // Check if total limit reached (even after verification)
  if (currentCount >= maxTotal) {
    return {
      limitReached: true,
      leadSubmissionCount: currentCount,
    };
  }

  // Get default pricing from settings
  const priceKey = input.quoteType === 'CALL_VISIT'
    ? 'LEAD_PRICE_CALL_VISIT'
    : 'LEAD_PRICE_WRITTEN_QUOTE';
  const defaultPrice = await getSettingAsNumber(priceKey);

  // Calculate lead expiry date
  const expiryDays = await getSettingAsNumber('LEAD_EXPIRY_DAYS');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  // Create lead in database
  const lead = await prisma.lead.create({
    data: {
      homeownerId: input.homeownerId,
      projectType: input.propertyType,
      propertyType: input.propertyType,
      postcode: input.propertyPostcode,
      location: input.location,
      state: input.state,
      address: input.propertyAddress,
      energyBill: input.energyBill,
      billType: input.billType,
      roofType: input.roofType || 'unknown',
      budgetRange: input.budgetRange || 'unknown',
      desiredOffset: input.desiredOffset || 100,
      batteryRequired: input.batteryRequired || false,
      batteryCapacity: input.batteryCapacity,
      timeframe: input.timeframe,
      additionalNotes: input.additionalNotes,
      leadPrice: defaultPrice,
      expiresAt,
      status: LeadStatus.DRAFT, // Start as DRAFT until phone verified
      visibility: LeadVisibility.HIDDEN, // Hidden until approved by admin
      quoteData: input.quoteData || null, // Phase 4.5: Store complete instant quote data
    },
    include: {
      homeowner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          phoneVerified: true,
        },
      },
    },
  });

  // Increment lead submission count
  await prisma.user.update({
    where: { id: input.homeownerId },
    data: { leadSubmissionCount: currentCount + 1 },
  });

  // Log audit trail
  await createAuditLog({
    action: AUDIT_ACTIONS.LEAD_CREATED,
    entityType: 'lead',
    entityId: lead.id,
    leadId: lead.id,
    userId: input.homeownerId,
    metadata: {
      quoteType: input.quoteType,
      postcode: input.propertyPostcode,
      location: input.location,
      leadPrice: defaultPrice,
    },
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  // Send notification to admin
  const adminEmail = await getSetting('ADMIN_EMAIL');
  await createNotification({
    userId: adminEmail, // Will lookup admin user by email
    type: 'NEW_LEAD',
    title: 'New Lead Submitted',
    message: `New ${input.quoteType} lead in ${input.location} (${input.propertyPostcode})`,
    actionUrl: `/admin/leads/${lead.id}`,
    metadata: {
      leadId: lead.id,
      quoteType: input.quoteType,
      postcode: input.propertyPostcode,
    },
  });

  return {
    lead,
    leadSubmissionCount: currentCount + 1,
  };
}

/**
 * Get Leads Input
 */
export interface GetLeadsInput {
  userId: string;
  userRole: string;
  filters: {
    status?: string;
    quoteType?: string;
    postcode?: string;
    page: number;
    limit: number;
  };
}

/**
 * Get leads with role-based filtering
 * 
 * @param input - User ID, role, and filters
 * @returns Paginated list of leads
 * 
 * Role-based visibility:
 * - HOMEOWNER: Only their own leads
 * - INSTALLER: Only approved/available leads + their purchased leads
 * - ADMIN: All leads
 */
export async function getLeads(input: GetLeadsInput) {
  const { userId, userRole, filters } = input;
  const { page, limit, status, quoteType, postcode } = filters;

  const skip = (page - 1) * limit;

  // Build where clause based on role
  let whereClause: any = {};

  if (userRole === 'HOMEOWNER') {
    // Homeowners see only their own leads
    whereClause.homeownerId = userId;
  } else if (userRole === 'INSTALLER') {
    // Installers see:
    // 1. Approved leads they haven't purchased (PUBLIC visibility)
    // 2. Leads they have purchased
    whereClause.OR = [
      {
        visibility: LeadVisibility.PUBLIC,
        installerId: null, // Not yet purchased
      },
      {
        installerId: userId, // Their purchased leads
      },
    ];
  }
  // ADMIN sees all leads (no filter)

  // Apply additional filters
  if (status) {
    whereClause.status = status as LeadStatus;
  }
  if (quoteType) {
    whereClause.projectType = quoteType === 'CALL_VISIT' ? 'residential' : 'commercial';
  }
  if (postcode) {
    whereClause.postcode = postcode;
  }

  // Fetch leads with pagination
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
            companyName: true,
            email: true,
          },
        },
      },
    }),
    prisma.lead.count({ where: whereClause }),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get Lead By ID Input
 */
export interface GetLeadByIdInput {
  leadId: string;
  userId: string;
  userRole: string;
}

/**
 * Get single lead by ID with role-based visibility
 * 
 * @param input - Lead ID, user ID, and role
 * @returns Lead object or null if not found/unauthorized
 * 
 * Visibility rules:
 * - HOMEOWNER: Only if they own the lead
 * - INSTALLER: Only if lead is public or they purchased it
 * - ADMIN: Always visible
 */
export async function getLeadById(input: GetLeadByIdInput) {
  const { leadId, userId, userRole } = input;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      homeowner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          phoneVerified: true,
        },
      },
      installer: {
        select: {
          id: true,
          name: true,
          companyName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!lead) {
    return null;
  }

  // Check access based on role
  if (userRole === 'HOMEOWNER' && lead.homeownerId !== userId) {
    return null; // Homeowners can only see their own leads
  }

  if (userRole === 'INSTALLER') {
    // Installers can see:
    // 1. PUBLIC leads (not yet purchased)
    // 2. Leads they have purchased
    const canAccess =
      (lead.visibility === LeadVisibility.PUBLIC && !lead.installerId) ||
      lead.installerId === userId;

    if (!canAccess) {
      return null;
    }

    // Hide sensitive homeowner details if not purchased
    if (lead.installerId !== userId) {
      // Mask contact details for unpurchased leads
      lead.homeowner.phone = 'HIDDEN';
      lead.homeowner.email = `${lead.homeowner.email[0]}***@***`;
      if (lead.address) {
        lead.address = `${lead.location}, ${lead.state}`; // Hide exact address
      }
    }
  }

  return lead;
}
