import type { Metadata } from 'next';
import PMCompanyProfileClient from './PMCompanyProfileClient';

export const metadata: Metadata = {
  title: 'Company Profile',
};

export default function PMCompanyProfilePage() {
  return <PMCompanyProfileClient />;
}
