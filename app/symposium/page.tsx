import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, MapPin, AlertCircle, FileText, CheckCircle2, HelpCircle } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
  title: "Symposium Hub | SPARKTRON 2K26 Schedule & Guidelines",
  description: "Official schedule, rules, guidelines, venue details, announcements, and FAQs for SPARKTRON 2K26.",
};

export const revalidate = 60;

export default async function SymposiumPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { date: "desc" },
  });

  const schedule = [
    { time: "08:30 AM - 09:30 AM", title: "Registration Desk & Welcome Kit Distribution", venue: "College Entrance Lobby" },
    { time: "09:30 AM - 10:15 AM", title: "Inaugural Ceremony & Keynote Address", venue: "Main Auditorium" },
    { time: "10:15 AM - 01:00 PM", title: "Morning Events: CircuitRIX & PaperTronix", venue: "VLSI Lab & Seminar Hall" },
    { time: "11:30 AM - 02:00 PM", title: "RoboCombat 2.0 Arena Knockouts", venue: "Central Courtyard Arena" },
    { time: "01:00 PM - 01:45 PM", title: "Complimentary Lunch Break", venue: "College Dining Hall" },
    { time: "01:45 PM - 04:15 PM", title: "IoT Workshop & Online Quiz Screening", venue: "DSP Lab & Computer Center" },
    { time: "04:30 PM - 05:30 PM", title: "Valedictory Ceremony & Prize Distribution", venue: "Main Auditorium" },
  ];

  const faqs = [
    {
      q: "Who is eligible to participate in SPARKTRON 2K26?",
      a: "Engineering students (UG/PG) and Diploma students from any recognized institution across India are eligible.",
    },
    {
      q: "Is there a registration fee?",
      a: "No! Registration for SPARKTRON 2K26 is completely FREE of cost for all participants.",
    },
    {
      q: "Can a participant register for multiple events?",
      a: "Yes, provided the event timings do not overlap. Check the master schedule above to plan your entries.",
    },
    {
      q: "Will lunch and refreshment be provided?",
      a: "Yes, complimentary lunch and tea/snacks will be provided to all registered participants with valid ID badges.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
      <SectionHeading
        badge="SYMPOSIUM HUB"
        title="Event Schedule & Guidelines"
        description="Everything you need to know before attending SPARKTRON 2K26."
      />

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary font-mono text-sm">
            <AlertCircle className="w-4 h-4" />
            <span className="uppercase tracking-widest font-bold">Important Announcements</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start space-x-3"
              >
                <Badge variant={item.priority === "HIGH" ? "danger" : "primary"}>
                  {item.priority}
                </Badge>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-secondary-foreground mt-1">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Timeline */}
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="cyan" size="md">TIMELINE</Badge>
          <h3 className="text-2xl font-bold text-white mt-2">Master Symposium Schedule</h3>
          <p className="text-xs font-mono text-slate-400 mt-1">March 28, 2026 • Single-Day Event</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-card border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center space-x-3 text-primary font-mono text-sm font-bold shrink-0">
                <Clock className="w-4 h-4 text-cyan" />
                <span>{item.time}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm sm:text-base">{item.title}</h4>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-background px-3 py-1 rounded-lg border border-primary/10 shrink-0">
                {item.venue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Rules & Guidelines */}
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="primary" size="md">CODE OF CONDUCT</Badge>
          <h3 className="text-2xl font-bold text-white mt-2">Symposium Rules & Guidelines</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Participant Requirements
            </CardTitle>
            <ul className="text-sm text-secondary-foreground space-y-2 mt-4 list-disc list-inside">
              <li>College ID card is strictly mandatory for campus entry and verification.</li>
              <li>Participants must report to the registration desk at least 30 minutes prior to scheduled event time.</li>
              <li>Dress code: Formal / Decent college attire.</li>
              <li>Decisions made by event judges and faculty conveners are final and binding.</li>
            </ul>
          </Card>

          <Card>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Certificate & Prize Allocation
            </CardTitle>
            <ul className="text-sm text-secondary-foreground space-y-2 mt-4 list-disc list-inside">
              <li>Cash prizes and trophies will be awarded during the Valedictory Ceremony at 04:30 PM.</li>
              <li>Digital certificates of merit/participation will be sent via email within 48 hours.</li>
              <li>Disqualification will occur immediately in case of malpractice or misconduct.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <Badge variant="cyan" size="md">FAQ</Badge>
          <h3 className="text-2xl font-bold text-white mt-2">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx}>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary shrink-0" /> {faq.q}
              </h4>
              <p className="text-sm text-secondary-foreground mt-2 pl-6">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
