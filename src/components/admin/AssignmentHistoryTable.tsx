'use client';

/**
 * AssignmentHistoryTable Component
 * 
 * Purpose: Display and manage lead assignment history for admins
 * Features:
 * - Shows all installers assigned to a lead
 * - Display assignment metadata (date, assigned by, notes)
 * - Status tracking (pending/accepted/removed)
 * - Remove assignment action
 */

import { useState } from 'react';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  installerId: string;
  installerName: string;
  installerEmail: string;
  assignedAt: string;
  assignedByName: string;
  notes: string | null;
  status: 'pending' | 'accepted' | 'removed';
}

interface AssignmentHistoryTableProps {
  assignments: Assignment[];
  leadId: string;
  onRemoveAssignment: (installerId: string) => Promise<void>;
}

export default function AssignmentHistoryTable({
  assignments,
  leadId,
  onRemoveAssignment,
}: AssignmentHistoryTableProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async (installerId: string, installerName: string) => {
    if (!confirm(`Remove assignment from ${installerName}?`)) return;

    setRemovingId(installerId);
    setError(null);

    try {
      await onRemoveAssignment(installerId);
    } catch (err: any) {
      setError(err.message || 'Failed to remove assignment');
    } finally {
      setRemovingId(null);
    }
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
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
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          No assignments yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Click "Assign to Installer" to assign this lead
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Installer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {assignment.installerName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {assignment.installerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {format(new Date(assignment.assignedAt), 'MMM d, yyyy')}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(assignment.assignedAt), 'h:mm a')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {assignment.assignedByName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignment.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      Pending
                    </span>
                  )}
                  {assignment.status === 'accepted' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                      Accepted
                    </span>
                  )}
                  {assignment.status === 'removed' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                      Removed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {assignment.notes ? (
                    <div className="max-w-xs truncate" title={assignment.notes}>
                      {assignment.notes}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {assignment.status === 'pending' && (
                    <button
                      onClick={() => handleRemove(assignment.installerId, assignment.installerName)}
                      disabled={removingId === assignment.installerId}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === assignment.installerId ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                  {assignment.status !== 'pending' && (
                    <span className="text-gray-400 dark:text-gray-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Total Assignments: {assignments.length}
        </span>
        <span>
          Pending: {assignments.filter(a => a.status === 'pending').length} • 
          Accepted: {assignments.filter(a => a.status === 'accepted').length} • 
          Removed: {assignments.filter(a => a.status === 'removed').length}
        </span>
      </div>
    </div>
  );
}
