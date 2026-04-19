'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import BidForm from '@/components/pro/BidForm';
import MilestoneTracker from '@/components/pro/MilestoneTracker';
import InvoicePreview from '@/components/invoices/InvoicePreview';
import { generateInvoice, type Invoice } from '@/lib/services/invoices';
import {
  ScopeDocument,
  WorkProcess,
  ChecklistProgress,
  MaterialsList,
  HDPriceTag,
  DeliverySelector,
} from '@/components/checklist';
import type { HDProduct } from '@/lib/services/serpapi';
import type { DeliveryTier } from '@/lib/services/zinc';
import JobTimeline from '@/components/jobs/JobTimeline';
import QBOSyncStatus from '@/components/integrations/QBOSyncStatus';
import {
  getChecklistForJob,
  type ChecklistItem as WisemanChecklistItem,
  type MaterialItem,
} from '@/lib/mock-data/checklist-data';
import {
  mockAvailableJobs,
  mockActiveJobs,
  mockCompletedJobs,
  type Job,
  type ChecklistItem,
} from '@/lib/mock-data/pro-data';

interface JobDetailClientProps {
  jobId: string;
}

const urgencyConfig = {
  low: { label: 'Low Priority', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  medium: { label: 'Medium Priority', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'High Priority', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  emergency: { label: 'Emergency', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

type TabKey = 'overview' | 'scope' | 'process' | 'checklist' | 'materials';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'scope', label: 'Scope' },
  { key: 'process', label: 'Process' },
  { key: 'checklist', label: 'Checklist' },
  { key: 'materials', label: 'Materials' },
];

function LegacyChecklist({ title, items }: { title: string; items: ChecklistItem[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${item.completed ? 'bg-emerald-500 text-white' : 'border border-zinc-300 dark:border-zinc-600'}`}>
              {item.completed && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </span>
            <span className={item.completed ? 'text-zinc-500 line-through dark:text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JobDetailClient({ jobId }: JobDetailClientProps) {
  const allJobs = useMemo(() => [...mockAvailableJobs, ...mockActiveJobs, ...mockCompletedJobs], []);
  const job = useMemo(() => allJobs.find((j) => j.id === jobId), [allJobs, jobId]);

  const jobChecklist = useMemo(() => getChecklistForJob(jobId), [jobId]);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  // Wiseman checklist items with local toggle state
  const [checklistItems, setChecklistItems] = useState<WisemanChecklistItem[]>(
    () => jobChecklist?.checklist ?? []
  );

  // Materials with local add/remove/adjust state
  const [materials, setMaterials] = useState<MaterialItem[]>(
    () => jobChecklist?.materials ?? []
  );

  const handleToggle = useCallback((id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const handlePhotoUpload = useCallback((id: string) => {
    // In production, this would open a file picker and upload to storage.
    // For now, mark it as having a photo with a placeholder URL.
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoUrl: '/placeholder-photo.jpg' } : item
      )
    );
  }, []);

  const handleAddMaterial = useCallback((item: Partial<MaterialItem>) => {
    const newItem: MaterialItem = {
      id: `m-new-${Date.now()}`,
      name: item.name ?? 'New Material',
      quantity: item.quantity ?? 1,
      unit: item.unit ?? 'ea',
      spec: item.spec ?? '',
      category: item.category ?? 'general',
      phase: item.phase ?? 'rough_in',
      priceCents: item.priceCents ?? 0,
      addedBy: 'pro',
      wisemanReview: 'warning',
      wisemanNotes: 'Pending review',
      ...item,
    };
    setMaterials((prev) => [...prev, newItem]);
  }, []);

  const handleRemoveMaterial = useCallback((id: string, notes: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleAdjustMaterial = useCallback((id: string, qty: number, notes: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: qty, proNotes: notes } : m))
    );
  }, []);

  // HD pricing state
  const [pricingLoading, setPricingLoading] = useState(false);
  const [hdPrices, setHdPrices] = useState<Record<string, HDProduct> | null>(null);
  const [selectedDeliveryTier, setSelectedDeliveryTier] = useState<DeliveryTier | undefined>();
  const [clientSent, setClientSent] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (showInvoice && !invoice) {
      setInvoice(generateInvoice(jobId));
    }
  }, [showInvoice, invoice, jobId]);

  async function handleGetPricing() {
    setPricingLoading(true);
    try {
      const res = await fetch('/api/materials/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materials: materials.map((m) => ({ name: m.name, spec: m.spec })),
          zipCode: '03801',
        }),
      });
      const data = await res.json();
      setHdPrices(data.products);
    } catch {
      // silently fail -- mock pricing stays
    } finally {
      setPricingLoading(false);
    }
  }

  // Compute HD total when prices available
  const hdTotal = useMemo(() => {
    if (!hdPrices) return 0;
    return Object.values(hdPrices).reduce((sum, p) => sum + p.priceCents, 0);
  }, [hdPrices]);

  const hdStoreName = useMemo(() => {
    if (!hdPrices) return '';
    const first = Object.values(hdPrices)[0];
    return first?.storeName ?? 'Home Depot';
  }, [hdPrices]);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Job Not Found</h1>
        <p className="mt-2 text-zinc-500">This job may have been removed or is no longer available.</p>
        <Link href="/pro/jobs" className="mt-4 rounded-full bg-[#00a9e0] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 hover:bg-[#0090c0]">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const urgency = urgencyConfig[job.urgency];
  const isAvailable = job.status === 'available';
  const isActive = job.status === 'active';
  const isCompleted = job.status === 'completed';
  const hasChecklist = jobChecklist !== null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/pro/jobs"
        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start gap-2">
          <span className="rounded-md bg-[#1a1a2e]/10 px-2.5 py-0.5 text-xs font-medium text-[#1a1a2e] dark:bg-zinc-700 dark:text-zinc-300">
            {job.category}
          </span>
          <span className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${urgency.classes}`}>
            {urgency.label}
          </span>
          {job.type === 'auto-dispatch' && (
            <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Auto-Dispatch
            </span>
          )}
        </div>

        <h1 className="mt-3 text-xl font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">{job.title}</h1>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{job.clientName}</span>
          <span>{job.address}</span>
          <span>{job.distanceMiles} mi away</span>
          <span>${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}</span>
        </div>

        {/* Wiseman validation badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.budgetVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Budget Verified
            </span>
          )}
          {job.permitsRequired.map((permit) => (
            <span
              key={permit}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Permits Required: {permit}
            </span>
          ))}
          {job.clientRating !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
              Client Rating: {job.clientRating}
            </span>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="overflow-x-auto border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex min-w-max" aria-label="Job detail tabs" role="tablist">
          {TABS.map((tab) => {
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'border-b-2 border-[#00a9e0] text-[#00a9e0]'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="grid gap-6 lg:grid-cols-3">
          {/* Left column: description + details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Scope */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Scope of Work</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{job.scope}</p>

              {job.description && job.description !== job.scope && (
                <>
                  <h3 className="mt-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">Additional Details</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{job.description}</p>
                </>
              )}
            </div>

            {/* Photos placeholder */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Photos</h2>
                {isActive && (
                  <button
                    type="button"
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className="rounded-full bg-[#00a9e0] px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-colors hover:bg-[#0090c0]"
                  >
                    Upload Photo
                  </button>
                )}
              </div>
              {showPhotoUpload && (
                <div className="mt-3 rounded-lg border-2 border-dashed border-zinc-300 p-6 text-center dark:border-zinc-600">
                  <svg className="mx-auto h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <p className="mt-2 text-sm text-zinc-500">Tap to upload milestone photos</p>
                  <p className="mt-0.5 text-xs text-zinc-400">JPG, PNG up to 10MB</p>
                </div>
              )}
              {!showPhotoUpload && job.photos.length === 0 && (
                <p className="mt-2 text-sm text-zinc-500">No photos uploaded yet.</p>
              )}
            </div>

            {/* Milestones (active/completed jobs) */}
            {(isActive || isCompleted) && job.milestones.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">Milestones</h2>
                <MilestoneTracker milestones={job.milestones} />
              </div>
            )}

            {/* Legacy checklists */}
            {isActive && (job.onboardingChecklist.length > 0 || job.offboardingChecklist.length > 0) && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">Checklists</h2>
                <div className="space-y-6">
                  <LegacyChecklist title="Onboarding" items={job.onboardingChecklist} />
                  <LegacyChecklist title="Offboarding" items={job.offboardingChecklist} />
                </div>
              </div>
            )}

            {/* Completed review */}
            {isCompleted && job.reviewText && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Client Review</h2>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < (job.ratingReceived ?? 0) ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">&ldquo;{job.reviewText}&rdquo;</p>
                <p className="mt-1 text-xs text-zinc-400">-- {job.clientName}</p>
              </div>
            )}

            {/* Invoice for completed jobs */}
            {isCompleted && (
              <div>
                {!showInvoice ? (
                  <button
                    type="button"
                    onClick={() => setShowInvoice(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00a9e0] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    View Invoice
                  </button>
                ) : invoice ? (
                  <InvoicePreview invoice={invoice} />
                ) : null}
              </div>
            )}
          </div>

          {/* Right column: actions */}
          <div className="space-y-4">
            {/* Bid form for available bid jobs */}
            {isAvailable && job.type === 'bid' && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <BidForm jobId={job.id} budgetMin={job.budgetMin} budgetMax={job.budgetMax} />
              </div>
            )}

            {/* Accept/Decline for auto-dispatch */}
            {isAvailable && job.type === 'auto-dispatch' && (
              <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 shadow-sm dark:border-amber-700 dark:bg-amber-950/20">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Auto-Dispatch Job</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  You have been selected for this job based on your profile match and availability.
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-600 active:bg-emerald-700"
                  >
                    Accept Job
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* QuickBooks sync */}
            {(isActive || isCompleted) && (
              <QBOSyncStatus jobId={job.id} jobTitle={job.title} compact />
            )}

            {/* Chat button */}
            {(isActive || isAvailable) && (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                Message Client
              </button>
            )}

            {/* Job summary card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Job Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Category</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{job.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Budget</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Distance</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{job.distanceMiles} mi</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Type</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">{job.type === 'auto-dispatch' ? 'Auto-Dispatch' : 'Bid'}</dd>
                </div>
                {job.dispatchScore && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Match Score</dt>
                    <dd className="font-semibold text-emerald-600 dark:text-emerald-400">{job.dispatchScore}%</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Job Timeline */}
            {(isActive || isCompleted) && (
              <JobTimeline jobId={job.id} />
            )}
          </div>
        </div>
      )}

      {/* Scope Tab */}
      {activeTab === 'scope' && (
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {hasChecklist ? (
            <ScopeDocument scope={jobChecklist.scope} />
          ) : (
            <NoChecklistMessage />
          )}
        </div>
      )}

      {/* Process Tab */}
      {activeTab === 'process' && (
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {hasChecklist ? (
            <WorkProcess steps={jobChecklist.process} />
          ) : (
            <NoChecklistMessage />
          )}
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {hasChecklist ? (
            <ChecklistProgress
              items={checklistItems}
              onToggle={handleToggle}
              onPhotoUpload={handlePhotoUpload}
            />
          ) : (
            <NoChecklistMessage />
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {hasChecklist ? (
            <div className="space-y-6">
              <MaterialsList
                materials={materials}
                editable={true}
                onAdd={handleAddMaterial}
                onRemove={handleRemoveMaterial}
                onAdjust={handleAdjustMaterial}
              />

              {/* HD Price Tags — shown per material when prices loaded */}
              {hdPrices && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Home Depot Pricing
                  </h3>
                  {materials.map((m) => (
                    <HDPriceTag
                      key={m.id}
                      product={hdPrices[m.name]}
                      isLoading={false}
                      isMock={!hdPrices[m.name]}
                    />
                  ))}

                  {/* Summary */}
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Home Depot total at {hdStoreName}
                    </span>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                      ${(hdTotal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              {/* Loading shimmer when fetching */}
              {pricingLoading && (
                <div className="space-y-2">
                  {materials.slice(0, 3).map((m) => (
                    <HDPriceTag key={m.id} isLoading />
                  ))}
                </div>
              )}

              {/* Get HD Pricing button */}
              <button
                type="button"
                onClick={handleGetPricing}
                disabled={pricingLoading}
                className="w-full rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0ea5e9] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pricingLoading ? 'Checking Home Depot...' : hdPrices ? 'Refresh Home Depot Pricing' : 'Get Home Depot Pricing'}
              </button>

              {/* Delivery selection — shown after pricing */}
              {hdPrices && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Recommended Delivery
                  </h3>
                  <DeliverySelector
                    materials={materials}
                    onSelect={(tier) => setSelectedDeliveryTier(tier)}
                    selectedTier={selectedDeliveryTier}
                  />
                </div>
              )}

              {/* Send to client — shown after delivery selected */}
              {hdPrices && selectedDeliveryTier && (
                <>
                  {clientSent && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                      Materials list sent to client! They&apos;ll be notified to review and approve.
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setClientSent(true)}
                    disabled={clientSent}
                    className="w-full rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0ea5e9] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {clientSent ? 'Sent to Client' : 'Send to Client for Approval'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <NoChecklistMessage />
          )}
        </div>
      )}
    </div>
  );
}

function NoChecklistMessage() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Checklist will be generated when a bid is accepted.
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Scope, process, checklist, and materials are auto-generated for every active job.
      </p>
    </div>
  );
}
