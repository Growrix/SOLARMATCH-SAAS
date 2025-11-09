import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testGetLeadsQuery() {
  console.log('=== TESTING getLeads() QUERY ===\n');
  
  // Simulate the exact query from getLeads service
  const leads = await prisma.lead.findMany({
    where: {},
    select: {
      id: true,
      status: true,
      phoneVerified: true,
      phoneNumber: true,
      // ... other fields
      homeowner: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneVerified: true,
          phone: true
        }
      }
    },
    take: 5
  });
  
  console.log(`Found ${leads.length} leads\n`);
  
  leads.forEach((lead, i) => {
    console.log(`Lead ${i + 1}:`);
    console.log(`  ID: ${lead.id}`);
    console.log(`  Status: ${lead.status}`);
    console.log(`  phoneVerified: ${lead.phoneVerified} ← Should show on admin page`);
    console.log(`  phoneNumber: ${lead.phoneNumber}`);
    console.log(`  Homeowner: ${lead.homeowner?.email}`);
    console.log(`  Homeowner phoneVerified: ${lead.homeowner?.phoneVerified}`);
    console.log();
  });
  
  await prisma.$disconnect();
}

testGetLeadsQuery().catch(console.error);
