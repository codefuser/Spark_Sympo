import React from "react";
import Link from "next/link";
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
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { prisma } from "@/lib/database/prisma";

export const revalidate = 60; // Refresh cache every minute

export default async function HomePage() {
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  const sponsors = await prisma.sponsor.findMany({
    take: 4,
  });

  const coordinators = await prisma.coordinator.findMany({
    take: 4,
    where: { role: "STUDENT" },
  });

  const symposiumDate = process.env.NEXT_PUBLIC_SYMPOSIUM_DATE || "March 28, 2026";
  const collegeName = process.env.NEXT_PUBLIC_COLLEGE_NAME || "St. Joseph's Institute of Technology";
  const venue = process.env.NEXT_PUBLIC_VENUE || "ECE Block Auditorium & Advanced Labs";

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-primary/10">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono tracking-widest uppercase shadow-glow animate-pulse">
            <Zap className="w-4 h-4 text-primary" />
            <span>Department of Electronics & Communication Engineering</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <p className="text-sm sm:text-base font-mono text-cyan uppercase tracking-widest">
              {collegeName} Presents
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-white uppercase">
              SPARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan to-cyan-glow">TRON</span>{" "}
              <span className="text-primary font-sans">2K26</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Electrify Your Engineering Instincts. The National Level Technical Symposium standardizing innovation, circuit synthesis, and robotics.
            </p>
          </div>

          {/* Quick Date & Venue pill */}
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

          {/* Countdown Timer */}
          <CountdownTimer targetDate="2026-03-28T09:00:00" />

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Register Now
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline">
                Explore Events
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="cyan" leftIcon={<Award className="w-5 h-5" />}>
                Online Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "CASH PRIZES", value: "₹75,000+", icon: Trophy, color: "text-amber-400" },
            { label: "PARTICIPANTS", value: "1,500+", icon: Users, color: "text-primary" },
            { label: "EVENTS & TRACKS", value: "06 TOTAL", icon: Layers, color: "text-cyan" },
            { label: "NATIONAL COLLEGES", value: "50+", icon: ShieldCheck, color: "text-emerald-400" },
          ].map((stat, idx) => (
            <Card key={idx} glowOnHover className="text-center p-6 bg-card/60">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-secondary-foreground tracking-widest">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SYMPOSIUM HIGHLIGHTS */}
      <section className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="WHY PARTICIPATE"
          title="Symposium Highlights"
          description="Designed to challenge technical acumen, foster research collaboration, and reward engineering excellence."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glowOnHover>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary mb-4 shadow-glow">
              <Cpu className="w-6 h-6" />
            </div>
            <CardTitle>Hands-on Lab Synthesis</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Work on industrial grade CROs, breadboard test benches, VLSI simulation kits, and embedded IoT edge boards in real-time environments.
            </CardDescription>
          </Card>

          <Card glowOnHover>
            <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan mb-4 shadow-cyan-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <CardTitle>National Technical Platform</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Present papers and research abstracts evaluated by distinguished IEEE senior members, industry leads, and ECE faculty chairs.
            </CardDescription>
          </Card>

          <Card glowOnHover>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <CardTitle>Instant Online Quiz & Leaderboard</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Test your speed and accuracy in our real-time portal. Automated server scoring with live leaderboard rankings and stage buzzer finals.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* FEATURED EVENTS PREVIEW */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge variant="cyan" size="md">FEATURED TRACKS</Badge>
            <h2 className="text-3xl font-extrabold text-white uppercase mt-2">
              Featured Events & Challenges
            </h2>
          </div>
          <Link href="/events" className="mt-4 md:mt-0 text-sm font-mono text-primary hover:underline flex items-center gap-1">
            View All 6 Events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} glowOnHover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={event.category === "TECHNICAL" ? "primary" : "cyan"}>
                    {event.category}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{event.teamSize}</span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-3">
                  {event.shortDesc}
                </CardDescription>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {event.venue.split(",")[0]}
                </span>
                <Link href={`/events/${event.slug}`}>
                  <Button variant="outline" size="sm">
                    Details & Rules
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SPONSORS PREVIEW */}
      <section className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="OUR PARTNERS"
          title="Sponsored By Industry Leaders"
          description="SPARKTRON 2K26 is proudly backed by leading global technology corporations and academic organizations."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center justify-center p-6 rounded-xl bg-card/40 border border-primary/15 font-mono font-bold text-slate-300 text-center hover:border-primary/40 transition-colors"
            >
              {sponsor.name}
            </div>
          ))}
        </div>
      </section>

      {/* COORDINATORS PREVIEW */}
      <section className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="STUDENT LEADERSHIP"
          title="Symposium Coordinators"
          description="Our dedicated student committee organizing smooth execution across all technical venues."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coordinators.map((coord) => (
            <Card key={coord.id} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono text-xl font-bold mx-auto mb-3">
                {coord.name.charAt(0)}
              </div>
              <h4 className="text-base font-bold text-white">{coord.name}</h4>
              <p className="text-xs text-primary font-mono mt-1">{coord.designation}</p>
              <p className="text-xs text-slate-400 mt-2 font-mono">{coord.phone}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card/80 to-primary/10 p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-glow-lg">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-mono">
            Register Today for SPARKTRON 2K26
          </h2>
          <p className="text-secondary-foreground max-w-xl mx-auto text-sm sm:text-base">
            Don't miss the chance to compete with top engineering minds across India, win cash prizes, and secure certificates of excellence.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" variant="primary">
                Get Started & Register →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
