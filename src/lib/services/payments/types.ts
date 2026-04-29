/**
 * Sherpa Pros — Payment Service Types
 *
 * Minimal interface for Plan 1 (onboarding only). Plan 2 will extend
 * with capturePayment, releasePayout, etc.
 *
 * Spec: docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md
 */

export type StripeAccountStatus =
  | 'none'
  | 'pending'
  | 'active'
  | 'restricted'
  | 'disabled';

export interface ConnectedAccountResult {
  stripeAccountId: string;
  status: StripeAccountStatus;
}

export interface AccountSessionResult {
  clientSecret: string;
  expiresAt: number;
}

export interface CapturePaymentInput {
  paymentRowId: string;
  amountCents: number;
  description: string;
  metadata: {
    jobId: string;
    milestoneId: string;
    paymentRowId: string;
  };
}

export interface CapturePaymentResult {
  paymentIntentId: string;
  clientSecret: string;
}

export interface PaymentService {
  /**
   * Idempotent. Reads existing stripe_account_id; creates new Connected
   * Account only if missing. Returns the account ID and current status.
   */
  ensureConnectedAccount(
    userId: string,
    email: string,
  ): Promise<ConnectedAccountResult>;

  /**
   * Mints a short-lived AccountSession scoped to the account_onboarding
   * component. Used by <ConnectAccountOnboarding> to render the embedded form.
   */
  createAccountSession(stripeAccountId: string): Promise<AccountSessionResult>;

  /**
   * Plan 2a — capture half of money flow. Creates a PaymentIntent on the
   * platform account (no transfer_data) so funds park in the platform
   * balance until Plan 2b's release path runs.
   */
  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentResult>;

  /**
   * Plan 2a — used by the reuse-pending logic on funding-page reload.
   * Returns the PaymentIntent's current Stripe-side state so the caller
   * can branch on succeeded / canceled / requires_payment_method.
   */
  retrievePaymentIntent(intentId: string): Promise<{
    id: string;
    status: string;
    client_secret: string | null;
  }>;
}
