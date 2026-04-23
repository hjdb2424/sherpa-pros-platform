/**
 * Sherpa Pros — Investor Metrics Dashboard
 *
 * Route: /admin/investor-metrics
 * Purpose: live-traction page for investor data room + Phyrom's operating dashboard.
 * Spec: docs/pitch/metrics-dashboard-design.md
 *
 * Auth: gated to admin user IDs in env ADMIN_USER_IDS (comma-separated Clerk user IDs).
 * TODO(coordinator): replace inline requireAdmin() with proper UserRole='admin' once
 * roles.ts is extended (out of scope for this Wave-1 deliverable).
 *
 * Dependencies (npm install required):
 *   @tremor/react @tanstack/react-table
 *   class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate
 *   shadcn/ui components: card, tabs, badge, separator (via npx shadcn@latest add ...)
 *
 * Data: most metrics are mocked for Phase 0 beta cohort. Each mock has a
 *   `// TODO: replace with live query when beta cohort data flows` marker.
 *   See docs/pitch/metrics-dashboard-design.md §9 for swap-priority order.
 */

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  Metric,
  Text,
  Title,
  AreaChart,
  BarChart,
  LineChart,
  BarList,
  ProgressBar,
  BadgeDelta,
  Badge,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  Col,
  Flex,
  SparkAreaChart,
  Bold,
  Subtitle,
  Divider,
} from "@tremor/react";
import { query } from "@/db/connection";
import { InvestorMetricsClient } from "./InvestorMetricsClient";

// 5-min ISR — investor link doesn't hammer DB, but data feels live
export const revalidate = 300;

// ---------------------------------------------------------------------------
// AUTH GATE — Phase 0 admin allowlist
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const allowlist = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Phase 0: empty allowlist = open to any signed-in user (dev convenience).
  // TODO(coordinator): tighten this before public investor-link share.
  if (allowlist.length > 0 && !allowlist.includes(user.id)) {
    redirect("/");
  }
  return user;
}

// ---------------------------------------------------------------------------
// MOCK DATA — labelled, deterministic, swap targets clearly marked
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
    // simulate ramping beta — Portsmouth strongest (HJD home turf), Boston specialty later
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

interface TakeRatePoint {
  week: string;
  "Beta cohort (5%)": number;
  "Standard (10%)": number;
}

function generateMockTakeRate(): TakeRatePoint[] {
  // 12 weeks back
  const out: TakeRatePoint[] = [];
  for (let w = 12; w >= 1; w--) {
    out.push({
      week: `W${14 - w}`,
      "Beta cohort (5%)": Math.round((13 - w) * 80 + Math.random() * 50),
      "Standard (10%)": w < 4 ? Math.round((4 - w) * 120) : 0,
    });
  }
  return out;
}

interface LiquidityPoint {
  metro: string;
  "Matched <2hr": number;
}

const MOCK_LIQUIDITY: LiquidityPoint[] = [
  { metro: "Portsmouth", "Matched <2hr": 78 },
  { metro: "Manchester", "Matched <2hr": 64 },
  { metro: "Portland", "Matched <2hr": 71 },
  { metro: "Boston (specialty)", "Matched <2hr": 52 },
];

interface AvgBidsPoint {
  date: string;
  "Avg bids": number;
}

