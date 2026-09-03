import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Users, Calendar, ArrowRight, Search, Cpu } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
  title: "Events Catalog | SPARKTRON 2K26 ECE Symposium",
  description: "Browse Technical Events, Workshops, Non-Technical Contests, and Online Quiz challenges.",
};

export const revalidate = 60;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryFilter = searchParams.category;

  const where: any = {};
  if (categoryFilter) {
    where.category = categoryFilter;
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  const categories = [
    { label: "ALL EVENTS", value: "" },
    { label: "TECHNICAL", value: "TECHNICAL" },
    { label: "WORKSHOPS", value: "WORKSHOP" },
    { label: "NON-TECHNICAL", value: "NON_TECHNICAL" },
    { label: "QUIZ", value: "QUIZ" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12">
      <SectionHeading
        badge="COMPETITIONS & TRACKS"
        title="SPARKTRON 2K26 Events Catalog"
        description="Select an event track below to view detailed rules, eligibility, venue, and register your team."
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        {categories.map((cat) => {
          const isActive = (categoryFilter || "") === cat.value;
          return (
            <Link
              key={cat.value}
              href={cat.value ? `/events?category=${cat.value}` : "/events"}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border ${
                isActive
                  ? "bg-primary text-background border-primary shadow-glow"
                  : "bg-card/60 text-secondary-foreground border-primary/20 hover:border-primary/50 hover:text-white"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12 text-secondary-foreground font-mono">
          No events found for the selected category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} glowOnHover className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={event.category === "TECHNICAL" ? "primary" : event.category === "WORKSHOP" ? "cyan" : "warning"}>
                    {event.category}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{event.teamSize}</span>
                </div>

                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
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

              <div className="pt-6 mt-6 border-t border-primary/10 flex items-center justify-between gap-2">
                <Link href={`/events/${event.slug}`} className="w-full">
                  <Button variant="outline" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View Rules & Register
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
