'use client';

/**
 * AdminLeadManagementModal Component
 * 
 * Purpose: Unified lead management interface for admin
 * Consolidates: Actions, Pricing, Assignment, Notes, Lifecycle
 * Features:
 * - Section A: Approval & Pricing
 * - Section B: Installer Assignment (filters, suggestions, profile preview)
 * - Section C: Admin Notes
 * - Section D: Lifecycle & Maintenance
 * - Section E: Summary & Confirmation
 * UI-Only: Preserves all existing backend handlers unchanged
 */

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';

interface Assignment {
  id: string;
  installerId: string;
  assignedAt: string;
  notes: string | null;
  installer: {
    id: string;
    email: string;
    installerVerified: boolean;
    installerVerification: {
      companyName: string | null;
      representativeName: string | null;
      phone: string | null;
      address: string | null;
      postcodes: string | null;
      status: string;
    } | null;
  };
}

interface Lead {
  id: string;
  status: string;
  price?: number | null;
  adminNotes?: string | null;
  installerId?: string | null;
  expiresAt?: Date | null;
  archivedAt?: Date | null;
  postcode?: string | null;
  assignments?: Assignment[];
}

interface Installer {
  id: string;
  email: string;
  installerVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  installerVerification: {
    companyName: string | null;
    representativeName: string | null;
    phone: string | null;
    address: string | null;
    postcodes: string | null; // Comma-separated
    status: string;
  } | null;
}

interface AdminLeadManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  // Handler props (preserve existing backend logic)
  onApprove: (data: { enableCountdown: boolean; countdownDays: number }) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onSavePrice: (price: string) => Promise<void>;
  onSaveNotes: (notes: string) => Promise<void>;
  onResell?: () => Promise<void>;
  onResetTimer?: (days: number) => Promise<void>;
  onArchive?: () => Promise<void>;
  onUnarchive?: () => Promise<void>;
  onAssign: (data: {
    installerIds: string[];
    mode: 'exclusive' | 'competitive';
    notes?: string;
    notifyInstallers: boolean;
  }) => Promise<void>;
}

