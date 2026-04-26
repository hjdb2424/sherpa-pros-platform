'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userStorage } from '@/lib/user-storage';

interface HeaderAvatarProps {
  href: string;
  fallbackInitials: string;
}

export default function HeaderAvatar({ href, fallbackInitials }: HeaderAvatarProps) {
  const [initials, setInitials] = useState(fallbackInitials);

  useEffect(() => {
    const profile = userStorage.get<Record<string, string>>('user-profile');
    const name = profile?.fullName || profile?.name || profile?.companyName;
    if (name) {
      setInitials(name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
      return;
    }
    const authName = localStorage.getItem('sherpa-test-name');
    if (authName) {
      setInitials(authName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
    }
  }, []);

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
