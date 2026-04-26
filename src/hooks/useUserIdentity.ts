'use client';

import { useState, useEffect } from 'react';
import { userStorage } from '@/lib/user-storage';

/**
 * Resolve the stored user name from localStorage.
 * Priority: onboarding profile (fullName > name > companyName) > auth name > null.
 */
export function resolveUserName(): string | null {
  const profile = userStorage.get<Record<string, string>>('user-profile');
  const profileName = profile?.fullName || profile?.name || profile?.companyName;
  if (profileName) return profileName;
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sherpa-test-name');
}

/**
 * Derive initials from a name string. Handles single-word names and empty strings.
 */
export function toInitials(name: string): string {
  if (!name.trim()) return '??';
  return name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Hook that reads the real user name from localStorage after hydration.
 * Returns the stored name or the provided fallback.
 */
export function useUserName(fallback: string): string {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    const resolved = resolveUserName();
    if (resolved) setName(resolved);
  }, []);

  return name;
}

/**
 * Hook that returns initials derived from the stored user name.
 */
export function useUserInitials(fallback: string): string {
  const [initials, setInitials] = useState(toInitials(fallback));

  useEffect(() => {
    const resolved = resolveUserName();
    if (resolved) setInitials(toInitials(resolved));
  }, []);

  return initials;
}
