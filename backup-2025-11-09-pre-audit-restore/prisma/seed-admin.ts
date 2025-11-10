/**
 * Admin User Seed Script (Clerk Migration)
 * 
 * Creates an admin user for accessing the admin dashboard.
 * Run this after database reset or for initial setup.
 * 
 * Usage: npm run seed:admin
 * 
 * Prerequisites:
 * 1. Have a Clerk account created (sign up at Clerk Dashboard)
 * 2. Get your Clerk User ID from Clerk Dashboard → Users
 * 3. Update the CLERK_USER_ID constant below
 * 4. Run this script
 * 5. Update Clerk publicMetadata manually in Clerk Dashboard
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin Clerk User ID (from Clerk Dashboard)
const CLERK_USER_ID = 'user_35Es3qfB6VG5RVjLOAEECQCSo6v';

// Admin user details
const ADMIN_EMAIL = 'admin@solarmatch.com';
const ADMIN_NAME = 'Solar Match Admin';

async function main() {
  console.log('🌱 Starting admin user seed...\n');

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: CLERK_USER_ID },
          { email: ADMIN_EMAIL },
        ],
      },
    });

    if (existingUser) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Clerk ID: ${existingUser.clerkId}`);
      console.log(`   Role: ${existingUser.role}\n`);

      // Update role if it's not ADMIN
      if (existingUser.role !== 'ADMIN') {
        console.log('� Updating user role to ADMIN...');
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'ADMIN' },
        });
        console.log('✅ User role updated to ADMIN\n');
      }
    } else {
      // Create new admin user
      console.log('🔨 Creating admin user...');
      const adminUser = await prisma.user.create({
        data: {
          clerkId: CLERK_USER_ID,
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: 'ADMIN',
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Clerk ID: ${adminUser.clerkId}`);
      console.log(`   Role: ${adminUser.role}\n`);
    }

    // Print next steps
    console.log('📋 NEXT STEPS:\n');
    console.log('1. Update Clerk publicMetadata:');
    console.log('   - Go to: Clerk Dashboard → Users');
    console.log('   - Click on your user account');
    console.log('   - Scroll to "Public Metadata" section');
    console.log('   - Click "Edit"');
    console.log('   - Add: { "role": "ADMIN" }');
    console.log('   - Click "Save"\n');
    
    console.log('2. Restart your dev server:');
    console.log('   - Stop server (Ctrl+C)');
    console.log('   - Run: npm run dev');
    console.log('   - Navigate to: http://localhost:3000/admin\n');

    console.log('3. Test admin access:');
    console.log('   - You should see the admin dashboard');
    console.log('   - Check that you can access all admin features');
    console.log('   - Verify no "Access Denied" errors\n');

    console.log('✨ Admin seed completed!\n');
  } catch (error) {
    console.error('❌ Error seeding admin user:');
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
