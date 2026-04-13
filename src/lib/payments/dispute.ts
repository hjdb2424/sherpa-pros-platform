/**
 * Sherpa Pros Platform — Dispute Resolution Logic
 *
 * Handles payment disputes between clients and Pros with a structured
 * mediation workflow:
 *
 *   1. Dispute opened → 72-hour mediation window
 *   2. Auto-mediation checks (checklist status, evidence)
 *   3. If unresolved after 72 hours → escalate to regional manager
 *   4. Resolution: full release / partial release / full refund
 */

import type {
  Dispute,
  DisputeEvidence,
  DisputeResolution,
  DisputeStatus,
} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Mediation window duration in milliseconds (72 hours) */
const MEDIATION_WINDOW_MS = 72 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// In-memory store (replaced by database in production)
// ---------------------------------------------------------------------------

const disputes = new Map<string, Dispute>();
let disputeCounter = 0;

function generateDisputeId(): string {
  disputeCounter += 1;
  return `dispute_${Date.now()}_${disputeCounter}`;
}

// ---------------------------------------------------------------------------
// Create Dispute
// ---------------------------------------------------------------------------

/**
 * Open a new dispute on a payment.
 *
 * Starts a 72-hour mediation window during which the parties can
 * submit evidence and attempt resolution.
 *
 * @param paymentId  The payment being disputed
 * @param raisedBy   Who raised the dispute ('client' or 'pro')
 * @param reason     Free-text reason for the dispute
 * @param evidence   Initial evidence submitted with the dispute
 * @returns The created dispute record
 */
export function createDispute(
  paymentId: string,
  raisedBy: 'client' | 'pro',
  reason: string,
  evidence: DisputeEvidence[] = [],
): Dispute {
  if (!paymentId) {
    throw new Error('paymentId is required');
  }
  if (!reason || reason.trim().length === 0) {
    throw new Error('Dispute reason is required');
  }

  const now = new Date();
  const mediationDeadline = new Date(now.getTime() + MEDIATION_WINDOW_MS);

  const dispute: Dispute = {
    id: generateDisputeId(),
    paymentId,
    raisedBy,
    reason: reason.trim(),
    evidence: evidence.map((e) => ({
      ...e,
      submittedAt: e.submittedAt ?? now,
    })),
    status: 'under_mediation',
    resolution: null,
    resolvedAmountCents: null,
    openedAt: now,
    mediationDeadline,
    escalatedAt: null,
    resolvedAt: null,
  };

  disputes.set(dispute.id, dispute);

  // TODO: Notify both parties via Twilio/email
  // await notificationService.send({
  //   to: [clientId, proId],
  //   template: 'dispute_opened',
  //   data: { disputeId: dispute.id, reason, mediationDeadline },
  // });

  // TODO: Hold/freeze the payment in escrow
  // await holdInEscrow(paymentId);

  return dispute;
}

// ---------------------------------------------------------------------------
// Auto-Mediation
// ---------------------------------------------------------------------------

/**
 * Result of the auto-mediation check.
 */
export interface AutoMediationResult {
  canAutoResolve: boolean;
  suggestedResolution: DisputeResolution | null;
  reason: string;
  checks: {
    checklistComplete: boolean | null;
    photosSubmitted: boolean;
    proResponded: boolean;
    clientResponded: boolean;
  };
}

/**
 * Attempt automatic resolution of a dispute by examining evidence
 * and job completion status.
 *
 * Auto-resolution rules:
 *   - If Pro's checklist is incomplete → suggest full_refund
 *   - If checklist is complete AND client has no photo evidence → suggest full_release
 *   - If both parties submitted evidence → cannot auto-resolve (needs human review)
 *
 * @param disputeId  The dispute to evaluate
 * @returns Auto-mediation result with suggested resolution
 */
export function autoMediate(disputeId: string): AutoMediationResult {
  const dispute = disputes.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (dispute.status !== 'under_mediation') {
    throw new Error(`Cannot mediate dispute in status: ${dispute.status}`);
  }

  // Analyze evidence
  const proEvidence = dispute.evidence.filter((e) => e.submittedBy === 'pro');
  const clientEvidence = dispute.evidence.filter((e) => e.submittedBy === 'client');

  const checklistEvidence = dispute.evidence.find(
    (e) => e.type === 'checklist_status',
  );
  const clientPhotos = clientEvidence.filter((e) => e.type === 'photo');

  // TODO: Fetch actual checklist status from the PM module
  // const checklist = await checklistService.getByJobId(dispute.paymentId);
  // const checklistComplete = checklist?.isComplete ?? null;

  // For now, derive from evidence metadata
  let checklistComplete: boolean | null = null;
  if (checklistEvidence) {
    // Evidence description encodes completion status
    checklistComplete = checklistEvidence.description.toLowerCase().includes('complete');
  }

  const checks = {
    checklistComplete,
    photosSubmitted: clientPhotos.length > 0,
    proResponded: proEvidence.length > 0,
    clientResponded: clientEvidence.length > 0,
  };

  // Auto-resolution logic
  // Rule 1: Checklist incomplete = Pro hasn't finished the work
  if (checklistComplete === false) {
    return {
      canAutoResolve: true,
      suggestedResolution: 'full_refund',
      reason: 'Pro checklist is incomplete — work was not finished as agreed.',
      checks,
    };
  }

  // Rule 2: Checklist complete AND client has no photo evidence of issues
  if (checklistComplete === true && clientPhotos.length === 0) {
    return {
      canAutoResolve: true,
      suggestedResolution: 'full_release',
      reason: 'Pro checklist is complete and client provided no photo evidence of issues.',
      checks,
    };
  }

  // Rule 3: Both sides have evidence — requires human judgment
  if (proEvidence.length > 0 && clientEvidence.length > 0) {
    return {
      canAutoResolve: false,
      suggestedResolution: null,
      reason: 'Both parties submitted evidence. Human review required.',
      checks,
    };
  }

  // Default: cannot auto-resolve
  return {
    canAutoResolve: false,
    suggestedResolution: null,
    reason: 'Insufficient evidence for automatic resolution.',
    checks,
  };
}

