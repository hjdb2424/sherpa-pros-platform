// ---------------------------------------------------------------------------
// /api/materials/delivery — Gig Delivery API
// POST: Dispatch a new delivery
// GET:  Check delivery status
// DELETE: Cancel a delivery
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server';
import {
  dispatchGigDelivery,
  getGigDeliveryStatus,
  cancelGigDelivery,
} from '@/lib/services/gig-dispatcher';
import type { GigDeliveryRequest } from '@/lib/services/gig-dispatcher';

// POST /api/materials/delivery
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GigDeliveryRequest & {
      preferredProvider?: 'uber' | 'doordash';
    };

    // Basic validation
    if (!body.pickup?.storeAddress || !body.dropoff?.address) {
      return NextResponse.json(
        { error: 'Missing pickup or dropoff address' },
        { status: 400 },
      );
    }

    if (!body.itemDescription) {
      return NextResponse.json(
        { error: 'Missing item description' },
        { status: 400 },
      );
    }

    const result = await dispatchGigDelivery(body, body.preferredProvider);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Delivery dispatch failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/materials/delivery?id=XXX
export async function GET(req: NextRequest) {
  try {
    const deliveryId = req.nextUrl.searchParams.get('id');

    if (!deliveryId) {
      return NextResponse.json(
        { error: 'Missing delivery id parameter' },
        { status: 400 },
      );
    }

    const result = await getGigDeliveryStatus(deliveryId);

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Status check failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/materials/delivery
export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as { deliveryId: string };

    if (!body.deliveryId) {
      return NextResponse.json(
        { error: 'Missing deliveryId' },
        { status: 400 },
      );
    }

    const result = await cancelGigDelivery(body.deliveryId);

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Cancellation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
