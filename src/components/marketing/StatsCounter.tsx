'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface StatsCounterProps {
  /** Override the default stats with real data from the server */
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: 500, suffix: '+', label: 'Verified Pros' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 24, suffix: 'hr', label: 'Avg Match Time' },
];

function useCountUp(target: number, duration: number, shouldAnimate: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let start = 0;
    const increment = target / (duration / 16);
    let raf: number;

    function step() {
      start += increment;
      if (start >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(start));
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, shouldAnimate]);

  return count;
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.value, 2000, animate);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-zinc-900 sm:text-4xl lg:text-5xl">
        {animate ? count : 0}
        <span className="text-[#00a9e0]">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-zinc-600 sm:text-base">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsCounter({ stats: statsProp }: StatsCounterProps = {}) {
  const stats = statsProp ?? defaultStats;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="animate-fade-slide-up stagger-4 grid grid-cols-3 gap-4 sm:gap-8"
      role="list"
      aria-label="Platform statistics"
    >
      {stats.map((stat) => (
        <div key={stat.label} role="listitem">
          <StatItem stat={stat} animate={visible} />
        </div>
      ))}
    </div>
  );
}
