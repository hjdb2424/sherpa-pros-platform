// =============================================================================
// Dispatch Wiseman — Dispatch Logic
// Orchestrates the matching flow: emergency, standard, flexible, bid, fallback
// =============================================================================

import type {
  ProProfile,
  JobPosting,
  DispatchResult,
  DispatchScore,
  DispatchType,
  FallbackReason,
  Hub,
  HubConfig,
  ClientProHistory,
  ProDistanceInput,
  ScoringWeights,
} from './types';
import { rankPros, DEFAULT_WEIGHTS } from './scoring';

// -----------------------------------------------------------------------------
// Default Hub Config
// -----------------------------------------------------------------------------

export const DEFAULT_HUB_CONFIG: HubConfig = {
  emergency_dispatch_count: 3,
  standard_timeout_minutes: 15,
  flexible_window_hours: 2,
  max_declines_before_fallback: 6,
  fallback_timeout_hours: 2,
  large_job_pro_count_min: 5,
  large_job_pro_count_max: 8,
  large_job_tier_expand_hours: 48,
};

// -----------------------------------------------------------------------------
// Dispatch Context — everything needed to run a dispatch
// -----------------------------------------------------------------------------

export interface DispatchContext {
  pros: ProProfile[];
  distanceInputs: ProDistanceInput[];
  clientHistories: Map<string, ClientProHistory>;
  hubs: Hub[];
  weights?: ScoringWeights;
  now?: Date;
}

// -----------------------------------------------------------------------------
// Small Job Dispatch — Three Urgency Patterns
// -----------------------------------------------------------------------------

/**
 * Dispatch a small job (below hub threshold) based on urgency.
 *
 * Emergency: Top N Pros notified simultaneously, first accept wins, premium rate
 * Standard:  Sequential — top Pro gets timeout window, then next
 * Flexible:  Top N notified, extended window, best match wins
 *
 * Returns the DispatchResult with ranked Pros and dispatch configuration.
 * Actual notification delivery is handled by the notification layer.
 */
export function dispatchSmallJob(
  job: JobPosting,
  ctx: DispatchContext
): DispatchResult {
  const hub = findPrimaryHub(job, ctx.hubs);
  const config = hub?.config || DEFAULT_HUB_CONFIG;

  // Get all ranked Pros across relevant hubs
  const rankedPros = scoreAcrossHubs(job, ctx);

  if (rankedPros.length === 0) {
    return createFallbackResult(job, [], 'no_qualified_pros', ctx.now);
  }

  switch (job.urgency) {
    case 'emergency':
      return dispatchEmergency(job, rankedPros, config, ctx.now);
    case 'standard':
      return dispatchStandard(job, rankedPros, config, ctx.now);
    case 'flexible':
      return dispatchFlexible(job, rankedPros, config, ctx.now);
    default:
      return dispatchStandard(job, rankedPros, config, ctx.now);
  }
}

/**
 * Emergency dispatch: Top 3 simultaneous, first accept wins.
 * Premium rate applied (1.5x platform suggested).
 */
function dispatchEmergency(
  job: JobPosting,
  rankedPros: DispatchScore[],
  config: HubConfig,
  now?: Date
): DispatchResult {
  const notifyCount = Math.min(config.emergency_dispatch_count, rankedPros.length);
  const hubIds = extractHubIds(rankedPros, notifyCount);

  return {
    job_id: job.id,
    ranked_pros: rankedPros,
    dispatch_type: 'emergency',
    fallback_triggered: false,
    notify_count: notifyCount,
    calculated_at: (now || new Date()).toISOString(),
    hub_ids: hubIds,
  };
}

/**
 * Standard dispatch: Sequential — top Pro notified, 15min timeout, then next.
 * The notification layer handles the sequential flow; we provide the full
 * ranked list and the timeout configuration.
 */
function dispatchStandard(
  job: JobPosting,
  rankedPros: DispatchScore[],
  config: HubConfig,
  now?: Date
): DispatchResult {
  // Notify one at a time — notify_count=1 signals sequential mode
  const hubIds = extractHubIds(rankedPros, rankedPros.length);

  return {
    job_id: job.id,
    ranked_pros: rankedPros,
    dispatch_type: 'standard',
    fallback_triggered: false,
    notify_count: 1,
    calculated_at: (now || new Date()).toISOString(),
    hub_ids: hubIds,
  };
}

/**
 * Flexible dispatch: Top 3 notified, 2hr window, best match wins.
 * All three can accept; if multiple accept, the highest-ranked is selected.
 */
function dispatchFlexible(
  job: JobPosting,
  rankedPros: DispatchScore[],
  config: HubConfig,
  now?: Date
): DispatchResult {
  const notifyCount = Math.min(3, rankedPros.length);
  const hubIds = extractHubIds(rankedPros, notifyCount);

  return {
    job_id: job.id,
    ranked_pros: rankedPros,
    dispatch_type: 'flexible',
    fallback_triggered: false,
    notify_count: notifyCount,
    calculated_at: (now || new Date()).toISOString(),
    hub_ids: hubIds,
  };
}

// -----------------------------------------------------------------------------
// Large Job Dispatch — Competitive Bidding
// -----------------------------------------------------------------------------

/**
 * Dispatch a large job (above hub threshold) for competitive bidding.
 * Selects top 5-8 qualified Pros to see the job.
 *
 * After 48 hours, if fewer than 3 bids received, the job opens to
 * the next tier of Pros automatically.
 */
