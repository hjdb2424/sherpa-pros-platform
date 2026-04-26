import type { Metadata } from 'next';
import Link from 'next/link';
import DispatchAlert from '@/components/pro/DispatchAlert';
import UserName, { UserInitials } from '@/components/common/UserName';
import {
  mockProProfile,
  mockDashboardStats,
  mockDispatch,
  mockActiveJobs,
} from '@/lib/mock-data/pro-data';
import { getDemoProScore } from '@/lib/incentives/mock-metrics';
import { getDemoRewardsData } from '@/lib/incentives/rewards';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function ProDashboardPage() {
  const pro = mockProProfile;
  const stats = mockDashboardStats;
  const proScore = getDemoProScore();
  const { score } = proScore;
  const { points: rewardPoints } = getDemoRewardsData();

  const tierColors: Record<string, { ring: string; bg: string; text: string; label: string }> = {
    gold: { ring: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', label: 'Gold' },
    silver: { ring: '#94a3b8', bg: 'bg-slate-50 dark:bg-slate-800/30', text: 'text-slate-500 dark:text-slate-400', label: 'Silver' },
    bronze: { ring: '#b45309', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', label: 'Bronze' },
  };
  const tierCfg = tierColors[score.tier];

  // Rating stars helper
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(pro.overallRating));

  return (
    <div className="space-y-6">
      {/* ── Row 1: Profile + Score Card ─────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Profile info */}
          <Link href="/pro/profile" className="flex items-center gap-4 group min-w-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-lg font-bold text-[#00a9e0] dark:bg-[#00a9e0]/10">
              <UserInitials fallback="SP" />
            </div>
            <div className="min-w-0">
              <UserName fallback="Pro" as="h1" className="text-lg font-bold text-zinc-900 group-hover:text-[#00a9e0] transition-colors dark:text-zinc-50" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {pro.trades[0]?.name ?? 'Pro'} &middot; {pro.serviceArea.homeHub}
              </p>
              <div className="mt-1 flex items-center gap-1">
                {stars.map((filled, i) => (
                  <svg key={i} className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">{pro.overallRating}</span>
              </div>
            </div>
          </Link>

          {/* Right: Score ring */}
          <Link href="/pro/score" className="flex items-center gap-4 group shrink-0">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={tierCfg.ring} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score.overall / 100) * 327} 327`} />
              </svg>
              <span className="absolute text-xl font-bold text-zinc-900 dark:text-zinc-50">{score.overall}</span>
            </div>
            <div className="text-right sm:text-left">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierCfg.bg} ${tierCfg.text}`}>
                  {tierCfg.label}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Service fee: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{score.serviceFee}%</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Progress bar to next tier */}
        {score.nextTier && (
          <div className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">
                {score.nextTier.pointsNeeded} points to {score.nextTier.nextTier}
              </span>
              <Link href="/pro/score" className="font-medium text-[#00a9e0] hover:text-[#0ea5e9] dark:text-sky-400">
                View details
              </Link>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
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

      {/* Incoming dispatch alert */}
      <DispatchAlert dispatch={mockDispatch} />

      {/* ── Row 2: Active Jobs ──────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Active Jobs</h2>
          <Link href="/pro/jobs" className="text-sm font-medium text-[#00a9e0] hover:text-[#0ea5e9] dark:text-sky-400">
            View all
          </Link>
        </div>

        {mockActiveJobs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockActiveJobs.slice(0, 3).map((job) => {
              const statusMap: Record<string, { label: string; cls: string }> = {
                active: { label: 'In Progress', cls: 'bg-sky-100 text-[#00a9e0] dark:bg-sky-900/30 dark:text-sky-400' },
                completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
              };
              const currentMilestone = job.milestones.find((m) => m.status === 'in_progress');
              const chip = statusMap[job.status] ?? statusMap.active;

              return (
                <Link
                  key={job.id}
                  href={`/pro/jobs/${job.id}`}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1">{job.title}</h3>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${chip.cls}`}>
                      {chip.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {job.clientName} &middot; {job.distanceMiles} mi
                  </p>
                  {currentMilestone && (
                    <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                      Next: {currentMilestone.title}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{job.category}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No active jobs</p>
            <Link href="/pro/jobs" className="mt-2 inline-block text-sm font-medium text-[#00a9e0] hover:text-[#0ea5e9]">
              Browse available work
            </Link>
          </div>
        )}
      </section>

      {/* ── Row 3: Earnings Summary ─────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Earnings</h2>
          <Link href="/pro/earnings" className="text-sm font-medium text-[#00a9e0] hover:text-[#0ea5e9] dark:text-sky-400">
            View all
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-3">
          <Link
            href="/pro/earnings"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">This Week</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">$2,850</p>
          </Link>
          <Link
            href="/pro/earnings"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pending</p>
            <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">$3,325</p>
          </Link>
          <Link
            href="/pro/earnings"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Next Payout</p>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">Apr 25</p>
          </Link>
        </div>
      </section>

      {/* ── Row 4: Rewards + Referrals ──────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Sherpa Points card */}
        <Link
          href="/pro/rewards"
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sherpa Points</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{rewardPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">500 points to next reward</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-[#00a9e0] dark:text-sky-400">View Rewards &rarr;</p>
        </Link>

        {/* Referrals card */}
        <Link
          href="/referral"
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Referrals</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">3</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Successful referrals. Earn 500 points per invite.
          </p>
          <p className="mt-3 text-xs font-medium text-[#00a9e0] dark:text-sky-400">Invite a Pro &rarr;</p>
        </Link>
      </div>

      {/* ── Row 5: Quick Actions ────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/pro/profile"
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Update Availability</span>
          </Link>

          <Link
            href="/pro/scan"
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-[#00a9e0] dark:bg-sky-900/30 dark:text-sky-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Smart Scan</span>
          </Link>

          <Link
            href="/pro/social"
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Sync Social</span>
          </Link>

          <Link
            href="/help"
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Get Help</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
