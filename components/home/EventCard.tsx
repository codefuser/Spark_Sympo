"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Lightbulb,
  Trophy,
  Cpu,
  Music,
  Gamepad2,
  Zap,
} from "lucide-react";
import { SymposiumEvent } from "@/types";

interface EventCardProps {
  event: SymposiumEvent;
  onSelect: (event: SymposiumEvent) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const isPaper = event.slug === "paper-presentation";
  const isQuiz = event.slug === "technical-quiz";
  const isCircuit = event.slug === "circuit-debugging";
  const isMusic = event.slug === "rythemania";
  const isSports = event.slug === "e-sports";

  // Palette configurations strictly matching Black, Blue & White theme
  const config = React.useMemo(() => {
    if (isPaper) {
      return {
        accentColor: "#00f0ff", // Electric Cyan-Blue
        trackTag: "TECHNICAL TRACK",
        trackTagClass: "text-cyan-300 border-cyan-500/40 bg-cyan-950/40",
        pulseDot: "bg-cyan-400 shadow-[0_0_8px_#00f0ff]",
        cardBorder: "border-cyan-500/35 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.15)] hover:shadow-[0_0_40px_rgba(0,240,255,0.32)]",
        titlePrefix: "Paper ",
        titleSuffix: "Presentation",
        suffixClass: "text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]",
        dotColor: "bg-cyan-400 shadow-[0_0_8px_#00f0ff]",
        // Spec HUD
        hudBorder: "border-cyan-500/30",
        hudCorner: "border-cyan-400/80",
        hudIconColor: "text-cyan-400",
        hudVenueColor: "text-cyan-300 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #0284c7 0%, #00f0ff 50%, #0284c7 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(2,12,24,0.95) 0%, rgba(1,6,14,0.92) 50%, rgba(2,12,24,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_32px_rgba(0,240,255,0.65)]",
        btnBadgeBorder: "border-cyan-400/80 bg-cyan-950/70 shadow-[0_0_12px_rgba(0,240,255,0.4)]",
        btnIconColor: "text-cyan-300",
        btnIcon: Lightbulb,
        arrowColor: "text-cyan-400",
        runnerBorder: "border-cyan-400/70",
      };
    }
    if (isQuiz) {
      return {
        accentColor: "#2563eb", // Cobalt / Royal Tech Blue
        trackTag: "TECHNICAL TRACK",
        trackTagClass: "text-blue-300 border-blue-500/40 bg-blue-950/40",
        pulseDot: "bg-blue-400 shadow-[0_0_8px_#3b82f6]",
        cardBorder: "border-blue-500/35 hover:border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.18)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]",
        titlePrefix: "Technical ",
        titleSuffix: "Quiz",
        suffixClass: "text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.7)]",
        dotColor: "bg-blue-400 shadow-[0_0_8px_#3b82f6]",
        // Spec HUD
        hudBorder: "border-blue-500/30",
        hudCorner: "border-blue-400/80",
        hudIconColor: "text-blue-400",
        hudVenueColor: "text-blue-300 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #1d4ed8 0%, #60a5fa 50%, #1d4ed8 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(2,8,26,0.95) 0%, rgba(1,4,16,0.92) 50%, rgba(2,8,26,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(37,99,235,0.35)] group-hover:shadow-[0_0_32px_rgba(59,130,246,0.65)]",
        btnBadgeBorder: "border-blue-400/80 bg-blue-950/70 shadow-[0_0_12px_rgba(37,99,235,0.4)]",
        btnIconColor: "text-blue-300",
        btnIcon: Trophy,
        arrowColor: "text-blue-400",
        runnerBorder: "border-blue-400/70",
      };
    }
    if (isCircuit) {
      return {
        accentColor: "#0ea5e9", // Hyper Sky/Circuit Blue
        trackTag: "TECHNICAL TRACK",
        trackTagClass: "text-sky-300 border-sky-500/40 bg-sky-950/40",
        pulseDot: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
        cardBorder: "border-sky-500/35 hover:border-sky-300 shadow-[0_0_25px_rgba(14,165,233,0.18)] hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]",
        titlePrefix: "Circuit ",
        titleSuffix: "Debugging",
        suffixClass: "text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]",
        dotColor: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
        // Spec HUD
        hudBorder: "border-sky-500/30",
        hudCorner: "border-sky-400/80",
        hudIconColor: "text-sky-400",
        hudVenueColor: "text-sky-300 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #0369a1 0%, #38bdf8 50%, #0369a1 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(2,12,24,0.95) 0%, rgba(1,6,14,0.92) 50%, rgba(2,12,24,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(14,165,233,0.35)] group-hover:shadow-[0_0_32px_rgba(56,189,248,0.65)]",
        btnBadgeBorder: "border-sky-400/80 bg-sky-950/70 shadow-[0_0_12px_rgba(14,165,233,0.4)]",
        btnIconColor: "text-sky-300",
        btnIcon: Cpu,
        arrowColor: "text-sky-400",
        runnerBorder: "border-sky-400/70",
      };
    }
    if (isMusic) {
      return {
        accentColor: "#3b82f6", // Ultramarine Sapphire Blue
        trackTag: "NON-TECHNICAL TRACK",
        trackTagClass: "text-blue-300 border-blue-500/40 bg-blue-950/40",
        pulseDot: "bg-blue-400 shadow-[0_0_8px_#3b82f6]",
        cardBorder: "border-blue-600/35 hover:border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.18)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]",
        titlePrefix: "Rythe",
        titleSuffix: "mania",
        suffixClass: "text-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,0.7)]",
        dotColor: "bg-blue-400 shadow-[0_0_8px_#3b82f6]",
        // Spec HUD
        hudBorder: "border-blue-500/30",
        hudCorner: "border-blue-400/80",
        hudIconColor: "text-blue-400",
        hudVenueColor: "text-blue-300 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #1e40af 0%, #60a5fa 50%, #1e40af 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(2,8,22,0.95) 0%, rgba(1,4,14,0.92) 50%, rgba(2,8,22,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_32px_rgba(96,165,250,0.65)]",
        btnBadgeBorder: "border-blue-400/80 bg-blue-950/70 shadow-[0_0_12px_rgba(59,130,246,0.4)]",
        btnIconColor: "text-blue-300",
        btnIcon: Music,
        arrowColor: "text-blue-400",
        runnerBorder: "border-blue-400/70",
      };
    }
    // E-Sports
    return {
      accentColor: "#0072ff", // High-Voltage Azure Blue
      trackTag: "NON-TECHNICAL TRACK",
      trackTagClass: "text-cyan-300 border-cyan-500/40 bg-cyan-950/40",
      pulseDot: "bg-cyan-400 shadow-[0_0_8px_#00d2ff]",
      cardBorder: "border-cyan-500/35 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,114,255,0.18)] hover:shadow-[0_0_40px_rgba(0,210,255,0.35)]",
      titlePrefix: "E-",
      titleSuffix: "Sports",
      suffixClass: "text-cyan-300 drop-shadow-[0_0_12px_rgba(0,210,255,0.7)]",
      dotColor: "bg-cyan-400 shadow-[0_0_8px_#00d2ff]",
      // Spec HUD
      hudBorder: "border-cyan-500/30",
      hudCorner: "border-cyan-400/80",
      hudIconColor: "text-cyan-400",
      hudVenueColor: "text-cyan-300 font-semibold",
      // Button
      btnBorderGrad: "linear-gradient(90deg, #0052cc 0%, #00d2ff 50%, #0052cc 100%)",
      btnBgGrad: "linear-gradient(90deg, rgba(2,10,24,0.95) 0%, rgba(1,5,15,0.92) 50%, rgba(2,10,24,0.95) 100%)",
      btnGlow: "shadow-[0_0_20px_rgba(0,114,255,0.35)] group-hover:shadow-[0_0_32px_rgba(0,210,255,0.65)]",
      btnBadgeBorder: "border-cyan-400/80 bg-cyan-950/70 shadow-[0_0_12px_rgba(0,114,255,0.4)]",
      btnIconColor: "text-cyan-300",
      btnIcon: Gamepad2,
      arrowColor: "text-cyan-400",
      runnerBorder: "border-cyan-400/70",
    };
  }, [isPaper, isQuiz, isCircuit, isMusic, isSports]);

