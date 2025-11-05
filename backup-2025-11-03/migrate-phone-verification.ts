import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migratePhoneVerification() {
  console.log('=== MIGRATING PHONE VERIFICATION TO LEADS ===\n');
  
  // Get all verified users
  const verifiedUsers = await prisma.user.findMany({
    where: { phoneVerified: true },
    select: { 
      id: true, 
      email: true, 
      phone: true,
      phoneVerified: true 
    }
  });
  
  console.log(`Found ${verifiedUsers.length} verified users\n`);
  
  let totalUpdated = 0;
  
  for (const user of verifiedUsers) {
    console.log(`Processing: ${user.email}`);
    console.log(`  Phone: ${user.phone}, Verified: ${user.phoneVerified}`);
    
    // Update all leads for this user
    const result = await prisma.lead.updateMany({
      where: { 
        homeownerId: user.id,
        phoneVerified: false // Only update unverified leads
      },
      data: { 
        phoneVerified: true,
        phoneNumber: user.phone
      }
    });
    
    console.log(`  ✓ Updated ${result.count} leads\n`);
    totalUpdated += result.count;
  }
  
  console.log(`\n=== MIGRATION COMPLETE ===`);
  console.log(`Total leads updated: ${totalUpdated}`);
  
  // Verify results
  console.log('\n=== VERIFICATION ===');
  const verifiedLeads = await prisma.lead.count({
    where: { phoneVerified: true }
  });
  console.log(`Leads with phoneVerified=true: ${verifiedLeads}`);
  
  await prisma.$disconnect();
}

migratePhoneVerification().catch(console.error);
