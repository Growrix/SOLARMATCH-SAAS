import { z } from 'zod';

// Request params
export const purchaseParamsSchema = z.object({
  id: z.string().min(1)
});

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  quoteType: z.literal('CALL_VISIT').default('CALL_VISIT')
});

// Shared feed item + contact schemas
const contactSchema = z.object({
  name: z.string(),
  phone: z.string()
});

export const leadFeedItemSchema = z.object({
  id: z.string(),
  quoteType: z.literal('CALL_VISIT'),
  status: z.enum(['APPROVED','PURCHASED']),
  leadPrice: z.number(),
  installerId: z.string().nullable(),
  purchasedAt: z.date().nullable(),
  purchasedByMe: z.boolean(),
  purchasedByOther: z.boolean(),
  canPurchase: z.boolean(),
  maskedContact: z.boolean(),
  contact: contactSchema.nullable().optional(),
  expiresAt: z.date().nullable().optional()
});

export const feedResponseSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  items: z.array(leadFeedItemSchema)
});

// Purchase attempt result schemas
export const purchaseOutcomeSchema = z.enum(['success','already_purchased','invalid_status','not_found','error']);

export const purchaseAttemptResultSchema = z.object({
  outcome: purchaseOutcomeSchema,
  message: z.string().optional(),
  lead: leadFeedItemSchema.optional()
});

// Types
export type PurchaseParams = z.infer<typeof purchaseParamsSchema>;
export type FeedQuery = z.infer<typeof feedQuerySchema>;
export type LeadFeedItem = z.infer<typeof leadFeedItemSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type PurchaseAttemptResult = z.infer<typeof purchaseAttemptResultSchema>;
