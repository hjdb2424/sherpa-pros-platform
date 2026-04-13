import type { Metadata } from 'next';
import EarningsPageClient from './EarningsPageClient';

export const metadata: Metadata = {
  title: 'Earnings',
};

export default function ProEarningsPage() {
  return <EarningsPageClient />;
}
