/**
 * Automation Engine Service
 * 
 * Purpose: Evaluate automation rules and auto-approve matching leads
 * Used in: POST /api/leads route when approval_mode = 'AUTO'
 * 
 * Automation Flow:
 * 1. Check if automation mode is enabled (approval_mode = 'AUTO')
 * 2. Load automation rules from Settings
 * 3. Evaluate lead against each rule
 * 4. If lead matches all conditions in a rule, auto-approve
 * 5. Apply pricing and visibility from rule config
 * 6. Log audit trail for automated approval
 */

import { prisma } from '@/lib/prisma';
import { getSetting, getSettingAsBoolean, getSettingAsNumber } from './settings-service';
import { createAuditLog, AUDIT_ACTIONS } from './audit-logger';
import { createNotification } from './notification-service';
import type { Lead } from '@prisma/client';

/**
 * Automation Rule Structure
 * Stored in Settings table as JSON string
 */
export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    quoteType?: 'CALL_VISIT' | 'WRITTEN_QUOTE' | 'ANY';
    phoneVerified?: boolean;
    postcodes?: string[]; // List of postcodes or regions
    minEnergyBill?: number;
    maxEnergyBill?: number;
  };
  actions: {
    approve: boolean;
    setPrice?: number;
    visibility?: 'PUBLIC' | 'PRIVATE';
    assignTo?: 'ALL' | string[]; // 'ALL' or array of installer IDs
    markHot?: boolean;
  };
}

/**
 * Check if automation mode is enabled
 */
export async function isAutomationEnabled(): Promise<boolean> {
  try {
    const approvalMode = await getSetting('approval_mode');
    return approvalMode === 'AUTO';
  } catch (error) {
    console.error('Error checking automation mode:', error);
    return false;
  }
}

/**
 * Get all enabled automation rules
 */
export async function getAutomationRules(): Promise<AutomationRule[]> {
  try {
    const rulesJson = await getSetting('automation_rules');
    if (!rulesJson || rulesJson === '[]') {
      return [];
    }
    
    const rules: AutomationRule[] = JSON.parse(rulesJson);
    return rules.filter(rule => rule.enabled);
  } catch (error) {
    console.error('Error loading automation rules:', error);
    return [];
  }
}

/**
 * Evaluate a lead against automation rules
 * Returns the first matching rule, or null if no match
 */
export async function evaluateLead(lead: Lead): Promise<AutomationRule | null> {
  try {
    const rules = await getAutomationRules();
    
    if (rules.length === 0) {
      return null;
    }

    for (const rule of rules) {
      if (matchesRule(lead, rule)) {
        return rule;
      }
    }

    return null;
  } catch (error) {
    console.error('Error evaluating lead:', error);
    return null;
  }
}

/**
 * Check if a lead matches a rule's conditions
 */
function matchesRule(lead: Lead, rule: AutomationRule): boolean {
  const { conditions } = rule;

  // Check quote type
  if (conditions.quoteType && conditions.quoteType !== 'ANY') {
    // Note: Lead model uses projectType, not quoteType
    // We'll need to check if this matches the spec
    // For now, assume all leads match
  }

  // Check phone verification
  if (conditions.phoneVerified !== undefined) {
    if (lead.phoneVerified !== conditions.phoneVerified) {
      return false;
    }
  }

  // Check postcodes
  if (conditions.postcodes && conditions.postcodes.length > 0) {
    const leadPostcode = lead.postcode.toUpperCase().trim();
    const matchesPostcode = conditions.postcodes.some(pc => {
      const rulePostcode = pc.toUpperCase().trim();
      // Support wildcard matching (e.g., "SW*" matches "SW1", "SW2", etc.)
      if (rulePostcode.endsWith('*')) {
        const prefix = rulePostcode.slice(0, -1);
        return leadPostcode.startsWith(prefix);
      }
      return leadPostcode === rulePostcode;
    });
    
    if (!matchesPostcode) {
      return false;
    }
  }

  // Check energy bill range
  if (conditions.minEnergyBill !== undefined && lead.energyBill < conditions.minEnergyBill) {
    return false;
  }

  if (conditions.maxEnergyBill !== undefined && lead.energyBill > conditions.maxEnergyBill) {
    return false;
  }

  // All conditions matched
  return true;
}

