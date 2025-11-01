'use client';

import React, { useState, useEffect } from 'react';

// -------------------------
// Improved Rebate Calculator (React)
// - Implements clearer STC (SRES) calc using postcode->zone multiplier
// - Calculates federal battery rebate using usable kWh & configurable cap/per-kWh value
// - Includes state program lookup and eligibility checks with clear messages
// - Adds hooks/placeholders for live data (STC price, zone map, state programs, feed-in rates)
// - Displays explicit messages when no rebate is available
// - Client-side only: replace placeholder fetch* functions with server endpoints for production
// -------------------------

// --- Icon components (kept small) ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const Calculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Battery = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><rect width="16" height="10" x="4" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>;
const Info = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>;
const SlidersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="8" y2="8" /><line x1="17" x2="23" y1="16" y2="16" /></svg>;

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

// ---------------------------
// Defaults & helpers
// ---------------------------

const DEFAULT_STC_ZONES: Record<string, number> = { '1': 1.622, '2': 1.536, '3': 1.382, '4': 1.185 };

const postcodeToState = (postcode: string) => {
  if (!postcode || postcode.length !== 4) return 'DEFAULT';
  if (postcode.startsWith('02')) return 'NSW';
  if (postcode.startsWith('08')) return 'NT';
  const first = postcode.charAt(0);
  const map: Record<string, string> = { '2': 'NSW', '3': 'VIC', '4': 'QLD', '5': 'SA', '6': 'WA', '7': 'TAS', '0': 'NT' };
  const n = parseInt(postcode, 10);
  if ((n >= 2600 && n <= 2618) || (n >= 2900 && n <= 2920)) return 'ACT';
  return map[first] || 'DEFAULT';
};

const getZoneByPostcode = (postcode: string) => {
  const n = parseInt(postcode || '0', 10);
  if (n >= 800 && n <= 999) return '1';
  if (n >= 4800 && n <= 4899) return '1';
  if ((n >= 4000 && n <= 4999) || (n >= 6000 && n <= 6797)) return '2';
  if ((n >= 3000 && n <= 3999) || (n >= 7000 && n <= 7999)) return '4';
  return '3';
};

const STATE_PROGRAMS: any = {
  VIC: {
    solar: { enabled: true, type: 'flat', amount: 1400, note: 'Solar Victoria rebate up to $1,400 for eligible owner-occupiers.' },
    battery: { enabled: false, amount: 0, note: 'Battery rebates handled by federal program (if eligible).' }
  },
  NSW: {
    solar: { enabled: false, amount: 0, note: 'No general panel rebate (check NSW programs for targeted schemes).' },
    battery: { enabled: true, amount: 2000, note: 'Peak Demand Reduction Scheme: typical battery subsidy range; eligibility rules apply.' }
  },
  ACT: {
    solar: { enabled: true, type: 'means-tested', amount: 2500, note: 'Home Energy Support — targeted to concession card holders (up to $2,500).' },
    battery: { enabled: false, amount: 0, note: '' }
  },
  WA: {
    solar: { enabled: false, amount: 0, note: 'No general solar panel rebate currently' },
    battery: { enabled: true, amount: 1300, note: 'WA battery subsidy example (SWIS regions) — check regional amounts.' }
  },
  DEFAULT: { solar: { enabled: false, amount: 0, note: 'No state rebate on file.' }, battery: { enabled: false, amount: 0, note: '' } }
};

async function fetchSTCPrice(): Promise<number> {
  return 40;
}

async function fetchStatePrograms(): Promise<any> {
  return STATE_PROGRAMS;
}

// ---------------------------
// Component
// ---------------------------

interface Props { 
  onGetQuotesClick?: () => void;
}

