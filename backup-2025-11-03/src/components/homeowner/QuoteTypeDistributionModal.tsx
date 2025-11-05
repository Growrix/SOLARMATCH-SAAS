'use client';

import { useState, useEffect } from 'react';

// Icon components
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;

const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

export interface QuoteDistribution {
  type: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING';
  count: number;
}

interface QuoteTypeDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (distributions: QuoteDistribution[]) => void;
  remainingQuota: number;
  quoteData?: any; // InstantQuote calculation results for context
  userAlreadyHasBiddingLead?: boolean; // Phase 4.9.7: Check if user used their one-time bidding
}

/**
 * QuoteTypeDistributionModal
 * 
 * Allows homeowners to select how many quotes of each type they want to request
 * within their remaining quota. Provides real-time validation and total count display.
 * 
 * Example:
 *   - Remaining quota: 4
 *   - User selects: 2 Call/Visit + 2 Written = 4 total ✓
 *   - On submit: [{ type: 'CALL_VISIT', count: 2 }, { type: 'WRITTEN_QUOTE', count: 2 }]
 */
export default function QuoteTypeDistributionModal({
  isOpen,
  onClose,
  onSubmit,
  remainingQuota,
  quoteData,
  userAlreadyHasBiddingLead = false,
}: QuoteTypeDistributionModalProps) {
  const [callVisitCount, setCallVisitCount] = useState(0);
  const [writtenQuoteCount, setWrittenQuoteCount] = useState(0);
  const [biddingCount, setBiddingCount] = useState(0); // Phase 4.9.7: Add bidding state

  // Reset counts when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallVisitCount(0);
      setWrittenQuoteCount(0);
      setBiddingCount(0);
    }
  }, [isOpen]);

  // Calculate total selected (including bidding)
  const totalSelected = callVisitCount + writtenQuoteCount + biddingCount;
  const isValid = totalSelected > 0 && totalSelected <= remainingQuota;
  const exceedsQuota = totalSelected > remainingQuota;

  // Handle count changes
  const handleCallVisitChange = (count: number) => {
    setCallVisitCount(Math.max(0, Math.min(count, remainingQuota)));
  };

  const handleWrittenQuoteChange = (count: number) => {
    setWrittenQuoteCount(Math.max(0, Math.min(count, remainingQuota)));
  };

  // Phase 4.9.7: Handle bidding count change (only 0 or 1 allowed)
  const handleBiddingChange = (count: number) => {
    if (count === 1 && userAlreadyHasBiddingLead) {
      alert('You have already used your one-time bidding request. Only one bidding request is allowed per homeowner.');
      return;
    }
    setBiddingCount(Math.max(0, Math.min(count, 1))); // Max 1 bidding request
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isValid) return;

    const distributions: QuoteDistribution[] = [];
    
    if (callVisitCount > 0) {
      distributions.push({ type: 'CALL_VISIT', count: callVisitCount });
    }
    
    if (writtenQuoteCount > 0) {
      distributions.push({ type: 'WRITTEN_QUOTE', count: writtenQuoteCount });
    }

    if (biddingCount > 0) {
      distributions.push({ type: 'BIDDING', count: biddingCount });
    }

    onSubmit(distributions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Select Quote Distribution
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Choose how many quotes of each type you want to request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Remaining Quota Display */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Remaining Quote Allowance
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {remainingQuota}
              </span>
            </div>
          </div>

          {/* Call or Site Visit Quotes Section */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <PhoneIcon /> Call or Site Visit Quotes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Installers will contact you to schedule a site visit and provide a personalized quote
                </p>
              </div>
            </div>

            {/* Count Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Count:
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleCallVisitChange(num)}
                    className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                      callVisitCount === num
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Written Quotes Section */}
          <div className="theme-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileTextIcon /> Written Quotes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Receive detailed written proposals from installers with pricing and system specifications
                </p>
              </div>
            </div>

            {/* Count Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Count:
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleWrittenQuoteChange(num)}
                    className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                      writtenQuoteCount === num
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Phase 4.9.7: Competitive Bidding Section */}
          <div className="theme-card p-6 space-y-4 border-2 border-amber-200 dark:border-amber-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrophyIcon /> Competitive Bidding
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Open competitive bidding - multiple installers submit proposals to compete for your project
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
                  ⚠️ Limited to 1 bidding request per homeowner (one-time only)
                </p>
              </div>
            </div>

            {/* Count Selector - Only 0 or 1 */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Count:
              </label>
              <div className="flex gap-2">
                {[0, 1].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleBiddingChange(num)}
                    disabled={userAlreadyHasBiddingLead && num === 1}
                    className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                      biddingCount === num
                        ? 'bg-amber-600 text-white shadow-md scale-105'
                        : userAlreadyHasBiddingLead && num === 1
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {userAlreadyHasBiddingLead && (
                <p className="text-xs text-red-600 dark:text-red-400 ml-2">
                  You have already used your one-time bidding request
                </p>
              )}
            </div>
          </div>

          {/* Total Count Display */}
          <div className={`rounded-lg p-4 ${
            exceedsQuota
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : totalSelected === 0
              ? 'bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                exceedsQuota
                  ? 'text-red-900 dark:text-red-100'
                  : totalSelected === 0
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-blue-900 dark:text-blue-100'
              }`}>
                Total Selected
              </span>
              <span className={`text-2xl font-bold ${
                exceedsQuota
                  ? 'text-red-600 dark:text-red-400'
                  : totalSelected === 0
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-info dark:text-blue-400'
              }`}>
                {totalSelected} of {remainingQuota}
              </span>
            </div>

            {/* Validation Messages */}
            {exceedsQuota && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                ⚠️ Total count exceeds your remaining quota. Please reduce your selection.
              </p>
            )}
            {totalSelected === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Please select at least one quote to continue.
              </p>
            )}
            {isValid && (
              <p className="text-sm text-info dark:text-blue-400 mt-2">
                ✓ Valid selection! Click confirm to proceed.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              isValid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}