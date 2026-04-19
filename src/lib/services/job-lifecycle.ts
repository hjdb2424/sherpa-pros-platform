/**
 * Job Lifecycle Automation
 *
 * Orchestrates the job flow from bid acceptance through completion.
 * All functions return mock data -- no real service calls yet.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LifecycleEvent {
  type:
    | 'bid_accepted'
    | 'checklist_generated'
    | 'materials_approved'
    | 'materials_ordered'
    | 'work_started'
    | 'milestone_completed'
    | 'job_completed'
    | 'payment_captured'
    | 'review_requested';
  jobId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export type LifecycleAction =
  | { action: 'accept_bid'; bidId: string }
  | { action: 'approve_materials' }
  | { action: 'start_work' }
  | { action: 'complete_milestone'; milestoneId: string }
  | { action: 'complete_job' };

/* ------------------------------------------------------------------ */
/*  Event descriptions (for timeline UI)                               */
/* ------------------------------------------------------------------ */

const EVENT_DESCRIPTIONS: Record<LifecycleEvent['type'], string> = {
  bid_accepted: 'Bid accepted by client',
  checklist_generated: 'Scope, checklist, and materials auto-generated',
  materials_approved: 'Client approved materials list',
  materials_ordered: 'Materials ordered via Home Depot',
  work_started: 'Pro started work on-site',
  milestone_completed: 'Milestone completed',
  job_completed: 'Job marked as complete',
  payment_captured: 'Payment captured and pro paid',
  review_requested: 'Review requested from both parties',
};

