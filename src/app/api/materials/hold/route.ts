// ---------------------------------------------------------------------------
// POST /api/materials/hold — Create a card hold (authorization without capture)
// DELETE /api/materials/hold — Cancel a hold (release funds back to client)
// Keeps STRIPE_SECRET_KEY server-side — never exposed to client.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import {
  createMaterialsHold,
  cancelMaterialsHold,
} from '@/lib/services/stripe-materials';

interface HoldRequestBody {
  amountCents: number;
  customerId?: string;
  description?: string;
}

interface CancelRequestBody {
  paymentIntentId: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HoldRequestBody;

    if (!body.amountCents || body.amountCents <= 0) {
      return NextResponse.json(
        { error: 'amountCents must be a positive integer' },
        { status: 400 },
      );
    }

    const result = await createMaterialsHold(
      body.amountCents,
      body.customerId,
      body.description,
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as CancelRequestBody;

    if (!body.paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 },
      );
    }

    const result = await cancelMaterialsHold(body.paymentIntentId);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
