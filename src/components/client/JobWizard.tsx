'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { BudgetSlider } from './BudgetSlider';
import { PhotoUploader } from './PhotoUploader';
import {
  SERVICE_CATALOG,
  ALL_SUB_SERVICES,
  getCategory,
  getSubService,
  getCategoryConfidence,
  type ServiceCategory,
  type SubService,
} from '@/lib/config/service-catalog';
import { formatBudget } from '@/lib/mock-data/client-data';

// ─── Emoji lookup ────────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
  'water-outline': '\uD83D\uDD27',
  'flash-outline': '\u26A1',
  'hammer-outline': '\uD83E\uDE9A',
  'color-palette-outline': '\uD83C\uDFA8',
  'thermometer-outline': '\u2744\uFE0F',
  'home-outline': '\uD83C\uDFE0',
  'leaf-outline': '\uD83C\uDF3F',
  'layers-outline': '\uD83E\uDEB5',
  'cube-outline': '\uD83E\uDDF1',
  'construct-outline': '\uD83D\uDD28',
  'grid-outline': '\uD83D\uDD32',
  'business-outline': '\uD83C\uDFD7\uFE0F',
  'albums-outline': '\uD83E\uDE9F',
  'shirt-outline': '\uD83E\uDDE4',
  'trash-outline': '\uD83D\uDCA5',
  'sparkles-outline': '\uD83E\uDDF9',
  'car-outline': '\uD83D\uDCE6',
  'hardware-chip-outline': '\uD83D\uDD0C',
  'build-outline': '\uD83D\uDEE0\uFE0F',
  'warning-outline': '\u26A0\uFE0F',
  'shield-checkmark-outline': '\uD83D\uDEE1\uFE0F',
  'flame-outline': '\uD83D\uDD25',
  'rainy-outline': '\uD83D\uDCA7',
  'bug-outline': '\uD83D\uDC1E',
  'lock-closed-outline': '\uD83D\uDD12',
  'camera-outline': '\uD83D\uDCF7',
  'sunny-outline': '\u2600\uFE0F',
  'snow-outline': '\u2744\uFE0F',
  'fitness-outline': '\uD83C\uDFCB\uFE0F',
  'medical-outline': '\uD83C\uDFE5',
  'cafe-outline': '\u2615',
  'boat-outline': '\u26F5',
  'trail-sign-outline': '\uD83E\uDEA7',
  'earth-outline': '\uD83C\uDF0D',
  'telescope-outline': '\uD83D\uDD2D',
  'briefcase-outline': '\uD83D\uDCBC',
  'receipt-outline': '\uD83E\uDDFE',
};

function getEmoji(icon: string): string {
  return CATEGORY_EMOJI[icon] ?? '\uD83D\uDD27';
}

// ─── Types ────────────────────────────────────────────────────────

interface WizardData {
  categoryId: string | null;
  subServiceId: string | null;
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
  categoryId: null,
  subServiceId: null,
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

const POPULAR_CATEGORY_IDS = ['plumbing', 'electrical', 'emergency-services', 'landscaping'];

// ─── Component ────────────────────────────────────────────────────

export function JobWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [posted, setPosted] = useState(false);

  // Pre-fill from URL param ?service=<subServiceId>
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const sub = getSubService(serviceId);
      if (sub) {
        const cat = SERVICE_CATALOG.find((c) => c.subServices.some((s) => s.id === serviceId));
        if (cat) {
          setData((prev) => ({
            ...prev,
            categoryId: cat.id,
            subServiceId: sub.id,
            title: sub.name,
            description: sub.scope,
            urgency: sub.urgency,
            budgetMin: sub.budgetRange.min,
            budgetMax: sub.budgetRange.max,
          }));
          setStep(2); // Skip to details since category is pre-filled
        }
      }
    }
  }, [searchParams]);

  // Restore draft from localStorage
  useEffect(() => {
    // Don't restore if we just pre-filled from URL
    if (searchParams.get('service')) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WizardData>;
        setData((prev) => ({ ...prev, ...parsed, photos: [] }));
      }
    } catch {
      // Ignore parse errors
    }
  }, [searchParams]);

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

  const selectedCategory = useMemo(
    () => (data.categoryId ? getCategory(data.categoryId) : undefined),
    [data.categoryId],
  );

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.categoryId !== null;
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
            className="rounded-lg bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0ea5e9]"
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
                    ? 'bg-[#00a9e0] text-white'
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
                  s.id === step ? 'text-[#00a9e0]' : s.id < step ? 'text-emerald-600' : 'text-zinc-400'
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-[#00a9e0] transition-all duration-300"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 1 && <StepCategory data={data} update={update} onSubServiceSelect={(sub) => {
          update('categoryId', sub.categoryId);
          update('subServiceId', sub.id);
          update('title', sub.name);
          update('description', sub.scope);
          update('urgency', sub.urgency);
          update('budgetMin', sub.budgetRange.min);
          update('budgetMax', sub.budgetRange.max);
        }} />}
        {step === 2 && <StepDetails data={data} update={update} />}
        {step === 3 && <StepLocation data={data} update={update} />}
        {step === 4 && <StepBudget data={data} update={update} category={selectedCategory} />}
        {step === 5 && <StepPhotos data={data} update={update} />}
        {step === 6 && <StepReview data={data} update={update} onEdit={goToStep} category={selectedCategory} />}
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
            className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0ea5e9] disabled:cursor-not-allowed disabled:opacity-50"
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

