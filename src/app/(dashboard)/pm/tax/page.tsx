import type { Metadata } from 'next';
import PMTaxPageClient from './PMTaxPageClient';

export const metadata: Metadata = {
  title: 'Tax',
};

export default function PMTaxPage() {
  return <PMTaxPageClient />;
}
