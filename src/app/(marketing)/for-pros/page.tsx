import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import CommissionSlider from './CommissionSlider';

export const metadata: Metadata = {
  title: 'Sherpa Pros for contractors — Jobs. Not leads.',
  description:
    'Get paid for work, not for paying to bid. 5% take when you get paid. Instant Stripe payout. QuickBooks Online sync. Apply for the beta.',
};

// Spec section 2 — Sherpa Pros vs Angi comparison
// "5% take when paid vs ~30% effective lead-gen cost", QBO sync, instant Stripe payout
const comparisonRows = [
  {
    feature: 'What you pay',
    angi: '~30% effective cost (lead fees + subscription, even when you do not win)',
    sherpa: '5% take rate, only when the job is paid (founding rate)',
  },
  {
    feature: 'When you pay',
    angi: 'Up front, every shared lead',
    sherpa: 'After the client pays you',
  },
  {
    feature: 'Lead sharing',
    angi: 'Same lead sold to 5 to 8 other pros',
    sherpa: 'Direct match. The job is yours if you accept it.',
  },
  {
    feature: 'Payouts',
    angi: 'You invoice and chase the client yourself',
    sherpa: 'Instant Stripe payout when the job clears',
  },
  {
    feature: 'Bookkeeping',
    angi: 'Manual export and re-key',
    sherpa: 'QuickBooks Online sync built in. No double entry.',
  },
  {
    feature: 'License and insurance check',
    angi: 'Done by the contractor on the honor system',
    sherpa: 'We pull and verify them ourselves',
  },
];

// Spec section 3 — Founding Pro benefits
const foundingBenefits = [
  {
    icon: CurrencyDollarIcon,
    title: '5% take rate, grandfathered forever',
    description:
      'Standard pricing after the beta is $49 a month plus 10% take rate. Founding pros stay at 5% with no monthly fee. For as long as you work the platform.',
  },
  {
    icon: StarIcon,
    title: 'Founding Pro badge',
    description:
      'Permanent badge on your profile. Shows up in client search results, in dispatch matching, and on every quote you send.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Direct line to the founder',
    description:
      'Phyrom answers his own phone. Text him on the cell number you get at sign-up. Real product feedback shapes what ships next.',
  },
  {
    icon: MegaphoneIcon,
    title: 'Marketing exposure',
    description:
      'We promote you. Phyrom records a free walk-the-job video at one of your sites. Your photo runs in the Old-House Verified press push. Local PR pitches name you first.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Real liability coverage',
    description:
      'Sherpa Pros carries platform liability insurance on every job. You are the licensed pro. We back the platform behind you.',
  },
];

// Spec section 5 — beta agreement summary (3 bullets — what they get, what they commit to)
const betaWhatYouGet = [
  'Full platform access. Stripe Connect payouts, QuickBooks sync, Wisetack consumer financing, Zinc materials, Uber Connect for crew rides.',
  '5% take rate locked in forever. No monthly subscription during the 90-day beta. No surprise fees, no lead charges.',
  'Founding Pro badge, direct line to Phyrom, and free marketing exposure. We treat you like a co-builder, not a number.',
];

const betaWhatYouCommit = [
  '90-day beta minimum. Real licensed work only. Verified license and insurance on file before your first job.',
  'Ten-minute weekly feedback call or text. One short video testimonial when you are ready. Permission to use your logo.',
  'Reply to client inquiries inside 24 hours. Hold your rating above four stars. That is the bar.',
];

export default function ForProsPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero — Jobs. Not leads. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/4 translate-x-1/4 rounded-full bg-[#00a9e0]/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="animate-fade-slide-up inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 sm:text-sm">
              Founding Pro beta — 10 spots open
            </span>
          </div>
          <h1 className="animate-fade-slide-up stagger-1 mt-8 text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            Jobs.{' '}
            <span className="bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent">
              Not leads.
            </span>
          </h1>
          <p className="animate-fade-slide-up stagger-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Get paid for work, not for paying to bid. 5% take rate when the client pays. Instant Stripe payout. QuickBooks Online sync built in. Built by a working general contractor.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-[#f59e0b] px-8 py-4 text-lg font-semibold text-[#1a1a2e] shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 hover:shadow-xl active:scale-[0.98]"
            >
              Apply for the beta
              <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Five-minute application. No card. Phyrom reviews every one.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Comparison table — Sherpa vs Angi */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Sherpa Pros vs Angi
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
            Math first. Marketing second. Here is what the same hundred-dollar job actually costs you on each side.
          </p>

          {/* Desktop table */}
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    What matters
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    Angi
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
                    className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${i < comparisonRows.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-start gap-2">
                        <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                        <span>{row.angi}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                      <span className="flex items-start gap-2">
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                        <span>{row.sherpa}</span>
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
              <div key={row.feature} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{row.feature}</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                    <span><span className="font-medium text-zinc-400">Angi:</span> {row.angi}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                    <span><span className="font-medium text-[#00a9e0]">Sherpa Pros:</span> {row.sherpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost callout */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-6">
            <p className="text-center text-base text-zinc-800 dark:text-zinc-100">
              <span className="font-bold">The simple math:</span> Pros on lead-gen platforms spend roughly 30 cents of every revenue dollar on lead fees and subscriptions. On Sherpa Pros, founding pros pay 5 cents on a paid job. That is one third of one sixth of what you are paying now.
            </p>
          </div>
        </div>
      </section>

      {/* Commission slider (preserved — visualizes the take-rate math) */}
      <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            See it on your own number
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-zinc-600 dark:text-zinc-400">
            Drag the slider. Look at the take rate. Look at what you keep. Then decide.
          </p>
          <div className="mt-12">
            <CommissionSlider />
          </div>
        </div>
      </section>

      {/* 3. Founding Pro benefits */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-4 py-1.5">
              <StarIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 sm:text-sm">
                Founding Pro benefits
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              First ten pros get the better deal forever
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              The beta cohort writes the playbook. We pay you back for that with a permanent rate, a permanent badge, and direct access.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foundingBenefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <b.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Phyrom founder quote */}
      <section className="bg-[#1a1a2e] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <svg className="mx-auto h-10 w-10 text-amber-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p className="mt-6 text-2xl font-medium leading-relaxed text-white sm:text-3xl">
            &ldquo;I built this because I got tired of watching good subs pay Angi five hundred bucks a month for leads that went nowhere. You do the work. You get paid. We take five cents on the dollar. That is the whole pitch.&rdquo;
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00a9e0] text-lg font-bold text-white">
              P
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-white">Phyrom</p>
              <p className="text-sm text-zinc-400">Founder · General Contractor · HJD Builders LLC</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Beta agreement summary */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              The beta agreement, plain English
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Two columns. What you get. What you commit to. No fine print games.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* What you get */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-8">
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                What you get
              </h3>
              <ul className="mt-6 space-y-4">
                {betaWhatYouGet.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What you commit to */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                What you commit to
              </h3>
              <ul className="mt-6 space-y-4">
                {betaWhatYouCommit.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheckIcon className="mt-1 h-5 w-5 shrink-0 text-[#00a9e0]" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA repeat */}
      <section className="bg-[#f59e0b] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#1a1a2e] sm:text-4xl">
            Ten spots. Five-minute apply.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#1a1a2e]/80">
            Phyrom reads every application. If you are licensed and insured, you will hear back inside 48 hours.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full bg-[#1a1a2e] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-[0.98]"
            >
              Apply for the beta
              <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#1a1a2e]/70">
            Already have a Sherpa Pros account?{' '}
            <Link href="/sign-in" className="font-semibold underline hover:no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
