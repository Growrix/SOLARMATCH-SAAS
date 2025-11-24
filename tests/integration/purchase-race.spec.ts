import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { POST as purchaseHandler } from '@/app/api/installer/leads/[id]/purchase/route';

describe('US2 Purchase Race', () => {
  const prisma = new PrismaClient();
  const leadId = randomUUID();
  const homeownerId = randomUUID();

  beforeAll(async () => {
    await prisma.user.create({ data: { id: 'installer-dev-placeholder', email: 'installer@example.test', role: 'INSTALLER' } });
    await prisma.user.create({ data: { id: homeownerId, email: homeownerId + '@example.test', role: 'HOMEOWNER' } });
    await prisma.lead.create({
      data: {
        id: leadId,
        homeownerId,
        status: 'APPROVED',
        quoteType: 'CALL_VISIT',
        leadPrice: 50,
        projectType: 'RESIDENTIAL_SOLAR',
        propertyType: 'HOUSE',
        postcode: '3000',
        location: 'Melbourne',
        state: 'VIC',
        energyBill: 300,
        billType: 'QUARTERLY',
        roofType: 'TILED',
        budgetRange: '$5k-$10k',
        desiredOffset: 70,
        name: 'Race Tester',
        phoneNumber: '+61 499 111 222'
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

  it('allows only one successful purchase among concurrent attempts and audits both', async () => {
    const reqFactory = () => new Request(`http://localhost/api/installer/leads/${leadId}/purchase`, { method: 'POST' });
    const [r1, r2] = await Promise.all([
      purchaseHandler(reqFactory() as any, { params: { id: leadId } } as any),
      purchaseHandler(reqFactory() as any, { params: { id: leadId } } as any),
    ]);
    const j1: any = await r1.json();
    const j2: any = await r2.json();
    const outcomes = [j1.outcome, j2.outcome];
    expect(outcomes).toContain('success');
    expect(outcomes).toContain('already_purchased');
    const audits = await prisma.purchaseLogEntry.findMany({ where: { leadId } });
    // Expect at least two audit rows (success + conflict)
    expect(audits.length).toBeGreaterThanOrEqual(2);
    const outcomeSet = new Set(audits.map(a => a.outcome));
    expect(outcomeSet.has('success')).toBe(true);
    expect(outcomeSet.has('already_purchased')).toBe(true);
  });
});