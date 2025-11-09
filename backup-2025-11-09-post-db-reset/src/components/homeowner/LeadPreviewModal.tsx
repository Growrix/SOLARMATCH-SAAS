/**
 * LeadPreviewModal Component
 * 
 * Purpose: Read-only modal for viewing approved/purchased leads
 * Used by: HomeownerDashboard lead cards (when canEditLead returns false)
 * 
 * Features:
 * - Shows all lead details in read-only format
 * - No editing capability
 * - Clean, organized layout
 * - Used for APPROVED, PURCHASED, or other non-editable statuses
 * 
 * Phase 4.11: Enhanced CRUD operations
 */

'use client';

import React from 'react';

// Icon components
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

interface LeadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    quoteType: string;
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    quoteData: Record<string, any>;
  };
}

const LeadPreviewModal: React.FC<LeadPreviewModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  if (!isOpen) return null;

  const data = lead.quoteData || {};

  // Helper to format dates
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to format boolean values
  const formatBoolean = (value: boolean) => {
    return value ? (
      <span className="inline-flex items-center gap-1 text-success dark:text-green-400">
        <CheckIcon /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-slate-400">
        <XCircleIcon /> No
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="theme-card relative w-full max-w-4xl p-4 sm:p-6 lg:p-8 animate-slide-in-up max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-lg -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Quote Request Details
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Read-only view • Created {formatDate(lead.createdAt)}
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

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            lead.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            lead.status === 'PURCHASED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
          }`}>
            {lead.status.replace('_', ' ')}
          </span>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Location Details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Postcode</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">{data.postcode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Suburb/City</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">{data.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">State</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">{data.state || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Energy Usage */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Energy Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bill Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.electricityUsageType || data.billType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bill Amount</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  ${data.electricityValue || data.energyBill || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Property Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.propertyType || 'Residential'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Roof Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.roofType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Roof Orientation</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.panelOrientation || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Roof Pitch</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.roofTilt || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Shading Level</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.shadingLevel || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Budget Range</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {data.budgetRange ? data.budgetRange.replace(/_/g, ' ') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Desired Offset</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {data.desiredOffset || 100}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Usage Pattern</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.usagePattern || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Installation Timeframe</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {data.timeframe || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Existing Solar System</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatBoolean(data.hasExistingSystem || false)}
                  {data.hasExistingSystem && data.existingSystemSize && (
                    <span className="ml-2 text-slate-600 dark:text-slate-400">
                      ({data.existingSystemSize})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Battery Storage */}
          {data.batteryIncluded && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Battery Storage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Battery Included</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">
                    {formatBoolean(true)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Battery Capacity</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">
                    {data.batteryCapacity || data.customBatteryCapacity || 'N/A'} kWh
                  </p>
                </div>
                {data.batteryBrand && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Preferred Brand</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {data.batteryBrand}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Battery Usage</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                    {data.batteryUsage?.replace('-', ' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Backup Priority</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                    {data.backupCritical?.replace('-', ' ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">VPP Program</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">
                    {formatBoolean(data.includeVPP || false)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Features */}
          {(data.includeEVCharging || data.includeSmartHome || data.includeGridServices || data.includeOptimizers || data.includeMicroinverters) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Additional Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.includeEVCharging && (
                  <div className="flex items-center gap-2">
                    <div className="text-success dark:text-green-400"><CheckIcon /></div>
                    <span className="text-slate-700 dark:text-slate-300">EV Charging</span>
                  </div>
                )}
                {data.includeSmartHome && (
                  <div className="flex items-center gap-2">
                    <div className="text-success dark:text-green-400"><CheckIcon /></div>
                    <span className="text-slate-700 dark:text-slate-300">Smart Home Integration</span>
                  </div>
                )}
                {data.includeGridServices && (
                  <div className="flex items-center gap-2">
                    <div className="text-success dark:text-green-400"><CheckIcon /></div>
                    <span className="text-slate-700 dark:text-slate-300">Grid Services</span>
                  </div>
                )}
                {data.includeOptimizers && (
                  <div className="flex items-center gap-2">
                    <div className="text-success dark:text-green-400"><CheckIcon /></div>
                    <span className="text-slate-700 dark:text-slate-300">Panel Optimizers</span>
                  </div>
                )}
                {data.includeMicroinverters && (
                  <div className="flex items-center gap-2">
                    <div className="text-success dark:text-green-400"><CheckIcon /></div>
                    <span className="text-slate-700 dark:text-slate-300">Microinverters</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment Preferences */}
          {(data.panelBrand || data.systemSizeOverride) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Equipment Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.panelBrand && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Preferred Panel Brand</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {data.panelBrand}
                    </p>
                  </div>
                )}
                {data.systemSizeOverride && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Specific System Size</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {data.systemSizeOverride}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {data.additionalNotes && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Additional Notes</h3>
              <p className="text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {data.additionalNotes}
              </p>
            </div>
          )}

          {/* Commercial Details */}
          {data.propertyType === 'commercial' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Commercial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.peakDemand && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Peak Demand</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {data.peakDemand} kW
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Three-Phase Connection</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">
                    {formatBoolean(data.isThreePhase || false)}
                  </p>
                </div>
                {data.projectPriority && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Project Priority</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                      {data.projectPriority.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Request Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Quote Type</p>
                <p className="text-base font-medium text-slate-900 dark:text-white capitalize">
                  {lead.quoteType.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Last Updated</p>
                <p className="text-base font-medium text-slate-900 dark:text-white">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadPreviewModal;