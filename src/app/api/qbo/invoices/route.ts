import { NextRequest, NextResponse } from 'next/server';
import {
  getInvoices,
  createInvoice,
  syncJobToInvoice,
  isQBOConfigured,
  type QBOTokens,
} from '@/lib/services/quickbooks';

function getTokensFromRequest(request: NextRequest): QBOTokens {
  const cookie = request.cookies.get('sherpa-qbo')?.value;
  if (cookie) {
    try {
      return JSON.parse(cookie) as QBOTokens;
    } catch {
      // fall through to mock
    }
  }
  // Return mock tokens for development
  return {
    accessToken: 'mock_qbo_access_token',
    refreshToken: 'mock_qbo_refresh_token',
    realmId: 'mock_realm_123456',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const tokens = getTokensFromRequest(request);
    const invoices = await getInvoices(tokens);
    return NextResponse.json({
      invoices,
      mock: !isQBOConfigured(),
    });
  } catch (err) {
    console.error('QBO get invoices error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokens = getTokensFromRequest(request);
    const body = await request.json();

    let invoice;
    if (body.jobId) {
      invoice = await syncJobToInvoice(tokens, body.jobId);
    } else {
      invoice = await createInvoice(tokens, body);
    }

    return NextResponse.json({
      invoice,
      mock: !isQBOConfigured(),
    });
  } catch (err) {
    console.error('QBO create invoice error:', err);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 },
    );
  }
}
