// ---------------------------------------------------------------------------
// POST /api/materials/finance — Apply for Wisetack financing
// Keeps WISETACK_API_KEY server-side — never exposed to client.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import {
  applyForFinancing,
  type FinancingApplication,
} from '@/lib/services/wisetack';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FinancingApplication;

    if (!body.clientName || !body.clientEmail) {
      return NextResponse.json(
        { error: 'clientName and clientEmail are required' },
        { status: 400 },
      );
    }

    if (!body.amountCents || body.amountCents <= 0) {
      return NextResponse.json(
        { error: 'amountCents must be a positive integer' },
        { status: 400 },
      );
    }

    const result = await applyForFinancing(body);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
