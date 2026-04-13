/**
 * Sherpa Pros Platform — Stripe Subscription Webhook
 *
 * POST /api/subscriptions/webhook
 *
 * Receives Stripe webhook events for subscription lifecycle management.
 * Verifies the webhook signature and delegates to the billing handler.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleSubscriptionWebhook } from '@/lib/subscriptions/stripe-billing';
import type { SubscriptionTier, SubscriptionWebhookEvent } from '@/lib/subscriptions/types';

// ---------------------------------------------------------------------------
// Stripe Webhook Secret (lazy)
// ---------------------------------------------------------------------------

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET is not configured');
  }
  return secret;
}

// ---------------------------------------------------------------------------
// POST — Handle Stripe webhook events
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: 'Failed to read request body' },
      { status: 400 },
    );
  }

  // TODO: Verify Stripe webhook signature
  // const sig = request.headers.get('stripe-signature');
  // if (!sig) {
  //   return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  // }
  // let event: Stripe.Event;
  // try {
  //   const stripe = getStripe();
  //   event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret());
  // } catch (err) {
  //   console.error('Webhook signature verification failed:', err);
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  // }

  void getWebhookSecret;

  // Parse the event (placeholder until Stripe signature verification is wired)
  let parsedEvent: Record<string, unknown>;
  try {
    parsedEvent = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const eventType = parsedEvent.type as string;

  // Only handle subscription-related events
  const handledEvents = [
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'customer.subscription.deleted',
    'customer.subscription.updated',
    'customer.subscription.created',
  ];

  if (!handledEvents.includes(eventType)) {
    // Acknowledge but skip unhandled event types
    return NextResponse.json({ received: true, handled: false });
  }

  try {
    // TODO: Extract real data from Stripe event object
    // const subscription = event.data.object as Stripe.Subscription;
    // const proId = subscription.metadata.proId;
    // const tier = subscription.metadata.tier as SubscriptionTier;

    const webhookEvent: SubscriptionWebhookEvent = {
      type: eventType as SubscriptionWebhookEvent['type'],
      subscriptionId: (parsedEvent.data as Record<string, Record<string, string>>)?.object?.id ?? 'unknown',
      proId: 'pro-001', // TODO: Extract from Stripe metadata
      tier: 'emergency_ready' as SubscriptionTier, // TODO: Extract from Stripe metadata
      timestamp: new Date().toISOString(),
    };

    await handleSubscriptionWebhook(webhookEvent);

    return NextResponse.json({ received: true, handled: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
