/**
 * Sherpa Pros Platform — Emergency-Specific Pricing Engine
 *
 * Provides price ranges for emergency restoration work with severity-based
 * multipliers and after-hours surcharges. Falls back to hardcoded regional
 * ranges when Pricing Wiseman is unavailable.
 *
 * ALL monetary values are INTEGER CENTS. $1.00 = 100 cents.
 */

import type {
  EmergencyCategory,
  EmergencySeverity,
  EmergencyPriceEstimate,
  PriceRangeCents,
} from './types';

// ---------------------------------------------------------------------------
// Base Price Ranges (cents) — Manchester NH baseline
// ---------------------------------------------------------------------------

interface CategoryPriceRanges {
  [scope: string]: PriceRangeCents;
}

const BASE_RANGES: Record<EmergencyCategory, CategoryPriceRanges> = {
  water_damage: {
    mitigation: { min_cents: 300_000, max_cents: 800_000 },
    restoration: { min_cents: 1_500_000, max_cents: 5_000_000 },
  },
  fire_smoke: {
    mitigation: { min_cents: 500_000, max_cents: 1_500_000 },
    restoration: { min_cents: 2_000_000, max_cents: 10_000_000 },
  },
  storm: {
    mitigation: { min_cents: 200_000, max_cents: 1_000_000 },
    restoration: { min_cents: 500_000, max_cents: 3_000_000 },
  },
  hvac: {
    emergency_repair: { min_cents: 50_000, max_cents: 200_000 },
  },
  electrical: {
    emergency_repair: { min_cents: 30_000, max_cents: 150_000 },
  },
  gas_leak: {
    emergency_repair: { min_cents: 20_000, max_cents: 80_000 },
  },
  structural: {
    assessment: { min_cents: 50_000, max_cents: 200_000 },
    repair: { min_cents: 500_000, max_cents: 5_000_000 },
  },
};

// ---------------------------------------------------------------------------
// Multipliers & Surcharges
// ---------------------------------------------------------------------------

const SEVERITY_MULTIPLIERS: Record<EmergencySeverity, number> = {
  critical: 2.0,
  urgent: 1.5,
  same_day: 1.0,
};

/**
 * After-hours surcharge in cents. Applied when the call comes in
 * outside of standard business hours (7 AM - 6 PM).
 */
const AFTER_HOURS_SURCHARGE_RANGE: PriceRangeCents = {
  min_cents: 15_000, // $150
  max_cents: 35_000, // $350
};

/**
 * Square-footage-based scaling factors.
 * Larger affected areas scale the price range proportionally.
 */
const SF_SCALING_BRACKETS: { maxSF: number; multiplier: number }[] = [
  { maxSF: 500, multiplier: 1.0 },
  { maxSF: 1000, multiplier: 1.5 },
  { maxSF: 2000, multiplier: 2.0 },
  { maxSF: 5000, multiplier: 3.0 },
  { maxSF: Infinity, multiplier: 4.5 },
];

/**
 * Location-based cost multipliers relative to Manchester NH (1.0 baseline).
 */
