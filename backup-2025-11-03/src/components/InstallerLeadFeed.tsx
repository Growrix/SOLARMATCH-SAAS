'use client'

import React, { useState, useEffect, useCallback } from 'react';
import QuoteBuilderModal from './QuoteBuilderModal';
import { LiveCountdownBar } from '@/components/LiveCountdownBar';

// --- Icon Components ---
const FilterIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3z"/></svg>;
const SearchIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const RefreshIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
const MapPinIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const CalendarIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BoltIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const DollarSignIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const LockIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UnlockIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
const PhoneIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const FileTextIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
const CreditCardIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const CheckCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ClockIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const AlertCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const SendIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;

// --- Types ---
export type LeadType = 'call_visit' | 'written';
export type LeadStatus = 'new' | 'unlocked' | 'submitted' | 'expired' | 'contacted';

export interface Lead {
  id: number;
  homeownerId: number;
  type: LeadType;
  status: LeadStatus;
  dateSubmitted: Date;
  location: {
    suburb: string;
    postcode: string;
    state: string;
  };
  systemDetails: {
    estimatedSize: string;
    roofType: string;
    propertyType: string;
    budget: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  unlockPrice: number;
  isUnlocked: boolean;
  unlockedBy: number[];
  quotesReceived: number;
  expiresAt: Date; // TODO: Change to string (ISO) for countdown timer integration with real API
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface InstallerProfile {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  serviceAreas: string[];
  isApproved: boolean;
  creditBalance: number;
  totalUnlocks: number;
  successRate: number;
}

interface LeadFilters {
  leadType: 'all' | LeadType;
  status: 'all' | LeadStatus;
  postcode: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
  priceRange: 'all' | 'low' | 'medium' | 'high';
}

interface InstallerLeadFeedProps {
  installer: InstallerProfile;
  onUnlockLead: (leadId: number) => Promise<boolean>;
  onSubmitQuote: (leadId: number, quoteData: any) => Promise<boolean>;
  onStartChat: (leadId: number) => void;
}

// --- Stripe Payment Modal Component ---
const StripeUnlockModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onPaymentSuccess: (leadId: number) => void;
  installer: InstallerProfile;
}> = ({ isOpen, onClose, lead, onPaymentSuccess, installer }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!lead) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Mock Stripe payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentSuccess(lead.id);
        onClose();
        setPaymentStatus('idle');
      }, 1500);
    } catch (error) {
      setPaymentStatus('error');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <XIcon />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Unlock Lead Contact
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Unlock contact details for this call/visit lead in {lead.location.suburb}, {lead.location.state}
          </p>

          {/* Lead Summary */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Location:</span>
              <span className="text-sm text-slate-900 dark:text-white">
                {lead.location.suburb}, {lead.location.postcode}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">System Size:</span>
              <span className="text-sm text-slate-900 dark:text-white">{lead.systemDetails.estimatedSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Unlock Price:</span>
              <span className="text-lg font-bold text-primary">${lead.unlockPrice}</span>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Credit Balance: <span className="font-semibold text-slate-700 dark:text-slate-300">
                  ${installer.creditBalance}
                </span>
              </div>
              
              {installer.creditBalance >= lead.unlockPrice ? (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay $${lead.unlockPrice} to Unlock`}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Insufficient credit balance. Please top up your account.
                  </div>
                  <button className="w-full bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-3 rounded-lg font-semibold cursor-not-allowed">
                    Insufficient Credits
                  </button>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Processing payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-success dark:text-green-400 font-semibold">Payment successful!</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Contact details are now unlocked
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center">
              <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 font-semibold">Payment failed</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Please try again or contact support
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Lead Card Component ---
const LeadCard: React.FC<{
  lead: Lead;
  installer: InstallerProfile;
  onUnlock: (leadId: number) => void;
  onSubmitQuote: (leadId: number, quoteData: any) => Promise<boolean>;
  onStartChat: (leadId: number) => void;
}> = ({ lead, installer, onUnlock, onSubmitQuote, onStartChat }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const isUnlockedByInstaller = lead.unlockedBy.includes(installer.id);
  const canUnlock = lead.type === 'call_visit' && !isUnlockedByInstaller && lead.status === 'new';
  const canQuote = lead.type === 'written' || isUnlockedByInstaller;

  const getStatusBadge = () => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    
    switch (lead.status) {
      case 'new':
        return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
      case 'unlocked':
        return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'submitted':
        return `${baseClasses} bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400`;
      case 'contacted':
        return `${baseClasses} bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  const getPriorityColor = () => {
    switch (lead.priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <div className={`theme-card border-l-4 ${getPriorityColor()} p-6 transition-colors duration-200 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {lead.type === 'call_visit' ? (
              <PhoneIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <FileTextIcon className="h-5 w-5 text-purple-500" />
            )}
            <span className="font-semibold text-slate-900 dark:text-white">
              {lead.type === 'call_visit' ? 'Call/Visit Lead' : 'Written Quote Lead'}
            </span>
          </div>
          
          {canUnlock && (
            <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
              <LockIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Unlock Required</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={getStatusBadge()}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatTimeAgo(lead.dateSubmitted)}
          </span>
        </div>
      </div>

      {/* Lead Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPinIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">
              {lead.location.suburb}, {lead.location.postcode}, {lead.location.state}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <BoltIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">
              {lead.systemDetails.estimatedSize} • {lead.systemDetails.roofType} Roof
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <DollarSignIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">
              Budget: {lead.systemDetails.budget}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Countdown timer - Show for active marketplace leads (mock data uses 'new' for approved leads) */}
          {lead.status === 'new' && (
            <div className="flex items-center space-x-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <LiveCountdownBar
                expiresAt={lead.expiresAt.toISOString()}
                leadId={String(lead.id)}
                leadStatus={lead.status}
                quoteType="instant"
                position="inline"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm">
            <FileTextIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">
              {lead.quotesReceived} quotes received
            </span>
          </div>
          
          {lead.type === 'call_visit' && (
            <div className="flex items-center space-x-2 text-sm">
              <CreditCardIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-900 dark:text-white">
                Unlock: ${lead.unlockPrice}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info (if unlocked) */}
      {isUnlockedByInstaller && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <UnlockIcon className="h-4 w-4 text-success dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Contact Details Unlocked
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Name:</span>
              <span className="ml-2 text-slate-900 dark:text-white">{lead.contact.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span>
              <span className="ml-2 text-slate-900 dark:text-white">{lead.contact.phone}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span>
              <span className="ml-2 text-slate-900 dark:text-white">{lead.contact.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {canUnlock && (
          <button
            onClick={() => onUnlock(lead.id)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <LockIcon className="h-4 w-4" />
            <span>Unlock Lead (${lead.unlockPrice})</span>
          </button>
        )}

        {canQuote && (
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <SendIcon className="h-4 w-4" />
            <span>Submit Quote</span>
          </button>
        )}

        {isUnlockedByInstaller && (
          <button
            onClick={() => onStartChat(lead.id)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>Start Chat</span>
          </button>
        )}

        {lead.type === 'written' && !canQuote && (
          <div className="text-sm text-slate-500 dark:text-slate-400 italic">
            Available for written quotes only
          </div>
        )}
      </div>
      </div>

      {/* Quote Builder Modal */}
      <QuoteBuilderModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        lead={{
          id: lead.id,
          name: lead.contact.name,
          location: `${lead.location.suburb}, ${lead.location.state} ${lead.location.postcode}`,
          propertyType: lead.systemDetails.propertyType,
          systemSize: lead.systemDetails.estimatedSize,
          estimatedUsage: 'N/A',
          budget: lead.systemDetails.budget
        }}
        onSubmitQuote={onSubmitQuote}
      />
    </>
  );
};

// --- Main Component ---
const InstallerLeadFeed: React.FC<InstallerLeadFeedProps> = ({ 
  installer, 
  onUnlockLead, 
  onSubmitQuote, 
  onStartChat 
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    leadType: 'all',
    status: 'all',
    postcode: '',
    dateRange: 'all',
    priceRange: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Ensure lastUpdated is set only on the client to avoid SSR hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // Mock leads data
  const mockLeads: Lead[] = [
    {
      id: 1,
      homeownerId: 101,
      type: 'call_visit',
      status: 'new',
      dateSubmitted: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: { suburb: 'Bondi', postcode: '2026', state: 'NSW' },
      systemDetails: {
        estimatedSize: '6.6kW',
        roofType: 'Tile',
        propertyType: 'House',
        budget: '$8,000 - $15,000'
      },
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '0412 345 678'
      },
      unlockPrice: 25,
      isUnlocked: false,
      unlockedBy: [],
      quotesReceived: 0,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high'
    },
    {
      id: 2,
      homeownerId: 102,
      type: 'written',
      status: 'new',
      dateSubmitted: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: { suburb: 'Parramatta', postcode: '2150', state: 'NSW' },
      systemDetails: {
        estimatedSize: '10kW',
        roofType: 'Metal',
        propertyType: 'Townhouse',
        budget: '$12,000 - $20,000'
      },
      contact: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '0423 456 789'
      },
      unlockPrice: 0,
      isUnlocked: true,
      unlockedBy: [],
      quotesReceived: 2,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: 3,
      homeownerId: 103,
      type: 'call_visit',
      status: 'unlocked',
      dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      location: { suburb: 'Manly', postcode: '2095', state: 'NSW' },
      systemDetails: {
        estimatedSize: '8.5kW',
        roofType: 'Tile',
        propertyType: 'House',
        budget: '$10,000 - $18,000'
      },
      contact: {
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '0434 567 890'
      },
      unlockPrice: 30,
      isUnlocked: true,
      unlockedBy: [installer.id],
      quotesReceived: 1,
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      priority: 'high'
    }
  ];

  // Initialize leads
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(mockLeads);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter and search leads
  const filteredLeads = leads.filter(lead => {
    if (filters.leadType !== 'all' && lead.type !== filters.leadType) return false;
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.postcode && !lead.location.postcode.includes(filters.postcode)) return false;
    
    const now = new Date();
    const leadDate = lead.dateSubmitted;
    switch (filters.dateRange) {
      case 'today':
        if (now.toDateString() !== leadDate.toDateString()) return false;
        break;
      case 'week':
        if (now.getTime() - leadDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
        break;
      case 'month':
        if (now.getTime() - leadDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
        break;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchable = `${lead.location.suburb} ${lead.location.postcode} ${lead.systemDetails.estimatedSize} ${lead.systemDetails.propertyType}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    
    return true;
  });

  const handleUnlockLead = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowUnlockModal(true);
    }
  };

  const handlePaymentSuccess = (leadId: number) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: 'unlocked' as LeadStatus, unlockedBy: [...lead.unlockedBy, installer.id] }
        : lead
    ));
    setShowUnlockModal(false);
    setSelectedLead(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Feed</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Available leads for {installer.companyName}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RefreshIcon className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Available Leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredLeads.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileTextIcon className="h-5 w-5 text-info dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unlocked Today</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UnlockIcon className="h-5 w-5 text-success dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Credit Balance</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${installer.creditBalance}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{installer.successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="theme-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location, system size, or property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.leadType}
              onChange={(e) => setFilters(prev => ({ ...prev, leadType: e.target.value as any }))}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="call_visit">Call/Visit</option>
              <option value="written">Written</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="unlocked">Unlocked</option>
              <option value="submitted">Submitted</option>
            </select>

            <input
              type="text"
              placeholder="Postcode"
              value={filters.postcode}
              onChange={(e) => setFilters(prev => ({ ...prev, postcode: e.target.value }))}
              className="w-24 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="theme-card text-center py-12">
            <AlertCircleIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No leads found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your filters or check back later for new leads.
            </p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              installer={installer}
              onUnlock={handleUnlockLead}
              onSubmitQuote={onSubmitQuote}
              onStartChat={onStartChat}
            />
          ))
        )}
      </div>

      {/* Stripe Unlock Modal */}
      <StripeUnlockModal
        isOpen={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onPaymentSuccess={handlePaymentSuccess}
        installer={installer}
      />
    </div>
  );
};

export default InstallerLeadFeed;