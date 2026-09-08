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

function AnimatedCounter({ inView, target, duration = 4000, delay = 480 }: { inView: boolean, target: number, duration?: number, delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let animId: number;
    const timeoutId = setTimeout(() => {
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(easedProgress * target));

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      animId = requestAnimationFrame(step);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [inView, target, duration, delay]);

  return <>{count}</>;
}

// 5. Minimal PCB Circuit Traces - Top Right
function PcbTracesTopRight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none overflow-hidden opacity-60 transition-opacity duration-700",
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
        <g opacity="0.5">
          <path d="M220 30 H140 L90 80 H60" stroke="#00F0FF" strokeWidth="1.2" />
          <circle cx="60" cy="80" r="2.5" fill="#00F0FF" />
          <circle cx="140" cy="30" r="2" stroke="#00F0FF" strokeWidth="1" fill="none" />
        </g>
        
        {/* Animated glowing dot 1 */}
        <circle r="3.5" fill="#00F0FF" opacity="0.6">
          <animateMotion dur="4s" repeatCount="indefinite" path="M220 30 H140 L90 80 H60" />
        </circle>
        <circle r="1.5" fill="#fff">
          <animateMotion dur="4s" repeatCount="indefinite" path="M220 30 H140 L90 80 H60" />
        </circle>
        
        <g opacity="0.5">
          <path d="M220 50 H160 L110 100 H80" stroke="#0072FF" strokeWidth="1.2" />
          <circle cx="80" cy="100" r="2.5" fill="#0072FF" />
          <circle cx="160" cy="50" r="2" stroke="#0072FF" strokeWidth="1" fill="none" />
        </g>

        {/* Animated glowing dot 2 */}
        <circle r="3.5" fill="#0072FF" opacity="0.6">
          <animateMotion dur="4s" repeatCount="indefinite" path="M220 50 H160 L110 100 H80" />
        </circle>
        <circle r="1.5" fill="#fff">
          <animateMotion dur="4s" repeatCount="indefinite" path="M220 50 H160 L110 100 H80" />
        </circle>
      </svg>
    </div>
  );
}

