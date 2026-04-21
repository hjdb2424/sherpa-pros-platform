import { useLocalSearchParams } from 'expo-router';
import QuoteBuilder from '@/components/quotes/QuoteBuilder';

export default function QuoteScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  return <QuoteBuilder jobId={jobId ?? 'c1'} />;
}
