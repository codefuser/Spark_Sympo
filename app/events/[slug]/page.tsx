import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { Calendar, Clock, MapPin, Users, Phone, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | SPARKTRON 2K26 ECE Event`,
    description: event.shortDesc,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const rulesList = event.rules
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Back button */}
      <Link href="/events" className="inline-flex items-center space-x-2 text-xs font-mono text-secondary-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Catalog</span>
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl bg-card border border-primary/30 p-6 sm:p-10 shadow-glow space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Badge variant={event.category === "TECHNICAL" ? "primary" : "cyan"} size="md">
              {event.category}
            </Badge>
            <Badge variant={event.status === "OPEN" ? "success" : "danger"} size="md">
              REGISTRATION {event.status}
            </Badge>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {event._count.registrations} Registrations Received
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-mono text-white uppercase">
            {event.title}
          </h1>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-3xl leading-relaxed">
            {event.shortDesc}
          </p>
        </div>

        {/* Quick Specs bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-primary/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-slate-400">Team Size</p>
              <p className="text-white font-bold">{event.teamSize}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan shrink-0" />
            <div>
              <p className="text-slate-400">Date & Time</p>
              <p className="text-white font-bold">{event.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-slate-400">Venue</p>
              <p className="text-white font-bold truncate">{event.venue}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-slate-400">Structure</p>
              <p className="text-white font-bold">{event.rounds}</p>
            </div>
          </div>
        </div>

        {/* Register CTA */}
        <div className="pt-4 flex flex-wrap gap-4">
          <Link href={`/register?eventId=${event.id}`}>
            <Button size="lg" variant="primary">
              Register for {event.title} →
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Description & Rules */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardTitle className="text-xl mb-4 text-white">Event Overview & Format</CardTitle>
            <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
              {event.fullDesc}
            </p>
          </Card>

          <Card>
            <CardTitle className="text-xl mb-4 text-white">Official Rules & Guidelines</CardTitle>
            <div className="space-y-3">
              {rulesList.map((rule, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm text-secondary-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Eligibility & Coordinator Details */}
        <div className="space-y-6">
          <Card>
            <CardTitle className="text-lg mb-2 text-white">Eligibility Criteria</CardTitle>
            <p className="text-sm text-secondary-foreground leading-relaxed font-mono">
              {event.eligibility}
            </p>
          </Card>

          <Card>
            <CardTitle className="text-lg mb-4 text-white">Event Coordinator</CardTitle>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <p className="text-slate-400">Faculty/Student Lead</p>
                <p className="text-base font-bold text-white mt-0.5">{event.coordinatorName}</p>
              </div>
              <div className="flex items-center space-x-2 text-primary pt-2 border-t border-primary/10">
                <Phone className="w-4 h-4" />
                <span>{event.coordinatorPhone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
