import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Phone, Mail, UserCheck, Shield } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
  title: "Coordinators | SPARKTRON 2K26 ECE Team",
  description: "Meet the Faculty Conveners and Student Coordinators behind SPARKTRON 2K26.",
};

export const revalidate = 60;

export default async function CoordinatorsPage() {
  const faculty = await prisma.coordinator.findMany({
    where: { role: "FACULTY" },
  });

  const students = await prisma.coordinator.findMany({
    where: { role: "STUDENT" },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
      <SectionHeading
        badge="THE TEAM"
        title="Symposium Coordinators & Conveners"
        description="Connect with our faculty patrons and student leads for queries regarding registration, events, or accommodation."
      />

      {/* Faculty Patrons */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-primary font-mono text-sm uppercase tracking-widest font-bold">
          <Shield className="w-4 h-4" />
          <span>Faculty Conveners & Advisory Board</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faculty.map((coord) => (
            <Card key={coord.id} glowOnHover className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-mono text-2xl font-bold flex items-center justify-center shrink-0">
                {coord.name.charAt(0)}
              </div>
              <div className="space-y-1 text-xs font-mono">
                <Badge variant="primary">{coord.department}</Badge>
                <h3 className="text-lg font-bold text-white font-sans">{coord.name}</h3>
                <p className="text-cyan font-semibold">{coord.designation}</p>
                <div className="pt-2 flex flex-wrap gap-4 text-slate-300">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {coord.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-cyan" /> {coord.email}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Committee */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-cyan font-mono text-sm uppercase tracking-widest font-bold">
          <UserCheck className="w-4 h-4" />
          <span>Student Executive Committee</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((coord) => (
            <Card key={coord.id} glowOnHover className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-mono text-2xl font-bold flex items-center justify-center mx-auto shadow-cyan-glow">
                {coord.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{coord.name}</h3>
                <p className="text-xs font-mono text-primary mt-0.5">{coord.designation}</p>
                <p className="text-xs font-mono text-slate-400 mt-1">{coord.department}</p>
              </div>
              <div className="pt-2 border-t border-primary/10 flex justify-center items-center gap-2 text-xs font-mono text-slate-300">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{coord.phone}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
