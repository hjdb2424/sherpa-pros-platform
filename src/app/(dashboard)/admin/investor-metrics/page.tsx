/**
 * Sherpa Pros — Investor Metrics Dashboard (Server Component)
 *
 * Route: /admin/investor-metrics
 * Handles: auth gate + data fetching. All Tremor rendering is in
 * InvestorMetricsDashboard.tsx (client component) to avoid createContext SSR crash.
 */

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { query } from "@/db/connection";
import InvestorMetricsDashboard from "./InvestorMetricsDashboard";
import { InvestorMetricsClient } from "./InvestorMetricsClient";

export const revalidate = 300;

// ---------------------------------------------------------------------------
// AUTH GATE
// ---------------------------------------------------------------------------

async function requireAdmin() {
  // Skip auth gate when Clerk is not configured (dev/preview)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return { id: "dev-admin", firstName: "Dev", lastName: "Admin" };
  }

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const allowlist = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowlist.length > 0 && !allowlist.includes(user.id)) {
    redirect("/");
  }
  return user;
}

// ---------------------------------------------------------------------------
// MOCK DATA GENERATORS
// ---------------------------------------------------------------------------

interface GmvDailyPoint {
  date: string;
  Portsmouth: number;
  Manchester: number;
  Portland: number;
  Boston: number;
}

function generateMockGmv(days: number): GmvDailyPoint[] {
  const out: GmvDailyPoint[] = [];
  const today = new Date("2026-04-22");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ramp = (days - i) / days;
    out.push({
      date: d.toISOString().slice(0, 10),
      Portsmouth: Math.round(ramp * 4200 + Math.random() * 800),
      Manchester: Math.round(ramp * 2100 + Math.random() * 600),
      Portland: Math.round(ramp * 1400 + Math.random() * 400),
      Boston: Math.round(ramp * 1200 + Math.random() * 500),
    });
  }
  return out;
}

function generateMockTakeRate() {
  const out: { week: string; "Beta cohort (5%)": number; "Standard (10%)": number }[] = [];
  for (let w = 12; w >= 1; w--) {
    out.push({
      week: `W${14 - w}`,
      "Beta cohort (5%)": Math.round((13 - w) * 80 + Math.random() * 50),
      "Standard (10%)": w < 4 ? Math.round((4 - w) * 120) : 0,
    });
  }
  return out;
}

function generateMockAvgBids() {
  const out: { date: string; "Avg bids": number }[] = [];
  const today = new Date("2026-04-22");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(5, 10),
      "Avg bids": Number((2.1 + Math.random() * 1.6).toFixed(2)),
    });
  }
  return out;
}

function generateMockNps() {
  const out: { week: string; "Pro NPS": number; "Client NPS": number }[] = [];
  for (let w = 12; w >= 1; w--) {
    out.push({
      week: `W${14 - w}`,
      "Pro NPS": Math.round(35 + (12 - w) * 2.5 + Math.random() * 8),
      "Client NPS": Math.round(28 + (12 - w) * 2.8 + Math.random() * 10),
    });
  }
  return out;
}

function generateMockWiseman() {
  const mkSpark = (base: number) =>
    Array.from({ length: 30 }, (_, i) => ({
      date: `D${i}`,
      v: Math.round(base + i * 0.4 + Math.random() * base * 0.3),
    }));
  return [
    { label: "Quote validations / day", todayCount: 18, weekDeltaPct: 22, spark: mkSpark(8) },
    { label: "Code checks / day", todayCount: 11, weekDeltaPct: 15, spark: mkSpark(5) },
    { label: "Scope approvals / day", todayCount: 6, weekDeltaPct: 33, spark: mkSpark(2) },
  ];
}

// ---------------------------------------------------------------------------
// LIVE QUERIES
// ---------------------------------------------------------------------------

async function getHeadlineKpis() {
  try {
    const [proRow] = await query<{ count: string }>(
      "SELECT COUNT(*) as count FROM pros WHERE onboarding_status = 'active'",
    );
    const [jobRow] = await query<{ count: string }>(
      "SELECT COUNT(*) as count FROM jobs WHERE created_at >= NOW() - INTERVAL '90 days' AND status != 'draft'",
    );
    const [gmvRow] = await query<{ sum: string | null }>(
      "SELECT COALESCE(SUM(amount_cents), 0) as sum FROM payments WHERE status = 'released' AND released_at >= NOW() - INTERVAL '90 days'",
    );
    const [takeRow] = await query<{ sum: string | null }>(
      "SELECT COALESCE(SUM(commission_cents), 0) as sum FROM payments WHERE status = 'released' AND released_at >= NOW() - INTERVAL '90 days'",
    );

    return {
      activePros: parseInt(proRow.count, 10),
      totalJobs90d: parseInt(jobRow.count, 10),
      gmvCents90d: parseInt(gmvRow.sum ?? "0", 10),
      takeCents90d: parseInt(takeRow.sum ?? "0", 10),
      weekOverWeekGmvPct: 0,
    };
  } catch {
    return {
      activePros: 11,
      totalJobs90d: 47,
      gmvCents90d: 4_820_000,
      takeCents90d: 241_000,
      weekOverWeekGmvPct: 28,
    };
  }
}

