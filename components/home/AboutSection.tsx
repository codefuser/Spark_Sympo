"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Award,
  Zap,
  Cpu,
  Target,
  Compass,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// 5. PCB Circuit Traces - Top Right (Cyan & Blue dual-trace bus lines, via pads)
function PcbTracesTopRight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none overflow-hidden opacity-25 circuit-pulse",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cyan primary traces */}
        <path
          d="M0 24 H70 L95 50 H160 L180 30 H220"
          stroke="#00F0FF"
          strokeWidth="1.2"
          strokeDasharray="5 3"
        />
        <path
          d="M35 8 H95 L120 34 H185"
          stroke="#00F0FF"
          strokeWidth="1.2"
        />
        <path
          d="M95 50 V85 L115 105 H195"
          stroke="#00F0FF"
          strokeWidth="1"
        />
        {/* Blue secondary traces */}
        <path
          d="M15 42 H60 L85 68 H150 L170 88 H215"
          stroke="#0072FF"
          strokeWidth="1.2"
        />
        <path
          d="M85 68 V98 L105 118 H165"
          stroke="#0072FF"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        {/* Via pads (Cyan) */}
        <circle cx="70" cy="24" r="2.5" fill="#00F0FF" />
        <circle cx="160" cy="50" r="2" fill="#00F0FF" />
        <circle cx="180" cy="30" r="2" fill="#00F0FF" />
        <circle cx="195" cy="105" r="2.5" fill="#00F0FF" />
        <circle cx="95" cy="8" r="2" stroke="#00F0FF" strokeWidth="1" fill="none" />
        {/* Via pads (Blue) */}
        <circle cx="60" cy="42" r="2" fill="#0072FF" />
        <circle cx="150" cy="68" r="2.5" fill="#0072FF" />
        <circle cx="215" cy="88" r="2" fill="#0072FF" />
        <circle cx="165" cy="118" r="2.5" stroke="#0072FF" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// 5. PCB Circuit Traces - Bottom Left (Cyan & Blue dual-trace bus lines, via pads)
