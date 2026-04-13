// =============================================================================
// Dispatch Wiseman — Scoring Algorithm
// 7-factor weighted scoring with new user boost
// =============================================================================

import type {
  ProProfile,
  JobPosting,
  ClientProHistory,
  ProDistanceInput,
  ScoringWeights,
  FactorBreakdown,
  DispatchScore,
  AvailabilityStatus,
  TradeCategory,
} from './types';

// -----------------------------------------------------------------------------
// Default Weights — sum to 1.0
// -----------------------------------------------------------------------------

export const DEFAULT_WEIGHTS: ScoringWeights = {
  pro_rating: 0.25,
  distance: 0.20,
  skills_match: 0.20,
  availability: 0.15,
  response_history: 0.10,
  hub_load_balance: 0.05,
  client_preference: 0.05,
};

// -----------------------------------------------------------------------------
// Adjacent Trade Map — trades that partially qualify for each other
// -----------------------------------------------------------------------------

const ADJACENT_TRADES: Record<TradeCategory, TradeCategory[]> = {
  plumbing: ['hvac', 'water_damage'],
  electrical: ['hvac', 'appliance_repair'],
  hvac: ['plumbing', 'electrical'],
  carpentry: ['cabinetry', 'decking', 'fencing', 'windows_doors', 'drywall'],
  painting: ['drywall', 'siding'],
  roofing: ['siding', 'gutters'],
  flooring: ['tile', 'carpentry'],
  landscaping: ['fencing', 'decking', 'concrete'],
  general_handyman: [
    'carpentry', 'painting', 'drywall', 'flooring', 'tile',
    'fencing', 'decking', 'appliance_repair', 'cleaning',
  ],
  masonry: ['concrete', 'tile'],
  drywall: ['painting', 'insulation', 'carpentry'],
  insulation: ['drywall', 'siding', 'hvac'],
  siding: ['roofing', 'painting', 'insulation'],
  gutters: ['roofing', 'siding'],
  windows_doors: ['carpentry', 'siding'],
  appliance_repair: ['electrical', 'plumbing'],
  pest_control: [],
  cleaning: ['general_handyman'],
  moving: [],
  demolition: ['concrete', 'carpentry'],
  concrete: ['masonry', 'landscaping', 'demolition'],
  fencing: ['carpentry', 'landscaping', 'decking'],
  decking: ['carpentry', 'fencing'],
  tile: ['flooring', 'masonry'],
  cabinetry: ['carpentry', 'countertops'],
  countertops: ['cabinetry', 'tile'],
  water_damage: ['plumbing', 'mold_remediation', 'fire_damage'],
  fire_damage: ['water_damage', 'demolition'],
  mold_remediation: ['water_damage', 'insulation'],
};

// -----------------------------------------------------------------------------
// Factor Normalization Functions
// -----------------------------------------------------------------------------

/**
 * Normalize Pro rating (0-500 scale) to 0-1.
 * Uses square root normalization to reward higher ratings more linearly.
 */
export function normalizeRating(rating: number): number {
  const clamped = Math.max(0, Math.min(500, rating));
  return clamped / 500;
}

/**
 * Normalize distance (in minutes) to a score.
 * Closer = higher score. Step function with defined brackets.
 *
 * 0-15 min  = 1.0
 * 15-30 min = 0.8
 * 30-60 min = 0.5
 * 60+ min   = 0.2
 */
export function normalizeDistance(distanceMinutes: number): number {
  if (distanceMinutes < 0) return 1.0;
  if (distanceMinutes <= 15) return 1.0;
  if (distanceMinutes <= 30) return 0.8;
  if (distanceMinutes <= 60) return 0.5;
  return 0.2;
}

/**
 * Score skills match between Pro trades and job category.
 *
 * Exact match    = 1.0
 * Adjacent trade = 0.6
 * General only   = 0.3
 * No match       = 0.0
 */
export function normalizeSkillsMatch(
  proTrades: TradeCategory[],
  jobCategory: TradeCategory
): number {
  // Exact match — Pro has the exact trade
  if (proTrades.includes(jobCategory)) {
    return 1.0;
  }

  // Adjacent match — Pro has a related trade
  const adjacentToJob = ADJACENT_TRADES[jobCategory] || [];
  const hasAdjacent = proTrades.some((trade) => adjacentToJob.includes(trade));
  if (hasAdjacent) {
    return 0.6;
  }

  // General handyman can do basic work in any category
  if (proTrades.includes('general_handyman')) {
    return 0.3;
  }

  return 0.0;
}

/**
 * Normalize availability status to a score.
 *
 * available = 1.0
 * partial   = 0.5
 * booked    = 0.0
 */
export function normalizeAvailability(status: AvailabilityStatus): number {
  switch (status) {
    case 'available':
      return 1.0;
    case 'partial':
      return 0.5;
    case 'booked':
      return 0.0;
    default:
      return 0.0;
  }
}

