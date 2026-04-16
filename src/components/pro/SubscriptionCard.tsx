'use client';

/**
 * SubscriptionCard — Plan card for subscription tier selection.
 *
 * Displays tier name, price, features, and a CTA button.
 * Highlights "Most Popular" on Emergency Ready.
 * Shows ROI stats to justify the subscription cost.
 */

import { useState } from 'react';
import type { SubscriptionPlan, SubscriptionTier } from '@/lib/subscriptions/types';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentTier: SubscriptionTier;
  requirementsMet: boolean;
  onSelect: (tier: SubscriptionTier) => void;
}

const tierStyles: Record<
  SubscriptionTier,
  { border: string; bg: string; badge: string; cta: string; glow: string }
> = {
  standard: {
    border: 'border-zinc-300 dark:border-zinc-700',
    bg: 'bg-white dark:bg-zinc-900',
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    cta: 'bg-zinc-600 hover:bg-zinc-700 text-white',
    glow: '',
  },
  emergency_ready: {
    border: 'border-amber-400 dark:border-amber-500',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    cta: 'bg-amber-500 hover:bg-amber-600 text-white',
    glow: 'shadow-amber-200/50 dark:shadow-amber-500/10',
  },
  restoration_certified: {
    border: 'border-yellow-400 dark:border-yellow-500',
    bg: 'bg-gradient-to-br from-yellow-50/80 to-amber-50/60 dark:from-yellow-950/20 dark:to-amber-950/10',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    cta: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white',
    glow: 'shadow-yellow-200/50 dark:shadow-yellow-500/10',
  },
};

export default function SubscriptionCard({
  plan,
  currentTier,
  requirementsMet,
  onSelect,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const styles = tierStyles[plan.tier];
  const isCurrent = plan.tier === currentTier;
  const isPopular = plan.tier === 'emergency_ready';
  const isLocked = !requirementsMet && plan.tier !== 'standard';
  const priceDollars = plan.monthlyPriceCents / 100;

  function handleClick() {
    if (isCurrent || isLocked || loading) return;
    setLoading(true);
    onSelect(plan.tier);
    // Reset after a short delay (real flow would navigate or open modal)
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 hover:-translate-y-0.5 ${styles.border} ${styles.bg} ${
        isPopular ? `shadow-lg ${styles.glow}` : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white shadow-md">
            Most Popular
          </span>
        </div>
      )}

      {/* Tier badge */}
      <div className="mb-4 mt-1">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
        >
          {plan.badge.label}
        </span>
      </div>

      {/* Price */}
      <div className="mb-2">
        {plan.monthlyPriceCents === 0 ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Free
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              ${priceDollars}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              /month
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
        {plan.description}
      </p>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* ROI stat */}
      {plan.earnings.multiplierVsStandard > 1 && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30">
          <p className="text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Avg. {plan.badge.label} Pro earns ${plan.earnings.averageMonthly.toLocaleString()}/mo
            <span className="ml-1 font-bold">
              ({plan.earnings.multiplierVsStandard}x more)
            </span>
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isCurrent || isLocked || loading}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
          isCurrent
            ? 'cursor-default border-2 border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400'
            : isLocked
              ? 'cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
              : `${styles.cta} active:scale-[0.98]`
        }`}
        aria-label={
          isCurrent
            ? `${plan.name} is your current plan`
            : isLocked
              ? `${plan.name} is locked — requirements not met`
              : `Select ${plan.name} plan`
        }
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : isCurrent ? (
          'Current Plan'
        ) : isLocked ? (
          'Requirements Not Met'
        ) : plan.monthlyPriceCents === 0 ? (
          'Get Started Free'
        ) : (
          `Upgrade to ${plan.name}`
        )}
      </button>
    </div>
  );
}
