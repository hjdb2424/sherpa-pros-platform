import type { Metadata } from 'next';
import HelpAndSupport from '@/components/onboarding/HelpAndSupport';

export const metadata: Metadata = {
  title: 'Settings | Property Manager',
};

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={defaultChecked}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00a9e0] focus:ring-offset-2 ${
        defaultChecked ? 'bg-[#00a9e0]' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          defaultChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function PMSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account, team, billing, and notification preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Personal Info</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Your account details.</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Full Name</p>
                <p className="text-sm text-zinc-900 dark:text-white">Lisa Park</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                <p className="text-sm text-zinc-900 dark:text-white">lisa.park@sunrisepm.com</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
                <p className="text-sm text-zinc-900 dark:text-white">(617) 555-0398</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
          </div>
        </section>

        {/* Team Management */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Team Management</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">People who can access this account.</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0090c0]"
            >
              Invite
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { name: 'Lisa Park', email: 'lisa.park@sunrisepm.com', role: 'Owner', initials: 'LP' },
              { name: 'David Chen', email: 'david.chen@sunrisepm.com', role: 'Manager', initials: 'DC' },
              { name: 'Sarah Kim', email: 'sarah.kim@sunrisepm.com', role: 'Coordinator', initials: 'SK' },
            ].map((member) => (
              <div key={member.email} className="flex items-center gap-3 rounded-lg border border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-[#00a9e0] dark:bg-[#00a9e0]/10">
                  {member.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{member.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p>
                </div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Billing */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Billing</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Payment method and subscription.</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Plan</p>
                <p className="text-sm text-zinc-900 dark:text-white">Professional -- $149/mo</p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0090c0]"
              >
                Upgrade
              </button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Payment Method</p>
                <p className="text-sm text-zinc-900 dark:text-white">Visa ****3847</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Update</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Next Invoice</p>
                <p className="text-sm text-zinc-900 dark:text-white">May 1, 2026 -- $149.00</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">View History</button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Configure how you receive alerts.</p>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Work order updates', desc: 'Status changes, completions, and issues', checked: true },
              { label: 'Tenant requests', desc: 'New maintenance requests and messages', checked: true },
              { label: 'Vendor messages', desc: 'Communications from your vendors', checked: true },
              { label: 'Compliance alerts', desc: 'License expirations and inspection reminders', checked: true },
              { label: 'Financial summaries', desc: 'Weekly expense and billing reports', checked: false },
            ].map((item, i) => (
              <div key={item.label}>
                {i > 0 && <div className="mb-4 h-px bg-zinc-100 dark:bg-zinc-800" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                  <ToggleSwitch defaultChecked={item.checked} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Help & Support */}
        <HelpAndSupport role="pm" />

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Irreversible account actions.</p>
          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign Out
            </button>
            <button
              type="button"
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Deactivate Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
