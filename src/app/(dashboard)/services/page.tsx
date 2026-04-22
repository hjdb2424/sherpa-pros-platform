import type { Metadata } from 'next';
import CategoryBrowser from '@/components/search/CategoryBrowser';

export const metadata: Metadata = {
  title: 'Services | Sherpa Pros',
  description: 'Browse all 37 service categories and sub-services available on Sherpa Pros.',
};

export default function ServicesPage() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Service Catalog
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Browse all available trade categories and sub-services. Click a category to see scope, budget, and duration details.
        </p>
      </div>
      <CategoryBrowser />
    </div>
  );
}
