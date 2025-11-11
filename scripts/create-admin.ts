import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const adminEmail = 'admin@solarmatch.com';
  const adminPassword = 'Admin@123'; // Change this password after first login!
  
  try {
    console.log('🔐 Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('💡 Use this email to login');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'System Administrator',
        isActive: true,
        emailVerified: new Date(),
        emailVerifiedAt: new Date(),
        profileComplete: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('📋 Admin Credentials:');
    console.log('═══════════════════════════════════════════');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('🌐 Login at: http://localhost:3000/admin');
    console.log('');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
