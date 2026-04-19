'use client';

import { useState, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                           */
/* ------------------------------------------------------------------ */

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    category: 'Getting Started',
    question: 'How do I post a job?',
    answer:
      'Tap "Post a Job" from your dashboard, select a trade category, describe the work, set your budget range, and upload any relevant photos. Our system will validate your project details and start matching you with qualified pros in your area within minutes.',
  },
  {
    id: 'gs-2',
    category: 'Getting Started',
    question: 'How does matching work?',
    answer:
      'Our dispatch algorithm considers seven factors: proximity, trade match, availability, rating history, response time, license verification, and past job success rate. You receive bids from the most qualified pros, ranked by overall match score.',
  },
  {
    id: 'gs-3',
    category: 'Getting Started',
    question: 'What is the Sherpa Service Fee?',
    answer:
      'Sherpa charges a 10% service fee on completed jobs. This covers payment processing, escrow protection, insurance verification, dispute resolution, and platform support. There are no upfront fees for posting a job.',
  },
  {
    id: 'gs-4',
    category: 'Getting Started',
    question: 'How do I verify my contractor license?',
    answer:
      'During signup, upload your license number and state of issue. We verify it against state databases within 24 hours. Verified pros get a badge on their profile and priority in dispatch matching.',
  },

  // Payments
  {
    id: 'pay-1',
    category: 'Payments',
    question: 'When am I charged?',
    answer:
      'You are charged when you accept a bid. The payment is held in escrow and only released to the pro after you approve the completed work. You are never charged until you explicitly accept a bid.',
  },
  {
    id: 'pay-2',
    category: 'Payments',
    question: 'How does escrow work?',
    answer:
      'When you accept a bid, the agreed amount is held securely by Stripe. The pro can see the funds are secured, giving them confidence to start work. Funds are released in milestone-based increments as you approve each phase of the project.',
  },
  {
    id: 'pay-3',
    category: 'Payments',
    question: 'Can I get a refund?',
    answer:
      'If work hasn\'t started, you can cancel and receive a full refund. Once work is in progress, refunds are handled through our dispute resolution process. We mediate between you and the pro to reach a fair outcome.',
  },
  {
    id: 'pay-4',
    category: 'Payments',
    question: 'How do pros get paid?',
    answer:
      'Pros receive payments via Stripe Connect directly to their bank account. Payouts are processed within 2-3 business days after a milestone is approved. Pros can track all earnings in their dashboard.',
  },

  // Jobs & Bidding
  {
    id: 'job-1',
    category: 'Jobs & Bidding',
    question: 'How do I bid on a job?',
    answer:
      'From the Jobs tab, browse available jobs in your service area. Tap a job to see full details, then submit your bid with your proposed price, estimated timeline, and a brief message to the client. You can attach photos of similar past work.',
  },
  {
    id: 'job-2',
    category: 'Jobs & Bidding',
    question: 'What happens after a bid is accepted?',
    answer:
      'Once your bid is accepted, the system automatically generates a scope of work, project checklist, and materials list. Payment is secured in escrow, and you can begin coordinating with the client through in-app messaging.',
  },
  {
    id: 'job-3',
    category: 'Jobs & Bidding',
    question: 'How do change orders work?',
    answer:
      'If the scope changes during a job, either party can submit a change order. The change order includes the additional work description and cost adjustment. Both parties must approve the change order before work continues.',
  },

  // Emergency Services
  {
    id: 'em-1',
    category: 'Emergency Services',
    question: 'How fast is emergency dispatch?',
    answer:
      'Emergency dispatch targets a pro on-site within 60 minutes. Our system immediately alerts all available, qualified pros within a 15-mile radius. The first pro to accept is dispatched with real-time tracking.',
  },
  {
    id: 'em-2',
    category: 'Emergency Services',
    question: 'What qualifies as an emergency?',
    answer:
      'Emergencies include burst pipes, flooding, gas leaks, electrical failures posing safety risks, HVAC failure in extreme temperatures, and structural damage requiring immediate attention. Non-emergency jobs posted as emergencies may incur a fee.',
  },
  {
    id: 'em-3',
    category: 'Emergency Services',
    question: 'How is emergency pricing different?',
    answer:
      'Emergency jobs include a dispatch premium of 1.5x-2x standard rates, reflecting the urgency and after-hours availability required. Pricing is transparent and shown before you confirm the dispatch. The service fee remains at 10%.',
  },

  // Account Settings
  {
    id: 'acc-1',
    category: 'Account Settings',
    question: 'How do I change my password?',
    answer:
      'Go to Account Settings and tap "Security." You can update your password or enable two-factor authentication. If you signed up with Google or Apple, password management is handled through those providers.',
  },
  {
    id: 'acc-2',
    category: 'Account Settings',
    question: 'How do I update my service area?',
    answer:
      'Go to your Profile, then tap "Service Area." You can set your radius (5-50 miles) from your home base, or draw custom service zones on the map. Changes take effect immediately for new job matches.',
  },
  {
    id: 'acc-3',
    category: 'Account Settings',
    question: 'How do I connect QuickBooks?',
    answer:
      'Go to Account Settings, then "Integrations." Tap "Connect QuickBooks" and sign in to your QuickBooks Online account. Once connected, completed jobs and payments automatically sync as invoices and transactions.',
  },

  // Contact Support
  {
    id: 'cs-1',
    category: 'Contact Support',
    question: 'How do I reach customer support?',
    answer:
      'You can reach support via in-app chat (fastest), email at support@thesherpapros.com, or by calling (603) 555-0199 during business hours (Mon-Fri, 8AM-6PM EST). Emergency dispatch support is available 24/7.',
  },
];

