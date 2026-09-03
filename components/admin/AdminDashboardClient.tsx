"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Search, Download, Users, Ticket, Utensils, ShieldCheck } from "lucide-react";

export function AdminDashboardClient({
  initialRegistrations,
  events,
}: {
  initialRegistrations: any[];
  events: any[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);

  const filteredRegistrations = initialRegistrations.filter((r) => {
    const term = searchTerm.toLowerCase();
    const leader = r.participants[0] || {};

    const matchesSearch =
      r.registrationCode.toLowerCase().includes(term) ||
      (r.teamName && r.teamName.toLowerCase().includes(term)) ||
      r.participants.some(
        (p: any) =>
          p.fullName.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.college.toLowerCase().includes(term) ||
          p.phone.includes(term)
      );

    const matchesEvent =
      selectedEventId === "ALL" ||
      r.technicalEventId === selectedEventId ||
      r.nonTechnicalEventId === selectedEventId;

    const matchesType = selectedType === "ALL" || r.registrationType === selectedType;

    return matchesSearch && matchesEvent && matchesType;
  });

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredRegistrations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `sparktron_registrations_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Search & Event Filter Bar */}
      <Card className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="w-full lg:w-96">
          <Input
            placeholder="Search by Code, Name, Email, College, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="w-44">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { label: "All Types", value: "ALL" },
                { label: "Online (Web 1)", value: "online" },
                { label: "Offline (Web 2)", value: "offline" },
              ]}
            />
          </div>

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

      {/* Registered Passes Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Pass Code</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Primary Leader</th>
                <th className="py-3.5 px-4">Technical Event</th>
                <th className="py-3.5 px-4">Non-Technical Event</th>
                <th className="py-3.5 px-4 text-center">Team Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                    No registrations found matching your filter query.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r) => {
                  const leader = r.participants[0] || {};
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-cyan-400">
                        {r.registrationCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            r.registrationType === "offline"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          }`}
                        >
                          {r.registrationType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <p className="text-slate-100 font-bold">{leader.fullName || "N/A"}</p>
                        <p className="text-xs text-slate-400 font-mono">{leader.email}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{leader.college}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="primary">
                          {r.technicalEvent?.title || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="cyan">
                          {r.nonTechnicalEvent?.title || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRegistration(r)}
                        >
                          {r.participants.length} Member(s)
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details & Team Modal */}
      {selectedRegistration && (
        <Modal
          isOpen={!!selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          title={`Registration Pass — ${selectedRegistration.registrationCode}`}
          description={`Registered on ${new Date(selectedRegistration.createdAt).toLocaleDateString()}`}
        >
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <p>
                <span className="text-slate-400">Technical Event:</span>{" "}
                <strong className="text-cyan-400">
                  {selectedRegistration.technicalEvent?.title}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">Non-Technical Event:</span>{" "}
                <strong className="text-cyan-300">
                  {selectedRegistration.nonTechnicalEvent?.title}
                </strong>
              </p>
              {selectedRegistration.teamName && (
                <p>
                  <span className="text-slate-400">Team Name:</span>{" "}
                  <strong className="text-white">{selectedRegistration.teamName}</strong>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Participant Roster (
                {selectedRegistration.participants.length})
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedRegistration.participants.map((p: any, idx: number) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-bold">
                        {p.fullName} {p.isTeamLeader ? "(Leader)" : ""}
                      </p>
                      <p className="text-slate-400 font-mono">{p.email}</p>
                      <p className="text-slate-400">{p.college} • {p.phone}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        p.foodPreference === "Non-Veg"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {p.foodPreference}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mt-2"
              onClick={() => setSelectedRegistration(null)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
