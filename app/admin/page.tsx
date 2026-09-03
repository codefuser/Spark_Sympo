import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/database/prisma";
import { supabase } from "@/lib/database/supabase";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { ShieldCheck, Users, Calendar, Award, LogOut, Laptop } from "lucide-react";

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

  // Calculate metrics
  const totalRegistrations = registrations.length;
  const totalParticipants = registrations.reduce(
    (acc, r) => acc + (r.participants?.length || 0),
    0
  );
  const onlineRegistrations = registrations.filter(
    (r) => r.registrationType === "online"
  ).length;
  const offlineRegistrations = registrations.filter(
    (r) => r.registrationType === "offline"
  ).length;
  const totalEvents = events.length;

  return (
    <div className="min-h-screen bg-background text-foreground circuit-bg p-4 sm:p-8 space-y-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-mono text-white">
                SPARKTRON 2K26 Registered Participants Portal
              </h1>
              <Badge variant="primary">{session.role}</Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Live Supabase Cloud Monitor • Logged in as <span className="text-white">{session.name}</span> ({session.email})
            </p>
          </div>
        </div>

        <AdminLogoutButton />
      </div>

      {/* Live Registration Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Registrations</span>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{totalRegistrations}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Participants</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-400">{totalParticipants}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Online / Offline</span>
            <Laptop className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            <span className="text-cyan-400">{onlineRegistrations}</span> / <span className="text-amber-400">{offlineRegistrations}</span>
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Event Tracks</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-400">{totalEvents}</p>
        </Card>
      </div>

      {/* Live Registrations Client Inspector */}
      <AdminDashboardClient
        initialRegistrations={registrations}
        events={events as any}
      />
    </div>
  );
}

function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <Button type="submit" variant="ghost" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
        Sign Out
      </Button>
    </form>
  );
}
