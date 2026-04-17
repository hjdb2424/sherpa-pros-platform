// ---------------------------------------------------------------------------
// POST /api/materials/capture — Capture a previously authorized card hold
// Keeps STRIPE_SECRET_KEY server-side — never exposed to client.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { captureMaterialsHold } from '@/lib/services/stripe-materials';

interface CaptureRequestBody {
  paymentIntentId: string;
  amountCents?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptureRequestBody;

    if (!body.paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 },
      );
    }

    if (body.amountCents !== undefined && body.amountCents <= 0) {
      return NextResponse.json(
        { error: 'amountCents must be a positive integer when provided' },
        { status: 400 },
      );
    }

    const result = await captureMaterialsHold(
      body.paymentIntentId,
      body.amountCents,
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
