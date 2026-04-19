import { NextResponse } from 'next/server';
import { getAppleAuthUrl } from '@/lib/auth/oauth';

export async function GET() {
  const url = getAppleAuthUrl();
  return NextResponse.redirect(url);
}