  const ButtonIcon = config.btnIcon;

  // Render the distinctive sci-fi top-left icon badge (strictly Black, Blue & White)
  const renderBadge = () => {
    if (isPaper) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          {/* Tech chamfered border SVG */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(0,240,255,0.45)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <path
              d="M14 4 H52 L62 14 V52 L52 62 H14 L4 52 V14 Z"
              fill="rgba(2, 10, 22, 0.95)"
              stroke="#00f0ff"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Top-left & bottom-right white accent notch lines */}
            <path d="M4 20 V14 L14 4 H20" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
            <path d="M46 62 H52 L62 52 V46" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
          </svg>

          {/* Paper + Microphone Composite Icon */}
          <svg
            className="relative z-10 w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.85)]"
            viewBox="0 0 36 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 6C7 4.89543 7.89543 4 9 4H21L27 10V28C27 29.1046 26.1046 30 25 30H9C7.89543 30 7 29.1046 7 28V6Z" />
            <path d="M21 4V10H27" />
            <line x1="11" y1="13" x2="20" y2="13" />
            <line x1="11" y1="18" x2="20" y2="18" />
            <line x1="11" y1="23" x2="16" y2="23" />
            <g transform="translate(18, 18)">
              <rect x="3" y="1" width="6" height="9" rx="3" fill="#010610" stroke="currentColor" strokeWidth="1.8" />
              <path d="M1 5C1 7.76 3.24 10 6 10C8.76 10 11 7.76 11 5" stroke="currentColor" strokeWidth="1.8" />
              <line x1="6" y1="10" x2="6" y2="13" stroke="currentColor" strokeWidth="1.8" />
              <line x1="3.5" y1="13" x2="8.5" y2="13" stroke="currentColor" strokeWidth="1.8" />
            </g>
          </svg>
        </div>
      );
    }

    if (isQuiz) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          {/* Vertical Regular Hexagon SVG */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(37,99,235,0.6)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <polygon
              points="33,4 60,19 60,47 33,62 6,47 6,19"
              fill="rgba(2, 8, 26, 0.95)"
              stroke="#3b82f6"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Top-right & bottom-left subtle white tick highlights */}
            <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
            <path d="M25 61 L33 62 L41 58" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
          </svg>
          <Zap className="relative z-10 w-8 h-8 text-blue-400 fill-blue-400/20 drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
        </div>
      );
    }

    if (isCircuit) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(14,165,233,0.55)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <path
              d="M14 4 H52 L62 14 V52 L52 62 H14 L4 52 V14 Z"
              fill="rgba(2, 12, 24, 0.95)"
              stroke="#0ea5e9"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M4 20 V14 L14 4 H20" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
            <path d="M46 62 H52 L62 52 V46" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
          </svg>
          <Cpu className="relative z-10 w-8 h-8 text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.85)]" />
        </div>
      );
    }

    if (isMusic) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(59,130,246,0.55)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <polygon
              points="33,4 60,19 60,47 33,62 6,47 6,19"
              fill="rgba(2, 8, 24, 0.95)"
              stroke="#3b82f6"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
            <path d="M25 61 L33 62 L41 58" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
          </svg>
          <Music className="relative z-10 w-8 h-8 text-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.85)]" />
        </div>
      );
    }

    // E-Sports
    return (
      <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(0,114,255,0.6)]"
          viewBox="0 0 66 66"
          fill="none"
        >
          <polygon
            points="33,4 60,19 60,47 33,62 6,47 6,19"
            fill="rgba(2, 10, 26, 0.95)"
            stroke="#0072ff"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
          <path d="M25 61 L33 62 L41 58" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
        </svg>
        <Gamepad2 className="relative z-10 w-8 h-8 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,114,255,0.85)]" />
      </div>
    );
  };

  // Clean venue string: ensure quiz matches "Digital Quiz Portal / Computer Lab"
  const venueDisplay =
    isQuiz && event.venue.includes("Computer")
      ? "Digital Quiz Portal / Computer Lab"
      : event.venue;

  return (
    <div className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md flex">
      <div
        className={`w-full relative group rounded-[22px] p-6 sm:p-7 flex flex-col justify-between border bg-gradient-to-b from-[#060e1d]/98 via-[#030712]/98 to-[#010206] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${config.cardBorder}`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-12 -left-12 w-52 h-52 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: config.accentColor }}
        />

        {/* TOP SECTION: Meta Badge + Icon Badge + Event Title */}
        <div className="space-y-4 relative z-10">
          {/* Track Tag and Team Size Meta Header */}
          <div className="flex items-center justify-between gap-2 pb-0.5">
            <span
              className={`font-mono text-[10px] tracking-[0.16em] uppercase font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${config.trackTagClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.pulseDot} animate-pulse`} />
              {config.trackTag}
            </span>
            <span className="font-mono text-[11px] text-slate-300 tracking-wider font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              {event.teamSize}
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            {renderBadge()}

            <div className="space-y-1 min-w-0">
              <h3 className="text-2xl sm:text-[25px] font-bold font-sans tracking-tight leading-tight">
                <span className="text-white">{config.titlePrefix}</span>
                <span className={config.suffixClass}>{config.titleSuffix}</span>
              </h3>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 font-semibold flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                <span>SPARKTRON OFFICIAL</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-slate-300 leading-relaxed font-sans min-h-[44px]">
            {event.shortDesc}
          </p>

          {/* HUD SPEC CONTAINER (Rounds & Venue) */}
          <div className="relative mt-5 pt-1">
            <div
              className={`relative rounded-xl p-3.5 sm:p-4 bg-[#020610]/85 border ${config.hudBorder} shadow-inner`}
            >
              {/* Corner Notches */}
              <span className={`absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 ${config.hudCorner}`} />
              <span className={`absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 ${config.hudCorner}`} />
              <span className={`absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 ${config.hudCorner}`} />
              <span className={`absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 ${config.hudCorner}`} />

              {/* Row 1: Rounds */}
              <div className="flex items-center justify-between text-xs sm:text-[13px] font-sans">
                <div className="flex items-center gap-2.5 w-[90px] sm:w-[98px] shrink-0 text-slate-300 font-medium">
                  <Calendar className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${config.hudIconColor} shrink-0`} />
                  <span className="text-white font-medium">Rounds</span>
                </div>
                <div className="w-[1px] h-3.5 bg-blue-400/20 mx-2.5 sm:mx-3 shrink-0" />
                <div className="flex-1 text-right font-bold text-white truncate pl-1">
                  {event.rounds}
                </div>
              </div>

              <div className="h-3 sm:h-3.5" />

              {/* Row 2: Venue */}
              <div className="flex items-center justify-between text-xs sm:text-[13px] font-sans">
                <div className="flex items-center gap-2.5 w-[90px] sm:w-[98px] shrink-0 text-slate-300 font-medium">
                  <MapPin className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${config.hudIconColor} shrink-0`} />
                  <span className="text-white font-medium">Venue</span>
                </div>
                <div className="w-[1px] h-3.5 bg-blue-400/20 mx-2.5 sm:mx-3 shrink-0" />
                <div className={`flex-1 text-right truncate pl-1 ${config.hudVenueColor}`} title={venueDisplay}>
                  {venueDisplay}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Futuristic Chamfered Neon Button */}
        <div className="relative pt-6 mt-4 z-10">
          <button
            type="button"
            onClick={() => onSelect(event)}
            className="w-full relative group/btn cursor-pointer block focus:outline-none"
          >
            {/* Outer Chamfered Border Layer */}
            <div
              className={`w-full p-[1.5px] transition-all duration-300 ${config.btnGlow}`}
              style={{
                clipPath:
                  "polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)",
                background: config.btnBorderGrad,
              }}
            >
              {/* Inner Button Gradient Body */}
              <div
                className="w-full py-2.5 sm:py-3 px-4 sm:px-6 flex items-center justify-between transition-colors duration-300"
                style={{
                  clipPath:
                    "polygon(15px 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0% 50%)",
                  background: config.btnBgGrad,
                }}
              >
                {/* Left Glowing Badge Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover/btn:scale-110 ${config.btnBadgeBorder}`}
                >
                  <ButtonIcon className={`w-4 h-4 ${config.btnIconColor}`} />
                </div>

                {/* Center Text */}
                <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-white mx-auto drop-shadow-sm">
                  RULES &amp; GUIDELINES
                </span>

                {/* Right Arrow */}
                <ArrowRight
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1.5 ${config.arrowColor}`}
                />
              </div>
            </div>

            {/* Cyber Corner Runner Bracket Accents */}
            <div
              className={`absolute -bottom-1 left-2.5 w-3.5 h-1.5 border-b-2 border-l-2 ${config.runnerBorder} pointer-events-none opacity-80`}
            />
            <div
              className={`absolute -bottom-1 right-2.5 w-3.5 h-1.5 border-b-2 border-r-2 ${config.runnerBorder} pointer-events-none opacity-80`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
