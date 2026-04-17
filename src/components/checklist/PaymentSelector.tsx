'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { formatCents, type ClientTier } from '@/lib/pricing/fee-calculator';
import { calculateMonthlyPaymentCents } from '@/lib/services/wisetack';
import type { CardHoldResult } from '@/lib/services/stripe-materials';
import type { FinancingResult } from '@/lib/services/wisetack';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaymentSelectorProps {
  amountCents: number;
  clientTier: ClientTier;
  onPaymentComplete: (result: {
    method: 'card_hold' | 'financing';
    id: string;
  }) => void;
}

type PaymentState =
  | { phase: 'idle' }
  | { phase: 'loading'; method: 'card_hold' | 'financing' }
  | { phase: 'success'; method: 'card_hold' | 'financing'; id: string; data?: FinancingResult | CardHoldResult }
  | { phase: 'error'; method: 'card_hold' | 'financing'; message: string };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentSelector({
  amountCents,
  clientTier,
  onPaymentComplete,
}: PaymentSelectorProps) {
  const [state, setState] = useState<PaymentState>({ phase: 'idle' });

  // Preview monthly payment at 9.99% APR / 24 months
  const monthlyPreview = useMemo(
    () => calculateMonthlyPaymentCents(amountCents, 9.99, 24),
    [amountCents],
  );

  // Suppress unused var warning — clientTier reserved for future tier-specific messaging
  void clientTier;

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleCardHold = useCallback(async () => {
    setState({ phase: 'loading', method: 'card_hold' });

    try {
      const res = await fetch('/api/materials/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Payment authorization failed');
      }

      const data: CardHoldResult = await res.json();

      setState({
        phase: 'success',
        method: 'card_hold',
        id: data.paymentIntentId,
        data,
      });
      onPaymentComplete({ method: 'card_hold', id: data.paymentIntentId });
    } catch (err) {
      setState({
        phase: 'error',
        method: 'card_hold',
        message: err instanceof Error ? err.message : 'Authorization failed',
      });
    }
  }, [amountCents, onPaymentComplete]);

  const handleFinancing = useCallback(async () => {
    setState({ phase: 'loading', method: 'financing' });

    try {
      const res = await fetch('/api/materials/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: 'Client', // Will come from auth context
          clientEmail: 'client@example.com',
          amountCents,
          jobDescription: 'Materials financing',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Financing application failed');
      }

      const data: FinancingResult = await res.json();

      if (data.status === 'declined') {
        setState({
          phase: 'error',
          method: 'financing',
          message:
            "Unfortunately we couldn't approve financing. Try paying with card instead.",
        });
        return;
      }

      setState({
        phase: 'success',
        method: 'financing',
        id: data.applicationId,
        data,
      });
      onPaymentComplete({ method: 'financing', id: data.applicationId });
    } catch (err) {
      setState({
        phase: 'error',
        method: 'financing',
        message: err instanceof Error ? err.message : 'Financing failed',
      });
    }
  }, [amountCents, onPaymentComplete]);

  // -----------------------------------------------------------------------
  // Derived state helpers
  // -----------------------------------------------------------------------

  const isLoading = state.phase === 'loading';
  const isCardLoading = isLoading && state.method === 'card_hold';
  const isFinanceLoading = isLoading && state.method === 'financing';
  const isDone = state.phase === 'success';

  // -----------------------------------------------------------------------
  // Success view
  // -----------------------------------------------------------------------

  if (isDone) {
    const isCard = state.method === 'card_hold';
    const financingData = !isCard ? (state.data as FinancingResult) : null;

    return (
      <section
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-6"
        aria-label="Payment confirmed"
      >
        <div className="flex items-center gap-3">
          <CheckCircleIcon className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-200">
              {isCard ? 'Payment Authorized' : 'Financing Approved'}
            </h3>
            <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">
              {isCard
                ? 'Payment authorized — funds held for 7 days'
                : `Approved for ${formatCents(financingData?.approvedAmountCents ?? 0)} at ${financingData?.apr}% APR — ${formatCents(financingData?.monthlyPaymentCents ?? 0)}/mo for ${financingData?.termMonths} months`}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // -----------------------------------------------------------------------
  // Main view — two cards side by side
  // -----------------------------------------------------------------------

  return (
    <section
      className="space-y-4"
      aria-label="Choose payment method"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        {/* Card A: Pay with Card */}
        <div
          className={`relative rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-zinc-900 ${
            state.phase === 'error' && state.method === 'card_hold'
              ? 'border-red-300 dark:border-red-800'
              : 'border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a9e0]/10">
              <CreditCardIcon className="h-5 w-5 text-[#00a9e0]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Pay with Card
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Funds held on your card and only charged when work is complete
              </p>
            </div>
          </div>

          <p className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {formatCents(amountCents)}
          </p>

          {state.phase === 'error' && state.method === 'card_hold' && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              <XCircleIcon className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}

          <button
            onClick={handleCardHold}
            disabled={isLoading}
            className="w-full rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0090c0] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            {isCardLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Authorizing...
              </span>
            ) : (
              'Authorize Payment'
            )}
          </button>
        </div>

        {/* "or" divider */}
        <div className="flex items-center justify-center sm:flex-col">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700 sm:h-full sm:w-px" />
          <span className="shrink-0 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 sm:px-1 sm:py-3">
            or
          </span>
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700 sm:h-full sm:w-px" />
        </div>

        {/* Card B: Finance This Project */}
        <div
          className={`relative rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-zinc-900 ${
            state.phase === 'error' && state.method === 'financing'
              ? 'border-red-300 dark:border-red-800'
              : 'border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4500]/10">
              <BanknotesIcon className="h-5 w-5 text-[#ff4500]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Finance with Wisetack
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Apply in seconds. Pay over time. 0-29.9% APR.
              </p>
            </div>
          </div>

          <p className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            As low as {formatCents(monthlyPreview)}
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              /mo
            </span>
          </p>

          {state.phase === 'error' && state.method === 'financing' && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              <XCircleIcon className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}

          <button
            onClick={handleFinancing}
            disabled={isLoading}
            className="w-full rounded-full border-2 border-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-[#00a9e0] transition-all hover:bg-[#00a9e0]/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 dark:border-[#00a9e0]/60 dark:text-[#00a9e0] dark:hover:bg-[#00a9e0]/10 dark:focus-visible:ring-offset-zinc-900"
          >
            {isFinanceLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Applying...
              </span>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>

      {/* Trust callout */}
      <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
        <LockClosedIcon className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          All payments are encrypted and PCI-compliant. Your card is never
          charged until you approve completed work.
        </p>
      </div>
    </section>
  );
}
