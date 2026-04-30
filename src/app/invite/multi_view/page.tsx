import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'Multi-View Beta Tester — Sherpa Pros',
  description:
    'You see every viewpoint on Sherpa Pros — Pro, Client, PM, and Tenant — through one identity. Catch the seams. Tell us what feels weird across persona handoffs.',
};

export default function MultiViewInvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-[700px] px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <Logo size="lg" />
          <div className="text-right">
            <p className="text-sm font-semibold text-amber-600">Beta Invite</p>
            <p className="text-xs text-zinc-400">Multi-View Tester</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl print:text-2xl">
            You&apos;re not just a user.<br />
            <span className="text-amber-600">You see every viewpoint.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Sherpa Pros is a real two-sided marketplace. Most beta tools dump you into one role — you can&apos;t see what the other side sees, can&apos;t catch bugs in the persona handoffs, can&apos;t tell us when a flow feels weird from the contractor&apos;s chair vs the homeowner&apos;s. As a Multi-View Tester, you flip between Pro, Client, PM, and Tenant views in one click, and you keep your same identity in every one.
          </p>
        </div>

        {/* Why we need you */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Why we need multi-view eyes</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">Persona handoffs are where marketplaces break</p>
              <p className="mt-1">A job posted by a Client lands in a Pro&apos;s inbox. A bid from the Pro shows up on the Client&apos;s screen. We need someone watching both ends of the same conversation to catch the moments where they don&apos;t line up.</p>
            </li>
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">Quotes look different to everyone reading them</p>
              <p className="mt-1">The same Code-Verified Quote is rendered four different ways depending on who&apos;s looking — Pro, Client, PM, Tenant. Tell us where the rendering diverges in ways it shouldn&apos;t.</p>
            </li>
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">Single-role testers can&apos;t see the seams</p>
              <p className="mt-1">A Client tester might love the post-a-job flow but never know the quote it generates is missing fields the Pro needs. A Pro tester might never see the Client&apos;s confusion. You see both.</p>
            </li>
          </ul>
        </div>

        {/* What you get */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What you get</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Floating Profile Switcher', d: 'A 🦸 button bottom-left of every page. Click → flip to Pro / Client / PM / Tenant in one click.' },
              { t: 'Same identity, every view', d: 'You sign in once. Every dashboard you visit is yours, no separate accounts.' },
              { t: 'Test the handoffs', d: 'Post a job as a Client → switch to Pro → bid on it. See exactly how the marketplace looks from both sides.' },
              { t: 'All four dashboards', d: 'Pro, Client, PM, and Tenant — every flow, every persona-specific feature.' },
              { t: 'Code-Verified Quotes in every view', d: 'See how the same quote renders for the contractor, the homeowner, the PM, and the tenant tracking the work order.' },
              { t: 'Direct line for feedback', d: 'Text or WhatsApp Phyrom. Bug reports, copy nits, missing edge cases — send everything.' },
            ].map((f) => (
              <div key={f.t} className="rounded-lg bg-white p-3">
                <p className="text-sm font-semibold text-zinc-900">{f.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founding tester perks */}
        <div className="mt-8 rounded-xl border-2 border-amber-500/30 bg-amber-500/[0.05] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Founding Multi-View Tester perks</h2>
          <p className="mt-1 text-xs text-zinc-500">You&apos;re 1 of only 2-3 in this cohort.</p>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-700">
            <li className="flex gap-2"><span className="text-amber-600">&bull;</span><span><strong className="text-zinc-900">&ldquo;Multi-View Tester&rdquo; badge</strong> across every dashboard you visit.</span></li>
            <li className="flex gap-2"><span className="text-amber-600">&bull;</span><span><strong className="text-zinc-900">Free Sherpa Home subscription for life</strong> when it launches.</span></li>
            <li className="flex gap-2"><span className="text-amber-600">&bull;</span><span><strong className="text-zinc-900">First look at unreleased Wisemen</strong> and roadmap bets — your input shapes what we build next.</span></li>
            <li className="flex gap-2"><span className="text-amber-600">&bull;</span><span><strong className="text-zinc-900">Direct line to Phyrom</strong> (founder, working NH GC) — text or WhatsApp during beta.</span></li>
            <li className="flex gap-2"><span className="text-amber-600">&bull;</span><span><strong className="text-zinc-900">Wefunder community-round pre-allocation</strong> when the round opens — invest alongside us.</span></li>
          </ul>
        </div>

        {/* How to get in */}
        <div className="mt-8 rounded-xl border-2 border-amber-500/20 bg-amber-500/[0.03] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to get in</h2>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">On the web</p>
          <div className="mt-2 space-y-2">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">1</div>
              <p className="pt-0.5 text-sm text-zinc-800">Go to www.thesherpapros.com/sign-in</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">2</div>
              <p className="pt-0.5 text-sm text-zinc-800">Sign in with the email this invite came to</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">3</div>
              <p className="pt-0.5 text-sm text-zinc-800">You&apos;ll land in the Client view by default. Look for the 🦸 button bottom-left to switch.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">4</div>
              <p className="pt-0.5 text-sm text-zinc-800">Try posting a job as a Client, then flip to Pro to bid on it. See the handoff.</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">On your phone</p>
          <p className="mt-2 text-sm text-zinc-700">
            Visit <strong>www.thesherpapros.com/install</strong> &mdash; iPhone gets TestFlight, Android installs as a PWA. Same login either way; the switcher works on mobile too.
          </p>
        </div>

        {/* What we need back */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need back from you</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <li>&bull; <strong>The seams</strong> &mdash; where does going from Client view to Pro view feel weird? What information is missing on one side that exists on the other?</li>
            <li>&bull; <strong>Persona handoffs</strong> &mdash; a job posted as a Client → a bid as a Pro → a work order as a PM. Where does the chain break?</li>
            <li>&bull; <strong>Render diffs</strong> &mdash; same quote, four views. Are the differences intentional or bugs?</li>
            <li>&bull; <strong>Confusing copy</strong> &mdash; if a Pro and a Client see the same word and interpret it differently, that&apos;s on us. Tell us which words.</li>
            <li>&bull; <strong>Mobile vs desktop</strong> &mdash; the switcher should work on both. If it breaks on phone, we want screenshots.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center print:mt-4 print:pt-4">
          <p className="text-sm text-zinc-600">Questions or feedback? Reach us directly:</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">info@thesherpapros.com</p>
          <p className="mt-4 text-xs text-zinc-400">&copy; 2026 Sherpa Pros &bull; www.thesherpapros.com</p>
        </div>

        {/* Actions (hidden on print) */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <PrintButton />
          <Link href="/install" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md">
            Install on phone
          </Link>
          <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 hover:shadow-md">
            Sign in now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
