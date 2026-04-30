// Apple Sign-In is currently DISABLED — see audit notes for unfixed bugs:
//   - hardcoded /pro/dashboard redirect
//   - skipped access-list check
//   - getAppleProfile() doesn't decode the JWT in production
//   - bypasses /auth/callback's role-aware routing
// Restore by re-implementing the handler properly. Until then, this
// route returns 503 so URL-probing can't accidentally trigger broken auth.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: "Apple Sign-In is not currently enabled. Use Google or email sign-in." },
    { status: 503 },
  );
}
