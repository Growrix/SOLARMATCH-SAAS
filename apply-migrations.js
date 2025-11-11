// Emergency migration script to apply all Prisma migrations
// Run with: node apply-migrations.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read all migration directories
const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
const migrations = fs.readdirSync(migrationsDir)
  .filter(name => fs.statSync(path.join(migrationsDir, name)).isDirectory())
  .sort();

console.log(`Found ${migrations.length} migrations to apply:\n`);
migrations.forEach(m => console.log(`  - ${m}`));
console.log('');

// Apply each migration
for (const migration of migrations) {
  const migrationPath = path.join(migrationsDir, migration, 'migration.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.log(`⚠️  Skipping ${migration} (no migration.sql found)`);
    continue;
  }

  console.log(`📦 Applying ${migration}...`);
  
  try {
    // Use PowerShell Get-Content to pipe SQL into docker exec
    const command = `Get-Content "${migrationPath}" | docker exec -i solarmatch-db-1 psql -U postgres -d solarmatch`;
    
    execSync(command, { 
      stdio: 'inherit',
      shell: 'powershell.exe'
    });
    
    console.log(`✅ ${migration} applied successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to apply ${migration}`);
    console.error(error.message);
    console.log('\nContinuing with next migration...\n');
  }
}

console.log('🎉 Migration process complete!');
console.log('\nNext steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Restart your dev server');
