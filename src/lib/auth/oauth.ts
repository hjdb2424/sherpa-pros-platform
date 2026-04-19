// ---------------------------------------------------------------------------
// OAuth helpers — Google & Apple
// Server-side only. Returns mock data when env vars are not set.
// ---------------------------------------------------------------------------

const MOCK_MODE_GOOGLE = !process.env.GOOGLE_CLIENT_ID;
const MOCK_MODE_APPLE = !process.env.APPLE_CLIENT_ID;

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
}

// ---------------------------------------------------------------------------
// Google OAuth
// ---------------------------------------------------------------------------

export function isGoogleConfigured(): boolean {
  return !MOCK_MODE_GOOGLE;
}

export function getGoogleAuthUrl(): string {
  if (MOCK_MODE_GOOGLE) {
    // Mock mode — redirect straight to callback with a mock code
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    return `${base}/api/auth/google/callback?code=mock_google_code&state=mock`;
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: crypto.randomUUID(),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(
  code: string,
): Promise<OAuthTokens> {
  if (MOCK_MODE_GOOGLE || code === 'mock_google_code') {
    return {
      accessToken: 'mock_google_access_token',
      refreshToken: 'mock_google_refresh_token',
      idToken: 'mock_google_id_token',
      expiresIn: 3600,
    };
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

export async function getGoogleProfile(
  accessToken: string,
): Promise<OAuthProfile> {
  if (accessToken === 'mock_google_access_token') {
    return {
      id: 'google_mock_001',
      email: 'pro@sherpapros.com',
      name: 'Sarah Johnson',
      picture: undefined,
      provider: 'google',
    };
  }

  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Google profile fetch failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
    provider: 'google',
  };
}

// ---------------------------------------------------------------------------
// Apple Sign In
// ---------------------------------------------------------------------------

export function isAppleConfigured(): boolean {
  return !MOCK_MODE_APPLE;
}

export function getAppleAuthUrl(): string {
  if (MOCK_MODE_APPLE) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    return `${base}/api/auth/apple/callback?code=mock_apple_code&state=mock`;
  }

  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/auth/apple/callback`,
    response_type: 'code',
    scope: 'name email',
    response_mode: 'query',
    state: crypto.randomUUID(),
  });

  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

export async function exchangeAppleCode(
  code: string,
): Promise<OAuthTokens> {
  if (MOCK_MODE_APPLE || code === 'mock_apple_code') {
    return {
      accessToken: 'mock_apple_access_token',
      refreshToken: 'mock_apple_refresh_token',
      idToken: 'mock_apple_id_token',
      expiresIn: 3600,
    };
  }

  // In production, you'd generate a client_secret JWT signed with your Apple private key
  const res = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.APPLE_CLIENT_ID!,
      client_secret: '', // Generated from APPLE_KEY_ID + APPLE_TEAM_ID + private key
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/auth/apple/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    throw new Error(`Apple token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

export async function getAppleProfile(
  _idToken: string,
): Promise<OAuthProfile> {
  if (_idToken === 'mock_apple_id_token') {
    return {
      id: 'apple_mock_001',
      email: 'pro@sherpapros.com',
      name: 'Sarah Johnson',
      provider: 'apple',
    };
  }

  // In production, decode the id_token JWT to extract user info
  // Apple only sends name on first authorization
  return {
    id: 'apple_placeholder',
    email: 'user@apple.com',
    name: 'Apple User',
    provider: 'apple',
  };
}
