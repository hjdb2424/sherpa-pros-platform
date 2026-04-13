import type { BadgeTierType } from '@/lib/mock-data/pro-data';

const tierConfig: Record<BadgeTierType, { label: string; bg: string; text: string; icon: string }> = {
  bronze: { label: 'Bronze', bg: 'bg-amber-800/20', text: 'text-amber-700', icon: '🥉' },
  silver: { label: 'Silver', bg: 'bg-slate-300/30', text: 'text-slate-600', icon: '🥈' },
  gold: { label: 'Gold', bg: 'bg-amber-400/20', text: 'text-amber-600', icon: '🥇' },
};

interface BadgeTierProps {
  tier: BadgeTierType;
  size?: 'sm' | 'md' | 'lg';
}

export default function BadgeTier({ tier, size = 'md' }: BadgeTierProps) {
  const config = tierConfig[tier];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClasses[size]}`}
      role="status"
      aria-label={`${config.label} tier badge`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
