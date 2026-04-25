import { NextResponse } from 'next/server';
import {
  listProducts,
  createReward,
  isTremendousConfigured,
  type TremendousOrder,
} from '@/lib/services/tremendous';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RedeemRequest {
  productId: string;
  amount: number;
  pointsCost: number;
  recipientName?: string;
  recipientEmail?: string;
}

interface RedeemSuccess {
  success: true;
  order: TremendousOrder;
  remainingPoints: number;
  isMockMode: boolean;
}

interface RedeemError {
  success: false;
  error: string;
  code: string;
}

interface GetResponse {
  products: Awaited<ReturnType<typeof listProducts>>;
  configured: boolean;
  environment: string;
}

// ---------------------------------------------------------------------------
// GET /api/rewards — list products + config status
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse<GetResponse | { error: string }>> {
  try {
    const products = await listProducts();
    return NextResponse.json({
      products,
      configured: isTremendousConfigured(),
      environment: process.env.TREMENDOUS_ENVIRONMENT ?? 'sandbox',
    });
  } catch (error) {
    console.error('[Rewards API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards products' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/rewards — redeem points for a reward
// ---------------------------------------------------------------------------

export async function POST(
  request: Request,
): Promise<NextResponse<RedeemSuccess | RedeemError>> {
  try {
    const body = (await request.json()) as RedeemRequest;
    const { productId, amount, pointsCost, recipientName, recipientEmail } = body;

    // Validate required fields
    if (!productId || !amount || !pointsCost) {
      return NextResponse.json(
        { success: false as const, error: 'Missing required fields: productId, amount, pointsCost', code: 'MISSING_FIELDS' },
        { status: 400 },
      );
    }

    if (amount <= 0 || pointsCost <= 0) {
      return NextResponse.json(
        { success: false as const, error: 'Amount and pointsCost must be positive', code: 'INVALID_AMOUNT' },
        { status: 400 },
      );
    }

    // Validate product exists and amount is within range
    const products = await listProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false as const, error: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 },
      );
    }

    if (amount < product.min_value || amount > product.max_value) {
      return NextResponse.json(
        {
          success: false as const,
          error: `Amount must be between $${product.min_value} and $${product.max_value} for ${product.name}`,
          code: 'AMOUNT_OUT_OF_RANGE',
        },
        { status: 400 },
      );
    }

    // Note: Point balance validation happens on the client side (localStorage).
    // In production this would check a database balance and use a transaction.
    // For beta, the client sends their current balance and we trust it.

    // Create the reward via Tremendous
    const order = await createReward({
      recipientName: recipientName ?? 'Sherpa Pro',
      recipientEmail: recipientEmail ?? 'pro@thesherpapros.com',
      amount,
      productId,
    });

    // Calculate remaining points (client will also update localStorage)
    // The pointsCost sent by client is the deducted amount
    const remainingPoints = 0; // Client manages this — returned as placeholder

    return NextResponse.json({
      success: true as const,
      order,
      remainingPoints,
      isMockMode: !isTremendousConfigured(),
    });
  } catch (error) {
    console.error('[Rewards API] POST error:', error);
    return NextResponse.json(
      { success: false as const, error: 'Failed to process reward redemption', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
