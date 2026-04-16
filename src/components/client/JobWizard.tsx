'use client';

import { useState, useEffect, useCallback } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { CategoryGrid } from './CategoryGrid';
import { BudgetSlider } from './BudgetSlider';
import { PhotoUploader } from './PhotoUploader';
import {
  JOB_CATEGORIES,
  type JobCategory,
  formatBudget,
} from '@/lib/mock-data/client-data';

// ─── Types ────────────────────────────────────────────────────────

interface WizardData {
  category: JobCategory | null;
  title: string;
  description: string;
  urgency: 'emergency' | 'standard' | 'flexible';
  timeline: string;
  address: string;
  budgetMin: number;
  budgetMax: number;
  letProsSuggest: boolean;
  photos: string[];
  termsAccepted: boolean;
}

const INITIAL_DATA: WizardData = {
  category: null,
  title: '',
  description: '',
  urgency: 'standard',
  timeline: 'asap',
  address: '',
  budgetMin: 200,
  budgetMax: 1000,
  letProsSuggest: false,
  photos: [],
  termsAccepted: false,
};

const STEPS = [
  { id: 1, label: 'Category' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Budget' },
  { id: 5, label: 'Photos' },
  { id: 6, label: 'Review' },
];

const STORAGE_KEY = 'sherpa-job-draft';

// ─── Component ────────────────────────────────────────────────────

export function JobWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [posted, setPosted] = useState(false);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WizardData>;
        // Restore category object from id
        if (parsed.category) {
          const found = JOB_CATEGORIES.find((c) => c.id === (parsed.category as unknown as { id: string })?.id);
          if (found) parsed.category = found;
        }
        setData((prev) => ({ ...prev, ...parsed, photos: [] })); // Don't restore blob URLs
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    try {
      const { photos, ...rest } = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // Ignore storage errors
    }
  }, [data]);

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.category !== null;
      case 2:
        return data.title.trim().length > 5 && data.description.trim().length > 10;
      case 3:
        return data.address.trim().length > 3;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return data.termsAccepted;
      default:
        return false;
    }
  };

  const handlePost = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPosted(true);
  };

  const goToStep = (s: number) => {
    if (s >= 1 && s <= 6) setStep(s);
  };

  if (posted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">Your job is live!</h2>
        <p className="mt-3 text-zinc-600">
          {data.urgency === 'emergency'
            ? 'Verified Pros in your area are being notified immediately. Expect responses within minutes.'
            : 'You\'ll receive bids from 3-5 verified Pros within 24 hours.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/client/my-jobs"
            className="rounded-lg bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a4e]"
          >
            View My Jobs
          </a>
          <button
            onClick={() => {
              setData(INITIAL_DATA);
              setPosted(false);
              setStep(1);
            }}
            className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => s.id < step && goToStep(s.id)}
              className={`flex flex-col items-center gap-1 ${
                s.id < step ? 'cursor-pointer' : 'cursor-default'
              }`}
              disabled={s.id > step}
              aria-label={`Step ${s.id}: ${s.label}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  s.id === step
                    ? 'bg-amber-500 text-white'
                    : s.id < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-200 text-zinc-400'
                }`}
              >
                {s.id < step ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`hidden text-[10px] font-medium sm:block ${
                  s.id === step ? 'text-amber-600' : s.id < step ? 'text-emerald-600' : 'text-zinc-400'
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 1 && <StepCategory data={data} update={update} />}
        {step === 2 && <StepDetails data={data} update={update} />}
        {step === 3 && <StepLocation data={data} update={update} />}
        {step === 4 && <StepBudget data={data} update={update} />}
        {step === 5 && <StepPhotos data={data} update={update} />}
        {step === 6 && <StepReview data={data} update={update} onEdit={goToStep} />}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 6 ? (
          <button
            onClick={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handlePost}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Post Job
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────

interface StepProps {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

function StepCategory({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900">What kind of work do you need?</h2>
      <p className="mt-1 text-sm text-zinc-500">Pick a category that best fits your project.</p>
      <div className="mt-5">
        <CategoryGrid
          selected={data.category?.id ?? null}
          onSelect={(cat) => {
            update('category', cat);
            update('budgetMin', cat.avgBudget.min);
            update('budgetMax', cat.avgBudget.max);
          }}
        />
      </div>
    </div>
  );
}

function StepDetails({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Tell us about your project</h2>
        <p className="mt-1 text-sm text-zinc-500">
          The more detail you provide, the better bids you will get.
        </p>
      </div>

      <div>
        <label htmlFor="job-title" className="block text-sm font-medium text-zinc-700">
          Project title
        </label>
        <input
          id="job-title"
          type="text"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Fix leaking kitchen faucet"
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label htmlFor="job-desc" className="block text-sm font-medium text-zinc-700">
          What needs to be done?
        </label>
        <textarea
          id="job-desc"
          rows={5}
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Describe the work you need done. Include any details like room size, materials, or specific requirements."
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
        <p className="mt-1.5 text-xs text-zinc-400">
          Tip: Describe what you need done -- our AI will help fill in technical details for the Pros.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">How urgent is this?</label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {([
            { value: 'emergency' as const, label: 'Emergency', icon: '⚡', color: 'border-red-300 bg-red-50 text-red-700', activeColor: 'border-red-400 ring-red-200 bg-red-50' },
            { value: 'standard' as const, label: 'Standard', icon: '📋', color: 'border-amber-300 bg-amber-50 text-amber-700', activeColor: 'border-amber-400 ring-amber-200 bg-amber-50' },
            { value: 'flexible' as const, label: 'Flexible', icon: '🕐', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', activeColor: 'border-emerald-400 ring-emerald-200 bg-emerald-50' },
          ]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('urgency', opt.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                data.urgency === opt.value
                  ? `${opt.activeColor} ring-2`
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
              aria-pressed={data.urgency === opt.value}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className={`text-sm font-semibold ${data.urgency === opt.value ? opt.color.split(' ').pop() : 'text-zinc-600'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Timeline preference</label>
        <div className="mt-2 space-y-2">
          {[
            { value: 'asap', label: 'As soon as possible' },
            { value: 'week', label: 'Within a week' },
            { value: 'flexible', label: 'Flexible on timing' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                data.timeline === opt.value
                  ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-200'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <input
                type="radio"
                name="timeline"
                value={opt.value}
                checked={data.timeline === opt.value}
                onChange={() => update('timeline', opt.value)}
                className="h-4 w-4 border-zinc-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-sm font-medium text-zinc-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepLocation({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Where is the work?</h2>
        <p className="mt-1 text-sm text-zinc-500">
          We use your location to find the closest available Pros.
        </p>
      </div>

      <div>
        <label htmlFor="job-address" className="block text-sm font-medium text-zinc-700">
          Street address
        </label>
        <input
          id="job-address"
          type="text"
          value={data.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="123 Main St, Concord, NH 03301"
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          // Placeholder for geolocation
          update('address', '45 Maple St, Concord, NH 03301');
        }}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
      >
        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        Use my current location
      </button>

      {data.address && (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="flex h-48 items-center justify-center bg-zinc-100">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              <p className="mt-2 text-xs text-zinc-500">Map preview will appear here</p>
              <p className="mt-1 text-xs font-medium text-zinc-700">{data.address}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Your exact address is only shared with the Pro you hire.
        </div>
      </div>
    </div>
  );
}

function StepBudget({ data, update }: StepProps) {
  const category = data.category;
  const sugMin = category?.avgBudget.min ?? 200;
  const sugMax = category?.avgBudget.max ?? 2000;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">What is your budget?</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Set a range that works for you. Pros will bid within or near this range.
        </p>
      </div>

      <BudgetSlider
        min={data.budgetMin}
        max={data.budgetMax}
        suggestedMin={sugMin}
        suggestedMax={sugMax}
        onChange={(min, max) => {
          update('budgetMin', min);
          update('budgetMax', max);
        }}
        category={category?.name}
        letProsSuggest={data.letProsSuggest}
        onLetProsSuggestChange={(v) => update('letProsSuggest', v)}
      />
    </div>
  );
}

function StepPhotos({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Add photos (optional)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Photos of the area or issue help Pros give more accurate bids.
        </p>
      </div>

      <PhotoUploader
        photos={data.photos}
        onChange={(photos) => update('photos', photos)}
      />

      {data.photos.length === 0 && (
        <button
          type="button"
          onClick={() => {
            /* skip handled by Next button */
          }}
          className="w-full rounded-lg border border-zinc-200 py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}

interface StepReviewProps extends StepProps {
  onEdit: (step: number) => void;
}

function StepReview({ data, update, onEdit }: StepReviewProps) {
  const sections = [
    { step: 1, label: 'Category', value: data.category ? `${data.category.icon} ${data.category.name}` : '--' },
    { step: 2, label: 'Project', value: data.title || '--' },
    { step: 2, label: 'Description', value: data.description || '--' },
    { step: 2, label: 'Urgency', value: data.urgency === 'emergency' ? '⚡ Emergency' : data.urgency === 'standard' ? '📋 Standard' : '🕐 Flexible' },
    { step: 3, label: 'Location', value: data.address || '--' },
    { step: 4, label: 'Budget', value: data.letProsSuggest ? 'Let Pros suggest' : formatBudget({ min: data.budgetMin, max: data.budgetMax }) },
    { step: 5, label: 'Photos', value: `${data.photos.length} photo${data.photos.length !== 1 ? 's' : ''} attached` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Review your job posting</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Make sure everything looks good before posting.
        </p>
      </div>

      <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {sections.map((section, i) => (
          <div key={i} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {section.label}
              </p>
              <p className="mt-0.5 text-sm text-zinc-800 break-words">
                {section.value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(section.step)}
              className="shrink-0 text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-800">
              {data.urgency === 'emergency'
                ? 'Emergency: Pros will be notified immediately'
                : 'You\'ll receive bids from 3-5 verified Pros within 24 hours'}
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              All Pros are background checked. Payments are held in escrow until you approve the work.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-emerald-900">Payment Protected</p>
          <p className="mt-0.5 text-xs leading-relaxed text-emerald-700">
            Your payment is held in secure escrow and only released when you approve the completed work. Full refund if the pro doesn&apos;t deliver.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-4">
        <input
          type="checkbox"
          checked={data.termsAccepted}
          onChange={(e) => update('termsAccepted', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
        />
        <span className="text-sm text-zinc-600">
          I agree to the{' '}
          <span className="font-medium text-amber-600">Terms of Service</span> and{' '}
          <span className="font-medium text-amber-600">Payment Protection Policy</span>.
        </span>
      </label>
    </div>
  );
}
