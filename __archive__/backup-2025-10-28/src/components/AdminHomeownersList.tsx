'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// --- Icon Components ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const LoaderIcon = () => <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface Homeowner {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  postcode: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  phoneVerified: boolean;
  leadSubmissionCount: number;
  leadSubmissionLimit: number;
  remainingLeadAllowance: number;
}

interface ApiResponse {
  total: number;
  page: number;
  pageSize: number;
  items: Homeowner[];
}

interface FilterState {
  q: string;
  postcode: string;
  status: string;
  from: string;
  to: string;
  quota: string;
}

export default function AdminHomeownersList() {
  const [homeowners, setHomeowners] = useState<Homeowner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    postcode: '',
    status: '',
    from: '',
    to: '',
    quota: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch homeowners
  const fetchHomeowners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (debouncedSearch) params.append('q', debouncedSearch);
      if (filters.postcode) params.append('postcode', filters.postcode);
      if (filters.status) params.append('status', filters.status);
      if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.quota) params.append('quota', filters.quota);
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/admin/homeowners?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have permission to view this data');
        }
        throw new Error(`Failed to load homeowners: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setHomeowners(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load homeowners');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters, page, pageSize]);

  useEffect(() => {
    fetchHomeowners();
  }, [fetchHomeowners]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const toggleQuotaFilter = (value: string) => {
    setFilters(prev => ({ ...prev, quota: prev.quota === value ? '' : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ q: '', postcode: '', status: '', from: '', to: '', quota: '' });
    setPage(1);
  };

  const hasActiveFilters =
    searchInput ||
    filters.postcode ||
    filters.status ||
    filters.from ||
    filters.to ||
    filters.quota;

  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const quotaChipOptions = [
    { value: 'available', label: 'Has Remaining Quota' },
    { value: 'exhausted', label: 'At Limit' },
  ];

  const handleEditClick = (homeowner: Homeowner) => {
    setEditingId(homeowner.id);
    setEditValue(homeowner.leadSubmissionLimit);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const handleSaveEdit = async (homeownerId: string) => {
    if (editValue <= 0 || !Number.isFinite(editValue)) {
      alert('Quote limit must be a positive number');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/homeowners/${homeownerId}/lead-limit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteLimit: editValue, notify: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quote limit');
      }

      // Refresh the list
      await fetchHomeowners();
      setEditingId(null);
      setEditValue(0);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quote limit');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Button Only */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div></div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <FilterIcon />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by name, email, phone, or postcode..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Quota Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Quota:</span>
        {quotaChipOptions.map((option) => {
          const isActive = filters.quota === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleQuotaFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
        {filters.quota && (
          <button
            type="button"
            onClick={() => toggleQuotaFilter(filters.quota)}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Postcode Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Postcode
              </label>
              <input
                type="text"
                value={filters.postcode}
                onChange={(e) => handleFilterChange('postcode', e.target.value)}
                placeholder="e.g. SW1A"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Registered From
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Registered To
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <XIcon />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoaderIcon />
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading homeowners...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && homeowners.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="text-slate-400 dark:text-slate-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No homeowners found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {hasActiveFilters ? 'Try adjusting your search or filters' : 'No homeowners have registered yet'}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && homeowners.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Homeowner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Postcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lead Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {homeowners.map((homeowner) => (
                  <tr key={homeowner.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={homeowner.image || 'https://picsum.photos/seed/default-avatar/200'}
                            alt={homeowner.name || 'User'}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {homeowner.name || 'No name'}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {homeowner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900 dark:text-white">
                          {homeowner.phone || 'No phone'}
                        </span>
                        {homeowner.phone && (
                          <span className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                            homeowner.phoneVerified
                              ? 'text-green-600 dark:text-green-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <span className={`inline-block h-2 w-2 rounded-full ${
                              homeowner.phoneVerified ? 'bg-green-500' : 'bg-slate-400'
                            }`}></span>
                            {homeowner.phoneVerified ? 'Verified' : 'Unverified'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {homeowner.postcode || 'Not set'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        homeowner.isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {homeowner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {homeowner.leadSubmissionCount}/
                          {editingId === homeowner.id ? (
                            <input
                              type="number"
                              min="1"
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              className="w-16 px-2 py-1 text-sm border border-blue-500 rounded focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-blue-400"
                              disabled={updating}
                            />
                          ) : (
                            homeowner.leadSubmissionLimit
                          )}
                        </span>
                        {editingId === homeowner.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveEdit(homeowner.id)}
                              disabled={updating}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {updating ? '...' : '✓'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={updating}
                              className="px-2 py-1 text-xs bg-slate-500 text-white rounded hover:bg-slate-600 disabled:opacity-50"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(homeowner)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        homeowner.remainingLeadAllowance > 0
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {homeowner.remainingLeadAllowance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(homeowner.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
            {homeowners.map((homeowner) => (
              <div key={homeowner.id} className="p-4">
                <div className="flex items-center mb-3">
                  <Image
                    src={homeowner.image || 'https://picsum.photos/seed/default-avatar/200'}
                    alt={homeowner.name || 'User'}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {homeowner.name || 'No name'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {homeowner.email}
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    homeowner.isActive
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {homeowner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                    <div className="text-slate-900 dark:text-white">{homeowner.phone || 'No phone'}</div>
                    {homeowner.phone && (
                      <div className={`text-xs font-medium ${
                        homeowner.phoneVerified
                          ? 'text-green-600 dark:text-green-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {homeowner.phoneVerified ? 'Verified' : 'Unverified'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Postcode:</span>
                    <div className="text-slate-900 dark:text-white">{homeowner.postcode || 'Not set'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Lead Usage:</span>
                    <div className="text-slate-900 dark:text-white">
                      {homeowner.leadSubmissionCount}/{homeowner.leadSubmissionLimit}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Remaining:</span>
                    <div className="text-slate-900 dark:text-white">{homeowner.remainingLeadAllowance}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 dark:text-slate-400">Registered:</span>
                    <div className="text-slate-900 dark:text-white">{formatDate(homeowner.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && homeowners.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-slate-600 dark:text-slate-400">per page</span>
            </div>

            {/* Page Info */}
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (page <= 3) {
                    pageNumber = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        page === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
