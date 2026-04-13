// =============================================================================
// Dispatch Wiseman — Anti-Gaming Detection
// Prevents score manipulation, cherry-picking, and bid-and-ghost behavior
// =============================================================================

import type {
  AntiGamingReport,
  AntiGamingViolation,
  ProProfile,
  StrikeLevel,
  ViolationType,
} from './types';

// -----------------------------------------------------------------------------
// Thresholds
// -----------------------------------------------------------------------------

const CHERRY_PICKING_DECLINE_THRESHOLD = 0.50; // >50% decline rate
const CHERRY_PICKING_WINDOW_DAYS = 30;
const CHERRY_PICKING_MIN_DISPATCHES = 5; // Need minimum sample size

const BID_AND_GHOST_LOOKBACK_DAYS = 90;

// Strike escalation: warning → visibility_reduction → pause → deactivation
const STRIKE_ESCALATION: StrikeLevel[] = [
  'warning',
  'visibility_reduction',
  'pause',
  'deactivation',
];

// -----------------------------------------------------------------------------
// Pro Activity Data — passed in from the data layer
// -----------------------------------------------------------------------------

export interface ProDispatchActivity {
  pro_id: string;
  /** Dispatches in the last 30 days */
  dispatches_30d: number;
  /** Declines in the last 30 days */
  declines_30d: number;
  /** Timeouts (no response) in the last 30 days */
  timeouts_30d: number;
  /** Accept rate as decimal (0-1) */
  accept_rate_30d: number;
  /** Categories of jobs declined (to detect selective cherry-picking) */
  declined_categories: { category: string; count: number }[];
  /** Categories of jobs accepted */
  accepted_categories: { category: string; count: number }[];
}

export interface ProBidActivity {
  pro_id: string;
  /** Bids won in the lookback period */
  bids_won: number;
  /** Bids won where work was never started */
  bids_won_not_started: number;
  /** Bids won where Pro went unresponsive after winning */
  bids_won_unresponsive: number;
  /** Average days between bid win and work start */
  avg_days_to_start: number;
  /** Details of ghosted bids */
  ghosted_bids: {
    job_id: string;
    bid_amount: number;
    won_at: string;
    last_contact: string;
  }[];
}

export interface ProStrikeHistory {
  pro_id: string;
  /** Total active strikes */
  active_strikes: number;
  /** Current strike level (null if clean) */
  current_level: StrikeLevel | null;
  /** Past violations for pattern detection */
  past_violations: {
    type: ViolationType;
    date: string;
    resolved: boolean;
  }[];
}

// -----------------------------------------------------------------------------
// Cherry-Picking Detection
// -----------------------------------------------------------------------------

/**
 * Detect cherry-picking: Pro selectively declines dispatches
 * to only accept high-value or easy jobs.
 *
 * Triggers when:
 * - Decline rate > 50% in last 30 days
 * - AND minimum 5 dispatches received (prevents false positives on low volume)
 *
 * Also checks for category-selective cherry-picking:
 * - If a Pro only accepts one category but declines all others,
 *   that may indicate gaming (unless they are single-trade).
 */
export function detectCherryPicking(
  activity: ProDispatchActivity,
  pro: ProProfile
): AntiGamingViolation | null {
  // Not enough data to judge
  if (activity.dispatches_30d < CHERRY_PICKING_MIN_DISPATCHES) {
    return null;
  }

  const declineRate =
    (activity.declines_30d + activity.timeouts_30d) / activity.dispatches_30d;

  if (declineRate <= CHERRY_PICKING_DECLINE_THRESHOLD) {
    return null;
  }

  // Check for category-selective pattern
  const categorySelectivity = detectCategorySelectivity(
    activity.declined_categories,
    activity.accepted_categories,
    pro.trades
  );

  const details = categorySelectivity
    ? `Decline rate ${(declineRate * 100).toFixed(1)}% over ${activity.dispatches_30d} dispatches in 30 days. Category-selective pattern detected: preferring ${categorySelectivity.preferred} while declining ${categorySelectivity.avoided}.`
    : `Decline rate ${(declineRate * 100).toFixed(1)}% over ${activity.dispatches_30d} dispatches in 30 days. Exceeds ${CHERRY_PICKING_DECLINE_THRESHOLD * 100}% threshold.`;

  return {
    pro_id: activity.pro_id,
    violation_type: 'cherry_picking',
    severity: 'warning',
    details,
    detected_at: new Date().toISOString(),
    evidence: {
      dispatches_30d: activity.dispatches_30d,
      declines_30d: activity.declines_30d,
      timeouts_30d: activity.timeouts_30d,
      decline_rate: declineRate,
      threshold: CHERRY_PICKING_DECLINE_THRESHOLD,
      category_selective: categorySelectivity ? 'true' : 'false',
    },
  };
}

