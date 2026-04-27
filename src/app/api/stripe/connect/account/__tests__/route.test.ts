import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockEnsure = vi.fn();
const mockSetStripeAccountId = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetAppUser = vi.fn();

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({
    ensureConnectedAccount: mockEnsure,
  }),
}));

vi.mock('@/db/queries/users', () => ({
  getUserByClerkId: mockGetUserByClerkId,
  setStripeAccountId: mockSetStripeAccountId,
}));

vi.mock('@/lib/auth/get-user', () => ({
  getAppUser: mockGetAppUser,
}));

beforeEach(() => {
  mockEnsure.mockReset();
  mockSetStripeAccountId.mockReset();
  mockGetUserByClerkId.mockReset();
  mockGetAppUser.mockReset();
});

describe('POST /api/stripe/connect/account', () => {
  it('returns 401 when no authenticated user', async () => {
    mockGetAppUser.mockResolvedValue(null);
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it('creates a connected account when user has none', async () => {
    mockGetAppUser.mockResolvedValue({
      id: 'clerk_123',
      email: 'pro@test.com',
      firstName: 'Test',
      lastName: 'Pro',
      role: 'pro',
      imageUrl: '',
    });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_uuid_1',
      stripeAccountId: null,
      stripeAccountStatus: 'none',
    });
    mockEnsure.mockResolvedValue({
      stripeAccountId: 'acct_new_1',
      status: 'pending',
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.stripeAccountId).toBe('acct_new_1');
    expect(body.status).toBe('pending');
    expect(mockEnsure).toHaveBeenCalledWith('user_uuid_1', 'pro@test.com');
    expect(mockSetStripeAccountId).toHaveBeenCalledWith('user_uuid_1', 'acct_new_1', 'pending');
  });

  it('returns existing account without re-creating', async () => {
    mockGetAppUser.mockResolvedValue({
      id: 'clerk_123',
      email: 'pro@test.com',
      firstName: 'Test',
      lastName: 'Pro',
      role: 'pro',
      imageUrl: '',
    });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_uuid_1',
      stripeAccountId: 'acct_existing_1',
      stripeAccountStatus: 'active',
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.stripeAccountId).toBe('acct_existing_1');
    expect(body.status).toBe('active');
    expect(mockEnsure).not.toHaveBeenCalled();
    expect(mockSetStripeAccountId).not.toHaveBeenCalled();
  });
});
