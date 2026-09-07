"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Mail } from "lucide-react";

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
    <div
      className={`w-full rounded-2xl border overflow-hidden font-sans transition-all duration-200 ${
        isLight
          ? "bg-white border-slate-200 shadow-sm"
          : "bg-slate-900 border-slate-700/60 shadow-xl"
      }`}
    >
      {/* Email Client Window Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isLight ? "bg-slate-100/90 border-slate-200" : "bg-slate-950 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span
            className={`text-xs font-mono ml-2 font-bold flex items-center gap-1.5 ${
              isLight ? "text-slate-700" : "text-slate-300"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-cyan-500" />
            HTML Email Preview
          </span>
        </div>

        {/* View Mode Switcher */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-mono ${
            isLight
              ? "bg-slate-200/80 border-slate-300"
              : "bg-slate-900 border-slate-800"
          }`}
        >
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              deviceView === "desktop"
                ? "bg-cyan-600 text-white font-bold shadow-xs"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
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
                ? "bg-cyan-600 text-white font-bold shadow-xs"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Mobile
          </button>
        </div>
      </div>

      {/* Meta Bar: From, To, Subject */}
      <div
        className={`p-3.5 border-b text-xs font-mono space-y-1.5 ${
          isLight
            ? "bg-slate-50 border-slate-200"
            : "bg-slate-900/95 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 font-bold">From:</span>
            <span className={isLight ? "text-slate-900 font-bold" : "text-slate-200 font-bold"}>
              {senderName}
            </span>
            <span className={isLight ? "text-slate-500 text-[11px]" : "text-slate-400 text-[11px]"}>
              &lt;{senderEmail}&gt;
            </span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-medium ${
              isLight
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            Verified Transactional
          </span>
        </div>

        <div className="flex items-center gap-2 truncate">
          <span className="text-slate-500 font-bold">To:</span>
          <span className={isLight ? "text-slate-800 font-semibold" : "text-slate-200"}>
            {recipientName}
          </span>
          <span className={isLight ? "text-cyan-700 text-[11px]" : "text-cyan-400 text-[11px]"}>
            &lt;{recipientEmail}&gt;
          </span>
        </div>

        <div className={`flex items-start gap-2 pt-1 border-t ${isLight ? "border-slate-200" : "border-slate-800/80"}`}>
          <span className="text-slate-500 font-bold shrink-0">Subject:</span>
          <span className={`break-words font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
            {subject || "(No Subject)"}
          </span>
        </div>
      </div>

      {/* Responsive Preview Canvas */}
      <div
        className={`p-4 overflow-y-auto max-h-[520px] flex justify-center ${
          isLight ? "bg-slate-100/70" : "bg-slate-950/70"
        }`}
        style={{
          transition: "max-width 0.3s ease",
        }}
      >
        <div
          className={`w-full transition-all duration-300 ${
            deviceView === "mobile"
              ? isLight
                ? "max-w-[360px] border-4 border-slate-300 rounded-3xl p-2 bg-white shadow-md overflow-hidden"
                : "max-w-[360px] border-4 border-slate-700 rounded-3xl p-2 bg-black shadow-2xl overflow-hidden"
              : "max-w-[620px]"
          }`}
        >
          {deviceView === "mobile" && (
            <div className="w-16 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-2" />
          )}

          <div
            className="w-full bg-white rounded-xl shadow-xs overflow-hidden"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
}
