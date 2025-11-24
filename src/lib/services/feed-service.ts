import { PrismaClient, LeadStatus } from '@prisma/client';
import type { LeadFeedItem } from '../../types/lead';

const prisma = new PrismaClient();

export interface FetchFeedArgs {
  installerId: string;
  page?: number;
  limit?: number;
  quoteType?: 'CALL_VISIT';
}

export interface FeedResponse {
  page: number;
  limit: number;
  total: number;
  items: LeadFeedItem[];
}

function deriveFlags(
  raw: {
    id: string;
    status: LeadStatus;
    installerId: string | null;
    purchasedAt: Date | null;
    leadPrice: number | null;
    name: string | null;
    phoneNumber: string | null;
    expiresAt: Date | null;
    quoteType?: string | null;
  },
  currentInstallerId: string
): LeadFeedItem {
  const purchased = raw.status === LeadStatus.PURCHASED;
  const purchasedByMe = purchased && raw.installerId === currentInstallerId;
  const purchasedByOther = purchased && raw.installerId !== null && raw.installerId !== currentInstallerId;
  const canPurchase = raw.status === LeadStatus.APPROVED && raw.installerId === null;
  const maskedContact = !purchasedByMe;
  return {
    id: raw.id,
    quoteType: 'CALL_VISIT',
    status: raw.status,
    leadPrice: raw.leadPrice || 0,
    installerId: raw.installerId,
    purchasedAt: raw.purchasedAt,
    purchasedByMe,
    purchasedByOther,
    canPurchase,
    maskedContact,
    contact: maskedContact ? null : (raw.name && raw.phoneNumber ? { name: raw.name, phone: raw.phoneNumber } : null),
    expiresAt: raw.expiresAt
  };
}

export async function fetchCallVisitFeed(args: FetchFeedArgs): Promise<FeedResponse> {
  const page = args.page ?? 1;
  const limit = args.limit ?? 25;
  const skip = (page - 1) * limit;

  const where = {
    quoteType: 'CALL_VISIT' as const,
    status: { in: [LeadStatus.APPROVED, LeadStatus.PURCHASED] },
    archivedAt: null,
    cancelledAt: null
  };

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        installerId: true,
        leadPrice: true,
        purchasedAt: true,
        quoteType: true,
        name: true,
        phoneNumber: true,
        expiresAt: true,
      }
    })
  ]);

  const items = leads.map(l => deriveFlags({ ...l }, args.installerId));
  return { page, limit, total, items };
}
