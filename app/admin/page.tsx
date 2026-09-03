import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/database/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { ShieldCheck, Users, Calendar, Award, FileSpreadsheet, LogOut } from "lucide-react";

export const revalidate = 0; // Always fresh admin data

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch metrics data
  const totalParticipants = await prisma.participant.count();
  const totalRegistrations = await prisma.registration.count();
  const totalEvents = await prisma.event.count();
  const totalQuizAttempts = await prisma.quizAttempt.count();

  const events = await prisma.event.findMany({
    include: {
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { title: "asc" },
  });

  const participants = await prisma.participant.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      registrations: {
        include: {
          event: true,
          teamMembers: true,
        },
      },
      quizAttempts: true,
    },
  });

  const activeQuiz = await prisma.quiz.findFirst({
    where: { isActive: true },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground circuit-bg p-4 sm:p-8 space-y-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-glow">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/40 text-primary flex items-center justify-center font-mono font-bold text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-mono text-white">SPARKTRON 2K26 Admin Console</h1>
              <Badge variant="primary">{session.role}</Badge>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Logged in as <span className="text-white">{session.name}</span> ({session.email})
            </p>
          </div>
        </div>

        <AdminLogoutButton />
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Participants</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-white">{totalParticipants}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Event Registrations</span>
            <Calendar className="w-5 h-5 text-cyan" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-cyan">{totalRegistrations}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Events</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-400">{totalEvents}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Quiz Submissions</span>
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-400">{totalQuizAttempts}</p>
        </Card>
      </div>

      {/* Client Interactive Dashboard */}
      <AdminDashboardClient
        initialEvents={events as any}
        initialParticipants={participants as any}
        activeQuiz={activeQuiz as any}
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
