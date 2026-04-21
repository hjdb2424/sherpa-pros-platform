import { NextResponse } from 'next/server';
import {
  getConnections,
  connectPlatform,
  disconnectPlatform,
  type SocialPlatform,
} from '@/lib/services/social-sync';

const VALID_PLATFORMS = new Set<SocialPlatform>([
  'google',
  'instagram',
  'facebook',
  'yelp',
  'nextdoor',
]);

export async function GET() {
  const connections = getConnections();
  return NextResponse.json({ connections });
}

export async function POST(request: Request) {
  const body = await request.json();
  const platform = body.platform as SocialPlatform;
  const action = body.action as string | undefined;

  if (!platform || !VALID_PLATFORMS.has(platform)) {
    return NextResponse.json(
      { error: 'Invalid platform. Must be one of: google, instagram, facebook, yelp, nextdoor' },
      { status: 400 },
    );
  }

  if (action === 'disconnect') {
    await disconnectPlatform(platform);
    return NextResponse.json({ success: true, message: `Disconnected from ${platform}` });
  }

  const connection = await connectPlatform(platform);
  return NextResponse.json({ success: true, connection });
}
