import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Dispatch',
  description: 'Get an emergency Pro dispatched to you in minutes.',
};

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d1a]">
      {/* Minimal header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0d0d1a] px-4">
        <a
          href="/client/dashboard"
          className="flex items-center gap-2 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Back to dashboard"
        >
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a1a2e]">
            <span className="text-xs font-bold text-amber-400">S</span>
          </div>
          <span className="text-sm font-bold text-white">Sherpa Pros</span>
        </a>
        <span className="rounded-md bg-red-600/20 border border-red-600/40 px-2 py-0.5 text-xs font-bold text-red-400">
          EMERGENCY
        </span>
      </header>

      {/* Full-screen content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
