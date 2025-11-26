'use client'

import React, { useState, useEffect, useCallback } from 'react';
import QuoteBuilderModal from './QuoteBuilderModal';
import { LiveCountdownBar } from '@/components/LiveCountdownBar';
import Button from '@/components/ui/button';
import QuoteDataDisplay from '@/components/admin/QuoteDataDisplay';
import LeadCard from '@/components/installer/LeadCard';
import type { Lead, LeadType, LeadStatus, InstallerProfile } from '@/components/installer/LeadCard';

// Re-export types for consumers of this component
export type { Lead, LeadType, LeadStatus, InstallerProfile };

// --- Icon Components (Feed-specific) ---
const FilterIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3z"/></svg>;
const SearchIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const RefreshIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
const CheckCircleIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ClockIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const AlertCircleIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const XIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const CreditCardIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const FileTextIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
const UnlockIcon = ({ className ="h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;

interface LeadFilters {
  leadType: 'all' | LeadType;
  status: 'all' | LeadStatus;
  postcode: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
  priceRange: 'all' | 'low' | 'medium' | 'high';
}

interface InstallerLeadFeedProps {
  installer: InstallerProfile;
  leads?: Lead[]; // Optional: use provided leads or fallback to empty array
  onUnlockLead: (leadId: string) => Promise<boolean>;
  onSubmitQuote: (leadId: string, quoteData: any) => Promise<boolean>;
  onStartChat: (leadId: string) => void;
}

// --- Stripe Payment Modal Component ---
const StripeUnlockModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUnlockLead: (leadId: string) => Promise<boolean>;
  onPaymentSuccess: (leadId: string) => void;
  installer: InstallerProfile;
}> = ({ isOpen, onClose, lead, onUnlockLead, onPaymentSuccess, installer }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!lead) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // MOCK PAYMENT (Stripe placeholder)
      // TODO: When Stripe available, add here:
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      // const { error } = await stripe.confirmCardPayment(clientSecret);
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call real purchase API
      const success = await onUnlockLead(lead.id);
      
      if (!success) {
        setPaymentStatus('error');
        setTimeout(() => setPaymentStatus('idle'), 3000);
        return;
      }
      
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentSuccess(lead.id);
        onClose();
        setPaymentStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Purchase error:', error);
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
      <div className="theme-card relative w-full max-w-md mx-4 p-6">
        <Button 
          onClick={onClose}
          variant="minimal"
          className="absolute top-4 right-4 p-2"
        >
          <XIcon />
        </Button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-heading-3 text-foreground mb-2">
            Unlock Lead Contact
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Unlock contact details for this call/visit lead in {lead.location.suburb}, {lead.location.state}
          </p>

          {/* Lead Summary */}
          <div className="bg-surface/50 shadow-neu-inset rounded-lg p-4 mb-6 text-left border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-small text-muted-foreground">Location:</span>
              <span className="text-body-small text-foreground">
                {lead.location.suburb}, {lead.location.postcode}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-small text-muted-foreground">System Size:</span>
              <span className="text-body-small text-foreground">{lead.systemDetails.estimatedSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-muted-foreground">Unlock Price:</span>
              <span className="text-heading-4 text-primary">${lead.unlockPrice}</span>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <div className="space-y-4">
              <div className="text-body-small text-muted-foreground">
                Credit Balance: <span className="text-foreground">
                  ${installer.creditBalance}
                </span>
              </div>
              
              {installer.creditBalance >= lead.unlockPrice ? (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  variant="primary"
                  className="w-full py-3"
                >
                  {isProcessing ? 'Processing...' : `Pay $${lead.unlockPrice} to Unlock`}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="text-body-small text-destructive">
                    Insufficient credit balance. Please top up your account.
                  </div>
                  <Button 
                    disabled 
                    variant="secondary"
                    className="w-full py-3 cursor-not-allowed"
                  >
                    Insufficient Credits
                  </Button>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-success mx-auto mb-4" />
              <p className="text-success">Payment successful!</p>
              <p className="text-body-small text-muted-foreground mt-2">
                Contact details are now unlocked
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center">
              <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive">Payment failed</p>
              <p className="text-body-small text-muted-foreground mt-2">
                Please try again or contact support
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- View Details Modal Component ---
const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}> = ({ isOpen, onClose, lead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'var(--shadow-outset-lg)' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-heading-3 text-foreground">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lead ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-muted-foreground">Lead ID</p>
              <p className="text-body text-foreground">#{lead.id}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-caption rounded-full ${
                lead.status === 'new' ? 'bg-success/10 text-success' :
                lead.status === 'unlocked' ? 'bg-info/10 text-info' :
                lead.status === 'submitted' ? 'bg-primary/10 text-primary' :
                lead.status === 'contacted' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {lead.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
            <h3 className="text-heading-4 text-foreground mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Name:</span>
                <span className="text-body-small text-foreground">{lead.contact.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Phone:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-body-small text-foreground">{lead.contact.phone}</span>
                  {lead.phoneVerified !== null && (
                    <span className={`text-caption ${
                      lead.phoneVerified ? 'text-success' : 'text-error'
                    }`}>
                      {lead.phoneVerified ? '✓ Verified' : '✗ Not verified'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Email:</span>
                <span className="text-body-small text-foreground">{lead.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
            <h3 className="text-heading-4 text-foreground mb-3">Property Details</h3>
            <div className="space-y-2">
              {lead.address && (
                <div className="flex items-start justify-between pb-2 border-b border-border">
                  <span className="text-body-small text-muted-foreground">Full Address:</span>
                  <span className="text-body-small text-foreground text-right max-w-[60%]">{lead.address}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Location:</span>
                <span className="text-body-small text-foreground">{lead.location.suburb}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Postcode:</span>
                <span className="text-body-small text-foreground">{lead.location.postcode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">State:</span>
                <span className="text-body-small text-foreground">{lead.location.state}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Property Type:</span>
                <span className="text-body-small text-foreground">{lead.systemDetails.propertyType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Roof Type:</span>
                <span className="text-body-small text-foreground">{lead.systemDetails.roofType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Budget Range:</span>
                <span className="text-body-small text-foreground">{lead.systemDetails.budget}</span>
              </div>
            </div>
          </div>

          {/* Energy Details */}
          {(lead.energyBill !== null || lead.desiredOffset !== null || lead.batteryRequired !== null || lead.timeframe) && (
            <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
              <h3 className="text-heading-4 text-foreground mb-3">Energy Details</h3>
              <div className="space-y-2">
                {lead.energyBill !== null && lead.billType && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-muted-foreground">Energy Bill:</span>
                    <span className="text-body-small text-foreground">${lead.energyBill!.toFixed(2)} / {lead.billType}</span>
                  </div>
                )}
                {lead.desiredOffset !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-muted-foreground">Desired Offset:</span>
                    <span className="text-body-small text-foreground">{lead.desiredOffset}%</span>
                  </div>
                )}
                {lead.batteryRequired !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-muted-foreground">Battery Required:</span>
                    <span className="text-body-small text-foreground">
                      {lead.batteryRequired ? `Yes${lead.batteryCapacity ? ` (${lead.batteryCapacity})` : ''}` : 'No'}
                    </span>
                  </div>
                )}
                {lead.timeframe && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-muted-foreground">Timeframe:</span>
                    <span className="text-body-small text-foreground">{lead.timeframe}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lead Metadata */}
          <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
            <h3 className="text-heading-4 text-foreground mb-3">Lead Information</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Quote Type:</span>
                <span className="px-2 py-1 text-caption rounded-full bg-primary/10 text-primary">
                  {lead.type === 'call_visit' ? 'Call/Visit' : lead.type === 'written' ? 'Written Quote' : 'Bidding'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">System Size:</span>
                <span className="text-body-small text-foreground">{lead.systemDetails.estimatedSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Lead Price:</span>
                <span className="text-body-small text-foreground">${lead.unlockPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Submitted:</span>
                <span className="text-body-small text-foreground">{new Date(lead.dateSubmitted).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Expires:</span>
                <span className="text-body-small text-foreground">{new Date(lead.expiresAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Quotes Received:</span>
                <span className="text-body-small text-foreground">{lead.quotesReceived}</span>
              </div>
            </div>
          </div>

          {/* Timeline/Timestamps */}
          <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
            <h3 className="text-heading-4 text-foreground mb-3">Timeline</h3>
            <div className="space-y-2">
              {lead.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Created:</span>
                  <span className="text-body-small text-foreground">{new Date(lead.createdAt).toLocaleString()}</span>
                </div>
              )}
              {lead.approvedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Approved:</span>
                  <span className="text-body-small text-foreground">{new Date(lead.approvedAt).toLocaleString()}</span>
                </div>
              )}
              {lead.purchasedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Purchased:</span>
                  <span className="text-body-small text-foreground">{new Date(lead.purchasedAt).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Expires:</span>
                <span className="text-body-small text-foreground">{new Date(lead.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* InstantQuote Data */}
          {lead.quoteData && (
            <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
              <h3 className="text-heading-4 text-foreground mb-3">📊 Instant Quote Calculation</h3>
              <QuoteDataDisplay quoteData={lead.quoteData} />
            </div>
          )}

          {/* Homeowner Additional Notes */}
          {lead.additionalNotes && (
            <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
              <h3 className="text-heading-4 text-foreground mb-2">Homeowner Notes</h3>
              <p className="text-body-small text-foreground whitespace-pre-wrap">{lead.additionalNotes}</p>
            </div>
          )}

          {/* Notes (if available) */}
          {lead.notes && (
            <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
              <h3 className="text-heading-4 text-foreground mb-2">Notes</h3>
              <p className="text-body-small text-muted-foreground">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-6">
          <Button
            onClick={onClose}
            variant="secondary"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const InstallerLeadFeed: React.FC<InstallerLeadFeedProps> = ({
  installer,
  leads: propLeads,
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

  // Initialize leads from props only (no mock fallback)
  useEffect(() => {
    if (propLeads) {
      setLeads(propLeads);
    } else {
      setLeads([]);
    }
    setLoading(false);
  }, [propLeads]);

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

  const handleUnlockLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowUnlockModal(true);
    }
  };

  // Placeholder: real purchase logic will update via parent callback after backend integration
  const handlePaymentSuccess = (leadId: string) => {
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
          <h1 className="text-heading-2 text-foreground">Lead Feed</h1>
          <p className="text-muted-foreground">
            Available leads for {installer.companyName}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <RefreshIcon className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          
          <div className="text-body-small text-muted-foreground">
            Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-muted-foreground">Available Leads</p>
              <p className="text-heading-2 text-foreground">{filteredLeads.length}</p>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <FileTextIcon className="h-5 w-5 text-info" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-muted-foreground">Unlocked Today</p>
              <p className="text-heading-2 text-foreground">3</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <UnlockIcon className="h-5 w-5 text-success" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-muted-foreground">Credit Balance</p>
              <p className="text-heading-2 text-foreground">${installer.creditBalance}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="theme-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-muted-foreground">Success Rate</p>
              <p className="text-heading-2 text-foreground">{installer.successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="theme-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location, system size, or property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-full pl-10 pr-4 py-2 rounded-xl bg-surface text-foreground shadow-neu-inset border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.leadType}
              onChange={(e) => setFilters(prev => ({ ...prev, leadType: e.target.value as any }))}
              className="form-input px-3 py-2 rounded-xl bg-surface text-foreground shadow-neu-inset border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="call_visit">Call/Visit</option>
              <option value="written">Written</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="form-input px-3 py-2 rounded-xl bg-surface text-foreground shadow-neu-inset border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="form-input w-24 px-3 py-2 rounded-xl bg-surface text-foreground shadow-neu-inset border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="form-input px-3 py-2 rounded-xl bg-surface text-foreground shadow-neu-inset border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
            <AlertCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-heading-4 text-foreground mb-2">
              No leads found
            </h3>
            <p className="text-muted-foreground">
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
        onUnlockLead={onUnlockLead}
        onPaymentSuccess={handlePaymentSuccess}
        installer={installer}
      />
    </div>
  );
};

export default InstallerLeadFeed;