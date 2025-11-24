import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { POST as purchaseHandler } from '@/app/api/installer/leads/[id]/purchase/route';
import { GET as feedHandler } from '@/app/api/installer/leads/route';

// US3: Purchased-by-other state
describe('US3 Purchased By Other', () => {
  const prisma = new PrismaClient();
  const leadId = randomUUID();
  const homeownerId = randomUUID();
  const purchaserInstallerId = 'installer-dev-placeholder'; // existing placeholder
  const otherInstallerId = 'installer-other-test';

  beforeAll(async () => {
    await prisma.user.create({ data: { id: homeownerId, email: homeownerId + '@example.test', role: 'HOMEOWNER' } });
    await prisma.user.create({ data: { id: purchaserInstallerId, email: 'purchaser@example.test', role: 'INSTALLER' } });
    await prisma.user.create({ data: { id: otherInstallerId, email: 'other@example.test', role: 'INSTALLER' } });
    await prisma.lead.create({
      data: {
        id: leadId,
        homeownerId,
        status: 'APPROVED',
        quoteType: 'CALL_VISIT',
        leadPrice: 120,
        projectType: 'RESIDENTIAL_SOLAR',
        propertyType: 'HOUSE',
        postcode: '3000',
        location: 'Melbourne',
        state: 'VIC',
        energyBill: 500,
        billType: 'QUARTERLY',
        roofType: 'TILED',
        budgetRange: '$15k-$20k',
        desiredOffset: 65,
        name: 'Owner Person',
        phoneNumber: '+61 411 222 333'
      }
    });
    // Purchase by purchaserInstallerId
    const purchaseReq = new Request(`http://localhost/api/installer/leads/${leadId}/purchase`, { method: 'POST' });
    const purchaseRes = await purchaseHandler(purchaseReq as any, { params: { id: leadId } } as any);
    const purchaseJson: any = await purchaseRes.json();
    expect(purchaseRes.ok).toBe(true);
    expect(purchaseJson.outcome).toBe('success');
  });

  afterAll(async () => {
    await prisma.purchaseLogEntry.deleteMany({ where: { leadId } });
    await prisma.lead.deleteMany({ where: { id: leadId } });
    await prisma.user.deleteMany({ where: { id: homeownerId } });
    await prisma.user.deleteMany({ where: { id: purchaserInstallerId } });
    await prisma.user.deleteMany({ where: { id: otherInstallerId } });
    await prisma.$disconnect();
  });

  it('shows purchasedByMe=true and unmasked contact for purchaser', async () => {
    const feedReq = new Request(`http://localhost/api/installer/leads?quoteType=CALL_VISIT`, { headers: { 'x-installer-id': purchaserInstallerId } });
    const feedRes = await feedHandler(feedReq as any);
    expect(feedRes.ok).toBe(true);
    const feedJson: any = await feedRes.json();
    const item = feedJson.items.find((i: any) => i.id === leadId);
    expect(item).toBeDefined();
    expect(item.purchasedByMe).toBe(true);
    expect(item.purchasedByOther).toBe(false);
    expect(item.maskedContact).toBe(false);
    expect(item.contact).toBeTruthy();
  });

  it('shows purchasedByOther=true and masked contact for non-purchaser', async () => {
    const feedReq = new Request(`http://localhost/api/installer/leads?quoteType=CALL_VISIT`, { headers: { 'x-installer-id': otherInstallerId } });
    const feedRes = await feedHandler(feedReq as any);
    expect(feedRes.ok).toBe(true);
    const feedJson: any = await feedRes.json();
    const item = feedJson.items.find((i: any) => i.id === leadId);
    expect(item).toBeDefined();
    expect(item.purchasedByMe).toBe(false);
    expect(item.purchasedByOther).toBe(true);
    expect(item.maskedContact).toBe(true);
    expect(item.contact).toBeNull();
  });
});