/**
 * Normalize response history to a score.
 * Best case: >80% accept rate and <5min avg response = 1.0
 * Decays based on both factors.
 */
export function normalizeResponseHistory(
  acceptRate: number,
  avgResponseMinutes: number
): number {
  // Accept rate component (0-1): linear scale, 80%+ = full credit
  const acceptScore = acceptRate >= 80
    ? 1.0
    : acceptRate / 80;

  // Response speed component (0-1): <5min = 1.0, decays to 0.2 at 60min
  let speedScore: number;
  if (avgResponseMinutes <= 5) {
    speedScore = 1.0;
  } else if (avgResponseMinutes <= 15) {
    speedScore = 0.8;
  } else if (avgResponseMinutes <= 30) {
    speedScore = 0.5;
  } else if (avgResponseMinutes <= 60) {
    speedScore = 0.3;
  } else {
    speedScore = 0.2;
  }

  // Combined: 70% weight on accept rate, 30% on speed
  return acceptScore * 0.7 + speedScore * 0.3;
}

/**
 * Hub load balance score based on active job count.
 *
 * < 3 active jobs = 1.0
 * 3-5 active jobs = 0.7
 * 5+ active jobs  = 0.3
 */
export function normalizeHubLoadBalance(activeJobs: number): number {
  if (activeJobs < 3) return 1.0;
  if (activeJobs <= 5) return 0.7;
  return 0.3;
}

/**
 * Client preference score.
 * Returns 1.5 if the client has previously hired this Pro (boost multiplier).
 * Returns 1.0 otherwise (neutral — no penalty for new relationships).
 */
export function normalizeClientPreference(
  history: ClientProHistory | null
): number {
  if (!history) return 1.0;

  // Previously hired = 1.5x boost
  if (history.times_hired > 0) {
    return 1.5;
  }

  // Favorited but never hired = slight boost
  if (history.is_favorited) {
    return 1.2;
  }

  return 1.0;
}

// -----------------------------------------------------------------------------
// New User Boost
// -----------------------------------------------------------------------------

/**
 * Calculate new user boost multiplier.
 * First 60 days: 1.3x, linear taper to 1.0x at day 60.
 * After 60 days: 1.0x (no boost).
 */
