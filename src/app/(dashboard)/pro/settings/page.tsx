'use client';

import HelpAndSupport from '@/components/onboarding/HelpAndSupport';
import { useState, useEffect } from 'react';
import { userStorage } from '@/lib/user-storage';

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

function useOnboardingProfile() {
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    try {
      const p = userStorage.get<Record<string, string>>('user-profile');
      if (p) setProfile(p);
    } catch { /* ignore */ }
  }, []);
  return profile;
}

export default function ProSettingsPage() {
  const profile = useOnboardingProfile();
  const displayName = profile?.fullName || 'Marcus Rivera';
  const displayEmail = profile?.email || 'marcus.rivera@email.com';
  const displayPhone = profile?.phone || '(603) 555-0142';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account preferences, payments, and notifications.
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
                <p className="text-sm text-zinc-900 dark:text-white">{displayName}</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                <p className="text-sm text-zinc-900 dark:text-white">{displayEmail}</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
                <p className="text-sm text-zinc-900 dark:text-white">{displayPhone}</p>
              </div>
              <button type="button" className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors">Edit</button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Notifications</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Choose how you get notified.</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Email notifications</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Job alerts, messages, and updates</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">SMS notifications</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Urgent job dispatches and reminders</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Push notifications</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Real-time alerts on your device</p>
              </div>
              <ToggleSwitch />
            </div>
          </div>
        </section>

        {/* Payment & Banking */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Payment &amp; Banking</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage how you get paid.</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bank Account</p>
                <p className="text-sm text-zinc-900 dark:text-white">Chase Checking ****4821</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Connected
              </span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Stripe Connect</p>
                <p className="text-sm text-zinc-900 dark:text-white">Payments enabled</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Subscription</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Your current plan and billing.</p>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Silver Tier</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">$29/mo -- Renews May 15, 2026</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-[#00a9e0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0090c0]"
            >
              Upgrade
            </button>
          </div>
        </section>

        {/* License & Insurance */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">License &amp; Insurance</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Verification documents on file.</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Contractor License</p>
                <p className="text-sm text-zinc-900 dark:text-white">NH-GC-2024-08812</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Verified
              </span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">License Expiration</p>
                <p className="text-sm text-zinc-900 dark:text-white">Dec 31, 2026</p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">254 days left</span>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">General Liability Insurance</p>
                <p className="text-sm text-zinc-900 dark:text-white">$1M coverage -- State Farm</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <HelpAndSupport role="pro" />

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
