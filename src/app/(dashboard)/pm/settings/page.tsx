import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PM Settings',
};

export default function PMSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Settings
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your property management preferences and notifications.
      </p>

      <div className="mt-8 space-y-6">
        {/* Notification Preferences */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Notification Preferences
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Configure how you receive alerts about work orders, tenants, and vendors.
          </p>
          <div className="mt-4 space-y-3">
            {['Work order updates', 'Tenant requests', 'Vendor messages', 'Compliance alerts'].map(
              (label) => (
                <label key={label} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-zinc-300 text-[#00a9e0] focus:ring-[#00a9e0]"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
                </label>
              ),
            )}
          </div>
        </section>

        {/* Company Info */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Company Information
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update your company details visible to tenants and property owners.
          </p>
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Coming soon -- company profile editing will be available in a future update.
          </p>
        </section>
      </div>
    </div>
  );
}
