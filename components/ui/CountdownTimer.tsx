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
    { label: "DAYS", value: timeLeft.days, code: "T-01" },
    { label: "HOURS", value: timeLeft.hours, code: "T-02" },
    { label: "MINS", value: timeLeft.minutes, code: "T-03" },
    { label: "SECS", value: timeLeft.seconds, code: "T-04" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto my-4 sm:my-6 w-full">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="relative group flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,114,255,0.15)] hover:shadow-[0_0_35px_rgba(0,240,255,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Cyber Corner Notches */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

          {/* Ambient Glow Aura */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/25 transition-colors pointer-events-none" />

          {/* Micro Tech Module ID */}
          <span className="text-[8px] font-mono text-cyan-400/60 font-bold self-end tracking-wider mb-0.5 sm:mb-1">
            {unit.code}
          </span>

          {/* High-Tech Number Display */}
          <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-blue-500 drop-shadow-[0_0_14px_rgba(0,240,255,0.55)]">
            {unit.value.toString().padStart(2, "0")}
          </span>

          {/* Subline Divider */}
          <div className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent my-1 sm:my-1.5" />

          {/* Pure White Tracking Label */}
          <span className="text-[10px] sm:text-xs font-mono font-bold text-white tracking-[0.25em] uppercase drop-shadow-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
