import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'PM Beta Invite — Sherpa Pros',
  description: 'You\'ve been invited to test Sherpa Pros for property management.',
};

export default function PMInvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-[700px] px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <Logo size="lg" />
          <div className="text-right">
            <p className="text-sm font-semibold text-[#00a9e0]">Beta Invite</p>
            <p className="text-xs text-zinc-400">Property Management</p>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl print:text-2xl">
            You&apos;re invited to test Sherpa Pros &mdash; Property Management Beta
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            We&apos;re building the smart platform for trade work &mdash; and we want property
            managers like you to shape what it becomes. Manage maintenance, track financials,
            coordinate vendors, and monitor work orders across your entire portfolio.
          </p>
        </div>

        {/* Key Features */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Key features for PMs</h2>
          <ul className="mt-3 space-y-2">
            {[
              'Finance dashboard — NOI, budget variance, cost-per-unit at a glance',
              'Properties portfolio — every unit, every lease, one view',
              'Unified maintenance — kanban board + scheduled preventive maintenance',
              'Work order drill-down — full cost tracking from request to close-out',
              'Vendor coordination — assign, track, and rate pros per property',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10 text-[10px] font-bold text-[#00a9e0]">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Ecosystem */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">The Sherpa Ecosystem</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Sherpa Marketplace', status: 'LIVE', color: 'text-[#00a9e0] bg-[#00a9e0]/10', desc: 'Post jobs, get matched with licensed pros, track progress, pay with marketplace payment protection.' },
              { name: 'Sherpa Hub', status: 'SOON', color: 'text-amber-700 bg-amber-100', desc: 'Supply kits, equipment rental, training, and branded gear at physical locations.' },
              { name: 'Sherpa Home', status: 'SOON', color: 'text-emerald-700 bg-emerald-100', desc: 'Subscription for discounted rates, priority matching, and faster SLAs.' },
              { name: 'Sherpa Success Manager', status: 'SOON', color: 'text-violet-700 bg-violet-100', desc: 'Dedicated account manager for project oversight and dispute resolution.' },
            ].map((item) => (
              <div key={item.name} className="rounded-lg border border-zinc-200 p-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${item.color}`}>{item.status}</span>
                  <h3 className="text-sm font-semibold text-zinc-900">{item.name}</h3>
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
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
            <li>&bull; Feedback on finance views &mdash; are the numbers you need front and center?</li>
            <li>&bull; Maintenance workflow &mdash; does the kanban + schedule approach make sense?</li>
            <li>&bull; Missing features &mdash; what would make you switch from your current tool?</li>
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
              <p className="text-xs text-white/60">PM Demo</p>
              <p className="text-sm font-semibold">thesherpapros.com/demo/pm</p>
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
