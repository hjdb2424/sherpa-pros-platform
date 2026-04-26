'use client';

import { useState, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type MaterialStatus =
  | 'recommended'
  | 'pro_approved'
  | 'client_approved'
  | 'ordered'
  | 'delivered';

export interface MaterialEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCostCents: number;
  supplierSource: string;
  status: MaterialStatus;
  wisemanNotes?: string;
}

interface MaterialsTabProps {
  materials: MaterialEntry[];
  role: 'pro' | 'client';
  jobId: string;
  onApproveAll?: () => void;
  onApproveItem?: (id: string) => void;
  onRejectItem?: (id: string) => void;
  onOrderMaterials?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Status badge config                                                */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<MaterialStatus, { label: string; classes: string }> = {
  recommended: {
    label: 'Recommended',
    classes: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  pro_approved: {
    label: 'Pro Approved',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  client_approved: {
    label: 'Approved',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  ordered: {
    label: 'Ordered',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  delivered: {
    label: 'Delivered',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
};

/* ------------------------------------------------------------------ */
/*  Tooltip component                                                  */
/* ------------------------------------------------------------------ */

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        aria-label="More info"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs leading-relaxed text-zinc-600 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {text}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MaterialsTab({
  materials,
  role,
  jobId,
  onApproveAll,
  onApproveItem,
  onRejectItem,
  onOrderMaterials,
}: MaterialsTabProps) {
  const [localMaterials, setLocalMaterials] = useState(materials);

  const totalCents = useMemo(
    () => localMaterials.reduce((sum, m) => sum + m.estimatedCostCents * m.quantity, 0),
    [localMaterials],
  );

  const allApproved = useMemo(
    () => localMaterials.every((m) => m.status === 'client_approved' || m.status === 'ordered' || m.status === 'delivered'),
    [localMaterials],
  );

  const canApprove = role === 'pro'
    ? localMaterials.some((m) => m.status === 'recommended')
    : localMaterials.some((m) => m.status === 'pro_approved');

  const canOrder = allApproved && localMaterials.length > 0;

  const handleApproveAll = useCallback(() => {
    const nextStatus: MaterialStatus = role === 'pro' ? 'pro_approved' : 'client_approved';
    setLocalMaterials((prev) =>
      prev.map((m) => {
        if (role === 'pro' && m.status === 'recommended') return { ...m, status: nextStatus };
        if (role === 'client' && m.status === 'pro_approved') return { ...m, status: nextStatus };
        return m;
      }),
    );
    onApproveAll?.();
  }, [role, onApproveAll]);

  const handleApproveItem = useCallback((id: string) => {
    const nextStatus: MaterialStatus = role === 'pro' ? 'pro_approved' : 'client_approved';
    setLocalMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (role === 'pro' && m.status === 'recommended') return { ...m, status: nextStatus };
        if (role === 'client' && m.status === 'pro_approved') return { ...m, status: nextStatus };
        return m;
      }),
    );
    onApproveItem?.(id);
  }, [role, onApproveItem]);

  const handleRejectItem = useCallback((id: string) => {
    setLocalMaterials((prev) => prev.filter((m) => m.id !== id));
    onRejectItem?.(id);
  }, [onRejectItem]);

  const handleOrder = useCallback(() => {
    setLocalMaterials((prev) =>
      prev.map((m) =>
        m.status === 'client_approved' ? { ...m, status: 'ordered' as MaterialStatus } : m,
      ),
    );
    onOrderMaterials?.();
  }, [onOrderMaterials]);

  return (
    <div className="space-y-4">
      {/* Header + Approve All */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          Materials ({localMaterials.length} items)
        </h2>
        {canApprove && (
          <button
            type="button"
            onClick={handleApproveAll}
            className="rounded-full bg-[#00a9e0] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] active:scale-[0.97]"
          >
            Approve All
          </button>
        )}
      </div>

      {/* Materials table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Desktop header */}
        <div className="hidden border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:grid sm:grid-cols-12 sm:gap-2 dark:border-zinc-800 dark:bg-zinc-900/50">
          <span className="col-span-4">Material</span>
          <span className="col-span-1 text-right">Qty</span>
          <span className="col-span-1">Unit</span>
          <span className="col-span-2 text-right">Est. Cost</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {localMaterials.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No materials recommended yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {localMaterials.map((item) => {
              const statusCfg = STATUS_CONFIG[item.status];
              const lineCost = (item.estimatedCostCents * item.quantity) / 100;

              return (
                <div
                  key={item.id}
                  className="px-4 py-3 transition-colors hover:bg-zinc-50/50 sm:grid sm:grid-cols-12 sm:items-center sm:gap-2 dark:hover:bg-zinc-800/30"
                >
                  {/* Name + notes */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </span>
                      {item.wisemanNotes && <InfoTooltip text={item.wisemanNotes} />}
                    </div>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      {item.supplierSource === 'zinc' ? 'Supplier Direct' : 'Sherpa Hub'}
                    </span>
                  </div>

                  {/* Qty */}
                  <div className="col-span-1 mt-1 text-right text-sm font-medium text-zinc-700 sm:mt-0 dark:text-zinc-300">
                    <span className="mr-1 text-xs text-zinc-400 sm:hidden">Qty:</span>
                    {item.quantity}
                  </div>

                  {/* Unit */}
                  <div className="col-span-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {item.unit}
                  </div>

                  {/* Cost */}
                  <div className="col-span-2 mt-1 text-right text-sm font-semibold text-zinc-900 sm:mt-0 dark:text-zinc-100">
                    <span className="mr-1 text-xs text-zinc-400 sm:hidden">Cost:</span>
                    ${lineCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  {/* Status badge */}
                  <div className="col-span-2 mt-2 sm:mt-0">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusCfg.classes}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 mt-2 flex justify-end gap-1.5 sm:mt-0">
                    {((role === 'pro' && item.status === 'recommended') ||
                      (role === 'client' && item.status === 'pro_approved')) && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveItem(item.id)}
                          className="rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-600"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectItem(item.id)}
                          className="rounded-md border border-zinc-300 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          Remove
                        </button>
                      </>
                    )}
                    {item.status === 'ordered' && (
                      <span className="text-[11px] text-orange-600 dark:text-orange-400">In progress</span>
                    )}
                    {item.status === 'delivered' && (
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Total */}
      {localMaterials.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Estimated Total
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            ${(totalCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* Order button */}
      {canOrder && (
        <button
          type="button"
          onClick={handleOrder}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00a9e0] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Order Materials
        </button>
      )}
    </div>
  );
}
