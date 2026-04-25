import { NextResponse } from 'next/server';
import { listProducts, isTremendousConfigured } from '@/lib/services/tremendous';

// ---------------------------------------------------------------------------
// GET /api/rewards/products — list available Tremendous reward products
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  try {
    const products = await listProducts();
    return NextResponse.json({
      products,
      configured: isTremendousConfigured(),
      environment: process.env.TREMENDOUS_ENVIRONMENT ?? 'sandbox',
    });
  } catch (error) {
    console.error('[Rewards Products API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reward products' },
      { status: 500 },
    );
  }
}
