import type { Metadata } from 'next';
import ProfilePageClient from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProProfilePage() {
  return <ProfilePageClient />;
}