// 5. Minimal PCB Circuit Traces - Bottom Left
function PcbTracesBottomLeft({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none overflow-hidden opacity-60 transition-opacity duration-700",
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
        <g opacity="0.5">
          <path d="M0 90 H80 L130 40 H160" stroke="#0072FF" strokeWidth="1.2" />
          <circle cx="160" cy="40" r="2.5" fill="#0072FF" />
          <circle cx="80" cy="90" r="2" stroke="#0072FF" strokeWidth="1" fill="none" />
        </g>

        {/* Animated glowing dot 1 */}
        <circle r="3.5" fill="#0072FF" opacity="0.6">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 90 H80 L130 40 H160" />
        </circle>
        <circle r="1.5" fill="#fff">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 90 H80 L130 40 H160" />
        </circle>

        <g opacity="0.5">
          <path d="M0 70 H60 L110 20 H140" stroke="#00F0FF" strokeWidth="1.2" />
          <circle cx="140" cy="20" r="2.5" fill="#00F0FF" />
          <circle cx="60" cy="70" r="2" stroke="#00F0FF" strokeWidth="1" fill="none" />
        </g>

        {/* Animated glowing dot 2 */}
        <circle r="3.5" fill="#00F0FF" opacity="0.6">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 70 H60 L110 20 H140" />
        </circle>
        <circle r="1.5" fill="#fff">
          <animateMotion dur="4s" repeatCount="indefinite" path="M0 70 H60 L110 20 H140" />
        </circle>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(true);

  const toggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setTimeout(() => setIsClamped(true), 500); // Wait for transition before clamping
    } else {
      setIsClamped(false);
      setIsExpanded(true);
    }
  };

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
        className="pointer-events-none absolute top-12 left-1/4 -z-10 w-[420px] h-[320px] rounded-full bg-primary/[0.05] blur-[110px] hud-ambient-primary transform-gpu"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-16 right-1/4 -z-10 w-[460px] h-[360px] rounded-full bg-cyan/[0.05] blur-[130px] hud-ambient-cyan transform-gpu"
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
          className="text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight uppercase leading-tight sm:leading-snug"
        >
          <span 
            className={cn(
              "text-white block font-bold transition-all duration-500 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "140ms" }}
          >
            About Thamirabharani
          </span>
          <span 
            className={cn(
              "text-white block font-bold transition-all duration-500 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "340ms" }}
          >
            Engineering College
          </span>
          <span 
            className={cn(
              "mt-1.5 flex flex-wrap items-center justify-center gap-2 text-slate-300 font-extrabold text-2xl md:text-3xl lg:text-4xl transition-all duration-500 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "540ms" }}
          >
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
          style={{ transitionDelay: "740ms" }}
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
        <div
          data-reveal
          className={cn(
            "group relative rounded-[24px] bg-card/90 border border-cyan p-6 sm:p-8 md:p-10 backdrop-blur-md shadow-2xl transition-all duration-600 ease-out shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "820ms" }}
        >
          {/* HUD Corner Brackets */}
          <HudCorners />


          {/* 5. PCB Circuit Traces inside the About card (Cyan & Blue, decorative & subtle) */}
          <PcbTracesTopRight className="top-1 right-2 sm:top-2 sm:right-5 w-36 h-20 sm:w-56 sm:h-28" />
          <PcbTracesBottomLeft className="bottom-1 left-2 sm:bottom-2 sm:left-5 w-36 h-20 sm:w-56 sm:h-28" />

          {/* Subtle interior radial corner glow */}
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform-gpu"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-cyan/10 rounded-full blur-3xl transform-gpu"
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
              style={{ transitionDelay: "880ms" }}
            >
              <div className="flex items-center space-x-4">
                {/* 3. Animated College / Institution Icon: 68px round circle with breathing cyan glow */}
                <div
                  className={cn(
                    "relative flex items-center justify-center shrink-0 w-[68px] h-[68px] rounded-full bg-cyan/10 text-cyan border border-cyan transition-colors overflow-hidden",
                    inView && "slow-breathing-cyan-glow"
                  )}
                >
                  <Building2 
                    className={cn(
                      "w-8 h-8 transition-all duration-500 ease-out",
                      inView ? "opacity-100 scale-100" : "scale-75 opacity-0"
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-primary font-mono text-xs tracking-[0.25em] uppercase font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>INSTITUTION PROFILE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
                    About Thamirabharani Engineering College
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold flex items-center gap-1.5 shadow-[0_0_6px_rgba(0,240,255,0.06)]">
                  <ShieldCheck className="w-4 h-4 text-primary" /> AICTE Approved
                </span>
                <span className="px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-semibold flex items-center gap-1.5 shadow-[0_0_6px_rgba(0,114,255,0.06)]">
                  <Award className="w-4 h-4 text-cyan" /> Autonomous
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
              style={{ transitionDelay: "940ms" }}
            >
              <div className="space-y-0">
                {/* First paragraph container - animates max-height so it doesn't snap instantly */}
                <div 
                  className={cn(
                    "overflow-hidden transition-[max-height] duration-500 ease-in-out",
                    isExpanded ? "max-h-[500px]" : "max-h-[5.8rem] sm:max-h-[6.8rem]"
                  )}
                >
                  <p className={cn(isClamped && "line-clamp-4")}>
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
                </div>
                
                {/* Second paragraph container - perfect grid sliding animation */}
                <div 
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                  )}
                >
                  <div className="overflow-hidden">
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
                  </div>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="text-primary hover:text-cyan transition-colors font-medium text-sm focus:outline-none flex items-center gap-1 mt-2"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            {/* 4 & 6. Statistics Grid: Smooth scroll reveal, count-up, hover lift & glow */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 font-mono text-xs">
              {/* 25 Acres with Count-up */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.22)] cursor-default flex flex-col items-center justify-center min-h-[80px]",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "1000ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-primary tracking-tight">
                  <AnimatedCounter inView={inView} target={25} delay={480} /> Acres
                </div>
              </div>

              {/* Autonomous */}
              <div
                data-reveal
                className={cn(
                  "group/stat relative p-3.5 sm:p-4 rounded-xl bg-background/85 border border-primary/20 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] cursor-default flex flex-col items-center justify-center min-h-[80px]",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "1160ms" }}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-emerald-400 tracking-tight">
                  Autonomous
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview: ECE & EEE */}
      <div
        data-reveal
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{ transitionDelay: "1320ms" }}
      >
        {/* Department of ECE */}
        <Card
          glowOnHover
          className="group relative space-y-4 flex flex-col justify-between border border-cyan rounded-[24px] shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80 bg-card/90 p-6 sm:p-8"
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
          <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs text-center mt-auto">
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

        {/* Department of EEE */}
        <Card
          glowOnHover
          className="group relative space-y-4 flex flex-col justify-between border border-cyan rounded-[24px] shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80 bg-card/90 p-6 sm:p-8"
        >
          <HudCorners />
          <div>
            <div className="flex items-center space-x-2 text-amber-500 font-mono text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>DEPARTMENT OVERVIEW</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">
              Department of EEE
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The program in Electrical &amp; Electronics Engineering is one of the premier undergraduate programs offered by the Thamirabharani Engineering College. The EEE department has a team of highly qualified and experienced faculty. With its excellent infrastructure, the department places emphasis on sound practical knowledge, while nurturing creativity in the students. With Anna University's curriculum, the Department places equal emphasis on theoretical and experimental electrical and electronics engineering.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs text-center mt-auto">
            <div className="p-3.5 rounded-xl bg-background/85 border border-amber-500/20 hover:border-amber-500/50 transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-amber-500">
                Premier
              </div>
              <div className="text-slate-400 mt-1">UG Program</div>
            </div>
            <div className="p-3.5 rounded-xl bg-background/85 border border-amber-500/20 hover:border-emerald-400/50 transition-colors">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                Excellent
              </div>
              <div className="text-slate-400 mt-1">Infrastructure</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Symposium Legacy (Top Center) */}
      <div
        data-reveal
        className={cn(
          "transition-all duration-500 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{ transitionDelay: "1360ms" }}
      >
        <Card
          glowOnHover
          className="group relative space-y-4 flex flex-col justify-between border border-cyan rounded-[24px] shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80 bg-card/90 p-6 sm:p-8 max-w-4xl mx-auto text-center"
        >
          <HudCorners />
          <div>
            <div className="flex items-center justify-center space-x-2 text-primary font-mono text-sm mb-2">
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
          <div className="pt-4 border-t border-primary/10 flex items-center justify-center gap-4 text-xs font-mono text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> ISO Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-cyan" /> IEEE Supported
            </span>
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
        style={{ transitionDelay: "1400ms" }}
      >
        <Card className="group relative border border-cyan rounded-[24px] shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80 bg-card/90 p-6 sm:p-8">
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

        <Card className="group relative border border-cyan rounded-[24px] shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:border-cyan/80 bg-card/90 p-6 sm:p-8">
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
