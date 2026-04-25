import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from './PrintButton';

export const metadata: Metadata = {
  title: 'You\'re Invited — Sherpa Pros Beta',
  description: 'You\'ve been invited to test Sherpa Pros, the smart marketplace for trade work.',
};

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print-friendly one-pager */}
      <div className="mx-auto max-w-2xl px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <div>
            <Logo size="lg" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#00a9e0]">Beta Invite</p>
            <p className="text-xs text-zinc-400">thesherpapros.com</p>
          </div>
        </div>

        {/* Welcome */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-3xl font-bold text-zinc-900 print:text-2xl">
            You&apos;re invited to test Sherpa Pros
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            We&apos;re building the smart marketplace for trade work &mdash; and we want your
            feedback before we launch. As a beta tester, you&apos;ll get early access to the
            full platform and a direct line to our team.
          </p>
        </div>

        {/* What is Sherpa Pros */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:bg-zinc-50 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What is Sherpa Pros?</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Sherpa Pros is a marketplace that connects homeowners and property managers with
            licensed, insured trade professionals. Unlike Angi or Thumbtack, we verify every
            quote against building codes, hold payments in escrow until the work is done right,
            and never charge pros for leads.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { stat: '37', label: 'Service categories' },
              { stat: '251+', label: 'Verified services' },
              { stat: '$0', label: 'Lead fees for pros' },
              { stat: '100%', label: 'Licensed pros' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xl font-bold text-[#00a9e0]">{item.stat}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Sherpa Ecosystem */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">The Sherpa Ecosystem</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-[#00a9e0]/10 px-2 py-0.5 text-[10px] font-bold text-[#00a9e0]">LIVE</span>
                <h3 className="text-sm font-semibold text-zinc-900">Sherpa Marketplace</h3>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">The smart marketplace for trade work. Post jobs, get matched, track progress, pay through escrow.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">SOON</span>
                <h3 className="text-sm font-semibold text-zinc-900">Sherpa Hub</h3>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">Physical locations for supply kits, equipment rental, training, and branded gear.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">SOON</span>
                <h3 className="text-sm font-semibold text-zinc-900">Sherpa Home</h3>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">Subscription for discounted rates, priority pro matching, and faster SLAs.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">SOON</span>
                <h3 className="text-sm font-semibold text-zinc-900">Sherpa Success Manager</h3>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">Your dedicated account manager for project oversight, vendor coordination, and dispute resolution.</p>
            </div>
          </div>
        </div>

        {/* How to access */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/[0.03] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to access the beta</h2>

          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">1</div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Visit thesherpapros.com/sign-in</p>
                <p className="text-xs text-zinc-500">Or use your personalized demo link if one was shared with you.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">2</div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Sign in with your invite email</p>
                <p className="text-xs text-zinc-500">Use the email address associated with your invite. No password needed for beta.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">3</div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Complete the quick setup (30 seconds)</p>
                <p className="text-xs text-zinc-500">Tell us about yourself so we can personalize your experience.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-sm font-bold text-white">4</div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Take the guided tour</p>
                <p className="text-xs text-zinc-500">A quick walkthrough will show you the key features. You can replay it anytime from Settings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What we need from you */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need from you</h2>
          <p className="mt-2 text-sm text-zinc-600">
            This is a beta &mdash; your honest feedback shapes the product. Here&apos;s what we&apos;re
            looking for:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              'Does the flow make sense? Can you post a job / find pros / manage properties without getting lost?',
              'Is the information useful? Are the finance dashboards, work orders, and property views showing what you need?',
              'What\'s missing? What would make you switch from your current tool to this?',
              'What\'s confusing? Anything that made you pause or wonder "what does this do?"',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="mt-8 rounded-lg bg-zinc-900 p-6 text-white print:mt-4 print:bg-zinc-900">
          <h2 className="text-lg font-bold">Quick links</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">Platform</p>
              <p className="text-sm font-semibold">thesherpapros.com/sign-in</p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">PM Demo</p>
              <p className="text-sm font-semibold">thesherpapros.com/demo/pm</p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">Pro Demo</p>
              <p className="text-sm font-semibold">thesherpapros.com/demo/pro</p>
            </div>
            <div className="rounded-lg bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">Client Demo</p>
              <p className="text-sm font-semibold">thesherpapros.com/demo/client</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center print:mt-4 print:pt-4">
          <p className="text-sm text-zinc-600">
            Questions or feedback? Reach us directly:
          </p>
          <p className="mt-2 text-sm font-semibold text-zinc-900">
            info@thesherpapros.com
          </p>
          <p className="mt-4 text-xs text-zinc-400">
            &copy; 2026 Sherpa Pros &bull; Built by a working general contractor
          </p>
        </div>

        {/* Print + Sign in buttons (hidden on print) */}
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <PrintButton />
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
          >
            Sign in now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
