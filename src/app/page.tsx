import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import HeroTagline from '@/components/splash/HeroTagline';
import WaitlistForm from '@/components/splash/WaitlistForm';
import ZipCapture from '@/components/splash/ZipCapture';
import ScrollFadeIn from '@/components/splash/ScrollFadeIn';

export const metadata: Metadata = {
  title: 'Sherpa Pros — Coming to Your Area Soon',
  description:
    'The licensed-trade marketplace that thinks like a contractor. Verified pros, transparent pricing, real reviews. Join the waitlist.',
};

/* ─── SVG Icons (inline, no external deps) ─── */

function HomeIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.42 5.42a2.121 2.121 0 01-3-3l5.42-5.42m0 0a7.5 7.5 0 119.316-9.316 2.25 2.25 0 01-2.783 2.783 7.5 7.5 0 01-9.316 9.316z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}

/* ─── Social Icons ─── */

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Splash Page — the public teaser at thesherpapros.com
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function SplashPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-[#00a9e0]/30">
      {/* ── Animated background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Slow-drifting gradient orbs */}
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#00a9e0]/[0.07] blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#ff4500]/[0.05] blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ━━━ SECTION 1: Hero ━━━ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex justify-center">
            <Logo size="xl" />
          </div>

          <HeroTagline />

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Verified pros. Transparent pricing. Real reviews. Coming to your area soon.
          </p>

          <div className="mt-10">
            <WaitlistForm />
          </div>

          <p className="mt-6 text-sm text-white/30">
            Be the first to know when we launch in your area
          </p>
          <Link
            href="/sign-in"
            className="mt-3 inline-block text-sm text-[#00a9e0]/60 transition-colors hover:text-[#00a9e0]"
          >
            Already have access? Sign in &rarr;
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="h-6 w-6 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ━━━ SECTION 2: Value Props ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#00a9e0]">
                Built for everyone in the trade
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                One platform. Three wins.
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            <ScrollFadeIn delay={0}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#00a9e0]/20 hover:bg-white/[0.05]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00a9e0]/10 text-[#00a9e0] transition-colors duration-300 group-hover:bg-[#00a9e0]/20">
                  <HomeIcon />
                </div>
                <h3 className="mb-3 text-xl font-semibold">For Homeowners</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Post a job. Get bids from licensed, insured pros. Pay when it is
                  done right.
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={150}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#ff4500]/20 hover:bg-white/[0.05]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff4500]/10 text-[#ff4500] transition-colors duration-300 group-hover:bg-[#ff4500]/20">
                  <WrenchIcon />
                </div>
                <h3 className="mb-3 text-xl font-semibold">For Pros</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  No lead fees. No tire-kickers. Vetted jobs from real clients who
                  are ready to hire.
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={300}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.05]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors duration-300 group-hover:bg-emerald-500/20">
                  <BuildingIcon />
                </div>
                <h3 className="mb-3 text-xl font-semibold">For Property Managers</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Manage maintenance like a Fortune 500. Track every dollar across
                  every unit.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 3: How It Works ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#00a9e0]">
                Simple by design
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                icon: <ClipboardIcon />,
                title: 'Post the job',
                desc: 'Describe the work in plain words. A few photos help. Free, no card required.',
              },
              {
                step: '2',
                icon: <ChatIcon />,
                title: 'Get bids',
                desc: 'Licensed local pros bid on your job, usually inside a day. Each bid shows license, insurance, and scope.',
              },
              {
                step: '3',
                icon: <CheckBadgeIcon />,
                title: 'Pick your pro',
                desc: 'Choose the pro you trust. Pay through the platform when the work is done. Rate the job.',
              },
            ].map((item, i) => (
              <ScrollFadeIn key={item.step} delay={i * 150}>
                <div className="group relative text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/40 transition-all duration-300 group-hover:border-[#00a9e0]/30 group-hover:text-[#00a9e0]">
                    {item.icon}
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00a9e0]/60">
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/45">
                    {item.desc}
                  </p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 4: Zip Capture ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-md text-center">
          <ScrollFadeIn>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Launching soon in your area
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Enter your zip code and we will let you know when Sherpa Pros is available near you.
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={150}>
            <div className="mt-8">
              <ZipCapture />
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ━━━ SECTION 5: The Problem → What If ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/40">
                Sound familiar?
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                The trade industry has a trust problem
              </h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            <ScrollFadeIn delay={0}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                {/* The problem */}
                <div className="mb-6">
                  <div className="mb-3 text-2xl">&#x1f62e;&#x200d;&#x1f4a8;</div>
                  <h3 className="mb-2 text-lg font-semibold text-white/70">Pros pay to compete</h3>
                  <p className="text-sm leading-relaxed text-white/40">
                    On the big platforms, pros pay $15&ndash;$100+ per lead &mdash; even when the homeowner
                    never picks up the phone. The best pros stop bidding. The desperate ones raise prices.
                  </p>
                </div>
                {/* The what-if */}
                <div className="mt-auto rounded-xl border border-[#00a9e0]/15 bg-[#00a9e0]/[0.04] p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00a9e0]/70">What if there was a better way?</p>
                  <p className="text-sm leading-relaxed text-white/60">
                    Sherpa Pros never charges for leads. Pros only pay a small service fee when the job is
                    completed and the client pays. No upfront cost. No wasted bids. Better pros show up.
                  </p>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={150}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                {/* The problem */}
                <div className="mb-6">
                  <div className="mb-3 text-2xl">&#x1f3b0;</div>
                  <h3 className="mb-2 text-lg font-semibold text-white/70">Quotes are a guessing game</h3>
                  <p className="text-sm leading-relaxed text-white/40">
                    You get three quotes and they are all different. Different scopes, different line items,
                    no way to tell who is padding and who forgot something. Nobody checks the numbers. You just pick and hope.
                  </p>
                </div>
                {/* The what-if */}
                <div className="mt-auto rounded-xl border border-[#00a9e0]/15 bg-[#00a9e0]/[0.04] p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00a9e0]/70">If only it could do this&hellip;</p>
                  <p className="text-sm leading-relaxed text-white/60">
                    Every Sherpa quote is validated against local building codes and market pricing
                    before it reaches your inbox. You see the right scope, the right number, the first time.
                  </p>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={300}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                {/* The problem */}
                <div className="mb-6">
                  <div className="mb-3 text-2xl">&#x1f6a8;</div>
                  <h3 className="mb-2 text-lg font-semibold text-white/70">You pay and pray</h3>
                  <p className="text-sm leading-relaxed text-white/40">
                    On most platforms, you send money directly to the contractor and hope for the best.
                    If they disappear mid-job or cut corners, getting your money back is your problem.
                  </p>
                </div>
                {/* The what-if */}
                <div className="mt-auto rounded-xl border border-[#00a9e0]/15 bg-[#00a9e0]/[0.04] p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00a9e0]/70">There is a better way.</p>
                  <p className="text-sm leading-relaxed text-white/60">
                    Sherpa holds your payment in escrow until the work passes inspection. The pro gets paid
                    when the job is done right. If something is wrong, your money stays protected.
                  </p>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 6: The Sherpa Ecosystem ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#00a9e0]">
                More than a marketplace
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                The Sherpa Ecosystem
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
                Four pillars designed to support every side of the trade.
              </p>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-6 sm:grid-cols-2">
            <ScrollFadeIn delay={0}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[#00a9e0]/15 bg-white/[0.03] p-8 transition-all duration-300 hover:border-[#00a9e0]/30 hover:bg-white/[0.05]">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-[#00a9e0]/60">Live</div>
                <h3 className="mb-2 text-xl font-semibold">Sherpa Marketplace</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  The smart marketplace for trade work. Post a job, get matched with licensed pros,
                  track progress in real time, and pay through escrow. Available on web and mobile.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#00a9e0]/10 px-3 py-1 text-[10px] font-semibold text-[#00a9e0]">On-demand dispatch</span>
                  <span className="rounded-full bg-[#00a9e0]/10 px-3 py-1 text-[10px] font-semibold text-[#00a9e0]">Real-time tracking</span>
                  <span className="rounded-full bg-[#00a9e0]/10 px-3 py-1 text-[10px] font-semibold text-[#00a9e0]">Escrow payments</span>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={150}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-amber-500/15 bg-white/[0.03] p-8 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.05]">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-400/60">Coming Soon</div>
                <h3 className="mb-2 text-xl font-semibold">Sherpa Hub</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Physical locations where pros pick up pre-built supply kits, rent professional equipment
                  (Festool, Hilti, Milwaukee), get manufacturer training, and grab branded gear.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold text-amber-400">Supply kits</span>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold text-amber-400">Equipment rental</span>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold text-amber-400">Training center</span>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={300}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-emerald-500/15 bg-white/[0.03] p-8 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.05]">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400/60">Coming Soon</div>
                <h3 className="mb-2 text-xl font-semibold">Sherpa Home</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  A subscription for homeowners and property managers. Members get discounted service rates,
                  priority matching with top-tier pros, faster SLAs, and exclusive seasonal maintenance packages.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">Discounted rates</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">Priority matching</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">Faster SLAs</span>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={450}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-violet-500/15 bg-white/[0.03] p-8 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-violet-400/60">Coming Soon</div>
                <h3 className="mb-2 text-xl font-semibold">Sherpa Success Manager</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Your dedicated account manager. Not a chatbot &mdash; a real person who manages your projects,
                  handles vendor coordination, resolves disputes, and makes sure every job finishes on time and on budget.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-400">Dedicated manager</span>
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-400">Project oversight</span>
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-400">Dispute resolution</span>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 6: Footer ━━━ */}
      <footer className="relative border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col items-center sm:items-start">
              <Logo size="md" />
              <p className="mt-3 max-w-xs text-center text-sm text-white/30 sm:text-left">
                The licensed-trade marketplace that thinks like a contractor.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              <Link href="/about" className="text-white/40 transition-colors hover:text-white/70">
                About
              </Link>
              <Link href="/invite" className="text-white/40 transition-colors hover:text-white/70">
                Beta Invite
              </Link>
              <a
                href="mailto:info@thesherpapros.com"
                className="text-white/40 transition-colors hover:text-white/70"
              >
                Contact
              </a>
            </nav>

            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition-all hover:border-white/20 hover:text-white/60"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition-all hover:border-white/20 hover:text-white/60"
              >
                <LinkedInIcon />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition-all hover:border-white/20 hover:text-white/60"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
            <p className="text-xs text-white/20">
              &copy; 2026 Sherpa Pros. All rights reserved.
            </p>
            <span className="text-xs text-white/20">
              Built by a working general contractor.
            </span>
          </div>
        </div>
      </footer>

      {/* CSS-only animation keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes drift {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(30px, -20px); }
              50% { transform: translate(-20px, 30px); }
              75% { transform: translate(20px, 20px); }
            }
            @keyframes glow-pulse {
              0%, 100% { opacity: 0; }
              50% { opacity: 0.6; }
            }
          `,
        }}
      />
    </div>
  );
}