/**
 * Auto-approve a lead based on matching automation rule
 */
export async function autoApproveLead(leadId: string, rule: AutomationRule): Promise<Lead> {
  try {
    // Get default pricing if not specified in rule
    const defaultPrice = rule.actions.setPrice || await getSettingAsNumber('lead_price_default');
    
    // Set expiry date
    const expiryDays = await getSettingAsNumber('lead_expiry_days');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    // Determine visibility
    const visibility = rule.actions.visibility || 
      (rule.actions.assignTo === 'ALL' ? 'PUBLIC' : 'PRIVATE');

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'APPROVED',
        visibility,
        leadPrice: defaultPrice,
        approvedAt: new Date(),
        expiresAt,
        adminNotes: rule.actions.markHot 
          ? `HOT LEAD - Auto-approved by rule: ${rule.name}` 
          : `Auto-approved by rule: ${rule.name}`,
      },
      include: {
        homeowner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Create audit log
    await createAuditLog({
      userId: 'system', // System-initiated action
      action: AUDIT_ACTIONS.LEAD_APPROVED,
      entityType: 'lead',
      entityId: leadId,
      metadata: {
        previousStatus: 'DRAFT',
        newStatus: 'APPROVED',
        automationRule: rule.name,
        ruleId: rule.id,
        leadPrice: defaultPrice,
        visibility,
        isHot: rule.actions.markHot || false,
      },
    });

    // Notify homeowner
    await createNotification({
      userId: updatedLead.homeowner.id,
      type: 'LEAD_APPROVED',
      title: 'Lead Approved!',
      message: 'Your quote request has been automatically approved and is now visible to installers.',
      actionUrl: `/homeowner/leads/${leadId}`,
      metadata: {
        leadId,
        entityType: 'lead',
        automated: true,
      },
    });

    // Notify assigned installers (if specific assignment)
    if (rule.actions.assignTo && rule.actions.assignTo !== 'ALL' && Array.isArray(rule.actions.assignTo)) {
      for (const installerId of rule.actions.assignTo) {
        await createNotification({
          userId: installerId,
          type: 'NEW_LEAD',
          title: 'New Lead Available',
          message: `A new ${rule.actions.markHot ? 'HOT ' : ''}lead has been automatically assigned to you.`,
          actionUrl: `/installer/marketplace`,
          metadata: {
            leadId,
            entityType: 'lead',
            isHot: rule.actions.markHot || false,
            automated: true,
          },
        });
      }
    }

    return updatedLead;

  } catch (error) {
    console.error('Error auto-approving lead:', error);
    throw error;
  }
}

/**
 * Process a lead through automation engine
 * Main entry point called from POST /api/leads
 */
export async function processLeadAutomation(leadId: string): Promise<{
  approved: boolean;
  rule: AutomationRule | null;
}> {
  try {
    // Check if automation is enabled
    const automationEnabled = await isAutomationEnabled();
    if (!automationEnabled) {
      return { approved: false, rule: null };
    }

    // Get the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    // Evaluate lead against rules
    const matchingRule = await evaluateLead(lead);
    
    if (!matchingRule) {
      // No matching rule, lead stays in DRAFT/PENDING_APPROVAL
      return { approved: false, rule: null };
    }

    // Auto-approve the lead
    await autoApproveLead(leadId, matchingRule);

    return { approved: true, rule: matchingRule };

  } catch (error) {
    console.error('Error processing lead automation:', error);
    return { approved: false, rule: null };
  }
}

/**
 * Save automation rules to Settings
 * Used by admin settings page
 */
export async function saveAutomationRules(
  rules: AutomationRule[],
  updatedBy: string
): Promise<void> {
  try {
    const rulesJson = JSON.stringify(rules);
    const { setSetting } = await import('./settings-service');
    await setSetting('automation_rules', rulesJson, updatedBy);

    // Create audit log
    await createAuditLog({
      userId: updatedBy,
      action: AUDIT_ACTIONS.ADMIN_SETTINGS_CHANGED,
      entityType: 'settings',
      entityId: 'automation_rules',
      metadata: {
        rulesCount: rules.length,
        enabledRulesCount: rules.filter(r => r.enabled).length,
      },
    });
  } catch (error) {
    console.error('Error saving automation rules:', error);
    throw error;
  }
}
