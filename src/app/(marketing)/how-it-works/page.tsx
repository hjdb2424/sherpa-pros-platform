import type { Metadata } from 'next';
import Link from 'next/link';
import FAQAccordion from '@/components/marketing/FAQAccordion';
import HowItWorksTabs from './HowItWorksTabs';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Sherpa Pros connects clients with verified contractors — from posting a job to secure payment.',
};

const clientSteps = [
  {
    step: '01',
    title: 'Post Your Project',
    description:
      'Describe the work you need done. Our AI assistant helps you define scope, timeline, and budget so you get accurate bids from the start.',
    detail: 'Photos, measurements, and special requirements welcome.',
  },
  {
    step: '02',
    title: 'AI Validates Your Project',
    description:
      'Our system checks your budget against real market data, flags scope gaps, and ensures your project description is clear enough for accurate bidding.',
    detail: 'No more lowball bids or surprise change orders.',
  },
  {
    step: '03',
    title: 'Get Matched With Verified Pros',
    description:
      'We match your project to pros based on trade, location, availability, rating, and past performance. Every pro is background-checked, licensed, and insured.',
    detail: 'Exclusive matches — your lead is not sold to 8 contractors.',
  },
  {
    step: '04',
    title: 'Review Bids and Hire',
    description:
      'Compare verified bids side-by-side with detailed breakdowns. See ratings, past work, and credentials. Choose the pro that fits your project.',
    detail: 'No pressure, no commitment until you say go.',
  },
  {
    step: '05',
    title: 'Track Progress',
    description:
      'Get real-time updates, photos, and milestone notifications as your project progresses. Communicate directly with your pro through the platform.',
    detail: 'Every milestone documented for your records.',
  },
  {
    step: '06',
    title: 'Pay Securely and Rate',
    description:
      'Funds are held in escrow and released only when you approve the work. Leave a review to help the next client — and help great pros get recognized.',
    detail: 'Dispute resolution built in if anything goes sideways.',
  },
];

const proSteps = [
  {
    step: '01',
    title: 'Apply in 5 Minutes',
    description:
      'Submit your license, insurance, and trade info. Quick background check and we verify your credentials.',
    detail: 'No application fee. No subscription to start.',
  },
  {
    step: '02',
    title: 'Get Vetted and Approved',
    description:
      'We verify your license, insurance coverage, and run a background check. Once approved, your profile goes live.',
    detail: 'Approval typically within 48 hours.',
  },
  {
    step: '03',
    title: 'Set Up Your Profile',
    description:
      'Add your trades, service area, portfolio photos, and set your availability. The more detail, the better your matches.',
    detail: 'Your profile is your storefront — make it shine.',
  },
  {
    step: '04',
    title: 'Receive Matched Jobs',
    description:
      'Get notified when jobs match your trade, location, and availability. No searching, no bidding wars — just qualified opportunities.',
    detail: 'Exclusive leads, not shared with 5-8 other contractors.',
  },
  {
    step: '05',
    title: 'Bid or Accept',
    description:
      'Submit your bid with a detailed breakdown, or accept dispatched jobs instantly. Clients see your credentials, rating, and past work.',
    detail: 'AI helps you price competitively based on market data.',
  },
  {
    step: '06',
    title: 'Complete and Get Paid',
    description:
      'Do great work, log milestones, and get paid through escrow when the client approves. Build your reputation with every completed job.',
    detail: 'Fast payment — no chasing invoices or bounced checks.',
  },
];

const faqItems = [
  {
    question: 'How much does it cost to post a job?',
    answer:
      'Posting a job is completely free for clients. You only pay the agreed price for the work once you approve it. Sherpa Pros earns a commission from the pro side, never from the client.',
  },
  {
    question: 'How are pros verified?',
    answer:
      'Every pro undergoes a three-step verification: valid trade license check, proof of insurance (general liability minimum), and a background check. We re-verify annually.',
  },
  {
    question: 'What happens if I am not satisfied with the work?',
    answer:
      'Funds are held in escrow until you approve the completed work. If there is a dispute, our resolution team steps in to mediate. We also offer a satisfaction guarantee on qualified projects.',
  },
  {
    question: 'How does the escrow payment work?',
    answer:
      'When you hire a pro, the agreed amount is held securely in escrow. It is released to the pro only after you approve the completed work. For larger projects, milestone-based releases are available.',
  },
  {
    question: 'Is there a subscription fee for pros?',
    answer:
      'No subscription fees and no lead fees. Pros pay a fair commission only when they complete a job and get paid. You earn first, then we take our cut.',
  },
  {
    question: 'What trades do you cover?',
    answer:
      'We cover all major construction trades: general contracting, electrical, plumbing, HVAC, roofing, painting, carpentry, masonry, landscaping, and more. We also have IICRC-certified pros for water, fire, and mold restoration.',
  },
  {
    question: 'How fast will I get matched?',
    answer:
      'Most clients receive their first matched pro within 24 hours. For emergency jobs, our 24/7 dispatch can have a pro on-site within hours.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We currently serve New Hampshire, Maine, and Massachusetts with active hub cities including Portsmouth, Manchester, Portland, Boston, and more. We are expanding across New England throughout 2026.',
  },
  {
    question: 'Can I see a pro\'s past work before hiring?',
    answer:
      'Yes. Every pro profile includes verified reviews, ratings, portfolio photos, credentials, and completed project history. You can make an informed decision before committing.',
  },
  {
    question: 'What is the emergency dispatch service?',
    answer:
      'Our 24/7 emergency dispatch connects you with IICRC-certified pros for urgent situations like water damage, fire damage, or mold. These pros are on retainer and respond within hours, not days.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-slide-up text-4xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            How Sherpa Pros Works
          </h1>
          <p className="animate-fade-slide-up stagger-1 mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Whether you need a quick repair or a full renovation, we connect you
            with the right professional — verified, insured, and ready to work.
          </p>
        </div>
      </section>

      {/* Tabbed steps */}
      <section className="bg-white dark:bg-zinc-950 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <HowItWorksTabs
            clientSteps={clientSteps}
            proSteps={proSteps}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 dark:bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to know about using Sherpa Pros.
          </p>
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00a9e0] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="animate-fade-slide-up text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="animate-fade-slide-up stagger-1 mt-4 text-lg text-white/80">
            Join thousands of clients and pros already using Sherpa Pros.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/client/post-job"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#ff4500] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ff4500]/25 transition-all hover:bg-[#e63e00] active:scale-[0.98] sm:w-auto"
            >
              Post a Job
            </Link>
            <Link
              href="/for-pros"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 active:scale-[0.98] sm:w-auto"
            >
              Join as a Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
