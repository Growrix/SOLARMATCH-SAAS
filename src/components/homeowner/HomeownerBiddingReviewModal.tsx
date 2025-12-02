'use client';

import React, { useState } from 'react';
import { X, Award, DollarSign, TrendingUp, Calendar, Battery, Zap, CheckCircle, Star, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/button';

interface BidForHomeowner {
  id: string;
  installerName: string; // Anonymized until contact approved: "Installer A", "Installer B"
  installerRating: number;
  totalPrice: number;
  pricePerWatt: number;
  systemSize: number;
  panelBrand: string;
  inverterBrand: string;
  batteryBrand?: string;
  batteryCapacity?: number;
  warranty: number;
  installationTimeline: string;
  paybackYears: number;
  annualSavings: number;
  submittedAt: string;
  status: 'submitted' | 'shortlisted' | 'not_selected';
  contactRequested: boolean;
  contactApproved: boolean;
  installerCompany?: string; // Revealed after contact approved
  installerPhone?: string; // Revealed after contact approved
  installerEmail?: string; // Revealed after contact approved
}

interface HomeownerBiddingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  propertyAddress: string;
  bids: BidForHomeowner[];
  onRequestContact: (bidId: string) => Promise<void>;
}

export default function HomeownerBiddingReviewModal({
  isOpen,
  onClose,
  leadId,
  propertyAddress,
  bids,
  onRequestContact
}: HomeownerBiddingReviewModalProps) {
  const [requestingContact, setRequestingContact] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestContact = async (bidId: string) => {
    setRequestingContact(bidId);
    try {
      await onRequestContact(bidId);
    } finally {
      setRequestingContact(null);
    }
  };

  const sortedBids = [...bids].sort((a, b) => {
    // Sort by status (shortlisted first), then price
    if (a.status === 'shortlisted' && b.status !== 'shortlisted') return -1;
    if (b.status === 'shortlisted' && a.status !== 'shortlisted') return 1;
    return a.totalPrice - b.totalPrice;
  });

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-background relative w-full h-full md:max-w-[95vw] md:h-[95vh] md:rounded-2xl flex flex-col animate-scale-in shadow-neu-outset-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div>
            <h2 className="text-heading-3 text-foreground">Review Solar Bids</h2>
            <p className="text-body-small text-muted-foreground mt-1">
              {propertyAddress} • {bids.length} bid{bids.length !== 1 ? 's' : ''} received
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Bids Comparison Grid */}
        <div className="flex-grow overflow-auto p-4 md:p-6">
          {sortedBids.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Award className="h-16 w-16 text-muted mb-4" />
              <h3 className="text-heading-4 text-foreground mb-2">No Bids Received Yet</h3>
              <p className="text-body text-muted-foreground max-w-md">
                Installers are preparing their quotes. You&apos;ll be notified when bids are submitted for your review.
              </p>
            </div>
          ) : (
            <>
              {/* Info Banner */}
              <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-6">
                <p className="text-body-small text-info">
                  <strong>How it works:</strong> Review all submitted bids below. Installers are anonymized to ensure fair evaluation. Click &ldquo;Request Contact&rdquo; on your preferred bid(s) - admin will approve and reveal installer details within 24 hours.
                </p>
              </div>

              {/* Bids Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedBids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`bg-surface rounded-2xl shadow-neu-inset p-6 space-y-4 border-2 transition-all ${
                      bid.status === 'shortlisted'
                        ? 'border-success/50 shadow-neu-outset'
                        : bid.status === 'not_selected'
                        ? 'border-error/30 opacity-60'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    {/* Installer Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-heading-4 text-foreground">
                            {bid.contactApproved && bid.installerCompany 
                              ? bid.installerCompany 
                              : bid.installerName
                            }
                          </h3>
                          {bid.status === 'shortlisted' && (
                            <span className="bg-success/20 text-success px-2 py-0.5 rounded-full text-caption">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(bid.installerRating)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                          <span className="text-caption text-muted-foreground ml-1">
                            {bid.installerRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-caption text-muted-foreground mt-1">
                          Submitted {new Date(bid.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-heading-5 text-primary">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Pricing Highlight */}
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-body-small text-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Investment
                        </span>
                        <span className="text-heading-3 text-foreground">
                          ${bid.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-caption">
                        <span className="text-muted-foreground">Price per Watt</span>
                        <span className="text-foreground">
                          ${bid.pricePerWatt.toFixed(2)}/W
                        </span>
                      </div>
                    </div>

                    {/* System Specifications */}
                    <div className="space-y-3">
                      <h4 className="text-label text-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        System Details
                      </h4>
                      <div className="space-y-2 text-body-small">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">System Size</span>
                          <span className="text-foreground">{bid.systemSize} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Solar Panels</span>
                          <span className="text-foreground">{bid.panelBrand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inverter</span>
                          <span className="text-foreground">{bid.inverterBrand}</span>
                        </div>
                        {bid.batteryBrand && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Battery className="h-3 w-3" />
                                Battery
                              </span>
                              <span className="text-foreground">{bid.batteryBrand}</span>
                            </div>
                            {bid.batteryCapacity && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Capacity</span>
                                <span className="text-foreground">{bid.batteryCapacity} kWh</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Financial & Timeline */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-body-small">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Annual Savings
                        </span>
                        <span className="text-success">
                          ${bid.annualSavings.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-body-small">
                        <span className="text-muted-foreground">Payback Period</span>
                        <span className="text-foreground">{bid.paybackYears} years</span>
                      </div>
                      <div className="flex items-center justify-between text-body-small">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Installation
                        </span>
                        <span className="text-foreground">{bid.installationTimeline}</span>
                      </div>
                      <div className="flex items-center justify-between text-body-small">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Warranty
                        </span>
                        <span className="text-foreground">{bid.warranty} years</span>
                      </div>
                    </div>

                    {/* Contact Info (if approved) */}
                    {bid.contactApproved && (
                      <div className="bg-success/10 border border-success/30 rounded-xl p-4 space-y-2">
                        <p className="text-body-small text-success flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Contact Approved
                        </p>
                        <div className="space-y-1 text-body-small">
                          <p className="text-foreground">
                            <strong>Company:</strong> {bid.installerCompany}
                          </p>
                          <p className="text-foreground">
                            <strong>Phone:</strong> {bid.installerPhone}
                          </p>
                          <p className="text-foreground">
                            <strong>Email:</strong> {bid.installerEmail}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2">
                      {bid.status === 'not_selected' ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          Not Selected by Admin
                        </Button>
                      ) : bid.contactApproved ? (
                        <Button
                          variant="primary"
                          className="w-full bg-success hover:bg-success/90"
                          disabled
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Contact Approved
                        </Button>
                      ) : bid.contactRequested ? (
                        <Button
                          variant="secondary"
                          className="w-full"
                          disabled
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Pending Approval
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleRequestContact(bid.id)}
                          disabled={requestingContact === bid.id}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {requestingContact === bid.id ? 'Requesting...' : 'Request Contact'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-border">
          <div className="text-body-small text-muted-foreground">
            {sortedBids.filter(b => b.status === 'shortlisted').length > 0 && (
              <span className="text-success">
                {sortedBids.filter(b => b.status === 'shortlisted').length} recommended bid{sortedBids.filter(b => b.status === 'shortlisted').length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
