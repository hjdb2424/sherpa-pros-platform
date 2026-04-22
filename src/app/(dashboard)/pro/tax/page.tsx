import type { Metadata } from 'next';
import ProTaxPageClient from './ProTaxPageClient';

export const metadata: Metadata = {
  title: 'Tax Center',
};

export default function ProTaxPage() {
  return <ProTaxPageClient />;
}
