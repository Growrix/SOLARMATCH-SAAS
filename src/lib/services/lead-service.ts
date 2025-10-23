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
import { LeadStatus, LeadVisibility, PurchaseStatus, UserRole } from '@prisma/client';
import { createAuditLog, AUDIT_ACTIONS } from './audit-logger';
import { createNotification } from './notification-service';
import { getSetting, getSettingAsNumber } from './settings-service';

/**
 * Create Lead Input
 */
export interface CreateLeadInput {
  homeownerId: string;
  quoteData?: any; // InstantQuote calculation results
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING';
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
  quoteLimit: number;
  remainingLeadAllowance: number;
}

export interface HomeownerLeadSummaryItem {
  id: string;
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING';
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  leadPrice: number | null;
  purchaseStatus: PurchaseStatus | null;
  purchasedAt: Date | null;
  visibility: LeadVisibility;
  quoteData: any | null; // Preserve instant quote inputs for pre-fill experiences
  phoneVerified: boolean; // Phone verification status for homeowner
  expiresAt: Date | null; // Countdown timer expiry timestamp
}

export interface HomeownerLeadSummary {
  totalSubmitted: number;
  quoteLimit: number;
  remainingLeadAllowance: number;
  biddingLeadsSubmitted: number; // T263: Track BIDDING quota usage (max 1)
  biddingQuotaRemaining: number; // T263: Remaining BIDDING quota (0 or 1)
  phoneVerified: boolean;
  requiresVerification: boolean;
  verificationThreshold: number;
  lastSubmissionAt: Date | null;
  statusBreakdown: Record<LeadStatus, number>;
  recentLeads: HomeownerLeadSummaryItem[];
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
  // Fetch homeowner with current submission count and phone verification status
  const homeowner = await prisma.user.findUnique({
    where: { id: input.homeownerId },
    select: {
      id: true,
      phone: true, // Phase 4.13: For copying to lead
      phoneVerified: true, // Phase 4.13: For copying to lead
      leadSubmissionCount: true,
      leadSubmissionLimit: true,
    },
  }) as any; // Type assertion to work around Prisma type cache
  
  // Manually add biddingLeadsSubmitted since type cache hasn't updated
  const homeownerWithBidding = homeowner as typeof homeowner & { biddingLeadsSubmitted: number };

  if (!homeowner) {
    throw new Error('Homeowner not found');
  }

  const currentCount = homeowner.leadSubmissionCount;

  // Check BIDDING quota limit (max 1 per user)
  if (input.quoteType === 'BIDDING') {
    if (homeownerWithBidding.biddingLeadsSubmitted >= 1) {
      throw new Error('BIDDING quota exceeded. You can only create 1 bidding quote per account.');
    }
  }


  // Get max submission limits from settings
  const maxBeforeVerification = await getSettingAsNumber('MAX_LEAD_SUBMISSIONS_BEFORE_VERIFICATION');
  const submissionLimit = homeowner.leadSubmissionLimit ?? await getSettingAsNumber('MAX_LEAD_SUBMISSIONS_TOTAL');

  // Check if phone verification is required
  if (!homeowner.phoneVerified && currentCount >= maxBeforeVerification) {
    return {
      requiresVerification: true,
      leadSubmissionCount: currentCount,
      quoteLimit: submissionLimit,
      remainingLeadAllowance: Math.max(submissionLimit - currentCount, 0),
    };
  }

  // Check if total limit reached (even after verification)
  if (currentCount >= submissionLimit) {
    return {
      limitReached: true,
      leadSubmissionCount: currentCount,
      quoteLimit: submissionLimit,
      remainingLeadAllowance: 0,
    };
  }

  // Get default pricing from settings
  let priceKey: string;
  if (input.quoteType === 'CALL_VISIT') {
    priceKey = 'LEAD_PRICE_CALL_VISIT';
  } else if (input.quoteType === 'WRITTEN_QUOTE') {
    priceKey = 'LEAD_PRICE_WRITTEN_QUOTE';
  } else {
    priceKey = 'LEAD_PRICE_BIDDING'; // For BIDDING type
  }
  const defaultPrice = await getSettingAsNumber(priceKey);

