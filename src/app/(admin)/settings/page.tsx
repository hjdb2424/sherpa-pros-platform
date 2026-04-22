'use client';

import { useState } from 'react';
import {
  Cog6ToothIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Integration status helpers
// ---------------------------------------------------------------------------

interface Integration {
  name: string;
  envVar: string;
  connected: boolean;
  icon: string;
}

const INTEGRATIONS: Integration[] = [
  { name: 'Google Maps', envVar: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', connected: true, icon: '\uD83D\uDDFA\uFE0F' },
  { name: 'Stripe', envVar: 'STRIPE_SECRET_KEY', connected: false, icon: '\uD83D\uDCB3' },
  { name: 'QuickBooks Online', envVar: 'QBO_CLIENT_ID', connected: true, icon: '\uD83D\uDCCA' },
  { name: 'Twilio', envVar: 'TWILIO_ACCOUNT_SID', connected: true, icon: '\uD83D\uDCF1' },
  { name: 'SerpApi', envVar: 'SERPAPI_KEY', connected: true, icon: '\uD83D\uDD0D' },
];

// ---------------------------------------------------------------------------
// Admin Settings Page
// ---------------------------------------------------------------------------

export default function AdminSettingsPage() {
  const [serviceRadius, setServiceRadius] = useState(45);
  const [commissionRate, setCommissionRate] = useState(15);
  const [emergencySurcharge, setEmergencySurcharge] = useState(25);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'open' | 'invite'>('open');
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully.');
    }, 500);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Cog6ToothIcon className="h-7 w-7 text-zinc-400" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Settings
          </h1>
          <p className="text-sm text-zinc-500">
            Platform configuration and preferences
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* ── Platform Settings ────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <WrenchScrewdriverIcon className="h-5 w-5 text-[#00a9e0]" />
            Platform Settings
          </h2>

          <div className="mt-6 space-y-6">
            {/* Service Area Radius */}
            <div>
              <label
                htmlFor="service-radius"
                className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                <MapPinIcon className="h-4 w-4 text-zinc-400" />
                Service Area Radius
                <span className="ml-auto font-bold text-[#00a9e0]">{serviceRadius} mi</span>
              </label>
              <input
                id="service-radius"
                type="range"
                min={10}
                max={100}
                step={5}
                value={serviceRadius}
                onChange={(e) => setServiceRadius(Number(e.target.value))}
                className="mt-2 w-full accent-[#00a9e0]"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-400">
                <span>10 mi</span>
                <span>100 mi</span>
              </div>
            </div>

            {/* Default Commission Rate */}
            <div>
              <label
                htmlFor="commission-rate"
                className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                <CurrencyDollarIcon className="h-4 w-4 text-zinc-400" />
                Default Commission Rate
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="commission-rate"
                  type="number"
                  min={1}
                  max={50}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <span className="text-sm text-zinc-500">%</span>
              </div>
            </div>

            {/* Emergency Surcharge */}
            <div>
              <label
                htmlFor="emergency-surcharge"
                className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                <BoltIcon className="h-4 w-4 text-zinc-400" />
                Emergency Surcharge
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="emergency-surcharge"
                  type="number"
                  min={0}
                  max={100}
                  value={emergencySurcharge}
                  onChange={(e) => setEmergencySurcharge(Number(e.target.value))}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <span className="text-sm text-zinc-500">%</span>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Maintenance Mode
                </p>
                <p className="text-xs text-zinc-400">
                  Temporarily disable the platform for users
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={maintenanceMode}
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  maintenanceMode ? 'bg-red-500' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Registration Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <UserGroupIcon className="h-4 w-4 text-zinc-400" />
                  Registration
                </p>
                <p className="text-xs text-zinc-400">
                  Control new user sign-ups
                </p>
              </div>
              <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-600">
                <button
                  type="button"
                  onClick={() => setRegistrationMode('open')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    registrationMode === 'open'
                      ? 'bg-[#00a9e0] text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  } rounded-l-md`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationMode('invite')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    registrationMode === 'invite'
                      ? 'bg-[#00a9e0] text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  } rounded-r-md`}
                >
                  Invite Only
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-8 w-full rounded-full bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0ea5e9] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* ── Integration Status ──────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <BoltIcon className="h-5 w-5 text-[#00a9e0]" />
            Integration Status
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Connected services and API keys
          </p>

          <div className="mt-6 space-y-3">
            {INTEGRATIONS.map((integ) => (
              <div
                key={integ.name}
                className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg" role="img" aria-hidden="true">
                    {integ.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {integ.name}
                    </p>
                    <p className="text-xs font-mono text-zinc-400">
                      {integ.envVar}
                    </p>
                  </div>
                </div>
                {integ.connected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                    </svg>
                    Not Connected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
