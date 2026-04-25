import type { Metadata } from 'next';
import Link from 'next/link';
import ProDashboardGuard from '@/components/pro/ProDashboardGuard';

export const metadata: Metadata = {
  title: 'Sherpa Flex — Sherpa Pros',
  description: 'Per-project insurance for side-hustle pros. No LLC required.',
};

const HOW_IT_WORKS = [
  { step: 1, title: 'Sign up as a Sherpa Flex pro', desc: 'Standard onboarding plus skills verification — no LLC or personal insurance needed.' },
  { step: 2, title: 'Accept jobs through the platform', desc: 'Browse and accept jobs like any other Sherpa pro.' },
  { step: 3, title: 'Per-project insurance is automatically included', desc: 'Every accepted job comes with liability coverage built in.' },
  { step: 4, title: 'Higher service fee covers the cost', desc: '18% service fee vs 12% standard — the 6% difference pays for insurance.' },
  { step: 5, title: 'You\'re a 1099 independent contractor', desc: 'Same status as all Sherpa pros. You control your schedule.' },
  { step: 6, title: 'Upgrade anytime', desc: 'Get your own insurance and LLC to drop to the standard 12% fee.' },
];

const COVERAGE = [
  { label: 'General Liability', value: '$1M per occurrence / $2M aggregate' },
  { label: 'Property Damage', value: '$500K' },
  { label: 'Personal Injury Protection', value: 'Included' },
  { label: 'Valid During', value: 'Active Sherpa jobs only' },
];

const FEE_TIERS = [
  { name: 'Sherpa Flex', fee: '18%', desc: 'Platform insurance included', color: 'border-violet-400 bg-violet-50 dark:bg-violet-900/20', highlight: true },
  { name: 'Standard Pro', fee: '12%', desc: 'Own insurance + LLC', color: 'border-zinc-200 dark:border-zinc-700', highlight: false },
  { name: 'Gold Pro', fee: '8%', desc: 'Own insurance + Gold Sherpa Score', color: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20', highlight: false },
];

const REQUIREMENTS = [
  'Valid government ID verification',
  'Skills assessment (photo portfolio + knowledge quiz)',
  'Background check clearance',
  'Must maintain Bronze or higher Sherpa Score',
  'Limited to jobs under $5,000 (larger jobs require standard insurance)',
];

export default function FlexPage() {
  return (
    <ProDashboardGuard>
      <div className="space-y-8 pb-8">
        {/* Back */}
        <Link href="/pro/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to Dashboard
        </Link>

        {/* Hero */}
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm dark:border-violet-800 dark:from-violet-950/30 dark:to-zinc-900">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
              <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sherpa Flex</h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                A program for skilled tradespeople who do work on the side. No LLC required. No personal insurance policy needed. Sherpa provides per-project liability coverage built into the service fee.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">How It Works</h2>
          <div className="mt-5 space-y-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">What&apos;s Covered</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Per-project coverage included with every Sherpa Flex job.</p>
          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {COVERAGE.map((c) => (
              <div key={c.label} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{c.label}</span>
                <span className="text-zinc-900 dark:text-zinc-100">{c.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Coverage does NOT apply to work done outside the Sherpa Pros platform.
            </p>
          </div>
        </section>

        {/* Fee Comparison */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Fee Comparison</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">The 6% difference between Flex and Standard covers per-project insurance.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {FEE_TIERS.map((t) => (
              <div key={t.name} className={`rounded-xl border p-4 text-center ${t.color}`}>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.name}</p>
                <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{t.fee}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
                {t.highlight && (
                  <span className="mt-2 inline-block rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white">Insurance Included</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Requirements</h2>
          <ul className="mt-4 space-y-3">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <span className="text-zinc-700 dark:text-zinc-300">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ready to upgrade */}
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:border-emerald-800 dark:from-emerald-950/30 dark:to-zinc-900">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Ready to Upgrade?</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Get your own LLC and insurance policy and your fee drops from 18% to 12%. We&apos;ll help you every step of the way.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a href="#" className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[#00a9e0] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-[#00a9e0]">
              <svg className="h-6 w-6 shrink-0 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">LLC Formation Guide</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Step-by-step walkthrough</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[#00a9e0] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-[#00a9e0]">
              <svg className="h-6 w-6 shrink-0 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Insurance Quotes</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Compare GL policies</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[#00a9e0] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-[#00a9e0]">
              <svg className="h-6 w-6 shrink-0 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recommended Providers</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Trusted partners</p>
              </div>
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Once your insurance is verified, your account automatically transitions to the standard 12% fee.
          </p>
        </section>
      </div>
    </ProDashboardGuard>
  );
}
