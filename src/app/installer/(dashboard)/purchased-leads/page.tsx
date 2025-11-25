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
      const response = await fetch('/api/leads?purchased=true');
      
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
            <CurrencyPoundIcon className="h-10 w-10 text-brand" />
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

      {/* Leads List */}
      {leads.length === 0 ? (
        <div className="bg-surface rounded-lg p-12 text-center border border-border shadow-neu-outset">
          <CurrencyPoundIcon className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-body text-muted mb-4">
            You haven&apos;t purchased any leads yet.
          </p>
          <button
            onClick={() => router.push('/installer/marketplace')}
            className="btn-primary"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {leads.map(lead => (
            <div
              key={lead.id}
              className="bg-surface rounded-lg shadow-neu-outset border border-border p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                {/* Left Side - Lead Info */}
                <div className="flex-1 mb-6 lg:mb-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-brand/20 text-brand">
                        {lead.quoteType.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-success/20 text-success">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Purchased
                      </span>
                    </div>
                    <p className="text-body text-muted">
                      {new Date(lead.purchasedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Contact Details - REVEALED */}
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4 shadow-neu-inset">
                    <h3 className="text-body text-success mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-body text-success">
                        {lead.homeowner.name}
                      </p>
                      <div className="flex items-center text-body text-success">
                        <PhoneIcon className="h-4 w-4 mr-2 text-icon" />
                        <a href={`tel:${lead.homeowner.phone}`} className="hover:underline">
                          {lead.homeowner.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-body text-success">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-icon" />
                        <a href={`mailto:${lead.homeowner.email}`} className="hover:underline">
                          {lead.homeowner.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Lead Details */}
                  <div className="grid grid-cols-2 gap-4">
                    {lead.location && (
                      <div className="flex items-center text-body text-muted">
                        <MapPinIcon className="h-4 w-4 mr-2 text-icon" />
                        {lead.location}
                      </div>
                    )}
                    {lead.propertyType && (
                      <div className="text-body text-muted">
                        <span>Property:</span> {lead.propertyType}
                      </div>
                    )}
                    {lead.roofType && (
                      <div className="text-body text-muted">
                        <span>Roof:</span> {lead.roofType}
                      </div>
                    )}
                    {lead.estimatedBudget && (
                      <div className="text-body text-muted">
                        <span>Budget:</span> £{lead.estimatedBudget.toLocaleString()}
                      </div>
                    )}
                    {lead.electricityBill && (
                      <div className="text-body text-muted">
                        <span>Monthly Bill:</span> £{lead.electricityBill}
                      </div>
                    )}
                    {lead.roofArea && (
                      <div className="text-body text-muted">
                        <span>Roof Area:</span> {lead.roofArea}m²
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Actions & Price */}
                <div className="lg:ml-6 lg:w-64">
                  <div className="bg-surface rounded-lg p-4 mb-4 border border-border shadow-neu-inset">
                    <p className="text-body text-muted mb-1">Purchase Price</p>
                    <div className="flex items-center">
                      <CurrencyPoundIcon className="h-6 w-6 text-brand mr-1" />
                      <span className="text-heading-1 text-foreground">
                        {lead.leadPrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleCall(lead.homeowner.phone)}
                      className="btn-success w-full"
                    >
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Call Now
                    </button>
                    <button
                      onClick={() => handleEmail(lead.homeowner.email)}
                      className="btn-primary w-full"
                    >
                      <EnvelopeIcon className="h-5 w-5 mr-2" />
                      Send Email
                    </button>
                    <button
                      onClick={() => handleViewDetails(lead.id)}
                      className="btn-secondary w-full"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      View Details
                    </button>
                  </div>
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