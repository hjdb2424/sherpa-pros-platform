'use client';

import { useState, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-200 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left transition-colors hover:text-amber-600"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-zinc-900 sm:text-lg">
          {item.question}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="px-1 text-sm leading-relaxed text-zinc-600 sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="divide-y-0" role="list" aria-label="Frequently asked questions">
      {items.map((item, i) => (
        <div key={item.question} role="listitem">
          <AccordionItem
            item={item}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        </div>
      ))}
    </div>
  );
}
