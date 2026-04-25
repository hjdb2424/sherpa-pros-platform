"use client";

/**
 * Client-side Tremor dashboard — receives all data as serializable props
 * from the server component (page.tsx) which handles auth + data fetching.
 */

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
  Flex,
  SparkAreaChart,
  Bold,
  Subtitle,
  Divider,
} from "@tremor/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GmvDailyPoint {
  date: string;
  Northeast: number;
  Southeast: number;
  Central: number;
  "West Coast": number;
}

interface TakeRatePoint {
  week: string;
  "Beta cohort (5%)": number;
  "Standard (10%)": number;
}

interface LiquidityPoint {
  metro: string;
  "Matched <2hr": number;
}

interface AvgBidsPoint {
  date: string;
  "Avg bids": number;
}

interface CohortRow {
  cohort: string;
  size: number;
  w4Pct: number;
  w8Pct: number;
  w12Pct: number;
}

interface NpsPoint {
  week: string;
  "Pro NPS": number;
  "Client NPS": number;
}

interface WisemanSeries {
  label: string;
  todayCount: number;
  weekDeltaPct: number;
  spark: { date: string; v: number }[];
}

interface FunnelStage {
  name: string;
  value: number;
}

export interface DashboardProps {
  kpis: {
    activePros: number;
    totalJobs90d: number;
    gmvCents90d: number;
    takeCents90d: number;
    weekOverWeekGmvPct: number;
  };
  gmv7d: GmvDailyPoint[];
  gmv30d: GmvDailyPoint[];
  gmv90d: GmvDailyPoint[];
  totalGmv90d: number;
  takeRate: TakeRatePoint[];
  liquidity: LiquidityPoint[];
  avgBids: AvgBidsPoint[];
  avgBidsLatest: number;
  cohorts: CohortRow[];
  clientRepeatRatePct: number;
  nps: NpsPoint[];
  npsLatest: { "Pro NPS": number; "Client NPS": number };
  wiseman: WisemanSeries[];
  funnel: FunnelStage[];
  phaseGateCommittedDollars: number;
  phaseGateTargetDollars: number;
  phaseGatePct: number;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function fmtMoneyShort(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}K`;
  return `$${dollars.toFixed(0)}`;
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(0)}%`;
}

const moneyShortFormatter = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
      ? `$${(v / 1_000).toFixed(1)}K`
      : `$${v.toFixed(0)}`;

const pctFormatter = (v: number) => `${v}%`;

function pctRatio(num: number, den: number): string {
  if (den === 0) return "\u2014";
  return `${Math.round((num / den) * 100)}%`;
}

// ---------------------------------------------------------------------------
// Sub-components
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

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export default function InvestorMetricsDashboard(props: DashboardProps) {
  const {
    kpis,
    gmv7d,
    gmv30d,
    gmv90d,
    totalGmv90d,
    takeRate,
    liquidity,
    avgBids,
    avgBidsLatest,
    cohorts,
    clientRepeatRatePct,
    nps,
    npsLatest,
    wiseman,
    funnel,
    phaseGateCommittedDollars,
    phaseGateTargetDollars,
    phaseGatePct,
    lastUpdated,
  } = props;

  return (
    <>
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
                  categories={["Northeast", "Southeast", "Central", "West Coast"]}
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
                  categories={["Northeast", "Southeast", "Central", "West Coast"]}
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
                  categories={["Northeast", "Southeast", "Central", "West Coast"]}
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

      {/* ROW 7 — Wiseman usage telemetry */}
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
          TODO: replace with live query when wiseman_events table exists.
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
      </Card>
    </>
  );
}
