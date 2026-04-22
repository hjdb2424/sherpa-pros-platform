'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

/** Integer cents -> formatted display string */
function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

/** Shorthand: format whole-dollar amounts stored as cents */
function fmtK(cents: number): string {
  const abs = Math.abs(cents);
  if (abs >= 100_000_00) {
    const val = abs / 100_00;
    const sign = cents < 0 ? '-' : '';
    return `${sign}$${(val / 10).toFixed(1)}M`;
  }
  return formatCents(cents);
}

function formatPct(value: number): string {
  return `${value >= 0 ? '' : '-'}${Math.abs(value).toFixed(1)}%`;
}

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ */
/* Mock Data — Portfolio Summary                                       */
/* ------------------------------------------------------------------ */

const summaryCards = [
  {
    label: 'Gross Revenue',
    valueCents: 18_750_000,
    subLabel: '/mo',
    trend: [142, 148, 155, 160, 165, 170, 172, 176, 180, 183, 185, 187],
    trendUp: true,
    detail: '12-mo trend',
  },
  {
    label: 'Total Expenses',
    valueCents: 14_187_500,
    subLabel: '/mo',
    detail: 'OpEx $73,125 + Debt $68,750',
    pctOfRevenue: 75.7,
  },
  {
    label: 'Net Cash Flow',
    valueCents: 4_562_500,
    subLabel: '/mo',
    isPositive: true,
  },
  {
    label: 'Portfolio Value',
    valueCents: 2_050_000_000,
    appreciation: 4.2,
  },
  {
    label: 'Total Equity',
    valueCents: 820_000_000,
    detail: 'Value - Debt',
  },
  {
    label: 'Annualized Return',
    pctValue: 9.4,
    detail: 'Cash-on-cash',
  },
];

/* ------------------------------------------------------------------ */
/* Mock Data — Waterfall                                               */
/* ------------------------------------------------------------------ */

interface WaterfallRow {
  label: string;
  amountCents: number;
  type: 'income' | 'expense' | 'subtotal';
  runningCents: number;
  indent?: boolean;
}

const waterfallData: WaterfallRow[] = [
  { label: 'Gross Potential Rent', amountCents: 20_625_000, type: 'income', runningCents: 20_625_000 },
  { label: 'Vacancy Loss', amountCents: -1_875_000, type: 'expense', runningCents: 18_750_000, indent: true },
  { label: 'Effective Gross Income', amountCents: 18_750_000, type: 'subtotal', runningCents: 18_750_000 },
  { label: 'Maintenance', amountCents: -1_875_000, type: 'expense', runningCents: 16_875_000, indent: true },
  { label: 'Property Tax', amountCents: -2_812_500, type: 'expense', runningCents: 14_062_500, indent: true },
  { label: 'Insurance', amountCents: -937_500, type: 'expense', runningCents: 13_125_000, indent: true },
  { label: 'Utilities', amountCents: -562_500, type: 'expense', runningCents: 12_562_500, indent: true },
  { label: 'Management', amountCents: -562_500, type: 'expense', runningCents: 12_000_000, indent: true },
  { label: 'Other OpEx', amountCents: -562_500, type: 'expense', runningCents: 11_437_500, indent: true },
  { label: 'Net Operating Income', amountCents: 11_437_500, type: 'subtotal', runningCents: 11_437_500 },
  { label: 'Mortgage P&I', amountCents: -6_875_000, type: 'expense', runningCents: 4_562_500, indent: true },
  { label: 'Cash Flow Before Tax', amountCents: 4_562_500, type: 'subtotal', runningCents: 4_562_500 },
  { label: 'Estimated Tax', amountCents: -850_000, type: 'expense', runningCents: 3_712_500, indent: true },
  { label: 'Net Cash Flow', amountCents: 3_712_500, type: 'subtotal', runningCents: 3_712_500 },
];

const maxWaterfall = 20_625_000;

/* ------------------------------------------------------------------ */
/* Mock Data — Cost to Hold                                            */
/* ------------------------------------------------------------------ */

interface PropertyHold {
  id: string;
  name: string;
  monthlyCostCents: number;
  annualCostCents: number;
  costPerUnitCents: number;
  costPerSqftCents: number;
  mortgageCents: number;
  taxCents: number;
  insuranceCents: number;
  maintCents: number;
  otherCents: number;
  totalInCents: number;
  totalOutCents: number;
  netCents: number;
  units: number;
}

