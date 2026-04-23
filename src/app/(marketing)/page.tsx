import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/marketing/Hero';
import HeroSearch from '@/components/marketing/HeroSearch';
import TestimonialCard from '@/components/marketing/TestimonialCard';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import LandingMap from '@/components/marketing/LandingMap';
import LandingCTA from '@/components/marketing/LandingCTA';
import {
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  MapPinIcon,
  BoltIcon,
  HomeModernIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Sherpa Pros — The licensed-trade marketplace that thinks like a contractor',
  description:
    'Licensed pros only. Code-aware quotes. Real reviews, no leads-for-sale. Built by a working New Hampshire general contractor. Post a job free.',
};

// 3-section value prop (per spec section 2)
const valueProps = [
  {
    icon: ShieldCheckIcon,
    title: 'Licensed pros only',
    description:
      'Every pro is license-checked and insurance-checked before they take a single job. No exceptions, no pay-to-play.',
  },
  {
    icon: DocumentCheckIcon,
    title: 'Code-aware quotes',
    description:
      'Quotes are checked against state and town building codes before they hit your inbox. You see the right scope and the right number the first time.',
  },
  {
    icon: HandThumbUpIcon,
    title: 'Real reviews, no leads-for-sale',
    description:
      'Reviews come from people who actually paid for the work. Pros do not buy leads here. They do the job, you rate the job. That is it.',
  },
];

// 3-step "how it works" (per spec section 3)
const howItWorksSteps = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Post the job',
    description:
      'Tell us what you need in plain words. A few photos help. Free, no card, no hassle.',
    step: '1',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Get bids from licensed pros',
    description:
      'You get bids from local licensed pros, usually inside a day. Each bid shows the license, the insurance, and the scope.',
    step: '2',
  },
  {
    icon: HomeModernIcon,
    title: 'Pick your pro, get it done',
    description:
      'Pick the pro you like. Pay through the platform when the work is done right. Rate the job. Done.',
    step: '3',
  },
];

// Boston-aware specialty lanes (per spec section 5)
const specialtyLanes = [
  {
    icon: BoltIcon,
    title: 'Mass Save heat pump installers',
    line: 'EPA-certified pros who know the rebate paperwork. We help you stack the $10K+ in incentives.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'EV charger installation',
    line: 'Licensed electricians who size your panel right and pull the permit. Goal: home charger in two weeks, not two months.',
  },
  {
    icon: HomeModernIcon,
    title: 'Old-house specialists',
    line: 'Plaster, slate, brownstone, triple-decker porches. Pros who actually work on pre-1950 homes. National platforms cannot filter for this. We can.',
  },
];

// Service area (preserved from prior content)
const hubCities = [
  { state: 'NH', cities: ['Portsmouth', 'Dover', 'Rochester', 'Exeter', 'Hampton', 'Manchester', 'Nashua', 'Concord', 'Derry', 'Salem'] },
  { state: 'ME', cities: ['Kittery', 'York', 'Kennebunk', 'Biddeford', 'Portland', 'Sanford'] },
  { state: 'MA', cities: ['Newburyport', 'Amesbury', 'Haverhill', 'Lawrence', 'Lowell'] },
];

