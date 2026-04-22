import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/marketing/Hero';
import HeroSearch from '@/components/marketing/HeroSearch';
import { getDashboardStats, type DashboardStats } from '@/db/queries/dashboard';
import ComparisonTable from '@/components/marketing/ComparisonTable';
import TestimonialCard from '@/components/marketing/TestimonialCard';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import AppDownload from '@/components/marketing/AppDownload';
import LandingMap from '@/components/marketing/LandingMap';
import LandingCTA from '@/components/marketing/LandingCTA';
import {
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  BoltIcon,
  PhoneArrowUpRightIcon,
  MapPinIcon,
  BellAlertIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Sherpa Pros — The Construction Marketplace That Gets It',
  description:
    'Every Pro verified. Every project validated. AI-powered matching that protects both sides. Post a job or join as a Pro today.',
};

const howItWorksSteps = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Describe Your Project',
    description:
      'Our AI validates scope and budget before matching — so you get accurate bids from day one.',
    step: '01',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Get Matched With Verified Pros',
    description:
      'Background-checked, licensed, insured — no pay-to-play. Only vetted professionals.',
    step: '02',
  },
  {
    icon: LockClosedIcon,
    title: 'Pay Securely on Completion',
    description:
      'Funds held in escrow until you approve the work. Protection for both sides.',
    step: '03',
  },
];

const prosBenefits = [
  'Vetted leads only — no tire-kickers, no bidding wars',
  'Fair commission structure — you keep more of what you earn',
  'Career dashboard with analytics and reputation tracking',
  'Insurance network access and group rates',
  'Emergency dispatch retainer opportunities',
];

