/**
 * Lead Type Definitions
 * 
 * Purpose: TypeScript types for lead management
 * Used for: API requests/responses, form validation, state management
 * 
 * Why separate from Prisma types?
 * - Prisma types include ALL database fields (including internal IDs, timestamps)
 * - These types are for API contracts (only fields we want to expose)
 * - Allows us to add computed fields or transform data
 * - Better type safety for frontend/backend communication
 */

import { Lead, LeadStatus, LeadVisibility, PurchaseStatus } from '@prisma/client';

/**
 * Lead creation data (from homeowner)
 * Used when homeowner submits a new lead request
 */
export interface CreateLeadInput {
  // Project details
  projectType: 'residential' | 'commercial';
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE';
  propertyType: string;
  postcode: string;
  location: string;
  state: string;
  address?: string;

  // Energy requirements
  energyBill: number;
  billType: 'quarterly' | 'monthly';
  roofType: string;
  budgetRange: string;
  desiredOffset: number; // 0-100

  // Preferences
  batteryRequired: boolean;
  batteryCapacity?: string;
  timeframe?: string;
  additionalNotes?: string;

  // Phone verification
  phoneNumber: string; // E.164 format

  // Quote Data (Phase 4.5: Complete instant quote calculation)
  quoteData?: any; // Complete InstantQuoteForm data + calculation results
}

/**
 * Lead with computed fields (for display)
 * Used when returning lead data to frontend
 */
export interface LeadWithDetails extends Lead {
  // Computed fields
  homeownerName: string;
  installerName?: string;
  installerCompany?: string;
  quotesCount: number;
  unreadMessagesCount: number;
  daysUntilExpiry?: number;
  
  // Nested relations
  phoneVerification?: {
    isVerified: boolean;
    phoneNumber: string;
  };
}

/**
 * Lead list item (for feed/dashboard)
 * Minimal data for list views
 */
export interface LeadListItem {
  id: string;
  projectType: string;
  quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE';
  postcode: string;
  location: string;
  state: string;
  budgetRange: string;
  batteryRequired: boolean;
  status: LeadStatus;
  leadPrice?: number;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Lead purchase request
 * Used when installer purchases a lead
 */
export interface PurchaseLeadInput {
  leadId: string;
  paymentMethodId: string; // Stripe payment method ID
}

/**
 * Lead purchase response
 * Returned after successful purchase
 */
export interface PurchaseLeadResponse {
  success: boolean;
  lead: LeadWithDetails;
  paymentIntentId: string;
  clientSecret: string; // For 3D Secure authentication
}

/**
 * Lead update input (admin only)
 * Used for admin moderation
 */
export interface UpdateLeadInput {
  status?: LeadStatus;
  visibility?: LeadVisibility;
  adminNotes?: string;
  flaggedReason?: string;
  leadPrice?: number;
}

/**
 * Lead statistics (for analytics)
 */
export interface LeadStatistics {
  total: number;
  byStatus: Record<LeadStatus, number>;
  byState: Record<string, number>;
  averageLeadPrice: number;
  conversionRate: number; // % of leads that result in quotes
  averageResponseTime: number; // Hours until first quote
}

/**
 * Lead filters (for search/filter)
 */
export interface LeadFilters {
  status?: LeadStatus[];
  visibility?: LeadVisibility[];
  state?: string[];
  postcode?: string;
  projectType?: ('residential' | 'commercial')[];
  quoteType?: ('CALL_VISIT' | 'WRITTEN_QUOTE')[];
  batteryRequired?: boolean;
  minBudget?: number;
  maxBudget?: number;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Lead sort options
 */
export type LeadSortField = 'createdAt' | 'updatedAt' | 'leadPrice' | 'postcode';
export type LeadSortOrder = 'asc' | 'desc';

export interface LeadSort {
  field: LeadSortField;
  order: LeadSortOrder;
}

/**
 * Paginated lead response
 */
export interface PaginatedLeads {
  leads: LeadListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Lead feed item with derived flags used by installer feed UI.
 * All boolean flags are server-derived (no client-side inference).
 */
export interface LeadFeedItem {
  id: string;
  quoteType: 'CALL_VISIT';
  status: LeadStatus; // APPROVED | PURCHASED subset for this feature
  leadPrice: number;
  installerId: string | null;
  purchasedAt: Date | null;
  // Derived flags
  purchasedByMe: boolean;
  purchasedByOther: boolean;
  canPurchase: boolean;
  maskedContact: boolean;
  // Contact (present only if purchasedByMe)
  contact?: {
    name: string;
    phone: string;
  } | null;
  // Optional time data
  expiresAt?: Date | null;
}

export interface PurchaseAttemptResult {
  outcome: 'success' | 'already_purchased' | 'invalid_status' | 'not_found' | 'error';
  lead?: LeadFeedItem; // Returned on success
  message?: string;
}
