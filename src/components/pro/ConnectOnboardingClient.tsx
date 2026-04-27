'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from '@stripe/react-connect-js';

export function ConnectOnboardingClient() {
  const router = useRouter();
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      const res = await fetch('/api/stripe/connect/account-session', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Could not mint AccountSession');
      }
      const { clientSecret } = await res.json();
      return clientSecret as string;
    };

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret,
      appearance: {
        variables: {
          colorPrimary: '#1a1a2e',
        },
      },
    });
  });

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => router.push('/pro/dashboard')}
      />
    </ConnectComponentsProvider>
  );
}