const hubCities = [
  { state: 'NH', cities: ['Portsmouth', 'Dover', 'Rochester', 'Exeter', 'Hampton', 'Manchester', 'Nashua', 'Concord', 'Derry', 'Salem'] },
  { state: 'ME', cities: ['Kittery', 'York', 'Kennebunk', 'Biddeford', 'Portland', 'Sanford'] },
  { state: 'MA', cities: ['Newburyport', 'Amesbury', 'Haverhill', 'Lawrence', 'Lowell'] },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner, Portsmouth NH',
    quote:
      'I posted a kitchen remodel on Friday and had three verified bids by Monday. The escrow payment gave me total peace of mind. Best experience I\'ve ever had hiring a contractor.',
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'Marcus Thompson',
    role: 'Licensed Electrician, Manchester NH',
    quote:
      'I was spending $400/month on Angi leads that went nowhere. Sherpa Pros sends me pre-qualified jobs in my area. No subscription, no wasted leads. My revenue is up 40% in three months.',
    rating: 5,
    initials: 'MT',
  },
  {
    name: 'Diana Chen',
    role: 'Property Manager, Boston MA',
    quote:
      'Managing 200+ units means constant maintenance. The emergency dispatch feature is a game-changer — verified pros on call 24/7. Response times went from days to hours.',
    rating: 5,
    initials: 'DC',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Hero Search — main entry point for clients */}
      <HeroSearch />

      {/* How It Works */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Three simple steps from project idea to job done.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {howItWorksSteps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 100}>
                <div
                  className="group relative rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all hover:border-[#00a9e0]/20 hover:shadow-md"
                >
                  <div className="absolute -top-4 left-8 flex h-8 w-14 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">
                    {step.step}
                  </div>
                  <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950 text-[#00a9e0] transition-colors group-hover:bg-sky-100 dark:group-hover:bg-sky-900">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable />

      {/* For Pros Section */}
      <ScrollReveal>
        <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-4 py-1.5">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 sm:text-sm">
                    For Professionals
                  </span>
                </div>
                <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  Build Your Career, Not Just Your Next Lead
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  No subscription fees. No lead fees. You only pay a fair
                  commission when you win work and get paid.
                </p>
                <ul className="mt-8 space-y-4">
                  {prosBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <svg
                        className="mt-1 h-5 w-5 shrink-0 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-base text-zinc-700 dark:text-zinc-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/for-pros"
                    className="inline-flex items-center rounded-full bg-[#00a9e0] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#0ea5e9] hover:shadow-xl"
                  >
                    Apply to Join
                    <svg
                      className="ml-2 h-4 w-4"
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

              {/* Visual card */}
              <div className="relative">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-8 shadow-lg sm:p-10">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a9e0]">
                      <BoltIcon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      Your Earnings Dashboard
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Preview</p>
                  </div>
                  <div className="mt-8 space-y-4">
                    {[
                      { label: 'Jobs Completed', value: '47', trend: '+12 this month' },
                      { label: 'Revenue (YTD)', value: '$68,400', trend: '+23% vs last year' },
                      { label: 'Avg Rating', value: '4.9', trend: '142 reviews' },
                      { label: 'Repeat Clients', value: '73%', trend: 'Top 5% of Pros' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between rounded-lg bg-white dark:bg-zinc-900 px-4 py-3 shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800"
                      >
                        <div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</div>
                          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {stat.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative dot */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#00a9e0]/10 blur-2xl" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Emergency & Insurance — already dark, keep as-is */}
      <section className="relative overflow-hidden bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#00a9e0]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5">
              <PhoneArrowUpRightIcon className="h-4 w-4 text-red-400" aria-hidden="true" />
              <span className="text-xs font-medium text-red-400 sm:text-sm">
                24/7 Emergency Dispatch
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              When Emergencies Hit, We Respond
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              IICRC certified pros on call around the clock. Insurance
              restoration network with guaranteed payment.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700">
              <BellAlertIcon className="h-8 w-8 text-red-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                24/7 Dispatch
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Emergency pros dispatched within minutes, any time of day or night.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700">
              <ShieldCheckIcon className="h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                IICRC Certified
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Water, fire, and mold restoration by certified professionals.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-zinc-700">
              <BanknotesIcon className="h-8 w-8 text-[#00a9e0]" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                Insurance Network
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Direct billing to insurance carriers. Guaranteed payment for pros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hub Map Section */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-4 py-1.5">
              <MapPinIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400 sm:text-sm">
                Service Area
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Serving the Greater Portsmouth Area
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              New Hampshire, Maine, and Massachusetts — within a 1-hour drive of Portsmouth, NH.
            </p>
          </div>

          {/* Map + city list */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
            {/* Interactive Map */}
            <div className="lg:min-h-[400px]">
              <LandingMap />
            </div>

            {/* City list */}
            <div className="space-y-6">
              {hubCities.map((group) => (
                <div key={group.state}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00a9e0] text-[10px] font-bold text-white">
                      {group.state}
                    </span>
                    {group.state === 'NH'
                      ? 'New Hampshire'
                      : group.state === 'ME'
                        ? 'Maine'
                        : 'Massachusetts'}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.cities.map((city) => (
                      <span
                        key={city}
                        className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-[#00a9e0]/20 bg-sky-50 dark:bg-sky-950 p-4">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Expanding beyond the Seacoast in 2026. Want us in your area?
                </p>
                <a
                  href="mailto:support@thesherpapros.com?subject=Request%20Service%20in%20My%20Area&body=I'd%20like%20Sherpa%20Pros%20to%20serve%20my%20area.%20My%20zip%20code%20is%20"
                  className="mt-2 inline-flex text-sm font-semibold text-[#00a9e0] transition-colors hover:text-[#0ea5e9]"
                >
                  Request your city &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download */}
      <AppDownload />

      {/* Pricing Preview */}
      <ScrollReveal>
        <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 px-4 py-1.5">
              <BanknotesIcon className="h-4 w-4 text-[#00a9e0]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#00a9e0] sm:text-sm">
                Simple Pricing
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Transparent Plans for Everyone
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              No hidden fees. No lead charges. Start free and upgrade when you are ready.
            </p>

            <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
              {/* Client pricing card */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#00a9e0]">
                  For Clients
                </p>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  From $0<span className="text-base font-normal text-zinc-500 dark:text-zinc-400">/mo</span>
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Post jobs and find verified pros for free. Upgrade to the Sherpa Plan for $29/mo for a dedicated human concierge and lower fees.
                </p>
                <Link
                  href="/client/subscription"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[#00a9e0] transition-colors hover:text-[#0ea5e9]"
                >
                  View Client Plans
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Pro pricing card */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  For Pros
                </p>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  From $0<span className="text-base font-normal text-zinc-500 dark:text-zinc-400">/mo</span>
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  List for free with 15% commission. Emergency Ready ($299/mo) and Restoration Certified ($799/mo) tiers unlock lower rates and priority dispatch.
                </p>
                <Link
                  href="/pro/subscription"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-500"
                >
                  View Pro Plans
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal>
        <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Trusted by Pros and Clients Alike
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Real feedback from real people building and improving their homes.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal>
        <LandingCTA />
      </ScrollReveal>
    </div>
  );
}
