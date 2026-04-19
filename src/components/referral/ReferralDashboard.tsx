'use client';

import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const REFERRAL_CODE = 'SHERPA-PM2024';
const REFERRAL_LINK = 'https://thesherpapros.com/r/SHERPA-PM2024';

interface Referral {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'invited' | 'joined' | 'active';
  reward: number; // cents
}

const MOCK_REFERRALS: Referral[] = [
  { id: 'r1', name: 'Jake Thompson', email: 'j***@gmail.com', date: '2026-04-10', status: 'active', reward: 5000 },
  { id: 'r2', name: 'Maria Santos', email: 'm***@yahoo.com', date: '2026-04-08', status: 'active', reward: 5000 },
  { id: 'r3', name: 'Chris Williams', email: 'c***@outlook.com', date: '2026-04-05', status: 'joined', reward: 2500 },
  { id: 'r4', name: 'Sarah Chen', email: 's***@gmail.com', date: '2026-04-02', status: 'joined', reward: 2500 },
  { id: 'r5', name: 'David Park', email: 'd***@gmail.com', date: '2026-03-28', status: 'invited', reward: 0 },
];

const STATUS_CONFIG: Record<Referral['status'], { label: string; classes: string }> = {
  invited: { label: 'Invited', classes: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  joined: { label: 'Joined', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  active: { label: 'Active', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReferralDashboard() {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const copyToClipboard = useCallback(async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  const totalInvited = MOCK_REFERRALS.length;
  const totalJoined = MOCK_REFERRALS.filter((r) => r.status !== 'invited').length;
  const totalEarned = MOCK_REFERRALS.reduce((sum, r) => sum + r.reward, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-[#00a9e033] bg-gradient-to-br from-sky-50 to-white p-6 text-center shadow-sm sm:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00a9e0]/10">
          <svg className="h-7 w-7 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Invite &amp; Earn
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Share Sherpa Pros with your network and earn rewards for every referral
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Your Referral Code
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 rounded-lg border-2 border-dashed border-[#00a9e0]/30 bg-sky-50/50 px-4 py-3 text-center dark:border-[#00a9e0]/20 dark:bg-[#00a9e0]/5">
            <span className="select-all font-mono text-xl font-bold tracking-widest text-[#00a9e0] sm:text-2xl">
              {REFERRAL_CODE}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(REFERRAL_CODE, 'code')}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-all hover:border-[#00a9e0] hover:text-[#00a9e0] active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            aria-label="Copy referral code"
          >
            {copied === 'code' ? (
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
            )}
          </button>
        </div>

        {/* Share buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(REFERRAL_LINK, 'link')}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#00a9e0] hover:text-[#00a9e0] active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#00a9e0]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            {copied === 'link' ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            type="button"
            onClick={() => window.open(`mailto:?subject=Join%20Sherpa%20Pros&body=Use%20my%20code%20${REFERRAL_CODE}%20to%20sign%20up:%20${REFERRAL_LINK}`, '_blank')}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#00a9e0] hover:text-[#00a9e0] active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#00a9e0]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Email
          </button>
          <button
            type="button"
            onClick={() => window.open(`sms:?body=Join%20Sherpa%20Pros%20with%20my%20code%20${REFERRAL_CODE}:%20${REFERRAL_LINK}`, '_blank')}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#00a9e0] hover:text-[#00a9e0] active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#00a9e0]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            SMS
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Invited', value: totalInvited.toString(), color: 'text-zinc-900 dark:text-zinc-50' },
          { label: 'Joined', value: totalJoined.toString(), color: 'text-[#00a9e0]' },
          { label: 'Earned', value: `$${(totalEarned / 100).toFixed(0)}`, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Reward Tiers */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Pro Referral */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Pro Referral</h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$50</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Earn $50 for each pro who completes their first job on the platform.
          </p>
        </div>

        {/* Client Referral */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-900/20">
              <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Client Referral</h3>
              <p className="text-2xl font-bold text-[#00a9e0]">$25</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Earn $25 credit for each friend who posts their first job on the platform.
          </p>
        </div>
      </div>

      {/* Recent Referrals Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Recent Referrals
          </h2>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm" aria-label="Recent referrals">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Reward</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REFERRALS.map((ref) => {
                const status = STATUS_CONFIG[ref.status];
                return (
                  <tr key={ref.id} className="border-b border-zinc-50 last:border-0 dark:border-zinc-800/50">
                    <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{ref.name}</td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">{ref.email}</td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">{new Date(ref.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                      {ref.reward > 0 ? `$${(ref.reward / 100).toFixed(0)}` : '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2 p-3 sm:hidden">
          {MOCK_REFERRALS.map((ref) => {
            const status = STATUS_CONFIG[ref.status];
            return (
              <div
                key={ref.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{ref.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ref.email} &middot; {new Date(ref.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.classes}`}>
                    {status.label}
                  </span>
                  {ref.reward > 0 && (
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${(ref.reward / 100).toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
