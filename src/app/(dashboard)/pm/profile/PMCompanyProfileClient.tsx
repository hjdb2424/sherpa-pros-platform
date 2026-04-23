'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const company = {
  name: 'Seacoast Property Management LLC',
  tagline: 'Managing 123 units across Greater Portsmouth since 2019',
  location: 'Portsmouth, NH',
  phone: '(603) 555-0190',
  email: 'info@seacoastpm.com',
  website: 'seacoastpm.com',
  logo: null as string | null,
  badges: [
    { label: 'Licensed PM', detail: 'NH RSA 331-A' },
    { label: 'Insured', detail: '$2M Liability' },
    { label: 'BBB A+', detail: 'Since 2020' },
  ],
};

const portfolioStats = [
  { label: 'Properties', value: '4', color: 'bg-[#00a9e0]/10 text-[#00a9e0]' },
  { label: 'Total Units', value: '123', color: 'bg-[#00a9e0]/10 text-[#00a9e0]' },
  { label: 'Occupancy', value: '91.1%', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
  { label: 'Avg Tenant Rating', value: '4.6', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
];

const properties = [
  {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    type: 'Multi-Family',
    photo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
    units: 48,
    occupancy: 94,
    avgRent: 1850,
  },
  {
    id: '220-main',
    name: '220 Main St Mixed-Use',
    type: 'Mixed-Use',
    photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    units: 15,
    occupancy: 87,
    avgRent: 2100,
  },
  {
    id: 'harbor-view',
    name: 'Harbor View Condos',
    type: 'Condo',
    photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop',
    units: 24,
    occupancy: 100,
    avgRent: 2450,
  },
  {
    id: 'elm-street',
    name: 'Elm Street Student Housing',
    type: 'Student Housing',
    photo: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=250&fit=crop',
    units: 36,
    occupancy: 92,
    avgRent: 1200,
  },
];

const financials = {
  noi: '$114K/mo',
  noiMargin: '61%',
  maintenanceCost: '$47/unit/mo',
  maintenanceBenchmark: '12% below market avg',
  vendorScore: '5 preferred vendors, 94% on-time',
  budgetStatus: '3 of 4 properties under budget',
};

const team = [
  { name: 'Sarah Park', role: 'Portfolio Manager', initials: 'SP', email: 'sarah@seacoastpm.com', phone: '(603) 555-0191' },
  { name: 'Tom Rivera', role: 'Maintenance Coordinator', initials: 'TR', email: 'tom@seacoastpm.com', phone: '(603) 555-0192' },
  { name: 'Aisha Chen', role: 'Leasing Agent', initials: 'AC', email: 'aisha@seacoastpm.com', phone: '(603) 555-0193' },
  { name: 'Marcus Lee', role: 'Accounting & Reporting', initials: 'ML', email: 'marcus@seacoastpm.com', phone: '(603) 555-0194' },
];

const certifications = [
  { name: 'CPM (Certified Property Manager)', org: 'IREM', year: 2021 },
  { name: 'ARM (Accredited Residential Manager)', org: 'IREM', year: 2020 },
  { name: 'IREM Member', org: 'Institute of Real Estate Management', year: 2019 },
  { name: 'Best Property Manager 2025', org: 'Seacoast Magazine', year: 2025, isAward: true },
];

const ownerReviews = [
  {
    id: 'r1',
    name: 'David Thornton',
    rating: 5,
    text: 'Seacoast PM increased our NOI by 15% in the first year. Their maintenance coordination is top-notch and tenant retention has improved dramatically.',
    property: 'Maple Ridge Apartments',
    date: 'Mar 2026',
  },
  {
    id: 'r2',
    name: 'Jennifer Liu',
    rating: 5,
    text: 'Finally a PM company that actually communicates. Monthly reports are thorough, vendor pricing is transparent, and they proactively handle issues before I even know about them.',
    property: 'Harbor View Condos',
    date: 'Jan 2026',
  },
  {
    id: 'r3',
    name: 'Robert Sinclair',
    rating: 4,
    text: 'Great job managing our mixed-use building. The commercial and residential coordination is complex but they handle it well. Would love to see even faster turnaround on make-readies.',
    property: '220 Main St Mixed-Use',
    date: 'Dec 2025',
  },
];

const services = [
  'Tenant Placement',
  'Rent Collection',
  'Maintenance Coordination',
  'Financial Reporting',
  'Lease Management',
  'Eviction Services',
  'Capital Project Oversight',
  'Compliance & Inspections',
  'Vendor Management',
  'Make-Ready Coordination',
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'} ${className ?? ''}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PMCompanyProfileClient() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleShareProfile = () => {
    const url = `${window.location.origin}/profile/seacoast-pm`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* Header Section                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Company Logo */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-2xl border-2 border-dashed border-[#00a9e0]/30 bg-[#00a9e0]/5 lg:self-start">
            <BuildingIcon className="h-10 w-10 text-[#00a9e0]" />
          </div>

          {/* Company Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{company.name}</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{company.tagline}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 lg:justify-start">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                </svg>
                {company.location}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {company.phone}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {company.email}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                {company.website}
              </span>
            </div>

            {/* Verified Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              {company.badges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  {badge.label}
                  <span className="font-normal text-emerald-600/70 dark:text-emerald-400/60">({badge.detail})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col gap-2 self-center lg:self-start">
            <button
              type="button"
              className="rounded-lg bg-[#00a9e0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
            >
              Edit Company Info
            </button>
            <button
              type="button"
              onClick={handleShareProfile}
              className="rounded-lg border border-[#00a9e0]/30 px-5 py-2.5 text-sm font-semibold text-[#00a9e0] transition-colors hover:bg-[#00a9e0]/5"
            >
              {copiedUrl ? 'Copied!' : 'Share Public Profile'}
            </button>
            <Link
              href="/profile/seacoast-pm"
              className="text-center text-xs font-medium text-zinc-500 transition-colors hover:text-[#00a9e0] dark:text-zinc-400"
            >
              View Public Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Portfolio Stats                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {portfolioStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Property Cards Grid                                               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Portfolio Properties</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/pm/profile/${p.id}`}
              className="group overflow-hidden rounded-xl border border-[#00a9e033] bg-white shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[#00a9e0] backdrop-blur-sm dark:bg-zinc-900/90">
                  {p.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">{p.units} units</span>
                  <span className={`font-semibold ${p.occupancy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : p.occupancy >= 90 ? 'text-[#00a9e0]' : 'text-amber-600 dark:text-amber-400'}`}>
                    {p.occupancy}% occupied
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Avg rent</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">${p.avgRent.toLocaleString()}/mo</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Financial Highlights                                              */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Financial Highlights</h2>
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/5 dark:to-zinc-900">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Portfolio NOI</p>
              <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{financials.noi}</p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{financials.noiMargin} margin</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Maintenance Efficiency</p>
              <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{financials.maintenanceCost}</p>
              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">{financials.maintenanceBenchmark}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Vendor Scorecard</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{financials.vendorScore}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Budget Performance</p>
              <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{financials.budgetStatus}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Team Section                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Team</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00a9e0]/10 text-sm font-bold text-[#00a9e0]">
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{member.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.role}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <p>{member.email}</p>
                <p>{member.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Certifications & Awards                                           */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Certifications &amp; Awards</h2>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                  cert.isAward
                    ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                    : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  cert.isAward
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'bg-[#00a9e0]/10 text-[#00a9e0]'
                }`}>
                  {cert.isAward ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.01 6.01 0 0 1-2.77.853" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{cert.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{cert.org} &middot; {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Reviews from Property Owners                                      */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Reviews from Property Owners</h2>
        <div className="space-y-4">
          {ownerReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">&ldquo;{review.text}&rdquo;</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{review.name}</span>
                <span>&middot;</span>
                <span>{review.property}</span>
                <span>&middot;</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Services Offered                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Services Offered</h2>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-[#00a9e0]/10 px-3 py-1.5 text-sm font-medium text-[#00a9e0]"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
