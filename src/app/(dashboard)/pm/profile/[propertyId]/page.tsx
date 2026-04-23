import type { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

export const metadata: Metadata = {
  title: 'Property Detail',
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  return <PropertyDetailClient propertyId={propertyId} />;
}