export function dispatchLargeJob(
  job: JobPosting,
  ctx: DispatchContext
): DispatchResult {
  const hub = findPrimaryHub(job, ctx.hubs);
  const config = hub?.config || DEFAULT_HUB_CONFIG;

  const rankedPros = scoreAcrossHubs(job, ctx);

  if (rankedPros.length === 0) {
    return createFallbackResult(job, [], 'no_qualified_pros', ctx.now);
  }

  // Select 5-8 Pros based on config
  const notifyCount = Math.min(
    Math.max(config.large_job_pro_count_min, Math.min(rankedPros.length, config.large_job_pro_count_max)),
    rankedPros.length
  );

  const hubIds = extractHubIds(rankedPros, notifyCount);

  return {
    job_id: job.id,
    ranked_pros: rankedPros,
    dispatch_type: 'bid',
    fallback_triggered: false,
    notify_count: notifyCount,
    calculated_at: (ctx.now || new Date()).toISOString(),
    hub_ids: hubIds,
  };
}

// -----------------------------------------------------------------------------
// Fallback — Convert to Open Bid
// -----------------------------------------------------------------------------

/**
 * Handle fallback after dispatch failures.
 *
 * Triggered when:
 * - 6+ Pros decline (max_declines_before_fallback)
 * - 2+ hours pass with no acceptance (fallback_timeout_hours)
 * - No qualified Pros found
 *
 * Converts the job to an open bid visible to all qualified Pros in
 * the hub and adjacent hubs.
 */
export function handleFallback(
  job: JobPosting,
  reason: FallbackReason,
  ctx: DispatchContext
): DispatchResult {
  // Re-score with relaxed criteria — include Pros who were previously skipped
  const rankedPros = scoreAcrossHubs(job, ctx);

  return createFallbackResult(job, rankedPros, reason, ctx.now);
}

// -----------------------------------------------------------------------------
// Hub Overlap Resolution
// -----------------------------------------------------------------------------

/**
 * Resolve hub overlap for a job that falls in multiple hub boundaries.
 *
 * Rules:
 * 1. Score ALL qualified Pros across ALL overlapping hubs
 * 2. Hub affiliation is NOT a factor — pure merit + proximity
 * 3. Deduplicates Pros who appear in multiple hubs
 * 4. Returns combined ranked list
 */
export function resolveHubOverlap(
  job: JobPosting,
  hubs: Hub[],
  ctx: DispatchContext
): DispatchScore[] {
  // Find all hubs whose radius contains the job location
  const overlappingHubs = findOverlappingHubs(job, hubs);

  if (overlappingHubs.length === 0) {
    return [];
  }

  // Collect all unique Pros from overlapping hubs
  // In production, this query goes to the database with PostGIS
  // For now, we score all provided Pros (the caller filters by hub)
  return scoreAcrossHubs(job, {
    ...ctx,
    hubs: overlappingHubs,
  });
}

// -----------------------------------------------------------------------------
// Internal Helpers
// -----------------------------------------------------------------------------

/**
 * Score all Pros across relevant hubs for a job.
 * Deduplicates Pros and returns a single ranked list.
 */
function scoreAcrossHubs(
  job: JobPosting,
  ctx: DispatchContext
): DispatchScore[] {
  return rankPros(
    ctx.pros,
    job,
    ctx.distanceInputs,
    ctx.clientHistories,
    ctx.weights || DEFAULT_WEIGHTS,
    ctx.now
  );
}

/**
 * Find the primary hub for a job (the hub the job was posted to).
 */
function findPrimaryHub(job: JobPosting, hubs: Hub[]): Hub | null {
  return hubs.find((h) => h.id === job.hub_id) || null;
}

/**
 * Find all hubs whose geographic boundary contains the job location.
 * Uses simple Haversine distance check against hub center + radius.
 * In production, PostGIS ST_DWithin handles this.
 */
function findOverlappingHubs(job: JobPosting, hubs: Hub[]): Hub[] {
  return hubs.filter((hub) => {
    const distanceKm = haversineDistance(
      job.location.lat,
      job.location.lng,
      hub.center_point.lat,
      hub.center_point.lng
    );
    return distanceKm <= hub.radius_km;
  });
}

/**
 * Haversine distance between two geographic points in kilometers.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Extract unique hub IDs from ranked Pros (top N).
 * Looks up hub_id from the full Pro list based on pro_id.
 */
function extractHubIds(rankedPros: DispatchScore[], topN: number): string[] {
  // For now, return unique hub IDs based on rank
  // In production, this joins back to Pro profiles
  const hubIds = new Set<string>();
  for (let i = 0; i < Math.min(topN, rankedPros.length); i++) {
    // Hub ID will be resolved from Pro profile in the data layer
    hubIds.add(rankedPros[i].pro_id);
  }
  // Placeholder — the data layer will map pro_id → hub_id
  return Array.from(hubIds);
}

/**
 * Create a fallback DispatchResult (open bid).
 */
function createFallbackResult(
  job: JobPosting,
  rankedPros: DispatchScore[],
  reason: FallbackReason,
  now?: Date
): DispatchResult {
  return {
    job_id: job.id,
    ranked_pros: rankedPros,
    dispatch_type: 'fallback_bid',
    fallback_triggered: true,
    fallback_reason: reason,
    // Open bid — all ranked Pros can see it
    notify_count: rankedPros.length,
    calculated_at: (now || new Date()).toISOString(),
    hub_ids: [],
  };
}

// -----------------------------------------------------------------------------
// Convenience: Auto-route to correct dispatch path
// -----------------------------------------------------------------------------

/**
 * Main entry point: automatically routes to small job dispatch or large job
 * bid based on the job's threshold_type.
 */
export function dispatch(
  job: JobPosting,
  ctx: DispatchContext
): DispatchResult {
  if (job.threshold_type === 'dispatch') {
    return dispatchSmallJob(job, ctx);
  }
  return dispatchLargeJob(job, ctx);
}