/**
 * Detect if a Pro is selectively declining specific categories
 * while accepting others — even if their overall decline rate is borderline.
 */
function detectCategorySelectivity(
  declined: { category: string; count: number }[],
  accepted: { category: string; count: number }[],
  proTrades: string[]
): { preferred: string; avoided: string } | null {
  if (declined.length === 0 || accepted.length === 0) return null;

  // Only flag single-trade Pros as cherry-picking if they decline
  // jobs in their own trade. Multi-trade Pros naturally filter.
  if (proTrades.length <= 1) return null;

  // Find categories with 100% decline
  const acceptedSet = new Set(accepted.map((a) => a.category));
  const pureDeclines = declined.filter(
    (d) => !acceptedSet.has(d.category) && d.count >= 3
  );

  if (pureDeclines.length === 0) return null;

  const topAccepted = accepted.sort((a, b) => b.count - a.count)[0];
  const topDeclined = pureDeclines.sort((a, b) => b.count - a.count)[0];

  return {
    preferred: topAccepted.category,
    avoided: topDeclined.category,
  };
}

// -----------------------------------------------------------------------------
// Bid-and-Ghost Detection
// -----------------------------------------------------------------------------

/**
 * Detect bid-and-ghost: Pro wins a bid but never starts the work
 * or goes unresponsive after winning.
 *
 * Triggers when:
 * - Pro has won a bid but work was never started (after reasonable window)
 * - Pro went unresponsive after winning
 *
 * This is a more serious violation than cherry-picking — results in a strike.
 */
export function detectBidAndGhost(
  bidActivity: ProBidActivity
): AntiGamingViolation | null {
  if (bidActivity.bids_won === 0) return null;

  const ghostedCount =
    bidActivity.bids_won_not_started + bidActivity.bids_won_unresponsive;

  if (ghostedCount === 0) return null;

  const ghostRate = ghostedCount / bidActivity.bids_won;
  const ghostedJobIds = bidActivity.ghosted_bids.map((b) => b.job_id);

  // Any ghosting is serious — even 1 instance gets a strike
  return {
    pro_id: bidActivity.pro_id,
    violation_type: 'bid_and_ghost',
    severity: 'visibility_reduction', // More severe than cherry-picking
    details: `Won ${bidActivity.bids_won} bids in last ${BID_AND_GHOST_LOOKBACK_DAYS} days, ghosted ${ghostedCount} (${(ghostRate * 100).toFixed(1)}%). Jobs affected: ${ghostedJobIds.join(', ')}.`,
    detected_at: new Date().toISOString(),
    evidence: {
      bids_won: bidActivity.bids_won,
      bids_ghosted: ghostedCount,
      bids_not_started: bidActivity.bids_won_not_started,
      bids_unresponsive: bidActivity.bids_won_unresponsive,
      ghost_rate: ghostRate,
      affected_jobs: ghostedJobIds.join(','),
    },
  };
}

// -----------------------------------------------------------------------------
// Rating Manipulation Detection (Future)
// -----------------------------------------------------------------------------

/**
 * Placeholder for rating manipulation detection.
 * Will detect:
 * - Suspicious patterns of 5-star reviews from new accounts
 * - Review velocity anomalies (many reviews in short time)
 * - Cross-rating rings (groups of Pros rating each other)
 * - Text similarity in reviews suggesting fake/templated reviews
 *
 * This requires the rating/review data model to be built first.
 */
