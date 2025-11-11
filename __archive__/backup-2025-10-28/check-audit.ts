import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAuditLogs() {
  console.log('=== CHECKING AUDIT LOGS FOR PHONE VERIFICATION ===\n');
  
  // Get verified users
  const verifiedUsers = await prisma.user.findMany({
    where: {
      email: { contains: 'ikramul' },
      phoneVerified: true
    },
    select: { id: true, email: true }
  });
  
  console.log(`Found ${verifiedUsers.length} verified users\n`);
  
  for (const user of verifiedUsers) {
    console.log(`User: ${user.email}`);
    
    // Check audit logs for PHONE_VERIFIED action
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        userId: user.id,
        action: 'PHONE_VERIFIED'
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`  Audit logs found: ${auditLogs.length}`);
    auditLogs.forEach(log => {
      console.log(`  - ${log.createdAt}: ${log.action}`);
      console.log(`    Metadata:`, log.metadata);
    });
    console.log();
  }
  
  await prisma.$disconnect();
}

checkAuditLogs().catch(console.error);
