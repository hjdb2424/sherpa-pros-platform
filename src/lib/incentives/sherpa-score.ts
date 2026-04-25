/**
 * Sherpa Score Engine
 *
 * Composite score (0-100) measuring pro quality, communication, and reviews.
 * Used for tier placement, service fee calculation, and priority matching.
 */

// ── Types ───────────────────────────────────────────────────────────────

export interface QualityMetrics {
  /** completions / accepted jobs (0-1) */
  jobCompletionRate: number;
  /** first-time inspection passes without callback (0-1) */
  inspectionPassRate: number;
  /** average post-job rating 1-5 */
  clientSatisfaction: number;
  /** callbacks within 30 days as fraction (0-1), penalty */
  reworkRate: number;
}

export interface CommunicationMetrics {
  /** minutes from notification to first action */
  jobResponseTimeMinutes: number;
  /** average reply latency in minutes */
  messageResponseTimeMinutes: number;
  /** showed up within promised window (0-1) */
  scheduleAdherence: number;
  /** post-job communication sub-rating 1-5 */
  clientCommRating: number;
}

export interface ReviewMetrics {
  /** percentage of completed jobs with a client review (0-1) */
  reviewRate: number;
  /** weighted toward recent 90 days, 1-5 scale */
  averageRating: number;
  /** monthly review count standard deviation (lower = better) */
  reviewConsistency: number;
  /** percentage of jobs with before/after photos (0-1) */
  photoDocumentation: number;
}

export interface ProMetrics {
  proId: string;
  quality: QualityMetrics;
  communication: CommunicationMetrics;
  reviews: ReviewMetrics;
}

export interface PillarBreakdown {
  name: string;
  weight: number;
  score: number;
  metrics: { label: string; key: string; value: number; raw: string }[];
}

