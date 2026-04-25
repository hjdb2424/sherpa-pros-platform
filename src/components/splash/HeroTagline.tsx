'use client';

import { useState, useEffect } from 'react';

const FEATURES = [
  'Verified pros. Verified quotes. Verified results.',
  'One place for the hire, the work, and the money.',
  'The right pro. The right price. The proof to back it up.',
  'Find the pro. Fund the job. Track every dollar.',
  'From the first quote to the final walkthrough.',
  'Real pros. Real quotes. Real accountability.',
  'The right trade. The right terms. The right outcome.',
];

export default function HeroTagline() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FEATURES.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        Trade work, done right.
      </h1>
      <p
        className="mt-4 text-4xl font-bold leading-tight tracking-tight transition-opacity duration-500 sm:text-5xl md:text-6xl"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <span className="bg-gradient-to-r from-[#00a9e0] to-[#0ea5e9] bg-clip-text text-transparent">
          {FEATURES[index]}
        </span>
      </p>
    </div>
  );
}
