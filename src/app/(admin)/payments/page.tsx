import {
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

/* ---------- types ---------- */
interface PaymentStat {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface RecentPayment {
  id: string;
  date: string;
  job_title: string;
  amount_cents: number;
  commission_cents: number;
  pro: string;
  status: string;
}

/* ---------- mock ---------- */
const MOCK_PAYMENTS: RecentPayment[] = [
  { id: "pay1", date: "2026-04-14", job_title: "Bathroom remodel", amount_cents: 450000, commission_cents: 45000, pro: "Sarah Chen", status: "released" },
  { id: "pay2", date: "2026-04-14", job_title: "Deck repair", amount_cents: 240000, commission_cents: 24000, pro: "Devon Park", status: "released" },
  { id: "pay3", date: "2026-04-13", job_title: "Roof patching", amount_cents: 85000, commission_cents: 8500, pro: "Lin Wu", status: "held" },
  { id: "pay4", date: "2026-04-13", job_title: "Electrical panel", amount_cents: 220000, commission_cents: 22000, pro: "Jake Rivera", status: "released" },
  { id: "pay5", date: "2026-04-12", job_title: "Interior painting", amount_cents: 195000, commission_cents: 19500, pro: "Amy Torres", status: "pending" },
  { id: "pay6", date: "2026-04-11", job_title: "Kitchen sink fix", amount_cents: 65000, commission_cents: 6500, pro: "Sarah Chen", status: "released" },
  { id: "pay7", date: "2026-04-10", job_title: "HVAC service", amount_cents: 180000, commission_cents: 18000, pro: "Marcus Bell", status: "disputed" },
  { id: "pay8", date: "2026-04-09", job_title: "Drywall repair", amount_cents: 75000, commission_cents: 7500, pro: "Carlos Mendez", status: "refunded" },
];

/* ---------- helpers ---------- */
function fmtCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const payStatusColors: Record<string, string> = {
  released: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  held: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  pending: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  disputed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  refunded: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
};

/* ---------- page ---------- */
export default async function AdminPaymentsPage() {
  const payments = MOCK_PAYMENTS;

  const totalRevenue = payments.reduce((s, p) => s + p.amount_cents, 0);
  const pendingPayouts = payments
    .filter((p) => p.status === "held" || p.status === "pending")
    .reduce((s, p) => s + p.amount_cents, 0);
  const commissionEarned = payments
    .filter((p) => p.status === "released")
    .reduce((s, p) => s + p.commission_cents, 0);
  const refunds = payments
    .filter((p) => p.status === "refunded")
    .reduce((s, p) => s + p.amount_cents, 0);

  const stats: PaymentStat[] = [
    { label: "Total Revenue", value: fmtCents(totalRevenue), icon: CurrencyDollarIcon, color: "text-emerald-500" },
    { label: "Pending Payouts", value: fmtCents(pendingPayouts), icon: ClockIcon, color: "text-amber-500" },
    { label: "Commission Earned", value: fmtCents(commissionEarned), icon: ArrowTrendingUpIcon, color: "text-sky-500" },
    { label: "Refunds", value: fmtCents(refunds), icon: ArrowPathIcon, color: "text-red-500" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Payments
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Revenue overview and transaction history
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {s.label}
              </span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export CSV
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
          <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
          QBO sync: Connected
        </div>
      </div>

      {/* Payments table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Pro</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {fmtDate(p.date)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {p.job_title}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {fmtCents(p.amount_cents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {fmtCents(p.commission_cents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {p.pro}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${payStatusColors[p.status] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