const propertiesHold: PropertyHold[] = [
  {
    id: 'maple-ridge', name: 'Maple Ridge',
    monthlyCostCents: 5_240_000, annualCostCents: 62_880_000,
    costPerUnitCents: 109_200, costPerSqftCents: 182,
    mortgageCents: 2_800_000, taxCents: 1_250_000, insuranceCents: 420_000, maintCents: 510_000, otherCents: 260_000,
    totalInCents: 7_200_000, totalOutCents: 5_240_000, netCents: 1_960_000, units: 48,
  },
  {
    id: '220-main', name: '220 Main St',
    monthlyCostCents: 1_820_000, annualCostCents: 21_840_000,
    costPerUnitCents: 121_300, costPerSqftCents: 210,
    mortgageCents: 980_000, taxCents: 540_000, insuranceCents: 180_000, maintCents: 340_000, otherCents: 120_000,
    totalInCents: 2_100_000, totalOutCents: 1_820_000, netCents: 280_000, units: 15,
  },
  {
    id: 'harbor-view', name: 'Harbor View',
    monthlyCostCents: 1_480_000, annualCostCents: 17_760_000,
    costPerUnitCents: 61_700, costPerSqftCents: 123,
    mortgageCents: 820_000, taxCents: 480_000, insuranceCents: 150_000, maintCents: 180_000, otherCents: 50_000,
    totalInCents: 2_400_000, totalOutCents: 1_480_000, netCents: 920_000, units: 24,
  },
  {
    id: 'student-housing', name: 'Student Housing',
    monthlyCostCents: 1_140_000, annualCostCents: 13_680_000,
    costPerUnitCents: 31_700, costPerSqftCents: 95,
    mortgageCents: 650_000, taxCents: 320_000, insuranceCents: 90_000, maintCents: 90_000, otherCents: 40_000,
    totalInCents: 1_620_000, totalOutCents: 1_140_000, netCents: 480_000, units: 36,
  },
];

/* ------------------------------------------------------------------ */
/* Mock Data — OpEx Monthly Trend (12 months, in cents)                */
/* ------------------------------------------------------------------ */

const opexMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const opexValues = [6_800_000, 7_100_000, 7_400_000, 8_200_000, 7_000_000, 7_300_000, 7_100_000, 6_900_000, 7_200_000, 7_000_000, 7_300_000, 7_312_500];
const maxOpex = Math.max(...opexValues);

const opexCategories = [
  { label: 'Maintenance & Repairs', cents: 1_875_000, pct: 25.6, color: 'bg-[#00a9e0]' },
  { label: 'Property Tax', cents: 2_812_500, pct: 38.4, color: 'bg-[#ff4500]' },
  { label: 'Insurance', cents: 937_500, pct: 12.8, color: 'bg-amber-500' },
  { label: 'Utilities', cents: 562_500, pct: 7.7, color: 'bg-emerald-500' },
  { label: 'Management', cents: 562_500, pct: 7.7, color: 'bg-violet-500' },
  { label: 'Other', cents: 562_500, pct: 7.7, color: 'bg-zinc-400' },
];

/* ------------------------------------------------------------------ */
/* Mock Data — CapEx Projects                                          */
/* ------------------------------------------------------------------ */

interface CapExProject {
  description: string;
  property: string;
  amountCents: number;
  date: string;
  depreciationYears: number;
  roiNote: string;
}

const capexProjects: CapExProject[] = [
  { description: 'Kitchen remodel Unit 305', property: 'Maple Ridge', amountCents: 1_200_000, date: 'Jan 2026', depreciationYears: 15, roiNote: 'Rent increase $200/mo = 60-month payback' },
  { description: 'Parking lot reseal', property: '220 Main', amountCents: 850_000, date: 'Mar 2026', depreciationYears: 10, roiNote: 'Prevents $35K replacement; tenant retention' },
  { description: 'LED lighting upgrade', property: 'All Properties', amountCents: 420_000, date: 'Feb 2026', depreciationYears: 7, roiNote: 'Saves $270/mo electric = 16-month payback' },
  { description: 'In-unit washer/dryer', property: 'Student Housing', amountCents: 1_800_000, date: 'Nov 2025', depreciationYears: 10, roiNote: 'Rent increase $150/unit x 36 units = 33-month payback' },
];

const capexYTDCents = 2_470_000;
const capexBudgetCents = 5_000_000;
const reserveFundCents = 4_200_000;
const reserveRecommendedCents = 6_150_000; // $250-500/unit/yr, 123 units

/* ------------------------------------------------------------------ */
/* Mock Data — Deferred Maintenance                                    */
/* ------------------------------------------------------------------ */

interface DeferredItem {
  description: string;
  property: string;
  timeline: string;
  estimatedCents: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  annualCostIfIgnoredCents: number;
}

