'use client'

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';
import { X, Save, Send, Eye, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { calcQuoteTotals, DEFAULT_ASSUMPTIONS, QuoteInputs } from '@/utils/quoteCalculator';

// Import all section components
import SystemSelection, { SystemSelectionData } from './quote-builder/SystemSelection';
import RoofSiteDetails, { RoofSiteDetailsData } from './quote-builder/RoofSiteDetails';
import ProductConfiguration, { ProductConfigurationData } from './quote-builder/ProductConfiguration';
import PricingEngine, { PricingEngineData } from './quote-builder/PricingEngine';
import ComplianceDocs, { ComplianceDocsData } from './quote-builder/ComplianceDocs';
import CustomerPreview, { CustomerPreviewData, QuoteOption } from './quote-builder/CustomerPreview';
import { PRESET_BUNDLES } from './quote-builder/Presets';

// --- Types ---
interface Lead {
  id: string | number;
  name: string;
  location: string;
  propertyType: string;
  systemSize: string;
  estimatedUsage: string;
  budget: string;
}

interface QuoteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSubmitQuote: (leadId: string, quoteData: any) => Promise<boolean>;
  mode?: 'quote' | 'bid';
}

interface QuoteDraft {
  mode: 'quote' | 'bid' | 'config';
  system: SystemSelectionData;
  roof: RoofSiteDetailsData;
  products: ProductConfigurationData;
  pricing: PricingEngineData;
  compliance: ComplianceDocsData;
  preview: CustomerPreviewData;
  assumptions: {
    yield_kWh_per_kW_per_day: number;
    selfConsumption: number;
    retailPrice: number;
    feedInTariff: number;
    annualOpex: number;
    degradationPercentPerYear: number;
    escalationPercentPerYear: number;
  };
  meta: {
    version: number;
    lastSavedAt: string;
    autosaveStatus: 'idle' | 'saving' | 'saved';
  };
}

