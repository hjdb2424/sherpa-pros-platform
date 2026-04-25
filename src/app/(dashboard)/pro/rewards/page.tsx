'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ProDashboardGuard from '@/components/pro/ProDashboardGuard';
import {
  POINT_VALUES,
  REWARD_CATEGORIES,
  REWARDS_CATALOG,
  getDemoRewardsData,
  type RewardCategory,
  type RewardItem,
} from '@/lib/incentives/rewards';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

// Mock redemption history
type RedemptionStatus = 'Delivered' | 'Pending' | 'Failed';

interface RedemptionRecord {
  id: string;
  name: string;
  points: number;
  date: string;
  status: RedemptionStatus;
}

const MOCK_REDEMPTION_HISTORY: RedemptionRecord[] = [
  { id: 'rh-001', name: 'Home Depot $25', points: 2500, date: '2026-04-10', status: 'Delivered' },
  { id: 'rh-002', name: 'Amazon $25', points: 2500, date: '2026-03-22', status: 'Delivered' },
  { id: 'rh-003', name: 'Sherpa Pros T-Shirt', points: 500, date: '2026-03-05', status: 'Delivered' },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Failed: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RewardsPage() {
  const { entry, points: initialPoints } = getDemoRewardsData();
  const tier = entry.score.tier;
  const badge = TIER_BADGE[tier];

  const [points, setPoints] = useState(initialPoints);
  const [category, setCategory] = useState<RewardCategory>('all');
  const [showEarning, setShowEarning] = useState(false);

  // Redeem modal state
  const [redeemItem, setRedeemItem] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<'success' | 'error' | null>(null);
  const [redeemIsMock, setRedeemIsMock] = useState(false);

  // Redemption history
  const [history, setHistory] = useState<RedemptionRecord[]>(MOCK_REDEMPTION_HISTORY);

  const filtered = category === 'all'
    ? REWARDS_CATALOG
    : REWARDS_CATALOG.filter((r) => r.category === category);

  const handleRedeem = useCallback(async () => {
    if (!redeemItem) return;
    setIsRedeeming(true);
    setRedeemResult(null);

    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: redeemItem.id,
          amount: Math.floor(redeemItem.pointCost / 100), // convert points to dollar value
          pointsCost: redeemItem.pointCost,
          recipientName: entry.pro.name,
          recipientEmail: 'pro@thesherpapros.com',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setRedeemResult('success');
        setRedeemIsMock(data.isMockMode ?? true);
        // Deduct points
        setPoints((prev) => Math.max(0, prev - redeemItem.pointCost));
        // Add to history
        setHistory((prev) => [
          {
            id: (data.order?.id as string) ?? `rh-${Date.now()}`,
            name: redeemItem.name,
            points: redeemItem.pointCost,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending' as RedemptionStatus,
          },
          ...prev,
        ]);
      } else {
        setRedeemResult('error');
      }
    } catch {
      setRedeemResult('error');
    } finally {
      setIsRedeeming(false);
    }
  }, [redeemItem, entry.pro.name]);

  const closeModal = () => {
    setRedeemItem(null);
    setRedeemResult(null);
    setRedeemIsMock(false);
  };

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
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => canAfford && setRedeemItem(item)}
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
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Redemption History</h2>
          </div>
          {history.length === 0 ? (
            <div className="border-t border-zinc-100 p-6 text-center dark:border-zinc-800">
              <svg className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
              <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">No redemptions yet</p>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">Your redeemed rewards will appear here</p>
            </div>
          ) : (
            <div className="border-t border-zinc-100 dark:border-zinc-800">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        -{item.points.toLocaleString()} pts
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? ''}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Redeem Confirmation Modal ─────────────────────────────────── */}
      {redeemItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isRedeeming ? closeModal : undefined} />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            {/* Success state */}
            {redeemResult === 'success' ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                  <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Reward Sent!</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Check your email for your {redeemItem.name}.
                </p>
                {redeemIsMock && (
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    Demo mode — in production, a real reward would be sent to your email
                  </div>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 w-full rounded-lg bg-[#00a9e0] py-2.5 text-sm font-semibold text-white hover:bg-[#0090c0] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : redeemResult === 'error' ? (
              /* Error state */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Redemption Failed</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Something went wrong. Please try again later.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 w-full rounded-lg bg-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Confirmation state */
              <>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Confirm Redemption</h3>
                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className={`mx-auto mb-3 flex h-16 w-full items-center justify-center rounded-lg bg-gradient-to-br ${redeemItem.gradient}`}>
                    <svg className="h-8 w-8 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                  </div>
                  <p className="text-center text-base font-semibold text-zinc-900 dark:text-zinc-50">{redeemItem.name}</p>
                  <p className="mt-1 text-center text-2xl font-bold text-[#00a9e0]">{redeemItem.pointCost.toLocaleString()} pts</p>
                </div>

                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  A reward will be sent to your email on file. Your point balance will be reduced by{' '}
                  <span className="font-semibold">{redeemItem.pointCost.toLocaleString()}</span> points.
                </p>

                <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  Remaining balance: {(points - redeemItem.pointCost).toLocaleString()} pts
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isRedeeming}
                    className="flex-1 rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRedeem}
                    disabled={isRedeeming}
                    className="flex-1 rounded-lg bg-[#00a9e0] py-2.5 text-sm font-semibold text-white hover:bg-[#0090c0] disabled:opacity-60 transition-colors"
                  >
                    {isRedeeming ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Processing...
                      </span>
                    ) : 'Confirm'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ProDashboardGuard>
  );
}
