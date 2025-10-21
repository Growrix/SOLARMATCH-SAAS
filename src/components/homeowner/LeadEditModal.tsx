'use client';

import React, { useEffect, useState } from 'react';
import InstantQuoteForm from '../InstantQuoteForm';

// Icon components
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

interface LeadEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  initialData: Record<string, unknown> | null;
  onSaveSuccess: () => void;
}

/**
 * LeadEditModal
 * 
 * Allows homeowners to edit their DRAFT, PENDING_PHONE, or PENDING_APPROVAL leads.
 * Reuses the InstantQuoteForm component with pre-filled data.
 * On save, sends PATCH request to update the lead's quoteData.
 * 
 * Phase 4.9.7: Lost Feature Recovery
 */
export default function LeadEditModal({
  isOpen,
  onClose,
  leadId,
  initialData,
  onSaveSuccess,
}: LeadEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [updatedQuoteData, setUpdatedQuoteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUpdatedQuoteData(null);
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Handle quote calculation (user made changes)
  const handleQuoteCalculated = (data: any) => {
    console.log('[LeadEditModal] Quote recalculated:', data);
    setUpdatedQuoteData(data);
  };

  // Handle save
  const handleSave = async () => {
    if (!updatedQuoteData) {
      setError('Please recalculate the quote before saving');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteData: updatedQuoteData,
          postcode: updatedQuoteData.postcode,
          location: updatedQuoteData.location,
          state: updatedQuoteData.state,
          propertyType: updatedQuoteData.propertyType,
          roofType: updatedQuoteData.roofType,
          energyBill: updatedQuoteData.electricity,
          budgetRange: updatedQuoteData.budgetRange,
          desiredOffset: updatedQuoteData.desiredOffset,
          batteryRequired: updatedQuoteData.batteryIncluded,
          batteryCapacity: updatedQuoteData.batteryCapacity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update lead');
      }

      console.log('[LeadEditModal] Lead updated successfully:', result);
      
      // Show success message
      alert('Quote updated successfully!');
      
      // Call success callback
      onSaveSuccess();
      
      // Close modal
      onClose();
    } catch (err) {
      console.error('[LeadEditModal] Failed to save:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="theme-card relative w-full max-w-5xl p-4 sm:p-6 lg:p-8 animate-slide-in-up max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Quote</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Update your quote details and recalculate. Changes will be saved to your existing lead.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 rounded-lg"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Quote Form */}
        <InstantQuoteForm 
          onQuoteCalculated={handleQuoteCalculated}
          onProceedToDetailedQuote={() => {}}
          initialData={initialData}
          hideSubmitButton={true}
        />

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !updatedQuoteData}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