  // Calculate lead expiry date
  const expiryDays = await getSettingAsNumber('LEAD_EXPIRY_DAYS');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  // Create lead in database
  const lead = await prisma.lead.create({
    data: {
      homeownerId: input.homeownerId,
      quoteType: input.quoteType as any, // Type assertion for BIDDING enum
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
      status: LeadStatus.PENDING_APPROVAL, // Show in dashboards immediately, awaiting admin approval
      visibility: LeadVisibility.HIDDEN, // Visible to homeowner/admin, hidden from installers until approved
      quoteData: input.quoteData || null, // Phase 4.5: Store complete instant quote data
      phoneVerified: homeowner?.phoneVerified || false, // Phase 4.13: Copy verification status from homeowner
      phoneNumber: homeowner?.phone || null, // Phase 4.13: Copy phone number from homeowner
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
  const updateData: any = { leadSubmissionCount: currentCount + 1 };
  
  // Increment BIDDING counter if this is a bidding lead
  if (input.quoteType === 'BIDDING') {
    updateData.biddingLeadsSubmitted = { increment: 1 };
  }
  
  await prisma.user.update({
    where: { id: input.homeownerId },
    data: updateData,
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
    quoteLimit: submissionLimit,
    remainingLeadAllowance: Math.max(submissionLimit - (currentCount + 1), 0),
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
    marketplace?: boolean;
    purchased?: boolean;
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
  const { page, limit, status, quoteType, postcode, marketplace, purchased } = filters;

  const skip = (page - 1) * limit;

  // Build where clause based on role
  let whereClause: any = {};

  if (userRole === 'HOMEOWNER') {
    // Homeowners see only their own leads
    whereClause.homeownerId = userId;
  } else if (userRole === 'INSTALLER') {
    // Handle marketplace filter (available leads only)
    if (marketplace) {
      whereClause.visibility = LeadVisibility.PUBLIC;
      whereClause.purchaseStatus = 'AVAILABLE';
      whereClause.installerId = null; // Not yet purchased
    } 
    // Handle purchased filter (purchased leads only)
    else if (purchased) {
      whereClause.installerId = userId; // Their purchased leads
      whereClause.purchaseStatus = 'PURCHASED';
    }
    // Default: Show both available and purchased leads
    else {
      whereClause.OR = [
        {
          visibility: LeadVisibility.PUBLIC,
          purchaseStatus: 'AVAILABLE',
          installerId: null, // Not yet purchased
        },
        {
          installerId: userId, // Their purchased leads
        },
      ];
    }
  }
  // ADMIN sees all leads (no filter)

  // Apply additional filters
  if (status) {
    whereClause.status = status as LeadStatus;
  }
  if (quoteType) {
  whereClause.quoteType = quoteType as 'CALL_VISIT' | 'WRITTEN_QUOTE';
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
      select: {
        id: true,
        status: true,
        visibility: true,
        phoneVerified: true, // Phase 4.13: Include lead verification status
        phoneNumber: true, // Phase 4.13: Include lead phone number
        quoteType: true,
        postcode: true,
        location: true,
        energyBill: true,
        leadPrice: true,
        createdAt: true,
        approvedAt: true,
        expiresAt: true, // Countdown timer feature
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
 * Build homeowner dashboard summary including quota metadata and recent leads.
 */
export async function getHomeownerLeadSummary(userId: string): Promise<HomeownerLeadSummary> {
  const homeowner = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phoneVerified: true,
      leadSubmissionCount: true,
      leadSubmissionLimit: true,
      biddingLeadsSubmitted: true, // T263: Fetch BIDDING quota usage
    },
  });
  
  if (!homeowner) {
    throw new Error('Homeowner not found');
  }

  const [verificationThreshold, recentLeads, groupedStatuses] = await Promise.all([
    getSettingAsNumber('MAX_LEAD_SUBMISSIONS_BEFORE_VERIFICATION'),
    prisma.lead.findMany({
      where: { homeownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        quoteType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        leadPrice: true,
        purchaseStatus: true,
        purchasedAt: true,
        visibility: true,
        quoteData: true,
        expiresAt: true, // Countdown timer feature
        phoneVerified: true, // For verification status
      },
    }),
    prisma.lead.groupBy({
      by: ['status'],
      where: { homeownerId: userId },
      _count: {
        status: true,
      },
    }),
  ]);

  const quoteLimit = homeowner.leadSubmissionLimit ?? await getSettingAsNumber('MAX_LEAD_SUBMISSIONS_TOTAL');
  const remainingLeadAllowance = Math.max(quoteLimit - homeowner.leadSubmissionCount, 0);
  const biddingQuotaRemaining = Math.max(1 - homeowner.biddingLeadsSubmitted, 0); // T263: Calculate from actual field
  const requiresVerification = !homeowner.phoneVerified && homeowner.leadSubmissionCount >= verificationThreshold;

  const statusBreakdown = Object.values(LeadStatus).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<LeadStatus, number>);

  for (const group of groupedStatuses) {
    statusBreakdown[group.status as LeadStatus] = group._count.status;
  }

  return {
    totalSubmitted: homeowner.leadSubmissionCount,
    quoteLimit,
    remainingLeadAllowance,
    biddingLeadsSubmitted: homeowner.biddingLeadsSubmitted, // T263: Return BIDDING usage count
    biddingQuotaRemaining, // T263: Return remaining BIDDING quota (0 or 1)
    phoneVerified: homeowner.phoneVerified,
    requiresVerification,
    verificationThreshold,
    lastSubmissionAt: recentLeads.length > 0 ? recentLeads[0].createdAt : null,
    statusBreakdown,
    recentLeads: recentLeads.map(lead => ({
      id: lead.id,
      quoteType: lead.quoteType as 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING',
      status: lead.status,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      leadPrice: lead.leadPrice,
      purchaseStatus: lead.purchaseStatus,
      purchasedAt: lead.purchasedAt,
      visibility: lead.visibility,
      quoteData: lead.quoteData,
      phoneVerified: lead.phoneVerified,
      expiresAt: lead.expiresAt,
    })),
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
          leadSubmissionLimit: true,
          leadSubmissionCount: true,
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

/**
 * Check if a lead can be edited
 * 
 * @param lead - Lead object
 * @returns True if lead can be edited (status is PENDING_APPROVAL)
 * 
 * Business Rule: Only leads awaiting admin approval can be edited.
 * After approval (APPROVED) or purchase (PURCHASED), editing is disabled.
 */
export function canEditLead(lead: { status: LeadStatus }): boolean {
  return lead.status === LeadStatus.PENDING_APPROVAL;
}

/**
 * Check if a lead can be cancelled
 * 
 * @param lead - Lead object
 * @returns True if lead can be cancelled (not PURCHASED)
 * 
 * Business Rule: Leads can be cancelled unless they've been purchased by an installer.
 * Cancelling restores 1 quota to the homeowner's balance.
 */
export function canCancelLead(lead: { status: LeadStatus }): boolean {
  return lead.status !== LeadStatus.PURCHASED;
}

/**
 * Update Lead Input
 */
export interface UpdateLeadInput {
  // Location fields
  propertyAddress?: string;
  propertyPostcode?: string;
  location?: string;
  state?: string;
  propertyType?: string;
  
  // Energy usage
  energyBill?: number;
  billType?: string;
  
  // Property details
  roofType?: string;
  budgetRange?: string;
  panelOrientation?: string;
  roofTilt?: string;
  shadingLevel?: string;
  usagePattern?: string;
  
  // System preferences
  desiredOffset?: number;
  hasExistingSystem?: boolean;
  existingSystemSize?: string;
  timeframe?: string;
  
  // Battery storage
  batteryRequired?: boolean;
  batteryCapacity?: string;
  batteryBrand?: string;
  batteryUsage?: string;
  backupCritical?: string;
  includeVPP?: boolean;
  
  // Additional features
  includeEVCharging?: boolean;
  includeSmartHome?: boolean;
  includeGridServices?: boolean;
  
  // Equipment preferences
  panelBrand?: string;
  systemSizeOverride?: string;
  includeOptimizers?: boolean;
  includeMicroinverters?: boolean;
  
  // Tariff details
  retailer?: string;
  tariffPlan?: string;
  customRetailRate?: number;
  customFeedInRate?: number;
  
  // Commercial fields
  peakDemand?: number;
  isThreePhase?: boolean;
  projectPriority?: string;
  
  // Additional notes (optional)
  additionalNotes?: string;
  
  // Complete form data
  quoteData?: any;
}

/**
 * Update an existing lead
 * 
 * @param leadId - Lead ID
 * @param userId - User ID (for authorization)
 * @param input - Updated lead data
 * @returns Updated lead object
 * 
 * Validations:
 * - Lead must exist
 * - User must be the lead owner
 * - Lead status must be PENDING_APPROVAL (cannot edit after approval)
 * 
 * Example:
 *   const updated = await updateLead('lead123', 'user456', {
 *     energyBill: 500,
 *     batteryRequired: true
 *   });
 */
export async function updateLead(
  leadId: string,
  userId: string,
  input: UpdateLeadInput,
  ipAddress?: string,
  userAgent?: string
) {
  // Fetch existing lead
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      homeownerId: true,
      status: true,
      quoteType: true,
      postcode: true,
      location: true,
    },
  });

  if (!existingLead) {
    throw new Error('Lead not found');
  }

  // Verify ownership
  if (existingLead.homeownerId !== userId) {
    throw new Error('Unauthorized: You can only edit your own leads');
  }

  // Verify editable status
  if (!canEditLead(existingLead)) {
    throw new Error('Lead cannot be edited after admin approval');
  }

  // Update lead in database
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      address: input.propertyAddress,
      postcode: input.propertyPostcode,
      location: input.location,
      state: input.state,
      propertyType: input.propertyType,
      projectType: input.propertyType,
      roofType: input.roofType,
      energyBill: input.energyBill,
      billType: input.billType,
      budgetRange: input.budgetRange,
      desiredOffset: input.desiredOffset,
      batteryRequired: input.batteryRequired,
      batteryCapacity: input.batteryCapacity,
      timeframe: input.timeframe,
      additionalNotes: input.additionalNotes,
      quoteData: input.quoteData,
      updatedAt: new Date(),
    },
    include: {
      homeowner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  // Log audit trail
  await createAuditLog({
    action: AUDIT_ACTIONS.LEAD_CREATED, // Using LEAD_CREATED for updates as LEAD_UPDATED doesn't exist
    entityType: 'lead',
    entityId: leadId,
    leadId: leadId,
    userId: userId,
    metadata: {
      updatedFields: Object.keys(input),
      quoteType: existingLead.quoteType,
      postcode: input.propertyPostcode || existingLead.postcode,
    },
    ipAddress,
    userAgent,
  });

  return updatedLead;
}

/**
 * Cancel a lead
 * 
 * @param leadId - Lead ID
 * @param userId - User ID (for authorization)
 * @param reason - Cancellation reason
 * @returns Cancelled lead object
 * 
 * Business Logic:
 * - Lead status changes to CANCELLED
 * - Homeowner's quota balance is restored (+1)
 * - Cancellation is logged with timestamp, reason, and user
 * - Cannot cancel if lead has been purchased by installer
 * 
 * Example:
 *   const cancelled = await cancelLead('lead123', 'user456', 'Changed my mind');
 */
export async function cancelLead(
  leadId: string,
  userId: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Fetch existing lead
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      homeownerId: true,
      status: true,
      quoteType: true,
      postcode: true,
      location: true,
    },
  });

