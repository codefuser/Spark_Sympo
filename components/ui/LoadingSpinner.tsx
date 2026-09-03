import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading circuit data...",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-3", className)}>
      <div className="relative">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        <div className="absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse-slow" />
      </div>
      {label && (
        <p className="text-xs font-mono text-secondary-foreground tracking-widest uppercase animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
