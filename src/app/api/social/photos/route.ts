import { NextResponse } from 'next/server';
import {
  fetchPhotos,
  importPhotos,
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

  const photos = await fetchPhotos(platform);
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const body = await request.json();
  const photoIds = body.photoIds as string[];

  if (!Array.isArray(photoIds) || photoIds.length === 0) {
    return NextResponse.json(
      { error: 'photoIds must be a non-empty array' },
      { status: 400 },
    );
  }

  const result = await importPhotos(photoIds);
  return NextResponse.json({ success: true, ...result });
}
