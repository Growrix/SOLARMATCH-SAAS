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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
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
            Purchased Leads
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View and manage leads you&apos;ve purchased
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Purchased</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{leads.length}</p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  £{leads.reduce((sum, lead) => sum + lead.leadPrice, 0)}
                </p>
              </div>
              <CurrencyPoundIcon className="h-10 w-10 text-brand-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {leads.filter(lead => {
                    const purchaseDate = new Date(lead.purchasedAt);
                    const now = new Date();
                    return purchaseDate.getMonth() === now.getMonth() && 
                           purchaseDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Leads List */}
        {leads.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center">
            <CurrencyPoundIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You haven&apos;t purchased any leads yet.
            </p>
            <button
              onClick={() => router.push('/installer/marketplace')}
              className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {leads.map(lead => (
              <div
                key={lead.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Side - Lead Info */}
                  <div className="flex-1 mb-6 lg:mb-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300">
                          {lead.quoteType.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Purchased
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(lead.purchasedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Contact Details - REVEALED */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <p className="text-green-800 dark:text-green-200 font-medium">
                          {lead.homeowner.name}
                        </p>
                        <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          <a href={`tel:${lead.homeowner.phone}`} className="hover:underline">
                            {lead.homeowner.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          <a href={`mailto:${lead.homeowner.email}`} className="hover:underline">
                            {lead.homeowner.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div className="grid grid-cols-2 gap-4">
                      {lead.location && (
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {lead.location}
                        </div>
                      )}
                      {lead.propertyType && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Property:</span> {lead.propertyType}
                        </div>
                      )}
                      {lead.roofType && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Roof:</span> {lead.roofType}
                        </div>
                      )}
                      {lead.estimatedBudget && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Budget:</span> £{lead.estimatedBudget.toLocaleString()}
                        </div>
                      )}
                      {lead.electricityBill && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Monthly Bill:</span> £{lead.electricityBill}
                        </div>
                      )}
                      {lead.roofArea && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Roof Area:</span> {lead.roofArea}m²
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions & Price */}
                  <div className="lg:ml-6 lg:w-64">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Purchase Price</p>
                      <div className="flex items-center">
                        <CurrencyPoundIcon className="h-6 w-6 text-brand-600 dark:text-brand-400 mr-1" />
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          {lead.leadPrice}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleCall(lead.homeowner.phone)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Call Now
                      </button>
                      <button
                        onClick={() => handleEmail(lead.homeowner.email)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        Send Email
                      </button>
                      <button
                        onClick={() => handleViewDetails(lead.id)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
    </div>
  );
}
