import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAppUser } from '@/lib/auth/get-user';
import { getUserByClerkId } from '@/db/queries/users';
import { getMilestone } from '@/db/queries/milestones';
import { runCaptureForMilestone } from '@/lib/payments/capture';
import { PaymentElementClient } from '@/components/client/PaymentElementClient';

export const metadata: Metadata = { title: 'Fund milestone' };

interface Params {
  params: Promise<{ id: string; mid: string }>;
}

export default async function FundMilestonePage({ params }: Params) {
  const { id: jobId, mid: milestoneId } = await params;

  const appUser = await getAppUser();
  if (!appUser) redirect('/sign-in');

  const dbUser = await getUserByClerkId(appUser.id);
  if (!dbUser) redirect('/sign-in');

  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    return (
      <ErrorBlock
        title="Milestone not found"
        message="This milestone does not exist."
      />
    );
  }

  const result = await runCaptureForMilestone({
    clientUserId: dbUser.id,
    jobId,
    milestoneId,
    amountCents: milestone.amountCents,
  });

  if (!result.ok) {
    switch (result.error) {
      case 'unauthorized':
        return redirect('/sign-in');
      case 'not_owner':
        return redirect('/pro/dashboard');
      case 'job_not_fundable':
        return (
          <ErrorBlock
            title="This job can no longer be funded"
            message="The job is in a terminal state (cancelled or completed)."
          />
        );
      case 'milestone_not_pending':
        return (
          <ErrorBlock
            title="Milestone already funded"
            message="This milestone has already been funded or is in progress. Return to the job to view its status."
          />
        );
      case 'milestone_not_in_job':
        return (
          <ErrorBlock
            title="Milestone not found"
            message="This milestone does not belong to the requested job."
          />
        );
      case 'job_has_no_accepted_bid':
        return (
          <ErrorBlock
            title="No accepted bid"
            message="A pro must accept the job before milestones can be funded."
          />
        );
      case 'pro_not_verified':
        return (
          <ErrorBlock
            title="Pro is finishing verification"
            message="Your pro hasn't completed Stripe verification yet. They've been notified — funding will be available once they're verified."
          />
        );
      case 'beta_cap_exceeded':
        return (
          <ErrorBlock
            title="Beta funding cap reached"
            message="This job has reached the $500 beta funding cap. Contact support if you need to extend."
          />
        );
    }
  }

  if ('alreadyFunded' in result) {
    return (
      <SuccessBlock
        title="Funded ✓ — finalizing"
        message="This milestone has been funded. We're finalizing the transaction; the job page will update momentarily."
      />
    );
  }

  // Narrowing: result.ok=true and not alreadyFunded → has clientSecret
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Fund milestone
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {milestone.title} · ${(milestone.amountCents / 100).toFixed(2)}
      </p>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <PaymentElementClient
          clientSecret={result.clientSecret}
          returnUrl={`/client/my-jobs/${jobId}?funded=${milestoneId}`}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Funds are held by the marketplace until the milestone is completed and
        approved.
      </p>
    </main>
  );
}

function ErrorBlock({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h1 className="text-lg font-semibold text-red-800 dark:text-red-300">
          {title}
        </h1>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{message}</p>
      </div>
    </main>
  );
}

function SuccessBlock({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h1 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
          {title}
        </h1>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
          {message}
        </p>
      </div>
    </main>
  );
}
