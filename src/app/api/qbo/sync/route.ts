import { NextRequest, NextResponse } from 'next/server';
import {
  syncJobToInvoice,
  syncMaterialsToExpense,
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
  return {
    accessToken: 'mock_qbo_access_token',
    refreshToken: 'mock_qbo_refresh_token',
    realmId: 'mock_realm_123456',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const tokens = getTokensFromRequest(request);
    const body = await request.json();
    const { jobId, materialsListId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 },
      );
    }

    const invoice = await syncJobToInvoice(tokens, jobId);

    let expense = null;
    if (materialsListId) {
      expense = await syncMaterialsToExpense(tokens, materialsListId);
    }

    return NextResponse.json({
      invoice,
      expense,
      syncedAt: new Date().toISOString(),
      mock: !isQBOConfigured(),
    });
  } catch (err) {
    console.error('QBO sync error:', err);
    return NextResponse.json(
      { error: 'Failed to sync with QuickBooks' },
      { status: 500 },
    );
  }
}
