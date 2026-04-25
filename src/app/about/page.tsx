import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'About — Sherpa Pros',
  description: 'Built by a working general contractor. Sherpa Pros is the smart marketplace for trade work.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">

        {/* Back + Logo */}
        <div className="mb-16 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/40 transition-colors hover:text-white/70">
            &larr; Back
          </Link>
          <Logo size="md" />
        </div>

        {/* Hero */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Built by a contractor.{' '}
          <span className="text-white/40">For everyone in the trade.</span>
        </h1>

        <p className="mt-8 text-lg leading-relaxed text-white/60">
          Sherpa Pros was started by a working general contractor who got tired of the way
          the industry treats both sides of the transaction. Homeowners get three random quotes
          and hope for the best. Pros pay for leads that go nowhere. Property managers juggle
          spreadsheets and phone calls to keep their buildings running.
        </p>

        <p className="mt-6 text-lg leading-relaxed text-white/60">
          We believed there was a better way. So we built it.
        </p>

        {/* Divider */}
        <div className="my-16 h-px bg-white/[0.06]" />

        {/* What we believe */}
        <h2 className="text-2xl font-bold">What we believe</h2>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#00a9e0]">Pros should not pay to compete</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              The lead-fee model is broken. It punishes good contractors and rewards platforms
              that sell the same lead five times. On Sherpa Pros, contractors never pay for leads.
              They pay a small service fee only when the job is done and the client pays. The incentives
              are aligned: the better the work, the more everyone wins.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#00a9e0]">Every quote should be honest</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              We validate quotes against local building codes and market pricing before they reach
              the homeowner. This is not a gimmick &mdash; it is what any good general contractor does
              before signing off on a scope of work. We just automated it and made it available to everyone.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#00a9e0]">Your money should be protected</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Payments are held in escrow until the work is inspected and approved. The pro gets paid
              when the job is done right. If something goes wrong, your money stays protected. No other
              marketplace in the trades does this at scale.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#00a9e0]">Technology should serve the trade, not replace it</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              We are not trying to disrupt contractors. We are trying to make their lives easier.
              The platform handles the business side &mdash; scheduling, payments, compliance, client
              communication &mdash; so pros can focus on what they do best: the work itself.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/[0.06]" />

        {/* The Sherpa Ecosystem */}
        <h2 className="text-2xl font-bold">The Sherpa Ecosystem</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          We are building more than a marketplace. Sherpa Pros is an ecosystem designed to
          support every side of the trade &mdash; from the first bid to the final inspection.
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              name: 'Sherpa Marketplace',
              status: 'Live',
              statusColor: 'text-[#00a9e0] bg-[#00a9e0]/10',
              desc: 'The smart marketplace for trade work. From plumbing to smart home automation &mdash; post a job, get matched with verified pros, track progress, and pay through escrow.',
            },
            {
              name: 'Sherpa Hub',
              status: 'Coming Soon',
              statusColor: 'text-amber-400 bg-amber-500/10',
              desc: 'Physical locations where pros pick up supply kits, rent professional equipment, get manufacturer training, and represent the Sherpa brand.',
            },
            {
              name: 'Sherpa Home',
              status: 'Coming Soon',
              statusColor: 'text-emerald-400 bg-emerald-500/10',
              desc: 'A subscription for homeowners and property managers. Discounted rates, priority matching, faster SLAs, and seasonal maintenance packages.',
            },
            {
              name: 'Sherpa Success Manager',
              status: 'Live',
              statusColor: 'text-violet-400 bg-violet-500/10',
              desc: 'Your dedicated account manager. Real project oversight, vendor coordination, and dispute resolution &mdash; not a chatbot.',
            },
          ].map((item) => (
            <div key={item.name} className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="shrink-0">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/40" dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/[0.06]" />

        {/* By the numbers */}
        <h2 className="text-2xl font-bold">By the numbers</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '37', label: 'Service categories' },
            { value: '251+', label: 'Verified services' },
            { value: '4', label: 'User roles' },
            { value: '$0', label: 'Lead fees' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[#00a9e0]">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/30">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/[0.06]" />

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Ready to see it?</h2>
          <p className="mt-3 text-sm text-white/50">
            Join the waitlist or sign in if you already have an invite.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-[#00a9e0] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
            >
              Join the waitlist
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex rounded-lg border border-white/10 px-8 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs text-white/20">
            &copy; 2026 Sherpa Pros. All rights reserved.
          </p>
          <a
            href="mailto:info@thesherpapros.com"
            className="mt-2 inline-block text-xs text-white/30 transition-colors hover:text-[#00a9e0]"
          >
            info@thesherpapros.com
          </a>
        </div>
      </div>
    </div>
  );
}
