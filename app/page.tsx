import React from "react";
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
  Shield,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { HomePageClient } from "@/components/home/HomePageClient";
import { prisma } from "@/lib/database/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { technicalRegistrations: true, nonTechnicalRegistrations: true },
      },
    },
  });

  const sponsors = await prisma.sponsor.findMany();
  const facultyCoordinators = await prisma.coordinator.findMany({ where: { role: "FACULTY" } });
  const studentCoordinators = await prisma.coordinator.findMany({ where: { role: "STUDENT" } });
  const announcements = await prisma.announcement.findMany({ orderBy: { date: "desc" } });

  const symposiumDate = process.env.NEXT_PUBLIC_SYMPOSIUM_DATE || "September 16, 2026";
  const collegeName = process.env.NEXT_PUBLIC_COLLEGE_NAME || "St. Joseph's Institute of Technology";
  const venue = process.env.NEXT_PUBLIC_VENUE || "ECE Block Auditorium & Advanced Labs";

  const schedule = [
    { time: "08:30 AM - 09:30 AM", title: "Registration Desk & Welcome Kit Distribution", venue: "College Entrance Lobby" },
    { time: "09:30 AM - 10:15 AM", title: "Inaugural Ceremony & Keynote Address", venue: "Main Auditorium" },
    { time: "10:15 AM - 01:00 PM", title: "Morning Track: CircuitRIX & PaperTronix", venue: "VLSI Lab & Seminar Hall" },
    { time: "11:30 AM - 02:00 PM", title: "RoboCombat 2.0 Arena Knockouts", venue: "Central Courtyard Arena" },
    { time: "01:00 PM - 01:45 PM", title: "Complimentary Lunch Break", venue: "College Dining Hall" },
    { time: "01:45 PM - 04:15 PM", title: "IoT Workshop & Non-Tech Challenges", venue: "DSP Lab & Media Center" },
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
      a: "Yes, provided event timings do not overlap. Select your tracks in the registration modal.",
    },
    {
      q: "Will lunch and refreshments be provided?",
      a: "Yes, complimentary lunch and tea/snacks will be provided to all registered delegates with valid ID badges.",
    },
  ];

  return (
    <HomePageClient
      events={events as any}
      sponsors={sponsors as any}
      facultyCoordinators={facultyCoordinators as any}
      studentCoordinators={studentCoordinators as any}
      announcements={announcements as any}
      schedule={schedule}
      faqs={faqs}
      symposiumDate={symposiumDate}
      collegeName={collegeName}
      venue={venue}
    />
  );
}
