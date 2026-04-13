import type { Metadata } from 'next';
import JobDetailClient from './JobDetailClient';

export const metadata: Metadata = {
  title: 'Job Details',
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailClient jobId={id} />;
}
