import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      clerkId: true,
      email: true,
      role: true,
      name: true,
    },
  });

  console.log('\n=== DATABASE USERS ===\n');
  users.forEach((u, i) => {
    console.log(`User ${i + 1}:`);
    console.log(`  ID: ${u.id}`);
    console.log(`  Clerk ID: ${u.clerkId}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Name: ${u.name}`);
    console.log('---\n');
  });

  await prisma.$disconnect();
  process.exit(0);
}

checkUsers().catch(console.error);