function PcbTracesBottomLeft({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none overflow-hidden opacity-25 circuit-pulse",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue primary traces */}
        <path
          d="M220 96 H150 L125 70 H60 L40 90 H0"
          stroke="#0072FF"
          strokeWidth="1.2"
          strokeDasharray="5 3"
        />
        <path
          d="M185 112 H125 L100 86 H35"
          stroke="#0072FF"
          strokeWidth="1.2"
        />
        <path
          d="M125 70 V35 L105 15 H25"
          stroke="#0072FF"
          strokeWidth="1"
        />
        {/* Cyan secondary traces */}
        <path
          d="M205 78 H160 L135 52 H70 L50 32 H5"
          stroke="#00F0FF"
          strokeWidth="1.2"
        />
        <path
          d="M135 52 V22 L115 2 H55"
          stroke="#00F0FF"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        {/* Via pads (Blue) */}
        <circle cx="150" cy="96" r="2.5" fill="#0072FF" />
        <circle cx="60" cy="70" r="2" fill="#0072FF" />
        <circle cx="40" cy="90" r="2" fill="#0072FF" />
        <circle cx="25" cy="15" r="2.5" fill="#0072FF" />
        <circle cx="125" cy="112" r="2" stroke="#0072FF" strokeWidth="1" fill="none" />
        {/* Via pads (Cyan) */}
        <circle cx="160" cy="78" r="2" fill="#00F0FF" />
        <circle cx="70" cy="52" r="2.5" fill="#00F0FF" />
        <circle cx="5" cy="32" r="2" fill="#00F0FF" />
        <circle cx="55" cy="2" r="2.5" stroke="#00F0FF" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// 5. Subtle PCB Corner Framing Lines around the outer edges of the card
function PcbCornerTraceBorder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none opacity-20 circuit-pulse",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 76 V24 L24 4 H76"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <path
          d="M14 76 V30 L30 14 H76"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="24" cy="4" r="2" fill="currentColor" />
        <circle cx="76" cy="4" r="2" fill="currentColor" />
        <circle cx="30" cy="14" r="1.5" fill="currentColor" />
        <circle cx="4" cy="24" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

// Precision HUD Corner Brackets for futuristic engineering cards
function HudCorners() {
  return (
    <>
      <span
        className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-primary/50 rounded-tl-sm transition-colors duration-300 group-hover:border-primary/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-primary/50 rounded-tr-sm transition-colors duration-300 group-hover:border-primary/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-primary/50 rounded-bl-sm transition-colors duration-300 group-hover:border-primary/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-primary/50 rounded-br-sm transition-colors duration-300 group-hover:border-primary/80"
        aria-hidden="true"
      />
    </>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [acresCount, setAcresCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setInView(true);
      setAcresCount(25);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 4. Statistics Animation: Snappy count-up from 0 to 25 when in view (~1.5s)
  useEffect(() => {
    if (!inView) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setAcresCount(25);
      return;
    }

    let animId: number;
    const timeoutId = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 1500; // 1.5 seconds
      const target = 25;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Smooth cubic deceleration
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setAcresCount(Math.round(easedProgress * target));

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setAcresCount(target);
        }
      };

      animId = requestAnimationFrame(step);
    }, 480); // match the CSS transition delay of 480ms
    
    return () => {
      clearTimeout(timeoutId);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative container mx-auto px-4 sm:px-6 space-y-12 overflow-hidden py-4 sm:py-6"
    >
      {/* 1. Animated Grid: Moving very slowly with a subtle cyan/blue glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hud-grid-bg opacity-65"
        aria-hidden="true"
      />

      {/* 1. Slow Ambient Cyan/Blue Radial Lighting (Low Intensity) */}
      <div
        className="pointer-events-none absolute top-12 left-1/4 -z-10 w-[420px] h-[320px] rounded-full bg-primary/[0.05] blur-[110px] hud-ambient-primary"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-16 right-1/4 -z-10 w-[460px] h-[360px] rounded-full bg-cyan/[0.05] blur-[130px] hud-ambient-cyan"
        aria-hidden="true"
      />

      {/* 6. Scroll Reveal: Header Area with smooth fade-in and slight upward movement */}
      <div className="space-y-4 mb-10 text-center mx-auto max-w-3xl">
        {/* Badge with Scroll Reveal */}
        <div
          data-reveal
          className={cn(
            "inline-flex items-center justify-center transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "60ms" }}
        >
          <div className="relative inline-flex items-center px-4 py-1.5 rounded-full overflow-hidden border border-primary/30 bg-card/80 backdrop-blur-sm shadow-[0_0_10px_rgba(0,240,255,0.06)]">
            {/* Scanning beam highlight */}
            <div
              className="pointer-events-none absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/25 to-transparent hud-scan-beam"
              aria-hidden="true"
            />
            <span className="relative z-10 font-mono text-xs tracking-widest uppercase font-bold text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#00F0FF]" />
              ABOUT US
            </span>
          </div>
        </div>

        {/* Heading with Scroll Reveal */}
        <h2
          data-reveal
          className={cn(
            "text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight uppercase leading-tight sm:leading-snug transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "140ms" }}
        >
          <span className="text-white block font-bold">
            About Thamirabharani Engineering College
          </span>
          <span className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-2 text-slate-300 font-extrabold text-2xl md:text-3xl lg:text-4xl">
            <span className="text-primary/60 font-light">&amp;</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-glow to-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              SPARKTRON 2K26
            </span>
          </span>
        </h2>

        {/* Description with Scroll Reveal */}
        <div
          data-reveal
          className={cn(
            "space-y-2 transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "220ms" }}
        >
          <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-cyan rounded-full mx-auto my-2 opacity-80" />
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Fostering technical innovation, engineering mastery, and collaborative
            research excellence.
          </p>
        </div>
      </div>

      {/* 6. Scroll Reveal: Institution Card Container */}
      <div className="relative">
        {/* 5. PCB Circuit Traces around the card perimeter */}
        <PcbCornerTraceBorder className="-top-2.5 -left-2.5 sm:-top-3.5 sm:-left-3.5 w-14 h-14 sm:w-20 sm:h-20 text-primary" />
        <PcbCornerTraceBorder className="-bottom-2.5 -right-2.5 sm:-bottom-3.5 sm:-right-3.5 w-14 h-14 sm:w-20 sm:h-20 text-cyan rotate-180" />

        <div
          data-reveal
          className={cn(
            "group relative rounded-2xl bg-card/90 border border-primary/20 p-6 sm:p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all duration-600 ease-out shadow-[0_4px_30px_-5px_rgba(0,240,255,0.05)] hover:border-primary/35",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          {/* HUD Corner Brackets */}
          <HudCorners />

          {/* 2. Scanning Light: Thin glowing cyan light that slowly scans across the About card */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden="true"
          >
            <div className="hud-card-scanline" />
          </div>

          {/* 5. PCB Circuit Traces inside the About card (Cyan & Blue, decorative & subtle) */}
          <PcbTracesTopRight className="top-1 right-2 sm:top-2 sm:right-5 w-36 h-20 sm:w-56 sm:h-28" />
          <PcbTracesBottomLeft className="bottom-1 left-2 sm:bottom-2 sm:left-5 w-36 h-20 sm:w-56 sm:h-28" />

          {/* Subtle interior radial corner glow */}
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-cyan/10 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            {/* Card Top Header: Icon & Title */}
            <div
              data-reveal
              className={cn(
                "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/15 pb-5 transition-all duration-500 ease-out",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: "360ms" }}
            >
              <div className="flex items-center space-x-4">
                {/* 3. Animated College / Institution Icon: Smooth fade, scale & glow effect */}
                <div
                  className={cn(
                    "relative p-3 rounded-xl bg-primary/10 text-primary border border-primary/25 shrink-0 group-hover:border-primary/50 transition-colors",
                    inView && "college-badge-animated"
                  )}
                >
                  {inView && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl border border-primary/40 animate-icon-echo"
                      aria-hidden="true"
                    />
                  )}
                  <Building2
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 ease-out",
                      inView ? "college-icon-animated" : "scale-75 opacity-0"
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-primary font-mono text-xs tracking-wider uppercase font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>INSTITUTION PROFILE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
                    About Thamirabharani Engineering College
                  </h3>
                </div>
              </div>

              {/* Accreditation Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold flex items-center gap-1.5 shadow-[0_0_6px_rgba(0,240,255,0.06)]">
                  <ShieldCheck className="w-4 h-4 text-primary" /> AICTE Approved, New Delhi
                </span>
                <span className="px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-semibold flex items-center gap-1.5 shadow-[0_0_6px_rgba(0,114,255,0.06)]">
                  <Award className="w-4 h-4 text-cyan" /> Autonomous Institution
                </span>
              </div>
            </div>

            {/* Factual Text Preserved Verbatim */}
            <div
              data-reveal
              className={cn(
                "text-sm sm:text-base text-slate-300 font-normal leading-relaxed space-y-4 transition-all duration-500 ease-out",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: "420ms" }}
            >
              <div className="space-y-4">
                <p className={cn(!isExpanded && "line-clamp-4")}>
                  Thamirabharani Engineering College which is in the Tirunelveli
                  Corporation limits is located at Thatchanallur, 5km away from
                  Palayamkottai and 40 km from Tuticorin airport. Unfolding its
                  grandeur over 25 acres of land, the college exhibits an attractive
                  panorama conducive to studies. Considering a holistic approach to
                  life and education, an ambient infrastructure is provided for the
                  students. They enjoy a natural sanctuary of birds, magnificent
                  scenery of evergreen trees and amazing mountains and a gorgeous
                  garden of multicolored flowers. Thamirabharani Engineering College
                  was founded with the noble vision to raise professionals and
                  leaders of high academic caliber and unblemished character,
                  nurtured with a strong motivation and commitment to serve humanity.
                  TEC aims at educating &amp; training its students to become not
                  only competent professionals but also excellent human beings to
                  influence the quality of life of people around.
                </p>
                {isExpanded && (
                  <p>
                    Thamirabharani Engineering College was established with the goal
                    of producing outstanding students in Technical and Business fields
                    and preparing them to tackle the challenges of a dynamic and
                    rapidly changing world. The management implements an
                    interdisciplinary curriculum as an Autonomous Institution, making
                    sure that practical applications are combined with the classroom
                    material. All the programs offered by the institute are recognized
                    by statutory bodies like the All India Council of Technical
                    Education (AICTE), New Delhi. In a nutshell, Thamirabharani
                    Engineering College is an autonomous, co-educational, residential,
                    technological college imparting holistic education to develop the
                    technical and the character of the students.
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-cyan transition-colors font-medium text-sm focus:outline-none flex items-center gap-1 mt-2"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            {/* 4 & 6. Statistics Grid: Smooth scroll reveal, count-up, hover lift & glow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 font-mono text-xs">
              {/* 25 Acres with Count-up */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.22)] cursor-default",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "480ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-primary tracking-tight">
                  {acresCount} Acres
                </div>
                <div className="text-slate-400 mt-1 text-[11px] sm:text-xs">
                  Lush Green Campus
                </div>
              </div>

              {/* Tirunelveli */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-cyan/60 hover:shadow-[0_0_20px_rgba(0,114,255,0.25)] cursor-default",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "560ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-cyan tracking-tight">
                  Tirunelveli
                </div>
                <div className="text-slate-400 mt-1 text-[11px] sm:text-xs">
                  Corporation Limits
                </div>
              </div>

              {/* Autonomous */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] cursor-default",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "640ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-emerald-400 tracking-tight">
                  Autonomous
                </div>
                <div className="text-slate-400 mt-1 text-[11px] sm:text-xs">
                  AICTE Approved &amp; Autonomous
                </div>
              </div>

              {/* Co-Ed */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] cursor-default",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "720ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-amber-400 tracking-tight">
                  Co-Ed
                </div>
                <div className="text-slate-400 mt-1 text-[11px] sm:text-xs">
                  Residential Campus
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symposium Legacy & Department Overview (Seamless Cascading Reveal) */}
      <div
        data-reveal
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{ transitionDelay: "800ms" }}
      >
        {/* What is SPARKTRON 2K26? */}
        <Card
          glowOnHover
          className="group relative space-y-4 flex flex-col justify-between border-primary/20 hover:border-primary/40 bg-card/90 p-6 sm:p-8"
        >
          <HudCorners />
          <div>
            <div className="flex items-center space-x-2 text-primary font-mono text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>THE SYMPOSIUM LEGACY</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">
              What is SPARKTRON 2K26?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed space-y-3">
              <span>
                SPARKTRON 2K26 is the annual flagship National Level Technical
                Symposium organized by the Department of Electronics and
                Communication Engineering. It serves as a high-octane nexus
                where budding engineers from across the nation converge to
                benchmark their technical prowess.
              </span>
              <br />
              <br />
              <span>
                Featuring state-of-the-art competitions in circuit debugging,
                technical paper synthesis, autonomous robot combat, and embedded
                edge workshops, SPARKTRON bridges academic theory and practical
                industry execution.
              </span>
            </p>
          </div>
          <div className="pt-4 border-t border-primary/10 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> ISO Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-cyan" /> IEEE Supported
            </span>
          </div>
        </Card>

        {/* Department of ECE */}
        <Card
          glowOnHover
          className="group relative space-y-4 flex flex-col justify-between border-primary/20 hover:border-primary/40 bg-card/90 p-6 sm:p-8"
        >
          <HudCorners />
          <div>
            <div className="flex items-center space-x-2 text-cyan font-mono text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>DEPARTMENT OVERVIEW</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">
              Department of ECE
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The Department of Electronics and Communication Engineering is
              renowned for its academic rigor, research publications, and
              cutting-edge laboratory infrastructure. Equipped with advanced
              VLSI design tools, Embedded System kits, DSP trainers, and
              Microwave test setups, the department nurtures industry-ready
              engineers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs text-center">
            <div className="p-3.5 rounded-xl bg-background/85 border border-primary/20 hover:border-primary/50 transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                12+
              </div>
              <div className="text-slate-400 mt-1">Advanced Labs</div>
            </div>
            <div className="p-3.5 rounded-xl bg-background/85 border border-primary/20 hover:border-cyan/50 transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-cyan">
                100%
              </div>
              <div className="text-slate-400 mt-1">Placement Record</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vision & Mission (Staggered Entrance) */}
      <div
        data-reveal
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{ transitionDelay: "880ms" }}
      >
        <Card className="group relative border-l-4 border-l-primary border-primary/20 bg-card/90 p-6 sm:p-8">
          <HudCorners />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Vision</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            To evolve into a center of excellence in Electronics and
            Communication Engineering education and research, producing globally
            competent, ethically sound, and innovative engineers.
          </p>
        </Card>

        <Card className="group relative border-l-4 border-l-cyan border-cyan/20 bg-card/90 p-6 sm:p-8">
          <HudCorners />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan/10 text-cyan">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Mission</h4>
          </div>
          <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              Provide rigorous technical curriculum enriched with practical
              laboratory experience.
            </li>
            <li>
              Foster research partnerships with semiconductor, telecommunication,
              and robotics industries.
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
