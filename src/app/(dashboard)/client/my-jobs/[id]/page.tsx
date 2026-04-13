import type { Metadata } from 'next';
import { JobDetailContent } from './job-detail-content';

export const metadata: Metadata = {
  title: 'Job Details',
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailContent jobId={id} />;
}
