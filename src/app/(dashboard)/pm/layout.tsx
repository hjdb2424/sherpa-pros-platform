import type { Metadata } from 'next';
import PMSidebar from '@/components/pm/PMSidebar';
import DemoBanner from '@/components/DemoBanner';
import PMTour from '@/components/onboarding/PMTour';

export const metadata: Metadata = {
  title: {
    default: 'Property Manager',
    template: '%s | Sherpa Pros',
  },
};

export default function PMDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PMSidebar />
      <DemoBanner />
      <PMTour />

      {/* Main content area: offset by sidebar on desktop, top header + bottom tabs on mobile */}
      <main
        className="pt-14 pb-20 lg:pl-64 lg:pb-0"
        id="main-content"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