export function calculateNewUserBoost(activatedAt: string, now?: Date): number {
  const activationDate = new Date(activatedAt);
  const currentDate = now || new Date();
  const daysSinceActivation = Math.floor(
    (currentDate.getTime() - activationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceActivation < 0) {
    // Future activation date — treat as day 0 (full boost)
    return 1.3;
  }

  if (daysSinceActivation >= 60) {
    return 1.0;
  }

  // Linear taper: 1.3 at day 0 → 1.0 at day 60
  const boostDecay = (daysSinceActivation / 60) * 0.3;
  return 1.3 - boostDecay;
}

// -----------------------------------------------------------------------------
// Main Scoring Function
// -----------------------------------------------------------------------------

/**
 * Calculate the full dispatch score for a single Pro against a job.
 *
 * @param pro - Pro profile
 * @param job - Job posting
 * @param distanceInput - Pre-computed distance in minutes (PostGIS will provide this later)
 * @param clientHistory - Optional history between client and this Pro
 * @param weights - Scoring weights (defaults to DEFAULT_WEIGHTS)
 * @param now - Current date for new user boost calculation
 * @returns Full score breakdown without rank (rank assigned by rankPros)
 */
export function calculateDispatchScore(
  pro: ProProfile,
  job: JobPosting,
  distanceInput: ProDistanceInput,
  clientHistory: ClientProHistory | null = null,
  weights: ScoringWeights = DEFAULT_WEIGHTS,
  now?: Date
): Omit<DispatchScore, 'rank'> {
  // Skip inactive Pros entirely
  if (!pro.is_active) {
    return {
      pro_id: pro.id,
      total_score: 0,
      factor_breakdown: createZeroBreakdown(pro, distanceInput, now),
    };
  }

  // Normalize each factor
  const ratingNorm = normalizeRating(pro.rating);
  const distanceNorm = normalizeDistance(distanceInput.distance_minutes);
  const skillsNorm = normalizeSkillsMatch(pro.trades, job.category);
  const availabilityNorm = normalizeAvailability(pro.availability);
  const responseNorm = normalizeResponseHistory(
    pro.response_history.accept_rate,
    pro.response_history.avg_response_minutes
  );
  const loadNorm = normalizeHubLoadBalance(pro.active_jobs);
  const clientPrefNorm = normalizeClientPreference(clientHistory);

  // Calculate weighted scores
  const ratingWeighted = ratingNorm * weights.pro_rating;
  const distanceWeighted = distanceNorm * weights.distance;
  const skillsWeighted = skillsNorm * weights.skills_match;
  const availabilityWeighted = availabilityNorm * weights.availability;
  const responseWeighted = responseNorm * weights.response_history;
  const loadWeighted = loadNorm * weights.hub_load_balance;
  // Client preference is applied as a multiplier on its weighted portion
  const clientPrefWeighted = clientPrefNorm * weights.client_preference;

  // Base score (sum of weighted factors)
  const baseScore =
    ratingWeighted +
    distanceWeighted +
    skillsWeighted +
    availabilityWeighted +
    responseWeighted +
    loadWeighted +
    clientPrefWeighted;

  // New user boost
  const newUserMultiplier = calculateNewUserBoost(pro.activated_at, now);
  const daysSinceActivation = Math.floor(
    ((now || new Date()).getTime() - new Date(pro.activated_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Final score with boost applied
  const totalScore = baseScore * newUserMultiplier;

  const breakdown: FactorBreakdown = {
    pro_rating: {
      raw: pro.rating,
      normalized: ratingNorm,
      weighted: ratingWeighted,
    },
    distance: {
      raw: distanceInput.distance_minutes,
      normalized: distanceNorm,
      weighted: distanceWeighted,
    },
    skills_match: {
      raw: skillsNorm, // Already 0-1 from enum
      normalized: skillsNorm,
      weighted: skillsWeighted,
    },
    availability: {
      raw: availabilityNorm, // Already 0-1 from enum
      normalized: availabilityNorm,
      weighted: availabilityWeighted,
    },
    response_history: {
      raw: pro.response_history.accept_rate,
      normalized: responseNorm,
      weighted: responseWeighted,
    },
    hub_load_balance: {
      raw: pro.active_jobs,
      normalized: loadNorm,
      weighted: loadWeighted,
    },
    client_preference: {
      raw: clientPrefNorm,
      normalized: clientPrefNorm,
      weighted: clientPrefWeighted,
    },
    new_user_boost: {
      multiplier: newUserMultiplier,
      days_active: Math.max(0, daysSinceActivation),
    },
  };

  return {
    pro_id: pro.id,
    total_score: Math.round(totalScore * 10000) / 10000, // 4 decimal precision
    factor_breakdown: breakdown,
  };
}

// -----------------------------------------------------------------------------
// Ranking Function
// -----------------------------------------------------------------------------

/**
 * Score and rank all Pros for a given job.
 * Returns Pros sorted by total_score descending with rank assigned.
 *
 * @param pros - All candidate Pro profiles
 * @param job - The job to match against
 * @param distanceInputs - Pre-computed distances for each Pro
 * @param clientHistories - Map of pro_id → ClientProHistory
 * @param weights - Scoring weights
 * @param now - Current date
 * @returns Ranked DispatchScore array, highest score first
 */
export function rankPros(
  pros: ProProfile[],
  job: JobPosting,
  distanceInputs: ProDistanceInput[],
  clientHistories: Map<string, ClientProHistory> = new Map(),
  weights: ScoringWeights = DEFAULT_WEIGHTS,
  now?: Date
): DispatchScore[] {
  // Build distance lookup
  const distanceMap = new Map<string, ProDistanceInput>();
  for (const di of distanceInputs) {
    distanceMap.set(di.pro_id, di);
  }

  // Score each Pro
  const scores: Omit<DispatchScore, 'rank'>[] = [];

  for (const pro of pros) {
    const distanceInput = distanceMap.get(pro.id);
    if (!distanceInput) continue; // Skip Pros without distance data

    const history = clientHistories.get(pro.id) || null;
    const score = calculateDispatchScore(pro, job, distanceInput, history, weights, now);

    // Only include Pros with a positive score and skills match > 0
    if (score.total_score > 0 && score.factor_breakdown.skills_match.normalized > 0) {
      scores.push(score);
    }
  }

  // Sort descending by total_score
  scores.sort((a, b) => b.total_score - a.total_score);

  // Assign ranks (1-based)
  return scores.map((score, index) => ({
    ...score,
    rank: index + 1,
  }));
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function createZeroBreakdown(
  pro: ProProfile,
  distanceInput: ProDistanceInput,
  now?: Date
): FactorBreakdown {
  const daysSinceActivation = Math.floor(
    ((now || new Date()).getTime() - new Date(pro.activated_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    pro_rating: { raw: pro.rating, normalized: 0, weighted: 0 },
    distance: { raw: distanceInput.distance_minutes, normalized: 0, weighted: 0 },
    skills_match: { raw: 0, normalized: 0, weighted: 0 },
    availability: { raw: 0, normalized: 0, weighted: 0 },
    response_history: { raw: pro.response_history.accept_rate, normalized: 0, weighted: 0 },
    hub_load_balance: { raw: pro.active_jobs, normalized: 0, weighted: 0 },
    client_preference: { raw: 0, normalized: 0, weighted: 0 },
    new_user_boost: { multiplier: 1.0, days_active: Math.max(0, daysSinceActivation) },
  };
}
