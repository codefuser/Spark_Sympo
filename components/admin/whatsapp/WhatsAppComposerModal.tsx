"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { RecipientInfo, WhatsAppSettings, WhatsAppTemplateType } from "@/types/whatsapp";
import {
  TEMPLATE_DEFINITIONS,
  AVAILABLE_VARIABLES,
  interpolateVariables,
} from "@/lib/whatsapp/templateEngine";
import { generateWaMeLink } from "@/lib/whatsapp/metaClient";
import { WhatsAppPreviewCard } from "./WhatsAppPreviewCard";
import { BulkSendConfirmModal } from "./BulkSendConfirmModal";
import {
  Send,
  Eye,
  Edit3,
  ExternalLink,
  Sparkles,
  Phone,
  Ticket,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface WhatsAppComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientInfo[];
  settings: WhatsAppSettings;
  defaultTemplate?: WhatsAppTemplateType;
  isLight?: boolean;
  onSentSuccess?: () => void;
}

export function WhatsAppComposerModal({
  isOpen,
  onClose,
  recipients,
  settings,
  defaultTemplate = "CONFIRMATION",
  isLight = false,
  onSentSuccess,
}: WhatsAppComposerModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateType>(defaultTemplate);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Sync initial template content
  useEffect(() => {
    const tmpl = TEMPLATE_DEFINITIONS.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setMessageText(tmpl.content);
    }
  }, [selectedTemplate]);

  // Handle single recipient or first recipient for preview
  const primaryRecipient: RecipientInfo | undefined = recipients[0];
  const isMultiple = recipients.length > 1;

  // Real-time personalized preview text
  const personalizedPreview = primaryRecipient
    ? interpolateVariables(messageText, primaryRecipient, settings)
    : messageText;

  // Insert variable tag at cursor position
  const handleInsertVariable = (tag: string) => {
    setMessageText((prev) => `${prev} ${tag} `);
  };

  const handleSend = async () => {
    setErrorStatus(null);
    setSuccessStatus(null);

    // If multiple recipients, delegate to BulkSendConfirmModal for safety & progress tracking
    if (isMultiple) {
      setShowBulkModal(true);
      return;
    }

    if (!primaryRecipient) {
      setErrorStatus("No recipient selected.");
      return;
    }

    setIsSubmittingSingle(true);

    try {
      const res = await fetch("/api/admin/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientsData: [primaryRecipient],
          templateType: selectedTemplate,
          customMessage: messageText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send WhatsApp message");
      }

      const result = data.results?.[0];
      if (result && result.status === "Sent") {
        setSuccessStatus(`Message successfully sent to ${primaryRecipient.name} (${primaryRecipient.phone})!`);
        if (onSentSuccess) onSentSuccess();
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        setErrorStatus(result?.error || "Dispatch failed on WhatsApp provider. Message recorded as Failed.");
      }
    } catch (err: any) {
      setErrorStatus(err.message || "Error sending WhatsApp message");
    } finally {
      setIsSubmittingSingle(false);
    }
  };

  // Direct WhatsApp Web link for manual fallback
  const directWaMeUrl = primaryRecipient
    ? generateWaMeLink(primaryRecipient.phone, personalizedPreview)
    : "#";

  return (
    <>
      <Modal
        isOpen={isOpen && !showBulkModal}
        onClose={onClose}
        title={
          isMultiple
            ? `Compose WhatsApp Broadcast (${recipients.length} Participants)`
            : `Send WhatsApp — ${primaryRecipient?.name || "Participant"}`
        }
        description={
          isMultiple
            ? "Messages are automatically personalized for every individual participant."
            : "Review participant details, customize the template, and preview before sending."
        }
        maxWidth="2xl"
      >
        <div className="space-y-4 py-1 font-mono text-xs">
          {/* Recipient Details Card */}
          {primaryRecipient && (
            <div
              className={`p-3.5 rounded-2xl border ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-900"
                  : "bg-slate-900/90 border-slate-800 text-slate-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-blue-600 dark:text-cyan-400">
                    {primaryRecipient.name}
                  </span>
                  {primaryRecipient.teamName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-400/40 bg-blue-500/10 text-blue-400">
                      Team: {primaryRecipient.teamName}
                    </span>
                  )}
                  {isMultiple && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                      +{recipients.length - 1} more selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{primaryRecipient.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1 truncate" title={primaryRecipient.college}>
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{primaryRecipient.college || "College N/A"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{primaryRecipient.registrationCode}</span>
                </div>

                <div className="col-span-2 truncate flex items-center gap-1" title={`${primaryRecipient.technicalEventTitle} | ${primaryRecipient.nonTechnicalEventTitle}`}>
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {primaryRecipient.technicalEventTitle || "Tech"} • {primaryRecipient.nonTechnicalEventTitle || "Non-Tech"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Switcher: Compose vs Preview */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("compose")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  activeTab === "compose"
                    ? "bg-blue-600 text-white"
                    : isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Compose Message
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  activeTab === "preview"
                    ? "bg-blue-600 text-white"
                    : isLight
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                WhatsApp Live Preview
              </button>
            </div>

            {/* Template Selector Dropdown */}
            <div className="w-56">
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as WhatsAppTemplateType)}
                options={TEMPLATE_DEFINITIONS.map((t) => ({
                  label: t.label,
                  value: t.id,
                }))}
              />
            </div>
          </div>

          {/* COMPOSE TAB */}
          {activeTab === "compose" && (
            <div className="space-y-3">
              {/* Dynamic Variable Chips */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Click Variable to Insert Dynamic Token:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => handleInsertVariable(v.tag)}
                      title={v.description}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border transition-all ${
                        isLight
                          ? "bg-white border-slate-300 text-blue-700 hover:bg-blue-50"
                          : "bg-slate-900 border-slate-700 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-500/50"
                      }`}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  Message Content:
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write your message here... use {{name}}, {{pass_code}}, {{events}}, etc."
                  rows={8}
                  className={`w-full p-3 rounded-xl border font-sans text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600"
                  }`}
                />
              </div>
            </div>
          )}

          {/* PREVIEW TAB */}
          {activeTab === "preview" && (
            <div className="py-2">
              <WhatsAppPreviewCard
                recipientName={primaryRecipient?.name}
                recipientPhone={primaryRecipient?.phone}
                messageContent={personalizedPreview}
                isLight={isLight}
              />
            </div>
          )}

          {/* Status Alerts */}
          {errorStatus && (
            <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          {successStatus && (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successStatus}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            {/* Direct WhatsApp Web Fallback */}
            {primaryRecipient && (
              <a
                href={directWaMeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isLight
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "border-emerald-800/80 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60"
                }`}
                title="Opens standard WhatsApp web/app with pre-filled message"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in WhatsApp Web
              </a>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleSend}
                isLoading={isSubmittingSingle}
                leftIcon={<Send className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {isMultiple ? `Send WhatsApp to ${recipients.length} Participants` : "Send WhatsApp"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Safety Confirmation Modal for Bulk Sends */}
      {showBulkModal && (
        <BulkSendConfirmModal
          isOpen={showBulkModal}
          onClose={() => {
            setShowBulkModal(false);
            onClose();
          }}
          recipients={recipients}
          templateType={selectedTemplate}
          customMessage={messageText}
          sampleMessageText={personalizedPreview}
          onComplete={() => {
            if (onSentSuccess) onSentSuccess();
          }}
        />
      )}
    </>
  );
}
