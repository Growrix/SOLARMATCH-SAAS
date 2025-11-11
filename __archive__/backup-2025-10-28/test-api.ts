// Test script to check what the API returns
// Run dev server first: npm run dev
// Then run: npx tsx test-api.ts

async function testLeadsAPI() {
  console.log('=== TESTING API RESPONSES ===\n');
  
  try {
    // Test GET /api/leads
    console.log('1. Testing GET /api/leads:');
    const leadsResponse = await fetch('http://localhost:3000/api/leads');
    const leadsData = await leadsResponse.json();
    
    if (leadsData.leads && leadsData.leads.length > 0) {
      const firstLead = leadsData.leads[0];
      console.log('First lead response includes:');
      console.log('- id:', firstLead.id ? '✓' : '✗');
      console.log('- status:', firstLead.status ? '✓' : '✗');
      console.log('- phoneVerified:', 'phoneVerified' in firstLead ? `✓ (${firstLead.phoneVerified})` : '✗ MISSING');
      console.log('- phoneNumber:', 'phoneNumber' in firstLead ? `✓ (${firstLead.phoneNumber})` : '✗ MISSING');
      console.log('\nSample lead:', JSON.stringify(firstLead, null, 2));
    }
    
    console.log('\n2. Testing GET /api/leads/[id]:');
    if (leadsData.leads && leadsData.leads.length > 0) {
      const leadId = leadsData.leads[0].id;
      const leadDetailResponse = await fetch(`http://localhost:3000/api/leads/${leadId}`);
      const leadDetail = await leadDetailResponse.json();
      
      console.log('Lead detail response includes:');
      console.log('- phoneVerified:', 'phoneVerified' in leadDetail ? `✓ (${leadDetail.phoneVerified})` : '✗ MISSING');
      console.log('- phoneNumber:', 'phoneNumber' in leadDetail ? `✓ (${leadDetail.phoneNumber})` : '✗ MISSING');
      console.log('- status:', leadDetail.status);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
    console.log('\n⚠️  Make sure dev server is running: npm run dev');
  }
}

testLeadsAPI();
