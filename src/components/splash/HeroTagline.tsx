'use client';

import { useState, useEffect } from 'react';

const TAGLINES = [
  'Trade work, done right.',
  'One place for the hire, the work, and the money.',
  'The right pro. The right price. The proof to back it up.',
  'Trade work. Trusted pros. One platform.',
  'The hire. The work. Done right.',
  'Find the pro. Fund the job. Track every dollar.',
  'From the first quote to the final walkthrough.',
  'Verified pros. Verified quotes. Verified results.',
  'The right trade. The right terms. The right outcome.',
  'Real pros. Real quotes. Real accountability.',
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
      <span
        className="inline-block bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent transition-opacity duration-500"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {TAGLINES[index]}
      </span>
    </h1>
  );
}
