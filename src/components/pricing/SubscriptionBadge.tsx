'use client';

/**
 * SubscriptionBadge — Inline badge displaying current subscription plan.
 *
 * Color-coded by tier for quick recognition in dashboards and profiles.
 */

type PlanTier =
  | 'free'
  | 'sherpa'
  | 'standard'
  | 'emergency_ready'
  | 'restoration_certified';

interface SubscriptionBadgeProps {
  tier: PlanTier;
  /** Compact mode removes padding for tight layouts */
  compact?: boolean;
}

const TIER_CONFIG: Record<PlanTier, { label: string; bg: string; text: string }> = {
  free: {
    label: 'Free',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-600 dark:text-zinc-400',
  },
  sherpa: {
    label: 'Sherpa Plan',
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-[#00a9e0] dark:text-sky-400',
  },
  standard: {
    label: 'Standard',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-600 dark:text-zinc-400',
  },
  emergency_ready: {
    label: 'Emergency Ready',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-400',
  },
  restoration_certified: {
    label: 'Restoration Certified',
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
};

export default function SubscriptionBadge({
  tier,
  compact = false,
}: SubscriptionBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.text} ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      aria-label={`Current plan: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