const RebateCalculatorForm: React.FC<Props> = ({ onGetQuotesClick }) => {
  const currentYear = new Date().getFullYear();

  const [inputs, setInputs] = useState({
    systemSizeKw: 6.6,
    postcode: '',
    installationYear: currentYear,
    ownerOccupier: true,
    householdIncome: 80000,
    propertyValue: 600000,
    includeBattery: false,
    batterySizeKwh: 10,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [stcPrice, setStcPrice] = useState<number | null>(null);
  const [programs, setPrograms] = useState<any | null>(null);
  const [result, setResult] = useState<any|null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSTCPrice().then(p => setStcPrice(p)).catch(() => setStcPrice(40));
    fetchStatePrograms().then(r => setPrograms(r)).catch(() => setPrograms(STATE_PROGRAMS));
  }, []);
  
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowModal(false);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const baseInputClasses = "w-full bg-gray-100 dark:bg-slate-900 backdrop-blur-sm border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  const validatePostcode = (pc: string) => {
    if (!pc) return 'Postcode is required.';
    if (!/^\d{4}$/.test(pc)) return 'Postcode must be a 4-digit number.';

    const code = parseInt(pc, 10);
    const validRanges = [
      [800, 999],   // NT
      [1000, 2999], // NSW & ACT
      [3000, 3999], // VIC
      [4000, 4999], // QLD
      [5000, 5999], // SA
      [6000, 6999], // WA
      [7000, 7999], // TAS
    ];

    const isValid = validRanges.some(([min, max]) => code >= min && code <= max);
    
    if (!isValid) {
        if (pc.startsWith('0') && !pc.startsWith('08') && !pc.startsWith('09')) {
            return 'Invalid format. Only NT postcodes (08xx) start with 0.';
        }
        return `Postcode ${pc} seems to be outside the standard Australian ranges. Please check and re-enter.`;
    }
    
    return '';
  };

  function handleInput<K extends keyof typeof inputs>(key: K, val: typeof inputs[K]) {
    setInputs(prev => ({ ...prev, [key]: val }));
    if (errors[key as string]) setErrors(prev => ({ ...prev, [key as string]: '' }));
  }

  async function handleCalculate() {
    const postcodeErr = validatePostcode(inputs.postcode);
    if (postcodeErr) { 
      setErrors({ postcode: postcodeErr }); 
      return; 
    }

    setIsCalculating(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const stcUnitPrice = stcPrice ?? await fetchSTCPrice();
      const statePrograms = programs ?? await fetchStatePrograms();

      const deemingYears = Math.max(0, 2030 - inputs.installationYear + 1);
      const zoneKey = getZoneByPostcode(inputs.postcode);
      const zoneMultiplier = DEFAULT_STC_ZONES[zoneKey] ?? DEFAULT_STC_ZONES['3'];
      const numSTCs = Math.floor(inputs.systemSizeKw * zoneMultiplier * deemingYears);
      const federalSTCValue = Math.round(numSTCs * stcUnitPrice);

      const FEDERAL_BATTERY_REBATE_PER_USABLE_KWH = 372;
      let federalBatteryRebate = 0;
      if (inputs.includeBattery && inputs.installationYear >= 2025) {
        const usable = Math.max(0, inputs.batterySizeKwh * 0.9);
        federalBatteryRebate = Math.round(usable * FEDERAL_BATTERY_REBATE_PER_USABLE_KWH);
      }

      const state = postcodeToState(inputs.postcode);
      const stateProgram = (statePrograms && statePrograms[state]) ? statePrograms[state] : statePrograms['DEFAULT'];
      let stateSolar = 0; 
      let stateBattery = 0;
      let stateSolarNote = stateProgram.solar.note || '';
      let stateBatteryNote = stateProgram.battery.note || '';

      if (stateProgram.solar && stateProgram.solar.enabled) {
        const eligible = (() => {
          if (state === 'VIC') return inputs.ownerOccupier && inputs.householdIncome < 180000 && inputs.propertyValue < 3000000;
          if (state === 'ACT') return inputs.householdIncome < 75000;
          return true;
        })();
        if (eligible) {
          stateSolar = stateProgram.solar.amount || 0;
        } else {
          stateSolarNote = 'Not eligible for state solar rebate based on entered details.';
        }
      }

      if (stateProgram.battery && stateProgram.battery.enabled) {
        const eligibleB = (() => {
          if (!inputs.includeBattery) return false;
          if (state === 'NSW') return inputs.installationYear >= 2024;
          if (state === 'WA') return inputs.installationYear >= 2025;
          return true;
        })();
        if (eligibleB) stateBattery = stateProgram.battery.amount || 0; 
        else stateBatteryNote = 'Not eligible for state battery rebate based on entered details.';
      }

      const totalRebate = Math.max(0, federalSTCValue + federalBatteryRebate + stateSolar + stateBattery);
      const batteryTotal = federalBatteryRebate + stateBattery;

      setResult({
        totalRebate,
        federalSTCValue,
        stateSolar,
        batteryTotal,
        numSTCs,
        eligibilityNotes: { 
          stateSolar: stateSolarNote, 
          stateBattery: stateBatteryNote, 
          federalBattery: inputs.includeBattery ? 'Federal battery rebate may apply for eligible systems installed from 2025.' : 'No federal battery rebate because battery not selected.' 
        },
        disclaimers: [
          `STC estimate uses a unit price of $${stcUnitPrice}/STC. Market price may vary.`,
          'State programs and eligibility rules change — always check official state websites for final rules.',
          'All rebates shown are estimates. A certified installer will confirm actual rebate amounts.'
        ]
      });

      setShowModal(true);

    } catch (err) {
      console.error('Rebate calc error', err);
      setErrors({ general: 'Failed to compute rebates — please try again.' });
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="theme-card p-6 sm:p-8 shadow-xl">
        <div className="space-y-10">
            <fieldset>
            <legend className="text-xl font-bold text-slate-900 dark:text-white mb-6">Location & System</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                <label htmlFor="postcode" className="flex items-center text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    <MapPin />
                    <span>Postcode *</span>
                </label>
                <input 
                    id="postcode"
                    type="text"
                    className={`${baseInputClasses} ${errors.postcode ? 'border-destructive ring-red-500' : 'focus:border-primary focus:ring-primary'}`}
                    value={inputs.postcode} 
                    onChange={(e) => handleInput('postcode', e.target.value)} 
                    onBlur={(e) => setErrors({ ...errors, postcode: validatePostcode(e.target.value) })} 
                    placeholder="e.g., 2000, 3000, 4000" 
                    maxLength={4}
                    aria-required="true"
                    aria-describedby={errors.postcode ? 'postcode-error' : 'postcode-help'}
                />
                {!errors.postcode && (
                    <p id="postcode-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    {inputs.postcode && inputs.postcode.length === 4 ? `📍 ${postcodeToState(inputs.postcode)} - STC Zone ${getZoneByPostcode(inputs.postcode)}` : 'Determines STC zone and state rebates'}
                    </p>
                )}
                {errors.postcode && <p id="postcode-error" className="text-destructive text-xs mt-1.5" role="alert">{errors.postcode}</p>}
                </div>

                <div className="flex flex-col justify-end">
                    <label className="flex items-center text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        <span>Include Battery Storage</span>
                    </label>
                    <div className={`flex items-center justify-between rounded-xl p-3 transition-colors duration-300 bg-gray-100 dark:bg-slate-900 border ${inputs.includeBattery ? 'border-primary/50' : 'border-border dark:border-slate-700'}`}>
                        <p className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                        {inputs.includeBattery ? 'Battery Included' : 'Solar Only'}
                        </p>
                        <button 
                        type="button"
                        onClick={() => handleInput('includeBattery', !inputs.includeBattery)} 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${inputs.includeBattery ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                        aria-pressed={inputs.includeBattery}
                        aria-label={`${inputs.includeBattery ? 'Disable' : 'Enable'} battery storage`}
                        >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${inputs.includeBattery ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    System Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <div>
                    <label htmlFor="systemSize" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        System Size (kW) *
                    </label>
                    <select 
                        id="systemSize"
                        value={inputs.systemSizeKw} 
                        onChange={(e) => handleInput('systemSizeKw', parseFloat(e.target.value))} 
                        className={`${baseInputClasses} font-medium`}
                    >
                        {[3, 4, 5, 6, 6.6, 7, 8, 9, 10, 11, 12, 13.2, 15, 20].map(s => (
                        <option key={s} value={s}>
                            {s} kW{s === 6.6 ? ' (most popular)' : ''}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label htmlFor="batterySize" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        Battery Size (kWh)
                    </label>
                    <input 
                        id="batterySize"
                        className={`${baseInputClasses} ${!inputs.includeBattery ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="number" 
                        value={inputs.batterySizeKwh} 
                        onChange={(e) => handleInput('batterySizeKwh', Math.max(0, parseFloat(e.target.value || '0')))} 
                        disabled={!inputs.includeBattery}
                        min="0" max="100" step="0.5"
                        placeholder="e.g., 13.5"
                    />
                    </div>
                </div>
            </div>
            </fieldset>

            <fieldset className="pt-6">
            <legend className="text-xl font-bold text-slate-900 dark:text-white mb-6">Eligibility Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                <label htmlFor="installationYear" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Planned Installation Year *
                </label>
                <select 
                    id="installationYear"
                    className={`${baseInputClasses} font-medium`}
                    value={inputs.installationYear} 
                    onChange={(e) => handleInput('installationYear', parseInt(e.target.value || `${currentYear}`))}
                >
                    {[...Array(6)].map((_, i) => (
                    <option key={i} value={currentYear + i}>
                        {currentYear + i}{i === 0 ? ' (This year)' : ''}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label htmlFor="propertyStatus" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Property Status *
                </label>
                <select 
                    id="propertyStatus"
                    className={`${baseInputClasses} font-medium`}
                    value={inputs.ownerOccupier ? 'owner' : 'renter'} 
                    onChange={(e) => handleInput('ownerOccupier', e.target.value === 'owner')}
                >
                    <option value="owner">Owner-occupier</option>
                    <option value="renter">Investor / Landlord</option>
                </select>
                </div>

                <div>
                <label htmlFor="householdIncome" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Combined Household Income *
                </label>
                <select 
                    id="householdIncome"
                    className={`${baseInputClasses} font-medium`}
                    value={inputs.householdIncome} 
                    onChange={(e) => handleInput('householdIncome', parseInt(e.target.value || '0'))}
                >
                    <option value={40000}>Under $75,000</option>
                    <option value={80000}>$75k - $180k</option>
                    <option value={200000}>Over $180k</option>
                </select>
                </div>

                <div>
                <label htmlFor="propertyValue" className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Property Value (Victoria only) *
                </label>
                <select 
                    id="propertyValue"
                    className={`${baseInputClasses} font-medium`}
                    value={inputs.propertyValue} 
                    onChange={(e) => handleInput('propertyValue', parseInt(e.target.value || '0'))}
                >
                    <option value={600000}>Under $3M</option>
                    <option value={3500000}>Over $3M</option>
                </select>
                </div>
            </div>
            </fieldset>
        </div>

        {errors.general && (
          <div className="mt-6 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="relative mt-10">
          <button 
            disabled={isCalculating || !inputs.postcode} 
            onClick={handleCalculate} 
            className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isCalculating ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Calculating...</span></>
            ) : (
              'Calculate My Rebates'
            )}
          </button>
        </div>
      </div>

      {showModal && result && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 animate-fade-in" onClick={() => setShowModal(false)}>
                <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-slate-800/50 shadow-2xl animate-slide-in-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Rebate Estimate</h2><button onClick={() => setShowModal(false)} className="p-2 -mr-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" aria-label="Close"><XIcon /></button></div>
                    
                    <div className="space-y-6">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 text-center"><h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Rebate</h3><p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalRebate)}</p></div>
                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20 text-center"><h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Federal Rebate (STC)</h3><p className="text-3xl font-bold text-emerald-600 mt-1">{formatCurrency(result.federalSTCValue)}</p></div>
                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border border-blue-500/20 text-center"><h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">State & Battery</h3><p className="text-3xl font-bold text-info mt-1">{formatCurrency(result.stateSolar + result.batteryTotal)}</p></div>
                        </div>

                        {/* Eligibility Notes */}
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"><h5 className="font-semibold text-slate-900 dark:text-white mb-3">Eligibility Summary</h5><div className="space-y-2 text-sm"><p className="text-slate-600 dark:text-slate-400"><strong>Solar Rebate:</strong> {result.eligibilityNotes.stateSolar}</p>{inputs.includeBattery && <p className="text-slate-600 dark:text-slate-400"><strong>Battery Rebate:</strong> {result.eligibilityNotes.stateBattery}</p>}</div></div>

                        {/* Disclaimers */}
                        <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30"><h5 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-3">Important Information</h5><ul className="space-y-2 list-disc list-inside text-sm text-yellow-700 dark:text-yellow-200">{result.disclaimers.map((d: string, i: number) => (<li key={i}>{d}</li>))}</ul></div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button onClick={() => { setShowModal(false); onGetQuotesClick && onGetQuotesClick(); }} className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl text-base font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">Get Installer Quotes →</button>
                            <button onClick={() => setShowModal(false)} className="w-full sm:w-auto bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default RebateCalculatorForm;