export default function AdminLeadManagementModal({
  isOpen,
  onClose,
  lead,
  onApprove,
  onReject,
  onSavePrice,
  onSaveNotes,
  onResell,
  onResetTimer,
  onArchive,
  onUnarchive,
  onAssign,
}: AdminLeadManagementModalProps) {
  // Section A: Approval & Pricing State
  const [leadPrice, setLeadPrice] = useState(lead.price?.toString() || '');
  const [countdownDays, setCountdownDays] = useState(7);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Section B: Installer Assignment State
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [selectedInstallerIds, setSelectedInstallerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'unverified' | 'assigned'>('all');
  const [assignedInstallers, setAssignedInstallers] = useState<Installer[]>([]);
  const [postcodeFilterEnabled, setPostcodeFilterEnabled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [previewInstallerId, setPreviewInstallerId] = useState<string | null>(null);
  const [notifyInstallers, setNotifyInstallers] = useState(true);

  // Section C: Admin Notes State
  const [adminNotes, setAdminNotes] = useState(lead.adminNotes || '');

  // Section D: Lifecycle State
  const [resetDays, setResetDays] = useState(7);

  // Section E: Summary & Confirmation State
  const [confirmStep, setConfirmStep] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit mode detection
  const isApprovalState = ['DRAFT', 'PENDING_APPROVAL', 'PENDING_PHONE'].includes(lead.status);
  const isEditMode = !isApprovalState;

  // Fetch installers on mount
  useEffect(() => {
    if (isOpen) {
      fetchInstallers();
    }
  }, [isOpen, filterMode]);

  const fetchInstallers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (filterMode === 'assigned') {
        // Show currently assigned installers from lead.assignments
        if (lead.assignments && lead.assignments.length > 0) {
          const assigned = lead.assignments.map((assignment) => ({
            id: assignment.installer.id,
            email: assignment.installer.email,
            installerVerified: assignment.installer.installerVerified,
            phoneVerified: false,
            isActive: true,
            createdAt: assignment.assignedAt,
            updatedAt: assignment.assignedAt,
            installerVerification: assignment.installer.installerVerification,
          }));
          setAssignedInstallers(assigned);
          setInstallers(assigned);
        } else {
          setAssignedInstallers([]);
          setInstallers([]);
        }
      } else {
        const installerVerified = filterMode === 'verified' ? 'true' : filterMode === 'unverified' ? 'false' : '';
        const response = await fetch(`/api/admin/installers/list${installerVerified ? `?installerVerified=${installerVerified}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch installers');
        const data = await response.json();
        setInstallers(data.installers || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Smart suggestions: postcode match + verified + active
  const suggestedInstallers = installers.filter((inst) => {
    // Must be verified
    if (!inst.installerVerified) return false;
    
    // Must be active
    if (!inst.isActive) return false;
    
    // Must have verification profile
    if (!inst.installerVerification) return false;
    
    // Postcode match (primary factor)
    if (!lead.postcode || !inst.installerVerification.postcodes || typeof inst.installerVerification.postcodes !== 'string') return false;
    const leadPostcodes = lead.postcode.split(',').map(p => p.trim().toLowerCase());
    const instPostcodes = inst.installerVerification.postcodes.split(',').map(p => p.trim().toLowerCase());
    const hasPostcodeMatch = leadPostcodes.some(lp => 
      instPostcodes.some(ip => ip.includes(lp) || lp.includes(ip))
    );
    
    return hasPostcodeMatch;
  }).sort((a, b) => {
    // Sort by newest first (higher visibility for new installers)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Filter installers
  const filteredInstallers = installers.filter((installer) => {
    // Search filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      installer.installerVerification?.companyName?.toLowerCase().includes(query) ||
      installer.installerVerification?.representativeName?.toLowerCase().includes(query) ||
      installer.email.toLowerCase().includes(query) ||
      installer.installerVerification?.phone?.toLowerCase().includes(query) ||
      installer.installerVerification?.postcodes?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Postcode filter
    if (postcodeFilterEnabled && lead.postcode) {
      const leadPostcodes = lead.postcode.split(',').map(p => p.trim().toLowerCase());
      const postcodeStr = installer.installerVerification?.postcodes;
      const instPostcodes = (postcodeStr && typeof postcodeStr === 'string') 
        ? postcodeStr.split(',').map(p => p.trim().toLowerCase()) 
        : [];
      const matchesPostcode = leadPostcodes.some(lp => instPostcodes.some(ip => ip.includes(lp) || lp.includes(ip)));
      if (!matchesPostcode) return false;
    }

    return true;
  });

  // Toggle installer selection
  const toggleInstaller = (installerId: string) => {
    setSelectedInstallerIds((prev) =>
      prev.includes(installerId)
        ? prev.filter((id) => id !== installerId)
        : [...prev, installerId]
    );
  };

  // Select all suggested
  const selectAllSuggested = () => {
    setSelectedInstallerIds(suggestedInstallers.map(i => i.id));
  };

  // Handle final submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Sequential handler calls for changed fields
      if (leadPrice !== lead.price?.toString()) {
        await onSavePrice(leadPrice);
      }

      if (adminNotes !== lead.adminNotes) {
        await onSaveNotes(adminNotes);
      }

      if (selectedInstallerIds.length > 0) {
        await onAssign({
          installerIds: selectedInstallerIds,
          mode: 'competitive', // Default mode
          notes: bulkMessage.trim() || undefined,
          notifyInstallers,
        });
      }

      // Success - close modal
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveClick = async () => {
    if (!leadPrice) {
      setError('Please set a price before approving');
      return;
    }

    setSubmitting(true);
    try {
      await onApprove({ enableCountdown: true, countdownDays });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setSubmitting(true);
    try {
      await onReject(rejectReason);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-overlay transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-6xl rounded-lg bg-surface shadow-neu-outset">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-heading-3 text-foreground">
                Lead Management
              </h2>
              <span className="text-body-small text-muted-foreground">
                #{lead.id.slice(0, 8)}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-caption ${
                lead.status === 'APPROVED' ? 'bg-success/20 text-success' :
                lead.status === 'PENDING_APPROVAL' ? 'bg-warning/20 text-warning' :
                'bg-muted/20 text-muted-foreground'
              }`}>
                {lead.status}
              </span>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Edit Mode Banner */}
          {isEditMode && (
            <div className="bg-info/10 border-b border-info/20 px-6 py-3">
              <p className="text-body-small text-info">
                ℹ️ Editing Lead Configuration - Modify pricing, installers, or lifecycle settings
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-4 rounded-md bg-error/10 p-4">
              <p className="text-body-small text-error">{error}</p>
            </div>
          )}

          {/* Scrollable Body */}
          <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* SECTION B: Installer Assignment */}
            <div className="p-6 rounded-lg bg-surface shadow-neu-outset space-y-4">
              <h3 className="text-heading-3 text-foreground">Installer Assignment</h3>

              {/* Filters */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search by name, email, company, or postcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-full px-4 py-3"
                />

                <div className="space-y-3">
                  {/* Segmented Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Installer filter">
                    <div
                      role="tab"
                      aria-selected={filterMode === 'all'}
                      onClick={() => setFilterMode('all')}
                      className={`px-3 py-1 rounded-md cursor-pointer text-body-small transition-colors select-none ${filterMode === 'all' ? 'bg-surface shadow-neu-inset text-foreground' : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'}`}
                    >
                      All
                    </div>
                    <div
                      role="tab"
                      aria-selected={filterMode === 'verified'}
                      onClick={() => setFilterMode('verified')}
                      className={`px-3 py-1 rounded-md cursor-pointer text-body-small transition-colors select-none ${filterMode === 'verified' ? 'bg-surface shadow-neu-inset text-success' : 'text-muted-foreground hover:bg-muted/10 hover:text-success'}`}
                    >
                      Verified
                    </div>
                    <div
                      role="tab"
                      aria-selected={filterMode === 'unverified'}
                      onClick={() => setFilterMode('unverified')}
                      className={`px-3 py-1 rounded-md cursor-pointer text-body-small transition-colors select-none ${filterMode === 'unverified' ? 'bg-surface shadow-neu-inset text-error' : 'text-muted-foreground hover:bg-muted/10 hover:text-error'}`}
                    >
                      Unverified
                    </div>
                    <div
                      role="tab"
                      aria-selected={filterMode === 'assigned'}
                      onClick={() => setFilterMode('assigned')}
                      className={`px-3 py-1 rounded-md cursor-pointer text-body-small transition-colors select-none ${filterMode === 'assigned' ? 'bg-surface shadow-neu-inset text-info' : 'text-muted-foreground hover:bg-muted/10 hover:text-info'}`}
                    >
                      Assigned {lead.assignments && lead.assignments.length > 0 && `(${lead.assignments.length})`}
                    </div>

                    {/* Postcode Match Toggle */}
                    {lead.postcode && filterMode !== 'assigned' && (
                      <label className="flex items-center gap-2 ml-auto">
                        <input
                          type="checkbox"
                          checked={postcodeFilterEnabled}
                          onChange={(e) => setPostcodeFilterEnabled(e.target.checked)}
                          className="rounded border-border text-success focus:ring-success"
                        />
                        <span className="text-body-small text-foreground">
                          Match Postcode ({lead.postcode})
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {filterMode !== 'assigned' && suggestedInstallers.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="minimal"
                        onClick={selectAllSuggested}
                        className="text-success"
                      >
                        Select All Recommended ({suggestedInstallers.length})
                      </Button>
                    </div>
                  )}
                </div>

                {/* Remove Assignment Mode Section - NOT REQUESTED */}
              </div>

              {/* Smart Suggestions */}
              {filterMode !== 'assigned' && showSuggestions && suggestedInstallers.length > 0 && (
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-body-small text-success">
                      ⭐ Recommended Installers
                    </h4>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSuggestions(false)}
                      className="text-caption px-3 py-1"
                    >
                      Hide
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {suggestedInstallers.slice(0, 3).map((installer) => (
                      <label
                        key={installer.id}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-success/10"
                      >
                        <input
                          type="checkbox"
                          checked={selectedInstallerIds.includes(installer.id)}
                          onChange={() => toggleInstaller(installer.id)}
                          className="rounded border-border text-success focus:ring-success"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body-small text-foreground">
                              {installer.installerVerification?.companyName || 'Profile Incomplete'}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-caption bg-success/20 text-success">
                              Verified
                            </span>
                          </div>
                          {installer.installerVerification?.postcodes && typeof installer.installerVerification.postcodes === 'string' && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {installer.installerVerification.postcodes.split(',').map((pc, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-caption bg-info/10 text-info"
                                >
                                  {pc.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {!installer.installerVerification && (
                            <p className="text-caption text-muted-foreground mt-1">
                              Verification pending
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Installer List */}
              <div className="space-y-2">
                <p className="text-body-small text-muted-foreground">
                  {selectedInstallerIds.length} installer{selectedInstallerIds.length !== 1 ? 's' : ''} selected
                </p>

                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading installers...
                  </div>
                ) : filteredInstallers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No installers found
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto border border-border rounded-lg p-3 bg-surface">
                    {filteredInstallers.map((installer) => (
                      <label
                        key={installer.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedInstallerIds.includes(installer.id)
                            ? 'bg-success/10 border border-success/30'
                            : 'bg-surface hover:bg-muted/20 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedInstallerIds.includes(installer.id)}
                          onChange={() => toggleInstaller(installer.id)}
                          className="rounded border-border text-success focus:ring-success"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body-small text-foreground truncate">
                              {installer.installerVerification?.companyName || 'Profile Incomplete'}
                            </span>
                            {installer.installerVerified && installer.installerVerification && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-caption bg-success/20 text-success">
                                Verified
                              </span>
                            )}
                            {!installer.installerVerification && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-caption bg-warning/20 text-warning">
                                Pending Profile
                              </span>
                            )}
                          </div>
                          <div className="text-caption text-muted-foreground">
                            {installer.email}
                          </div>
                          {installer.installerVerification?.postcodes && typeof installer.installerVerification.postcodes === 'string' && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-caption text-muted-foreground">Service Areas:</span>
                              {installer.installerVerification.postcodes.split(',').map((pc, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-caption bg-info/10 text-info"
                                >
                                  {pc.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewInstallerId(previewInstallerId === installer.id ? null : installer.id);
                          }}
                          className="text-caption text-info hover:underline"
                        >
                          {previewInstallerId === installer.id ? 'Hide' : 'Preview'}
                        </button>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Bulk Messaging */}
              <div className="pt-4 border-t border-border">
                <label className="block text-body-small mb-2 text-muted-foreground">
                  Message to Selected Installers (Optional)
                </label>
                <textarea
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Add a message for the selected installers..."
                  rows={3}
                  className="form-input w-full px-4 py-3"
                />
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={notifyInstallers}
                    onChange={(e) => setNotifyInstallers(e.target.checked)}
                    className="rounded border-border text-success focus:ring-success"
                  />
                  <span className="text-body-small text-foreground">
                    Send notifications to assigned installers
                  </span>
                </label>
              </div>
            </div>

            {/* SECTION A: Approval & Pricing */}
            {(['DRAFT', 'PENDING_APPROVAL', 'PENDING_PHONE'].includes(lead.status) || isEditMode) && (
              <div className="p-6 rounded-lg bg-surface shadow-neu-outset space-y-4">
                <h3 className="text-heading-3 text-foreground">Approval & Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-small mb-2 text-muted-foreground">
                      Lead Price (£)
                    </label>
                    <input
                      type="number"
                      value={leadPrice}
                      onChange={(e) => setLeadPrice(e.target.value)}
                      placeholder="Enter price"
                      className="form-input w-full px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-body-small mb-2 text-muted-foreground">
                      Countdown Days (1-90)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={countdownDays}
                      onChange={(e) => setCountdownDays(parseInt(e.target.value) || 7)}
                      placeholder="Enter expiry days"
                      className="form-input w-full px-4 py-3 placeholder:text-muted-foreground"
                    />
                    <p className="text-caption mt-1 text-muted-foreground">
                      Lead will expire in {countdownDays} day{countdownDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Approve/Reject buttons moved to footer */}

                {showRejectInput && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      rows={3}
                      className="form-input w-full px-4 py-3"
                    />
                    <Button
                      onClick={handleRejectClick}
                      disabled={submitting || !rejectReason.trim()}
                      variant="secondary"
                      className="w-full bg-error text-error-foreground"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* SECTION D: Lifecycle & Maintenance (moved up) */}
            {(lead.installerId || lead.expiresAt || !lead.archivedAt) && (
              <div className="p-6 rounded-lg bg-surface shadow-neu-outset space-y-4">
                <h3 className="text-heading-3 text-foreground">Lifecycle & Maintenance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lead.installerId && onResell && (
                    <Button
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          await onResell();
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      disabled={submitting}
                      variant="secondary"
                    >
                      🔄 Resell Lead
                    </Button>
                  )}

                  {lead.expiresAt && onResetTimer && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={resetDays}
                        onChange={(e) => setResetDays(parseInt(e.target.value) || 7)}
                        min="1"
                        max="365"
                        placeholder="Days"
                        className="form-input w-20 px-4 py-3"
                      />
                      <Button
                        onClick={async () => {
                          setSubmitting(true);
                          try {
                            await onResetTimer(resetDays);
                          } catch (err: any) {
                            setError(err.message);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        disabled={submitting}
                        variant="secondary"
                        className="flex-1"
                      >
                        ⏰ Extend Timer (+{resetDays}d)
                      </Button>
                    </div>
                  )}

                  {!lead.archivedAt && onArchive && (
                    <Button
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          await onArchive();
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      disabled={submitting}
                      variant="secondary"
                    >
                      🗄️ Archive Lead
                    </Button>
                  )}

                  {lead.archivedAt && onUnarchive && (
                    <Button
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          await onUnarchive();
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      disabled={submitting}
                      variant="secondary"
                      className="bg-success text-success-foreground"
                    >
                      📤 Restore Lead
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* SECTION C: Admin Notes */}
            <div className="p-6 rounded-lg bg-surface shadow-neu-outset space-y-4">
              <h3 className="text-heading-3 text-foreground">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this lead..."
                rows={4}
                className="form-input w-full px-4 py-3"
              />
            </div>
          </div>

          {/* Footer: Summary & Actions */}
          <div className="border-t border-border px-6 py-4 bg-surface">
            <div className="flex items-center justify-between mb-3">
              <div className="text-body-small text-muted-foreground">
                {selectedInstallerIds.length > 0 && (
                  <span>{selectedInstallerIds.length} installer{selectedInstallerIds.length !== 1 ? 's' : ''} • </span>
                )}
                {leadPrice && <span>£{leadPrice} • </span>}
                {countdownDays > 0 && <span>{countdownDays} days expiry</span>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {isApprovalState ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleApproveClick}
                    disabled={submitting || !leadPrice}
                  >
                    {submitting ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectInput(!showRejectInput)}
                    disabled={submitting}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  variant="primary"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
