// ---------------------------------------------------------------------------
// Stripe Card Hold Service — Materials Payments
// Reads STRIPE_SECRET_KEY from process.env (server-side only).
// If no key: returns mock payment intent with realistic structure.
// If key set: creates real Stripe PaymentIntent with capture_method: 'manual'.
// ---------------------------------------------------------------------------

import Stripe from 'stripe';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardHoldResult {
  paymentIntentId: string;
  status: 'authorized' | 'failed' | 'mock';
  amountCents: number;
  expiresAt: string; // ISO datetime — 7 days from now
  isMock: boolean;
}

export interface CaptureResult {
  paymentIntentId: string;
  status: 'captured' | 'failed' | 'mock';
  amountCents: number;
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Lazy Stripe initialization — same pattern as existing payments module
// ---------------------------------------------------------------------------

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe | null {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeInstance = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateMockId(): string {
  return `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function expiresIn7Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Create a card hold (authorization without capture)
// ---------------------------------------------------------------------------

export async function createMaterialsHold(
  amountCents: number,
  customerId?: string,
  description?: string,
): Promise<CardHoldResult> {
  if (amountCents <= 0) {
    throw new RangeError('amountCents must be positive');
  }

  const stripe = getStripe();

  // Mock mode — no Stripe key configured
  if (!stripe) {
    return {
      paymentIntentId: generateMockId(),
      status: 'mock',
      amountCents,
      expiresAt: expiresIn7Days(),
      isMock: true,
    };
  }

  // Real mode — create Stripe PaymentIntent with manual capture
  try {
    const params: Stripe.PaymentIntentCreateParams = {
      amount: amountCents,
      currency: 'usd',
      capture_method: 'manual',
      description: description ?? 'Sherpa Pros — Materials Hold',
      metadata: { platform: 'sherpa_pros', type: 'materials_hold' },
    };

    if (customerId) {
      params.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    return {
      paymentIntentId: paymentIntent.id,
      status: 'authorized',
      amountCents,
      expiresAt: expiresIn7Days(),
      isMock: false,
    };
  } catch {
    return {
      paymentIntentId: '',
      status: 'failed',
      amountCents,
      expiresAt: '',
      isMock: false,
    };
  }
}

// ---------------------------------------------------------------------------
// Capture the held amount after job completion
// ---------------------------------------------------------------------------

export async function captureMaterialsHold(
  paymentIntentId: string,
  amountCents?: number,
): Promise<CaptureResult> {
  if (!paymentIntentId) {
    throw new Error('paymentIntentId is required');
  }

  const stripe = getStripe();

  // Mock mode
  if (!stripe) {
    return {
      paymentIntentId,
      status: 'mock',
      amountCents: amountCents ?? 0,
      isMock: true,
    };
  }

  // Real mode — capture the PaymentIntent
  try {
    const captureParams: Stripe.PaymentIntentCaptureParams = {};
    if (amountCents !== undefined) {
      captureParams.amount_to_capture = amountCents;
    }

    const captured = await stripe.paymentIntents.capture(
      paymentIntentId,
      captureParams,
    );

    return {
      paymentIntentId: captured.id,
      status: 'captured',
      amountCents: captured.amount_received,
      isMock: false,
    };
  } catch {
    return {
      paymentIntentId,
      status: 'failed',
      amountCents: amountCents ?? 0,
      isMock: false,
    };
  }
}

// ---------------------------------------------------------------------------
// Cancel a hold (release funds back to client)
// ---------------------------------------------------------------------------

export async function cancelMaterialsHold(
  paymentIntentId: string,
): Promise<{ success: boolean; isMock: boolean }> {
  if (!paymentIntentId) {
    throw new Error('paymentIntentId is required');
  }

  const stripe = getStripe();

  // Mock mode
  if (!stripe) {
    return { success: true, isMock: true };
  }

  // Real mode — cancel the PaymentIntent
  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    return { success: true, isMock: false };
  } catch {
    return { success: false, isMock: false };
  }
}
