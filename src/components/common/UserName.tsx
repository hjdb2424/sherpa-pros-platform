'use client';

import { useUserName, useUserInitials } from '@/hooks/useUserIdentity';

interface UserNameProps {
  fallback: string;
  className?: string;
  /** Render as tag (default: span) */
  as?: 'span' | 'h1' | 'h2' | 'p';
}

/**
 * Client component that reads the real user name from localStorage after hydration.
 * Cannot be used in Server Components — import it in a client boundary.
 */
export default function UserName({ fallback, className, as: Tag = 'span' }: UserNameProps) {
  const name = useUserName(fallback);
  return <Tag className={className}>{name}</Tag>;
}

/**
 * Client component that returns initials from the stored user name.
 */
export function UserInitials({ fallback, className }: { fallback: string; className?: string }) {
  const initials = useUserInitials(fallback);
  return <span className={className}>{initials}</span>;
}
