import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateStripeAccountStatus } from '@/db/queries/users';
import type { StripeAccountStatus } from '@/lib/services/payments/types';

/**
 * POST /api/stripe/webhook
 * Stripe webhook endpoint. Validates signature via stripe.webhooks.constructEvent.
 *
 * Plan 1 events handled:
 * - account.updated → maps Stripe Account fields to local status, updates DB
 *
 * Plan 1 fallthrough: log + return 200 (Stripe retries on non-2xx).
 *
 * Spec: docs/superpowers/specs/2026-04-26-stripe-connect-onboarding-design.md §Webhook
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  // Read raw body BEFORE any parsing — constructEvent needs the exact bytes.
  const rawBody = await request.text();

  // In dev with no STRIPE_WEBHOOK_SECRET, skip validation. Production env
  // always has the secret set; this branch is for local Vitest runs without env.
  if (!webhookSecret) {
    console.warn('[stripe-webhook] running without secrets — skipping signature validation');
    try {
      const parsed = JSON.parse(rawBody);
      return await handleEvent(parsed);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 403 });
  }

  if (!secretKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 403 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secretKey, { typescript: true });
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] signature validation failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  return handleEvent(event);
}

async function handleEvent(event: Stripe.Event): Promise<Response> {
  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      const status = deriveAccountStatus(account);
      await updateStripeAccountStatus(account.id, status);
      console.log(`[stripe-webhook] account.updated ${account.id} -> ${status}`);
      break;
    }

    default:
      console.log(`[stripe-webhook] unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

function deriveAccountStatus(account: Stripe.Account): StripeAccountStatus {
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