// Testimonial slot (placeholder per spec section 6)
const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Homeowner, Portsmouth NH',
    quote:
      'Posted a kitchen job Friday. Three licensed pros bid by Monday. The one I picked pulled the permit, sent me a code-checked scope, and finished on time. First contractor experience that did not feel like pulling teeth.',
    rating: 5,
    initials: 'SM',
  },
  // Two intentionally-blank slots for new beta testimonials
  {
    name: 'Testimonial slot',
    role: 'Filling in beta',
    quote:
      'Beta cohort testimonial slot. Will be filled by a real pro after the first 5 completed jobs. Placeholder — do not ship to public until populated.',
    rating: 5,
    initials: '··',
  },
  {
    name: 'Testimonial slot',
    role: 'Filling in beta',
    quote:
      'Beta cohort testimonial slot. Will be filled by a property manager after the first PM anchor signs. Placeholder.',
    rating: 5,
    initials: '··',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero — branded, i18n-driven, includes Post a Job free CTA */}
      <Hero />

      {/* Hero search — main entry for clients (preserved) */}
      <HeroSearch />

      {/* 2. Three-section value prop — Licensed / Code-aware / Real reviews */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Three things you will not find on Angi
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              We built Sherpa Pros to fix the parts of hiring a contractor that are actually broken.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {valueProps.map((vp, i) => (
              <ScrollReveal key={vp.title} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all hover:border-[#00a9e0]/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <vp.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {vp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {vp.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works — Post → Bid → Done */}
      <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Post the job. Get bids. Get it done. No phone tag, no chasing, no leads-for-sale.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {howItWorksSteps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 100}>
                <div className="group relative rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm transition-all hover:border-[#00a9e0]/20 hover:shadow-md">
                  <div className="absolute -top-4 left-8 flex h-8 w-14 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">
                    Step {step.step}
                  </div>
                  <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950 text-[#00a9e0]">
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

      {/* 4. Trust signals — license + insurance verification + founder note */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-3">
            {/* Trust badges */}
            <ScrollReveal>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <ShieldCheckIcon className="h-10 w-10 text-emerald-500" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  License verified
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Every pro&apos;s state license is checked against the issuing board before their first job.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <DocumentCheckIcon className="h-10 w-10 text-emerald-500" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Insurance verified
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  General liability on file and current. We pull the certificate ourselves.
                </p>
              </div>
            </ScrollReveal>

            {/* Founder card — built by a NH GC */}
            <ScrollReveal delay={200}>
              <div className="rounded-2xl border border-[#00a9e0]/20 bg-gradient-to-br from-sky-50 to-white dark:from-sky-950 dark:to-zinc-900 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00a9e0] text-lg font-bold text-white">
                    P
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Phyrom</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Founder · NH General Contractor · HJD Builders LLC</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Built by a working New Hampshire general contractor. I built the platform I wished existed when I was hiring subs and bidding jobs. No marketing fluff. Just the basics done right.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. Specialty lanes — Boston-aware */}
      <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-4 py-1.5">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 sm:text-sm">
                Specialty lanes
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              The work national platforms cannot match
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Some jobs need a real specialist. We match on license, certification, and the actual skill.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {specialtyLanes.map((lane, i) => (
              <ScrollReveal key={lane.title} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <lane.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {lane.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {lane.line}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonial slot */}
      <ScrollReveal>
        <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Real homeowners, real jobs
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Two slots are placeholders for our beta cohort and PM anchor. They go live as the work goes live.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={`${t.name}-${t.role}`} {...t} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Service area (preserved — still accurate) */}
      <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-4 py-1.5">
              <MapPinIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400 sm:text-sm">
                Where we work
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              New Hampshire, Maine, Massachusetts
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Within an hour of Portsmouth NH today. Boston specialty lanes live now. More towns rolling out monthly.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
            <div className="lg:min-h-[400px]">
              <LandingMap />
            </div>

            <div className="space-y-6">
              {hubCities.map((group) => (
                <div key={group.state}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#00a9e0] text-[10px] font-bold text-white">
                      {group.state}
                    </span>
                    {group.state === 'NH' ? 'New Hampshire' : group.state === 'ME' ? 'Maine' : 'Massachusetts'}
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
                  Want us in your town? We listen.
                </p>
                <a
                  href="mailto:support@thesherpapros.com?subject=Request%20Service%20in%20My%20Area&body=I'd%20like%20Sherpa%20Pros%20to%20serve%20my%20area.%20My%20zip%20code%20is%20"
                  className="mt-2 inline-flex text-sm font-semibold text-[#00a9e0] transition-colors hover:text-[#0ea5e9]"
                >
                  Tell us your zip &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA repeat — Post a job free */}
      <ScrollReveal>
        <section className="bg-[#1a1a2e] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Post a job. Free. No card.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300">
              Licensed local pros bid on your job, usually inside a day. You pick. You pay through the platform when the work is done. That is it.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/client/post-job"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#f59e0b] px-8 py-4 text-base font-semibold text-[#1a1a2e] shadow-lg transition-all hover:bg-amber-400 active:scale-[0.98] sm:w-auto"
              >
                Post a job free
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/for-pros"
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-700 px-8 py-4 text-base font-semibold text-zinc-100 transition-all hover:bg-zinc-800 active:scale-[0.98] sm:w-auto"
              >
                I am a contractor
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <StarIcon className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Built by a working New Hampshire general contractor.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Existing final CTA component (preserved as bottom cap) */}
      <LandingCTA />
    </div>
  );
}
