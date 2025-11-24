import { PrismaClient } from '@prisma/client';
import { log } from '../logger';

const prisma = new PrismaClient();

export interface PurchaseAuditPayload {
  leadId: string;
  installerId: string;
  outcome: string;
  message?: string;
}

export async function recordPurchaseAttempt(payload: PurchaseAuditPayload) {
  try {
    await prisma.purchaseLogEntry.create({
      data: {
        leadId: payload.leadId,
        installerId: payload.installerId,
        outcome: payload.outcome,
        message: payload.message
      }
    });
  } catch (error) {
    // Table may not exist if migration T004 not applied yet
    log({
      event: 'purchase_audit_skip',
      leadId: payload.leadId,
      userId: payload.installerId,
      outcome: payload.outcome,
      error,
      component: 'purchase-log'
    });
  }
}
