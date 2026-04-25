import type { Metadata } from 'next';
import HelpCenter from '@/components/help/HelpCenter';
import BackNav from '@/components/common/BackNav';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Find answers to common questions about Sherpa Pros',
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <BackNav />
      <HelpCenter />
    </div>
  );
}
