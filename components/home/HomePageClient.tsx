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

function getEventTheme(slug: string, category: string) {
  if (slug === "paper-presentation") {
    return {
      icon: FileText,
      iconColor: "text-cyan-400",
      iconBoxStyle: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]",
      cardBorder: "border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]",
      topGradient: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
      badgeStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      dotColor: "bg-cyan-400",
      cornerColor: "border-cyan-400/30 group-hover:border-cyan-400",
      glowColor: "#00f0ff",
      buttonStyle: "bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
    };
  }
  if (slug === "technical-quiz") {
    return {
      icon: Zap,
      iconColor: "text-sky-400",
      iconBoxStyle: "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]",
      cardBorder: "border-sky-500/25 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]",
      topGradient: "linear-gradient(90deg, transparent, #38bdf8, transparent)",
      badgeStyle: "bg-sky-500/10 text-sky-300 border-sky-500/30",
      dotColor: "bg-sky-400",
      cornerColor: "border-sky-400/30 group-hover:border-sky-400",
      glowColor: "#38bdf8",
      buttonStyle: "bg-sky-500/10 hover:bg-sky-500/25 text-sky-300 border-sky-500/30 hover:border-sky-400 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]",
    };
  }
  if (slug === "circuit-debugging") {
    return {
      icon: Cpu,
      iconColor: "text-emerald-400",
      iconBoxStyle: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]",
      cardBorder: "border-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]",
      topGradient: "linear-gradient(90deg, transparent, #34d399, transparent)",
      badgeStyle: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      dotColor: "bg-emerald-400",
      cornerColor: "border-emerald-400/30 group-hover:border-emerald-400",
      glowColor: "#34d399",
      buttonStyle: "bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    };
  }
  if (slug === "rythemania") {
    return {
      icon: Music,
      iconColor: "text-pink-400",
      iconBoxStyle: "bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
      cardBorder: "border-pink-500/25 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
      topGradient: "linear-gradient(90deg, transparent, #f43f5e, transparent)",
      badgeStyle: "bg-pink-500/10 text-pink-300 border-pink-500/30",
      dotColor: "bg-pink-400",
      cornerColor: "border-pink-400/30 group-hover:border-pink-400",
      glowColor: "#f43f5e",
      buttonStyle: "bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30 hover:border-pink-400 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    };
  }
  // e-sports
  return {
    icon: Gamepad2,
    iconColor: "text-purple-400",
    iconBoxStyle: "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    cardBorder: "border-purple-500/25 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    topGradient: "linear-gradient(90deg, transparent, #a855f7, transparent)",
    badgeStyle: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    dotColor: "bg-purple-400",
    cornerColor: "border-purple-400/30 group-hover:border-purple-400",
    glowColor: "#a855f7",
    buttonStyle: "bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border-purple-500/30 hover:border-purple-400 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  };
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
      {/* SECTION 1: HERO */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-6 sm:py-12 md:py-16 overflow-hidden border-b border-primary/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8 my-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono tracking-widest uppercase shadow-glow animate-pulse">
            <Zap className="w-4 h-4 text-primary" />
            <span>Department of Electronics & Communication Engineering</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <p className="text-sm sm:text-base font-mono text-cyan uppercase tracking-widest">
              {collegeName} Presents
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-mono tracking-tight text-white uppercase">
              SPARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan to-cyan-glow">TRON</span>{" "}
              <span className="text-primary font-sans">2K26</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Electrify Your Engineering Instincts. The National Level Technical Symposium standardizing innovation, circuit synthesis, and robotics.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-slate-300">
            <div className="flex items-center space-x-2 bg-card/80 px-4 py-2 rounded-xl border border-primary/20">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{symposiumDate}</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/80 px-4 py-2 rounded-xl border border-primary/20">
              <MapPin className="w-4 h-4 text-cyan" />
              <span>{venue}</span>
            </div>
          </div>

          <CountdownTimer targetDate="2026-09-16T09:00:00" />

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => openRegistrationModal()}
            >
              Register Now
            </Button>
            <a href="#events" className="inline-flex">
              <Button size="lg" variant="outline">
                Explore Events
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <Card glowOnHover className="text-center p-6 bg-card/70 border-amber-500/30 shadow-glow">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white mb-1">
              ₹20,000+
            </div>
            <div className="text-xs font-mono text-amber-400 tracking-widest uppercase font-bold">
              TOTAL CASH PRIZES
            </div>
          </Card>
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

      {/* SECTION 4: EVENTS CATALOG */}
      <section id="events" className="container mx-auto px-4 sm:px-6 space-y-12">
        <SectionHeading
          badge="COMPETITIONS & TRACKS"
          title="SPARKTRON 2K26 Events Catalog"
          description="Click any event card to view full rules, guidelines, and round specifications."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto font-mono">
          {[
            { label: "ALL TRACKS (5)", value: "ALL" },
            { label: "TECHNICAL (3)", value: "TECHNICAL" },
            { label: "NON-TECHNICAL (2)", value: "NON_TECHNICAL" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                activeCategory === cat.value
                  ? "bg-primary text-background border-primary shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  : "bg-card/70 text-slate-300 border-white/10 hover:border-primary/50 hover:text-white hover:bg-card"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid - Centered 5-box alignment */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-7xl mx-auto">
          {filteredEvents.map((event) => {
            const theme = getEventTheme(event.slug, event.category);
            const IconComponent = theme.icon;

            return (
              <div
                key={event.id}
                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md flex"
              >
                <div
                  className={`w-full relative group rounded-2xl p-6 sm:p-7 flex flex-col justify-between border bg-gradient-to-b from-[#0e1626]/95 via-[#0b1120]/95 to-[#070c18]/98 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-xl ${theme.cardBorder}`}
                >
                  {/* Top Glowing Laser Ribbon */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: theme.topGradient }}
                  />

                  {/* Corner Cyber Brackets */}
                  <span
                    className={`absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors duration-300 pointer-events-none ${theme.cornerColor}`}
                  />
                  <span
                    className={`absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors duration-300 pointer-events-none ${theme.cornerColor}`}
                  />

                  {/* Radial Ambient Glow */}
                  <div
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-15 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: theme.glowColor }}
                  />

                  {/* Main Content Area */}
                  <div className="space-y-4 relative z-10">
                    {/* Header Row: Category Badge + Team Size */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-200 ${theme.badgeStyle}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.dotColor}`} />
                        <span>{event.category === "NON_TECHNICAL" ? "NON-TECHNICAL" : event.category}</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.teamSize}</span>
                      </div>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-3.5 pt-2">
                      <div
                        className={`p-3 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md ${theme.iconBoxStyle}`}
                      >
                        <IconComponent className={`w-6 h-6 ${theme.iconColor}`} />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-200">
                          {event.title}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className={`w-1 h-1 rounded-full ${theme.dotColor}`} />
                          <span>SPARKTRON OFFICIAL</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300/85 leading-relaxed line-clamp-3 min-h-[48px] font-sans pt-1">
                      {event.shortDesc}
                    </p>

                    {/* High-Tech Spec Strips (Rounds & Venue) */}
                    <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Target className="w-3.5 h-3.5 text-primary" />
                          <span>Rounds:</span>
                        </span>
                        <span className="text-white font-semibold font-sans truncate max-w-[190px] text-right">
                          {event.rounds}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                        <span className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-cyan" />
                          <span>Venue:</span>
                        </span>
                        <span
                          className="text-primary font-semibold font-sans truncate max-w-[190px] text-right"
                          title={event.venue}
                        >
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-5 mt-5 border-t border-white/10 relative z-10">
                    <button
                      type="button"
                      onClick={() => setSelectedEventDetail(event)}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border cursor-pointer ${theme.buttonStyle}`}
                    >
                      <BookOpen className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>Rules & Guidelines</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* EVENT DETAIL RULES MODAL */}
      {selectedEventDetail && (
        <Modal
          isOpen={!!selectedEventDetail}
          onClose={() => setSelectedEventDetail(null)}
          title={selectedEventDetail.title}
          description={`${selectedEventDetail.category} Track • ${selectedEventDetail.teamSize}`}
          maxWidth="lg"
        >
          <div className="space-y-4 py-2">
            <div>
              <h4 className="text-xs font-mono text-primary uppercase font-bold mb-1">Overview</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedEventDetail.fullDesc}</p>
            </div>

            <div className="pt-2 border-t border-primary/10">
              <h4 className="text-xs font-mono text-cyan uppercase font-bold mb-2">Rules & Guidelines</h4>
              <div className="space-y-2 text-xs text-slate-300 font-mono">
                {selectedEventDetail.rules.split("\n").map((r, i) => (
                  <p key={i}>• {r}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-primary/10">
              <div><span className="text-slate-400">Rounds:</span> <span className="text-white font-bold">{selectedEventDetail.rounds}</span></div>
              <div><span className="text-slate-400">Venue:</span> <span className="text-white font-bold">{selectedEventDetail.venue}</span></div>
              <div><span className="text-slate-400">Coordinator:</span> <span className="text-primary">{selectedEventDetail.coordinatorName}</span></div>
              <div><span className="text-slate-400">Phone:</span> <span className="text-cyan">{selectedEventDetail.coordinatorPhone}</span></div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedEventDetail(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const id = selectedEventDetail.id;
                  setSelectedEventDetail(null);
                  openRegistrationModal(id);
                }}
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
