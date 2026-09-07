"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RecipientInfo, WhatsAppTemplateType } from "@/types/whatsapp";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Send,
  Users,
  ShieldAlert,
} from "lucide-react";

interface BulkSendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: RecipientInfo[];
  templateType: WhatsAppTemplateType;
  customMessage?: string;
  sampleMessageText: string;
  onComplete?: (result: { sent: number; failed: number }) => void;
}

export function BulkSendConfirmModal({
  isOpen,
  onClose,
  recipients,
  templateType,
  customMessage,
  sampleMessageText,
  onComplete,
}: BulkSendConfirmModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [failedList, setFailedList] = useState<Array<{ name: string; phone: string; error?: string }>>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  const total = recipients.length;

  const handleStartSend = async () => {
    setIsSending(true);
    setCurrentIndex(0);
    setSentCount(0);
    setFailedCount(0);
    setFailedList([]);

    // Call server send endpoint in controlled batches
    try {
      // We can send in chunks of 5 to show smooth real-time progress while keeping rate-limits safe
      const chunkSize = 5;
      let localSent = 0;
      let localFailed = 0;
      const localFailedItems: Array<{ name: string; phone: string; error?: string }> = [];

      for (let i = 0; i < recipients.length; i += chunkSize) {
        const chunk = recipients.slice(i, i + chunkSize);
        setCurrentIndex(Math.min(i + chunk.length, total));

        const res = await fetch("/api/admin/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientsData: chunk,
            templateType,
            customMessage,
          }),
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          data.results.forEach((r: any) => {
            if (r.status === "Sent") {
              localSent++;
            } else {
              localFailed++;
              localFailedItems.push({
                name: r.recipientName,
                phone: r.recipientPhone,
                error: r.error || "Sending failed",
              });
            }
          });
        } else {
          localFailed += chunk.length;
          chunk.forEach((c) => {
            localFailedItems.push({
              name: c.name,
              phone: c.phone,
              error: data.message || "Failed to reach WhatsApp service",
            });
          });
        }

        setSentCount(localSent);
        setFailedCount(localFailed);
        setFailedList([...localFailedItems]);

        // Rate-limit pause between chunks
        if (i + chunkSize < recipients.length) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      setCompleted(true);
      if (onComplete) {
        onComplete({ sent: localSent, failed: localFailed });
      }
    } catch (err: any) {
      console.error("Bulk sending failed:", err);
      setCompleted(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleRetryFailed = async () => {
    if (failedList.length === 0) return;
    setIsRetrying(true);

    const retryRecipients = recipients.filter((r) =>
      failedList.some((f) => f.phone === r.phone)
    );

    try {
      const res = await fetch("/api/admin/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientsData: retryRecipients,
          templateType,
          customMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSentCount((prev) => prev + (data.sentCount || 0));
        setFailedCount((prev) => Math.max(0, prev - (data.sentCount || 0)));
        // Remove successfully retried from failedList
        const remainingFailed = (data.results || [])
          .filter((r: any) => r.status !== "Sent")
          .map((r: any) => ({ name: r.recipientName, phone: r.recipientPhone, error: r.error }));
        setFailedList(remainingFailed);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  const progressPercentage = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSending) onClose();
      }}
      title={completed ? "Bulk Message Dispatch Summary" : "Confirm Bulk WhatsApp Dispatch"}
      description={
        completed
          ? "The messaging process has finished. Review results below."
          : "Safety confirmation before sending mass WhatsApp messages."
      }
      maxWidth="md"
    >
      <div className="space-y-4 py-2 font-mono text-xs">
        {!completed && !isSending && (
          <>
            {/* Warning Callout */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">
                  You are about to send this message to {total} participant{total === 1 ? "" : "s"}.
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-1 leading-relaxed">
                  Each participant will automatically receive their own personalized message addressed to their name, phone, registered events, and registration code.
                </p>
              </div>
            </div>

            {/* Recipient Roster Preview */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 max-h-36 overflow-y-auto space-y-1.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Target Recipients ({recipients.length})
              </p>
              {recipients.slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {r.name}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {r.phone} • {r.registrationCode}
                  </span>
                </div>
              ))}
              {recipients.length > 10 && (
                <p className="text-center text-[10px] text-slate-400 italic pt-1">
                  ...and {recipients.length - 10} more participants
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleStartSend}
                leftIcon={<Send className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Confirm & Send ({total})
              </Button>
            </div>
          </>
        )}

        {isSending && (
          <div className="py-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto animate-pulse">
              <Send className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Sending WhatsApp Messages...
              </h4>
              <p className="text-xs text-slate-500">
                Sending {currentIndex} / {total} messages via safe rate-limited queue
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-6 text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {sentCount} Sent
              </span>
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <XCircle className="w-4 h-4" /> {failedCount} Failed
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {Math.max(0, total - currentIndex)} Remaining
              </span>
            </div>
          </div>
        )}

        {completed && (
          <div className="space-y-4">
            {/* Completion Result Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <p className="text-lg font-extrabold">{sentCount}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold">Sent</p>
              </div>

              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300">
                <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                <p className="text-lg font-extrabold">{failedCount}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold">Failed</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300">
                <Clock className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-lg font-extrabold">0</p>
                <p className="text-[10px] uppercase tracking-wider font-bold">Pending</p>
              </div>
            </div>

            {failedList.length > 0 && (
              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 space-y-2 max-h-40 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 dark:text-rose-300 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Failed Messages ({failedList.length})
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleRetryFailed}
                    isLoading={isRetrying}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    className="text-xs h-7 border-rose-300 text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                  >
                    Retry Failed
                  </Button>
                </div>

                {failedList.map((item, idx) => (
                  <div key={idx} className="text-[11px] text-rose-700 dark:text-rose-300/90 border-t border-rose-100 dark:border-rose-900/40 pt-1 flex justify-between gap-2">
                    <span className="font-bold truncate">{item.name} ({item.phone})</span>
                    <span className="text-[10px] text-rose-500 truncate max-w-[160px]" title={item.error}>
                      {item.error}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="primary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
