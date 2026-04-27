import { describe, it, expect, afterEach } from 'vitest';
import { getPaymentService } from '../index';
import { mockPaymentService } from '../mock-service';

describe('getPaymentService', () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  });

  it('returns the mock service when STRIPE_SECRET_KEY is unset', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(getPaymentService()).toBe(mockPaymentService);
  });

  it('returns the Stripe service when STRIPE_SECRET_KEY is set', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_AC';
    const { stripePaymentService } = await import('../stripe-service');
    expect(getPaymentService()).toBe(stripePaymentService);
  });
});
