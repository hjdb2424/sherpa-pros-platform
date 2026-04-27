/**
 * Sherpa Pros — Mock Payment Service
 *
 * In-memory implementation for development without Stripe credentials.
 * Generates deterministic-but-fake account IDs so tests can assert on them.
 */

import type {
  PaymentService,
  ConnectedAccountResult,
  AccountSessionResult,
  StripeAccountStatus,
} from './types';

const accounts = new Map<string, ConnectedAccountResult>();

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_mock_${counter}_${Date.now()}`;
}

export const mockPaymentService: PaymentService = {
  async ensureConnectedAccount(userId, _email) {
    const existing = accounts.get(userId);
    if (existing) return existing;

    const result: ConnectedAccountResult = {
      stripeAccountId: nextId('acct'),
      status: 'pending' as StripeAccountStatus,
    };
    accounts.set(userId, result);
    return result;
  },

  async createAccountSession(_stripeAccountId): Promise<AccountSessionResult> {
    return {
      clientSecret: nextId('cs'),
      expiresAt: Math.floor(Date.now() / 1000) + 30 * 60,
    };
  },
};

// Test helpers
export function _resetMockPaymentStore() {
  accounts.clear();
  counter = 0;
}
