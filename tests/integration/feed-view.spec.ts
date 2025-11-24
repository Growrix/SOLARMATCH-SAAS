import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { GET as feedHandler } from '@/app/api/installer/leads/route';

// NOTE: Assumes DATABASE_URL configured; this test seeds a lead and calls the route handler directly.

describe('US1 Feed View', () => {
  const prisma = new PrismaClient();
  const leadId = randomUUID();

  beforeAll(async () => {
    const homeownerId = randomUUID();
    await prisma.user.create({
      data: {
        id: homeownerId,
        email: `${homeownerId}@example.test`,
        role: 'HOMEOWNER'
      }
    });
    await prisma.lead.create({
      data: {
        id: leadId,
        status: 'APPROVED',
        quoteType: 'CALL_VISIT',
        installerId: null,
        purchasedAt: null,
        leadPrice: 125.5,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        homeownerId,
        projectType: 'RESIDENTIAL_SOLAR',
        propertyType: 'HOUSE',
        postcode: '3000',
        location: 'Melbourne',
        state: 'VIC',
        energyBill: 450.75,
        billType: 'QUARTERLY',
        roofType: 'TILED',
        budgetRange: '$10k-$15k',
        desiredOffset: 80
      }
    });
  });

  afterAll(async () => {
    await prisma.lead.deleteMany({ where: { id: leadId } });
    await prisma.user.deleteMany({ where: { email: { endsWith: '@example.test' } } });
    await prisma.$disconnect();
  });

  it('returns masked, purchasable lead flags', async () => {
    const request = new Request('http://localhost/api/installer/leads?quoteType=CALL_VISIT');
    const response = await feedHandler(request as any);
    expect(response.ok).toBe(true);
    const json: any = await response.json();
    expect(Array.isArray(json.items)).toBe(true);
    const item = json.items.find((i: any) => i.id === leadId);
    expect(item).toBeDefined();
    expect(item.canPurchase).toBe(true);
    expect(item.purchasedByMe).toBe(false);
    expect(item.purchasedByOther).toBe(false);
    expect(item.maskedContact).toBe(true);
  });
});