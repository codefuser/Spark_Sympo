"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/database/supabase";
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
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Layers,
  Copy,
  Sparkles,
  Award,
  Calendar,
  Laptop,
  LogOut,
  RefreshCw,
  Wifi,
  GripVertical,
} from "lucide-react";

const POPULAR_COLLEGES = [
  "St. Joseph's Institute of Technology",
  "St. Joseph's College of Engineering",
  "SRM Institute of Science and Technology",
  "SSN College of Engineering",
  "Anna University (CEG / MIT)",
  "Sathyabama Institute of Science and Technology",
  "SRM Valliammai Engineering College",
  "Rajalakshmi Engineering College",
  "Loyola-ICAM College of Engineering",
  "PSG College of Technology",
  "Vellore Institute of Technology (VIT)",
  "RMK Engineering College",
  "EASWARI Engineering College",
  "Sri Sairam Engineering College",
];

const DEPARTMENTS = [
  { label: "ECE - Electronics & Communication", value: "ECE" },
  { label: "EEE - Electrical & Electronics", value: "EEE" },
  { label: "EIE - Electronics & Instrumentation", value: "EIE" },
  { label: "CSE - Computer Science & Engineering", value: "CSE" },
  { label: "IT - Information Technology", value: "IT" },
  { label: "AI & DS - Artificial Intelligence & Data Science", value: "AIDS" },
  { label: "AI & ML - Artificial Intelligence & Machine Learning", value: "AIML" },
  { label: "Mechanical Engineering", value: "Mechanical" },
  { label: "Civil Engineering", value: "Civil" },
  { label: "Mechatronics", value: "Mechatronics" },
  { label: "Other / Diploma", value: "Other" },
];

