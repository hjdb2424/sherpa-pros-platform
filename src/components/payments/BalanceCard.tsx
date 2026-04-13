/**
 * BalanceCard — Displays a monetary balance with label and optional subtitle.
 * All values received as integer cents, formatted to USD for display.
 */

interface BalanceCardProps {
  label: string;
  amountCents: number;
  subtitle?: string;
  variant?: 'default' | 'highlight' | 'muted';
}

function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

export default function BalanceCard({
  label,
  amountCents,
  subtitle,
  variant = 'default',
}: BalanceCardProps) {
  const bgClass =
    variant === 'highlight'
      ? 'bg-[#1a1a2e] text-white'
      : variant === 'muted'
        ? 'bg-zinc-50 dark:bg-zinc-800/50'
        : 'bg-white dark:bg-zinc-900';

  const amountClass =
    variant === 'highlight'
      ? 'text-amber-400'
      : 'text-zinc-900 dark:text-zinc-50';

  return (
    <div
      className={`rounded-xl border border-zinc-200 p-5 shadow-sm dark:border-zinc-800 ${bgClass}`}
    >
      <p
        className={`text-sm font-medium ${
          variant === 'highlight'
            ? 'text-zinc-300'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${amountClass}`}>
        {formatCurrency(amountCents)}
      </p>
      {subtitle && (
        <p
          className={`mt-1 text-xs ${
            variant === 'highlight'
              ? 'text-zinc-400'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
