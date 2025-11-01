/**
 * QuoteDataDisplay Component
 * 
 * Purpose: Display complete instant quote calculation data for admins
 * Used in: Admin lead detail page
 * 
 * Phase 4.5: Displays all quote data that was collected during instant quote flow
 */

'use client';

import React from 'react';

interface QuoteDataDisplayProps {
  quoteData: any; // JSON data from InstantQuoteForm
  className?: string;
}

export default function QuoteDataDisplay({ quoteData, className = '' }: QuoteDataDisplayProps) {
  if (!quoteData) {
    return (
      <div className={`rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950 p-4 ${className}`}>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ No quote data available. This lead was created before Phase 4.5 implementation.
        </p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return `$${value.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Design Section */}
      {quoteData.recommendedSystemSize && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 System Design
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">System Size</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {quoteData.recommendedSystemSize || 'N/A'} kW
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Number of Panels</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {quoteData.numberOfPanels || 'N/A'} panels
              </p>
            </div>
            {quoteData.panelWattage && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Panel Wattage</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.panelWattage}W each
                </p>
              </div>
            )}
            {quoteData.panelBrand && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Preferred Panel Brand</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.panelBrand}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Details Section */}
      {(quoteData.upfrontCost || quoteData.finalCost || quoteData.annualSavings) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 Financial Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quoteData.upfrontCost && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Upfront Cost</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(quoteData.upfrontCost)}
                </p>
              </div>
            )}
            {quoteData.governmentIncentive && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Government Incentive</p>
                <p className="text-lg font-semibold text-success dark:text-green-400">
                  -{formatCurrency(quoteData.governmentIncentive)}
                </p>
              </div>
            )}
            {quoteData.finalCost && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Final Cost</p>
                <p className="text-xl font-bold text-info dark:text-blue-400">
                  {formatCurrency(quoteData.finalCost)}
                </p>
              </div>
            )}
            {quoteData.annualSavings && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Annual Savings</p>
                <p className="text-lg font-semibold text-success dark:text-green-400">
                  {formatCurrency(quoteData.annualSavings)}/year
                </p>
              </div>
            )}
            {quoteData.paybackPeriod && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Payback Period</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.paybackPeriod} years
                </p>
              </div>
            )}
            {quoteData.roi25Years && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">25-Year ROI</p>
                <p className="text-lg font-semibold text-success dark:text-green-400">
                  {formatCurrency(quoteData.roi25Years)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Battery Details Section */}
      {(quoteData.batteryIncluded || quoteData.batteryModel || quoteData.batteryCapacity) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔋 Battery Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quoteData.batteryModel && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Battery Model</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.batteryModel}
                </p>
              </div>
            )}
            {quoteData.batteryBrand && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Preferred Brand</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.batteryBrand}
                </p>
              </div>
            )}
            {quoteData.batteryCapacity && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Capacity</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.batteryCapacity} kWh
                </p>
              </div>
            )}
            {quoteData.batteryCost && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Battery Cost</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(quoteData.batteryCost)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property & Roof Details */}
      {(quoteData.roofTilt || quoteData.panelOrientation || quoteData.shadingLevel) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏠 Property Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quoteData.roofTilt && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Roof Tilt</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {quoteData.roofTilt}
                </p>
              </div>
            )}
            {quoteData.panelOrientation && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Panel Orientation</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {quoteData.panelOrientation}
                </p>
              </div>
            )}
            {quoteData.shadingLevel && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Shading Level</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {quoteData.shadingLevel}
                </p>
              </div>
            )}
            {quoteData.usagePattern && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Usage Pattern</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {quoteData.usagePattern}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Environmental Impact */}
      {(quoteData.co2OffsetAnnual || quoteData.treesEquivalent || quoteData.annualGeneration) && (
        <div className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🌱 Environmental Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quoteData.annualGeneration && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Annual Generation</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.annualGeneration.toLocaleString()} kWh/year
                </p>
              </div>
            )}
            {quoteData.co2OffsetAnnual && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">CO₂ Offset (Annual)</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {quoteData.co2OffsetAnnual} tonnes/year
                </p>
              </div>
            )}
            {quoteData.treesEquivalent && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-300">Trees Equivalent</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {quoteData.treesEquivalent} trees/year
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Preferences */}
      {(quoteData.includeVPP || quoteData.includeEVCharging || quoteData.includeOptimizers || quoteData.includeMicroinverters) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚙️ Additional Preferences
          </h3>
          <div className="flex flex-wrap gap-2">
            {quoteData.includeVPP && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                ✓ VPP Integration
              </span>
            )}
            {quoteData.includeEVCharging && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                ✓ EV Charging
              </span>
            )}
            {quoteData.includeOptimizers && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                ✓ Panel Optimizers
              </span>
            )}
            {quoteData.includeMicroinverters && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                ✓ Microinverters
              </span>
            )}
          </div>
        </div>
      )}

      {/* Retailer & Tariff Details */}
      {(quoteData.retailer || quoteData.tariffPlan) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Retailer & Tariff
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quoteData.retailer && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Current Retailer</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.retailer}
                </p>
              </div>
            )}
            {quoteData.tariffPlan && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Tariff Plan</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quoteData.tariffPlan}
                </p>
              </div>
            )}
            {quoteData.customRetailRate && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Retail Rate</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${quoteData.customRetailRate}/kWh
                </p>
              </div>
            )}
            {quoteData.customFeedInRate && (
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Feed-in Tariff</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${quoteData.customFeedInRate}/kWh
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}