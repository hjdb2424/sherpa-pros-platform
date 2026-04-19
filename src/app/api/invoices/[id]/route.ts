import { NextResponse } from 'next/server';
import { getInvoiceById, generateInvoice, formatInvoiceHTML } from '@/lib/services/invoices';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  // Try to find by invoice ID first, then by job ID
  let invoice = getInvoiceById(id);
  if (!invoice) {
    invoice = generateInvoice(id);
  }

  if (format === 'html') {
    const html = formatInvoiceHTML(invoice);
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  return NextResponse.json({ invoice });
}