const deferredItems: DeferredItem[] = [
  { description: 'Boiler replacement (15 yrs old)', property: 'Maple Ridge', timeline: 'Within 2 years', estimatedCents: 4_500_000, risk: 'HIGH', annualCostIfIgnoredCents: 480_000 },
  { description: 'Roof sections — 5 years remaining', property: '220 Main', timeline: 'Within 5 years', estimatedCents: 8_500_000, risk: 'MEDIUM', annualCostIfIgnoredCents: 320_000 },
  { description: 'Parking lot needs reseal', property: 'Harbor View', timeline: 'This year', estimatedCents: 800_000, risk: 'LOW', annualCostIfIgnoredCents: 120_000 },
  { description: 'Windows (single pane) — energy loss $3,200/yr', property: 'Student Housing', timeline: 'Within 3 years', estimatedCents: 4_800_000, risk: 'MEDIUM', annualCostIfIgnoredCents: 320_000 },
];

const totalDeferredCents = deferredItems.reduce((s, d) => s + d.estimatedCents, 0);
const annualCostIfIgnoredCents = deferredItems.reduce((s, d) => s + d.annualCostIfIgnoredCents, 0);

/* ------------------------------------------------------------------ */
/* Mock Data — Improvement ROI                                         */
/* ------------------------------------------------------------------ */

interface ImprovementROI {
  improvement: string;
  property: string;
  costCents: number;
  date: string;
  metricBefore: string;
  metricAfter: string;
  monthlyGainCents: number | null;
  paybackMonths: number | null;
  roiPct: string;
}

const improvements: ImprovementROI[] = [
  { improvement: 'Kitchen remodel Unit 305', property: 'Maple Ridge', costCents: 1_200_000, date: 'Jan 2026', metricBefore: 'Rent $1,400', metricAfter: 'Rent $1,650', monthlyGainCents: 25_000, paybackMonths: 48, roiPct: '25%/yr' },
  { improvement: 'Parking lot reseal', property: '220 Main', costCents: 850_000, date: 'Mar 2026', metricBefore: '2 complaints/mo', metricAfter: '0 complaints', monthlyGainCents: null, paybackMonths: null, roiPct: 'Tenant retention' },
  { improvement: 'LED lighting upgrade', property: 'All', costCents: 420_000, date: 'Feb 2026', metricBefore: '$890/mo electric', metricAfter: '$620/mo electric', monthlyGainCents: 27_000, paybackMonths: 16, roiPct: '77%/yr' },
  { improvement: 'Washer/dryer in-unit', property: 'Student Housing', costCents: 1_800_000, date: 'Nov 2025', metricBefore: 'Rent $950', metricAfter: 'Rent $1,100', monthlyGainCents: 540_000, paybackMonths: 33, roiPct: '36%/yr' },
];

/* ------------------------------------------------------------------ */
/* Mock Data — Cash Flow Forecast (12 months)                          */
/* ------------------------------------------------------------------ */

interface ForecastMonth {
  month: string;
  optimisticCents: number;
  projectedCents: number;
  pessimisticCents: number;
  notes?: string;
}

const forecast: ForecastMonth[] = [
  { month: 'May \'26', optimisticCents: 4_800_000, projectedCents: 4_562_500, pessimisticCents: 4_200_000 },
  { month: 'Jun \'26', optimisticCents: 4_900_000, projectedCents: 4_600_000, pessimisticCents: 4_100_000 },
  { month: 'Jul \'26', optimisticCents: 5_000_000, projectedCents: 4_700_000, pessimisticCents: 4_000_000 },
  { month: 'Aug \'26', optimisticCents: 3_200_000, projectedCents: 1_800_000, pessimisticCents: 500_000, notes: '3 lease expirations + roof project' },
  { month: 'Sep \'26', optimisticCents: 4_600_000, projectedCents: 3_900_000, pessimisticCents: 3_200_000 },
  { month: 'Oct \'26', optimisticCents: 5_100_000, projectedCents: 4_800_000, pessimisticCents: 4_300_000 },
  { month: 'Nov \'26', optimisticCents: 5_200_000, projectedCents: 4_900_000, pessimisticCents: 4_400_000 },
  { month: 'Dec \'26', optimisticCents: 5_000_000, projectedCents: 4_700_000, pessimisticCents: 4_200_000 },
  { month: 'Jan \'27', optimisticCents: 4_800_000, projectedCents: 4_500_000, pessimisticCents: 4_000_000 },
  { month: 'Feb \'27', optimisticCents: 4_900_000, projectedCents: 4_600_000, pessimisticCents: 4_100_000 },
  { month: 'Mar \'27', optimisticCents: 5_100_000, projectedCents: 4_800_000, pessimisticCents: 4_300_000 },
  { month: 'Apr \'27', optimisticCents: 5_300_000, projectedCents: 5_000_000, pessimisticCents: 4_500_000 },
];

const forecastMax = Math.max(...forecast.map(f => f.optimisticCents));
const forecastMin = Math.min(...forecast.map(f => f.pessimisticCents));
const forecastRange = forecastMax - forecastMin;
const cashFlowThresholdCents = 2_000_000;

/* ------------------------------------------------------------------ */
/* Mock Data — Tax Optimization                                        */
/* ------------------------------------------------------------------ */

