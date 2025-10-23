/**
 * Client-Side Countdown Timer Utilities
 * 
 * Pure client-side countdown calculations for real-time countdown display.
 * These functions mirror server-side logic in countdown-service.ts but work
 * in browser environment without database dependencies.
 */

import type { CountdownTimer } from '@/types/countdown';

/**
 * Calculate countdown timer state from expiresAt timestamp
 * Client-side version of server-side calculateCountdown function
 * 
 * @param expiresAt - UTC timestamp when lead expires (ISO string or Date)
 * @param leadId - Lead identifier
 * @returns CountdownTimer state or null if no expiry set
 */
export function calculateCountdown(
  expiresAt: string | Date | null,
  leadId: string
): CountdownTimer | null {
  if (!expiresAt) {
    return null;
  }

  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const millisecondsRemaining = expiryDate.getTime() - now.getTime();
  
  const isExpired = millisecondsRemaining <= 0;
  
  // Calculate days and hours
  const totalHoursRemaining = Math.floor(millisecondsRemaining / (1000 * 60 * 60));
  const daysRemaining = Math.floor(totalHoursRemaining / 24);
  const hoursRemaining = totalHoursRemaining % 24;
  
  // Generate display text
  const displayText = getDisplayText(daysRemaining, hoursRemaining, isExpired);
  
  // Get color class based on time remaining
  const colorClass = getColorClass(daysRemaining, isExpired);
  
  // Calculate progress percentage (assumes 7 days default countdown)
  const defaultCountdownDays = 7;
  const progressPercent = isExpired 
    ? 0 
    : Math.max(0, Math.min(100, (daysRemaining / defaultCountdownDays) * 100));

  return {
    leadId,
    expiresAt: expiryDate,
    isExpired,
    daysRemaining: Math.max(0, daysRemaining),
    hoursRemaining: Math.max(0, hoursRemaining),
    millisecondsRemaining: Math.max(0, millisecondsRemaining),
    displayText,
    colorClass,
    progressPercent,
  };
}

/**
 * Get color class based on days remaining
 * 
 * Color coding logic:
 * - Green: 6+ days remaining (safe zone)
 * - Yellow: 3-5 days remaining (warning zone)
 * - Red: 0-2 days remaining (urgent zone)
 * 
 * @param daysRemaining - Number of days until expiry
 * @param isExpired - Whether lead has already expired
 * @returns Color class for styling
 */
function getColorClass(
  daysRemaining: number,
  isExpired: boolean
): 'green' | 'yellow' | 'red' {
  if (isExpired) {
    return 'red';
  }
  
  if (daysRemaining >= 6) {
    return 'green';
  } else if (daysRemaining >= 3) {
    return 'yellow';
  } else {
    return 'red';
  }
}

/**
 * Get human-readable display text
 * 
 * Display formats:
 * - "7 days left" (plural for 2+ days)
 * - "1 day left" (singular)
 * - "< 1 day left" (less than 24 hours)
 * - "Expired" (countdown reached zero)
 * 
 * @param daysRemaining - Number of days until expiry
 * @param hoursRemaining - Number of hours in current day
 * @param isExpired - Whether lead has already expired
 * @returns Display text
 */
function getDisplayText(
  daysRemaining: number,
  hoursRemaining: number,
  isExpired: boolean
): string {
  if (isExpired) {
    return 'Expired';
  }
  
  if (daysRemaining === 0) {
    return '< 1 day left';
  } else if (daysRemaining === 1) {
    return '1 day left';
  } else {
    return `${daysRemaining} days left`;
  }
}

/**
 * Format countdown for accessibility (screen readers)
 * 
 * @param countdown - Countdown timer state
 * @returns Accessible text description
 */
export function getAccessibleText(countdown: CountdownTimer): string {
  if (countdown.isExpired) {
    return 'This lead has expired';
  }
  
  const urgency = countdown.colorClass === 'red' 
    ? 'Urgent: ' 
    : countdown.colorClass === 'yellow' 
      ? 'Warning: ' 
      : '';
  
  return `${urgency}${countdown.displayText}`;
}
