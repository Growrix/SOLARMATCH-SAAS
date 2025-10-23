'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { LiveCountdownBar } from '@/components/LiveCountdownBar';

interface Lead {
  id: string;
  homeowner: {
    name: string;
    email: string;
  };
  status: string;
  visibility: string;
  phoneVerified: boolean;
  quoteType?: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'BIDDING'; // Added for Phase 4.12
  postcode: string;
  location: string;
  energyBill: number;
  leadPrice: number | null;
  createdAt: string;
  approvedAt: string | null;
  expiresAt: string | null; // Countdown timer feature
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [postcodeFilter, setPostcodeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Phase 4.12: Search functionality
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Phase 4.13: Fetch leads on filter/page change
  useEffect(() => {
    if (!mounted) return;
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, statusFilter, verificationFilter, postcodeFilter, page]);

  // Phase 4.13: Auto-refresh every 10 seconds for real-time verification updates
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      fetchLeads();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, statusFilter, verificationFilter, postcodeFilter, page]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (postcodeFilter) params.append('postcode', postcodeFilter);
      params.append('page', page.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/leads?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      
      // Filter by verification if needed (client-side for now)
      let filteredLeads = data.leads || [];
      if (verificationFilter === 'VERIFIED') {
        filteredLeads = filteredLeads.filter((l: Lead) => l.phoneVerified);
      } else if (verificationFilter === 'UNVERIFIED') {
        filteredLeads = filteredLeads.filter((l: Lead) => !l.phoneVerified);
      }
      
      setLeads(filteredLeads);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      PENDING_PHONE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      PENDING_APPROVAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      PURCHASED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  // Phase 4.12: Quote Type helpers
  const getQuoteTypeLabel = (quoteType?: string) => {
    const labels: Record<string, string> = {
      CALL_VISIT: 'Call/Visit',
      WRITTEN_QUOTE: 'Written Quote',
      BIDDING: 'Competitive Bidding',
    };
    return quoteType ? labels[quoteType] || quoteType : '—';
  };

  const getQuoteTypeIcon = (quoteType?: string) => {
    const icons: Record<string, string> = {
      CALL_VISIT: '📞',
      WRITTEN_QUOTE: '📄',
      BIDDING: '🏆',
    };
    return quoteType ? icons[quoteType] || '' : '';
  };

  // Phase 4.12: Client-side search filtering
  const filteredAndSearchedLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.homeowner.name.toLowerCase().includes(query) ||
      lead.homeowner.email.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query)
    );
  });

  // Prevent hydration errors by only rendering after client mount
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Phase 4.12: Back Button + Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lead Management</h1>
          <p className="text-muted-foreground">Review, approve, and manage all lead requests</p>
        </div>

        {/* Phase 4.12: Search Bar */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Leads
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by homeowner name, email, or quote ID..."
                className="w-full px-4 py-2 pl-10 pr-10 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_PHONE">Pending Phone</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="PURCHASED">Purchased</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Verification
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="ALL">All</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="UNVERIFIED">Unverified Only</option>
              </select>
            </div>

            {/* Postcode Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Postcode
              </label>
              <input
                type="text"
                value={postcodeFilter}
                onChange={(e) => setPostcodeFilter(e.target.value)}
                placeholder="e.g., SW1A"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchLeads}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Leads Table */}
        {!loading && filteredAndSearchedLeads.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Homeowner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quote Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Countdown
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Energy Bill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAndSearchedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {lead.homeowner.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {lead.homeowner.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{lead.location}</div>
                        <div className="text-sm text-muted-foreground">{lead.postcode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <span className="text-lg">{getQuoteTypeIcon(lead.quoteType)}</span>
                          <span>{getQuoteTypeLabel(lead.quoteType)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {formatStatus(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.expiresAt && lead.status === 'APPROVED' && (
                          <LiveCountdownBar
                            expiresAt={lead.expiresAt}
                            leadId={lead.id}
                            leadStatus={lead.status}
                            quoteType={lead.quoteType}
                            position="inline"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.phoneVerified ? (
                          <div className="flex items-center gap-1" title="Verified">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1" title="Not Verified">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">Not Verified</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        £{lead.energyBill.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {lead.leadPrice ? `£${lead.leadPrice.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/leads/${lead.id}`);
                          }}
                          className="text-primary hover:text-primary/80"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-input rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-input rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSearchedLeads.length === 0 && (
          <div className="bg-card rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No leads match your search query. Try different keywords.'
                : statusFilter !== 'ALL' || postcodeFilter
                ? 'Try adjusting your filters'
                : 'Leads will appear here when homeowners submit quote requests'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
