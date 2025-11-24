import { PrismaClient, LeadStatus } from '@prisma/client';
import type { PurchaseAttemptResult, LeadFeedItem } from '@/types/lead';
import { logPurchase } from '../logger';

const prisma = new PrismaClient();

/**
 * Atomic purchase for CALL_VISIT leads only.
 * Does not perform Stripe billing; focuses on ownership + masking state.
 */
export async function purchaseCallVisitLead(leadId: string, installerId: string): Promise<PurchaseAttemptResult> {
  // helper to persist audit row safely
  async function audit(result: PurchaseAttemptResult) {
    try {
      await prisma.purchaseLogEntry.create({
        data: { leadId, installerId, outcome: result.outcome, message: result.message || null }
      });
    } catch (_) {
      // swallow audit errors (migration not applied / transient)
    }
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        installerId: true,
        status: true,
        leadPrice: true,
        purchasedAt: true,
        quoteType: true,
        expiresAt: true,
        name: true,
        phoneNumber: true,
        cancelledAt: true,
        archivedAt: true,
      }
    });

    if (!lead || lead.quoteType !== 'CALL_VISIT') {
      const res: PurchaseAttemptResult = { outcome: 'not_found', message: 'Lead not found' };
      await audit(res); logPurchase(res, leadId, installerId); return res;
    }

    const now = new Date();
    const isExpired = lead.expiresAt ? lead.expiresAt <= now : false;
    if (lead.status !== LeadStatus.APPROVED || isExpired || lead.cancelledAt || lead.archivedAt) {
      const outcome: PurchaseAttemptResult = { outcome: 'invalid_status', message: 'Lead not purchasable' };
      await audit(outcome); logPurchase(outcome, leadId, installerId); return outcome;
    }
    if (lead.installerId) {
      const outcome: PurchaseAttemptResult = { outcome: 'already_purchased', message: 'Lead already purchased' };
      await audit(outcome); logPurchase(outcome, leadId, installerId); return outcome;
    }

    const updateResult = await prisma.lead.updateMany({
      where: { id: leadId, status: LeadStatus.APPROVED, installerId: null },
      data: { installerId, status: LeadStatus.PURCHASED, purchasedAt: now }
    });

    if (updateResult.count !== 1) {
      const conflict: PurchaseAttemptResult = { outcome: 'already_purchased', message: 'Purchase conflict' };
      await audit(conflict); logPurchase(conflict, leadId, installerId); return conflict;
    }

    const updated = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        installerId: true,
        status: true,
        leadPrice: true,
        purchasedAt: true,
        quoteType: true,
        name: true,
        phoneNumber: true,
        expiresAt: true,
      }
    });

    if (!updated) {
      const missing: PurchaseAttemptResult = { outcome: 'error', message: 'Lead missing post-update' };
      await audit(missing); logPurchase(missing, leadId, installerId); return missing;
    }

    const feedItem: LeadFeedItem = {
      id: updated.id,
      quoteType: 'CALL_VISIT',
      status: updated.status,
      leadPrice: updated.leadPrice || 0,
      installerId: updated.installerId || null,
      purchasedAt: updated.purchasedAt || null,
      purchasedByMe: true,
      purchasedByOther: false,
      canPurchase: false,
      maskedContact: false,
      contact: updated.name && updated.phoneNumber ? { name: updated.name, phone: updated.phoneNumber } : null,
      expiresAt: updated.expiresAt || null
    };
    const success: PurchaseAttemptResult = { outcome: 'success', lead: feedItem };

    await audit(success); logPurchase(success, leadId, installerId); return success;
  } catch (error) {
    const err: PurchaseAttemptResult = { outcome: 'error', message: 'Unexpected error purchasing lead' };
    await audit(err); logPurchase(err, leadId, installerId); return err;
  }
}

export type CallVisitPurchaseService = typeof purchaseCallVisitLead;
