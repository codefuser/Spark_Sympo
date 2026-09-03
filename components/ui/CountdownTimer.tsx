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
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto my-6">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-primary/20 shadow-glow backdrop-blur-md"
        >
          <span className="text-2xl sm:text-4xl font-extrabold font-mono text-primary tracking-tight">
            {unit.value.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-secondary-foreground tracking-widest mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
