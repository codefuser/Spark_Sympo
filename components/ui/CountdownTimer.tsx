"use client";

import React, { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md w-full mx-auto">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="relative group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-[#030917]/90 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,114,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
        >
          {/* Subtle Cyber Corner Accents */}
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400 pointer-events-none" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyan-400 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400 pointer-events-none" />

          {/* High-Tech Number Display */}
          <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            {unit.value.toString().padStart(2, "0")}
          </span>

          {/* Pure White Tracking Label */}
          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 tracking-[0.2em] uppercase mt-1 drop-shadow-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
