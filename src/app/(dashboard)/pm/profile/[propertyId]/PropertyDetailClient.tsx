'use client';

import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

interface Unit {
  number: string;
  sqft: number;
  beds: number;
  baths: number;
  status: 'occupied' | 'vacant' | 'make-ready';
  tenant: string | null;
  leaseEnd: string | null;
  rent: number;
}

interface PropertyData {
  id: string;
  name: string;
  address: string;
  type: string;
  yearBuilt: number;
  totalSqft: string;
  units: Unit[];
  occupancy: number;
  avgRent: number;
  heroPhoto: string;
  photos: string[];
  financials: {
    revenue: number;
    expenses: number;
    noi: number;
    monthlyTrend: { month: string; revenue: number; expenses: number }[];
    budgetActual: { category: string; budget: number; actual: number }[];
  };
  workOrders: {
    id: string;
    title: string;
    unit: string;
    priority: string;
    status: string;
    assignedTo: string;
    date: string;
  }[];
  compliance: { item: string; status: 'current' | 'due-soon' | 'overdue'; date: string }[];
}

const PROPERTIES: Record<string, PropertyData> = {
  'maple-ridge': {
    id: 'maple-ridge',
    name: 'Maple Ridge Apartments',
    address: '145 Maple Ave, Portsmouth, NH 03801',
    type: 'Multi-Family',
    yearBuilt: 1998,
    totalSqft: '52,800',
    occupancy: 94,
    avgRent: 1850,
    heroPhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop',
    ],
    units: [
      { number: '101', sqft: 750, beds: 1, baths: 1, status: 'occupied', tenant: 'John Davis', leaseEnd: '2026-08-31', rent: 1650 },
      { number: '102', sqft: 950, beds: 2, baths: 1, status: 'occupied', tenant: 'Maria Santos', leaseEnd: '2026-11-30', rent: 1900 },
      { number: '103', sqft: 1100, beds: 2, baths: 2, status: 'occupied', tenant: 'James Wilson', leaseEnd: '2026-06-30', rent: 2100 },
      { number: '104', sqft: 750, beds: 1, baths: 1, status: 'vacant', tenant: null, leaseEnd: null, rent: 1700 },
      { number: '201', sqft: 950, beds: 2, baths: 1, status: 'occupied', tenant: 'Sarah Chen', leaseEnd: '2027-01-31', rent: 1850 },
      { number: '202', sqft: 1100, beds: 2, baths: 2, status: 'make-ready', tenant: null, leaseEnd: null, rent: 2100 },
      { number: '203', sqft: 750, beds: 1, baths: 1, status: 'occupied', tenant: 'David Kim', leaseEnd: '2026-09-30', rent: 1700 },
      { number: '204', sqft: 950, beds: 2, baths: 1, status: 'occupied', tenant: 'Lisa Park', leaseEnd: '2026-12-31', rent: 1900 },
      { number: '301', sqft: 1100, beds: 2, baths: 2, status: 'occupied', tenant: 'Carlos Rivera', leaseEnd: '2026-07-31', rent: 2050 },
      { number: '305', sqft: 750, beds: 1, baths: 1, status: 'occupied', tenant: 'Emma Brooks', leaseEnd: '2027-03-31', rent: 1650 },
    ],
    financials: {
      revenue: 18650,
      expenses: 7200,
      noi: 11450,
      monthlyTrend: [
        { month: 'Jul', revenue: 17800, expenses: 6800 },
        { month: 'Aug', revenue: 18100, expenses: 7100 },
        { month: 'Sep', revenue: 18300, expenses: 6900 },
        { month: 'Oct', revenue: 18300, expenses: 7400 },
        { month: 'Nov', revenue: 18500, expenses: 7000 },
        { month: 'Dec', revenue: 18500, expenses: 7200 },
        { month: 'Jan', revenue: 18650, expenses: 7500 },
        { month: 'Feb', revenue: 18650, expenses: 6800 },
        { month: 'Mar', revenue: 18650, expenses: 7200 },
        { month: 'Apr', revenue: 18650, expenses: 7100 },
      ],
      budgetActual: [
        { category: 'Maintenance', budget: 3500, actual: 3800 },
        { category: 'Utilities', budget: 1200, actual: 1100 },
        { category: 'Insurance', budget: 800, actual: 800 },
        { category: 'Management Fee', budget: 1500, actual: 1500 },
      ],
    },
    workOrders: [
      { id: 'WO-101', title: 'Leaking faucet', unit: '204', priority: 'routine', status: 'New', assignedTo: 'Unassigned', date: '2026-04-14' },
      { id: 'WO-093', title: 'Water heater pilot out', unit: '410', priority: 'emergency', status: 'Dispatched', assignedTo: 'James Wilson', date: '2026-04-13' },
      { id: 'WO-090', title: 'Toilet running constantly', unit: '305', priority: 'urgent', status: 'Dispatched', assignedTo: 'Mike Rodriguez', date: '2026-04-12' },
      { id: 'WO-085', title: 'Kitchen cabinet hinge', unit: '118', priority: 'routine', status: 'In Progress', assignedTo: 'Carlos Rivera', date: '2026-04-10' },
      { id: 'WO-080', title: 'Bathroom caulk repair', unit: '201', priority: 'routine', status: 'Completed', assignedTo: 'Diana Brooks', date: '2026-04-08' },
    ],
    compliance: [
      { item: 'Fire extinguisher inspection', status: 'current', date: '2026-12-15' },
      { item: 'Boiler inspection', status: 'due-soon', date: '2026-05-12' },
      { item: 'Elevator certification', status: 'current', date: '2027-06-01' },
      { item: 'Lead paint disclosure', status: 'current', date: '2027-01-01' },
    ],
  },
};

