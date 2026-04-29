/**
 * Sherpa Pros — Stripe Payment Service
 *
 * Real Stripe SDK implementation. Lazily initialized — the module imports
 * cleanly without STRIPE_SECRET_KEY set; methods throw when called without it.
 *
 * The module-level cachedClient is populated on first call and reused across
 * calls within the same module instance. vi.resetModules() between tests
 * resets the cache.
 */

import Stripe from 'stripe';
import type {
  PaymentService,
  ConnectedAccountResult,
  AccountSessionResult,
  StripeAccountStatus,
  CapturePaymentInput,
  CapturePaymentResult,
} from './types';

type StripeClient = Stripe;

let cachedClient: StripeClient | null = null;

function getStripeClient(): StripeClient {
  if (cachedClient) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY not configured. Set sk_test_* for development or sk_live_* for production.',
    );
  }

  cachedClient = new Stripe(secretKey, {
    typescript: true,
  });
  return cachedClient;
}

/**
 * Derive our local status from a Stripe Account object.
 * See spec: 2026-04-26-stripe-connect-onboarding-design.md §"State model"
 */
function deriveStatus(account: Stripe.Account): StripeAccountStatus {
  const reqs = account.requirements;
  const disabledReason = reqs?.disabled_reason;
  if (disabledReason) return 'disabled';

  if (account.charges_enabled === true && account.details_submitted === true) {
    return 'active';
  }

  const currentlyDue = reqs?.currently_due ?? [];
  if (account.details_submitted === true && currentlyDue.length > 0) {
    return 'restricted';
  }

  return 'pending';
}

export const stripePaymentService: PaymentService = {
  async ensureConnectedAccount(_userId, email): Promise<ConnectedAccountResult> {
    const client = getStripeClient();
    const account = await client.accounts.create({
      type: 'standard',
      email,
    });
    return {
      stripeAccountId: account.id,
      status: deriveStatus(account),
    };
  },

  async createAccountSession(stripeAccountId): Promise<AccountSessionResult> {
    const client = getStripeClient();
    const session = await client.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: { enabled: true },
      },
    });
    return {
      clientSecret: session.client_secret,
      expiresAt: session.expires_at,
    };
  },

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult> {
    const client = getStripeClient();
    const intent = await client.paymentIntents.create({
      amount: input.amountCents,
      currency: 'usd',
      payment_method_types: ['card'],
      description: input.description,
      metadata: input.metadata,
    });
    if (!intent.client_secret) {
      throw new Error('Stripe returned PaymentIntent without client_secret');
    }
    return {
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
    };
  },
};

// Exported for test isolation
export function _resetCachedStripeClient() {
  cachedClient = null;
}
