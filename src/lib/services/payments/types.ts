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
}
