import type { Metadata } from 'next';
import ClientSubscriptionContent from './client-subscription-content';

export const metadata: Metadata = {
  title: 'Subscription — Sherpa Pros',
  description: 'Manage your client subscription plan.',
};

export default function ClientSubscriptionPage() {
  return <ClientSubscriptionContent />;
}
