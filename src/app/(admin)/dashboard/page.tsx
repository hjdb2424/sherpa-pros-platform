import {
  UserGroupIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

/* ---------- types ---------- */
interface AdminStats {
  totalPros: number;
  totalJobs: number;
  activeDisputes: number;
  revenueMtdCents: number;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
}

/* ---------- mock fallback ---------- */
const MOCK_STATS: AdminStats = {
  totalPros: 127,
  totalJobs: 384,
  activeDisputes: 5,
  revenueMtdCents: 4_821_500,
};

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "signup", message: "New pro signed up: Jake Rivera (Electrician)", time: "12 min ago" },
  { id: "2", type: "job", message: "Job posted: Kitchen sink replacement — Nashua, NH", time: "28 min ago" },
  { id: "3", type: "bid", message: "Bid accepted on Deck repair — $2,400", time: "45 min ago" },
  { id: "4", type: "payment", message: "Payment released: $1,850 to Sarah Chen (Plumber)", time: "1 hr ago" },
  { id: "5", type: "signup", message: "New pro signed up: Marcus Bell (HVAC)", time: "1 hr ago" },
  { id: "6", type: "job", message: "Job completed: Bathroom remodel — Manchester, NH", time: "2 hr ago" },
  { id: "7", type: "dispute", message: "Dispute opened: Drywall finishing quality — $750", time: "3 hr ago" },
  { id: "8", type: "payment", message: "Commission earned: $185 on flooring job", time: "3 hr ago" },
  { id: "9", type: "bid", message: "Bid accepted on Roof patch — $900", time: "4 hr ago" },
  { id: "10", type: "signup", message: "New pro signed up: Amy Torres (Painter)", time: "5 hr ago" },
];

/* ---------- data fetching ---------- */
async function getAdminStats(): Promise<AdminStats> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/dashboard`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return {
      totalPros: data.stats?.activePros ?? MOCK_STATS.totalPros,
      totalJobs: data.stats?.totalJobs ?? MOCK_STATS.totalJobs,
      activeDisputes: MOCK_STATS.activeDisputes,
      revenueMtdCents: MOCK_STATS.revenueMtdCents,
    };
  } catch {
    return MOCK_STATS;
  }
}

/* ---------- helpers ---------- */
function fmtCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

const typeColors: Record<string, string> = {
  signup: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  job: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  bid: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  payment: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  dispute: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

/* ---------- page ---------- */
export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Pros", value: stats.totalPros.toLocaleString(), icon: UserGroupIcon, color: "text-sky-500" },
    { label: "Total Jobs", value: stats.totalJobs.toLocaleString(), icon: BriefcaseIcon, color: "text-emerald-500" },
    { label: "Active Disputes", value: stats.activeDisputes.toString(), icon: ExclamationTriangleIcon, color: "text-amber-500" },
    { label: "Revenue (MTD)", value: fmtCents(stats.revenueMtdCents), icon: CurrencyDollarIcon, color: "text-violet-500" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Platform overview and recent activity
      </p>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {c.label}
              </span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
          <CheckCircleIcon className="h-4 w-4" />
          Approve Pro
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
          <ExclamationTriangleIcon className="h-4 w-4" />
          Review Dispute
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export Data
        </button>
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Activity
        </h2>
        <div className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {MOCK_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeColors[item.type] ?? "bg-zinc-100 text-zinc-600"}`}
              >
                {item.type}
              </span>
              <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                {item.message}
              </span>
              <span className="text-xs text-zinc-400 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
