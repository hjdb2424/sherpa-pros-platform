import type { Metadata } from 'next';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import BackNav from '@/components/common/BackNav';

export const metadata: Metadata = {
  title: 'Referral Program',
  description: 'Invite friends and earn rewards on Sherpa Pros',
};

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <BackNav />
      <ReferralDashboard />
    </div>
  );
}
