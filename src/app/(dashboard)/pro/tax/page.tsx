import type { Metadata } from 'next';
import ProTaxPageClient from './ProTaxPageClient';

export const metadata: Metadata = {
  title: 'Finance Hub',
};

export default function ProTaxPage() {
  return <ProTaxPageClient />;
}
