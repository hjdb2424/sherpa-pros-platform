import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const {
  mockUpdateStatus,
  mockConstructEvent,
  mockMarkEventProcessed,
  mockMarkPaymentHeld,
  mockDeletePaymentRow,
} = vi.hoisted(() => ({
  mockUpdateStatus: vi.fn(),
  mockConstructEvent: vi.fn(),
  mockMarkEventProcessed: vi.fn(),
  mockMarkPaymentHeld: vi.fn(),
  mockDeletePaymentRow: vi.fn(),
}));

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

vi.mock('@/db/queries/stripe-events', () => ({
  markEventProcessed: mockMarkEventProcessed,
}));

vi.mock('@/db/queries/payments', () => ({
  markPaymentHeld: mockMarkPaymentHeld,
  deletePaymentRow: mockDeletePaymentRow,
}));

const originalNodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  mockUpdateStatus.mockReset();
  mockConstructEvent.mockReset();
  mockMarkEventProcessed.mockReset();
  mockMarkPaymentHeld.mockReset();
  mockDeletePaymentRow.mockReset();
  process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  process.env.NODE_ENV = 'test';
  vi.resetModules();
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
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
      type: 'customer.created',
      data: { object: { id: 'cus_1' } },
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

describe('POST /api/stripe/webhook — webhook secret guard (C-4)', () => {
  it('returns 503 when STRIPE_WEBHOOK_SECRET is unset and NODE_ENV !== test', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    process.env.NODE_ENV = 'development';
    vi.resetModules();
    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({ type: 'payment_intent.succeeded', data: { object: {} } }),
      headers: { 'stripe-signature': 'sig' },
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe('webhook_secret_required');
  });

  it('bypasses validation when STRIPE_WEBHOOK_SECRET is unset and NODE_ENV === test', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    process.env.NODE_ENV = 'test';
    vi.resetModules();
    const { POST } = await import('../route');
    const event = {
      id: 'evt_test',
      type: 'account.updated',
      data: {
        object: { id: 'acct_test', charges_enabled: true, details_submitted: true, requirements: null },
      },
    };
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

describe('payment_intent.succeeded handler', () => {
  it('marks payment held on first delivery', async () => {
    mockMarkEventProcessed.mockResolvedValue(true);
    mockConstructEvent.mockReturnValue({
      id: 'evt_pi_succ_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'good' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockMarkPaymentHeld).toHaveBeenCalledWith('pay_1');
  });

  it('skips processing on duplicate event delivery (idempotency)', async () => {
    mockMarkEventProcessed.mockResolvedValue(false);
    mockConstructEvent.mockReturnValue({
      id: 'evt_pi_succ_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'good' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockMarkPaymentHeld).not.toHaveBeenCalled();
  });

  it('warns and 200s when paymentRowId is missing from metadata', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockConstructEvent.mockReturnValue({
      id: 'evt_pi_succ_2',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test', metadata: {} } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'good' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalled();
    expect(mockMarkPaymentHeld).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('payment_intent.payment_failed handler', () => {
  it('deletes the payment row on first delivery', async () => {
    mockMarkEventProcessed.mockResolvedValue(true);
    mockConstructEvent.mockReturnValue({
      id: 'evt_pi_fail_1',
      type: 'payment_intent.payment_failed',
      data: { object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'good' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockDeletePaymentRow).toHaveBeenCalledWith('pay_1');
  });

  it('skips processing on duplicate event (idempotency)', async () => {
    mockMarkEventProcessed.mockResolvedValue(false);
    mockConstructEvent.mockReturnValue({
      id: 'evt_pi_fail_1',
      type: 'payment_intent.payment_failed',
      data: { object: { id: 'pi_test', metadata: { paymentRowId: 'pay_1' } } },
    });

    const { POST } = await import('../route');
    const req = new Request('https://x.test/api/stripe/webhook', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 'good' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockDeletePaymentRow).not.toHaveBeenCalled();
  });
});
