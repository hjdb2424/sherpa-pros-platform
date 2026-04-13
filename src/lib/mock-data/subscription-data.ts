/**
 * Sherpa Pros Platform — Mock Subscription Data
 *
 * Sample data for development: a Pro with Emergency Ready subscription,
 * SLA response history, and plan comparison stats.
 */

import type {
  ProSubscription,
  SLAResponseRecord,
  SLAComplianceReport,
  SubscriptionTier,
} from '@/lib/subscriptions/types';
import { SLA_WINDOWS } from '@/lib/subscriptions/types';

// ---------------------------------------------------------------------------
// Mock Pro Subscription (Emergency Ready)
// ---------------------------------------------------------------------------

export const mockSubscription: ProSubscription = {
  id: 'sub_mock_001',
  proId: 'pro-001',
  tier: 'emergency_ready',
  status: 'active',
  stripeSubscriptionId: 'sub_stripe_mock_001',
  stripeCustomerId: 'cus_mock_001',
  currentPeriodStart: '2026-03-12T00:00:00Z',
  currentPeriodEnd: '2026-04-12T00:00:00Z',
  cancelAtPeriodEnd: false,
  createdAt: '2025-11-01T00:00:00Z',
  updatedAt: '2026-03-12T00:00:00Z',
};

// ---------------------------------------------------------------------------
// Mock SLA Response History (last 20 responses)
// ---------------------------------------------------------------------------

function makeResponse(
  index: number,
  daysAgo: number,
  responseMinutes: number,
  tier: SubscriptionTier = 'emergency_ready',
): SLAResponseRecord {
  const dispatched = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const responded = new Date(dispatched.getTime() + responseMinutes * 60 * 1000);
  const slaWindow = SLA_WINDOWS[tier as keyof typeof SLA_WINDOWS] ?? 240;

  return {
    id: `sla_mock_${String(index).padStart(3, '0')}`,
    proId: 'pro-001',
    jobId: `job-sla-${String(index).padStart(3, '0')}`,
    dispatchedAt: dispatched.toISOString(),
    respondedAt: responded.toISOString(),
    responseTimeMinutes: responseMinutes,
    withinSLA: responseMinutes <= slaWindow,
    slaWindowMinutes: slaWindow,
  };
}

export const mockSLAResponses: SLAResponseRecord[] = [
  makeResponse(1, 1, 22),   // 22 min — great
  makeResponse(2, 2, 47),   // 47 min — great
  makeResponse(3, 3, 180),  // 3 hr — within 4hr SLA
  makeResponse(4, 4, 35),   // 35 min
  makeResponse(5, 5, 290),  // 4hr 50min — VIOLATION
  makeResponse(6, 6, 12),   // 12 min
  makeResponse(7, 7, 65),   // 1hr 5min
  makeResponse(8, 8, 88),   // 1hr 28min
  makeResponse(9, 9, 15),   // 15 min
  makeResponse(10, 10, 42), // 42 min
  makeResponse(11, 11, 120),// 2hr
  makeResponse(12, 12, 55), // 55 min
  makeResponse(13, 14, 28), // 28 min
  makeResponse(14, 16, 195),// 3hr 15min
  makeResponse(15, 18, 38), // 38 min
  makeResponse(16, 20, 72), // 1hr 12min
  makeResponse(17, 22, 310),// 5hr 10min — VIOLATION
  makeResponse(18, 24, 18), // 18 min
  makeResponse(19, 26, 95), // 1hr 35min
  makeResponse(20, 28, 52), // 52 min
];

// ---------------------------------------------------------------------------
// Mock SLA Compliance Report
// ---------------------------------------------------------------------------

const totalDispatches = mockSLAResponses.length;
const withinSLA = mockSLAResponses.filter((r) => r.withinSLA).length;
const violations = totalDispatches - withinSLA;
const responseTimes = mockSLAResponses.map((r) => r.responseTimeMinutes);
const avgResponse = Math.round(
  responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
);

export const mockSLAReport: SLAComplianceReport = {
  proId: 'pro-001',
  tier: 'emergency_ready',
  periodDays: 30,
  totalDispatches,
  withinSLA,
  violations,
  compliancePercent: Math.round((withinSLA / totalDispatches) * 100),
  averageResponseMinutes: avgResponse,
  fastestResponseMinutes: Math.min(...responseTimes),
  slowestResponseMinutes: Math.max(...responseTimes),
  isCompliant: (withinSLA / totalDispatches) * 100 >= 90,
  responses: mockSLAResponses,
};

// ---------------------------------------------------------------------------
// Mock Requirements Met/Unmet for the Pro
// ---------------------------------------------------------------------------

export interface RequirementStatus {
  id: string;
  label: string;
  met: boolean;
  detail: string;
}

export const mockRequirementStatuses: RequirementStatus[] = [
  { id: 'req-license', label: 'Valid Contractor License', met: true, detail: 'NH-GC-28491 — Expires 2027-03-31' },
  { id: 'req-insurance-gl', label: 'General Liability Insurance', met: true, detail: '$2M coverage — Expires 2027-03-15' },
  { id: 'req-vetting', label: 'Background Check Passed', met: true, detail: 'Verified 2024-03-15' },
  { id: 'req-iicrc', label: 'IICRC Certification', met: true, detail: 'WRT — Expires 2026-09-20' },
  { id: 'req-sla-4hr', label: '4-Hour SLA Guarantee', met: true, detail: 'Active since 2025-11-01' },
  { id: 'req-wrt', label: 'IICRC WRT Certification', met: true, detail: 'Water Damage Restoration — Expires 2026-09-20' },
  { id: 'req-asd', label: 'IICRC ASD Certification', met: false, detail: 'Required for Restoration Certified' },
  { id: 'req-fsrt', label: 'IICRC FSRT Certification', met: false, detail: 'Required for Restoration Certified' },
  { id: 'req-xactimate', label: 'Xactimate Training', met: false, detail: 'Required for Restoration Certified' },
];

// ---------------------------------------------------------------------------
// Mock ROI Stats
// ---------------------------------------------------------------------------

export const mockROIStats = {
  standard: {
    avgMonthlyEarnings: 2_100,
    avgJobsPerMonth: 4,
    avgJobValue: 525,
  },
  emergency_ready: {
    avgMonthlyEarnings: 8_400,
    avgJobsPerMonth: 12,
    avgJobValue: 700,
    subscriptionCost: 299,
    netIncrease: 5_901, // 8400 - 2100 - 299
  },
  restoration_certified: {
    avgMonthlyEarnings: 14_200,
    avgJobsPerMonth: 18,
    avgJobValue: 789,
    subscriptionCost: 799,
    netIncrease: 11_301, // 14200 - 2100 - 799
  },
};
