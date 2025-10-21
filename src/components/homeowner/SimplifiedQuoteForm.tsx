/**
 * SimplifiedQuoteForm Component
 * 
 * Purpose: Single-page form with ALL quote fields for editing/creating leads
 * Used by: LeadEditModal, "Request More Quotes" flow
 * 
 * Features:
 * - Pre-fills from quoteData prop
 * - Includes ALL fields from InstantQuoteForm (no simplification)
 * - Single-page layout (not multi-step)
 * - Supports both residential and commercial properties
 * - All fields match CreateLeadInput interface exactly
 */

'use client';

import React, { useState, useEffect } from 'react';

// Icon Components (same as InstantQuoteForm)
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const DollarSign = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 mr-1"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const Home = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const Zap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const Battery = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><rect width="16" height="10" x="4" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>;
const Building = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;

const InfoTooltip = ({ text }: { text: string }) => (
  <span className="ml-1 inline-flex items-center" title={text}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500 cursor-help"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
  </span>
);

interface SimplifiedQuoteFormProps {
  initialData?: Record<string, any> | null;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

const SimplifiedQuoteForm: React.FC<SimplifiedQuoteFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  submitButtonText = 'Continue',
  isLoading = false,
}) => {
  // Property type state
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');

  // Form data state - ALL fields from InstantQuoteForm
  const [formData, setFormData] = useState({
    // Location fields
    postcode: '',
    location: '',
    state: '',
    
    // Property details
    roofType: '',
    budgetRange: '',
    
    // Battery fields
    batteryIncluded: false,
    batteryCapacity: '',
    batteryBrand: '',
    customBatteryCapacity: '',
    backupCritical: 'essential',
    batteryUsage: 'self-consumption',
    includeVPP: false,
    
    // Additional features
    includeEVCharging: false,
    includeSmartHome: false,
    includeGridServices: false,
    
    // System preferences
    desiredOffset: 100,
    hasExistingSystem: false,
    existingSystemSize: '',
    panelOrientation: 'north',
    roofTilt: 'optimal',
    shadingLevel: 'none',
    usagePattern: 'spread',
    
    // Tariff details
    customRetailRate: '',
    customFeedInRate: '',
    retailer: '',
    tariffPlan: '',
    
    // Equipment preferences
    panelBrand: '',
    includeOptimizers: false,
    includeMicroinverters: false,
    
    // Commercial fields
    peakDemand: '',
    isThreePhase: false,
    projectPriority: 'reduce_bills',
    
    // Advanced options
    additionalArrays: [] as any[],
    systemSizeOverride: '',
    
    // Additional notes
    additionalNotes: '',
    
    // Timeframe
    timeframe: '',
  });

  // Energy usage state
  const [electricityUsageType, setElectricityUsageType] = useState<'monthly' | 'quarterly'>('monthly');
  const [electricityValue, setElectricityValue] = useState('');

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with initial data
  useEffect(() => {
    if (!initialData) return;

    const data = initialData;

    // Helper functions to safely extract values
    const getString = (keys: string[], fallback: string = ''): string => {
      for (const key of keys) {
        const value = data[key];
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
      }
      return fallback;
    };

    const getNumber = (keys: string[], fallback: number = 0): number => {
      for (const key of keys) {
        const value = data[key];
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          const parsed = parseFloat(value);
          if (!isNaN(parsed)) return parsed;
        }
      }
      return fallback;
    };

    const getBoolean = (keys: string[], fallback: boolean = false): boolean => {
      for (const key of keys) {
        const value = data[key];
        if (typeof value === 'boolean') return value;
      }
      return fallback;
    };

    // Set property type
    const typeRaw = getString(['propertyType', 'quoteType'], 'residential');
    setPropertyType(typeRaw === 'commercial' ? 'commercial' : 'residential');

    // Pre-fill all form fields
    setFormData({
      postcode: getString(['postcode', 'propertyPostcode']),
      location: getString(['location']),
      state: getString(['state']),
      roofType: getString(['roofType']),
      budgetRange: getString(['budgetRange']),
      batteryIncluded: getBoolean(['batteryIncluded', 'batteryRequired']),
      batteryCapacity: getString(['batteryCapacity']),
      batteryBrand: getString(['batteryBrand']),
      customBatteryCapacity: getString(['customBatteryCapacity']),
      backupCritical: getString(['backupCritical'], 'essential'),
      batteryUsage: getString(['batteryUsage'], 'self-consumption'),
      includeVPP: getBoolean(['includeVPP']),
      includeEVCharging: getBoolean(['includeEVCharging']),
      includeSmartHome: getBoolean(['includeSmartHome']),
      includeGridServices: getBoolean(['includeGridServices']),
      desiredOffset: getNumber(['desiredOffset'], 100),
      hasExistingSystem: getBoolean(['hasExistingSystem']),
      existingSystemSize: getString(['existingSystemSize']),
      panelOrientation: getString(['panelOrientation'], 'north'),
      roofTilt: getString(['roofTilt'], 'optimal'),
      shadingLevel: getString(['shadingLevel'], 'none'),
      usagePattern: getString(['usagePattern'], 'spread'),
      customRetailRate: getString(['customRetailRate']),
      customFeedInRate: getString(['customFeedInRate']),
      retailer: getString(['retailer']),
      tariffPlan: getString(['tariffPlan']),
      panelBrand: getString(['panelBrand']),
      includeOptimizers: getBoolean(['includeOptimizers']),
      includeMicroinverters: getBoolean(['includeMicroinverters']),
      peakDemand: getString(['peakDemand']),
      isThreePhase: getBoolean(['isThreePhase']),
      projectPriority: getString(['projectPriority'], 'reduce_bills'),
      additionalArrays: Array.isArray(data.additionalArrays) ? data.additionalArrays : [],
      systemSizeOverride: getString(['systemSizeOverride']),
      additionalNotes: getString(['additionalNotes']),
      timeframe: getString(['timeframe']),
    });

    // Pre-fill electricity usage
    const usageTypeRaw = getString(['electricityUsageType'], 'monthly');
    setElectricityUsageType(usageTypeRaw === 'quarterly' ? 'quarterly' : 'monthly');
    setElectricityValue(getString(['electricityValue', 'energyBill']));

  }, [initialData]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.postcode) newErrors.postcode = 'Postcode is required';
    else if (!/^\d{4}$/.test(formData.postcode)) newErrors.postcode = 'Postcode must be 4 digits';
    
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.state) newErrors.state = 'State is required';
    
    if (!electricityValue) newErrors.electricityValue = 'Energy bill is required';
    else if (isNaN(parseFloat(electricityValue))) newErrors.electricityValue = 'Must be a valid number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...formData,
      propertyType,
      electricityUsageType,
      electricityValue,
      energyBill: parseFloat(electricityValue),
      billType: electricityUsageType,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Type Selection */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPropertyType('residential')}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
              propertyType === 'residential'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
          >
            <Home />
            <span className="font-medium">Residential</span>
          </button>
          <button
            type="button"
            onClick={() => setPropertyType('commercial')}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
              propertyType === 'commercial'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
            }`}
          >
            <Building />
            <span className="font-medium">Commercial</span>
          </button>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin />
          Location Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Postcode *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.postcode ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800`}
              placeholder="2000"
            />
            {errors.postcode && <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Suburb/City *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800`}
              placeholder="Sydney"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.state ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800`}
            >
              <option value="">Select State</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="SA">SA</option>
              <option value="WA">WA</option>
              <option value="TAS">TAS</option>
              <option value="NT">NT</option>
              <option value="ACT">ACT</option>
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
          </div>
        </div>
      </div>

      {/* Energy Usage Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap />
          Energy Usage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="electricityUsageType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bill Type *
            </label>
            <select
              id="electricityUsageType"
              value={electricityUsageType}
              onChange={(e) => setElectricityUsageType(e.target.value as 'monthly' | 'quarterly')}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="monthly">Monthly Bill</option>
              <option value="quarterly">Quarterly Bill</option>
            </select>
          </div>

          <div>
            <label htmlFor="electricityValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <DollarSign />
              {electricityUsageType === 'monthly' ? 'Monthly' : 'Quarterly'} Bill Amount *
            </label>
            <input
              type="number"
              id="electricityValue"
              value={electricityValue}
              onChange={(e) => {
                setElectricityValue(e.target.value);
                if (errors.electricityValue) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.electricityValue;
                    return newErrors;
                  });
                }
              }}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.electricityValue ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800`}
              placeholder="250"
            />
            {errors.electricityValue && <p className="mt-1 text-sm text-red-500">{errors.electricityValue}</p>}
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Home />
          Property Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="roofType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Roof Type
              <InfoTooltip text="The material your roof is made of" />
            </label>
            <select
              id="roofType"
              name="roofType"
              value={formData.roofType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="">Select Roof Type</option>
              <option value="tile">Tile</option>
              <option value="metal">Metal (Corrugated/Colourbond)</option>
              <option value="flat">Flat Concrete</option>
              <option value="slate">Slate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Budget Range
              <InfoTooltip text="Your approximate budget for solar installation" />
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="">Select Budget</option>
              <option value="under_5k">Under $5,000</option>
              <option value="5k_10k">$5,000 - $10,000</option>
              <option value="10k_15k">$10,000 - $15,000</option>
              <option value="15k_20k">$15,000 - $20,000</option>
              <option value="20k_30k">$20,000 - $30,000</option>
              <option value="over_30k">Over $30,000</option>
            </select>
          </div>

          <div>
            <label htmlFor="panelOrientation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Roof Orientation
              <InfoTooltip text="The direction your roof faces" />
            </label>
            <select
              id="panelOrientation"
              name="panelOrientation"
              value={formData.panelOrientation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="north">North (Best)</option>
              <option value="north_east">North-East</option>
              <option value="north_west">North-West</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="south">South</option>
              <option value="flat">Flat Roof</option>
            </select>
          </div>

          <div>
            <label htmlFor="roofTilt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Roof Pitch
              <InfoTooltip text="The angle/slope of your roof" />
            </label>
            <select
              id="roofTilt"
              name="roofTilt"
              value={formData.roofTilt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="optimal">Optimal (20-30°)</option>
              <option value="low">Low (0-15°)</option>
              <option value="medium">Medium (15-25°)</option>
              <option value="steep">Steep (30-45°)</option>
              <option value="very_steep">Very Steep (45°+)</option>
            </select>
          </div>

          <div>
            <label htmlFor="shadingLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Shading Level
              <InfoTooltip text="How much shade falls on your roof" />
            </label>
            <select
              id="shadingLevel"
              name="shadingLevel"
              value={formData.shadingLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="none">No Shading</option>
              <option value="minimal">Minimal (Morning/Evening)</option>
              <option value="moderate">Moderate (Part of Day)</option>
              <option value="significant">Significant (Most of Day)</option>
            </select>
          </div>

          <div>
            <label htmlFor="usagePattern" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Usage Pattern
              <InfoTooltip text="When do you use most electricity?" />
            </label>
            <select
              id="usagePattern"
              name="usagePattern"
              value={formData.usagePattern}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="spread">Spread Throughout Day</option>
              <option value="morning">Mostly Morning</option>
              <option value="daytime">Mostly Daytime</option>
              <option value="evening">Mostly Evening</option>
              <option value="night">Mostly Night</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="desiredOffset" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Desired Offset (%)
              <InfoTooltip text="How much of your bill do you want solar to cover?" />
            </label>
            <input
              type="range"
              id="desiredOffset"
              name="desiredOffset"
              min="0"
              max="150"
              step="10"
              value={formData.desiredOffset}
              onChange={handleChange}
              className="w-full"
            />
            <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-1">
              {formData.desiredOffset}%
            </div>
          </div>

          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Installation Timeframe
              <InfoTooltip text="When would you like to install?" />
            </label>
            <select
              id="timeframe"
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            >
              <option value="">Select Timeframe</option>
              <option value="urgent">ASAP (Within 1 month)</option>
              <option value="soon">Soon (1-3 months)</option>
              <option value="flexible">Flexible (3-6 months)</option>
              <option value="planning">Just Planning (6+ months)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasExistingSystem"
              checked={formData.hasExistingSystem}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              I have an existing solar system
            </span>
          </label>

          {formData.hasExistingSystem && (
            <input
              type="text"
              name="existingSystemSize"
              value={formData.existingSystemSize}
              onChange={handleChange}
              placeholder="e.g., 5kW"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          )}
        </div>
      </div>

      {/* Battery Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Battery />
          Battery Storage
        </h3>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="batteryIncluded"
            checked={formData.batteryIncluded}
            onChange={handleChange}
            className="rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Include Battery Storage
          </span>
        </label>

        {formData.batteryIncluded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <label htmlFor="batteryCapacity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Battery Capacity
              </label>
              <select
                id="batteryCapacity"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              >
                <option value="">Select Capacity</option>
                <option value="5">5 kWh</option>
                <option value="10">10 kWh</option>
                <option value="13.5">13.5 kWh</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {formData.batteryCapacity === 'custom' && (
              <div>
                <label htmlFor="customBatteryCapacity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Custom Capacity (kWh)
                </label>
                <input
                  type="number"
                  id="customBatteryCapacity"
                  name="customBatteryCapacity"
                  value={formData.customBatteryCapacity}
                  onChange={handleChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
                  placeholder="15"
                />
              </div>
            )}

            <div>
              <label htmlFor="batteryBrand" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred Brand (Optional)
              </label>
              <input
                type="text"
                id="batteryBrand"
                name="batteryBrand"
                value={formData.batteryBrand}
                onChange={handleChange}
                placeholder="e.g., Tesla Powerwall"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label htmlFor="batteryUsage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Battery Usage
              </label>
              <select
                id="batteryUsage"
                name="batteryUsage"
                value={formData.batteryUsage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              >
                <option value="self-consumption">Self Consumption</option>
                <option value="backup">Backup Power</option>
                <option value="time-of-use">Time of Use</option>
                <option value="vpp">VPP Participation</option>
              </select>
            </div>

            <div>
              <label htmlFor="backupCritical" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Backup Priority
              </label>
              <select
                id="backupCritical"
                name="backupCritical"
                value={formData.backupCritical}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              >
                <option value="essential">Essential Loads Only</option>
                <option value="whole-home">Whole Home Backup</option>
                <option value="none">No Backup Required</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="includeVPP"
                  checked={formData.includeVPP}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Include VPP Program
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Additional Features Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Additional Features</h3>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeEVCharging"
              checked={formData.includeEVCharging}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Include EV Charging
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeSmartHome"
              checked={formData.includeSmartHome}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Include Smart Home Integration
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeGridServices"
              checked={formData.includeGridServices}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Include Grid Services
            </span>
          </label>
        </div>
      </div>

      {/* Equipment Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Equipment Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="panelBrand" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Preferred Panel Brand (Optional)
            </label>
            <input
              type="text"
              id="panelBrand"
              name="panelBrand"
              value={formData.panelBrand}
              onChange={handleChange}
              placeholder="e.g., LG, SunPower"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label htmlFor="systemSizeOverride" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Specific System Size (Optional)
            </label>
            <input
              type="text"
              id="systemSizeOverride"
              name="systemSizeOverride"
              value={formData.systemSizeOverride}
              onChange={handleChange}
              placeholder="e.g., 6.6kW"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeOptimizers"
              checked={formData.includeOptimizers}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Include Panel Optimizers
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeMicroinverters"
              checked={formData.includeMicroinverters}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Use Microinverters
            </span>
          </label>
        </div>
      </div>

      {/* Tariff Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tariff Details (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="retailer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current Retailer
            </label>
            <input
              type="text"
              id="retailer"
              name="retailer"
              value={formData.retailer}
              onChange={handleChange}
              placeholder="e.g., Origin Energy"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label htmlFor="tariffPlan" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tariff Plan
            </label>
            <input
              type="text"
              id="tariffPlan"
              name="tariffPlan"
              value={formData.tariffPlan}
              onChange={handleChange}
              placeholder="e.g., Time of Use"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label htmlFor="customRetailRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Retail Rate (¢/kWh)
            </label>
            <input
              type="number"
              id="customRetailRate"
              name="customRetailRate"
              value={formData.customRetailRate}
              onChange={handleChange}
              step="0.01"
              placeholder="30"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label htmlFor="customFeedInRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Feed-In Rate (¢/kWh)
            </label>
            <input
              type="number"
              id="customFeedInRate"
              name="customFeedInRate"
              value={formData.customFeedInRate}
              onChange={handleChange}
              step="0.01"
              placeholder="8"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Commercial-Specific Fields */}
      {propertyType === 'commercial' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Building />
            Commercial Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="peakDemand" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Peak Demand (kW)
              </label>
              <input
                type="number"
                id="peakDemand"
                name="peakDemand"
                value={formData.peakDemand}
                onChange={handleChange}
                step="0.1"
                placeholder="50"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label htmlFor="projectPriority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project Priority
              </label>
              <select
                id="projectPriority"
                name="projectPriority"
                value={formData.projectPriority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
              >
                <option value="reduce_bills">Reduce Bills</option>
                <option value="sustainability">Sustainability</option>
                <option value="energy_independence">Energy Independence</option>
                <option value="peak_shaving">Peak Demand Shaving</option>
              </select>
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isThreePhase"
              checked={formData.isThreePhase}
              onChange={handleChange}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Three-Phase Connection
            </span>
          </label>
        </div>
      )}

      {/* Additional Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Additional Notes</h3>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Any specific requirements or questions?
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800"
            placeholder="Share any additional details about your project..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default SimplifiedQuoteForm;
