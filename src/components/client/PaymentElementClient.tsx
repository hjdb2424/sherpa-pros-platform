'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface Props {
  clientSecret: string;
  returnUrl: string;
}

function PaymentForm({ returnUrl }: { returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    if (result.error) {
      setError(result.error.message ?? 'Payment failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Processing…' : 'Fund milestone'}
      </button>
    </form>
  );
}

export function PaymentElementClient({ clientSecret, returnUrl }: Props) {
  if (!stripePromise) {
    return (
      <p className="text-sm text-red-600" role="alert">
        Payment unavailable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.
      </p>
    );
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: { colorPrimary: '#1a1a2e' },
        },
      }}
    >
      <PaymentForm returnUrl={returnUrl} />
    </Elements>
  );
}
