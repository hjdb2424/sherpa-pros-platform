import { NextRequest, NextResponse } from 'next/server';
import {
  getQuote,
  saveQuote,
  calculateQuoteTotals,
  formatQuoteHTML,
  type Quote,
  type QuoteLineItem,
} from '@/lib/services/quote-builder';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/quotes/[id]?format=html
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const quote = getQuote(id);

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get('format');
  if (format === 'html') {
    const html = formatQuoteHTML(quote);
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.json({ quote });
}

// PATCH /api/quotes/[id]
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const existing = getQuote(id);

  if (!existing) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updates = body as Partial<Quote> & { lineItems?: QuoteLineItem[] };

    const merged: Quote = { ...existing, ...updates };

    // Recalculate totals if line items, tax, or discount changed
    if (updates.lineItems || updates.taxPct !== undefined || updates.discountPct !== undefined) {
      const totals = calculateQuoteTotals(
        merged.lineItems,
        merged.taxPct,
        merged.discountPct,
      );
      Object.assign(merged, totals);
    }

    const saved = saveQuote(merged);
    return NextResponse.json({ quote: saved });
  } catch {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
