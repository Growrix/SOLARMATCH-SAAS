'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Button from '@/components/ui/button';
import { X, Save, Send, Eye, Zap, DollarSign, Plus, Trash2, FileText } from 'lucide-react';

// --- Icon Components (Migrated: X, FileText, Save, Send, Eye, Zap, DollarSign, Plus, Trash → lucide-react) ---

// --- Mock Data ---
const MOCK_PANEL_MODELS = [
  { id: 'p1', name: 'SunPower Maxeon 6', wattage: 440, efficiency: 22.8 },
  { id: 'p2', name: 'Trina Solar Vertex S+', wattage: 430, efficiency: 21.5 },
  { id: 'p3', name: 'Canadian Solar HiKu6', wattage: 545, efficiency: 21.3 },
];
const MOCK_INVERTER_MODELS = [
  { id: 'i1', name: 'Enphase IQ8M', type: 'Microinverter' },
  { id: 'i2', name: 'Fronius Primo GEN24', type: 'Hybrid String' },
];
const MOCK_BATTERY_MODELS = [
  { id: 'b1', name: 'Tesla Powerwall 2', capacity: 13.5 },
  { id: 'b2', name: 'Enphase IQ Battery 5P', capacity: 5.0 },
];
const MOCK_PRESETS = [
    { name: 'Economy', panelId: 'p2', inverterId: 'i2', batteryId: null, pricing: [ { id: 1, description:"Standard 6.6kW System Supply & Install", category: 'System', qty: 1, unitPrice: 7000, tax: true }] },
    { name: 'Balanced', panelId: 'p2', inverterId: 'i2', batteryId: 'b2', pricing: [ { id: 1, description:"6.6kW System with 5kWh Battery", category: 'System', qty: 1, unitPrice: 12500, tax: true }] },
    { name: 'Premium', panelId: 'p1', inverterId: 'i1', batteryId: 'b1', pricing: [ { id: 1, description:"8.8kW Premium System with Powerwall", category: 'System', qty: 1, unitPrice: 24000, tax: true }] },
];

// --- Types ---
interface Lead { id: string | number; name: string; location: string; propertyType: string; systemSize: string; estimatedUsage: string; budget: string; }
interface LineItem { id: number; description: string; category: string; qty: number; unitPrice: number; tax: boolean; }
interface QuoteData { systemSize: number; panelId: string; inverterId: string; batteryId: string | null; lineItems: LineItem[]; }
interface QuoteBuilderModalProps { isOpen: boolean; onClose: () => void; lead: Lead | null; onSubmitQuote: (leadId: string, quoteData: any) => Promise<boolean>; }

