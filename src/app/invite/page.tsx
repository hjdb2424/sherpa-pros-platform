import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Logo from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'Beta Invite — Sherpa Pros',
  description: 'Choose your invite type to access the Sherpa Pros beta.',
};

interface Props {
  searchParams: Promise<{ role?: string }>;
}

export default async function InvitePage({ searchParams }: Props) {
  const params = await searchParams;
  const role = params.role;

  if (role === 'pm') redirect('/invite/pm');
  if (role === 'pro') redirect('/invite/pro');
  if (role === 'client') redirect('/invite/client');

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">

        {/* Header */}
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Choose your invite type</h1>
          <p className="mt-3 text-sm text-zinc-500">
            Select your role to get a personalized beta invite you can download as a PDF.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/invite/pm"
            className="group rounded-xl border border-zinc-200 p-6 text-center transition-all hover:border-[#00a9e0]/40 hover:shadow-md"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Property Manager</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Finance dashboards, maintenance workflows, vendor coordination
            </p>
          </Link>

          <Link
            href="/invite/pro"
            className="group rounded-xl border border-zinc-200 p-6 text-center transition-all hover:border-[#00a9e0]/40 hover:shadow-md"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.42 5.42a2.121 2.121 0 01-3-3l5.42-5.42m0 0a7.5 7.5 0 119.316-9.316 2.25 2.25 0 01-2.783 2.783 7.5 7.5 0 01-9.316 9.316z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Trade Professional</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Job matching, zero lead fees, portfolio, quote builder
            </p>
          </Link>

          <Link
            href="/invite/client"
            className="group rounded-xl border border-zinc-200 p-6 text-center transition-all hover:border-[#00a9e0]/40 hover:shadow-md"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Homeowner / Client</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Post a job, get verified bids, marketplace-protected payments
            </p>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-400">&copy; 2026 Sherpa Pros &bull; info@thesherpapros.com</p>
        </div>
      </div>
    </div>
  );
}
