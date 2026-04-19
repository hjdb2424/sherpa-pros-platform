import { NextResponse } from 'next/server';
import { getQBOAuthUrl } from '@/lib/services/quickbooks';

export async function GET() {
  const url = getQBOAuthUrl();
  return NextResponse.redirect(url);
}
