import type { Metadata } from 'next';
import { MyJobsContent } from './my-jobs-content';

export const metadata: Metadata = {
  title: 'My Jobs',
};

export default function ClientMyJobsPage() {
  return <MyJobsContent />;
}
