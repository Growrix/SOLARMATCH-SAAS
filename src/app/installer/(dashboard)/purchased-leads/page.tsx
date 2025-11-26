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
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

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

  // Handle contact actions
  function handleCall(phone: string) {
    window.location.href = `tel:${phone}`;
  }

  function handleEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  function handleViewDetails(leadId: string) {
    router.push(`/installer/leads/${leadId}`);
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
            <button
              onClick={() => router.push('/installer/lead-feed')}
              className="btn-primary"
            >
              Browse Available Leads
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {leads.filter(lead => lead.quoteType === activeTab).map(lead => (
            <div
              key={lead.id}
              className="bg-surface rounded-lg border border-border max-w-4xl w-full hover:shadow-neu-outset-md transition-shadow duration-300"
              style={{ boxShadow: 'var(--shadow-outset)' }}
            >
              <div className="p-6 space-y-6">
                {/* Lead ID, Status & Purchase Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-muted-foreground">Lead ID</p>
                    <p className="text-body text-foreground">#{lead.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-caption rounded-full bg-success/10 text-success">
                      <CheckCircleIcon className="h-3 w-3 inline-block mr-1" />
                      Purchased
                    </span>
                    <span className="px-3 py-1 text-caption rounded-full bg-accent/10 text-accent">
                      {lead.quoteType === 'CALL_VISIT' ? 'Call/Visit' : lead.quoteType === 'WRITTEN_QUOTE' ? 'Written Quote' : 'Bidding'}
                    </span>
                  </div>
                </div>

                {/* Contact Information - REVEALED */}
                <div className="bg-success/10 border border-success/30 rounded-lg p-4 shadow-neu-inset">
                  <h3 className="text-heading-4 text-success mb-3">✓ Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-success/80">Name:</span>
                      <span className="text-body-small text-success">{lead.homeowner.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-success/80">Phone:</span>
                      <a href={`tel:${lead.homeowner.phone}`} className="text-body-small text-success hover:underline">
                        {lead.homeowner.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-success/80">Email:</span>
                      <a href={`mailto:${lead.homeowner.email}`} className="text-body-small text-success hover:underline break-all">
                        {lead.homeowner.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Property Details */}
                  {(lead.location || lead.propertyType || lead.roofType) && (
                    <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
                      <h3 className="text-heading-4 text-foreground mb-3">Property Details</h3>
                      <div className="space-y-2">
                        {lead.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Location:</span>
                            <span className="text-body-small text-foreground">{lead.location}</span>
                          </div>
                        )}
                        {lead.propertyType && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Property Type:</span>
                            <span className="text-body-small text-foreground">{lead.propertyType}</span>
                          </div>
                        )}
                        {lead.roofType && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Roof Type:</span>
                            <span className="text-body-small text-foreground">{lead.roofType}</span>
                          </div>
                        )}
                        {lead.roofArea && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Roof Area:</span>
                            <span className="text-body-small text-foreground">{lead.roofArea}m²</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Energy & Budget Details */}
                  {(lead.electricityBill || lead.estimatedBudget) && (
                    <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
                      <h3 className="text-heading-4 text-foreground mb-3">Energy & Budget</h3>
                      <div className="space-y-2">
                        {lead.electricityBill && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Monthly Bill:</span>
                            <span className="text-body-small text-foreground">£{lead.electricityBill}</span>
                          </div>
                        )}
                        {lead.estimatedBudget && (
                          <div className="flex items-center justify-between">
                            <span className="text-body-small text-muted-foreground">Budget Range:</span>
                            <span className="text-body-small text-foreground">£{lead.estimatedBudget.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lead Metadata & Purchase Info */}
                <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
                  <h3 className="text-heading-4 text-foreground mb-3">Purchase Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-muted-foreground">Purchase Price:</span>
                      <div className="flex items-center">
                        <CurrencyPoundIcon className="h-4 w-4 text-accent mr-1" />
                        <span className="text-body text-accent">{lead.leadPrice}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-muted-foreground">Purchased On:</span>
                      <span className="text-body-small text-foreground">{new Date(lead.purchasedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-small text-muted-foreground">Quote Type:</span>
                      <span className="text-body-small text-foreground">
                        {lead.quoteType === 'CALL_VISIT' ? 'Call/Visit' : lead.quoteType === 'WRITTEN_QUOTE' ? 'Written Quote' : 'Bidding'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => handleCall(lead.homeowner.phone)}
                    className="btn-success flex items-center justify-center"
                  >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    Call Now
                  </button>
                  <button
                    onClick={() => handleEmail(lead.homeowner.email)}
                    className="btn-primary flex items-center justify-center"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleViewDetails(lead.id)}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}