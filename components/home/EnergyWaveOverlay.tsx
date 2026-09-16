"use client";

import React from "react";

export function EnergyWaveOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 mix-blend-screen select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Cyan Energy Gradients */}
          <linearGradient id="cyanWaveGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.95" />
            <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="cyanWaveGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#0ea5e9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cyanSoftAura" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.1" />
          </linearGradient>

          {/* Orange & Amber Energy Gradients */}
          <linearGradient id="orangeWaveGrad1" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#ff5500" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ff7700" stopOpacity="0.95" />
            <stop offset="90%" stopColor="#fbbf24" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="orangeWaveGrad2" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#ff5500" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="orangeSoftAura" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0" />
            <stop offset="30%" stopColor="#ff5500" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#ea580c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff5500" stopOpacity="0.1" />
          </linearGradient>

          {/* Central Nexus Blend */}
          <radialGradient id="nexusRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#ff7700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Filters for subtle organic diffusion */}
          <filter id="softGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* =========================================================================
            LEFT SIDE: BLUE / CYAN FLOWING ELECTRICAL ENERGY WAVES
            Tracing naturally from the Circuit Board on the left toward center
            ========================================================================= */}
        <g className="animate-wave-cyan origin-center">
          {/* Layer 1: Wide Breathing Cyan Plasma Aurora */}
          <path
            d="M 120 490 Q 280 410, 440 450 T 720 540"
            stroke="url(#cyanSoftAura)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#softGlowFilter)"
          />
          <path
            d="M 160 540 Q 320 580, 500 500 T 720 520"
            stroke="url(#cyanSoftAura)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#softGlowFilter)"
          />

          {/* Layer 2: Main Cyan Plasma Ribbon Curves */}
          <path
            d="M 140 480 C 280 400, 420 440, 560 480 S 680 535, 720 540"
            stroke="url(#cyanWaveGrad1)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 180 530 C 300 570, 440 520, 580 480 S 680 515, 720 520"
            stroke="url(#cyanWaveGrad2)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 100 440 C 260 360, 400 410, 540 460 S 660 505, 700 510"
            stroke="url(#cyanWaveGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Layer 3: Flowing Electrical Current Pulses (Fast Pulse) */}
          <path
            d="M 140 480 C 280 400, 420 440, 560 480 S 680 535, 720 540"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="25 65"
            className="animate-flow-cyan"
            opacity="0.9"
          />
          <path
            d="M 180 530 C 300 570, 440 520, 580 480 S 680 515, 720 520"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="18 50"
            className="animate-flow-cyan-slow"
            opacity="0.85"
          />

          {/* Layer 4: Micro Electric Arc Filaments */}
          <path
            d="M 220 460 Q 360 420, 480 460 T 660 515"
            stroke="#a5f3fc"
            strokeWidth="1.2"
            strokeDasharray="12 40"
            className="animate-flow-cyan"
            opacity="0.75"
          />
          <path
            d="M 200 560 Q 380 610, 540 540 T 700 535"
            stroke="#00f0ff"
            strokeWidth="1.4"
            strokeDasharray="30 70"
            className="animate-flow-cyan-slow"
            opacity="0.7"
          />
        </g>

        {/* =========================================================================
            RIGHT SIDE: FIERY ORANGE / AMBER FLOWING ELECTRICAL ENERGY WAVES
            Tracing naturally from the Electric Motor on the right toward center
            ========================================================================= */}
        <g className="animate-wave-orange origin-center">
          {/* Layer 1: Wide Breathing Orange Plasma Aurora */}
          <path
            d="M 1320 490 Q 1160 410, 1000 450 T 720 540"
            stroke="url(#orangeSoftAura)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#softGlowFilter)"
          />
          <path
            d="M 1280 550 Q 1120 590, 940 500 T 720 520"
            stroke="url(#orangeSoftAura)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#softGlowFilter)"
          />

          {/* Layer 2: Main Orange Plasma Ribbon Curves */}
          <path
            d="M 1300 480 C 1160 400, 1020 440, 880 480 S 760 535, 720 540"
            stroke="url(#orangeWaveGrad1)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 1260 530 C 1140 570, 1000 520, 860 480 S 760 515, 720 520"
            stroke="url(#orangeWaveGrad2)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 1340 440 C 1180 360, 1040 410, 900 460 S 780 505, 740 510"
            stroke="url(#orangeWaveGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Layer 3: Flowing Electrical Current Pulses (Fast Pulse) */}
          <path
            d="M 1300 480 C 1160 400, 1020 440, 880 480 S 760 535, 720 540"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="25 65"
            className="animate-flow-orange"
            opacity="0.9"
          />
          <path
            d="M 1260 530 C 1140 570, 1000 520, 860 480 S 760 515, 720 520"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="18 50"
            className="animate-flow-orange-slow"
            opacity="0.85"
          />

          {/* Layer 4: Micro Electric Arc Filaments */}
          <path
            d="M 1220 460 Q 1080 420, 960 460 T 780 515"
            stroke="#fed7aa"
            strokeWidth="1.2"
            strokeDasharray="12 40"
            className="animate-flow-orange"
            opacity="0.75"
          />
          <path
            d="M 1240 570 Q 1060 620, 900 550 T 740 535"
            stroke="#ff5500"
            strokeWidth="1.4"
            strokeDasharray="30 70"
            className="animate-flow-orange-slow"
            opacity="0.7"
          />
        </g>

        {/* =========================================================================
            CENTER NEXUS: SUBTLE ELECTRICAL COLLISION AURA
            Where the blue and orange electrical currents converge
            ========================================================================= */}
        <g className="animate-nexus-pulse origin-center">
          <ellipse
            cx="720"
            cy="530"
            rx="110"
            ry="45"
            fill="url(#nexusRadial)"
          />
          {/* Subtle intertwining electrical nexus threads */}
          <path
            d="M 670 525 Q 720 500, 770 535"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="8 20"
            className="animate-flow-cyan"
            opacity="0.8"
          />
          <path
            d="M 670 540 Q 720 560, 770 525"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="8 20"
            className="animate-flow-orange"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
