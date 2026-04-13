'use client';

/**
 * StripeConnectButton — Triggers the Stripe Connect onboarding flow.
 * Calls the /api/stripe/connect endpoint and redirects the Pro
 * to Stripe's hosted onboarding page.
 */

import { useCallback, useState } from 'react';

interface StripeConnectButtonProps {
  proId: string;
  email: string;
  disabled?: boolean;
}

type ButtonState = 'idle' | 'loading' | 'error';

export default function StripeConnectButton({
  proId,
  email,
  disabled = false,
}: StripeConnectButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    setState('loading');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proId, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create Connect account');
      }

      const { onboardingUrl } = await res.json();
      // Redirect to Stripe hosted onboarding
      window.location.href = onboardingUrl;
    } catch (err) {
      setState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    }
  }, [proId, email]);

  return (
    <div>
      <button
        type="button"
        onClick={handleConnect}
        disabled={disabled || state === 'loading'}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#252545] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-busy={state === 'loading'}
      >
        {state === 'loading' ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Set Up Payments
          </>
        )}
      </button>

      {state === 'error' && errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
