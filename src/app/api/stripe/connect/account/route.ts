import { NextResponse } from 'next/server';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId, setStripeAccountId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';

export async function POST() {
  const appUser = await getAppUser();
  if (!appUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
  }

  if (dbUser.stripeAccountId) {
    return NextResponse.json({
      stripeAccountId: dbUser.stripeAccountId,
      status: dbUser.stripeAccountStatus,
    });
  }

  const result = await getPaymentService().ensureConnectedAccount(
    dbUser.id,
    appUser.email,
  );
  await setStripeAccountId(dbUser.id, result.stripeAccountId, result.status);

  return NextResponse.json({
    stripeAccountId: result.stripeAccountId,
    status: result.status,
  });
}
