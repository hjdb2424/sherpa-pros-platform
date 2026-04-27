/**
 * Sherpa Pros — Payment Service Getter
 *
 * Picks Stripe when STRIPE_SECRET_KEY is set, mock otherwise.
 * Mirrors the getMessagingService() pattern from communication/.
 */

import type { PaymentService } from './types';
import { mockPaymentService } from './mock-service';
import { stripePaymentService } from './stripe-service';

export function getPaymentService(): PaymentService {
  if (process.env.STRIPE_SECRET_KEY) {
    return stripePaymentService;
  }
  return mockPaymentService;
}

export { mockPaymentService } from './mock-service';
export { stripePaymentService } from './stripe-service';
export type {
  PaymentService,
  StripeAccountStatus,
  ConnectedAccountResult,
  AccountSessionResult,
} from './types';
