const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('===============================================');
  console.log('Admin Credentials Setup');
  console.log('===============================================');
  console.log('Email:    admin@solarmatch.com');
  console.log('Password: Admin@123');
  console.log('');
  console.log('Bcrypt Hash (copy this):');
  console.log(hash);
  console.log('');
  console.log('===============================================');
  console.log('SQL Query to insert admin:');
  console.log('===============================================');
  console.log(`
INSERT INTO users (
  id,
  email,
  password,
  role,
  name,
  "isActive",
  "emailVerified",
  "emailVerifiedAt",
  "profileComplete",
  "createdAt",
  "updatedAt"
) VALUES (
  'clx' || substring(md5(random()::text) from 1 for 24),
  'admin@solarmatch.com',
  '${hash}',
  'ADMIN',
  'System Administrator',
  true,
  NOW(),
  NOW(),
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
  `);
  console.log('===============================================');
}

generateHash();
