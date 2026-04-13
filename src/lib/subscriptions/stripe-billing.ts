/**
 * Sherpa Pros Platform — Stripe Billing Integration
 *
 * Manages Pro subscription lifecycle via Stripe Billing.
 * Uses lazy Stripe initialization to avoid build failures without env vars.
 * All monetary values in INTEGER CENTS.
 *
 * Contains full logic structure with TODO markers for actual Stripe SDK calls.
 */

import type Stripe from 'stripe';
import type {
  SubscriptionTier,
  SubscriptionStatus,
  ProSubscription,
  SubscriptionWebhookEvent,
} from './types';
import { getPlanByTier, isValidUpgrade, isDowngrade } from './plans';

// ---------------------------------------------------------------------------
// Lazy Stripe Initialization
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeSDK = require('stripe') as typeof Stripe;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Cannot initialize Stripe.',
      );
    }
    _stripe = new StripeSDK(key, {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}

// Suppress unused variable warning — getStripe is ready for real Stripe calls
void getStripe;

// ---------------------------------------------------------------------------
// Create Subscription
// ---------------------------------------------------------------------------

/**
 * Create a new Stripe subscription for a Pro.
 *
 * 1. Look up or create a Stripe Customer for the Pro
 * 2. Attach the provided payment method
 * 3. Create a subscription with the appropriate Price
 * 4. Persist the subscription record
 *
 * @param proId            Internal Pro user ID
 * @param tier             Target subscription tier
 * @param paymentMethodId  Stripe PaymentMethod ID from frontend
 * @returns Subscription record
 */
export async function createSubscription(
  proId: string,
  tier: SubscriptionTier,
  paymentMethodId: string,
): Promise<ProSubscription> {
  if (!proId) throw new Error('proId is required');
  if (!paymentMethodId) throw new Error('paymentMethodId is required');

  if (tier === 'standard') {
    throw new Error('Standard tier is free and does not require a subscription');
  }

  const plan = getPlanByTier(tier);
  if (!plan.stripePriceId) {
    throw new Error(`No Stripe Price configured for tier: ${tier}`);
  }

  // TODO: Look up existing Stripe customer or create one
  // const stripe = getStripe();
  // let customer: Stripe.Customer;
  // const existingCustomerId = await db.query.pros.findFirst({
  //   where: eq(pros.id, proId),
  //   columns: { stripeCustomerId: true },
  // });
  // if (existingCustomerId?.stripeCustomerId) {
  //   customer = await stripe.customers.retrieve(existingCustomerId.stripeCustomerId);
  // } else {
  //   customer = await stripe.customers.create({
  //     metadata: { proId, platform: 'sherpa_pros' },
  //   });
  // }

  // TODO: Attach payment method to customer
  // await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
  // await stripe.customers.update(customer.id, {
  //   invoice_settings: { default_payment_method: paymentMethodId },
  // });

  // TODO: Create subscription
  // const subscription = await stripe.subscriptions.create({
  //   customer: customer.id,
  //   items: [{ price: plan.stripePriceId }],
  //   payment_behavior: 'default_incomplete',
  //   payment_settings: {
  //     payment_method_types: ['card'],
  //     save_default_payment_method: 'on_subscription',
  //   },
  //   metadata: { proId, tier, platform: 'sherpa_pros' },
  //   expand: ['latest_invoice.payment_intent'],
  // });

  void paymentMethodId;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const record: ProSubscription = {
    id: `sub_placeholder_${proId}_${Date.now()}`,
    proId,
    tier,
    status: 'active',
    stripeSubscriptionId: `sub_stripe_placeholder_${proId}`,
    stripeCustomerId: `cus_placeholder_${proId}`,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  // TODO: Persist to database
  // await db.insert(subscriptions).values(record);

  return record;
}

// ---------------------------------------------------------------------------
// Cancel Subscription
// ---------------------------------------------------------------------------

/**
 * Cancel a Pro's subscription at the end of the current billing period.
 * The Pro retains tier benefits until the period ends.
 *
 * @param proId  Internal Pro user ID
 * @returns Updated subscription with cancelAtPeriodEnd = true
 */
export async function cancelSubscription(
  proId: string,
): Promise<ProSubscription> {
  if (!proId) throw new Error('proId is required');

  // TODO: Fetch current subscription from database
  // const existing = await db.query.subscriptions.findFirst({
  //   where: eq(subscriptions.proId, proId),
  // });
  // if (!existing) throw new Error('No active subscription found');

  // TODO: Cancel at period end via Stripe
  // const stripe = getStripe();
  // await stripe.subscriptions.update(existing.stripeSubscriptionId, {
  //   cancel_at_period_end: true,
  // });

  // TODO: Update database
  // await db.update(subscriptions)
  //   .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
  //   .where(eq(subscriptions.proId, proId));

  return {
    id: `sub_placeholder_${proId}`,
    proId,
    tier: 'emergency_ready',
    status: 'active',
    stripeSubscriptionId: `sub_stripe_placeholder_${proId}`,
    stripeCustomerId: `cus_placeholder_${proId}`,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    cancelAtPeriodEnd: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Upgrade Subscription
// ---------------------------------------------------------------------------

/**
 * Upgrade a Pro's subscription to a higher tier with proration.
 * Takes effect immediately; Stripe prorates the billing.
 *
 * @param proId    Internal Pro user ID
 * @param newTier  Target tier (must be higher than current)
 * @returns Updated subscription record
 */
export async function upgradeSubscription(
  proId: string,
  newTier: SubscriptionTier,
): Promise<ProSubscription> {
  if (!proId) throw new Error('proId is required');

  // TODO: Fetch current subscription
  // const existing = await db.query.subscriptions.findFirst({
  //   where: eq(subscriptions.proId, proId),
  // });
  // if (!existing) throw new Error('No active subscription found');

  const currentTier: SubscriptionTier = 'emergency_ready'; // TODO: from DB
  if (!isValidUpgrade(currentTier, newTier)) {
    throw new Error(
      `Cannot upgrade from ${currentTier} to ${newTier}. Target must be a higher tier.`,
    );
  }

  const newPlan = getPlanByTier(newTier);
  if (!newPlan.stripePriceId) {
    throw new Error(`No Stripe Price configured for tier: ${newTier}`);
  }

  // TODO: Update subscription in Stripe with proration
  // const stripe = getStripe();
  // const subscription = await stripe.subscriptions.retrieve(existing.stripeSubscriptionId);
  // await stripe.subscriptions.update(existing.stripeSubscriptionId, {
  //   items: [{
  //     id: subscription.items.data[0].id,
  //     price: newPlan.stripePriceId,
  //   }],
  //   proration_behavior: 'create_prorations',
  //   metadata: { tier: newTier },
  // });

  // TODO: Update database
  // await db.update(subscriptions)
  //   .set({ tier: newTier, updatedAt: new Date() })
  //   .where(eq(subscriptions.proId, proId));

  return {
    id: `sub_placeholder_${proId}`,
    proId,
    tier: newTier,
    status: 'active',
    stripeSubscriptionId: `sub_stripe_placeholder_${proId}`,
    stripeCustomerId: `cus_placeholder_${proId}`,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Downgrade Subscription
// ---------------------------------------------------------------------------

/**
 * Schedule a downgrade to a lower tier at the end of the current billing period.
 * The Pro keeps current tier benefits until the period ends.
 *
 * @param proId    Internal Pro user ID
 * @param newTier  Target tier (must be lower than current)
 * @returns Updated subscription record
 */
export async function downgradeSubscription(
  proId: string,
  newTier: SubscriptionTier,
): Promise<ProSubscription> {
  if (!proId) throw new Error('proId is required');

  const currentTier: SubscriptionTier = 'restoration_certified'; // TODO: from DB
  if (!isDowngrade(currentTier, newTier)) {
    throw new Error(
      `Cannot downgrade from ${currentTier} to ${newTier}. Target must be a lower tier.`,
    );
  }

  // TODO: Schedule the downgrade via Stripe subscription schedule
  // const stripe = getStripe();
  // const subscription = await stripe.subscriptions.retrieve(existing.stripeSubscriptionId);
  //
  // If downgrading to standard (free), cancel at period end:
  // if (newTier === 'standard') {
  //   await stripe.subscriptions.update(existing.stripeSubscriptionId, {
  //     cancel_at_period_end: true,
  //   });
  // } else {
  //   // Create a schedule to change price at period end
  //   const schedule = await stripe.subscriptionSchedules.create({
  //     from_subscription: existing.stripeSubscriptionId,
  //   });
  //   await stripe.subscriptionSchedules.update(schedule.id, {
  //     phases: [
  //       { items: [{ price: currentPlan.stripePriceId }], end_date: subscription.current_period_end },
  //       { items: [{ price: newPlan.stripePriceId }] },
  //     ],
  //   });
  // }

  // TODO: Update database with scheduled downgrade
  // await db.update(subscriptions)
  //   .set({ scheduledTier: newTier, updatedAt: new Date() })
  //   .where(eq(subscriptions.proId, proId));

  return {
    id: `sub_placeholder_${proId}`,
    proId,
    tier: currentTier,
    status: 'active',
    stripeSubscriptionId: `sub_stripe_placeholder_${proId}`,
    stripeCustomerId: `cus_placeholder_${proId}`,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    cancelAtPeriodEnd: newTier === 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Get Subscription Status
// ---------------------------------------------------------------------------

/**
 * Retrieve the current subscription status for a Pro.
 *
 * @param proId  Internal Pro user ID
 * @returns Current subscription or null if on Standard (free) tier
 */
export async function getSubscriptionStatus(
  proId: string,
): Promise<ProSubscription | null> {
  if (!proId) throw new Error('proId is required');

  // TODO: Fetch from database
  // const subscription = await db.query.subscriptions.findFirst({
  //   where: and(
  //     eq(subscriptions.proId, proId),
  //     ne(subscriptions.status, 'canceled'),
  //   ),
  // });
  // if (!subscription) return null;

  // TODO: Optionally sync with Stripe for real-time status
  // const stripe = getStripe();
  // const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
  // if (stripeSub.status !== subscription.status) {
  //   await db.update(subscriptions)
  //     .set({ status: stripeSub.status, updatedAt: new Date() })
  //     .where(eq(subscriptions.id, subscription.id));
  // }

  // Placeholder: return null to indicate Standard tier
  void proId;
  return null;
}

// ---------------------------------------------------------------------------
// Webhook Handler
// ---------------------------------------------------------------------------

/**
 * Process Stripe Billing webhook events for subscription lifecycle.
 *
 * @param event  Parsed webhook event from Stripe
 */
export async function handleSubscriptionWebhook(
  event: SubscriptionWebhookEvent,
): Promise<void> {
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      // TODO: Update subscription status to 'active'
      // await db.update(subscriptions)
      //   .set({ status: 'active', updatedAt: new Date() })
      //   .where(eq(subscriptions.stripeSubscriptionId, event.subscriptionId));

      // TODO: Log billing event
      // await db.insert(billingEvents).values({
      //   type: 'payment_succeeded',
      //   subscriptionId: event.subscriptionId,
      //   proId: event.proId,
      //   timestamp: event.timestamp,
      // });
      break;
    }

    case 'invoice.payment_failed': {
      // TODO: Update subscription status to 'past_due'
      // await db.update(subscriptions)
      //   .set({ status: 'past_due', updatedAt: new Date() })
      //   .where(eq(subscriptions.stripeSubscriptionId, event.subscriptionId));

      // TODO: Send notification to Pro about failed payment
      // await notificationService.send(event.proId, {
      //   type: 'payment_failed',
      //   message: 'Your subscription payment failed. Please update your payment method.',
      // });
      break;
    }

    case 'customer.subscription.deleted': {
      // TODO: Mark subscription as canceled and revert to Standard tier
      // await db.update(subscriptions)
      //   .set({ status: 'canceled', tier: 'standard', updatedAt: new Date() })
      //   .where(eq(subscriptions.stripeSubscriptionId, event.subscriptionId));
      break;
    }

    case 'customer.subscription.updated': {
      // TODO: Sync subscription state from Stripe
      // const stripe = getStripe();
      // const sub = await stripe.subscriptions.retrieve(event.subscriptionId);
      // await db.update(subscriptions)
      //   .set({
      //     status: sub.status as SubscriptionStatus,
      //     currentPeriodStart: new Date(sub.current_period_start * 1000).toISOString(),
      //     currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
      //     cancelAtPeriodEnd: sub.cancel_at_period_end,
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(subscriptions.stripeSubscriptionId, event.subscriptionId));
      break;
    }

    case 'customer.subscription.created': {
      // TODO: Record new subscription
      // Already handled by createSubscription(), but webhook is the source of truth
      break;
    }

    default: {
      // Unknown event type — log and skip
      console.warn(`Unhandled subscription webhook event: ${event.type}`);
    }
  }
}
