'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { formatCents } from '@/lib/pricing/fee-calculator';
import {
  type Quote,
  type QuoteLineItem,
  calculateQuoteTotals,
  recalcLineItem,
} from '@/lib/services/quote-builder';
import { validateQuote, getConfidenceLevel } from '@/lib/services/wiseman-validator';
import QuotePreview from './QuotePreview';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuoteBuilderProps {
  jobId: string;
  jobTitle: string;
  onSend?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  labor: 'Labor',
  materials: 'Materials',
  equipment: 'Equipment',
  permit: 'Permits & Fees',
  disposal: 'Disposal',
  other: 'Other',
};

const CATEGORY_ORDER: QuoteLineItem['category'][] = [
  'labor',
  'materials',
  'equipment',
  'permit',
  'disposal',
  'other',
];

const PAYMENT_OPTIONS = [
  { value: '50% deposit, 50% on completion', label: '50/50 — Deposit + Completion' },
  { value: 'Due on completion', label: 'Due on Completion' },
  { value: '33% deposit, 33% midpoint, 34% completion', label: '3 Milestones' },
  { value: 'custom', label: 'Custom Terms' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  sent: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  viewed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuoteBuilder({ jobId, jobTitle, onSend }: QuoteBuilderProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Global markup overrides
  const [laborMarkup, setLaborMarkup] = useState(30);
  const [materialsMarkup, setMaterialsMarkup] = useState(20);
  const [otherMarkup, setOtherMarkup] = useState(10);

  // Load or generate quote
  useEffect(() => {
    let cancelled = false;
    async function loadQuote() {
      setLoading(true);
      try {
        // Check for existing quote
        const listRes = await fetch(`/api/quotes?jobId=${jobId}`);
        const listData = await listRes.json();
        if (!cancelled && listData.quotes?.length > 0) {
          setQuote(listData.quotes[0]);
          setLoading(false);
          return;
        }
        // Generate new quote
        const createRes = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        });
        const createData = await createRes.json();
        if (!cancelled && createData.quote) {
          setQuote(createData.quote);
        }
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadQuote();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  // ---------------------------------------------------------------------------
  // Line item manipulation
  // ---------------------------------------------------------------------------

  const updateLineItem = useCallback((itemId: string, changes: Partial<QuoteLineItem>) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const lineItems = prev.lineItems.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, ...changes };
        if (changes.unitCostCents !== undefined || changes.markupPct !== undefined || changes.quantity !== undefined) {
          updated.proAdjusted = true;
        }
        return recalcLineItem(updated);
      });
      const totals = calculateQuoteTotals(lineItems, prev.taxPct, prev.discountPct);
      return { ...prev, lineItems, ...totals };
    });
  }, []);

  const removeLineItem = useCallback((itemId: string) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const lineItems = prev.lineItems.filter((item) => item.id !== itemId);
      const totals = calculateQuoteTotals(lineItems, prev.taxPct, prev.discountPct);
      return { ...prev, lineItems, ...totals };
    });
  }, []);

  const addLineItem = useCallback((category: QuoteLineItem['category']) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const defaultMarkup = category === 'labor' ? 30 : category === 'materials' ? 20 : 10;
      const newItem: QuoteLineItem = {
        id: `li-new-${Date.now()}`,
        category,
        description: '',
        quantity: 1,
        unit: category === 'labor' ? 'hr' : 'ea',
        unitCostCents: 0,
        markupPct: defaultMarkup,
        totalCents: 0,
        wisemanSuggested: false,
        proAdjusted: true,
      };
      const lineItems = [...prev.lineItems, newItem];
      const totals = calculateQuoteTotals(lineItems, prev.taxPct, prev.discountPct);
      return { ...prev, lineItems, ...totals };
    });
  }, []);

  // Apply global markup to category
  const applyGlobalMarkup = useCallback((category: string, markupPct: number) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const lineItems = prev.lineItems.map((item) => {
        const matches =
          category === 'labor' ? item.category === 'labor' :
          category === 'materials' ? item.category === 'materials' :
          !['labor', 'materials'].includes(item.category);
        if (!matches) return item;
        return recalcLineItem({ ...item, markupPct });
      });
      const totals = calculateQuoteTotals(lineItems, prev.taxPct, prev.discountPct);
      return { ...prev, lineItems, ...totals };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setLaborMarkup(30);
    setMaterialsMarkup(20);
    setOtherMarkup(10);
    setQuote((prev) => {
      if (!prev) return prev;
      const lineItems = prev.lineItems.map((item) => {
        const markup = item.category === 'labor' ? 30 : item.category === 'materials' ? 20 : 10;
        return recalcLineItem({ ...item, markupPct: markup, proAdjusted: false });
      });
      const totals = calculateQuoteTotals(lineItems, 0, 0);
      return { ...prev, lineItems, ...totals, taxPct: 0, discountPct: 0 };
    });
  }, []);

  // Update tax/discount
  const updateField = useCallback((field: 'taxPct' | 'discountPct' | 'scopeOfWork' | 'timeline' | 'paymentTerms' | 'validUntil', value: string | number) => {
    setQuote((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === 'taxPct' || field === 'discountPct') {
        const totals = calculateQuoteTotals(updated.lineItems, updated.taxPct, updated.discountPct);
        Object.assign(updated, totals);
      }
      return updated;
    });
  }, []);

  // Save draft
  const saveDraft = useCallback(async () => {
    if (!quote) return;
    setSaving(true);
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, [quote]);

  // Send quote
  const sendQuote = useCallback(async () => {
    if (!quote) return;
    setSaving(true);
    try {
      // Save first
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });
      // Then send
      const res = await fetch(`/api/quotes/${quote.id}/send`, { method: 'POST' });
      const data = await res.json();
      if (data.quote) {
        setQuote(data.quote);
        setSendSuccess(true);
        setShowConfirm(false);
        onSend?.();
        setTimeout(() => setSendSuccess(false), 4000);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, [quote, onSend]);

  // Margin calculation
  const marginInfo = useMemo(() => {
    if (!quote) return { marginCents: 0, marginPct: 0 };
    const costCents = quote.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCostCents,
      0,
    );
    const marginCents = quote.subtotalCents - costCents;
    const marginPct = costCents > 0 ? Math.round((marginCents / costCents) * 100) : 0;
    return { marginCents, marginPct };
  }, [quote]);

  // Wiseman confidence validation
  const quoteValidation = useMemo(() => {
    if (!quote) return null;
    return validateQuote(
      quote.lineItems.map((item) => ({
        description: item.description,
        category: item.category,
      })),
    );
  }, [quote]);

  // Group line items by category
  const groupedItems = useMemo(() => {
    if (!quote) return {};
    const groups: Record<string, QuoteLineItem[]> = {};
    for (const item of quote.lineItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [quote]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-32 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Failed to load quote. Please try again.</p>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Editor
        </button>
        <QuotePreview quote={quote} mode="pro" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success toast */}
      {sendSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quote sent to client!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Build Quote</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{jobTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[quote.status]}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Wiseman Confidence Banner */}
      {quoteValidation && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            quoteValidation.overallConfidence >= 95
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
              : quoteValidation.overallConfidence >= 90
                ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
              quoteValidation.overallConfidence >= 95
                ? 'bg-emerald-500'
                : quoteValidation.overallConfidence >= 90
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            }`}
          >
            {quoteValidation.overallConfidence}%
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                quoteValidation.overallConfidence >= 95
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : quoteValidation.overallConfidence >= 90
                    ? 'text-amber-800 dark:text-amber-300'
                    : 'text-red-800 dark:text-red-300'
              }`}
            >
              Quote Confidence: {quoteValidation.overallConfidence}%
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {quoteValidation.summary}
            </p>
          </div>
        </div>
      )}

      {/* Margin Controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Markup Controls</h3>
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0]"
          >
            Reset Defaults
          </button>
        </div>

        {/* Wiseman suggestion */}
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 dark:bg-sky-900/20">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00a9e0] text-[10px] font-bold text-white">W</span>
          <span className="text-xs text-sky-700 dark:text-sky-300">
            Suggested 25% avg markup for this trade in your area
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MarkupSlider
            label="Labor"
            value={laborMarkup}
            onChange={(v) => {
              setLaborMarkup(v);
              applyGlobalMarkup('labor', v);
            }}
          />
          <MarkupSlider
            label="Materials"
            value={materialsMarkup}
            onChange={(v) => {
              setMaterialsMarkup(v);
              applyGlobalMarkup('materials', v);
            }}
          />
          <MarkupSlider
            label="Other"
            value={otherMarkup}
            onChange={(v) => {
              setOtherMarkup(v);
              applyGlobalMarkup('other', v);
            }}
          />
        </div>
      </div>

      {/* Line Items by Category */}
      {CATEGORY_ORDER.map((cat) => {
        const items = groupedItems[cat];
        if (!items || items.length === 0) {
          // Show "Add" button for empty categories
          if (['labor', 'materials', 'equipment'].includes(cat)) {
            return (
              <div key={cat} className="rounded-xl border border-dashed border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{CATEGORY_LABELS[cat]}</span>
                  <button
                    type="button"
                    onClick={() => addLineItem(cat)}
                    className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0]"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            );
          }
          return null;
        }

        return (
          <div key={cat} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {CATEGORY_LABELS[cat]}
              </h3>
              <button
                type="button"
                onClick={() => addLineItem(cat)}
                className="text-xs font-medium text-[#00a9e0] hover:text-[#0090c0]"
              >
                + Add Item
              </button>
            </div>

            {/* Table Header (hidden on mobile, shown sm+) */}
            <div className="hidden border-b border-zinc-100 px-4 py-2 sm:grid sm:grid-cols-12 sm:gap-2 dark:border-zinc-800">
              <span className="col-span-4 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Description</span>
              <span className="col-span-1 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400">Qty</span>
              <span className="col-span-1 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400">Unit</span>
              <span className="col-span-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">Unit Cost</span>
              <span className="col-span-2 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400">Markup %</span>
              <span className="col-span-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">Total</span>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {items.map((item, idx) => {
                const validation = quoteValidation?.itemValidations[
                  quote.lineItems.indexOf(item)
                ];
                const conf = validation
                  ? getConfidenceLevel(validation.confidence)
                  : undefined;
                return (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    onUpdate={updateLineItem}
                    onRemove={removeLineItem}
                    confidenceLevel={conf}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Totals */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2">
          <TotalRow label="Labor" cents={quote.laborSubtotalCents} />
          <TotalRow label="Materials" cents={quote.materialsSubtotalCents} />
          <TotalRow label="Other" cents={quote.otherSubtotalCents} />
          <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800">
            <TotalRow label="Subtotal" cents={quote.subtotalCents} bold />
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">Tax</span>
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={quote.taxPct}
                onChange={(e) => updateField('taxPct', parseFloat(e.target.value) || 0)}
                className="w-16 rounded-md border border-zinc-200 px-2 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                aria-label="Tax percentage"
              />
              <span className="text-xs text-zinc-400">%</span>
            </div>
            <span className="text-zinc-600 dark:text-zinc-300">{formatCents(quote.taxCents)}</span>
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400">Discount</span>
              <input
                type="number"
                min={0}
                max={50}
                step={1}
                value={quote.discountPct}
                onChange={(e) => updateField('discountPct', parseFloat(e.target.value) || 0)}
                className="w-16 rounded-md border border-zinc-200 px-2 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                aria-label="Discount percentage"
              />
              <span className="text-xs text-zinc-400">%</span>
            </div>
            <span className="text-zinc-600 dark:text-zinc-300">
              {quote.discountCents > 0 ? `-${formatCents(quote.discountCents)}` : formatCents(0)}
            </span>
          </div>

          {/* Grand Total */}
          <div className="border-t-2 border-[#00a9e0] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Grand Total</span>
              <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {formatCents(quote.totalCents)}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-emerald-600 dark:text-emerald-400">
              Your margin: {formatCents(marginInfo.marginCents)} ({marginInfo.marginPct}%)
            </p>
          </div>
        </div>
      </div>

      {/* Scope & Terms */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-50">Scope & Terms</h3>

        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Scope of Work
        </label>
        <textarea
          rows={4}
          value={quote.scopeOfWork}
          onChange={(e) => updateField('scopeOfWork', e.target.value)}
          className="mb-4 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          aria-label="Scope of work"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Timeline
            </label>
            <input
              type="text"
              value={quote.timeline}
              onChange={(e) => updateField('timeline', e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label="Estimated timeline"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Payment Terms
            </label>
            <select
              value={PAYMENT_OPTIONS.find((o) => o.value === quote.paymentTerms) ? quote.paymentTerms : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') updateField('paymentTerms', e.target.value);
              }}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label="Payment terms"
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Valid Until
            </label>
            <input
              type="date"
              value={quote.validUntil.slice(0, 10)}
              onChange={(e) => updateField('validUntil', new Date(e.target.value).toISOString())}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label="Valid until date"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={saveDraft}
          disabled={saving}
          className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="rounded-full border border-[#00a9e0]/30 px-5 py-2.5 text-sm font-semibold text-[#00a9e0] transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20"
        >
          Preview Quote
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={quote.status !== 'draft' || saving}
          className="rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to Client
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Confirm send quote">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Send Quote?</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              This will send a {formatCents(quote.totalCents)} quote to {quote.clientName}. They will be notified immediately.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendQuote}
                disabled={saving}
                className="flex-1 rounded-full bg-[#00a9e0] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 hover:bg-[#0090c0] disabled:opacity-50"
              >
                {saving ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MarkupSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={50}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#00a9e0] dark:bg-zinc-700"
        aria-label={`${label} markup percentage`}
      />
    </div>
  );
}

function LineItemRow({
  item,
  onUpdate,
  onRemove,
  confidenceLevel,
}: {
  item: QuoteLineItem;
  onUpdate: (id: string, changes: Partial<QuoteLineItem>) => void;
  onRemove: (id: string) => void;
  confidenceLevel?: { label: string; colorClass: string; bgClass: string };
}) {
  // We don't have original cost stored, so approximate market rate warning:
  // If markup > 50%, warn
  const highMarkup = item.markupPct > 50;

  return (
    <div className="px-4 py-3">
      {/* Mobile layout */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {item.wisemanSuggested && !item.proAdjusted && (
              <span className="inline-flex h-4 items-center rounded-full bg-[#00a9e0]/10 px-1.5 text-[9px] font-bold text-[#00a9e0]" title="Generated by system">
                W
              </span>
            )}
            {item.proAdjusted && (
              <span className="inline-flex h-4 items-center rounded-full bg-amber-100 px-1.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Edited
              </span>
            )}
            <input
              type="text"
              value={item.description}
              onChange={(e) => onUpdate(item.id, { description: e.target.value })}
              className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-sm font-medium text-zinc-800 outline-none focus:ring-0 dark:text-zinc-200"
              placeholder="Item description"
              aria-label="Line item description"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            aria-label={`Remove ${item.description || 'item'}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })}
            className="w-14 rounded-md border border-zinc-200 px-2 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            aria-label="Quantity"
          />
          <span className="text-xs text-zinc-400">{item.unit}</span>
          <span className="text-xs text-zinc-400">@</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={(item.unitCostCents / 100).toFixed(2)}
              onChange={(e) => onUpdate(item.id, { unitCostCents: Math.round(parseFloat(e.target.value || '0') * 100) })}
              className="w-20 rounded-md border border-zinc-200 py-1 pl-5 pr-2 text-right text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label="Unit cost"
            />
          </div>
          <span className="text-xs text-zinc-400">+</span>
          <input
            type="number"
            min={0}
            max={100}
            value={item.markupPct}
            onChange={(e) => onUpdate(item.id, { markupPct: parseFloat(e.target.value) || 0 })}
            className="w-12 rounded-md border border-zinc-200 px-1 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            aria-label="Markup percentage"
          />
          <span className="text-xs text-zinc-400">%</span>
          <span className="ml-auto text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCents(item.totalCents)}
          </span>
        </div>
        {highMarkup && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Markup significantly above typical range
          </p>
        )}
        {confidenceLevel && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${confidenceLevel.bgClass} ${confidenceLevel.colorClass}`}>
            {confidenceLevel.label}
          </span>
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid sm:grid-cols-12 sm:items-center sm:gap-2">
        <div className="col-span-4 flex items-center gap-1.5 min-w-0">
          {item.wisemanSuggested && !item.proAdjusted && (
            <span className="inline-flex h-4 shrink-0 items-center rounded-full bg-[#00a9e0]/10 px-1.5 text-[9px] font-bold text-[#00a9e0]">
              W
            </span>
          )}
          {item.proAdjusted && (
            <span className="inline-flex h-4 shrink-0 items-center rounded-full bg-amber-100 px-1.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Edited
            </span>
          )}
          <input
            type="text"
            value={item.description}
            onChange={(e) => onUpdate(item.id, { description: e.target.value })}
            className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-sm text-zinc-800 outline-none focus:ring-0 dark:text-zinc-200"
            placeholder="Item description"
            aria-label="Line item description"
          />
          {confidenceLevel && (
            <span className={`ml-1 inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${confidenceLevel.bgClass} ${confidenceLevel.colorClass}`}>
              {confidenceLevel.label}
            </span>
          )}
        </div>
        <div className="col-span-1">
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-md border border-zinc-200 px-2 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            aria-label="Quantity"
          />
        </div>
        <div className="col-span-1 text-center text-xs text-zinc-400">{item.unit}</div>
        <div className="col-span-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={(item.unitCostCents / 100).toFixed(2)}
              onChange={(e) => onUpdate(item.id, { unitCostCents: Math.round(parseFloat(e.target.value || '0') * 100) })}
              className="w-full rounded-md border border-zinc-200 py-1 pl-5 pr-2 text-right text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              aria-label="Unit cost"
            />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-1">
          <input
            type="number"
            min={0}
            max={100}
            value={item.markupPct}
            onChange={(e) => onUpdate(item.id, { markupPct: parseFloat(e.target.value) || 0 })}
            className="w-14 rounded-md border border-zinc-200 px-2 py-1 text-center text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            aria-label="Markup percentage"
          />
          <span className="text-xs text-zinc-400">%</span>
          {highMarkup && (
            <span className="text-amber-500" title="Significantly different from market rate">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <div className="col-span-1 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {formatCents(item.totalCents)}
        </div>
        <div className="col-span-1 text-right">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            aria-label={`Remove ${item.description || 'item'}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, cents, bold }: { label: string; cents: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? 'font-semibold text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'}>
        {label}
      </span>
      <span className={bold ? 'font-semibold text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-300'}>
        {formatCents(cents)}
      </span>
    </div>
  );
}
