import React from "react";
import { HomePageClient } from "@/components/home/HomePageClient";
import { prisma } from "@/lib/database/prisma";
import {
  DEFAULT_EVENTS,
  DEFAULT_FACULTY_COORDINATORS,
  DEFAULT_STUDENT_COORDINATORS,
  DEFAULT_SPONSORS,
  DEFAULT_ANNOUNCEMENTS,
} from "@/lib/constants/defaults";

export const revalidate = 60;

export default async function HomePage() {
  let events: any[] = [];
  let sponsors: any[] = [];
  let facultyCoordinators: any[] = [];
  let studentCoordinators: any[] = [];
  let announcements: any[] = [];

  try {
    events = await prisma.event.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { technicalRegistrations: true, nonTechnicalRegistrations: true },
        },
      },
    });
  } catch (err) {
    console.warn("page: prisma events failed", err);
  }

  try { sponsors = await prisma.sponsor.findMany(); } catch (err) { console.warn("page: prisma sponsors failed", err); }
  try { facultyCoordinators = await prisma.coordinator.findMany({ where: { role: "FACULTY" } }); } catch (err) { console.warn("page: prisma faculty failed", err); }
  try { studentCoordinators = await prisma.coordinator.findMany({ where: { role: "STUDENT" } }); } catch (err) { console.warn("page: prisma students failed", err); }
  try { announcements = await prisma.announcement.findMany({ orderBy: { date: "desc" } }); } catch (err) { console.warn("page: prisma announcements failed", err); }

  const finalEvents = events && events.length > 0 ? events : DEFAULT_EVENTS;
  const finalSponsors = sponsors && sponsors.length > 0 ? sponsors : DEFAULT_SPONSORS;
  const finalFaculty = facultyCoordinators && facultyCoordinators.length > 0 ? facultyCoordinators : DEFAULT_FACULTY_COORDINATORS;
  const finalStudents = studentCoordinators && studentCoordinators.length > 0 ? studentCoordinators : DEFAULT_STUDENT_COORDINATORS;
  const finalAnnouncements = announcements && announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS;

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
      events={finalEvents as any}
      sponsors={finalSponsors as any}
      facultyCoordinators={finalFaculty as any}
      studentCoordinators={finalStudents as any}
      announcements={finalAnnouncements as any}
      schedule={schedule}
      faqs={faqs}
      symposiumDate={symposiumDate}
      collegeName={collegeName}
      venue={venue}
    />
  );
}