  if (!existingLead) {
    throw new Error('Lead not found');
  }

  // Verify ownership
  if (existingLead.homeownerId !== userId) {
    throw new Error('Unauthorized: You can only cancel your own leads');
  }

  // Verify cancellable status
  if (!canCancelLead(existingLead)) {
    throw new Error('Lead cannot be cancelled after installer purchase');
  }

  // Update lead status to CANCELLED
  // @ts-ignore - Prisma type cache issue with new cancellation fields
  const cancelledLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: LeadStatus.CANCELLED,
      cancelledBy: userId,
      updatedAt: new Date(),
      cancelledAt: new Date(),
      cancelledReason: reason,
    },
    include: {
      homeowner: {
        select: {
          id: true,
          name: true,
          email: true,
          leadSubmissionCount: true,
          leadSubmissionLimit: true,
        },
      },
    },
  });

  // Restore quota to homeowner (decrement submission count)
  await prisma.user.update({
    where: { id: existingLead.homeownerId },
    data: {
      leadSubmissionCount: {
        decrement: 1,
      },
    },
  });

  // Log audit trail
  await createAuditLog({
    action: AUDIT_ACTIONS.LEAD_CANCELLED,
    entityType: 'lead',
    entityId: leadId,
    leadId: leadId,
    userId: userId,
    metadata: {
      reason,
      quoteType: existingLead.quoteType,
      postcode: existingLead.postcode,
      location: existingLead.location,
      quotaRestored: true,
    },
    ipAddress,
    userAgent,
  });

  return cancelledLead;
}

