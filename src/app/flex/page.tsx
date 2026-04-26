import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import ScrollFadeIn from '@/components/splash/ScrollFadeIn';

export const metadata: Metadata = {
  title: 'Sherpa Flex — Side-Hustle Friendly Trade Work',
  description:
    'No LLC? No insurance? No problem. Sherpa Flex gives you per-project coverage so you can earn on your terms.',
};

/* ─── SVG Icons ─── */

function ShieldIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function BanknotesIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

/* Feature grid icons */
function MiniShieldIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function MiniStarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function MiniGiftIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function MiniChatIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function MiniLockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function MiniCalculatorIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H18v-.008zm0 2.25h.008v.008H18V13.5zM9.75 9h4.5V6.75a2.25 2.25 0 00-4.5 0V9z" />
    </svg>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Sherpa Flex — Side-hustle landing page
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function FlexPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-[#00a9e0]/30">
      {/* ── Animated background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#ff4500]/[0.07] blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#00a9e0]/[0.05] blur-[120px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm text-white/40 transition-colors hover:text-white/70">
          &larr; Back to Sherpa Pros
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg bg-[#ff4500] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e03e00] hover:shadow-md"
        >
          Join the Waitlist
        </Link>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex justify-center">
            <Logo size="xl" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff4500]/30 bg-[#ff4500]/10 px-4 py-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">Sherpa Flex</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Do work on the side?{' '}
            <span className="bg-gradient-to-r from-[#ff4500] to-[#ff6b35] bg-clip-text text-transparent">
              We&apos;ve got you covered.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
            No LLC? No insurance? No problem. Sherpa Flex gives you per-project coverage so you can earn on your terms.
          </p>

          <div className="mt-10">
            <Link
              href="/sign-up"
              className="inline-flex rounded-xl bg-[#ff4500] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#ff4500]/20 transition-all hover:bg-[#e03e00] hover:shadow-xl hover:shadow-[#ff4500]/30"
            >
              Join the Waitlist
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/30">
            Background check required. Jobs under $5K.
          </p>
        </div>
      </section>

      {/* ━━━ SECTION 1: What is Sherpa Flex? ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollFadeIn>
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#ff4500]">
                The side-hustle tier
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">What is Sherpa Flex?</h2>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn delay={150}>
            <div className="rounded-2xl border border-[#ff4500]/15 bg-white/[0.03] p-8 sm:p-10">
              <div className="grid gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#ff4500]">18%</p>
                  <p className="mt-2 text-sm font-medium text-white/70">Service fee</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    Includes per-project liability insurance. $1M coverage on every job.
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#ff4500]">$0</p>
                  <p className="mt-2 text-sm font-medium text-white/70">LLC required</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    No business entity needed. Work as an individual with full platform protection.
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#ff4500]">&lt;$5K</p>
                  <p className="mt-2 text-sm font-medium text-white/70">Job cap</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    Designed for smaller projects. Background check required for all Flex pros.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ━━━ SECTION 2: Who it's for ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#ff4500]">
                Made for you
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">Who is Sherpa Flex for?</h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'The Weekend Warrior',
                desc: 'Full-time job, trades skills on the side. You know your way around a jobsite but don\'t carry your own insurance.',
                color: 'text-[#ff4500] bg-[#ff4500]/10 border-[#ff4500]/15 hover:border-[#ff4500]/30',
                iconColor: 'bg-[#ff4500]/10 text-[#ff4500] group-hover:bg-[#ff4500]/20',
              },
              {
                title: 'Between Jobs',
                desc: 'Skilled tradesperson looking for steady work. Keep earning while you find your next full-time gig.',
                color: 'text-[#00a9e0] bg-[#00a9e0]/10 border-[#00a9e0]/15 hover:border-[#00a9e0]/30',
                iconColor: 'bg-[#00a9e0]/10 text-[#00a9e0] group-hover:bg-[#00a9e0]/20',
              },
              {
                title: 'The Retiree',
                desc: 'Years of experience, flexible schedule. Take the jobs you want, when you want, with zero overhead.',
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15 hover:border-emerald-500/30',
                iconColor: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
              },
              {
                title: 'The Side Hustler',
                desc: 'Handyman who wants more clients. Stop relying on word-of-mouth and get matched with real jobs.',
                color: 'text-violet-400 bg-violet-500/10 border-violet-500/15 hover:border-violet-500/30',
                iconColor: 'bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20',
              },
            ].map((persona, i) => (
              <ScrollFadeIn key={persona.title} delay={i * 100}>
                <div className={`group relative h-full overflow-hidden rounded-2xl border bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] ${persona.color}`}>
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 ${persona.iconColor}`}>
                    <UserCheckIcon />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{persona.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{persona.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 3: How it works ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#ff4500]">
                Simple by design
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-8 sm:grid-cols-4">
            {[
              {
                step: '1',
                icon: <ShieldIcon />,
                title: 'Apply',
                desc: 'Fill out a quick application. No LLC or insurance needed.',
              },
              {
                step: '2',
                icon: <CameraIcon />,
                title: 'Verify',
                desc: 'Upload work photos, provide references, pass a background check.',
              },
              {
                step: '3',
                icon: <BoltIcon />,
                title: 'Get Matched',
                desc: 'We match you with jobs in your area that fit your skills.',
              },
              {
                step: '4',
                icon: <BanknotesIcon />,
                title: 'Get Paid',
                desc: 'Complete the work, get paid through the platform. Insurance included.',
              },
            ].map((item, i) => (
              <ScrollFadeIn key={item.step} delay={i * 100}>
                <div className="group relative text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/40 transition-all duration-300 group-hover:border-[#ff4500]/30 group-hover:text-[#ff4500]">
                    {item.icon}
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#ff4500]/60">
                    Step {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/45">{item.desc}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 4: What's included ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <ScrollFadeIn>
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#ff4500]">
                Everything you need
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">What&apos;s included</h2>
            </div>
          </ScrollFadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <MiniShieldIcon />, title: 'Per-Project Insurance', desc: '$1M liability coverage on every job. No personal policy needed.' },
              { icon: <MiniStarIcon />, title: 'Sherpa Score', desc: 'Build your reputation with a quality score that follows you across the platform.' },
              { icon: <MiniGiftIcon />, title: 'Rewards Program', desc: 'Earn points on every job. Redeem for tools, gear, and gift cards.' },
              { icon: <MiniChatIcon />, title: 'In-App Messaging', desc: 'Chat with clients directly. Synced to SMS so nothing gets missed.' },
              { icon: <MiniLockIcon />, title: 'Payment Protection', desc: 'Payments held in escrow until the work is verified and approved.' },
              { icon: <MiniCalculatorIcon />, title: 'Tax Tools', desc: 'Track expenses, mileage, and quarterly estimates. 1099-ready at year end.' },
            ].map((feature, i) => (
              <ScrollFadeIn key={feature.title} delay={i * 75}>
                <div className="group flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff4500]/10 text-[#ff4500] transition-colors duration-300 group-hover:bg-[#ff4500]/20">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">{feature.desc}</p>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 5: Upgrade path ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollFadeIn>
            <div className="overflow-hidden rounded-2xl border border-[#00a9e0]/20 bg-gradient-to-br from-[#00a9e0]/[0.08] to-transparent p-8 sm:p-12">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00a9e0]/10 text-[#00a9e0]">
                <ArrowUpIcon />
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">Ready to go full-time?</h2>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                Upgrade to Standard Pro when you get your own insurance and LLC. Drop your service fee from 18% to 12%.
                Your Sherpa Score, reviews, and job history all carry over. No starting from scratch.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 rounded-xl border border-[#ff4500]/20 bg-[#ff4500]/[0.06] p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ff4500]/70">Flex</p>
                  <p className="mt-2 text-3xl font-bold text-[#ff4500]">18%</p>
                  <p className="mt-1 text-xs text-white/40">Insurance included</p>
                </div>
                <div className="flex items-center justify-center text-white/20">
                  <svg className="h-6 w-6 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <div className="flex-1 rounded-xl border border-[#00a9e0]/20 bg-[#00a9e0]/[0.06] p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#00a9e0]/70">Standard Pro</p>
                  <p className="mt-2 text-3xl font-bold text-[#00a9e0]">12%</p>
                  <p className="mt-1 text-xs text-white/40">Bring your own insurance</p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ━━━ SECTION 6: CTA ━━━ */}
      <section className="relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to earn on your terms?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
              Join the waitlist and be the first to know when Sherpa Flex launches in your area.
            </p>
            <div className="mt-10">
              <Link
                href="/sign-up"
                className="inline-flex rounded-xl bg-[#ff4500] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-[#ff4500]/20 transition-all hover:bg-[#e03e00] hover:shadow-xl hover:shadow-[#ff4500]/30"
              >
                Join the Waitlist
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/30">
              Background check required. No upfront cost.
            </p>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="relative border-t border-white/[0.06] px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Logo size="md" />
            <nav className="flex gap-6 text-sm">
              <Link href="/" className="text-white/40 transition-colors hover:text-white/70">Home</Link>
              <Link href="/about" className="text-white/40 transition-colors hover:text-white/70">About</Link>
              <a href="mailto:info@thesherpapros.com" className="text-white/40 transition-colors hover:text-white/70">Contact</a>
            </nav>
          </div>
          <div className="mt-8 border-t border-white/[0.06] pt-6 text-center">
            <p className="text-xs text-white/20">&copy; 2026 Sherpa Pros. All rights reserved.</p>
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
          `,
        }}
      />
    </div>
  );
}
