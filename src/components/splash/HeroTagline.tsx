'use client';

import { useState, useEffect } from 'react';

const TAGLINES = [
  'that thinks like a contractor',
  'where every quote is code-checked',
  'with zero lead fees for pros',
  'where your payment is protected',
  'built by a contractor, for the trade',
];

export default function HeroTagline() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TAGLINES.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
      The licensed-trade marketplace{' '}
      <span
        className="inline-block bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent transition-opacity duration-400"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {TAGLINES[index]}
      </span>
    </h1>
  );
}
