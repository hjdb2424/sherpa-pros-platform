'use client';

/**
 * PricingTable — Responsive pricing cards for client or pro plans.
 *
 * Shows 2 columns for client plans, 3 columns for pro plans.
 * Popular plan gets a sky-blue border + "Most Popular" badge.
 * Free plan: ghost "Current Plan" button. Paid plans: sky-blue pill "Subscribe".
 * Subscribe click shows a mock alert (Stripe not wired yet).
 */

import { useState, useRef, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Subscribe Modal
// ---------------------------------------------------------------------------

function SubscribeModal({
  plan,
  onClose,
}: {
  plan: { name: string; price: number };
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitted(true);
    },
    [email],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Subscribe to ${plan.name}`}
    >
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
              <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">You are on the list!</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              We will notify you at <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span> when billing is ready.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0ea5e9]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
                <svg className="h-6 w-6 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {plan.name} Plan
              </h3>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ${plan.price}<span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">/mo</span>
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                14-day free trial included
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="subscribe-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Enter your email to get started
              </label>
              <input
                ref={inputRef}
                id="subscribe-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0ea5e9] hover:shadow-lg active:scale-[0.98]"
              >
                Start Free Trial
              </button>
              <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
                We will notify you when billing is ready. No charge until then.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Plan data
// ---------------------------------------------------------------------------

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number; // monthly dollars, 0 = free
  description: string;
  popular: boolean;
  features: PlanFeature[];
  commission: string;
}

const CLIENT_PLANS: Plan[] = [
  {
    id: 'client-free',
    name: 'Free',
    price: 0,
    description: 'Basic access to the marketplace. Post jobs and find verified pros.',
    popular: false,
    commission: '18% service fee',
    features: [
      { text: 'Post unlimited jobs', included: true },
      { text: 'Browse verified pros', included: true },
      { text: 'Escrow payment protection', included: true },
      { text: 'Basic job matching', included: true },
      { text: '18% service fee per job', included: true },
      { text: 'Dedicated Sherpa Client Pro', included: false },
      { text: 'Priority matching', included: false },
      { text: 'First job fee-free', included: false },
    ],
  },
  {
    id: 'client-sherpa',
    name: 'Sherpa Plan',
    price: 29,
    description: 'A dedicated human Sherpa Client Pro to manage your projects and get priority matching.',
    popular: true,
    commission: '12% service fee',
    features: [
      { text: 'Post unlimited jobs', included: true },
      { text: 'Browse verified pros', included: true },
      { text: 'Escrow payment protection', included: true },
      { text: 'Priority job matching', included: true },
      { text: '12% service fee per job', included: true },
      { text: 'Dedicated Sherpa Client Pro', included: true },
      { text: 'First job fee-free', included: true },
      { text: 'Priority support line', included: true },
    ],
  },
];

const PRO_PLANS: Plan[] = [
  {
    id: 'pro-standard',
    name: 'Standard',
    price: 0,
    description: 'Get listed, browse jobs, and submit bids. No subscription required.',
    popular: false,
    commission: '15% commission',
    features: [
      { text: 'Listed on marketplace', included: true },
      { text: 'Browse and bid on jobs', included: true },
      { text: 'Basic profile and portfolio', included: true },
      { text: 'Weekly payouts', included: true },
      { text: '15% commission per job', included: true },
      { text: 'Emergency dispatch eligibility', included: false },
      { text: 'Insurance network access', included: false },
      { text: 'Xactimate bridge', included: false },
    ],
  },
  {
    id: 'pro-emergency',
    name: 'Emergency Ready',
    price: 299,
    description: 'Priority emergency dispatch with guaranteed response times and reduced commission.',
    popular: true,
    commission: '12% commission',
    features: [
      { text: 'Everything in Standard', included: true },
      { text: 'Emergency dispatch eligibility', included: true },
      { text: '4-hour response SLA', included: true },
      { text: 'Priority visibility in search', included: true },
      { text: '12% commission per job', included: true },
      { text: 'SLA compliance dashboard', included: true },
      { text: 'Instant payouts available', included: true },
      { text: 'Emergency badge on profile', included: true },
    ],
  },
  {
    id: 'pro-restoration',
    name: 'Restoration Certified',
    price: 799,
    description: 'Top-tier restoration pros with insurance network access and the lowest commission rates.',
    popular: false,
    commission: '10% commission',
    features: [
      { text: 'Everything in Emergency Ready', included: true },
      { text: 'Insurance network access', included: true },
      { text: 'Xactimate bridge integration', included: true },
      { text: 'IICRC compliance tools', included: true },
      { text: '10% commission per job', included: true },
      { text: '2-hour response SLA', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Monthly performance bonuses', included: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface PricingTableProps {
  userType: 'client' | 'pro';
}

export default function PricingTable({ userType }: PricingTableProps) {
  const plans = userType === 'client' ? CLIENT_PLANS : PRO_PLANS;
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);

  return (
    <div
      className={`grid gap-6 ${
        userType === 'client'
          ? 'sm:grid-cols-2 max-w-3xl'
          : 'sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
      } mx-auto`}
    >
      {modalPlan && (
        <SubscribeModal
          plan={modalPlan}
          onClose={() => setModalPlan(null)}
        />
      )}
      {plans.map((plan) => {
        const isFree = plan.price === 0;

        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 hover:-translate-y-0.5 ${
              plan.popular
                ? 'border-[#00a9e0] bg-sky-50/50 shadow-lg shadow-[#00a9e0]/15 dark:border-sky-500 dark:bg-sky-950/20 dark:shadow-sky-500/10'
                : 'border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900'
            }`}
          >
            {/* Most Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-block rounded-full bg-[#00a9e0] px-4 py-1 text-xs font-bold text-white shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan name */}
            <div className="mb-4 mt-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {plan.name}
              </h3>
            </div>

            {/* Price */}
            <div className="mb-2">
              {isFree ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Free
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    /month
                  </span>
                </div>
              )}
            </div>

            {/* Commission / fee badge */}
            <div className="mb-4">
              <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {plan.commission}
              </span>
            </div>

            {/* Description */}
            <p className="mb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {plan.description}
            </p>

            {/* Features */}
            <ul className="mb-6 flex-1 space-y-2.5" aria-label={`${plan.name} features`}>
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-2 text-sm">
                  {feature.included ? (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                  )}
                  <span
                    className={
                      feature.included
                        ? 'text-zinc-700 dark:text-zinc-300'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isFree ? (
              <button
                type="button"
                disabled
                className="w-full cursor-default rounded-full border-2 border-zinc-300 bg-transparent px-4 py-3 text-sm font-semibold text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
                aria-label={`${plan.name} is your current plan`}
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalPlan(plan)}
                className="w-full rounded-full bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-[#0ea5e9] hover:shadow-lg active:scale-[0.98]"
                aria-label={`Subscribe to ${plan.name}`}
              >
                Subscribe
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
