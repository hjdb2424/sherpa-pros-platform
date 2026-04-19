import type { Metadata } from "next";
import { AdminSidebar } from "./AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Sherpa Pros Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Internal-use banner */}
      <div className="bg-accent text-accent-foreground text-center text-xs font-semibold py-1.5 tracking-wide">
        Admin access &mdash; internal use only
      </div>

      <div className="flex min-h-[calc(100vh-30px)]">
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
