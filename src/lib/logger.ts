import type { PurchaseAttemptResult } from '@/types/lead';

/**
 * Minimal structured logger wrapper.
 * Replace/extend with full observability stack later.
 */
export interface LogContext {
  component?: string;
  userId?: string;
  leadId?: string;
  event: string;
  durationMs?: number;
  outcome?: string;
  error?: unknown;
}

export function log(ctx: LogContext) {
  const entry = {
    ts: new Date().toISOString(),
    level: ctx.error ? 'error' : 'info',
    ...ctx,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export function logPurchase(result: PurchaseAttemptResult, leadId: string, installerId?: string) {
  log({
    event: 'purchase_attempt',
    leadId,
    userId: installerId,
    outcome: result.outcome,
    component: 'purchase-service'
  });
}
