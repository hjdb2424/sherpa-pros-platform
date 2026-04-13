import type { Metadata } from 'next';
import JobsPageClient from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Jobs',
};

export default function ProJobsPage() {
  return <JobsPageClient />;
}
