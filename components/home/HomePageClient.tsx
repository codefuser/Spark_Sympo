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
import { Hero3DModel } from "@/components/home/Hero3DModel";

function ScheduleRow({ item, idx, isVisible, isReducedMotion }: { item: { time: string; title: string; venue: string }; idx: number; isVisible: boolean; isReducedMotion: boolean }) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4; // Subtle 4 deg max
    const rotateY = ((x - centerX) / centerX) * 4;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
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
        className="group/row relative p-4 rounded-xl bg-card border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group-hover/schedule:opacity-40 hover:!opacity-100"
        style={{
          transition: isHovered 
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, z-index 0s' 
            : 'transform 0.5s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, z-index 0.5s',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'translateZ(10px) translateY(-6px)' : 'translateZ(0px) translateY(0px)'}`,
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

function GlassmorphismTerminalCard({
  coord,
  index,
  isFaculty = false,
}: {
  coord: CoordinatorType;
  index: number;
  isFaculty?: boolean;
}) {
  return (
    <div className="relative group p-5 sm:p-6 bg-gradient-to-br from-[#031815]/95 via-[#010c0a]/95 to-[#062420]/95 backdrop-blur-2xl border-2 border-emerald-500/40 hover:border-emerald-300 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.18)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
      {/* Outer Corner HUD Chamfer Deco */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-xl pointer-events-none" />

      {/* Subdued Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

      {/* TOP HEADER ROW: Institution Branding & 3 Neon Dots */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 shadow-[0_0_8px_#10b981]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 uppercase leading-none">
              THAMIRABHARANI ENGG COLLEGE
            </div>
            <div className="text-[8px] font-mono text-emerald-400/70 uppercase tracking-wider mt-0.5">
              {isFaculty ? "FACULTY CONVENER BOARD" : "STUDENT EXECUTIVE COMMITTEE"}
            </div>
          </div>
        </div>

        {/* 3 Glowing Status Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="w-2 h-2 rounded-full bg-emerald-300/50" />
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* LEFT: HEARTBEAT SIGNAL RING AVATAR */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Outer Rotating Dash Circle */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin-slow pointer-events-none" />

            {/* SVG Horizontal Heartbeat ECG Spikes */}
            <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-emerald-400 pointer-events-none z-10" viewBox="0 0 140 140" fill="none">
              <circle cx="70" cy="70" r="52" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
              {/* Left ECG Wave */}
              <path d="M 2 70 L 16 70 L 22 54 L 28 86 L 34 70 L 44 70" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right ECG Wave */}
              <path d="M 96 70 L 106 70 L 112 54 L 118 86 L 124 70 L 138 70" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Center Avatar Lens */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#062420] via-[#020f0d] to-[#041a17] border-2 border-emerald-400/80 flex items-center justify-center text-emerald-300 font-mono text-2xl font-black shadow-[0_0_25px_rgba(16,185,129,0.45)] group-hover:scale-105 transition-transform overflow-hidden">
              {coord.avatar ? (
                <img src={coord.avatar} alt={coord.name} className="w-full h-full object-cover" />
              ) : (
                coord.name.charAt(0)
              )}
            </div>
          </div>

          {/* Subtitle Motto Below Avatar */}
          <div className="mt-2.5 text-[9px] font-mono tracking-[0.22em] text-center uppercase font-bold">
            <div className="text-emerald-400 drop-shadow-[0_0_6px_#10b981]">STAY CURIOUS</div>
            <div className="text-teal-300/80">STAY AHEAD</div>
          </div>
        </div>

        {/* RIGHT/CENTER: DETAILS & INFO LIST */}
        <div className="flex-1 space-y-2.5 w-full text-center sm:text-left">
          {/* Top Quote Box (Visible on SM+) */}
          <div className="hidden sm:flex flex-col items-end text-right text-[10px] font-mono text-emerald-300/70 italic float-right">
            <div>"Different Ideas</div>
            <div>Brighter Futures"</div>
            <div className="w-6 h-[1.5px] bg-emerald-400/60 mt-0.5" />
          </div>

          {/* Name & Role */}
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {coord.name}
            </h3>
            <p className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase mt-0.5">
              {coord.designation || (coord.role === "FACULTY" ? "FACULTY CONVENER" : "STUDENT LEAD")}
            </p>
          </div>

          {/* Key-Value Rows with Icons */}
          <div className="space-y-1.5 pt-1 text-xs font-mono text-slate-200">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{coord.department}</span>
            </div>

            <a
              href={`tel:${coord.phone}`}
              className="flex items-center justify-center sm:justify-start gap-2 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{coord.phone}</span>
            </a>

            <a
              href={`mailto:${coord.email}`}
              className="flex items-center justify-center sm:justify-start gap-2 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer truncate"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{coord.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: Barcode & RFID Sensor Icon */}
      <div className="relative z-10 pt-3 mt-4 border-t border-emerald-500/20 flex items-center justify-between gap-4">
        {/* Barcode Graphic */}
        <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
          {[4,2,6,3,1,5,2,4,2,6,1,3,5,2,4,3,2,6,1,3,2].map((h, i) => (
            <span
              key={i}
              className="bg-emerald-400 rounded-sm"
              style={{
                width: i % 3 === 0 ? "2.5px" : "1px",
                height: `${h * 3.5 + 8}px`,
              }}
            />
          ))}
        </div>

        {/* RFID Radar Lens */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest hidden sm:inline">
            VALID // 2K26
          </span>
          <div className="w-7 h-7 rounded-full border border-emerald-400/60 bg-emerald-950/80 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
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
      {/* SECTION 1: HERO (Unified Futuristic Sci-Fi Engineering Command Center) */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-4 sm:py-8 lg:py-10 overflow-hidden border-b border-blue-500/15">
        {/* Deep 3D Ambient Lighting Glow - Static & GPU optimized */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* LEFT COLUMN: All Core Symposium Information & Actions */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              {/* Top Department Badge - Cyber Chamfered Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#030917]/95 via-[#06142a]/95 to-[#030917]/95 border border-blue-500/40 text-xs font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(0,114,255,0.25)] hover:border-cyan-400 transition-all max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                </span>
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
                <span className="text-white font-semibold text-[11px] sm:text-xs">
                  Departments of <span className="text-cyan-300 font-bold">Electronics &amp; Communication</span> &amp; <span className="text-blue-300 font-bold">Electrical &amp; Electronics</span> Engineering
                </span>
              </div>

              {/* College Presents Line */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-cyan-400" />
                <p className="text-xs sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-[0.22em] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  {collegeName} Presents
                </p>
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-cyan-400" />
              </div>

              {/* Main Title: SPARKTRON 2K26 with Electric Glow */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-mono tracking-tight text-white uppercase select-none leading-none">
                  <span className="text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.35)]">SPARK</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_35px_rgba(0,180,255,0.75)] animate-sparktron-glow">
                    TRON
                  </span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 font-sans drop-shadow-[0_0_30px_rgba(0,114,255,0.6)]">
                    2K26
                  </span>
                </h1>

                {/* Tagline Description */}
                <p className="text-xs sm:text-sm md:text-base text-slate-200 font-normal max-w-xl leading-relaxed font-sans mx-auto lg:mx-0">
                  <span className="text-white font-semibold">Electrify Your Engineering Instincts.</span> A National-Level Technical Symposium featuring innovation, knowledge, circuit challenges, and engaging non-technical events.
                </p>
              </div>

              {/* Date and Venue HUD Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs font-mono pt-1">
                {/* Date Box */}
                <div className="relative group flex items-center space-x-2 bg-gradient-to-b from-[#060e1f]/95 via-[#030712]/95 to-[#010206] px-3.5 py-2 rounded-xl border border-blue-500/35 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-all">
                  <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                  <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
                  <span className="text-slate-400 font-medium">Date:</span>
                  <span className="text-white font-bold tracking-wide">{symposiumDate}</span>
                </div>

                {/* Venue Box */}
                <div className="relative group flex items-center space-x-2 bg-gradient-to-b from-[#060e1f]/95 via-[#030712]/95 to-[#010206] px-3.5 py-2 rounded-xl border border-blue-500/35 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-all">
                  <span className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                  <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
                  <span className="text-slate-400 font-medium">Venue:</span>
                  <span className="text-white font-bold tracking-wide truncate max-w-[240px] sm:max-w-none">{venue}</span>
                </div>
              </div>

              {/* 4-Unit Cyber Countdown Timer */}
              <div className="w-full flex justify-center lg:justify-start pt-1">
                <CountdownTimer targetDate="2026-09-16T09:00:00" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => openRegistrationModal()}
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-black font-black tracking-wider uppercase shadow-[0_0_25px_rgba(0,114,255,0.45)] cursor-pointer px-7 py-3 text-sm sm:text-base rounded-xl transition-all hover:scale-105 border border-cyan-300/40"
                >
                  Register Now
                </Button>
                <a href="#events" className="inline-flex">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-[#02050f]/90 text-white border-blue-500/40 hover:border-cyan-400 hover:bg-blue-950/40 hover:text-white px-7 py-3 text-sm sm:text-base rounded-xl transition-all shadow-[0_0_15px_rgba(0,114,255,0.15)] cursor-pointer hover:scale-105"
                  >
                    Explore Events
                  </Button>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: 3D Holographic Core & Telemetry Visuals */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-4 lg:mt-0">
              <Hero3DModel />

              {/* High-Tech Telemetry Chips below 3D Model */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px] sm:max-w-[380px] mt-2 font-mono text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-b from-[#060e1d]/90 to-[#020612]/95 border border-blue-500/30 shadow-[0_0_15px_rgba(0,114,255,0.12)]">
                  <Trophy className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_6px_#00f0ff]" />
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Prize Pool</div>
                    <div className="text-white font-bold text-xs">₹20,000+ Cash</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-b from-[#060e1d]/90 to-[#020612]/95 border border-blue-500/30 shadow-[0_0_15px_rgba(0,114,255,0.12)]">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_6px_#00f0ff]" />
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Entry Status</div>
                    <div className="text-cyan-300 font-bold text-xs">100% Free Entry</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS - 3D Cyber Vault Card (Black, Blue, White) */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="relative group text-center p-7 rounded-2xl bg-gradient-to-b from-[#060e1d]/95 via-[#030712]/95 to-[#010206] border border-blue-500/40 hover:border-cyan-400 shadow-[0_0_30px_rgba(0,114,255,0.25)] hover:shadow-[0_0_45px_rgba(0,240,255,0.45)] transition-all hover:-translate-y-1 overflow-hidden">
            <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            <Trophy className="w-12 h-12 text-cyan-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            <div className="text-4xl sm:text-5xl font-black font-mono text-white mb-1 tracking-tight drop-shadow-md">
              ₹20,000+
            </div>
            <div className="text-xs font-mono text-cyan-300 tracking-[0.25em] uppercase font-bold">
              TOTAL CASH PRIZES
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
          <div className="flex items-center space-x-2.5 text-emerald-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">
            <Shield className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />
            <span>Faculty Conveners</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent ml-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {facultyCoordinators.map((coord, idx) => (
              <GlassmorphismTerminalCard
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
          <div className="flex items-center space-x-2.5 text-emerald-400 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">
            <UserCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />
            <span>Student Executive Committee</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent ml-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studentCoordinators.map((coord, idx) => (
              <GlassmorphismTerminalCard
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
                    Department of ECE, Thamirabharani Engineering College, Thatchanallur, Tirunelveli - 627358, Tamil Nadu.
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
