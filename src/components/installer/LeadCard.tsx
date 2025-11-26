/**
 * LeadCard Component
 * 
 * Reusable lead card component used in:
 * - Installer Lead Feed (assigned leads)
 * - Purchased Leads Page (purchased leads)
 * 
 * Shows different states based on props:
 * - New leads: Unlock button visible
 * - Unlocked leads: Contact details revealed
 * - Purchased by another: Disabled state with banner
 * - Purchased by me: Contact details + View Details button
 */

'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { LiveCountdownBar } from '@/components/LiveCountdownBar';
import QuoteBuilderModal from '@/components/QuoteBuilderModal';

// --- Icon Components ---
const MapPinIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const CalendarIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BoltIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const DollarSignIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const LockIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UnlockIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
const PhoneIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const FileTextIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
const CreditCardIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const SendIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;
const EyeIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;

// --- Types ---
export type LeadType = 'call_visit' | 'written' | 'bidding';
export type LeadStatus = 'new' | 'unlocked' | 'submitted' | 'expired' | 'contacted';

export interface Lead {
  id: string;
  homeownerId: string;
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
  isPurchasedByAnother?: boolean;
  unlockedBy: number[];
  quotesReceived: number;
  expiresAt: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  address?: string | null;
  energyBill?: number | null;
  billType?: string | null;
  desiredOffset?: number | null;
  batteryRequired?: boolean | null;
  batteryCapacity?: string | null;
  timeframe?: string | null;
  additionalNotes?: string | null;
  phoneNumber?: string | null;
  phoneVerified?: boolean | null;
  createdAt?: string;
  approvedAt?: string | null;
  purchasedAt?: string | null;
  quoteData?: any | null;
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

// --- View Details Modal Component ---
const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}> = ({ isOpen, onClose, lead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
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
                <span className="text-body-small text-foreground">{lead.contact.phone}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Location:</span>
                <span className="text-body-small text-foreground">{lead.location.suburb}, {lead.location.postcode}, {lead.location.state}</span>
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

          {/* System Details */}
          <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
            <h3 className="text-heading-4 text-foreground mb-3">System Information</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">System Size:</span>
                <span className="text-body-small text-foreground">{lead.systemDetails.estimatedSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Lead Price:</span>
                <span className="text-body-small text-foreground">${lead.unlockPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-muted-foreground">Quotes Received:</span>
                <span className="text-body-small text-foreground">{lead.quotesReceived}</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {lead.additionalNotes && (
            <div className="bg-surface rounded-lg shadow-neu-inset border border-border p-4">
              <h3 className="text-heading-4 text-foreground mb-2">Homeowner Notes</h3>
              <p className="text-body-small text-foreground whitespace-pre-wrap">{lead.additionalNotes}</p>
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

// --- Lead Card Component ---
export interface LeadCardProps {
  lead: Lead;
  installer: InstallerProfile;
  onUnlock: (leadId: string) => void;
  onSubmitQuote: (leadId: string, quoteData: any) => Promise<boolean>;
  onStartChat: (leadId: string) => void;
  isPurchased?: boolean; // NEW: If true, show as purchased (contact unlocked, no purchase buttons)
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  installer, 
  onUnlock, 
  onSubmitQuote, 
  onStartChat,
  isPurchased = false 
}) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  const isUnlockedByInstaller = isPurchased || lead.isUnlocked;
  const isPurchasedByAnother = !isPurchased && (lead.isPurchasedByAnother || false);
  const canUnlock = !isPurchased && lead.type === 'call_visit' && !isUnlockedByInstaller && !isPurchasedByAnother && lead.status === 'new';
  const canQuote = !isPurchased && (lead.type === 'written' || isUnlockedByInstaller);

  const getStatusBadge = () => {
    const baseClasses = "px-2 py-1 text-caption rounded-full";
    
    if (isPurchased) {
      return `${baseClasses} bg-success/10 text-success`;
    }
    
    switch (lead.status) {
      case 'new':
        return `${baseClasses} bg-success/10 text-success`;
      case 'unlocked':
        return `${baseClasses} bg-info/10 text-info`;
      case 'submitted':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'contacted':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'expired':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getPriorityColor = () => {
    switch (lead.priority) {
      case 'high': return 'border-l-destructive';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
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
      <div className={`theme-card border-l-4 ${getPriorityColor()} p-6 transition-colors duration-200 ${isPurchasedByAnother ? 'opacity-50' : ''}`}>
      
      {/* Banner if purchased by another installer */}
      {isPurchasedByAnother && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <LockIcon className="h-5 w-5 text-error" />
            <p className="text-body text-error">
              ⛔ This lead has been purchased by another installer
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {lead.type === 'call_visit' ? (
              <PhoneIcon className="h-5 w-5 text-info" />
            ) : (
              <FileTextIcon className="h-5 w-5 text-primary" />
            )}
            <span className="text-foreground">
              {lead.type === 'call_visit' ? 'Call/Visit Lead' : 'Written Quote Lead'}
            </span>
          </div>
          
          {canUnlock && (
            <div className="flex items-center space-x-1 text-warning">
              <LockIcon className="h-4 w-4" />
              <span className="text-caption">Unlock Required</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={getStatusBadge()}>
            {isPurchased ? 'PURCHASED' : lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
          <span className="text-caption text-muted-foreground">
            {formatTimeAgo(lead.dateSubmitted)}
          </span>
        </div>
      </div>

      {/* Lead Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-body-small">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {lead.location.suburb}, {lead.location.postcode}, {lead.location.state}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-body-small">
            <BoltIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {lead.systemDetails.estimatedSize} • {lead.systemDetails.roofType} Roof
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-body-small">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              Budget: {lead.systemDetails.budget}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Countdown timer - Only show for active marketplace leads (not purchased) */}
          {!isPurchased && lead.status === 'new' && (
            <div className="flex items-center space-x-2 text-body-small">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <LiveCountdownBar
                expiresAt={lead.expiresAt.toISOString()}
                leadId={String(lead.id)}
                leadStatus={lead.status}
                quoteType={lead.type === 'call_visit' ? 'CALL_VISIT' : lead.type === 'bidding' ? 'BIDDING' : 'WRITTEN_QUOTE'}
                position="inline"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-body-small">
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {lead.quotesReceived} quotes received
            </span>
          </div>
          
          {!isPurchased && lead.type === 'call_visit' && (
            <div className="flex items-center space-x-2 text-body-small">
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                Unlock: ${lead.unlockPrice}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info (if unlocked or purchased) */}
      {isUnlockedByInstaller && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4 shadow-neu-inset">
          <div className="flex items-center space-x-2 mb-2">
            <UnlockIcon className="h-4 w-4 text-success" />
            <span className="text-label text-success">
              {isPurchased ? 'Purchased - Contact Details' : 'Contact Details Unlocked'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-body-small">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 text-foreground">{lead.contact.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <span className="ml-2 text-foreground">{lead.contact.phone}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 text-foreground">{lead.contact.email}</span>
            </div>
          </div>
          
          {/* View Details Button */}
          <div className="mt-3">
            <Button
              onClick={() => setIsViewDetailsOpen(true)}
              variant="secondary"
              className="flex items-center space-x-2 w-full md:w-auto"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View Full Details</span>
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons - Only show if NOT purchased */}
      {!isPurchased && (
        <div className="flex flex-wrap gap-2">
          {canUnlock && (
            <Button
              onClick={() => onUnlock(lead.id)}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <LockIcon className="h-4 w-4" />
              <span>Unlock Lead (${lead.unlockPrice})</span>
            </Button>
          )}

          {canQuote && (
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <SendIcon className="h-4 w-4" />
              <span>Submit Quote</span>
            </Button>
          )}

          {isUnlockedByInstaller && (
            <Button
              onClick={() => onStartChat(lead.id)}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Start Chat</span>
            </Button>
          )}

          {lead.type === 'written' && !canQuote && (
            <div className="text-body-small text-muted-foreground italic">
              Available for written quotes only
            </div>
          )}
        </div>
      )}
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

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isViewDetailsOpen}
        onClose={() => setIsViewDetailsOpen(false)}
        lead={lead}
      />
    </>
  );
};

export default LeadCard;