// Fallback for unknown properties
function getProperty(id: string): PropertyData {
  return (
    PROPERTIES[id] ?? {
      ...PROPERTIES['maple-ridge'],
      id,
      name: `Property ${id}`,
    }
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    occupied: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    vacant: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    'make-ready': 'bg-sky-100 text-[#00a9e0] dark:bg-[#00a9e0]/20',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status] || styles.vacant}`}>
      {status}
    </span>
  );
}

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

function ComplianceBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    current: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    'due-soon': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  };
  const labels: Record<string, string> = {
    current: 'Current',
    'due-soon': 'Due Soon',
    overdue: 'Overdue',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status] || styles.current}`}>
      {labels[status] || status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function PropertyDetailClient({ propertyId }: { propertyId: string }) {
  const property = getProperty(propertyId);

  const maxRevenue = Math.max(...property.financials.monthlyTrend.map((m) => m.revenue));

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/pm/profile"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#00a9e0] transition-colors hover:text-[#0090c0]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Company Profile
      </Link>

      {/* ---------------------------------------------------------------- */}
      {/* Property Header                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={property.heroPhoto} alt={property.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-2xl font-bold text-white">{property.name}</h1>
            <p className="mt-1 text-sm text-white/80">{property.address}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Type</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{property.type}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Year Built</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{property.yearBuilt}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Sqft</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{property.totalSqft}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Occupancy</p>
            <p className={`mt-1 text-sm font-semibold ${property.occupancy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#00a9e0]'}`}>
              {property.occupancy}%
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Avg Rent</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">${property.avgRent.toLocaleString()}/mo</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Unit Directory                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Unit Directory
          <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">({property.units.length} units)</span>
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Sqft</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Beds/Baths</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Lease End</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {property.units.map((unit) => (
                <tr key={unit.number} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white">#{unit.number}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{unit.sqft.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{unit.beds}bd / {unit.baths}ba</td>
                  <td className="px-4 py-3"><StatusBadge status={unit.status} /></td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{unit.tenant ?? '--'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {unit.leaseEnd ? new Date(unit.leaseEnd).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '--'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-white">${unit.rent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Financial Performance                                             */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Financial Performance</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Monthly Revenue</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${property.financials.revenue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-[#00a9e033] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Monthly Expenses</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">${property.financials.expenses.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">NOI</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${property.financials.noi.toLocaleString()}</p>
          </div>
        </div>

        {/* Mini bar chart for 12-month trend */}
        <div className="mt-4 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Revenue Trend (Last 10 Months)</h3>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {property.financials.monthlyTrend.map((m) => {
              const height = (m.revenue / maxRevenue) * 100;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#00a9e0]/80 transition-all hover:bg-[#00a9e0]"
                    style={{ height: `${height}%` }}
                    title={`$${m.revenue.toLocaleString()}`}
                  />
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="mt-4 rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Budget vs Actual</h3>
          <div className="space-y-3">
            {property.financials.budgetActual.map((item) => {
              const over = item.actual > item.budget;
              const pct = ((item.actual / item.budget) * 100).toFixed(0);
              return (
                <div key={item.category} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 text-sm text-zinc-600 dark:text-zinc-400">{item.category}</span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${over ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(Number(pct), 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${over ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {pct}%
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    ${item.actual.toLocaleString()} / ${item.budget.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Maintenance History                                               */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Recent Work Orders</h2>
        <div className="overflow-x-auto rounded-xl border border-[#00a9e033] bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {property.workOrders.map((wo) => (
                <tr key={wo.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 text-sm font-mono text-[#00a9e0]">{wo.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{wo.title}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{wo.unit}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={wo.priority} /></td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{wo.status}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{wo.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Compliance                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Compliance Status</h2>
        <div className="rounded-xl border border-[#00a9e033] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-3">
            {property.compliance.map((item) => (
              <div key={item.item} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.item}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.date}</span>
                  <ComplianceBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Photos                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Photos</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {property.photos.map((photo, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[#00a9e033] dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`${property.name} photo ${i + 1}`} className="h-40 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