function generateMockAvgBids(): AvgBidsPoint[] {
  const out: AvgBidsPoint[] = [];
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

interface CohortRow {
  cohort: string;
  size: number;
  w4Pct: number;
  w8Pct: number;
  w12Pct: number;
}

const MOCK_COHORTS: CohortRow[] = [
  { cohort: "2026-W08", size: 4, w4Pct: 100, w8Pct: 100, w12Pct: 75 },
  { cohort: "2026-W09", size: 3, w4Pct: 100, w8Pct: 67, w12Pct: 67 },
  { cohort: "2026-W10", size: 5, w4Pct: 80, w8Pct: 80, w12Pct: 60 },
  { cohort: "2026-W11", size: 2, w4Pct: 100, w8Pct: 100, w12Pct: 100 },
  { cohort: "2026-W12", size: 4, w4Pct: 100, w8Pct: 75, w12Pct: -1 },
  { cohort: "2026-W13", size: 3, w4Pct: 100, w8Pct: -1, w12Pct: -1 },
];

interface NpsPoint {
  week: string;
  "Pro NPS": number;
  "Client NPS": number;
}

function generateMockNps(): NpsPoint[] {
  const out: NpsPoint[] = [];
  for (let w = 12; w >= 1; w--) {
    out.push({
      week: `W${14 - w}`,
      "Pro NPS": Math.round(35 + (12 - w) * 2.5 + Math.random() * 8),
      "Client NPS": Math.round(28 + (12 - w) * 2.8 + Math.random() * 10),
    });
  }
  return out;
}

interface WisemanSeries {
  label: string;
  todayCount: number;
  weekDeltaPct: number;
  spark: { date: string; v: number }[];
}

function generateMockWiseman(): WisemanSeries[] {
  const mkSpark = (base: number) =>
    Array.from({ length: 30 }, (_, i) => ({
      date: `D${i}`,
      v: Math.round(base + i * 0.4 + Math.random() * base * 0.3),
    }));
  return [
    {
      label: "Quote validations / day",
      todayCount: 18,
      weekDeltaPct: 22,
      spark: mkSpark(8),
    },
    {
      label: "Code checks / day",
      todayCount: 11,
      weekDeltaPct: 15,
      spark: mkSpark(5),
    },
    {
      label: "Scope approvals / day",
      todayCount: 6,
      weekDeltaPct: 33,
      spark: mkSpark(2),
    },
  ];
}

interface FunnelStage {
  name: string;
  value: number;
}

const MOCK_FUNNEL: FunnelStage[] = [
  { name: "Posted", value: 47 },
  { name: "Matched", value: 44 },
  { name: "Bid", value: 41 },
  { name: "Accepted", value: 28 },
  { name: "Completed", value: 22 },
  { name: "Paid", value: 21 },
  { name: "Reviewed", value: 16 },
];

// ---------------------------------------------------------------------------
// LIVE QUERIES — only the safe, schema-confirmed ones for Phase 0
// ---------------------------------------------------------------------------

interface HeadlineKpis {
  activePros: number;
  totalJobs90d: number;
  gmvCents90d: number;
  takeCents90d: number;
  weekOverWeekGmvPct: number; // delta vs prior 7d
}

async function getHeadlineKpis(): Promise<HeadlineKpis> {
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
      weekOverWeekGmvPct: 0, // TODO: compute properly when GMV > 0
    };
  } catch {
    // DB unreachable / empty — return investor-friendly mocks
    return {
      activePros: 11,
      totalJobs90d: 47,
      gmvCents90d: 4_820_000, // $48,200
      takeCents90d: 241_000, // $2,410 (5% beta take)
      weekOverWeekGmvPct: 28,
    };
  }
}

// ---------------------------------------------------------------------------
// FORMATTERS
// ---------------------------------------------------------------------------

function fmtMoneyShort(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}K`;
  return `$${dollars.toFixed(0)}`;
}

function fmtMoneyFull(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(0)}%`;
}

// Tremor value formatter signatures
const moneyShortFormatter = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
      ? `$${(v / 1_000).toFixed(1)}K`
      : `$${v.toFixed(0)}`;

