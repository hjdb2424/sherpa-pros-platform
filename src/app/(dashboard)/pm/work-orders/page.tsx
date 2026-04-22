'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

type WOStatus = 'new' | 'approved' | 'dispatched' | 'in-progress' | 'completed' | 'invoiced';
type WOPriority = 'emergency' | 'urgent' | 'routine';

interface WorkOrder {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: WOPriority;
  status: WOStatus;
  category: string;
  pro: string | null;
  created: string;
  slaHours: number;
}

const WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-101', title: 'Leaking faucet', property: 'Maple Ridge', unit: '204', priority: 'routine', status: 'new', category: 'Plumbing', pro: null, created: '2026-04-14', slaHours: 72 },
  { id: 'WO-102', title: 'Broken window latch', property: '220 Main St', unit: '3B', priority: 'routine', status: 'new', category: 'General', pro: null, created: '2026-04-14', slaHours: 72 },
  { id: 'WO-103', title: 'HVAC not cooling', property: 'Maple Ridge', unit: '112', priority: 'urgent', status: 'new', category: 'HVAC', pro: null, created: '2026-04-13', slaHours: 24 },
  { id: 'WO-098', title: 'Replace garbage disposal', property: 'Harbor View', unit: '7A', priority: 'routine', status: 'approved', category: 'Plumbing', pro: 'Mike Rodriguez', created: '2026-04-12', slaHours: 72 },
  { id: 'WO-099', title: 'Exterior light fixture', property: 'Elm Street', unit: 'Common', priority: 'routine', status: 'approved', category: 'Electrical', pro: null, created: '2026-04-12', slaHours: 72 },
  { id: 'WO-090', title: 'Toilet running constantly', property: 'Maple Ridge', unit: '305', priority: 'urgent', status: 'dispatched', category: 'Plumbing', pro: 'Mike Rodriguez', created: '2026-04-11', slaHours: 24 },
  { id: 'WO-091', title: 'Ceiling fan wobble', property: '220 Main St', unit: '2A', priority: 'routine', status: 'dispatched', category: 'Electrical', pro: 'Sarah Chen', created: '2026-04-11', slaHours: 72 },
  { id: 'WO-092', title: 'Smoke detector chirping', property: 'Harbor View', unit: '12C', priority: 'routine', status: 'dispatched', category: 'General', pro: 'Sarah Chen', created: '2026-04-10', slaHours: 72 },
  { id: 'WO-093', title: 'Water heater pilot out', property: 'Maple Ridge', unit: '410', priority: 'emergency', status: 'dispatched', category: 'HVAC', pro: 'James Wilson', created: '2026-04-10', slaHours: 4 },
  { id: 'WO-085', title: 'Kitchen cabinet hinge', property: 'Maple Ridge', unit: '118', priority: 'routine', status: 'in-progress', category: 'Carpentry', pro: 'Carlos Rivera', created: '2026-04-09', slaHours: 72 },
  { id: 'WO-086', title: 'Rewire bathroom outlet', property: '220 Main St', unit: 'Retail 1', priority: 'urgent', status: 'in-progress', category: 'Electrical', pro: 'Sarah Chen', created: '2026-04-09', slaHours: 24 },
  { id: 'WO-080', title: 'Paint unit turnover', property: 'Harbor View', unit: '5B', priority: 'routine', status: 'completed', category: 'Painting', pro: 'Diana Brooks', created: '2026-04-07', slaHours: 72 },
];

const STATUS_ORDER: WOStatus[] = ['new', 'approved', 'dispatched', 'in-progress', 'completed', 'invoiced'];
const STATUS_LABELS: Record<WOStatus, string> = {
  new: 'New',
  approved: 'Approved',
  dispatched: 'Dispatched',
  'in-progress': 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
};
const STATUS_COLORS: Record<WOStatus, string> = {
  new: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  approved: 'bg-sky-50 text-[#00a9e0] dark:bg-[#00a9e0]/10',
  dispatched: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'in-progress': 'bg-[#00a9e0]/10 text-[#00a9e0]',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  invoiced: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
};

const PROPERTIES = ['All', 'Maple Ridge', '220 Main St', 'Harbor View', 'Elm Street'];
const PRIORITIES: (WOPriority | 'all')[] = ['all', 'emergency', 'urgent', 'routine'];

