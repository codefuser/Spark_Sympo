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
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg w-full">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="relative group flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,114,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
        >
          {/* Cyber Corner Notches */}
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

          {/* Ambient Glow Aura */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-cyan-500/10 rounded-full blur-lg group-hover:bg-cyan-500/25 transition-colors pointer-events-none" />

          {/* Micro Tech Module ID */}
          <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400/70 font-bold self-end tracking-wider mb-0.5">
            {unit.code}
          </span>

          {/* High-Tech Number Display */}
          <span className="text-xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.55)]">
            {unit.value.toString().padStart(2, "0")}
          </span>

          {/* Subline Divider */}
          <div className="w-6 sm:w-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent my-0.5 sm:my-1" />

          {/* Pure White Tracking Label */}
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white tracking-[0.2em] uppercase drop-shadow-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
