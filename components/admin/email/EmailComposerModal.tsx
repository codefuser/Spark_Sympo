"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmailRecipientInfo, EmailSettings, EmailTemplateType } from "@/types/email";
import {
  EMAIL_TEMPLATE_DEFINITIONS,
  EMAIL_AVAILABLE_VARIABLES,
  interpolateVariables,
  generateHtmlEmail,
} from "@/lib/email/templateEngine";
import { generateMailtoLink } from "@/lib/email/emailClient";
import { EmailPreviewCard } from "./EmailPreviewCard";
import { BulkEmailConfirmModal } from "./BulkEmailConfirmModal";
import {
  Send,
  Eye,
  Edit3,
  Mail,
  Sparkles,
  Ticket,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: EmailRecipientInfo[];
  settings: EmailSettings;
  defaultTemplate?: EmailTemplateType;
  isLight?: boolean;
  onSentSuccess?: () => void;
}

export function EmailComposerModal({
  isOpen,
  onClose,
  recipients,
  settings,
  defaultTemplate = "CONFIRMATION",
  isLight = false,
  onSentSuccess,
}: EmailComposerModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(defaultTemplate);
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    const tmpl = EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setSubject(tmpl.defaultSubject);
      setMessageText(tmpl.plainText);
    }
  }, [selectedTemplate]);

  const primaryRecipient: EmailRecipientInfo | undefined = recipients[0];
  const isMultiple = recipients.length > 1;

  const sampleRecipient = primaryRecipient || {
    participantId: "sample",
    registrationId: "sample-reg",
    registrationCode: "SPK-2K26-PASS",
    name: "Participant",
    email: "participant@example.com",
    college: "Engineering College",
    department: "ECE",
    paymentStatus: "PAID",
    foodPreference: "Veg",
    technicalEventTitle: "Technical Quiz",
    nonTechnicalEventTitle: "Rythemania",
  };

  const personalizedSubject = interpolateVariables(subject, sampleRecipient, settings);
  const personalizedText = interpolateVariables(messageText, sampleRecipient, settings);
  const personalizedHtml = generateHtmlEmail({
    recipient: sampleRecipient,
    settings,
    subject: personalizedSubject,
    contentBodyText: personalizedText,
  });

  const handleInsertVariable = (tag: string) => {
    setMessageText((prev) => `${prev} ${tag} `);
  };

  const handleSend = async () => {
    setErrorStatus(null);
    setSuccessStatus(null);

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
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientsData: [primaryRecipient],
          templateType: selectedTemplate,
          customSubject: subject,
          customMessage: messageText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to dispatch email");
      }

      const result = data.results?.[0];
      if (result && result.status === "Sent") {
        setSuccessStatus(`Email successfully sent to ${primaryRecipient.name} (${primaryRecipient.email})!`);
        if (onSentSuccess) onSentSuccess();
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        setErrorStatus(result?.error || "Dispatch failed on provider. Email logged as Failed.");
      }
    } catch (err: any) {
      setErrorStatus(err.message || "Error dispatching email");
    } finally {
      setIsSubmittingSingle(false);
    }
  };

  const directMailtoUrl = primaryRecipient
    ? generateMailtoLink(primaryRecipient.email, personalizedSubject, personalizedText)
    : "#";

  return (
    <>
      <Modal
        isOpen={isOpen && !showBulkModal}
        onClose={onClose}
        title={
          isMultiple
            ? `Compose Email Broadcast (${recipients.length} Participants)`
            : `Send Email — ${primaryRecipient?.name || "Participant"}`
        }
        description={
          isMultiple
            ? "Emails are personalized with each recipient's registration code and event tracks."
            : "Review recipient details, compose message, and preview HTML layout before sending."
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

                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{primaryRecipient.email}</span>
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

                <div className="col-span-2 truncate flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {primaryRecipient.technicalEventTitle || "Tech"} • {primaryRecipient.nonTechnicalEventTitle || "Non-Tech"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tabs: Compose vs Preview */}
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
                Compose Email
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
                HTML Email Preview
              </button>
            </div>

            <div className="w-56">
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as EmailTemplateType)}
                options={EMAIL_TEMPLATE_DEFINITIONS.map((t) => ({
                  label: t.label,
                  value: t.id,
                }))}
              />
            </div>
          </div>

          {/* COMPOSE VIEW */}
          {activeTab === "compose" && (
            <div className="space-y-3">
              {/* Subject Input */}
              <Input
                label="Email Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. SPARKTRON 2K26 Registration Confirmed - {{pass_code}}"
                className="text-xs"
                required
              />

              {/* Dynamic Variables Chips */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Insert Dynamic Variables:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {EMAIL_AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => handleInsertVariable(v.tag)}
                      title={v.description}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border transition-all ${
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
                  Email Message Body:
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write your email body here... use {{name}}, {{pass_code}}, {{events}}, etc."
                  rows={8}
                  className={`w-full p-3.5 rounded-xl border font-sans text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    isLight
                      ? "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600"
                  }`}
                />
              </div>
            </div>
          )}

          {/* PREVIEW VIEW */}
          {activeTab === "preview" && (
            <div className="py-2">
              <EmailPreviewCard
                senderName={settings.senderName}
                senderEmail={settings.senderEmail}
                recipientName={sampleRecipient.name}
                recipientEmail={sampleRecipient.email}
                subject={personalizedSubject}
                htmlContent={personalizedHtml}
                isLight={isLight}
              />
            </div>
          )}

          {/* Alerts */}
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
            {primaryRecipient && (
              <a
                href={directMailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isLight
                    ? "border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100"
                    : "border-slate-700 text-slate-300 bg-slate-800 hover:bg-slate-700"
                }`}
                title="Test sending using default desktop mail client"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Mail Client
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {isMultiple ? `Send Email to ${recipients.length} Participants` : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Safety Bulk Confirmation Modal */}
      {showBulkModal && (
        <BulkEmailConfirmModal
          isOpen={showBulkModal}
          onClose={() => {
            setShowBulkModal(false);
            onClose();
          }}
          recipients={recipients}
          templateType={selectedTemplate}
          customSubject={subject}
          customMessage={messageText}
          onComplete={() => {
            if (onSentSuccess) onSentSuccess();
          }}
        />
      )}
    </>
  );
}
