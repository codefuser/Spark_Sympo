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
  Flame,
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

  // Palette configurations matching the target sci-fi theme
  const config = React.useMemo(() => {
    if (isPaper) {
      return {
        accentColor: "#00f0ff",
        cardBorder: "border-cyan-500/35 hover:border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.18)] hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]",
        titlePrefix: "Paper ",
        titleSuffix: "Presentation",
        suffixClass: "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]",
        dotColor: "bg-cyan-400 shadow-[0_0_8px_#00f0ff]",
        // Spec HUD
        hudBorder: "border-cyan-500/30",
        hudCorner: "border-cyan-400/70",
        hudIconColor: "text-cyan-400",
        hudVenueColor: "text-cyan-400 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #00f0ff 0%, #38bdf8 50%, #00f0ff 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(4,36,52,0.95) 0%, rgba(2,20,32,0.92) 50%, rgba(4,36,52,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]",
        btnBadgeBorder: "border-cyan-400/80 bg-cyan-950/60 shadow-[0_0_10px_rgba(0,240,255,0.4)]",
        btnIconColor: "text-cyan-300",
        btnIcon: Lightbulb,
        arrowColor: "text-cyan-400",
        runnerBorder: "border-cyan-400/60",
      };
    }
    if (isQuiz) {
      return {
        accentColor: "#a855f7",
        cardBorder: "border-purple-500/35 hover:border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.18)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
        titlePrefix: "Technical ",
        titleSuffix: "Quiz",
        suffixClass: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]",
        dotColor: "bg-purple-400 shadow-[0_0_8px_#a855f7]",
        // Spec HUD
        hudBorder: "border-purple-500/30",
        hudCorner: "border-purple-400/70",
        hudIconColor: "text-purple-400",
        hudVenueColor: "text-purple-400 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #a855f7 0%, #c084fc 50%, #a855f7 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(28,10,50,0.95) 0%, rgba(16,6,30,0.92) 50%, rgba(28,10,50,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
        btnBadgeBorder: "border-purple-400/80 bg-purple-950/60 shadow-[0_0_10px_rgba(168,85,247,0.4)]",
        btnIconColor: "text-purple-300",
        btnIcon: Trophy,
        arrowColor: "text-purple-400",
        runnerBorder: "border-purple-400/60",
      };
    }
    if (isCircuit) {
      return {
        accentColor: "#10b981",
        cardBorder: "border-emerald-500/35 hover:border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]",
        titlePrefix: "Circuit ",
        titleSuffix: "Debugging",
        suffixClass: "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]",
        dotColor: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
        // Spec HUD
        hudBorder: "border-emerald-500/30",
        hudCorner: "border-emerald-400/70",
        hudIconColor: "text-emerald-400",
        hudVenueColor: "text-emerald-400 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(4,38,26,0.95) 0%, rgba(2,22,15,0.92) 50%, rgba(4,38,26,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]",
        btnBadgeBorder: "border-emerald-400/80 bg-emerald-950/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
        btnIconColor: "text-emerald-300",
        btnIcon: Cpu,
        arrowColor: "text-emerald-400",
        runnerBorder: "border-emerald-400/60",
      };
    }
    if (isMusic) {
      return {
        accentColor: "#f43f5e",
        cardBorder: "border-pink-500/35 hover:border-pink-400 shadow-[0_0_30px_rgba(244,63,94,0.18)] hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]",
        titlePrefix: "Rythe",
        titleSuffix: "mania",
        suffixClass: "text-pink-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]",
        dotColor: "bg-pink-400 shadow-[0_0_8px_#f43f5e]",
        // Spec HUD
        hudBorder: "border-pink-500/30",
        hudCorner: "border-pink-400/70",
        hudIconColor: "text-pink-400",
        hudVenueColor: "text-pink-400 font-semibold",
        // Button
        btnBorderGrad: "linear-gradient(90deg, #f43f5e 0%, #fb7185 50%, #f43f5e 100%)",
        btnBgGrad: "linear-gradient(90deg, rgba(46,6,22,0.95) 0%, rgba(24,3,12,0.92) 50%, rgba(46,6,22,0.95) 100%)",
        btnGlow: "shadow-[0_0_20px_rgba(244,63,94,0.35)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]",
        btnBadgeBorder: "border-pink-400/80 bg-pink-950/60 shadow-[0_0_10px_rgba(244,63,94,0.4)]",
        btnIconColor: "text-pink-300",
        btnIcon: Music,
        arrowColor: "text-pink-400",
        runnerBorder: "border-pink-400/60",
      };
    }
    // E-Sports
    return {
      accentColor: "#f59e0b",
      cardBorder: "border-amber-500/35 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]",
      titlePrefix: "E-",
      titleSuffix: "Sports",
      suffixClass: "text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]",
      dotColor: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
      // Spec HUD
      hudBorder: "border-amber-500/30",
      hudCorner: "border-amber-400/70",
      hudIconColor: "text-amber-400",
      hudVenueColor: "text-amber-400 font-semibold",
      // Button
      btnBorderGrad: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
      btnBgGrad: "linear-gradient(90deg, rgba(46,24,4,0.95) 0%, rgba(24,12,2,0.92) 50%, rgba(46,24,4,0.95) 100%)",
      btnGlow: "shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]",
      btnBadgeBorder: "border-amber-400/80 bg-amber-950/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
      btnIconColor: "text-amber-300",
      btnIcon: Flame,
      arrowColor: "text-amber-400",
      runnerBorder: "border-amber-400/60",
    };
  }, [isPaper, isQuiz, isCircuit, isMusic, isSports]);

  const ButtonIcon = config.btnIcon;

  // Render the distinctive sci-fi top-left icon badge
  const renderBadge = () => {
    if (isPaper) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          {/* Tech chamfered border SVG */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_14px_rgba(0,240,255,0.45)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <path
              d="M14 4 H52 L62 14 V52 L52 62 H14 L4 52 V14 Z"
              fill="rgba(4, 28, 38, 0.9)"
              stroke="#00f0ff"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Top-left & bottom-right white accent notch lines */}
            <path d="M4 20 V14 L14 4 H20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
            <path d="M46 62 H52 L62 52 V46" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          </svg>

          {/* Paper + Microphone Composite Icon */}
          <svg
            className="relative z-10 w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            viewBox="0 0 36 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Paper Outline */}
            <path d="M7 6C7 4.89543 7.89543 4 9 4H21L27 10V28C27 29.1046 26.1046 30 25 30H9C7.89543 30 7 29.1046 7 28V6Z" />
            <path d="M21 4V10H27" />
            {/* Paper Lines */}
            <line x1="11" y1="13" x2="20" y2="13" />
            <line x1="11" y1="18" x2="20" y2="18" />
            <line x1="11" y1="23" x2="16" y2="23" />
            {/* Mic Overlay at bottom right */}
            <g transform="translate(18, 18)">
              <rect x="3" y="1" width="6" height="9" rx="3" fill="#031620" stroke="currentColor" strokeWidth="1.8" />
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
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(168,85,247,0.55)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <polygon
              points="33,4 60,19 60,47 33,62 6,47 6,19"
              fill="rgba(24, 8, 44, 0.9)"
              stroke="#a855f7"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Top-right & bottom-left subtle white tick highlights */}
            <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </svg>
          <Zap className="relative z-10 w-8 h-8 text-purple-400 fill-purple-400/25 drop-shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
        </div>
      );
    }

    if (isCircuit) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_14px_rgba(16,185,129,0.45)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <path
              d="M14 4 H52 L62 14 V52 L52 62 H14 L4 52 V14 Z"
              fill="rgba(4, 30, 20, 0.9)"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M4 20 V14 L14 4 H20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          </svg>
          <Cpu className="relative z-10 w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      );
    }

    if (isMusic) {
      return (
        <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(244,63,94,0.55)]"
            viewBox="0 0 66 66"
            fill="none"
          >
            <polygon
              points="33,4 60,19 60,47 33,62 6,47 6,19"
              fill="rgba(38, 6, 20, 0.9)"
              stroke="#f43f5e"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </svg>
          <Music className="relative z-10 w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
        </div>
      );
    }

    // E-Sports
    return (
      <div className="relative w-16 h-16 sm:w-[66px] sm:h-[66px] shrink-0 flex items-center justify-center">
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(245,158,11,0.55)]"
          viewBox="0 0 66 66"
          fill="none"
        >
          <polygon
            points="33,4 60,19 60,47 33,62 6,47 6,19"
            fill="rgba(36, 18, 4, 0.9)"
            stroke="#f59e0b"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M25 5 L33 4 L41 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </svg>
        <Gamepad2 className="relative z-10 w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
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
        className={`w-full relative group rounded-[22px] p-6 sm:p-7 flex flex-col justify-between border bg-gradient-to-b from-[#07111e]/98 via-[#050b14]/98 to-[#02050b] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${config.cardBorder}`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: config.accentColor }}
        />

        {/* TOP SECTION: Icon Badge + Event Title */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            {renderBadge()}

            <div className="space-y-1 min-w-0">
              <h3 className="text-2xl sm:text-[25px] font-bold font-sans tracking-tight leading-tight">
                <span className="text-white">{config.titlePrefix}</span>
                <span className={config.suffixClass}>{config.titleSuffix}</span>
              </h3>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                <span>SPARKTRON OFFICIAL</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-slate-300/90 leading-relaxed font-sans min-h-[44px]">
            {event.shortDesc}
          </p>

          {/* HUD SPEC CONTAINER (Rounds & Venue) */}
          <div className="relative mt-5 pt-1">
            <div
              className={`relative rounded-xl p-3.5 sm:p-4 bg-[#040e1b]/80 border ${config.hudBorder} shadow-inner`}
            >
              {/* Corner Notches */}
              <span className={`absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 ${config.hudCorner}`} />
              <span className={`absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 ${config.hudCorner}`} />
              <span className={`absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 ${config.hudCorner}`} />
              <span className={`absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 ${config.hudCorner}`} />

              {/* Row 1: Rounds */}
              <div className="flex items-center justify-between text-xs sm:text-[13px] font-sans">
                <div className="flex items-center gap-2.5 w-[90px] sm:w-[98px] shrink-0 text-slate-400 font-medium">
                  <Calendar className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${config.hudIconColor} shrink-0`} />
                  <span>Rounds</span>
                </div>
                <div className="w-[1px] h-3.5 bg-white/15 mx-2.5 sm:mx-3 shrink-0" />
                <div className="flex-1 text-right font-bold text-white truncate pl-1">
                  {event.rounds}
                </div>
              </div>

              <div className="h-3 sm:h-3.5" />

              {/* Row 2: Venue */}
              <div className="flex items-center justify-between text-xs sm:text-[13px] font-sans">
                <div className="flex items-center gap-2.5 w-[90px] sm:w-[98px] shrink-0 text-slate-400 font-medium">
                  <MapPin className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${config.hudIconColor} shrink-0`} />
                  <span>Venue</span>
                </div>
                <div className="w-[1px] h-3.5 bg-white/15 mx-2.5 sm:mx-3 shrink-0" />
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
                <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-white mx-auto">
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
