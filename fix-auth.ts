import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAuth() {
  console.log('🔧 Starting authentication fix...\n');

  // Step 1: Delete duplicate admin user
  console.log('1. Deleting duplicate admin user...');
  const deleted = await prisma.user.delete({
    where: { clerkId: 'user_35Es3qfB6VG5RVjLOAEECQCSo6v' },
  });
  console.log(`   ✅ Deleted: ${deleted.email}\n`);

  // Step 2: Convert existing user to admin
  console.log('2. Converting existing user to ADMIN...');
  const updated = await prisma.user.update({
    where: { clerkId: 'user_35EMmqOVNhJHOajl16qhX6DcuFv' },
    data: {
      role: 'ADMIN',
      email: 'admin@solarmatch.com',
      name: 'Solar Match Admin',
    },
  });
  console.log(`   ✅ Updated: ${updated.email} → Role: ${updated.role}\n`);

  // Step 3: Verify final state
  console.log('3. Verifying database state...');
  const users = await prisma.user.findMany({
    select: { clerkId: true, email: true, role: true, name: true },
  });
  
  console.log('\n=== FINAL DATABASE STATE ===');
  users.forEach((u, i) => {
    console.log(`\nUser ${i + 1}:`);
    console.log(`  Clerk ID: ${u.clerkId}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Name: ${u.name}`);
  });

  console.log('\n\n📋 NEXT STEPS:\n');
  console.log('1. Update Clerk publicMetadata:');
  console.log('   - Go to: https://dashboard.clerk.com/ → Users');
  console.log('   - Find user: user_35EMmqOVNhJHOajl16qhX6DcuFv');
  console.log('   - Edit Public Metadata:');
  console.log('     {');
  console.log('       "role": "ADMIN"');
  console.log('     }');
  console.log('   - Save\n');
  
  console.log('2. Sign out and sign back in:');
  console.log('   - Go to: http://localhost:3000');
  console.log('   - Click user menu → Sign Out');
  console.log('   - Sign back in');
  console.log('   - Navigate to: http://localhost:3000/admin\n');

  console.log('✅ Database fix complete!\n');

  await prisma.$disconnect();
  process.exit(0);
}

fixAuth().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
