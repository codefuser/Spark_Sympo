import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/jwt";
import { supabase } from "@/lib/database/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const revalidate = 0; // Always fresh live registration data

const DEFAULT_EVENTS = [
  { id: "1", title: "Paper Presentation", slug: "paper-presentation", category: "TECHNICAL" },
  { id: "2", title: "Technical Quiz", slug: "technical-quiz", category: "TECHNICAL" },
  { id: "3", title: "Circuit Debugging", slug: "circuit-debugging", category: "TECHNICAL" },
  { id: "4", title: "Rythemania", slug: "rythemania", category: "NON_TECHNICAL" },
  { id: "5", title: "E-Sports", slug: "e-sports", category: "NON_TECHNICAL" },
];

export default async function AdminDashboardPage() {
  // 1. Authenticate Admin Session
  let session = null;
  try {
    session = await getAdminSession();
  } catch (authErr) {
    session = null;
  }

  if (!session) {
    redirect("/admin/login");
  }

  // 2. Fetch Events from Supabase Cloud DB
  let eventsList: any[] = DEFAULT_EVENTS;
  try {
    const { data: supaEvents, error: evErr } = await supabase
      .from("events")
      .select("id, title, slug, category");

    if (!evErr && supaEvents && supaEvents.length > 0) {
      eventsList = supaEvents;
    }
  } catch (eErr) {
    eventsList = DEFAULT_EVENTS;
  }

  const eventsMap = new Map(eventsList.map((e) => [e.id, e]));

  // 3. Fetch Live Registrations & Participants from Supabase Shared Cloud Database
  let registrations: any[] = [];
  try {
    const { data: supaRegs, error: supaErr } = await supabase
      .from("registrations")
      .select("*, participants(*)")
      .order("created_at", { ascending: false });

    if (!supaErr && supaRegs && supaRegs.length > 0) {
      registrations = supaRegs.map((r: any) => ({
        id: r.id,
        registrationCode: r.registration_code || "SPK-2K26-PASS",
        registrationType: r.registration_type || "online",
        technicalEventId: r.technical_event_id,
        nonTechnicalEventId: r.non_technical_event_id,
        teamName: r.team_name || null,
        status: r.status || "CONFIRMED",
        createdAt: r.created_at || new Date().toISOString(),
        technicalEvent: eventsMap.get(r.technical_event_id) || { title: "Technical Track" },
        nonTechnicalEvent: eventsMap.get(r.non_technical_event_id) || { title: "Non-Technical Track" },
        participants: (r.participants || []).map((p: any) => ({
          id: p.id,
          fullName: p.full_name || "Participant",
          email: p.email || "",
          phone: p.phone || "",
          college: p.college || "",
          department: p.department || "ECE",
          foodPreference: p.food_preference || "Veg",
          isTeamLeader: p.is_team_leader ?? false,
        })),
      }));
    }
  } catch (err) {
    console.error("Error fetching Supabase admin registrations:", err);
    registrations = [];
  }

  return (
    <div className="min-h-screen bg-background text-foreground circuit-bg p-4 sm:p-8">
      <AdminDashboardClient
        initialRegistrations={registrations}
        events={eventsList}
        session={session}
      />
    </div>
  );
}
