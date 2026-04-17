// ---------------------------------------------------------------------------
// POST /api/materials/order
// Server-side route that places Home Depot orders via Zinc API (or mock).
// Keeps ZINC_API_KEY server-side — never exposed to client.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { placeHomeDepotOrder } from '@/lib/services/zinc';
import type { OrderRequest } from '@/lib/services/zinc';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;

    if (!body.items?.length) {
      return NextResponse.json(
        { error: 'items array is required' },
        { status: 400 },
      );
    }

    if (!body.deliveryTier) {
      return NextResponse.json(
        { error: 'deliveryTier is required' },
        { status: 400 },
      );
    }

    if (!body.clientName?.trim()) {
      return NextResponse.json(
        { error: 'clientName is required' },
        { status: 400 },
      );
    }

    // Validate delivery address for delivery tiers
    if (
      (body.deliveryTier === 'hd_delivery' || body.deliveryTier === 'gig') &&
      !body.deliveryAddress
    ) {
      return NextResponse.json(
        { error: 'deliveryAddress is required for delivery tiers' },
        { status: 400 },
      );
    }

    // Validate BOPIS has storeId
    if (body.deliveryTier === 'bopis' && !body.storeId) {
      // Allow without storeId — Zinc will pick nearest store
    }

    const result = await placeHomeDepotOrder(body);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Order placement failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
