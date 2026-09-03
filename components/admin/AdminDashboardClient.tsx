"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Search, Download, Users, Users2, Info } from "lucide-react";

import { Select } from "@/components/ui/Select";

export function AdminDashboardClient({
  initialParticipants,
  events,
}: {
  initialParticipants: any[];
  events: any[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedParticipantTeam, setSelectedParticipantTeam] = useState<any | null>(null);

  const filteredParticipants = initialParticipants.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.college.toLowerCase().includes(term) ||
      p.registrationId.toLowerCase().includes(term);

    const matchesEvent =
      selectedEventId === "ALL" ||
      p.registrations.some((r: any) => r.eventId === selectedEventId);

    return matchesSearch && matchesEvent;
  });

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredParticipants, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `sparktron_registered_participants_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Search & Event Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by Name, Email, College, Reg ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-56">
            <Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              options={[
                { label: "All Event Tracks", value: "ALL" },
                ...events.map((e) => ({ label: e.title, value: e.id })),
              ]}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportJSON}
          >
            Export JSON Data
          </Button>
        </div>
      </Card>

      {/* Registered Participants Table */}
      <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-primary/20 text-xs font-mono text-slate-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Reg ID</th>
                <th className="py-3.5 px-4">Participant Name</th>
                <th className="py-3.5 px-4">College & Dept</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Registered Event(s)</th>
                <th className="py-3.5 px-4 text-center">Team Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10 font-mono text-xs">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                    No registrations found matching your query.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">{p.registrationId}</td>
                    <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.college} <br />
                      <span className="text-slate-400">{p.department} ({p.year})</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.email} <br />
                      <span className="text-cyan">{p.phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.registrations.map((r: any) => (
                        <Badge key={r.id} variant="cyan" className="mr-1 mb-1">
                          {r.event.title}
                        </Badge>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.registrations.some((r: any) => r.teamMembers && r.teamMembers.length > 0) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedParticipantTeam(p)}
                        >
                          View Team
                        </Button>
                      ) : (
                        <span className="text-slate-500">Solo</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Details Modal */}
      {selectedParticipantTeam && (
        <Modal
          isOpen={!!selectedParticipantTeam}
          onClose={() => setSelectedParticipantTeam(null)}
          title={`Team Members — ${selectedParticipantTeam.name}`}
          description={`Registration ID: ${selectedParticipantTeam.registrationId}`}
        >
          <div className="space-y-4 py-2">
            {selectedParticipantTeam.registrations.map((r: any) => (
              <div key={r.id} className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-primary uppercase">
                  Event: {r.event.title} {r.teamName ? `(${r.teamName})` : ""}
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {r.teamMembers.map((m: any, idx: number) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-background border border-primary/20 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-bold">{m.memberName} {m.isLeader ? "(Leader)" : ""}</p>
                        <p className="text-slate-400">{m.memberEmail}</p>
                      </div>
                      {m.memberPhone && <span className="text-cyan">{m.memberPhone}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              variant="primary"
              className="w-full mt-2"
              onClick={() => setSelectedParticipantTeam(null)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
