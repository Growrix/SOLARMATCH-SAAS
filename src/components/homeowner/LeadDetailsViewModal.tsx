'use client';

import React from 'react';

// Close Icon
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Edit Icon
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

interface LeadDetailsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    quoteType: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING';
    status: string;
    createdAt: string;
    updatedAt: string;
    quoteData: Record<string, unknown> | null;
  } | null;
  onEdit?: (leadId: string) => void;
}

const QUOTE_TYPE_LABELS = {
  CALL_VISIT: 'Call or Site Visit',
  WRITTEN_QUOTE: 'Written Quote',
  BIDDING: 'Bidding',
};

const STATUS_LABELS: Record<string, { label: string; accent: string }> = {
  DRAFT: { label: 'Draft', accent: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  PENDING_PHONE: { label: 'Needs Verification', accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  PENDING_APPROVAL: { label: 'Awaiting Review', accent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  APPROVED: { label: 'Approved', accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  BIDDING_PENDING: { label: 'Bidding - Awaiting Approval', accent: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  BIDDING_OPEN: { label: 'Bidding Open', accent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  PURCHASED: { label: 'Purchased', accent: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  QUOTED: { label: 'Quotes Received', accent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  ACCEPTED: { label: 'Accepted', accent: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  REJECTED: { label: 'Rejected', accent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  EXPIRED: { label: 'Expired', accent: 'bg-slate-200 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400' },
  CANCELLED: { label: 'Cancelled', accent: 'bg-slate-200 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400' },
  FLAGGED: { label: 'Flagged', accent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
};

const formatCurrency = (value: number | null | undefined): string => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const LeadDetailsViewModal: React.FC<LeadDetailsViewModalProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
}) => {
  if (!isOpen || !lead) return null;

  const canEdit = ['DRAFT', 'PENDING_PHONE', 'PENDING_APPROVAL'].includes(lead.status);
  const statusInfo = STATUS_LABELS[lead.status] || { label: lead.status, accent: 'bg-gray-100 text-gray-600' };

  // Handle old leads with null quoteData (before Phase 4.5)
  if (!lead.quoteData) {
    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8"
        onClick={onClose}
      >
        <div
          className="theme-card relative w-full max-w-2xl p-6 animate-slide-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Details</h2>
            <button
              onClick={onClose}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This lead was created before detailed quote data was stored. Limited information is available.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quote Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {QUOTE_TYPE_LABELS[lead.quoteType]}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <span className={`inline-block text-sm px-3 py-1 rounded-full ${statusInfo.accent}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatDateTime(lead.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract quote data fields
  const {
    postcode,
    location,
    state,
    roofType,
    budgetRange,
    batteryIncluded,
    batteryCapacity,
    desiredOffset,
    systemSize,
    estimatedCost,
    estimatedSavings,
    paybackPeriod,
    roi25Year,
  } = lead.quoteData as any;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="theme-card relative w-full max-w-4xl p-6 my-8 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quote Request Details</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-sm px-3 py-1 rounded-full ${statusInfo.accent}`}>
                {statusInfo.label}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {QUOTE_TYPE_LABELS[lead.quoteType]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Project Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Location</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {location || '—'}, {state || '—'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Postcode: {postcode || '—'}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Roof Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {roofType || '—'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Budget Range</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {budgetRange || '—'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Desired Solar Offset</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {desiredOffset ? `${desiredOffset}%` : '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Battery Information */}
          {batteryIncluded && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Battery Storage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Battery Included</p>
                  <p className="text-base font-medium text-emerald-600 dark:text-emerald-400">
                    ✓ Yes
                  </p>
                </div>
                {batteryCapacity && (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Battery Capacity</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {batteryCapacity} kWh
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* System Recommendations & Costs */}
          {(systemSize || estimatedCost) && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Recommendations & Costs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {systemSize && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Recommended System Size</p>
                    <p className="text-2xl font-bold text-primary">{systemSize} kW</p>
                  </div>
                )}
                {estimatedCost && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Cost</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(estimatedCost)}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Savings & ROI */}
          {(estimatedSavings || paybackPeriod || roi25Year) && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Savings & ROI</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {estimatedSavings && (
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Annual Savings</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(estimatedSavings)}
                    </p>
                  </div>
                )}
                {paybackPeriod && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Payback Period</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {paybackPeriod} years
                    </p>
                  </div>
                )}
                {roi25Year && (
                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">25-Year ROI</p>
                    <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                      {roi25Year}%
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Created</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Last Updated</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatDateTime(lead.updatedAt)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(lead.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <EditIcon />
              <span>Edit Lead</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsViewModal;
