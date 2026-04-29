import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import PrintButton from '../PrintButton';

export const metadata: Metadata = {
  title: 'Pro Beta Invite — Sherpa Pros',
  description: 'Closed beta invite for trade professionals. Zero lead fees. Get paid when the work passes.',
};

export default function ProInvitePage() {
  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="mx-auto max-w-[700px] px-6 py-12 print:py-6 print:px-4">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 print:pb-4">
          <Logo size="lg" />
          <div className="text-right">
            <p className="text-sm font-semibold text-[#00a9e0]">Beta Invite</p>
            <p className="text-xs text-zinc-400">Trade Professionals</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 print:mt-4">
          <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl print:text-2xl">
            Stop paying for leads that ghost.
            <br />
            <span className="text-[#00a9e0]">Get paid when the work passes.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Sherpa Pros is a closed-beta marketplace built by a working NH GC for the people
            doing the work. Zero lead fees. Clients pay before you start. You keep your reputation
            instead of renting it. Trade work, done right.
          </p>
        </div>

        {/* Why this is different */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Why this isn&apos;t Angi or Thumbtack</h2>
          <ul className="mt-3 space-y-3 text-sm text-zinc-700">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">No lead fees, ever.</strong> You don&apos;t pay $35 because someone clicked your name and never picked up. You earn when the homeowner pays.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">No bidding wars with lowballers.</strong> Quotes get code-checked before they hit the client, so the cheapest guess doesn&apos;t automatically win.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Money is held before you swing a hammer.</strong> Clients fund the job up front through marketplace payment protection. You don&apos;t chase invoices.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Disputes go to a human.</strong> A Sherpa Success Manager (real person, US-based) handles it &mdash; not a chatbot, not a 1099 reviewer in another country.</span>
            </li>
          </ul>
        </div>

        {/* What you'll get */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What you get in the app</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Sherpa Marketplace', desc: 'Vetted jobs in your service area. Filter by trade, distance, budget.' },
              { name: 'Code-Verified Quotes', desc: 'Submit quotes that auto-check against local code. Wins client trust before the bid war starts.' },
              { name: 'Marketplace Payment Protection', desc: 'Client funds the job before kickoff. Money releases when milestones pass inspection.' },
              { name: 'Materials Dispatch', desc: 'Order materials from inside the job. Skip the supply-house run.' },
              { name: 'Sherpa Success Manager', desc: 'Real human handles disputes, no-shows, and payment hiccups.' },
              { name: 'Sherpa Score', desc: '12-metric quality rating that grows with every clean job. Portable, yours forever.' },
              { name: 'Smart Scan OCR', desc: 'Snap a receipt, expense logged. Materials, gas, parking — all categorized.' },
              { name: 'Finance Hub', desc: '1099-ready exports for you or your bookkeeper at year end.' },
            ].map((f) => (
              <div key={f.name} className="rounded-lg border border-zinc-200 bg-white p-3">
                <p className="text-xs font-bold text-[#00a9e0]">{f.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founding Pro perks */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/30 bg-[#00a9e0]/[0.04] p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Founding Pro perks (beta only)</h2>
          <p className="mt-2 text-xs text-zinc-500">You&apos;re one of the first 10 Pros in. Later joiners don&apos;t get this.</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Free Sherpa Home for life.</strong> The homeowner subscription, on the house, forever.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">&ldquo;Founding Pro&rdquo; badge on your profile.</strong> Permanent trust marker that clients can see.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Lifetime 0% lead fees.</strong> Standard pricing is 0% lead fees too &mdash; you&apos;re locked in even if that ever changes.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">First crack at Sherpa Hub rentals.</strong> Equipment and tool-rental discounts when the first physical locations open.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Direct line to Phyrom (founder).</strong> Text or WhatsApp. He&apos;s a working NH GC. Tell him what&apos;s broken.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a9e0]"></span>
              <span><strong className="text-zinc-900">Wefunder pre-allocation.</strong> When the community round opens, Founding Pros get a slot before it goes public.</span>
            </li>
          </ul>
        </div>

        {/* Sherpa Flex callout */}
        <div className="mt-8 rounded-xl border-2 border-orange-200 bg-orange-50 p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">No insurance? No LLC? Try Sherpa Flex.</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Side-hustle tier for handymen, retired tradespeople, and skilled folks who don&apos;t carry full
            commercial coverage. Per-project liability insurance is bundled in. 18% covers everything &mdash;
            insurance, payment protection, dispute support. Background check required. Jobs under $5K.
            Build your Sherpa Score and graduate to Standard Pro when you&apos;re ready.
          </p>
          <div className="mt-4 print:hidden">
            <Link
              href="/flex"
              className="inline-flex items-center gap-1 rounded-lg bg-[#ff4500] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e03e00] hover:shadow-md"
            >
              Learn about Sherpa Flex &rarr;
            </Link>
          </div>
        </div>

        {/* How to get in */}
        <div className="mt-8 rounded-xl border-2 border-[#00a9e0]/20 bg-white p-6 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">How to get in</h2>
          <p className="mt-2 text-xs text-zinc-500">Web works on any device. Install the mobile app for push alerts on new jobs.</p>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">1</div>
              <p className="text-sm font-medium text-zinc-800 pt-0.5">Go to www.thesherpapros.com/sign-in</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">2</div>
              <p className="text-sm font-medium text-zinc-800 pt-0.5">Sign in with the email this invite was sent to</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">3</div>
              <p className="text-sm font-medium text-zinc-800 pt-0.5">Pick &ldquo;Pro&rdquo; on the role screen, finish the 30-second setup</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a9e0] text-xs font-bold text-white">4</div>
              <p className="text-sm font-medium text-zinc-800 pt-0.5">On phone? Visit www.thesherpapros.com/install &mdash; TestFlight for iPhone, PWA install for Android</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">Honest answers</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">Will I lose my Angi or Thumbtack reviews if I switch?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">No &mdash; those stay on those platforms. You start your Sherpa Score fresh, but you can upload screenshots of past reviews to your profile and we display them as &ldquo;Verified from prior platform.&rdquo;</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">How long until my first job?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">Beta is 10 Pros and a small client pool, so be patient. Realistic first-job window is 2&ndash;4 weeks while we seed both sides. Phyrom is personally routing early jobs.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">What if a client doesn&apos;t pay?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">They already paid &mdash; the money sits in marketplace payment protection before you start. It releases on milestone completion. If a client disputes, your Sherpa Success Manager handles it. You don&apos;t chase anyone.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">Do I have to use the app, or can I just use the web?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">Web works for everything. The mobile app adds push notifications for new jobs and one-tap receipt scanning. Most Pros end up using both.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">What about Android?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">Yes &mdash; install as a PWA from www.thesherpapros.com/install. Works like a native app, gets push notifications, lives on your home screen. Native Android app is on the roadmap after beta.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm font-semibold text-zinc-900">How early is &ldquo;early&rdquo;?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">Early. Things will break. We&apos;ll fix them fast. Your feedback genuinely shapes what ships next &mdash; that&apos;s why you&apos;re here.</p>
            </div>
          </div>
        </div>

        {/* What we need back */}
        <div className="mt-8 print:mt-4">
          <h2 className="text-lg font-bold text-zinc-900">What we need back from you</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <li>&bull; Job flow &mdash; is finding and bidding on jobs straightforward?</li>
            <li>&bull; Bidding experience &mdash; does the quote builder help or slow you down?</li>
            <li>&bull; Profile setup &mdash; was it easy to add your licenses, photos, and services?</li>
            <li>&bull; Switching costs &mdash; what would make you actually drop your current platform?</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center print:mt-4 print:pt-4">
          <p className="text-sm text-zinc-600">Questions, feedback, or stuck? Reach us directly:</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">info@thesherpapros.com</p>
          <p className="mt-4 text-xs text-zinc-400">&copy; 2026 Sherpa Pros &bull; www.thesherpapros.com</p>
        </div>

        {/* Actions (hidden on print) */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <PrintButton />
          <Link href="/install" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md">
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
