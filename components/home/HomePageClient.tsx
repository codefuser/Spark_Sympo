"use client";

import React, { useState } from "react";
import {
  Cpu,
  Zap,
  Award,
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Target,
  Compass,
  BookOpen,
  FileText,
  Phone,
  Mail,
  GraduationCap,
  Shield,
  UserCheck,
  Radio,
  ExternalLink,
  Send,
  Gamepad2,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useRegistrationModal } from "@/components/registration/RegistrationModalContext";
import { SymposiumEvent, CoordinatorType } from "@/types";
import { AboutSection } from "@/components/home/AboutSection";
import { EventCard } from "@/components/home/EventCard";

function ScheduleRow({ item, idx, isVisible, isReducedMotion }: { item: { time: string; title: string; venue: string }; idx: number; isVisible: boolean; isReducedMotion: boolean }) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current || isReducedMotion) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4; // Subtle 4 deg max
    const rotateY = ((x - centerX) / centerX) * 4;
    
    rowRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px) translateY(-6px)`;
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rowRef.current) {
      rowRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)`;
    }
  };

  return (
    <div
      style={{
        opacity: isVisible || isReducedMotion ? 1 : 0,
        transform: isVisible || isReducedMotion ? "translateY(0)" : "translateY(20px)",
        transition: isReducedMotion ? "none" : `opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${idx * 0.8}s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${idx * 0.8}s`
      }}
    >
      <div
        ref={rowRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group/row relative p-4 rounded-xl bg-card border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group-hover/schedule:opacity-40 hover:!opacity-100 will-change-transform"
        style={{
          transition: isHovered 
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, z-index 0s' 
            : 'transform 0.5s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, z-index 0.5s',
          transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) ${isHovered ? 'translateZ(10px) translateY(-6px)' : 'translateZ(0px) translateY(0px)'}`,
          transformStyle: 'preserve-3d',
          borderColor: isHovered ? 'rgba(0, 240, 255, 0.6)' : '',
          boxShadow: isHovered ? '0 20px 40px -10px rgba(0,240,255,0.2), 0 0 15px rgba(0,240,255,0.1)' : '',
          zIndex: isHovered ? 10 : 1,
        }}
      >
      {/* Surface Gradient */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/60 to-transparent pointer-events-none transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
      
      <div 
        className="relative z-10 flex items-center space-x-3 text-primary text-sm font-bold shrink-0 transition-all duration-300"
        style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)', color: isHovered ? '#00F0FF' : '' }}
      >
        <Clock className="w-4 h-4 transition-colors duration-300" style={{ color: isHovered ? '#FFFFFF' : '#00F0FF' }} />
        <span style={{ textShadow: isHovered ? '0 0 8px rgba(0,240,255,0.4)' : 'none' }}>{item.time}</span>
      </div>
      <div 
        className="relative z-10 flex-1 transition-transform duration-300"
        style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)' }}
      >
        <h4 className="font-bold text-white text-sm font-sans tracking-wide drop-shadow-md">{item.title}</h4>
      </div>
      <div 
        className="relative z-10 text-xs text-slate-400 bg-background px-3 py-1 rounded-lg border border-primary/10 shrink-0 transition-all duration-300"
        style={{ 
          transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
          borderColor: isHovered ? 'rgba(0,240,255,0.4)' : '',
          color: isHovered ? '#00F0FF' : '',
          boxShadow: isHovered ? '0 0 15px rgba(0,240,255,0.15)' : ''
        }}
      >
        {item.venue}
      </div>
      </div>
    </div>
  );
}

function CompactCyberCard({
  coord,
  index,
  isFaculty = false,
}: {
  coord: CoordinatorType;
  index: number;
  isFaculty?: boolean;
}) {
  return (
    <div className="relative group p-4 sm:p-5 bg-gradient-to-r from-[#12151c]/95 via-[#0b0d12]/95 to-[#161a24]/95 backdrop-blur-xl border border-amber-400/50 hover:border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.18)] hover:shadow-[0_0_35px_rgba(245,158,11,0.35)] transition-all duration-300 hover:-translate-y-1 [clip-path:polygon(16px_0,_100%_0,_100%_calc(100%-16px),_calc(100%-16px)_100%,_0_100%,_0_16px)] flex flex-col justify-between space-y-3">
      {/* HUD Corner Tech Accent Ticks */}
      <span className="absolute top-0 left-0 w-4 h-[2px] bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
      <span className="absolute top-0 left-0 w-[2px] h-4 bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
      <span className="absolute bottom-0 right-0 w-4 h-[2px] bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
      <span className="absolute bottom-0 right-0 w-[2px] h-4 bg-amber-400 shadow-[0_0_6px_#f59e0b]" />

      {/* Subdued Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b0a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b0a_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

      {/* TOP ROW: Header Info & System Badge */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono font-bold uppercase text-amber-300 tracking-wider shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              {coord.department}
            </span>
            <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest">
              {isFaculty ? `FAC.ID // 0${index + 1}` : `EXEC.ID // 0${index + 1}`}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white font-sans tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-sm">
            {coord.name}
          </h3>

          {coord.designation && (
            <p className="text-xs font-mono font-semibold text-amber-400 tracking-wide">
              {coord.designation}
            </p>
          )}
        </div>

        {/* Small Cyber System Tag (No Photo) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#07080c] border border-amber-500/30 text-[9px] font-mono font-bold text-amber-400/90 uppercase shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]" />
          <span>{isFaculty ? "CONVENER" : "STUDENT LEAD"}</span>
        </div>
      </div>

      {/* BOTTOM ROW: Interactive Contact Action Chips */}
      <div className="relative z-10 pt-2.5 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <a
          href={`tel:${coord.phone}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07080d] border border-amber-500/30 text-slate-200 hover:text-white hover:border-amber-400 hover:bg-amber-950/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{coord.phone}</span>
        </a>

        <a
          href={`mailto:${coord.email}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07080d] border border-amber-500/30 text-slate-200 hover:text-white hover:border-amber-400 hover:bg-amber-950/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all truncate max-w-[220px] sm:max-w-none cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{coord.email}</span>
        </a>
      </div>
    </div>
  );
}

interface HomePageClientProps {
  events: SymposiumEvent[];
  facultyCoordinators: CoordinatorType[];
  studentCoordinators: CoordinatorType[];
  announcements: any[];
  schedule: { time: string; title: string; venue: string }[];
  symposiumDate: string;
  collegeName: string;
  venue: string;
}



export function HomePageClient({
  events,
  facultyCoordinators,
  studentCoordinators,
  announcements,
  schedule,
  symposiumDate,
  collegeName,
  venue,
}: HomePageClientProps) {
  const { openRegistrationModal } = useRegistrationModal();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedEventDetail, setSelectedEventDetail] = useState<SymposiumEvent | null>(null);

  const scheduleRef = React.useRef<HTMLDivElement>(null);
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  React.useEffect(() => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      setIsScheduleVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsScheduleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (scheduleRef.current) {
      observer.observe(scheduleRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Contact Form state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Filter out any workshop events so only the 5 featured symposium events exist
  const validEvents = events.filter(
    (e) => e.category !== "WORKSHOP" && e.slug !== "iot-workshop"
  );

  const filteredEvents = activeCategory === "ALL"
    ? validEvents
    : validEvents.filter((e) => e.category === activeCategory);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim() || !contactMessage.trim()) {
      showToast("Validation Error", "Please fill in all required contact fields (Name, Phone, Email, Message)", "error");
      return;
    }
    setSubmittingContact(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          subject: contactSubject || "Symposium Inquiry",
          message: contactMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContactSuccess(true);
        showToast("Message Sent!", "Our team will contact you shortly", "success");
        setContactName("");
        setContactPhone("");
        setContactEmail("");
        setContactSubject("");
        setContactMessage("");
      } else {
        showToast("Error", data.message || "Failed to send message", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to submit message", "error");
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <div className="space-y-24 pb-20 pt-20">
      {/* SECTION 1: HERO (Matching Reference Image 1) */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-start items-center pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 overflow-hidden border-b border-blue-500/15">
        {/* Deep 3D Ambient Lighting Glow - Static & GPU optimized */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Glowing Cyan Circuit Traces Background (Matching Image 1) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-70">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Top Left Circuit Traces */}
            <path d="M 0 140 L 180 140 L 260 60 L 440 60" stroke="#00f0ff" strokeWidth="1.75" opacity="0.65" />
            <circle cx="440" cy="60" r="3.5" fill="#00f0ff" />
            <path d="M 80 0 L 80 100 L 160 180 L 160 300 L 240 380" stroke="#00f0ff" strokeWidth="1.75" opacity="0.55" />
            <circle cx="240" cy="380" r="3.5" fill="#00f0ff" />
            <path d="M 0 260 L 100 260 L 140 220 L 220 220" stroke="#00f0ff" strokeWidth="1.5" opacity="0.45" />
            <circle cx="220" cy="220" r="3" fill="#00f0ff" />

            {/* Top Right Circuit Traces */}
            <path d="M 1440 100 L 1260 100 L 1180 180 L 1020 180" stroke="#00f0ff" strokeWidth="1.75" opacity="0.65" />
            <circle cx="1020" cy="180" r="3.5" fill="#00f0ff" />
            <path d="M 1360 0 L 1360 80 L 1280 160 L 1280 260" stroke="#00f0ff" strokeWidth="1.75" opacity="0.5" />
            <circle cx="1280" cy="260" r="3.5" fill="#00f0ff" />
            <path d="M 1440 220 L 1340 220 L 1280 280 L 1120 280" stroke="#00f0ff" strokeWidth="1.5" opacity="0.45" />
            <circle cx="1120" cy="280" r="3" fill="#00f0ff" />

            {/* Mid Left Circuit Traces */}
            <path d="M 0 460 L 140 460 L 220 540 L 360 540" stroke="#00f0ff" strokeWidth="1.75" opacity="0.6" />
            <circle cx="360" cy="540" r="3.5" fill="#00f0ff" />
            <path d="M 40 360 L 120 360 L 180 420 L 280 420" stroke="#00f0ff" strokeWidth="1.5" opacity="0.45" />
            <circle cx="280" cy="420" r="3" fill="#00f0ff" />

            {/* Mid Right Circuit Traces */}
            <path d="M 1440 480 L 1300 480 L 1220 400 L 1080 400" stroke="#00f0ff" strokeWidth="1.75" opacity="0.6" />
            <circle cx="1080" cy="400" r="3.5" fill="#00f0ff" />
            <path d="M 1400 580 L 1320 580 L 1260 520 L 1160 520" stroke="#00f0ff" strokeWidth="1.5" opacity="0.45" />
            <circle cx="1160" cy="520" r="3" fill="#00f0ff" />

            {/* Bottom Left Circuit Traces */}
            <path d="M 0 720 L 160 720 L 240 640 L 400 640" stroke="#00f0ff" strokeWidth="1.75" opacity="0.55" />
            <circle cx="400" cy="640" r="3.5" fill="#00f0ff" />
            <path d="M 100 900 L 100 800 L 180 720 L 320 720" stroke="#00f0ff" strokeWidth="1.75" opacity="0.5" />
            <circle cx="320" cy="720" r="3.5" fill="#00f0ff" />

            {/* Bottom Right Circuit Traces */}
            <path d="M 1440 760 L 1280 760 L 1200 840 L 1060 840" stroke="#00f0ff" strokeWidth="1.75" opacity="0.55" />
            <circle cx="1060" cy="840" r="3.5" fill="#00f0ff" />
            <path d="M 1340 900 L 1340 820 L 1260 740 L 1120 740" stroke="#00f0ff" strokeWidth="1.75" opacity="0.5" />
            <circle cx="1120" cy="740" r="3.5" fill="#00f0ff" />
          </svg>
        </div>

        {/* Floating Cyber Particle Accents */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-cyan-400/60 blur-[1px] animate-cyber-particle-1 pointer-events-none hidden md:block" />
        <div className="absolute top-1/3 right-1/6 w-2.5 h-2.5 rounded-full bg-blue-400/60 blur-[1px] animate-cyber-particle-2 pointer-events-none hidden md:block" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-300/60 blur-[1px] animate-cyber-particle-3 pointer-events-none hidden md:block" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-white/60 blur-[1px] animate-cyber-particle-1 pointer-events-none hidden md:block" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
          {/* CENTERED HERO MASTER DECK */}
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
            {/* 1. College Name & [AN AUTONOMOUS INSTITUTION] - Elevated Above with Unique Syne Typography */}
            <div className="space-y-2 pt-1 sm:pt-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-syne tracking-wider text-white uppercase drop-shadow-[0_2px_20px_rgba(255,255,255,0.35)] leading-tight">
                <span className="text-white">THAMIRABHARANI</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white drop-shadow-[0_0_20px_rgba(0,240,255,0.45)]">
                  ENGINEERING COLLEGE
                </span>
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/40 text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-cyan-300 uppercase shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>[ AN AUTONOMOUS INSTITUTION ]</span>
              </div>
            </div>

            {/* 2. Organized By & Departments (Full official title requested by user) */}
            <div className="space-y-2.5 pt-1 sm:pt-2 max-w-4xl mx-auto">
              <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] text-cyan-400/90 uppercase">
                ORGANIZED BY
              </p>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-orbitron font-extrabold tracking-wider uppercase text-slate-100 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-center leading-relaxed">
                  <span className="text-slate-300 font-bold">DEPARTMENT OF</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.7)] font-black">
                    ELECTRONICS AND COMMUNICATION
                  </span>
                  <span className="text-cyan-400 font-black px-0.5">&amp;</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 drop-shadow-[0_0_12px_rgba(0,114,255,0.7)] font-black">
                    ELECTRICAL AND ELECTRONICS ENGINEERING
                  </span>
                </h2>
              </div>
            </div>

            {/* 3. National Level Technical Symposium Pill */}
            <div className="pt-0.5">
              <div className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-2 rounded-xl border border-cyan-500/50 bg-[#040e22]/90 text-cyan-300 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase font-bold shadow-[0_0_25px_rgba(0,240,255,0.25)]">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>NATIONAL LEVEL TECHNICAL SYMPOSIUM</span>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* 4. Grand Main Title: SPARKTRON'2K26 with Orbitron Typography */}
            <div className="py-2 sm:py-3 relative group">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic font-orbitron tracking-tight uppercase select-none leading-none">
                <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.6)]">SPARK</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.9)]">TRON</span>
                <span className="text-cyan-400 drop-shadow-[0_0_40px_rgba(0,240,255,0.95)] animate-sparktron-glow">'2K26</span>
              </h2>
              {/* Electric Circuit Underline Accent */}
              <div className="flex items-center justify-center gap-2 pt-3 max-w-sm mx-auto opacity-80">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-cyan-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-transparent" />
              </div>
            </div>

            {/* 5. Date & Venue */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#030917]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-orbitron font-bold tracking-[0.25em] text-slate-200 uppercase">
                  {symposiumDate || "SEPTEMBER 16, 2026"}
                </span>
              </div>
              <br />
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono text-slate-300 bg-[#030917]/70 px-4 py-1.5 rounded-full border border-blue-500/25">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{venue}</span>
              </div>
            </div>

            {/* 6. 4-Unit Cyber Countdown Timer */}
            <div className="w-full flex justify-center pt-1">
              <CountdownTimer targetDate="2026-09-16T09:00:00" />
            </div>

            {/* 7. Action Buttons: REGISTER NOW & VIEW EVENTS */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => openRegistrationModal()}
                className="bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 hover:from-cyan-300 hover:to-sky-400 text-black font-black font-orbitron tracking-wider uppercase px-8 py-3.5 text-sm sm:text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.75)] transition-all hover:scale-105 border-0 cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>REGISTER NOW</span>
              </Button>
              <a href="#events" className="inline-flex">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[#02050f]/90 text-cyan-400 border border-cyan-400/80 hover:bg-cyan-500/15 hover:border-cyan-300 hover:text-white px-8 py-3.5 text-sm sm:text-base font-orbitron tracking-wider rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>EXPLORE EVENTS</span>
                </Button>
              </a>
            </div>

            {/* 8. Telemetry Status Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#060e1d]/80 border border-blue-500/30 text-slate-300">
                <Trophy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Prize Pool: <strong className="text-white font-bold">₹20,000+ Cash</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#060e1d]/80 border border-blue-500/30 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Entry: <strong className="text-cyan-300 font-bold">100% Free Entry</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#060e1d]/80 border border-blue-500/30 text-slate-300">
                <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Certification: <strong className="text-white font-bold">All Participants</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS - High-Tech Cyber Vault Cards */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Card 1: Prize Pool */}
          <div className="relative group text-center p-6 rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/40 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,114,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all hover:-translate-y-1 overflow-hidden">
            <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            <Trophy className="w-9 h-9 text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
            <div className="text-3xl sm:text-4xl font-black font-orbitron text-white mb-1 tracking-tight drop-shadow-md">
              ₹20,000+
            </div>
            <div className="text-[11px] font-mono text-cyan-300 tracking-[0.2em] uppercase font-bold">
              TOTAL CASH PRIZES
            </div>
          </div>

          {/* Card 2: Free Registration */}
          <div className="relative group text-center p-6 rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/40 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,114,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all hover:-translate-y-1 overflow-hidden">
            <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            <ShieldCheck className="w-9 h-9 text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
            <div className="text-3xl sm:text-4xl font-black font-orbitron text-white mb-1 tracking-tight drop-shadow-md">
              ₹0 FREE
            </div>
            <div className="text-[11px] font-mono text-cyan-300 tracking-[0.2em] uppercase font-bold">
              REGISTRATION &amp; ENTRY
            </div>
          </div>

          {/* Card 3: Events Catalog */}
          <div className="relative group text-center p-6 rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/40 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,114,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all hover:-translate-y-1 overflow-hidden">
            <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            <Cpu className="w-9 h-9 text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
            <div className="text-3xl sm:text-4xl font-black font-orbitron text-white mb-1 tracking-tight drop-shadow-md">
              {validEvents.length} TRACKS
            </div>
            <div className="text-[11px] font-mono text-cyan-300 tracking-[0.2em] uppercase font-bold">
              TECH &amp; NON-TECH ARENAS
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <AboutSection />

      {/* SECTION 3: SYMPOSIUM HUB */}
      <section id="symposium" className="container mx-auto px-4 sm:px-6 space-y-16 relative">
        <SectionHeading
          badge="SCHEDULE & GUIDELINES"
          title="Symposium Master Schedule"
          description="Everything you need to know about timings, venue rules, and announcements."
          className="animate-[fade-in-up_0.8s_ease-out_both] [&>div:last-child]:animate-[scale-x_0.8s_ease-out_0.4s_both] [&>div:last-child]:origin-center"
        />

        {/* Master Schedule */}
        <div ref={scheduleRef} className="group/schedule max-w-3xl mx-auto space-y-3 font-mono relative">
          {/* Subtle Vertical Timeline */}
          <div className="absolute left-0 sm:-left-6 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-cyan/30 to-transparent hidden sm:block animate-[fade-in-up_1s_ease-out_both_0.4s]" />

          {schedule.map((item, idx) => (
            <ScheduleRow key={idx} item={item} idx={idx} isVisible={isScheduleVisible} isReducedMotion={isReducedMotion} />
          ))}
        </div>
      </section>

      {/* SECTION 4: EVENTS CATALOG (Black, Blue, White Sci-Fi Theme) */}
      <section id="events" className="relative container mx-auto px-4 sm:px-6 space-y-12 py-6">
        {/* Ambient Cyber Blue Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-cyan-400 text-[11px] font-mono tracking-[0.2em] uppercase font-bold shadow-[0_0_15px_rgba(0,114,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
            <span>SYSTEM // LIVE TRACKS CATALOG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
            SPARKTRON 2K26{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-500 drop-shadow-[0_0_20px_rgba(0,114,255,0.5)]">
              EVENTS CATALOG
            </span>
          </h2>

          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full mx-auto shadow-[0_0_12px_#00f0ff]" />

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
            Click any event card to view full rules, guidelines, round specifications, and instant registration.
          </p>
        </div>

        {/* Category Filters in Black, Blue & White */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto font-mono">
          {[
            { label: "ALL TRACKS", value: "ALL", count: validEvents.length },
            { label: "TECHNICAL", value: "TECHNICAL", count: validEvents.filter(e => e.category === "TECHNICAL").length },
            { label: "NON-TECHNICAL", value: "NON_TECHNICAL", count: validEvents.filter(e => e.category === "NON_TECHNICAL").length },
          ].map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`relative group px-5 sm:px-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-300 border cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? "bg-blue-950/80 text-white border-blue-400 shadow-[0_0_25px_rgba(0,114,255,0.45)] ring-1 ring-blue-400/50"
                    : "bg-[#02050f]/80 text-slate-300 border-blue-500/20 hover:border-blue-400/50 hover:text-white hover:bg-blue-950/30"
                }`}
              >
                {/* Active Indicator dot */}
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                      : "bg-slate-500 group-hover:bg-blue-400"
                  }`}
                />
                <span className="tracking-wider">{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? "bg-blue-500/30 text-cyan-300 border border-blue-400/40"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {cat.count}
                </span>

                {/* Cyber Corner tick marks on active */}
                {isActive && (
                  <>
                    <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                    <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Events Grid - Centered 5-box alignment */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-7xl mx-auto">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={(evt) => setSelectedEventDetail(evt)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 5: COORDINATORS */}
      <section id="coordinators" className="container mx-auto px-4 sm:px-6 space-y-12 py-6">
        <SectionHeading
          badge="THE TEAM"
          title="Symposium Coordinators & Conveners"
          description="Our dedicated faculty conveners and student leads for queries."
        />

        {/* Faculty Conveners */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2.5 text-amber-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">
            <Shield className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />
            <span>Faculty Conveners</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/40 to-transparent ml-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyCoordinators.map((coord, idx) => (
              <CompactCyberCard
                key={coord.id}
                coord={coord}
                index={idx}
                isFaculty={true}
              />
            ))}
          </div>
        </div>

        {/* Student Executive Committee */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-2.5 text-amber-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">
            <UserCheck className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />
            <span>Student Executive Committee</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/40 to-transparent ml-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentCoordinators.map((coord, idx) => (
              <CompactCyberCard
                key={coord.id}
                coord={coord}
                index={idx}
                isFaculty={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTACT */}
      <section id="contact" className="container mx-auto px-4 sm:px-6 space-y-12 max-w-5xl">
        <SectionHeading
          badge="GET IN TOUCH"
          title="Contact Organizing Desk"
          description="Drop us a message below for queries regarding rules, campus routes, or accommodation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="space-y-6">
            <h3 className="text-xl font-bold text-white font-mono">Symposium Help Desk</h3>

            <div className="space-y-4 text-sm font-mono">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Venue Address</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Department of ECE &amp; Department of EEE, Thamirabharani Engineering College, Thatchanallur, Tirunelveli - 627358, Tamil Nadu.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Official Email</p>
                  <p className="text-slate-400 text-xs mt-0.5">sparktron2026@college.edu</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Helpline Numbers</p>
                  <p className="text-slate-400 text-xs mt-0.5">+91 98401 23456 / +91 98765 43210</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white font-mono">Send an Inquiry Message</h3>

            {contactSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Logged</h4>
                <p className="text-xs text-slate-300">Our team will get back to you shortly.</p>
                <Button size="sm" variant="outline" onClick={() => setContactSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    placeholder="Full Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <Input
                    label="Phone Number *"
                    placeholder="e.g. 9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <Input
                  label="Registered / Contact Email *"
                  type="email"
                  placeholder="e.g. student@gmail.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <Input
                  label="Inquiry Subject"
                  placeholder="e.g. Paper presentation guidelines or Spot Registration"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-slate-400 uppercase">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg bg-background border border-primary/20 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
                    placeholder="Type your query here..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={submittingContact}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* EVENT DETAIL RULES MODAL (Black, Blue, White Theme) */}
      {selectedEventDetail && (
        <Modal
          isOpen={!!selectedEventDetail}
          onClose={() => setSelectedEventDetail(null)}
          title={selectedEventDetail.title}
          description={`${selectedEventDetail.category === "TECHNICAL" ? "Technical Track" : "Non-Technical Track"} • ${selectedEventDetail.teamSize}`}
          maxWidth="lg"
        >
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-xs font-mono text-cyan-400 uppercase font-bold mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
                Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{selectedEventDetail.fullDesc}</p>
            </div>

            <div className="pt-2 border-t border-blue-500/20">
              <h4 className="text-xs font-mono text-blue-400 uppercase font-bold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                Rules & Guidelines
              </h4>
              <div className="space-y-2 text-xs text-slate-200 font-mono">
                {selectedEventDetail.rules.split("\n").map((r, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">›</span>
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono pt-3 border-t border-blue-500/20 bg-[#020714] p-3.5 rounded-xl border border-blue-500/30">
              <div><span className="text-slate-400">Rounds:</span> <span className="text-white font-bold ml-1">{selectedEventDetail.rounds}</span></div>
              <div><span className="text-slate-400">Venue:</span> <span className="text-cyan-300 font-semibold ml-1">{selectedEventDetail.venue}</span></div>
              <div><span className="text-slate-400">Coordinator:</span> <span className="text-white font-medium ml-1">{selectedEventDetail.coordinatorName}</span></div>
              <div><span className="text-slate-400">Phone:</span> <span className="text-cyan-400 font-mono ml-1">{selectedEventDetail.coordinatorPhone}</span></div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setSelectedEventDetail(null)}
                className="text-slate-300 hover:text-white border border-white/10 hover:border-blue-400/40 cursor-pointer"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const id = selectedEventDetail.id;
                  setSelectedEventDetail(null);
                  openRegistrationModal(id);
                }}
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(0,114,255,0.4)] cursor-pointer"
              >
                Register For Event →
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
