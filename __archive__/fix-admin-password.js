const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdminPassword() {
  try {
    console.log('🔍 Checking admin user...');
    
    // Check if admin exists
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@solarmatch.com' }
    });

    if (admin) {
      console.log('✅ Admin user found:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        currentHashLength: admin.password?.length || 0
      });
    } else {
      console.log('❌ Admin user not found');
    }

    // Generate new hash
    const password = 'Admin123!Secure';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('\n🔐 New password hash generated:');
    console.log('Password:', password);
    console.log('Hash:', hashedPassword);

    // Update or create admin
    if (admin) {
      console.log('\n🔄 Updating admin password...');
      await prisma.user.update({
        where: { email: 'admin@solarmatch.com' },
        data: {
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin password updated!');
    } else {
      console.log('\n➕ Creating admin user...');
      await prisma.user.create({
        data: {
          email: 'admin@solarmatch.com',
          password: hashedPassword,
          role: 'ADMIN',
          name: 'System Administrator'
        }
      });
      console.log('✅ Admin user created!');
    }

    // Verify
    admin = await prisma.user.findUnique({
      where: { email: 'admin@solarmatch.com' }
    });
    
    console.log('\n✅ Final verification:');
    console.log({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      hashLength: admin.password?.length || 0
    });

    // Test password
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('\n🧪 Password test:', isValid ? '✅ VALID' : '❌ INVALID');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminPassword();
