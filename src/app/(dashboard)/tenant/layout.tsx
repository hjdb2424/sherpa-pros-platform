import type { Metadata } from 'next';
import TenantSidebar from '@/components/tenant/TenantSidebar';

export const metadata: Metadata = {
  title: {
    default: 'Tenant Portal',
    template: '%s | Sherpa Pros',
  },
};

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <TenantSidebar />

      {/* Main content: offset by sidebar on desktop, top header + bottom tabs on mobile */}
      <main
        className="pt-14 pb-20 lg:pl-56 lg:pb-0"
        id="main-content"
      >
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
