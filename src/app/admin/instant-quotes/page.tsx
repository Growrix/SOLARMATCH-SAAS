// ============================================================================
// GUEST INSTANT QUOTES ADMIN PAGE
// ============================================================================
// This page displays all guest instant quote submissions with real-time metrics,
// filtering, and detailed views for admin tracking and follow-up.
// ============================================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SavingsChart from '@/components/SavingsChart';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="16" x2="16" y1="14" y2="18"/>
    <path d="M16 10h.01"/>
    <path d="M12 10h.01"/>
    <path d="M8 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M8 14h.01"/>
    <path d="M12 18h.01"/>
    <path d="M8 18h.01"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" x2="6" y1="6" y2="18"/>
    <line x1="6" x2="18" y1="6" y2="18"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="19" x2="5" y1="12" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface QuoteResult {
  quoteType: 'residential' | 'commercial';
  systemSize: number;
  annualProduction: number;
  annualSavings: number;
  currentAnnualBill: number;
  totalCost: number;
  federalRebate: number;
  batteryRebate: number;
  stateRebate: number;
  finalPrice: number;
  simplePaybackYears: number | null;
  disclaimers: string[];
  // Commercial specific
  demandChargeSavings?: number;
  energySavings?: number;
}

interface GuestInstantQuote {
  id: string;
  sessionId: string;
  quoteType: 'residential' | 'commercial';
  postcode: string;
  location: string;
  state: string;
  electricityUsageType: 'monthly' | 'quarterly';
  electricityValue: number;
  budgetRange: string | null;
  roofType: string | null;
  panelOrientation: string | null;
  roofTilt: string | null;
  shadingLevel: string | null;
  desiredOffset: number;
  usagePattern: string | null;
  batteryIncluded: boolean;
  batteryCapacity: string | null;
  batteryBrand: string | null;
  customBatteryCapacity: string | null;
  backupCritical: string | null;
  batteryUsage: string | null;
  includeVPP: boolean;
  peakDemand: string | null;
  isThreePhase: boolean;
  projectPriority: string | null;
  retailer: string | null;
  tariffPlan: string | null;
  customRetailRate: string | null;
  customFeedInRate: string | null;
  panelBrand: string | null;
  includeOptimizers: boolean;
  includeMicroinverters: boolean;
  includeEVCharging: boolean;
  includeSmartHome: boolean;
  includeGridServices: boolean;
  hasExistingSystem: boolean;
  existingSystemSize: string | null;
  systemSizeOverride: string | null;
  additionalArrays: any | null;
  results: QuoteResult;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  isConverted: boolean;
  conversionDate: string | null;
  adminNotes: string | null;
}

