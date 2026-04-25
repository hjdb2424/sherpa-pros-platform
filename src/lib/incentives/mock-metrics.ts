/**
 * Mock Pro Metrics for Sherpa Score
 *
 * Generates realistic metrics for all 70 seeded pros, consistent with
 * their existing rating/tier data.
 */

import { SEEDED_PROS, type SeededPro } from '@/lib/mock-data/seeded-pros';
import {
  type ProMetrics,
  type SherpaScore,
  calculateSherpaScore,
} from './sherpa-score';

// ── Seeded random ───────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randBetween(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

// ── Metric generation ───────────────────────────────────────────────────

function generateMetrics(pro: SeededPro): ProMetrics {
  const id = parseInt(pro.id.replace(/\D/g, ''), 10) || 1;
  const rng = seededRandom(id * 7919);

  // Base quality range by tier
  const tierRanges = {
    gold: { min: 0.88, max: 0.99 },
    silver: { min: 0.72, max: 0.89 },
    bronze: { min: 0.55, max: 0.74 },
  };
  const range = tierRanges[pro.tier];

  // Quality metrics
  const jobCompletionRate = randBetween(rng, range.min, range.max);
  const inspectionPassRate = randBetween(rng, range.min * 0.95, range.max);
  // Use existing rating as a strong anchor for client satisfaction
  const clientSatisfaction = Math.min(5, Math.max(1, pro.rating + randBetween(rng, -0.3, 0.2)));
  const reworkRate = pro.tier === 'gold'
    ? randBetween(rng, 0.01, 0.05)
    : pro.tier === 'silver'
      ? randBetween(rng, 0.04, 0.12)
      : randBetween(rng, 0.08, 0.2);

  // Communication metrics
  const jobResponseTimeMinutes = pro.tier === 'gold'
    ? randBetween(rng, 8, 35)
    : pro.tier === 'silver'
      ? randBetween(rng, 25, 90)
      : randBetween(rng, 45, 300);

  const messageResponseTimeMinutes = pro.tier === 'gold'
    ? randBetween(rng, 5, 20)
    : pro.tier === 'silver'
      ? randBetween(rng, 15, 75)
      : randBetween(rng, 30, 300);

  const scheduleAdherence = randBetween(rng, range.min * 0.92, range.max);
  const clientCommRating = Math.min(5, Math.max(1, pro.rating + randBetween(rng, -0.4, 0.3)));

  // Review metrics
  const reviewRate = pro.tier === 'gold'
    ? randBetween(rng, 0.7, 0.95)
    : pro.tier === 'silver'
      ? randBetween(rng, 0.5, 0.75)
      : randBetween(rng, 0.25, 0.55);

  const averageRating = Math.min(5, Math.max(1, pro.rating + randBetween(rng, -0.2, 0.1)));
  const reviewConsistency = pro.tier === 'gold'
    ? randBetween(rng, 0.5, 1.5)
    : pro.tier === 'silver'
      ? randBetween(rng, 1.5, 3.0)
      : randBetween(rng, 2.5, 5.5);

  const photoDocumentation = pro.tier === 'gold'
    ? randBetween(rng, 0.7, 0.95)
    : pro.tier === 'silver'
      ? randBetween(rng, 0.4, 0.7)
      : randBetween(rng, 0.15, 0.45);

  return {
    proId: pro.id,
    quality: {
      jobCompletionRate,
      inspectionPassRate,
      clientSatisfaction,
      reworkRate,
    },
    communication: {
      jobResponseTimeMinutes,
      messageResponseTimeMinutes,
      scheduleAdherence,
      clientCommRating,
    },
    reviews: {
      reviewRate,
      averageRating,
      reviewConsistency,
      photoDocumentation,
    },
  };
}

// ── Cached computed scores ──────────────────────────────────────────────

export interface ProScoreEntry {
  pro: SeededPro;
  metrics: ProMetrics;
  score: SherpaScore;
}

let _cache: ProScoreEntry[] | null = null;

/** Get Sherpa Score data for all 70 seeded pros */
export function getAllProScores(): ProScoreEntry[] {
  if (_cache) return _cache;

  _cache = SEEDED_PROS.map((pro) => {
    const metrics = generateMetrics(pro);
    const score = calculateSherpaScore(metrics);
    return { pro, metrics, score };
  });

  return _cache;
}

/** Get Sherpa Score data for a single pro by ID */
export function getProScore(proId: string): ProScoreEntry | undefined {
  return getAllProScores().find((e) => e.pro.id === proId);
}

/** Get the Sherpa Score number for a pro by ID (for display on cards) */
export function getProScoreNumber(proId: string): number {
  const entry = getProScore(proId);
  return entry?.score.overall ?? 0;
}

/** Get the demo pro score (sp-001 Marcus Rivera, used on the pro dashboard) */
export function getDemoProScore(): ProScoreEntry {
  const entry = getProScore('sp-001');
  if (!entry) throw new Error('Demo pro sp-001 not found');
  return entry;
}
