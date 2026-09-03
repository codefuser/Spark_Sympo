"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl shadow-black/90 text-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden",
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800/60 z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {(title || description) && (
          <div className="p-6 pb-4 border-b border-slate-800/80 pr-12 bg-slate-900/30">
            {title && (
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  );
}
