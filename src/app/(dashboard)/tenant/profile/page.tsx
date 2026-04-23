import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tenant Profile',
};

export default function TenantProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Profile
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your tenant profile and contact information.
      </p>

      <div className="mt-8 space-y-6">
        {/* Profile Card */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              AR
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Alex Rivera
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Tenant</p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Contact Information
          </h2>
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Profile editing will be available in a future update.
          </p>
        </section>
      </div>
    </div>
  );
}
