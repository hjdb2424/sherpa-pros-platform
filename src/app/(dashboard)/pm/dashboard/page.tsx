'use client';

import Link from 'next/link';
import { getCurrentSession } from '@/lib/auth/session';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const portfolioStats = [
  { label: 'Total Properties', value: '4', icon: BuildingIcon },
  { label: 'Total Units', value: '123', icon: KeyIcon },
  { label: 'Open Work Orders', value: '12', icon: ClipboardIcon, accent: true },
  { label: 'MTD Spend', value: '$14,200', icon: DollarIcon },
];

const properties = [
  {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    type: 'Multi-Family',
    units: 48,
    occupancy: 94,
    openWOs: 6,
    urgency: { emergency: 1, urgent: 2, routine: 3 },
    mtdSpend: 8100,
    budget: 7500,
  },
  {
    id: '220-main',
    name: '220 Main St Mixed-Use',
    type: 'Mixed-Use',
    units: 15,
    unitBreakdown: '12 res + 3 retail',
    occupancy: 87,
    openWOs: 2,
    urgency: { emergency: 0, urgent: 1, routine: 1 },
    mtdSpend: 3400,
    budget: 3200,
  },
  {
    id: 'harbor-view',
    name: 'Harbor View Condos',
    type: 'Condo',
    units: 24,
    occupancy: 100,
    openWOs: 3,
    urgency: { emergency: 0, urgent: 0, routine: 3 },
    mtdSpend: 1800,
    budget: 2000,
  },
  {
    id: 'elm-street',
    name: 'Elm Street Student Housing',
    type: 'Student Housing',
    units: 36,
    occupancy: 92,
    openWOs: 1,
    urgency: { emergency: 0, urgent: 0, routine: 1 },
    mtdSpend: 900,
    budget: 1000,
  },
];

const kanbanColumns = [
  {
    title: 'New',
    count: 3,
    color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    items: [
      { id: 'WO-101', title: 'Leaking faucet', property: 'Maple Ridge', unit: '204', priority: 'routine', pro: null },
      { id: 'WO-102', title: 'Broken window latch', property: '220 Main St', unit: '3B', priority: 'routine', pro: null },
      { id: 'WO-103', title: 'HVAC not cooling', property: 'Maple Ridge', unit: '112', priority: 'urgent', pro: null },
    ],
  },
  {
    title: 'Approved',
    count: 2,
    color: 'bg-sky-50 text-[#00a9e0] dark:bg-[#00a9e0]/10',
    items: [
      { id: 'WO-098', title: 'Replace garbage disposal', property: 'Harbor View', unit: '7A', priority: 'routine', pro: 'Mike Rodriguez' },
      { id: 'WO-099', title: 'Exterior light fixture', property: 'Elm Street', unit: 'Common', priority: 'routine', pro: null },
    ],
  },
  {
    title: 'Dispatched',
    count: 4,
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    items: [
      { id: 'WO-090', title: 'Toilet running constantly', property: 'Maple Ridge', unit: '305', priority: 'urgent', pro: 'Mike Rodriguez' },
      { id: 'WO-091', title: 'Ceiling fan wobble', property: '220 Main St', unit: '2A', priority: 'routine', pro: 'Sarah Chen' },
      { id: 'WO-092', title: 'Smoke detector chirping', property: 'Harbor View', unit: '12C', priority: 'routine', pro: 'Sarah Chen' },
      { id: 'WO-093', title: 'Water heater pilot out', property: 'Maple Ridge', unit: '410', priority: 'emergency', pro: 'James Wilson' },
    ],
  },
  {
    title: 'In Progress',
    count: 2,
    color: 'bg-[#00a9e0]/10 text-[#00a9e0]',
    items: [
      { id: 'WO-085', title: 'Kitchen cabinet hinge', property: 'Maple Ridge', unit: '118', priority: 'routine', pro: 'Carlos Rivera' },
      { id: 'WO-086', title: 'Rewire bathroom outlet', property: '220 Main St', unit: 'Retail 1', priority: 'urgent', pro: 'Sarah Chen' },
    ],
  },
  {
    title: 'Completed',
    count: 1,
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    items: [
      { id: 'WO-080', title: 'Paint unit turnover', property: 'Harbor View', unit: '5B', priority: 'routine', pro: 'Diana Brooks' },
    ],
  },
  {
    title: 'Invoiced',
    count: 0,
    color: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
    items: [],
  },
];