/* ------------------------------------------------------------------ */
/* Priority Badge                                                      */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: WOPriority }) {
  const styles: Record<WOPriority, string> = {
    emergency: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    routine: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[priority]}`}>
      {priority}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Detail Side Panel                                                   */
/* ------------------------------------------------------------------ */

function DetailPanel({ wo, onClose }: { wo: WorkOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Work order details">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-xl dark:bg-zinc-900 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{wo.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{wo.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <PriorityBadge priority={wo.priority} />
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[wo.status]}`}>
                {STATUS_LABELS[wo.status]}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ['Property', wo.property],
              ['Unit', wo.unit],
              ['Category', wo.category],
              ['Created', wo.created],
              ['SLA', `${wo.slaHours} hours`],
              ['Assigned To', wo.pro || 'Unassigned'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Timeline placeholder */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Timeline</h4>
            <div className="space-y-3 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
              <div>
                <p className="text-xs font-medium text-zinc-900 dark:text-white">Work order created</p>
                <p className="text-[10px] text-zinc-500">{wo.created}</p>
              </div>
              {wo.pro && (
                <div>
                  <p className="text-xs font-medium text-zinc-900 dark:text-white">Assigned to {wo.pro}</p>
                  <p className="text-[10px] text-zinc-500">{wo.created}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          {!wo.pro && (
            <button
              type="button"
              className="w-full rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30"
            >
              Assign Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function WorkOrdersPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<WOPriority | 'all'>('all');
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  const filtered = WORK_ORDERS.filter((wo) => {
    const matchesProp = propertyFilter === 'All' || wo.property === propertyFilter;
    const matchesPri = priorityFilter === 'all' || wo.priority === priorityFilter;
    return matchesProp && matchesPri;
  });

  const grouped = STATUS_ORDER.reduce<Record<WOStatus, WorkOrder[]>>((acc, s) => {
    acc[s] = filtered.filter((wo) => wo.status === s);
    return acc;
  }, {} as Record<WOStatus, WorkOrder[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Work Orders</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} work orders</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Work Order
        </button>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          aria-label="Filter by property"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {PROPERTIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as WOPriority | 'all')}
          aria-label="Filter by priority"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="all">All Priorities</option>
          <option value="emergency">Emergency</option>
          <option value="urgent">Urgent</option>
          <option value="routine">Routine</option>
        </select>

        <div className="ml-auto flex rounded-lg border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setView('kanban')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === 'kanban'
                ? 'bg-[#00a9e0]/10 text-[#00a9e0]'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
            aria-label="Kanban view"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === 'table'
                ? 'bg-[#00a9e0]/10 text-[#00a9e0]'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
            aria-label="Table view"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h-7.5c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125" />
            </svg>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* KANBAN VIEW                                                       */}
      {/* ---------------------------------------------------------------- */}
      {view === 'kanban' && (
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3" style={{ minWidth: '1080px' }}>
            {STATUS_ORDER.map((status) => {
              const items = grouped[status];
              return (
                <div
                  key={status}
                  className="w-48 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{STATUS_LABELS[status]}</span>
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${STATUS_COLORS[status]}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2 p-2">
                    {items.length === 0 && (
                      <p className="py-6 text-center text-xs text-zinc-400">None</p>
                    )}
                    {items.map((wo) => (
                      <button
                        key={wo.id}
                        type="button"
                        onClick={() => setSelectedWO(wo)}
                        className="w-full rounded-lg border border-[#00a9e033] bg-white p-2.5 text-left shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                      >
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{wo.title}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                          {wo.property} &middot; {wo.unit}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <PriorityBadge priority={wo.priority} />
                          {wo.pro ? (
                            <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{wo.pro.split(' ')[0]}</span>
                          ) : (
                            <span className="text-[10px] italic text-zinc-400">Unassigned</span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-400">{wo.created}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TABLE VIEW                                                        */}
      {/* ---------------------------------------------------------------- */}
      {view === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {['ID', 'Title', 'Property', 'Unit', 'Priority', 'Status', 'Assigned', 'Created'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((wo) => (
                <tr
                  key={wo.id}
                  className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  onClick={() => setSelectedWO(wo)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{wo.id}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{wo.title}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{wo.property}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{wo.unit}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={wo.priority} /></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[wo.status]}`}>
                      {STATUS_LABELS[wo.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{wo.pro || <span className="italic text-zinc-400">--</span>}</td>
                  <td className="px-4 py-3 text-zinc-500">{wo.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail side panel */}
      {selectedWO && <DetailPanel wo={selectedWO} onClose={() => setSelectedWO(null)} />}
    </div>
  );
}
