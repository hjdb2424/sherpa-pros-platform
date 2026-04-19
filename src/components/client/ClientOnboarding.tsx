'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES = ['House', 'Condo', 'Apartment', 'Commercial'] as const;

const TRADES = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC',
  'Roofing', 'Landscaping', 'Flooring', 'Concrete', 'Drywall',
  'Tile', 'Fencing', 'Decks', 'General Handyman',
] as const;

const BUDGET_RANGES = [
  'Under $500',
  '$500 - $2,000',
  '$2,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
] as const;

interface OnboardingData {
  address: string;
  propertyType: string;
  preferredTrades: string[];
  budgetRange: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emergencyAlerts: boolean;
}

const INITIAL_DATA: OnboardingData = {
  address: '',
  propertyType: '',
  preferredTrades: [],
  budgetRange: '',
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  emergencyAlerts: true,
};

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step) / total) * 100;
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span>Step {step} of {total}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-[#00a9e0] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          checked ? 'bg-[#00a9e0]' : 'bg-zinc-300 dark:bg-zinc-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function ClientOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [completed, setCompleted] = useState(false);

  const updateData = useCallback(
    <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleTrade = useCallback((trade: string) => {
    setData((prev) => ({
      ...prev,
      preferredTrades: prev.preferredTrades.includes(trade)
        ? prev.preferredTrades.filter((t) => t !== trade)
        : [...prev.preferredTrades, trade],
    }));
  }, []);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return data.address.trim().length > 0 && data.propertyType !== '';
      case 2:
        return data.preferredTrades.length > 0 && data.budgetRange !== '';
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleComplete = useCallback(() => {
    setCompleted(true);
    setTimeout(() => {
      router.push('/client/dashboard');
    }, 2500);
  }, [router]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <svg
            className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Profile Complete!
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Complete Your Profile
      </h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Tell us about your property so we can match you with the right Pros.
      </p>

      <ProgressBar step={step} total={4} />

      {/* Step 1: Property Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="onb-address"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Property Address
            </label>
            <input
              id="onb-address"
              type="text"
              value={data.address}
              onChange={(e) => updateData('address', e.target.value)}
              placeholder="123 Main St, Concord, NH"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Property Type
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    data.propertyType === type
                      ? 'border-[#00a9e0] bg-sky-50 text-[#00a9e0] dark:bg-sky-900/20 dark:text-sky-400'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={data.propertyType === type}
                    onChange={() => updateData('propertyType', type)}
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {/* Step 2: Project Preferences */}
      {step === 2 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preferred Trades
            </legend>
            <div className="flex flex-wrap gap-2">
              {TRADES.map((trade) => {
                const selected = data.preferredTrades.includes(trade);
                return (
                  <button
                    key={trade}
                    type="button"
                    onClick={() => toggleTrade(trade)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      selected
                        ? 'border-[#00a9e0] bg-[#00a9e0] text-white shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                    aria-pressed={selected}
                  >
                    {trade}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="onb-budget"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Typical Project Budget
            </label>
            <select
              id="onb-budget"
              value={data.budgetRange}
              onChange={(e) => updateData('budgetRange', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select a budget range</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Notification Preferences */}
      {step === 3 && (
        <div className="space-y-3">
          <Toggle
            label="Email Notifications"
            description="Bid updates, job status changes, invoices"
            checked={data.emailNotifications}
            onChange={(v) => updateData('emailNotifications', v)}
          />
          <Toggle
            label="SMS Notifications"
            description="Urgent updates and Pro arrival alerts"
            checked={data.smsNotifications}
            onChange={(v) => updateData('smsNotifications', v)}
          />
          <Toggle
            label="Push Notifications"
            description="Real-time updates in your browser"
            checked={data.pushNotifications}
            onChange={(v) => updateData('pushNotifications', v)}
          />
          <Toggle
            label="Emergency Alerts"
            description="24/7 alerts for emergency dispatch jobs"
            checked={data.emergencyAlerts}
            onChange={(v) => updateData('emergencyAlerts', v)}
          />
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Property</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Address</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{data.address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Type</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{data.propertyType}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Preferences</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.preferredTrades.map((trade) => (
                <span
                  key={trade}
                  className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-[#00a9e0] dark:bg-sky-900/20 dark:text-sky-400"
                >
                  {trade}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Budget: <span className="font-medium text-zinc-900 dark:text-zinc-100">{data.budgetRange}</span>
            </p>
          </div>

          <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Notifications</h3>
            <div className="mt-2 space-y-1 text-sm">
              {[
                { label: 'Email', on: data.emailNotifications },
                { label: 'SMS', on: data.smsNotifications },
                { label: 'Push', on: data.pushNotifications },
                { label: 'Emergency Alerts', on: data.emergencyAlerts },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.on ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                    }`}
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  <span className="text-xs text-zinc-400">{item.on ? 'On' : 'Off'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (step < 4) {
              setStep((s) => s + 1);
            } else {
              handleComplete();
            }
          }}
          disabled={!canAdvance()}
          className="flex-1 rounded-full bg-[#00a9e0] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step === 4 ? 'Complete Setup' : 'Next'}
        </button>
      </div>
    </div>
  );
}