const complianceAlerts = [
  {
    level: 'danger',
    label: 'OVERDUE',
    message: '220 Main fire extinguisher inspection (expired 3/15)',
    bgClass: 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
  {
    level: 'warning',
    label: 'DUE IN 30 DAYS',
    message: 'Maple Ridge boiler inspection (5/12)',
    bgClass: 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
  {
    level: 'success',
    label: 'CURRENT',
    message: 'Harbor View elevator cert (valid until 12/26)',
    bgClass: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
];

/* ------------------------------------------------------------------ */
/* Icon Components (inline SVG)                                        */
/* ------------------------------------------------------------------ */

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Priority Badge                                                      */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    emergency: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    routine: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[priority] || styles.routine}`}>
      {priority}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PMDashboardPage() {
  const session = getCurrentSession('pm');

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Welcome back, {session.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your portfolio overview -- properties, work orders, and vendor performance.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Financial Overview (compact summary)                               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-5 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/5 dark:to-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Net Cash Flow</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">$45,625<span className="text-sm font-normal text-zinc-400">/mo</span></p>
              </div>
              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">NOI Margin</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">61.0<span className="text-sm font-normal text-zinc-400">%</span></p>
              </div>
              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Budget Status</p>
                <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">+8%<span className="text-sm font-normal text-zinc-400"> over</span></p>
              </div>
            </div>
            <Link
              href="/pm/finance"
              className="flex items-center gap-2 rounded-lg bg-[#00a9e0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
            >
              View Full Finance Report
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Top Stats Row                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {portfolioStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
              stat.accent
                ? 'bg-[#ff4500]/10 text-[#ff4500]'
                : 'bg-[#00a9e0]/10 text-[#00a9e0]'
            }`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Property Cards Grid                                               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Properties</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {properties.map((p) => {
            const variance = ((p.mtdSpend - p.budget) / p.budget) * 100;
            const overBudget = variance > 0;
            return (
              <div
                key={p.id}
                className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{p.name}</h3>
                    <span className="mt-1 inline-flex rounded-full bg-[#00a9e0]/10 px-2.5 py-0.5 text-xs font-medium text-[#00a9e0]">
                      {p.type}
                    </span>
                  </div>
                  <Link
                    href={`/pm/properties/${p.id}`}
                    className="rounded-full bg-[#00a9e0] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-4 space-y-2.5">
                  {/* Units + occupancy */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {p.units} units {p.unitBreakdown ? `(${p.unitBreakdown})` : ''}
                    </span>
                    <span className={`font-semibold ${p.occupancy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : p.occupancy >= 90 ? 'text-[#00a9e0]' : 'text-amber-600 dark:text-amber-400'}`}>
                      {p.occupancy}% occupied
                    </span>
                  </div>

                  {/* WOs */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{p.openWOs} open WOs</span>
                    <div className="flex gap-1">
                      {p.urgency.emergency > 0 && (
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                          {p.urgency.emergency} emergency
                        </span>
                      )}
                      {p.urgency.urgent > 0 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                          {p.urgency.urgent} urgent
                        </span>
                      )}
                      {p.urgency.routine > 0 && (
                        <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {p.urgency.routine} routine
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spend + budget */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      ${p.mtdSpend.toLocaleString()}/mo
                    </span>
                    <span className={`font-semibold ${overBudget ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {overBudget ? '+' : ''}{variance.toFixed(0)}% {overBudget ? 'over' : 'under'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Work Order Pipeline (Kanban)                                      */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Work Order Pipeline</h2>
          <Link
            href="/pm/work-orders"
            className="text-sm font-medium text-[#00a9e0] hover:text-[#0090c0] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3" style={{ minWidth: '960px' }}>
            {kanbanColumns.map((col) => (
              <div
                key={col.title}
                className="w-44 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{col.title}</span>
                  <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${col.color}`}>
                    {col.count}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 p-2">
                  {col.items.length === 0 && (
                    <p className="py-4 text-center text-xs text-zinc-400">None</p>
                  )}
                  {col.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[#00a9e033] bg-white p-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                        {item.property} &middot; {item.unit}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <PriorityBadge priority={item.priority} />
                        {item.pro ? (
                          <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{item.pro.split(' ')[0]}</span>
                        ) : (
                          <span className="text-[10px] italic text-zinc-400">Unassigned</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Compliance Alerts                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Compliance Alerts</h2>
        <div className="space-y-3">
          {complianceAlerts.map((alert) => (
            <div
              key={alert.message}
              className={`flex items-start gap-3 rounded-xl border p-4 ${alert.bgClass}`}
            >
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${alert.dotClass}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${alert.badgeClass}`}>
                  {alert.label}
                </span>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
