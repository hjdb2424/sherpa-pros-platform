import { NextResponse } from 'next/server';
import { getDeliveryStatus } from '@/lib/dispatch/delivery-service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing delivery id' },
        { status: 400 },
      );
    }

    const delivery = getDeliveryStatus(id);

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ delivery });
  } catch (error) {
    console.error('[api/delivery/status] GET failed:', error);
    return NextResponse.json(
      { error: 'Failed to get delivery status' },
      { status: 500 },
    );
  }
}
