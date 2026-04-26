/**
 * Audit Logging — fire-and-forget logger + mock data for admin UI
 *
 * Production: INSERT INTO audit_logs table
 * Beta: console.log + in-memory mock data
 */

// ── Types ───────────────────────────────────────────────────────────

export type AuditAction =
  | 'sign_in' | 'sign_out'
  | 'role_change' | 'subtype_change'
  | 'access_granted' | 'access_revoked'
  | 'reward_redeemed'
  | 'pro_verified' | 'pro_rejected'
  | 'job_created' | 'job_assigned' | 'job_completed'
  | 'material_approved' | 'material_ordered'
  | 'dispatch_triggered'
  | 'delivery_requested' | 'delivery_completed'
  | 'multi_trade_created';

export interface AuditEntry {
  id: string;
  userId?: string;
  email?: string;
  userName?: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface AuditFilters {
  action?: AuditAction;
  email?: string;
  days?: number;
  page?: number;
  limit?: number;
}

// ── Fire-and-forget audit logger ────────────────────────────────────

export async function logAudit(
  action: AuditAction,
  opts: {
    userId?: string;
    email?: string;
    userName?: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
  } = {}
): Promise<void> {
  // For now, log to console + store in-memory (will wire to DB later)
  // In production: INSERT INTO audit_logs
  console.log(`[AUDIT] ${action}`, opts);
}

// ── Mock data for admin UI ──────────────────────────────────────────

const DEMO_USERS = [
  { id: 'u-001', name: 'Mike Rodriguez', email: 'mike.r@test.com' },
  { id: 'u-002', name: 'Lisa Park', email: 'lisa.park@sunrisepm.com' },
  { id: 'u-003', name: 'Jamie Davis', email: 'jamie.d@test.com' },
  { id: 'u-004', name: 'Marcus Rivera', email: 'marcus.r@test.com' },
  { id: 'u-005', name: 'Priya Sharma', email: 'priya.s@test.com' },
  { id: 'u-006', name: 'Diana Brooks', email: 'diana.b@test.com' },
  { id: 'u-007', name: 'Tony DeLuca', email: 'tony.d@test.com' },
  { id: 'u-008', name: 'Keisha Brown', email: 'keisha.b@test.com' },
  { id: 'u-009', name: 'Omar Hassan', email: 'omar.h@test.com' },
  { id: 'u-010', name: 'Carmen Reyes', email: 'carmen.r@test.com' },
  { id: 'u-011', name: 'Frank Kowalski', email: 'frank.k@test.com' },
  { id: 'u-012', name: 'Aisha Jackson', email: 'aisha.j@test.com' },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function buildMockEntries(): AuditEntry[] {
  // Deterministic seed-like generation using fixed offsets
  const entries: AuditEntry[] = [];
  let id = 1;

  const scenarios: Array<{
    hoursBack: number;
    user: (typeof DEMO_USERS)[number];
    action: AuditAction;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
    ip?: string;
  }> = [
    // Day 0 — today
    { hoursBack: 0.5, user: DEMO_USERS[0], action: 'sign_in', ip: '73.201.44.12', metadata: { provider: 'google' } },
    { hoursBack: 1, user: DEMO_USERS[1], action: 'sign_in', ip: '98.45.112.7', metadata: { provider: 'google' } },
    { hoursBack: 1.5, user: DEMO_USERS[1], action: 'job_created', targetType: 'job', targetId: 'job-1048', metadata: { title: 'Kitchen faucet replacement', category: 'Plumbing', urgency: 'standard' } },
    { hoursBack: 2, user: DEMO_USERS[0], action: 'job_assigned', targetType: 'job', targetId: 'job-1048', metadata: { proName: 'Marcus Rivera', proId: 'sp-001', matchScore: 94 } },
    { hoursBack: 2.5, user: DEMO_USERS[3], action: 'dispatch_triggered', targetType: 'job', targetId: 'job-1048', metadata: { radius: '15mi', prosNotified: 3 } },
    { hoursBack: 3, user: DEMO_USERS[4], action: 'material_approved', targetType: 'material', targetId: 'mat-220', metadata: { item: 'Moen Arbor faucet', costCents: 28900, vendor: 'FW Webb' } },
    { hoursBack: 4, user: DEMO_USERS[1], action: 'delivery_requested', targetType: 'delivery', targetId: 'del-078', metadata: { items: 2, address: '14 Maple St, Portsmouth NH' } },

    // Day 1
    { hoursBack: 26, user: DEMO_USERS[2], action: 'sign_in', ip: '104.28.55.91', metadata: { provider: 'email' } },
    { hoursBack: 27, user: DEMO_USERS[5], action: 'pro_verified', targetType: 'pro', targetId: 'sp-011', metadata: { trade: 'Painting', license: 'NH-PT-4421', insuranceExpiry: '2027-03-15' } },
    { hoursBack: 28, user: DEMO_USERS[2], action: 'job_created', targetType: 'job', targetId: 'job-1047', metadata: { title: 'Interior painting — 3 bedrooms', category: 'Painting', urgency: 'flexible' } },
    { hoursBack: 29, user: DEMO_USERS[6], action: 'sign_in', ip: '68.117.22.180', metadata: { provider: 'google' } },
    { hoursBack: 30, user: DEMO_USERS[6], action: 'material_ordered', targetType: 'material', targetId: 'mat-219', metadata: { item: 'Benjamin Moore Regal Select', qty: 5, costCents: 34500, vendor: 'local supplier' } },
    { hoursBack: 31, user: DEMO_USERS[1], action: 'role_change', targetType: 'user', targetId: 'u-008', metadata: { from: 'client', to: 'pro', reason: 'Passed trade verification' } },

    // Day 2
    { hoursBack: 50, user: DEMO_USERS[7], action: 'sign_in', ip: '142.250.80.14', metadata: { provider: 'google' } },
    { hoursBack: 51, user: DEMO_USERS[8], action: 'pro_rejected', targetType: 'pro', targetId: 'sp-temp-44', metadata: { trade: 'Electrical', reason: 'License expired 2025-12-01', canReapply: true } },
    { hoursBack: 52, user: DEMO_USERS[3], action: 'job_completed', targetType: 'job', targetId: 'job-1045', metadata: { title: 'Water heater install', durationHours: 4.5, rating: 4.9 } },
    { hoursBack: 53, user: DEMO_USERS[0], action: 'delivery_completed', targetType: 'delivery', targetId: 'del-076', metadata: { items: 3, signedBy: 'Marcus Rivera' } },
    { hoursBack: 54, user: DEMO_USERS[9], action: 'sign_in', ip: '45.33.100.22', metadata: { provider: 'google' } },

    // Day 3
    { hoursBack: 74, user: DEMO_USERS[10], action: 'sign_in', ip: '71.206.18.45', metadata: { provider: 'email' } },
    { hoursBack: 75, user: DEMO_USERS[1], action: 'multi_trade_created', targetType: 'job', targetId: 'job-1044', metadata: { title: 'Bathroom renovation', trades: ['Plumbing', 'Electrical', 'Painting'], estimatedDays: 5 } },
    { hoursBack: 76, user: DEMO_USERS[1], action: 'dispatch_triggered', targetType: 'job', targetId: 'job-1044', metadata: { radius: '25mi', prosNotified: 7, trades: 3 } },
    { hoursBack: 78, user: DEMO_USERS[11], action: 'sign_in', ip: '199.102.44.8', metadata: { provider: 'google' } },
    { hoursBack: 79, user: DEMO_USERS[11], action: 'job_assigned', targetType: 'job', targetId: 'job-1044', metadata: { proName: 'Aisha Jackson', proId: 'sp-010', matchScore: 82, trade: 'Plumbing' } },

    // Day 4
    { hoursBack: 98, user: DEMO_USERS[4], action: 'sign_out', ip: '98.45.112.7' },
    { hoursBack: 99, user: DEMO_USERS[5], action: 'pro_verified', targetType: 'pro', targetId: 'sp-031', metadata: { trade: 'Electrical', license: 'NH-EL-7892', insuranceExpiry: '2027-06-30' } },
    { hoursBack: 100, user: DEMO_USERS[2], action: 'material_approved', targetType: 'material', targetId: 'mat-215', metadata: { item: 'Square D breaker panel', costCents: 42000, vendor: 'FW Webb' } },
    { hoursBack: 101, user: DEMO_USERS[0], action: 'access_granted', targetType: 'user', targetId: 'u-new-1', metadata: { email: 'new.contractor@test.com', role: 'pro' } },

    // Day 5
    { hoursBack: 122, user: DEMO_USERS[8], action: 'sign_in', ip: '172.58.22.91', metadata: { provider: 'google' } },
    { hoursBack: 123, user: DEMO_USERS[7], action: 'job_created', targetType: 'job', targetId: 'job-1042', metadata: { title: 'Deck staining and repair', category: 'Painting', urgency: 'standard' } },
    { hoursBack: 124, user: DEMO_USERS[9], action: 'delivery_requested', targetType: 'delivery', targetId: 'del-074', metadata: { items: 4, address: '88 Oak Ave, Concord NH' } },
    { hoursBack: 125, user: DEMO_USERS[10], action: 'sign_out', ip: '71.206.18.45' },

    // Day 6
    { hoursBack: 146, user: DEMO_USERS[3], action: 'sign_in', ip: '73.201.44.12', metadata: { provider: 'google' } },
    { hoursBack: 147, user: DEMO_USERS[1], action: 'access_revoked', targetType: 'user', targetId: 'u-old-5', metadata: { email: 'inactive.user@test.com', reason: 'Account inactive 90+ days' } },
    { hoursBack: 148, user: DEMO_USERS[6], action: 'job_completed', targetType: 'job', targetId: 'job-1040', metadata: { title: 'Gas line inspection', durationHours: 2, rating: 5.0 } },
    { hoursBack: 150, user: DEMO_USERS[5], action: 'delivery_completed', targetType: 'delivery', targetId: 'del-072', metadata: { items: 1, signedBy: 'Diana Brooks' } },
    { hoursBack: 152, user: DEMO_USERS[0], action: 'sign_in', ip: '73.201.44.12', metadata: { provider: 'google' } },
    { hoursBack: 155, user: DEMO_USERS[1], action: 'reward_redeemed', targetType: 'reward', targetId: 'rwd-009', metadata: { product: 'Amazon Gift Card', amountCents: 5000, sherpaPoints: 500 } },
  ];

  for (const s of scenarios) {
    entries.push({
      id: `aud-${String(id++).padStart(4, '0')}`,
      userId: s.user.id,
      email: s.user.email,
      userName: s.user.name,
      action: s.action,
      targetType: s.targetType,
      targetId: s.targetId,
      metadata: s.metadata,
      ipAddress: s.ip ?? pick(['73.201.44.12', '98.45.112.7', '104.28.55.91', '68.117.22.180', '142.250.80.14']),
      createdAt: hoursAgo(s.hoursBack),
    });
  }

  // Sort newest first
  entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return entries;
}

const MOCK_ENTRIES = buildMockEntries();

// ── Query mock data ─────────────────────────────────────────────────

export function getAuditLogs(filters: AuditFilters = {}): {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const { action, email, days, page = 1, limit = 25 } = filters;

  let result = [...MOCK_ENTRIES];

  // Filter by action
  if (action) {
    result = result.filter((e) => e.action === action);
  }

  // Filter by email (partial match)
  if (email) {
    const q = email.toLowerCase();
    result = result.filter(
      (e) =>
        (e.email ?? '').toLowerCase().includes(q) ||
        (e.userName ?? '').toLowerCase().includes(q)
    );
  }

  // Filter by days
  if (days && days > 0) {
    const cutoff = new Date(Date.now() - days * 24 * 3600_000).toISOString();
    result = result.filter((e) => e.createdAt >= cutoff);
  }

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  const paged = result.slice(start, start + limit);

  return { entries: paged, total, page: safePage, limit, totalPages };
}

// ── All unique actions (for filter dropdown) ────────────────────────

export const ALL_AUDIT_ACTIONS: AuditAction[] = [
  'sign_in', 'sign_out',
  'role_change', 'subtype_change',
  'access_granted', 'access_revoked',
  'reward_redeemed',
  'pro_verified', 'pro_rejected',
  'job_created', 'job_assigned', 'job_completed',
  'material_approved', 'material_ordered',
  'dispatch_triggered',
  'delivery_requested', 'delivery_completed',
  'multi_trade_created',
];
