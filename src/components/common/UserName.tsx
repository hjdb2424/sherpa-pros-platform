'use client';

import { useState, useEffect } from 'react';
import { userStorage } from '@/lib/user-storage';

interface UserNameProps {
  fallback: string;
  className?: string;
  /** Render as tag (default: span) */
  as?: 'span' | 'h1' | 'h2' | 'p';
}

/**
 * Reads the real user name from localStorage (onboarding profile > auth name > fallback).
 * Use this in server-rendered pages where you need the real user name.
 */
export default function UserName({ fallback, className, as: Tag = 'span' }: UserNameProps) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    const profile = userStorage.get<Record<string, string>>('user-profile');
    const profileName = profile?.fullName || profile?.name || profile?.companyName;
    if (profileName) {
      setName(profileName);
      return;
    }
    const authName = localStorage.getItem('sherpa-test-name');
    if (authName) setName(authName);
  }, []);

  return <Tag className={className}>{name}</Tag>;
}

/**
 * Returns initials from the real user name (client component).
 */
export function UserInitials({ fallback, className }: { fallback: string; className?: string }) {
  const [initials, setInitials] = useState(
    fallback.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  );

  useEffect(() => {
    const profile = userStorage.get<Record<string, string>>('user-profile');
    const name = profile?.fullName || profile?.name || profile?.companyName;
    const resolved = name || localStorage.getItem('sherpa-test-name');
    if (resolved) {
      setInitials(resolved.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
    }
  }, []);

  return <span className={className}>{initials}</span>;
}
