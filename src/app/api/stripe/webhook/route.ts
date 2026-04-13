import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebhookSuccessResponse {
  received: true;
  type: string;
}

interface WebhookErrorResponse {
  error: string;
  code: string;
}

// ---------------------------------------------------------------------------
// POST /api/stripe/webhook
// Handles incoming Stripe webhooks. Verifies the signature and processes
// relevant events: account.updated, payment_intent.succeeded, transfer.created
// ---------------------------------------------------------------------------

export async function POST(
  request: Request,
): Promise<NextResponse<WebhookSuccessResponse | WebhookErrorResponse>> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header', code: 'NO_SIGNATURE' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed', code: 'BAD_SIGNATURE' },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      // -----------------------------------------------------------------
      // Connect account status changed (onboarding complete, requirements
      // updated, capabilities changed, etc.)
      // -----------------------------------------------------------------
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        const proId = account.metadata?.proId;

        if (!proId) {
          console.warn('[Stripe Webhook] account.updated without proId metadata:', account.id);
          break;
        }

        const status = account.charges_enabled && account.payouts_enabled
          ? 'active'
          : account.requirements?.disabled_reason
            ? 'restricted'
            : 'pending';

        console.log(
          `[Stripe Webhook] account.updated: pro=${proId} status=${status} charges=${account.charges_enabled} payouts=${account.payouts_enabled}`,
        );

        // TODO: Persist status update
        // await db.update(pros).set({
        //   stripeConnectStatus: status,
        //   chargesEnabled: account.charges_enabled,
        //   payoutsEnabled: account.payouts_enabled,
        // }).where(eq(pros.id, proId));

        break;
      }

      // -----------------------------------------------------------------
      // Payment succeeded — funds have been captured from the client
      // -----------------------------------------------------------------
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const jobId = paymentIntent.metadata?.jobId;

        console.log(
          `[Stripe Webhook] payment_intent.succeeded: pi=${paymentIntent.id} job=${jobId} amount=${paymentIntent.amount}`,
        );

        // TODO: Update payment status in database
        // await db.update(payments).set({
        //   status: 'captured',
        //   updatedAt: new Date(),
        // }).where(eq(payments.stripePaymentIntentId, paymentIntent.id));

        // TODO: Notify Pro that payment has been received
        // await notifications.send(proId, {
        //   type: 'payment_received',
        //   jobId,
        //   amountCents: paymentIntent.amount,
        // });

        break;
      }

      // -----------------------------------------------------------------
      // Transfer created — funds have been sent to the Pro's Connect account
      // -----------------------------------------------------------------
      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;

        console.log(
          `[Stripe Webhook] transfer.created: tr=${transfer.id} dest=${transfer.destination} amount=${transfer.amount}`,
        );

        // TODO: Record payout in database
        // await db.insert(payouts).values({
        //   stripeTransferId: transfer.id,
        //   proConnectAccountId: transfer.destination,
        //   amountCents: transfer.amount,
        //   status: 'completed',
        //   createdAt: new Date(),
        // });

        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (err) {
    console.error('[Stripe Webhook] Event processing error:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed', code: 'PROCESSING_ERROR' },
      { status: 500 },
    );
  }
}
