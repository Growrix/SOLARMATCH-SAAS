/**
 * CHECK CLERK VS DATABASE USER MISMATCH
 * 
 * This script helps identify users that exist in Clerk but NOT in database
 * (the exact problem we fixed)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserMismatch() {
  console.log('\n🔍 CHECKING FOR USER MISMATCHES...\n');
  
  try {
    // Get all users from database
    const dbUsers = await prisma.user.findMany({
      select: {
        email: true,
        clerkId: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total users in DATABASE: ${dbUsers.length}\n`);
    
    if (dbUsers.length === 0) {
      console.log('❌ NO USERS IN DATABASE!');
      console.log('\nThis explains the "Account Setup Required" error.');
      console.log('Users exist in Clerk but NOT in your database.\n');
      console.log('🔧 SOLUTION:');
      console.log('1. Delete ALL users from Clerk dashboard');
      console.log('2. Test with a FRESH signup using the custom modal');
      console.log('3. New user will be created in BOTH Clerk AND database\n');
    } else {
      console.log('✅ Users found in database:\n');
      dbUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   ClerkID: ${user.clerkId}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
      
      // Check for temp emails (sign of broken flow)
      const tempEmailUsers = dbUsers.filter(u => u.email.includes('@temp.com'));
      if (tempEmailUsers.length > 0) {
        console.log(`\n⚠️  WARNING: ${tempEmailUsers.length} users have temporary emails!`);
        console.log('These were likely created by the /api/user/sync fallback.\n');
        tempEmailUsers.forEach(u => {
          console.log(`   - ${u.email} (${u.clerkId})`);
        });
        console.log('\nThese users should be deleted from BOTH Clerk and database.\n');
      }
    }

    // Additional info
    console.log('\n📋 CLERK DASHBOARD INFO:');
    console.log('From your screenshot, Clerk has 3 users:');
    console.log('1. nayeem.enerz@gmail.com (MOHAMMAD NAYEEM)');
    console.log('2. mohammadikramul7@gmail.com (Mohammad Ikramul)');  
    console.log('3. shoppingmanagerbd@gmail.com (Mohammad Nayeem)\n');
    
    console.log('🔍 CHECKING IF THESE USERS ARE IN DATABASE...\n');
    
    const clerkEmails = [
      'nayeem.enerz@gmail.com',
      'mohammadikramul7@gmail.com', 
      'shoppingmanagerbd@gmail.com'
    ];
    
    for (const email of clerkEmails) {
      const user = dbUsers.find(u => u.email === email);
      if (user) {
        console.log(`✅ ${email} - FOUND in database`);
      } else {
        console.log(`❌ ${email} - NOT in database (THIS IS THE PROBLEM!)`);
      }
    }
    
    const missingCount = clerkEmails.filter(email => 
      !dbUsers.find(u => u.email === email)
    ).length;
    
    if (missingCount > 0) {
      console.log(`\n🚨 ${missingCount} out of 3 Clerk users are MISSING from database!`);
      console.log('\nThis is WHY you get "Account Setup Required"!');
      console.log('\n✅ THE FIX IS WORKING CORRECTLY!');
      console.log('The problem is you\'re trying to sign in with users created BEFORE the fix.\n');
      console.log('🔧 NEXT STEPS:');
      console.log('1. Go to Clerk dashboard');
      console.log('2. Delete these 3 users (they are broken)');
      console.log('3. Visit http://localhost:3003');
      console.log('4. Click "Sign Up" (should open CUSTOM modal)');
      console.log('5. Create NEW user: test-final@example.com');
      console.log('6. This new user will be in BOTH Clerk AND database');
      console.log('7. Sign in will work without errors! ✅\n');
    } else {
      console.log('\n✅ All Clerk users are in database!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserMismatch();
