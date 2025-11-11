const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔍 Checking for existing admin...\n');
    
    // Check existing admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@solarmatch.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Updating password to: Admin@123\n');
      
      // Update the password
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await prisma.user.update({
        where: { email: 'admin@solarmatch.com' },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
          emailVerified: new Date(),
          emailVerifiedAt: new Date(),
          profileComplete: true,
        }
      });
      
      console.log('✅ Admin password updated successfully!\n');
    } else {
      console.log('Creating new admin user...\n');
      
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await prisma.user.create({
        data: {
          email: 'admin@solarmatch.com',
          password: hashedPassword,
          role: 'ADMIN',
          name: 'System Administrator',
          isActive: true,
          emailVerified: new Date(),
          emailVerifiedAt: new Date(),
          profileComplete: true,
        }
      });
      
      console.log('✅ Admin user created successfully!\n');
    }
    
    console.log('═══════════════════════════════════════════');
    console.log('📋 ADMIN LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════════');
    console.log('📧 Email:    admin@solarmatch.com');
    console.log('🔑 Password: Admin@123');
    console.log('🌐 Login URL: http://localhost:3001/admin');
    console.log('═══════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
