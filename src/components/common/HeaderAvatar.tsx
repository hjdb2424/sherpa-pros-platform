'use client';

import Link from 'next/link';
import { useUserInitials } from '@/hooks/useUserIdentity';

interface HeaderAvatarProps {
  href: string;
  fallbackInitials: string;
}

export default function HeaderAvatar({ href, fallbackInitials }: HeaderAvatarProps) {
  const initials = useUserInitials(fallbackInitials);

  return (
    <Link
      href={href}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-[#00a9e0] dark:bg-[#00a9e0]/10"
      aria-label="Account settings"
    >
      {initials}
    </Link>
  );
}
