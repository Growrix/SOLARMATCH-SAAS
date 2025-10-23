/**
 * Installer Marketplace Page
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

export default function InstallerMarketplacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Redirect if not authenticated or not installer
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'INSTALLER') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch marketplace leads
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMarketplaceLeads();
    }
  }, [status]);

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
      router.push('/installer/dashboard'); // Redirect to dashboard where verification is shown
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

        const confirmData = await confirmResponse.json();
        
        alert(`✅ Lead purchased successfully! (Dev mode - no payment required)\n\nYou can now view the full contact details in "Purchased Leads".`);
        
        // Refresh leads list
        fetchMarketplaceLeads();
        
        // Redirect to purchased leads
        router.push('/installer/purchased-leads');
      } else {
        // Production mode: Would show Stripe payment form here
        // TODO: Implement Stripe Elements payment form
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Lead Marketplace
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse and purchase available solar installation leads
          </p>
        </div>

        {/* Verification Warning */}
        {!session?.user?.installerVerified && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                Verification Required
              </p>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              You must complete installer verification before purchasing leads.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['ALL', 'CALL_VISIT', 'WRITTEN_QUOTE', 'BIDDING'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'ALL' ? 'All Leads' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center">
            <SparklesIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No leads available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
              >
                {/* Countdown Timer */}
                {lead.expiresAt && (
                  <div className="mb-4">
                    <LiveCountdownBar
                      expiresAt={lead.expiresAt}
                      leadId={lead.id}
                      leadStatus={lead.status}
                      quoteType={lead.quoteType}
                      position="inline"
                    />
                  </div>
                )}

                {/* Quote Type Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300">
                    {lead.quoteType.replace('_', ' ')}
                  </span>
                </div>

                {/* Lead Info */}
                <div className="space-y-3 mb-4">
                  {/* Masked Homeowner Name */}
                  <div className="flex items-center text-sm">
                    <EyeSlashIcon className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Homeowner: {lead.homeowner.name.split(' ')[0]}*** {/* Mask last name */}
                    </span>
                  </div>

                  {/* Location (if available) */}
                  {lead.location && (
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-600 dark:text-slate-400">{lead.location}</span>
                    </div>
                  )}

                  {/* Property Type */}
                  {lead.propertyType && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Property: {lead.propertyType}
                    </div>
                  )}

                  {/* Estimated Budget */}
                  {lead.estimatedBudget && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Budget: £{lead.estimatedBudget.toLocaleString()}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Price & Purchase Button */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <CurrencyPoundIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 mr-1" />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {lead.leadPrice || 50}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">per lead</span>
                  </div>

                  <button
                    onClick={() => handlePurchase(lead.id)}
                    disabled={!session?.user?.installerVerified || purchasing === lead.id}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      !session?.user?.installerVerified
                        ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        : purchasing === lead.id
                        ? 'bg-brand-400 text-white cursor-wait'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
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
        {process.env.NEXT_PUBLIC_STRIPE_BYPASS_MODE === 'true' && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              🔧 <strong>Development Mode:</strong> Purchases are simulated without payment processing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
