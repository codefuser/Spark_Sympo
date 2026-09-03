"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  Search,
  Download,
  Users,
  Ticket,
  Utensils,
  ShieldCheck,
  UserPlus,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Layers,
} from "lucide-react";

export function AdminDashboardClient({
  initialRegistrations,
  events,
}: {
  initialRegistrations: any[];
  events: any[];
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);

  // Offline Spot Registration Modal State
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [submittingOffline, setSubmittingOffline] = useState(false);

  const technicalEvents = events.filter(
    (e) => e.category === "TECHNICAL" || e.slug === "paper-presentation" || e.slug === "technical-quiz" || e.slug === "circuit-debugging"
  );
  const nonTechnicalEvents = events.filter((e) => e.category === "NON_TECHNICAL");

  const [offlineForm, setOfflineForm] = useState({
    technicalEventId: technicalEvents[0]?.id || "",
    nonTechnicalEventId: nonTechnicalEvents[0]?.id || "",
    teamName: "",
    participants: [
      {
        fullName: "",
        email: "",
        phone: "",
        college: "",
        foodPreference: "Veg",
        isTeamLeader: true,
      },
    ],
  });

  const filteredRegistrations = initialRegistrations.filter((r) => {
    const term = searchTerm.toLowerCase();

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

  const handleOfflineParticipantChange = (index: number, field: string, value: any) => {
    const updated = [...offlineForm.participants];
    updated[index] = { ...updated[index], [field]: value };
    setOfflineForm({ ...offlineForm, participants: updated });
  };

  const addOfflineParticipant = () => {
    setOfflineForm({
      ...offlineForm,
      participants: [
        ...offlineForm.participants,
        {
          fullName: "",
          email: "",
          phone: "",
          college: "",
          foodPreference: "Veg",
          isTeamLeader: false,
        },
      ],
    });
  };

  const removeOfflineParticipant = (index: number) => {
    if (offlineForm.participants.length <= 1) return;
    const updated = offlineForm.participants.filter((_, i) => i !== index);
    setOfflineForm({ ...offlineForm, participants: updated });
  };

  const handleOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOffline(true);

    try {
      const payload = {
        ...offlineForm,
        registrationType: "offline",
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showToast(
          "Offline Pass Generated!",
          `Pass Code: ${result.registrationId}`,
          "success"
        );
        setIsOfflineModalOpen(false);
        setOfflineForm({
          technicalEventId: technicalEvents[0]?.id || "",
          nonTechnicalEventId: nonTechnicalEvents[0]?.id || "",
          teamName: "",
          participants: [
            {
              fullName: "",
              email: "",
              phone: "",
              college: "",
              foodPreference: "Veg",
              isTeamLeader: true,
            },
          ],
        });
        router.refresh();
      } else {
        showToast("Offline Registration Error", result.message || "Failed to process", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to connect to server", "error");
    } finally {
      setSubmittingOffline(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Offline Spot Registration Bar */}
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

          <div className="w-52">
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
            variant="cyan"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setIsOfflineModalOpen(true)}
          >
            Offline Spot Reg
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportJSON}
          >
            Export JSON
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
                          className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                            r.registrationType === "offline"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                              : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40"
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

      {/* OFFLINE SPOT REGISTRATION MODAL (Website 2 Volunteer Entry) */}
      {isOfflineModalOpen && (
        <Modal
          isOpen={isOfflineModalOpen}
          onClose={() => setIsOfflineModalOpen(false)}
          title="Offline Spot Registration (College Desk)"
          description="Register walk-in students physically. Saved directly to Supabase as registration_type = 'offline'."
          maxWidth="xl"
        >
          <form onSubmit={handleOfflineSubmit} className="space-y-4 max-h-[68vh] overflow-y-auto pr-2">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Offline Entry Mode — Type: <strong>OFFLINE</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Technical Event Track *"
                options={technicalEvents.map((e) => ({
                  label: `${e.title}`,
                  value: e.id,
                }))}
                value={offlineForm.technicalEventId}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, technicalEventId: e.target.value })
                }
              />

              <Select
                label="Non-Technical Event Track *"
                options={nonTechnicalEvents.map((e) => ({
                  label: `${e.title}`,
                  value: e.id,
                }))}
                value={offlineForm.nonTechnicalEventId}
                onChange={(e) =>
                  setOfflineForm({ ...offlineForm, nonTechnicalEventId: e.target.value })
                }
              />
            </div>

            <Input
              label="Team Name (Optional)"
              placeholder="e.g. Offline Titans"
              value={offlineForm.teamName}
              onChange={(e) => setOfflineForm({ ...offlineForm, teamName: e.target.value })}
            />

            {/* Offline Participants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-200 uppercase">
                  Participant Roster ({offlineForm.participants.length})
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  onClick={addOfflineParticipant}
                >
                  Add Member
                </Button>
              </div>

              {offlineForm.participants.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>Participant {idx + 1} {idx === 0 ? "(Leader *)" : ""}</span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeOfflineParticipant(idx)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      placeholder="Full Name *"
                      value={p.fullName}
                      onChange={(e) =>
                        handleOfflineParticipantChange(idx, "fullName", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={p.email}
                      onChange={(e) =>
                        handleOfflineParticipantChange(idx, "email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Input
                      placeholder="Phone *"
                      value={p.phone}
                      onChange={(e) =>
                        handleOfflineParticipantChange(idx, "phone", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder="College / Institution *"
                      value={p.college}
                      onChange={(e) =>
                        handleOfflineParticipantChange(idx, "college", e.target.value)
                      }
                      required
                    />
                    <Select
                      options={[
                        { label: "Veg 🥗", value: "Veg" },
                        { label: "Non-Veg 🍗", value: "Non-Veg" },
                      ]}
                      value={p.foodPreference}
                      onChange={(e) =>
                        handleOfflineParticipantChange(idx, "foodPreference", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full text-sm font-semibold tracking-wide py-3 mt-2"
              isLoading={submittingOffline}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Offline Registration Pass
            </Button>
          </form>
        </Modal>
      )}

      {/* Registration Details & Team Roster Modal */}
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
              <p>
                <span className="text-slate-400">Registration Type:</span>{" "}
                <span className="text-amber-400 font-bold uppercase">{selectedRegistration.registrationType}</span>
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
                    key={p.id || idx}
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