const CATEGORIES = [
  {
    name: 'Getting Started',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
  {
    name: 'Payments',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    name: 'Jobs & Bidding',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
  },
  {
    name: 'Emergency Services',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    name: 'Account Settings',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    name: 'Contact Support',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items = FAQ_DATA;

    if (activeCategory) {
      items = items.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.question.toLowerCase().includes(q) ||
          i.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of FAQ_DATA) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  const toggleAccordion = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleCategoryClick = useCallback((name: string) => {
    setActiveCategory((prev) => (prev === name ? null : name));
    setOpenId(null);
  }, []);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="rounded-2xl border border-[#00a9e033] bg-gradient-to-br from-sky-50 to-white p-6 text-center shadow-sm sm:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
          How can we help?
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Search our help center or browse by category below
        </p>
        <div className="relative mx-auto mt-5 max-w-lg">
          <svg
            className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            aria-label="Search help articles"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleCategoryClick(cat.name)}
              className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? 'border-[#00a9e0] bg-sky-50 shadow-md shadow-[#00a9e0]/10 dark:border-[#00a9e0] dark:bg-[#00a9e0]/10'
                  : 'border-zinc-200 bg-white shadow-sm hover:border-[#00a9e033] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#00a9e0] text-white'
                    : 'bg-sky-50 text-[#00a9e0] group-hover:bg-[#00a9e0] group-hover:text-white dark:bg-zinc-800 dark:text-[#0ea5e9]'
                }`}
              >
                {cat.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {categoryCounts[cat.name] || 0} articles
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active filter pill */}
      {activeCategory && (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-[#00a9e0] dark:bg-[#00a9e0]/10 dark:text-[#0ea5e9]">
            {activeCategory}
          </span>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="space-y-2">
        {filteredItems.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No articles found
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Try a different search term or browse a category above
            </p>
          </div>
        )}

        {filteredItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
              >
                <div className="min-w-0">
                  <span className="mb-1 inline-block rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {item.question}
                  </h3>
                </div>
                <svg
                  className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isOpen && (
                <div
                  id={`faq-answer-${item.id}`}
                  className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800"
                >
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support Card */}
      <div className="rounded-2xl border border-[#00a9e033] bg-gradient-to-br from-sky-50 to-white p-6 text-center shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#00a9e0]/10">
          <svg
            className="h-6 w-6 text-[#00a9e0]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Can&apos;t find what you&apos;re looking for?
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Our support team is available Mon-Fri, 8AM-6PM EST
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00a9e0] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#00a9e0]/25 transition-all hover:bg-[#0090c0] active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
          Contact Support
        </button>
      </div>
    </div>
  );
}