export function detectRatingManipulation(
  _proId: string
): AntiGamingViolation | null {
  // TODO: Implement when rating/review data model is available
  // This will use statistical analysis on review patterns:
  // 1. Review velocity — more than N reviews per day = suspicious
  // 2. Reviewer account age — new accounts leaving reviews = flag
  // 3. Review text similarity — NLP clustering on review content
  // 4. Cross-rating detection — graph analysis on reviewer networks
  return null;
}

// -----------------------------------------------------------------------------
// Strike Escalation
// -----------------------------------------------------------------------------

/**
 * Determine the appropriate strike level based on violation history.
 * Escalation: warning → visibility_reduction → pause → deactivation
 */
export function determineStrikeLevel(
  strikeHistory: ProStrikeHistory,
  newViolationType: ViolationType
): StrikeLevel {
  const currentStrikes = strikeHistory.active_strikes;

  // Bid-and-ghost starts at visibility_reduction minimum
  if (newViolationType === 'bid_and_ghost') {
    const baseIndex = STRIKE_ESCALATION.indexOf('visibility_reduction');
    const escalatedIndex = Math.min(
      baseIndex + currentStrikes,
      STRIKE_ESCALATION.length - 1
    );
    return STRIKE_ESCALATION[escalatedIndex];
  }

  // Rating manipulation starts at pause minimum
  if (newViolationType === 'rating_manipulation') {
    const baseIndex = STRIKE_ESCALATION.indexOf('pause');
    const escalatedIndex = Math.min(
      baseIndex + currentStrikes,
      STRIKE_ESCALATION.length - 1
    );
    return STRIKE_ESCALATION[escalatedIndex];
  }

  // Cherry-picking follows normal escalation
  const escalatedIndex = Math.min(
    currentStrikes,
    STRIKE_ESCALATION.length - 1
  );
  return STRIKE_ESCALATION[escalatedIndex];
}

// -----------------------------------------------------------------------------
// Main Detection Function
// -----------------------------------------------------------------------------

/**
 * Run all anti-gaming checks for a Pro and produce a report.
 *
 * @param proId - Pro to check
 * @param pro - Pro profile (for trade context)
 * @param dispatchActivity - Dispatch/decline data from last 30 days
 * @param bidActivity - Bid win/ghost data from last 90 days
 * @param strikeHistory - Existing strike history
 * @returns Full anti-gaming report
 */
export function detectAntiGaming(
  proId: string,
  pro: ProProfile,
  dispatchActivity: ProDispatchActivity,
  bidActivity: ProBidActivity,
  strikeHistory: ProStrikeHistory
): AntiGamingReport {
  const violations: AntiGamingViolation[] = [];

  // Cherry-picking check
  const cherryPick = detectCherryPicking(dispatchActivity, pro);
  if (cherryPick) {
    cherryPick.severity = determineStrikeLevel(
      strikeHistory,
      'cherry_picking'
    );
    violations.push(cherryPick);
  }

  // Bid-and-ghost check
  const bidGhost = detectBidAndGhost(bidActivity);
  if (bidGhost) {
    bidGhost.severity = determineStrikeLevel(
      strikeHistory,
      'bid_and_ghost'
    );
    violations.push(bidGhost);
  }

  // Rating manipulation check (placeholder)
  const ratingManip = detectRatingManipulation(proId);
  if (ratingManip) {
    ratingManip.severity = determineStrikeLevel(
      strikeHistory,
      'rating_manipulation'
    );
    violations.push(ratingManip);
  }

  // Determine overall strike level
  const highestSeverity = violations.length > 0
    ? violations.reduce((highest, v) => {
        const currentIdx = STRIKE_ESCALATION.indexOf(v.severity);
        const highestIdx = STRIKE_ESCALATION.indexOf(highest);
        return currentIdx > highestIdx ? v.severity : highest;
      }, 'warning' as StrikeLevel)
    : null;

  return {
    pro_id: proId,
    violations,
    current_strike_level: highestSeverity,
    total_strikes: strikeHistory.active_strikes + violations.length,
    is_clean: violations.length === 0,
    checked_at: new Date().toISOString(),
  };
}
