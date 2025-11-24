import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { POST as purchaseHandler } from '@/app/api/installer/leads/[id]/purchase/route';
import { GET as feedHandler } from '@/app/api/installer/leads/route';

// US4: Archival lifecycle - purchased lead should disappear from feed after archival.
describe('US4 Archival Visibility', () => {
  const prisma = new PrismaClient();
  const leadId = randomUUID();
  const homeownerId = randomUUID();
  const purchaserInstallerId = 'installer-dev-placeholder';
  const otherInstallerId = 'installer-other-archival';

  beforeAll(async () => {
    // Users
    await prisma.user.create({ data: { id: homeownerId, email: homeownerId + '@example.test', role: 'HOMEOWNER' } });
    await prisma.user.create({ data: { id: purchaserInstallerId, email: 'purchaser-archival@example.test', role: 'INSTALLER' } });
    await prisma.user.create({ data: { id: otherInstallerId, email: 'other-archival@example.test', role: 'INSTALLER' } });
    // Lead (APPROVED)
    await prisma.lead.create({
      data: {
        id: leadId,
        homeownerId,
        status: 'APPROVED',
        quoteType: 'CALL_VISIT',
        leadPrice: 77,
        projectType: 'RESIDENTIAL_SOLAR',
        propertyType: 'HOUSE',
        postcode: '3000',
        location: 'Melbourne',
        state: 'VIC',
        energyBill: 420,
        billType: 'QUARTERLY',
        roofType: 'TILED',
        budgetRange: '$10k-$15k',
        desiredOffset: 60,
        name: 'Archival Lead',
        phoneNumber: '+61 499 888 777'
      }
    });
    // Purchase lead
    const purchaseReq = new Request(`http://localhost/api/installer/leads/${leadId}/purchase`, { method: 'POST' });
    const purchaseRes = await purchaseHandler(purchaseReq as any, { params: { id: leadId } } as any);
    expect(purchaseRes.ok).toBe(true);
    const purchaseJson: any = await purchaseRes.json();
    expect(purchaseJson.outcome).toBe('success');
    // Archive lead
    const now = new Date();
    await prisma.lead.update({ where: { id: leadId }, data: { archivedAt: now } });
  });

  afterAll(async () => {
    await prisma.purchaseLogEntry.deleteMany({ where: { leadId } });
    await prisma.lead.deleteMany({ where: { id: leadId } });
    await prisma.user.deleteMany({ where: { id: homeownerId } });
    await prisma.user.deleteMany({ where: { id: purchaserInstallerId } });
    await prisma.user.deleteMany({ where: { id: otherInstallerId } });
    await prisma.$disconnect();
  });

  it('removes archived lead from purchaser feed', async () => {
    const feedReq = new Request(`http://localhost/api/installer/leads?quoteType=CALL_VISIT`, { headers: { 'x-installer-id': purchaserInstallerId } });
    const feedRes = await feedHandler(feedReq as any);
    expect(feedRes.ok).toBe(true);
    const feedJson: any = await feedRes.json();
    const item = feedJson.items.find((i: any) => i.id === leadId);
    expect(item).toBeUndefined();
  });

  it('removes archived lead from other installer feed', async () => {
    const feedReq = new Request(`http://localhost/api/installer/leads?quoteType=CALL_VISIT`, { headers: { 'x-installer-id': otherInstallerId } });
    const feedRes = await feedHandler(feedReq as any);
    expect(feedRes.ok).toBe(true);
    const feedJson: any = await feedRes.json();
    const item = feedJson.items.find((i: any) => i.id === leadId);
    expect(item).toBeUndefined();
  });
});
