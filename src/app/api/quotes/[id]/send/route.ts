import { NextRequest, NextResponse } from 'next/server';
import { getQuote, saveQuote } from '@/lib/services/quote-builder';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/quotes/[id]/send
export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const quote = getQuote(id);

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  if (quote.status !== 'draft') {
    return NextResponse.json(
      { error: `Cannot send quote with status "${quote.status}"` },
      { status: 400 },
    );
  }

  const updated = saveQuote({
    ...quote,
    status: 'sent',
    sentAt: new Date().toISOString(),
  });

  // In production: trigger notification to client via Twilio / email
  return NextResponse.json({ quote: updated, message: 'Quote sent to client' });
}
