import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'PM Beta Invite — Sherpa Pros',
  description: 'Closed beta for commercial property managers. Trade work, done right.',
};

export default function PMInvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-[700px] px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <Logo size="lg" />
          <div className="text-right">
            <span className="inline-flex rounded-full bg-[#00a9e0]/10 px-2.5 py-1 text-[10px] font-bold text-[#00a9e0]">BETA INVITE</span>
            <p className="mt-1 text-xs text-zinc-500">Property Managers</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl print:text-2xl">
            Stop chasing vendors. Stop paying for bad work.
            <span className="block text-[#00a9e0]">Trade work, done right.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Sherpa Pros gives commercial PMs a Combined Maintenance kanban, Multi-Trade Coordination,
            Marketplace Payment Protection, and a per-property Finance Hub &mdash; in one platform.
            Your money holds until work passes inspection. You see cost-per-property in real time.
          </p>
        </div>

        {/* The PM problem */}
        <div className="mt-8 rounded-xl border border-[#ff4500]/20 bg-[#ff4500]/[0.04] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">The problem you live every day</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-zinc-700">
            <li className="flex gap-3"><span className="text-[#ff4500]">&bull;</span><span><strong>Vendor coordination is on you.</strong> You email the plumber, schedule with the tenant, chase the invoice, file the receipt &mdash; and hope the work is good.</span></li>
            <li className="flex gap-3"><span className="text-[#ff4500]">&bull;</span><span><strong>No real-time per-property cost visibility.</strong> You learn a property is over budget at month-end, when it&apos;s too late to course-correct.</span></li>
            <li className="flex gap-3"><span className="text-[#ff4500]">&bull;</span><span><strong>When work is bad, you have no leverage.</strong> The vendor invoiced. You pay anyway. Owner asks why the unit still leaks.</span></li>
          </ul>
        </div>

        {/* What you'll get */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What you&apos;ll get</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Combined Maintenance', desc: 'One kanban across every property. Drill into any unit for full work-order history.' },
              { name: 'Multi-Trade Coordination', desc: "One job, multiple trades. We sequence the handoffs so you don't play project manager." },
              { name: 'Marketplace Payment Protection', desc: 'Your money holds until work passes inspection. Milestone-based release. Stripe Connect.' },
              { name: 'Sherpa Success Manager', desc: 'A dedicated human owns project oversight and dispute resolution. Day-one assignment for beta PMs.' },
              { name: 'Finance Hub', desc: 'Per-property budget, cost-per-unit, NOI, and 1099-ready exports for your accountant.' },
              { name: 'Materials Dispatch', desc: 'Materials shipped to the job site, tracked against the work order. No vendor markup games.' },
              { name: 'Smart Scan OCR', desc: 'Snap a receipt. Line items parse into AP. Categorized to the right property automatically.' },
              { name: 'In-App Messaging', desc: "Threaded per work order. Syncs to vendor SMS via Twilio so they can't ghost you." },
            ].map((f) => (
              <div key={f.name} className="rounded-lg border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">{f.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ecosystem */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">The Sherpa Ecosystem</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Sherpa Marketplace', status: 'LIVE', color: 'text-[#00a9e0] bg-[#00a9e0]/10', desc: 'Post jobs, get matched with licensed pros, track progress, pay with marketplace payment protection.' },
              { name: 'Sherpa Success Manager', status: 'LIVE', color: 'text-violet-700 bg-violet-100', desc: 'Dedicated human account manager. Project oversight + dispute resolution. Active now.' },
              { name: 'Sherpa Hub', status: 'SOON', color: 'text-amber-700 bg-amber-100', desc: 'Supply kits, tool rental, and trade training at physical locations.' },
              { name: 'Sherpa Home', status: 'SOON', color: 'text-emerald-700 bg-emerald-100', desc: 'Homeowner subscription with priority matching and discounted rates.' },
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

        {/* Founding PM perks */}
        <div className="mt-8 rounded-xl border-2 border-[#ff4500]/30 bg-gradient-to-br from-[#ff4500]/[0.06] to-[#00a9e0]/[0.04] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Founding PM perks</h2>
          <p className="mt-1 text-xs text-zinc-500">Three commercial PM seats. What you get that later joiners don&apos;t.</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>Free Sherpa Home for life</strong> across every unit you manage &mdash; priority matching + discounted rates when it launches.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>&ldquo;Founding PM&rdquo; badge</strong> on your account, visible to vendors bidding your work.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>Direct line to Phyrom</strong> (founder, working NH GC) &mdash; text/WhatsApp for support.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>Wefunder pre-allocation</strong> when the community round opens.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>White-glove portfolio migration</strong> &mdash; we move your vendor list and active work orders for you.</span></li>
            <li className="flex gap-2"><span className="text-[#ff4500]">&rarr;</span><span><strong>Sherpa Success Manager from day one</strong> (paid tier for late joiners).</span></li>
          </ul>
        </div>

        {/* How to get in */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/20 bg-[#00a9e0]/[0.03] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to get in</h2>
          <p className="mt-1 text-xs text-zinc-500">Most PMs work from desktop. Mobile is there when you&apos;re on-site.</p>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">1</div>
              <p className="pt-0.5 text-sm font-medium text-zinc-800">Visit www.thesherpapros.com/sign-in</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">2</div>
              <p className="pt-0.5 text-sm font-medium text-zinc-800">Sign in with your invited email</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">3</div>
              <p className="pt-0.5 text-sm font-medium text-zinc-800">Pick the Property Manager role &mdash; setup is ~30 seconds</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">4</div>
              <p className="pt-0.5 text-sm font-medium text-zinc-800">Optional: install mobile app at /install (TestFlight for iPhone, PWA for Android)</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">FAQ</h2>
          <div className="mt-3 space-y-3">
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">Does this replace AppFolio or Buildium?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">No. Keep your tenant-management system. Sherpa Pros handles trade work and vendor coordination. We sync to QuickBooks Online for AP.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">How do I import my existing vendor list?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">CSV import on day one. We&apos;ll do a white-glove migration with you during beta &mdash; bring a spreadsheet, leave with vendors live.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">What if my preferred vendor isn&apos;t on Sherpa?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">Invite them. We onboard licensed trades within 24 hours. They keep their pricing, you keep payment protection.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">How do I bill my owners?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">Per-property cost tracking rolls up to owner statements. Export 1099-ready reports for your accountant. NOI views built in.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">What does &ldquo;payment protection&rdquo; actually mean?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">Funds hold in Stripe Connect until milestones pass inspection. If work fails, your Sherpa Success Manager runs the dispute. You don&apos;t pay for bad work.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">How early is &ldquo;early&rdquo;?</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">Closed beta. Three commercial PMs. We&apos;re honest about it &mdash; your feedback shapes what ships next quarter.</p>
            </div>
          </div>
        </div>

        {/* What we need back */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need back from you</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <li>&bull; Feedback on finance views &mdash; are the numbers you need front and center?</li>
            <li>&bull; Maintenance workflow &mdash; does the kanban + schedule approach match how you actually work?</li>
            <li>&bull; Missing features &mdash; what would make you switch from your current tool?</li>
            <li>&bull; Anything confusing &mdash; where did you pause or wonder &ldquo;what does this do?&rdquo;</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center print:mt-4 print:pt-4">
          <p className="text-sm text-zinc-600">Questions? Reach us directly:</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">info@thesherpapros.com</p>
          <p className="mt-4 text-xs text-zinc-400">&copy; 2026 Sherpa Pros &bull; www.thesherpapros.com</p>
        </div>

        {/* Actions (hidden on print) */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <PrintButton />
          <Link href="/install" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md">
            Install mobile app
          </Link>
          <Link href="/sign-in" className="inline-flex items-center gap-2 rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md">
            Sign in now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
