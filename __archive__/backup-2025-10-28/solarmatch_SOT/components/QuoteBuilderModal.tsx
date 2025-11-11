'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- Icon Components ---
const XIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const FileTextIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const SaveIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const SendIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;
const EyeIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const ZapIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>;
const DollarSignIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const PlusIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>;
const TrashIcon = ({ className = "h-4 w-4" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const CheckIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;

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
    { name: 'Economy', panelId: 'p2', inverterId: 'i2', batteryId: null, pricing: [ { id: 1, description: "Standard 6.6kW System Supply & Install", category: 'System', qty: 1, unitPrice: 7000, tax: true }] },
    { name: 'Balanced', panelId: 'p2', inverterId: 'i2', batteryId: 'b2', pricing: [ { id: 1, description: "6.6kW System with 5kWh Battery", category: 'System', qty: 1, unitPrice: 12500, tax: true }] },
    { name: 'Premium', panelId: 'p1', inverterId: 'i1', batteryId: 'b1', pricing: [ { id: 1, description: "8.8kW Premium System with Powerwall", category: 'System', qty: 1, unitPrice: 24000, tax: true }] },
];
const MOCK_DRAFTS = [ { version: 'v1.0 - Initial Draft', date: new Date() }, { version: 'v1.1 - Added Battery', date: new Date(Date.now() - 86400000) }];

// --- Types ---
interface Lead { id: number; name: string; location: string; propertyType: string; systemSize: string; estimatedUsage: string; budget: string; }
interface LineItem { id: number; description: string; category: string; qty: number; unitPrice: number; tax: boolean; }
interface QuoteData { systemSize: number; panelId: string; inverterId: string; batteryId: string | null; lineItems: LineItem[]; }
interface QuoteBuilderModalProps { isOpen: boolean; onClose: () => void; lead: Lead | null; onSubmitQuote: (leadId: number, quoteData: any) => Promise<boolean>; }

const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({ isOpen, onClose, lead, onSubmitQuote }) => {
  const [quoteData, setQuoteData] = useState<QuoteData>({ systemSize: 6.6, panelId: 'p2', inverterId: 'i2', batteryId: null, lineItems: MOCK_PRESETS[0].pricing });
  const [viewMode, setViewMode] = useState<'installer' | 'customer'>('installer');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
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
      console.log("Auto-saving draft...");
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 700);
    }, 30000); // Auto-save every 30 seconds
    return () => clearInterval(timer);
  }, [isOpen, quoteData]);

  // --- Calculations ---
  const calculations = useMemo(() => {
    const subtotal = quoteData.lineItems.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
    const tax = quoteData.lineItems.filter(i => i.tax).reduce((acc, item) => acc + item.qty * item.unitPrice * 0.1, 0);
    const total = subtotal + tax;
    const pricePerWatt = quoteData.systemSize > 0 ? total / (quoteData.systemSize * 1000) : 0;
    // Mocked financial calculations
    const federalIncentive = (quoteData.systemSize * 1.382 * 7) * 40; // STC calculation mock
    const netCost = total - federalIncentive;
    const annualSavings = (quoteData.systemSize * 4.2 * 365 * 0.5) * 0.30; // Production * self-consumption * tariff
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

  const inputClasses = "modal-input text-sm";
  const selectClasses = "modal-select text-sm";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in" onClick={onClose} role="dialog">
      <div ref={modalRef} className="theme-card relative w-full h-full md:max-w-7xl md:h-[95vh] md:rounded-2xl flex flex-col animate-slide-in-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="flex-shrink-0 p-4 border-b border-gray-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><FileTextIcon className="text-primary" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quote Builder: {lead.name}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Quote ID: #Q-2024-0012</span>
                <div className="flex items-center gap-1.5">Status: <span className="font-semibold text-amber-500">Draft</span></div>
                <div className="hidden md:flex items-center gap-1.5">
                  {isSaving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={() => alert("Save Draft clicked")} className="px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 flex items-center gap-2 w-full justify-center md:w-auto"><SaveIcon /> Save Draft</button>
            <button className="px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 flex items-center gap-2 w-full justify-center md:w-auto"><EyeIcon /> Preview PDF</button>
            <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-teal-700 flex items-center gap-2 w-full justify-center md:w-auto"><SendIcon /> Send Quote</button>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 absolute top-4 right-4 md:static"><XIcon /></button>
          </div>
        </header>

        {/* Mobile Tabs */}
        <div className="md:hidden p-2 border-b border-gray-200 dark:border-slate-800 flex gap-2">
            <button onClick={() => setMobileTab('editor')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${mobileTab === 'editor' ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}>Editor</button>
            <button onClick={() => setMobileTab('preview')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${mobileTab === 'preview' ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}>Preview</button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left: Editor Panel */}
          <div className={`flex-grow p-4 overflow-y-auto space-y-6 ${mobileTab === 'preview' ? 'hidden md:block' : ''} md:w-2/3`}>
            {/* Presets */}
            <div className="modal-inner-card p-4">
                <h3 className="text-sm font-semibold mb-2">Quick Presets</h3>
                <div className="flex gap-2">{MOCK_PRESETS.map(p => <button key={p.name} onClick={() => applyPreset(p.name)} className="flex-1 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-md hover:bg-primary/20">{p.name}</button>)}</div>
            </div>
            {/* System Design */}
            <div className="modal-inner-card p-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><ZapIcon /> System Design</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className="text-xs text-slate-500">System Size (kW)</label><input type="number" value={quoteData.systemSize} onChange={e => setQuoteData(p => ({...p, systemSize: parseFloat(e.target.value)}))} className={inputClasses} /></div>
                <div><label className="text-xs text-slate-500">Panel Model</label><select value={quoteData.panelId} onChange={e => setQuoteData(p => ({...p, panelId: e.target.value}))} className={selectClasses}>{MOCK_PANEL_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div><label className="text-xs text-slate-500">Inverter Model</label><select value={quoteData.inverterId} onChange={e => setQuoteData(p => ({...p, inverterId: e.target.value}))} className={selectClasses}>{MOCK_INVERTER_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div><label className="text-xs text-slate-500">Battery</label><select value={quoteData.batteryId ?? ''} onChange={e => setQuoteData(p => ({...p, batteryId: e.target.value || null}))} className={selectClasses}><option value="">None</option>{MOCK_BATTERY_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              </div>
            </div>
            {/* Itemized Pricing */}
            <div className="modal-inner-card p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><DollarSignIcon /> Itemized Pricing</h3>
                <div className="space-y-2">
                    {quoteData.lineItems.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" placeholder="Description" value={item.description} onChange={e => handleLineItemChange(item.id, 'description', e.target.value)} className={`${inputClasses} col-span-5`} />
                            <input type="number" placeholder="Qty" value={item.qty} onChange={e => handleLineItemChange(item.id, 'qty', parseFloat(e.target.value))} className={`${inputClasses} col-span-2 text-center`} />
                            <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value))} className={`${inputClasses} col-span-2 text-right`} />
                            <div className="col-span-2 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">{`$${(item.qty * item.unitPrice).toLocaleString()}`}</div>
                            <button onClick={() => removeLineItem(item.id)} className="p-1 text-slate-400 hover:text-red-500"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                <button onClick={addLineItem} className="mt-2 text-xs font-semibold text-primary flex items-center gap-1"><PlusIcon /> Add Line Item</button>
            </div>
          </div>
          {/* Right: Preview Panel */}
          <div className={`flex-shrink-0 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-slate-900/50 ${mobileTab === 'editor' ? 'hidden md:block' : ''} md:w-1/3 md:border-l border-gray-200/50 dark:border-slate-800/50`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Live Preview</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="customer-view" className="text-xs text-slate-500">Customer View</label>
                <button onClick={() => setViewMode(v => v === 'installer' ? 'customer' : 'installer')} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${viewMode === 'customer' ? 'bg-primary' : 'bg-slate-400'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${viewMode === 'customer' ? 'translate-x-5' : 'translate-x-1'}`}/></button>
              </div>
            </div>
            {/* Totals */}
            <div className="modal-preview-summary p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{`$${calculations.subtotal.toLocaleString()}`}</span></div>
                <div className="flex justify-between"><span>GST (10%)</span><span>{`$${calculations.tax.toLocaleString()}`}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-gray-300 dark:border-slate-700 pt-2 mt-2"><span>Total Price</span><span>{`$${calculations.total.toLocaleString()}`}</span></div>
              </div>
            </div>
            {/* Financial Summary */}
            <div className="modal-inner-card p-4 text-sm">
                <h4 className="font-semibold mb-2">Financial Summary</h4>
                <div className="space-y-1">
                    <div className="flex justify-between"><span>Federal Incentive (est.)</span><span className="text-green-500">{`-$${calculations.federalIncentive.toLocaleString()}`}</span></div>
                    <div className="flex justify-between font-bold"><span>Net Cost (est.)</span><span>{`$${calculations.netCost.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-xs text-slate-500 pt-2 mt-2 border-t border-gray-200 dark:border-slate-700"><span>Price per Watt</span><span>{`$${calculations.pricePerWatt.toFixed(2)} / W`}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>Est. Annual Savings</span><span>{`$${calculations.annualSavings.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>Simple Payback</span><span>{`${calculations.payback.toFixed(1)} years`}</span></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilderModal;
