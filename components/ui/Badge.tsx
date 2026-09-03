import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "cyan" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
}: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/30",
    cyan: "bg-cyan/10 text-cyan border-cyan/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    neutral: "bg-slate-800/60 text-slate-300 border-slate-700",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs tracking-wider",
    md: "px-3 py-1 text-xs tracking-wider uppercase font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono rounded-full border shadow-sm transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
