import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/database/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { ShieldCheck, Users, Calendar, Award, LogOut, Laptop, CheckCircle } from "lucide-react";

export const revalidate = 0; // Always fresh live registration data

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch live metrics
  const totalRegistrations = await prisma.registration.count();
  const totalParticipants = await prisma.participant.count();
  const onlineRegistrations = await prisma.registration.count({
    where: { registrationType: "online" },
  });
  const offlineRegistrations = await prisma.registration.count({
    where: { registrationType: "offline" },
  });
  const totalEvents = await prisma.event.count();

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      technicalEvent: true,
      nonTechnicalEvent: true,
      participants: true,
    },
  });

  const events = await prisma.event.findMany({
    select: { id: true, title: true, slug: true, category: true },
  });

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
              <h1 className="text-xl font-bold font-mono text-white">SPARKTRON 2K26 Registered Participants Portal</h1>
              <Badge variant="primary">{session.role}</Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Shared Supabase Backend • Logged in as <span className="text-white">{session.name}</span> ({session.email})
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
        initialRegistrations={registrations as any}
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
