import { NextResponse } from 'next/server';
import {
  fetchReviews,
  importReviews,
  type SocialPlatform,
} from '@/lib/services/social-sync';

const VALID_PLATFORMS = new Set<SocialPlatform>([
  'google',
  'instagram',
  'facebook',
  'yelp',
  'nextdoor',
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as SocialPlatform;

  if (!platform || !VALID_PLATFORMS.has(platform)) {
    return NextResponse.json(
      { error: 'Missing or invalid platform query parameter' },
      { status: 400 },
    );
  }

  const reviews = await fetchReviews(platform);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const body = await request.json();
  const reviewIds = body.reviewIds as string[];

  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    return NextResponse.json(
      { error: 'reviewIds must be a non-empty array' },
      { status: 400 },
    );
  }

  const result = await importReviews(reviewIds);
  return NextResponse.json({ success: true, ...result });
}
