import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSelect, mockInsert, mockUpdate, mockDelete, mockTransaction } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockTransaction: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    transaction: mockTransaction,
  },
}));

vi.mock('@/db/drizzle-schema', () => ({
  payments: {
    id: 'id',
    jobId: 'job_id',
    milestoneId: 'milestone_id',
    payerUserId: 'payer_user_id',
    payeeUserId: 'payee_user_id',
    amountCents: 'amount_cents',
    status: 'status',
    stripePaymentIntentId: 'stripe_payment_intent_id',
    heldAt: 'held_at',
  },
  jobMilestones: {
    id: 'id',
    status: 'status',
    fundedAt: 'funded_at',
  },
  bids: {
    id: 'id',
    jobId: 'job_id',
    proId: 'pro_id',
    status: 'status',
    amountCents: 'amount_cents',
  },
  pros: {
    id: 'id',
    userId: 'user_id',
  },
  users: {
    id: 'id',
    email: 'email',
    stripeAccountStatus: 'stripe_account_status',
  },
}));

import {
  getPendingPaymentForMilestone,
  insertPendingPayment,
  setPaymentIntentId,
  deletePaymentRow,
  getCapturedTotalForJob,
  markPaymentHeld,
  getAcceptedBidForJob,
  getUserByProId,
} from '../payments';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getPendingPaymentForMilestone', () => {
  it('returns the pending row when one exists', async () => {
    const row = { id: 'pay_1', status: 'pending', stripePaymentIntentId: 'pi_1' };
    const limit = vi.fn().mockResolvedValue([row]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getPendingPaymentForMilestone('job_1', 'ms_1', 'user_1');
    expect(result).toEqual(row);
  });

  it('returns null when no pending row exists', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getPendingPaymentForMilestone('job_1', 'ms_1', 'user_1');
    expect(result).toBeNull();
  });
});

describe('insertPendingPayment', () => {
  it('returns inserted=true when the INSERT succeeds', async () => {
    const returning = vi.fn().mockResolvedValue([{ id: 'pay_new' }]);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    const result = await insertPendingPayment({
      id: 'pay_new',
      jobId: 'job_1',
      milestoneId: 'ms_1',
      payerUserId: 'user_p',
      payeeUserId: 'user_pro',
      amountCents: 25000,
    });
    expect(result.inserted).toBe(true);
  });

  it('catches unique-violation, refetches, and returns inserted=false + existing row', async () => {
    const uniqueErr = Object.assign(new Error('duplicate'), { code: '23505' });
    const returning = vi.fn().mockRejectedValue(uniqueErr);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    const existingRow = { id: 'pay_existing', status: 'pending' };
    const limit = vi.fn().mockResolvedValue([existingRow]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await insertPendingPayment({
      id: 'pay_new',
      jobId: 'job_1',
      milestoneId: 'ms_1',
      payerUserId: 'user_p',
      payeeUserId: 'user_pro',
      amountCents: 25000,
    });
    expect(result.inserted).toBe(false);
    if (!result.inserted) {
      expect(result.existing).toEqual(existingRow);
    }
  });

  it('rethrows non-unique-violation errors', async () => {
    const otherErr = new Error('connection lost');
    const returning = vi.fn().mockRejectedValue(otherErr);
    const values = vi.fn(() => ({ returning }));
    mockInsert.mockReturnValue({ values });

    await expect(
      insertPendingPayment({
        id: 'pay_new',
        jobId: 'job_1',
        milestoneId: 'ms_1',
        payerUserId: 'user_p',
        payeeUserId: 'user_pro',
        amountCents: 25000,
      }),
    ).rejects.toThrow('connection lost');
  });
});

describe('setPaymentIntentId', () => {
  it('updates the payment row with the Stripe intent ID', async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    const set = vi.fn(() => ({ where }));
    mockUpdate.mockReturnValue({ set });

    await setPaymentIntentId('pay_1', 'pi_xyz');
    expect(set).toHaveBeenCalledWith({ stripePaymentIntentId: 'pi_xyz' });
  });
});

describe('deletePaymentRow', () => {
  it('deletes the row by id', async () => {
    const where = vi.fn().mockResolvedValue(undefined);
    mockDelete.mockReturnValue({ where });

    await deletePaymentRow('pay_1');
    expect(mockDelete).toHaveBeenCalledOnce();
    expect(where).toHaveBeenCalledOnce();
  });
});

describe('getCapturedTotalForJob', () => {
  it('sums amount_cents across pending+held+released for the job', async () => {
    const where = vi.fn().mockResolvedValue([{ total: 75000 }]);
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getCapturedTotalForJob('job_1');
    expect(result).toBe(75000);
  });

  it('returns 0 when no rows match', async () => {
    const where = vi.fn().mockResolvedValue([{ total: null }]);
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getCapturedTotalForJob('job_1');
    expect(result).toBe(0);
  });
});

describe('markPaymentHeld (transactional)', () => {
  it('updates payments.status=held AND job_milestones.status=funded in one transaction', async () => {
    const txWhere = vi.fn().mockResolvedValue(undefined);
    const txSet = vi.fn(() => ({ where: txWhere }));
    const txUpdate = vi.fn(() => ({ set: txSet }));
    const txLimit = vi.fn().mockResolvedValue([{ milestoneId: 'ms_1' }]);
    const txWhereSelect = vi.fn(() => ({ limit: txLimit }));
    const txFrom = vi.fn(() => ({ where: txWhereSelect }));
    const txSelect = vi.fn(() => ({ from: txFrom }));
    const tx = { select: txSelect, update: txUpdate };

    mockTransaction.mockImplementation(
      async (cb: (tx: typeof tx) => Promise<void>) => cb(tx),
    );

    await markPaymentHeld('pay_1');
    expect(mockTransaction).toHaveBeenCalledOnce();
    expect(txUpdate).toHaveBeenCalledTimes(2);
  });
});

describe('getAcceptedBidForJob', () => {
  it('returns the accepted bid for the job', async () => {
    const bid = { id: 'bid_1', jobId: 'job_1', proId: 'pro_1', status: 'accepted', amountCents: 250000 };
    const limit = vi.fn().mockResolvedValue([bid]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getAcceptedBidForJob('job_1');
    expect(result).toEqual(bid);
  });

  it('returns null when no accepted bid exists', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    mockSelect.mockReturnValue({ from });

    const result = await getAcceptedBidForJob('job_1');
    expect(result).toBeNull();
  });
});

describe('getUserByProId', () => {
  it('joins pros→users and returns the user row', async () => {
    const user = { id: 'user_pro', email: 'pro@example.com', stripeAccountStatus: 'active' };
    const limit = vi.fn().mockResolvedValue([user]);
    const where = vi.fn(() => ({ limit }));
    const innerJoin = vi.fn(() => ({ where }));
    const from = vi.fn(() => ({ innerJoin }));
    mockSelect.mockReturnValue({ from });

    const result = await getUserByProId('pro_1');
    expect(result).toEqual(user);
  });

  it('returns null when the pro_id does not match', async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn(() => ({ limit }));
    const innerJoin = vi.fn(() => ({ where }));
    const from = vi.fn(() => ({ innerJoin }));
    mockSelect.mockReturnValue({ from });

    const result = await getUserByProId('pro_unknown');
    expect(result).toBeNull();
  });
});
