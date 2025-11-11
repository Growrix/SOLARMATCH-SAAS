import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDraftLeads() {
  console.log('=== CHECKING DRAFT LEADS ===\n');
  
  // Get DRAFT leads
  const draftLeads = await prisma.lead.findMany({
    where: { status: 'DRAFT' },
    select: {
      id: true,
      status: true,
      phoneVerified: true,
      phoneNumber: true,
      homeowner: {
        select: {
          email: true,
          phoneVerified: true
        }
      }
    },
    take: 5
  });
  
  console.log(`Found ${draftLeads.length} DRAFT leads\n`);
  
  draftLeads.forEach((lead, i) => {
    console.log(`Lead ${i + 1}: ${lead.id}`);
    console.log(`  Status: "${lead.status}" (type: ${typeof lead.status})`);
    console.log(`  phoneVerified: ${lead.phoneVerified}`);
    console.log(`  phoneNumber: ${lead.phoneNumber}`);
    console.log(`  Homeowner: ${lead.homeowner?.email}`);
    console.log(`  Buttons should show: ${['DRAFT', 'PENDING_APPROVAL', 'PENDING_PHONE'].includes(lead.status)}`);
    console.log();
  });
  
  // Check if there are any leads with status that looks like DRAFT but isn't exactly
  const allLeads = await prisma.lead.findMany({
    select: { status: true },
    distinct: ['status']
  });
  
  console.log('\nAll unique status values in database:');
  allLeads.forEach(l => {
    console.log(`  "${l.status}"`);
  });
  
  await prisma.$disconnect();
}

checkDraftLeads().catch(console.error);
