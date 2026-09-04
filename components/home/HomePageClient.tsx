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

  const filteredEvents = activeCategory === "ALL"
    ? events
    : events.filter((e) => e.category === activeCategory);

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
      <section id="about" className="container mx-auto px-4 sm:px-6 space-y-12">
        <SectionHeading
          badge="ABOUT US"
          title="About Thamirabharani Engineering College & SPARKTRON 2K26"
          description="Fostering technical innovation, engineering mastery, and collaborative research excellence."
        />

        {/* Thamirabharani Engineering College Overview Card */}
        <Card glowOnHover className="relative overflow-hidden border border-primary/25 bg-card/90 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/15 pb-5">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-primary font-mono text-xs tracking-wider uppercase font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>INSTITUTION PROFILE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    About Thamirabharani Engineering College
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> AICTE Approved, New Delhi
                </span>
                <span className="px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan" /> Anna University Affiliated
                </span>
              </div>
            </div>

            <div className="text-sm sm:text-base text-secondary-foreground leading-relaxed space-y-4">
              <p>
                Thamirabharani Engineering College which is in the Tirunelveli Corporation limits is located at Thatchanallur, 5km away from Palayamkottai and 40 km from Tuticorin airport. Unfolding its grandeur over 25 acres of land, the college exhibits an attractive panorama conducive to studies. Considering a holistic approach to life and education, an ambient infrastructure is provided for the students. They enjoy a natural sanctuary of birds, magnificent scenery of evergreen trees and amazing mountains and a gorgeous garden of multicolored flowers. Thamirabharani Engineering College was founded with the noble vision to raise professionals and leaders of high academic caliber and unblemished character, nurtured with a strong motivation and commitment to serve humanity. TEC aims at educating &amp; training its students to become not only competent professionals but also excellent human beings to influence the quality of life of people around.
              </p>
              <p>
                Thamirabharani Engineering College was established with the goal of producing outstanding students in Technical and Business fields and preparing them to tackle the challenges of a dynamic and rapidly changing world. The management implements an interdisciplinary approach to the programs of Anna University, making sure that practical applications are combined with the classroom material. All the programs offered by the institute are recognized by and affiliated to statutory bodies like the All India Council of Technical Education (AICTE), New Delhi and Anna University, Chennai. In a nutshell, Thamirabharani Engineering College is a co-educational, residential, technological college imparting holistic education to develop the technical and the character of the students.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-background/80 border border-primary/20 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">25 Acres</div>
                <div className="text-slate-400 mt-1">Lush Green Campus</div>
              </div>
              <div className="p-3.5 rounded-lg bg-background/80 border border-primary/20 text-center">
                <div className="text-xl sm:text-2xl font-bold text-cyan">Tirunelveli</div>
                <div className="text-slate-400 mt-1">Corporation Limits</div>
              </div>
              <div className="p-3.5 rounded-lg bg-background/80 border border-primary/20 text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">AICTE &amp; AU</div>
                <div className="text-slate-400 mt-1">Approved &amp; Affiliated</div>
              </div>
              <div className="p-3.5 rounded-lg bg-background/80 border border-primary/20 text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-400">Co-Ed</div>
                <div className="text-slate-400 mt-1">Residential Campus</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card glowOnHover className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-primary font-mono text-sm mb-2">
                <Zap className="w-4 h-4" />
                <span>THE SYMPOSIUM LEGACY</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3">What is SPARKTRON 2K26?</h3>
              <p className="text-sm text-secondary-foreground leading-relaxed space-y-3">
                <span>
                  SPARKTRON 2K26 is the annual flagship National Level Technical Symposium organized by the Department of Electronics and Communication Engineering. It serves as a high-octane nexus where budding engineers from across the nation converge to benchmark their technical prowess.
                </span>
                <br /><br />
                <span>
                  Featuring state-of-the-art competitions in circuit debugging, technical paper synthesis, autonomous robot combat, and embedded edge workshops, SPARKTRON bridges academic theory and practical industry execution.
                </span>
              </p>
            </div>
            <div className="pt-4 border-t border-primary/10 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" /> ISO Certified</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-cyan" /> IEEE Supported</span>
            </div>
          </Card>

          <Card glowOnHover className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan font-mono text-sm mb-2">
                <Cpu className="w-4 h-4" />
                <span>DEPARTMENT OVERVIEW</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3">Department of ECE</h3>
              <p className="text-sm text-secondary-foreground leading-relaxed">
                The Department of Electronics and Communication Engineering is renowned for its academic rigor, research publications, and cutting-edge laboratory infrastructure. Equipped with advanced VLSI design tools, Embedded System kits, DSP trainers, and Microwave test setups, the department nurtures industry-ready engineers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs text-center">
              <div className="p-3 rounded-lg bg-background border border-primary/20">
                <div className="text-xl font-bold text-primary">12+</div>
                <div className="text-slate-400">Advanced Labs</div>
              </div>
              <div className="p-3 rounded-lg bg-background border border-primary/20">
                <div className="text-xl font-bold text-cyan">100%</div>
                <div className="text-slate-400">Placement Record</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Our Vision</h4>
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              To evolve into a center of excellence in Electronics and Communication Engineering education and research, producing globally competent, ethically sound, and innovative engineers.
            </p>
          </Card>

          <Card className="border-l-4 border-l-cyan">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan/10 text-cyan">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">Our Mission</h4>
            </div>
            <ul className="text-sm text-secondary-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Provide rigorous technical curriculum enriched with practical laboratory experience.</li>
              <li>Foster research partnerships with semiconductor, telecommunication, and robotics industries.</li>
            </ul>
          </Card>
        </div>
      </section>

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
          description="Click any event card to view full rules or register your team directly."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto font-mono">
          {[
            { label: "ALL TRACKS", value: "ALL" },
            { label: "TECHNICAL", value: "TECHNICAL" },
            { label: "WORKSHOPS", value: "WORKSHOP" },
            { label: "NON-TECHNICAL", value: "NON_TECHNICAL" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat.value
                  ? "bg-primary text-background border-primary shadow-glow"
                  : "bg-card/60 text-secondary-foreground border-primary/20 hover:border-primary/50 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} glowOnHover className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={event.category === "TECHNICAL" ? "primary" : "cyan"}>
                    {event.category}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{event.teamSize}</span>
                </div>

                <div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3 leading-relaxed">
                    {event.shortDesc}
                  </CardDescription>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rounds:</span>
                    <span className="text-white font-bold">{event.rounds}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Venue:</span>
                    <span className="text-primary truncate max-w-[180px]">{event.venue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/10 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-1/2"
                  onClick={() => setSelectedEventDetail(event)}
                >
                  Rules
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-1/2"
                  onClick={() => openRegistrationModal(event.id)}
                >
                  Register →
                </Button>
              </div>
            </Card>
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