type FlatSubService = SubService & { categoryId: string; categoryName: string };

interface StepCategoryProps extends StepProps {
  onSubServiceSelect: (sub: FlatSubService) => void;
}

function StepCategory({ data, update, onSubServiceSelect }: StepCategoryProps) {
  const [search, setSearch] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Filter categories + sub-services by search
  const filtered = useMemo(() => {
    if (!search.trim()) return SERVICE_CATALOG;
    const q = search.toLowerCase();
    return SERVICE_CATALOG.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subServices.some(
          (s) => s.name.toLowerCase().includes(q) || s.scope.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  // Popular categories at top
  const popular = useMemo(
    () => SERVICE_CATALOG.filter((c) => POPULAR_CATEGORY_IDS.includes(c.id)),
    [],
  );

  const handleCategoryClick = (catId: string) => {
    if (expandedCategoryId === catId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(catId);
      update('categoryId', catId);
    }
  };

  const handleSubServiceClick = (cat: ServiceCategory, sub: SubService) => {
    const flat: FlatSubService = { ...sub, categoryId: cat.id, categoryName: cat.name };
    onSubServiceSelect(flat);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900">What kind of work do you need?</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Pick a category, then select a specific service for an accurate bid.
      </p>

      {/* Search input */}
      <div className="relative mt-5">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a service... (e.g. faucet, deck, furnace)"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10"
          aria-label="Search services"
        />
      </div>

      {/* Popular categories (when not searching) */}
      {!search.trim() && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Popular
          </p>
          <div className="flex flex-wrap gap-2">
            {popular.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  data.categoryId === cat.id
                    ? 'border-[#00a9e0]/30 bg-sky-50 text-[#00a9e0]'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-[#00a9e0]/20 hover:bg-sky-50/30'
                }`}
              >
                <span role="img" aria-hidden="true">{getEmoji(cat.icon)}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-500">
            No services match &ldquo;{search}&rdquo;. Try a different search term.
          </p>
        </div>
      )}

      {/* Category grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((cat) => {
          const isSelected = data.categoryId === cat.id;
          const isExpanded = expandedCategoryId === cat.id;
          const confidence = getCategoryConfidence(cat.id);

          return (
            <div key={cat.id} className={`${isExpanded ? 'col-span-2 sm:col-span-3 lg:col-span-4' : ''}`}>
              <button
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex w-full min-h-[44px] flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-[#00a9e0] bg-sky-50 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-[#00a9e0]/30 hover:bg-sky-50/30'
                }`}
                aria-pressed={isSelected}
                aria-expanded={isExpanded}
              >
                <span className="text-3xl" role="img" aria-hidden="true">
                  {getEmoji(cat.icon)}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isSelected ? 'text-[#00a9e0]' : 'text-zinc-800'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[11px] leading-tight text-zinc-400">
                  {cat.description}
                </span>
                {confidence > 0 && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-1.257-1.257 3 3 0 01-5.304 0 3 3 0 00-1.257 1.257 3 3 0 010 5.304 3 3 0 001.257 1.257 3 3 0 015.304 0 3 3 0 001.257-1.257zM12.002 14a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {confidence}% Verified
                  </span>
                )}
              </button>

              {/* Expanded sub-services */}
              {isExpanded && (
                <div className="mt-2 rounded-xl border border-[#00a9e0]/20 bg-sky-50/50 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Select a service
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.subServices.map((sub) => {
                      const isSubSelected = data.subServiceId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubServiceClick(cat, sub)}
                          className={`flex flex-col rounded-lg border p-3 text-left transition-all ${
                            isSubSelected
                              ? 'border-[#00a9e0] bg-white shadow-sm ring-1 ring-[#00a9e0]/20'
                              : 'border-zinc-200 bg-white hover:border-[#00a9e0]/30 hover:shadow-sm'
                          }`}
                          aria-pressed={isSubSelected}
                        >
                          <span className="text-sm font-medium text-zinc-900">{sub.name}</span>
                          <span className="mt-1 text-[11px] leading-relaxed text-zinc-500 line-clamp-2">
                            {sub.scope}
                          </span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[11px] font-medium text-zinc-700">
                              ${sub.budgetRange.min.toLocaleString()}-${sub.budgetRange.max.toLocaleString()}
                            </span>
                            <span className="h-2.5 w-px bg-zinc-200" />
                            <span className="text-[11px] text-zinc-400">{sub.typicalDuration}</span>
                            {sub.urgency === 'emergency' && (
                              <>
                                <span className="h-2.5 w-px bg-zinc-200" />
                                <span className="text-[10px] font-medium text-red-600">Emergency</span>
                              </>
                            )}
                          </div>
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-1.257-1.257 3 3 0 01-5.304 0 3 3 0 00-1.257 1.257 3 3 0 010 5.304 3 3 0 001.257 1.257 3 3 0 015.304 0 3 3 0 001.257-1.257zM12.002 14a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {sub.wisemanConfidence}% confidence
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          {data.subServiceId && (
            <span className="ml-1 text-[#00a9e0]">Pre-filled from your selected service -- feel free to edit.</span>
          )}
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
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10"
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
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10"
        />
        <p className="mt-1.5 text-xs text-zinc-400">
          Tip: Describe what you need done -- our AI will help fill in technical details for the Pros.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">How urgent is this?</label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {([
            { value: 'emergency' as const, label: 'Emergency', icon: '\u26A1', color: 'border-red-300 bg-red-50 text-red-700', activeColor: 'border-red-400 ring-red-200 bg-red-50' },
            { value: 'standard' as const, label: 'Standard', icon: '\uD83D\uDCCB', color: 'border-[#00a9e0]/30 bg-sky-50 text-[#00a9e0]', activeColor: 'border-[#00a9e0] ring-[#00a9e0]/20 bg-sky-50' },
            { value: 'flexible' as const, label: 'Flexible', icon: '\uD83D\uDD50', color: 'border-emerald-300 bg-emerald-50 text-emerald-700', activeColor: 'border-emerald-400 ring-emerald-200 bg-emerald-50' },
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
                  ? 'border-[#00a9e0] bg-sky-50 ring-1 ring-[#00a9e0]/20'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <input
                type="radio"
                name="timeline"
                value={opt.value}
                checked={data.timeline === opt.value}
                onChange={() => update('timeline', opt.value)}
                className="h-4 w-4 border-zinc-300 text-[#00a9e0] focus:ring-[#00a9e0]"
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
          className="mt-1.5 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/10"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          update('address', '45 Maple St, Concord, NH 03301');
        }}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
      >
        <svg className="h-4 w-4 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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

function StepBudget({ data, update, category }: StepProps & { category?: ServiceCategory }) {
  const sub = data.subServiceId ? getSubService(data.subServiceId) : undefined;
  const sugMin = sub?.budgetRange.min ?? category?.subServices[0]?.budgetRange.min ?? 200;
  const sugMax = sub?.budgetRange.max ?? category?.subServices[0]?.budgetRange.max ?? 2000;

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
  category?: ServiceCategory;
}

function StepReview({ data, update, onEdit, category }: StepReviewProps) {
  const sub = data.subServiceId ? getSubService(data.subServiceId) : undefined;
  const catName = category ? `${getEmoji(category.icon)} ${category.name}` : '--';
  const subName = sub ? sub.name : '';

  const sections = [
    { step: 1, label: 'Category', value: catName + (subName ? ` > ${subName}` : '') },
    { step: 2, label: 'Project', value: data.title || '--' },
    { step: 2, label: 'Description', value: data.description || '--' },
    { step: 2, label: 'Urgency', value: data.urgency === 'emergency' ? '\u26A1 Emergency' : data.urgency === 'standard' ? '\uD83D\uDCCB Standard' : '\uD83D\uDD50 Flexible' },
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
              className="shrink-0 text-xs font-medium text-[#00a9e0] hover:text-[#0ea5e9]"
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
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#00a9e0] focus:ring-[#00a9e0]"
        />
        <span className="text-sm text-zinc-600">
          I agree to the{' '}
          <span className="font-medium text-[#00a9e0]">Terms of Service</span> and{' '}
          <span className="font-medium text-[#00a9e0]">Payment Protection Policy</span>.
        </span>
      </label>
    </div>
  );
}
