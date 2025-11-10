/**
 * Lead Detail Page
 * 
 * T062: Detailed view of a purchased lead
 * Features:
 * - Full contact details (phone, email, address)
 * - Instant quote data display
 * - Lead timeline and history
 * - Action buttons (call, email, message)
 * - Purchase information
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HomeIcon,
  BoltIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Lead {
  id: string;
  quoteType: string;
  status: string;
  purchaseStatus: string;
  purchasedAt: string | null;
  leadPrice: number | null;
  createdAt: string;
  homeowner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  quoteData?: {
    // Property details
    propertyType?: string;
    ownershipStatus?: string;
    address?: string;
    postcode?: string;
    
    // System details
    systemSize?: number;
    panelCount?: number;
    estimatedAnnualGeneration?: number;
    roofType?: string;
    roofArea?: number;
    roofOrientation?: string;
    shadingLevel?: string;
    
    // Financial details
    upfrontCost?: number;
    finalCost?: number;
    monthlyPayment?: number;
    electricityBill?: number;
    estimatedSavings?: number;
    paybackPeriod?: number;
    roi?: number;
    
    // Preferences
    batteryStorage?: boolean;
    evCharger?: boolean;
    smartExport?: boolean;
    installationUrgency?: string;
    additionalNotes?: string;
  };
}

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not installer
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    } else if (isLoaded && isSignedIn && user?.publicMetadata?.role !== 'INSTALLER') {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Fetch lead details
  useEffect(() => {
    if (isSignedIn) {
      fetchLeadDetails();
    }
  }, [isSignedIn, params.id]);

  async function fetchLeadDetails() {
    try {
      setLoading(true);
      const response = await fetch(`/api/leads/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Lead not found');
        } else if (response.status === 403) {
          throw new Error('You do not have access to this lead');
        }
        throw new Error('Failed to fetch lead details');
      }

      const data = await response.json();
      setLead(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCall() {
    if (lead?.homeowner?.phone) {
      window.location.href = `tel:${lead.homeowner.phone}`;
    }
  }

  function handleEmail() {
    if (lead?.homeowner?.email) {
      window.location.href = `mailto:${lead.homeowner.email}`;
    }
  }

  function handleMessage() {
    // TODO: Navigate to chat/messaging (Phase 6)
    alert('Messaging feature coming soon!');
  }

  function handleBack() {
    router.push('/installer/purchased-leads');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Purchased Leads
          </button>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">
              {error || 'Lead not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Purchased Leads
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Lead Details
              </h1>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300">
                  {lead.quoteType.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Purchased
                </span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleCall}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Email
              </button>
              <button
                onClick={handleMessage}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                Message
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-32 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Name:
                  </div>
                  <div className="flex-1 text-slate-900 dark:text-white">
                    {lead.homeowner.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Phone:
                  </div>
                  <div className="flex-1">
                    <a
                      href={`tel:${lead.homeowner.phone}`}
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {lead.homeowner.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Email:
                  </div>
                  <div className="flex-1">
                    <a
                      href={`mailto:${lead.homeowner.email}`}
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {lead.homeowner.email}
                    </a>
                  </div>
                </div>
                {lead.quoteData?.address && (
                  <div className="flex items-start">
                    <div className="w-32 text-sm font-medium text-slate-600 dark:text-slate-400">
                      Address:
                    </div>
                    <div className="flex-1 text-slate-900 dark:text-white">
                      {lead.quoteData.address}
                      {lead.quoteData.postcode && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {lead.quoteData.postcode}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            {lead.quoteData && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {lead.quoteData.propertyType && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Property Type
                      </div>
                      <div className="flex items-center text-slate-900 dark:text-white">
                        <HomeIcon className="h-5 w-5 mr-2 text-slate-400" />
                        {lead.quoteData.propertyType}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.ownershipStatus && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Ownership
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.ownershipStatus}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.roofType && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Roof Type
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.roofType}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.roofArea && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Roof Area
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.roofArea}m²
                      </div>
                    </div>
                  )}
                  {lead.quoteData.roofOrientation && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Roof Orientation
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.roofOrientation}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.shadingLevel && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Shading
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.shadingLevel}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Details */}
            {lead.quoteData && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Solar System Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {lead.quoteData.systemSize && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        System Size
                      </div>
                      <div className="flex items-center text-slate-900 dark:text-white">
                        <BoltIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        <span className="text-2xl font-bold">{lead.quoteData.systemSize}</span>
                        <span className="ml-1 text-sm">kW</span>
                      </div>
                    </div>
                  )}
                  {lead.quoteData.panelCount && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Panel Count
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {lead.quoteData.panelCount}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.estimatedAnnualGeneration && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Annual Generation
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.estimatedAnnualGeneration.toLocaleString()} kWh/year
                      </div>
                    </div>
                  )}
                  {lead.quoteData.electricityBill && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Monthly Bill
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        £{lead.quoteData.electricityBill}/month
                      </div>
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                {(lead.quoteData.batteryStorage || lead.quoteData.evCharger || lead.quoteData.smartExport) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Additional Features
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lead.quoteData.batteryStorage && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                          Battery Storage
                        </span>
                      )}
                      {lead.quoteData.evCharger && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                          EV Charger
                        </span>
                      )}
                      {lead.quoteData.smartExport && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                          Smart Export
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Financial Details */}
            {lead.quoteData && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Financial Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {lead.quoteData.upfrontCost && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Upfront Cost
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        £{lead.quoteData.upfrontCost.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.finalCost && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Final Cost
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        £{lead.quoteData.finalCost.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {lead.quoteData.monthlyPayment && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Monthly Payment
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        £{lead.quoteData.monthlyPayment}/month
                      </div>
                    </div>
                  )}
                  {lead.quoteData.estimatedSavings && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Estimated Savings
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-semibold">
                        £{lead.quoteData.estimatedSavings.toLocaleString()}/year
                      </div>
                    </div>
                  )}
                  {lead.quoteData.paybackPeriod && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Payback Period
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.paybackPeriod} years
                      </div>
                    </div>
                  )}
                  {lead.quoteData.roi && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        ROI
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {lead.quoteData.roi}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {lead.quoteData?.additionalNotes && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Additional Notes
                </h2>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {lead.quoteData.additionalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Timeline & Purchase Info */}
          <div className="space-y-6">
            {/* Purchase Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Purchase Info
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Purchase Price
                  </div>
                  <div className="flex items-center">
                    <CurrencyPoundIcon className="h-6 w-6 text-brand-600 dark:text-brand-400 mr-2" />
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {lead.leadPrice || 50}
                    </span>
                  </div>
                </div>
                {lead.purchasedAt && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Purchased On
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(lead.purchasedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                {lead.purchasedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        Lead Purchased
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(lead.purchasedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Lead Created
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Urgency */}
            {lead.quoteData?.installationUrgency && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Installation Urgency
                </h2>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {lead.quoteData.installationUrgency}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
