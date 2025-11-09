/**
 * Installer Marketplace Component
 * 
 * T060: Display available leads for purchase
 * Features:
 * - Grid of available public leads
 * - Contact masking (hidden until purchase)
 * - Lead price display
 * - Purchase button (requires verification)
 * - Real-time countdown timer
 * - Filter by quote type
 * 
 * 🔴 DEV MODE: Uses STRIPE_BYPASS_MODE for testing without payment
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  CurrencyPoundIcon,
  ClockIcon,
  SparklesIcon,
  ShieldCheckIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { LiveCountdownBar } from '@/components/LiveCountdownBar';

interface Lead {
  id: string;
  quoteType: string;
  status: string;
  visibility: string;
  purchaseStatus: string;
  leadPrice: number | null;
  createdAt: string;
  expiresAt: string | null;
  homeowner: {
    id: string;
    name: string;
    // Contact details masked
  };
  location?: string;
  propertyType?: string;
  roofType?: string;
  estimatedBudget?: number;
}

export default function InstallerMarketplace() {
  const { data: session } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Fetch marketplace leads
  useEffect(() => {
    fetchMarketplaceLeads();
  }, []);

  async function fetchMarketplaceLeads() {
    try {
      setLoading(true);
      const response = await fetch('/api/leads?marketplace=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace leads');
      }

      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle lead purchase
  async function handlePurchase(leadId: string) {
    if (!session?.user?.installerVerified) {
      alert('You must be verified to purchase leads. Please complete installer verification.');
      return;
    }

    setPurchasing(leadId);

    try {
      // Step 1: Initiate purchase (bypass mode will skip Stripe)
      const initiateResponse = await fetch(`/api/leads/${leadId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initiate' })
      });

      if (!initiateResponse.ok) {
        const errorData = await initiateResponse.json();
        throw new Error(errorData.error || 'Failed to initiate purchase');
      }

      const initiateData = await initiateResponse.json();

      // In bypass mode, immediately confirm
      if (initiateData.bypassed) {
        console.log('🔧 Bypass mode: Skipping Stripe payment');
        
        // Step 2: Confirm purchase (bypass mode)
        const confirmResponse = await fetch(`/api/leads/${leadId}/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'confirm',
            paymentIntentId: 'bypass_mock' 
          })
        });

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json();
          throw new Error(errorData.error || 'Failed to confirm purchase');
        }

        alert(`✅ Lead purchased successfully! (Dev mode - no payment required)\n\nYou can now view the full contact details in "My Purchased Leads".`);
        
        // Refresh leads list
        fetchMarketplaceLeads();
      } else {
        // Production mode: Would show Stripe payment form here
        alert('Production mode: Stripe payment form would appear here');
      }

    } catch (err: any) {
      console.error('Purchase error:', err);
      alert(`Purchase failed: ${err.message}`);
    } finally {
      setPurchasing(null);
    }
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (filter === 'ALL') return true;
    return lead.quoteType === filter;
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Lead Marketplace
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Browse and purchase available solar installation leads
        </p>
      </div>

      {/* Verification Warning */}
      {!session?.user?.installerVerified && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start space-x-3">
          <ShieldCheckIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              Verification Required
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              You must complete installer verification before purchasing leads.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'CALL_VISIT', 'WRITTEN_QUOTE', 'BIDDING'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {filterType.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <SparklesIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No leads available
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Check back soon for new leads
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Countdown Bar */}
              {lead.expiresAt && (
                <LiveCountdownBar
                  expiresAt={lead.expiresAt}
                  leadId={String(lead.id)}
                  position="top"
                />
              )}

              <div className="p-6 space-y-4">
                {/* Quote Type Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {lead.quoteType.replace('_', ' ')}
                  </span>
                </div>

                {/* Contact Info (Masked) */}
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                  <EyeSlashIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">
                    Homeowner: {lead.homeowner.name.split(' ')[0]}***
                  </span>
                </div>

                {/* Location */}
                {lead.location && (
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{lead.location}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <CurrencyPoundIcon className="h-6 w-6 text-success dark:text-green-400" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {lead.leadPrice || 25}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">per lead</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(lead.id)}
                  disabled={purchasing === lead.id || !session?.user?.installerVerified}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    !session?.user?.installerVerified
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      : purchasing === lead.id
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {purchasing === lead.id ? 'Processing...' : 'Purchase Lead'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dev Mode Notice */}
      {process.env.NEXT_PUBLIC_STRIPE_BYPASS === 'true' && (
        <div className="text-center py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🔧 <strong>Dev Mode:</strong> Purchases are simulated without payment
          </p>
        </div>
      )}
    </div>
  );
}