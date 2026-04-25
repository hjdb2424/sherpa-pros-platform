import Link from 'next/link';
import { ClientSidebar } from '@/components/client/ClientSidebar';
import DemoBanner from '@/components/DemoBanner';
import ClientTour from '@/components/onboarding/ClientTour';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <ClientSidebar />
      <DemoBanner />
      <ClientTour />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a2e]">
              <span className="text-sm font-bold text-amber-400">S</span>
            </div>
            <span className="text-lg font-bold text-[#1a1a2e]">Sherpa Pros</span>
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              className="relative rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile dropdown */}
            <Link href="/client/dashboard" className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-zinc-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white">
                PM
              </div>
              <span className="hidden text-sm font-medium text-zinc-700 sm:block">
                Phyrom M.
              </span>
              <svg className="hidden h-4 w-4 text-zinc-400 sm:block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
