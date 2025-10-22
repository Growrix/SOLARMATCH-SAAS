// ============================================================================
// ADMIN LEAD DETAIL PAGE
// ============================================================================
// Displays full lead details with admin actions: approve, reject, set price,
// assign installers, and mark as hot lead
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import QuoteDataDisplay from '@/components/admin/QuoteDataDisplay';

// ============================================================================
// TYPES
// ============================================================================

interface Lead {
  id: string;
  homeownerId: string;
  installerId: string | null;
  status: string;
  visibility: string;
  phoneVerified: boolean;
  phoneNumber: string | null;
  quoteType?: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING'; // Phase 4.12: Quote type
  projectType: string;
  propertyType: string;
  postcode: string;
  location: string;
  state: string;
  address: string | null;
  energyBill: number;
  billType: string;
  roofType: string;
  budgetRange: string;
  desiredOffset: number;
  batteryRequired: boolean;
  batteryCapacity: string | null;
  timeframe: string | null;
  additionalNotes: string | null;
  quoteData: any | null; // Phase 4.5: Complete instant quote data
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  purchasedAt: string | null;
  expiresAt: string | null;
  adminNotes: string | null;
  flaggedReason: string | null;
  moderatedBy: string | null;
  moderatedAt: string | null;
  leadPrice: number | null;
  purchaseStatus: string | null;
  stripePaymentIntentId: string | null;
  homeowner?: {
    id: string;
    name: string | null;
    email: string | null;
    phoneVerified: boolean;
    leadSubmissionLimit: number;
    leadSubmissionCount: number;
  };
  installer?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

// ============================================================================
// ICONS
// ============================================================================

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminLeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [leadPrice, setLeadPrice] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  
  // Action states
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  // ============================================================================
  // FETCH LEAD DATA
  // ============================================================================

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leads/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }
      
      const data = await response.json();
      // API returns { lead: {...} }, so unwrap it
      const leadData = data.lead || data;
      setLead(leadData);
      setLeadPrice(leadData.leadPrice?.toString() || '');
      setAdminNotes(leadData.adminNotes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // APPROVE LEAD
  // ============================================================================

  const handleApprove = async () => {
    if (!lead) return;

    try {
      setApproving(true);
      const response = await fetch(`/api/leads/${lead.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadPrice: leadPrice ? parseFloat(leadPrice) : undefined,
          visibility: 'PUBLIC',
          assignToAll: true, // Default: assign to all installers
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve lead');
      }

      // Refresh lead data
      await fetchLead();
      setShowApproveModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve lead');
    } finally {
      setApproving(false);
    }
  };

  // ============================================================================
  // REJECT LEAD
  // ============================================================================

  const handleReject = async () => {
    if (!lead || !rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setRejecting(true);
      const response = await fetch(`/api/leads/${lead.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectReason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject lead');
      }

      // Refresh lead data
      await fetchLead();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject lead');
    } finally {
      setRejecting(false);
    }
  };

  // ============================================================================
  // UPDATE PRICE
  // ============================================================================

  const handleSavePrice = async () => {
    if (!lead || !leadPrice) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setSavingPrice(true);
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadPrice: parseFloat(leadPrice),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update price');
      }

      await fetchLead();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update price');
    } finally {
      setSavingPrice(false);
    }
  };

  // ============================================================================
  // UPDATE ADMIN NOTES
  // ============================================================================

  const handleSaveNotes = async () => {
    if (!lead) return;

    try {
      setSavingNotes(true);
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNotes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update notes');
      }

      await fetchLead();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: theme === 'dark' ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700',
      APPROVED: theme === 'dark' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700',
      REJECTED: theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700',
      PURCHASED: theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
      IN_PROGRESS: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
      COMPLETED: theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  // Phase 4.12: Quote Type helpers
  const getQuoteTypeLabel = (quoteType?: string) => {
    const labels: Record<string, string> = {
      CALL_VISIT: 'Call/Visit',
      WRITTEN_QUOTE: 'Written Quote',
      BIDDING: 'Competitive Bidding',
    };
    return quoteType ? labels[quoteType] || quoteType : 'Not specified';
  };

  const getQuoteTypeIcon = (quoteType?: string) => {
    const icons: Record<string, string> = {
      CALL_VISIT: '📞',
      WRITTEN_QUOTE: '📄',
      BIDDING: '🏆',
    };
    return quoteType ? icons[quoteType] || '❓' : '❓';
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIcon />
        <span className="ml-2">Loading lead details...</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Lead not found'}</p>
        <button
          onClick={() => router.push('/admin/leads')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => router.push('/admin/leads')}
          className={`flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeftIcon />
          <span>Back to Leads</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Lead Details
            </h1>
            <div className="flex items-center gap-4">
              <p className={`font-mono text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Quote ID: <span className="font-semibold">Q-{lead.id.slice(-8).toUpperCase()}</span>
              </p>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>•</span>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Created: {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            {lead.phoneVerified && (
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-full text-xs font-medium">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* HOMEOWNER INFO */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Homeowner Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.homeowner?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.homeowner?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contact Number</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.phoneNumber || 'Not provided'}
                  {lead.phoneNumber && (
                    <span className="ml-2">
                      {lead.phoneVerified ? (
                        <span className="text-green-500 text-xs">✓ Verified</span>
                      ) : (
                        <span className="text-red-500 text-xs">✗ Not verified</span>
                      )}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Quote Type</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="mr-2">{getQuoteTypeIcon(lead.quoteType)}</span>
                  {getQuoteTypeLabel(lead.quoteType)}
                </p>
              </div>
            </div>
          </div>

          {/* HOMEOWNER QUOTE QUOTA */}
          {lead.homeowner && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                📊 Quote Request Quota
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Limit</p>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {lead.homeowner.leadSubmissionLimit}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Submitted</p>
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {lead.homeowner.leadSubmissionCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</p>
                    <p className={`text-2xl font-bold ${
                      lead.homeowner.leadSubmissionLimit - lead.homeowner.leadSubmissionCount > 0
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {Math.max(0, lead.homeowner.leadSubmissionLimit - lead.homeowner.leadSubmissionCount)}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      lead.homeowner.leadSubmissionCount >= lead.homeowner.leadSubmissionLimit
                        ? 'bg-red-500'
                        : lead.homeowner.leadSubmissionCount / lead.homeowner.leadSubmissionLimit > 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (lead.homeowner.leadSubmissionCount / lead.homeowner.leadSubmissionLimit) * 100)}%`
                    }}
                  />
                </div>
                
                {/* Status Message */}
                {lead.homeowner.leadSubmissionCount >= lead.homeowner.leadSubmissionLimit && (
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                    <p className="text-sm font-medium">⚠️ Quota limit reached</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROJECT DETAILS */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Project Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Project Type</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.projectType}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Property Type</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.propertyType}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.location}, {lead.state}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Postcode</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.postcode}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Roof Type</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.roofType}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Budget Range</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.budgetRange}
                </p>
              </div>
            </div>
          </div>

          {/* ENERGY DETAILS */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Energy Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Energy Bill</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  £{lead.energyBill.toFixed(2)} / {lead.billType}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Desired Offset</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.desiredOffset}%
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Battery Required</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.batteryRequired ? `Yes (${lead.batteryCapacity})` : 'No'}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Timeframe</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lead.timeframe || 'N/A'}
                </p>
              </div>
            </div>

            {lead.additionalNotes && (
              <div className="mt-4">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Additional Notes</p>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                  {lead.additionalNotes}
                </p>
              </div>
            )}
          </div>

          {/* QUOTE DATA (Phase 4.5) */}
          {lead.quoteData && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                📊 Instant Quote Calculation
              </h2>
              <QuoteDataDisplay quoteData={lead.quoteData} />
            </div>
          )}

          {/* TIMESTAMPS */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Created</span>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              {lead.approvedAt && (
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Approved</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(lead.approvedAt)}
                  </span>
                </div>
              )}
              {lead.purchasedAt && (
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Purchased</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(lead.purchasedAt)}
                  </span>
                </div>
              )}
              {lead.expiresAt && (
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Expires</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(lead.expiresAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Admin Actions */}
        <div className="space-y-6">
          {/* ACTION BUTTONS - Show for DRAFT, PENDING_APPROVAL, and PENDING_PHONE statuses */}
          {(['DRAFT', 'PENDING_APPROVAL', 'PENDING_PHONE'].includes(lead.status)) && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  <CheckIcon />
                  Approve Lead
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  <XIcon />
                  Reject Lead
                </button>
              </div>
            </div>
          )}

          {/* PRICING */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Lead Pricing
            </h2>
            <div className="space-y-3">
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Price (£)
                </label>
                <input
                  type="number"
                  value={leadPrice}
                  onChange={(e) => setLeadPrice(e.target.value)}
                  placeholder="Enter price"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <button
                onClick={handleSavePrice}
                disabled={savingPrice || !leadPrice}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPrice ? <LoadingIcon /> : <SaveIcon />}
                Save Price
              </button>
            </div>
          </div>

          {/* ADMIN NOTES */}
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Admin Notes
            </h2>
            <div className="space-y-3">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes..."
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#0A0F1E] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingNotes ? <LoadingIcon /> : <SaveIcon />}
                Save Notes
              </button>
            </div>
          </div>

          {/* PURCHASE STATUS */}
          {lead.installerId && (
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Purchase Info
              </h2>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Installer</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lead.installer?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lead.purchaseStatus || 'Not Purchased'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* APPROVE MODAL */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Approve Lead
            </h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              This will approve the lead and make it visible to installers in the marketplace.
              {!leadPrice && ' Please set a price first.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approving || !leadPrice}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {approving ? <LoadingIcon /> : <CheckIcon />}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Reject Lead
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Please provide a reason for rejection. The homeowner will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                theme === 'dark'
                  ? 'bg-[#0A0F1E] border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {rejecting ? <LoadingIcon /> : <XIcon />}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
