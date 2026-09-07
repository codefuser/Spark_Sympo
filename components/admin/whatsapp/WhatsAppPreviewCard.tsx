"use client";

import React from "react";
import { CheckCheck, ExternalLink, MapPin } from "lucide-react";

interface WhatsAppPreviewCardProps {
  recipientName?: string;
  recipientPhone?: string;
  messageContent: string;
  isLight?: boolean;
}

export function WhatsAppPreviewCard({
  recipientName = "Participant",
  recipientPhone,
  messageContent,
  isLight = false,
}: WhatsAppPreviewCardProps) {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-700/60 font-sans">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#075E54] dark:bg-[#128C7E] px-4 py-3 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center font-bold text-sm shadow-xs">
            {recipientName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm leading-tight truncate flex items-center gap-1.5">
              {recipientName}
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block" />
            </h4>
            <p className="text-[11px] text-emerald-100/80 font-mono truncate">
              {recipientPhone ? `+${recipientPhone}` : "online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 font-mono bg-emerald-800/40 px-2 py-0.5 rounded-full border border-emerald-600/40">
          <span>SPARKTRON 2K26</span>
        </div>
      </div>

      {/* WhatsApp Chat Body Wallpaper */}
      <div
        className="p-4 min-h-[220px] max-h-[380px] overflow-y-auto space-y-2 text-xs"
        style={{
          backgroundColor: isLight ? "#EFEAE2" : "#0B141A",
          backgroundImage: isLight
            ? "radial-gradient(#d1d7db 1px, transparent 1px)"
            : "radial-gradient(#1e293b 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <div className="text-center my-1">
          <span
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md shadow-2xs ${
              isLight ? "bg-white/80 text-slate-600" : "bg-[#182229] text-slate-400"
            }`}
          >
            TODAY
          </span>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-end">
          <div
            className={`max-w-[88%] rounded-2xl rounded-tr-xs p-3 shadow-md space-y-1.5 text-slate-900 ${
              isLight ? "bg-[#DCF8C6]" : "bg-[#005C4B] text-slate-100"
            }`}
          >
            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed break-words">
              {messageContent || "No message content composed yet."}
            </div>

            <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-slate-500 dark:text-emerald-200/70 pt-0.5">
              <span>{currentTime}</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-500 dark:text-sky-300 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Footer Mock */}
      <div
        className={`px-3 py-2 text-[11px] font-mono flex items-center justify-between border-t ${
          isLight
            ? "bg-[#F0F2F5] border-slate-200 text-slate-500"
            : "bg-[#202C33] border-slate-800 text-slate-400"
        }`}
      >
        <span className="flex items-center gap-1">
          🔒 End-to-end encrypted preview
        </span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
          Meta Cloud API Ready
        </span>
      </div>
    </div>
  );
}
