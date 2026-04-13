import type { Metadata } from 'next';
import SubscriptionPageClient from './SubscriptionPageClient';

export const metadata: Metadata = {
  title: 'Subscription',
};

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
