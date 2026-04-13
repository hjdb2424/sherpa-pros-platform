import type { Metadata } from 'next';
import { FindProsContent } from './find-pros-content';

export const metadata: Metadata = {
  title: 'Find Pros',
};

export default function FindProsPage() {
  return <FindProsContent />;
}
