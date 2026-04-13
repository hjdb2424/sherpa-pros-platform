interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { direction: 'up' | 'down'; label: string };
  accentColor?: string;
}

export default function StatsCard({ label, value, icon, trend, accentColor = 'text-amber-500' }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${accentColor}`}>{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.direction === 'up' ? '\u2191' : '\u2193'} {trend.label}
            </p>
          )}
        </div>
        <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a2e]/5 text-[#1a1a2e] dark:bg-amber-500/10 dark:text-amber-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
