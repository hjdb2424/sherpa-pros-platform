'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { MaterialItem } from '@/lib/mock-data/checklist-data';
import { formatCents } from '@/lib/pricing/fee-calculator';

interface MaterialsListProps {
  materials: MaterialItem[];
  onAdd?: (item: Partial<MaterialItem>) => void;
  onRemove?: (id: string, notes: string) => void;
  onAdjust?: (id: string, qty: number, notes: string) => void;
  editable?: boolean;
}

type ReviewStatus = 'approved' | 'warning' | 'flagged';

const reviewStyles: Record<ReviewStatus, { bg: string; text: string; label: string }> = {
  approved: {
    bg: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Approved',
  },
  warning: {
    bg: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Warning',
  },
  flagged: {
    bg: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    label: 'Flagged',
  },
};

function ReviewBadge({
  status,
  wisemanNotes,
}: {
  status: ReviewStatus;
  wisemanNotes?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = reviewStyles[status];

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => wisemanNotes && setExpanded(!expanded)}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${style.bg} ${style.text} ${
          wisemanNotes ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
        }`}
        aria-expanded={wisemanNotes ? expanded : undefined}
        aria-haspopup="true"
      >
        {style.label}
        {wisemanNotes && (
          <InformationCircleIcon className="h-3 w-3" aria-hidden="true" />
        )}
      </button>
      {expanded && wisemanNotes && (
        <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-600 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {wisemanNotes}
        </div>
      )}
    </div>
  );
}

function AddedByBadge({ addedBy }: { addedBy: 'wiseman' | 'pro' }) {
  if (addedBy === 'wiseman') {
    return (
      <span className="rounded-full bg-[#00a9e0]/10 px-2 py-0.5 text-[10px] font-medium text-[#00a9e0]">
        Auto-selected
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
      Pro
    </span>
  );
}

function InlineNoteInput({
  actionLabel,
  onConfirm,
  onCancel,
}: {
  actionLabel: string;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState('');
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={`Reason for ${actionLabel}...`}
        className="h-7 w-36 rounded border border-zinc-300 px-2 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') onConfirm(note);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <button
        type="button"
        onClick={() => onConfirm(note)}
        className="rounded p-0.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        aria-label={`Confirm ${actionLabel}`}
      >
        <CheckIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        aria-label="Cancel"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function MaterialsList({
  materials,
  onAdd,
  onRemove,
  onAdjust,
  editable = false,
}: MaterialsListProps) {
  const total = useMemo(
    () => materials.reduce((sum, m) => sum + (m.priceCents ?? 0) * (m.quantity ?? 1), 0),
    [materials]
  );

  // Track which item is pending a remove or adjust note
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [pendingAdjust, setPendingAdjust] = useState<{ id: string; qty: number } | null>(null);

  return (
    <section
      className="rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-label="Materials List"
    >
      <div className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Materials
        </h2>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                Item
              </th>
              <th className="px-3 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                Qty
              </th>
              <th className="px-3 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                Unit
              </th>
              <th className="px-3 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                Spec
              </th>
              <th className="px-3 py-2.5 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Price
              </th>
              <th className="px-3 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                Review
              </th>
              {editable && (
                <th className="px-3 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {materials.map((mat) => (
              <tr
                key={mat.id}
                className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {mat.name}
                    </span>
                    <AddedByBadge addedBy={mat.addedBy} />
                  </div>
                  {mat.proNotes && (
                    <p className="mt-0.5 text-xs italic text-zinc-500 dark:text-zinc-400">
                      {mat.proNotes}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 text-zinc-700 dark:text-zinc-300">
                  {editable && onAdjust ? (
                    pendingAdjust?.id === mat.id ? (
                      <InlineNoteInput
                        actionLabel="adjustment"
                        onConfirm={(note) => { onAdjust(mat.id, pendingAdjust.qty, note); setPendingAdjust(null); }}
                        onCancel={() => setPendingAdjust(null)}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPendingAdjust({ id: mat.id, qty: Math.max(0, (mat.quantity ?? 1) - 1) })
                          }
                          className="rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98] dark:hover:bg-zinc-700"
                          aria-label={`Decrease quantity of ${mat.name}`}
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2ch] text-center">{mat.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingAdjust({ id: mat.id, qty: (mat.quantity ?? 1) + 1 })
                          }
                          className="rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98] dark:hover:bg-zinc-700"
                          aria-label={`Increase quantity of ${mat.name}`}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  ) : (
                    mat.quantity
                  )}
                </td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">
                  {mat.unit}
                </td>
                <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">
                  {mat.spec ?? '\u2014'}
                </td>
                <td className="px-3 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">
                  {mat.priceCents != null
                    ? formatCents(mat.priceCents * (mat.quantity ?? 1))
                    : '\u2014'}
                </td>
                <td className="px-3 py-3">
                  {mat.wisemanReview && (
                    <ReviewBadge
                      status={mat.wisemanReview}
                      wisemanNotes={mat.wisemanNotes}
                    />
                  )}
                </td>
                {editable && (
                  <td className="px-3 py-3">
                    {mat.wisemanReview !== 'flagged' && onRemove && (
                      pendingRemoveId === mat.id ? (
                        <InlineNoteInput
                          actionLabel="removal"
                          onConfirm={(note) => { onRemove(mat.id, note); setPendingRemoveId(null); }}
                          onCancel={() => setPendingRemoveId(null)}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingRemoveId(mat.id)}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98] dark:hover:bg-red-900/20"
                          aria-label={`Remove ${mat.name}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )
                    )}
                    {mat.wisemanReview === 'flagged' && (
                      <span className="text-xs text-red-500" title="Cannot remove flagged items">
                        <ExclamationTriangleIcon className="inline h-4 w-4" />
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add row */}
        {editable && onAdd && (
          <div className="border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => onAdd({})}
              className="flex items-center gap-1.5 text-sm font-medium text-[#00a9e0] transition-colors hover:text-[#0090c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Item
            </button>
          </div>
        )}
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-3 px-5 pb-5 md:hidden sm:px-6 sm:pb-6">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {mat.name}
                  </span>
                  <AddedByBadge addedBy={mat.addedBy} />
                </div>
                {mat.proNotes && (
                  <p className="mt-0.5 text-xs italic text-zinc-500 dark:text-zinc-400">
                    {mat.proNotes}
                  </p>
                )}
              </div>
              {mat.wisemanReview && (
                <ReviewBadge
                  status={mat.wisemanReview}
                  wisemanNotes={mat.wisemanNotes}
                />
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Qty: {mat.quantity} {mat.unit}
              </span>
              {mat.spec && <span>Spec: {mat.spec}</span>}
              {mat.priceCents != null && (
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {formatCents(mat.priceCents * (mat.quantity ?? 1))}
                </span>
              )}
            </div>

            {/* Wiseman notes callout for warning/flagged */}
            {mat.wisemanNotes &&
              (mat.wisemanReview === 'warning' || mat.wisemanReview === 'flagged') && (
                <div
                  className={`mt-2 rounded-md p-2 text-xs ${
                    mat.wisemanReview === 'flagged'
                      ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                  }`}
                >
                  {mat.wisemanNotes}
                </div>
              )}

            {/* Mobile actions */}
            {editable && (
              <div className="mt-2 flex items-center gap-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                {onAdjust && (
                  pendingAdjust?.id === mat.id ? (
                    <InlineNoteInput
                      actionLabel="adjustment"
                      onConfirm={(note) => { onAdjust(mat.id, pendingAdjust.qty, note); setPendingAdjust(null); }}
                      onCancel={() => setPendingAdjust(null)}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAdjust({ id: mat.id, qty: Math.max(0, (mat.quantity ?? 1) - 1) })
                        }
                        className="rounded-md border border-zinc-200 p-1.5 text-zinc-500 transition-colors hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800"
                        aria-label={`Decrease quantity of ${mat.name}`}
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2ch] text-center text-sm text-zinc-700 dark:text-zinc-300">
                        {mat.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAdjust({ id: mat.id, qty: (mat.quantity ?? 1) + 1 })
                        }
                        className="rounded-md border border-zinc-200 p-1.5 text-zinc-500 transition-colors hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800"
                        aria-label={`Increase quantity of ${mat.name}`}
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                )}
                <div className="flex-1" />
                {mat.wisemanReview !== 'flagged' && onRemove && (
                  pendingRemoveId === mat.id ? (
                    <InlineNoteInput
                      actionLabel="removal"
                      onConfirm={(note) => { onRemove(mat.id, note); setPendingRemoveId(null); }}
                      onCancel={() => setPendingRemoveId(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingRemoveId(mat.id)}
                      className="rounded-md border border-red-200 p-1.5 text-red-500 transition-colors hover:bg-red-50 active:scale-[0.98] dark:border-red-800 dark:hover:bg-red-900/20"
                      aria-label={`Remove ${mat.name}`}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Mobile add button */}
        {editable && onAdd && (
          <button
            type="button"
            onClick={() => onAdd({})}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 py-3 text-sm font-medium text-[#00a9e0] transition-all hover:border-[#00a9e0] hover:bg-[#00a9e0]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] active:scale-[0.98] dark:border-zinc-600 dark:hover:border-[#00a9e0]"
          >
            <PlusIcon className="h-4 w-4" />
            Add Item
          </button>
        )}
      </div>

      {/* Total row */}
      <div className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Materials Total
          </span>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {formatCents(total)}
          </span>
        </div>
      </div>
    </section>
  );
}
