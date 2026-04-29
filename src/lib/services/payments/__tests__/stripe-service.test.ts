import { describe, it, expect, vi, beforeEach } from 'vitest';

const { paymentIntentsCreate } = vi.hoisted(() => ({
  paymentIntentsCreate: vi.fn(),
}));

vi.mock('stripe', () => {
  const accountsCreate = vi.fn().mockResolvedValue({
    id: 'acct_mock_1',
    charges_enabled: false,
    details_submitted: false,
  });
  const sessionsCreate = vi.fn().mockResolvedValue({
    client_secret: 'cs_mock_1',
    expires_at: 1735000000,
  });

  const StripeClass = vi.fn().mockImplementation(function () {
    return {
      accounts: {
        create: accountsCreate,
      },
      accountSessions: {
        create: sessionsCreate,
      },
      paymentIntents: {
        create: paymentIntentsCreate,
      },
    };
  });

  return { default: StripeClass, __esModule: true };
});

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
  vi.resetModules();
});

describe('stripePaymentService.ensureConnectedAccount', () => {
  it('creates a new Stripe Connected Account and returns the typed result', async () => {
    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.ensureConnectedAccount(
      'user_1',
      'pro@example.com',
    );

    expect(result.stripeAccountId).toBe('acct_mock_1');
    expect(result.status).toBe('pending');
  });

  it('throws when STRIPE_SECRET_KEY is unset', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    vi.resetModules();
    const { stripePaymentService } = await import('../stripe-service');
    await expect(
      stripePaymentService.ensureConnectedAccount('user_1', 'pro@example.com'),
    ).rejects.toThrow(/STRIPE_SECRET_KEY/);
  });
});

describe('stripePaymentService.createAccountSession', () => {
  it('returns the mapped client secret + expiry from Stripe', async () => {
    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.createAccountSession('acct_1');
    expect(result.clientSecret).toBe('cs_mock_1');
    expect(result.expiresAt).toBe(1735000000);
  });
});

describe('stripePaymentService.capturePayment', () => {
  it('calls paymentIntents.create with the correct shape', async () => {
    paymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_xyz',
      client_secret: 'pi_test_xyz_secret_abc',
    });
    const { stripePaymentService } = await import('../stripe-service');
    await stripePaymentService.capturePayment({
      paymentRowId: 'pay_1',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });

    expect(paymentIntentsCreate).toHaveBeenCalledWith({
      amount: 25000,
      currency: 'usd',
      payment_method_types: ['card'],
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });
  });

  it('returns paymentIntentId + clientSecret from the Stripe response', async () => {
    paymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_xyz',
      client_secret: 'pi_test_xyz_secret_abc',
    });
    const { stripePaymentService } = await import('../stripe-service');
    const result = await stripePaymentService.capturePayment({
      paymentRowId: 'pay_1',
      amountCents: 25000,
      description: 'Milestone 1: Prep',
      metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
    });

    expect(result).toEqual({
      paymentIntentId: 'pi_test_xyz',
      clientSecret: 'pi_test_xyz_secret_abc',
    });
  });

  it('throws when Stripe returns no client_secret', async () => {
    paymentIntentsCreate.mockResolvedValue({ id: 'pi_test_xyz', client_secret: null });
    const { stripePaymentService } = await import('../stripe-service');
    await expect(
      stripePaymentService.capturePayment({
        paymentRowId: 'pay_1',
        amountCents: 25000,
        description: 'Milestone 1: Prep',
        metadata: { jobId: 'job_1', milestoneId: 'ms_1', paymentRowId: 'pay_1' },
      }),
    ).rejects.toThrow(/client_secret/);
  });
});
