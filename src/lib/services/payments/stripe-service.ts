/**
 * Sherpa Pros — Stripe Payment Service
 *
 * Real Stripe SDK implementation. Lazily initialized to keep the module
 * importable without env vars (build must pass).
 */

import type { PaymentService } from './types';

export const stripePaymentService: PaymentService = {
  async ensureConnectedAccount(_userId, _email) {
    throw new Error('stripe-service: ensureConnectedAccount not yet implemented');
  },

  async createAccountSession(_stripeAccountId) {
    throw new Error('stripe-service: createAccountSession not yet implemented');
  },
};
