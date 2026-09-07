"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  EmailMessage,
  EmailSettings,
  EmailRecipientInfo,
  EmailConfigStatus,
  EmailTemplateType,
} from "@/types/email";
import {
  EMAIL_TEMPLATE_DEFINITIONS,
  EMAIL_AVAILABLE_VARIABLES,
  generateHtmlEmail,
  interpolateVariables,
} from "@/lib/email/templateEngine";
import { EmailPreviewCard } from "./EmailPreviewCard";
import { BulkEmailConfirmModal } from "./BulkEmailConfirmModal";
import {
  Mail,
  Send,
  History,
  Settings,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  MapPin,
  HelpCircle,
  Trash2,
  Eye,
  Check,
  Users,
  Layers,
  ChevronRight,
  Filter,
  Inbox,
  Globe,
  Radio,
  FileCode,
} from "lucide-react";

interface EmailDashboardProps {
  initialRegistrations: any[];
  events: any[];
  isLight?: boolean;
}

export function EmailDashboard({
  initialRegistrations,
  events,
  isLight = false,
}: EmailDashboardProps) {
  const { showToast } = useToast();

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<"compose" | "history" | "settings" | "assistant">("compose");

  // Status & Settings State
  const [configStatus, setConfigStatus] = useState<EmailConfigStatus | null>(null);
  const [counts, setCounts] = useState({ total: 0, sent: 0, delivered: 0, failed: 0 });
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Message History State
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("ALL");
  const [inspectingMessage, setInspectingMessage] = useState<EmailMessage | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Compose State
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>("CONFIRMATION");
  const [customSubject, setCustomSubject] = useState("");
  const [customBodyText, setCustomBodyText] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);

  // AI Assistant State
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<Array<{
    role: "assistant" | "user";
    text: string;
    proposal?: any;
  }>>([
    {
      role: "assistant",
      text: "👋 Hello Admin! I am your SPARKTRON Email Assistant. You can ask me:\n• *'Send the quiz link to all Technical Quiz participants'*\n• *'Send registration confirmation to Joseph'*\n• *'Send venue location to all registered participants'*\n• *'How many emails were delivered today?'*",
    },
  ]);
  const [pendingProposal, setPendingProposal] = useState<any | null>(null);

  // Flatten participants into RecipientInfo list
  const eventsMap = new Map(events.map((e) => [e.id, e]));
  const allRecipients: EmailRecipientInfo[] = [];

  (initialRegistrations || []).forEach((r) => {
    const techEv = eventsMap.get(r.technicalEventId);
    const nonTechEv = eventsMap.get(r.nonTechnicalEventId);
    (r.participants || []).forEach((p: any) => {
      allRecipients.push({
        participantId: p.id,
        registrationId: r.id,
        registrationCode: r.registrationCode,
        name: p.fullName || "Participant",
        phone: p.phone || "",
        email: p.email || "",
        college: p.college || "",
        department: p.department || "ECE",
        teamName: r.teamName,
        paymentStatus: p.paymentStatus || r.paymentStatus || "UNPAID",
        foodPreference: p.foodPreference || "Veg",
        technicalEventTitle: techEv?.title,
        nonTechnicalEventTitle: nonTechEv?.title,
        technicalEventSlug: techEv?.slug,
        nonTechnicalEventSlug: nonTechEv?.slug,
      });
    });
  });

  // Audience counts
  const quizCount = allRecipients.filter((r) => `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase().includes("quiz")).length;
  const pptCount = allRecipients.filter((r) => {
    const combined = `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase();
    return combined.includes("paper") || combined.includes("ppt");
  }).length;
  const projectCount = allRecipients.filter((r) => {
    const combined = `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase();
    return combined.includes("project") || combined.includes("expo");
  }).length;
  const paidCount = allRecipients.filter((r) => r.paymentStatus === "PAID").length;
  const unpaidCount = allRecipients.filter((r) => r.paymentStatus !== "PAID").length;

  // Filter recipients based on Audience selector
  const audienceRecipients = allRecipients.filter((r) => {
    if (selectedAudience === "ALL") return true;
    if (selectedAudience === "UNPAID") return r.paymentStatus !== "PAID";
    if (selectedAudience === "PAID") return r.paymentStatus === "PAID";
    if (selectedAudience === "QUIZ") {
      const combined = `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase();
      return combined.includes("quiz");
    }
    if (selectedAudience === "PPT") {
      const combined = `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase();
      return combined.includes("paper") || combined.includes("ppt");
    }
    if (selectedAudience === "PROJECT") {
      const combined = `${r.technicalEventTitle} ${r.technicalEventSlug}`.toLowerCase();
      return combined.includes("project") || combined.includes("expo");
    }
    return true;
  });

  // Fetch status & settings on mount
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/email/status");
      const data = await res.json();
      if (data.success) {
        if (data.config) setConfigStatus(data.config);
        if (data.counts) setCounts(data.counts);
      }
    } catch (e) {
      console.warn("Failed to load Email status:", e);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/email/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn("Failed to load Email settings:", e);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const params = new URLSearchParams();
      if (historyStatusFilter !== "ALL") params.set("status", historyStatusFilter);
      if (historySearch.trim()) params.set("query", historySearch.trim());

      const res = await fetch(`/api/admin/email/messages?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.warn("Failed to load messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  }, [historyStatusFilter, historySearch]);

  useEffect(() => {
    fetchStatus();
    fetchSettings();
  }, [fetchStatus, fetchSettings]);

  useEffect(() => {
    if (activeSubTab === "history") {
      fetchMessages();
    }
  }, [activeSubTab, fetchMessages]);

  // Handle template selection in compose
  useEffect(() => {
    const tmpl = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setCustomSubject(tmpl.defaultSubject);
      setCustomBodyText(tmpl.plainText);
    }
  }, [selectedTemplate]);

  // Sample recipient for live preview
  const sampleRecipient: EmailRecipientInfo = audienceRecipients[0] || allRecipients[0] || {
    name: "Joseph",
    phone: "919840123456",
    email: "joseph@example.com",
    college: "Thamirabharani Engineering College",
    department: "ECE",
    registrationCode: "SPK-2026-5755",
    registrationId: "sample-reg-id",
    technicalEventTitle: "Technical Quiz",
    nonTechnicalEventTitle: "Rythemania",
    paymentStatus: "PAID",
    foodPreference: "Veg",
  };

  const sampleSubject = settings
    ? interpolateVariables(customSubject, sampleRecipient, settings)
    : customSubject;

  const sampleBody = settings
    ? interpolateVariables(customBodyText, sampleRecipient, settings)
    : customBodyText;

  const sampleHtml = settings
    ? generateHtmlEmail({
        recipient: sampleRecipient,
        settings,
        subject: sampleSubject,
        contentBodyText: sampleBody,
      })
    : "<p>Loading email preview...</p>";

  // Save updated settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/email/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Email and Venue settings saved successfully!", "success");
        setSettings(data.settings);
        fetchStatus();
      } else {
        showToast(data.message || "Failed to save settings", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Retry a failed email
  const handleRetryEmail = async (msgId: string) => {
    setRetryingId(msgId);
    try {
      const res = await fetch("/api/admin/email/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msgId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Email retried successfully!", "success");
        fetchMessages();
        fetchStatus();
      } else {
        showToast(data.message || "Retry failed", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Retry request failed", "error");
    } finally {
      setRetryingId(null);
    }
  };

  // Delete message log
  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm("Delete this email log entry?")) return;
    try {
      const res = await fetch(`/api/admin/email/messages?id=${msgId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        showToast("Log entry deleted", "neutral");
      }
    } catch (e) {
      showToast("Failed to delete log", "danger");
    }
  };

  // AI Assistant Submission
  const handleAssistantSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim() || assistantLoading) return;

    const userText = assistantInput.trim();
    setAssistantInput("");
    setAssistantMessages((prev) => [...prev, { role: "user", text: userText }]);
    setAssistantLoading(true);

    try {
      const res = await fetch("/api/admin/email/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: userText,
          registrations: initialRegistrations,
          events,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssistantMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply, proposal: data.proposal },
        ]);
        if (data.proposal) {
          setPendingProposal(data.proposal);
        }
      } else {
        setAssistantMessages((prev) => [
          ...prev,
          { role: "assistant", text: `⚠️ ${data.message || "Sorry, I couldn't process that command."}` },
        ]);
      }
    } catch (err: any) {
      setAssistantMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Connection error while talking to AI assistant." },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const statusFilterOptions = [
    { label: "All Statuses", value: "ALL" },
    { label: "Delivered", value: "Delivered" },
    { label: "Sent", value: "Sent" },
    { label: "Failed", value: "Failed" },
    { label: "Pending", value: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Card */}
        <Card className={`p-4 rounded-xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>Service Status</span>
            <Radio className={`w-4 h-4 ${configStatus?.isConfigured ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              {configStatus?.isConfigured ? "Resend Ready" : "Mailto Fallback"}
            </span>
            <Badge variant={configStatus?.isConfigured ? "success" : "warning"} className="text-xs">
              {configStatus?.provider ? "Resend API" : "Direct"}
            </Badge>
          </div>
          <p className={`text-xs mt-1 truncate ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {configStatus?.senderEmail ? `From: ${configStatus.senderEmail}` : "Set RESEND_API_KEY for live sending"}
          </p>
        </Card>

        {/* Total Dispatched */}
        <Card className={`p-4 rounded-xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>Total Sent</span>
            <Mail className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{counts.total}</span>
            <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>records</span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Audit log count</p>
        </Card>

        {/* Successful Delivery */}
        <Card className={`p-4 rounded-xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>Delivered / Sent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>{counts.delivered + counts.sent}</span>
            <span className={`text-xs font-medium ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
              {counts.total > 0 ? `${Math.round(((counts.delivered + counts.sent) / counts.total) * 100)}%` : "100%"}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Confirmed delivery</p>
        </Card>

        {/* Failed Delivery */}
        <Card className={`p-4 rounded-xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>Failed</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isLight ? "text-rose-700" : "text-rose-400"}`}>{counts.failed}</span>
            {counts.failed > 0 && (
              <button
                onClick={() => {
                  setActiveSubTab("history");
                  setHistoryStatusFilter("Failed");
                }}
                className={`text-xs underline ml-auto font-medium ${isLight ? "text-rose-600 hover:text-rose-800" : "text-rose-300 hover:text-rose-200"}`}
              >
                Review Failed
              </button>
            )}
          </div>
          <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Needs retry or address review</p>
        </Card>
      </div>

      {/* Warning Banner if Not Configured */}
      {!configStatus?.isConfigured && (
        <div className={`rounded-xl p-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm ${
          isLight
            ? "border-amber-300 bg-amber-50 text-amber-900"
            : "border-amber-500/30 bg-amber-500/10 text-amber-200"
        }`}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className={`font-bold ${isLight ? "text-amber-950" : "text-white"}`}>Live Email Dispatch Not Activated:</span>{" "}
              Add <code className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${isLight ? "bg-amber-200/80 text-amber-950" : "bg-amber-950/60 text-amber-300"}`}>RESEND_API_KEY</code> to your environment or configure it in Settings to enable automated sending.
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`shrink-0 ${
              isLight
                ? "border-amber-400 text-amber-900 hover:bg-amber-100 bg-white"
                : "border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
            }`}
            onClick={() => setActiveSubTab("settings")}
          >
            Configure Sender & Key
          </Button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className={`flex flex-wrap items-center gap-2 border-b pb-3 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
        <button
          onClick={() => setActiveSubTab("compose")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeSubTab === "compose"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
              : isLight
              ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Mail className="w-4 h-4" />
          Compose & Broadcast
        </button>

        <button
          onClick={() => setActiveSubTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeSubTab === "history"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
              : isLight
              ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <History className="w-4 h-4" />
          Delivery History & Logs
          {counts.total > 0 && (
            <span className={`ml-1 px-1.5 py-0.2 rounded text-[11px] font-bold ${
              isLight ? "bg-slate-200 text-slate-800" : "bg-slate-900/60 text-cyan-300"
            }`}>
              {counts.total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeSubTab === "settings"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
              : isLight
              ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Settings className="w-4 h-4" />
          Sender & Venue Settings
        </button>

        <button
          onClick={() => setActiveSubTab("assistant")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
            activeSubTab === "assistant"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
              : isLight
              ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs"
              : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Email Assistant
          <Badge variant="cyan" className="text-[10px] px-1.5 py-0">Smart</Badge>
        </button>
      </div>

      {/* SUB-TAB 1: COMPOSE & BROADCAST */}
      {activeSubTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Audience Picker (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Card className={`p-5 rounded-2xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"}`}>
              {/* Audience Selector */}
              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Select Target Audience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "ALL", label: "All Participants", count: allRecipients.length },
                    { id: "QUIZ", label: "Technical Quiz", count: quizCount },
                    { id: "PPT", label: "Paper / PPT", count: pptCount },
                    { id: "PROJECT", label: "Project Expo", count: projectCount },
                    { id: "PAID", label: "Paid Only", count: paidCount },
                    { id: "UNPAID", label: "Pending Payment", count: unpaidCount },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setSelectedAudience(aud.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        selectedAudience === aud.id
                          ? isLight
                            ? "border-cyan-600 bg-cyan-50/90 text-cyan-950 font-bold ring-2 ring-cyan-500 shadow-xs"
                            : "border-cyan-500 bg-cyan-500/15 text-white font-bold ring-1 ring-cyan-500"
                          : isLight
                          ? "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className={`font-bold truncate ${selectedAudience === aud.id ? (isLight ? "text-cyan-950" : "text-white") : (isLight ? "text-slate-800" : "text-slate-200")}`}>
                        {aud.label}
                      </div>
                      <div className={`text-[11px] mt-0.5 font-semibold ${selectedAudience === aud.id ? (isLight ? "text-cyan-800" : "text-cyan-300") : (isLight ? "text-cyan-700" : "text-cyan-400")}`}>
                        {aud.count} recipients
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Picker */}
              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Select Email Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EMAIL_TEMPLATE_DEFINITIONS.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        selectedTemplate === tmpl.id
                          ? isLight
                            ? "border-blue-600 bg-blue-50/90 text-blue-950 font-bold ring-2 ring-blue-500 shadow-xs"
                            : "border-blue-500 bg-blue-500/15 text-white font-bold ring-1 ring-blue-500"
                          : isLight
                          ? "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className={`font-bold truncate ${selectedTemplate === tmpl.id ? (isLight ? "text-blue-950" : "text-white") : (isLight ? "text-slate-800" : "text-slate-200")}`}>
                        {tmpl.label}
                      </div>
                      <div className={`text-[10px] truncate mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {tmpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Email Subject Line
                  </label>
                  <span className={`text-[11px] font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>Supports {"{{variables}}"}</span>
                </div>
                <Input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g., SPARKTRON 2K26 - Registration Confirmed | Pass: {{pass_code}}"
                  className={`text-sm ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                      : "bg-slate-950/70 border-slate-700 text-white"
                  }`}
                />
              </div>

              {/* Variable Chips */}
              <div className="mb-4">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Insert Variables (Click to Add to Message):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EMAIL_AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => setCustomBodyText((prev) => `${prev} ${v.tag} `)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors border ${
                        isLight
                          ? "bg-slate-100 hover:bg-cyan-50 hover:border-cyan-400 border-slate-200 text-cyan-800 font-semibold shadow-2xs"
                          : "bg-slate-800 hover:bg-cyan-950/50 hover:border-cyan-500/50 border-slate-700 text-cyan-300"
                      }`}
                      title={v.description}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body Editor */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    Message Body Content
                  </label>
                  <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Rendered into a responsive, table-based HTML email card
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={customBodyText}
                  onChange={(e) => setCustomBodyText(e.target.value)}
                  className={`w-full rounded-xl p-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed border transition-colors ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-2xs"
                      : "bg-slate-950/70 border-slate-700 text-slate-200"
                  }`}
                  placeholder="Type your message content here..."
                />
              </div>

              {/* Broadcast Action Button */}
              <div className={`flex items-center justify-between pt-3 border-t ${isLight ? "border-slate-200" : "border-slate-800"}`}>
                <div className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Targeting: <span className={`font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>{audienceRecipients.length}</span> recipient{audienceRecipients.length !== 1 ? "s" : ""}
                </div>
                <Button
                  onClick={() => setShowBulkModal(true)}
                  disabled={audienceRecipients.length === 0}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Review & Broadcast ({audienceRecipients.length})
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Email Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Real-Time Recipient Preview
              </span>
              <span className={`text-xs font-semibold truncate max-w-[200px] ${isLight ? "text-cyan-800" : "text-cyan-400"}`}>
                Showing: {sampleRecipient.name} ({sampleRecipient.email || "no email"})
              </span>
            </div>

            <EmailPreviewCard
              subject={sampleSubject}
              htmlContent={sampleHtml}
              recipientEmail={sampleRecipient.email || "student@example.com"}
              recipientName={sampleRecipient.name}
              senderName={settings?.senderName || "SPARKTRON 2K26"}
              senderEmail={settings?.senderEmail || "onboarding@resend.dev"}
              isLight={isLight}
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DELIVERY HISTORY & LOGS */}
      {activeSubTab === "history" && (
        <Card className={`p-5 rounded-2xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"}`}>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? "text-slate-400" : "text-slate-400"}`} />
                <Input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search recipient, email, subject..."
                  className={`pl-9 text-xs ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                      : "bg-slate-950/70 border-slate-700 text-white"
                  }`}
                />
              </div>
              <Select
                options={statusFilterOptions}
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className={`text-xs w-36 ${
                  isLight
                    ? "bg-white border-slate-300 text-slate-900"
                    : "bg-slate-950/70 border-slate-700 text-white"
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMessages}
                disabled={loadingMessages}
                className={`text-xs ${
                  isLight
                    ? "border-slate-300 text-slate-700 hover:bg-slate-100 bg-white"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${loadingMessages ? "animate-spin" : ""}`} />
                Refresh Logs
              </Button>
            </div>
          </div>

          {/* Messages Table */}
          {loadingMessages ? (
            <div className={`py-12 text-center ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-600" />
              Loading email delivery logs...
            </div>
          ) : messages.length === 0 ? (
            <div className={`py-12 text-center ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              <Inbox className={`w-8 h-8 mx-auto mb-2 ${isLight ? "text-slate-400" : "text-slate-600"}`} />
              <p className="text-sm font-semibold">No email logs found matching your filters.</p>
              <p className="text-xs mt-1">Send an email or register a participant to generate logs.</p>
            </div>
          ) : (
            <div className={`overflow-x-auto rounded-xl border ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-950/40"}`}>
              <table className="w-full text-left text-xs">
                <thead className={`uppercase tracking-wider text-[11px] border-b ${
                  isLight ? "bg-slate-100/80 text-slate-700 border-slate-200 font-bold" : "bg-slate-950/80 text-slate-400 border-slate-800"
                }`}>
                  <tr>
                    <th className="py-3 px-3">Date / Time</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Subject / Template</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-slate-200" : "divide-slate-800/60"}`}>
                  {messages.map((m) => {
                    const isSuccess = m.status === "Delivered" || m.status === "Sent";
                    const isFail = m.status === "Failed";
                    return (
                      <tr key={m.id} className={`transition-colors ${isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/40"}`}>
                        <td className={`py-3 px-3 whitespace-nowrap font-mono text-[11px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                          {m.created_at ? new Date(m.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{m.recipient_name || "Participant"}</div>
                          <div className={`text-[11px] font-mono ${isLight ? "text-cyan-800 font-semibold" : "text-cyan-300"}`}>{m.recipient_email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className={`font-semibold truncate max-w-xs ${isLight ? "text-slate-900" : "text-slate-200"}`}>{m.subject || "SPARKTRON 2K26 Update"}</div>
                          <div className={`text-[10px] uppercase mt-0.5 ${isLight ? "text-slate-500 font-medium" : "text-slate-400"}`}>Template: {m.template_name}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <Badge
                            variant={isSuccess ? "success" : isFail ? "danger" : "warning"}
                            className="text-[10px]"
                          >
                            {m.status}
                          </Badge>
                          {m.error_message && (
                            <div className="text-[10px] text-rose-500 truncate max-w-[150px] mt-0.5 font-medium" title={m.error_message}>
                              {m.error_message}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectingMessage(m)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLight
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                              }`}
                              title="Inspect Details & Content"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {isFail && (
                              <button
                                onClick={() => handleRetryEmail(m.id)}
                                disabled={retryingId === m.id}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 border border-rose-300 transition-colors"
                                title="Retry sending email"
                              >
                                <RotateCcw className={`w-3.5 h-3.5 ${retryingId === m.id ? "animate-spin" : ""}`} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLight
                                  ? "bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 border border-slate-200"
                                  : "bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300"
                              }`}
                              title="Delete log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* SUB-TAB 3: SENDER & VENUE SETTINGS */}
      {activeSubTab === "settings" && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card className={`p-6 rounded-2xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"}`}>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  <Mail className="w-4 h-4 text-cyan-600" />
                  Email Sender Configuration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Sender Name
                    </label>
                    <Input
                      value={settings.senderName}
                      onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                      placeholder="SPARKTRON 2K26"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                      required
                    />
                    <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>Display name seen in inbox</span>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      From Email Address
                    </label>
                    <Input
                      type="email"
                      value={settings.senderEmail}
                      onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                      placeholder="onboarding@resend.dev"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                      required
                    />
                    <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>e.g. onboarding@resend.dev or custom domain</span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Reply-To Email Address
                    </label>
                    <Input
                      type="email"
                      value={settings.replyToEmail || ""}
                      onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                      placeholder="hello.sparktron@gmail.com"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                    />
                    <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>Where student replies will be delivered</span>
                  </div>
                </div>

                <hr className={`my-4 ${isLight ? "border-slate-200" : "border-slate-800"}`} />

                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Venue Information (Injected via {"{{venue_name}}"}, {"{{venue_address}}"})
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Venue College Name
                    </label>
                    <Input
                      value={settings.venueName}
                      onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                      placeholder="Thamirabharani Engineering College"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Complete Venue Address
                    </label>
                    <Input
                      value={settings.venueAddress}
                      onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                      placeholder="Chidambaranagar, Vagaikulam, Thatchanallur, Tirunelveli, Tamil Nadu 627358"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Google Maps Location Link ({"{{map_link}}"})
                    </label>
                    <Input
                      value={settings.mapLink}
                      onChange={(e) => setSettings({ ...settings, mapLink: e.target.value })}
                      placeholder="https://maps.google.com/?q=Thamirabharani+Engineering+College"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                      required
                    />
                  </div>
                </div>

                <hr className={`my-4 ${isLight ? "border-slate-200" : "border-slate-800"}`} />

                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  <Globe className="w-4 h-4 text-cyan-600" />
                  Event Links (Injected via {"{{quiz_link}}"}, {"{{ppt_upload_link}}"}, {"{{project_link}}"})
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Technical Quiz Portal Link ({"{{quiz_link}}"})
                    </label>
                    <Input
                      value={settings.quizLink || ""}
                      onChange={(e) => setSettings({ ...settings, quizLink: e.target.value })}
                      placeholder="https://quiz.sparktron.live/round1"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Paper Presentation PPT Upload Link ({"{{ppt_upload_link}}"})
                    </label>
                    <Input
                      value={settings.pptUploadLink || ""}
                      onChange={(e) => setSettings({ ...settings, pptUploadLink: e.target.value })}
                      placeholder="https://forms.gle/sparktron-ppt-upload"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Project Expo Project Link ({"{{project_link}}"})
                    </label>
                    <Input
                      value={settings.projectLink || ""}
                      onChange={(e) => setSettings({ ...settings, projectLink: e.target.value })}
                      placeholder="https://forms.gle/sparktron-project-expo"
                      className={`text-sm ${
                        isLight
                          ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white"
                          : "bg-slate-950/70 border-slate-700 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingSettings}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-6 shadow-md shadow-cyan-500/20"
                  >
                    {savingSettings ? "Saving Settings..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Setup Guide (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className={`p-5 rounded-2xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"}`}>
              <h4 className={`text-sm font-bold flex items-center gap-2 mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Resend Integration Guide
              </h4>
              <p className={`text-xs leading-relaxed mb-3 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                SPARKTRON 2K26 uses <strong>Resend</strong> for transactional emails (3,000 free emails/month).
              </p>
              <div className={`space-y-2 text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                <div className="flex items-start gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                    isLight ? "bg-cyan-50 border-cyan-400 text-cyan-800" : "bg-cyan-950 border-cyan-500 text-cyan-300"
                  }`}>1</span>
                  <span>Create a free account at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-cyan-600 font-bold underline">resend.com</a></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                    isLight ? "bg-cyan-50 border-cyan-400 text-cyan-800" : "bg-cyan-950 border-cyan-500 text-cyan-300"
                  }`}>2</span>
                  <span>Create an API Key and add it to your <code className={`px-1 rounded font-bold ${isLight ? "bg-slate-100 text-slate-800 border border-slate-200" : "text-white bg-slate-800"}`}>.env.local</code> as <code className="text-cyan-600 font-bold">RESEND_API_KEY</code></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                    isLight ? "bg-cyan-50 border-cyan-400 text-cyan-800" : "bg-cyan-950 border-cyan-500 text-cyan-300"
                  }`}>3</span>
                  <span>Verify your domain or use the default test sender <code className={`px-1 rounded font-bold ${isLight ? "bg-slate-100 text-slate-800 border border-slate-200" : "text-white bg-slate-800"}`}>onboarding@resend.dev</code></span>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded-xl border text-[11px] ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-800 text-slate-400"
              }`}>
                <div className={`font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-300"}`}>Environment Variable:</div>
                <code className={`block p-2 rounded break-all font-mono font-bold ${
                  isLight ? "bg-slate-100 text-cyan-800 border border-slate-200" : "bg-slate-900 text-cyan-300"
                }`}>
                  RESEND_API_KEY=re_123456789
                </code>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AI EMAIL ASSISTANT */}
      {activeSubTab === "assistant" && (
        <Card className={`p-5 rounded-2xl border transition-colors ${isLight ? "bg-white border-slate-200 shadow-sm text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"}`}>
          <div className={`flex items-center justify-between pb-4 border-b ${isLight ? "border-slate-200" : "border-slate-800"}`}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-600" />
              <h3 className={`font-bold text-base ${isLight ? "text-slate-900" : "text-white"}`}>AI Email Assistant</h3>
            </div>
            <Badge variant="cyan" className="text-xs">Smart Filter & Broadcast</Badge>
          </div>

          {/* Chat Messages */}
          <div className={`my-4 h-96 overflow-y-auto space-y-3 p-3 rounded-xl border ${
            isLight ? "bg-slate-50/80 border-slate-200" : "bg-slate-950/60 border-slate-800/80"
          }`}>
            {assistantMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                    isLight ? "bg-cyan-100 border-cyan-300 text-cyan-800" : "bg-cyan-900/60 border-cyan-500/50 text-cyan-300"
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-lg whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-xs"
                      : isLight
                      ? "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-xs font-medium"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-sm"
                  }`}
                >
                  {m.text}

                  {m.proposal && (
                    <div className={`mt-3 p-2.5 rounded-xl border text-xs ${
                      isLight ? "bg-slate-50 border-cyan-300 text-slate-800" : "bg-slate-950/80 border-cyan-500/30 text-slate-200"
                    }`}>
                      <div className={`font-bold mb-1 ${isLight ? "text-cyan-900" : "text-cyan-300"}`}>Proposed Broadcast:</div>
                      <div className={isLight ? "text-slate-700" : "text-slate-300"}>Audience: <strong>{m.proposal.audience}</strong> ({m.proposal.count} recipients)</div>
                      <div className={isLight ? "text-slate-700" : "text-slate-300"}>Template: <strong>{m.proposal.template}</strong></div>
                      <Button
                        size="sm"
                        className="mt-2.5 w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                        onClick={() => {
                          setSelectedAudience(m.proposal.audience || "ALL");
                          setSelectedTemplate(m.proposal.template || "CONFIRMATION");
                          setActiveSubTab("compose");
                          showToast("Loaded proposal into Compose window", "neutral");
                        }}
                      >
                        Open In Broadcast Composer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {assistantLoading && (
              <div className="flex gap-2 items-center text-xs text-cyan-600 p-2 font-semibold">
                <RotateCcw className="w-4 h-4 animate-spin" />
                Thinking and querying participants...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              "Send Quiz link to Technical Quiz participants",
              "Send Paper Presentation upload link to PPT participants",
              "Send Venue details to Joseph",
              "How many emails have been sent so far?",
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAssistantInput(prompt)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors text-left border ${
                  isLight
                    ? "bg-white hover:bg-cyan-50 hover:border-cyan-400 border-slate-200 text-slate-700 hover:text-cyan-900 shadow-2xs font-medium"
                    : "bg-slate-800 hover:bg-cyan-950/40 hover:border-cyan-500/50 border-slate-700/60 text-cyan-300"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAssistantSend} className="flex gap-2">
            <Input
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              placeholder="e.g., Send Quiz link to Technical Quiz participants..."
              className={`text-xs ${
                isLight
                  ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                  : "bg-slate-950/80 border-slate-700 text-white"
              }`}
              disabled={assistantLoading}
            />
            <Button
              type="submit"
              disabled={!assistantInput.trim() || assistantLoading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shrink-0 text-xs px-4 font-bold shadow-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Ask
            </Button>
          </form>
        </Card>
      )}

      {/* Bulk Confirm Modal */}
      <BulkEmailConfirmModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        recipients={audienceRecipients}
        templateType={selectedTemplate}
        customSubject={customSubject}
        customMessage={customBodyText}
        onComplete={() => {
          fetchStatus();
          fetchMessages();
          showToast(`Broadcast completed to ${audienceRecipients.length} recipients!`, "success");
        }}
      />

      {/* Inspect Message Modal */}
      {inspectingMessage && (
        <Modal
          isOpen={!!inspectingMessage}
          onClose={() => setInspectingMessage(null)}
          title="Email Message Inspection"
          maxWidth="lg"
        >
          <div className={`space-y-4 text-xs ${isLight ? "text-slate-800" : "text-slate-200"}`}>
            <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
            }`}>
              <div>
                <span className={isLight ? "text-slate-500" : "text-slate-400"}>Recipient:</span>
                <div className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{inspectingMessage.recipient_name}</div>
                <div className={`font-mono ${isLight ? "text-cyan-800 font-semibold" : "text-cyan-400"}`}>{inspectingMessage.recipient_email}</div>
              </div>
              <div>
                <span className={isLight ? "text-slate-500" : "text-slate-400"}>Status:</span>
                <div className="mt-1">
                  <Badge variant={inspectingMessage.status === "Delivered" ? "success" : "danger"}>
                    {inspectingMessage.status}
                  </Badge>
                </div>
                {inspectingMessage.provider_message_id && (
                  <div className={`text-[10px] font-mono mt-1 truncate ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                    ID: {inspectingMessage.provider_message_id}
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className={`font-bold block mb-1 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Subject:</span>
              <div className={`p-2.5 rounded-lg border font-semibold ${
                isLight ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-950 border-slate-800 text-white"
              }`}>
                {inspectingMessage.subject}
              </div>
            </div>

            {inspectingMessage.error_message && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg dark:bg-rose-950/40 dark:border-rose-500/40 dark:text-rose-300">
                <span className="font-bold">Error Message: </span>
                {inspectingMessage.error_message}
              </div>
            )}

            <div>
              <span className={`font-bold block mb-1 ${isLight ? "text-slate-700" : "text-slate-400"}`}>Email Content:</span>
              <div className={`p-3 rounded-lg border whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed ${
                isLight ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-300"
              }`}>
                {inspectingMessage.message_content}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingMessage(null)}
                className={isLight ? "border-slate-300 text-slate-700 hover:bg-slate-100" : "border-slate-700 text-slate-300"}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
