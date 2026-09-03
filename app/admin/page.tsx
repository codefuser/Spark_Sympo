import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/database/prisma";
import { supabase } from "@/lib/database/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const revalidate = 0; // Always fresh live registration data

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // 1. Fetch Live Registrations Directly from Supabase Shared Cloud Database
  let registrations: any[] = [];
  try {
    const { data: supaRegs, error: supaErr } = await supabase
      .from("registrations")
      .select(`
        id,
        registration_code,
        registration_type,
        technical_event_id,
        non_technical_event_id,
        team_name,
        status,
        created_at,
        technical_event:events!technical_event_id(id, title, category, slug),
        non_technical_event:events!non_technical_event_id(id, title, category, slug),
        participants(id, full_name, email, phone, college, food_preference, is_team_leader)
      `)
      .order("created_at", { ascending: false });

    if (!supaErr && supaRegs && supaRegs.length > 0) {
      registrations = supaRegs.map((r: any) => ({
        id: r.id,
        registrationCode: r.registration_code,
        registrationType: r.registration_type || "online",
        technicalEventId: r.technical_event_id,
        nonTechnicalEventId: r.non_technical_event_id,
        teamName: r.team_name,
        status: r.status,
        createdAt: r.created_at,
        technicalEvent: r.technical_event,
        nonTechnicalEvent: r.non_technical_event,
        participants: (r.participants || []).map((p: any) => ({
          id: p.id,
          fullName: p.full_name,
          email: p.email,
          phone: p.phone,
          college: p.college,
          foodPreference: p.food_preference,
          isTeamLeader: p.is_team_leader,
        })),
      }));
    } else {
      // Fallback: Query Prisma if Supabase Cloud table is empty or loading
      const localRegs = await prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          technicalEvent: true,
          nonTechnicalEvent: true,
          participants: true,
        },
      });
      registrations = localRegs as any[];
    }
  } catch (err) {
    console.error("Error fetching Supabase admin data:", err);
  }

  // 2. Fetch Events for filter dropdown
  const events = await prisma.event.findMany({
    select: { id: true, title: true, slug: true, category: true },
  });

  return (
    <div className="min-h-screen bg-background text-foreground circuit-bg p-4 sm:p-8">
      <AdminDashboardClient
        initialRegistrations={registrations}
        events={events as any}
        session={session as any}
      />
    </div>
  );
}
