'use client';

import { useState, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
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
  proPhone: string | null;
  proRating: number | null;
  created: string;
  slaHours: number;
  estimatedCostCents: number;
  actualCostCents: number | null;
  capex: boolean;
  budgetLineItem: string | null;
  scheduleId: string | null;
  timeline: { step: string; timestamp: string | null; by: string | null }[];
  notes: { author: string; text: string; timestamp: string }[];
  photos: { label: string; url: string | null }[];
}

type ScheduleStatus = 'on-track' | 'overdue' | 'upcoming';

interface MaintenanceSchedule {
  id: string;
  taskName: string;
  frequency: string;
  properties: string[];
  nextDue: string;
  nextDueDaysOut: number;
  lastCompleted: string | null;
  estimatedCostCents: number;
  assignedVendor: string | null;
  status: ScheduleStatus;
  icon: string;
}

type MaintenanceView = 'board' | 'schedule' | 'list';

/* ------------------------------------------------------------------ */
/* Mock Data — Work Orders                                             */
/* ------------------------------------------------------------------ */

const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-101', title: 'Leaking faucet', property: 'Maple Ridge', unit: '204', priority: 'routine', status: 'completed',
    category: 'Plumbing', pro: 'Mike Rodriguez', proPhone: '(603) 555-0142', proRating: 4.9,
    created: '2026-04-14', slaHours: 72, estimatedCostCents: 45000, actualCostCents: 38000,
    capex: false, budgetLineItem: 'MR-MAINT-2026-04', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-14 09:22', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-14 09:45', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-15 08:00', by: 'System' },
      { step: 'Started', timestamp: '2026-04-16 10:15', by: 'Mike Rodriguez' },
      { step: 'Completed', timestamp: '2026-04-17 14:30', by: 'Mike Rodriguez' },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'Tenant (Unit 204)', text: 'Tenant reported leak under kitchen sink at 2pm', timestamp: '2026-04-14 14:00' },
      { author: 'Mike Rodriguez', text: 'P-trap corroded, replacement ordered', timestamp: '2026-04-16 10:30' },
      { author: 'Mike Rodriguez', text: 'Repair complete, no further leaks', timestamp: '2026-04-17 14:30' },
    ],
    photos: [
      { label: 'Before', url: null },
      { label: 'During', url: null },
      { label: 'After', url: null },
    ],
  },
  {
    id: 'WO-102', title: 'Broken window latch', property: '220 Main St', unit: '3B', priority: 'routine', status: 'new',
    category: 'General', pro: null, proPhone: null, proRating: null,
    created: '2026-04-14', slaHours: 72, estimatedCostCents: 12000, actualCostCents: null,
    capex: false, budgetLineItem: null, scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-14 11:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: null, by: null },
      { step: 'Dispatched', timestamp: null, by: null },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [{ label: 'Before', url: null }, { label: 'After', url: null }],
  },
  {
    id: 'WO-103', title: 'HVAC not cooling', property: 'Maple Ridge', unit: '112', priority: 'urgent', status: 'new',
    category: 'HVAC', pro: null, proPhone: null, proRating: null,
    created: '2026-04-13', slaHours: 24, estimatedCostCents: 85000, actualCostCents: null,
    capex: false, budgetLineItem: null, scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-13 08:30', by: 'Tenant Portal' },
      { step: 'Approved', timestamp: null, by: null },
      { step: 'Dispatched', timestamp: null, by: null },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'Tenant (Unit 112)', text: 'AC blowing warm air since yesterday evening', timestamp: '2026-04-13 08:30' },
    ],
    photos: [],
  },
  {
    id: 'WO-098', title: 'Replace garbage disposal', property: 'Harbor View', unit: '7A', priority: 'routine', status: 'approved',
    category: 'Plumbing', pro: 'Mike Rodriguez', proPhone: '(603) 555-0142', proRating: 4.9,
    created: '2026-04-12', slaHours: 72, estimatedCostCents: 35000, actualCostCents: null,
    capex: true, budgetLineItem: 'HV-CAPEX-2026-Q2', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-12 09:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-12 10:15', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: null, by: null },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-099', title: 'Exterior light fixture', property: 'Elm Street', unit: 'Common', priority: 'routine', status: 'approved',
    category: 'Electrical', pro: null, proPhone: null, proRating: null,
    created: '2026-04-12', slaHours: 72, estimatedCostCents: 22000, actualCostCents: null,
    capex: true, budgetLineItem: 'ELM-CAPEX-2026-Q2', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-12 14:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-12 14:30', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: null, by: null },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-090', title: 'Toilet running constantly', property: 'Maple Ridge', unit: '305', priority: 'urgent', status: 'dispatched',
    category: 'Plumbing', pro: 'Mike Rodriguez', proPhone: '(603) 555-0142', proRating: 4.9,
    created: '2026-04-11', slaHours: 24, estimatedCostCents: 28000, actualCostCents: null,
    capex: false, budgetLineItem: 'MR-MAINT-2026-04', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-11 07:00', by: 'Tenant Portal' },
      { step: 'Approved', timestamp: '2026-04-11 07:15', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-11 08:00', by: 'System' },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'Tenant (Unit 305)', text: 'Toilet has been running nonstop for 2 days, water bill concern', timestamp: '2026-04-11 07:00' },
    ],
    photos: [],
  },
  {
    id: 'WO-091', title: 'Ceiling fan wobble', property: '220 Main St', unit: '2A', priority: 'routine', status: 'dispatched',
    category: 'Electrical', pro: 'Sarah Chen', proPhone: '(603) 555-0198', proRating: 4.8,
    created: '2026-04-11', slaHours: 72, estimatedCostCents: 18000, actualCostCents: null,
    capex: false, budgetLineItem: null, scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-11 09:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-11 09:30', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-11 10:00', by: 'System' },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-092', title: 'Smoke detector chirping', property: 'Harbor View', unit: '12C', priority: 'routine', status: 'dispatched',
    category: 'General', pro: 'Sarah Chen', proPhone: '(603) 555-0198', proRating: 4.8,
    created: '2026-04-10', slaHours: 72, estimatedCostCents: 8000, actualCostCents: null,
    capex: false, budgetLineItem: null, scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-10 15:00', by: 'Tenant Portal' },
      { step: 'Approved', timestamp: '2026-04-10 15:20', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-10 16:00', by: 'System' },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-093', title: 'Water heater pilot out', property: 'Maple Ridge', unit: '410', priority: 'emergency', status: 'dispatched',
    category: 'HVAC', pro: 'James Wilson', proPhone: '(603) 555-0231', proRating: 4.7,
    created: '2026-04-10', slaHours: 4, estimatedCostCents: 65000, actualCostCents: null,
    capex: false, budgetLineItem: 'MR-MAINT-2026-04', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-10 06:00', by: 'Tenant Portal' },
      { step: 'Approved', timestamp: '2026-04-10 06:05', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-10 06:10', by: 'System' },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'Tenant (Unit 410)', text: 'No hot water at all, pilot light appears to be out', timestamp: '2026-04-10 06:00' },
    ],
    photos: [],
  },
  {
    id: 'WO-085', title: 'Kitchen cabinet hinge', property: 'Maple Ridge', unit: '118', priority: 'routine', status: 'in-progress',
    category: 'Carpentry', pro: 'Carlos Rivera', proPhone: '(603) 555-0275', proRating: 4.6,
    created: '2026-04-09', slaHours: 72, estimatedCostCents: 15000, actualCostCents: null,
    capex: false, budgetLineItem: null, scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-09 10:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-09 10:30', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-09 11:00', by: 'System' },
      { step: 'Started', timestamp: '2026-04-10 09:00', by: 'Carlos Rivera' },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-086', title: 'Rewire bathroom outlet', property: '220 Main St', unit: 'Retail 1', priority: 'urgent', status: 'in-progress',
    category: 'Electrical', pro: 'Sarah Chen', proPhone: '(603) 555-0198', proRating: 4.8,
    created: '2026-04-09', slaHours: 24, estimatedCostCents: 42000, actualCostCents: null,
    capex: true, budgetLineItem: '220-CAPEX-2026-Q2', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-09 13:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-09 13:15', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-09 14:00', by: 'System' },
      { step: 'Started', timestamp: '2026-04-10 08:00', by: 'Sarah Chen' },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [],
  },
  {
    id: 'WO-080', title: 'Paint unit turnover', property: 'Harbor View', unit: '5B', priority: 'routine', status: 'completed',
    category: 'Painting', pro: 'Diana Brooks', proPhone: '(603) 555-0310', proRating: 4.5,
    created: '2026-04-07', slaHours: 72, estimatedCostCents: 120000, actualCostCents: 115000,
    capex: false, budgetLineItem: 'HV-TURNOVER-2026', scheduleId: null,
    timeline: [
      { step: 'Created', timestamp: '2026-04-07 08:00', by: 'Lisa Park' },
      { step: 'Approved', timestamp: '2026-04-07 08:30', by: 'Lisa Park' },
      { step: 'Dispatched', timestamp: '2026-04-07 09:00', by: 'System' },
      { step: 'Started', timestamp: '2026-04-08 07:00', by: 'Diana Brooks' },
      { step: 'Completed', timestamp: '2026-04-10 16:00', by: 'Diana Brooks' },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [],
    photos: [{ label: 'Before', url: null }, { label: 'After', url: null }],
  },
  {
    id: 'WO-095', title: 'HVAC filter change (Q2)', property: 'Maple Ridge', unit: 'All Units', priority: 'routine', status: 'new',
    category: 'HVAC', pro: 'James Wilson', proPhone: '(603) 555-0231', proRating: 4.7,
    created: '2026-04-20', slaHours: 72, estimatedCostCents: 185000, actualCostCents: null,
    capex: false, budgetLineItem: 'MR-MAINT-2026-Q2', scheduleId: 's1',
    timeline: [
      { step: 'Created', timestamp: '2026-04-20 00:00', by: 'Schedule: HVAC Filter Changes' },
      { step: 'Approved', timestamp: null, by: null },
      { step: 'Dispatched', timestamp: null, by: null },
      { step: 'Started', timestamp: null, by: null },
      { step: 'Completed', timestamp: null, by: null },
      { step: 'Invoiced', timestamp: null, by: null },
    ],
    notes: [
      { author: 'System', text: 'Auto-generated from recurring schedule: HVAC Filter Changes (Quarterly)', timestamp: '2026-04-20 00:00' },
    ],
    photos: [],
  },
];

