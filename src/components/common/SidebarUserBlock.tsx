'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userStorage } from '@/lib/user-storage';
import { useUserName, toInitials } from '@/hooks/useUserIdentity';

interface SidebarUserBlockProps {
  href: string;
  fallbackName: string;
  fallbackSubtitle: string;
}

export default function SidebarUserBlock({ href, fallbackName, fallbackSubtitle }: SidebarUserBlockProps) {
  const name = useUserName(fallbackName);
  const [subtitle, setSubtitle] = useState(fallbackSubtitle);

  useEffect(() => {
    const profile = userStorage.get<Record<string, string>>('user-profile');
    if (profile?.trade) setSubtitle(profile.trade);
    else if (profile?.companyName) setSubtitle('Property Manager');
    else if (profile?.propertyType) setSubtitle('Homeowner');
  }, []);

  const initials = toInitials(name);

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-[#00a9e0] dark:bg-[#00a9e0]/10">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{name}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>
      <svg className="h-4 w-4 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
