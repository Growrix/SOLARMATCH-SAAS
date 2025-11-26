/**
 * Purchased Leads Page
 * 
 * T061: Display leads purchased by the installer
 * Features:
 * - Full contact details revealed (phone, email)
 * - Purchase status and date
 * - Lead details and instant quote data
 * - Action buttons (contact, view details)
 * - Purchase history
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  CurrencyPoundIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/button';
import LeadCard from '@/components/installer/LeadCard';
import type { Lead, InstallerProfile } from '@/components/installer/LeadCard';

interface PurchasedLead {
  id: string;
  quoteType: string;
  status: string;
  purchaseStatus: string;
  purchasedAt: string;
  leadPrice: number;
  homeowner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  location?: string;
  propertyType?: string;
  roofType?: string;
  estimatedBudget?: number;
  electricityBill?: number;
  roofArea?: number;
  quoteData?: any;
}

export default function PurchasedLeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<PurchasedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING'>('CALL_VISIT');

  // Mock installer profile (will be fetched from session in real implementation)
  const installerProfile: InstallerProfile = {
    id: Number(session?.user?.id) || 0,
    companyName: session?.user?.name || 'Your Company',
    email: session?.user?.email || '',
    phone: '',
    serviceAreas: [],
    isApproved: true,
    creditBalance: 0,
    totalUnlocks: 0,
    successRate: 0
  };

  // Transform PurchasedLead to Lead interface
  const transformToLead = (purchasedLead: PurchasedLead): Lead => ({
    id: purchasedLead.id,
    homeownerId: purchasedLead.homeowner.id,
    type: purchasedLead.quoteType === 'CALL_VISIT' ? 'call_visit' : purchasedLead.quoteType === 'WRITTEN_QUOTE' ? 'written' : 'bidding',
    status: 'submitted', // Purchased leads are typically submitted
    dateSubmitted: new Date(purchasedLead.purchasedAt),
    location: {
      suburb: purchasedLead.location?.split(',')[0] || 'Unknown',
      postcode: purchasedLead.location?.split(',')[1]?.trim() || '',
      state: purchasedLead.location?.split(',')[2]?.trim() || ''
    },
    systemDetails: {
      estimatedSize: purchasedLead.roofArea ? `${purchasedLead.roofArea}m²` : 'N/A',
      roofType: purchasedLead.roofType || 'N/A',
      propertyType: purchasedLead.propertyType || 'N/A',
      budget: purchasedLead.estimatedBudget ? `£${purchasedLead.estimatedBudget.toLocaleString()}` : 'N/A'
    },
    contact: {
      name: purchasedLead.homeowner.name,
      email: purchasedLead.homeowner.email,
      phone: purchasedLead.homeowner.phone
    },
    unlockPrice: purchasedLead.leadPrice,
    isUnlocked: true, // Always true for purchased leads
    unlockedBy: [Number(session?.user?.id) || 0],
    quotesReceived: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    priority: 'medium',
    energyBill: purchasedLead.electricityBill,
    quoteData: purchasedLead.quoteData,
    purchasedAt: purchasedLead.purchasedAt
  });

  // Redirect if not authenticated or not installer
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'INSTALLER') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch purchased leads
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPurchasedLeads();
    }
  }, [status]);

  async function fetchPurchasedLeads() {
    try {
      setLoading(true);
      const response = await fetch('/api/installer/leads/purchased');
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchased leads');
      }

      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading your purchased leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-error/10 border border-error rounded-lg p-6">
            <p className="text-error">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-1 text-foreground mb-2">
            Purchased Leads
          </h1>
          <p className="text-body text-muted">
            View and manage leads you&apos;ve purchased
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface rounded-lg p-6 border border-border shadow-neu-outset">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-muted">Total Purchased</p>
              <p className="text-heading-2 text-foreground">{leads.length}</p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-success" />
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border shadow-neu-outset">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-muted">Total Spent</p>
              <p className="text-heading-2 text-foreground">
                £{leads.reduce((sum, lead) => sum + lead.leadPrice, 0)}
              </p>
            </div>
            <CurrencyPoundIcon className="h-10 w-10 text-accent" />
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border shadow-neu-outset">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-muted">This Month</p>
              <p className="text-heading-2 text-foreground">
                {leads.filter(lead => {
                  const purchaseDate = new Date(lead.purchasedAt);
                  const now = new Date();
                  return purchaseDate.getMonth() === now.getMonth() && 
                         purchaseDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <CalendarIcon className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-surface rounded-lg border border-border shadow-neu-inset">
          {/* Call/Visit Tab */}
          <button
            onClick={() => setActiveTab('CALL_VISIT')}
            className={`flex-1 px-4 py-3 rounded-lg text-body transition-all ${
              activeTab === 'CALL_VISIT'
                ? 'bg-accent text-background shadow-neu-outset'
                : 'bg-transparent text-muted hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Call/Visit</span>
              {leads.filter(l => l.quoteType === 'CALL_VISIT').length > 0 && (
                <span className="text-caption bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  {leads.filter(l => l.quoteType === 'CALL_VISIT').length}
                </span>
              )}
            </div>
          </button>

          {/* Written Quotes Tab */}
          <button
            onClick={() => setActiveTab('WRITTEN_QUOTE')}
            className={`flex-1 px-4 py-3 rounded-lg text-body transition-all ${
              activeTab === 'WRITTEN_QUOTE'
                ? 'bg-accent text-background shadow-neu-outset'
                : 'bg-transparent text-muted hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Written Quotes</span>
              {leads.filter(l => l.quoteType === 'WRITTEN_QUOTE').length > 0 && (
                <span className="text-caption bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  {leads.filter(l => l.quoteType === 'WRITTEN_QUOTE').length}
                </span>
              )}
            </div>
          </button>

          {/* Bidding Tab */}
          <button
            onClick={() => setActiveTab('BIDDING')}
            className={`flex-1 px-4 py-3 rounded-lg text-body transition-all ${
              activeTab === 'BIDDING'
                ? 'bg-accent text-background shadow-neu-outset'
                : 'bg-transparent text-muted hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Bidding</span>
              {leads.filter(l => l.quoteType === 'BIDDING').length > 0 && (
                <span className="text-caption bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  {leads.filter(l => l.quoteType === 'BIDDING').length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Leads List */}
      {leads.filter(lead => lead.quoteType === activeTab).length === 0 ? (
        <div className="bg-surface rounded-lg p-12 text-center border border-border shadow-neu-outset">
          <CurrencyPoundIcon className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-body text-muted mb-4">
            {leads.length === 0 
              ? "You haven't purchased any leads yet."
              : `No ${activeTab.replace('_', ' ').toLowerCase()} leads purchased yet.`
            }
          </p>
          {leads.length === 0 && (
            <Button
              onClick={() => router.push('/installer/lead-feed')}
              variant="primary"
            >
              Browse Available Leads
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {leads.filter(lead => lead.quoteType === activeTab).map(lead => (
            <LeadCard
              key={lead.id}
              lead={transformToLead(lead)}
              installer={installerProfile}
              onUnlock={() => Promise.resolve()} // No unlock action for purchased leads
              onSubmitQuote={async () => false} // No quote submission for purchased leads
              onStartChat={() => {}} // Start chat placeholder
              isPurchased={true} // Mark as purchased to show contact details without unlock buttons
            />
          ))}
        </div>
      )}
      </div>
    </>
  );
}