const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({ isOpen, onClose, lead, onSubmitQuote }) => {
  const [quoteData, setQuoteData] = useState<QuoteData>({ systemSize: 6.6, panelId: 'p2', inverterId: 'i2', batteryId: null, lineItems: MOCK_PRESETS[0].pricing });
  const [viewMode, setViewMode] = useState<'installer' | 'customer'>('installer');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // --- Effects ---
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-save mock
  useEffect(() => {
    if(!isOpen) return;
    const timer = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 700);
    }, 30000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // --- Calculations ---
  const calculations = useMemo(() => {
    const subtotal = quoteData.lineItems.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
    const tax = quoteData.lineItems.filter(i => i.tax).reduce((acc, item) => acc + item.qty * item.unitPrice * 0.1, 0);
    const total = subtotal + tax;
    const pricePerWatt = quoteData.systemSize > 0 ? total / (quoteData.systemSize * 1000) : 0;
    const federalIncentive = (quoteData.systemSize * 1.382 * 7) * 40;
    const netCost = total - federalIncentive;
    const annualSavings = (quoteData.systemSize * 4.2 * 365 * 0.5) * 0.30;
    const payback = netCost / annualSavings;

    return { subtotal, tax, total, pricePerWatt, federalIncentive, netCost, annualSavings, payback };
  }, [quoteData]);

  // --- Handlers ---
  const handleLineItemChange = (id: number, field: keyof LineItem, value: any) => {
    setQuoteData(prev => ({ ...prev, lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item)}));
  };
  const addLineItem = () => setQuoteData(prev => ({ ...prev, lineItems: [...prev.lineItems, { id: Date.now(), description: '', category: 'Other', qty: 1, unitPrice: 0, tax: true }]}));
  const removeLineItem = (id: number) => setQuoteData(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id)}));
  const applyPreset = (presetName: string) => {
    const preset = MOCK_PRESETS.find(p => p.name === presetName);
    if (preset) {
        setQuoteData(prev => ({ ...prev, panelId: preset.panelId, inverterId: preset.inverterId, batteryId: preset.batteryId, lineItems: preset.pricing }));
    }
  };
  
  if (!isOpen || !lead) return null;

  const inputClasses ="w-full px-4 py-3 bg-background rounded-xl shadow-neu-inset border border-border/50 focus:outline-none focus:shadow-neu-inset-sm focus:border-primary/50 text-foreground transition-colors";
  const selectClasses ="w-full px-4 py-3 bg-background rounded-xl shadow-neu-inset border border-border/50 focus:outline-none focus:shadow-neu-inset-sm focus:border-primary/50 text-foreground transition-colors appearance-none";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in" onClick={onClose}>
      <div ref={modalRef} className="bg-background relative w-full h-full md:max-w-7xl md:h-[95vh] md:rounded-2xl flex flex-col animate-scale-in shadow-neu-outset-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="flex-shrink-0 p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><FileText className="text-primary h-5 w-5" /></div>
            <div>
              <h2 className="text-heading-4 text-foreground">Quote Builder: {lead.name}</h2>
              <div className="flex items-center gap-4 text-caption text-muted-foreground">
                <span>Quote ID: #Q-2024-0012</span>
                <div className="flex items-center gap-1.5">Status: <span className="text-warning">Draft</span></div>
                <div className="hidden md:flex items-center gap-1.5">
                  {isSaving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
                </div>
              </div>
            </div>
          </div>
          {/* Migrated: buttons → shadcn Button - preserved onClick, alert functionality */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button onClick={() => alert("Save Draft clicked")} variant="minimal" className="w-full md:w-auto px-4 py-2">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button variant="minimal" className="w-full md:w-auto px-4 py-2">
              <Eye className="h-4 w-4" /> Preview PDF
            </Button>
            <Button variant="minimal" className="w-full md:w-auto px-4 py-2">
              <Send className="h-4 w-4" /> Send Quote
            </Button>
            <Button onClick={onClose} variant="minimal" className="absolute top-4 right-4 md:static p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Mobile Tabs - Migrated: buttons → shadcn Button - preserved onClick, active state */}
        <div className="md:hidden p-2 border-b border-border flex gap-2">
            <Button 
              onClick={() => setMobileTab('editor')} 
              variant={mobileTab === 'editor' ? 'secondary' : 'ghost'}
              className="flex-1"
            >
              Editor
            </Button>
            <Button 
              onClick={() => setMobileTab('preview')} 
              variant={mobileTab === 'preview' ? 'secondary' : 'ghost'}
              className="flex-1"
            >
              Preview
            </Button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left: Editor Panel */}
          <div className={`flex-grow p-4 overflow-y-auto space-y-6 ${mobileTab === 'preview' ? 'hidden md:block' : ''} md:w-2/3`}>
            {/* Presets - Migrated: buttons → shadcn Button - preserved onClick, preset logic */}
            <div className="bg-background rounded-2xl shadow-neu-inset p-4">
                <h3 className="text-label mb-2 text-foreground">Quick Presets</h3>
                <div className="flex gap-2">{MOCK_PRESETS.map(p => <Button key={p.name} onClick={() => applyPreset(p.name)} variant="secondary" className="flex-1 text-body-small px-2 py-1">{p.name}</Button>)}</div>
            </div>
            {/* System Design */}
            <div className="bg-background rounded-2xl shadow-neu-inset p-4">
              <h3 className="text-label mb-2 flex items-center gap-2 text-foreground"><Zap className="h-4 w-4" /> System Design</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="text-caption text-muted-foreground block mb-1">System Size (kW)</label><input type="number" value={quoteData.systemSize} onChange={e => setQuoteData(p => ({...p, systemSize: parseFloat(e.target.value)}))} className={inputClasses} /></div>
                <div><label className="text-caption text-muted-foreground block mb-1">Panel Model</label><select value={quoteData.panelId} onChange={e => setQuoteData(p => ({...p, panelId: e.target.value}))} className={selectClasses}>{MOCK_PANEL_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div><label className="text-caption text-muted-foreground block mb-1">Inverter Model</label><select value={quoteData.inverterId} onChange={e => setQuoteData(p => ({...p, inverterId: e.target.value}))} className={selectClasses}>{MOCK_INVERTER_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div><label className="text-caption text-muted-foreground block mb-1">Battery</label><select value={quoteData.batteryId ?? ''} onChange={e => setQuoteData(p => ({...p, batteryId: e.target.value || null}))} className={selectClasses}><option value="">None</option>{MOCK_BATTERY_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              </div>
            </div>
            {/* Itemized Pricing */}
            <div className="bg-background rounded-2xl shadow-neu-inset p-4">
                <h3 className="text-label mb-2 flex items-center gap-2 text-foreground"><DollarSign className="h-4 w-4" /> Itemized Pricing</h3>
                <div className="space-y-2">
                    {quoteData.lineItems.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" placeholder="Description" value={item.description} onChange={e => handleLineItemChange(item.id, 'description', e.target.value)} className={`${inputClasses} col-span-5`} />
                            <input type="number" placeholder="Qty" value={item.qty} onChange={e => handleLineItemChange(item.id, 'qty', parseFloat(e.target.value))} className={`${inputClasses} col-span-2 text-center`} />
                            <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value))} className={`${inputClasses} col-span-2 text-right`} />
                            <div className="col-span-2 text-right text-label text-foreground">{`$${(item.qty * item.unitPrice).toLocaleString()}`}</div>
                            {/* Migrated: button → shadcn Button - preserved onClick, delete logic */}
                            <Button onClick={() => removeLineItem(item.id)} variant="minimal" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                {/* Migrated: button → shadcn Button - preserved onClick, add item logic */}
                <Button onClick={addLineItem} variant="minimal" className="mt-2 text-body-small px-3 py-1.5">
                  <Plus className="h-4 w-4" /> Add Line Item
                </Button>
            </div>
          </div>
          {/* Right: Preview Panel */}
          <div className={`flex-shrink-0 p-4 overflow-y-auto space-y-4 bg-background-alt ${mobileTab === 'editor' ? 'hidden md:block' : ''} md:w-1/3 md:border-l border-border`}>
            <div className="flex items-center justify-between">
              <h3 className="text-foreground">Live Preview</h3>
              <div className="flex items-center gap-2">
                <label className="text-caption text-muted-foreground">Customer View</label>
                {/* Toggle preserved as-is - custom toggle pattern, not using Button component */}
                <button onClick={() => setViewMode(v => v === 'installer' ? 'customer' : 'installer')} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${viewMode === 'customer' ? 'bg-primary' : 'bg-border'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-surface transition-transform ${viewMode === 'customer' ? 'translate-x-5' : 'translate-x-1'}`}/></button>
              </div>
            </div>
            {/* Totals */}
            <div className="bg-background rounded-2xl p-4 shadow-neu-inset">
              <div className="space-y-2 text-body-small">
                <div className="flex justify-between text-foreground"><span>Subtotal</span><span>{`$${calculations.subtotal.toLocaleString()}`}</span></div>
                <div className="flex justify-between text-foreground"><span>GST (10%)</span><span>{`$${calculations.tax.toLocaleString()}`}</span></div>
                <div className="flex justify-between text-body border-t border-border pt-2 mt-2 text-foreground"><span>Total Price</span><span>{`$${calculations.total.toLocaleString()}`}</span></div>
              </div>
            </div>
            {/* Financial Summary */}
            <div className="bg-background rounded-2xl p-4 text-body-small shadow-neu-inset">
                <h4 className="mb-2 text-foreground">Financial Summary</h4>
                <div className="space-y-1">
                    <div className="flex justify-between text-foreground"><span>Federal Incentive (est.)</span><span className="text-success">{`-$${calculations.federalIncentive.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-foreground"><span>Net Cost (est.)</span><span>{`$${calculations.netCost.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-caption text-muted-foreground pt-2 mt-2 border-t border-border"><span>Price per Watt</span><span>{`$${calculations.pricePerWatt.toFixed(2)} / W`}</span></div>
                    <div className="flex justify-between text-caption text-muted-foreground"><span>Est. Annual Savings</span><span>{`$${calculations.annualSavings.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-caption text-muted-foreground"><span>Simple Payback</span><span>{`${calculations.payback.toFixed(1)} years`}</span></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilderModal;