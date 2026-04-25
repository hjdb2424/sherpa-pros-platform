'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProDashboardGuard from '@/components/pro/ProDashboardGuard';
import {
  POINT_VALUES,
  REWARD_CATEGORIES,
  REWARDS_CATALOG,
  getDemoRewardsData,
  type RewardCategory,
} from '@/lib/incentives/rewards';

const TIER_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  gold: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', label: 'Gold' },
  silver: { bg: 'bg-slate-50 dark:bg-slate-800/30', text: 'text-slate-500 dark:text-slate-400', label: 'Silver' },
  bronze: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', label: 'Bronze' },
};

const EARNING_ACTIONS = [
  { action: 'Job completed', points: POINT_VALUES.jobCompleted },
  { action: '5-star review received', points: POINT_VALUES.fiveStarReview },
  { action: 'Photo documentation (before/after)', points: POINT_VALUES.photoDocumentation },
  { action: 'On-time completion', points: POINT_VALUES.onTimeCompletion },
  { action: 'Monthly bonus — Gold tier', points: POINT_VALUES.monthlyBonusGold },
  { action: 'Monthly bonus — Silver tier', points: POINT_VALUES.monthlyBonusSilver },
  { action: 'Monthly bonus — Bronze tier', points: POINT_VALUES.monthlyBonusBronze },
  { action: 'Referral (pro completes first job)', points: POINT_VALUES.referralComplete },
  { action: 'Pro of the Month winner', points: POINT_VALUES.proOfTheMonth },
];

export default function RewardsPage() {
  const { entry, points } = getDemoRewardsData();
  const tier = entry.score.tier;
  const badge = TIER_BADGE[tier];

  const [category, setCategory] = useState<RewardCategory>('all');
  const [showEarning, setShowEarning] = useState(false);

  const filtered = category === 'all'
    ? REWARDS_CATALOG
    : REWARDS_CATALOG.filter((r) => r.category === category);

  return (
    <ProDashboardGuard>
      <div className="space-y-6 pb-8">
        {/* Back */}
        <Link href="/pro/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sherpa Rewards</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Earn points. Redeem real rewards.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#00a9e0]">{points.toLocaleString()}</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Points Available</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${badge.bg} ${badge.text}`}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* How to Earn — expandable */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <button type="button" onClick={() => setShowEarning(!showEarning)} className="flex w-full items-center justify-between p-5 text-left">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">How to Earn Points</h2>
            <svg className={`h-5 w-5 text-zinc-400 transition-transform ${showEarning ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
          </button>
          {showEarning && (
            <div className="border-t border-zinc-100 px-5 pb-5 dark:border-zinc-800">
              <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
                {EARNING_ACTIONS.map((ea) => (
                  <div key={ea.action} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{ea.action}</span>
                    <span className="font-semibold text-[#00a9e0]">+{ea.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {REWARD_CATEGORIES.map((cat) => (
            <button key={cat.key} type="button" onClick={() => setCategory(cat.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat.key
                  ? 'bg-[#00a9e0] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const canAfford = item.goldOnly ? tier === 'gold' : points >= item.pointCost;
            const needMore = item.pointCost - points;
            const isGoldLocked = item.goldOnly && tier !== 'gold';

            return (
              <div key={item.id} className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-900 ${
                item.goldOnly ? 'border-amber-300 dark:border-amber-600' : 'border-zinc-200 dark:border-zinc-800'
              }`}>
                {item.goldOnly && (
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">Gold Exclusive</div>
                )}
                {/* Image placeholder */}
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${item.gradient}`}>
                  <svg className="h-10 w-10 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.name}</h3>
                  <p className="mt-1 text-lg font-bold text-[#00a9e0]">
                    {item.goldOnly && item.pointCost === 0 ? 'Free' : `${item.pointCost.toLocaleString()} pts`}
                  </p>
                  <button type="button" disabled={!canAfford}
                    className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
                      canAfford
                        ? 'bg-[#00a9e0] text-white hover:bg-[#0090c0]'
                        : 'cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}>
                    {isGoldLocked ? 'Gold Tier Only' : canAfford ? 'Redeem' : `Need ${needMore.toLocaleString()} more`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redemption History */}
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <svg className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
          <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">No redemptions yet</p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">Your redeemed rewards will appear here</p>
        </div>
      </div>
    </ProDashboardGuard>
  );
}
