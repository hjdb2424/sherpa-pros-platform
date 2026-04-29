import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'Client Beta Invite — Sherpa Pros',
  description: 'Trade work, done right. Code-verified quotes and marketplace payment protection for your next home or property project.',
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

        {/* Hero */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl print:text-2xl">
            Stop getting three quotes you can&apos;t compare.<br />
            <span className="text-[#00a9e0]">Trade work, done right.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Every Sherpa Pros quote is validated against your local building codes and real market pricing &mdash; so you can actually tell who&apos;s padding and who forgot something. Your money sits in marketplace payment protection until the work passes inspection, so you stop paying contractors and praying.
          </p>
        </div>

        {/* Pain — trust problem */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">The trade industry has a trust problem</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">Pros pay to compete &mdash; you pay for it</p>
              <p className="mt-1">Angi and Thumbtack charge pros $30&ndash;$100 per lead. Guess who covers that? Sherpa Pros never charges leads. Pros pass the savings to you.</p>
            </li>
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">Quotes are a guessing game</p>
              <p className="mt-1">Three bids, three different scopes, three different prices. Every Sherpa quote is checked against building codes and market pricing so you can compare apples to apples.</p>
            </li>
            <li className="rounded-lg border border-zinc-200 p-4">
              <p className="font-semibold text-zinc-900">You pay and pray</p>
              <p className="mt-1">Deposit, then ghosting. Or worse, sloppy work you can&apos;t un-do. With marketplace payment protection, your money is held until the work passes inspection.</p>
            </li>
          </ul>
        </div>

        {/* What you'll get */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What you&apos;ll get in the beta</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Sherpa Marketplace', d: 'Post a job, get bids from licensed and insured pros in your area.' },
              { t: 'Code-Verified Quotes', d: 'Every bid checked against local building codes — no missing line items.' },
              { t: 'Marketplace Payment Protection', d: 'Your money is held until the work passes inspection. No more deposit-and-pray.' },
              { t: 'Materials Dispatch', d: 'Materials delivered to the job site. No supply runs for the pro — your job goes faster.' },
              { t: 'Sherpa Success Manager', d: 'A real human handles vendor coordination and disputes if something goes sideways.' },
              { t: 'Multi-Trade Coordination', d: 'One job, multiple trades (plumber + electrician + tile)? We coordinate the handoffs.' },
              { t: '37 Service Categories', d: '251+ services from smart home installs to landscaping to HVAC repair.' },
              { t: 'In-App Messaging', d: 'Masked numbers. No phone spam. Full record of what was agreed.' },
            ].map((f) => (
              <div key={f.t} className="rounded-lg bg-white p-3">
                <p className="text-sm font-semibold text-zinc-900">{f.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founding Client perks */}
        <div className="mt-8 rounded-xl border-2 border-[#ff4500]/30 bg-[#ff4500]/[0.04] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Founding Client perks</h2>
          <p className="mt-1 text-xs text-zinc-500">Things later joiners will never get.</p>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-700">
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">Free Sherpa Home subscription for life</strong> when it launches &mdash; discounted rates, priority matching, faster SLAs.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">&ldquo;Founding Member&rdquo; badge</strong> in your account, visible to pros bidding your jobs.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">Direct line to Phyrom</strong> (founder, working NH GC) &mdash; text or WhatsApp for support during beta.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">First crack at premium pros</strong> when Sherpa Home launches with priority matching.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">Wefunder community-round pre-allocation</strong> when the round opens &mdash; invest alongside us.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&bull;</span><span><strong className="text-zinc-900">One free year of home maintenance plan</strong> when Sherpa Home goes live.</span></li>
          </ul>
        </div>

        {/* How to get in */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/[0.03] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to get in</h2>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">On the web</p>
          <div className="mt-2 space-y-2">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">1</div>
              <p className="pt-0.5 text-sm text-zinc-800">Go to www.thesherpapros.com/sign-in</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">2</div>
              <p className="pt-0.5 text-sm text-zinc-800">Sign in with the email this invite came to</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">3</div>
              <p className="pt-0.5 text-sm text-zinc-800">Pick &ldquo;Client&rdquo; on the role screen</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">4</div>
              <p className="pt-0.5 text-sm text-zinc-800">Post your first job (takes about 60 seconds)</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">On your phone</p>
          <p className="mt-2 text-sm text-zinc-700">
            Visit <strong>www.thesherpapros.com/install</strong> &mdash; iPhone gets TestFlight, Android installs as a PWA. Same login either way.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Questions you&apos;re probably asking</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-zinc-900">Are you available in my area?</p>
              <p className="mt-1 text-zinc-600">NH and ME first, expanding fast. We&apos;ll confirm coverage when you sign up &mdash; if we don&apos;t have pros in your zip yet, we&apos;ll tell you straight.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">What if the work is bad?</p>
              <p className="mt-1 text-zinc-600">Marketplace Payment Protection holds your money until the work passes inspection. If there&apos;s a dispute, your Sherpa Success Manager (a real human) steps in.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Will I get spammed by pros?</p>
              <p className="mt-1 text-zinc-600">No. Phone numbers stay masked. All messaging goes through the app, so you keep a record &mdash; and you don&apos;t get blown up at dinner.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Do I have to download an app?</p>
              <p className="mt-1 text-zinc-600">No. The web version works great on phone and laptop. The app is there if you want notifications and faster reload.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">What does it cost me?</p>
              <p className="mt-1 text-zinc-600">Free to post. You only pay when you accept a bid. No subscription, no lead fees, no surprises.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">How &ldquo;done&rdquo; is this?</p>
              <p className="mt-1 text-zinc-600">We&apos;re early &mdash; you&apos;re one of 11 Clients in closed beta. Your feedback shapes what ships next. Expect rough edges; tell us where they are.</p>
            </div>
          </div>
        </div>

        {/* What we need back */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need back from you</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <li>&bull; <strong>Posting flow</strong> &mdash; was it easy to describe your project and post a job?</li>
            <li>&bull; <strong>Finding pros</strong> &mdash; did the matching and pro profiles give you confidence?</li>
            <li>&bull; <strong>Trust</strong> &mdash; would you trust this platform with your next home or property project?</li>
            <li>&bull; <strong>Anything confusing</strong> &mdash; where did you pause or wonder &ldquo;what does this do?&rdquo;</li>
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
          <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md">
            Sign in now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
