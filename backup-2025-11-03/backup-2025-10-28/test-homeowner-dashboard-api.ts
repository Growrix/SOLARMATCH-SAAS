/**
 * Test Homeowner Dashboard API Response
 * 
 * This script tests the homeowner dashboard API to verify expiresAt is included
 */

import { prisma } from './src/lib/prisma';
import { getHomeownerLeadSummary } from './src/lib/services/lead-service';

async function testHomeownerDashboardAPI() {
  console.log('🧪 Testing homeowner dashboard API response...\n');

  try {
    // Get a sample homeowner with leads
    const homeowner = await prisma.user.findFirst({
      where: {
        role: 'HOMEOWNER',
        leads: {
          some: {
            status: 'APPROVED',
            expiresAt: {
              not: null,
            },
          },
        },
      },
    });

    if (!homeowner) {
      console.log('❌ No homeowner found with approved leads that have countdown timers');
      return;
    }

    console.log(`✅ Testing with homeowner: ${homeowner.name} (${homeowner.email})`);
    console.log(`   ID: ${homeowner.id}\n`);

    // Call the service function (same as API route does)
    const summary = await getHomeownerLeadSummary(homeowner.id);

    console.log('📊 Dashboard Summary Response:\n');
    console.log(`Total Submitted: ${summary.totalSubmitted}`);
    console.log(`Recent Leads: ${summary.recentLeads.length}\n`);

    if (summary.recentLeads.length === 0) {
      console.log('❌ No recent leads found');
      return;
    }

    console.log('🔍 Checking expiresAt field in recentLeads:\n');
    
    summary.recentLeads.forEach((lead, index) => {
      console.log(`${index + 1}. Lead ID: ${lead.id.slice(0, 12)}...`);
      console.log(`   Quote Type: ${lead.quoteType}`);
      console.log(`   Status: ${lead.status}`);
      console.log(`   expiresAt: ${lead.expiresAt ? new Date(lead.expiresAt).toLocaleString() : '❌ NULL (countdown disabled)'}`);
      console.log(`   phoneVerified: ${lead.phoneVerified !== undefined ? lead.phoneVerified : '⚠️  MISSING FIELD'}`);
      console.log('');
    });

    // Check if any approved leads have expiresAt
    const approvedLeadsWithCountdown = summary.recentLeads.filter(
      (lead) => lead.status === 'APPROVED' && lead.expiresAt !== null
    );

    console.log(`\n✅ Approved leads with countdown timers: ${approvedLeadsWithCountdown.length}`);
    
    if (approvedLeadsWithCountdown.length === 0) {
      console.log('\n⚠️  No approved leads with countdown timers found for this homeowner');
      console.log('   Homeowner will not see countdown timers on their dashboard');
    } else {
      console.log('\n✅ Countdown timers should be visible on homeowner dashboard!');
    }

  } catch (error) {
    console.error('❌ Error testing dashboard API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHomeownerDashboardAPI();