interface Metrics {
  totalQuotes: number;
  byState: Record<string, number>;
  byQuoteType: Record<string, number>;
  conversionRate: number;
  avgSystemSize: number;
  avgFinalPrice: number;
  last24Hours: number;
  last7Days: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GuestInstantQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<GuestInstantQuote[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<GuestInstantQuote | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [quoteTypeFilter, setQuoteTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        mode: 'both',
        ...(stateFilter !== 'all' && { state: stateFilter }),
        ...(quoteTypeFilter !== 'all' && { quoteType: quoteTypeFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        params.append('startDate', startDate.toISOString());
        params.append('endDate', now.toISOString());
      }
      
      const response = await fetch(`/api/admin/instant-quotes?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.status}`);
      }
      
      const data = await response.json();
      setQuotes(data.quotes || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
      setQuotes([]); // Reset to empty array on error
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [stateFilter, quoteTypeFilter, dateRange, searchTerm]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const openDetailsModal = (quote: GuestInstantQuote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedQuote(null);
  };

  const deleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/instant-quotes?id=${quoteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quote');
      }

      // Refresh the quotes list
      await fetchQuotes();
      
      // Close modal if it's open
      if (selectedQuote?.id === quoteId) {
        closeDetailsModal();
      }
    } catch (err) {
      console.error('Error deleting quote:', err);
      alert('Failed to delete quote. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    if (!quotes || quotes.length === 0) return;
    
    const headers = ['Date', 'Type', 'Location', 'State', 'System Size (kW)', 'Final Price', 'Annual Savings', 'Payback (Years)', 'Battery'];
    const rows = quotes.map(q => [
      formatDateTime(q.createdAt),
      q.quoteType,
      q.location,
      q.state,
      q.results.systemSize.toFixed(1),
      q.results.finalPrice.toFixed(0),
      q.results.annualSavings.toFixed(0),
      q.results.simplePaybackYears?.toFixed(1) || 'N/A',
      q.batteryIncluded ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-quotes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 font-medium"
          >
            <ArrowLeftIcon />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <CalculatorIcon />
              Guest Instant Quotes
            </h1>
            <div className="flex gap-2">
              <button
                onClick={fetchQuotes}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshIcon />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                disabled={!quotes || quotes.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors disabled:opacity-50"
              >
                <DownloadIcon />
                Export CSV
              </button>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time tracking of guest instant quote submissions with timestamps
          </p>
        </div>

        {/* Metrics Dashboard */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Quotes</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{metrics.totalQuotes || 0}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Last 24h: {metrics.last24Hours || 0} | 7d: {metrics.last7Days || 0}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg System Size</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {metrics.avgSystemSize ? metrics.avgSystemSize.toFixed(1) : '0.0'} <span className="text-lg">kW</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Avg Final Price</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(metrics.avgFinalPrice || 0)}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 text-sm mb-1">Conversion Rate</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {((metrics.conversionRate || 0) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FilterIcon />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">State</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="all">All States</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="WA">WA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Quote Type</label>
              <select
                value={quoteTypeFilter}
                onChange={(e) => setQuoteTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Postcode or location..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading quotes...</p>
          </div>
        )}

        {/* Quotes Table */}
        {!loading && quotes && quotes.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      System Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Final Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                        {formatDateTime(quote.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          quote.quoteType === 'residential'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                        }`}>
                          {quote.quoteType === 'residential' ? <HomeIcon /> : <BuildingIcon />}
                          {quote.quoteType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                        {quote.location}, {quote.state}
                        <div className="text-xs text-slate-500 dark:text-slate-400">{quote.postcode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {quote.ipAddress || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {quote.results.systemSize.toFixed(1)} kW
                        {quote.batteryIncluded && (
                          <div className="text-xs text-primary">+ Battery</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(quote.results.finalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => openDetailsModal(quote)}
                          className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium"
                        >
                          Quote Details
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && quotes && quotes.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
            <CalculatorIcon />
            <p className="mt-4 text-slate-600 dark:text-slate-400">No quotes found matching your filters</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedQuote && (
        <QuoteDetailsModal
          quote={selectedQuote}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
}

// ============================================================================
// QUOTE DETAILS MODAL
// ============================================================================

interface QuoteDetailsModalProps {
  quote: GuestInstantQuote;
  onClose: () => void;
}

function QuoteDetailsModal({ quote, onClose }: QuoteDetailsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quote Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Meta Information Badge */}
          <div className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-primary/10 dark:from-primary/20 dark:via-blue-900/20 dark:to-primary/20 rounded-xl p-5 border border-primary/20 dark:border-primary/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs font-medium text-primary dark:text-teal-400 mb-1">📅 Submitted</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDateTime(quote.createdAt)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-primary dark:text-teal-400 mb-1">🏷️ Quote Type</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {quote.quoteType}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-primary dark:text-teal-400 mb-1">🌐 IP Address</div>
                <div className="text-xs font-mono text-slate-900 dark:text-white">
                  {quote.ipAddress || 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-primary dark:text-teal-400 mb-1">🔑 Session</div>
                <div className="text-xs font-mono text-slate-900 dark:text-white truncate">
                  {quote.sessionId.slice(0, 12)}...
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1: Property Details - Form Style */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Property Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Postcode Field */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                  📍 Postcode *
                </label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                  {quote.postcode}
                </div>
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                  📍 Location (Suburb) *
                </label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                  {quote.location}
                </div>
              </div>

              {/* State Field */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                  State *
                </label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                  {quote.state === 'NSW' ? 'New South Wales' : 
                   quote.state === 'VIC' ? 'Victoria' : 
                   quote.state === 'QLD' ? 'Queensland' : 
                   quote.state === 'WA' ? 'Western Australia' : 
                   quote.state === 'SA' ? 'South Australia' : 
                   quote.state === 'TAS' ? 'Tasmania' : 
                   quote.state === 'ACT' ? 'Australian Capital Territory' : 
                   quote.state === 'NT' ? 'Northern Territory' : quote.state}
                </div>
              </div>

              {/* Retailer Field */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                  Electricity Retailer
                </label>
                <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                  {quote.retailer || 'Not specified'}
                </div>
              </div>

              {/* Existing System */}
              {quote.hasExistingSystem && (
                <div className="md:col-span-2">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-slate-900 dark:text-white font-semibold">
                        ✅ Has Existing Solar System
                      </p>
                    </div>
                    <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                      Existing System Size
                    </label>
                    <div className="w-full bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                      {quote.existingSystemSize} kW
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: Energy & System Details - Form Style */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Energy & System Details</h3>
            </div>

            {/* Energy Usage Section */}
            <div className="mb-8">
              <h4 className="text-slate-600 dark:text-slate-300 text-sm font-semibold mb-4">
                ⚡ Electricity Usage
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border-2 ${quote.electricityUsageType === 'monthly' ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Usage Type</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                      {quote.electricityUsageType === 'monthly' ? '📅 Monthly Bill' : '📊 Quarterly Bill'}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/10">
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Amount</div>
                    <div className="text-2xl font-bold text-primary">
                      ${quote.electricityValue.toFixed(0)}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Offset Target</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {quote.desiredOffset}%
                    </div>
                  </div>
                </div>
              </div>

              {/* System Size Override */}
              {quote.systemSizeOverride && (
                <div className="mt-4">
                  <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    🔧 Custom System Size Override
                  </label>
                  <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold">
                    {quote.systemSizeOverride} kW
                  </div>
                </div>
              )}
            </div>

            {/* Commercial Specific */}
            {quote.quoteType === 'commercial' && (
              <div className="mb-8 p-5 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h4 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🏢</span> Commercial Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.peakDemand && (
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        Peak Demand (kW)
                      </label>
                      <div className="bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                        {quote.peakDemand} kW
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                      Three Phase Supply
                    </label>
                    <div className={`border-2 rounded-xl px-4 py-3 font-medium text-center ${quote.isThreePhase ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}>
                      {quote.isThreePhase ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                  {quote.projectPriority && (
                    <div className="md:col-span-2">
                      <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        Project Priority
                      </label>
                      <div className="bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                        {quote.projectPriority.replace('_', ' ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Roof Configuration */}
            <div className="mb-8">
              <h4 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">🏠</span> Roof & System Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Panel Orientation *
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                    {quote.panelOrientation}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Roof Type *
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                    {quote.roofType}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Roof Tilt
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                    {quote.roofTilt}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                    Shading Level
                  </label>
                  <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                    {quote.shadingLevel}
                  </div>
              </div>
                {quote.usagePattern && (
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                      Usage Pattern
                    </label>
                    <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                      {quote.usagePattern}
                    </div>
                  </div>
                )}
                {quote.budgetRange && (
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                      Budget Range *
                    </label>
                    <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                      {quote.budgetRange}
                    </div>
                  </div>
                )}
                {quote.tariffPlan && (
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                      Tariff Plan
                    </label>
                    <div className="w-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                      {quote.tariffPlan}
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced System Options */}
              {(quote.panelBrand || quote.includeOptimizers || quote.includeMicroinverters) && (
                <div className="mt-6 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    🔧 Advanced System Options
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quote.panelBrand && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Panel Brand
                        </label>
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                          {quote.panelBrand}
                        </div>
                      </div>
                    )}
                    {quote.includeOptimizers && (
                      <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="text-green-600 dark:text-green-400 font-medium">✅ Panel Optimizers Included</span>
                      </div>
                    )}
                    {quote.includeMicroinverters && (
                      <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="text-green-600 dark:text-green-400 font-medium">✅ Microinverters Included</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Electricity Plan Details */}
              {(quote.customRetailRate || quote.customFeedInRate) && (
                <div className="mt-6">
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="text-xl">💰</span> Electricity Tariff Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quote.customRetailRate && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Custom Retail Rate
                        </label>
                        <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                          {quote.customRetailRate}¢/kWh
                        </div>
                      </div>
                    )}
                    {quote.customFeedInRate && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Custom Feed-In Rate
                        </label>
                        <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-green-300 dark:border-green-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium">
                          {quote.customFeedInRate}¢/kWh
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Battery Configuration */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🔋</span> Battery Storage Options
              </h3>
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${quote.batteryIncluded ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-300 dark:border-slate-700'}`}>
                {quote.batteryIncluded ? '✅ Included' : '❌ Not Included'}
              </div>
            </div>

            {quote.batteryIncluded ? (
              <div className="space-y-6">
                <div className="p-5 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quote.batteryCapacity && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Battery Capacity
                        </label>
                        <div className="bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold text-lg">
                          {quote.batteryCapacity} kWh
                        </div>
                      </div>
                    )}
                    {quote.batteryBrand && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Battery Brand
                        </label>
                        <div className="bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                          {quote.batteryBrand}
                        </div>
                      </div>
                    )}
                    {quote.customBatteryCapacity && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Custom Battery Capacity
                        </label>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold">
                          {quote.customBatteryCapacity} kWh
                        </div>
                      </div>
                    )}
                    {quote.backupCritical && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Backup Priority
                        </label>
                        <div className="bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                          {quote.backupCritical.replace('-', ' ')}
                        </div>
                      </div>
                    )}
                    {quote.batteryUsage && (
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                          Battery Usage
                        </label>
                        <div className="bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium capitalize">
                          {quote.batteryUsage.replace('-', ' ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 text-sm font-semibold mb-2">
                        VPP Participation
                      </label>
                      <div className={`border-2 rounded-xl px-4 py-3 font-bold text-center ${quote.includeVPP ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}>
                        {quote.includeVPP ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-lg">No battery storage requested</p>
              </div>
            )}
          </div>

          {/* Smart Features */}
          {(quote.includeEVCharging || quote.includeSmartHome || quote.includeGridServices || quote.includeOptimizers || quote.includeMicroinverters) && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">✨</span> Additional Smart Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quote.includeEVCharging && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚗</span>
                      <div>
                        <div className="font-bold text-green-700 dark:text-green-400">EV Charging</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Electric Vehicle Ready</div>
                      </div>
                    </div>
                  </div>
                )}
                {quote.includeSmartHome && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🏠</span>
                      <div>
                        <div className="font-bold text-blue-700 dark:text-blue-400">Smart Home Integration</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Home Automation Ready</div>
                      </div>
                    </div>
                  </div>
                )}
                {quote.includeGridServices && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <div className="font-bold text-purple-700 dark:text-purple-400">Grid Services</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Grid Integration</div>
                      </div>
                    </div>
                  </div>
                )}
                {quote.includeOptimizers && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📊</span>
                      <div>
                        <div className="font-bold text-orange-700 dark:text-orange-400">Panel Optimizers</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Maximum Efficiency</div>
                      </div>
                    </div>
                  </div>
                )}
                {quote.includeMicroinverters && (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🔌</span>
                      <div>
                        <div className="font-bold text-indigo-700 dark:text-indigo-400">Microinverters</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Panel-Level Monitoring</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Roof Arrays */}
          {quote.additionalArrays && Array.isArray(quote.additionalArrays) && quote.additionalArrays.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📐</span> Additional Roof Arrays
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-300 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  Complex roof layout with {quote.additionalArrays.length} additional array(s):
                </p>
                <pre className="text-xs bg-white dark:bg-slate-800 p-4 rounded-lg overflow-auto border border-slate-200 dark:border-slate-700 font-mono">
                  {JSON.stringify(quote.additionalArrays, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Quote Results - Matching Guest Experience */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Your Solar Quote Results
            </h3>

            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/20 rounded-2xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Estimated System Cost</div>
                <div className="text-5xl font-bold text-primary mb-1">
                  {formatCurrency(quote.results.finalPrice)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  After ${quote.results.federalRebate.toLocaleString()} in rebates
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {quote.results.systemSize.toFixed(1)} kW
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">System Size</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {formatCurrency(quote.results.annualSavings)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Annual Savings</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {quote.results.simplePaybackYears ? `${quote.results.simplePaybackYears.toFixed(1)} yrs` : 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Payback Period</div>
                </div>
              </div>
            </div>

            {/* System Specifications */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                System Specifications
              </h4>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">System Size</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {quote.results.systemSize.toFixed(2)} kW
                    </div>
                  </div>
                  {quote.results.panelCount && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Number of Panels</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {quote.results.panelCount}
                      </div>
                    </div>
                  )}
                  {quote.results.inverterSize && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Inverter Size</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {quote.results.inverterSize.toFixed(1)} kW
                      </div>
                    </div>
                  )}
                  {quote.batteryIncluded && quote.batteryCapacity && (
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Battery Storage</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {quote.batteryCapacity} kWh
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Warranty</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      25 Years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Installation</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      Professional
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Performance */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">🌞</span>
                Energy Performance
              </h4>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Annual Generation</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {quote.results.annualProduction.toLocaleString()} kWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Daily Average</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {(quote.results.annualProduction / 365).toFixed(1)} kWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">CO₂ Reduction</div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {((quote.results.annualProduction * 0.82) / 1000).toFixed(1)} tonnes/year
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">25-Year Savings</div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(quote.results.annualSavings * 25)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Projections Chart */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Financial Projections
              </h4>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <SavingsChart
                  finalPrice={quote.results.finalPrice}
                  annualSavings={quote.results.annualSavings}
                  currentAnnualBill={quote.results.currentAnnualBill || quote.electricityValue * 12}
                />
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">💰</span>
                Cost Breakdown
              </h4>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300">Total System Cost</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(quote.results.totalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300">Federal Rebate (STC)</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      -{formatCurrency(quote.results.federalRebate)}
                    </span>
                  </div>
                  {quote.results.stateRebate > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-700 dark:text-slate-300">State Rebate</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        -{formatCurrency(quote.results.stateRebate)}
                      </span>
                    </div>
                  )}
                  {quote.results.batteryRebate > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-700 dark:text-slate-300">Battery Rebate</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        -{formatCurrency(quote.results.batteryRebate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">Final Price</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(quote.results.finalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 text-sm text-slate-600 dark:text-slate-400">
              <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Important Notes:</h5>
              <ul className="space-y-2 list-disc list-inside">
                <li>This is an indicative quote only. Final pricing subject to site inspection.</li>
                <li>Rebates shown are current estimates and may vary based on eligibility.</li>
                <li>Savings calculations based on current electricity rates and consumption patterns.</li>
                <li>Installation timeframes typically 4-8 weeks from contract signing.</li>
                <li>All systems include professional installation and CEC-approved components.</li>
              </ul>
            </div>
          </div>

          {/* User Agent (for debugging) */}
          {quote.userAgent && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Technical Details</h3>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 p-3 rounded">
                {quote.userAgent}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
