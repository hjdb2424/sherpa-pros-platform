import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockGetUserById,
  mockGetJob,
  mockGetMilestone,
  mockGetAcceptedBidForJob,
  mockGetUserByProId,
  mockGetCapturedTotalForJob,
} = vi.hoisted(() => ({
  mockGetUserById: vi.fn(),
  mockGetJob: vi.fn(),
  mockGetMilestone: vi.fn(),
  mockGetAcceptedBidForJob: vi.fn(),
  mockGetUserByProId: vi.fn(),
  mockGetCapturedTotalForJob: vi.fn(),
}));

vi.mock('@/db/queries/payments', () => ({
  getAcceptedBidForJob: mockGetAcceptedBidForJob,
  getUserByProId: mockGetUserByProId,
  getCapturedTotalForJob: mockGetCapturedTotalForJob,
  getPendingPaymentForMilestone: vi.fn(),
  insertPendingPayment: vi.fn(),
  setPaymentIntentId: vi.fn(),
  deletePaymentRow: vi.fn(),
}));

vi.mock('@/db/queries/users', () => ({
  getUserById: mockGetUserById,
}));

vi.mock('@/db/queries/jobs', () => ({
  getJob: mockGetJob,
}));

vi.mock('@/db/queries/milestones', () => ({
  getMilestone: mockGetMilestone,
}));

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({ capturePayment: vi.fn() }),
}));

import { runCaptureForMilestone } from '../capture';

const baseInput = {
  clientUserId: 'user_client',
  jobId: 'job_1',
  milestoneId: 'ms_1',
  amountCents: 25000,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Sensible defaults — overridden per test
  mockGetUserById.mockResolvedValue({ id: 'user_client' });
  mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_client', status: 'in_progress' });
  mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_1', status: 'pending', amountCents: 25000 });
  mockGetAcceptedBidForJob.mockResolvedValue({ id: 'bid_1', proId: 'pro_1', status: 'accepted' });
  mockGetUserByProId.mockResolvedValue({ id: 'user_pro', stripeAccountStatus: 'active' });
  mockGetCapturedTotalForJob.mockResolvedValue(0);
});

describe('runCaptureForMilestone — gates', () => {
  it('rejects with unauthorized when the client user does not exist', async () => {
    mockGetUserById.mockResolvedValue(null);
    const result = await runCaptureForMilestone(baseInput);
    expect(result).toEqual({ ok: false, error: 'unauthorized' });
  });

  it('rejects with not_owner when the client does not own the job', async () => {
    mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_other', status: 'in_progress' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result).toEqual({ ok: false, error: 'not_owner' });
  });

  it('rejects with job_not_fundable when the job is in a terminal state', async () => {
    mockGetJob.mockResolvedValue({ id: 'job_1', clientUserId: 'user_client', status: 'cancelled' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('job_not_fundable');
  });

  it('rejects with milestone_not_in_job when the milestone belongs to a different job', async () => {
    mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_other', status: 'pending', amountCents: 25000 });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('milestone_not_in_job');
  });

  it('rejects with milestone_not_pending when milestone status is not pending', async () => {
    mockGetMilestone.mockResolvedValue({ id: 'ms_1', jobId: 'job_1', status: 'funded', amountCents: 25000 });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('milestone_not_pending');
  });

  it('rejects with job_has_no_accepted_bid when no accepted bid exists', async () => {
    mockGetAcceptedBidForJob.mockResolvedValue(null);
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('job_has_no_accepted_bid');
  });

  it('rejects with pro_not_verified when the pro user is not active', async () => {
    mockGetUserByProId.mockResolvedValue({ id: 'user_pro', stripeAccountStatus: 'pending' });
    const result = await runCaptureForMilestone(baseInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('pro_not_verified');
  });

  it('rejects with beta_cap_exceeded when sum + amount > 50000', async () => {
    mockGetCapturedTotalForJob.mockResolvedValue(40000);
    const result = await runCaptureForMilestone({ ...baseInput, amountCents: 15000 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('beta_cap_exceeded');
  });
});
