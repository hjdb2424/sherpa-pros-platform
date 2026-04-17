// ---------------------------------------------------------------------------
// POST /api/materials/price
// Server-side route that calls SerpApi (or mock) to price-check materials.
// Keeps SERPAPI_API_KEY server-side — never exposed to client.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { priceCheckMaterials } from '@/lib/services/serpapi';
import type { HDProduct } from '@/lib/services/serpapi';

interface PriceRequestBody {
  materials: { name: string; spec: string }[];
  zipCode: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PriceRequestBody;

    if (!body.materials?.length) {
      return NextResponse.json(
        { error: 'materials array is required' },
        { status: 400 },
      );
    }

    if (!body.zipCode || !/^\d{5}$/.test(body.zipCode)) {
      return NextResponse.json(
        { error: 'Valid 5-digit zipCode is required' },
        { status: 400 },
      );
    }

    const resultsMap = await priceCheckMaterials(body.materials, body.zipCode);

    // Convert Map to serializable object
    const products: Record<string, HDProduct> = {};
    for (const [key, value] of resultsMap) {
      products[key] = value;
    }

    const isMock = !process.env.SERPAPI_API_KEY;

    return NextResponse.json({ products, isMock });
  } catch (err) {
    console.error('Price check failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
