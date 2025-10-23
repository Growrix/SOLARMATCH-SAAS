/**
 * Check Countdown Timer Data
 * 
 * This script checks if any leads have expiresAt values set in the database.
 */

import { prisma } from './src/lib/prisma';

async function checkCountdownData() {
  console.log('🔍 Checking for leads with countdown timers...\n');

  try {
    // Get total lead count
    const totalLeads = await prisma.lead.count();
    console.log(`📊 Total leads in database: ${totalLeads}`);

    // Get leads with expiresAt set
    const leadsWithCountdown = await prisma.lead.findMany({
      where: {
        expiresAt: {
          not: null,
        },
      },
      select: {
        id: true,
        status: true,
        quoteType: true,
        expiresAt: true,
        approvedAt: true,
        createdAt: true,
        homeowner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    console.log(`\n⏱️  Leads with countdown timers: ${leadsWithCountdown.length}\n`);

    if (leadsWithCountdown.length === 0) {
      console.log('❌ No leads found with countdown timers (expiresAt is null for all leads)');
      console.log('\n💡 To test countdown timers:');
      console.log('   1. Login as admin');
      console.log('   2. Navigate to a pending lead');
      console.log('   3. Approve the lead with countdown timer enabled (default 7 days)');
      console.log('   4. Check homeowner dashboard - countdown should appear\n');
    } else {
      console.log('✅ Found leads with countdown timers:\n');
      
      leadsWithCountdown.forEach((lead, index) => {
        const now = new Date();
        const expiresAt = new Date(lead.expiresAt!);
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining <= 0;
        
        console.log(`${index + 1}. Lead ID: ${lead.id.slice(0, 12)}...`);
        console.log(`   Homeowner: ${lead.homeowner.name} (${lead.homeowner.email})`);
        console.log(`   Quote Type: ${lead.quoteType}`);
        console.log(`   Status: ${lead.status}`);
        console.log(`   Approved: ${lead.approvedAt?.toLocaleDateString() || 'Not approved'}`);
        console.log(`   Expires: ${expiresAt.toLocaleString()}`);
        console.log(`   ${isExpired ? '❌ EXPIRED' : `✅ ${daysRemaining} days remaining`}`);
        console.log('');
      });
    }

    // Check recent leads for a sample homeowner
    const sampleHomeowner = await prisma.user.findFirst({
      where: {
        role: 'HOMEOWNER',
      },
    });

    if (sampleHomeowner) {
      console.log(`\n📋 Sample homeowner leads (${sampleHomeowner.name}):\n`);
      
      const homeownerLeads = await prisma.lead.findMany({
        where: {
          homeownerId: sampleHomeowner.id,
        },
        select: {
          id: true,
          status: true,
          quoteType: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });

      homeownerLeads.forEach((lead, index) => {
        console.log(`${index + 1}. ${lead.id.slice(0, 12)}... | ${lead.status} | ${lead.quoteType} | ${lead.expiresAt ? `Expires: ${new Date(lead.expiresAt).toLocaleDateString()}` : 'No countdown'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking countdown data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCountdownData();