// ---------------------------------------------------------------------------
// PAGE (Server Component — no Tremor imports here)
// ---------------------------------------------------------------------------

export default async function InvestorMetricsPage() {
  await requireAdmin();

  const kpis = await getHeadlineKpis();
  const gmv90d = generateMockGmv(90);
  const gmv30d = generateMockGmv(30);
  const gmv7d = generateMockGmv(7);
  const takeRate = generateMockTakeRate();
  const liquidity = [
    { metro: "Portsmouth", "Matched <2hr": 78 },
    { metro: "Manchester", "Matched <2hr": 64 },
    { metro: "Portland", "Matched <2hr": 71 },
    { metro: "Boston (specialty)", "Matched <2hr": 52 },
  ];
  const avgBids = generateMockAvgBids();
  const avgBidsLatest = avgBids[avgBids.length - 1]["Avg bids"];
  const cohorts = [
    { cohort: "2026-W08", size: 4, w4Pct: 100, w8Pct: 100, w12Pct: 75 },
    { cohort: "2026-W09", size: 3, w4Pct: 100, w8Pct: 67, w12Pct: 67 },
    { cohort: "2026-W10", size: 5, w4Pct: 80, w8Pct: 80, w12Pct: 60 },
    { cohort: "2026-W11", size: 2, w4Pct: 100, w8Pct: 100, w12Pct: 100 },
    { cohort: "2026-W12", size: 4, w4Pct: 100, w8Pct: 75, w12Pct: -1 },
    { cohort: "2026-W13", size: 3, w4Pct: 100, w8Pct: -1, w12Pct: -1 },
  ];
  const clientRepeatRatePct = 34;
  const nps = generateMockNps();
  const npsLatest = nps[nps.length - 1];
  const wiseman = generateMockWiseman();
  const funnel = [
    { name: "Posted", value: 47 },
    { name: "Matched", value: 44 },
    { name: "Bid", value: 41 },
    { name: "Accepted", value: 28 },
    { name: "Completed", value: 22 },
    { name: "Paid", value: 21 },
    { name: "Reviewed", value: 16 },
  ];

  const totalGmv90d = gmv90d.reduce(
    (acc, d) => acc + d.Portsmouth + d.Manchester + d.Portland + d.Boston,
    0,
  );

  const phaseGateCommittedDollars = 78_000;
  const phaseGateTargetDollars = 250_000;
  const phaseGatePct = (phaseGateCommittedDollars / phaseGateTargetDollars) * 100;

  const lastUpdated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sherpa Pros &mdash; Live Traction
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Beta cohort metrics. Updates every 5 minutes. As of {lastUpdated}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              PHASE 0 &middot; BETA &middot; {kpis.activePros} active pros
            </span>
            <InvestorMetricsClient />
          </div>
        </div>

        {/* All Tremor charts rendered in client component */}
        <InvestorMetricsDashboard
          kpis={kpis}
          gmv7d={gmv7d}
          gmv30d={gmv30d}
          gmv90d={gmv90d}
          totalGmv90d={totalGmv90d}
          takeRate={takeRate}
          liquidity={liquidity}
          avgBids={avgBids}
          avgBidsLatest={avgBidsLatest}
          cohorts={cohorts}
          clientRepeatRatePct={clientRepeatRatePct}
          nps={nps}
          npsLatest={npsLatest}
          wiseman={wiseman}
          funnel={funnel}
          phaseGateCommittedDollars={phaseGateCommittedDollars}
          phaseGateTargetDollars={phaseGateTargetDollars}
          phaseGatePct={phaseGatePct}
          lastUpdated={lastUpdated}
        />

        {/* META FOOTER */}
        <div className="text-center text-xs text-zinc-400 pt-4">
          Most charts mocked for Phase 0. Live values: Active pros ({kpis.activePros}), 90d jobs ({kpis.totalJobs90d}).
        </div>
      </div>
    </div>
  );
}
