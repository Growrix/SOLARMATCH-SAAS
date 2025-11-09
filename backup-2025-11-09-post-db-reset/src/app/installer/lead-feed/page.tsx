'use client';

import InstallerLeadFeed from '@/components/InstallerLeadFeed';

export default function LeadFeedPage() {
  // Mock installer data - replace with actual data fetching
  const mockInstaller = {
    id: 1,
    companyName: 'Solar Solutions Inc.',
    email: 'contact@solarsolutions.com',
    phone: '+1234567890',
    serviceAreas: ['Sydney', 'Melbourne', 'Brisbane'],
    isApproved: true,
    creditBalance: 50,
    totalUnlocks: 25,
    successRate: 85,
  };

  const handleUnlockLead = async (leadId: number): Promise<boolean> => {
    console.log('Unlock lead:', leadId);
    return true;
  };

  const handleSubmitQuote = async (leadId: number, quoteData: any): Promise<boolean> => {
    console.log('Submit quote for lead:', leadId, quoteData);
    return true;
  };

  const handleStartChat = (leadId: number): void => {
    console.log('Start chat with lead:', leadId);
  };

  return (
    <InstallerLeadFeed 
      installer={mockInstaller} 
      onUnlockLead={handleUnlockLead} 
      onSubmitQuote={handleSubmitQuote} 
      onStartChat={handleStartChat} 
    />
  );
}
