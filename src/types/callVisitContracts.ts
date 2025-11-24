// Auto-mapped TypeScript contract types derived from OpenAPI specs:
//  - specs/007-call-visit-lead/contracts/purchase.openapi.json
//  - specs/007-call-visit-lead/contracts/feed.openapi.json
// These mirror the wire format (no runtime validation). Zod schemas live in validation layer.

export interface PurchasePathParams {
  id: string; // Lead UUID
}

export interface PurchaseContact {
  name: string;
  phone: string;
}

export interface PurchaseLeadPayload {
  id: string;
  status: 'PURCHASED';
  installerId: string;
  purchasedAt: string; // ISO date-time
  leadPrice: number;
  maskedContact?: boolean; // always false on success per spec example
  contact?: PurchaseContact; // present & unmasked on success
}

export interface Purchase200Response {
  lead: PurchaseLeadPayload;
}

export interface PurchaseErrorResponse {
  error: 'already_purchased' | 'invalid_status' | string; // 409 / 400 examples
}

// Feed contracts
export interface FeedQueryParams {
  page?: number; // default 1
  limit?: number; // default 25, max 100
  quoteType: 'CALL_VISIT';
}

export interface FeedContact {
  name: string;
  phone: string;
}

export interface FeedItem {
  id: string;
  status: 'APPROVED' | 'PURCHASED';
  quoteType: 'CALL_VISIT';
  leadPrice: number;
  installerId: string | null;
  purchasedAt: string | null; // ISO date-time or null
  purchasedByMe: boolean;
  purchasedByOther: boolean;
  canPurchase: boolean;
  maskedContact: boolean;
  contact?: FeedContact | null; // null or object based on masking
}

export interface Feed200Response {
  page: number;
  limit: number;
  total: number;
  items: FeedItem[];
}

// Unified discriminated union for internal service mapping (purchase attempt)
export type PurchaseAttemptOutcome =
  | { outcome: 'success'; lead: FeedItem }
  | { outcome: 'already_purchased'; message?: string }
  | { outcome: 'invalid_status'; message?: string }
  | { outcome: 'not_found'; message?: string }
  | { outcome: 'error'; message?: string };

// Helper guards (minimal; optional usage)
export function isPurchaseSuccess(o: PurchaseAttemptOutcome): o is { outcome: 'success'; lead: FeedItem } {
  return o.outcome === 'success';
}

export function isPurchaseConflict(o: PurchaseAttemptOutcome): o is { outcome: 'already_purchased'; message?: string } {
  return o.outcome === 'already_purchased';
}