/* ------------------------------------------------------------------ */
/* Mock Data — Schedules                                               */
/* ------------------------------------------------------------------ */

const SCHEDULES: MaintenanceSchedule[] = [
  { id: 's1', taskName: 'HVAC Filter Changes', frequency: 'Quarterly', properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'], nextDue: 'Apr 30, 2026', nextDueDaysOut: 8, lastCompleted: 'Jan 28, 2026', estimatedCostCents: 185000, assignedVendor: 'James Wilson HVAC', status: 'upcoming', icon: '\u2744\uFE0F' },
  { id: 's2', taskName: 'Fire Extinguisher Inspections', frequency: 'Annual', properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'], nextDue: 'Jun 15, 2026', nextDueDaysOut: 54, lastCompleted: 'Jun 15, 2025', estimatedCostCents: 320000, assignedVendor: 'National Fire Safety Co.', status: 'on-track', icon: '\uD83E\uDDEF' },
  { id: 's3', taskName: 'Gutter Cleaning', frequency: 'Bi-annual (Spring/Fall)', properties: ['Maple Ridge', 'Harbor View', 'Student Housing'], nextDue: 'Apr 25, 2026', nextDueDaysOut: 3, lastCompleted: 'Oct 12, 2025', estimatedCostCents: 95000, assignedVendor: null, status: 'upcoming', icon: '\uD83C\uDF43' },
  { id: 's4', taskName: 'Pest Control Service', frequency: 'Monthly', properties: ['Maple Ridge', '220 Main St', 'Student Housing'], nextDue: 'Apr 15, 2026', nextDueDaysOut: -7, lastCompleted: 'Mar 15, 2026', estimatedCostCents: 45000, assignedVendor: 'Metro Pest Control', status: 'overdue', icon: '\uD83D\uDC1B' },
  { id: 's5', taskName: 'Landscaping', frequency: 'Weekly (Apr-Oct)', properties: ['Maple Ridge', 'Harbor View'], nextDue: 'Apr 24, 2026', nextDueDaysOut: 2, lastCompleted: 'Apr 17, 2026', estimatedCostCents: 35000, assignedVendor: 'Green Thumb Landscaping', status: 'on-track', icon: '\uD83C\uDF3F' },
  { id: 's6', taskName: 'Snow Removal', frequency: 'Seasonal (Nov-Mar)', properties: ['Maple Ridge', '220 Main St', 'Harbor View', 'Student Housing'], nextDue: 'Nov 1, 2026', nextDueDaysOut: 193, lastCompleted: 'Mar 22, 2026', estimatedCostCents: 250000, assignedVendor: 'All Seasons Plowing LLC', status: 'on-track', icon: '\u2744\uFE0F' },
  { id: 's7', taskName: 'Elevator Inspection', frequency: 'Annual', properties: ['220 Main St'], nextDue: 'May 10, 2026', nextDueDaysOut: 18, lastCompleted: 'May 10, 2025', estimatedCostCents: 180000, assignedVendor: null, status: 'upcoming', icon: '\uD83D\uDEA1' },
  { id: 's8', taskName: 'Pool Maintenance', frequency: 'Weekly (May-Sep)', properties: ['Harbor View'], nextDue: 'May 1, 2026', nextDueDaysOut: 9, lastCompleted: 'Sep 30, 2025', estimatedCostCents: 28000, assignedVendor: null, status: 'upcoming', icon: '\uD83C\uDFCA' },
];

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STATUS_ORDER: WOStatus[] = ['new', 'approved', 'dispatched', 'in-progress', 'completed', 'invoiced'];
const STATUS_LABELS: Record<WOStatus, string> = { new: 'New', approved: 'Approved', dispatched: 'Dispatched', 'in-progress': 'In Progress', completed: 'Completed', invoiced: 'Invoiced' };
const STATUS_COLORS: Record<WOStatus, string> = {
  new: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  approved: 'bg-sky-50 text-[#00a9e0] dark:bg-[#00a9e0]/10',
  dispatched: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'in-progress': 'bg-[#00a9e0]/10 text-[#00a9e0]',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  invoiced: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
};
const SCHEDULE_STATUS_STYLES: Record<ScheduleStatus, string> = {
  'on-track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  upcoming: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
};
const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = { 'on-track': 'On Track', overdue: 'Overdue', upcoming: 'Upcoming' };
const PROPERTIES = ['All', 'Maple Ridge', '220 Main St', 'Harbor View', 'Elm Street', 'Student Housing'];
const PRIORITIES: ('all' | WOPriority)[] = ['all', 'emergency', 'urgent', 'routine'];

/* ------------------------------------------------------------------ */
/* Chevron Icon                                                        */
/* ------------------------------------------------------------------ */

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('h-5 w-5', className)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

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
/* Collapsible Section                                                 */
/* ------------------------------------------------------------------ */

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</span>
        <ChevronDownIcon className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail Side Panel (Drill-down)                                      */
/* ------------------------------------------------------------------ */

function DetailPanel({ wo, onClose }: { wo: WorkOrder; onClose: () => void }) {
  const varianceCents = wo.actualCostCents != null ? wo.estimatedCostCents - wo.actualCostCents : null;
  const relatedSchedule = wo.scheduleId ? SCHEDULES.find((s) => s.id === wo.scheduleId) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Work order details">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white shadow-xl dark:bg-zinc-900 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{wo.id}</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Close panel">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-2">
          {/* Section 1: Overview */}
          <CollapsibleSection title="Overview" defaultOpen>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{wo.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={wo.priority} />
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[wo.status]}`}>
                  {STATUS_LABELS[wo.status]}
                </span>
              </div>
              {[
                ['Property', wo.property],
                ['Unit', wo.unit],
                ['Category', wo.category],
                ['Created', wo.created],
                ['SLA', `${wo.slaHours} hours`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                  <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 2: Assignment */}
          <CollapsibleSection title="Assignment" defaultOpen>
            {wo.pro ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{wo.pro}</p>
                    <p className="text-xs text-zinc-500">{wo.proPhone}</p>
                    {wo.proRating && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{wo.proRating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                      Call
                    </button>
                    <button type="button" className="rounded-lg bg-[#00a9e0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0090c0]">
                      Message
                    </button>
                  </div>
                </div>
                {wo.timeline.find((t) => t.step === 'Dispatched' && t.timestamp) && (
                  <p className="text-xs text-zinc-500">Dispatched: {wo.timeline.find((t) => t.step === 'Dispatched')?.timestamp}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">No pro assigned yet</p>
                <button type="button" className="rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 hover:bg-[#0090c0]">
                  Assign Pro
                </button>
              </div>
            )}
          </CollapsibleSection>

          {/* Section 3: Cost & Budget */}
          <CollapsibleSection title="Cost & Budget" defaultOpen>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Estimated</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatCents(wo.estimatedCostCents)}</span>
              </div>
              {wo.actualCostCents != null && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Actual</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatCents(wo.actualCostCents)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Variance</span>
                    <span className={cn(
                      'font-mono font-bold',
                      varianceCents != null && varianceCents >= 0 ? 'text-emerald-600' : 'text-red-600',
                    )}>
                      {varianceCents != null && varianceCents >= 0 ? 'Under ' : 'Over '}
                      {formatCents(Math.abs(varianceCents ?? 0))}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Classification</span>
                <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', wo.capex ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300')}>
                  {wo.capex ? 'CapEx' : 'OpEx'}
                </span>
              </div>
              {wo.budgetLineItem && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Budget Line</span>
                  <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{wo.budgetLineItem}</span>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Section 4: Timeline */}
          <CollapsibleSection title="Timeline">
            <div className="space-y-0">
              {wo.timeline.map((step, i) => {
                const done = step.timestamp != null;
                const isLast = i === wo.timeline.length - 1;
                return (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('h-3 w-3 rounded-full border-2 mt-0.5', done ? 'border-[#00a9e0] bg-[#00a9e0]' : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900')} />
                      {!isLast && (
                        <div className={cn('w-0.5 flex-1 min-h-[24px]', done ? 'bg-[#00a9e0]' : 'bg-zinc-200 dark:bg-zinc-700 border-l border-dashed border-zinc-300 dark:border-zinc-600 w-0')} />
                      )}
                    </div>
                    <div className="pb-4 -mt-0.5">
                      <p className={cn('text-xs font-medium', done ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500')}>
                        {step.step}
                      </p>
                      {done ? (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{step.timestamp} {step.by && `by ${step.by}`}</p>
                      ) : (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 italic">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          {/* Section 5: Photos */}
          <CollapsibleSection title="Photos">
            {wo.photos.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">No photos yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {wo.photos.map((photo) => (
                  <div key={photo.label} className="aspect-square rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-1">
                    <svg className="h-6 w-6 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
                    <span className="text-[10px] text-zinc-400">{photo.label}</span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Section 6: Notes & Activity */}
          <CollapsibleSection title="Notes & Activity">
            {wo.notes.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {wo.notes.map((note, i) => (
                  <div key={i} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{note.author}</span>
                      <span className="text-[10px] text-zinc-400">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Section 7: Related Schedule */}
          {relatedSchedule && (
            <CollapsibleSection title="Related Schedule">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{relatedSchedule.icon}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{relatedSchedule.taskName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Frequency</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{relatedSchedule.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Next Due</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{relatedSchedule.nextDue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Est. Cost</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatCents(relatedSchedule.estimatedCostCents)}</span>
                </div>
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MaintenancePage() {
  const [view, setView] = useState<MaintenanceView>('board');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<WOPriority | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [scheduleTab, setScheduleTab] = useState<'all' | 'overdue' | 'this-week' | 'this-month'>('all');

  /* Filtered work orders */
  const filteredWOs = useMemo(() => {
    return WORK_ORDERS.filter((wo) => {
      const matchesProp = propertyFilter === 'All' || wo.property === propertyFilter;
      const matchesPri = priorityFilter === 'all' || wo.priority === priorityFilter;
      const matchesSearch = !search || wo.title.toLowerCase().includes(search.toLowerCase()) || wo.id.toLowerCase().includes(search.toLowerCase()) || wo.property.toLowerCase().includes(search.toLowerCase());
      return matchesProp && matchesPri && matchesSearch;
    });
  }, [propertyFilter, priorityFilter, search]);

  const grouped = useMemo(() => {
    return STATUS_ORDER.reduce<Record<WOStatus, WorkOrder[]>>((acc, s) => {
      acc[s] = filteredWOs.filter((wo) => wo.status === s);
      return acc;
    }, {} as Record<WOStatus, WorkOrder[]>);
  }, [filteredWOs]);

  /* Filtered schedules */
  const filteredSchedules = useMemo(() => {
    let items = SCHEDULES;
    if (propertyFilter !== 'All') {
      items = items.filter((s) => s.properties.includes(propertyFilter));
    }
    if (search) {
      items = items.filter((s) => s.taskName.toLowerCase().includes(search.toLowerCase()));
    }
    switch (scheduleTab) {
      case 'overdue': return items.filter((s) => s.status === 'overdue');
      case 'this-week': return items.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 7);
      case 'this-month': return items.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 30);
      default: return items;
    }
  }, [propertyFilter, search, scheduleTab]);

  const sortedSchedules = useMemo(() => {
    return [...filteredSchedules].sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return a.nextDueDaysOut - b.nextDueDaysOut;
    });
  }, [filteredSchedules]);

  const totalEstimatedAnnual = SCHEDULES.reduce((sum, s) => {
    const multiplier = s.frequency.toLowerCase().includes('weekly') ? 52 : s.frequency.toLowerCase().includes('monthly') ? 12 : s.frequency.toLowerCase().includes('quarterly') ? 4 : s.frequency.toLowerCase().includes('bi-annual') ? 2 : 1;
    return sum + s.estimatedCostCents * multiplier;
  }, 0);

  const schTabs = useMemo(() => [
    { key: 'all' as const, label: 'All', count: SCHEDULES.length },
    { key: 'overdue' as const, label: 'Overdue', count: SCHEDULES.filter((s) => s.status === 'overdue').length },
    { key: 'this-week' as const, label: 'This Week', count: SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 7).length },
    { key: 'this-month' as const, label: 'This Month', count: SCHEDULES.filter((s) => s.nextDueDaysOut >= 0 && s.nextDueDaysOut <= 30).length },
  ], []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">Maintenance</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {filteredWOs.length} work orders &middot; {SCHEDULES.length} schedules &middot; Annual est: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formatCents(totalEstimatedAnnual)}</span>
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] hover:shadow-xl hover:shadow-[#00a9e0]/30">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Work Order
        </button>
      </div>

      {/* Filters + View Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-700 placeholder-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          />
        </div>

        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          aria-label="Filter by property"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {PROPERTIES.map((p) => (<option key={p} value={p}>{p}</option>))}
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

        {/* View tabs */}
        <div className="ml-auto flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {(['board', 'schedule', 'list'] as MaintenanceView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold capitalize transition-colors',
                view === v
                  ? 'bg-[#00a9e0]/10 text-[#00a9e0]'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
              )}
            >
              {v === 'board' ? 'Board' : v === 'schedule' ? 'Schedule' : 'List'}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* BOARD VIEW (Kanban)                                              */}
      {/* ================================================================ */}
      {view === 'board' && (
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3" style={{ minWidth: '1080px' }}>
            {STATUS_ORDER.map((status) => {
              const items = grouped[status];
              return (
                <div key={status} className="w-48 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{STATUS_LABELS[status]}</span>
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${STATUS_COLORS[status]}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2 p-2">
                    {items.length === 0 && <p className="py-6 text-center text-xs text-zinc-400">None</p>}
                    {items.map((wo) => (
                      <button
                        key={wo.id}
                        type="button"
                        onClick={() => setSelectedWO(wo)}
                        className="w-full rounded-lg border border-[#00a9e033] bg-white p-2.5 text-left shadow-sm transition-all hover:border-[#00a9e0]/40 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                      >
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">{wo.title}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">{wo.property} &middot; {wo.unit}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <PriorityBadge priority={wo.priority} />
                          {wo.pro ? (
                            <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{wo.pro.split(' ')[0]}</span>
                          ) : (
                            <span className="text-[10px] italic text-zinc-400">Unassigned</span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{formatCents(wo.estimatedCostCents)}</span>
                          <span className="text-[10px] text-zinc-400">{wo.created}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SCHEDULE VIEW                                                    */}
      {/* ================================================================ */}
      {view === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule filter tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {schTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setScheduleTab(tab.key)}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  scheduleTab === tab.key
                    ? 'bg-[#00a9e0] text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700',
                )}
              >
                {tab.label}
                <span className={cn(
                  'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold',
                  scheduleTab === tab.key ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Schedule cards */}
          <div className="space-y-4">
            {sortedSchedules.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">No schedules match this filter</p>
              </div>
            ) : sortedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={cn(
                  'rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900',
                  schedule.status === 'overdue' ? 'border-red-200 dark:border-red-500/30' : 'border-zinc-200 dark:border-zinc-800',
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">{schedule.icon}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">{schedule.taskName}</h3>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SCHEDULE_STATUS_STYLES[schedule.status]}`}>
                          {SCHEDULE_STATUS_LABELS[schedule.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{schedule.frequency}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {schedule.properties.map((prop) => (
                          <span key={prop} className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{prop}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-right">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Next Due</p>
                      <p className={cn('font-semibold', schedule.status === 'overdue' ? 'text-red-600 dark:text-red-400' : schedule.nextDueDaysOut <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300')}>{schedule.nextDue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Last Completed</p>
                      <p className="font-medium text-zinc-600 dark:text-zinc-400">{schedule.lastCompleted ?? 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Est. Cost</p>
                      <p className="font-mono font-bold text-zinc-900 dark:text-white">{formatCents(schedule.estimatedCostCents)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Vendor</p>
                      {schedule.assignedVendor ? (
                        <p className="font-medium text-zinc-700 dark:text-zinc-300">{schedule.assignedVendor}</p>
                      ) : (
                        <p className="font-medium text-red-500 dark:text-red-400">Unassigned</p>
                      )}
                    </div>
                  </div>
                </div>
                {schedule.status === 'overdue' && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-500/10">
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <p className="text-xs font-medium text-red-700 dark:text-red-400">
                      This task is {Math.abs(schedule.nextDueDaysOut)} days overdue. Assign a vendor or reschedule.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#00a9e0]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{SCHEDULES.length}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-500/30 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Overdue</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{SCHEDULES.filter((s) => s.status === 'overdue').length}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white p-4 dark:border-amber-500/30 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Unassigned</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{SCHEDULES.filter((s) => !s.assignedVendor).length}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">On Track</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{SCHEDULES.filter((s) => s.status === 'on-track').length}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* LIST VIEW (Combined table)                                       */}
      {/* ================================================================ */}
      {view === 'list' && (
        <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {['ID', 'Type', 'Title', 'Property', 'Priority / Status', 'Assigned Pro', 'Cost', 'Due Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {/* Work Orders */}
              {filteredWOs.map((wo) => (
                <tr
                  key={wo.id}
                  className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  onClick={() => setSelectedWO(wo)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{wo.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#00a9e0]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00a9e0]">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.024 1.194-.14 1.743" /></svg>
                      WO
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{wo.title}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{wo.property}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={wo.priority} />
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[wo.status]}`}>{STATUS_LABELS[wo.status]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{wo.pro || <span className="italic text-zinc-400">--</span>}</td>
                  <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-white">{formatCents(wo.estimatedCostCents)}</td>
                  <td className="px-4 py-3 text-zinc-500">{wo.created}</td>
                </tr>
              ))}
              {/* Schedules */}
              {filteredSchedules.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{s.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                      Schedule
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                    <span className="mr-1">{s.icon}</span>{s.taskName}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{s.properties.join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SCHEDULE_STATUS_STYLES[s.status]}`}>
                      {SCHEDULE_STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{s.assignedVendor || <span className="italic text-zinc-400">--</span>}</td>
                  <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-white">{formatCents(s.estimatedCostCents)}</td>
                  <td className="px-4 py-3 text-zinc-500">{s.nextDue}</td>
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
