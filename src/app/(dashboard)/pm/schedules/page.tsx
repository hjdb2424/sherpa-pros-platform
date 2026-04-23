import type { Metadata } from 'next';
import EmptyState from '@/components/EmptyState';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Schedules',
};

export default function SchedulesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Schedules
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage maintenance schedules and recurring tasks for your properties.
      </p>
      <div className="mt-8">
        <EmptyState
          icon={<CalendarDaysIcon className="h-8 w-8" />}
          title="No schedules yet"
          description="Create recurring maintenance schedules to stay ahead of property upkeep."
          ctaLabel="Create Schedule"
          ctaHref="/pm/schedules"
        />
      </div>
    </div>
  );
}