export function AdminDashboardClient({
  initialRegistrations,
  events,
  session,
}: {
  initialRegistrations: any[];
  events: any[];
  session?: { name: string; email: string; role: string };
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);

  // Full Screen Offline Spot Desk Mode Toggle
  const [isOfflineDeskView, setIsOfflineDeskView] = useState(false);
  const [submittingOffline, setSubmittingOffline] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live registrations list for instant real-time UI updates
  const [registrationsList, setRegistrationsList] = useState<any[]>(initialRegistrations);

  // Track previous count to detect new registrations
  const prevCountRef = useRef(initialRegistrations.length);

  // Split pane resizer state for Spot Desk view (60% form, 40% stream default)
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(60);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth >= 35 && newLeftWidth <= 80) {
        setLeftWidthPercent(newLeftWidth);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing || !splitContainerRef.current || !e.touches[0]) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth >= 35 && newLeftWidth <= 80) {
        setLeftWidthPercent(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing]);

  // ─── Fetch latest registrations from Supabase (separate queries for reliability) ─
  const refreshRegistrations = useCallback(async (silent = false, detectNew = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      // Fetch registrations
      const { data: regs, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !regs) return;

      // Fetch participants separately (more reliable than nested join)
      const { data: participants } = await supabase
        .from("participants")
        .select("*");

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, slug, category");

      const eventsMap = new Map((eventsData || []).map((e: any) => [e.id, e]));

      // Group participants by registration_id for fast lookup
      const partsByRegId: Record<string, any[]> = {};
      (participants || []).forEach((p: any) => {
        if (!partsByRegId[p.registration_id]) partsByRegId[p.registration_id] = [];
        partsByRegId[p.registration_id].push(p);
      });

      const mapped = regs.map((r: any) => ({
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
        participants: (partsByRegId[r.id] || []).map((p: any) => ({
          id: p.id,
          fullName: p.full_name || "Unknown",
          email: p.email || "",
          phone: p.phone || "",
          college: p.college || "",
          department: p.department || "ECE",
          foodPreference: p.food_preference || "Veg",
          isTeamLeader: p.is_team_leader ?? false,
        })),
      }));

      // Show toast when new registration detected
      if (detectNew && mapped.length > prevCountRef.current && prevCountRef.current > 0) {
        const newCount = mapped.length - prevCountRef.current;
        showToast(
          `🔔 ${newCount} New Registration${newCount > 1 ? "s" : ""}!`,
          `Pass: ${mapped[0]?.registrationCode}`,
          "success"
        );
      }
      prevCountRef.current = mapped.length;
      setRegistrationsList(mapped);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, [showToast]);

  // ─── Auto-refresh: Polling every 3s + Supabase real-time ────────────
  useEffect(() => {
    // Immediate first fetch
    refreshRegistrations(true, false);

    // ⏱ Polling every 3 seconds (fallback when Supabase real-time fails)
    const interval = setInterval(() => {
      refreshRegistrations(true, true);
    }, 3000);

    // 🔴 Supabase Real-time subscription (instant push when available)
    const channel = supabase
      .channel("admin-registrations-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        async () => {
          await refreshRegistrations(true, true);
        }
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [refreshRegistrations]);

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
        college: POPULAR_COLLEGES[0],
        department: "ECE",
        foodPreference: "Veg",
        isTeamLeader: true,
      },
    ],
  });

  const filteredRegistrations = registrationsList.filter((r) => {
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

  // Quick Action: Copy Leader's College to All Teammates
  const handleCopyCollegeToAll = () => {
    const leaderCollege = offlineForm.participants[0]?.college;
    if (!leaderCollege) {
      showToast("Notice", "Please enter Leader's college first", "error");
      return;
    }

    const updated = offlineForm.participants.map((p) => ({
      ...p,
      college: leaderCollege,
    }));

    setOfflineForm({ ...offlineForm, participants: updated });
    showToast("College Copied", `Applied '${leaderCollege}' to all members`, "success");
  };

  const addOfflineParticipant = () => {
    const leaderCollege = offlineForm.participants[0]?.college || POPULAR_COLLEGES[0];
    setOfflineForm({
      ...offlineForm,
      participants: [
        ...offlineForm.participants,
        {
          fullName: "",
          email: "",
          phone: "",
          college: leaderCollege,
          department: "ECE",
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
          "Offline Spot Pass Generated!",
          `Pass Code: ${result.registrationId}`,
          "success"
        );

        // Prepend new offline registration to live stream list
        const techEv = events.find((ev) => ev.id === offlineForm.technicalEventId);
        const nonTechEv = events.find((ev) => ev.id === offlineForm.nonTechnicalEventId);

        const newRegObj = {
          id: result.registrationId,
          registrationCode: result.registrationId,
          registrationType: "offline",
          technicalEventId: offlineForm.technicalEventId,
          nonTechnicalEventId: offlineForm.nonTechnicalEventId,
          teamName: offlineForm.teamName,
          status: "CONFIRMED",
          createdAt: new Date().toISOString(),
          technicalEvent: techEv,
          nonTechnicalEvent: nonTechEv,
          participants: offlineForm.participants.map((p) => ({
            id: Math.random().toString(),
            fullName: p.fullName,
            email: p.email,
            phone: p.phone,
            college: p.college,
            department: p.department,
            foodPreference: p.foodPreference,
            isTeamLeader: p.isTeamLeader,
          })),
        };

        setRegistrationsList((prev) => [newRegObj, ...prev]);

        // Reset form for next student entry
        setOfflineForm({
          technicalEventId: technicalEvents[0]?.id || "",
          nonTechnicalEventId: nonTechnicalEvents[0]?.id || "",
          teamName: "",
          participants: [
            {
              fullName: "",
              email: "",
              phone: "",
              college: POPULAR_COLLEGES[0],
              department: "ECE",
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

  // Calculate live metrics
  const totalRegistrations = registrationsList.length;
  const totalParticipants = registrationsList.reduce(
    (acc, r) => acc + (r.participants?.length || 0),
    0
  );
  const onlineRegistrations = registrationsList.filter(
    (r) => r.registrationType === "online"
  ).length;
  const offlineRegistrations = registrationsList.filter(
    (r) => r.registrationType === "offline"
  ).length;
  const totalEvents = events.length;

  // =========================================================================
  // RENDER FULL SCREEN OFFLINE SPOT REGISTRATION DESK (WEBSITE 2)
  // (Main Header & Top Cards Hidden)
  // =========================================================================
  if (isOfflineDeskView) {
    return (
      <div className="h-[calc(100vh-3rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
        {/* Top Header Bar with Back Button */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setIsOfflineDeskView(false)}
            >
              Back to Main Admin Dashboard
            </Button>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  Offline Spot Registration Desk (Desk Volunteer Mode)
                </h2>
                <Badge variant="cyan">LIVE SUPABASE SYNC</Badge>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Register walk-in students physically. Saved directly as <span className="text-amber-400 font-bold">registration_type = 'offline'</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              Live Total: <strong className="text-cyan-400">{registrationsList.length} Passes</strong>
            </span>
          </div>
        </div>

        {/* Resizable 2-Column Split Layout */}
        <div ref={splitContainerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden select-none">
          {/* LEFT COLUMN: Fast Typing Registration Form (Resizable Width) */}
          <div
            style={{ width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${leftWidthPercent}%` : "100%" }}
            className="w-full lg:w-auto h-full flex flex-col p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden shrink-0"
          >
            <div className="shrink-0 flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-semibold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Spot Registration Form
              </h3>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md font-bold">
                TYPE: OFFLINE
              </span>
            </div>

            {/* ENTIRE FORM IS SCROLLABLE TOP-TO-BOTTOM */}
            <form onSubmit={handleOfflineSubmit} className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-2 space-y-4">
              {/* Event Track Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                placeholder="e.g. Offline Circuit Titans"
                value={offlineForm.teamName}
                onChange={(e) => setOfflineForm({ ...offlineForm, teamName: e.target.value })}
              />

              {/* Team Roster Bar & Quick Copy Button */}
              <div className="flex items-center justify-between pt-2">
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Team Roster ({offlineForm.participants.length})
                </h4>

                <div className="flex items-center gap-2">
                  {offlineForm.participants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-3 h-3 text-cyan-400" />}
                      onClick={handleCopyCollegeToAll}
                      title="Copy First Member's college name to all team members"
                    >
                      Same College for All
                    </Button>
                  )}

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
              </div>

              {/* Participants Form Inputs */}
              <div className="space-y-3.5">
                {offlineForm.participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold border-b border-slate-800/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Participant {idx + 1}
                      </span>

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfflineParticipant(idx)}
                          className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Full Name *"
                        placeholder="e.g. Rahul Sharma"
                        value={p.fullName}
                        onChange={(e) =>
                          handleOfflineParticipantChange(idx, "fullName", e.target.value)
                        }
                        required
                      />
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="rahul@student.edu"
                        value={p.email}
                        onChange={(e) =>
                          handleOfflineParticipantChange(idx, "email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Mobile Phone *"
                        placeholder="9876543210"
                        value={p.phone}
                        onChange={(e) =>
                          handleOfflineParticipantChange(idx, "phone", e.target.value)
                        }
                        required
                      />

                      {/* College Name with Autocomplete Datalist */}
                      <div className="w-full space-y-1.5">
                        <label className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                          College / Institution *
                        </label>
                        <input
                          list="college-suggestions"
                          placeholder="e.g. SRM Institute"
                          value={p.college}
                          onChange={(e) =>
                            handleOfflineParticipantChange(idx, "college", e.target.value)
                          }
                          required
                          className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        label="Department *"
                        options={DEPARTMENTS}
                        value={p.department}
                        onChange={(e) =>
                          handleOfflineParticipantChange(idx, "department", e.target.value)
                        }
                      />

                      <Select
                        label="Food Preference *"
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

              {/* Datalist for College Autocomplete */}
              <datalist id="college-suggestions">
                {POPULAR_COLLEGES.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-sm font-semibold tracking-wide py-3.5 mt-2 shadow-xl shadow-cyan-950/40 shrink-0"
                isLoading={submittingOffline}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Offline Registration Pass
              </Button>
            </form>
          </div>

          {/* DRAGGABLE RESIZER DIVIDER BAR BETWEEN PANELS (Desktop Only) */}
          <div
            onMouseDown={handleMouseDownResize}
            onTouchStart={() => setIsResizing(true)}
            className={`hidden lg:flex items-center justify-center w-2.5 hover:w-3.5 bg-slate-800/80 hover:bg-cyan-500/50 cursor-col-resize transition-all rounded-full group shrink-0 select-none ${
              isResizing ? "bg-cyan-500/80 ring-2 ring-cyan-400 w-3.5" : ""
            }`}
            title="Drag left / right to adjust panels size"
          >
            <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-cyan-200 transition-colors" />
          </div>

          {/* RIGHT COLUMN: Live Stream Spot Roster (Fills remaining width) */}
          <div className="flex-1 min-w-0 w-full h-full flex flex-col p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden space-y-3">
            <div className="shrink-0 flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-400" /> Live Registrations Roster Stream
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {registrationsList.length} Total Passes
              </span>
            </div>

            {/* Live Stream List - ALL TEAM PARTICIPANTS SHOWN */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
              {registrationsList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  No registrations in system yet.
                </div>
              ) : (
                registrationsList.map((r, idx) => {
                  const isNewest = idx === 0;
                  const members = r.participants || [];
                  return (
                    <div
                      key={r.id || idx}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isNewest
                          ? "bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/30"
                          : "bg-slate-950/70 border-slate-800/80"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-cyan-400">
                            {r.registrationCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold ${
                              r.registrationType === "offline"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                                : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40"
                            }`}
                          >
                            {r.registrationType}
                          </span>
                          {r.teamName && (
                            <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                              Team: {r.teamName}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono font-bold">
                          {members.length} Member(s)
                        </span>
                      </div>

                      {/* Display Events Summary */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <Badge variant="primary" className="text-[10px] py-0 px-2">
                          {r.technicalEvent?.title || "Tech Track"}
                        </Badge>
                        <Badge variant="cyan" className="text-[10px] py-0 px-2">
                          {r.nonTechnicalEvent?.title || "Non-Tech Track"}
                        </Badge>
                      </div>

                      {/* Display ALL Team Members */}
                      <div className="space-y-2">
                        {members.length === 0 ? (
                          <p className="text-slate-500 italic text-xs">No member details</p>
                        ) : (
                          members.map((p: any, pIdx: number) => (
                            <div
                              key={p.id || pIdx}
                              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-slate-100 font-bold text-xs flex items-center gap-1.5">
                                  <span className="text-cyan-400 font-mono text-[10px]">#{pIdx + 1}</span>
                                  {p.fullName || "N/A"}
                                </p>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    p.foodPreference === "Non-Veg"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  }`}
                                >
                                  {p.foodPreference || "Veg"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 font-mono truncate">{p.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                {p.college} • <span className="text-cyan-400">{p.department || "ECE"}</span> • 📞 {p.phone}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD VIEW (Header & Metrics Shown Only Here)
  // =========================================================================
  return (
    <div className="space-y-8">
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
              {session && <Badge variant="primary">{session.role}</Badge>}
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Live Supabase Cloud Monitor • Logged in as <span className="text-white">{session?.name || "Admin"}</span> ({session?.email || "admin@sparktron.ece"})
            </p>
          </div>
        </div>

        <form action="/api/admin/logout" method="POST">
          <div className="flex items-center gap-2">
            {/* Live status indicator */}
            <span className={`hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border ${isLive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-slate-500 bg-slate-800/50 border-slate-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              {isLive ? "LIVE" : "Connecting..."}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />}
              onClick={() => refreshRegistrations(false)}
            >
              Refresh
            </Button>
            <Button type="submit" variant="ghost" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
              Sign Out
            </Button>
          </div>
        </form>
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

      {/* Search, Filter & Offline Spot Desk Toggle Button */}
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
            onClick={() => setIsOfflineDeskView(true)}
          >
            Offline Spot Reg Desk
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
                <th className="py-3.5 px-4 min-w-[280px]">Participants / Team Details</th>
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
                  const members = r.participants || [];
                  const isOffline = r.registrationType === "offline";
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-cyan-400">
                        {r.registrationCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold ${
                            isOffline
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                              : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40"
                          }`}
                        >
                          {r.registrationType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans space-y-2">
                        {r.teamName && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold mb-1">
                            🚩 Team: {r.teamName}
                          </div>
                        )}

                        {members.length === 0 ? (
                          <p className="text-slate-500 italic text-xs">No member details</p>
                        ) : (
                          members.map((p: any, idx: number) => (
                            <div
                              key={p.id || idx}
                              className={`pl-3 py-1 my-1 border-l-2 rounded-r-lg ${
                                isOffline
                                  ? "border-l-amber-400 bg-amber-500/5"
                                  : "border-l-cyan-400 bg-cyan-500/5"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-slate-100 font-bold text-xs flex items-center gap-1.5">
                                  <span className="text-cyan-400 font-mono text-[10px]">#{idx + 1}</span>
                                  {p.fullName || "N/A"}
                                </p>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    p.foodPreference === "Non-Veg"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  }`}
                                >
                                  {p.foodPreference || "Veg"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 font-mono truncate">{p.email}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                {p.college} • <span className="text-cyan-400">{p.department || "ECE"}</span> • 📞 {p.phone}
                              </p>
                            </div>
                          ))
                        )}
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
                          {members.length} Member(s)
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
                <span className="text-amber-400 font-bold uppercase">
                  {selectedRegistration.registrationType}
                </span>
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
                {selectedRegistration.participants?.length || 0})
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedRegistration.participants?.map((p: any, idx: number) => (
                  <div
                    key={p.id || idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-bold">
                        {p.fullName} {p.isTeamLeader ? "(Leader)" : ""}
                      </p>
                      <p className="text-slate-400 font-mono">{p.email}</p>
                      <p className="text-slate-400">
                        {p.college} • {p.department || "ECE"} • {p.phone}
                      </p>
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
