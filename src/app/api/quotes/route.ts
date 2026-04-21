import { NextRequest, NextResponse } from 'next/server';
import {
  generateQuoteFromJob,
  listQuotes,
  saveQuote,
} from '@/lib/services/quote-builder';

// GET /api/quotes?proId=...&jobId=...&status=...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const proId = searchParams.get('proId') ?? undefined;
  const jobId = searchParams.get('jobId') ?? undefined;
  const status = searchParams.get('status') ?? undefined;

  const quotes = listQuotes({ proId, jobId, status });
  return NextResponse.json({ quotes });
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