export interface SherpaScore {
  overall: number;
  tier: 'gold' | 'silver' | 'bronze';
  serviceFee: number;
  pillars: PillarBreakdown[];
  nextTier: { nextTier: string; pointsNeeded: number; topMetricToImprove: string } | null;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

/** Normalize a 1-5 rating to 0-100 */
function normalize1to5(rating: number): number {
  return clamp(((rating - 1) / 4) * 100);
}

/** Score job response time: <30min = 100, <60min = 80, <120min = 60, else scales down */
function scoreJobResponseTime(minutes: number): number {
  if (minutes <= 30) return 100;
  if (minutes <= 60) return 80;
  if (minutes <= 120) return 60;
  if (minutes <= 240) return 40;
  return 20;
}

/** Score message response time: <15min=100, <60min=80, <240min=60, else 40 */
function scoreMessageResponseTime(minutes: number): number {
  if (minutes <= 15) return 100;
  if (minutes <= 60) return 80;
  if (minutes <= 240) return 60;
  return 40;
}

/** Score review consistency (std dev of monthly counts): lower = better */
function scoreReviewConsistency(stdDev: number): number {
  if (stdDev <= 1) return 100;
  if (stdDev <= 2) return 85;
  if (stdDev <= 3) return 70;
  if (stdDev <= 5) return 50;
  return 30;
}

// ── Pillar Calculators ──────────────────────────────────────────────────

function calcQuality(q: QualityMetrics): PillarBreakdown {
  const completionScore = clamp(q.jobCompletionRate * 100);
  const inspectionScore = clamp(q.inspectionPassRate * 100);
  const satisfactionScore = normalize1to5(q.clientSatisfaction);
  const reworkPenalty = clamp(q.reworkRate * 100);
  const reworkScore = clamp(100 - reworkPenalty);

  const pillarScore = Math.round(
    (completionScore + inspectionScore + satisfactionScore + reworkScore) / 4
  );

  return {
    name: 'Quality',
    weight: 0.5,
    score: pillarScore,
    metrics: [
      { label: 'Job Completion Rate', key: 'jobCompletionRate', value: Math.round(completionScore), raw: `${(q.jobCompletionRate * 100).toFixed(0)}%` },
      { label: 'Inspection Pass Rate', key: 'inspectionPassRate', value: Math.round(inspectionScore), raw: `${(q.inspectionPassRate * 100).toFixed(0)}%` },
      { label: 'Client Satisfaction', key: 'clientSatisfaction', value: Math.round(satisfactionScore), raw: `${q.clientSatisfaction.toFixed(1)}/5` },
      { label: 'Rework Rate', key: 'reworkRate', value: Math.round(reworkScore), raw: `${(q.reworkRate * 100).toFixed(1)}%` },
    ],
  };
}

function calcCommunication(c: CommunicationMetrics): PillarBreakdown {
  const jobResponseScore = scoreJobResponseTime(c.jobResponseTimeMinutes);
  const msgResponseScore = scoreMessageResponseTime(c.messageResponseTimeMinutes);
  const adherenceScore = clamp(c.scheduleAdherence * 100);
  const commRatingScore = normalize1to5(c.clientCommRating);

  const pillarScore = Math.round(
    (jobResponseScore + msgResponseScore + adherenceScore + commRatingScore) / 4
  );

  return {
    name: 'Communication',
    weight: 0.25,
    score: pillarScore,
    metrics: [
      { label: 'Job Response Time', key: 'jobResponseTime', value: jobResponseScore, raw: `${c.jobResponseTimeMinutes} min` },
      { label: 'Message Response Time', key: 'messageResponseTime', value: msgResponseScore, raw: `${c.messageResponseTimeMinutes} min` },
      { label: 'Schedule Adherence', key: 'scheduleAdherence', value: Math.round(adherenceScore), raw: `${(c.scheduleAdherence * 100).toFixed(0)}%` },
      { label: 'Communication Rating', key: 'clientCommRating', value: Math.round(commRatingScore), raw: `${c.clientCommRating.toFixed(1)}/5` },
    ],
  };
}

function calcReviews(r: ReviewMetrics): PillarBreakdown {
  const reviewRateScore = clamp(r.reviewRate * 100);
  const avgRatingScore = normalize1to5(r.averageRating);
  const consistencyScore = scoreReviewConsistency(r.reviewConsistency);
  const photoScore = clamp(r.photoDocumentation * 100);

  const pillarScore = Math.round(
    (reviewRateScore + avgRatingScore + consistencyScore + photoScore) / 4
  );

  return {
    name: 'Reviews',
    weight: 0.25,
    score: pillarScore,
    metrics: [
      { label: 'Review Rate', key: 'reviewRate', value: Math.round(reviewRateScore), raw: `${(r.reviewRate * 100).toFixed(0)}%` },
      { label: 'Average Rating', key: 'averageRating', value: Math.round(avgRatingScore), raw: `${r.averageRating.toFixed(1)}/5` },
      { label: 'Review Consistency', key: 'reviewConsistency', value: consistencyScore, raw: `${r.reviewConsistency.toFixed(1)} std dev` },
      { label: 'Photo Documentation', key: 'photoDocumentation', value: Math.round(photoScore), raw: `${(r.photoDocumentation * 100).toFixed(0)}%` },
    ],
  };
}

// ── Public API ───────────────────────────────────────────────────────────

export function getTier(score: number): 'gold' | 'silver' | 'bronze' {
  if (score >= 80) return 'gold';
  if (score >= 60) return 'silver';
  return 'bronze';
}

export function getServiceFee(tier: string): number {
  if (tier === 'gold') return 8;
  return 12;
}

export function getNextTierGap(
  score: number,
  pillars?: PillarBreakdown[]
): { nextTier: string; pointsNeeded: number; topMetricToImprove: string } {
  const tier = getTier(score);

  if (tier === 'gold') {
    return { nextTier: 'gold', pointsNeeded: 0, topMetricToImprove: 'none' };
  }

  const nextTierThreshold = tier === 'silver' ? 80 : 60;
  const nextTierName = tier === 'silver' ? 'Gold' : 'Silver';
  const pointsNeeded = nextTierThreshold - Math.floor(score);

  // Find the lowest-scoring metric across all pillars to suggest improvement
  let topMetricToImprove = 'Overall performance';
  let lowestScore = 101;

  if (pillars) {
    for (const pillar of pillars) {
      for (const metric of pillar.metrics) {
        if (metric.value < lowestScore) {
          lowestScore = metric.value;
          topMetricToImprove = metric.label;
        }
      }
    }
  }

  return { nextTier: nextTierName, pointsNeeded, topMetricToImprove };
}

export function calculateSherpaScore(metrics: ProMetrics): SherpaScore {
  const qualityPillar = calcQuality(metrics.quality);
  const commPillar = calcCommunication(metrics.communication);
  const reviewPillar = calcReviews(metrics.reviews);

  const pillars = [qualityPillar, commPillar, reviewPillar];

  const overall = Math.round(
    qualityPillar.score * qualityPillar.weight +
    commPillar.score * commPillar.weight +
    reviewPillar.score * reviewPillar.weight
  );

  const tier = getTier(overall);
  const serviceFee = getServiceFee(tier);
  const nextTier = tier === 'gold' ? null : getNextTierGap(overall, pillars);

  return {
    overall,
    tier,
    serviceFee,
    pillars,
    nextTier,
  };
}

/** Generate an improvement suggestion for a metric */
export function getImprovementSuggestion(
  metricKey: string,
  value: number
): string {
  const suggestions: Record<string, string> = {
    jobCompletionRate: 'Complete more accepted jobs to boost your completion rate.',
    inspectionPassRate: 'Double-check your work before calling for inspection to pass first time.',
    clientSatisfaction: 'Follow up with clients after each job to improve satisfaction scores.',
    reworkRate: 'Reduce callbacks by doing a final walkthrough before leaving the job site.',
    jobResponseTime: 'Respond to new jobs within 30 minutes to maximize this metric.',
    messageResponseTime: 'Reply to client messages within 15 minutes for a perfect score.',
    scheduleAdherence: 'Arrive within your promised time window to improve schedule adherence.',
    clientCommRating: 'Keep clients updated throughout the job with progress messages.',
    reviewRate: 'Politely ask clients to leave a review after completing their job.',
    averageRating: 'Focus on quality and communication to earn higher ratings.',
    reviewConsistency: 'Maintain a steady flow of completed jobs each month.',
    photoDocumentation: 'Take before/after photos on every job to showcase your work.',
  };

  return suggestions[metricKey] ?? 'Keep up the good work and focus on consistent quality.';
}

/** Estimate points gained from improving a specific metric */
export function estimatePointsGain(
  metricKey: string,
  currentValue: number,
  pillarName: string
): number {
  const targetValue = Math.min(currentValue + 20, 100);
  const gain = targetValue - currentValue;
  const pillarWeight = pillarName === 'Quality' ? 0.5 : 0.25;
  // Each metric is 1/4 of its pillar
  return Math.round((gain * pillarWeight) / 4);
}
