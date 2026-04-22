import { NextRequest, NextResponse } from 'next/server';
import {
  generateQuoteFromJob,
  listQuotes,
  saveQuote,
} from '@/lib/services/quote-builder';
import { getSessionFromRequest } from '@/lib/auth/session';

// GET /api/quotes?proId=...&jobId=...&status=...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const proId = searchParams.get('proId') ?? undefined;
  const jobId = searchParams.get('jobId') ?? undefined;
  const status = searchParams.get('status') ?? undefined;

  const session = getSessionFromRequest(request);

  // Role-based scoping for quotes
  let scopedProId = proId;
  let scopedJobId = jobId;

  switch (session.role) {
    case 'pro':
      // Pro can only see their own quotes
      // For MVP: use proId filter if provided, otherwise scope to session
      if (!proId) {
        scopedProId = session.userId;
      }
      break;

    case 'client':
      // Client sees quotes for their jobs only
      // For MVP: use jobId filter if provided
      // Real impl: validate that jobId belongs to this client
      break;

    case 'pm':
      // PM sees all quotes for properties in their portfolio
      // For MVP: no additional filtering
      break;
  }

  const quotes = listQuotes({ proId: scopedProId, jobId: scopedJobId, status });
  return NextResponse.json({
    quotes,
    session: { userId: session.userId, role: session.role },
  });
}

// POST /api/quotes  { jobId: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body as { jobId?: string };

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const quote = generateQuoteFromJob(jobId);
    saveQuote(quote);
    return NextResponse.json({ quote }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