const scheduleEMapping = [
  { line: '3', description: 'Rents received', ytdCents: 225_000_000 },
  { line: '5', description: 'Advertising', ytdCents: 450_000 },
  { line: '6', description: 'Auto and travel', ytdCents: 180_000 },
  { line: '7', description: 'Cleaning and maintenance', ytdCents: 22_500_000 },
  { line: '8', description: 'Commissions', ytdCents: 0 },
  { line: '9', description: 'Insurance', ytdCents: 11_250_000 },
  { line: '10', description: 'Legal and professional fees', ytdCents: 750_000 },
  { line: '11', description: 'Management fees', ytdCents: 6_750_000 },
  { line: '12', description: 'Mortgage interest', ytdCents: 49_500_000 },
  { line: '13', description: 'Other interest', ytdCents: 0 },
  { line: '14', description: 'Repairs', ytdCents: 4_500_000 },
  { line: '16', description: 'Taxes', ytdCents: 33_750_000 },
  { line: '17', description: 'Utilities', ytdCents: 6_750_000 },
  { line: '18', description: 'Depreciation', ytdCents: 18_200_000 },
];

const depreciationSchedules = [
  { property: 'Maple Ridge', basisCents: 850_000_000, yearlyDepCents: 3_090_909, yearsRemaining: 18, type: '27.5-yr Residential' },
  { property: '220 Main St', basisCents: 420_000_000, yearlyDepCents: 1_076_923, yearsRemaining: 25, type: '39-yr Commercial (retail)' },
  { property: 'Harbor View', basisCents: 380_000_000, yearlyDepCents: 1_381_818, yearsRemaining: 20, type: '27.5-yr Residential' },
  { property: 'Student Housing', basisCents: 290_000_000, yearlyDepCents: 1_054_545, yearsRemaining: 22, type: '27.5-yr Residential' },
];

const vendors1099 = [
  { name: 'Mike Rodriguez Plumbing', ytdCents: 1_280_000, over600: true },
  { name: 'Sarah Chen Electric', ytdCents: 890_000, over600: true },
  { name: 'Carlos Rivera General', ytdCents: 2_100_000, over600: true },
  { name: 'Diana Brooks Painting', ytdCents: 450_000, over600: false },
  { name: 'James Wilson HVAC', ytdCents: 3_400_000, over600: true },
];

const capVsRepair = [
  { item: 'Kitchen remodel Unit 305', classification: 'Improvement', rationale: 'Betterment — adapts unit to new use or condition. Capitalize over 15 years.' },
  { item: 'Faucet replacement (Unit 204)', classification: 'Repair', rationale: 'Restores to original condition. Deduct in current year.' },
  { item: 'LED lighting upgrade', classification: 'Improvement', rationale: 'Betterment — materially increases energy efficiency. Capitalize over 7 years.' },
  { item: 'Roof patch (small section)', classification: 'Repair', rationale: 'Routine maintenance, no betterment. Deduct in current year.' },
];

/* ------------------------------------------------------------------ */
/* Sparkline Component                                                 */
/* ------------------------------------------------------------------ */

function Sparkline({ data, positive }: { data: number[]; positive?: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="inline-block" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#10b981' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sort Helper                                                         */
/* ------------------------------------------------------------------ */

type SortDir = 'asc' | 'desc';

function SortHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  align = 'right',
}: {
  label: string;
  sortKey: string;
  currentKey: string | null;
  currentDir: SortDir;
  onSort: (key: string) => void;
  align?: 'left' | 'right';
}) {
  const active = currentKey === sortKey;
  return (
    <th
      className={cn(
        'cursor-pointer select-none whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
        align === 'left' ? 'text-left' : 'text-right',
        active && 'text-[#00a9e0] dark:text-[#00a9e0]',
      )}
      onClick={() => onSort(sortKey)}
      role="columnheader"
      aria-sort={active ? (currentDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            {currentDir === 'asc'
              ? <path d="M6 2L10 8H2L6 2Z" />
              : <path d="M6 10L2 4H10L6 10Z" />
            }
          </svg>
        )}
      </span>
    </th>
  );
}

/* ------------------------------------------------------------------ */
/* Risk Badge                                                          */
/* ------------------------------------------------------------------ */

