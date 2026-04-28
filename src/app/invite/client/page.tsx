import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'Client Beta Invite — Sherpa Pros',
  description: 'You\'ve been invited to test Sherpa Pros — the smarter way to hire a pro.',
};

export default function ClientInvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-[700px] px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <Logo size="lg" />
          <div className="text-right">
            <p className="text-sm font-semibold text-[#00a9e0]">Beta Invite</p>
            <p className="text-xs text-zinc-400">Homeowners &amp; Clients</p>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl print:text-2xl">
            You&apos;re invited to test Sherpa Pros &mdash; The Smarter Way to Hire a Pro
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            We&apos;re building the smart platform for trade work &mdash; where every project
            finds the right pro. Post a job, get verified bids from licensed professionals,
            and pay through our marketplace payment protection so your money is always protected.
          </p>
        </div>

        {/* Key Features */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Key features for Clients</h2>
          <ul className="mt-3 space-y-2">
            {[
              'Post a job in 60 seconds — describe the work, add photos, done',
              'Code-checked quotes — every bid is validated against building codes',
              'Licensed and insured pros only — no guessing, no risk',
              'Marketplace-protected payments — your money is held until the work is done right',
              'Real reviews from real jobs — verified ratings from completed projects',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10 text-[10px] font-bold text-[#00a9e0]">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* How to access */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/[0.03] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to access the beta</h2>
          <div className="mt-4 space-y-3">
            {[
              { step: '1', title: 'Visit thesherpapros.com/sign-in' },
              { step: '2', title: 'Sign in with your invite email' },
              { step: '3', title: 'Complete the quick setup (30 seconds)' },
              { step: '4', title: 'Take the guided tour' },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">{s.step}</div>
                <p className="text-sm font-medium text-zinc-800 pt-0.5">{s.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we need */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need from you</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <li>&bull; Posting flow &mdash; was it easy to describe your project and post a job?</li>
            <li>&bull; Finding pros &mdash; did the matching and pro profiles give you confidence?</li>
            <li>&bull; Trust &mdash; would you trust this platform with your next home project?</li>
            <li>&bull; Anything confusing &mdash; where did you pause or wonder &ldquo;what does this do?&rdquo;</li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="mt-8 rounded-lg bg-zinc-900 p-5 text-white print:mt-4 print:bg-zinc-900">
          <h2 className="text-base font-bold">Quick links</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-white/10 px-4 py-2.5">
              <p className="text-xs text-white/60">Platform</p>
              <p className="text-sm font-semibold">thesherpapros.com/sign-in</p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-2.5">
              <p className="text-xs text-white/60">Client Demo</p>
              <p className="text-sm font-semibold">thesherpapros.com/demo/client</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center print:mt-4 print:pt-4">
          <p className="text-sm text-zinc-600">Questions or feedback? Reach us directly:</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">info@thesherpapros.com</p>
          <p className="mt-4 text-xs text-zinc-400">&copy; 2026 Sherpa Pros &bull; info@thesherpapros.com</p>
        </div>

        {/* Actions (hidden on print) */}
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <PrintButton />
          <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md">
            Sign in now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
