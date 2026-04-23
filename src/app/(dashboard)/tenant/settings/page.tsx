import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Tenant',
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

export default function TenantSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account and notification preferences.
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
                <p className="text-sm text-zinc-900 dark:text-white">Alex Rivera</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                <p className="text-sm text-zinc-900 dark:text-white">alex.rivera@email.com</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
                <p className="text-sm text-zinc-900 dark:text-white">(603) 555-0156</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
          </div>
        </section>

        {/* Unit Info */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Unit Info</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Your current rental unit details.</p>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Property</p>
              <p className="text-sm text-zinc-900 dark:text-white">Sunrise Apartments</p>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Unit</p>
              <p className="text-sm text-zinc-900 dark:text-white">Unit 4B</p>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Lease Dates</p>
              <p className="text-sm text-zinc-900 dark:text-white">Jan 1, 2026 -- Dec 31, 2026</p>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Property Manager</p>
              <p className="text-sm text-zinc-900 dark:text-white">Sunrise PM -- Lisa Park</p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Choose how you get notified.</p>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Request updates', desc: 'Status changes on your maintenance requests', checked: true },
              { label: 'Messages', desc: 'New messages from property management', checked: true },
              { label: 'Community notices', desc: 'Building announcements and updates', checked: false },
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
          </div>
        </section>
      </div>
    </div>
  );
}