function RiskBadge({ risk }: { risk: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const styles = {
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    LOW: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[risk]}`}>
      {risk}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section Wrapper                                                     */
/* ------------------------------------------------------------------ */

function Section({ title, id, children, actions }: { title: string; id: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section id={id} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h2>
        {actions}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function FinanceDashboardPage() {
  /* Cost-to-hold table sort */
  const [holdSortKey, setHoldSortKey] = useState<string | null>(null);
  const [holdSortDir, setHoldSortDir] = useState<SortDir>('desc');

  const handleHoldSort = useCallback((key: string) => {
    setHoldSortDir(prev => (holdSortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setHoldSortKey(key);
  }, [holdSortKey]);

  const sortedProperties = useMemo(() => {
    if (!holdSortKey) return propertiesHold;
    const sorted = [...propertiesHold].sort((a, b) => {
      const aVal = (a as unknown as Record<string, number>)[holdSortKey];
      const bVal = (b as unknown as Record<string, number>)[holdSortKey];
      return holdSortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [holdSortKey, holdSortDir]);

  /* Waterfall drill-down */
  const [expandedWaterfall, setExpandedWaterfall] = useState<string | null>(null);

  const ytdDeductible = scheduleEMapping.reduce((s, row) => {
    if (row.line !== '3') return s + row.ytdCents;
    return s;
  }, 0);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Finance Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Portfolio financial performance as of April 2026
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m0 0a48.003 48.003 0 0 1 12.5 0m-12.5 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v3.284" />
            </svg>
            Print Report
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Section 1: Portfolio Financial Summary (6 cards)                */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {summaryCards.map((card) => {
          const isPositive = card.isPositive ?? (card.valueCents ? card.valueCents > 0 : true);
          return (
            <div
              key={card.label}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {card.label}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                {card.pctValue !== undefined ? (
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPct(card.pctValue)}
                  </p>
                ) : (
                  <p className={cn(
                    'text-2xl font-bold',
                    card.label === 'Net Cash Flow'
                      ? (isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')
                      : 'text-zinc-900 dark:text-white',
                  )}>
                    {card.valueCents !== undefined ? (
                      card.valueCents >= 100_000_000 ? fmtK(card.valueCents) : formatCents(card.valueCents)
                    ) : ''}
                  </p>
                )}
                {card.subLabel && (
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">{card.subLabel}</span>
                )}
              </div>
              {card.trend && <Sparkline data={card.trend} positive={card.trendUp} />}
              {card.detail && (
                <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{card.detail}</p>
              )}
              {card.pctOfRevenue !== undefined && (
                <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                  {formatPct(card.pctOfRevenue)} of revenue
                </p>
              )}
              {card.appreciation !== undefined && (
                <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  +{formatPct(card.appreciation)} appreciation
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* Section 2: Money In vs Money Out (Waterfall)                    */}
      {/* ============================================================== */}
      <Section title="Money In vs Money Out" id="waterfall">
        <div className="space-y-1">
          {waterfallData.map((row) => {
            const barWidth = Math.abs(row.amountCents) / maxWaterfall * 100;
            const isSubtotal = row.type === 'subtotal';
            const isExpense = row.type === 'expense';
            const isExpanded = expandedWaterfall === row.label;

            return (
              <div key={row.label}>
                <button
                  type="button"
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800',
                    isSubtotal && 'bg-zinc-50 dark:bg-zinc-800/50',
                  )}
                  onClick={() => setExpandedWaterfall(isExpanded ? null : row.label)}
                  aria-expanded={isExpanded}
                >
                  {/* Label */}
                  <span className={cn(
                    'w-52 shrink-0 text-sm',
                    row.indent && 'pl-4',
                    isSubtotal ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400',
                  )}>
                    {isExpense && '- '}{row.label}
                  </span>

                  {/* Bar */}
                  <div className="relative flex-1">
                    <div className="h-7 w-full rounded bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={cn(
                          'h-7 rounded transition-all',
                          isSubtotal ? 'bg-[#00a9e0]/20 dark:bg-[#00a9e0]/30' :
                          isExpense ? 'bg-red-400/70 dark:bg-red-500/50' :
                          'bg-emerald-400/70 dark:bg-emerald-500/50',
                        )}
                        style={{ width: `${Math.min(barWidth, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <span className={cn(
                    'w-28 shrink-0 text-right text-sm font-mono tabular-nums',
                    isSubtotal ? 'font-bold text-zinc-900 dark:text-white' :
                    isExpense ? 'text-red-600 dark:text-red-400' :
                    'text-emerald-600 dark:text-emerald-400',
                  )}>
                    {row.amountCents < 0 ? '-' : ''}{formatCents(Math.abs(row.amountCents))}
                  </span>

                  {/* Running total */}
                  <span className="w-28 shrink-0 text-right text-xs font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
                    = {formatCents(row.runningCents)}
                  </span>
                </button>

                {/* Drill-down placeholder */}
                {isExpanded && (
                  <div className="ml-56 mb-2 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                    <p className="font-medium">Breakdown for &ldquo;{row.label}&rdquo;</p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {propertiesHold.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span>{p.name}</span>
                          <span className="font-mono tabular-nums">
                            {formatCents(Math.round(Math.abs(row.amountCents) * (p.units / 123)))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ============================================================== */}
      {/* Section 3: Cost to Hold (per-property table)                    */}
      {/* ============================================================== */}
      <Section title="Cost to Hold" id="cost-to-hold"
        actions={
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Click column headers to sort</span>
        }
      >
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[1100px] text-sm" role="table" aria-label="Cost to hold per property">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <SortHeader label="Property" sortKey="name" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} align="left" />
                <SortHeader label="Monthly Cost" sortKey="monthlyCostCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Annual Cost" sortKey="annualCostCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Cost/Unit" sortKey="costPerUnitCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Cost/SqFt" sortKey="costPerSqftCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Mortgage" sortKey="mortgageCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Tax" sortKey="taxCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Insurance" sortKey="insuranceCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Maint" sortKey="maintCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Total In" sortKey="totalInCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Total Out" sortKey="totalOutCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
                <SortHeader label="Net" sortKey="netCents" currentKey={holdSortKey} currentDir={holdSortDir} onSort={handleHoldSort} />
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((p) => {
                const isWorst = p.netCents === Math.min(...propertiesHold.map(x => x.netCents));
                const netColor = p.netCents > 500_000 ? 'text-emerald-600 dark:text-emerald-400' :
                  p.netCents > 0 ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-600 dark:text-red-400';
                return (
                  <tr
                    key={p.id}
                    className={cn(
                      'border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50',
                      isWorst && 'bg-red-50/50 dark:bg-red-500/5',
                    )}
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-left font-medium text-zinc-900 dark:text-white">
                      <Link href={`/pm/properties/${p.id}`} className="hover:text-[#00a9e0] transition-colors">
                        {p.name}
                      </Link>
                      {isWorst && (
                        <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                          LOWEST
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{formatCents(p.monthlyCostCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{formatCents(p.annualCostCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-500 dark:text-zinc-400">{formatCents(p.costPerUnitCents)}/unit</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-500 dark:text-zinc-400">${(p.costPerSqftCents / 100).toFixed(2)}/sqft</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{formatCents(p.mortgageCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{formatCents(p.taxCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{formatCents(p.insuranceCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{formatCents(p.maintCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{formatCents(p.totalInCents)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums text-red-600 dark:text-red-400">{formatCents(p.totalOutCents)}</td>
                    <td className={cn('whitespace-nowrap px-3 py-3 text-right font-mono tabular-nums font-bold', netColor)}>
                      +{formatCents(p.netCents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <td className="px-3 py-3 text-left font-bold text-zinc-900 dark:text-white">TOTAL</td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-900 dark:text-white">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.monthlyCostCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-900 dark:text-white">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.annualCostCents, 0))}
                </td>
                <td className="px-3 py-3" />
                <td className="px-3 py-3" />
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-700 dark:text-zinc-300">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.mortgageCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-700 dark:text-zinc-300">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.taxCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-700 dark:text-zinc-300">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.insuranceCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-zinc-700 dark:text-zinc-300">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.maintCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.totalInCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-red-600 dark:text-red-400">
                  {formatCents(propertiesHold.reduce((s, p) => s + p.totalOutCents, 0))}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCents(propertiesHold.reduce((s, p) => s + p.netCents, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* Section 4: CapEx vs OpEx Tracking (split view)                  */}
      {/* ============================================================== */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* OpEx — left */}
        <Section title="Operating Expenses (OpEx)" id="opex">
          {/* Monthly trend bar chart */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">12-Month Trend</p>
            <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
              {opexMonths.map((month, i) => {
                const pct = (opexValues[i] / maxOpex) * 100;
                return (
                  <div key={month} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }}>
                    <div
                      className="w-full rounded-t bg-[#00a9e0]/70 transition-all group-hover:bg-[#00a9e0] dark:bg-[#00a9e0]/50 dark:group-hover:bg-[#00a9e0]/80"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="mt-1 text-[10px] text-zinc-400">{month}</span>
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-[10px] font-mono text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
                      {formatCents(opexValues[i])}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category breakdown */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category Breakdown</p>
          {/* Stacked bar */}
          <div className="mb-4 flex h-4 overflow-hidden rounded-full">
            {opexCategories.map(cat => (
              <div key={cat.label} className={cn(cat.color, 'transition-all')} style={{ width: `${cat.pct}%` }} title={cat.label} />
            ))}
          </div>
          {/* Legend */}
          <div className="space-y-2">
            {opexCategories.map(cat => (
              <div key={cat.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn('h-3 w-3 rounded-sm', cat.color)} />
                  <span className="text-zinc-700 dark:text-zinc-300">{cat.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{formatCents(cat.cents)}</span>
                  <span className="w-12 text-right text-xs text-zinc-400">{formatPct(cat.pct)}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* CapEx — right */}
        <Section title="Capital Expenditures (CapEx)" id="capex">
          {/* Summary bar */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">YTD CapEx</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatCents(capexYTDCents)} / {formatCents(capexBudgetCents)} budget</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-3 rounded-full bg-[#ff4500] transition-all"
                style={{ width: `${(capexYTDCents / capexBudgetCents) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <span>Reserve fund: {formatCents(reserveFundCents)}</span>
              <span>Recommended: {formatCents(reserveRecommendedCents)}</span>
            </div>
          </div>

          {/* Projects list */}
          <div className="space-y-3">
            {capexProjects.map((proj) => (
              <div key={proj.description} className="rounded-lg border border-zinc-100 p-3 transition-colors hover:border-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{proj.description}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{proj.property} &middot; {proj.date}</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">{formatCents(proj.amountCents)}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {proj.depreciationYears}-yr depreciation
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">{proj.roiNote}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ============================================================== */}
      {/* Section 5: Deferred Maintenance Liability                       */}
      {/* ============================================================== */}
      <Section title="Deferred Maintenance Liability" id="deferred-maintenance"
        actions={
          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono font-bold text-red-600 dark:text-red-400">
              Total: {formatCents(totalDeferredCents)}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">
              Annual cost if ignored: {formatCents(annualCostIfIgnoredCents)}/yr
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm" role="table" aria-label="Deferred maintenance items">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Issue</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Property</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Timeline</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Est. Cost</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Annual Loss</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Risk</th>
              </tr>
            </thead>
            <tbody>
              {deferredItems.map((item) => (
                <tr key={item.description} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-3 py-3 font-medium text-zinc-900 dark:text-white">{item.description}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{item.property}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{item.timeline}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-red-600 dark:text-red-400">{formatCents(item.estimatedCents)}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">{formatCents(item.annualCostIfIgnoredCents)}/yr</td>
                  <td className="px-3 py-3 text-center"><RiskBadge risk={item.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* Section 6: Improvement ROI Tracker                              */}
      {/* ============================================================== */}
      <Section title="Improvement ROI Tracker" id="improvement-roi">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[900px] text-sm" role="table" aria-label="Improvement ROI tracking">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Improvement</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Property</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Cost</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Before</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">After</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Monthly Gain</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Payback</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ROI</th>
              </tr>
            </thead>
            <tbody>
              {improvements.map((imp) => (
                <tr key={imp.improvement} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50">
                  <td className="px-3 py-3 font-medium text-zinc-900 dark:text-white">{imp.improvement}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{imp.property}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-zinc-700 dark:text-zinc-300">{formatCents(imp.costCents)}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-400">{imp.date}</td>
                  <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{imp.metricBefore}</td>
                  <td className="px-3 py-3 text-zinc-900 dark:text-white">{imp.metricAfter}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {imp.monthlyGainCents ? `+${formatCents(imp.monthlyGainCents)}` : '\u2014'}
                  </td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">
                    {imp.paybackMonths ? `${imp.paybackMonths} mo` : '\u2014'}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {imp.roiPct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* Section 7: Cash Flow Forecast (12-month projection)             */}
      {/* ============================================================== */}
      <Section title="Cash Flow Forecast (12-Month Projection)" id="cash-flow-forecast">
        <div className="mb-4 flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded bg-emerald-200 dark:bg-emerald-500/30" />
            <span className="text-zinc-600 dark:text-zinc-400">Confidence band (optimistic/pessimistic)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#00a9e0]" />
            <span className="text-zinc-600 dark:text-zinc-400">Projected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 border-t-2 border-dashed border-red-400" />
            <span className="text-zinc-600 dark:text-zinc-400">Threshold ($20,000)</span>
          </div>
        </div>

        <div className="relative" style={{ height: '260px' }}>
          {/* Threshold line */}
          {(() => {
            const thresholdY = ((forecastMax - cashFlowThresholdCents) / forecastRange) * 100;
            return (
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-red-300 dark:border-red-500/50"
                style={{ top: `${thresholdY}%` }}
              >
                <span className="absolute -top-4 right-0 text-[10px] font-mono text-red-400">$20,000 threshold</span>
              </div>
            );
          })()}

          {/* Chart area */}
          <div className="flex h-full items-end gap-1.5">
            {forecast.map((f) => {
              const optH = ((f.optimisticCents - forecastMin) / forecastRange) * 100;
              const projH = ((f.projectedCents - forecastMin) / forecastRange) * 100;
              const pessH = ((f.pessimisticCents - forecastMin) / forecastRange) * 100;
              const belowThreshold = f.projectedCents < cashFlowThresholdCents;

              return (
                <div key={f.month} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }}>
                  {/* Confidence band */}
                  <div className="absolute w-full" style={{ bottom: `${pessH}%`, height: `${optH - pessH}%` }}>
                    <div className="h-full w-full rounded bg-emerald-100/60 dark:bg-emerald-500/10" />
                  </div>

                  {/* Projected bar */}
                  <div
                    className={cn(
                      'relative z-10 w-3/5 rounded-t transition-all',
                      belowThreshold
                        ? 'bg-red-400/80 dark:bg-red-500/60'
                        : 'bg-[#00a9e0]/70 dark:bg-[#00a9e0]/50',
                      'group-hover:opacity-90',
                    )}
                    style={{ height: `${projH}%` }}
                  />

                  {/* Month label */}
                  <span className={cn(
                    'mt-1 text-[10px]',
                    belowThreshold ? 'font-bold text-red-500' : 'text-zinc-400',
                  )}>
                    {f.month.split(' ')[0]}
                  </span>

                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-16 left-1/2 z-20 w-36 -translate-x-1/2 rounded bg-zinc-900 px-2.5 py-2 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
                    <p className="font-bold">{f.month}</p>
                    <p className="text-emerald-300">Optimistic: {formatCents(f.optimisticCents)}</p>
                    <p className="text-[#00a9e0]">Projected: {formatCents(f.projectedCents)}</p>
                    <p className="text-red-300">Pessimistic: {formatCents(f.pessimisticCents)}</p>
                    {f.notes && <p className="mt-1 text-amber-300">{f.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* August warning callout */}
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Cash flow warning: August 2026</p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
              3 lease expirations + scheduled roof project may push cash flow to {formatCents(1_800_000)} (below {formatCents(cashFlowThresholdCents)} threshold). Consider staggering CapEx or accelerating lease renewals.
            </p>
          </div>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* Section 8: Tax Optimization View                                */}
      {/* ============================================================== */}
      <Section title="Tax Optimization View" id="tax-optimization">
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Schedule E Mapping */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">IRS Schedule E Mapping</p>
            <table className="w-full text-sm" role="table" aria-label="Schedule E expense mapping">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2 pr-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">Line</th>
                  <th className="py-2 pr-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">Description</th>
                  <th className="py-2 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">YTD Amount</th>
                </tr>
              </thead>
              <tbody>
                {scheduleEMapping.map((row) => (
                  <tr key={row.line} className={cn(
                    'border-b border-zinc-50 dark:border-zinc-800/50',
                    row.line === '3' && 'bg-emerald-50/50 dark:bg-emerald-500/5',
                  )}>
                    <td className="py-2 pr-3 font-mono text-xs text-zinc-400">{row.line}</td>
                    <td className="py-2 pr-3 text-zinc-700 dark:text-zinc-300">{row.description}</td>
                    <td className={cn(
                      'py-2 text-right font-mono tabular-nums',
                      row.line === '3' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400',
                    )}>
                      {formatCents(row.ytdCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-200 dark:border-zinc-700">
                  <td colSpan={2} className="py-2 pr-3 font-bold text-zinc-900 dark:text-white">Total Deductible Expenses (YTD)</td>
                  <td className="py-2 text-right font-mono tabular-nums font-bold text-red-600 dark:text-red-400">{formatCents(ytdDeductible)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Depreciation Schedules */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Depreciation Schedules</p>
            <div className="space-y-3">
              {depreciationSchedules.map((dep) => (
                <div key={dep.property} className="rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{dep.property}</p>
                    <span className="text-xs text-zinc-400">{dep.type}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Basis: {formatCents(dep.basisCents)}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">Annual: {formatCents(dep.yearlyDepCents)}</span>
                    <span className="rounded bg-[#00a9e0]/10 px-2 py-0.5 font-medium text-[#00a9e0]">
                      {dep.yearsRemaining} yrs remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1099 Vendor Tracking */}
        <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">1099 Vendor Payments (&gt;$600 Threshold)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vendors1099.map((v) => (
              <div key={v.name} className={cn(
                'flex items-center justify-between rounded-lg border p-3',
                v.over600
                  ? 'border-amber-200 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/5'
                  : 'border-zinc-100 dark:border-zinc-800',
              )}>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{v.name}</p>
                  {v.over600 && (
                    <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">1099 Required</span>
                  )}
                </div>
                <span className="font-mono tabular-nums text-sm font-bold text-zinc-900 dark:text-white">{formatCents(v.ytdCents)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capital vs Repair Classification */}
        <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Capital vs Repair Classification</p>
          <table className="w-full text-sm" role="table" aria-label="Capital vs repair classification">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-2 pr-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">Item</th>
                <th className="py-2 pr-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">IRS Classification</th>
                <th className="py-2 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {capVsRepair.map((item) => (
                <tr key={item.item} className="border-b border-zinc-50 dark:border-zinc-800/50">
                  <td className="py-2.5 pr-3 font-medium text-zinc-900 dark:text-white">{item.item}</td>
                  <td className="py-2.5 pr-3">
                    <span className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold',
                      item.classification === 'Improvement'
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
                    )}>
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs text-zinc-600 dark:text-zinc-400">{item.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
