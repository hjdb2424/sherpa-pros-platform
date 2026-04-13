import type { Job } from '@/lib/mock-data/client-data';

const STATUS_CONFIG: Record<
  Job['status'],
  { label: string; bg: string; text: string; dot: string }
> = {
  draft: { label: 'Draft', bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  open: { label: 'Open', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  bidding: { label: 'Reviewing Bids', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  assigned: { label: 'Pro Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  in_progress: { label: 'In Progress', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
};

interface JobStatusBadgeProps {
  status: Job['status'];
  size?: 'sm' | 'md';
}

export function JobStatusBadge({ status, size = 'sm' }: JobStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