export function getEventDescription(type: LifecycleEvent['type']): string {
  return EVENT_DESCRIPTIONS[type] ?? type;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ts(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function makeEvent(
  type: LifecycleEvent['type'],
  jobId: string,
  data: Record<string, unknown> = {},
  minutesAgo = 0,
): LifecycleEvent {
  return {
    type,
    jobId,
    timestamp: minutesAgo > 0 ? ts(minutesAgo) : new Date().toISOString(),
    data,
  };
}

/* ------------------------------------------------------------------ */
/*  Lifecycle handlers (mock implementations)                          */
/* ------------------------------------------------------------------ */

/**
 * Called when a bid is accepted.
 * 1. Update job status to 'in_progress'
 * 2. Generate checklist (mock Wiseman call)
 * 3. Create milestones from checklist phases
 * 4. Notify pro + client
 */
export async function onBidAccepted(
  jobId: string,
  bidId: string,
): Promise<LifecycleEvent[]> {
  // Simulate async processing
  await new Promise((r) => setTimeout(r, 100));

  return [
    makeEvent('bid_accepted', jobId, {
      bidId,
      bidAmountCents: 285000,
      proName: 'Marcus Rivera',
      clientNotified: true,
      proNotified: true,
    }),
    makeEvent('checklist_generated', jobId, {
      checklistId: `chk-${jobId}`,
      phases: ['Prep & Protection', 'Rough-In', 'Installation', 'Finishing', 'Cleanup & Punch'],
      totalItems: 24,
      materialsCount: 18,
    }),
  ];
}

/**
 * Called when the client approves the materials list.
 * 1. Place HD order via Zinc
 * 2. Schedule delivery
 * 3. Notify pro
 */
export async function onMaterialsApproved(
  jobId: string,
): Promise<LifecycleEvent[]> {
  await new Promise((r) => setTimeout(r, 100));

  return [
    makeEvent('materials_approved', jobId, {
      materialsCostCents: 87500,
      itemCount: 18,
      approvedBy: 'client',
    }),
    makeEvent('materials_ordered', jobId, {
      orderId: `zinc-${jobId}-${Date.now()}`,
      supplier: 'Home Depot',
      estimatedDelivery: new Date(Date.now() + 2 * 86_400_000).toISOString(),
      deliveryTier: 'standard',
      proNotified: true,
    }),
  ];
}

/**
 * Called when the job is marked complete.
 * 1. Capture payment (Stripe)
 * 2. Calculate commission
 * 3. Pay pro via Connect
 * 4. Request reviews from both sides
 * 5. Sync to QBO
 */
export async function onJobCompleted(
  jobId: string,
): Promise<LifecycleEvent[]> {
  await new Promise((r) => setTimeout(r, 100));

  const totalCents = 285000;
  const commissionCents = Math.round(totalCents * 0.1);
  const proPayoutCents = totalCents - commissionCents;

  return [
    makeEvent('job_completed', jobId, {
      completedAt: new Date().toISOString(),
      totalMilestones: 5,
      completedMilestones: 5,
    }),
    makeEvent('payment_captured', jobId, {
      totalCents,
      commissionCents,
      proPayoutCents,
      stripePaymentIntentId: `pi_mock_${jobId}`,
      stripeTransferId: `tr_mock_${jobId}`,
      qboSynced: true,
      qboInvoiceId: `INV-${jobId.slice(0, 6).toUpperCase()}`,
    }),
    makeEvent('review_requested', jobId, {
      proReviewRequested: true,
      clientReviewRequested: true,
      reviewDeadline: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    }),
  ];
}

/* ------------------------------------------------------------------ */
/*  Dispatcher -- routes actions to handlers                           */
/* ------------------------------------------------------------------ */

export async function dispatchLifecycleAction(
  jobId: string,
  action: LifecycleAction,
): Promise<LifecycleEvent[]> {
  switch (action.action) {
    case 'accept_bid':
      return onBidAccepted(jobId, action.bidId);
    case 'approve_materials':
      return onMaterialsApproved(jobId);
    case 'start_work':
      return [makeEvent('work_started', jobId, { startedAt: new Date().toISOString() })];
    case 'complete_milestone':
      return [
        makeEvent('milestone_completed', jobId, {
          milestoneId: action.milestoneId,
          completedAt: new Date().toISOString(),
        }),
      ];
    case 'complete_job':
      return onJobCompleted(jobId);
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Mock timeline for a job                                            */
/* ------------------------------------------------------------------ */

export function getJobTimeline(jobId: string): LifecycleEvent[] {
  // Return a realistic-looking timeline for any job
  return [
    makeEvent('bid_accepted', jobId, {
      bidId: `bid-${jobId}-001`,
      bidAmountCents: 285000,
      proName: 'Marcus Rivera',
      clientNotified: true,
      proNotified: true,
    }, 4320), // 3 days ago

    makeEvent('checklist_generated', jobId, {
      checklistId: `chk-${jobId}`,
      phases: ['Prep & Protection', 'Rough-In', 'Installation', 'Finishing', 'Cleanup & Punch'],
      totalItems: 24,
      materialsCount: 18,
    }, 4300),

    makeEvent('materials_approved', jobId, {
      materialsCostCents: 87500,
      itemCount: 18,
      approvedBy: 'client',
    }, 2880), // 2 days ago

    makeEvent('materials_ordered', jobId, {
      orderId: `zinc-${jobId}-17120`,
      supplier: 'Home Depot',
      estimatedDelivery: new Date(Date.now() - 1440 * 60_000).toISOString(),
      deliveryTier: 'standard',
      proNotified: true,
    }, 2870),

    makeEvent('work_started', jobId, {
      startedAt: new Date(Date.now() - 1440 * 60_000).toISOString(),
    }, 1440), // 1 day ago

    makeEvent('milestone_completed', jobId, {
      milestoneId: 'ms-1',
      milestoneName: 'Prep & Protection',
      completedAt: new Date(Date.now() - 720 * 60_000).toISOString(),
    }, 720), // 12 hours ago

    makeEvent('milestone_completed', jobId, {
      milestoneId: 'ms-2',
      milestoneName: 'Rough-In',
      completedAt: new Date(Date.now() - 180 * 60_000).toISOString(),
    }, 180), // 3 hours ago
  ];
}
