import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUpdateStatus = vi.fn();
const mockConstructEvent = vi.fn();

vi.mock('stripe', () => {
  const StripeClass = vi.fn().mockImplementation(function () {
    return {
      webhooks: {
        constructEvent: mockConstructEvent,
      },
    };
  });
  return { default: StripeClass, __esModule: true };
});

vi.mock('@/db/queries/users', () => ({
  updateStripeAccountStatus: mockUpdateStatus,
}));

beforeEach(() => {
  mockUpdateStatus.mockReset();
  mockConstructEvent.mockReset();
  process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  vi.resetModules();
});

describe('POST /api/stripe/webhook', () => {
  it('rejects requests with an invalid signature', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'bad',
      },
      body: '{"type":"account.updated"}',
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('updates account status to active on account.updated when charges_enabled + details_submitted', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'account.updated',
      data: {
        object: {
          id: 'acct_1',
          charges_enabled: true,
          details_submitted: true,
          requirements: { disabled_reason: null, currently_due: [] },
        },
      },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{"type":"account.updated"}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).toHaveBeenCalledWith('acct_1', 'active');
  });

  it('updates account status to restricted when details_submitted but currently_due is non-empty', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'account.updated',
      data: {
        object: {
          id: 'acct_2',
          charges_enabled: false,
          details_submitted: true,
          requirements: { disabled_reason: null, currently_due: ['business_profile.url'] },
        },
      },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).toHaveBeenCalledWith('acct_2', 'restricted');
  });

  it('returns 200 + log no-op for unknown event types', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_1' } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 'good',
      },
      body: '{}',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpdateStatus).not.toHaveBeenCalled();
  });
});
