'use client';

import { useState } from 'react';
import InstallerLeadFeed from '@/components/InstallerLeadFeed';
import InstallerMessagingModal from '@/components/InstallerMessagingModal';

export default function InstallerLeadsPage() {
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  
  // Mock installer data
  const mockInstaller = {
    id: 1,
    companyName: "Solar Experts Inc.",
    email: "contact@solarexperts.com",
    phone: "+1 (555) 123-4567",
    serviceAreas: ["Sydney", "Melbourne", "Brisbane"],
    isApproved: true,
    creditBalance: 150,
    totalUnlocks: 42,
    successRate: 85.5
  };

  // Handler functions for Lead Feed
  const handleUnlockLead = async (leadId: number): Promise<boolean> => {
    console.log('Unlock lead:', leadId);
    // TODO: Implement actual unlock logic
    return true;
  };

  const handleSubmitQuote = async (leadId: number, quoteData: any): Promise<boolean> => {
    console.log('Submit quote for lead:', leadId, quoteData);
    // TODO: Implement actual quote submission logic
    return true;
  };

  const handleStartChat = (leadId: number): void => {
    console.log('Start chat with lead:', leadId);
    // TODO: Implement actual chat logic
    setShowMessagingModal(true);
  };

  return (
    <>
      <InstallerLeadFeed
        installer={mockInstaller}
        onUnlockLead={handleUnlockLead}
        onSubmitQuote={handleSubmitQuote}
        onStartChat={handleStartChat}
      />
      <InstallerMessagingModal
        isOpen={showMessagingModal}
        onClose={() => setShowMessagingModal(false)}
      />
    </>
  );
}
