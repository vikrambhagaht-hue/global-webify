'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ value, suffix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = value;
    
    if (start === end) {
      setCount(end);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const nextVal = Math.floor(start + (end - start) * easeProgress);
      setCount(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

export default function FranchiseStatsClient({ partnerCount }: { partnerCount: number }) {
  const displayCount = partnerCount; // Exact count as requested

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10">
      <div className="text-center bg-white/[0.08] border border-white/20 rounded-2xl px-6 py-3 shadow-sm min-w-[160px]">
        <div className="text-2xl md:text-3xl font-black text-white">
          <Counter value={displayCount} suffix="+" />
        </div>
        <div className="text-[10px] text-emerald-50 font-bold mt-1 uppercase tracking-wider whitespace-nowrap">Active Partners</div>
      </div>
      
      <div className="text-center bg-white/[0.08] border border-white/20 rounded-2xl px-6 py-3 shadow-sm min-w-[160px]">
        <div className="text-2xl md:text-3xl font-black text-white whitespace-nowrap">
          Pan India
        </div>
        <div className="text-[10px] text-emerald-50 font-bold mt-1 uppercase tracking-wider whitespace-nowrap">Coverage</div>
      </div>
    </div>
  );
}
