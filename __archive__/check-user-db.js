const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'mohamm'
        }
      },
      select: {
        id: true,
        email: true,
        clerkId: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));
    
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        clerkId: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    console.log('\n\nLast 5 users created:');
    console.log(JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