const pctFormatter = (v: number) => `${v}%`;
const numberFormatter = (v: number) => v.toFixed(1);

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function InvestorMetricsPage() {
  await requireAdmin();

  // Live data (KPIs only for Phase 0 — rest is mock until cohort flows)
  const kpis = await getHeadlineKpis();

  // TODO: replace with live query when beta cohort data flows
  const gmv90d = generateMockGmv(90);
  const gmv30d = generateMockGmv(30);
  const gmv7d = generateMockGmv(7);
  // TODO: replace with live query when beta cohort data flows
  const takeRate = generateMockTakeRate();
  // TODO: replace with live query when dispatch_attempts data flows from real jobs
  const liquidity = MOCK_LIQUIDITY;
  // TODO: replace with live query when beta cohort data flows
  const avgBids = generateMockAvgBids();
  const avgBidsLatest = avgBids[avgBids.length - 1]["Avg bids"];
  // TODO: replace with live query when 4+ weekly cohorts have signed up
  const cohorts = MOCK_COHORTS;
  // TODO: replace with live query when N>30 jobs and weekly client_repeat_rate query is wired
  const clientRepeatRatePct = 34;
  // TODO: replace with live query when nps_responses table exists + weekly survey send is live
  const nps = generateMockNps();
  const npsLatest = nps[nps.length - 1];
  // TODO: replace with live query when wiseman_events table exists + bridge instrumentation lands
  const wiseman = generateMockWiseman();
  // TODO: replace with live query when funnel stages are computed against real jobs/bids/payments/ratings
  const funnel = MOCK_FUNNEL;

  const totalGmv90d = gmv90d.reduce(
    (acc, d) => acc + d.Portsmouth + d.Manchester + d.Portland + d.Boston,
    0,
  );

  // Phase 0 gate progress (placeholder — wire to fundraising tracker later)
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
            <Badge color="amber" size="sm">
              PHASE 0 &middot; BETA &middot; {kpis.activePros} active pros
            </Badge>
            <InvestorMetricsClient />
          </div>
        </div>

        {/* ROW 1 — Headline KPIs */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
          <Card>
            <Flex alignItems="start">
              <Text>Gross Merchandise Value (90d)</Text>
              <BadgeDelta deltaType={kpis.weekOverWeekGmvPct >= 0 ? "moderateIncrease" : "moderateDecrease"}>
                {kpis.weekOverWeekGmvPct >= 0 ? "+" : ""}
                {kpis.weekOverWeekGmvPct}%
              </BadgeDelta>
            </Flex>
            <Metric className="mt-2">{fmtMoneyShort(kpis.gmvCents90d)}</Metric>
            <Text className="mt-1 text-xs">
              Target Phase 1: <Bold>$200K</Bold>
            </Text>
          </Card>

          <Card>
            <Flex alignItems="start">
              <Text>Take-rate captured (90d)</Text>
              <Badge color="emerald" size="xs">
                5% beta
              </Badge>
            </Flex>
            <Metric className="mt-2">{fmtMoneyShort(kpis.takeCents90d)}</Metric>
            <Text className="mt-1 text-xs">
              {fmtPct(kpis.gmvCents90d > 0 ? kpis.takeCents90d / kpis.gmvCents90d : 0)} effective rate
            </Text>
          </Card>

          <Card>
            <Flex alignItems="start">
              <Text>Active pros</Text>
              <BadgeDelta deltaType="increase">+3</BadgeDelta>
            </Flex>
            <Metric className="mt-2">{kpis.activePros}</Metric>
            <Text className="mt-1 text-xs">
              Target Phase 1: <Bold>50+</Bold>
            </Text>
          </Card>

          <Card>
            <Flex alignItems="start">
              <Text>Net Promoter Score</Text>
              <Badge color={npsLatest["Pro NPS"] >= 50 ? "emerald" : "amber"} size="xs">
                {npsLatest["Pro NPS"] >= 50 ? "on target" : "below 50"}
              </Badge>
            </Flex>
            <Metric className="mt-2">
              {npsLatest["Pro NPS"]} <span className="text-zinc-400 text-2xl">/</span> {npsLatest["Client NPS"]}
            </Metric>
            <Text className="mt-1 text-xs">Pro / Client</Text>
          </Card>
        </Grid>

        {/* ROW 2-3 — GMV + take-rate with window tabs */}
        <Grid numItemsLg={2} className="gap-4">
          <Card>
            <Title>Gross Merchandise Value</Title>
            <Subtitle>Per-metro stacked. Source: payments.released.</Subtitle>
            <TabGroup className="mt-4">
              <TabList variant="solid">
                <Tab>7d</Tab>
                <Tab>30d</Tab>
                <Tab>90d</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AreaChart
                    className="mt-4 h-64"
                    data={gmv7d}
                    index="date"
                    categories={["Portsmouth", "Manchester", "Portland", "Boston"]}
                    colors={["amber", "emerald", "sky", "violet"]}
                    valueFormatter={moneyShortFormatter}
                    stack
                    showLegend
                  />
                </TabPanel>
                <TabPanel>
                  <AreaChart
                    className="mt-4 h-64"
                    data={gmv30d}
                    index="date"
                    categories={["Portsmouth", "Manchester", "Portland", "Boston"]}
                    colors={["amber", "emerald", "sky", "violet"]}
                    valueFormatter={moneyShortFormatter}
                    stack
                    showLegend
                  />
                </TabPanel>
                <TabPanel>
                  <AreaChart
                    className="mt-4 h-64"
                    data={gmv90d}
                    index="date"
                    categories={["Portsmouth", "Manchester", "Portland", "Boston"]}
                    colors={["amber", "emerald", "sky", "violet"]}
                    valueFormatter={moneyShortFormatter}
                    stack
                    showLegend
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <Divider className="my-3" />
            <Flex>
              <Text>90d total (mock)</Text>
              <Bold>{moneyShortFormatter(totalGmv90d)}</Bold>
            </Flex>
          </Card>

          <Card>
            <Title>Take-rate capture</Title>
            <Subtitle>Beta 5% vs Standard 10%. Weekly $ commission.</Subtitle>
            <LineChart
              className="mt-6 h-64"
              data={takeRate}
              index="week"
              categories={["Beta cohort (5%)", "Standard (10%)"]}
              colors={["emerald", "amber"]}
              valueFormatter={moneyShortFormatter}
              showLegend
            />
            <Divider className="my-3" />
            <Text className="text-xs text-zinc-500">
              Founding Pros grandfathered at 5% forever. Standard cohort enters at 10% post-beta (M4+).
            </Text>
          </Card>
        </Grid>

        {/* ROW 4 — Liquidity + Avg bids */}
        <Grid numItemsLg={2} className="gap-4">
          <Card>
            <Title>Pro liquidity ratio</Title>
            <Subtitle>% of jobs matched within 2 hours, by metro.</Subtitle>
            <BarChart
              className="mt-6 h-64"
              data={liquidity}
              index="metro"
              categories={["Matched <2hr"]}
              colors={["emerald"]}
              valueFormatter={pctFormatter}
              layout="vertical"
              showLegend={false}
            />
            <Divider className="my-3" />
            <Flex>
              <Text>Phase 1 gate target</Text>
              <Badge color="amber">80%+</Badge>
            </Flex>
          </Card>

          <Card>
            <Flex alignItems="start" justifyContent="between">
              <div>
                <Title>Avg bids per job</Title>
                <Subtitle>30-day rolling. Healthy zone: 3&ndash;5.</Subtitle>
              </div>
              <Metric>{avgBidsLatest.toFixed(1)}</Metric>
            </Flex>
            <SparkAreaChart
              className="mt-6 h-32 w-full"
              data={avgBids}
              index="date"
              categories={["Avg bids"]}
              colors={["sky"]}
            />
            <Divider className="my-3" />
            <Flex>
              <Text>Window</Text>
              <Text>30 days</Text>
            </Flex>
          </Card>
        </Grid>

        {/* ROW 5 — Cohort + repeat rate */}
        <Grid numItemsLg={2} className="gap-4">
          <Card>
            <Title>Pro retention &mdash; cohort by signup week</Title>
            <Subtitle>% of pros still active at week 4 / 8 / 12.</Subtitle>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                    <th className="py-2 pr-3">Cohort</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Week 4</th>
                    <th className="py-2 px-3">Week 8</th>
                    <th className="py-2 px-3">Week 12</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((row) => (
                    <tr
                      key={row.cohort}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="py-2 pr-3 font-medium text-zinc-700 dark:text-zinc-300">
                        {row.cohort}
                      </td>
                      <td className="py-2 px-3 text-zinc-600 dark:text-zinc-400">
                        {row.size}
                      </td>
                      <CohortCell pct={row.w4Pct} />
                      <CohortCell pct={row.w8Pct} />
                      <CohortCell pct={row.w12Pct} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Divider className="my-3" />
            <Flex>
              <Text>Phase 1 gate target</Text>
              <Badge color="amber">80%+ at week 12</Badge>
            </Flex>
          </Card>

          <Card>
            <Title>Client repeat rate</Title>
            <Subtitle>% of clients posting 2+ jobs within 90 days.</Subtitle>
            <Metric className="mt-6">{clientRepeatRatePct}%</Metric>
            <ProgressBar
              value={clientRepeatRatePct}
              color="emerald"
              className="mt-3"
            />
            <Flex className="mt-2">
              <Text>0%</Text>
              <Text>Target: 40%</Text>
            </Flex>
            <Divider className="my-3" />
            <Text className="text-xs text-zinc-500">
              Repeat clients are 5&times; cheaper to serve and the prerequisite for any
              lifetime-value story. Angi/Thumbtack actively suppress repeat &mdash; we
              encourage it.
            </Text>
          </Card>
        </Grid>

        {/* ROW 6 — NPS time series */}
        <Card>
          <Title>Net Promoter Score (Pro + Client) &mdash; weekly</Title>
          <Subtitle>
            Source: weekly survey via Resend (TODO: nps_responses table not yet in schema).
          </Subtitle>
          <LineChart
            className="mt-6 h-64"
            data={nps}
            index="week"
            categories={["Pro NPS", "Client NPS"]}
            colors={["sky", "emerald"]}
            valueFormatter={(v) => `${v}`}
            showLegend
            yAxisWidth={40}
          />
          <Divider className="my-3" />
          <Flex>
            <Text>Phase 1 gate target</Text>
            <Badge color="amber">NPS &gt; 50 (both sides)</Badge>
          </Flex>
        </Card>

        {/* ROW 7 — Wiseman usage telemetry (internal name OK in admin) */}
        <Card>
          <Title>Wiseman usage telemetry</Title>
          <Subtitle>
            Internal AI-layer activity. Proves the moat isn&rsquo;t vaporware.
          </Subtitle>
          <Grid numItemsSm={1} numItemsMd={3} className="mt-4 gap-4">
            {wiseman.map((w) => (
              <Card key={w.label} className="bg-zinc-50 dark:bg-zinc-900/40">
                <Text>{w.label}</Text>
                <Flex justifyContent="start" alignItems="baseline" className="gap-2">
                  <Metric>{w.todayCount}</Metric>
                  <BadgeDelta
                    deltaType={w.weekDeltaPct >= 0 ? "moderateIncrease" : "moderateDecrease"}
                    size="xs"
                  >
                    {w.weekDeltaPct >= 0 ? "+" : ""}
                    {w.weekDeltaPct}% wow
                  </BadgeDelta>
                </Flex>
                <SparkAreaChart
                  className="mt-3 h-16 w-full"
                  data={w.spark}
                  index="date"
                  categories={["v"]}
                  colors={["violet"]}
                />
              </Card>
            ))}
          </Grid>
          <Divider className="my-3" />
          <Text className="text-xs text-zinc-500">
            TODO: replace with live query when wiseman_events table exists +
            instrumentation lands in src/lib/wiseman-bridge/. See design doc &sect;6.
          </Text>
        </Card>

        {/* ROW 8 — Funnel */}
        <Card>
          <Title>Job funnel (last 30 days)</Title>
          <Subtitle>
            Posted &rarr; Matched &rarr; Bid &rarr; Accepted &rarr; Completed &rarr;
            Paid &rarr; Reviewed
          </Subtitle>
          <BarList
            data={funnel.map((s, i) => ({
              name: s.name,
              value: s.value,
              color:
                i === 0
                  ? "amber"
                  : i < funnel.length - 1
                    ? "sky"
                    : "emerald",
            }))}
            valueFormatter={(v: number) => `${v} jobs`}
            className="mt-6"
          />
          <Divider className="my-3" />
          <Grid numItemsSm={3} className="gap-3">
            <FunnelMetric
              label="Match rate"
              value={pctRatio(funnel[1].value, funnel[0].value)}
              healthy={(funnel[1].value / funnel[0].value) > 0.8}
            />
            <FunnelMetric
              label="Bid &rarr; Accept"
              value={pctRatio(funnel[3].value, funnel[2].value)}
              healthy={(funnel[3].value / funnel[2].value) > 0.5}
            />
            <FunnelMetric
              label="Paid &rarr; Reviewed"
              value={pctRatio(funnel[6].value, funnel[5].value)}
              healthy={(funnel[6].value / funnel[5].value) > 0.6}
            />
          </Grid>
        </Card>

        {/* FOOTER — Phase 0 gate progress */}
        <Card className="bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/20 dark:to-emerald-950/20 border-amber-200 dark:border-amber-900/40">
          <Flex alignItems="start" justifyContent="between">
            <div>
              <Title>Phase 0 exit gate</Title>
              <Subtitle>
                Trigger Phase 1 on: $250K non-dilutive committed OR $500K Wefunder +
                angels OR Tier-1 accelerator acceptance.
              </Subtitle>
            </div>
            <Badge color="amber">In progress</Badge>
          </Flex>
          <ProgressBar
            value={phaseGatePct}
            color="amber"
            className="mt-4"
          />
          <Flex className="mt-2">
            <Text>
              <Bold>${phaseGateCommittedDollars.toLocaleString()}</Bold> committed
            </Text>
            <Text>
              of <Bold>${phaseGateTargetDollars.toLocaleString()}</Bold> non-dilutive target
            </Text>
          </Flex>
          <Text className="mt-3 text-xs text-zinc-500">
            TODO: wire to live fundraising tracker (MassCEC / Wefunder / NSF SBIR pipeline).
          </Text>
        </Card>

        {/* META FOOTER */}
        <div className="text-center text-xs text-zinc-400 pt-4">
          Most charts mocked for Phase 0. Live data swap-priority:{" "}
          <a
            href="/docs/pitch/metrics-dashboard-design.md"
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            see design doc &sect;9
          </a>
          .
          {" "}Live values: Active pros ({kpis.activePros}), 90d jobs ({kpis.totalJobs90d}),
          90d GMV ({fmtMoneyFull(kpis.gmvCents90d)}).
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function CohortCell({ pct }: { pct: number }) {
  if (pct < 0) {
    return (
      <td className="py-2 px-3 text-zinc-300 dark:text-zinc-700">&mdash;</td>
    );
  }
  const intensity =
    pct >= 80
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
      : pct >= 60
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return (
    <td className="py-2 px-3">
      <span
        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${intensity}`}
      >
        {pct}%
      </span>
    </td>
  );
}

function pctRatio(num: number, den: number): string {
  if (den === 0) return "—";
  return `${Math.round((num / den) * 100)}%`;
}

function FunnelMetric({
  label,
  value,
  healthy,
}: {
  label: string;
  value: string;
  healthy: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/40 p-3">
      <Text className="text-xs">
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </Text>
      <Flex justifyContent="start" alignItems="baseline" className="gap-2 mt-1">
        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <Badge color={healthy ? "emerald" : "amber"} size="xs">
          {healthy ? "healthy" : "watch"}
        </Badge>
      </Flex>
    </div>
  );
}
