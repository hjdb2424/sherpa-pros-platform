import type { Metadata } from 'next';
import { ClientDashboardContent } from './client-dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function ClientDashboardPage() {
  return <ClientDashboardContent />;
}
