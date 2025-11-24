'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InstallerLeadFeed from '@/components/InstallerLeadFeed';
import InstallerMessagingModal from '@/components/InstallerMessagingModal';
import type { InstallerProfile as APIInstallerProfile, AssignedLead } from '@/types/installer';
import type { InstallerProfile as ComponentInstallerProfile } from '@/components/InstallerLeadFeed';

export default function InstallerLeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [installer, setInstaller] = useState<ComponentInstallerProfile | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<AssignedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not installer
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'INSTALLER') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch installer profile and assigned leads
  useEffect(() => {
    async function fetchData() {
      if (status !== 'authenticated' || session?.user?.role !== 'INSTALLER') {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch installer profile
        const profileRes = await fetch('/api/installer/profile');
        if (!profileRes.ok) {
          throw new Error('Failed to fetch installer profile');
        }
        const profileData = await profileRes.json();
        const apiProfile: APIInstallerProfile = profileData.installer;
        
        // Adapt API response to component format
        setInstaller({
          id: 1, // Component expects number, using placeholder
          companyName: apiProfile.companyName,
          email: apiProfile.email,
          phone: apiProfile.phone || '',
          serviceAreas: apiProfile.serviceAreas,
          isApproved: apiProfile.isApproved,
          creditBalance: apiProfile.creditBalance,
          totalUnlocks: apiProfile.totalUnlocks,
          successRate: apiProfile.successRate,
        });

        // Fetch assigned leads
        const leadsRes = await fetch('/api/installer/leads/assigned');
        if (!leadsRes.ok) {
          throw new Error('Failed to fetch assigned leads');
        }
        const leadsData = await leadsRes.json();
        setAssignedLeads(leadsData.leads);

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status, session]);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground-muted">Loading your assigned leads...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-error mb-4">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No installer profile
  if (!installer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground-muted">No installer profile found.</p>
      </div>
    );
  }

  return (
    <>
      <InstallerLeadFeed
        installer={installer}
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
