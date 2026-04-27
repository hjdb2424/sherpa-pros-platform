import { redirect } from 'next/navigation';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId, setStripeAccountId } from '@/db/queries/users';
import { getPaymentService } from '@/lib/services/payments';
import { ConnectOnboardingClient } from '@/components/pro/ConnectOnboardingClient';

export default async function PayoutsOnboardingPage() {
  const appUser = await getAppUser();
  if (!appUser) {
    redirect('/sign-in');
  }

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) {
    redirect('/sign-in');
  }

  // Ensure Stripe Connected Account exists before client component mints session
  if (!dbUser.stripeAccountId) {
    const result = await getPaymentService().ensureConnectedAccount(
      dbUser.id,
      appUser.email,
    );
    await setStripeAccountId(dbUser.id, result.stripeAccountId, result.status);
  }

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Get verified to start earning</h1>
      <p className="text-slate-600 mb-6">
        Stripe handles your identity and bank info securely. ~3 minutes.
      </p>
      <ConnectOnboardingClient />
    </main>
  );
}
