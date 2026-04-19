'use client';

/**
 * SubscriptionPageClient — Full subscription management page.
 *
 * Sections:
 *   1. Current tier display with badge
 *   2. Billing info (if subscribed)
 *   3. SLA compliance dashboard (if subscribed)
 *   4. Plan comparison cards
 *   5. Feature comparison table
 *   6. Requirements checklist
 */

import { useState } from 'react';
import { getAllPlans, comparePlans } from '@/lib/subscriptions/plans';
import type { SubscriptionTier } from '@/lib/subscriptions/types';
import {
  mockSubscription,
  mockSLAReport,
  mockRequirementStatuses,
  mockROIStats,
} from '@/lib/mock-data/subscription-data';
import SubscriptionCard from '@/components/pro/SubscriptionCard';
import SLADashboard from '@/components/pro/SLADashboard';
import PricingTable from '@/components/pricing/PricingTable';
import SubscriptionBadge from '@/components/pricing/SubscriptionBadge';
import Link from 'next/link';

const plans = getAllPlans();
const featureMatrix = comparePlans();

export default function SubscriptionPageClient() {
  const [subscription] = useState(mockSubscription);
  const currentTier = subscription.tier;
  const requirements = mockRequirementStatuses;

  function meetsRequirements(tier: SubscriptionTier): boolean {
    const plan = plans.find((p) => p.tier === tier);
    if (!plan) return false;
    return plan.requirements.every((req) => {
      const status = requirements.find((r) => r.id === req.id);
      return status?.met ?? false;
    });
  }

  function handleSelectPlan(tier: SubscriptionTier) {
    // TODO: Wire to Stripe checkout or upgrade flow
    console.log(`Selected plan: ${tier}`);
  }

  function handleCancel() {
    // TODO: Wire to cancelSubscription()
    console.log('Cancel subscription requested');
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Subscription
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your Pro tier, billing, and SLA compliance.
          </p>
        </div>
        <SubscriptionBadge tier={currentTier} />
      </div>

      {/* Current Tier Badge + Billing Info */}
      {currentTier !== 'standard' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    currentTier === 'restoration_certified'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                  }`}
                >
                  {currentTier === 'emergency_ready'
                    ? 'Emergency Ready'
                    : 'Restoration Certified'}
                </span>
                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Active
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Member since{' '}
                {new Date(subscription.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Next billing date
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' },
                )}
              </p>
              <p className="mt-0.5 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                $
                {currentTier === 'emergency_ready'
                  ? '299'
                  : '799'}
                /mo
              </p>
            </div>
          </div>

          {/* Cancel option */}
          {!subscription.cancelAtPeriodEnd && (
            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-zinc-400 underline-offset-2 hover:text-red-500 hover:underline dark:text-zinc-500 dark:hover:text-red-400"
              >
                Cancel subscription
              </button>
            </div>
          )}
          {subscription.cancelAtPeriodEnd && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Your subscription will end on{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' },
                )}
                . You will revert to the Standard tier.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SLA Compliance Dashboard */}
      {currentTier !== 'standard' && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            SLA Compliance
          </h2>
          <SLADashboard report={mockSLAReport} />
        </section>
      )}

      {/* ROI Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-5 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-300">
              Upgrade your earning potential
            </p>
            <p className="mt-1 text-xl font-bold">
              Emergency Ready Pros earn ${mockROIStats.emergency_ready.avgMonthlyEarnings.toLocaleString()}/mo on average
            </p>
            <p className="mt-0.5 text-sm text-zinc-300">
              vs ${mockROIStats.standard.avgMonthlyEarnings.toLocaleString()}/mo for Standard Pros
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-amber-400">
              {mockROIStats.emergency_ready.avgMonthlyEarnings / mockROIStats.standard.avgMonthlyEarnings}x
            </p>
            <p className="text-xs text-zinc-300">more earnings</p>
          </div>
        </div>
      </div>

      {/* Trust Signal */}
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Join 150+ Emergency Ready Pros already earning more on the platform
      </p>

      {/* Plan Comparison Cards */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Choose Your Tier
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.tier}
              plan={plan}
              currentTier={currentTier}
              requirementsMet={meetsRequirements(plan.tier)}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                  Feature
                </th>
                <th className="px-4 py-3 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                  Standard
                </th>
                <th className="px-4 py-3 text-center font-semibold text-amber-600 dark:text-amber-400">
                  Emergency Ready
                </th>
                <th className="px-4 py-3 text-center font-semibold text-yellow-600 dark:text-yellow-400">
                  Restoration Certified
                </th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((row, i) => (
                <tr
                  key={row.feature}
                  className={
                    i % 2 === 0
                      ? 'bg-zinc-50/50 dark:bg-zinc-950/30'
                      : ''
                  }
                >
                  <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                    {row.feature}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <FeatureCheck included={row.standard} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <FeatureCheck included={row.emergencyReady} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <FeatureCheck included={row.restorationCertified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Plan Overview */}
      <section>
        <h2 className="mb-6 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Plan Overview
        </h2>
        <PricingTable userType="pro" />
      </section>

      {/* Requirements Checklist */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Your Qualifications
        </h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <ul className="space-y-3">
            {requirements.map((req) => (
              <li key={req.id} className="flex items-start gap-3">
                {req.met ? (
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      req.met
                        ? 'text-zinc-800 dark:text-zinc-200'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {req.label}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {req.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Need help choosing? */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Need help choosing?
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Our team can walk you through the requirements and help you find the right tier.
        </p>
        <Link
          href="/pro/messages"
          className="mt-4 inline-flex items-center rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0ea5e9] hover:shadow-md"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FeatureCheck({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg
        className="mx-auto h-5 w-5 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-label="Included"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg
      className="mx-auto h-5 w-5 text-zinc-300 dark:text-zinc-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-label="Not included"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  );
}
