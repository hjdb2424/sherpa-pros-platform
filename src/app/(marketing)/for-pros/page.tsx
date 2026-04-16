import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import CommissionSlider from './CommissionSlider';

export const metadata: Metadata = {
  title: 'For Pros — Join the Sherpa Pros Network',
  description:
    'No lead fees. No subscriptions. Get matched with vetted, pre-qualified jobs. Apply in 5 minutes.',
};

const comparisonRows = [
  {
    feature: 'Monthly cost',
    angi: '$300+/mo subscription',
    thumbtack: '$15-100+ per lead',
    sherpa: 'Free — no subscription',
  },
  {
    feature: 'Lead quality',
    angi: 'Shared with 5-8 pros',
    thumbtack: 'Shared with 3-5 pros',
    sherpa: 'Exclusive matches',
  },
  {
    feature: 'When you pay',
    angi: 'Before you win the job',
    thumbtack: 'Before you win the job',
    sherpa: 'After you get paid',
  },
  {
    feature: 'Client verification',
    angi: 'None',
    thumbtack: 'None',
    sherpa: 'Budget + scope validated by AI',
  },
  {
    feature: 'Payment protection',
    angi: 'None',
    thumbtack: 'None',
    sherpa: 'Escrow protection',
  },
];

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: 'Vetted Leads Only',
    description:
      'Every client project is validated for scope and budget before you see it. No tire-kickers, no unrealistic expectations.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Fair Commission',
    description:
      'No upfront fees. No subscriptions. You pay a transparent commission only when you complete a job and get paid.',
  },
  {
    icon: BoltIcon,
    title: 'Emergency Dispatch',
    description:
      'Join our 24/7 emergency network for guaranteed volume. Water, fire, mold — retainer-based opportunities for certified pros.',
  },
  {
    icon: ChartBarIcon,
    title: 'Career Dashboard',
    description:
      'Track earnings, job history, ratings, and growth metrics. See how you rank and where to improve.',
  },
  {
    icon: UserGroupIcon,
    title: 'Insurance Network',
    description:
      'Access group insurance rates and connect with insurance restoration jobs. Guaranteed payment through carrier billing.',
  },
  {
    icon: ClockIcon,
    title: 'Your Schedule, Your Terms',
    description:
      'Set your availability, service area, and preferred job types. Only get matched with work that fits your business.',
  },
];

const requirements = [
  'Valid trade license for your state',
  'General liability insurance (minimum coverage varies by trade)',
  'Willingness to pass a background check',
  'Reliable transportation to job sites',
  'Smartphone with internet access',
  'Commitment to quality work and professionalism',
];

export default function ForProsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-50 px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/4 translate-x-1/4 rounded-full bg-[#00a9e0]/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="animate-fade-slide-up inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-medium text-emerald-600 sm:text-sm">
              Now accepting applications
            </span>
          </div>
          <h1 className="animate-fade-slide-up stagger-1 mt-8 text-4xl font-bold text-zinc-900 sm:text-5xl lg:text-6xl">
            Stop Paying for Leads.{' '}
            <span className="bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent">
              Start Earning.
            </span>
          </h1>
          <p className="animate-fade-slide-up stagger-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
            No subscription fees. No lead fees. No bidding wars. Get matched
            with pre-qualified jobs in your area and only pay when you win work.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-[#00a9e0] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0ea5e9] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-[0.98]"
            >
              Apply in 5 Minutes
              <svg
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Sherpa Pros — Comparison */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
            Why Pros Choose Sherpa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-600">
            See how we stack up against platforms that profit from your frustration.
          </p>

          {/* Desktop table */}
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-500">
                    Angi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-500">
                    Thumbtack
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00a9e0]">
                    Sherpa Pros
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-zinc-50 ${i < comparisonRows.length - 1 ? 'border-b border-zinc-100' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-2">
                        <XCircleIcon className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                        {row.angi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-2">
                        <XCircleIcon className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                        {row.thumbtack}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900">
                      <span className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                        {row.sherpa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-12 space-y-4 sm:hidden">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-zinc-900">{row.feature}</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-zinc-500">
                    <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                    <span><span className="font-medium text-zinc-400">Angi:</span> {row.angi}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-zinc-500">
                    <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                    <span><span className="font-medium text-zinc-400">Thumbtack:</span> {row.thumbtack}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-zinc-900">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                    <span><span className="font-medium text-[#00a9e0]">Sherpa:</span> {row.sherpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
            Built for Construction Professionals
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-600">
            Everything you need to grow your business, in one platform.
          </p>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className={`group animate-fade-slide-up rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#00a9e0]/20 hover:shadow-md stagger-${i + 1}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#00a9e0] transition-colors group-hover:bg-sky-100">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Breakdown */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
            Transparent Commission
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-zinc-600">
            The more you work, the less you pay. Our tiered commission rewards
            your success.
          </p>
          <div className="mt-12">
            <CommissionSlider />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
            What You Need to Apply
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-zinc-600">
            We keep the bar high so the work stays steady.
          </p>
          <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircleIcon
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="text-base text-zinc-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#00a9e0] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Build Your Career?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join the network of verified pros earning more and spending less on
            marketing. Apply in 5 minutes.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#00a9e0] shadow-lg shadow-black/10 transition-all hover:bg-zinc-50 hover:shadow-xl active:scale-[0.98]"
            >
              Apply Now — It&apos;s Free
              <svg
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