// ---------------------------------------------------------------------------
// Escalation
// ---------------------------------------------------------------------------

/**
 * Escalate a dispute to the regional manager after the 72-hour
 * mediation window expires or when auto-mediation fails.
 *
 * @param disputeId  The dispute to escalate
 * @returns Updated dispute record
 */
export function escalateToRegional(disputeId: string): Dispute {
  const dispute = disputes.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (dispute.status !== 'under_mediation') {
    throw new Error(`Cannot escalate dispute in status: ${dispute.status}`);
  }

  const now = new Date();

  dispute.status = 'escalated_to_regional';
  dispute.escalatedAt = now;

  disputes.set(disputeId, dispute);

  // TODO: Notify regional manager
  // await notificationService.send({
  //   to: regionalManagerId,
  //   template: 'dispute_escalated',
  //   data: { disputeId, paymentId: dispute.paymentId, reason: dispute.reason },
  // });

  return { ...dispute };
}

/**
 * Check if a dispute's mediation window has expired and auto-escalate
 * if it has.
 *
 * Intended to be called by a cron job or scheduled task.
 *
 * @param disputeId  The dispute to check
 * @returns Whether the dispute was escalated
 */
export function checkMediationExpiry(disputeId: string): boolean {
  const dispute = disputes.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (dispute.status !== 'under_mediation') {
    return false;
  }

  const now = new Date();
  if (now >= dispute.mediationDeadline) {
    escalateToRegional(disputeId);
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/**
 * Finalize a dispute with a resolution.
 *
 * @param disputeId   The dispute to resolve
 * @param resolution  How to resolve: full_release | partial_release | full_refund
 * @param amountCents For partial_release, the amount to release to the Pro (in cents).
 *                    Ignored for full_release and full_refund.
 * @returns The resolved dispute record
 */
export function resolveDispute(
  disputeId: string,
  resolution: DisputeResolution,
  amountCents?: number,
): Dispute {
  const dispute = disputes.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (dispute.status !== 'under_mediation' && dispute.status !== 'escalated_to_regional') {
    throw new Error(`Cannot resolve dispute in status: ${dispute.status}`);
  }

  if (resolution === 'partial_release') {
    if (amountCents === undefined || amountCents <= 0) {
      throw new Error('amountCents is required and must be positive for partial_release');
    }
  }

  const now = new Date();

  const statusMap: Record<DisputeResolution, DisputeStatus> = {
    full_release: 'resolved_full_release',
    partial_release: 'resolved_partial_release',
    full_refund: 'resolved_full_refund',
  };

  dispute.status = statusMap[resolution];
  dispute.resolution = resolution;
  dispute.resolvedAmountCents = amountCents ?? null;
  dispute.resolvedAt = now;

  disputes.set(disputeId, dispute);

  // TODO: Execute the financial resolution
  // switch (resolution) {
  //   case 'full_release':
  //     await releasePayout(dispute.paymentId, proConnectAccountId, fullAmount, commission);
  //     break;
  //   case 'partial_release':
  //     await releasePayout(dispute.paymentId, proConnectAccountId, amountCents!, partialCommission);
  //     await processRefund(dispute.paymentId, fullAmount - amountCents!, 'Partial dispute resolution');
  //     break;
  //   case 'full_refund':
  //     await processRefund(dispute.paymentId, 0, 'Full dispute resolution — refund to client');
  //     break;
  // }

  // TODO: Notify both parties of the resolution
  // await notificationService.send({
  //   to: [clientId, proId],
  //   template: 'dispute_resolved',
  //   data: { disputeId, resolution, amountCents },
  // });

  return { ...dispute };
}

// ---------------------------------------------------------------------------
// Evidence Management
// ---------------------------------------------------------------------------

/**
 * Add evidence to an open dispute.
 *
 * @param disputeId  The dispute to add evidence to
 * @param evidence   The evidence to add
 * @returns Updated dispute record
 */
export function addEvidence(
  disputeId: string,
  evidence: DisputeEvidence,
): Dispute {
  const dispute = disputes.get(disputeId);
  if (!dispute) {
    throw new Error(`Dispute not found: ${disputeId}`);
  }

  if (dispute.status !== 'under_mediation' && dispute.status !== 'escalated_to_regional') {
    throw new Error('Cannot add evidence to a resolved dispute');
  }

  dispute.evidence.push({
    ...evidence,
    submittedAt: evidence.submittedAt ?? new Date(),
  });

  disputes.set(disputeId, dispute);

  return { ...dispute };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/**
 * Get a dispute by ID.
 */
export function getDispute(disputeId: string): Dispute | undefined {
  const dispute = disputes.get(disputeId);
  return dispute ? { ...dispute } : undefined;
}

/**
 * Get all disputes for a given payment.
 */
export function getDisputesByPayment(paymentId: string): Dispute[] {
  return Array.from(disputes.values())
    .filter((d) => d.paymentId === paymentId)
    .map((d) => ({ ...d }));
}

/**
 * Reset the in-memory store (for testing only).
 */
export function _resetDisputeStore(): void {
  disputes.clear();
  disputeCounter = 0;
}
