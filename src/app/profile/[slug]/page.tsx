import type { Metadata } from 'next';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Profile Data                                                   */
/* ------------------------------------------------------------------ */

interface PublicProfile {
  slug: string;
  type: 'pro' | 'pm' | 'client';
  name: string;
  headline: string;
  location: string;
  rating: number;
  reviewCount: number;
  avatar: string | null;
  initials: string;
  verified: boolean;
  badges: string[];
  bio: string;
  specialties: string[];
  // Pro-specific
  portfolio?: { title: string; image: string }[];
  // PM-specific
  properties?: { name: string; units: number; occupancy: number }[];
  financials?: { noi: string; occupancy: string; margin: string };
  services?: string[];
  team?: { name: string; role: string; initials: string }[];
  // Client-specific
  propertiesOwned?: { name: string; address: string; pm: string }[];
  reviews: { name: string; rating: number; text: string; date: string }[];
}

const PROFILES: Record<string, PublicProfile> = {
  'mike-rodriguez': {
    slug: 'mike-rodriguez',
    type: 'pro',
    name: 'Mike Rodriguez',
    headline: 'Licensed Master Plumber -- 15 Years Experience',
    location: 'Portsmouth, NH',
    rating: 4.9,
    reviewCount: 142,
    avatar: null,
    initials: 'MR',
    verified: true,
    badges: ['Licensed', 'Insured', 'Background Checked'],
    bio: 'Licensed master plumber with 15 years experience specializing in residential and light commercial plumbing throughout the Seacoast area. Emergency services available 24/7.',
    specialties: ['Residential Plumbing', 'Water Heater Install', 'Emergency Repairs', 'Fixture Replacement', 'Drain Cleaning'],
    portfolio: [
      { title: 'Kitchen Remodel Plumbing', image: 'https://images.unsplash.com/photo-1585128903994-9788298932a4?w=400&h=300&fit=crop' },
      { title: 'Bathroom Rough-in', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop' },
      { title: 'Water Heater Install', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop' },
    ],
    reviews: [
      { name: 'Sarah K.', rating: 5, text: 'Mike fixed our burst pipe in under 2 hours on a Sunday. Professional and fair pricing.', date: 'Mar 2026' },
      { name: 'David T.', rating: 5, text: 'Best plumber in the area. Clean work, on time, and explains everything clearly.', date: 'Feb 2026' },
      { name: 'Jennifer L.', rating: 4, text: 'Great work on our bathroom remodel. Would hire again.', date: 'Jan 2026' },
    ],
  },
  'seacoast-pm': {
    slug: 'seacoast-pm',
    type: 'pm',
    name: 'Seacoast Property Management LLC',
    headline: 'Managing 123 units across Greater Portsmouth since 2019',
    location: 'Portsmouth, NH',
    rating: 4.8,
    reviewCount: 28,
    avatar: null,
    initials: 'SP',
    verified: true,
    badges: ['Licensed PM', 'Insured', 'BBB A+'],
    bio: 'Full-service property management company serving the NH Seacoast region. We specialize in multi-family, mixed-use, and student housing with a focus on maximizing NOI and tenant retention.',
    specialties: [],
    properties: [
      { name: 'Maple Ridge Apartments', units: 48, occupancy: 94 },
      { name: '220 Main St Mixed-Use', units: 15, occupancy: 87 },
      { name: 'Harbor View Condos', units: 24, occupancy: 100 },
      { name: 'Elm Street Student Housing', units: 36, occupancy: 92 },
    ],
    financials: { noi: '$114K/mo', occupancy: '91.1%', margin: '61%' },
    services: ['Tenant Placement', 'Rent Collection', 'Maintenance Coordination', 'Financial Reporting', 'Lease Management', 'Eviction Services', 'Capital Project Oversight'],
    team: [
      { name: 'Sarah Park', role: 'Portfolio Manager', initials: 'SP' },
      { name: 'Tom Rivera', role: 'Maintenance Coordinator', initials: 'TR' },
    ],
    reviews: [
      { name: 'David Thornton', rating: 5, text: 'Seacoast PM increased our NOI by 15% in the first year. Their maintenance coordination is top-notch.', date: 'Mar 2026' },
      { name: 'Jennifer Liu', rating: 5, text: 'Finally a PM company that actually communicates. Monthly reports are thorough and vendor pricing is transparent.', date: 'Jan 2026' },
      { name: 'Robert Sinclair', rating: 4, text: 'Great job managing our mixed-use building. The commercial and residential coordination is complex but they handle it well.', date: 'Dec 2025' },
    ],
  },
  'phyrom-oum': {
    slug: 'phyrom-oum',
    type: 'client',
    name: 'Phyrom Oum',
    headline: 'Property Owner -- Greater Portsmouth',
    location: 'Portsmouth, NH',
    rating: 0,
    reviewCount: 0,
    avatar: null,
    initials: 'PO',
    verified: true,
    badges: ['Verified Owner'],
    bio: 'Property owner in the Greater Portsmouth area. Focused on quality renovations and long-term property value.',
    specialties: [],
    propertiesOwned: [
      { name: 'Coastal Duplex', address: '14 Harbor Rd, Portsmouth, NH', pm: 'Seacoast PM' },
      { name: 'Downtown Studio Building', address: '88 Congress St, Portsmouth, NH', pm: 'Self-managed' },
    ],
    reviews: [],
  },
};

/* ------------------------------------------------------------------ */
/* SEO Metadata                                                        */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = PROFILES[slug];
  if (!profile) {
    return { title: 'Profile Not Found' };
  }
  return {
    title: `${profile.name} | Sherpa Pros`,
    description: profile.bio.slice(0, 160),
    openGraph: {
      title: profile.name,
      description: profile.headline,
      type: 'profile',
    },
  };
}

/* ------------------------------------------------------------------ */
/* Star Rating                                                         */
/* ------------------------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page (Server Component -- SEO optimized)                            */
/* ------------------------------------------------------------------ */

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = PROFILES[slug];

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Profile Not Found</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">The profile you are looking for does not exist.</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-[#00a9e0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0090c0]">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    pro: 'Service Professional',
    pm: 'Property Management Company',
    client: 'Property Owner',
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00a9e0]">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">Sherpa Pros</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0090c0]"
          >
            Join Sherpa Pros
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Profile Header                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#00a9e0]/10 text-2xl font-bold text-[#00a9e0]">
              {profile.initials}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{profile.name}</h1>
                {profile.verified && (
                  <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-label="Verified">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                )}
              </div>
              <p className="mt-0.5 text-sm text-[#00a9e0] font-medium">{roleLabel[profile.type]}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{profile.headline}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</p>

              {profile.rating > 0 && (
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <Stars rating={profile.rating} />
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {profile.rating} ({profile.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                className="rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
              >
                {profile.type === 'pro' ? 'Request Quote' : profile.type === 'pm' ? 'Contact' : 'Message'}
              </button>
              <button
                type="button"
                className="rounded-lg border border-[#00a9e0]/30 px-6 py-2.5 text-sm font-semibold text-[#00a9e0] transition-colors hover:bg-[#00a9e0]/5"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* About                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{profile.bio}</p>
          {profile.specialties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.specialties.map((sp) => (
                <span key={sp} className="rounded-full bg-[#00a9e0]/10 px-3 py-1 text-xs font-medium text-[#00a9e0]">{sp}</span>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Pro-specific: Portfolio                                          */}
        {/* ---------------------------------------------------------------- */}
        {profile.type === 'pro' && profile.portfolio && profile.portfolio.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profile.portfolio.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
                  <p className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* PM-specific: Portfolio + Financials + Services + Team            */}
        {/* ---------------------------------------------------------------- */}
        {profile.type === 'pm' && (
          <>
            {profile.properties && profile.properties.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Properties Managed</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.properties.map((p) => (
                    <div key={p.name} className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{p.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{p.units} units</span>
                        <span className={`font-semibold ${p.occupancy >= 95 ? 'text-emerald-600' : 'text-[#00a9e0]'}`}>
                          {p.occupancy}% occupied
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.financials && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/5 dark:to-zinc-900">
                <h2 className="mb-3 text-base font-bold text-zinc-900 dark:text-white">Performance</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Portfolio NOI</p>
                    <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{profile.financials.noi}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Occupancy</p>
                    <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{profile.financials.occupancy}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">NOI Margin</p>
                    <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{profile.financials.margin}</p>
                  </div>
                </div>
              </div>
            )}

            {profile.services && profile.services.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-base font-bold text-zinc-900 dark:text-white">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((s) => (
                    <span key={s} className="rounded-full bg-[#00a9e0]/10 px-3 py-1 text-xs font-medium text-[#00a9e0]">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.team && profile.team.length > 0 && (
              <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-3 text-base font-bold text-zinc-900 dark:text-white">Team</h2>
                <div className="flex flex-wrap gap-4">
                  {profile.team.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a9e0]/10 text-xs font-bold text-[#00a9e0]">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Client-specific: Properties Owned                                */}
        {/* ---------------------------------------------------------------- */}
        {profile.type === 'client' && profile.propertiesOwned && profile.propertiesOwned.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Properties Owned</h2>
            <div className="space-y-3">
              {profile.propertiesOwned.map((p) => (
                <div key={p.name} className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{p.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{p.address}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Managed by: <span className="font-medium text-[#00a9e0]">{p.pm}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Reviews                                                          */}
        {/* ---------------------------------------------------------------- */}
        {profile.reviews.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-white">Reviews</h2>
            <div className="space-y-4">
              {profile.reviews.map((review, i) => (
                <div key={i} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800">
                  <Stars rating={review.rating} />
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">&ldquo;{review.text}&rdquo;</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold">{review.name}</span> &middot; {review.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pb-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Sherpa Pros &middot; Construction marketplace for verified professionals
        </div>
      </main>
    </div>
  );
}