const LOCATION_COST_MULTIPLIERS: Record<string, number> = {
  boston: 1.35,
  cambridge: 1.35,
  manchester_nh: 1.0,
  portsmouth_nh: 1.08,
  nashua_nh: 1.05,
  concord_nh: 0.95,
  portland_me: 1.02,
  burlington_vt: 0.98,
  providence_ri: 1.12,
  worcester_ma: 1.15,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns an estimated price range for an emergency job.
 *
 * Calculation:
 * 1. Look up base range for category (combined if multiple scopes)
 * 2. Apply square footage scaling if provided
 * 3. Apply severity multiplier (critical=2x, urgent=1.5x, same_day=1x)
 * 4. Apply location adjustment if provided
 * 5. Add after-hours surcharge if applicable
 *
 * @param category - Type of emergency
 * @param severity - How urgent the response needs to be
 * @param squareFootage - Affected area in SF (optional)
 * @param location - Geographic location (optional, defaults to Manchester NH)
 * @param currentHour - Current hour in 24h format for after-hours calc (optional)
 */
export function getEmergencyPriceRange(
  category: EmergencyCategory,
  severity: EmergencySeverity,
  squareFootage?: number,
  location?: string,
  currentHour?: number
): EmergencyPriceEstimate {
  const categoryRanges = BASE_RANGES[category];
  if (!categoryRanges) {
    throw new Error(`Unknown emergency category: ${category}`);
  }

  // Combine all scopes for total range
  const baseRange = combineRanges(Object.values(categoryRanges));

  // Square footage scaling
  const sfMultiplier = squareFootage
    ? getSFMultiplier(squareFootage)
    : 1.0;

  // Severity multiplier
  const emergencyMultiplier = SEVERITY_MULTIPLIERS[severity];

  // Location multiplier
  const locationMultiplier = location
    ? getLocationMultiplier(location)
    : 1.0;

  // Combined scaling
  const combinedMultiplier = sfMultiplier * emergencyMultiplier * locationMultiplier;

  const adjustedMin = Math.round(baseRange.min_cents * combinedMultiplier);
  const adjustedMax = Math.round(baseRange.max_cents * combinedMultiplier);

  // After-hours surcharge
  const afterHoursSurchargeCents = isAfterHours(currentHour)
    ? Math.round(
        (AFTER_HOURS_SURCHARGE_RANGE.min_cents +
          AFTER_HOURS_SURCHARGE_RANGE.max_cents) /
          2
      )
    : 0;

  return {
    category,
    severity,
    base_range: baseRange,
    emergency_multiplier: emergencyMultiplier,
    after_hours_surcharge_cents: afterHoursSurchargeCents,
    adjusted_range: {
      min_cents: adjustedMin + afterHoursSurchargeCents,
      max_cents: adjustedMax + afterHoursSurchargeCents,
    },
    square_footage: squareFootage,
    location,
  };
}

/**
 * Returns just the emergency multiplier for a given severity level.
 * Useful for applying to existing estimates.
 */
export function getEmergencyMultiplier(severity: EmergencySeverity): number {
  return SEVERITY_MULTIPLIERS[severity];
}

/**
 * Returns the after-hours surcharge range in cents.
 */
export function getAfterHoursSurchargeRange(): PriceRangeCents {
  return { ...AFTER_HOURS_SURCHARGE_RANGE };
}

/**
 * Determines if a given hour (0-23) falls outside business hours (7 AM - 6 PM).
 * Returns true if after hours, false otherwise.
 * If no hour provided, returns false (assume business hours).
 */
export function isAfterHours(hour?: number): boolean {
  if (hour === undefined || hour === null) return false;
  return hour < 7 || hour >= 18;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Combines multiple price ranges by taking the overall min and max.
 */
function combineRanges(ranges: PriceRangeCents[]): PriceRangeCents {
  if (ranges.length === 0) {
    return { min_cents: 0, max_cents: 0 };
  }

  return {
    min_cents: Math.min(...ranges.map((r) => r.min_cents)),
    max_cents: Math.max(...ranges.map((r) => r.max_cents)),
  };
}

function getSFMultiplier(squareFootage: number): number {
  for (const bracket of SF_SCALING_BRACKETS) {
    if (squareFootage <= bracket.maxSF) {
      return bracket.multiplier;
    }
  }
  return SF_SCALING_BRACKETS[SF_SCALING_BRACKETS.length - 1].multiplier;
}

function getLocationMultiplier(location: string): number {
  const normalized = location.toLowerCase().replace(/[^a-z]/g, '_');
  for (const [key, multiplier] of Object.entries(LOCATION_COST_MULTIPLIERS)) {
    if (normalized.includes(key.replace('_', '')) || normalized.includes(key)) {
      return multiplier;
    }
  }
  return 1.0; // default to Manchester NH baseline
}
