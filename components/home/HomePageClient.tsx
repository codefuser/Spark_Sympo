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
  HelpCircle,
  FileText,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Shield,
  UserCheck,
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
import { SymposiumEvent, CoordinatorType, SponsorType } from "@/types";
import { AboutSection } from "@/components/home/AboutSection";
import { EventCard } from "@/components/home/EventCard";
import { Hero3DModel } from "@/components/home/Hero3DModel";

interface HomePageClientProps {
  events: SymposiumEvent[];
  sponsors: SponsorType[];
  facultyCoordinators: CoordinatorType[];
  studentCoordinators: CoordinatorType[];
  announcements: any[];
  schedule: { time: string; title: string; venue: string }[];
  faqs: { q: string; a: string }[];
  symposiumDate: string;
  collegeName: string;
  venue: string;
}



export function HomePageClient({
  events,
  sponsors,
  facultyCoordinators,
  studentCoordinators,
  announcements,
  schedule,
  faqs,
  symposiumDate,
  collegeName,
  venue,
}: HomePageClientProps) {
  const { openRegistrationModal } = useRegistrationModal();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedEventDetail, setSelectedEventDetail] = useState<SymposiumEvent | null>(null);

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
      {/* SECTION 1: HERO (3D Futuristic Sci-Fi Engineering Model Theme) */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-6 sm:py-12 md:py-16 overflow-hidden border-b border-blue-500/15">
        {/* Deep 3D Ambient Lighting Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-600/12 rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8 my-auto max-w-5xl">
          {/* Top Department Badge - 3D Cyber Chamfered Pill */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#030917]/95 via-[#06142a]/95 to-[#030917]/95 border border-blue-500/40 text-xs sm:text-sm font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(0,114,255,0.25)] hover:border-cyan-400 transition-all max-w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            </span>
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
            <span className="text-white font-semibold">
              Departments of <span className="text-cyan-300 font-bold">Electronics &amp; Communication</span> &amp; <span className="text-blue-300 font-bold">Electrical &amp; Electronics</span> Engineering
            </span>
          </div>

          {/* College Presents line */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-cyan-400" />
            <p className="text-xs sm:text-sm md:text-base font-mono font-bold text-cyan-300 uppercase tracking-[0.25em] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              {collegeName} Presents
            </p>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          {/* 3D Interactive Holographic Model Centerpiece */}
          <div className="py-1">
            <Hero3DModel />
          </div>

          {/* Main Title: SPARKTRON 2K26 */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-mono tracking-tight text-white uppercase select-none">
              <span className="text-white drop-shadow-[0_4px_16px_rgba(255,255,255,0.35)]">SPARK</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_35px_rgba(0,180,255,0.75)]">
                TRON
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 font-sans drop-shadow-[0_0_30px_rgba(0,114,255,0.6)]">
                2K26
              </span>
            </h1>

            {/* Tagline Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed font-sans">
              <span className="text-white font-semibold">Electrify Your Engineering Instincts.</span> The National Level Technical Symposium standardizing innovation, circuit synthesis, and robotics.
            </p>
          </div>

          {/* Date and Venue 3D HUD Boxes */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono pt-2">
            {/* Date Box */}
            <div className="relative group flex items-center space-x-2.5 bg-gradient-to-b from-[#060e1f]/95 via-[#030712]/95 to-[#010206] px-5 py-3 rounded-2xl border border-blue-500/35 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,114,255,0.18)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all hover:-translate-y-1">
              <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
              <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
              <span className="text-slate-400 font-medium">Date:</span>
              <span className="text-white font-bold tracking-wide">{symposiumDate}</span>
            </div>

            {/* Venue Box */}
            <div className="relative group flex items-center space-x-2.5 bg-gradient-to-b from-[#060e1f]/95 via-[#030712]/95 to-[#010206] px-5 py-3 rounded-2xl border border-blue-500/35 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,114,255,0.18)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all hover:-translate-y-1">
              <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
              <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_#00f0ff]" />
              <span className="text-slate-400 font-medium">Venue:</span>
              <span className="text-white font-bold tracking-wide">{venue}</span>
            </div>
          </div>

          {/* 4 3D Countdown Timer Boxes */}
          <CountdownTimer targetDate="2026-09-16T09:00:00" />

          {/* 3D Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => openRegistrationModal()}
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-black font-black tracking-wider uppercase shadow-[0_0_30px_rgba(0,114,255,0.5)] cursor-pointer px-9 py-4 text-base rounded-2xl transition-all hover:scale-105 border border-cyan-300/40"
            >
              Register Now
            </Button>
            <a href="#events" className="inline-flex">
              <Button
                size="lg"
                variant="outline"
                className="bg-[#02050f]/90 text-white border-blue-500/40 hover:border-cyan-400 hover:bg-blue-950/40 hover:text-white px-9 py-4 text-base rounded-2xl transition-all shadow-[0_0_20px_rgba(0,114,255,0.18)] cursor-pointer hover:scale-105"
              >
                Explore Events
              </Button>
            </a>
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
      <section id="symposium" className="container mx-auto px-4 sm:px-6 space-y-16">
        <SectionHeading
          badge="SCHEDULE & GUIDELINES"
          title="Symposium Master Schedule"
          description="Everything you need to know about timings, venue rules, and announcements."
        />

        {/* Master Schedule */}
        <div className="max-w-3xl mx-auto space-y-3 font-mono">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-card border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center space-x-3 text-primary text-sm font-bold shrink-0">
                <Clock className="w-4 h-4 text-cyan" />
                <span>{item.time}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm font-sans">{item.title}</h4>
              </div>
              <div className="text-xs text-slate-400 bg-background px-3 py-1 rounded-lg border border-primary/10 shrink-0">
                {item.venue}
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center">
            <Badge variant="cyan" size="md">FAQ</Badge>
            <h3 className="text-2xl font-bold text-white mt-2">Frequently Asked Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" /> {faq.q}
                </h4>
                <p className="text-xs text-secondary-foreground mt-2 pl-6">{faq.a}</p>
              </Card>
            ))}
          </div>
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
      <section id="coordinators" className="container mx-auto px-4 sm:px-6 space-y-16">
        <SectionHeading
          badge="THE TEAM"
          title="Symposium Coordinators & Conveners"
          description="Our dedicated faculty conveners and student leads for queries."
        />

        {/* Faculty */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-primary font-mono text-sm uppercase tracking-widest font-bold">
            <Shield className="w-4 h-4" />
            <span>Faculty Conveners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyCoordinators.map((coord) => (
              <Card key={coord.id} glowOnHover className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-mono text-2xl font-bold flex items-center justify-center shrink-0">
                  {coord.name.charAt(0)}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <Badge variant="primary">{coord.department}</Badge>
                  <h3 className="text-lg font-bold text-white font-sans">{coord.name}</h3>
                  <p className="text-cyan font-semibold">{coord.designation}</p>
                  <div className="pt-2 flex flex-wrap gap-4 text-slate-300">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {coord.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan" /> {coord.email}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Students */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-cyan font-mono text-sm uppercase tracking-widest font-bold">
            <UserCheck className="w-4 h-4" />
            <span>Student Executive Committee</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCoordinators.map((coord) => (
              <Card key={coord.id} glowOnHover className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-mono text-2xl font-bold flex items-center justify-center mx-auto shadow-cyan-glow">
                  {coord.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{coord.name}</h3>
                  <p className="text-xs font-mono text-primary mt-0.5">{coord.designation}</p>
                  <p className="text-xs font-mono text-slate-400 mt-1">{coord.department}</p>
                </div>
                <div className="pt-2 border-t border-primary/10 flex justify-center items-center gap-2 text-xs font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{coord.phone}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SPONSORS */}
      <section id="sponsors" className="container mx-auto px-4 sm:px-6 space-y-12">
        <SectionHeading
          badge="SPONSORS & PARTNERS"
          title="Sponsored By Industry Leaders"
          description="SPARKTRON 2K26 is backed by global technology leaders and academic organizations."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-card/40 border border-primary/15 font-mono text-center hover:border-primary/40 transition-colors"
            >
              <Building2 className="w-8 h-8 text-primary mb-2" />
              <span className="text-white font-bold text-sm">{sponsor.name}</span>
              <span className="text-[10px] text-cyan uppercase tracking-wider mt-1">{sponsor.tier} PARTNER</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: CONTACT */}
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
