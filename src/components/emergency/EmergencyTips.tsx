import type { EmergencyCategory } from '@/lib/mock-data/emergency-data';
import { getEmergencyTips } from '@/lib/mock-data/emergency-data';

interface EmergencyTipsProps {
  category: EmergencyCategory;
}

export function EmergencyTips({ category }: EmergencyTipsProps) {
  const tips = getEmergencyTips(category);

  if (tips.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-700/40 bg-amber-950/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        While You Wait
      </h3>
      <ul className="space-y-2" aria-label="Safety tips while waiting">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
