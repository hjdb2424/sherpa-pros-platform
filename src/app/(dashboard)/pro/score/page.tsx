import type { Metadata } from 'next';
import Link from 'next/link';
import { getDemoProScore } from '@/lib/incentives/mock-metrics';
import {
  getImprovementSuggestion,
  estimatePointsGain,
} from '@/lib/incentives/sherpa-score';
import { getDemoRewardsData, getFeaturedRewards } from '@/lib/incentives/rewards';
import ProDashboardGuard from '@/components/pro/ProDashboardGuard';

export const metadata: Metadata = {
  title: 'Sherpa Score',
};

const TIER_COLORS: Record<string, { ring: string; bg: string; text: string; label: string }> = {
  gold: { ring: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', label: 'Gold' },
  silver: { ring: '#94a3b8', bg: 'bg-slate-50 dark:bg-slate-800/30', text: 'text-slate-500 dark:text-slate-400', label: 'Silver' },
  bronze: { ring: '#b45309', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', label: 'Bronze' },
};

function metricColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function metricTextColor(value: number): string {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (value >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export default function SherpaScorePage() {
  const { score } = getDemoProScore();
  const tierCfg = TIER_COLORS[score.tier];

  return (
    <ProDashboardGuard>
      <div className="space-y-6 pb-8">
        {/* Back link */}
        <Link
          href="/pro/dashboard"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header: Overall score + tier */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Score ring */}
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={tierCfg.ring}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.overall / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{score.overall}</span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">/ 100</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Your Sherpa Score</h1>
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${tierCfg.bg} ${tierCfg.text}`}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {tierCfg.label} Tier
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Service fee: <span className="font-semibold">{score.serviceFee}%</span>
                </span>
              </div>

              {score.nextTier && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {score.nextTier.pointsNeeded} points to {score.nextTier.nextTier}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-64 max-w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00a9e0] to-emerald-500 transition-all"
                      style={{
                        width: `${Math.min(100, ((score.overall - (score.tier === 'bronze' ? 0 : 60)) / 20) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pillar breakdown */}
        <div className="grid gap-6 lg:grid-cols-3">
          {score.pillars.map((pillar) => (
            <div
              key={pillar.name}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{pillar.name}</h2>
                <span className={`text-2xl font-bold ${metricTextColor(pillar.score)}`}>
                  {pillar.score}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Weight: {Math.round(pillar.weight * 100)}% of overall score
              </p>

              <div className="mt-4 space-y-3">
                {pillar.metrics.map((metric) => (
                  <div key={metric.key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-700 dark:text-zinc-300">{metric.label}</span>
                      <span className={`font-semibold ${metricTextColor(metric.value)}`}>
                        {metric.value}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all ${metricColor(metric.value)}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                      {metric.raw}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Improvement suggestions */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">How to Improve</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Actionable tips to boost your Sherpa Score and unlock better tier benefits.
          </p>

          <div className="mt-4 space-y-3">
            {score.pillars
              .flatMap((p) =>
                p.metrics
                  .filter((m) => m.value < 80)
                  .map((m) => ({ ...m, pillarName: p.name }))
              )
              .sort((a, b) => a.value - b.value)
              .slice(0, 4)
              .map((metric) => {
                const suggestion = getImprovementSuggestion(metric.key, metric.value);
                const pointsGain = estimatePointsGain(metric.key, metric.value, metric.pillarName);
                return (
                  <div
                    key={metric.key}
                    className="flex items-start gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${metricColor(metric.value)} text-white`}>
                      {metric.value}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {metric.label}
                        <span className="ml-2 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                          +{pointsGain} pts potential
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{suggestion}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Rewards section */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Your Tier Rewards</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Service Fee',
                value: `${score.serviceFee}%`,
                description: score.tier === 'gold' ? 'Lowest rate for Gold pros' : 'Reach Gold to drop to 8%',
                active: true,
              },
              {
                title: 'Priority Matching',
                value: score.tier === 'gold' ? '4hr early access' : score.tier === 'silver' ? '2hr early access' : 'Standard',
                description: 'See new jobs before other tiers',
                active: score.tier !== 'bronze',
              },
              {
                title: 'Profile Badge',
                value: `${tierCfg.label} Badge`,
                description: 'Displayed on your profile and job bids',
                active: true,
              },
              {
                title: 'Featured Placement',
                value: score.tier === 'gold' ? 'Top of search' : 'Standard',
                description: 'Gold pros appear first in client searches',
                active: score.tier === 'gold',
              },
              {
                title: 'Referral Bonus',
                value: score.tier === 'gold' ? '$50' : score.tier === 'silver' ? '$25' : '$10',
                description: 'Per successful pro referral',
                active: true,
              },
              {
                title: 'Marketing Spotlight',
                value: score.tier === 'gold' ? 'Included' : 'Not eligible',
                description: 'Featured in Sherpa Pros marketing and social posts',
                active: score.tier === 'gold',
              },
            ].map((reward) => (
              <div
                key={reward.title}
                className={`rounded-xl border p-4 ${
                  reward.active
                    ? 'border-zinc-200 dark:border-zinc-700'
                    : 'border-dashed border-zinc-200 opacity-50 dark:border-zinc-800'
                }`}
              >
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{reward.title}</p>
                <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{reward.value}</p>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Preview */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Sherpa Rewards</h2>
            <Link href="/pro/rewards" className="text-sm font-medium text-[#00a9e0] hover:underline">
              View all rewards &rarr;
            </Link>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your points: <span className="font-bold text-[#00a9e0]">{getDemoRewardsData().points.toLocaleString()}</span>
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {getFeaturedRewards().map((reward) => (
              <Link key={reward.id} href="/pro/rewards" className="group rounded-xl border border-zinc-200 p-3 transition-colors hover:border-[#00a9e0] dark:border-zinc-700 dark:hover:border-[#00a9e0]">
                <div className={`flex h-16 items-center justify-center rounded-lg bg-gradient-to-br ${reward.gradient}`}>
                  <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                </div>
                <p className="mt-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{reward.name}</p>
                <p className="text-xs font-medium text-[#00a9e0]">{reward.pointCost.toLocaleString()} pts</p>
              </Link>
            ))}
          </div>
        </div>

        {/* History placeholder */}
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <svg className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Score history coming soon</p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">Track how your score changes over time</p>
        </div>
      </div>
    </ProDashboardGuard>
  );
}
