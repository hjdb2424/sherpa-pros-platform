import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateSession = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetAppUser = vi.fn();

vi.mock('@/lib/services/payments', () => ({
  getPaymentService: () => ({
    createAccountSession: mockCreateSession,
  }),
}));

vi.mock('@/db/queries/users', () => ({
  getUserByClerkId: mockGetUserByClerkId,
}));

vi.mock('@/lib/auth/get-user', () => ({
  getAppUser: mockGetAppUser,
}));

beforeEach(() => {
  mockCreateSession.mockReset();
  mockGetUserByClerkId.mockReset();
  mockGetAppUser.mockReset();
});

describe('POST /api/stripe/connect/account-session', () => {
  it('returns 401 when no authenticated user', async () => {
    mockGetAppUser.mockResolvedValue(null);
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it('returns 400 when user has no connected account yet', async () => {
    mockGetAppUser.mockResolvedValue({ id: 'clerk_1', email: 'pro@test.com' });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_1',
      stripeAccountId: null,
    });
    const { POST } = await import('../route');
    const res = await POST();
    expect(res.status).toBe(400);
  });

  it('returns the session client secret', async () => {
    mockGetAppUser.mockResolvedValue({ id: 'clerk_1', email: 'pro@test.com' });
    mockGetUserByClerkId.mockResolvedValue({
      id: 'user_1',
      stripeAccountId: 'acct_1',
    });
    mockCreateSession.mockResolvedValue({
      clientSecret: 'cs_mock_1',
      expiresAt: 1735000000,
    });

    const { POST } = await import('../route');
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.clientSecret).toBe('cs_mock_1');
    expect(body.expiresAt).toBe(1735000000);
    expect(mockCreateSession).toHaveBeenCalledWith('acct_1');
  });
});
