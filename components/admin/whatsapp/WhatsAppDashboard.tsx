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
  WhatsAppMessage,
  WhatsAppSettings,
  RecipientInfo,
  WhatsAppConfigStatus,
  WhatsAppTemplateType,
} from "@/types/whatsapp";
import {
  TEMPLATE_DEFINITIONS,
  AVAILABLE_VARIABLES,
  interpolateVariables,
} from "@/lib/whatsapp/templateEngine";
import { generateWaMeLink } from "@/lib/whatsapp/metaClient";
import { WhatsAppPreviewCard } from "./WhatsAppPreviewCard";
import { BulkSendConfirmModal } from "./BulkSendConfirmModal";
import { WhatsAppComposerModal } from "./WhatsAppComposerModal";
import {
  MessageSquare,
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
} from "lucide-react";

interface WhatsAppDashboardProps {
  initialRegistrations: any[];
  events: any[];
  isLight?: boolean;
}

export function WhatsAppDashboard({
  initialRegistrations,
  events,
  isLight = false,
}: WhatsAppDashboardProps) {
  const { showToast } = useToast();

  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<"compose" | "history" | "settings" | "assistant">("compose");

  // Status & Settings State
  const [configStatus, setConfigStatus] = useState<WhatsAppConfigStatus | null>(null);
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Message History State
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("ALL");
  const [inspectingMessage, setInspectingMessage] = useState<WhatsAppMessage | null>(null);

  // Compose State
  const [selectedAudience, setSelectedAudience] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateType>("CONFIRMATION");
  const [customBodyText, setCustomBodyText] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [previewTab, setPreviewTab] = useState<"editor" | "preview">("editor");

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
      text: "👋 Hello Admin! I am your SPARKTRON WhatsApp Assistant. You can tell me:\n• *'Send the quiz link to everyone registered for Technical Quiz'*\n• *'Send registration confirmation to Joseph'*\n• *'Send venue location to all registered participants'*",
    },
  ]);
  const [pendingProposal, setPendingProposal] = useState<any | null>(null);

  // Extract all participants into flattened RecipientInfo list
  const eventsMap = new Map(events.map((e) => [e.id, e]));
  const allRecipients: RecipientInfo[] = [];

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
      const res = await fetch("/api/admin/whatsapp/status");
      const data = await res.json();
      if (data.success && data.config) {
        setConfigStatus(data.config);
      }
    } catch (e) {
      console.warn("Failed to load WhatsApp status:", e);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn("Failed to load WhatsApp settings:", e);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const params = new URLSearchParams();
      if (historyStatusFilter !== "ALL") params.set("status", historyStatusFilter);
      if (historySearch.trim()) params.set("query", historySearch.trim());

      const res = await fetch(`/api/admin/whatsapp/messages?${params.toString()}`);
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
    const tmpl = TEMPLATE_DEFINITIONS.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setCustomBodyText(tmpl.content);
    }
  }, [selectedTemplate]);

  // Current preview for first audience recipient
  const sampleRecipient = audienceRecipients[0] || allRecipients[0] || {
    name: "Joseph",
    phone: "919840123456",
    college: "St. Joseph's Institute of Technology",
    department: "ECE",
    registrationCode: "SPK-2026-5755",
    registrationId: "sample-reg-id",
    technicalEventTitle: "Technical Quiz",
    nonTechnicalEventTitle: "Rythemania",
    paymentStatus: "PAID",
    foodPreference: "Veg",
  };

  const samplePersonalizedText = settings
    ? interpolateVariables(customBodyText, sampleRecipient, settings)
    : customBodyText;

  // Save updated settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("WhatsApp and Venue settings saved successfully!", "success");
        setSettings(data.settings);
      } else {
        showToast(data.message || "Failed to save settings", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // AI Assistant command submit
  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const userText = assistantInput.trim();
    setAssistantInput("");
    setAssistantMessages((prev) => [...prev, { role: "user", text: userText }]);
    setAssistantLoading(true);

    try {
      const res = await fetch("/api/admin/whatsapp/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ask", query: userText }),
      });
      const data = await res.json();
      if (data.success) {
        setAssistantMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.message,
            proposal: data.requiresConfirmation ? data : undefined,
          },
        ]);
        if (data.requiresConfirmation) {
          setPendingProposal(data);
        }
      } else {
        setAssistantMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.message || "Could not process request." },
        ]);
      }
    } catch (err: any) {
      setAssistantMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error communicating with WhatsApp Assistant." },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  // Retry failed message
  const handleRetrySingle = async (msgId: string) => {
    try {
      const res = await fetch("/api/admin/whatsapp/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: [msgId] }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Message retry completed!", "success");
        fetchMessages();
        fetchStatus();
      } else {
        showToast(data.message || "Retry failed", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Retry failed", "error");
    }
  };

  // Delete log message
  const handleDeleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/whatsapp/messages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Log entry deleted", "info");
        fetchMessages();
      }
    } catch (e) {
      showToast("Failed to delete log entry", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & API Status Bar */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-900 shadow-xs"
            : "bg-slate-900/90 border-slate-800 text-white"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-mono flex items-center gap-2">
                WhatsApp Messaging Control Center
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Direct Meta WhatsApp Cloud API integration with automatic multi-participant personalization
              </p>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {configStatus?.isConfigured ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Cloud API Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>WhatsApp Not Configured (Web Fallback Ready)</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Configuration Diagnostics Banner (shown if not configured) */}
      {configStatus && !configStatus.isConfigured && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isLight
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-amber-950/40 border-amber-800/80 text-amber-200"
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5 font-mono text-xs">
            <h4 className="font-bold text-sm">
              WhatsApp Cloud API Setup Required for Automated Server Dispatches
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To send messages automatically directly from the server, configure these environment variables in your{" "}
              <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">.env</code> file:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold">
                WHATSAPP_ACCESS_TOKEN
              </span>
              <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold">
                WHATSAPP_PHONE_NUMBER_ID
              </span>
              <span className="px-2 py-1 rounded bg-slate-500/10 border border-slate-500/30 text-slate-500 dark:text-slate-400">
                WHATSAPP_BUSINESS_ACCOUNT_ID (optional)
              </span>
              <span className="px-2 py-1 rounded bg-slate-500/10 border border-slate-500/30 text-slate-500 dark:text-slate-400">
                WHATSAPP_API_URL (optional)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              💡 <em>Note:</em> You can still use the <strong>"Open in WhatsApp Web / App"</strong> button to send any personalized message directly with zero configuration!
            </p>
          </div>
        </div>
      )}

      {/* 3. Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <Card className={`p-4 border ${isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Total Sent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {configStatus?.totalSent ?? 0}
          </p>
          <span className="text-[10px] text-emerald-500 font-bold">Dispatched Successfully</span>
        </Card>

        <Card className={`p-4 border ${isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Failed Dispatches</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {configStatus?.totalFailed ?? 0}
          </p>
          <span className="text-[10px] text-rose-500 font-bold">Needs Retry / Invalid No</span>
        </Card>

        <Card className={`p-4 border ${isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Total Logged</span>
            <History className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {configStatus?.totalMessages ?? 0}
          </p>
          <span className="text-[10px] text-slate-400">Audit History Records</span>
        </Card>

        <Card className={`p-4 border ${isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>Audience Roster</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {allRecipients.length}
          </p>
          <span className="text-[10px] text-purple-500 font-bold">Registered Participants</span>
        </Card>
      </div>

      {/* 4. Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("compose")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeSubTab === "compose"
              ? isLight
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500 text-slate-950 font-extrabold shadow-xs"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Send className="w-4 h-4" />
          Compose & Broadcast
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeSubTab === "history"
              ? isLight
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500 text-slate-950 font-extrabold shadow-xs"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          Message History & Logs ({messages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeSubTab === "settings"
              ? isLight
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500 text-slate-950 font-extrabold shadow-xs"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          Venue & Event Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("assistant")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeSubTab === "assistant"
              ? isLight
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-cyan-500 text-slate-950 font-extrabold shadow-xs"
              : isLight
              ? "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          AI WhatsApp Assistant
        </button>
      </div>

      {/* 5. SUB-TAB 1: COMPOSE & BROADCAST */}
      {activeSubTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          {/* Left Column: Composer Controls */}
          <div className="lg:col-span-7 space-y-4">
            <Card className={`p-5 rounded-2xl border space-y-4 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-slate-800"}`}>
              {/* Audience Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Target Audience:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {audienceRecipients.length} Participants
                  </span>
                </label>
                <Select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  options={[
                    { label: `All Registered Participants (${allRecipients.length})`, value: "ALL" },
                    { label: "Technical Quiz Participants", value: "QUIZ" },
                    { label: "Paper Presentation Participants", value: "PPT" },
                    { label: "Project Expo Participants", value: "PROJECT" },
                    { label: "Unpaid / Pending Payments Only", value: "UNPAID" },
                    { label: "Confirmed Paid Participants Only", value: "PAID" },
                  ]}
                />
              </div>

              {/* Template Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Template:
                </label>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as WhatsAppTemplateType)}
                  options={TEMPLATE_DEFINITIONS.map((t) => ({
                    label: t.label,
                    value: t.id,
                  }))}
                />
              </div>

              {/* Dynamic Variables Quick-Insertion Chips */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Insert Dynamic Variables:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => setCustomBodyText((prev) => `${prev} ${v.tag} `)}
                      title={v.description}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border transition-all ${
                        isLight
                          ? "bg-slate-50 border-slate-300 text-blue-700 hover:bg-blue-50"
                          : "bg-slate-950 border-slate-700 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-500/50"
                      }`}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Template Content:
                </label>
                <textarea
                  value={customBodyText}
                  onChange={(e) => setCustomBodyText(e.target.value)}
                  placeholder="Write your message here..."
                  rows={9}
                  className={`w-full p-3.5 rounded-xl border font-sans text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                {/* Fallback WhatsApp Web button for sample recipient */}
                <a
                  href={generateWaMeLink(sampleRecipient.phone, samplePersonalizedText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                    isLight
                      ? "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      : "border-emerald-800/80 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60"
                  }`}
                  title="Test sending immediately via WhatsApp Web"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in WhatsApp Web
                </a>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setShowBulkModal(true)}
                  disabled={audienceRecipients.length === 0}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Broadcast to {audienceRecipients.length} Participants
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Realistic Live Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-500" />
                Live WhatsApp Mockup Preview
              </span>
              <span className="text-[10px] text-slate-400">
                Showing sample for: <strong>{sampleRecipient.name}</strong>
              </span>
            </div>

            <WhatsAppPreviewCard
              recipientName={sampleRecipient.name}
              recipientPhone={sampleRecipient.phone}
              messageContent={samplePersonalizedText}
              isLight={isLight}
            />

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Data Integrity Guaranteed:
              </p>
              <p>
                Every recipient will strictly receive their own name, phone, pass code, and only event links for events they specifically registered for.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 2: MESSAGE HISTORY & LOGS */}
      {activeSubTab === "history" && (
        <div className="space-y-4 font-mono">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search recipient name, phone, or message content..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                options={[
                  { label: "All Statuses", value: "ALL" },
                  { label: "Sent / Delivered", value: "Sent" },
                  { label: "Failed", value: "Failed" },
                  { label: "Pending", value: "Pending" },
                ]}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={fetchMessages}
                isLoading={loadingMessages}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Message History Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`border-b text-slate-500 uppercase text-[10px] ${isLight ? "bg-slate-50" : "bg-slate-900"}`}>
                  <tr>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Content</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Sent At</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 ${isLight ? "bg-white" : "bg-slate-900/60"}`}>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                        {loadingMessages ? "Loading messages..." : "No WhatsApp messages found matching filters."}
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => {
                      const isSent = msg.status === "Sent" || msg.status === "Delivered";
                      const isFailed = msg.status === "Failed";

                      return (
                        <tr
                          key={msg.id}
                          className={`transition-colors ${
                            isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/50"
                          }`}
                        >
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            {msg.recipient_name}
                          </td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {msg.recipient_phone}
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="neutral" size="sm">
                              {msg.message_type}
                            </Badge>
                          </td>
                          <td
                            className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-[240px] truncate cursor-pointer"
                            onClick={() => setInspectingMessage(msg)}
                            title="Click to view full message"
                          >
                            {msg.message_content}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isSent
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300"
                                  : isFailed
                                  ? "bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300"
                                  : "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSent ? "bg-emerald-500" : isFailed ? "bg-rose-500" : "bg-amber-500"
                                }`}
                              />
                              {msg.status}
                            </span>
                            {msg.error_message && (
                              <p className="text-[10px] text-rose-500 truncate max-w-[150px] mt-0.5" title={msg.error_message}>
                                {msg.error_message}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                            {msg.sent_at ? new Date(msg.sent_at).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isFailed && (
                                <button
                                  type="button"
                                  onClick={() => handleRetrySingle(msg.id)}
                                  className="p-1 rounded-lg border border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                  title="Retry message"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <a
                                href={generateWaMeLink(msg.recipient_phone, msg.message_content)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                title="Open in WhatsApp Web"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDeleteLog(msg.id)}
                                className="p-1 rounded-lg border border-slate-300 text-slate-400 hover:text-rose-500 hover:border-rose-300"
                                title="Delete log entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 3: VENUE & EVENT SETTINGS */}
      {activeSubTab === "settings" && settings && (
        <form onSubmit={handleSaveSettings} className="space-y-6 font-mono max-w-4xl">
          <Card className={`p-6 rounded-2xl border space-y-5 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-slate-800"}`}>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Venue & Location Settings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configured venue and map link are automatically injected into the {"{{venue_name}}"}, {"{{venue_address}}"} and {"{{map_link}}"} variables.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Venue Name"
                value={settings.venueName}
                onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                required
              />

              <Input
                label="Clickable Google Maps URL"
                value={settings.mapLink}
                onChange={(e) => setSettings({ ...settings, mapLink: e.target.value })}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Venue Address"
                  value={settings.venueAddress}
                  onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Event Submission & Portal Links
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Injected strictly into participants registered for the corresponding event tracks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Technical Quiz Portal Link"
                value={settings.quizLink}
                onChange={(e) => setSettings({ ...settings, quizLink: e.target.value })}
                required
              />

              <Input
                label="Paper Presentation PPT Upload Link"
                value={settings.pptUploadLink}
                onChange={(e) => setSettings({ ...settings, pptUploadLink: e.target.value })}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Project Expo Synopsis Upload Link"
                  value={settings.projectLink}
                  onChange={(e) => setSettings({ ...settings, projectLink: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="submit"
                variant="primary"
                isLoading={savingSettings}
                leftIcon={<Check className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Save Settings
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* 8. SUB-TAB 4: AI WHATSAPP ASSISTANT */}
      {activeSubTab === "assistant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          <div className="lg:col-span-8 space-y-4">
            <Card className={`p-5 rounded-2xl border flex flex-col h-[520px] ${isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-slate-800"}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    SPARKTRON AI WhatsApp Command Assistant
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">
                  Tool Invocation Safe
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {assistantMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : isLight
                          ? "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-xs"
                          : "bg-slate-800/80 text-slate-100 border border-slate-700/60 rounded-tl-xs"
                      }`}
                    >
                      {msg.text}

                      {/* If response contains a proposal requiring confirmation */}
                      {msg.proposal && (
                        <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700/60 flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedAudience(
                                msg.proposal.templateType === "QUIZ"
                                  ? "QUIZ"
                                  : msg.proposal.templateType === "PPT"
                                  ? "PPT"
                                  : "ALL"
                              );
                              setSelectedTemplate(msg.proposal.templateType || "CONFIRMATION");
                              setShowBulkModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-xs"
                          >
                            Review & Dispatch ({msg.proposal.recipientCount || 1})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {assistantLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs flex items-center gap-2">
                      <Bot className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Checking participant database and preparing proposal...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleAssistantSubmit} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Input
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="e.g. Send quiz link to everyone in Technical Quiz..."
                  className="text-xs"
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={assistantLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Ask
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <Card className={`p-4 rounded-2xl border space-y-3 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-slate-800"}`}>
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Quick Prompts to Try:
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  "Send the quiz link to everyone registered for Technical Quiz",
                  "Send PPT upload link to Paper Presentation teams",
                  "Send venue location to all registered participants",
                  "Send registration confirmation to Joseph",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAssistantInput(prompt);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-[11px] leading-snug flex items-center justify-between group ${
                      isLight
                        ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                        : "border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Bulk Dispatch Safety Modal */}
      {showBulkModal && (
        <BulkSendConfirmModal
          isOpen={showBulkModal}
          onClose={() => {
            setShowBulkModal(false);
            fetchMessages();
            fetchStatus();
          }}
          recipients={audienceRecipients}
          templateType={selectedTemplate}
          customMessage={customBodyText}
          sampleMessageText={samplePersonalizedText}
          onComplete={() => {
            fetchMessages();
            fetchStatus();
          }}
        />
      )}

      {/* Inspect Message Details Modal */}
      {inspectingMessage && (
        <Modal
          isOpen={!!inspectingMessage}
          onClose={() => setInspectingMessage(null)}
          title={`Message Audit — ${inspectingMessage.recipient_name}`}
          description={`Recipient: ${inspectingMessage.recipient_phone} • Status: ${inspectingMessage.status}`}
          maxWidth="md"
        >
          <div className="space-y-4 py-1 font-mono text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 whitespace-pre-wrap leading-relaxed">
              {inspectingMessage.message_content}
            </div>

            {inspectingMessage.error_message && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300">
                <p className="font-bold">Provider Error:</p>
                <p>{inspectingMessage.error_message}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setInspectingMessage(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
