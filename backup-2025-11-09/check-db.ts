import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('=== CHECKING DATABASE VALUES ===\n');
  
  // Check users with phone verification
  const users = await prisma.user.findMany({
    where: {
      email: { contains: 'ikramul' }
    },
    select: {
      id: true,
      email: true,
      phoneVerified: true,
      phone: true
    }
  });
  
  console.log('USERS:');
  users.forEach(u => console.log(JSON.stringify(u, null, 2)));
  
  // Check leads for those users
  if (users.length > 0) {
    const userIds = users.map(u => u.id);
    const leads = await prisma.lead.findMany({
      where: {
        homeownerId: { in: userIds }
      },
      select: {
        id: true,
        status: true,
        phoneVerified: true,
        phoneNumber: true,
        homeownerId: true
      }
    });
    
    console.log('\nLEADS FOR THESE USERS:');
    leads.forEach(l => console.log(JSON.stringify(l, null, 2)));
  }
  
  await prisma.$disconnect();
}

checkDatabase().catch(console.error);
