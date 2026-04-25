import type { Metadata } from 'next';
import ProSidebar from '@/components/pro/ProSidebar';
import DemoBanner from '@/components/DemoBanner';
import ProTour from '@/components/onboarding/ProTour';

export const metadata: Metadata = {
  title: {
    default: 'Pro Dashboard',
    template: '%s | Sherpa Pros',
  },
};

export default function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ProSidebar />
      <DemoBanner />
      <ProTour />

      {/* Main content area: offset by sidebar on desktop, top header + bottom tabs on mobile */}
      <main
        className="pt-14 pb-20 lg:pl-64 lg:pb-0"
        id="main-content"
      >
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
