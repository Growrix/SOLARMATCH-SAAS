'use client';

/**
 * CountdownTimer Component
 * 
 * Displays a visual countdown timer for leads with expiry dates.
 * Features:
 * - Auto-updates every 10 seconds
 * - Color-coded progress bar (green/yellow/red)
 * - Responsive design with dark mode support
 * - Accessible with ARIA labels
 */

import { useEffect, useState } from 'react';
import { calculateCountdown, getAccessibleText } from '@/lib/utils/countdown-client';
import type { CountdownTimer as CountdownTimerType } from '@/types/countdown';

interface CountdownTimerProps {
  /** UTC timestamp when lead expires (ISO string) */
  expiresAt: string | null;
  
  /** Lead identifier */
  leadId: string;
  
  /** Optional: Lead status (for conditional display logic) */
  leadStatus?: string;
  
  /** Optional: Quote type (for conditional display logic) */
  quoteType?: string;
  
  /** Optional: Compact mode for smaller displays */
  compact?: boolean;
}

/**
 * CountdownTimer Component
 * 
 * Renders a visual countdown timer with color-coded progress bar.
 * Auto-refreshes every 10 seconds to keep display accurate.
 */
export function CountdownTimer({
  expiresAt,
  leadId,
  leadStatus,
  quoteType,
  compact = false,
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState<CountdownTimerType | null>(null);

  // Calculate countdown on mount and set up refresh interval
  useEffect(() => {
    if (!expiresAt) {
      setCountdown(null);
      return;
    }

    // Initial calculation
    const updateCountdown = () => {
      const newCountdown = calculateCountdown(expiresAt, leadId);
      setCountdown(newCountdown);
    };

    updateCountdown();

    // Refresh every 10 seconds
    const interval = setInterval(updateCountdown, 10000);

    return () => clearInterval(interval);
  }, [expiresAt, leadId]);

  // Hide countdown if no expiresAt set
  if (!expiresAt || !countdown) {
    return null;
  }

  // Hide countdown for purchased CALL_VISIT/WRITTEN_QUOTE leads
  // (BIDDING leads keep countdown visible)
  if (leadStatus === 'PURCHASED' && quoteType !== 'BIDDING') {
    return null;
  }

  // Color mapping for Tailwind classes
  const colorClasses = {
    green: {
      bg: 'bg-green-500 dark:bg-green-600',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    yellow: {
      bg: 'bg-yellow-500 dark:bg-yellow-600',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    red: {
      bg: 'bg-red-500 dark:bg-red-600',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
  };

  const colors = colorClasses[countdown.colorClass];
  const accessibleText = getAccessibleText(countdown);

  if (compact) {
    // Compact mode: Just text with color indicator
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-sm ${colors.text}`}
        role="status"
        aria-label={accessibleText}
      >
        <span className={`h-2 w-2 rounded-full ${colors.bg}`} aria-hidden="true" />
        <span className="font-medium">{countdown.displayText}</span>
      </div>
    );
  }

  // Full mode: Progress bar with text
  return (
    <div
      className={`rounded-lg border ${colors.border} bg-white dark:bg-gray-800 p-3`}
      role="status"
      aria-label={accessibleText}
    >
      {/* Text display */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${colors.text}`}>
          {countdown.displayText}
        </span>
        {countdown.isExpired && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Lead expired
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colors.bg} transition-all duration-300 ease-in-out`}
          style={{ width: `${countdown.progressPercent}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Additional info for non-expired countdowns */}
      {!countdown.isExpired && countdown.daysRemaining <= 2 && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {countdown.hoursRemaining > 0 && (
            <>Approximately {countdown.hoursRemaining} hours remaining</>
          )}
        </p>
      )}
    </div>
  );
}

/**
 * Compact CountdownTimer variant
 * Convenience wrapper for compact mode
 */
export function CountdownTimerCompact(props: Omit<CountdownTimerProps, 'compact'>) {
  return <CountdownTimer {...props} compact={true} />;
}
