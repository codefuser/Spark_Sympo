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
  FileText,
  FileSpreadsheet,
  Printer,
  Code2,
  ChevronDown,
  GripVertical,
  Sun,
  Moon,
  Bell,
  Mail,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Check,
} from "lucide-react";
import { exportToJSON, exportToCSV, exportToExcel, exportToPDF } from "@/lib/utils/exportUtils";

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

function formatDateSafe(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr || "";
  }
}

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
  const [deletingRegistrationTarget, setDeletingRegistrationTarget] = useState<any | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

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

  // Light / Dark Theme Switcher State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("adminTheme") as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminTheme", nextTheme);
    }
  };

  const isLight = theme === "light";

  // Admin Dashboard Tabs & Contact Messages Notifications State
  const [activeAdminTab, setActiveAdminTab] = useState<"registrations" | "notifications">("registrations");
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [selectedMessageDetail, setSelectedMessageDetail] = useState<any | null>(null);

  const fetchContactMessages = useCallback(async (silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (res.ok && data.success) {
        setMessagesList(data.messages || []);
      }
    } catch (err) {
      console.warn("Failed to fetch contact messages:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchContactMessages(true);
  }, [fetchContactMessages]);

  const unreadMessagesCount = messagesList.filter((m) => m.status === "UNREAD").length;

  const handleToggleMessageStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "UNREAD" ? "READ" : "UNREAD";
    setMessagesList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (err) {
      showToast("Error", "Failed to update notification status", "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    setMessagesList((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Deleted", "Notification message removed", "success");
      }
    } catch (err) {
      showToast("Error", "Failed to delete notification", "error");
    }
  };

  // Edit & Delete Pass States
  const [editingRegistration, setEditingRegistration] = useState<any | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);
  const [deletingRegId, setDeletingRegId] = useState<string | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  const handleUpdateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegistration) return;
    setSubmittingEdit(true);
    try {
      const res = await fetch(`/api/admin/registrations/${editingRegistration.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRegistration),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Pass Updated", "Registration details saved successfully", "success");
        setEditingRegistration(null);
        setSelectedRegistration(null);
        refreshRegistrations(true);
      } else {
        showToast("Update Failed", data.message || "Could not update registration", "error");
      }
    } catch (err: any) {
      showToast("Error", err.message || "Failed to update registration pass", "error");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const confirmDeletePass = async (regId: string) => {
    if (!regId) return;
    setSubmittingDelete(true);
    try {
      // 1. Direct Supabase deletion with .select() verification
      await supabase.from("participants").delete().eq("registration_id", regId).select();
      const { data: deletedRegs, error: regErr } = await supabase
        .from("registrations")
        .delete()
        .eq("id", regId)
        .select();

      // 2. Server API delete fallback
      const apiRes = await fetch(`/api/admin/registrations/${regId}`, { method: "DELETE" });
      const apiData = await apiRes.json();

      const wasDeletedInCloud = deletedRegs && deletedRegs.length > 0;
      const wasDeletedInApi = apiRes.ok && apiData.success;

      if (!wasDeletedInCloud && !wasDeletedInApi) {
        showToast(
          "Delete Blocked by Supabase RLS",
          "Supabase RLS is blocking DELETE operations. Please run the SQL command in Supabase SQL Editor to enable delete permissions.",
          "error"
        );
      } else {
        showToast("Pass Permanently Deleted", "Registration pass and all member details removed from database", "success");
        // Update local state immediately
        setRegistrationsList((prev) => prev.filter((r) => r.id !== regId));
        setSelectedRegistration(null);
        setEditingRegistration(null);
        setDeletingRegistrationTarget(null);
        refreshRegistrations(true);
      }
    } catch (err: any) {
      showToast("Error", err.message || "Failed to delete pass from database", "error");
    } finally {
      setSubmittingDelete(false);
      setDeletingRegistrationTarget(null);
    }
  };

  const handleMarkAsPaid = async (regId: string) => {
    setUpdatingPaymentId(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Payment Updated", "Pass marked as PAID (Cash Received)", "success");
        if (selectedRegistration) {
          setSelectedRegistration({ ...selectedRegistration, paymentStatus: "PAID" });
        }
        refreshRegistrations(true);
      } else {
        showToast("Error", data.message || "Failed to update payment status", "error");
      }
    } catch (err: any) {
      showToast("Error", "Failed to update payment status", "error");
    } finally {
      setUpdatingPaymentId(null);
    }
  };

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

  // ─── Instant Realtime + Fast Silent Background Sync ──────────────────
  useEffect(() => {
    // Initial fetch on mount
    refreshRegistrations(true, false);
    fetchContactMessages(true);

    // ⏱ Fast Silent background auto-sync (No spinning loaders, completely seamless!)
    const interval = setInterval(() => {
      refreshRegistrations(true, true);
      fetchContactMessages(true);
    }, 3000);

    // 🔴 Supabase Real-time subscription for Registrations
    const regChannel = supabase
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

    // 🔴 Supabase Real-time subscription for Contact Messages (Instant push!)
    const msgChannel = supabase
      .channel("admin-contact-messages-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        async (payload) => {
          await fetchContactMessages(true);
          if (payload.eventType === "INSERT") {
            showToast(
              "📬 New Student Message Received!",
              `From: ${payload.new?.name || "Student"} — ${payload.new?.subject || "Inquiry"}`,
              "info"
            );
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(regChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [refreshRegistrations, fetchContactMessages, showToast]);

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
      <div className={`min-h-screen transition-colors duration-200 -m-4 sm:-m-8 p-4 sm:p-8 space-y-4 flex flex-col ${isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100 circuit-bg"}`}>
        {/* Top Header Bar with Back Button & Theme Switcher */}
        <div className={`shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm transition-colors duration-200 ${isLight ? "bg-white border-slate-200 text-slate-900 shadow-xs" : "bg-slate-900/90 border-slate-800 text-white"}`}>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setIsOfflineDeskView(false)}
            >
              Back to Main Admin Dashboard
            </Button>

            <div className="h-6 w-[1px] bg-slate-300 dark:bg-slate-800 hidden sm:block"></div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold font-mono flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  Offline Spot Registration Desk (Desk Volunteer Mode)
                </h2>
                <Badge variant="success">LIVE SUPABASE SYNC</Badge>
              </div>
              <p className={`text-[11px] font-mono mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                Register walk-in students physically. Saved directly as <span className="text-amber-600 dark:text-amber-400 font-bold">registration_type = 'offline'</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
              onClick={toggleTheme}
              title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
            >
              {isLight ? "Dark Mode" : "Light Mode"}
            </Button>

            <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold shadow-xs ${isLight ? "bg-slate-50 text-slate-800 border-slate-300" : "bg-slate-800/80 text-slate-300 border-slate-700"}`}>
              Live Total: <strong className="text-blue-600 dark:text-cyan-400">{registrationsList.length} Passes</strong>
            </span>
          </div>
        </div>

        {/* Resizable 2-Column Split Layout */}
        <div ref={splitContainerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden select-none">
          {/* LEFT COLUMN: Fast Typing Registration Form (Resizable Width) */}
          <div
            style={{ width: typeof window !== "undefined" && window.innerWidth >= 1024 ? `${leftWidthPercent}%` : "100%" }}
            className={`w-full lg:w-auto h-full flex flex-col p-5 rounded-2xl border shadow-sm overflow-hidden shrink-0 transition-colors duration-200 ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900/80 border-slate-800 text-slate-100"}`}
          >
            <div className={`shrink-0 flex items-center justify-between border-b pb-3 mb-3 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
              <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> Spot Registration Form
              </h3>
              <Badge variant="warning">TYPE: OFFLINE</Badge>
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
                <h4 className={`text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Team Roster ({offlineForm.participants.length})
                </h4>

                <div className="flex items-center gap-2">
                  {offlineForm.participants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-3 h-3 text-slate-500" />}
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
                    leftIcon={<UserPlus className="w-3.5 h-3.5 text-slate-500" />}
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
                    className={`p-4 rounded-xl border space-y-3 relative transition-colors duration-200 ${isLight ? "bg-slate-50/80 border-slate-200 text-slate-900 shadow-xs" : "bg-slate-950/70 border-slate-800 text-slate-100"}`}
                  >
                    <div className={`flex items-center justify-between text-xs font-semibold border-b pb-2 ${isLight ? "text-slate-700 border-slate-200" : "text-slate-300 border-slate-800/80"}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Participant {idx + 1}
                      </span>

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfflineParticipant(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
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
                        <label className={`block text-xs font-mono font-semibold tracking-wider uppercase ${isLight ? "text-slate-700" : "text-slate-300"}`}>
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
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400/20 font-medium ${isLight ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 shadow-xs" : "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-400"}`}
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
                className="w-full text-sm font-semibold tracking-wide py-3.5 mt-2 shadow-xs shrink-0 cursor-pointer"
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
            className={`hidden lg:flex items-center justify-center w-2.5 hover:w-3.5 transition-all rounded-full group shrink-0 select-none cursor-col-resize ${isLight ? "bg-slate-200 hover:bg-slate-400" : "bg-slate-800 hover:bg-slate-700"} ${
              isResizing ? "bg-slate-500 ring-2 ring-slate-400 w-3.5" : ""
            }`}
            title="Drag left / right to adjust panels size"
          >
            <GripVertical className={`w-4 h-4 transition-colors ${isLight ? "text-slate-400 group-hover:text-slate-700" : "text-slate-500 group-hover:text-slate-300"}`} />
          </div>

          {/* RIGHT COLUMN: Live Stream Spot Roster (Fills remaining width) */}
          <div className={`flex-1 min-w-0 w-full h-full flex flex-col p-5 rounded-2xl border shadow-sm overflow-hidden space-y-3 transition-colors duration-200 ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900/80 border-slate-800 text-slate-100"}`}>
            <div className={`shrink-0 flex items-center justify-between border-b pb-3 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
              <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Live Registrations Roster Stream
              </h3>
              <span className={`text-xs font-mono font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
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
                        isLight
                          ? (isNewest ? "bg-blue-50/50 border-blue-300 shadow-xs text-slate-900" : "bg-slate-50/70 border-slate-200 text-slate-900")
                          : (isNewest ? "bg-slate-900 border-slate-700 shadow-md text-slate-100" : "bg-slate-950/70 border-slate-800 text-slate-100")
                      }`}
                    >
                      <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                            {r.registrationCode}
                          </span>
                          <Badge variant={r.registrationType === "offline" ? "warning" : "success"}>
                            {r.registrationType}
                          </Badge>
                          {r.teamName && (
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${isLight ? "bg-slate-100 text-slate-800 border-slate-300" : "bg-slate-800 text-slate-300 border-slate-700"}`}>
                              Team: {r.teamName}
                            </span>
                          )}
                        </div>

                        <span className={`text-[11px] font-mono font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          {members.length} Member(s)
                        </span>
                      </div>

                      {/* Display Events Summary */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <Badge variant="primary" className="text-[10px] py-0 px-2">
                          {r.technicalEvent?.title || "Tech Track"}
                        </Badge>
                        <Badge variant="neutral" className="text-[10px] py-0 px-2">
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
                              className={`p-3 rounded-lg border space-y-1.5 transition-colors ${isLight ? "bg-white border-slate-200 text-slate-900 shadow-2xs" : "bg-slate-900/90 border-slate-800 text-slate-100"}`}
                            >
                              <div className="flex items-center justify-between">
                                <p className={`font-bold text-xs flex items-center gap-1.5 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
                                  <span className="text-slate-500 font-mono text-[10px]">#{pIdx + 1}</span>
                                  {p.fullName || "N/A"}
                                </p>
                                <Badge variant={p.foodPreference === "Non-Veg" ? "danger" : "success"} size="sm">
                                  {p.foodPreference || "Veg"}
                                </Badge>
                              </div>
                              <p className={`text-[11px] font-mono truncate ${isLight ? "text-slate-600 font-medium" : "text-slate-300"}`}>{p.email}</p>
                              <p className={`text-[10px] font-mono truncate ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                                {p.college} • <span className="font-bold text-slate-800 dark:text-slate-200">{p.department || "ECE"}</span> • 📞 {p.phone}
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

  // =========================================================================
  // MAIN ADMIN DASHBOARD VIEW (Header & Metrics Shown Only Here)
  // =========================================================================
  return (
    <div className={`min-h-screen transition-all duration-300 -m-4 sm:-m-8 p-4 sm:p-8 space-y-8 ${isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100 circuit-bg"}`}>
      {/* Admin Header Bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all duration-200 ${
        isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : "bg-card border-slate-800 shadow-xl text-white"
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-xl ${
            isLight ? "bg-slate-100 border-slate-300 text-slate-900 shadow-2xs" : "bg-slate-800/80 border-slate-700 text-slate-100"
          }`}>
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-xl font-bold font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
                SPARKTRON 2K26 Registered Participants Portal
              </h1>
              {session && <Badge variant="primary">{session.role}</Badge>}
            </div>
            <p className={`text-xs font-mono mt-0.5 ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              Live Supabase Cloud Monitor • Logged in as <span className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{session?.name || "Admin"}</span> ({session?.email || "admin@sparktron.ece"})
            </p>
          </div>
        </div>

        <form action="/api/admin/logout" method="POST">
          <div className="flex items-center gap-2">
            {/* Live status indicator */}
            <span className={`hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border font-bold ${
              isLive
                ? isLight ? "text-emerald-800 bg-emerald-50 border-emerald-300" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : isLight ? "text-slate-600 bg-slate-100 border-slate-300" : "text-slate-500 bg-slate-800/50 border-slate-700"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {isLive ? "LIVE" : "Connecting..."}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
              onClick={toggleTheme}
              title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
            >
              {isLight ? "Dark Mode" : "Light Mode"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing || loadingMessages ? "animate-spin" : ""}`} />}
              onClick={async () => {
                await Promise.all([refreshRegistrations(false), fetchContactMessages()]);
              }}
            >
              Refresh
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Sign Out
            </Button>
          </div>
        </form>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminTab("registrations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeAdminTab === "registrations"
              ? isLight
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-cyan-500 text-slate-950 font-extrabold shadow-sm"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Ticket className="w-4 h-4" />
          Registrations & Passes ({filteredRegistrations.length})
        </button>

        <button
          onClick={() => setActiveAdminTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all relative ${
            activeAdminTab === "notifications"
              ? isLight
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-cyan-500 text-slate-950 font-extrabold shadow-sm"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          Student Messages & Notifications ({messagesList.length})
          {unreadMessagesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
              {unreadMessagesCount} NEW
            </span>
          )}
        </button>
      </div>

      {activeAdminTab === "notifications" ? (
        /* STUDENT INQUIRY NOTIFICATIONS DESK VIEW */
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isLight ? "bg-white border-slate-200 text-slate-900 shadow-xs" : "bg-slate-900/90 border-slate-800 text-white"}`}>
            <div>
              <h2 className="text-lg font-bold font-mono flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" /> Student Inquiry Notifications Desk
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Inquiries sent from Contact Us page. Registered student emails are automatically cross-referenced!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold ${isLight ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-amber-950/60 text-amber-300 border-amber-800"}`}>
                Unread: {unreadMessagesCount}
              </span>
            </div>
          </div>

          {messagesList.length === 0 ? (
            <Card className="p-12 text-center text-slate-500 font-mono text-sm">
              No student inquiry notifications logged yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {messagesList.map((msg) => {
                const isUnread = msg.status === "UNREAD";
                const matchedParts = msg.participantDetails || [];

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessageDetail(msg);
                      if (isUnread) {
                        handleToggleMessageStatus(msg.id, "UNREAD");
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group hover:scale-[1.01] ${
                      isUnread
                        ? isLight
                          ? "bg-gradient-to-br from-amber-50/80 via-white to-white border-amber-300 shadow-xs border-l-4 border-l-amber-500 hover:border-amber-400"
                          : "bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-900/90 border-amber-800/80 shadow-md border-l-4 border-l-amber-500 hover:border-amber-700"
                        : isLight
                        ? "bg-white border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs"
                        : "bg-slate-900/70 border-slate-800 hover:border-cyan-500/50"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Card Header: Avatar, Name & Status */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            msg.isRegistered
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-cyan-400"
                          }`}>
                            {msg.name?.charAt(0).toUpperCase() || "S"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold text-sm font-mono text-slate-900 dark:text-white truncate">
                              {msg.name}
                            </h3>
                            <p className="text-[11px] font-mono text-slate-500 truncate">
                              ✉️ {msg.email}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {isUnread ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider animate-pulse">
                              NEW UNREAD
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800">
                              READ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges Bar */}
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.isRegistered ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/80 flex items-center gap-1 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> REGISTERED ({matchedParts.length})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 flex items-center gap-1">
                            🌐 GUEST
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                          📞 {msg.phone || "N/A"}
                        </span>
                      </div>

                      {/* Subject & Message Preview */}
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                          Subj: {msg.subject}
                        </p>
                        <p className="text-xs font-sans text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          "{msg.message}"
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{formatDateSafe(msg.created_at)}</span>
                      <span className="text-blue-600 dark:text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                        Full Details <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Live Registration Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <Card className={`p-5 transition-all duration-200 ${isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono uppercase font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>Total Registrations</span>
            <div className={`p-2 rounded-lg ${isLight ? "bg-blue-50 text-blue-600" : "bg-slate-800 text-blue-400"}`}>
              <Calendar className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            </div>
          </div>
          <p className={`text-3xl font-extrabold font-mono ${isLight ? "text-slate-900" : "text-white"}`}>{totalRegistrations}</p>
        </Card>

        <Card className={`p-5 transition-all duration-200 ${isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono uppercase font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>Total Participants</span>
            <div className={`p-2 rounded-lg ${isLight ? "bg-emerald-50 text-emerald-600" : "bg-slate-800 text-emerald-400"}`}>
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{totalParticipants}</p>
        </Card>

        <Card className={`p-5 transition-all duration-200 ${isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono uppercase font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>Online / Offline</span>
            <div className={`p-2 rounded-lg ${isLight ? "bg-purple-50 text-purple-600" : "bg-slate-800 text-purple-400"}`}>
              <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
            <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{onlineRegistrations}</span> / <span className="text-amber-600 dark:text-amber-400 font-extrabold">{offlineRegistrations}</span>
          </p>
        </Card>

        <Card className={`p-5 transition-all duration-200 ${isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono uppercase font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>Active Event Tracks</span>
            <div className={`p-2 rounded-lg ${isLight ? "bg-amber-50 text-amber-600" : "bg-slate-800 text-amber-400"}`}>
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{totalEvents}</p>
        </Card>
      </div>

      {/* Search, Filter & Offline Spot Desk Toggle Button */}
      <div className={`p-4 rounded-xl border flex flex-col lg:flex-row items-center justify-between gap-4 transition-all duration-200 relative overflow-visible z-30 ${isLight ? "bg-white border-slate-200 shadow-xs text-slate-900" : "bg-card border-primary/15 text-slate-100 backdrop-blur-md"}`}>
        <div className="w-full lg:w-96">
          <Input
            placeholder="Search by Code, Name, Email, College, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className={`w-4 h-4 ${isLight ? "text-slate-400" : ""}`} />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative overflow-visible z-30">
          <div className="w-44 relative z-30">
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

          <div className="w-52 relative z-30">
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
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setIsOfflineDeskView(true)}
          >
            Offline Spot Reg Desk
          </Button>

          {/* Interactive Multi-Format Export Dropdown */}
          <div className="relative z-40">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
              rightIcon={<ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportOpen ? "rotate-180" : ""}`} />}
              onClick={() => setIsExportOpen(!isExportOpen)}
            >
              Export Data
            </Button>

            {isExportOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl z-50 py-1.5 transition-all animate-in fade-in zoom-in-95 ${
                  isLight ? "bg-white border-slate-200 text-slate-900 shadow-slate-300/50" : "bg-slate-900 border-slate-800 text-slate-100 shadow-black/80"
                }`}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Select Export Format
                </div>

                <button
                  onClick={() => {
                    exportToExcel(filteredRegistrations);
                    setIsExportOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold font-mono text-left transition-colors ${
                    isLight ? "hover:bg-emerald-50 text-emerald-900" : "hover:bg-emerald-950/40 text-emerald-300"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold">Export to Excel (.xls)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Spreadsheet with formatting</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    exportToPDF(filteredRegistrations);
                    setIsExportOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold font-mono text-left transition-colors ${
                    isLight ? "hover:bg-rose-50 text-rose-900" : "hover:bg-rose-950/40 text-rose-300"
                  }`}
                >
                  <Printer className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div>
                    <p className="font-bold">Export to PDF / Print</p>
                    <p className="text-[10px] text-slate-500 font-normal">Printable summary roster</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    exportToCSV(filteredRegistrations);
                    setIsExportOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold font-mono text-left transition-colors ${
                    isLight ? "hover:bg-blue-50 text-blue-900" : "hover:bg-blue-950/40 text-blue-300"
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold">Export to CSV (.csv)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Excel & UTF-8 compatible</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    exportToJSON(filteredRegistrations);
                    setIsExportOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold font-mono text-left transition-colors ${
                    isLight ? "hover:bg-purple-50 text-purple-900" : "hover:bg-purple-950/40 text-purple-300"
                  }`}
                >
                  <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div>
                    <p className="font-bold">Export to JSON (.json)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Raw JSON dataset</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registered Passes Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs transition-all duration-200 ${isLight ? "bg-white border-slate-300" : "bg-slate-900/60 border-slate-800"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className={`border-b-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${isLight ? "bg-slate-100 border-slate-300 text-slate-800 font-extrabold" : "bg-slate-900 border-slate-800 text-slate-300"}`}>
              <tr>
                <th className="py-3 px-2 text-center w-10">#</th>
                <th className="py-3 px-2.5 whitespace-nowrap min-w-[130px]">Pass Code</th>
                <th className="py-3 px-2 text-center w-16">Type</th>
                <th className="py-3 px-2.5 min-w-[200px]">Student / Team Roster</th>
                <th className="py-3 px-2.5 min-w-[160px]">College & Dept</th>
                <th className="py-3 px-2.5 whitespace-nowrap">Phone</th>
                <th className="py-3 px-2.5">Registered Events</th>
                <th className="py-3 px-2 text-center whitespace-nowrap">Payment</th>
                <th className="py-3 px-2 text-center whitespace-nowrap">Food</th>
              </tr>
            </thead>
            <tbody className={`font-sans text-xs ${isLight ? "text-slate-900" : "text-slate-100"}`}>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`py-12 text-center font-mono text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    No registrations found matching your filter query.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r, index) => {
                  const members = r.participants || [];
                  const isOffline = r.registrationType === "offline";
                  const payStatus = r.paymentStatus || (isOffline ? "PAID" : "UNPAID");

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRegistration(r)}
                      title="Click row to inspect, edit, or delete registration pass"
                      className={`border-b cursor-pointer transition-colors ${
                        isLight
                          ? "border-slate-200 hover:bg-blue-50/60 text-slate-900 even:bg-slate-50/40"
                          : "border-slate-800/80 hover:bg-slate-800/60 text-slate-100 even:bg-slate-900/30"
                      }`}
                    >
                      {/* S.No */}
                      <td className="py-3.5 px-2 text-center align-top font-mono font-semibold text-slate-500 text-xs">
                        {index + 1}
                      </td>

                      {/* Pass Code (Single Line Code + Date below) */}
                      <td className="py-3.5 px-2.5 align-top whitespace-nowrap">
                        <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                          {r.registrationCode}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5" suppressHydrationWarning>
                          {formatDateSafe(r.createdAt)}
                        </span>
                      </td>

                      {/* Registration Type */}
                      <td className="py-3.5 px-2 align-top text-center">
                        <Badge variant={isOffline ? "warning" : "success"}>
                          {r.registrationType}
                        </Badge>
                      </td>

                      {/* Student Roster (Name + Email below) */}
                      <td className="py-3 px-2.5 align-top">
                        {r.teamName && (
                          <div className="h-7 mb-1.5 flex items-center">
                            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold shadow-xs ${isLight ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-blue-950/60 border-blue-800 text-blue-200"}`}>
                              🚩 {r.teamName} ({members.length})
                            </div>
                          </div>
                        )}

                        {members.length === 0 ? (
                          <div className="h-11 flex items-center text-xs font-mono text-slate-400 italic">No members listed</div>
                        ) : (
                          <div className="space-y-1.5">
                            {members.map((p: any, idx: number) => (
                              <div
                                key={p.id || idx}
                                className={`h-[50px] flex flex-col justify-center px-2.5 rounded-lg border transition-all ${
                                  members.length > 1
                                    ? isLight
                                      ? "bg-slate-50/80 border-slate-200/90 shadow-2xs"
                                      : "bg-slate-800/40 border-slate-700/60"
                                    : "border-transparent"
                                }`}
                              >
                                <p className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold ${
                                      idx === 0
                                        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                                        : "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                                    }`}
                                  >
                                    #{idx + 1} {idx === 0 ? "Leader" : "Member"}
                                  </span>
                                  <span className="truncate max-w-[140px]" title={p.fullName}>{p.fullName}</span>
                                </p>
                                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {p.email}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* College & Dept */}
                      <td className="py-3 px-2.5 align-top">
                        {r.teamName && (
                          <div className="h-7 mb-1.5" />
                        )}

                        {members.length === 0 ? (
                          <div className="h-11 flex items-center text-xs font-mono text-slate-400 italic">-</div>
                        ) : (
                          <div className="space-y-1.5">
                            {members.map((p: any, idx: number) => (
                              <div
                                key={idx}
                                className={`h-[50px] flex flex-col justify-center px-2.5 rounded-lg border ${
                                  members.length > 1
                                    ? isLight
                                      ? "bg-slate-50/80 border-slate-200/90 shadow-2xs"
                                      : "bg-slate-800/40 border-slate-700/60"
                                    : "border-transparent"
                                }`}
                              >
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]" title={p.college}>
                                  {p.college || "N/A"}
                                </p>
                                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                                  Dept: {p.department || "ECE"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Phone Number (Strict Line-by-Line Alignment with Roster Cards) */}
                      <td className="py-3 px-2.5 align-top font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {r.teamName && (
                          <div className="h-7 mb-1.5" />
                        )}

                        {members.length === 0 ? (
                          <div className="h-11 flex items-center text-xs font-mono text-slate-400 italic">-</div>
                        ) : (
                          <div className="space-y-1.5">
                            {members.map((p: any, idx: number) => (
                              <div
                                key={idx}
                                className={`h-[50px] flex items-center px-2.5 rounded-lg border font-semibold text-xs whitespace-nowrap ${
                                  members.length > 1
                                    ? isLight
                                      ? "bg-slate-50/80 border-slate-200/90 shadow-2xs"
                                      : "bg-slate-800/40 border-slate-700/60"
                                    : "border-transparent"
                                }`}
                              >
                                📞 {p.phone || "N/A"}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Registered Events */}
                      <td className="py-3 px-2.5 align-top">
                        {r.teamName && (
                          <div className="h-7 mb-1.5" />
                        )}

                        <div className="space-y-1.5 py-1">
                          {r.technicalEvent && (
                            <Badge variant="primary" size="sm" className="block text-[11px] truncate max-w-[160px]">
                              Tech: {r.technicalEvent.title}
                            </Badge>
                          )}
                          {r.nonTechnicalEvent && (
                            <Badge variant="neutral" size="sm" className="block text-[11px] truncate max-w-[160px]">
                              Non-Tech: {r.nonTechnicalEvent.title}
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Payment Status (Individual per Person Line-by-Line Alignment) */}
                      <td className="py-3 px-2.5 align-top text-center whitespace-nowrap">
                        {r.teamName && (
                          <div className="h-7 mb-1.5" />
                        )}

                        {members.length === 0 ? (
                          <div className="h-11 flex items-center justify-center text-xs font-mono text-slate-400 italic">-</div>
                        ) : (
                          <div className="space-y-1.5">
                            {members.map((p: any, idx: number) => {
                              const pPayStatus = p.paymentStatus || r.paymentStatus || (isOffline ? "PAID" : "UNPAID");
                              return (
                                <div
                                  key={idx}
                                  className={`h-[50px] flex items-center justify-center px-2.5 rounded-lg border ${
                                    members.length > 1
                                      ? isLight
                                        ? "bg-slate-50/80 border-slate-200/90 shadow-2xs"
                                        : "bg-slate-800/40 border-slate-700/60"
                                      : "border-transparent"
                                  }`}
                                >
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-2xs ${
                                      pPayStatus === "PAID"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800"
                                        : pPayStatus === "PENDING"
                                        ? "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800"
                                        : "bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        pPayStatus === "PAID" ? "bg-emerald-500 animate-pulse" : pPayStatus === "PENDING" ? "bg-amber-500" : "bg-rose-500"
                                      }`}
                                    />
                                    {pPayStatus === "PAID" ? "PAID" : pPayStatus === "PENDING" ? "PENDING" : "UNPAID"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Food (Individual per Person Line-by-Line Alignment) */}
                      <td className="py-3 px-2.5 align-top text-center whitespace-nowrap">
                        {r.teamName && (
                          <div className="h-7 mb-1.5" />
                        )}

                        {members.length === 0 ? (
                          <div className="h-11 flex items-center justify-center text-xs font-mono text-slate-400 italic">-</div>
                        ) : (
                          <div className="space-y-1.5">
                            {members.map((p: any, idx: number) => {
                              const isNonVeg = (p.foodPreference || "").toLowerCase().includes("non");
                              return (
                                <div
                                  key={idx}
                                  className={`h-[50px] flex items-center justify-center px-2.5 rounded-lg border ${
                                    members.length > 1
                                      ? isLight
                                        ? "bg-slate-50/80 border-slate-200/90 shadow-2xs"
                                        : "bg-slate-800/40 border-slate-700/60"
                                      : "border-transparent"
                                  }`}
                                >
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs border ${
                                      isNonVeg
                                        ? "bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/80"
                                        : "bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700/80"
                                    }`}
                                  >
                                    <span>{isNonVeg ? "🍗" : "🌿"}</span>
                                    {isNonVeg ? "Non-Veg" : "Veg"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {/* Registration Details, Payment Verification & Management Modal */}
      {selectedRegistration && (
        <Modal
          isOpen={!!selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          title={`Registration Pass — ${selectedRegistration.registrationCode}`}
          description={`Registered on ${formatDateSafe(selectedRegistration.createdAt)} • Status: ${selectedRegistration.status || "CONFIRMED"}`}
          maxWidth="lg"
        >
          <div className="space-y-4 py-2">
            {/* Header info & Payment Summary */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${isLight ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-900/90 border-slate-800 text-slate-100"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <p>
                  <span className="text-slate-500 font-medium">Technical Track:</span>{" "}
                  <strong className="text-blue-600 dark:text-cyan-400 font-bold">
                    {selectedRegistration.technicalEvent?.title}
                  </strong>
                </p>
                <p>
                  <span className="text-slate-500 font-medium">Non-Technical Track:</span>{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">
                    {selectedRegistration.nonTechnicalEvent?.title}
                  </strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-slate-500 font-medium">Payment Status:</span>{" "}
                  <Badge variant={selectedRegistration.paymentStatus === "PAID" ? "success" : "danger"} className="ml-1 font-bold">
                    {selectedRegistration.paymentStatus === "PAID" ? "PAID 🟢" : "UNPAID / PENDING 🔴"}
                  </Badge>
                  {selectedRegistration.transactionId && (
                    <span className="ml-2 font-mono text-slate-600 dark:text-slate-300">
                      UTR: <strong>{selectedRegistration.transactionId}</strong>
                    </span>
                  )}
                </div>

                {selectedRegistration.paymentStatus !== "PAID" && (
                  <Button
                    size="sm"
                    variant="cyan"
                    onClick={() => handleMarkAsPaid(selectedRegistration.id)}
                    isLoading={updatingPaymentId === selectedRegistration.id}
                  >
                    Mark as Paid (Offline Cash)
                  </Button>
                )}
              </div>
            </div>

            {/* Participant Roster Details */}
            <div className="space-y-2">
              <h4 className={`text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Participant Details (
                {selectedRegistration.participants?.length || 0})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedRegistration.participants?.map((p: any, idx: number) => (
                  <div
                    key={p.id || idx}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${isLight ? "bg-white border-slate-200 text-slate-900 shadow-2xs" : "bg-slate-900/90 border-slate-800 text-slate-100"}`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-slate-500 font-mono text-xs">#{idx + 1}</span>
                        {p.fullName} {p.isTeamLeader ? "(Leader)" : ""}
                      </p>
                      <p className="font-mono text-slate-600 dark:text-slate-400">{p.email} • 📞 {p.phone}</p>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {p.college} • <strong className="text-slate-800 dark:text-slate-200">{p.department || "ECE"}</strong>
                      </p>
                    </div>

                    <Badge variant={p.foodPreference === "Non-Veg" ? "danger" : "success"}>
                      {p.foodPreference}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Management Actions: Edit, Delete, Close */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setDeletingRegistrationTarget(selectedRegistration)}
                isLoading={submittingDelete}
              >
                Delete Pass
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Copy className="w-4 h-4" />}
                  onClick={() => {
                    setEditingRegistration({
                      id: selectedRegistration.id,
                      technicalEventId: selectedRegistration.technicalEventId || events[0]?.id,
                      nonTechnicalEventId: selectedRegistration.nonTechnicalEventId || events[0]?.id,
                      teamName: selectedRegistration.teamName || "",
                      registrationType: selectedRegistration.registrationType || "online",
                      paymentStatus: selectedRegistration.paymentStatus || "UNPAID",
                      transactionId: selectedRegistration.transactionId || "",
                      participants: (selectedRegistration.participants || []).map((p: any) => ({
                        fullName: p.fullName || "",
                        email: p.email || "",
                        phone: p.phone || "",
                        college: p.college || "",
                        department: p.department || "ECE",
                        foodPreference: p.foodPreference || "Veg",
                      })),
                    });
                  }}
                >
                  Edit Pass Details
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedRegistration(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT PASS MODAL */}
      {editingRegistration && (
        <Modal
          isOpen={!!editingRegistration}
          onClose={() => setEditingRegistration(null)}
          title="Edit Registration Pass Details"
          description="Update participant information, college, department, event tracks, or payment status."
          maxWidth="xl"
        >
          <form onSubmit={handleUpdateRegistration} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Technical Event Track"
                value={editingRegistration.technicalEventId}
                onChange={(e) => setEditingRegistration({ ...editingRegistration, technicalEventId: e.target.value })}
                options={technicalEvents.map((ev) => ({ label: ev.title, value: ev.id }))}
              />

              <Select
                label="Non-Technical Event Track"
                value={editingRegistration.nonTechnicalEventId}
                onChange={(e) => setEditingRegistration({ ...editingRegistration, nonTechnicalEventId: e.target.value })}
                options={nonTechnicalEvents.map((ev) => ({ label: ev.title, value: ev.id }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Team Name (Optional)"
                value={editingRegistration.teamName}
                onChange={(e) => setEditingRegistration({ ...editingRegistration, teamName: e.target.value })}
              />

              <Select
                label="Registration Type"
                value={editingRegistration.registrationType}
                onChange={(e) => setEditingRegistration({ ...editingRegistration, registrationType: e.target.value })}
                options={[
                  { label: "Online", value: "online" },
                  { label: "Offline", value: "offline" },
                ]}
              />

              <Select
                label="Payment Status"
                value={editingRegistration.paymentStatus}
                onChange={(e) => setEditingRegistration({ ...editingRegistration, paymentStatus: e.target.value })}
                options={[
                  { label: "PAID 🟢", value: "PAID" },
                  { label: "PENDING ⏳", value: "PENDING" },
                  { label: "UNPAID 🔴", value: "UNPAID" },
                ]}
              />
            </div>

            {/* Edit Participants List */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                Participant Details ({editingRegistration.participants?.length || 0})
              </h4>

              {editingRegistration.participants?.map((p: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-900/80">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Participant #{idx + 1}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name *"
                      value={p.fullName}
                      onChange={(e) => {
                        const updated = [...editingRegistration.participants];
                        updated[idx].fullName = e.target.value;
                        setEditingRegistration({ ...editingRegistration, participants: updated });
                      }}
                      required
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      value={p.email}
                      onChange={(e) => {
                        const updated = [...editingRegistration.participants];
                        updated[idx].email = e.target.value;
                        setEditingRegistration({ ...editingRegistration, participants: updated });
                      }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Mobile Phone *"
                      value={p.phone}
                      onChange={(e) => {
                        const updated = [...editingRegistration.participants];
                        updated[idx].phone = e.target.value;
                        setEditingRegistration({ ...editingRegistration, participants: updated });
                      }}
                      required
                    />
                    <Input
                      label="College / Institution *"
                      value={p.college}
                      onChange={(e) => {
                        const updated = [...editingRegistration.participants];
                        updated[idx].college = e.target.value;
                        setEditingRegistration({ ...editingRegistration, participants: updated });
                      }}
                      required
                    />
                    <Select
                      label="Department *"
                      value={p.department}
                      onChange={(e) => {
                        const updated = [...editingRegistration.participants];
                        updated[idx].department = e.target.value;
                        setEditingRegistration({ ...editingRegistration, participants: updated });
                      }}
                      options={DEPARTMENTS}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingRegistration(null)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                isLoading={submittingEdit}
              >
                Save Registration Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CUSTOM THEME-STYLED DELETE CONFIRMATION MODAL */}
      {deletingRegistrationTarget && (
        <Modal
          isOpen={!!deletingRegistrationTarget}
          onClose={() => setDeletingRegistrationTarget(null)}
          maxWidth="md"
        >
          <div className="text-center py-3 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                Delete Registration Pass?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Are you sure you want to permanently delete registration pass{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-mono font-extrabold underline decoration-rose-500">
                  {deletingRegistrationTarget.registrationCode}
                </strong>{" "}
                from the database? All participant roster records will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingRegistrationTarget(null)}
                disabled={submittingDelete}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                isLoading={submittingDelete}
                onClick={() => confirmDeletePass(deletingRegistrationTarget.id)}
              >
                Yes, Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* STUDENT INQUIRY FULL DETAILS MODAL */}
      {selectedMessageDetail && (
        <Modal
          isOpen={!!selectedMessageDetail}
          onClose={() => setSelectedMessageDetail(null)}
          title={`Student Inquiry — ${selectedMessageDetail.name}`}
          description={`Received: ${formatDateSafe(selectedMessageDetail.created_at)}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">Contact Details</span>
                {selectedMessageDetail.isRegistered ? (
                  <Badge variant="success">REGISTERED STUDENT Pass</Badge>
                ) : (
                  <Badge variant="warning">GUEST / UNREGISTERED</Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Name:</span>{" "}
                  <strong className="text-slate-900 dark:text-slate-100">{selectedMessageDetail.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{" "}
                  <a href={`mailto:${selectedMessageDetail.email}`} className="text-blue-600 dark:text-cyan-400 font-bold underline">
                    {selectedMessageDetail.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{" "}
                  <a href={`tel:${selectedMessageDetail.phone}`} className="text-blue-600 dark:text-cyan-400 font-bold underline">
                    {selectedMessageDetail.phone || "N/A"}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{" "}
                  <strong className={selectedMessageDetail.status === "UNREAD" ? "text-amber-500 font-bold" : "text-emerald-500"}>
                    {selectedMessageDetail.status}
                  </strong>
                </div>
              </div>
            </div>

            {/* Subject & Full Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">Subject</label>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {selectedMessageDetail.subject}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">Full Message Content</label>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-sans text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedMessageDetail.message}
              </div>
            </div>

            {/* Matched Registered Student Pass Information */}
            {selectedMessageDetail.isRegistered && selectedMessageDetail.participantDetails?.length > 0 && (
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <h4 className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Pass Roster
                </h4>
                {selectedMessageDetail.participantDetails.map((part: any, i: number) => (
                  <div key={i} className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    • <strong>{part.fullName}</strong> ({part.email}) — {part.college} ({part.department})
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  handleDeleteMessage(selectedMessageDetail.id);
                  setSelectedMessageDetail(null);
                }}
              >
                Delete Notification
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleToggleMessageStatus(selectedMessageDetail.id, selectedMessageDetail.status);
                    setSelectedMessageDetail({
                      ...selectedMessageDetail,
                      status: selectedMessageDetail.status === "UNREAD" ? "READ" : "UNREAD",
                    });
                  }}
                >
                  Mark as {selectedMessageDetail.status === "UNREAD" ? "Read ✓" : "Unread ⏳"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedMessageDetail(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
