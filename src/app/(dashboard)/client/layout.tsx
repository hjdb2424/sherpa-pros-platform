import Logo from '@/components/brand/Logo';
import { ClientSidebar } from '@/components/client/ClientSidebar';
import HeaderAvatar from '@/components/common/HeaderAvatar';
import DemoBanner from '@/components/DemoBanner';
import ClientTour from '@/components/onboarding/ClientTour';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <ClientSidebar />
      <DemoBanner />
      <OnboardingWizard role="client" />
      <ClientTour />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Logo size="sm" href="/client/dashboard" />
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

            {/* Avatar only — name is in the sidebar profile card */}
            <HeaderAvatar href="/client/settings" fallbackInitials="SP" />
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
