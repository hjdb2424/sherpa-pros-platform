'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/brand/Logo';
import { seedUserData } from '@/lib/seed-user-data';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name') ?? 'User';
    const email = searchParams.get('email') ?? '';
    const provider = searchParams.get('provider') ?? 'google';
    const defaultRole = searchParams.get('role'); // from access list

    if (!email) {
      router.replace('/sign-in?error=no_email');
      return;
    }

    // Set localStorage so the rest of the app recognizes the session
    localStorage.setItem('sherpa-test-auth', 'true');
    localStorage.setItem('sherpa-test-email', email);
    localStorage.setItem('sherpa-test-name', name);
    localStorage.setItem('sherpa-auth-provider', provider);

    // Check if user has a role already (returning user)
    const existingRole = localStorage.getItem(`sherpa:${email}:role`);
    if (existingRole) {
      localStorage.setItem('sherpa-test-role', existingRole);
      seedUserData(email, existingRole);

      if (existingRole === 'pm') router.replace('/pm/dashboard');
      else if (existingRole === 'pro') router.replace('/pro/dashboard');
      else if (existingRole === 'tenant') router.replace('/tenant/dashboard');
      else router.replace('/client/dashboard');
      return;
    }

    // New user with a default role from the access list — skip role selection
    if (defaultRole && ['pm', 'pro', 'client', 'tenant'].includes(defaultRole)) {
      localStorage.setItem('sherpa-test-role', defaultRole);
      localStorage.setItem(`sherpa:${email}:role`, defaultRole);
      seedUserData(email, defaultRole);

      if (defaultRole === 'pm') router.replace('/pm/dashboard');
      else if (defaultRole === 'pro') router.replace('/pro/dashboard');
      else if (defaultRole === 'tenant') router.replace('/tenant/dashboard');
      else router.replace('/client/dashboard');
      return;
    }

    // New user, no default role — go to role selection
    router.replace('/select-role');
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <svg className="h-5 w-5 animate-spin text-[#00a9e0]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Signing you in...
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-zinc-500">Signing you in...</p>
        </div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
