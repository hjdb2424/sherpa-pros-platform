/**
 * User Query Helpers
 *
 * Typed CRUD operations for the users table, focused on Stripe Connect
 * onboarding fields (stripe_account_id, stripe_account_status, stripe_onboarded_at).
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { users } from '../drizzle-schema';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

/**
 * Find a user by their Clerk user ID.
 * @param clerkId - Clerk's user ID (e.g. "user_abc123")
 * @returns The user row or null if not found
 */
export async function getUserByClerkId(clerkId: string) {
  const rows = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  return rows[0] ?? null;
}

/**
 * Persist a newly created Stripe Connected Account ID against the user.
 * @param userId - Internal user UUID
 * @param stripeAccountId - Stripe account ID (e.g. "acct_...")
 * @param status - Current onboarding status
 */
export async function setStripeAccountId(
  userId: string,
  stripeAccountId: string,
  status: StripeAccountStatus,
) {
  await db
    .update(users)
    .set({ stripeAccountId, stripeAccountStatus: status })
    .where(eq(users.id, userId));
}

/**
 * Update the onboarding status for a Stripe Connected Account.
 * Sets stripe_onboarded_at when status transitions to 'active'.
 * @param stripeAccountId - Stripe account ID
 * @param status - New onboarding status
 */
export async function updateStripeAccountStatus(
  stripeAccountId: string,
  status: StripeAccountStatus,
) {
  if (status === 'active') {
    await db
      .update(users)
      .set({ stripeAccountStatus: status, stripeOnboardedAt: sql`COALESCE(stripe_onboarded_at, NOW())` })
      .where(eq(users.stripeAccountId, stripeAccountId));
    return;
  }
  await db
    .update(users)
    .set({ stripeAccountStatus: status })
    .where(eq(users.stripeAccountId, stripeAccountId));
}
