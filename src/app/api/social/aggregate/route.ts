import { NextResponse } from 'next/server';
import { getAggregateRating } from '@/lib/services/social-sync';

export async function GET() {
  const aggregate = await getAggregateRating();
  return NextResponse.json(aggregate);
}
