import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { POST as purchaseHandler } from '@/app/api/installer/leads/[id]/purchase/route';
import { GET as feedHandler } from '@/app/api/installer/leads/route';

describe('US2 Purchase Success', () => {
  const prisma = new PrismaClient();
  const leadId = randomUUID();
  const homeownerId = randomUUID();

  beforeAll(async () => {
    // Create installer fixture matching placeholder used by route
    await prisma.user.create({ data: { id: 'installer-dev-placeholder', email: 'installer@example.test', role: 'INSTALLER' } });
    await prisma.user.create({ data: { id: homeownerId, email: homeownerId + '@example.test', role: 'HOMEOWNER' } });
    await prisma.lead.create({
      data: {
        id: leadId,
        homeownerId,
        status: 'APPROVED',
        quoteType: 'CALL_VISIT',
        leadPrice: 88.25,
        projectType: 'RESIDENTIAL_SOLAR',
        propertyType: 'HOUSE',
        postcode: '3000',
        location: 'Melbourne',
        state: 'VIC',
        energyBill: 400,
        billType: 'QUARTERLY',
        roofType: 'TILED',
        budgetRange: '$10k-$15k',
        desiredOffset: 75,
        name: 'Jane Homeowner',
        phoneNumber: '+61 400 000 000'
      }
    });
  });

  afterAll(async () => {
    await prisma.purchaseLogEntry.deleteMany({ where: { leadId } });
    await prisma.lead.deleteMany({ where: { id: leadId } });
    await prisma.user.deleteMany({ where: { id: homeownerId } });
    await prisma.user.deleteMany({ where: { id: 'installer-dev-placeholder' } });
    await prisma.$disconnect();
  });

  it('purchases an approved lead and reveals contact', async () => {
    const purchaseReq = new Request(`http://localhost/api/installer/leads/${leadId}/purchase`, { method: 'POST' });
    const purchaseRes = await purchaseHandler(purchaseReq as any, { params: { id: leadId } } as any);
    expect(purchaseRes.ok).toBe(true);
    const purchaseJson: any = await purchaseRes.json();
    expect(purchaseJson.outcome).toBe('success');
    expect(purchaseJson.lead.maskedContact).toBe(false);
    expect(purchaseJson.lead.purchasedByMe).toBe(true);

    const feedReq = new Request('http://localhost/api/installer/leads?quoteType=CALL_VISIT');
    const feedRes = await feedHandler(feedReq as any);
    const feedJson: any = await feedRes.json();
    const item = feedJson.items.find((i: any) => i.id === leadId);
    expect(item).toBeDefined();
    expect(item.purchasedByMe).toBe(true);
    expect(item.maskedContact).toBe(false);
    expect(item.contact).toBeTruthy();
  });
});