'use client';

/**
 * SLADashboard — SLA compliance monitoring UI for subscribed Pros.
 *
 * Shows response time bars for recent dispatches, compliance percentage
 * with color coding, average response stat, and violation warnings.
 */

import type { SLAComplianceReport, SLAResponseRecord } from '@/lib/subscriptions/types';

interface SLADashboardProps {
  report: SLAComplianceReport;
}

function complianceColor(percent: number): string {
  if (percent >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (percent >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function complianceBg(percent: number): string {
  if (percent >= 90) return 'bg-emerald-500';
  if (percent >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

function barColor(record: SLAResponseRecord): string {
  if (!record.withinSLA) return 'bg-red-500';
  const ratio = record.responseTimeMinutes / record.slaWindowMinutes;
  if (ratio <= 0.5) return 'bg-emerald-500';
  if (ratio <= 0.8) return 'bg-amber-400';
  return 'bg-orange-500';
}

function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function SLADashboard({ report }: SLADashboardProps) {
  const last10 = report.responses.slice(0, 10);
  const maxTime = Math.max(
    ...last10.map((r) => r.responseTimeMinutes),
    report.responses[0]?.slaWindowMinutes ?? 240,
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Compliance % */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            SLA Compliance
          </p>
          <p className={`mt-1 text-2xl font-bold ${complianceColor(report.compliancePercent)}`}>
            {report.compliancePercent}%
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${complianceBg(report.compliancePercent)}`}
              style={{ width: `${Math.min(report.compliancePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Avg Response */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Avg Response
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatMinutes(report.averageResponseMinutes)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            SLA: {formatMinutes(last10[0]?.slaWindowMinutes ?? 240)}
          </p>
        </div>

        {/* Dispatches */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Dispatches ({report.periodDays}d)
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {report.totalDispatches}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {report.withinSLA} within SLA
          </p>
        </div>

        {/* Violations */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Violations
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              report.violations === 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {report.violations}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Max 3 before review
          </p>
        </div>
      </div>

      {/* SLA Warning */}
      {!report.isCompliant && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                SLA Compliance Below Threshold
              </p>
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Your compliance is at {report.compliancePercent}% (minimum 90% required).
                Continued violations may result in subscription tier review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Approaching Warning */}
      {report.isCompliant && report.compliancePercent < 95 && report.violations > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Approaching SLA Limit
              </p>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                You have {report.violations} violation{report.violations > 1 ? 's' : ''} in the last {report.periodDays} days.
                Keep response times under {formatMinutes(last10[0]?.slaWindowMinutes ?? 240)} to stay compliant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Response Time Chart */}
      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Last 10 Responses
        </h3>

        {last10.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            No dispatch responses yet.
          </p>
        ) : (
          <div className="space-y-2">
            {last10.map((record) => {
              const widthPercent = Math.min(
                (record.responseTimeMinutes / maxTime) * 100,
                100,
              );
              const slaLinePercent = Math.min(
                (record.slaWindowMinutes / maxTime) * 100,
                100,
              );

              return (
                <div key={record.id} className="group relative">
                  <div className="flex items-center gap-3">
                    {/* Time label */}
                    <span className="w-12 shrink-0 text-right text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {formatMinutes(record.responseTimeMinutes)}
                    </span>

                    {/* Bar container */}
                    <div className="relative flex-1 h-6">
                      {/* SLA line */}
                      <div
                        className="absolute top-0 h-full w-px border-l-2 border-dashed border-zinc-300 dark:border-zinc-600"
                        style={{ left: `${slaLinePercent}%` }}
                        aria-hidden="true"
                      />

                      {/* Response bar */}
                      <div
                        className={`h-full rounded transition-all duration-300 ${barColor(record)}`}
                        style={{ width: `${widthPercent}%`, minWidth: '4px' }}
                        role="meter"
                        aria-valuenow={record.responseTimeMinutes}
                        aria-valuemin={0}
                        aria-valuemax={record.slaWindowMinutes}
                        aria-label={`Response time: ${formatMinutes(record.responseTimeMinutes)}, SLA: ${formatMinutes(record.slaWindowMinutes)}`}
                      />
                    </div>

                    {/* Status icon */}
                    {record.withinSLA ? (
                      <svg
                        className="h-4 w-4 shrink-0 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-label="Within SLA"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 shrink-0 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-label="SLA violation"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Within SLA</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>Violation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-px w-3 border-t-2 border-dashed border-zinc-400" />
                <span>SLA limit</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
