"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Mail, CheckCircle2, MapPin } from "lucide-react";

interface EmailPreviewCardProps {
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  subject: string;
  htmlContent: string;
  isLight?: boolean;
}

export function EmailPreviewCard({
  senderName = "SPARKTRON 2K26",
  senderEmail = "onboarding@resend.dev",
  recipientName = "Participant",
  recipientEmail = "participant@example.com",
  subject,
  htmlContent,
  isLight = false,
}: EmailPreviewCardProps) {
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="w-full rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl bg-slate-900 font-sans">
      {/* Email Client Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2 font-bold flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            HTML Email Preview
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              deviceView === "desktop"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3 h-3" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              deviceView === "mobile"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Mobile
          </button>
        </div>
      </div>

      {/* Meta Bar: From, To, Subject */}
      <div className="p-3.5 bg-slate-900/95 border-b border-slate-800 text-xs font-mono space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 font-bold">From:</span>
            <span className="text-slate-200 font-bold">{senderName}</span>
            <span className="text-slate-400 text-[11px]">&lt;{senderEmail}&gt;</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
            Verified Transactional
          </span>
        </div>

        <div className="flex items-center gap-2 truncate">
          <span className="text-slate-500 font-bold">To:</span>
          <span className="text-slate-200">{recipientName}</span>
          <span className="text-cyan-400 text-[11px]">&lt;{recipientEmail}&gt;</span>
        </div>

        <div className="flex items-start gap-2 pt-0.5 border-t border-slate-800/80">
          <span className="text-slate-500 font-bold">Subject:</span>
          <span className="text-white font-extrabold break-words">{subject || "(No Subject)"}</span>
        </div>
      </div>

      {/* Responsive Preview Canvas */}
      <div
        className="p-4 bg-slate-950/70 overflow-y-auto max-h-[500px] flex justify-center"
        style={{
          backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === "mobile"
              ? "max-w-[360px] border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
              : "max-w-[620px]"
          }`}
        >
          {/* Render Raw HTML in sandboxed iframe or securely container */}
          <iframe
            srcDoc={htmlContent}
            title="Email Preview"
            className="w-full min-h-[550px] border-0 bg-white rounded-xl shadow-md"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
