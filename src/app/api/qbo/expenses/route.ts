import { NextRequest, NextResponse } from 'next/server';
import {
  getExpenses,
  createExpense,
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

export async function GET(request: NextRequest) {
  try {
    const tokens = getTokensFromRequest(request);
    const expenses = await getExpenses(tokens);
    return NextResponse.json({
      expenses,
      mock: !isQBOConfigured(),
    });
  } catch (err) {
    console.error('QBO get expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokens = getTokensFromRequest(request);
    const body = await request.json();

    let expense;
    if (body.materialsListId) {
      expense = await syncMaterialsToExpense(tokens, body.materialsListId);
    } else {
      expense = await createExpense(tokens, body);
    }

    return NextResponse.json({
      expense,
      mock: !isQBOConfigured(),
    });
  } catch (err) {
    console.error('QBO create expense error:', err);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 },
    );
  }
}
