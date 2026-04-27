import { NextResponse } from 'next/server';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';

export async function POST() {
  const appUser = await getAppUser();
  if (!appUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!dbUser.stripeAccountId) {
    return NextResponse.json(
      { error: 'Connected account not yet created. Call /api/stripe/connect/account first.' },
      { status: 400 },
    );
  }

  const result = await getPaymentService().createAccountSession(dbUser.stripeAccountId);

  return NextResponse.json({
    clientSecret: result.clientSecret,
    expiresAt: result.expiresAt,
  });
}