const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSubmitQuote,
  mode = 'quote'
}) => {
  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    system: true,
    roof: false,
    products: false,
    pricing: false,
    compliance: false,
    preview: true
  });

  // Main quote draft state
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>({
    mode: mode,
    system: {
      systemType: 'grid-connected',
      systemSize: 6.6,
      desiredPriceRange: undefined
    },
    roof: {
      roofType: '',
      pitchDeg: 22,
      arrays: 1,
      orientations: [],
      shadingLevel: 0,
      phaseType: 'single',
      switchboardUpgrade: false,
      smartMeterRequired: false,
      distanceToSwitchboardM: 10,
      notes: '',
      photos: []
    },
    products: {
      panels: {
        brand: '',
        model: '',
        wattage: 430,
        efficiency: 21.5,
        qty: 16,
        productWarranty: 12,
        performanceWarranty: 25,
        tier1: false
      },
      inverter: {
        brand: '',
        model: '',
        type: '',
        capacityKw: 5,
        mppts: 2,
        warranty: 10
      },
      battery: undefined,
      addons: []
    },
    pricing: {
      lineItems: [],
      stc: {
        eligible: true,
        zone: 'Zone 3',
        stcCount: 90,
        stcPrice: 40
      },
      vic: {
        rebateEligible: false,
        rebateAmount: 1400,
        interestFreeLoan: false,
        batteryLoan: false
      },
      discounts: [],
      installerCostMode: false
    },
    compliance: {
      docs: [],
      cecAccreditation: '',
      electricalLicence: '',
      insurance: ''
    },
    preview: {
      options: []
    },
    assumptions: {
      yield_kWh_per_kW_per_day: DEFAULT_ASSUMPTIONS.yield_kWh_per_kW_per_day,
      selfConsumption: DEFAULT_ASSUMPTIONS.selfConsumption,
      retailPrice: DEFAULT_ASSUMPTIONS.retailPrice,
      feedInTariff: DEFAULT_ASSUMPTIONS.feedInTariff,
      annualOpex: DEFAULT_ASSUMPTIONS.annualOpex,
      degradationPercentPerYear: DEFAULT_ASSUMPTIONS.degradationPercentPerYear,
      escalationPercentPerYear: DEFAULT_ASSUMPTIONS.escalationPercentPerYear
    },
    meta: {
      version: 1,
      lastSavedAt: new Date().toISOString(),
      autosaveStatus: 'idle'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate preview options based on current config
  const generatePreviewOptions = (): QuoteOption[] => {
    const { system, products, pricing, assumptions } = quoteDraft;
    
    // Prepare inputs for calculator
    const calculatorInputs: QuoteInputs = {
      systemSize_kW: system.systemSize,
      lineItems: pricing.lineItems.map(item => ({
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        taxable: item.taxGst
      })),
      includeGst: true, // Always include GST, controlled per line item
      gstPercent: DEFAULT_ASSUMPTIONS.gstPercent,
      includeIncentive: true,
      incentiveAmount: (pricing.stc.eligible ? pricing.stc.stcCount * pricing.stc.stcPrice : 0) +
                       (pricing.vic.rebateEligible ? pricing.vic.rebateAmount : 0) +
                       pricing.discounts.reduce((acc, d) => acc + d.amount, 0),
      yield_kWh_per_kW_per_day: assumptions.yield_kWh_per_kW_per_day,
      selfConsumption: assumptions.selfConsumption,
      retailPrice: assumptions.retailPrice,
      feedInTariff: assumptions.feedInTariff,
      annualOpex: assumptions.annualOpex
    };

    // Calculate totals using the calculator
    const totals = calcQuoteTotals(calculatorInputs);
    const co2OffsetTonnesPerYear = system.systemSize * 1.5;

    return [
      {
        id: 'current',
        name: 'Balanced',
        label: 'Current Configuration',
        systemSize: system.systemSize,
        panels: `${products.panels.brand} ${products.panels.model} (${products.panels.qty} panels)`,
        inverter: `${products.inverter.brand} ${products.inverter.model}`,
        battery: products.battery
          ? `${products.battery.brand} ${products.battery.model} (${products.battery.usableKwh}kWh)`
          : undefined,
        addons: products.addons.length > 0 ? products.addons.map(a => a.label) : undefined,
        totalPrice: totals.total,
        pricePerWatt: totals.pricePerWatt,
        estimatedSavingsPerYear: totals.annualSavings,
        paybackYears: totals.paybackYears === 'N/A' ? Infinity : totals.paybackYears,
        warrantyYears: products.panels.performanceWarranty,
        co2OffsetTonnesPerYear
      }
    ];
  };

  // Effects
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autosave effect
  useEffect(() => {
    if (!isOpen || !lead) return;

    const saveDraft = () => {
      setIsSaving(true);
      setQuoteDraft((prev) => ({
        ...prev,
        meta: { ...prev.meta, autosaveStatus: 'saving' }
      }));

      const draftKey =
        mode === 'bid'
          ? `bid:draft:${lead.id}:installer-id`
          : `quote:draft:${lead.id}:installer-id`;
      
      const draftData = {
        ...quoteDraft,
        meta: {
          ...quoteDraft.meta,
          lastSavedAt: new Date().toISOString()
        }
      };

      localStorage.setItem(draftKey, JSON.stringify(draftData));

      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
        setQuoteDraft((prev) => ({
          ...prev,
          meta: { ...prev.meta, autosaveStatus: 'saved' }
        }));
      }, 500);
    };

    const timer = setTimeout(saveDraft, 750);
    return () => clearTimeout(timer);
  }, [isOpen, lead, mode, quoteDraft]);

  // Load draft on mount
  useEffect(() => {
    if (!isOpen || !lead) return;

    const draftKey =
      mode === 'bid'
        ? `bid:draft:${lead.id}:installer-id`
        : `quote:draft:${lead.id}:installer-id`;
    const draft = localStorage.getItem(draftKey);

    if (draft) {
      try {
        const data = JSON.parse(draft) as QuoteDraft;
        // Merge with current state to ensure all required properties exist
        setQuoteDraft(prev => ({
          ...prev,
          ...data,
          system: { ...prev.system, ...(data.system || {}) },
          roof: { ...prev.roof, ...(data.roof || {}) },
          products: { ...prev.products, ...(data.products || {}) },
          pricing: { ...prev.pricing, ...(data.pricing || {}) },
          compliance: { ...prev.compliance, ...(data.compliance || {}) },
          preview: { ...prev.preview, ...(data.preview || {}) },
          assumptions: { ...prev.assumptions, ...(data.assumptions || {}) },
          meta: { ...prev.meta, ...(data.meta || {}) }
        }));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [isOpen, lead, mode]);

  // Update preview options when relevant data changes (T020 - Real-time preview)
  useEffect(() => {
    const options = generatePreviewOptions();
    setQuoteDraft((prev) => ({
      ...prev,
      preview: { options }
    }));
  }, [quoteDraft.system, quoteDraft.products, quoteDraft.pricing?.lineItems, quoteDraft.assumptions]);

  // Auto-sync addons to pricing engine line items (T018)
  useEffect(() => {
    const addonLineItems = quoteDraft.products.addons.map(addon => ({
      id: Date.now() + Math.random(), // Ensure unique ID
      category: 'Addons',
      description: addon.label,
      qty: addon.qty,
      unitPrice: addon.unitPrice,
      taxGst: true
    }));

    // Get non-addon line items
    const nonAddonItems = quoteDraft.pricing.lineItems.filter(item => item.category !== 'Addons');
    
    // Combine non-addon items with current addon items
    const updatedLineItems = [...nonAddonItems, ...addonLineItems];

    // Only update if line items changed
    if (JSON.stringify(quoteDraft.pricing.lineItems) !== JSON.stringify(updatedLineItems)) {
      setQuoteDraft((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          lineItems: updatedLineItems
        }
      }));
    }
  }, [quoteDraft.products.addons]);

  // Handlers
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSystem = (data: Partial<SystemSelectionData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      system: { ...prev.system, ...data }
    }));
  };

  const updateRoof = (data: Partial<RoofSiteDetailsData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      roof: { ...prev.roof, ...data }
    }));
  };

  const updateProducts = (data: Partial<ProductConfigurationData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      products: { ...prev.products, ...data }
    }));
  };

  const updatePricing = (data: Partial<PricingEngineData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, ...data }
    }));
  };

  const updateCompliance = (data: Partial<ComplianceDocsData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      compliance: { ...prev.compliance, ...data }
    }));
  };

  const updatePreview = (data: Partial<CustomerPreviewData>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      preview: { ...prev.preview, ...data }
    }));
  };

  const updateAssumptions = (data: Partial<QuoteDraft['assumptions']>) => {
    setQuoteDraft((prev) => ({
      ...prev,
      assumptions: { ...prev.assumptions, ...data }
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!lead) return;

    setIsSubmitting(true);

    try {
      if (mode === 'bid') {
        // Calculate totals from pricing data
        const subtotal = quoteDraft.pricing.lineItems.reduce(
          (acc, item) => acc + item.qty * item.unitPrice,
          0
        );
        const gstAmount = quoteDraft.pricing.lineItems
          .filter((item) => item.taxGst)
          .reduce((acc, item) => acc + item.qty * item.unitPrice * 0.1, 0);
        const stcDeduction = quoteDraft.pricing.stc.eligible
          ? quoteDraft.pricing.stc.stcCount * quoteDraft.pricing.stc.stcPrice
          : 0;
        const vicDeduction = quoteDraft.pricing.vic.rebateEligible
          ? quoteDraft.pricing.vic.rebateAmount
          : 0;
        const totalDiscounts = quoteDraft.pricing.discounts.reduce(
          (acc, d) => acc + d.amount,
          0
        );
        const finalTotal = subtotal + gstAmount - stcDeduction - vicDeduction - totalDiscounts;

        // Map QuoteDraft to Bid payload
        const bidPayload = {
          leadId: String(lead.id),
          amount: subtotal,
          capacityOffer: quoteDraft.system.systemSize,
          expectedInstallDate: null, // TODO: Add to UI if needed
          notes: quoteDraft.roof.notes || null,
          
          // Equipment details
          panelBrand: quoteDraft.products.panels.brand || null,
          inverterBrand: quoteDraft.products.inverter.brand || null,
          batteryBrand: quoteDraft.products.battery?.brand || null,
          batteryCapacity: quoteDraft.products.battery?.usableKwh || null,
          
          // Financial details
          includeGst: true,
          gstPercent: 10.0,
          includeIncentive: quoteDraft.pricing.stc.eligible,
          incentiveAmount: stcDeduction
        };

        // Call bid submission API
        const response = await fetch('/api/bids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bidPayload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit bid');
        }

        // Clear draft on success
        const draftKey = `bid:draft:${lead.id}:installer-id`;
        localStorage.removeItem(draftKey);

        // Show success message
        alert(`Bid submitted successfully! Bid ID: ${data.bidId}`);
        onClose();
      } else {
        // For quotes, use the existing onSubmitQuote handler
        const quoteData = {
          ...quoteDraft,
          leadId: lead.id
        };
        
        const success = await onSubmitQuote(String(lead.id), quoteData);
        
        if (success) {
          const draftKey = `quote:draft:${lead.id}:installer-id`;
          localStorage.removeItem(draftKey);
          onClose();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply preset
  const applyPreset = (presetName: string) => {
    const preset = PRESET_BUNDLES.find((p) => p.name === presetName);
    if (!preset) return;

    setQuoteDraft((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        systemType: preset.systemType,
        systemSize: preset.systemSize
      },
      products: {
        panels: { ...preset.panels, datasheetKey: undefined },
        inverter: { ...preset.inverter, datasheetKey: undefined },
        battery: preset.battery
          ? { ...preset.battery, datasheetKey: undefined, backupCircuitRequired: false }
          : undefined,
        addons: []
      },
      pricing: {
        ...prev.pricing,
        lineItems: preset.lineItems.map((item, idx) => ({
          ...item,
          id: Date.now() + idx,
          taxGst: item.tax
        }))
      }
    }));
  };

  if (!isOpen || !lead) return null;

  // Check if draft exists for restoration banner
  const draftKey =
    mode === 'bid'
      ? `bid:draft:${lead.id}:installer-id`
      : `quote:draft:${lead.id}:installer-id`;
  const hasDraft = typeof window !== 'undefined' && localStorage.getItem(draftKey);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-background relative w-full h-full md:max-w-[98vw] md:max-h-[98vh] md:rounded-2xl flex flex-col animate-scale-in shadow-neu-outset-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Draft Restoration Banner */}
        {hasDraft && (
          <div className="flex-shrink-0 bg-warning/10 border-b border-warning px-4 py-2 flex items-center justify-center gap-2">
            <FileText className="h-4 w-4 text-warning" />
            <span className="text-body-small text-warning">
              Draft restored from previous session (v{quoteDraft.meta?.version || 1})
            </span>
          </div>
        )}

        {/* Header */}
        <header className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-heading-4 text-foreground">
                  {mode === 'bid' ? 'Bid Builder' : `Quote Builder: ${lead.name}`}
                </h2>
                <div className="flex items-center gap-4 text-caption text-muted-foreground mt-1">
                  <span>Lead #{lead.id}</span>
                  <span>{lead.location}</span>
                  <div className="flex items-center gap-1.5">
                    Status: <span className="text-warning">Draft</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    {isSaving
                      ? 'Saving...'
                      : lastSaved
                      ? `Saved at ${lastSaved.toLocaleTimeString()}`
                      : 'Unsaved changes'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                onClick={() => alert('Save Draft clicked')}
                variant="minimal"
                className="flex-1 md:flex-initial px-4 py-2"
              >
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              {mode === 'quote' && (
                <Button variant="minimal" className="flex-1 md:flex-initial px-4 py-2">
                  <Eye className="h-4 w-4" /> Preview PDF
                </Button>
              )}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="primary" 
                className="flex-1 md:flex-initial px-4 py-2"
              >
                <Send className="h-4 w-4" /> 
                {isSubmitting 
                  ? 'Submitting...' 
                  : mode === 'bid' ? 'Submit Bid' : 'Send Quote'}
              </Button>
              <Button
                onClick={onClose}
                variant="minimal"
                className="hidden md:flex p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preset Quick Apply */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-caption text-muted-foreground self-center">Quick Presets:</span>
            {PRESET_BUNDLES.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => applyPreset(preset.name)}
                variant="secondary"
                className="text-body-small px-4 py-1.5"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="flex-grow overflow-hidden flex gap-4 p-4 md:p-6">
          {/* Left Column - 70% - Form Sections */}
          <div className="w-[70%] overflow-y-auto pr-2 space-y-6">
            {/* System Selection */}
            <CollapsibleSection
              title="System Selection"
              expanded={expandedSections.system}
              onToggle={() => toggleSection('system')}
            >
              <SystemSelection
                systemType={quoteDraft.system.systemType}
                systemSize={quoteDraft.system.systemSize}
                desiredPriceRange={quoteDraft.system.desiredPriceRange}
                onUpdate={updateSystem}
              />
            </CollapsibleSection>

            {/* Roof & Site Details */}
            <CollapsibleSection
              title="Roof & Site Details"
              expanded={expandedSections.roof}
              onToggle={() => toggleSection('roof')}
            >
              <RoofSiteDetails
                roofType={quoteDraft.roof.roofType}
                pitchDeg={quoteDraft.roof.pitchDeg}
                arrays={quoteDraft.roof.arrays}
                orientations={quoteDraft.roof.orientations}
                shadingLevel={quoteDraft.roof.shadingLevel}
                phaseType={quoteDraft.roof.phaseType}
                switchboardUpgrade={quoteDraft.roof.switchboardUpgrade}
                smartMeterRequired={quoteDraft.roof.smartMeterRequired}
                distanceToSwitchboardM={quoteDraft.roof.distanceToSwitchboardM}
                notes={quoteDraft.roof.notes}
                photos={quoteDraft.roof.photos}
                onUpdate={updateRoof}
              />
            </CollapsibleSection>

            {/* Product Configuration */}
            <CollapsibleSection
              title="Product Configuration"
              expanded={expandedSections.products}
              onToggle={() => toggleSection('products')}
            >
              <ProductConfiguration
                panels={quoteDraft.products.panels}
                inverter={quoteDraft.products.inverter}
                battery={quoteDraft.products.battery}
                addons={quoteDraft.products.addons}
                onUpdate={updateProducts}
              />
            </CollapsibleSection>

            {/* Pricing Engine */}
            <CollapsibleSection
              title="Pricing Engine"
              expanded={expandedSections.pricing}
              onToggle={() => toggleSection('pricing')}
            >
              <PricingEngine
                lineItems={quoteDraft.pricing.lineItems}
                stc={quoteDraft.pricing.stc}
                vic={quoteDraft.pricing.vic}
                discounts={quoteDraft.pricing.discounts}
                installerCostMode={quoteDraft.pricing.installerCostMode}
                systemSize={quoteDraft.system.systemSize}
                panelWattage={quoteDraft.products.panels.wattage}
                assumptions={quoteDraft.assumptions}
                onUpdate={updatePricing}
                onUpdateAssumptions={updateAssumptions}
              />
            </CollapsibleSection>

            {/* Compliance Documents */}
            <CollapsibleSection
              title="Compliance Documents"
              expanded={expandedSections.compliance}
              onToggle={() => toggleSection('compliance')}
            >
              <ComplianceDocs
                docs={quoteDraft.compliance.docs}
                cecAccreditation={quoteDraft.compliance.cecAccreditation}
                electricalLicence={quoteDraft.compliance.electricalLicence}
                insurance={quoteDraft.compliance.insurance}
                onUpdate={updateCompliance}
              />
            </CollapsibleSection>
          </div>

          {/* Right Column - 30% - Customer Preview (Sticky) */}
          <div className="w-[30%] overflow-y-auto pl-2">
            <div className="sticky top-0">
              <div className="bg-background-alt rounded-2xl shadow-neu p-4 space-y-4">
                <h3 className="text-heading-6 text-foreground">Customer Preview</h3>
                <CustomerPreview
                  options={quoteDraft.preview.options}
                  systemSize={quoteDraft.system.systemSize}
                  onUpdate={updatePreview}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  expanded,
  onToggle,
  children
}) => {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-3 bg-background-alt rounded-lg hover:bg-primary/5 transition-colors"
      >
        <span className="text-heading-6 text-foreground">{title}</span>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {expanded && <div className="animate-fade-in">{children}</div>}
    </div>
  );
};

export default QuoteBuilderModal;
