import { NextResponse } from 'next/server';
import {
  createDeliveryRequest,
  estimateDelivery,
} from '@/lib/dispatch/delivery-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, pickupAddress, dropoffAddress } = body as {
      orderId?: string;
      pickupAddress?: string;
      dropoffAddress?: string;
    };

    if (!orderId || !pickupAddress || !dropoffAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, pickupAddress, dropoffAddress' },
        { status: 400 },
      );
    }

    const delivery = createDeliveryRequest(orderId, pickupAddress, dropoffAddress);

    return NextResponse.json({
      delivery,
      message: `Delivery requested. Driver ${delivery.driverName ?? 'pending'} assigned. ETA: ${delivery.estimatedMinutes} min.`,
    }, { status: 201 });
  } catch (error) {
    console.error('[api/delivery/request] POST failed:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery request' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pickup = searchParams.get('pickup') ?? '';
    const dropoff = searchParams.get('dropoff') ?? '';

    if (!pickup || !dropoff) {
      return NextResponse.json(
        { error: 'Missing query params: pickup, dropoff' },
        { status: 400 },
      );
    }

    const estimate = estimateDelivery(pickup, dropoff);

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error('[api/delivery/request] GET failed:', error);
    return NextResponse.json(
      { error: 'Failed to estimate delivery' },
      { status: 500 },
    );
  }
}
